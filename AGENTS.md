# artifacts Agent Constraints

Follow the [execution ownership standard](https://github.com/ai-workspace-lab/xworkspace-core-skills/blob/main/skills/engineering-standards/execution-ownership-migration/SKILL.md) and the repository's project-development standard for branches, releases, and PRs.

## Ownership

- This repository owns versioned source and packaging for OCI images and Helm charts.
- Helm chart desired values, environment topology, DNS intent, and secret references are owned by GitOps.
- Host configuration, service execution, and DNS/provider mutations are owned by Playbooks or IaC Modules.

## Allowed

- Change chart templates, schemas, chart values defaults, documentation, and chart-only validation or packaging workflows.
- Publish charts only through the reviewed OCI chart release workflow after merge.

## Prohibited

- Do not deploy charts, reconcile Flux, change public DNS, call cloud/provider APIs, or modify Terraform state from this repository.
- Do not add production hostnames, credentials, runtime addresses, or secret values to generic chart defaults.
- Do not combine independent charts into one chart unless the user explicitly asks for that composition.

## Generic artifacts and environment inputs

- Generic Dockerfiles, charts, packages and defaults must not branch on a deployment batch, node, cloud account, Flux root name or environment path. Generic ports, API versions and tool paths may be constants; concrete environment values belong in GitOps.
- GitOps selects the application version/digest. Infrastructure repositories may select `main` through dispatch and record the resolved commit; this does not require application artifacts to become mutable.
- Publish artifact version/digest, source commit, architecture and checksums. Never put credentials, private kubeconfigs, runtime CMDB or provider facts in public artifacts or receipts.
- Registry provisioning and cloud IAM belong to IaC; artifact upload/signing belong here; live installation and health checks belong to Playbooks/cluster execution. Packaging a script does not make its production execution an Artifacts responsibility.
- Keep schemas/templates/defaults generic and preserve declared field types. Environment fixtures are valid examples and must not be loaded as runtime configuration.
- For migrated code, complete owner implementation, caller cutover and verification before deleting the old entrypoint. Do not add generation-specific compatibility adapters or silent fallback paths.

Detailed contract: [declaration-and-handoff](https://github.com/ai-workspace-lab/xworkspace-core-skills/blob/main/skills/engineering-standards/execution-ownership-migration/references/declaration-and-handoff.md)。
