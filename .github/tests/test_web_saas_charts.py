"""Offline rendering acceptance; synthetic digests are fixtures, never deployable images."""
import hashlib
import json
import os
import re
from pathlib import Path
import subprocess
import tempfile
import unittest
import yaml

REPO = Path(__file__).resolve().parents[2]
CHART = REPO / 'oci/charts/distributed-web-saas-fullstack'
SUB = CHART / 'subcharts'
IMAGE = 'registry.example.invalid/test-only@sha256:' + 'a' * 64
FRONT = ['static-pages', 'frontend-router', 'ssr-public', 'ssr-content', 'ssr-auth', 'ssr-console', 'ssr-workspace']

def run(*args):
    return subprocess.run(args, cwd=REPO, text=True, capture_output=True)

def defaults(name):
    return yaml.safe_load((SUB / name / 'values.yaml').read_text())

def config():
    v = yaml.safe_load((CHART / 'values.yaml').read_text())
    for name in ['console', 'accounts', 'billing', 'content', 'edge-gateway', 'postgresql', 'caddy']:
        key = 'edgeGateway' if name == 'edge-gateway' else name
        v[key] = defaults(name)
        v[key]['enabled'] = True
    for item in v['console']['components'].values():
        item['image'] = IMAGE
    for item in v['edgeGateway']['boundaries'].values():
        item['image'] = IMAGE
    for name in ['accounts', 'billing', 'content']:
        v[name]['workload']['image'] = IMAGE
        v[name]['workload']['secretRefs'] = ['example-runtime']
    v['postgresql'].update(image=IMAGE, existingSecret='example-database')
    v['postgresql']['storage']['className'] = 'example-storage'
    v['caddy'].update(image=IMAGE, gatewayEnabled=True)
    v['caddy']['routes'] = dict(consoleHost='console.example.test', accountsHost='accounts.example.test', billingHost='billing.example.test')
    v['caddy']['tls'] = dict(consoleSecret='example-console-tls', accountsSecret='example-accounts-tls', billingSecret='example-billing-tls')
    return v

def render(values, chart=CHART):
    with tempfile.NamedTemporaryFile('w', suffix='.yaml') as f:
        yaml.safe_dump(values, f)
        f.flush()
        result = run('helm', 'template', 'example', str(chart), '--namespace', 'example-sit', '--kube-version', '1.32.0', '-f', f.name)
    return result

def objects(values, chart=CHART):
    r = render(values, chart)
    if r.returncode:
        raise AssertionError(r.stderr)
    objs=[o for o in yaml.safe_load_all(r.stdout) if o]
    for obj in objs:
        if not re.fullmatch(r'[a-z0-9](?:[a-z0-9-]*[a-z0-9])?',obj['metadata']['name']):
            raise AssertionError('Invalid resource name: '+obj['metadata']['name'])
    if objs and os.environ.get('WEBSAAS_RENDER_DIR'):
        output=Path(os.environ['WEBSAAS_RENDER_DIR']);output.mkdir(parents=True,exist_ok=True)
        (output/(hashlib.sha256(r.stdout.encode()).hexdigest()[:16]+'.yaml')).write_text(yaml.safe_dump_all(objs))
    return objs

def by_kind(objs, kind):
    return {o['metadata']['name']: o for o in objs if o['kind'] == kind}

