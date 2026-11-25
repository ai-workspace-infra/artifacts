// Run: npm test (bundles TS with esbuild, then asserts with node:assert)
const esbuild = require('esbuild');
const assert = require('node:assert/strict');
const path = require('path');

const out = esbuild.buildSync({
  stdin: {
    contents: "export * from './dataModel';",
    resolveDir: path.resolve(__dirname, '../src'),
    loader: 'ts',
  },
  bundle: true,
  write: false,
  format: 'cjs',
  platform: 'node',
});

const mod = { exports: {} };
new Function('module', 'exports', 'require', out.outputFiles[0].text)(mod, mod.exports, require);
const m = mod.exports;

// 1. Validate 1s-binned 30m timeseries datasets (40 VU and 500 VU)
assert.equal(m.K6_SERIES_40VU.length, 121, '40 VU 30m series has 121 15s bins');
assert.equal(m.K6_SERIES_500VU.length, 121, '500 VU 30m series has 121 15s bins');
assert.equal(m.K6_RAMP_CHECKPOINTS.length, 13, '13 ramp checkpoints from 40 to 500 VU');

// 2. Validate 40 VU baseline, 120 VU sweet spot, 200 VU drain threshold, and 500 VU stress limit
const m40 = m.computeOperatingModel(40, { cleanTmpfs: false, vectorOptimized: true, userMultiplier: 4 });
assert.equal(m40.vu, 40);
assert.equal(m40.onlineUsers, 160);
assert.equal(m40.sloLevel, 'PASS');
assert.ok(Math.abs(m40.estimatedP95Ms - 207.1) < 1, '40 VU P95 calibrated to 207.1 ms');
assert.equal(m40.roi.tiers[7].costPerUserUsd, 0.0438);

const m120 = m.computeOperatingModel(120, {
  cleanTmpfs: true,
  vectorOptimized: true,
  userMultiplier: 4,
  gbPerUserMonth: 10,
  trafficBillingMode: 'pooled',
});
assert.equal(m120.vu, 120);
assert.equal(m120.onlineUsers, 480);
assert.equal(m120.sloLevel, 'PASS');
assert.equal(m120.roi.includedGbPerUser, 4.27);
assert.equal(m120.roi.extraGbPerUser, 5.73);
assert.equal(m120.roi.tiers[7].costPerVuUsd, 0.0583);
assert.equal(m120.roi.tiers[7].costPerUserUsd, 0.0146);
assert.equal(m120.roi.tiers[7].computeCostPerUserUsd, 0.0146);
assert.equal(m120.roi.tiers[7].pooledTrafficRatePerGb, 0.003418);
assert.equal(m120.roi.tiers[7].overageTrafficRatePerGb, 0.09);
assert.equal(m120.roi.tiers[7].trafficCostPerUserPooledUsd, 0.0196);
assert.equal(m120.roi.tiers[7].totalCostPerUserPooledUsd, 0.0342);
assert.equal(m120.roi.tiers[7].trafficCostPerUserOverageUsd, 0.516);
assert.equal(m120.roi.tiers[7].totalCostPerUserOverageUsd, 0.5306);
assert.equal(m120.roi.tiers[10].costPerUserUsd, 0.0208);
assert.equal(m120.roi.tiers[12].costPerUserUsd, 0.025);

// Validate 4.27 GB bundled quota (0 traffic overage) and 20 GB traffic amortization
const m120Bundled = m.computeOperatingModel(120, { userMultiplier: 4, gbPerUserMonth: 4.27 });
assert.equal(m120Bundled.roi.extraGbPerUser, 0);
assert.equal(m120Bundled.roi.tiers[7].trafficCostPerUserPooledUsd, 0);
assert.equal(m120Bundled.roi.tiers[7].totalCostPerUserPooledUsd, 0.0146);
assert.equal(m120Bundled.roi.tiers[7].totalCostPerUserOverageUsd, 0.0146);

const m12020Gb = m.computeOperatingModel(120, {
  userMultiplier: 4,
  gbPerUserMonth: 20,
  trafficBillingMode: 'overage',
});
assert.equal(m12020Gb.roi.tiers[7].trafficCostPerUserPooledUsd, 0.0538);
assert.equal(m12020Gb.roi.tiers[7].totalCostPerUserPooledUsd, 0.0684);
assert.equal(m12020Gb.roi.tiers[7].trafficCostPerUserOverageUsd, 1.416);
assert.equal(m12020Gb.roi.tiers[7].totalCostPerUserOverageUsd, 1.4306);
assert.equal(m12020Gb.roi.tiers[7].activeTotalCostPerUserUsd, 1.4306);

