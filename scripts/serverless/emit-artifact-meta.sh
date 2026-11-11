#!/usr/bin/env bash
# Emit artifact_name / source_sha / manifest_sha256 for the frontend artifact.
# Inputs arrive only via env (never interpolated into the script text).
#   OUT_DIR      packaged artifact dir (contains artifact-manifest.json)
#   TARGET_ENV   environment label; re-validated here
#   GITHUB_OUTPUT  file to append key=value lines to
set -euo pipefail
die() { echo "emit-artifact-meta: $*" >&2; exit 1; }
: "${OUT_DIR:?OUT_DIR required}" "${GITHUB_OUTPUT:?GITHUB_OUTPUT required}"
TARGET_ENV="${TARGET_ENV:?TARGET_ENV required}"
[[ "$TARGET_ENV" =~ ^[a-z][a-z0-9-]{0,31}$ ]] || die "TARGET_ENV must be a lowercase label"
manifest="$OUT_DIR/artifact-manifest.json"
[[ -f "$manifest" ]] || die "missing $manifest"
sha="$(jq -r .source.sha "$manifest")"
[[ "$sha" =~ ^[0-9a-f]{40}$ ]] || die "manifest source.sha is not a 40-char SHA"
manifest_env="$(jq -r .target_env "$manifest")"
[[ "$manifest_env" == "$TARGET_ENV" ]] || die "manifest target_env ($manifest_env) != TARGET_ENV"
msum="$(sha256sum "$manifest" | cut -d' ' -f1)"
{
  printf 'source_sha=%s\n' "$sha"
  printf 'manifest_sha256=%s\n' "$msum"
  printf 'artifact_name=portal-serverless-frontend-%s-%s\n' "$TARGET_ENV" "${sha:0:12}"
} >> "$GITHUB_OUTPUT"
