#!/usr/bin/env bash
set -euo pipefail

# 01-security-hardening.sh: Baseline SSH & kernel security hardening

if [ -d /etc/ssh/sshd_config.d ]; then
  cat <<'EOF' > /etc/ssh/sshd_config.d/99-golden-hardening.conf
PasswordAuthentication yes
PermitEmptyPasswords no
X11Forwarding no
MaxAuthTries 5
ClientAliveInterval 300
ClientAliveCountMax 2
EOF
fi

cat <<'EOF' > /etc/sysctl.d/90-security-baseline.conf
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1
net.ipv4.icmp_echo_ignore_broadcasts = 1
net.ipv4.conf.all.accept_source_route = 0
net.ipv4.conf.default.accept_source_route = 0
EOF

sysctl --system || true
echo "01-security-hardening.sh completed."
