# workload-autoscaling

Canonical VPA/HPA helpers (`templates/_autoscaling.tpl`) and default values
(`values-snippet.yaml`). `scripts/sync_autoscaling_helper.py` copies the helper into
each chart and writes `templates/autoscaling.yaml`; `release-oci-charts.sh validate`
runs it with `--check`, so the copies cannot drift. Charts built on
`web-saas-common` get the helper from that library.

Defaults per chart:
- `replicaCount: 1` (single replica); `replicas` is omitted when `hpa.enabled`.
- `vpa.enabled: true`, `updateMode: InPlaceOrRecreate`, `minReplicas: 1`,
  `controlledValues: RequestsAndLimits`, bounds 10m/32Mi .. 1 CPU/1Gi. A VPA is only
  rendered when the cluster serves `autoscaling.k8s.io/v1/VerticalPodAutoscaler`
  (Helm capabilities), so clusters without VPA (e.g. PROD today) render nothing.
- `hpa.enabled: false` (template only): min 1 / max 3, CPU 80 % / memory 80 %.
  When an HPA scales a workload on CPU or memory, its VPA switches to
  `updateMode: "Off"` (recommendations only), so the two never fight.
  web-saas charts keep their per-workload `workload.autoscaling` HPA; the VPA yields to it.
