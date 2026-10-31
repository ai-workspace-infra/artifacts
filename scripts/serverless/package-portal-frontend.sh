#!/usr/bin/env bash
# Build and package the portal Serverless frontend artifacts (static Pages
# export + OpenNext SSR boundaries) from an already checked-out, immutable
# portal ref. Owner: Artifacts. This script never deploys, never calls
# Cloudflare/GCP APIs and never reads runtime credentials.
#
# Inputs (env):
#   PORTAL_DIR          checked-out portal repository (required)
#   PORTAL_REF          release tag or commit SHA the checkout was made from (required)
#   SSR_BOUNDARIES      space separated subset of: public content auth console workspace
#   STATIC_CDN_URL      optional public CDN base (build-time public value)
#   ACCOUNT_SERVICE_URL optional https URL of the Accounts host (public value)
#   TARGET_ENV          environment label recorded in the manifest (required)
#   OUT_DIR             output directory (required, must be empty or absent)
# Outputs in OUT_DIR:
#   portal-static.tar.gz, portal-ssr-<boundary>.tar.gz, portal-edge-assets.tar.gz,
#   artifact-manifest.json, SHA256SUMS
set -euo pipefail

PORTAL_DIR="${PORTAL_DIR:?PORTAL_DIR must point to a checked-out portal repository}"
PORTAL_REF="${PORTAL_REF:?PORTAL_REF must be an immutable tag or commit SHA}"
TARGET_ENV="${TARGET_ENV:?TARGET_ENV must name the target environment}"
OUT_DIR="${OUT_DIR:?OUT_DIR must name the output directory}"
SSR_BOUNDARIES="${SSR_BOUNDARIES:-}"
STATIC_CDN_URL="${STATIC_CDN_URL:-}"
ACCOUNT_SERVICE_URL="${ACCOUNT_SERVICE_URL:-}"

die() { echo "package-portal-frontend: $*" >&2; exit 2; }

case "$PORTAL_REF" in
  main|master|latest|HEAD|"") die "PORTAL_REF must be immutable, got '${PORTAL_REF}'" ;;
esac
[[ "$PORTAL_REF" =~ ^([0-9a-f]{40}|(uat-daily-build-|daily-build-|v)[0-9][0-9A-Za-z._-]*)$ ]] \
  || die "PORTAL_REF must be a 40-char SHA or a release tag"
[[ "$TARGET_ENV" =~ ^[a-z][a-z0-9-]*$ ]] || die "TARGET_ENV must be a lowercase label"
for b in $SSR_BOUNDARIES; do
  case "$b" in public|content|auth|console|workspace) ;; *) die "unknown SSR boundary '$b'" ;; esac
