import assert from "node:assert/strict";
import test from "node:test";

import { assertCandidateId, parseComponent } from "./index.mjs";

const component = {
  name: "accounts",
  required: true,
  resolved_source_sha: "0123456789abcdef0123456789abcdef01234567",
  source: {
    repository: "ai-workspace-services/accounts",
    workflow: "ci-pipeline.yml",
    trigger: "tag",
    dispatch_if_missing: true,
    dispatch_inputs: { deploy_env: "uat" },
  },
  artifact: {
    kind: "oci-image",
    reference: "ghcr.io/ai-workspace-services/accounts",
    require_digest: true,
  },
};

test("accepts an immutable UAT daily candidate id", () => {
  assert.doesNotThrow(() => assertCandidateId("daily-build-2026.11.01-r1"));
  assert.throws(() => assertCandidateId("uat-daily-build-2026.11.01-r1"));
  assert.throws(() => assertCandidateId("v2026.11.01-r1"));
});

test("accepts a declared OCI component", () => {
  assert.deepEqual(parseComponent(JSON.stringify(component)), component);
});

test("rejects an unsupported trigger or artifact kind", () => {
  assert.throws(() => parseComponent(JSON.stringify({
    ...component,
    source: { ...component.source, trigger: "branch" },
  })));
  assert.throws(() => parseComponent(JSON.stringify({
    ...component,
    artifact: { kind: "mutable-image" },
  })));
});

