# Reusable observability-agent

Deploy this chart as an independent HelmRelease. It contains independently selectable Node Exporter, kube-state-metrics, process exporter and Vector components; it does not deploy an Observability server. Cluster identity, endpoints and activation policy belong in GitOps values.

## Components and compatibility

| Values | Default | Role |
| --- | --- | --- |
| `nodeExporter.enabled` | true | Existing per-node exporter; `hostMetrics`/`hostNetwork` default false preserve the old container-only profile |
| `kubeStateMetrics.enabled` | false | One metadata collector with dedicated list/watch ServiceAccount |
| `processExporter.enabled` | false | One non-root host-process exporter per Linux node |
| `vector.enabled`, `vector.mode` | true, console | Legacy local Node scrape→console; relay is explicitly configured and never a silent default |

For a host Kubernetes profile enable Node `hostMetrics`, review/enable its `hostNetwork`, enable KSM/process, and disable console Vector when an existing server already scrapes those sources. The KSM/process defaults remain off in the parent Open Platform umbrella. Agent chart 1.1.0 is published separately; umbrella chart and its local dependency are versioned together to avoid overwriting immutable existing packages.

### Security and signal scope

All containers run non-root with dropped capabilities, no privilege escalation and read-only root filesystems. KSM alone receives a Kubernetes API token; its dedicated RBAC only allows list/watch on the reviewed nodes/namespaces/pods/services/PV/PVC/apps resources. Secrets and ConfigMaps are neither collected nor authorized. The collector is a service identity, not the independent audit identity.

Node host metrics require explicit read-only `/proc`, `/sys` and `/` mounts, with HostToContainer propagation for root filesystem mount statistics. Accurate host network counters require the separately explicit hostNetwork exception. Node never uses hostPID or a runtime socket. `listenOnNodeIP=true` binds only the Downward API host IP; otherwise `listenAddress` is configurable. With hostNetwork the metrics port is exposed on the node network and namespace NetworkPolicy may not constrain it. Verify the actual listener, node exposure and approved collector path; this chart never changes cloud or host firewalls. Before activation, check for an existing host exporter/Vector owner and listening port conflicts; choose one canonical producer/scrape path instead of starting duplicates. The legacy no-host-mount profile must not be called full host telemetry.

Process exporter only mounts `/proc` read-only and does not use hostPID/hostNetwork/privileged/root or API access. Group labels use `Comm`, not argv/environment/capture groups. smaps/threads/children are disabled. Host hidepid, ownership and LSM may restrict data: upstream explicitly states unreadable I/O becomes zero. The default non-root scrape policy therefore drops ownership-sensitive I/O/fd series and retains `namedprocess_scrape_errors`, `namedprocess_scrape_partial_errors` and `namedprocess_scrape_procread_errors`. A healthy HTTP endpoint is not proof that every host process is visible. Do not fix visibility by changing permissions or adding root. NetworkPolicy only enforces isolation when supported by the CNI; the process default permits same-namespace scrape and no egress, with a narrower collector selector available.

These hostPath/hostNetwork exceptions require namespace admission review; this chart does not weaken Pod Security admission or change host permissions. Run a real identity/read/denial check separately; template assertions do not establish production least privilege.

## Local server scrape contract

Use one existing collector/server to scrape KSM, Node/process Pod endpoints, and kubelet `/metrics` + `/metrics/cadvisor`. Every scrape must label `cluster`, `environment`, `node` (where applicable) and preserve namespace/pod/container dimensions. Node/process `instance` should be the real Kubernetes node name, not the exporter Pod IP. Set Node `nodename` to that same node name for the existing Node dashboard. KSM exposes metadata; cAdvisor provides container CPU/memory/network/filesystem and kubelet provides volume signals. No recording rules are required by the accompanying StarsL K8s dashboard. Node/process metrics need separate checks against their existing dashboards.

Direct kubelet scrape uses the collector ServiceAccount token and verified CA, never API proxy or an insecure TLS fallback. Kubelet serving-certificate/IP SAN trust must be proven on the real cluster. If it fails, repair that trust through the owning path rather than turning off verification.

## Optional cross-cluster Vector relay

Set `vector.mode=relay` and explicitly supply `vector.relay.*`. One relay Deployment reads the existing source VictoriaMetrics `/federate`, scoped by **exact** source cluster/environment and a metric-name allowlist, with `honor_labels=true`. This is a 30-second real-time resampling of already collected latest metrics, not per-sample forwarding or historical replay. It does not scrape exporters a second time.

The source request has bounded `max_lookback` and a filter rejects old/future timestamps and foreign identities before `prometheus_remote_write`. Source timestamps, `instance` and resource labels remain unchanged. The filter runs before buffering; delayed delivery retains original timestamps and must not be interpreted as fresh on the remote backend. Remote freshness must be queried by sample timestamp, not receive time or relay process health. Source stoppage and 30-minute continuity remain deployment acceptance tests.

Remote URL must be explicit HTTPS without credentials. Bearer/basic auth is injected with SecretKeyRef (`existingSecret` and configurable key names), with certificate/hostname verification always on and optional CA Secret. Source credentials are not supported in URLs; add a reviewed source-auth adapter separately if needed. Runtime credentials must come from the authorized Vault path; no Secret values are supplied by this chart.

Reject same source/remote authority and declared source aliases. `distinctBackendAcknowledged=true` is also required after independent verification of DNS aliases and actual backend identity; string checks cannot prove two hostnames address different stores. Do not relay a source that already includes the remote cluster, or write into the source backend. Remote target is not configured in the supplied cluster profile, so relay remains off. Memory buffering is bounded and is not a durable lossless queue.

## Verification

```sh
helm lint oci/charts/open-platform/charts/observability-agent
python3 .github/tests/test_observability_agent_chart.py
OBS_AGENT_RUNTIME_TESTS=1 python3 .github/tests/test_observability_agent_chart.py
```

The explicit runtime option uses the pinned Vector 0.41.1 image in an isolated non-root Docker container to validate the rendered config and test fresh/stale/foreign-cluster events. It is not target-cluster acceptance. Before rollout, prove one expected Node/process exporter per node, KSM list/watch without Secrets/ConfigMaps access, fresh `kube_node_info`, `node_uname_info`, `namedprocess_namegroup_num_procs` and container metrics, relevant error counters, and no duplicate series. For an existing process dashboard, check `namedprocess_namegroup_cpu_seconds_total`/`instance` independently of the K8s dashboard.

Upgrade/recovery: publish a reviewed new chart version, verify package/source and registry digest, pin the standalone HelmRelease, activate the expected scope, then verify source/data/denial and continuity. Roll back that release and its scrape config to previous immutable refs; keep backend data. Do not delete volumes, change DNS, transfer writers or rebuild the cluster.

Upstream references: [kube-state-metrics](https://github.com/kubernetes/kube-state-metrics), [Node Exporter](https://github.com/prometheus/node_exporter), [process-exporter v0.8.7 permissions](https://github.com/ncabatoff/process-exporter/blob/v0.8.7/README.md), [Vector 0.41.1 Prometheus parser](https://github.com/vectordotdev/vector/blob/v0.41.1/src/sources/prometheus/parser.rs), [Vector scrape](https://vector.dev/docs/reference/configuration/sources/prometheus_scrape/), [VictoriaMetrics federation](https://docs.victoriametrics.com/victoriametrics/#federation).
