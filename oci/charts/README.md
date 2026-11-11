# OCI Charts

Single source for all Helm charts. Charts are published to `ghcr.io/ai-workspace-infra`
by `.github/workflows/release-oci-charts.yml` (immutable versions; bump a chart's
version when its contents change).

## Layout: two groups

| Group | Umbrella chart | Also contains |
| --- | --- | --- |
| `open-platform/` | `open-platform` (gitea, harbor, silo, cmdb, observability-stack, observability-agent, vault-zitadel incl. optional Zitadel server, pgvector, pg-backup, ai-gateway, platform-mcp, optional caddy) | `library/workload-autoscaling` (canonical VPA/HPA helper), `standalone/postgresql`, `standalone/ai-workspace` |
| `web-saas-fullstack/` | `web-saas-fullstack` (Caddy/Traefik ingress, versioned service subcharts in `subcharts/`; [plan](web-saas-fullstack/HELM-SUBCHART-PLAN.zh.md)) | `standalone/web-saas`, `standalone/apps/{app-service,accounts,console,rag-server}` |

`library/` and `standalone/` hold separate charts; each umbrella's `.helmignore`
excludes them, so they are not packaged into the umbrella.

`observability-stack` also carries the former `observability` compatibility
composition (`compat.enabled`) and the former infra-platform observability scaffold
(`compat.infraPlatformScaffold.enabled`), both off by default; see `docs/observability-chart-convergence.md`.

The former `infra-platform` group was merged into `open-platform` (its gitea duplicated
open-platform's gitea and was dropped). `doco-cd` is a single-host Docker Compose tool and is
deployed by playbooks `roles/vhosts/Doco-CD`, not by a Helm chart.

## Published OCI names

- `observability-stack`, `observability-agent`, `open-platform`, `app-service`
- `web-saas-fullstack` plus compatibility names with identical contents:
  `distributed-web-saas-fullstack` (pre-rename name, still pinned by GitOps until it
  migrates) and `web-saas-platform`.

## Shared autoscaling

`scripts/sync_autoscaling_helper.py` copies the canonical helper from
`open-platform/library/workload-autoscaling` into every chart (VPA where the API
exists, single replica, HPA template disabled); CI runs it with `--check`.
