# Vault and Zitadel Database Chart

This chart is a development-oriented Vault and Zitadel database bundle. It does not create public DNS records or an ingress. `vault.apiAddr` optionally sets Vault's advertised API URL for an independently managed ingress; leave it empty when the Vault service is cluster-internal. Do not use this development chart as a substitute for the separately managed PROD Raft Vault deployment.
