# Distributed Web SaaS Fullstack — 0.2.10

The same chart package can be installed as three independent Helm releases: enable
only PostgreSQL for a database release; only Caddy for an ingress release; and only
the selected applications for an application release. Each release keeps its own
namespace, values, immutable artifact pin and lifecycle.

For Caddy-only releases set `caddy.externalBackends.enabled: true` and provide explicit
`accounts` and `frontend` targets as service DNS names with ports; provide `billing`
when billing hosts are configured. Local application/database components must remain
disabled. The default `false` retains the existing combined-release validation and
local upstream names. This is a Caddy reverse proxy, not an Ingress API controller.
Cross-namespace network access, TLS Secret delivery and resource budgets are deployment
contracts owned by the consumer. No production topology or secret values are defaults.

Composable Helm charts for Kubernetes 1.32+ with Caddy as the public HTTPS
ingress entry point. The implemented ingress mode uses a Caddy Deployment and
generated Caddyfile; it does not install an Ingress API/Gateway API controller.
No Traefik Ingress or class is generated. Version 0.2.0 replaces the 0.1 `components`, `database` and
`ingress` contracts; legacy keys fail schema validation. The combined `stunnel` values key is also
rejected; configure `stunnelClient` and `stunnelServer` separately. Review rendered changes
before upgrading: the previous monolithic resource layout is not upgrade-compatible.

## Topology and modes

```text
Caddy ingress (the only public Service)
  console host -> frontend-router -> static-pages + five SSR Services
  console/accounts API paths -> gateway-auth / gateway-admin / gateway-core
  billing host -> billing
  private Gateway Services -> accounts / billing / content -> PostgreSQL
  optional stunnel-client/server -> private PostgreSQL access
```

`console.deploymentProfile` selects one of three mutually exclusive forms:

| Profile | Workload ownership | Scaling |
| --- | --- | --- |
| `independent` | Pages, Router and five SSRs each have a Deployment | Each `console.components.<name>.replicas` or HPA scales independently |
| `grouped` | Explicit `console.groups` combine boundaries into multi-container Pods | Each group's replicas/HPA scales the entire Pod |
| `single-container` | One `console.singleContainer` workload using a reviewed all-in-one image | One replicas/HPA setting; split frontend workloads are absent |

`edgeGateway.deploymentProfile` independently selects `independent` or `grouped`
for `auth`, `admin`, and `core`. Independent mode has ten frontend/Gateway
Deployments, before backend services and Caddy. Container images, resources,
probes, command/args and Secret references remain configurable per component.
In grouped mode every member must appear exactly once, listener ports must be
unique, and group replicas/HPA replace per-component scaling. Services retain
stable boundary names and point to the group's numeric container ports.

The standalone `web-saas-static-pages`, `web-saas-frontend-router` and
`web-saas-frontend-ssr` charts are alternative building blocks for separately
managed releases. The umbrella's Console chart owns its seven components and
does not install those standalone charts as duplicate resources. All reuse the
`web-saas-common` library. Chart names use a `web-saas-` prefix to avoid OCI
collisions with existing generic service charts.

## Source and configuration layout

Child chart sources are in `subcharts/`; generated dependency packages belong in
`charts/` and are ignored by Git. Every application child has its own schema,
version, README and local library lock; the umbrella locks its nine application
dependencies. Sources are excluded from the umbrella archive, which embeds the
locked dependency packages. This keeps Helm's dependency loader from treating
unrelated standalone sources or duplicate directory/archive pairs as dependencies.

| Configuration | Values path |
| --- | --- |
| Backend services | `accounts.workload`, `billing.workload`, `content.workload` |
| Seven split frontend roles | `console.components.static-pages`, `frontend-router`, `ssr-public`, `ssr-content`, `ssr-auth`, `ssr-console`, `ssr-workspace` |
| Single container | `console.singleContainer` |
| Gateway roles | `edgeGateway.boundaries.auth`, `admin`, `core` |
| Group assignment | `console.groups` / `edgeGateway.groups`; `members`, `replicas`, optional `autoscaling` |
| Caddy entry | `caddy.image`, `routes`, `tls`, `service.type`, `frontendService`, `gatewayEnabled` |
| Database | `postgresql.image`, `existingSecret`, `storage`, `username`, `database` |
| Tunnel client | `stunnelClient.image`, `existingSecret`, `connect`, `checkHost`, `port`, `replicas` |
| Tunnel server | `stunnelServer.image`, `existingSecret`, `connect`, `allowedCIDRs`, `port`, `replicas` |

Workload image fields require `repository@sha256:<64 hex characters>`.
Images are empty by default, with every application disabled. The open example
enables the stack but intentionally cannot install until real digests are supplied.
No fictional Worker OCI image names or Node entrypoints are assumed. Build and
verify Node/container adapters for Router, SSR and Gateway Workers in their owning
repositories before runtime acceptance. Cloudflare bindings, cache behavior,
asset manifests and streaming need explicit compatibility checks.

Each application must listen on its configured port; the chart injects `PORT`.
`env.PORT` is rejected to prevent conflicting definitions. Probe port `primary`
resolves to the component's listener port, including in grouped Pods. Use a
literal probe port only when the image exposes a separate health listener.
Router/Gateway default environment names describe the HTTP adapter contract;
verify or override them for the selected container images rather than assuming
Cloudflare service bindings work unchanged.
Non-sensitive `env` values may contain `RELEASE_NAME`, replaced with the current
release name. Secret values belong in `secretRefs`, existing Secret mounts, Vault
CSI or External Secrets, never inline environment values or these examples.
Accounts, Billing and Content default to consume the same existing
`web-saas-secrets` Kubernetes Secret through `envFrom`. GitOps/ESO owns the
Vault field mapping. Keep this shared Secret limited to the shared token; do not
put PostgreSQL role credentials or service-specific OAuth/payment credentials
in it, because every consumer can read every key in the Secret.

