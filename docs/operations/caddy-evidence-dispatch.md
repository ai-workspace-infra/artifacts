# Caddy Main evidence dispatch

The read-only `.github/workflows/caddy-main-evidence.yml` workflow has two
`workflow_dispatch` inputs: required string `build_run_id` and required string
`build_run_attempt` (default `1`), both positive decimal integers. Dispatch from
`main` only after the selected Caddy build has completed successfully on the
same current Main commit. It accepts only a manual Caddy build from Main and
checks its exact run, attempt, workflow, repository, successful module and push
steps, SHA-tag digest in the job log, and the bytes of the GHCR manifest.

The workflow only reads GitHub Actions and the registry. It emits
`caddy-main-evidence-<run-id>-<attempt>` with the source SHA, immutable image
digest and exact originating build identifiers. It does not publish, deploy or
change DNS. Check the completed run and artifact provenance before using it;
repeat only after the previous run is terminal and the source is still current.
