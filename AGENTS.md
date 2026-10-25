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
