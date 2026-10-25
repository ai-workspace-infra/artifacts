# Open Platform Umbrella Helm Chart

The `open-platform` Helm chart is a production-grade umbrella chart packaging all **11 Core Infrastructure Service Categories** of the Cloud-Neutral Platform Engineering blueprint into modular subcharts.

## Architecture & Subcharts

The Vault and observability subcharts remain independently configurable. Grafana's externally visible URL is set with `observability-stack.grafana.rootUrl`; the Vault subchart accepts an optional `vault-zitadel.vault.apiAddr`. Neither subchart creates DNS records or an ingress. Public host routing is managed by the separately released `distributed-web-saas-fullstack` Caddy chart. The bundled Vault/Zitadel chart is development-oriented and is not the PROD Raft Vault deployment.

Example external URL values (supply environment-specific hostnames in GitOps):

```yaml
observability-stack:
  grafana:
    rootUrl: https://grafana.example.net/
vault-zitadel:
  vault:
    apiAddr: https://vault.example.net/
```

| # | Subchart | Category | Pinned Image | Ports | Description |
|---|---|---|---|---|---|
| 01 | `gitea` | Git & CI/CD | `gitea/gitea:1.22.6` | 3000 (HTTP), 22 (SSH) | Git code repository and Actions runner engine |
| 02 | `harbor` | Artifact Registry | `goharbor/harbor-portal:v2.15.4`, `goharbor/harbor-core:v2.15.4` | 8080, 80 | OCI container registry, Helm chart repo & Trivy scan |
| 03 | `silo` | S3 Object Storage | `pgsty/silo:RELEASE.2026-10-18T00-00-00Z` | 9000 (S3 API), 9001 (Console) | S3-compatible persistent state and blob storage |
| 04 | `cmdb` | CMDB Inventory | `python:3.11-alpine` | 8000 (REST) | Dynamic inventory API daemon for Ansible and agents |
| 05 | `observability-stack` | Observability Server | `victoriametrics/victoria-metrics:v1.101.0`, `victoria-logs:v1.52.0`, `victoria-traces:v0.1.0`, `grafana:13.2.4` | 3000 (Grafana), 8428 (VM), 9428 (VL), 10428 (VT) | Full-stack metrics, logs, traces storage & dashboards |
| 05 | `observability-agent` | Observability Agent | `prom/node-exporter:v1.8.2`, `timberio/vector:0.41.1-alpine` | 9100 (Node), 8686 (Vector) | Host metrics and system journald log pipeline agent |
| 06 | `vault-zitadel` | Identity & Secrets | `hashicorp/vault:1.17.6`, `postgres:16-alpine` | 8200 (Vault), 5432 (Zitadel DB) | HashiCorp Vault secrets engine + Zitadel IAM database |
| 07 | `doco-cd` | GitOps Delivery | `ghcr.io/kimdre/doco-cd:0.1.28` | 80 (HTTP), 9120 (Metrics) | Declarative single-node GitOps controller |
| 08 | `pgvector` | Vector & Containers | `pgvector/pgvector:pg16` | 5432 (Postgres) | PostgreSQL 16 with pgvector extension for RAG / memory |
| 09 | `pg-backup` | DB Backup Sandbox | `postgres:16-alpine` | 5432 (Postgres) | Automated snapshot backup and restore drill sandbox |
| 10 | `ai-gateway` | AI Gateway | `calciumion/new-api:v0.4.10`, `ghcr.io/berriai/litellm:v1.51.0` | 3000 (New API), 4000 (LiteLLM) | Dual-tier AI routing gateway with auth & rate limits |
| 11 | `mcp-gateway` | MCP Tool Gateway | `alpine:3.20` | 8080 (HTTP) | Model Context Protocol gateway exposing infra tools |

## Quickstart

```bash
# Lint the entire umbrella chart and all 12 subcharts
helm lint ./open-platform

# Render templates
helm template my-platform ./open-platform

# Install the umbrella chart
helm install my-platform ./open-platform -n open-platform --create-namespace
```
