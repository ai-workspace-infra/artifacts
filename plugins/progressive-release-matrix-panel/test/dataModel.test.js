// Run: npm test  (bundles TS with esbuild, then asserts with node:assert)
const esbuild = require('esbuild');
const assert = require('node:assert/strict');
const path = require('path');
const out = esbuild.buildSync({
  stdin: { contents: "export * from './dataModel'; export { RAW_ROUTES_CATALOG } from './routesCatalog';", resolveDir: path.resolve(__dirname, '../src'), loader: 'ts' },
  bundle: true, write: false, format: 'cjs', platform: 'node',
});
const mod = { exports: {} }; new Function('module', 'exports', 'require', out.outputFiles[0].text)(mod, mod.exports, require); const m = mod.exports;
const cat = m.RAW_ROUTES_CATALOG;

// counts are generated from the catalog, not constants
const merged = m.mergeCatalogWithTelemetry(cat, () => undefined, 'catalog');
const fe = merged.filter((i) => i.type === 'frontend').length, be = merged.filter((i) => i.type === 'api').length;
assert.equal(fe + be, merged.length);
assert.equal(m.dedupeInventory(cat.concat(cat)).length, merged.length, 'dedupe by service/method/path');
console.log(`inventory: ${merged.length} (frontend ${fe}, api ${be})`);

// no telemetry => never PASS
assert.ok(merged.every((i) => i.result === 'NO DATA' || i.result === 'NOT PROBED'));
assert.ok(merged.every((i) => i.observedHttp === null && i.latencyMs === null));
// unsafe methods / side-effect flows are not probed
assert.ok(merged.filter((i) => !/^GET|^HEAD/.test(i.method)).every((i) => i.result === 'NOT PROBED'));
assert.equal(m.probePolicy('GET', '/logout').probe, false);
assert.equal(m.probePolicy('GET', '/email/unsubscribe').probe, false);
assert.equal(m.probePolicy('DELETE', '/api/x').probe, false);
assert.equal(m.probePolicy('GET', '/login').probe, true);

// telemetry merge
const withLogin = m.mergeCatalogWithTelemetry(cat, (s, p) => (s === 'Console' && p === '/login' ? { status: 'PASS', httpCode: 200, latencyMs: 12, freshnessSec: 3 } : undefined), 'prometheus');
const login = withLogin.find((i) => i.path === '/login' && i.service === 'Console');
assert.equal(login.result, 'PASS'); assert.equal(login.source, 'prometheus');

// three-level tree, search, filter
const tree = m.buildTree(merged, 'all', '');
assert.deepEqual(tree.map((r) => r.type), ['frontend', 'api']);
assert.equal(tree[0].counts.total, fe);
assert.equal(tree[0].categories.reduce((a, c) => a + c.counts.total, 0), fe);
assert.equal(m.buildTree(merged, 'api', '').length, 1);
const q = m.buildTree(merged, 'all', 'register');
assert.ok(q[0].counts.total >= 1 && q[0].counts.total < fe);

// gate: mock never ALLOWED; missing data UNKNOWN; fail BLOCKED
const ten = Array.from({ length: 10 }, () => ({ status: 'PASS' }));
assert.equal(m.evaluateGate(ten, 'mock').state, 'PREVIEW');
assert.equal(m.evaluateGate(ten, 'prometheus').state, 'ALLOWED');
assert.equal(m.evaluateGate(ten.slice(0, 9), 'prometheus').state, 'UNKNOWN');
assert.equal(m.evaluateGate([{ status: 'FAIL' }, ...ten.slice(1)], 'live').state, 'BLOCKED');

// canary: Not configured vs Succeeded 0% vs Unknown
assert.deepEqual(m.normalizeCanary({ phase: 'Not configured' }), { phase: 'Not configured', weight: null, primaryPercent: null, candidatePercent: null });
assert.equal(m.normalizeCanary({ phase: 'Succeeded', weight: 0 }).candidatePercent, 0);
assert.equal(m.normalizeCanary(undefined).phase, 'Unknown');
assert.equal(m.normalizeCanary({ phase: 'Succeeded' }).weight, null);
assert.equal(m.normalizeCanary({ phase: 'Progressing', weight: 20 }).primaryPercent, 80);

// live inventory normalisation keeps unknown results as NO DATA
const live = m.normalizeLiveInventory([{ type: 'api', path: '/a', method: 'GET', service: 'X', result: 'weird' }, { type: 'api', path: '/a', method: 'GET', service: 'X' }]);
assert.equal(live.length, 1); assert.equal(live[0].result, 'NO DATA');
console.log('all dataModel tests passed');
