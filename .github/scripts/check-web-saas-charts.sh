#!/usr/bin/env bash
set -euo pipefail
repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
validation_dir="$(mktemp -d "${RUNNER_TEMP:-${TMPDIR:-/tmp}}/websaas-check.XXXXXX")"
trap 'rm -rf "$validation_dir"' EXIT
python3 -m venv "$validation_dir/venv"
"$validation_dir/venv/bin/pip" install -r "$repo_root/.github/tests/requirements-charts.txt"
export PATH="$validation_dir/venv/bin:$PATH"
"$repo_root/.github/scripts/web-saas-charts.sh" build
"$repo_root/.github/scripts/web-saas-charts.sh" package "$validation_dir/packages"
export WEBSAAS_PACKAGED_CHART="$validation_dir/packages/distributed-web-saas-fullstack-0.2.0.tgz"
"$repo_root/.github/scripts/web-saas-charts.sh" validate
# Validate the packaged umbrella, whose local source directories are excluded.
helm lint "$WEBSAAS_PACKAGED_CHART" --strict --kube-version 1.32.0
