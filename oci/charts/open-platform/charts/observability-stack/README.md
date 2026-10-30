# Observability Stack Chart

This chart deploys the metrics, logs, traces, collector, and Grafana services. It does not create public DNS records or an ingress. `grafana.rootUrl` configures Grafana's externally visible URL and should match the hostname served by the separately managed ingress. `domain` is only a fallback for the in-cluster Grafana URL when `grafana.rootUrl` is unset.

The umbrella `open-platform` chart keeps this subchart independently configurable through `observability-stack.grafana.rootUrl` and `observability-stack.domain`. The Web SaaS Caddy ingress is managed by the independent `distributed-web-saas-fullstack` chart.

## Container resource budgets

The Deployment assigns explicit Kubernetes requests and limits to VictoriaMetrics, VictoriaLogs, VictoriaTraces, the OpenTelemetry Collector, and Grafana. Each component can be tuned independently with `<component>.resources`; the optional plugin installer uses `grafana.pluginInstallerResources`. Review the sum of these per-container values against node allocatable capacity and co-located workloads before rollout.


## Canonical kubelet/cAdvisor ownership

`telemetry.kubernetes.metricGroups` explicitly selects kubeletstats groups. The default remains `[node, pod, container, volume]` for backwards compatibility. Empty, unknown or duplicate groups are rejected when collection is enabled. This parameter does not disable OTLP or span metrics.

When another canonical scraper collects raw `/metrics/cadvisor`, select `[node, pod, volume]` to avoid receiving container metrics twice. In the pinned OTel receiver, `container.memory.working_set` is enabled with byte units and exports as `container_memory_working_set_bytes`, also present in raw cAdvisor. Keep the `node` group and the kubeletstats receiver in the metrics pipeline so existing `k8s_node_*` overview queries retain their source. This configuration contract is not evidence of fresh runtime metrics; confirm series identity/counts and freshness after the separately authorized rollout.

Reference: [pinned OTel kubeletstats metadata](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/v0.114.0/receiver/kubeletstatsreceiver/metadata.yaml).
