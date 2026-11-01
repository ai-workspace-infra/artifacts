#!/usr/bin/env python3
"""Publish and verify one immutable component candidate."""

from __future__ import annotations

import base64
import json
import os
import re
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path


def assert_candidate_id(value: str) -> None:
    if not re.fullmatch(r"daily-build-\d{4}\.\d{2}\.\d{2}-r[1-9]\d*", value):
        raise ValueError(f"candidate_id is not an immutable UAT daily identifier: {value}")


def parse_component(text: str) -> dict:
    component = json.loads(text)
    if not isinstance(component, dict):
        raise ValueError("component_json must be an object")
    for key in ("name", "required", "resolved_source_sha", "source", "artifact"):
        if key not in component:
            raise ValueError(f"component_json is missing {key}")
    for key in ("repository", "workflow", "trigger", "dispatch_if_missing", "dispatch_inputs"):
        if key not in component["source"]:
            raise ValueError(f"component_json.source is missing {key}")
    if not re.fullmatch(r"[a-z0-9-]+/[A-Za-z0-9._-]+", component["source"]["repository"]):
        raise ValueError("component source repository is invalid")
    if not re.fullmatch(r"[A-Za-z0-9._-]+\.ya?ml", component["source"]["workflow"]):
        raise ValueError("component source workflow must be a workflow file name")
    if not re.fullmatch(r"[0-9a-f]{40}", component["resolved_source_sha"]):
        raise ValueError("component resolved_source_sha must be a full commit SHA")
    if component["source"]["trigger"] != "tag":
        raise ValueError("only immutable tag-triggered builds are supported")
    if component["artifact"]["kind"] not in {"oci-image", "github-release"}:
        raise ValueError("component artifact kind is unsupported")
    return component


def required(name: str) -> str:
    value = os.environ.get(name, "").strip()
    if not value:
        raise RuntimeError(f"{name} is required")
    return value


