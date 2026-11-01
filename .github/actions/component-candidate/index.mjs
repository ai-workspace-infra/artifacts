import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const API = process.env.GITHUB_API_URL || "https://api.github.com";
const ACCEPT = "application/vnd.github+json";

export function assertCandidateId(value) {
  if (!/^daily-build-\d{4}\.\d{2}\.\d{2}-r[1-9]\d*$/.test(value)) {
    throw new Error(`candidate_id is not an immutable UAT daily identifier: ${value}`);
  }
}

export function parseComponent(text) {
  const component = JSON.parse(text);
  if (!component || typeof component !== "object") throw new Error("component_json must be an object");
  for (const key of ["name", "required", "resolved_source_sha", "source", "artifact"]) {
    if (!(key in component)) throw new Error(`component_json is missing ${key}`);
  }
  for (const key of ["repository", "workflow", "trigger", "dispatch_if_missing", "dispatch_inputs"]) {
    if (!(key in component.source)) throw new Error(`component_json.source is missing ${key}`);
  }
  if (!/^[a-z0-9-]+\/[A-Za-z0-9._-]+$/.test(component.source.repository)) {
    throw new Error("component source repository is invalid");
  }
  if (!/^[A-Za-z0-9._-]+\.ya?ml$/.test(component.source.workflow)) {
    throw new Error("component source workflow must be a workflow file name");
  }
  if (!/^[0-9a-f]{40}$/.test(component.resolved_source_sha)) {
    throw new Error("component resolved_source_sha must be a full commit SHA");
  }
  if (component.source.trigger !== "tag") throw new Error("only immutable tag-triggered builds are supported");
  if (!["oci-image", "github-release"].includes(component.artifact.kind)) {
    throw new Error("component artifact kind is unsupported");
  }
  return component;
}

function base64url(value) {
  return Buffer.from(value).toString("base64url");
}

function appJwt(clientId, privateKey) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64url(JSON.stringify({ iat: now - 60, exp: now + 540, iss: clientId }));
  const unsigned = `${header}.${payload}`;
  const signature = crypto.sign("RSA-SHA256", Buffer.from(unsigned), privateKey).toString("base64url");
  return `${unsigned}.${signature}`;
}

async function github(pathname, { token, method = "GET", body, allow404 = false } = {}) {
  const response = await fetch(`${API}${pathname}`, {
    method,
    headers: {
      Accept: ACCEPT,
      "X-GitHub-Api-Version": "2022-11-28",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (allow404 && response.status === 404) return null;
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 500);
    throw new Error(`GitHub API ${method} ${pathname} failed (${response.status}): ${detail}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

async function repositoryToken(repository, clientId, privateKey) {
  const jwt = appJwt(clientId, privateKey);
  const installation = await github(`/repos/${repository}/installation`, { token: jwt });
  const name = repository.split("/")[1];
  const created = await github(`/app/installations/${installation.id}/access_tokens`, {
    token: jwt,
    method: "POST",
    body: {
      repositories: [name],
      permissions: { actions: "write", contents: "write" },
    },
  });
  return created.token;
}

async function ensureTag(repository, tag, sourceSha, token) {
  const encoded = encodeURIComponent(tag);
  const existing = await github(`/repos/${repository}/git/ref/tags/${encoded}`, { token, allow404: true });
  if (existing) {
    if (existing.object?.sha !== sourceSha) {
      throw new Error(`${repository} tag ${tag} already points to a different SHA`);
    }
    return "existing";
  }
  await github(`/repos/${repository}/git/refs`, {
    token,
    method: "POST",
    body: { ref: `refs/tags/${tag}`, sha: sourceSha },
  });
  return "created";
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function matchingRun(repository, workflow, tag, sourceSha, token) {
  const data = await github(
    `/repos/${repository}/actions/workflows/${encodeURIComponent(workflow)}/runs?branch=${encodeURIComponent(tag)}&per_page=30`,
    { token },
  );
  return data.workflow_runs
    .filter((run) => run.head_branch === tag && run.head_sha === sourceSha)
    .sort((left, right) => right.id - left.id)[0] || null;
}

async function waitForOwnerRun(component, candidateId, sourceSha, token, timeoutSeconds) {
  const { repository, workflow, dispatch_if_missing: fallback, dispatch_inputs: inputs } = component.source;
  const started = Date.now();
  let dispatched = false;
  while ((Date.now() - started) / 1000 < timeoutSeconds) {
    const run = await matchingRun(repository, workflow, candidateId, sourceSha, token);
    if (run) {
      if (run.status !== "completed") {
        await sleep(10000);
        continue;
      }
      if (run.conclusion !== "success") {
        throw new Error(`owner run ${run.html_url} completed with ${run.conclusion}`);
      }
      return run;
    }
    if (fallback && !dispatched && (Date.now() - started) / 1000 >= 20) {
      await github(`/repos/${repository}/actions/workflows/${encodeURIComponent(workflow)}/dispatches`, {
        token,
        method: "POST",
        body: { ref: candidateId, inputs },
      });
      dispatched = true;
    }
    await sleep(5000);
  }
  throw new Error(`timed out waiting for ${repository}/${workflow} at ${candidateId}`);
}

async function registryBearer(reference, username, token) {
  const imagePath = reference.replace(/^ghcr\.io\//, "");
  const challengeResponse = await fetch(`https://ghcr.io/v2/${imagePath}/manifests/_candidate_probe_`, {
    headers: { Authorization: `Basic ${Buffer.from(`${username}:${token}`).toString("base64")}` },
  });
  const challenge = challengeResponse.headers.get("www-authenticate") || "";
  const realm = challenge.match(/realm="([^"]+)"/)?.[1] || "https://ghcr.io/token";
  const service = challenge.match(/service="([^"]+)"/)?.[1] || "ghcr.io";
  const scope = `repository:${imagePath}:pull`;
  const response = await fetch(`${realm}?service=${encodeURIComponent(service)}&scope=${encodeURIComponent(scope)}`, {
    headers: { Authorization: `Basic ${Buffer.from(`${username}:${token}`).toString("base64")}` },
  });
  if (!response.ok) throw new Error(`GHCR token request failed (${response.status})`);
  const document = await response.json();
  return { bearer: document.token || document.access_token, imagePath };
}

