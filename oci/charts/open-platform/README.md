# Open Platform Umbrella Helm Chart

The `open-platform` Helm chart is a production-grade umbrella chart packaging all **10 Core Infrastructure Services** of the Cloud-Neutral Platform Engineering blueprint into modular subcharts.

## Architecture & Subcharts

| # | Subchart | Category | Pinned Image | Ports | Description |
|---|---|---|---|---|---|
| 01 | `gitea` | Git & CI/CD | `gitea/gitea:1.22.6` | 3000 (HTTP), 22 (SSH) | Git code repository and Actions runner engine |
| 02 | `harbor` | Artifact Registry | `goharbor/harbor-portal:v2.15.4`, `goharbor/harbor-core:v2.15.4` | 8080, 80 | OCI container registry, Helm chart repo & Trivy scan |
| 03 | `silo` | S3 Object Storage | `pgsty/silo:RELEASE.2026-10-18T00-00-00Z` | 9000 (S3 API), 9001 (Console) | S3-compatible persistent state and blob storage |
| 04 | `cmdb` | CMDB Inventory | `python:3.11-alpine` | 8000 (REST) | Dynamic inventory API daemon for Ansible and agents |
| 05 | `vault-zitadel` | Identity & Secrets | `hashicorp/vault:1.17.6`, `postgres:16-alpine` | 8200 (Vault), 5432 (Zitadel DB) | HashiCorp Vault secrets engine + Zitadel IAM database |
| 06 | `doco-cd` | GitOps Delivery | `ghcr.io/kimdre/doco-cd:0.1.28` | 80 (HTTP), 9120 (Metrics) | Declarative single-node GitOps controller |
| 07 | `pgvector` | Vector & Containers | `pgvector/pgvector:pg16` | 5432 (Postgres) | PostgreSQL 16 with pgvector extension for RAG / memory |
| 08 | `pg-backup` | DB Backup Sandbox | `postgres:16-alpine` | 5432 (Postgres) | Automated snapshot backup and restore drill sandbox |
| 09 | `ai-gateway` | AI Gateway | `calciumion/new-api:v0.4.10`, `ghcr.io/berriai/litellm:v1.51.0` | 3000 (New API), 4000 (LiteLLM) | Dual-tier AI routing gateway with auth & rate limits |
| 10 | `mcp-gateway` | MCP Tool Gateway | `alpine:3.20` | 8080 (HTTP) | Model Context Protocol gateway exposing infra tools |

## Quickstart

```bash
# Lint the entire umbrella chart and all 10 subcharts
helm lint ./open-platform

# Render templates
helm template my-platform ./open-platform

# Install the umbrella chart
helm install my-platform ./open-platform -n open-platform --create-namespace
```