// 3. Validate /tmp 75 MiB cleanup effect (+120 VU headroom before 75% RAM)
const mWithTmp = m.computeOperatingModel(150, { cleanTmpfs: false, vectorOptimized: true });
const mCleanTmp = m.computeOperatingModel(150, { cleanTmpfs: true, vectorOptimized: true });
assert.equal(mWithTmp.memory.maxSafeVu75, 280);
assert.equal(mCleanTmp.memory.maxSafeVu75, 407);
assert.ok(
  mCleanTmp.memory.maxSafeVu75 - mWithTmp.memory.maxSafeVu75 >= 120,
  'Cleaning /tmp 75 MiB adds >120 VU safe capacity'
);

// 4. Validate SLO state transitions (P1_WARN at 160 VU, P2_DRAIN at 200 VU, P3_CIRCUIT_BREAK at 500 VU)
assert.equal(m.computeOperatingModel(160).sloLevel, 'P1_WARN');
assert.equal(m.computeOperatingModel(200).sloLevel, 'P2_DRAIN');
assert.equal(m.computeOperatingModel(500).sloLevel, 'P3_CIRCUIT_BREAK');

// 5. Validate simulated timeseries envelope & Prometheus instant + range k6 pipeline frame parsing
const sim120 = m.simulateTimeseriesForVu(120);
assert.equal(sim120.length, 121);
assert.ok(sim120[60].qps > 35 && sim120[60].qps < 206);

const t0 = 1764040000000;
const live = m.parsePrometheusTelemetry([
  {
    refId: 'VU',
    fields: [{ name: 'Value', type: 'number', labels: { instance: 'jp-xconnect-02.svc.plus' }, values: [135] }],
  },
  {
    refId: 'K6_VUS_TS',
    fields: [
      { name: 'Time', type: 'time', values: [t0, t0 + 60000, t0 + 120000] },
      {
        name: 'k6_vus',
        type: 'number',
        labels: {
          testid: 'k6-prod-jp-xconnect-02-20261125-pipeline',
          test_profile: 'proxy_capacity',
          environment: 'prod',
        },
        values: [40, 120, 150],
      },
    ],
  },
  {
    refId: 'K6_QPS_TS',
    fields: [
      { name: 'Time', type: 'time', values: [t0, t0 + 60000, t0 + 120000] },
      {
        name: 'k6_http_reqs_total',
        type: 'number',
        labels: { testid: 'k6-prod-jp-xconnect-02-20261125-pipeline' },
        values: [35.3, 80.4, 95.2],
      },
    ],
  },
  {
    refId: 'K6_P95_TS',
    fields: [
      { name: 'Time', type: 'time', values: [t0, t0 + 60000, t0 + 120000] },
      {
        name: 'k6_http_req_duration_p95',
        type: 'number',
        labels: { testid: 'k6-prod-jp-xconnect-02-20261125-pipeline' },
        values: [207.1, 680.0, 945.0],
      },
    ],
  },
  {
    refId: 'PROC_RSS',
    fields: [
      {
        name: 'namedprocess_namegroup_memory_bytes',
        type: 'number',
        labels: { groupname: 'vector' },
        values: [71.5 * 1024 * 1024],
      },
    ],
  },
]);
assert.equal(live.hasLiveTelemetry, true);
assert.equal(live.hasK6PipelineData, true);
assert.equal(live.instance, 'jp-xconnect-02.svc.plus');
assert.equal(live.testId, 'k6-prod-jp-xconnect-02-20261125-pipeline');
assert.equal(live.testProfile, 'proxy_capacity');
assert.equal(live.environment, 'prod');
assert.equal(live.activeVusOrConns, 150);
assert.equal(live.peakVus, 150);
assert.equal(live.peakQps, 95.2);
assert.equal(live.liveP95Ms, 945);
assert.equal(live.liveSeries.length, 3);
assert.equal(live.processRssMib.vector, 71.5);

console.log('all xconnect-topology-roi-panel v1.1.0 dataModel tests passed');
