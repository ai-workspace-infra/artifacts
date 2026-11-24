#!/usr/bin/env bash
set -euo pipefail

# 13-agent-proxy-runtime.sh: Xray-core, stunnel, agent-proxy systemd & BBR tuning

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
  x86_64|amd64) ARCH_XRAY="64" ;;
  aarch64|arm64) ARCH_XRAY="arm64-v8a" ;;
  loongarch64|loong64) ARCH_XRAY="loong64" ;;
  *) echo "Unsupported architecture: ${UNAME_M}" >&2; exit 1 ;;
esac

if is_debian_like; then
  apt-get install -y --no-install-recommends stunnel4 || true
elif is_rhel_like; then
  dnf install -y stunnel || true
fi

mkdir -p /etc/agent-proxy /var/log/agent-proxy /etc/xray /var/log/xray /etc/stunnel
chmod 755 /etc/agent-proxy /etc/xray /etc/stunnel

XRAY_VERSION="v25.1.30"
XRAY_URL="https://github.com/XTLS/Xray-core/releases/download/${XRAY_VERSION}/Xray-linux-${ARCH_XRAY}.zip"
TEMP_DIR="$(mktemp -d)"
if curl -fsSL --retry 5 --retry-delay 2 --retry-connrefused "${XRAY_URL}" -o "${TEMP_DIR}/xray.zip"; then
  unzip -q "${TEMP_DIR}/xray.zip" -d "${TEMP_DIR}/xray"
  install -m 0755 "${TEMP_DIR}/xray/xray" /usr/local/bin/xray
  install -m 0644 "${TEMP_DIR}/xray/geoip.dat" /usr/local/bin/geoip.dat || true
  install -m 0644 "${TEMP_DIR}/xray/geosite.dat" /usr/local/bin/geosite.dat || true
fi
rm -rf "${TEMP_DIR}"

cat <<'EOF' > /etc/systemd/system/xray.service
[Unit]
Description=Xray Service
Documentation=https://github.com/xtls
After=network.target nss-lookup.target

[Service]
User=root
CapabilityBoundingSet=CAP_NET_ADMIN CAP_NET_BIND_SERVICE
AmbientCapabilities=CAP_NET_ADMIN CAP_NET_BIND_SERVICE
NoNewPrivileges=true
ExecStart=/usr/local/bin/xray run -config /etc/xray/config.json
Restart=on-failure
RestartPreventExitStatus=23
LimitNPROC=10000
LimitNOFILE=1000000

[Install]
WantedBy=multi-user.target
EOF

cat <<'EOF' > /etc/systemd/system/agent-proxy.service
[Unit]
Description=Agent Proxy Production Service
After=network.target

[Service]
Type=simple
User=root
ExecStart=/usr/local/bin/agent-proxy --config /etc/agent-proxy/config.json
Restart=always
RestartSec=5s
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
EOF

cat <<'EOF' > /etc/sysctl.d/99-agent-proxy-runtime.conf
net.ipv4.ip_forward = 1
net.core.default_qdisc = fq
net.ipv4.tcp_congestion_control = bbr
net.core.somaxconn = 4096
net.ipv4.tcp_max_syn_backlog = 4096
EOF

sysctl --system || true
echo "13-agent-proxy-runtime.sh completed."
