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

const m120 = m.computeOperatingModel(120, { cleanTmpfs: true, vectorOptimized: true, userMultiplier: 4 });
assert.equal(m120.vu, 120);
assert.equal(m120.onlineUsers, 480);
assert.equal(m120.sloLevel, 'PASS');
assert.equal(m120.roi.tiers[7].costPerVuUsd, 0.0583);
assert.equal(m120.roi.tiers[7].costPerUserUsd, 0.0146);
assert.equal(m120.roi.tiers[10].costPerUserUsd, 0.0208);
assert.equal(m120.roi.tiers[12].costPerUserUsd, 0.025);

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

// 5. Validate simulated timeseries envelope & Prometheus frame parsing
const sim120 = m.simulateTimeseriesForVu(120);
assert.equal(sim120.length, 121);
assert.ok(sim120[60].qps > 35 && sim120[60].qps < 206);

const live = m.parsePrometheusTelemetry([
  {
    refId: 'VU',
    fields: [{ name: 'Value', type: 'number', labels: { instance: 'jp-xconnect-02.svc.plus' }, values: [135] }],
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
assert.equal(live.instance, 'jp-xconnect-02.svc.plus');
assert.equal(live.activeVusOrConns, 135);
assert.equal(live.processRssMib.vector, 71.5);

console.log('all xconnect-topology-roi-panel dataModel tests passed');
