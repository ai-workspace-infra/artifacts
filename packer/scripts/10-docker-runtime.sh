#!/usr/bin/env bash
set -euo pipefail

# 10-docker-runtime.sh: Install Docker CE / containerd / Compose plugin

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
  x86_64|amd64) ARCH_DPKG="amd64" ;;
  aarch64|arm64) ARCH_DPKG="arm64" ;;
  loongarch64|loong64) ARCH_DPKG="loong64" ;;
  *) echo "Unsupported architecture: ${UNAME_M}" >&2; exit 1 ;;
esac

if is_debian_like; then
  install -m 0755 -d /etc/apt/keyrings
  DISTRO_NAME="$(lsb_release -is | tr '[:upper:]' '[:lower:]')"
  CODENAME="$(lsb_release -cs 2>/dev/null || echo '')"

  if [ "$DISTRO_NAME" = "debian" ] && { [ "$CODENAME" = "n/a" ] || [ "$CODENAME" = "trixie" ] || [ "$CODENAME" = "forky" ] || [ -z "$CODENAME" ]; }; then
    CODENAME="bookworm"
  fi
  if [ "$DISTRO_NAME" = "ubuntu" ] && { [ "$CODENAME" = "resolute" ] || [ -z "$CODENAME" ]; }; then
    CODENAME="noble"
  fi

  curl -fsSL --retry 5 --retry-delay 2 --retry-connrefused "https://download.docker.com/linux/${DISTRO_NAME}/gpg" | gpg --dearmor -o /etc/apt/keyrings/docker.gpg || true
  chmod a+r /etc/apt/keyrings/docker.gpg || true

  echo "deb [arch=${ARCH_DPKG} signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/${DISTRO_NAME} ${CODENAME} stable" \
    | tee /etc/apt/sources.list.d/docker.list > /dev/null

  apt-get update -y || true
  if ! apt-get install -y --no-install-recommends docker-ce docker-ce-cli containerd.io docker-compose-plugin; then
    apt-get install -y --no-install-recommends docker.io containerd docker-compose || true
  fi
elif is_rhel_like; then
  dnf install -y dnf-plugins-core || true
  dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo || true
  if ! dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin; then
    dnf install -y podman podman-docker docker-compose || true
  fi
fi

systemctl enable docker || true
echo "10-docker-runtime.sh completed."
