#!/usr/bin/env bash
set -euo pipefail

# 12-k3s-runtime.sh: Install k3s-agent binary and systemd unit

curl -sfL https://get.k3s.io | INSTALL_K3S_SKIP_START=true sh -
systemctl enable k3s-agent || true
echo "12-k3s-runtime.sh completed."
