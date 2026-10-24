"""Exercise the rendered Collector with synthetic OTel labels that once collided."""
import json
from pathlib import Path
import subprocess
import tempfile
import time
import urllib.request
import uuid
import yaml

ROOT = Path(__file__).resolve().parents[2]
IMAGE = 'otel/opentelemetry-collector-contrib:0.114.0@sha256:37fa87091cfaaec7234a27e4e395a40c31c2bfaea97a349a4afef6d9e9681197'
rendered = subprocess.check_output(['helm', 'template', 'fixture', str(ROOT / 'oci/charts/open-platform/charts/observability-stack'), '--set', 'telemetry.spanMetrics=true', '--set', 'telemetry.cluster=fixture', '--set', 'telemetry.environment=test'], text=True)
cm = next(x for x in yaml.safe_load_all(rendered) if x and x['kind'] == 'ConfigMap')
cfg = yaml.safe_load(cm['data']['otel-collector.yml'])
cfg['connectors']['spanmetrics']['metrics_flush_interval'] = '1s'
cfg['exporters'] = {'prometheus': cfg['exporters']['prometheus']}
cfg['service']['pipelines'].pop('logs')
cfg['service']['pipelines']['traces']['exporters'] = ['spanmetrics']
name = 'otel-label-regression-' + uuid.uuid4().hex[:10]
with tempfile.TemporaryDirectory() as directory:
    config = Path(directory) / 'config.yaml'
    config.write_text(yaml.safe_dump(cfg))
    config.chmod(0o644)
    try:
        subprocess.run(['docker', 'run', '-d', '--name', name, '-p', '127.0.0.1::4318', '-p', '127.0.0.1::8889', '-v', str(config) + ':/test/config.yaml:ro', IMAGE, '--config=/test/config.yaml'], check=True, stdout=subprocess.DEVNULL)
        info = json.loads(subprocess.check_output(['docker', 'inspect', name]))[0]['NetworkSettings']['Ports']
        otlp = int(info['4318/tcp'][0]['HostPort'])
        metrics = int(info['8889/tcp'][0]['HostPort'])
        now = time.time_ns()
        attrs = {'service.name': 'fixture-service', 'service.instance.id': 'fixture-instance', 'instance': 'fixture-instance', 'job': 'legacy-job'}
        payload = {'resourceSpans': [{'resource': {'attributes': [{'key': k, 'value': {'stringValue': v}} for k, v in attrs.items()]}, 'scopeSpans': [{'spans': [{'traceId': 'a' * 32, 'spanId': 'b' * 16, 'name': 'fixture-request', 'kind': 2, 'startTimeUnixNano': str(now), 'endTimeUnixNano': str(now + 1000000)}]}]}]}
        result = ''
        for _ in range(30):
            try:
                request = urllib.request.Request(f'http://127.0.0.1:{otlp}/v1/traces', data=json.dumps(payload).encode(), headers={'Content-Type': 'application/json'})
                with urllib.request.urlopen(request, timeout=2):
                    pass
                with urllib.request.urlopen(f'http://127.0.0.1:{metrics}/metrics', timeout=2) as response:
                    result = response.read().decode()
                if any(x.startswith('traces_span_metrics_calls_total{') for x in result.splitlines()):
                    break
            except (OSError, TimeoutError):
                pass
            time.sleep(1)
        lines = [x for x in result.splitlines() if x.startswith('traces_span_metrics_calls_total{')]
        assert lines, 'The rendered Collector failed to export span-derived request metrics'
        assert any('instance="fixture-instance"' in x and 'service_name="fixture-service"' in x and 'cluster="fixture"' in x and 'environment="test"' in x for x in lines), 'Canonical identity and isolation labels must survive conversion'
        print('OTel spanmetrics legacy job/instance collision regression: PASS')
    finally:
        subprocess.run(['docker', 'rm', '-f', name], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
