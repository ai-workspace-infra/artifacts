# Observability Stack Chart

This chart deploys the metrics, logs, traces, collector, and Grafana services. It does not create public DNS records or an ingress. `grafana.rootUrl` configures Grafana's externally visible URL and should match the hostname served by the separately managed ingress. `domain` is only a fallback for the in-cluster Grafana URL when `grafana.rootUrl` is unset.

The umbrella `open-platform` chart keeps this subchart independently configurable through `observability-stack.grafana.rootUrl` and `observability-stack.domain`. The Web SaaS Caddy ingress is managed by the independent `distributed-web-saas-fullstack` chart.
