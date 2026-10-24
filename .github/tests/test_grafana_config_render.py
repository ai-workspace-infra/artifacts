import pathlib, subprocess, tempfile, unittest, yaml, importlib.util, io, zipfile, json, hashlib
from unittest.mock import patch
CHART=pathlib.Path(__file__).resolve().parents[2]/'oci/charts/open-platform/charts/observability-stack'
class Provisioning(unittest.TestCase):
 def render(self,values):
  with tempfile.NamedTemporaryFile(mode='w',suffix='.yaml') as f:
   yaml.safe_dump(values,f);f.flush()
   return subprocess.run(['helm','template','migration',str(CHART),'-f',f.name],capture_output=True,text=True)
 def test_external_bundle_with_existing_platform(self):
  r=self.render({'grafana':{'datasourcesConfigMap':'source-datasources','appsConfigMap':'source-apps','runtimeSecret':'runtime','bundleChecksum':'fixture','dashboardsConfigMap':'platform','plugins':['victoriametrics-logs-datasource@0.33.1'],'dashboardProviders':[{'name':'general','folder':'','folderUid':'','path':'general','configMaps':['a','b']},{'name':'alerts','folder':'Alerts','folderUid':'alerts-uid','path':'alerts','configMaps':['empty']}]}})
  self.assertEqual(r.returncode,0,r.stderr)
  docs=list(yaml.safe_load_all(r.stdout));d=next(x for x in docs if x['kind']=='Deployment');pod=d['spec']['template']['spec'];g=next(x for x in pod['containers'] if x['name']=='grafana')
  self.assertEqual(d['spec']['strategy']['type'],'Recreate')
  self.assertEqual(g['envFrom'],[{'secretRef':{'name':'runtime'}}])
  mounts={x['mountPath']:x['name'] for x in g['volumeMounts']}
  self.assertEqual(mounts['/etc/grafana/provisioning/datasources/datasources.yaml'],'grafana-datasources')
  self.assertIn('/etc/grafana/platform-dashboards',mounts)
  cm=next(x for x in docs if x['kind']=='ConfigMap');providers=yaml.safe_load(cm['data']['dashboards.yaml'])['providers']
  self.assertEqual([x['name'] for x in providers],['platform','general','alerts']);self.assertEqual(providers[2]['folderUid'],'alerts-uid')
 def test_unsafe_paths_and_unpinned_plugins_rejected(self):
  for v in [{'plugins':['latest']},{'unsignedPlugins':['*']},{'dashboardProviders':[{'path':'../escape','configMaps':['x']}]}]:
   self.assertNotEqual(self.render({'grafana':v}).returncode,0)
class VerifiedArchives(unittest.TestCase):
 def test_checksum_identity_and_path_traversal(self):
  spec=importlib.util.spec_from_file_location('installer',CHART/'files/install-plugins.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
  def archive(unsafe=False):
   b=io.BytesIO()
   with zipfile.ZipFile(b,'w') as z:
    z.writestr('fixture/plugin.json',json.dumps({'id':'fixture','info':{'version':'1.0.0'}}))
    z.writestr('fixture/../escape' if unsafe else 'fixture/module.js','fixture')
   return b.getvalue()
  for unsafe,bad_hash in [(False,False),(False,True),(True,False)]:
   data=archive(unsafe);item={'id':'fixture','version':'1.0.0','url':'https://example.test/archive.zip','sha256':'0'*64 if bad_hash else hashlib.sha256(data).hexdigest()}
   with tempfile.TemporaryDirectory() as directory,patch.object(m.urllib.request,'urlopen',return_value=io.BytesIO(data)):
    if unsafe or bad_hash:
     with self.assertRaises(AssertionError):m.install([item],directory)
    else:
     m.install([item],directory);self.assertTrue((pathlib.Path(directory)/'fixture/module.js').exists())
if __name__=='__main__':unittest.main()
