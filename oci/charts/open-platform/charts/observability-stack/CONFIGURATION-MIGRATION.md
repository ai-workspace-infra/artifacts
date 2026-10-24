# Configuration-only Grafana migration

The chart supports datasource and app provisioning ConfigMaps, folder-specific projected dashboard ConfigMaps, a runtime Secret for environment-based credentials, and a bundle checksum that triggers rollout. Generate these declarations with Playbooks `platform/grafana_config`, review in GitOps and release through Flux. Never import the source Grafana database or production notification channels.

`grafana.plugins` uses exact `id@version` catalog pins. Custom unsigned plugins use `pluginArchives` with exact ID/version, HTTPS release archive and SHA256. A digest-pinned unprivileged init container verifies checksum, package identity, bounded extraction and safe paths before Grafana starts; `unsignedPlugins` accepts only exact IDs. Archives install into an ephemeral volume; an unexpected package or digest blocks startup.

Keep the existing release/PVC, datasource UIDs and folder UIDs. The built-in Platform dashboard provider coexists with imported providers. Datasource and app credentials are references to the dedicated target runtime Secret, never source API secrets. Preserve the independent target admin credential.

Back up the target Grafana database consistently before a major upgrade. Rolling back the image alone does not reverse Grafana database migrations; restore the matching target database backup if necessary. Validate datasource queries, folder/dashboard identities, variable definitions and required plugin behavior after rollout. Historical source telemetry remains on the source.
