# OCI Charts

This repository stores reusable Helm charts published to `ghcr.io/x-evor`.

## Layout

- `open-platform`: Cloud-Neutral Open Platform umbrella chart aggregating 10 core infrastructure services (Gitea, Harbor, Silo, CMDB, Vault/Zitadel, Doco CD, pgvector, PG Backup, AI Gateway, MCP Gateway)
- `distributed-web-saas-fullstack`: Caddy ingress, versioned service subcharts and independent/grouped/single-container frontend profiles; [implementation and plan](distributed-web-saas-fullstack/HELM-SUBCHART-PLAN.zh.md)
- `apps/app-service`: reusable runtime chart for application services
- `postgresql`: PostgreSQL service chart with optional `stunnel` server/client
- `observability`: observability composition chart for server and agent components

## Release Model

- Registry: `oci://ghcr.io/x-evor`
- Each chart is versioned independently
- Runtime image tags are managed by GitOps values rather than chart versions
