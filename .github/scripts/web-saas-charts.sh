#!/usr/bin/env bash
set -euo pipefail
repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
chart_root="$repo_root/oci/charts/distributed-web-saas-fullstack"
case "${1:-}" in
  build)
    for chart in "$chart_root"/subcharts/*/; do
      if [[ -f "$chart/Chart.lock" ]]; then helm dependency build "$chart" --skip-refresh; fi
    done
    helm repo add flagger https://flagger.app --force-update
    helm dependency build "$chart_root" --skip-refresh
    ;;
  validate)
    for chart in "$chart_root"/subcharts/*/ "$chart_root"; do helm lint "$chart" --strict --kube-version 1.32.0; done
    python3 "$repo_root/.github/tests/test_web_saas_charts.py"
    ;;
  package)
    mkdir -p "${2:?destination required}"
    for chart in "$chart_root"/subcharts/*/ "$chart_root"; do helm package "$chart" --destination "$2"; done
    renamed_chart="$(mktemp -d)"
    trap 'rm -r "$renamed_chart"' EXIT
    cp -R "$chart_root/." "$renamed_chart/"
    sed 's/^name: distributed-web-saas-fullstack$/name: web-saas-platform/' "$chart_root/Chart.yaml" > "$renamed_chart/Chart.yaml"
    helm package "$renamed_chart" --destination "$2"
    ;;
  *) echo 'usage: web-saas-charts.sh {build|validate|package DESTINATION}' >&2; exit 2 ;;
esac
