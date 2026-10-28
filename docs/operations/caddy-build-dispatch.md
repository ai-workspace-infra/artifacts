# Caddy image build dispatch

Workflow: `.github/workflows/build-ci-image-caddy.yml`. It builds and verifies
the Caddy Cloudflare DNS module, then publishes a GHCR image; it does not deploy
the image or change DNS.

`workflow_dispatch` has one input: required choice `runner`, default
`self-runner`, allowed values `self-runner` and `ubuntu-latest`. The source ref
is the dispatched Git ref; select `main` and record its full commit SHA before
dispatch. The job checks out that ref, builds the image, and tests that
`dns.providers.cloudflare` is present.

A manual dispatch pushes only `ghcr.io/ai-workspace-infra/caddy-cloudflare` as
`sha-<full checked-out commit>`; it does not push `latest` or the short SHA.
A Main push event additionally pushes the short SHA and `latest`, so a queued
older push must not be allowed to overwrite a newer Main image. Before a
manual run, verify that the same source/tag is not already being published by
another live run, and that no existing tag would be silently replaced.

After completion, verify the exact run event, attempt and checked-out source,
the module check, and the published GHCR manifest digest. Save those identifiers
with the candidate evidence. A green build alone is not deployment or SIT
acceptance. If the run is still active, observe the same run rather than
dispatching another build because a status wait expired.
