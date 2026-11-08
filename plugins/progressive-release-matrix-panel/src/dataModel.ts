/**
 * Pure data model for the Collapsible Routes & APIs Matrix and gate/flagger semantics.
 * Static catalog metadata and runtime telemetry are kept separate: catalog entries never
 * carry PASS/latency by themselves. Counts are always derived from the merged inventory.
 */
import type { CatalogItem } from './routesCatalog';

export type AssetResult = 'PASS' | 'FAIL' | 'NO DATA' | 'NOT PROBED';
export type DataSource = 'live' | 'prometheus' | 'mock' | 'catalog';

export interface InventoryItem {
  id: string;
  order: number;
  type: 'frontend' | 'api';
  categoryKey: string;
  categoryName: string;
  categoryEnName: string;
  service: string;
  serviceDomain: string;
  path: string;
  method: string;
  description: string;
  expectedHttp: number | null;
  observedHttp: number | null;
  latencyMs: number | null;
  freshnessSec: number | null;
  result: AssetResult;
  source: DataSource;
  /** Why the asset is not actively probed (unsafe method, side-effect flow, dynamic template). */
  probeNote?: string;
}

export interface ProbeSample {
  status: 'PASS' | 'FAIL' | 'NO DATA';
  httpCode: number | string | null;
  latencyMs: number | string | null;
  freshnessSec?: number | null;
}

const SIDE_EFFECT_PATHS = [/\/logout\b/, /\/unsubscribe\b/];
const SAFE_METHODS = new Set(['GET', 'HEAD']);

