import copy
import importlib.util
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location('evidence', ROOT / '.github/scripts/caddy-main-evidence.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class CaddyEvidenceTest(unittest.TestCase):
    def setUp(self):
        self.sha = 'a' * 40
        self.run = {'id': 42, 'run_attempt': 1, 'event': 'workflow_dispatch', 'head_branch': 'main',
                    'head_sha': self.sha, 'path': module.WORKFLOW + '@refs/heads/main',
                    'status': 'completed', 'conclusion': 'success',
                    'repository': {'full_name': module.REPOSITORY}, 'head_repository': {'full_name': module.REPOSITORY}}
        self.jobs = [{'id': 99, 'name': 'Build caddy image with cloudflare dns', 'status': 'completed',
                      'conclusion': 'success', 'steps': [{'name': name, 'conclusion': 'success'} for name in
                         ('Build image', 'Verify cloudflare dns provider is present in the built image', 'Push image')]}]

    def test_source_run_and_required_steps(self):
        self.assertEqual(module.validate(self.run, self.jobs, self.sha, 42, 1), 99)
        for field, value in [('head_sha', 'b' * 40), ('head_branch', 'other'), ('event', 'push'),
                             ('run_attempt', 2), ('conclusion', 'failure'), ('path', 'foreign.yml')]:
            changed = copy.deepcopy(self.run)
            changed[field] = value
            with self.subTest(field=field), self.assertRaises(ValueError):
                module.validate(changed, self.jobs, self.sha, 42, 1)
        bad = copy.deepcopy(self.jobs)
        bad[0]['steps'][1]['conclusion'] = 'skipped'
        with self.assertRaises(ValueError):
            module.validate(self.run, bad, self.sha, 42, 1)

    def test_log_requires_exact_tag_and_unambiguous_digest(self):
        digest = 'sha256:' + 'b' * 64
        line = f'sha-{self.sha}: digest: {digest} size: 123\n'.encode()
        self.assertEqual(module.digest_from_log(line, self.sha), digest)
        with self.assertRaises(ValueError):
            module.digest_from_log(line, 'c' * 40)
        with self.assertRaises(ValueError):
            module.digest_from_log(line + f'sha-{self.sha}: digest: sha256:{"c" * 64} size: 5\n'.encode(), self.sha)


if __name__ == '__main__':
    unittest.main()
