#!/usr/bin/env bash
set -euo pipefail

# 11-caddy-websaas.sh: Install Caddy, Web SaaS directories, and network tuning

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
  x86_64|amd64) ARCH_STD="amd64" ;;
  aarch64|arm64) ARCH_STD="arm64" ;;
  loongarch64|loong64) ARCH_STD="loong64" ;;
  *) echo "Unsupported architecture: ${UNAME_M}" >&2; exit 1 ;;
esac

CADDY_VERSION="2.9.1"
if is_debian_like; then
  curl -1sLf --retry 5 --retry-delay 2 --retry-connrefused 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg || true
  curl -1sLf --retry 5 --retry-delay 2 --retry-connrefused 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list > /dev/null || true
  apt-get update -y || true
  apt-get install -y --no-install-recommends caddy || true
elif is_rhel_like; then
  dnf install -y 'dnf-command(copr)' || true
  dnf copr enable -y @caddy/caddy || true
  dnf install -y caddy || true
fi

if ! command -v caddy &>/dev/null; then
  TEMP_CADDY_DIR="$(mktemp -d)"
  CADDY_TAR_URL="https://github.com/caddyserver/caddy/releases/download/v${CADDY_VERSION}/caddy_${CADDY_VERSION}_linux_${ARCH_STD}.tar.gz"
  if curl -fsSL --retry 5 --retry-delay 2 --retry-connrefused "${CADDY_TAR_URL}" -o "${TEMP_CADDY_DIR}/caddy.tar.gz"; then
    tar -xzf "${TEMP_CADDY_DIR}/caddy.tar.gz" -C "${TEMP_CADDY_DIR}"
    install -m 0755 "${TEMP_CADDY_DIR}/caddy" /usr/local/bin/caddy
    getent group caddy >/dev/null 2>&1 || groupadd --system caddy
    id caddy >/dev/null 2>&1 || useradd --system --gid caddy --create-home --home-dir /var/lib/caddy --shell /usr/sbin/nologin caddy
    cat <<'EOF' > /etc/systemd/system/caddy.service
[Unit]
Description=Caddy
Documentation=https://caddyserver.com/docs/
After=network.target network-online.target
Requires=network-online.target

[Service]
Type=notify
User=caddy
Group=caddy
ExecStart=/usr/local/bin/caddy run --environ --config /etc/caddy/Caddyfile
ExecReload=/usr/local/bin/caddy reload --config /etc/caddy/Caddyfile --force
TimeoutStopSec=5s
LimitNOFILE=1048576
LimitNPROC=512
PrivateTmp=true
ProtectSystem=full
AmbientCapabilities=CAP_NET_ADMIN CAP_NET_BIND_SERVICE

[Install]
WantedBy=multi-user.target
EOF
  fi
  rm -rf "${TEMP_CADDY_DIR}"
fi

command -v caddy &>/dev/null && systemctl enable caddy || true

mkdir -p /opt/web-saas /etc/caddy /var/log/caddy /var/www/html
chmod 755 /opt/web-saas /etc/caddy

if [ ! -f /etc/caddy/Caddyfile ]; then
  cat <<'EOF' > /etc/caddy/Caddyfile
:80 {
    root * /var/www/html
    file_server
}
EOF
fi

cat <<'EOF' > /etc/sysctl.d/99-websaas-runtime.conf
net.ipv4.ip_forward = 1
net.core.somaxconn = 1024
net.ipv4.tcp_max_syn_backlog = 2048
EOF

sysctl --system || true
echo "11-caddy-websaas.sh completed."
