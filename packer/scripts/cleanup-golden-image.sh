#!/usr/bin/env bash
set -euo pipefail

echo "======================================================="
echo " Cleaning Golden Image prior to Snapshot"
echo "======================================================="

export DEBIAN_FRONTEND=noninteractive

# 0. Detect OS Family
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

# 1. Package cache cleanup
if is_debian_like; then
  echo "Cleaning APT package cache and locks..."
  apt-get autoremove -y --purge || true
  apt-get clean || true
  rm -rf /var/lib/apt/lists/*
  rm -f /var/lib/dpkg/lock* /var/lib/apt/lists/lock /var/cache/apt/archives/lock

  # Disable unattended-upgrades & APT daily timers to prevent first-boot dpkg lock
  systemctl disable --now apt-daily.timer apt-daily-upgrade.timer unattended-upgrades.service 2>/dev/null || true
  systemctl mask apt-daily.timer apt-daily-upgrade.timer unattended-upgrades.service 2>/dev/null || true
elif is_rhel_like; then
  echo "Cleaning DNF package cache..."
  dnf clean all || true
  rm -rf /var/cache/dnf /var/cache/yum
fi

rm -rf /tmp/* /var/tmp/*

# 2. Disable cloud-init package update modules if cloud-init is installed
if [ -f /etc/cloud/cloud.cfg ]; then
  echo "Disabling cloud-init package-update modules..."
  sed -i 's/^[[:space:]]*- package-update-upgrade-install/# - package-update-upgrade-install/' /etc/cloud/cloud.cfg || true
  sed -i 's/^[[:space:]]*- apt-configure/# - apt-configure/' /etc/cloud/cloud.cfg || true
  sed -i 's/^[[:space:]]*- yum-add-repo/# - yum-add-repo/' /etc/cloud/cloud.cfg || true
fi

# 3. Reset cloud-init if installed
if command -v cloud-init &>/dev/null; then
  echo "Cleaning cloud-init data..."
  cloud-init clean --logs --seed || true
fi

# 4. Clean machine-id so new instance generates a fresh unique ID
echo "Truncating machine-id..."
truncate -s 0 /etc/machine-id
if [ -f /var/lib/dbus/machine-id ]; then
  rm -f /var/lib/dbus/machine-id
fi

# 5. Remove SSH Host Keys (will be regenerated on first boot)
echo "Removing SSH host keys..."
rm -f /etc/ssh/ssh_host_*

# 6. Clean shell history and logs
rm -rf /root/.bash_history /home/*/.bash_history
truncate -s 0 /var/log/wtmp /var/log/lastlog /var/log/syslog /var/log/messages || true

sync
echo "Golden Image cleanup completed successfully."
