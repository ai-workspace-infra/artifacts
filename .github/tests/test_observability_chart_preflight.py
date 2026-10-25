#!/usr/bin/env python3
"""No-false-green checks for the local declaration graph, not runtime migration."""
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[2]
SCRIPT = ROOT / ".github/scripts/observability-chart-preflight.py"
spec = importlib.util.spec_from_file_location("chart_preflight", SCRIPT)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class ChartPreflightTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.write("cluster/kustomization.yaml", """apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources: [flux.yaml]
""")
        self.write("cluster/flux.yaml", """apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata: {name: obs}
spec:
  sourceRef: {kind: GitRepository, name: selected}
  path: ./service
""")
        self.write("service/kustomization.yaml", """apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: metrics
resources: [source.yaml, release.yaml]
""")
        self.write("service/source.yaml", """apiVersion: source.toolkit.fluxcd.io/v1
kind: OCIRepository
metadata: {name: obs}
spec: {url: 'oci://registry.example/observability', ref: {semver: '0.1.0'}}
""")
        self.write("service/release.yaml", """apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata: {name: obs}
spec: {chartRef: {kind: OCIRepository, name: obs}}
""")

    def write(self, name, text):
        p = self.root / name
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(text)

    def inspect(self):
        return module.inspect(self.root, ["cluster"], {"selected"})

    def test_reachable_legacy_release_fails_cli_assertion(self):
        result = subprocess.run([sys.executable, str(SCRIPT), "--gitops-root", str(self.root),
                                 "--entrypoint", "cluster", "--source-name", "selected",
                                 "--assert-no-legacy-callers"], text=True, capture_output=True)
        self.assertEqual(result.returncode, 1, result.stderr)
        report = json.loads(result.stdout)
        self.assertEqual(report["legacy_callers"][0]["ref"], {"semver": "0.1.0"})
        self.assertEqual(report["legacy_callers"][0]["namespace"], "metrics")
        self.assertEqual(report["runtime_migration_acceptance"], "NOT_RUN")

    def test_canonical_release_passes_only_declaration_assertion(self):
        p = self.root / "service/source.yaml"
        p.write_text(p.read_text().replace("/observability'", "/observability-stack'"))
        report = self.inspect()
        self.assertEqual(report["assertion_status"], "PASS")
        self.assertEqual(len(report["canonical_callers"]), 1)
        self.assertEqual(report["runtime_migration_acceptance"], "NOT_RUN")

    def test_unselected_source_missing_resource_and_missing_oci_do_not_pass(self):
        self.assertEqual(module.inspect(self.root, ["cluster"], {"other"})["assertion_status"], "FAIL")
        (self.root / "service/source.yaml").unlink()
        self.assertEqual(self.inspect()["assertion_status"], "FAIL")
        self.assertTrue(self.inspect()["unresolved"])

    def test_path_escape_is_rejected(self):
        with self.assertRaises(module.InvalidGraph):
            module.inspect(self.root, ["../outside"], {"selected"})

    def test_render_time_patches_require_review_instead_of_false_pass(self):
        p = self.root / "service/source.yaml"
        p.write_text(p.read_text().replace("/observability'", "/observability-stack'"))
        p = self.root / "cluster/kustomization.yaml"
        p.write_text(p.read_text() + "patches: [{path: promotion.patch.yaml}]\n")
        self.assertEqual(self.inspect()["assertion_status"], "FAIL")
        self.assertIn("render-time modifiers", self.inspect()["unresolved"][0]["reason"])

    def test_remote_resources_are_not_silently_treated_as_empty(self):
        self.write("cluster/kustomization.yaml", """apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources: ['https://example.invalid/remote']
""")
        self.assertEqual(self.inspect()["assertion_status"], "FAIL")


if __name__ == "__main__":
    unittest.main()
