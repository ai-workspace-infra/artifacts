#!/usr/bin/env bash
set -euo pipefail

# 21-observability-postgres.sh: PostgreSQL Exporter for Web SaaS nodes

UNAME_M="$(uname -m)"
case "${UNAME_M}" in
  x86_64|amd64) ARCH_STD="amd64" ;;
  aarch64|arm64) ARCH_STD="arm64" ;;
  loongarch64|loong64) ARCH_STD="loong64" ;;
  *) echo "Unsupported architecture: ${UNAME_M}" >&2; exit 1 ;;
esac

METRICS_DIR=/opt/metrics-agent
mkdir -p "${METRICS_DIR}"
POSTGRES_EXPORTER_VERSION="0.19.1"

TEMP_OBS_DIR="$(mktemp -d)"
trap 'rm -rf "${TEMP_OBS_DIR}"' EXIT

POSTGRES_EXPORTER_URL="https://github.com/prometheus-community/postgres_exporter/releases/download/v${POSTGRES_EXPORTER_VERSION}/postgres_exporter-${POSTGRES_EXPORTER_VERSION}.linux-${ARCH_STD}.tar.gz"
if curl -fsSL --retry 5 --retry-delay 2 --retry-connrefused "${POSTGRES_EXPORTER_URL}" -o "${TEMP_OBS_DIR}/postgres_exporter.tar.gz" 2>/dev/null; then
  tar -xzf "${TEMP_OBS_DIR}/postgres_exporter.tar.gz" -C "${TEMP_OBS_DIR}"
  install -m 0755 "${TEMP_OBS_DIR}/postgres_exporter-${POSTGRES_EXPORTER_VERSION}.linux-${ARCH_STD}/postgres_exporter" "${METRICS_DIR}/postgres_exporter"
else
  echo "WARNING: Failed to download postgres_exporter for ${ARCH_STD}"
fi

echo "21-observability-postgres.sh completed."
