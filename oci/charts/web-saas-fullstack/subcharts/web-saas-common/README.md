# web-saas-common

Helm library chart containing shared workload, Service, HPA, naming and ingress
NetworkPolicy templates. It emits no resources on its own. Application charts
pin this library through local versioned dependencies and Chart.lock files.

Group assignments must cover each boundary exactly once. Containers sharing a
Pod must have unique listener ports. Each boundary retains its ClusterIP Service;
services target numeric container ports and select the group Pod. Probe port
`primary` resolves to that component's configured port. Images require sha256
pins. Published versions are immutable; bump the library and dependent chart
versions together when changing shared templates.