async function verifyOciArtifact(component, candidateId, username, token) {
  if (!username || !token) throw new Error("registry credentials are required for OCI artifact verification");
  const { bearer, imagePath } = await registryBearer(component.artifact.reference, username, token);
  const response = await fetch(`https://ghcr.io/v2/${imagePath}/manifests/${encodeURIComponent(candidateId)}`, {
    headers: {
      Authorization: `Bearer ${bearer}`,
      Accept: [
        "application/vnd.oci.image.index.v1+json",
        "application/vnd.oci.image.manifest.v1+json",
        "application/vnd.docker.distribution.manifest.list.v2+json",
        "application/vnd.docker.distribution.manifest.v2+json",
      ].join(", "),
    },
  });
  if (!response.ok) throw new Error(`OCI artifact ${component.artifact.reference}:${candidateId} is unavailable (${response.status})`);
  const digest = response.headers.get("docker-content-digest") || "";
  if (!/^sha256:[0-9a-f]{64}$/.test(digest)) throw new Error("OCI registry did not return a valid digest");
  return { digest, assets: [] };
}

async function verifyReleaseArtifact(component, candidateId, token) {
  const release = await github(`/repos/${component.source.repository}/releases/tags/${encodeURIComponent(candidateId)}`, { token });
  const names = new Set(release.assets.map((asset) => asset.name));
  const required = component.artifact.required_assets || [];
  const missing = required.filter((name) => !names.has(name));
  if (missing.length) throw new Error(`release assets missing: ${missing.join(", ")}`);
  return { digest: "", assets: required };
}

function writeOutput(name, value) {
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${String(value).replaceAll("\n", "%0A")}\n`);
}

async function main() {
  const component = parseComponent(process.env.COMPONENT_JSON || "");
  const candidateId = process.env.CANDIDATE_ID || "";
  const sourceRef = process.env.SOURCE_REF || "main";
  const ownerSha = process.env.ARTIFACTS_OWNER_SHA || "";
  const timeout = Number.parseInt(process.env.OWNER_RUN_TIMEOUT_SECONDS || "1800", 10);
  assertCandidateId(candidateId);
  if (!/^[0-9a-f]{40}$/.test(ownerSha)) throw new Error("Artifacts owner SHA must be a full commit SHA");
  if (!Number.isInteger(timeout) || timeout < 60 || timeout > 7200) throw new Error("timeout must be between 60 and 7200 seconds");

  const token = await repositoryToken(
    component.source.repository,
    process.env.GITHUB_APP_CLIENT_ID || "",
    process.env.GITHUB_APP_PRIVATE_KEY || "",
  );
  const sourceSha = component.resolved_source_sha;
  const tagState = await ensureTag(component.source.repository, candidateId, sourceSha, token);
  const run = await waitForOwnerRun(component, candidateId, sourceSha, token, timeout);
  const verified = component.artifact.kind === "oci-image"
    ? await verifyOciArtifact(component, candidateId, process.env.REGISTRY_USERNAME || "", process.env.REGISTRY_TOKEN || "")
    : await verifyReleaseArtifact(component, candidateId, token);

  const receipt = {
    schema_version: 1,
    status: "build_succeeded",
    candidate_id: candidateId,
    component: component.name,
    required: component.required,
    owner_repository: "ai-workspace-infra/artifacts",
    owner_sha: ownerSha,
    source_repository: component.source.repository,
    source_ref: sourceRef,
    source_sha: sourceSha,
    tag_state: tagState,
    build_workflow: component.source.workflow,
    build_run_id: String(run.id),
    build_run_attempt: String(run.run_attempt),
    build_run_url: run.html_url,
    artifact_kind: component.artifact.kind,
    artifact_reference: component.artifact.reference || "",
    artifact_digest: verified.digest,
    artifact_assets: verified.assets,
  };
  const directory = fs.mkdtempSync(path.join(process.env.RUNNER_TEMP, "component-candidate-"));
  const receiptPath = path.join(directory, `${component.name}.json`);
  fs.writeFileSync(receiptPath, `${JSON.stringify(receipt)}\n`, { mode: 0o600 });
  writeOutput("receipt_path", receiptPath);
  writeOutput("source_sha", sourceSha);
  writeOutput("artifact_digest", verified.digest);
  writeOutput("run_id", run.id);
  writeOutput("run_attempt", run.run_attempt);
  console.log(`Verified ${component.name} candidate ${candidateId} from owner run ${run.html_url}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(`::error::${error.message}`);
    process.exitCode = 1;
  });
}

