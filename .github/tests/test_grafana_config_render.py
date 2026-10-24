import pathlib, subprocess, tempfile, unittest, yaml
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
if __name__=='__main__':unittest.main()
