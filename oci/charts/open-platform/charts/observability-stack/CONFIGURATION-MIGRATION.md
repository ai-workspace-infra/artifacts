# Configuration-only Grafana migration

The chart supports datasource and app provisioning ConfigMaps, folder-specific projected dashboard ConfigMaps, a runtime Secret for environment-based credentials, and a bundle checksum that triggers rollout. Generate these declarations with Playbooks `platform/grafana_config`, review in GitOps and release through Flux. Never import the source Grafana database or production notification channels.

`grafana.plugins` uses exact `id@version` catalog pins. Custom unsigned plugins must be baked into a separately reviewed, digest-pinned Grafana image after archive checksum verification; `unsignedPlugins` accepts only exact IDs. No mutable URL installer is provided.

Keep the existing release/PVC, datasource UIDs and folder UIDs. The built-in Platform dashboard provider coexists with imported providers. Datasource and app credentials are references to the dedicated target runtime Secret, never source API secrets. Preserve the independent target admin credential.

Back up the target Grafana database consistently before a major upgrade. Rolling back the image alone does not reverse Grafana database migrations; restore the matching target database backup if necessary. Validate datasource queries, folder/dashboard identities, variable definitions and required plugin behavior after rollout. Historical source telemetry remains on the source.
