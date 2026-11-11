# content

Independent content workload. Disabled by default. Supply `enabled: true`, digest-pinned images, probes and resources before installation. The workload defaults to consuming the existing `web-saas-secrets` Kubernetes Secret; GitOps/ESO owns creation and field mapping. V6 consolidates runtime and OAuth configuration in the shared runtime source. Since `secretRefs` imports every key, this workload can read every field in the shared Secret. No secrets or Vault resources are created by this chart.

Build local dependencies with `helm dependency build .`; validate with `helm lint .` and `helm template example . -f reviewed-values.yaml`. Resource names use the release name and component identity; services are ClusterIP. See the umbrella README for profiles and configuration ownership.
