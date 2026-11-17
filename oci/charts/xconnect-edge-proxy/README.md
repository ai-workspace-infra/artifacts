# XConnect Edge Proxy Helm Chart

Production-grade Helm chart for deploying containerized XConnect Edge Proxy nodes with **4 selectable Global Ingress engines**, high-performance UDS (Unix Domain Socket) inter-process communication, zero-leak credential management, and automated periodic configuration drift convergence.

---

## 🌟 Key Features

1. **4 Selectable Global Ingress Engines (`ingress.provider`)**:
   - **`fluxgate` (Default)**: Rust + Cloudflare Pingora engine, **~25 MB RSS**, zero-GC, ultra-low latency jitter, native HTTP/2 client cancel suppression (HTTP 499 clean logs).
   - **`haproxy`**: HAProxy 3.0-alpine (C epoll, multi-threaded battle-tested industrial standard).
   - **`caddy`**: Caddy 2.8-alpine (Go runtime, automatic certificate fallback).
   - **`traefik`**: K3s native Traefik `IngressRoute` (CRD-driven edge cluster ingress integration).
2. **Containerized Architecture & Zero-Copy IPC**:
   - Reverse proxy and backend core communicate over Unix Domain Sockets (`/dev/shm/xray.sock`, `/dev/shm/xray-tcp.sock`) mounted via a shared `Memory` `emptyDir` volume, eliminating TCP loopback overhead.
3. **Zero-Leak Security Plane**:
   - Eliminates plaintext tokens in scripts, environment histories, or git commits.
   - Credentials (`INTERNAL_SERVICE_TOKEN`, `VAULT_TOKEN`) and TLS certificates are mounted securely from Kubernetes Secrets or injected via Vault Agent / ExternalSecrets (`existingSecret`).
4. **Automated Drift Convergence**:
   - Works with `ansible-pull.timer` (systemd) on bare-metal edge nodes or in-cluster `CronJob` to continuously synchronize with `ai-workspace-infra/playbooks` and `gitops`.

---

## 🏗️ Architecture

```
                                  [ Client Requests ]
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    │                                             │
      (Standalone Container / HostNet)               (K3s Cluster Ingress)
                    │                                             │
       ┌────────────▼────────────┐                   ┌────────────▼────────────┐
       │   Ingress Container:    │                   │   K3s Native Traefik    │
       │   - Fluxgate (Default)  │                   │      IngressRoute       │
       │   - HAProxy 3.0         │                   └────────────┬────────────┘
       │   - Caddy 2.8           │                                │
       └────────────┬────────────┘                                │
                    │                                             │
                    └──────────────────────┬──────────────────────┘
                                           │
                                  [ /dev/shm Memory ]
                         (Zero-overhead Unix Domain Socket)
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    │                                             │
         ┌──────────▼──────────┐                       ┌──────────▼──────────┐
         │     xray-core       │                       │ xconnect-edge-agent │
         │  (UDS Core Backend) │                       │  (Controller Sync)  │
         └──────────┬──────────┘                       └──────────┬──────────┘
                    │                                             │
                    └──────────────────────┬──────────────────────┘
                                           │
                              ┌────────────▼────────────┐
                              │      Vector Agent       │
                              │ (Scrapes :9102 / :8404) │──► [ VictoriaMetrics ]
                              └─────────────────────────┘
```

---

## 🚀 Quick Start

### 1. Default Deployment (Fluxgate 0.1.0)

```bash
helm upgrade --install xconnect-edge-proxy ./oci/charts/xconnect-edge-proxy \
  --namespace xconnect \
  --create-namespace \
  --set global.nodeDomain="jp-xconnect-01.svc.plus" \
  --set ingress.provider="fluxgate" \
  --set security.existingSecret="xconnect-credentials"
```

### 2. HAProxy 3.0 Engine

```bash
helm upgrade --install xconnect-edge-proxy ./oci/charts/xconnect-edge-proxy \
  --namespace xconnect \
  --create-namespace \
  --set global.nodeDomain="jp-xconnect-01.svc.plus" \
  --set ingress.provider="haproxy" \
  --set security.existingSecret="xconnect-credentials"
```

### 3. Caddy 2.8 Engine

```bash
helm upgrade --install xconnect-edge-proxy ./oci/charts/xconnect-edge-proxy \
  --namespace xconnect \
  --create-namespace \
  --set global.nodeDomain="jp-xconnect-01.svc.plus" \
  --set ingress.provider="caddy" \
  --set security.existingSecret="xconnect-credentials"
```

### 4. K3s Native Traefik IngressRoute

```bash
helm upgrade --install xconnect-edge-proxy ./oci/charts/xconnect-edge-proxy \
  --namespace xconnect \
  --create-namespace \
  --set global.nodeDomain="jp-xconnect-01.svc.plus" \
  --set ingress.provider="traefik" \
  --set ingress.tls.secretName="shared-observability-tls"
```

---

## 🔒 Security Best Practices

### Creating the Credentials Secret

To prevent credentials from appearing in deployment manifests or Git history, create the Secret directly or sync it via Vault:

```bash
kubectl create secret generic xconnect-credentials \
  --namespace xconnect \
  --from-literal=INTERNAL_SERVICE_TOKEN="<REDACTED_INTERNAL_SERVICE_TOKEN>" \
  --from-literal=VAULT_TOKEN="<REDACTED_VAULT_TOKEN>"
```

---

## ⏱️ Edge Node Periodic Convergence (`ansible-pull.timer`)

For edge nodes managed via GitOps/Ansible, configure `ansible-pull.timer` (systemd) on the host to pull and apply the configuration every 15 minutes:

```ini
# /etc/systemd/system/ansible-pull.timer
[Unit]
Description=Periodic XConnect Edge Configuration Reconcile

[Timer]
OnCalendar=*:0/15
Persistent=true
RandomizedDelaySec=60
Unit=ansible-pull.service

[Install]
WantedBy=timers.target
```

Combined with `setup-proxy.sh`:
```bash
curl -fsSL https://raw.githubusercontent.com/ai-workspace-xstream/xconnect-edge-agent/main/scripts/setup-proxy.sh | \
  AGENT_PROXY_ENGINE=fluxgate bash -s -- --node "jp-xconnect-01.svc.plus" --with-observability
```