## Local rendering and installation

```bash
.github/scripts/web-saas-charts.sh build
.github/scripts/check-web-saas-charts.sh

# reviewed-images.yaml and reviewed-secrets.yaml are environment-owned overlays.
helm template example oci/charts/distributed-web-saas-fullstack \
  --namespace example-sit --kube-version 1.32.0 \
  -f oci/charts/distributed-web-saas-fullstack/values-open.yaml \
  -f reviewed-images.yaml -f reviewed-secrets.yaml

# Append values-grouped.yaml or values-single-container.yaml when desired.
# Install only after the rendered resources and runtime image contracts are accepted.
helm upgrade --install example oci/charts/distributed-web-saas-fullstack \
  --namespace example-sit --create-namespace \
  -f oci/charts/distributed-web-saas-fullstack/values-open.yaml \
  -f reviewed-images.yaml -f reviewed-secrets.yaml
```

The local example uses HTTP and `*.localhost`. K3s operators must first ensure
its built-in Traefik/ServiceLB is not already claiming the selected ingress
address and ports. The chart does not alter cluster controllers.
For production set `global.environment: prod`, `global.expectedNamespace` to
the chosen non-default release namespace, `caddy.httpOnly: false` and existing
TLS Secret names for each declared host. Runtime Secret references are required
for enabled backend services. TLS Secrets use `tls.crt`/`tls.key`; Caddy runs as UID 1000 and retains only NET_BIND_SERVICE (required by the
official binary file capability). Caddy has no
DNS provider token or automatic certificate issuance in this delivery mode.

Caddy handles auth/admin prefixes before the core API fallback. Its private
ClusterIP listener also serves the Router's same-origin API calls. The dedicated
Billing host preserves direct Billing ingress; Gateway core owns any Billing
API dispatch through Accounts/Console paths. Set `caddy.frontendService: console`
for the single-container profile, otherwise `frontend-router`.
`caddy.gatewayEnabled` must match `edgeGateway.enabled`.

Each public service route accepts one primary host and a separate aliases list:
`caddy.routes.consoleHost` / `consoleAliases`, `accountsHost` / `accountsAliases`,
and `billingHost` / `billingAliases`. Aliases render the same service-specific
handlers and share that service's TLS Secret. `caddy.additionalHosts` supports
`aliases` for Vault and Grafana upstreams. Use `serviceRole: console` for an
additional Console hostname with its own TLS Secret; it receives the same API
and frontend handlers as the Console route. Generic additional hosts require an
`upstream`. DNS CNAMEs do not rewrite HTTP Host;
each desired alias therefore must appear in these values. This chart only
renders routes and never changes DNS.

## Data and access

PostgreSQL is a single-replica StatefulSet with a headless governing Service and
a private client Service. It requires a reviewed image, existing password Secret,
and an explicit StorageClass or restored existing PVC. The image's entrypoint
must implement the configured `POSTGRES_*`/`PGDATA` contract; mounts and PGDATA
are configurable. Generated PVCs retain data when the StatefulSet is removed or
scaled. Backup labels mark inventory only; they do not execute a backup.
Perform backups, restore drills and `migratectl` outside Helm lifecycle hooks.

`stunnelClient` and `stunnelServer` are separate independently installable child
charts, disabled by default. Each has its own image, replicas, scheduling,
certificate identity and enable switch. A role requires an image with a `stunnel`
binary and an existing Secret containing `ca.crt`, `tls.crt`, `tls.key`. Both roles
verify certificate chains; the client additionally requires `checkHost`, and the
server requires an explicit source CIDR list and client certificates. Private keys
are mounted 0440 with fsGroup 1000. Client/server Pods receive only their own
identity. Their Services remain ClusterIP; any cross-cluster connectivity or
external tunnel exposure requires separately reviewed IaC/network controls.
A stunnel TCP probe checks the listener, not successful remote database TLS access.

Application and database ingress NetworkPolicies allow only selected same-release
Pod traffic; CNI enforcement is a cluster prerequisite. Independently installed
standalone releases require a reviewed inter-release NetworkPolicy design
(or disabling the bundled policy while supplying that design). There is no
cluster-wide RBAC, Docker access, sudo, DNS mutation or Flux bootstrap here.
Flux is installed separately and consumes the published chart through GitOps.

## Validation and release

The PR workflow checks independent, grouped and single-container rendering,
Services/selectors/ports, HPA, PVC retention, tunnel identities, rejection cases,
three identical renders, real Caddy configuration validation, Kubernetes API
schema validation and the packaged umbrella's dependencies. This is
render-level determinism, not three live deployment/migration rounds.
`release-oci-charts` publishes each child/library and the umbrella, retaining a
source SHA/package checksum manifest. New Web SaaS OCI versions cannot be
replaced with changed contents; bump the changed chart and all affected dependency
versions/locks. Publishing does not trigger UAT or production deployment.

Runtime adapters, live Kubernetes rollout, image pulls, Secret existence,
Caddy DNS/TLS, database restore/migration and business acceptance are separate
NOT_RUN gates until executed with reviewed environment inputs.

The full design is in [HELM-SUBCHART-PLAN.zh.md](HELM-SUBCHART-PLAN.zh.md).
