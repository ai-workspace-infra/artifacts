import json
from pathlib import Path
import sys
import unittest


sys.path.insert(0, str(Path(__file__).resolve().parent))
from component_candidate import assert_candidate_id, parse_component  # noqa: E402


COMPONENT = {
    "name": "accounts",
    "required": True,
    "resolved_source_sha": "0123456789abcdef0123456789abcdef01234567",
    "source": {
        "repository": "ai-workspace-services/accounts",
        "workflow": "ci-pipeline.yml",
        "trigger": "tag",
        "dispatch_if_missing": True,
        "dispatch_inputs": {"deploy_env": "uat"},
    },
    "artifact": {
        "kind": "oci-image",
        "reference": "ghcr.io/ai-workspace-services/accounts",
        "require_digest": True,
    },
}


class ComponentCandidateTest(unittest.TestCase):
    def test_accepts_an_immutable_uat_daily_candidate(self):
        assert_candidate_id("daily-build-2026.11.01-r1")
        with self.assertRaises(ValueError):
            assert_candidate_id("uat-daily-build-2026.11.01-r1")
        with self.assertRaises(ValueError):
            assert_candidate_id("v2026.11.01-r1")

    def test_accepts_a_declared_oci_component(self):
        self.assertEqual(parse_component(json.dumps(COMPONENT)), COMPONENT)

    def test_rejects_an_unsupported_trigger_or_artifact_kind(self):
        invalid_trigger = json.loads(json.dumps(COMPONENT))
        invalid_trigger["source"]["trigger"] = "branch"
        with self.assertRaises(ValueError):
            parse_component(json.dumps(invalid_trigger))
        invalid_artifact = json.loads(json.dumps(COMPONENT))
        invalid_artifact["artifact"] = {"kind": "mutable-image"}
        with self.assertRaises(ValueError):
            parse_component(json.dumps(invalid_artifact))


if __name__ == "__main__":
    unittest.main()
