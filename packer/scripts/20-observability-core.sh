#!/usr/bin/env bash
set -euo pipefail

# 20-observability-core.sh: Vector, Node Exporter, and Process Exporter

export DEBIAN_FRONTEND=noninteractive

if [ -f /etc/os-release ]; then
  . /etc/os-release
  OS_ID="${ID:-linux}"
  OS_ID_LIKE="${ID_LIKE:-}"
else
  OS_ID="unknown"
  OS_ID_LIKE=""
fi

is_debian_like() {
  case "$OS_ID" in debian|ubuntu) return 0 ;; esac
  case "$OS_ID_LIKE" in *debian*|*ubuntu*) return 0 ;; esac
  return 1
}

is_rhel_like() {
  case "$OS_ID" in rocky|almalinux|rhel|centos|fedora) return 0 ;; esac
  case "$OS_ID_LIKE" in *rhel*|*fedora*|*centos*) return 0 ;; esac
  return 1
}

UNAME_M="$(uname -m)"
case "${UNAME_M}" in
  x86_64|amd64) ARCH_STD="amd64"; ARCH_RPM="x86_64"; ARCH_DPKG="amd64" ;;
  aarch64|arm64) ARCH_STD="arm64"; ARCH_RPM="aarch64"; ARCH_DPKG="arm64" ;;
  loongarch64|loong64) ARCH_STD="loong64"; ARCH_RPM="loongarch64"; ARCH_DPKG="loong64" ;;
  *) echo "Unsupported architecture: ${UNAME_M}" >&2; exit 1 ;;
esac

METRICS_DIR=/opt/metrics-agent
mkdir -p "${METRICS_DIR}"

VECTOR_VERSION="0.41.1"
NODE_EXPORTER_VERSION="1.8.2"
PROCESS_EXPORTER_VERSION="0.7.10"

TEMP_OBS_DIR="$(mktemp -d)"
trap 'rm -rf "${TEMP_OBS_DIR}"' EXIT

if ! command -v vector >/dev/null 2>&1; then
  if is_debian_like; then
    VECTOR_DEB_URL="https://github.com/vectordotdev/vector/releases/download/v${VECTOR_VERSION}/vector_${VECTOR_VERSION}-1_${ARCH_DPKG}.deb"
    if curl -fsSL --retry 5 --retry-delay 2 --retry-connrefused "${VECTOR_DEB_URL}" -o "${TEMP_OBS_DIR}/vector.deb" 2>/dev/null; then
      apt-get install -y "${TEMP_OBS_DIR}/vector.deb" || dpkg -i "${TEMP_OBS_DIR}/vector.deb" || apt-get install -fy
    fi
  elif is_rhel_like; then
    VECTOR_RPM_URL="https://github.com/vectordotdev/vector/releases/download/v${VECTOR_VERSION}/vector-${VECTOR_VERSION}-1.${ARCH_RPM}.rpm"
    if curl -fsSL --retry 5 --retry-delay 2 --retry-connrefused "${VECTOR_RPM_URL}" -o "${TEMP_OBS_DIR}/vector.rpm" 2>/dev/null; then
      dnf install -y "${TEMP_OBS_DIR}/vector.rpm" || true
    fi
  fi
fi
install -m 0755 -d /etc/vector
systemctl enable vector 2>/dev/null || true

NODE_EXPORTER_URL="https://github.com/prometheus/node_exporter/releases/download/v${NODE_EXPORTER_VERSION}/node_exporter-${NODE_EXPORTER_VERSION}.linux-${ARCH_STD}.tar.gz"
if [[ ! -x "${METRICS_DIR}/node_exporter" ]]; then
  if curl -fsSL --retry 5 --retry-delay 2 --retry-connrefused "${NODE_EXPORTER_URL}" | tar -xz -C "${TEMP_OBS_DIR}" 2>/dev/null; then
    install -m 0755 "${TEMP_OBS_DIR}/node_exporter-${NODE_EXPORTER_VERSION}.linux-${ARCH_STD}/node_exporter" "${METRICS_DIR}/node_exporter"
  fi
fi

NOBODY_GROUP="nobody"
getent group nogroup >/dev/null 2>&1 && NOBODY_GROUP="nogroup"
install -d -o nobody -g "${NOBODY_GROUP}" -m 0755 /var/lib/node_exporter
cat > /etc/systemd/system/node-exporter.service <<EOF
[Unit]
Description=Node Exporter
After=network.target

[Service]
User=nobody
Group=${NOBODY_GROUP}
ExecStart=/opt/metrics-agent/node_exporter --web.listen-address=127.0.0.1:9100 --collector.textfile --collector.textfile.directory=/var/lib/node_exporter
Restart=always
RestartSec=2

[Install]
WantedBy=multi-user.target
EOF

if [[ ! -x /usr/local/bin/process-exporter ]]; then
  PROCESS_EXPORTER_URL="https://github.com/ncabatoff/process-exporter/releases/download/v${PROCESS_EXPORTER_VERSION}/process-exporter-${PROCESS_EXPORTER_VERSION}.linux-${ARCH_STD}.tar.gz"
  if curl -fsSL --retry 5 --retry-delay 2 --retry-connrefused "${PROCESS_EXPORTER_URL}" | tar -xz -C "${TEMP_OBS_DIR}" 2>/dev/null; then
    install -m 0755 "${TEMP_OBS_DIR}/process-exporter-${PROCESS_EXPORTER_VERSION}.linux-${ARCH_STD}/process-exporter" /usr/local/bin/process-exporter
  fi
fi

getent group process_exporter >/dev/null 2>&1 || groupadd --system process_exporter
id process_exporter >/dev/null 2>&1 || useradd --system --gid process_exporter --shell /usr/sbin/nologin --no-create-home process_exporter
cat > /etc/systemd/system/process-exporter.service <<'EOF'
[Unit]
Description=process-exporter
Wants=network-online.target
After=network-online.target

[Service]
User=process_exporter
Group=process_exporter
ExecStart=/usr/local/bin/process-exporter --config.path /etc/process-exporter.yml --web.listen-address=127.0.0.1:9256
Restart=always
NoNewPrivileges=yes
PrivateTmp=yes
ProtectSystem=full
ProtectHome=yes

[Install]
WantedBy=multi-user.target
EOF
install -m 0755 -o process_exporter -g process_exporter /dev/null /etc/process-exporter.yml

systemctl daemon-reload || true
systemctl enable node-exporter || true
echo "20-observability-core.sh completed."