def github(
    path: str,
    token: str,
    method: str = "GET",
    body: dict | None = None,
    allow_not_found: bool = False,
) -> dict | None:
    data = None if body is None else json.dumps(body).encode()
    request = urllib.request.Request(
        f"{os.environ.get('GITHUB_API_URL', 'https://api.github.com')}{path}",
        data=data,
        method=method,
        headers={
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {token}",
            "X-GitHub-Api-Version": "2022-11-28",
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            payload = response.read()
            return None if not payload else json.loads(payload)
    except urllib.error.HTTPError as error:
        if allow_not_found and error.code == 404:
            return None
        raise RuntimeError(f"GitHub API {method} {path} failed ({error.code})") from error


def ensure_tag(repository: str, tag: str, source_sha: str, token: str) -> str:
    encoded = urllib.parse.quote(tag, safe="")
    existing = github(f"/repos/{repository}/git/ref/tags/{encoded}", token, allow_not_found=True)
    if existing:
        if existing["object"]["sha"] != source_sha:
            raise RuntimeError(f"{repository} tag {tag} already points to a different SHA")
        return "existing"
    github(
        f"/repos/{repository}/git/refs",
        token,
        "POST",
        {"ref": f"refs/tags/{tag}", "sha": source_sha},
    )
    return "created"


def matching_run(repository: str, workflow: str, tag: str, source_sha: str, token: str):
    route = (
        f"/repos/{repository}/actions/workflows/{urllib.parse.quote(workflow, safe='')}/runs"
        f"?branch={urllib.parse.quote(tag, safe='')}&per_page=30"
    )
    runs = github(route, token)["workflow_runs"]
    matches = [run for run in runs if run["head_branch"] == tag and run["head_sha"] == source_sha]
    return max(matches, key=lambda run: run["id"], default=None)


def wait_for_owner_run(component: dict, candidate: str, source_sha: str, token: str, timeout: int):
    source = component["source"]
    started = time.time()
    dispatched = False
    while time.time() - started < timeout:
        run = matching_run(source["repository"], source["workflow"], candidate, source_sha, token)
        if run:
            if run["status"] != "completed":
                time.sleep(10)
                continue
            if run["conclusion"] != "success":
                raise RuntimeError(f"owner run {run['html_url']} completed with {run['conclusion']}")
            return run
        if source["dispatch_if_missing"] and not dispatched and time.time() - started >= 20:
            github(
                f"/repos/{source['repository']}/actions/workflows/"
                f"{urllib.parse.quote(source['workflow'], safe='')}/dispatches",
                token,
                "POST",
                {"ref": candidate, "inputs": source["dispatch_inputs"]},
            )
            dispatched = True
        time.sleep(5)
    raise RuntimeError(
        f"timed out waiting for {source['repository']}/{source['workflow']} at {candidate}"
    )


def verify_oci(component: dict, candidate: str, username: str, token: str) -> tuple[str, list]:
    if not username or not token:
        raise RuntimeError("registry credentials are required for OCI artifact verification")
    image_path = re.sub(r"^ghcr\.io/", "", component["artifact"]["reference"])
    basic = base64.b64encode(f"{username}:{token}".encode()).decode()
    probe = urllib.request.Request(
        f"https://ghcr.io/v2/{image_path}/manifests/_candidate_probe_",
        headers={"Authorization": f"Basic {basic}"},
    )
    try:
        urllib.request.urlopen(probe, timeout=30).close()
        challenge = ""
    except urllib.error.HTTPError as error:
        challenge = error.headers.get("www-authenticate", "")
    realm_match = re.search(r'realm="([^"]+)"', challenge)
    service_match = re.search(r'service="([^"]+)"', challenge)
    realm = realm_match.group(1) if realm_match else "https://ghcr.io/token"
    service = service_match.group(1) if service_match else "ghcr.io"
    query = urllib.parse.urlencode(
        {"service": service, "scope": f"repository:{image_path}:pull"}
    )
    auth_request = urllib.request.Request(
        f"{realm}?{query}", headers={"Authorization": f"Basic {basic}"}
    )
    with urllib.request.urlopen(auth_request, timeout=30) as response:
        document = json.load(response)
    bearer = document.get("token") or document.get("access_token")
    if not bearer:
        raise RuntimeError("GHCR token response did not contain an access token")
    manifest_request = urllib.request.Request(
        f"https://ghcr.io/v2/{image_path}/manifests/{urllib.parse.quote(candidate, safe='')}",
        headers={
            "Authorization": f"Bearer {bearer}",
            "Accept": ", ".join(
                (
                    "application/vnd.oci.image.index.v1+json",
                    "application/vnd.oci.image.manifest.v1+json",
                    "application/vnd.docker.distribution.manifest.list.v2+json",
                    "application/vnd.docker.distribution.manifest.v2+json",
                )
            ),
        },
    )
    with urllib.request.urlopen(manifest_request, timeout=30) as response:
        digest = response.headers.get("docker-content-digest", "")
    if not re.fullmatch(r"sha256:[0-9a-f]{64}", digest):
        raise RuntimeError("OCI registry did not return a valid digest")
    return digest, []


def verify_release(component: dict, candidate: str, token: str) -> tuple[str, list]:
    repository = component["source"]["repository"]
    release = github(
        f"/repos/{repository}/releases/tags/{urllib.parse.quote(candidate, safe='')}", token
    )
    names = {asset["name"] for asset in release["assets"]}
    required_assets = component["artifact"].get("required_assets", [])
    missing = sorted(set(required_assets) - names)
    if missing:
        raise RuntimeError(f"release assets missing: {', '.join(missing)}")
    return "", required_assets


def output(name: str, value: object) -> None:
    with open(required("GITHUB_OUTPUT"), "a", encoding="utf-8") as stream:
        stream.write(f"{name}={value}\n")


def main() -> None:
    component = parse_component(required("COMPONENT_JSON"))
    candidate = required("CANDIDATE_ID")
    source_ref = os.environ.get("SOURCE_REF", "main")
    owner_sha = required("ARTIFACTS_OWNER_SHA")
    timeout = int(os.environ.get("OWNER_RUN_TIMEOUT_SECONDS", "1800"))
    assert_candidate_id(candidate)
    if not re.fullmatch(r"[0-9a-f]{40}", owner_sha):
        raise RuntimeError("Artifacts owner SHA must be a full commit SHA")
    if timeout < 60 or timeout > 7200:
        raise RuntimeError("timeout must be between 60 and 7200 seconds")

    token = required("GITHUB_TOKEN_INPUT")
    source_sha = component["resolved_source_sha"]
    tag_state = ensure_tag(component["source"]["repository"], candidate, source_sha, token)
    run = wait_for_owner_run(component, candidate, source_sha, token, timeout)
    if component["artifact"]["kind"] == "oci-image":
        digest, assets = verify_oci(
            component,
            candidate,
            os.environ.get("REGISTRY_USERNAME", ""),
            os.environ.get("REGISTRY_TOKEN", ""),
        )
    else:
        digest, assets = verify_release(component, candidate, token)

    receipt = {
        "schema_version": 1,
        "status": "build_succeeded",
        "candidate_id": candidate,
        "component": component["name"],
        "required": component["required"],
        "owner_repository": "ai-workspace-infra/artifacts",
        "owner_sha": owner_sha,
        "source_repository": component["source"]["repository"],
        "source_ref": source_ref,
        "source_sha": source_sha,
        "tag_state": tag_state,
        "build_workflow": component["source"]["workflow"],
        "build_run_id": str(run["id"]),
        "build_run_attempt": str(run["run_attempt"]),
        "build_run_url": run["html_url"],
        "artifact_kind": component["artifact"]["kind"],
        "artifact_reference": component["artifact"].get("reference", ""),
        "artifact_digest": digest,
        "artifact_assets": assets,
    }
    directory = Path(tempfile.mkdtemp(prefix="component-candidate-", dir=required("RUNNER_TEMP")))
    receipt_path = directory / f"{component['name']}.json"
    receipt_path.write_text(f"{json.dumps(receipt, sort_keys=True)}\n", encoding="utf-8")
    receipt_path.chmod(0o600)
    output("receipt_path", receipt_path)
    output("source_sha", source_sha)
    output("artifact_digest", digest)
    output("run_id", run["id"])
    output("run_attempt", run["run_attempt"])
    print(f"Verified {component['name']} candidate {candidate} from owner run {run['html_url']}")


if __name__ == "__main__":
    try:
        main()
    except Exception as error:  # noqa: BLE001
        print(f"::error::{error}")
        raise SystemExit(1) from error
