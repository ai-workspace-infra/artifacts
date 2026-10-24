# content

Independent content workload. Disabled by default. Supply `enabled: true`, digest-pinned images, probes, resources and existing Secret references before installation. No secrets are created by this chart.

Build local dependencies with `helm dependency build .`; validate with `helm lint .` and `helm template example . -f reviewed-values.yaml`. Resource names use the release name and component identity; services are ClusterIP. See the umbrella README for profiles and configuration ownership.