/** Decide whether a catalog asset may be actively probed. Never probe unsafe methods. */
export function probePolicy(method: string, path: string): { probe: boolean; note?: string } {
  const m = (method || 'GET').split(',')[0].trim().toUpperCase();
  if (!SAFE_METHODS.has(m)) return { probe: false, note: `${m}: unsafe method, catalog only` };
  if (SIDE_EFFECT_PATHS.some((re) => re.test(path))) return { probe: false, note: 'side-effect flow, not actively called' };
  if (/[:\[{]/.test(path)) return { probe: false, note: 'dynamic template, no authorised probe parameter' };
  return { probe: true };
}

export const assetKey = (service: string, method: string, path: string) =>
  `${(service || '').toLowerCase()} ${(method || 'GET').split(',')[0].trim().toUpperCase()} ${path}`;

/** Deduplicate by service/method/path, keeping first occurrence order. */
export function dedupeInventory<T extends { service: string; method: string; path: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const it of items) {
    const k = assetKey(it.service, it.method, it.path);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(it);
  }
  return out;
}

const num = (v: any): number | null => {
  if (v === null || v === undefined || v === '' || v === '—') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

/**
 * Merge static catalog with telemetry. Missing telemetry yields NO DATA (never PASS);
 * unsafe or side-effect assets yield NOT PROBED.
 */
export function mergeCatalogWithTelemetry(
  catalog: CatalogItem[],
  lookup: (service: string, path: string) => ProbeSample | undefined,
  source: DataSource
): InventoryItem[] {
  return dedupeInventory(catalog).map((c) => {
    const policy = probePolicy(c.method, c.path);
    const base: InventoryItem = {
      id: c.id,
      order: c.order,
      type: c.type,
      categoryKey: c.categoryKey,
      categoryName: c.categoryName,
      categoryEnName: c.categoryEnName,
      service: c.service,
      serviceDomain: c.serviceDomain,
      path: c.path,
      method: c.method,
      description: c.description,
      expectedHttp: num(c.expectedHttp),
      observedHttp: null,
      latencyMs: null,
      freshnessSec: null,
      result: policy.probe ? 'NO DATA' : 'NOT PROBED',
      source: 'catalog',
      probeNote: policy.note,
    };
    const s = lookup(c.service, c.path);
    if (!s || s.status === 'NO DATA') return base;
    return {
      ...base,
      observedHttp: num(s.httpCode),
      latencyMs: num(s.latencyMs),
      freshnessSec: num(s.freshnessSec),
      result: s.status,
      source,
    };
  });
}

/** Normalise an inventory payload from the console BFF (allRoutesAndApis). */
export function normalizeLiveInventory(list: any[]): InventoryItem[] {
  const items: InventoryItem[] = list
    .filter((i) => i && i.path && (i.type === 'frontend' || i.type === 'api'))
    .map((i, idx) => {
      const r = String(i.result || '').toUpperCase();
      const result: AssetResult =
        r === 'PASS' ? 'PASS' : r === 'FAIL' ? 'FAIL' : r === 'NOT PROBED' ? 'NOT PROBED' : 'NO DATA';
      return {
        id: String(i.id ?? `${i.type}-${idx + 1}`),
        order: Number(i.order ?? idx + 1),
        type: i.type,
        categoryKey: i.categoryKey || (i.type === 'frontend' ? 'fe-other' : 'be-other'),
        categoryName: i.categoryName || i.categoryKey || '未分类',
        categoryEnName: i.categoryEnName || i.categoryKey || 'Uncategorized',
        service: i.service || 'Unknown',
        serviceDomain: i.serviceDomain || '',
        path: i.path,
        method: i.method || 'GET',
        description: i.description || '',
        expectedHttp: num(i.expectedHttp),
        observedHttp: num(i.observedHttp),
        latencyMs: num(i.latencyMs),
        freshnessSec: num(i.freshnessSec),
        result,
        source: 'live' as DataSource,
      };
    });
  return dedupeInventory(items);
}

export interface CategoryNode {
  key: string;
  name: string;
  enName: string;
  type: 'frontend' | 'api';
  items: InventoryItem[];
  counts: Counts;
}
export interface RootNode {
  type: 'frontend' | 'api';
  categories: CategoryNode[];
  counts: Counts;
}
export interface Counts {
  total: number;
  pass: number;
  fail: number;
  noData: number;
  notProbed: number;
}

export function countOf(items: InventoryItem[]): Counts {
  const c: Counts = { total: items.length, pass: 0, fail: 0, noData: 0, notProbed: 0 };
  for (const i of items) {
    if (i.result === 'PASS') c.pass++;
    else if (i.result === 'FAIL') c.fail++;
    else if (i.result === 'NOT PROBED') c.notProbed++;
    else c.noData++;
  }
  return c;
}

export function matchesQuery(i: InventoryItem, q: string): boolean {
  const s = q.trim().toLowerCase();
  if (!s) return true;
  return [i.path, i.description, i.service, i.serviceDomain, i.categoryName, i.categoryEnName, i.method, i.categoryKey]
    .some((v) => (v || '').toLowerCase().includes(s));
}

/** Build the three-level tree: root (frontend/api) -> category -> leaf rows. */
export function buildTree(items: InventoryItem[], filter: 'all' | 'frontend' | 'api', query: string): RootNode[] {
  const roots: RootNode[] = [];
  for (const type of ['frontend', 'api'] as const) {
    if (filter !== 'all' && filter !== type) continue;
    const list = items.filter((i) => i.type === type && matchesQuery(i, query)).sort((a, b) => a.order - b.order);
    const map = new Map<string, CategoryNode>();
    for (const it of list) {
      if (!map.has(it.categoryKey)) {
        map.set(it.categoryKey, { key: it.categoryKey, name: it.categoryName, enName: it.categoryEnName, type, items: [], counts: countOf([]) });
      }
      map.get(it.categoryKey)!.items.push(it);
    }
    const categories = Array.from(map.values()).map((c) => ({ ...c, counts: countOf(c.items) }));
    categories.sort((a, b) => b.counts.total - a.counts.total);
    roots.push({ type, categories, counts: countOf(list) });
  }
  return roots;
}

export type GateState = 'ALLOWED' | 'BLOCKED' | 'UNKNOWN' | 'PREVIEW';

/**
 * Release gate. Mock data can never produce ALLOWED; missing samples yield UNKNOWN.
 */
export function evaluateGate(checks: { status: string }[], source: DataSource, expected = 10): { state: GateState; summary: string } {
  if (source === 'mock' || source === 'catalog') {
    return { state: 'PREVIEW', summary: 'Preview data — not a release decision' };
  }
  const fail = checks.filter((c) => c.status === 'FAIL').length;
  const pass = checks.filter((c) => c.status === 'PASS').length;
  const missing = expected - pass - fail;
  if (fail > 0) return { state: 'BLOCKED', summary: `${fail} / ${expected} checks failed` };
  if (missing > 0) return { state: 'UNKNOWN', summary: `${missing} / ${expected} checks have no data` };
  return { state: 'ALLOWED', summary: `All ${expected} checks passed` };
}

export type CanaryPhase = 'Progressing' | 'Succeeded' | 'Failed' | 'Not configured' | 'Unknown';

export interface CanaryView {
  phase: CanaryPhase;
  weight: number | null;
  primaryPercent: number | null;
  candidatePercent: number | null;
}

/**
 * Normalise a canary record. "Not configured" must be explicit; absent telemetry is Unknown,
 * never mapped to Succeeded 0%.
 */
export function normalizeCanary(fs: any | undefined): CanaryView {
  if (!fs) return { phase: 'Unknown', weight: null, primaryPercent: null, candidatePercent: null };
  if (fs.phase === 'Not configured' || fs.configured === false) {
    return { phase: 'Not configured', weight: null, primaryPercent: null, candidatePercent: null };
  }
  const known: CanaryPhase[] = ['Progressing', 'Succeeded', 'Failed'];
  const phase: CanaryPhase = known.includes(fs.phase) ? fs.phase : 'Unknown';
  const w = num(fs.candidateTrafficPct ?? fs.weight);
  if (phase === 'Unknown' || w === null) {
    return { phase, weight: null, primaryPercent: null, candidatePercent: null };
  }
  const cand = Math.max(0, Math.min(100, w));
  const prim = num(fs.primaryTrafficPct) ?? 100 - cand;
  return { phase, weight: cand, primaryPercent: prim, candidatePercent: cand };
}
