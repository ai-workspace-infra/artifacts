# Serverless frontend artifact ownership (Task 3)

Orchestrator base: `Platform-Orchestrator@dfdbc2cc` (origin/main at inventory time).

## Owner / caller

| Concern | Owner | Entry |
|---|---|---|
| portal static export + OpenNext SSR build, edge-asset merge, packaging, checksum, manifest | **Artifacts** | `.github/workflows/build-serverless-portal-frontend.yml` → `scripts/serverless/package-portal-frontend.sh` |
| artifact integrity / provenance check before deploy | control plane (Orchestrator) | `scripts/serverless/verify-frontend-artifact.sh` (copy-free: call from this repo at the resolved SHA) |
| `wrangler pages deploy`, `wrangler deploy`, Pages project create, Cloud Run deploy, DNS | IaC (Task 2) | — |
| artifact selection, dispatch, wait, receipt | Orchestrator (Task 6) | — |

## Contract

Inputs: `portal_ref` (40-char SHA or release tag; `main`/`latest`/`HEAD` rejected), `target_env`,
`ssr_boundaries` (`public content auth console workspace`), `static_cdn_url`, `account_service_url` (public values only).

Outputs (workflow artifact `portal-serverless-frontend-<env>-<sha12>`): `portal-static.tar.gz`
(already contains merged `_edge/<boundary>` assets and no `_redirects` SSR rules),
`portal-ssr-<boundary>.tar.gz` (`.edge-build/<boundary>` with `ACCOUNT_SERVICE_URL` baked into `wrangler.jsonc` vars),
`portal-edge-assets.tar.gz`, `artifact-manifest.json` (schema_version 1, source repo/ref/sha), `SHA256SUMS`.
Workflow outputs: `artifact_name`, `source_sha`, `manifest_sha256`. Tarballs are reproducible (sorted, mtime 0).

Credential boundary: the build fails if `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `INTERNAL_SERVICE_TOKEN`,
`VAULT_TOKEN` or `GOOGLE_APPLICATION_CREDENTIALS` are present. Consequence: blogs/docs/products content sections are
**not** in the artifact (`content_sections_included: false`). A content-bearing export needs a separately authorised
decision (open question for the user) — it is not silently enabled.

Not published: this PR uploads workflow artifacts only; no GHCR/Release/production promotion.

## Build segments to remove from Orchestrator (Task 2 / Task 6)

| File | Lines (at dfdbc2cc) | Build segment | Replacement |
|---|---|---|---|
| `scripts/serverless_uat/deploy_cloudflare_pages.sh` | 90–137 | `corepack`, `yarn install --immutable`, `yarn build:static-dashboard`, `_edge` merge | download + verify artifact, unpack `portal-static.tar.gz`; `_redirects` SSR entry rules are deploy-time routing → IaC deployer |
| `scripts/serverless_uat/deploy_portal_opennext_worker.sh` | 38–70 | `yarn install`, `yarn build:ssr:<b>`, `jq` rewrite of `wrangler.jsonc`, `collect-edge-assets.mjs` | unpack `portal-ssr-<b>.tar.gz`; `EDGE_ASSETS_OUT` hand-off disappears |
| `scripts/serverless_uat/deploy_cloudflare_worker.sh` | 23–26 | `npm ci` + edge-gateway `.github/scripts/deploy_boundary.sh` (build + deploy mixed in the edge-gateway repo) | follow-up: edge-gateway must publish a release asset like frontend-router; not changed here |
| `scripts/serverless_uat/deploy_frontend_router.sh` | 57 | `npm ci` before deploy | already consumes prebuilt release asset + SHA256SUMS (correct pattern); keep verification, `npm ci` only for wrangler tooling |
| `scripts/serverless_uat/deploy_cloudrun_services.sh` | 13, 41 | no build, but `IMAGE_TAG` defaults to `latest` | Task 2/6: require explicit image digest from the service's own image pipeline; reject `latest` |
| `.github/scripts/serverless/run_cloudflare_target.sh` | — | sole caller of the above | Task 6: call this workflow (or download its artifact by `artifact_name`) and pass `source_sha`/`manifest_sha256` into the receipt |

## Evidence

`bash tests/serverless/test_package_portal_frontend.sh` — isolated (fake portal + fake yarn/node, no network):
floating refs rejected, runtime credentials rejected, SHA mismatch rejected, unknown boundary rejected, happy path files,
account URL baked, edge assets merged, reproducible tarballs, tamper and wrong-ref detected. CI runs it on PR.
No real portal build, no deploy, no publish was executed.
