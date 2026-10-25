#!/usr/bin/env python3
"""Standalone chart producers, security boundaries and optional real Vector checks."""
from datetime import datetime, timezone, timedelta
from pathlib import Path
import copy
import os
import subprocess
import tempfile
import unittest
import yaml

ROOT = Path(__file__).resolve().parents[2]
CHART = ROOT / "oci/charts/open-platform/charts/observability-agent"
ALL = {"nodeExporter": {"hostMetrics": True, "hostNetwork": True}, "kubeStateMetrics": {"enabled": True}, "processExporter": {"enabled": True}, "vector": {"enabled": False}}
RELAY = {"nodeExporter": {"enabled": False}, "vector": {"enabled": True, "mode": "relay", "relay": {"sourceBaseUrl": "http://metrics.example.test:8428", "sourceCluster": "example", "sourceEnvironment": "uat", "remoteWriteUrl": "https://remote.example.test/api/v1/write", "distinctBackendAcknowledged": True, "auth": {"existingSecret": "remote-writer"}}}}


def render(values=None):
    with tempfile.NamedTemporaryFile("w", suffix=".yaml") as f:
        yaml.safe_dump(values or {}, f)
        f.flush()
        return subprocess.run(["helm", "template", "agent", str(CHART), "--namespace", "monitoring", "-f", f.name], capture_output=True, text=True)


def objects(values=None):
    result = render(values)
    if result.returncode:
        raise AssertionError(result.stderr)
    return [d for d in yaml.safe_load_all(result.stdout) if d]


