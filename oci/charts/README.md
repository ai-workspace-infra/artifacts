# OCI Charts

Single source for all Helm charts. Charts are published to `ghcr.io/ai-workspace-infra`
by `.github/workflows/release-oci-charts.yml` (immutable versions; bump a chart's
version when its contents change).

## Layout: three groups

| Group | Umbrella chart | Also contains |
| --- | --- | --- |
| `infra-platform/` | `infra-platform` (gitea, zitadel, observability scaffold, caddy) | `library/workload-autoscaling` (canonical VPA/HPA helper), `standalone/postgresql` |
| `open-platform/` | `open-platform` (gitea, harbor, silo, cmdb, observability-stack, observability-agent, vault-zitadel, doco-cd, pgvector, pg-backup, ai-gateway, mcp-gateway) | `standalone/ai-workspace` |
| `web-saas-fullstack/` | `web-saas-fullstack` (Caddy/Traefik ingress, versioned service subcharts in `subcharts/`; [plan](web-saas-fullstack/HELM-SUBCHART-PLAN.zh.md)) | `standalone/web-saas`, `standalone/apps/{app-service,accounts,console,rag-server}` |

`library/` and `standalone/` hold separate charts; each umbrella's `.helmignore`
excludes them, so they are not packaged into the umbrella.

`observability-stack` also carries the former `observability` compatibility
composition (`compat.enabled`, off by default); see `docs/observability-chart-convergence.md`.

## Published OCI names

- `observability-stack`, `observability-agent`, `open-platform`, `app-service`
- `web-saas-fullstack` plus compatibility names with identical contents:
  `distributed-web-saas-fullstack` (pre-rename name, still pinned by GitOps until it
  migrates) and `web-saas-platform`.

## Shared autoscaling

`scripts/sync_autoscaling_helper.py` copies the canonical helper from
`infra-platform/library/workload-autoscaling` into every chart (VPA where the API
exists, single replica, HPA template disabled); CI runs it with `--check`.