done
if [[ -n "$STATIC_CDN_URL" && ! "$STATIC_CDN_URL" =~ ^https://[A-Za-z0-9.-]+(/[A-Za-z0-9._/-]*)?$ ]]; then
  die "STATIC_CDN_URL must be an https URL"
fi
if [[ -n "$ACCOUNT_SERVICE_URL" && ! "$ACCOUNT_SERVICE_URL" =~ ^https://[A-Za-z0-9.-]+$ ]]; then
  die "ACCOUNT_SERVICE_URL must be https://<hostname>"
fi
# Build must not see runtime credentials.
for v in CLOUDFLARE_API_TOKEN CLOUDFLARE_ACCOUNT_ID INTERNAL_SERVICE_TOKEN VAULT_TOKEN GOOGLE_APPLICATION_CREDENTIALS; do
  [[ -z "${!v:-}" ]] || die "$v must not be present in the build environment"
done
test -f "${PORTAL_DIR}/package.json" || die "PORTAL_DIR has no package.json"
if [[ -d "$OUT_DIR" && -n "$(ls -A "$OUT_DIR")" ]]; then die "OUT_DIR must be empty"; fi
mkdir -p "$OUT_DIR"
OUT_DIR="$(cd "$OUT_DIR" && pwd)"

source_sha="$(git -C "$PORTAL_DIR" rev-parse HEAD)"
if [[ "$PORTAL_REF" =~ ^[0-9a-f]{40}$ && "$PORTAL_REF" != "$source_sha" ]]; then
  die "checkout HEAD ${source_sha} does not match PORTAL_REF ${PORTAL_REF}"
fi
[[ -z "$(git -C "$PORTAL_DIR" status --porcelain)" ]] || die "portal checkout is dirty"

YARN="${YARN:-yarn}"
TAR_OPTS=(--sort=name --owner=0 --group=0 --numeric-owner --mtime=@0)
pack() { # pack <out.tar.gz> <dir> <path...>
  local out="$1" dir="$2"; shift 2
  tar "${TAR_OPTS[@]}" -C "$dir" -cf - "$@" | gzip -n >"$OUT_DIR/$out"
}

pushd "$PORTAL_DIR" >/dev/null
[[ "$YARN" != yarn ]] || corepack enable
"$YARN" install --immutable

edge_dir="$(mktemp -d)"
trap 'rm -rf "$edge_dir"' EXIT
boundaries_json='[]'
for b in $SSR_BOUNDARIES; do
  env -u CLOUDFLARE_ENV \
    PORTAL_DEPLOYMENT_ENV="$TARGET_ENV" RUNTIME_ENV="$TARGET_ENV" \
    NEXT_PUBLIC_STATIC_CDN_URL="$STATIC_CDN_URL" ACCOUNT_SERVICE_URL="$ACCOUNT_SERVICE_URL" \
    "$YARN" "build:ssr:${b}"
  test -f ".edge-build/${b}/wrangler.jsonc" || die "build:ssr:${b} produced no wrangler.jsonc"
  # Public Accounts host is a build-time value; bake it into the Worker vars so
  # the deployer does not have to rewrite the config.
  if [[ -n "$ACCOUNT_SERVICE_URL" ]]; then
    tmp="$(mktemp)"
    jq --arg u "$ACCOUNT_SERVICE_URL" '.vars = ((.vars // {}) + {ACCOUNT_SERVICE_URL: $u})' \
      ".edge-build/${b}/wrangler.jsonc" >"$tmp" && mv "$tmp" ".edge-build/${b}/wrangler.jsonc"
  fi
  if [[ -n "$STATIC_CDN_URL" ]]; then
    node scripts/collect-edge-assets.mjs --out "$edge_dir" --boundary "$b"
  fi
  pack "portal-ssr-${b}.tar.gz" ".edge-build/${b}" .
  boundaries_json="$(jq -c --arg b "$b" '. + [$b]' <<<"$boundaries_json")"
done

# Content sections (blogs/docs/products) need the content service and its
# token, which are runtime credentials; the artifact build exports without
# them. Content-bearing exports stay a later, separately-authorised job.
NEXT_PUBLIC_STATIC_CDN_URL="$STATIC_CDN_URL" DOCS_SERVICE_URL="" INTERNAL_SERVICE_TOKEN="" \
  "$YARN" build:static-dashboard
test -d static-dashboard/out || die "build:static-dashboard produced no static-dashboard/out"
if [[ -n "$STATIC_CDN_URL" ]]; then
  for b in $SSR_BOUNDARIES; do
    test -d "$edge_dir/_edge/$b" || die "missing edge assets for boundary '$b'"
  done
  mkdir -p static-dashboard/out/_edge
  [[ -z "$SSR_BOUNDARIES" ]] || cp -R "$edge_dir/_edge/." static-dashboard/out/_edge/
  pack portal-edge-assets.tar.gz "$edge_dir" .
fi
pack portal-static.tar.gz static-dashboard/out .
popd >/dev/null

cd "$OUT_DIR"
jq -n --arg ref "$PORTAL_REF" --arg sha "$source_sha" --arg env "$TARGET_ENV" \
  --arg cdn "$STATIC_CDN_URL" --arg acct "$ACCOUNT_SERVICE_URL" \
  --argjson boundaries "$boundaries_json" \
  --arg built_by "${GITHUB_SERVER_URL:-local}/${GITHUB_REPOSITORY:-local}/actions/runs/${GITHUB_RUN_ID:-0}" \
  '{schema_version:1, kind:"PortalServerlessFrontendArtifact", source:{repo:"ai-workspace-services/portal", ref:$ref, sha:$sha},
    target_env:$env, static_cdn_url:$cdn, account_service_url:$acct, ssr_boundaries:$boundaries,
    content_sections_included:false, built_by:$built_by,
    files:([inputs] )}' < <(for f in *.tar.gz; do jq -n --arg n "$f" --arg s "$(sha256sum "$f" | cut -d' ' -f1)" '{name:$n, sha256:$s}'; done) \
  > artifact-manifest.json
sha256sum ./*.tar.gz artifact-manifest.json | sed 's# \./# #' > SHA256SUMS
echo "package-portal-frontend: wrote $(ls | wc -l) files to ${OUT_DIR} for ${PORTAL_REF} (${source_sha})"
