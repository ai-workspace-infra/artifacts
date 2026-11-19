#!/usr/bin/env bash
set -euo pipefail

echo "======================================================="
echo " Setting up Web SaaS Production Runtime Node"
echo "======================================================="

export DEBIAN_FRONTEND=noninteractive

# 0. Detect OS & Architecture
if [ -f /etc/os-release ]; then
  . /etc/os-release
  OS_ID="${ID:-linux}"
  OS_ID_LIKE="${ID_LIKE:-}"
else
  OS_ID="unknown"
  OS_ID_LIKE=""
fi

is_debian_like() {
  case "$OS_ID" in
    debian|ubuntu) return 0 ;;
  esac
  case "$OS_ID_LIKE" in
    *debian*|*ubuntu*) return 0 ;;
  esac
  return 1
}

is_rhel_like() {
  case "$OS_ID" in
    rocky|almalinux|rhel|centos|fedora) return 0 ;;
  esac
  case "$OS_ID_LIKE" in
    *rhel*|*fedora*|*centos*) return 0 ;;
  esac
  return 1
}

UNAME_M="$(uname -m)"
case "${UNAME_M}" in
  x86_64|amd64)
    ARCH_STD="amd64"
    ARCH_RPM="x86_64"
    ARCH_DPKG="amd64"
    ;;
  aarch64|arm64)
    ARCH_STD="arm64"
    ARCH_RPM="aarch64"
    ARCH_DPKG="arm64"
    ;;
  loongarch64|loong64)
    ARCH_STD="loong64"
    ARCH_RPM="loongarch64"
    ARCH_DPKG="loong64"
    ;;
  *)
    echo "Unsupported architecture: ${UNAME_M}" >&2
    exit 1
    ;;
esac

echo "Target System: OS=${OS_ID}, Architecture=${ARCH_STD} (${UNAME_M})"

# Ensure valid DNS resolvers exist
if ! grep -q "nameserver" /etc/resolv.conf 2>/dev/null; then
  echo "nameserver 1.1.1.1" >> /etc/resolv.conf
  echo "nameserver 8.8.8.8" >> /etc/resolv.conf
fi

# 1. Install core production runtime packages
if is_debian_like; then
  apt-get update -y
  apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git \
    jq \
    net-tools \
    python3 \
    python3-pip \
    python3-venv \
    ansible \
    rsync \
    sudo \
    htop \
    iptables \
    ufw
elif is_rhel_like; then
  dnf install -y epel-release || true
  dnf install -y \
    ca-certificates \
    curl \
    gnupg2 \
    git \
    jq \
    net-tools \
    python3 \
    python3-pip \
    ansible-core \
    rsync \
    sudo \
    htop \
    iptables \
    iptables-services \
    tar
fi

# Ensure DNS remains valid after package installation
if ! grep -q "nameserver" /etc/resolv.conf 2>/dev/null; then
  echo "nameserver 1.1.1.1" >> /etc/resolv.conf
  echo "nameserver 8.8.8.8" >> /etc/resolv.conf
fi

# 2. Configure Docker Repository & Install Production Docker Runtime
if is_debian_like; then
  install -m 0755 -d /etc/apt/keyrings
  DISTRO_NAME="$(lsb_release -is | tr '[:upper:]' '[:lower:]')"
  CODENAME="$(lsb_release -cs 2>/dev/null || echo '')"

  # Fallback for future Debian / non-standard codenames
  if [ "$DISTRO_NAME" = "debian" ] && { [ "$CODENAME" = "n/a" ] || [ "$CODENAME" = "trixie" ] || [ "$CODENAME" = "forky" ] || [ -z "$CODENAME" ]; }; then
    CODENAME="bookworm"
  fi

  # Fallback for future Ubuntu releases if not yet indexed in docker repo
  if [ "$DISTRO_NAME" = "ubuntu" ] && { [ "$CODENAME" = "resolute" ] || [ -z "$CODENAME" ]; }; then
    CODENAME="noble"
  fi

  curl -fsSL --retry 5 --retry-delay 2 --retry-connrefused "https://download.docker.com/linux/${DISTRO_NAME}/gpg" | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  chmod a+r /etc/apt/keyrings/docker.gpg

  echo "deb [arch=${ARCH_DPKG} signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/${DISTRO_NAME} ${CODENAME} stable" \
    | tee /etc/apt/sources.list.d/docker.list > /dev/null

  apt-get update -y || true
  if ! apt-get install -y --no-install-recommends docker-ce docker-ce-cli containerd.io docker-compose-plugin; then
    echo "Falling back to distro-packaged docker/containerd..."
    apt-get install -y --no-install-recommends docker.io containerd docker-compose || true
  fi
elif is_rhel_like; then
  dnf install -y dnf-plugins-core || true
  dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo || true
  if ! dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin; then
    echo "Falling back to podman / container-tools..."
    dnf install -y podman podman-docker docker-compose || true
  fi
fi

systemctl enable docker || true

# 3. Configure Caddy & Install Caddy
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

# Fallback binary install if package manager didn't install caddy
if ! command -v caddy &>/dev/null; then
  echo "Installing Caddy from official GitHub release binary (${ARCH_STD})..."
  TEMP_CADDY_DIR="$(mktemp -d)"
  CADDY_TAR_URL="https://github.com/caddyserver/caddy/releases/download/v${CADDY_VERSION}/caddy_${CADDY_VERSION}_linux_${ARCH_STD}.tar.gz"
  if curl -fsSL --retry 5 --retry-delay 2 --retry-connrefused "${CADDY_TAR_URL}" -o "${TEMP_CADDY_DIR}/caddy.tar.gz"; then
    tar -xzf "${TEMP_CADDY_DIR}/caddy.tar.gz" -C "${TEMP_CADDY_DIR}"
    install -m 0755 "${TEMP_CADDY_DIR}/caddy" /usr/local/bin/caddy
    # Create caddy user and minimal systemd service
    if ! getent group caddy >/dev/null 2>&1; then
      groupadd --system caddy
    fi
    if ! id caddy >/dev/null 2>&1; then
      useradd --system --gid caddy --create-home --home-dir /var/lib/caddy --shell /usr/sbin/nologin --comment "Caddy web server" caddy
    fi
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

if command -v caddy &>/dev/null; then
  systemctl enable caddy || true
fi

# 4. Create Web SaaS directories
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

# 5. Kernel / Network Tuning for Production Web Runtime
cat <<'EOF' > /etc/sysctl.d/99-websaas-runtime.conf
net.ipv4.ip_forward = 1
net.core.somaxconn = 1024
net.ipv4.tcp_max_syn_backlog = 2048
EOF

sysctl --system || true

echo "Web SaaS Production Runtime Setup Completed Successfully."
