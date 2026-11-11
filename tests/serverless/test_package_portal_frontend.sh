#!/usr/bin/env bash
# Isolated contract test: fake portal checkout + fake yarn, no network.
set -euo pipefail
root="$(cd "$(dirname "$0")/../.." && pwd)"
pkg="$root/scripts/serverless/package-portal-frontend.sh"
ver="$root/scripts/serverless/verify-frontend-artifact.sh"
t="$(mktemp -d)"; trap 'rm -rf "$t"' EXIT
fail() { echo "FAIL: $*" >&2; exit 1; }

p="$t/portal"; mkdir -p "$p/scripts"
echo '{}' > "$p/package.json"
cat > "$p/scripts/collect-edge-assets.mjs" <<'JS'
JS
cat > "$t/yarn" <<'SH'
#!/usr/bin/env bash
set -e
[[ -z "${INTERNAL_SERVICE_TOKEN:-}" ]] || { echo "token leaked" >&2; exit 9; }
case "$1" in
  install) ;;
  build:static-dashboard) mkdir -p static-dashboard/out; echo static > static-dashboard/out/index.html ;;
  build:ssr:*) b="${1#build:ssr:}"; mkdir -p ".edge-build/$b"; echo '{"name":"w"}' > ".edge-build/$b/wrangler.jsonc" ;;
esac
SH
chmod +x "$t/yarn"
# fake node for collect-edge-assets
mkdir -p "$t/bin"; cat > "$t/bin/node" <<'SH'
#!/usr/bin/env bash
out="$3"; b="$5"; mkdir -p "$out/_edge/$b"; echo a > "$out/_edge/$b/a.js"
SH
chmod +x "$t/bin/node"
printf '.edge-build/\nstatic-dashboard/out/\n' > "$p/.gitignore"
git -C "$p" init -q && git -C "$p" -c user.email=t@t -c user.name=t add -A && git -C "$p" -c user.email=t@t -c user.name=t commit -qm init
sha="$(git -C "$p" rev-parse HEAD)"
run() { env -u CLOUDFLARE_API_TOKEN PATH="$t/bin:$PATH" YARN="$t/yarn" PORTAL_DIR="$p" TARGET_ENV=uat "$@" bash "$pkg"; }

# floating refs rejected
for r in main latest HEAD; do
  run PORTAL_REF="$r" OUT_DIR="$t/o-$r" >/dev/null 2>&1 && fail "accepted floating ref $r"
done
# runtime credentials rejected
CLOUDFLARE_API_TOKEN=x PATH="$t/bin:$PATH" YARN="$t/yarn" PORTAL_DIR="$p" TARGET_ENV=uat PORTAL_REF="$sha" OUT_DIR="$t/o-cred" bash "$pkg" >/dev/null 2>&1 && fail "accepted CLOUDFLARE_API_TOKEN"
# sha mismatch rejected
run PORTAL_REF="$(printf 'a%.0s' {1..40})" OUT_DIR="$t/o-mm" >/dev/null 2>&1 && fail "accepted mismatched sha"
# bad boundary rejected
run PORTAL_REF="$sha" SSR_BOUNDARIES=evil OUT_DIR="$t/o-b" >/dev/null 2>&1 && fail "accepted bad boundary"

# happy path
run PORTAL_REF="$sha" SSR_BOUNDARIES="public auth" STATIC_CDN_URL=https://cdn.example.test \
  ACCOUNT_SERVICE_URL=https://accounts.example.test OUT_DIR="$t/out" >/dev/null
for f in portal-static.tar.gz portal-ssr-public.tar.gz portal-ssr-auth.tar.gz portal-edge-assets.tar.gz artifact-manifest.json SHA256SUMS; do
  test -f "$t/out/$f" || fail "missing $f"
done
bash "$ver" "$t/out" "$sha" "$sha" >/dev/null || fail "verify rejected good artifact"
tar -xzf "$t/out/portal-ssr-public.tar.gz" -O ./wrangler.jsonc | jq -e '.vars.ACCOUNT_SERVICE_URL=="https://accounts.example.test"' >/dev/null || fail "account url not baked"
tar -tzf "$t/out/portal-static.tar.gz" | grep -q '_edge/auth/a.js' || fail "edge assets not merged"
jq -e '.content_sections_included == false' "$t/out/artifact-manifest.json" >/dev/null || fail "manifest flag"
# reproducible
run PORTAL_REF="$sha" SSR_BOUNDARIES="public auth" STATIC_CDN_URL=https://cdn.example.test \
  ACCOUNT_SERVICE_URL=https://accounts.example.test OUT_DIR="$t/out2" >/dev/null
cmp <(grep tar.gz "$t/out/SHA256SUMS") <(grep tar.gz "$t/out2/SHA256SUMS") || fail "tarballs not reproducible"
# tamper detected
echo x >> "$t/out/portal-static.tar.gz"
bash "$ver" "$t/out" "$sha" >/dev/null 2>&1 && fail "verify accepted tampered artifact"
bash "$ver" "$t/out2" "v9.9.9" >/dev/null 2>&1 && fail "verify accepted wrong ref"
echo "test_package_portal_frontend: OK"

# --- artifact meta: inputs via env only, malicious TARGET_ENV rejected ---
meta="$root/scripts/serverless/emit-artifact-meta.sh"
go="$t/gh-out"; : > "$go"
OUT_DIR="$t/out2" TARGET_ENV=uat GITHUB_OUTPUT="$go" bash "$meta" || fail "meta rejected good input"
want_name="portal-serverless-frontend-uat-${sha:0:12}"
want_msum="$(sha256sum "$t/out2/artifact-manifest.json" | cut -d' ' -f1)"
[[ "$(cat "$go")" == "$(printf 'source_sha=%s\nmanifest_sha256=%s\nartifact_name=%s' "$sha" "$want_msum" "$want_name")" ]] || fail "meta outputs changed: $(cat "$go")"
canary="$t/pwned"
for bad in 'uat$(touch '"$canary"')' 'uat;touch '"$canary" 'uat`touch '"$canary"'`' $'uat\nartifact_name=evil' 'UAT' 'prod' ''; do
  : > "$go"
  OUT_DIR="$t/out2" TARGET_ENV="$bad" GITHUB_OUTPUT="$go" bash "$meta" >/dev/null 2>&1 && fail "meta accepted TARGET_ENV=$bad"
  [[ ! -s "$go" ]] || fail "meta wrote outputs for bad TARGET_ENV=$bad"
  [[ ! -e "$canary" ]] || fail "command executed from TARGET_ENV"
done
# workflow must not interpolate inputs inside run: scripts
awk '/run: *\|/{inrun=1;next} /^ {6}- /{inrun=0} inrun && /\$\{\{ *inputs\./{print; bad=1} END{exit bad}' \
  "$root/.github/workflows/build-serverless-portal-frontend.yml" || fail "inputs.* interpolated in run block"
echo "test_emit_artifact_meta: OK"
