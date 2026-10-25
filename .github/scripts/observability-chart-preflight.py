#!/usr/bin/env python3
"""Inspect a local GitOps declaration graph; never contact or mutate a cluster."""
import argparse
import json
from pathlib import Path

import yaml


class InvalidGraph(ValueError):
    pass


def inspect(root, entrypoints, source_names):
    root = Path(root).resolve()
    seen, documents, unresolved = set(), [], []

    def bounded(path):
        path = path.resolve()
        if not path.is_relative_to(root):
            raise InvalidGraph("declaration path escapes the selected GitOps root")
        return path

    def visit(path, namespace=""):
        path = bounded(path)
        if path.is_dir():
            candidates = [path / n for n in ("kustomization.yaml", "kustomization.yml", "Kustomization")]
            path = next((p for p in candidates if p.is_file()), candidates[0])
        key = (path, namespace)
        if key in seen:
            return
        seen.add(key)
        if not path.is_file():
            unresolved.append({"path": str(path.relative_to(root)), "reason": "missing declaration"})
            return
        for doc in yaml.safe_load_all(path.read_text()):
            if not isinstance(doc, dict):
                continue
            api, kind = doc.get("apiVersion", ""), doc.get("kind", "")
            if kind == "Kustomization" and api.startswith("kustomize.config.k8s.io/"):
                inherited = doc.get("namespace", namespace)
                if any(doc.get(k) for k in ("patches", "patchesStrategicMerge", "patchesJson6902", "replacements", "transformers", "helmCharts")):
                    unresolved.append({"path": str(path.relative_to(root)), "reason": "render-time modifiers require rendered-graph review"})
                for item in [*doc.get("resources", []), *doc.get("bases", []), *doc.get("components", [])]:
                    if not isinstance(item, str) or "://" in item or "?ref=" in item:
                        unresolved.append({"path": str(path.relative_to(root)), "reason": "remote/unsupported resource"})
                    else:
                        visit(path.parent / item, inherited)
                continue
            meta = doc.get("metadata", {})
            effective_namespace = namespace or meta.get("namespace", "")
            documents.append((str(path.relative_to(root)), effective_namespace, doc))
            if kind == "Kustomization" and api.startswith("kustomize.toolkit.fluxcd.io/"):
                spec = doc.get("spec", {})
                ref = spec.get("sourceRef", {})
                if ref.get("kind") != "GitRepository" or ref.get("name") not in source_names:
                    unresolved.append({"path": str(path.relative_to(root)), "reason": "unselected Flux source"})
                elif not isinstance(spec.get("path"), str):
                    unresolved.append({"path": str(path.relative_to(root)), "reason": "missing Flux path"})
                else:
                    visit(root / spec["path"], spec.get("targetNamespace", ""))

    for entry in entrypoints:
        visit(root / entry)
    sources = {}
    for path, namespace, doc in documents:
        if doc.get("kind") == "OCIRepository":
            sources[(namespace, doc.get("metadata", {}).get("name"))] = (path, doc.get("spec", {}))
    selected_sources = []
    for path, namespace, doc in documents:
        if doc.get("kind") == "GitRepository" and doc.get("metadata", {}).get("name") in source_names:
            selected_sources.append({"name": doc["metadata"]["name"], "path": path,
                                     "ref": doc.get("spec", {}).get("ref", {}),
                                     "interval": doc.get("spec", {}).get("interval")})
    legacy, canonical = [], []
    for path, namespace, doc in documents:
        if doc.get("kind") != "HelmRelease":
            continue
        spec, meta = doc.get("spec", {}), doc.get("metadata", {})
        chart_ref = spec.get("chartRef", {})
        chart_spec = spec.get("chart", {}).get("spec", {})
        if chart_ref.get("kind") == "OCIRepository":
            source = sources.get((chart_ref.get("namespace", namespace), chart_ref.get("name")))
            if source is None:
                unresolved.append({"path": path, "reason": "unresolved HelmRelease OCI source"})
                continue
            source_path, source_spec = source
            name = source_spec.get("url", "").rstrip("/").rsplit("/", 1)[-1]
            version = source_spec.get("ref", {})
        else:
            name = chart_spec.get("chart", "")
            version = {"version": chart_spec.get("version", "")}
            source_path = path
        if name not in {"observability", "observability-agent", "observability-stack"}:
            continue
        record = {"release": meta.get("name"), "namespace": namespace,
                  "path": path, "source_path": source_path, "chart": name, "ref": version}
        (legacy if name == "observability" else canonical).append(record)
    return {"schema_version": "observability-chart-declaration-preflight/v1",
            "entrypoints": entrypoints, "selected_source_refs": selected_sources, "legacy_callers": legacy, "canonical_callers": canonical,
            "unresolved": unresolved, "assertion": "no_reachable_legacy_declaration_callers",
            "assertion_status": "FAIL" if legacy or unresolved else "PASS",
            "runtime_migration_acceptance": "NOT_RUN"}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--gitops-root", required=True)
    parser.add_argument("--entrypoint", action="append", required=True,
                        help="Repository-relative Kustomize directory; repeat to inspect multiple roots")
    parser.add_argument("--source-name", action="append", required=True,
                        help="Explicit local GitRepository source name to follow")
    parser.add_argument("--assert-no-legacy-callers", action="store_true")
    args = parser.parse_args()
    try:
        report = inspect(args.gitops_root, args.entrypoint, set(args.source_name))
    except (InvalidGraph, OSError, yaml.YAMLError) as error:
        print(json.dumps({"assertion_status": "FAIL", "error": str(error),
                          "runtime_migration_acceptance": "NOT_RUN"}, sort_keys=True))
        return 2
    print(json.dumps(report, indent=2, sort_keys=True))
    return 1 if args.assert_no_legacy_callers and report["assertion_status"] != "PASS" else 0


if __name__ == "__main__":
    raise SystemExit(main())
