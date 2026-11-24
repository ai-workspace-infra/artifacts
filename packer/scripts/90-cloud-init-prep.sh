#!/usr/bin/env bash
set -euo pipefail

# 90-cloud-init-prep.sh: Cloud-init datasource preparation across AWS/GCP/Alicloud/Vultr/Linode/UCloud

if [ -f /etc/cloud/cloud.cfg ]; then
  sed -i 's/^[[:space:]]*- package-update-upgrade-install/# - package-update-upgrade-install/' /etc/cloud/cloud.cfg || true
  sed -i 's/^[[:space:]]*- apt-configure/# - apt-configure/' /etc/cloud/cloud.cfg || true
  sed -i 's/^[[:space:]]*- yum-add-repo/# - yum-add-repo/' /etc/cloud/cloud.cfg || true
fi

if command -v cloud-init &>/dev/null; then
  cloud-init clean --logs --seed || true
fi

echo "90-cloud-init-prep.sh completed."
