"""Render-only contract for one chart deployed as independent releases."""
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest

import yaml

ROOT = Path(__file__).resolve().parents[2]
IMAGE = "registry.example.invalid/component@sha256:" + "a" * 64


class Releases(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp = tempfile.TemporaryDirectory()
        cls.chart = Path(cls.temp.name) / "chart"
        shutil.copytree(ROOT / "oci/charts/distributed-web-saas-fullstack", cls.chart)
        for chart in cls.chart.glob('subcharts/*/Chart.yaml'):
            if chart.parent.name != 'web-saas-common':
                subprocess.run(['helm', 'dependency', 'build', str(chart.parent)], check=True, capture_output=True)
        subprocess.run(['helm', 'dependency', 'build', str(cls.chart)], check=True, capture_output=True)

    @classmethod
    def tearDownClass(cls):
        cls.temp.cleanup()

    def render(self, values, success=True):
        path = Path(self.temp.name) / 'values.yaml'
        path.write_text(yaml.safe_dump(values))
        result = subprocess.run(['helm', 'template', 'release', str(self.chart), '--namespace', 'fixture', '--kube-version', '1.37.0', '-f', str(path)], capture_output=True, text=True)
        self.assertEqual(result.returncode == 0, success, result.stderr)
        return list(yaml.safe_load_all(result.stdout)) if success else result.stderr

    def ingress(self):
        return {'caddy': {'enabled': True, 'image': IMAGE, 'externalBackends': {
            'enabled': True, 'accounts': 'accounts.app.svc.cluster.local:80',
            'frontend': 'console.app.svc.cluster.local:80', 'billing': 'billing.app.svc.cluster.local:80'},
            'routes': {'consoleHost': 'console.example.invalid', 'accountsHost': 'accounts.example.invalid', 'billingHost': 'billing.example.invalid'},
            'tls': {'consoleSecret': 'console-tls', 'accountsSecret': 'accounts-tls', 'billingSecret': 'billing-tls'}}}

    def test_postgresql_only_has_no_application_or_caddy_workloads(self):
        docs = self.render({'postgresql': {'enabled': True, 'image': IMAGE, 'existingSecret': 'db-admin', 'storage': {'className': 'data'}}})
        workloads = [doc for doc in docs if doc and doc['kind'] in ('StatefulSet', 'Deployment')]
        self.assertEqual([(doc['kind'], doc['metadata']['name']) for doc in workloads], [('StatefulSet', 'release-postgresql')])

    def test_caddy_only_uses_external_namespaced_backends(self):
        docs = self.render(self.ingress())
        workloads = [doc for doc in docs if doc and doc['kind'] in ('Deployment', 'StatefulSet')]
        self.assertEqual([doc['metadata']['name'] for doc in workloads], ['release-caddy'])
        config = next(doc['data']['Caddyfile'] for doc in docs if doc and doc['kind'] == 'ConfigMap')
        for target in ('accounts.app.svc.cluster.local:80', 'console.app.svc.cluster.local:80', 'billing.app.svc.cluster.local:80'):
            self.assertIn(target, config)
        self.assertNotIn('release-accounts:80', config)

    def test_external_caddy_rejects_missing_backends_and_duplicate_application(self):
        values = self.ingress()
        values['caddy']['externalBackends']['accounts'] = ''
        self.assertIn('explicit accounts and frontend', self.render(values, False))
        values = self.ingress()
        values['postgresql'] = {'enabled': True, 'image': IMAGE, 'existingSecret': 'db', 'storage': {'className': 'data'}}
        self.assertIn('must not enable application or database', self.render(values, False))

    def test_legacy_caddy_still_requires_local_application(self):
        values = self.ingress()
        values['caddy']['externalBackends']['enabled'] = False
        self.assertIn('Caddy requires console.enabled', self.render(values, False))


if __name__ == '__main__':
    unittest.main()
