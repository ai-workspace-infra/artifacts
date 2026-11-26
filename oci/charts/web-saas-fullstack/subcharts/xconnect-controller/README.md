# web-saas-xconnect-controller

Independent Go control-plane workload for XConnect Zero Overlay (`xconnect-controller`), split out from `web-saas-accounts`.

- Health probe: `/healthz`
- Readiness probe: `/readyz` (PostgreSQL connectivity)
- Required secrets in production: `accounts-db-runtime`, `web-saas-secrets` (`XCONNECT_OVERLAY_SIGNING_*`, `INTERNAL_SERVICE_TOKEN`)
