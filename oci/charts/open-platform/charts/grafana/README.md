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

## Optional mcp-grafana

`mcp.enabled: true` adds a read-only [mcp-grafana](https://github.com/grafana/mcp-grafana) server as its
own Deployment and Service `grafana-mcp-server` (`mcp.name`) (port 8000, SSE under `mcp.basePath`, default `/v1/grafana`).
It reaches Grafana through the in-cluster Service and reuses `existingSecret`/`adminPasswordKey`, so no
extra credential is defined. `--disable-write` and `--disable-admin` are on by default. It is covered by
the chart's shared `vpa`/`hpa` settings like the Grafana Deployment.

Inbound auth is on by default: `global.mcp.bearerToken` (`enabled: true`, Secret `platform-mcp`, key
`mcp-service-token`) makes the server require `Authorization: Bearer <token>`, so no MCP endpoint is
served without auth. The same global value is meant for every MCP server and the MCP gateway;
`mcp.bearerToken` overrides it for this server only. Rendering fails if auth is on and no Secret is
named; `global.mcp.bearerToken.enabled=false` turns it off explicitly (throwaway local clusters only).

Phone-home is off by default: mcp-grafana usage stats (`mcp.usageStats: false`, sets
`GRAFANA_USAGE_STATS=disabled` and `DO_NOT_TRACK=1`) and Grafana's own reporting and update checks
(`analytics.reportingEnabled` / `analytics.checkForUpdates`).