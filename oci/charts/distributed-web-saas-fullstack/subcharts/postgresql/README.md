# postgresql

Persistent PostgreSQL StatefulSet with retained claims. Disabled by default. Supply `enabled: true`, digest-pinned images, probes, resources and existing Secret references before installation. No secrets are created by this chart.

Build local dependencies with `helm dependency build .`; validate with `helm lint .` and `helm template example . -f reviewed-values.yaml`. Resource names use the release name and component identity; services are ClusterIP. See the umbrella README for profiles and configuration ownership.

## Independent `root`, `operator`, and `auditor` database identities

`identityAccounts.enabled` opts into three distinct PostgreSQL login roles. The role keys are a mapping convention across layers; they do **not** share Linux accounts, Kubernetes credentials, or authorization automatically:

| Identity key | Vault record alias | Chart role | Allowed scope |
|---|---|---|---|
| `root` | `admin` | Kubernetes Secret `postgresql-admin`; bootstrap PostgreSQL administrator. It initializes the server and identity reconciliation Job; never mount this Secret in application/exporter workloads. | Administrative DB access. The Linux/Kubernetes `root` identity is independently authenticated and authorized. |
| `operator` | `operator` | Kubernetes Secret `postgresql-operator`; non-superuser database operator. | DML only on explicitly listed tables and sequences; no role/DB creation or DDL. |
| `auditor` | `auditor` | Kubernetes Secret `postgresql-auditor`; non-superuser, non-inheriting read identity. | `SELECT` only on explicitly listed views; default transaction read-only and statement timeout are additional safeguards. |

The Secret records are synchronized by the environment's External Secrets declarations. This chart consumes only Kubernetes Secret names and keys; it does not call Vault or receive a Vault token. The `admin` record's password backs the chart's PostgreSQL bootstrap login (`identityAccounts.root.username`). The other two records back the corresponding DB roles and are consumed by a post-install/post-upgrade Job. Identity creation/rotation and Secret synchronization must complete before installing this mode.

Example values (Secret names are local Kubernetes objects; the environment's GitOps declaration chooses which approved Vault records populate them):

```yaml
identityAccounts:
  enabled: true
  root:
    username: root
    existingSecret: postgresql-admin
    secretKey: password
  operator:
    username: operator
    existingSecret: postgresql-operator
    secretKey: password
    tables:
      - { schema: accounts, name: users }
    sequences:
      - { schema: accounts, name: users_id_seq }
  auditor:
    username: auditor
    existingSecret: postgresql-auditor
    secretKey: password
    views:
      - { schema: audit, name: account_migration_summary }
```

Operator table/sequence and auditor view lists are exact allowlists. Empty lists grant only explicit database `CONNECT`; there is no `pg_read_all_data` or broad schema grant. Role names and object identifiers must use lower-case PostgreSQL identifiers. Auditor targets must exist as views or materialized views; their definitions still require data-owner review for redaction. On reconciliation, the Job refuses to take over pre-existing unmarked roles, roles with memberships, or roles owning objects; review those separately. It resets explicit privileges across user schemas, functions, and sequences for its managed roles before applying the allowlists. `PUBLIC` privileges and default ACLs are database-wide and must be reviewed separately; this chart alone cannot prove an auditor has no indirect read/write path.

The Job receives passwords through Secret-backed environment variables; passwords are not placed in chart values or process arguments. `psql` submits role-password statements over its database connection, so the Job disables PostgreSQL statement/duration logging for that session. Review server extensions/audit settings as well; external audit extensions can still capture role changes. The hook runs only on Helm install/upgrade. A Secret rotation therefore needs an explicit reviewed HelmRelease upgrade/reconcile to update PostgreSQL role passwords.

When `identityAccounts.enabled` and metrics are both enabled, configure a separate metrics login/Secret. The exporter must not reuse the root Secret or the auditor identity; monitoring privilege design is independent from migration/audit access.

## Mapping contract with host and cluster identities

The stable mapping keys `root`, `operator`, and `auditor` match the OS and K3s identity names so operations can trace a request across layers. Credentials, owners, and authorization remain separate: Linux SSH keys do not authenticate to PostgreSQL; K3s kubeconfigs/RBAC do not grant DB access; PostgreSQL roles do not grant host or Kubernetes privileges. The Vault record alias `admin` maps to the chart's `root` role explicitly; it is not renamed or treated as the Linux/Kubernetes root credential.
