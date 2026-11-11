# grafana

Grafana as an independent Helm release, split out of `observability-stack` so it can be
sized, upgraded and rolled back on its own.

- One Deployment, default 1 replica, VPA (only where the VPA API exists) and an HPA template disabled by default.
- Default resources: requests 256Mi / limits 1Gi memory. VPA uses `RequestsOnly` with `minAllowed.memory: 256Mi`, so the limit stays as configured.
- `disablePlugins` turns off built-in backend data source plugins the platform does not use (each otherwise runs as its own `gpx_*` process inside the container). `prometheus`, `jaeger` and `victoriametrics-logs-datasource` cannot be disabled.
- Data sources point at the VictoriaMetrics/Logs/Traces services of an `observability-stack` release (`backendFullname`).

## Moving Grafana out of an existing observability-stack release

1. Set `grafana.enabled: false` on the `observability-stack` release (chart >= 1.5.1).
2. Install this chart with:
   - `persistence.existingClaim: <observability-stack fullname>-data` and `persistence.subPath: grafana` to keep the existing Grafana database;
   - `service.aliases: [<fullname>, <fullname>-grafana]` so callers of the old Service names keep working.
3. With Flux, make the Grafana HelmRelease `dependsOn` the observability-stack release so the old Deployment and Services are removed before the new release takes the names over.

## MCP access

This chart contains only the Grafana UI/API service. The read-only
[mcp-grafana](https://github.com/grafana/mcp-grafana) server is deployed by the separate
`platform-mcp` chart, which connects to this Grafana service with a dedicated Viewer service-account
token and exposes the tool through its authenticated gateway. See the `platform-mcp` chart README for
its `grafanaMcpServer` settings. The MCP service uses Streamable HTTP at `/v1/grafana/mcp` behind the
gateway. Grafana reporting and update checks remain off by default.
