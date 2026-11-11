#!/usr/bin/env bash
# Consumer-side check of a portal Serverless frontend artifact directory.
# Usage: verify-frontend-artifact.sh <dir> <expected-ref> [expected-sha]
set -euo pipefail
dir="${1:?artifact dir}"; ref="${2:?expected ref}"; sha="${3:-}"
cd "$dir"
sha256sum -c --strict SHA256SUMS >/dev/null
jq -e --arg ref "$ref" --arg sha "$sha" '
  .schema_version == 1 and .kind == "PortalServerlessFrontendArtifact"
  and .source.ref == $ref and ($sha == "" or .source.sha == $sha)
  and (.files | length) > 0' artifact-manifest.json >/dev/null \
  || { echo "manifest does not match expected ref/sha" >&2; exit 1; }
jq -r '.files[] | "\(.sha256)  \(.name)"' artifact-manifest.json | sha256sum -c --strict - >/dev/null
for b in $(jq -r '.ssr_boundaries[]' artifact-manifest.json); do
  test -f "portal-ssr-${b}.tar.gz" || { echo "missing portal-ssr-${b}.tar.gz" >&2; exit 1; }
done
test -f portal-static.tar.gz
echo "verify-frontend-artifact: OK ${ref}"
