#!/usr/bin/env bash
set -euo pipefail

# 99-cleanup-golden-image.sh: Final Golden Image cleanup before snapshot

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

if is_debian_like; then
  apt-get autoremove -y --purge || true
  apt-get clean || true
  rm -rf /var/lib/apt/lists/*
  rm -f /var/lib/dpkg/lock* /var/lib/apt/lists/lock /var/cache/apt/archives/lock
  systemctl disable --now apt-daily.timer apt-daily-upgrade.timer unattended-upgrades.service 2>/dev/null || true
  systemctl mask apt-daily.timer apt-daily-upgrade.timer unattended-upgrades.service 2>/dev/null || true
elif is_rhel_like; then
  dnf clean all || true
  rm -rf /var/cache/dnf /var/cache/yum
fi

rm -rf /tmp/* /var/tmp/*
truncate -s 0 /etc/machine-id
rm -f /var/lib/dbus/machine-id
rm -f /etc/ssh/ssh_host_*
rm -rf /root/.bash_history /home/*/.bash_history
truncate -s 0 /var/log/wtmp /var/log/lastlog /var/log/syslog /var/log/messages || true

sync
echo "99-cleanup-golden-image.sh completed."