class Charts(unittest.TestCase):
    def test_default_is_disabled_and_no_legacy_contract(self):
        self.assertEqual(objects({}), [])
        self.assertNotEqual(render({'components': {}}).returncode, 0)
        self.assertNotEqual(render({'database': {}}).returncode, 0)
        self.assertNotEqual(render({'ingress': {'enabled': True}}).returncode, 0)

    def test_independent_topology_routes_secrets_and_storage(self):
        objs = objects(config())
        deployments = by_kind(objs, 'Deployment')
        self.assertEqual(len(deployments), 14)  # 10 frontend/gateway + 3 backends + Caddy
        self.assertTrue(all('example-' + n in deployments for n in FRONT))
        self.assertEqual(len(by_kind(objs, 'Secret')), 0)
        self.assertEqual(len(by_kind(objs, 'Ingress')), 0)
        self.assertEqual(len(by_kind(objs, 'StatefulSet')), 1)
        state = by_kind(objs, 'StatefulSet')['example-postgresql']
        self.assertEqual(state['spec']['persistentVolumeClaimRetentionPolicy'], {'whenDeleted': 'Retain', 'whenScaled': 'Retain'})
        self.assertEqual(state['spec']['volumeClaimTemplates'][0]['spec']['storageClassName'], 'example-storage')
        pod = state['spec']['template']['spec']
        self.assertEqual(pod['containers'][0]['env'][-1]['valueFrom']['secretKeyRef']['name'], 'example-database')
        services = by_kind(objs, 'Service')
        self.assertEqual([n for n,s in services.items() if s['spec'].get('type') == 'LoadBalancer'], ['example-caddy-ingress'])
        for name, svc in services.items():
            if name.startswith('example-gateway'):
                self.assertEqual(svc['spec']['type'], 'ClusterIP')
        caddy = by_kind(objs, 'ConfigMap')['example-caddy-config']['data']['Caddyfile']
        self.assertLess(caddy.index('@auth'), caddy.index('@core'))
        self.assertIn('example-gateway-admin:80', caddy)
        self.assertIn('example-frontend-router:80', caddy)
        self.assertIn('example-billing:80', caddy)
        self.assertIn('tls /tls/console/tls.crt /tls/console/tls.key', caddy)
        router = deployments['example-frontend-router']['spec']['template']['spec']['containers'][0]
        self.assertEqual(next(e['value'] for e in router['env'] if e['name'] == 'STATIC_ORIGIN'), 'http://example-static-pages')
        keys = [(o['apiVersion'],o['kind'],o['metadata']['name']) for o in objs]
        self.assertEqual(len(keys), len(set(keys)))
        # Every Service selector must select a rendered workload, including grouped mode.
        pods = [o['spec']['template'] for o in objs if o['kind'] in ['Deployment', 'StatefulSet']]
        for svc in services.values():
            selector = svc['spec']['selector']
            matches = [p for p in pods if all(p['metadata']['labels'].get(k) == v for k,v in selector.items())]
            self.assertTrue(matches, svc['metadata']['name'])
        if os.environ.get('WEBSAAS_RENDER_DIR'):
            out=Path(os.environ['WEBSAAS_RENDER_DIR']);out.mkdir(parents=True,exist_ok=True)
            (out/'independent.yaml').write_text(yaml.safe_dump_all(objs))

    def test_grouped_preserves_service_identity(self):
        v=config();v['console']['deploymentProfile']='grouped'
        v['console']['groups']={'frontend': {'members':FRONT,'replicas':2}}
        for i,item in enumerate(v['console']['components'].values()):
            item['port']=8100+i
            item['probes']={'readinessProbe': {'httpGet': {'path':'/healthz','port':item['port']}}}
        v['edgeGateway']['deploymentProfile']='grouped'
        v['edgeGateway']['groups']={'gateways': {'members':['gateway-auth','gateway-admin','gateway-core'],'replicas':3}}
        for i,item in enumerate(v['edgeGateway']['boundaries'].values()):
            item['port']=8200+i
        objs=objects(v);deployments=by_kind(objs,'Deployment')
        self.assertEqual(len(deployments),6)
        pod=deployments['example-console-frontend']['spec']['template']['spec']
        self.assertEqual(len(pod['containers']),7)
        services=by_kind(objs,'Service')
        for role in FRONT:
            self.assertEqual(services['example-'+role]['spec']['selector']['websaas.io/workload'],'console-frontend')
            self.assertEqual(services['example-'+role]['spec']['ports'][0]['targetPort'],v['console']['components'][role]['port'])

    def test_single_container_and_hpa(self):
        v=config();v['console']['deploymentProfile']='single-container';v['console']['singleContainer']['image']=IMAGE
        v['caddy']['frontendService']='console'
        scale=v['console']['singleContainer']['autoscaling'];scale['enabled']=True
        objs=objects(v)
        self.assertIn('example-console',by_kind(objs,'Deployment'))
        self.assertNotIn('example-frontend-router',by_kind(objs,'Deployment'))
        self.assertIn('example-console',by_kind(objs,'HorizontalPodAutoscaler'))
        self.assertNotIn('replicas',by_kind(objs,'Deployment')['example-console']['spec'])
        v['postgresql']['storage']['existingClaim']='restored-database'
        self.assertNotIn('volumeClaimTemplates',by_kind(objects(v),'StatefulSet')['example-postgresql']['spec'])

    def test_tunnel_peer_verification_and_key_permissions(self):
        v=config();v['stunnel']=defaults('stunnel');v['stunnel'].update(enabled=True,image=IMAGE)
        v['stunnel']['client'].update(enabled=True,connect='database.example.test:15432',checkHost='database.example.test',existingSecret='client-identity')
        v['stunnel']['server'].update(enabled=True,existingSecret='server-identity',allowedCIDRs=['192.0.2.0/24'])
        objs=objects(v);dep=by_kind(objs,'Deployment');cm=by_kind(objs,'ConfigMap')
        self.assertIn('checkHost = database.example.test',cm['example-stunnel-client']['data']['stunnel.conf'])
        self.assertIn('verifyChain = yes',cm['example-stunnel-client']['data']['stunnel.conf'])
        self.assertIn('requireCert = yes',cm['example-stunnel-server']['data']['stunnel.conf'])
        for role in ['client','server']:
            pod=dep['example-stunnel-'+role]['spec']['template']['spec']
            self.assertEqual(pod['securityContext']['fsGroup'],1000)
            secrets=[v['secret'] for v in pod['volumes'] if 'secret' in v]
            self.assertEqual(len(secrets),1)
            self.assertEqual(secrets[0]['secretName'],role+'-identity')
            self.assertEqual(secrets[0]['defaultMode'],0o440)
        self.assertEqual(by_kind(objs,'Service')['example-stunnel-client']['spec']['ports'][0]['port'],5432)

    def test_standalone_application_charts(self):
        for name in ['accounts','billing','content','static-pages','frontend-router','frontend-ssr']:
            v=defaults(name);v['enabled']=True;v['workload']['image']=IMAGE
            with self.subTest(chart=name):
                self.assertEqual(len(by_kind(objects(v,SUB/name),'Deployment')),1)

    def test_fail_closed(self):
        cases=[]
        v=config();v['accounts']['workload']['image']='example/app:latest';cases.append(v)
        v=config();v['console']['components']['ssr-auth']['image']='';cases.append(v)
        v=config();v['caddy']['tls']['consoleSecret']='';cases.append(v)
        v=config();v['caddy']['routes']['accountsHost']=v['caddy']['routes']['consoleHost'];cases.append(v)
        v=config();v['postgresql']['storage']['className']='';cases.append(v)
        v=config();v['postgresql']['existingSecret']='';cases.append(v)
        v=config();v['caddy']['gatewayEnabled']=False;cases.append(v)
        v=config();v['console']['deploymentProfile']='single-container';v['console']['singleContainer']['image']=IMAGE;cases.append(v)
        for members in [FRONT[:-1],FRONT+['unknown'],FRONT+['ssr-auth']]:
            v=config();v['console']['deploymentProfile']='grouped';v['console']['groups']={'all':{'members':members,'replicas':1}};cases.append(v)
        v=config();v['console']['deploymentProfile']='grouped';v['console']['groups']={'all':{'members':FRONT,'replicas':1}};cases.append(v)  # port conflict
        v=config();v['accounts']['workload']['replicas']=-1;cases.append(v)
        v=config();v['accounts']['workload']['autoscaling'].update(enabled=True,minReplicas=4,maxReplicas=2);cases.append(v)
        v=config();v['stunnel']=defaults('stunnel');v['stunnel'].update(enabled=True,image=IMAGE);v['stunnel']['server'].update(enabled=True,existingSecret='example-tls');cases.append(v)
        for i,v in enumerate(cases):
            with self.subTest(case=i):self.assertNotEqual(render(v).returncode,0)

    def test_caddy_configuration_with_real_binary(self):
        if os.environ.get('WEBSAAS_VALIDATE_CADDY') != '1':
            self.skipTest('set WEBSAAS_VALIDATE_CADDY=1 to validate with pinned Caddy container')
        image='caddy@sha256:4c6e91c6ed0e2fa03efd5b44747b625fec79bc9cd06ac5235a779726618e530d'
        with tempfile.TemporaryDirectory() as directory:
            d=Path(directory)
            d.chmod(0o755)
            cert=run('openssl','req','-x509','-newkey','rsa:2048','-nodes','-keyout',str(d/'tls.key'),'-out',str(d/'tls.crt'),'-days','1','-subj','/CN=example.test')
            self.assertEqual(cert.returncode,0,cert.stderr)
            (d/'tls.key').chmod(0o444)  # ephemeral self-signed test key only
            for http in [False,True]:
                v=config();v['caddy']['httpOnly']=http
                content=by_kind(objects(v),'ConfigMap')['example-caddy-config']['data']['Caddyfile']
                for role in ['console','accounts','billing']:
                    content=content.replace('/tls/'+role+'/','/fixtures/')
                (d/'Caddyfile').write_text(content)
                r=run('docker','run','--rm','--user','1000:1000','--network','none','--read-only','--cap-drop','ALL','--cap-add','NET_BIND_SERVICE','--security-opt','no-new-privileges','-v',directory+':/fixtures:ro',image,'caddy','validate','--config','/fixtures/Caddyfile','--adapter','caddyfile')
                self.assertEqual(r.returncode,0,r.stdout+r.stderr)

    def test_production_guards(self):
        v=config();v['global']['environment']='prod'
        self.assertNotEqual(render(v).returncode,0)
        v['global']['expectedNamespace']='example-sit'
        self.assertEqual(render(v).returncode,0)
        v['caddy']['httpOnly']=True
        self.assertNotEqual(render(v).returncode,0)
        v['caddy']['httpOnly']=False;v['accounts']['workload']['secretRefs']=[]
        self.assertNotEqual(render(v).returncode,0)

    def test_packaged_chart(self):
        package=os.environ.get('WEBSAAS_PACKAGED_CHART')
        if not package:self.skipTest('package check is enabled by check-web-saas-charts.sh')
        source=objects(config());packaged=objects(config(),Path(package))
        key=lambda o:(o['kind'],o['metadata']['name'])
        self.assertEqual(sorted(source,key=key),sorted(packaged,key=key))

    def test_repeat_render_is_identical(self):
        outputs=[render(config()).stdout for _ in range(3)]
        self.assertTrue(outputs[0])
        self.assertEqual(outputs[0],outputs[1]);self.assertEqual(outputs[1],outputs[2])

if __name__ == '__main__': unittest.main()
