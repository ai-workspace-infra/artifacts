#!/usr/bin/env bash
set -euo pipefail
schema_dir="${WEBSAAS_RENDER_DIR:?WEBSAAS_RENDER_DIR must contain successful render fixtures}"
shopt -s nullglob
manifests=("$schema_dir"/*.yaml)
if (( ${#manifests[@]} == 0 )); then echo 'No rendered fixtures found' >&2; exit 1; fi
validator_dir="$(mktemp -d "${RUNNER_TEMP:-${TMPDIR:-/tmp}}/websaas-schema.XXXXXX")"
trap 'rm -rf "$validator_dir"' EXIT
GOBIN="$validator_dir" go install github.com/yannh/kubeconform/cmd/kubeconform@v0.6.7
"$validator_dir/kubeconform" -strict -summary -kubernetes-version 1.32.0 "${manifests[@]}"
