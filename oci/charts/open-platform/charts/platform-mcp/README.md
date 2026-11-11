# platform-mcp

The platform MCP stack as one chart, published on its own (`oci://ghcr.io/ai-workspace-infra/platform-mcp`)
and as the `platform-mcp` subchart of `open-platform`. Every server is an independent Deployment and
Service with its own toggle:

| Toggle | Default name | Port | Inbound auth |
|---|---|---|---|
| `gateway.enabled` | `infrastructure-mcp-server` | 8080 | `MCP_SERVICE_TOKEN` |
| `sshMcpServer.enabled` | `ssh-mcp-server` | 3000 | `SSH_MCP_HTTP_TOKEN` (always required) |
| `victoriametrics.enabled` | `victoriametrics-mcp-server` | 8088 | `MCP_AUTH_TOKEN` |
| `victorialogs.enabled` | `victorialogs-mcp-server` | 8083 | none upstream: `auth-proxy` sidecar (Caddy) checks the bearer token, server on 127.0.0.1 |
| `victoriatraces.enabled` | `victoriatraces-mcp-server` | 8082 | none upstream: `auth-proxy` sidecar, as above |

The gateway's `config.json` backend list is generated from these toggles; backends released by other
charts (for example `grafana-mcp-server` from the grafana chart) go in `gateway.extraBackends`. The
gateway pod restarts automatically when the generated config changes (`checksum/config`).

## Auth

`global.mcp.bearerToken` (`enabled: true`, Secret `platform-mcp`, key `mcp-service-token`) is the one
token for every MCP server and the gateway, the same global value the grafana chart reads. It is on
by default and rendering fails if it is on with no Secret named, so no MCP endpoint is served without
auth. Only the gateway can be exposed (`gateway.ingress`); backends are ClusterIP and, with
`networkPolicy.enabled` (default), accept traffic from gateway pods only. Every backend also checks the token itself: VictoriaMetrics
and ssh natively, VictoriaLogs/Traces through the `auth-proxy` sidecar (`authProxy`), and the gateway
sends it to each backend (`bearer_token_env`). The ssh private key is read
from `sshMcpServer.privateKey` (Secret defaults to the bearer token Secret, key `ssh-private-key`).

## Autoscaling

One VPA policy for every workload (`vpa`), 1 replica, HPA template off by default (`hpa`).
