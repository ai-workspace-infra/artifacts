#!/usr/bin/env bash
set -euo pipefail
repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$repo_root"
package_dir="${RUNNER_TEMP:-$repo_root/dist}/oci-charts-${GITHUB_RUN_ID:-local}-${GITHUB_RUN_ATTEMPT:-1}"
legacy_charts=(oci/charts/open-platform oci/charts/open-platform/charts/observability-stack oci/charts/apps/app-service oci/charts/observability)
case "${1:-}" in
  validate)
    for chart in "${legacy_charts[@]}"; do helm lint "$chart"; done
    .github/scripts/check-web-saas-charts.sh
    ;;
  package)
    mkdir -p "$package_dir"
    for chart in "${legacy_charts[@]}"; do helm package "$chart" --destination "$package_dir"; done
    .github/scripts/web-saas-charts.sh package "$package_dir"
    python3 - "$package_dir" <<'PY'
import hashlib,json,subprocess,sys
from pathlib import Path
output=Path(sys.argv[1])
paths=sorted(output.glob('*.tgz'))
manifest={'source_sha':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),
          'packages':{p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in paths}}
(output/'source-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
PY
    ;;
  push)
    # Published OCI chart versions are immutable. A repeat may skip identical
    # contents, but changed contents require a new Chart version.
    work_dir="$(mktemp -d "${RUNNER_TEMP:-${TMPDIR:-/tmp}}/chart-push.XXXXXX")"
    trap 'rm -rf "$work_dir"' EXIT
    for pkg in "$package_dir"/*.tgz; do
      metadata="$(helm show chart "$pkg")"
      read -r name version < <(python3 -c "
import sys, re
metadata = sys.stdin.read()
name = re.search(r'^name:\s*([^\s#]+)', metadata, re.MULTILINE).group(1).strip('\"\'')
version = re.search(r'^version:\s*([^\s#]+)', metadata, re.MULTILINE).group(1).strip('\"\'')
print(f'{name} {version}')
" <<< "$metadata")
      if helm pull "oci://${GHCR_NAMESPACE:?}/$name" --version "$version" --destination "$work_dir" 2>"$work_dir/pull.log"; then
        mkdir "$work_dir/local" "$work_dir/remote"
        tar -xzf "$pkg" -C "$work_dir/local"
        tar -xzf "$work_dir/$name-$version.tgz" -C "$work_dir/remote"
        if ! diff -r "$work_dir/local" "$work_dir/remote"; then
          echo "Refusing to overwrite $name:$version; bump its Chart version." >&2; exit 1
        fi
        rm -r "$work_dir/local" "$work_dir/remote"
        echo "Skipping identical published chart $name:$version"
      elif grep -Eqi 'not found|404|MANIFEST_UNKNOWN|NAME_UNKNOWN' "$work_dir/pull.log"; then
        helm push "$pkg" "oci://${GHCR_NAMESPACE}"
      else
        cat "$work_dir/pull.log" >&2; exit 1
      fi
    done
    ;;
  *) echo 'usage: release-oci-charts.sh {validate|package|push}' >&2; exit 2 ;;
esac
