# caddy

Single public HTTPS ingress with static Secret certificates. Disabled by default. Supply `enabled: true`, digest-pinned images, probes, resources and existing Secret references before installation. No secrets are created by this chart.

`routes.consoleHost`, `routes.accountsHost`, and `routes.billingHost` each accept a list of matching `*Aliases` hostnames. Aliases use the same service routing and TLS Secret as their primary host. `additionalHosts` supports an optional `aliases` list for extra upstreams such as Vault and Grafana. Set `serviceRole: console` to reuse the Console API and frontend routing with a separate TLS Secret; otherwise provide `upstream`. Every hostname is rendered as a distinct Caddy site and duplicate hosts fail chart rendering. DNS records are managed outside this chart.

Native Prometheus metrics can be enabled with `metrics.prometheus.enabled: true`. The chart enables Caddy's global metrics collection, serves `/metrics` on a separate port `9180`, adds a ClusterIP-only service and standard Prometheus scrape annotations to the Service and Pod. Environment NetworkPolicy must allow only the intended scraper to reach port `9180`. Metrics are disabled by default. The Admin API remains off, and the metrics listener is not added to the public ingress Service.

Build local dependencies with `helm dependency build .`; validate with `helm lint .` and `helm template example . -f reviewed-values.yaml`. Resource names use the release name and component identity; services are ClusterIP. See the umbrella README for profiles and configuration ownership.
