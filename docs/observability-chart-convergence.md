# Observability Chart convergence and K3s delivery

Status: implementation and migration preparation; no live migration or data acceptance is established by this document.

Tracking: [GitOps parent #564](https://github.com/ai-workspace-infra/gitops/issues/564), [Artifacts convergence #226](https://github.com/ai-workspace-infra/artifacts/issues/226), [remaining node-log migration #227](https://github.com/ai-workspace-infra/artifacts/issues/227).

## Canonical ownership

New collection features belong in `oci/charts/open-platform/charts/observability-agent`; server-side storage, receive/query pipelines and Grafana belong in its sibling `observability-stack`. They are independently versioned OCI Charts and independently selected HelmReleases. The `open-platform` umbrella can compose them, but a cluster does not need to install the whole umbrella to install an agent.

`oci/charts/observability` is a compatibility composition: it emits child Flux HelmReleases and native Vector/process-exporter resources. It is not a third canonical implementation. Its complete directory remains byte-for-byte unchanged in this convergence change, including Chart version `0.1.0`; do not republish changed contents under that version. Its surviving consumers, resource identities and data are preserved. New features must not be implemented a second time there.

The separate `oci/charts/infra-platform/charts/observability` scaffold is another path with the same basename. It is not the compatibility Chart discussed here and is not implicitly migrated.

### Component and values map

| Compatibility composition input | Canonical owner | Mapping and limit |
| --- | --- | --- |
| `server.prometheus` | stack | Metrics scraping/querying is provided by VictoriaMetrics and `telemetry.extraScrapeConfigs`. Do not add another Prometheus storage server solely to preserve the old topology. Existing Prometheus data and rule semantics require separate validation. |
| `server.victoriaMetrics` | stack | `victoriaMetrics.*`, `persistence.*`, service metrics port. Old upstream-chart values are not a drop-in values file. |
| `server.victoriaLogs` | stack | `victoriaLogs.*`, OTLP/log ingestion and log-query datasource. Existing storage paths and retention must be reconciled. |
| `server.victoriaTraces` | stack | `victoriaTraces.*`, OTLP receiver/export and Jaeger query path. Keep history and retention decisions explicit. |
| `server.grafana` | stack | `grafana.*`, existing Secret references, provisioned datasources and Dashboard providers. Canonical stack includes Grafana even when the old optional Grafana was disabled; this is a topology change, not a transparent upgrade. |
| `server.otelConnector` | stack | Existing `otelCollector.*`, OTLP pipelines and `telemetry.*`; an old debug-only exporter is not a production-delivery requirement. |
| `agent.nodeExporter` | agent | `nodeExporter.*`; true host metrics and host-network exceptions must be explicitly selected and checked for duplicate collection/port collisions. |
| No KSM in old composition | agent | Optional `kubeStateMetrics.*`, least-privilege metadata collection. The StarsL Dashboard requires KSM plus kubelet/cAdvisor, not Node Exporter alone. |
| `agent.processExporter` | agent | Optional `processExporter.*`; bounded process grouping and read-only proc mount. Do not carry forward the old blanket `hostPID: true` or default-root assumptions. |
| `agent.vector` metrics forwarding | agent | Optional Vector metric relay with explicit source/scope, remote endpoint, TLS and existing Secret references. Federation is resampling of current samples, not historical replay. |
| `agent.vector` journald-to-VictoriaLogs | agent, **not migrated** | Follow-up #227 verifies actual image/journal reader, identity/group/ACL, bounded host mounts, protocol/authentication and real log delivery. The metric relay does not migrate logs. |
| `extraObjects` | owning Chart or GitOps | Do not copy the arbitrary-object escape hatch into the canonical Charts. Classify each actual object: generic required implementation belongs in the appropriate Chart; environment intent belongs in GitOps. |
| `namespaces.observability`, nested release/sourceRef/chart selectors | GitOps | Namespace, source pin and release selection belong in separate GitOps HelmRelease declarations. Canonical Chart defaults must not embed environment addresses. |

Canonical stack is currently one Deployment with shared persistent storage subpaths. The compatibility composition creates independent child releases and PVCs. A values rename cannot preserve those data identities. Never uninstall the old release or delete/reattach PVCs as an automatic consequence of this consolidation.

There is also a source-code gap: canonical stack currently lists `telemetry.kubernetes.logs` and `telemetry.kubernetes.journald` values, but its templates do not consume those keys. Their presence is not evidence of node-log collection. Host journals belong on the node-side agent, not on the centralized storage Pod.

## Declared consumers and pin evidence

The audit baseline is Artifacts `3578f32` and GitOps main `c0742e1` on 2026-10-25. These are source observations, not proof of live reconciliation.

| Repository entrypoint | Reachable declaration | Classification |
| --- | --- | --- |
| GitOps `environments/clusters/prod` | `observability-kustomization.yaml` → `services/observability` → OCI `x-evor/observability`, semver `0.1.0` | Surviving compatibility consumer. Its declaration blocks removal even though V5 uses another path. |
| GitOps `environments/clusters/prod-web-saas-k3s-v5` | `platform-observability-kustomization.yaml` → `services/platform-observability/prod` → `release.yaml` | Canonical stack; the new agent is a separate release, not a sidecar added to this stack. |

Playbooks' old `stable/observabilityagent` and `stable/observableserver` installers reference different historical packages. Do not infer that moving these OCI Charts migrates those installers.

### Main is not the selected deployment ref

The main-branch V5 `source.yaml` declares `platform-config-prod` at immutable tag `v2026.10.25.3` with a one-minute source interval; its child Kustomization runs every five minutes. Therefore, **merging into main and waiting five minutes does not promote this cluster**.

The tag resolves to GitOps commit `78c49d92f2be6078b83f88097e9f4ea5295055ff`. Its stack pin is the earlier Chart 1.1.1 digest `sha256:6c9edd8ad04a06ec73ea0a6967e6653c4e1f1048487b88c7e5e9a43c077f7174`, and its collector identity still limits node resource names to `localhost`. GitOps main instead contains Chart 1.1.3 digest `sha256:f1dfc78977c8726f7d5b5a0519f1410c8ea0943d4c5465e1959feac3aac9fc40` and the updated identity.

Evidence: [fixed tag source](https://github.com/ai-workspace-infra/gitops/blob/78c49d92f2be6078b83f88097e9f4ea5295055ff/environments/clusters/prod-web-saas-k3s-v5/source.yaml), [fixed tag stack pin](https://github.com/ai-workspace-infra/gitops/blob/78c49d92f2be6078b83f88097e9f4ea5295055ff/services/platform-observability/prod/release.yaml), [fixed tag node identity](https://github.com/ai-workspace-infra/gitops/blob/78c49d92f2be6078b83f88097e9f4ea5295055ff/services/platform-observability/prod/collector-identity.yaml).

A later manual promotion may have changed the live source. The live Source artifact revision, Kustomization applied revision, HelmRelease status and actual Pod images must be read through the real audit identity before claiming which pin is running. This document does not report those live values.

## Read-only declaration preflight

Use the local graph checker on a **clean, fixed-ref GitOps worktree**, not the user's unrelated dirty checkout:

```sh
python3 .github/scripts/observability-chart-preflight.py \
  --gitops-root "$GITOPS_WORKTREE" \
  --entrypoint environments/clusters/prod \
  --source-name platform-config \
  --assert-no-legacy-callers
```

For the audited legacy entrypoint the assertion must exit `1` and identify the reachable old HelmRelease. For V5, select `environments/clusters/prod-web-saas-k3s-v5` and `--source-name platform-config-prod`. A `PASS` only means no reachable compatibility-chart caller was found in that selected declaration graph; `runtime_migration_acceptance` remains `NOT_RUN`.

The tool follows only explicitly selected local GitRepository names, checks paths stay within the repository and fails the assertion on unresolved paths/sources, remote Kustomize resources or unsupported render-time modifiers. It does not evaluate Kubernetes runtime state, load credentials, render Helm, execute Kustomize plugins or write resources. Render-time modifications require a separately reviewed rendered graph; a partial traversal must not produce a green assertion.

Before removal run it for every supported cluster entrypoint, not just V5. Also inventory actual installed releases, PVCs, schedulers, consumers and external repositories; absence in this local Git graph is insufficient to prove retirement safety.

## K3s-v5 first deployment

1. Merge reviewed producer changes through the ordinary required checks/reviews. Publish the new agent Chart only via Artifacts' existing `release-oci-charts` workflow, which now must package the agent independently. Record its source SHA, Chart version, OCI digest and verified package contents. A local `helm package` digest is not evidence of a published OCI manifest digest.
2. In GitOps, declare the agent as a separate OCIRepository/HelmRelease, pin the published digest, and select the target namespace, cluster/environment labels and optional components. Keep remote Vector forwarding disabled until a real different destination and runtime credentials are selected. Retain the existing stack and storage release.
3. Render the agent, stack scrape configuration and target overlay together. Verify the Node/process targets use real Kubernetes node identities, kube-state-metrics has only the required resources, kubelet/cAdvisor is scraped, and there is one canonical scrape path. Check existing Node Exporter/port 9100 usage before enabling a host-network exporter.
4. Merge the consumer declaration only after its producer exists and required checks/reviews pass. Publish/select a new immutable GitOps release through the existing production promotion process, then promote the target Source through its owning bootstrap/delivery process. Do not move an old tag or use a bare `kubectl patch` to route around promotion.
5. Let Flux reconcile the selected ref. A manual reconcile is an optional authorized operational action, not a substitute for source promotion. Do not use `helm upgrade` or `kubectl apply` as a competing delivery path.
6. Verify the live result as below. Until this evidence exists, report “implementation/declaration ready; deployment and data acceptance NOT_RUN.”

### Candidate agent activation checklist

The companion agent implementation proposes Chart `1.1.0` (umbrella `1.2.4`), GitOps OCIRepository `observability-agent-chart` and HelmRelease `platform-observability-agent`, with values in `services/platform-observability/prod/agent-values.yaml`. These are candidate references, not evidence of published artifacts or an installed release. Both the candidate source and release are suspended until publication and digest verification.

The companion `agent-scrape-values.yaml` is an inactive activation patch. The activation PR must merge its reviewed scrape jobs into the canonical stack values, or deliberately add a dedicated ConfigMap and `valuesFrom` reference. Merely unsuspending the agent does not connect its exporters to storage. Verify the rendered stack includes the actual KSM/Node/process/kubelet scrape jobs, then remove both suspensions in the same reviewed activation scope after the published digest is pinned. Promote the selected immutable GitOps source as described above.

The Node Exporter target explicitly requests read-only host proc/sys/root mounts and host networking for real host metrics. Check host-IP binding, existing port 9100 usage and host-level exposure; a namespace NetworkPolicy may not protect host-network traffic. The process exporter requires a read-only host proc mount and verifiable non-root process visibility, not hostPID or a service-account token. KSM reads only the selected resource kinds; no Secret/ConfigMap inventory permission is required.

## Read-only live verification

Set an explicit context for the target; never rely on the current context. This session's local context inventory contained only OrbStack, which is not V5. Use a separately scoped audit identity; do not copy a management kubeconfig into the agent or call an administrator's read-only command proof of audit isolation.

```sh
kubectl --context "$KUBE_CONTEXT" -n flux-system get gitrepository platform-config-prod
kubectl --context "$KUBE_CONTEXT" -n flux-system get kustomization platform-observability-prod
kubectl --context "$KUBE_CONTEXT" -n "$OBS_NAMESPACE" get helmrelease
kubectl --context "$KUBE_CONTEXT" -n "$OBS_NAMESPACE" get deployment,daemonset,pod
```

Read the selected Source ref/artifact revision, Kustomization `lastAppliedRevision` and conditions, HelmRelease source/config revision and observed generation, workload desired/ready counts, restart changes and actual image IDs through approved status reports. Do not dump Secrets, raw environment variables, complete ConfigMaps or unrestricted logs into acceptance output.

Through the approved Grafana/datasource query identity, check:

- Each configured exporter `up` target corresponds to an intended node or KSM instance, with no duplicate node identity.
- Real `node_uname_info`, `kube_node_info` and `namedprocess_namegroup_num_procs` samples exist under the selected `cluster`/`environment`; the process source is not merely a healthy HTTP server with no readable host processes.
- `container_cpu_usage_seconds_total` and `container_memory_working_set_bytes` have real `node`, `namespace`, `pod`, `container` labels. KSM is not a replacement for kubelet/cAdvisor.
- Last sample age is at most the agreed freshness threshold (the existing closure probe uses 180 seconds), and the last 30 minutes have no unexplained gaps. Confirm the datasource backend and resource counts rather than accepting an empty result or zero-fill.
- The original 17 Dashboard UIDs remain available and `StarsL_cn_K8S` is the eighteenth. Cluster/environment variable choices and representative Node, Pod, namespace and workload queries return the expected scope. PVC statistics are conditional on actual volume-plugin support.
- If Vector relay is enabled later, verify source cluster labels are preserved, source and destination are distinct, delivery failures/queues are visible and stopped source collection does not appear continuously healthy from stale federated samples. No historical completeness is implied by federation.

Record timestamp, exact target scope, source/Chart/image refs, run links, sample ages, target counts and sanitized results. Flux `Ready=True` establishes reconciliation, not metric correctness.

## Upgrade and rollback

An ordinary exporter/relay upgrade changes the **agent Chart version/digest and its release values only**. It does not require a stack upgrade, PVC move, database migration or full umbrella reinstall. An agent-source change still requires a new producer publication, GitOps pin and target Source promotion; follow the same staged verification as first deployment. Roll out one bounded service/target scope and retain its prior configuration.

A stack upgrade is a separate change: review image compatibility, Grafana provisioning/plugin changes, persistent storage format and recoverable backups before selecting its new digest. A configuration rollback does not restore data written in a new format. Never roll back writers by pointing them at a stale database or attach old volumes without a reviewed recovery procedure.

Rollback uses a reviewed GitOps revert selecting the previous **known-good immutable** agent or stack pin and values, followed by an approved Source promotion. Preserve current data and evidence. Do not force-move tags, uninstall the old composition, delete PVCs, send writes back to a retired host or broaden identity permissions when a rollback fails.

## Staged compatibility retirement

1. **Inventory:** preserve the old Chart and all consumer pins; produce per-cluster release/PVC/identity/data baselines. This document and preflight implement the declaration portion only.
2. **Canonical owners:** deliver the generic agent/exporter/optional relay features and use the existing stack; log migration #227 remains open. Do not claim node logs moved because OTLP receiving exists.
3. **Consumer trial:** use a separate validated environment and explicit old→new values/resource mapping. Restore and compare storage/history when history is in scope; verify current writers, service endpoints and data continuously before switching one consumer.
4. **Source promotion:** update each consumer through its reviewed GitOps owner process. Required identities, freshness, duplicate detection, real queries and recovery evidence must pass; otherwise retain the prior release.
5. **Remove old implementation:** only after every supported local/external consumer is proven switched, data/rollback requirements are accepted and the preflight no longer finds reachable old callers. Retirement is currently **BLOCKED** by the reachable legacy production declaration and unverified log/storage migration. The parent issue must remain open.
