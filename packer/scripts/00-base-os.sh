#!/usr/bin/env bash
set -euo pipefail

# 00-base-os.sh: Base OS packages, DNS fallback, and architecture/distro detection

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

if ! grep -q "nameserver" /etc/resolv.conf 2>/dev/null; then
  echo "nameserver 1.1.1.1" >> /etc/resolv.conf
  echo "nameserver 8.8.8.8" >> /etc/resolv.conf
fi

if is_debian_like; then
  apt-get update -y
  apt-get install -y --no-install-recommends \
    ca-certificates curl gnupg lsb-release git jq net-tools \
    python3 python3-pip python3-venv ansible rsync sudo htop unzip \
    iptables iproute2
elif is_rhel_like; then
  dnf install -y epel-release || true
  dnf install -y \
    ca-certificates curl gnupg2 git jq net-tools \
    python3 python3-pip ansible-core rsync sudo htop unzip \
    iptables iptables-services iproute tar
fi

if ! grep -q "nameserver" /etc/resolv.conf 2>/dev/null; then
  echo "nameserver 1.1.1.1" >> /etc/resolv.conf
  echo "nameserver 8.8.8.8" >> /etc/resolv.conf
fi

echo "00-base-os.sh completed."