class ObservabilityAgentChartTest(unittest.TestCase):
    def test_legacy_defaults_do_not_enable_new_cluster_producers(self):
        docs = objects()
        self.assertFalse(any(d["kind"] in ("ClusterRole", "Deployment") for d in docs))
        pod = next(d for d in docs if d["kind"] == "DaemonSet")["spec"]["template"]["spec"]
        self.assertEqual([c["name"] for c in pod["containers"]], ["node-exporter", "vector"])
        self.assertFalse(any("hostPath" in v for v in pod.get("volumes", [])))

    def test_enabled_producers_have_scoped_permissions(self):
        docs = objects(ALL)
        roles = [d for d in docs if d["kind"] == "ClusterRole"]
        self.assertEqual(len(roles), 1)
        for rule in roles[0]["rules"]:
            self.assertFalse(set(rule["resources"]) & {"secrets", "configmaps", "nodes/proxy"})
            self.assertEqual(rule["verbs"], ["list", "watch"])
        for d in docs:
            if d["kind"] not in ("DaemonSet", "Deployment"):
                continue
            pod = d["spec"]["template"]["spec"]
            self.assertTrue(pod["securityContext"]["runAsNonRoot"])
            self.assertNotEqual(pod["securityContext"]["runAsUser"], 0)
            self.assertFalse(pod.get("hostPID", False))
            for c in pod["containers"]:
                self.assertTrue(all(isinstance(e, dict) and "name" in e for e in c.get("env", [])))
                self.assertTrue(all(isinstance(a, str) for a in c.get("args", [])))
                self.assertFalse(c["securityContext"]["allowPrivilegeEscalation"])
                self.assertEqual(c["securityContext"]["capabilities"]["drop"], ["ALL"])
                self.assertTrue(all(v["readOnly"] for v in c.get("volumeMounts", [])))
        process = next(d for d in docs if d["kind"] == "DaemonSet" and d["metadata"]["name"].endswith("-process"))["spec"]["template"]["spec"]
        self.assertFalse(process["hostNetwork"])
        self.assertFalse(process["automountServiceAccountToken"])
        self.assertEqual([v["hostPath"]["path"] for v in process["volumes"] if "hostPath" in v], ["/proc"])
        config = next(d for d in docs if d["kind"] == "ConfigMap" and "config.yaml" in d["data"])
        self.assertEqual(yaml.safe_load(config["data"]["config.yaml"])["process_names"][0]["name"], "{{.Comm}}")

    def test_secret_collectors_root_and_argv_names_are_rejected(self):
        for values in ({"kubeStateMetrics": {"enabled": True, "collectors": ["secrets"]}}, {"kubeStateMetrics": {"enabled": True, "collectors": ["configmaps"]}}, {"processExporter": {"enabled": True, "podSecurityContext": {"runAsUser": 0}}}, {"processExporter": {"enabled": True, "image": {"digest": ""}}}, {"processExporter": {"enabled": True, "processNames": [{"name": "{{.Cmdline}}", "cmdline": [".+"]}]}}):
            with self.subTest(values=values):
                self.assertNotEqual(render(values).returncode, 0)

    def test_relay_preserves_identity_and_credentials_are_secret_refs(self):
        docs = objects(RELAY)
        self.assertFalse(any(d["kind"] == "DaemonSet" for d in docs))
        config = next(d for d in docs if d["kind"] == "ConfigMap")["data"]["vector.toml"]
        self.assertIn("honor_labels = true", config)
        self.assertIn('max_lookback = ["60s"]', config)
        self.assertIn('to_unix_timestamp!(.timestamp)', config)
        pod = next(d for d in docs if d["kind"] == "Deployment")["spec"]["template"]["spec"]
        self.assertFalse(pod["automountServiceAccountToken"])
        self.assertEqual(pod["containers"][0]["env"][0]["valueFrom"]["secretKeyRef"]["name"], "remote-writer")
        self.assertIn("verify_certificate = true", config)
        self.assertIn("verify_hostname = true", config)

    def test_missing_identity_loop_plaintext_or_unacknowledged_backend_is_rejected(self):
        for patch in ({"sourceCluster": ""}, {"remoteWriteUrl": "http://remote.example.test/write"}, {"remoteWriteUrl": "https://metrics.example.test:8428/write"}, {"distinctBackendAcknowledged": False}, {"remoteWriteUrl": "https://user:password@remote.example.test/write"}, {"sourceBackendAliases": ["remote.example.test"]}, {"scrapeIntervalSeconds": 2}, {"maxSampleAgeSeconds": 3600}):
            values = copy.deepcopy(RELAY)
            values["vector"]["relay"].update(patch)
            self.assertNotEqual(render(values).returncode, 0, patch)

    @unittest.skipUnless(os.environ.get("OBS_AGENT_RUNTIME_TESTS") == "1", "explicit local/CI Docker runtime check")
    def test_actual_pinned_vector_validates_and_rejects_stale_cross_cluster_metrics(self):
        docs = objects(RELAY)
        config = next(d for d in docs if d["kind"] == "ConfigMap")["data"]["vector.toml"]
        now = datetime.now(timezone.utc)
        def case(name, age, cluster, passes):
            stamp = (now - timedelta(seconds=age)).isoformat()
            text = f'\n[[tests]]\nname = "{name}"\n'
            if not passes:
                text += 'no_outputs_from = ["fresh_source"]\n'
            text += f'[tests.input]\ninsert_at = "fresh_source"\ntype = "metric"\n[tests.input.metric]\nname = "up"\nkind = "absolute"\ntimestamp = "{stamp}"\n[tests.input.metric.gauge]\nvalue = 1.0\n[tests.input.metric.tags]\ncluster = "{cluster}"\nenvironment = "uat"\ninstance = "original-node"\n'
            if passes:
                text += '[[tests.outputs]]\nextract_from = "fresh_source"\n[[tests.outputs.conditions]]\ntype = "vrl"\nsource = \'assert_eq!(.tags.instance, "original-node")\'\n'
            return text
        config += case("fresh identity preserved", 0, "example", True) + case("stale input is not re-timestamped", 180, "example", False) + case("other cluster is not relayed", 0, "other", False)
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "vector.toml"
            path.write_text(config)
            image = yaml.safe_load((CHART / "values.yaml").read_text())["vector"]["image"]
            prefix = ["docker", "run", "--rm", "--network", "none", "--user", "65534:65534", "--read-only", "-e", "VECTOR_REMOTE_WRITE_TOKEN=fixture-not-a-secret", "-v", f"{path}:/etc/vector/test.toml:ro", image["repository"] + ":" + image["tag"]]
            for args in (["validate", "--skip-healthchecks", "--no-environment", "/etc/vector/test.toml"], ["test", "/etc/vector/test.toml"]):
                result = subprocess.run(prefix + args, capture_output=True, text=True)
                self.assertEqual(result.returncode, 0, result.stdout + result.stderr)


if __name__ == "__main__":
    if os.environ.get("WEBSAAS_RENDER_DIR"):
        out = Path(os.environ["WEBSAAS_RENDER_DIR"])
        out.mkdir(parents=True, exist_ok=True)
        for name, values in (("legacy", {}), ("producers", ALL), ("relay", RELAY)):
            result = render(values)
            if result.returncode:
                raise RuntimeError(result.stderr)
            (out / f"observability-agent-{name}.yaml").write_text(result.stdout)
    unittest.main()
