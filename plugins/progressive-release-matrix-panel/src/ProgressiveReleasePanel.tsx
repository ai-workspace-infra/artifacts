import React, { FC, useMemo, useState, useEffect } from 'react';
import { PanelProps } from '@grafana/data';
import { PanelOptions, EndpointStatus, FlaggerServiceStatus, RouteApiStatus } from './types';
import { RAW_ROUTES_CATALOG } from './routesCatalog';
import { mergeCatalogWithTelemetry, normalizeLiveInventory, buildTree, evaluateGate, normalizeCanary, countOf, DataSource } from './dataModel';

export const ProgressiveReleasePanel: FC<PanelProps<PanelOptions>> = (props) => {
  const {
    options,
    data,
    width,
    height,
    timeRange,
    replaceVariables,
  } = props;

  const {
    mode = 'all',
    useMockData = false,
    environment = 'PROD',
    showKpis = true,
    showMatrix = true,
    showFlagger = true,
    showDetails = true,
    showFooter = true,
    showRoutesTable = true,
    telemetryUrl = '',
  } = options;

  // Resolve environment label dynamically from dashboard context / data
  const resolvedEnv = useMemo(() => {
    let env = (environment || '').trim();
    if (replaceVariables) {
      try {
        const interpolated = replaceVariables(env || '$environment');
        if (interpolated && interpolated !== '$environment' && interpolated !== '${environment}') {
          env = interpolated;
        }
      } catch {
        // ignore
      }
    }
    // If still empty or dollar variable, try replaceVariables('$cluster')
    if ((!env || env.startsWith('$')) && replaceVariables) {
      try {
        const cluster = replaceVariables('$cluster');
        if (cluster && !cluster.startsWith('$')) {
          env = cluster.toLowerCase().includes('prod') ? 'PROD' : 'SIT';
        }
      } catch {
        // ignore
      }
    }
    // If still empty or dollar variable, inspect series labels
    if ((!env || env.startsWith('$')) && data?.series && data.series.length > 0) {
      for (const frame of data.series) {
        const field = frame.fields?.find((f: any) => f.labels && Object.keys(f.labels).length > 0);
        const labels: Record<string, string> = frame.labels || (field && (field as any).labels) || {};
        if (labels.environment) {
          env = labels.environment;
          break;
        }
        if (labels.cluster) {
          env = labels.cluster.toLowerCase().includes('prod') ? 'PROD' : 'SIT';
          break;
        }
      }
    }
    const finalEnv = (env && !env.startsWith('$') ? env : 'PROD').toUpperCase();
    return finalEnv === 'SIT' ? 'SIT' : 'PROD';
  }, [environment, replaceVariables, data]);

  // Dynamic Live Telemetry state from Web Console API
  const [livePayload, setLivePayload] = useState<any>(null);
  const [liveFetchStatus, setLiveFetchStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [lastFetchedAt, setLastFetchedAt] = useState<Date | null>(null);

  // Poll Web Console live telemetry dynamically (every 15s)
  useEffect(() => {
    let isMounted = true;
    let timer: any = null;

    const fetchTelemetry = async () => {
      try {
        const targetEnv = resolvedEnv.toLowerCase().includes('sit') ? 'SIT' : 'PROD';
        const base = replaceVariables ? replaceVariables(telemetryUrl) : telemetryUrl;
        if (!base || base.startsWith('$')) {
          return;
        }
        const url = `${base}${base.includes('?') ? '&' : '?'}environment=${targetEnv}`;
        const res = await fetch(url, {
          headers: { Accept: 'application/json' },
          mode: 'cors',
        });
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json && Array.isArray(json.allRoutesAndApis)) {
            setLivePayload(json);
            setLiveFetchStatus('success');
            setLastFetchedAt(new Date());
          }
        } else {
          if (isMounted) setLiveFetchStatus('error');
        }
      } catch (err) {
        if (isMounted) setLiveFetchStatus('error');
      }
    };

    if (!telemetryUrl || useMockData) {
      setLivePayload(null);
      setLiveFetchStatus('idle');
      return () => {
        isMounted = false;
      };
    }
    fetchTelemetry();
    timer = setInterval(fetchTelemetry, 15000);

    return () => {
      isMounted = false;
      if (timer) clearInterval(timer);
    };
  }, [resolvedEnv, telemetryUrl, useMockData, replaceVariables]);

  // Formatted observation window string (UTC)
  const observationWindowStr = useMemo(() => {
    try {
      if (timeRange && timeRange.from && timeRange.to) {
        const fromDate = (timeRange.from as any).toDate ? (timeRange.from as any).toDate() : new Date(timeRange.from as any);
        const toDate = (timeRange.to as any).toDate ? (timeRange.to as any).toDate() : new Date(timeRange.to as any);
        const formatUtc = (d: Date) => {
          const hh = String(d.getUTCHours()).padStart(2, '0');
          const mm = String(d.getUTCMinutes()).padStart(2, '0');
          return `${hh}:${mm}`;
        };
        const diffMins = Math.max(1, Math.round((toDate.getTime() - fromDate.getTime()) / 60000));
        return `Last ${diffMins} minutes (${formatUtc(fromDate)} – ${formatUtc(toDate)} UTC)`;
      }
    } catch {
      // fallback
    }
    const now = new Date();
    const past = new Date(now.getTime() - 15 * 60 * 1000);
    const formatUtc = (d: Date) => {
      const hh = String(d.getUTCHours()).padStart(2, '0');
      const mm = String(d.getUTCMinutes()).padStart(2, '0');
      return `${hh}:${mm}`;
    };
    return `Last 15 minutes (${formatUtc(past)} – ${formatUtc(now)} UTC)`;
  }, [timeRange]);

  // Formatted updated timestamp (UTC)
  const updatedTimeStr = useMemo(() => {
    const d = new Date();
    const hh = String(d.getUTCHours()).padStart(2, '0');
    const mm = String(d.getUTCMinutes()).padStart(2, '0');
    const ss = String(d.getUTCSeconds()).padStart(2, '0');
    return `${hh}:${mm}:${ss} UTC`;
  }, [data]);

  // 1. Mock baseline data matching original design target
  const mockEndpoints: Record<string, Record<string, EndpointStatus>> = {
    console: {
      '/healthz': { service: 'console', route: '/healthz', status: 'PASS', httpCode: 200, latencyMs: 38, freshnessSec: 9, expectedHttp: 200 },
      '/login': { service: 'console', route: '/login', status: 'PASS', httpCode: 200, latencyMs: 182, freshnessSec: 11, expectedHttp: 200 },
      '/panel/agent': { service: 'console', route: '/panel/agent', status: 'PASS', httpCode: 307, latencyMs: 246, freshnessSec: 12, expectedHttp: 307 },
    },
    accounts: {
      '/healthz': { service: 'accounts', route: '/healthz', status: 'PASS', httpCode: 200, latencyMs: 41, freshnessSec: 8, expectedHttp: 200 },
      '/readyz': { service: 'accounts', route: '/readyz', status: 'PASS', httpCode: 200, latencyMs: 57, freshnessSec: 9, expectedHttp: 200 },
      '/api/ping': { service: 'accounts', route: '/api/ping', status: 'PASS', httpCode: 200, latencyMs: 64, freshnessSec: 10, expectedHttp: 200 },
      '/api/billing/plans': { service: 'accounts', route: '/api/billing/plans', status: 'FAIL', httpCode: 503, latencyMs: 1204, freshnessSec: 10, expectedHttp: 200 },
    },
    billing: {
      '/healthz': { service: 'billing', route: '/healthz', status: 'PASS', httpCode: 200, latencyMs: 35, freshnessSec: 9, expectedHttp: 200 },
      '/readyz': { service: 'billing', route: '/readyz', status: 'NO DATA', httpCode: '—', latencyMs: '—', freshnessSec: 9, expectedHttp: 200 },
      '/api/ping': { service: 'billing', route: '/api/ping', status: 'PASS', httpCode: 200, latencyMs: 71, freshnessSec: 11, expectedHttp: 200 },
    },
  };

  const noDataEndpoints = (): Record<string, Record<string, EndpointStatus>> => {
    const out: Record<string, Record<string, EndpointStatus>> = {};
    for (const s of Object.keys(mockEndpoints)) {
      out[s] = {};
      for (const r of Object.keys(mockEndpoints[s])) {
        out[s][r] = { service: s, route: r, status: 'NO DATA', httpCode: '—', latencyMs: '—', freshnessSec: undefined, expectedHttp: mockEndpoints[s][r].expectedHttp };
      }
    }
    return out;
  };

  // 2. Extract live Prometheus metrics or live API payload if available
  const parsedData = useMemo(() => {
    try {
      if (!useMockData && livePayload?.endpoints && Array.isArray(livePayload.endpoints) && livePayload.endpoints.length > 0) {
        const liveEp: Record<string, Record<string, EndpointStatus>> = {
          console: {},
          accounts: {},
          billing: {},
        };
        for (const ep of livePayload.endpoints) {
          const s = (ep.service || "").toLowerCase();
          if (liveEp[s]) {
            liveEp[s][ep.endpoint] = {
              service: s,
              route: ep.endpoint,
              status: ep.result === "PASS" ? "PASS" : ep.result === "FAIL" ? "FAIL" : "NO DATA",
              httpCode: ep.observedHttp != null ? ep.observedHttp : "—",
              latencyMs: ep.p95LatencyMs != null ? ep.p95LatencyMs : "—",
              freshnessSec: ep.freshnessSec ?? undefined,
              expectedHttp: ep.expectedHttp || (ep.endpoint === "/panel/agent" ? 307 : 200),
            };
          }
        }
        return { isLive: true, source: 'live' as DataSource, latencyLabel: 'p95', endpoints: liveEp };
      }

      if (useMockData) {
        return { isLive: false, source: 'mock' as DataSource, latencyLabel: 'p95', endpoints: mockEndpoints };
      }
      if (!data?.series || data.series.length === 0) {
        return { isLive: false, source: 'catalog' as DataSource, latencyLabel: 'dur', endpoints: noDataEndpoints() };
      }

      const liveEndpoints: Record<string, Record<string, EndpointStatus>> = {
        console: {},
        accounts: {},
        billing: {},
      };

      let foundAny = false;

      const getVal = (fld: any, idx?: number) => {
        if (!fld || !fld.values) {
          return null;
        }
        const len = typeof fld.values.length === 'number' ? fld.values.length : (typeof fld.values.size === 'number' ? fld.values.size : 0);
        if (len === 0) {
          return null;
        }
        const i = idx !== undefined ? idx : len - 1;
        if (typeof fld.values.get === 'function') {
          return fld.values.get(i);
        }
        return fld.values[i];
      };

      // Iterate through series to extract probe_success, probe_http_status_code, etc.
      for (const frame of data.series) {
        if (!frame || !frame.fields || frame.fields.length === 0) {
          continue;
        }

        const sField = frame.fields.find((f: any) => f.name === 'service' || (f.labels && f.labels.service));
        const rField = frame.fields.find((f: any) => f.name === 'route' || (f.labels && f.labels.route));
        const valField = frame.fields.find(
          (f: any) => f.name === 'Value' || f.type === 'number' || (f.labels && Object.keys(f.labels).length > 0)
        );
        const timeField = frame.fields.find((f: any) => f.type === 'time' || f.name === 'Time');

        const rowCount = frame.length ?? valField?.values?.length ?? sField?.values?.length ?? 1;

        if (sField && rField && rowCount > 1) {
          for (let row = 0; row < rowCount; row++) {
            const sRaw = sField.labels?.service || getVal(sField, row);
            const rRaw = rField.labels?.route || getVal(rField, row);
            if (!sRaw || !rRaw) continue;

            const s = String(sRaw).toLowerCase();
            const r = String(rRaw);

            if (!liveEndpoints[s]) {
              liveEndpoints[s] = {};
            }

            foundAny = true;
            if (!liveEndpoints[s][r]) {
              liveEndpoints[s][r] = {
                service: s,
                route: r,
                status: 'NO DATA',
                httpCode: '—',
                latencyMs: '—',
                freshnessSec: 10,
                expectedHttp: r === '/panel/agent' ? 307 : 200,
              };
            }

            const val = getVal(valField, row);
            const metricName = (valField && (valField as any).name) || frame.name || '';
            const refId = frame.refId;

            if (refId === 'A' || metricName.includes('probe_success') || !metricName) {
              const numVal = Number(val);
              if (numVal === 1) {
                liveEndpoints[s][r].status = 'PASS';
              } else if (numVal === 0) {
                liveEndpoints[s][r].status = 'FAIL';
              }
            } else if (refId === 'B' || metricName.includes('status_code') || metricName.includes('http')) {
              liveEndpoints[s][r].httpCode = val != null ? Number(val) : '—';
            } else if (refId === 'C' || metricName.includes('duration') || metricName.includes('latency')) {
              const numVal = Number(val);
              liveEndpoints[s][r].latencyMs = !isNaN(numVal) ? Math.round(numVal * 1000) : '—';
            }

            if (timeField) {
              const sampleTime = getVal(timeField, row);
              if (sampleTime) {
                const tMs = Number(sampleTime) > 1e11 ? Number(sampleTime) : Number(sampleTime) * 1000;
                const ageSec = Math.max(1, Math.round((Date.now() - tMs) / 1000));
                if (ageSec < 3600) {
                  liveEndpoints[s][r].freshnessSec = ageSec;
                }
              }
            }
          }
        } else {
          const labels: Record<string, string> = frame.labels || (valField && (valField as any).labels) || {};
          let s = (labels.service || '').toLowerCase();
          let r = labels.route;
          if (!s || !r) {
            if (sField) {
              const sv = sField.labels?.service || getVal(sField);
              if (sv) s = String(sv).toLowerCase();
            }
            if (rField) {
              const rv = rField.labels?.route || getVal(rField);
              if (rv) r = String(rv);
            }
          }
          if (!s || !r) {
            continue;
          }

          if (!liveEndpoints[s]) {
            liveEndpoints[s] = {};
          }

          foundAny = true;
          if (!liveEndpoints[s][r]) {
            liveEndpoints[s][r] = {
              service: s,
              route: r,
              status: 'NO DATA',
              httpCode: '—',
              latencyMs: '—',
              freshnessSec: 10,
              expectedHttp: r === '/panel/agent' ? 307 : 200,
            };
          }

          const val = getVal(valField);
          const metricName = labels.__name__ || frame.name || (valField && (valField as any).name) || '';
          const refId = frame.refId;

          if (refId === 'A' || metricName.includes('probe_success') || !metricName) {
            const numVal = Number(val);
            if (numVal === 1) {
              liveEndpoints[s][r].status = 'PASS';
            } else if (numVal === 0) {
              liveEndpoints[s][r].status = 'FAIL';
            }
          } else if (refId === 'B' || metricName.includes('status_code') || metricName.includes('http')) {
            liveEndpoints[s][r].httpCode = val != null ? Number(val) : '—';
          } else if (refId === 'C' || metricName.includes('duration') || metricName.includes('latency')) {
            const numVal = Number(val);
            liveEndpoints[s][r].latencyMs = !isNaN(numVal) ? Math.round(numVal * 1000) : '—';
          }

          if (timeField) {
            const sampleTime = getVal(timeField);
            if (sampleTime) {
              const tMs = Number(sampleTime) > 1e11 ? Number(sampleTime) : Number(sampleTime) * 1000;
              const ageSec = Math.max(1, Math.round((Date.now() - tMs) / 1000));
              if (ageSec < 3600) {
                liveEndpoints[s][r].freshnessSec = ageSec;
              }
            }
          }
        }
      }

      if (!foundAny) {
        return { isLive: false, source: 'catalog' as DataSource, latencyLabel: 'dur', endpoints: noDataEndpoints() };
      }

      // Missing core endpoints are NO DATA, never borrowed from mock/healthy values
      const empty = noDataEndpoints();
      for (const s of Object.keys(empty)) {
        for (const r of Object.keys(empty[s])) {
          if (!liveEndpoints[s][r]) {
            liveEndpoints[s][r] = empty[s][r];
          }
        }
      }

      // probe_duration_seconds is a last-sample gauge, not a p95 quantile
      return { isLive: true, source: 'prometheus' as DataSource, latencyLabel: 'dur', endpoints: liveEndpoints };
    } catch (err) {
      console.warn('[ProgressiveReleasePanel] Failed to parse metrics data:', err);
      return { isLive: false, source: 'catalog' as DataSource, latencyLabel: 'dur', endpoints: noDataEndpoints() };
    }
  }, [data, useMockData, livePayload]);

  const endpoints = parsedData.endpoints;

  // Flatten endpoints into list
  const endpointList = useMemo(() => {
    const list: EndpointStatus[] = [];
    const order = [
      ['console', '/healthz'],
      ['console', '/login'],
      ['console', '/panel/agent'],
      ['accounts', '/healthz'],
      ['accounts', '/readyz'],
      ['accounts', '/api/ping'],
      ['accounts', '/api/billing/plans'],
      ['billing', '/healthz'],
      ['billing', '/readyz'],
      ['billing', '/api/ping'],
    ];

    for (const [s, r] of order) {
      if (endpoints[s]?.[r]) {
        list.push(endpoints[s][r]);
      }
    }
    return list;
  }, [endpoints]);

  const failedCount = useMemo(() => {
    return endpointList.filter((e) => e.status !== 'PASS').length;
  }, [endpointList]);

  // Flagger status data matching environment reality & live Prometheus metrics
  const flaggerServices: FlaggerServiceStatus[] = useMemo(() => {
    const services = [
      { key: 'console', service: 'Console' },
      { key: 'accounts', service: 'Accounts' },
      { key: 'billing', service: 'Billing' },
    ];
    const toView = (svc: { key: string; service: string }, raw: any, msg?: string): FlaggerServiceStatus => {
      const v = normalizeCanary(raw);
      return {
        service: svc.service,
        subdomain: (raw && raw.serviceDomain) || `${svc.key}.*`,
        phase: v.phase,
        weight: v.weight,
        primaryPercent: v.primaryPercent,
        candidatePercent: v.candidatePercent,
        message:
          v.phase === 'Not configured'
            ? (raw && raw.message) || 'No canary configured for this service'
            : v.phase === 'Unknown'
            ? msg || 'Canary telemetry missing — status unknown'
            : undefined,
      };
    };

    if (useMockData) {
      // Design preview only: Billing keeps the documented "Not configured" state
      const mock: Record<string, any> = {
        console: { phase: 'Progressing', weight: 20 },
        accounts: { phase: 'Succeeded', weight: 0 },
        billing: { phase: 'Not configured' },
      };
      return services.map((s) => toView(s, mock[s.key]));
    }

    if (livePayload?.flaggerServices && Array.isArray(livePayload.flaggerServices) && livePayload.flaggerServices.length > 0) {
      return services.map((s) => {
        const raw = livePayload.flaggerServices.find((f: any) => String(f.service || '').toLowerCase() === s.key);
        return toView(s, raw);
      });
    }

    // Prometheus: flagger_canary_status / flagger_canary_weight
    const acc: Record<string, any> = {};
    if (data?.series && data.series.length > 0) {
      for (const frame of data.series) {
        const field = frame.fields?.find(
          (f: any) => f.name === 'Value' || f.type === 'number' || (f.labels && Object.keys(f.labels).length > 0)
        );
        const labels: Record<string, string> = frame.labels || (field && (field as any).labels) || {};
        const metricName = labels.__name__ || frame.name || (field && (field as any).name) || '';
        const name = (labels.name || labels.workload || '').toLowerCase();
        const target = services.find((s) => name.includes(s.key));
        if (!target || name.includes('primary')) continue;
        const vals: any = field && field.values;
        const len = vals ? (typeof vals.length === 'number' ? vals.length : 0) : 0;
        if (!len) continue;
        const val = Number(typeof vals.get === 'function' ? vals.get(len - 1) : vals[len - 1]);
        if (isNaN(val)) continue;
        acc[target.key] = acc[target.key] || {};
        if (metricName.includes('flagger_canary_status')) {
          // exporter mapping (verify against deployed Flagger version): 0 progressing, 1 succeeded, 2 failed
          acc[target.key].phase = val === 0 ? 'Progressing' : val === 1 ? 'Succeeded' : val === 2 ? 'Failed' : 'Unknown';
        } else if (metricName.includes('flagger_canary_weight')) {
          acc[target.key].weight = Math.max(0, Math.min(100, val));
        }
      }
    }
    return services.map((s) => toView(s, acc[s.key]));
  }, [data, livePayload, useMockData]);

  // Collapsible Full Routes & APIs Table State
  const [isRoutesCollapsed, setIsRoutesCollapsed] = useState(false);
  const [routesFilter, setRoutesFilter] = useState<'all' | 'frontend' | 'api'>('all');
  const [routesSearchQuery, setRoutesSearchQuery] = useState('');

  // Assemble full items for Web Console Frontend Routes & Backend Microservice APIs
  const fullRoutesAndApis = useMemo(() => {
    if (!useMockData && livePayload?.allRoutesAndApis && Array.isArray(livePayload.allRoutesAndApis) && livePayload.allRoutesAndApis.length > 0) {
      return normalizeLiveInventory(livePayload.allRoutesAndApis);
    }
    const src: DataSource = parsedData.source;
    return mergeCatalogWithTelemetry(
      RAW_ROUTES_CATALOG,
      (service, path) => (endpoints as any)?.[service.toLowerCase()]?.[path],
      src
    );
  }, [endpoints, livePayload, useMockData, parsedData.source]);

  interface TreeCategory {
    key: string;
    name: string;
    enName: string;
    type: 'frontend' | 'api';
    items: any[];
    totalCount: number;
    passCount: number;
    failCount: number;
    noDataCount: number;
  }

  interface TreeRoot {
    type: 'frontend' | 'api';
    title: string;
    enTitle: string;
    categories: TreeCategory[];
    totalCount: number;
    passCount: number;
    failCount: number;
    noDataCount: number;
  }

  const [expandedRoots, setExpandedRoots] = useState<Record<string, boolean>>({
    frontend: true,
    api: true,
  });
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const toggleRoot = (type: 'frontend' | 'api') => {
    setExpandedRoots((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const toggleCategory = (key: string) => {
    setExpandedCategories((prev) => ({ ...prev, [key]: prev[key] === false ? true : false }));
  };

  const treeData = useMemo<TreeRoot[]>(() => {
    return buildTree(fullRoutesAndApis, routesFilter, routesSearchQuery).map((r) => ({
      type: r.type,
      title: r.type === 'frontend' ? '前端页面路由 (Frontend Pages & Routes)' : '后端服务与微服务 API (Backend Services & APIs)',
      enTitle: r.type === 'frontend' ? 'Frontend Pages & Portal Routes' : 'Backend Microservices & Gateway Endpoints',
      categories: r.categories.map((c) => ({
        key: c.key,
        name: c.name,
        enName: c.enName,
        type: c.type,
        items: c.items as any,
        totalCount: c.counts.total,
        passCount: c.counts.pass,
        failCount: c.counts.fail,
        noDataCount: c.counts.noData + c.counts.notProbed,
      })),
      totalCount: r.counts.total,
      passCount: r.counts.pass,
      failCount: r.counts.fail,
      noDataCount: r.counts.noData + r.counts.notProbed,
    }));
  }, [fullRoutesAndApis, routesFilter, routesSearchQuery]);

  const handleExpandAll = () => {
    setExpandedRoots({ frontend: true, api: true });
    const next: Record<string, boolean> = {};
    for (const root of treeData) {
      for (const cat of root.categories) {
        next[cat.key] = true;
      }
    }
    setExpandedCategories(next);
  };

  const handleCollapseAll = () => {
    setExpandedRoots({ frontend: false, api: false });
    const next: Record<string, boolean> = {};
    for (const root of treeData) {
      for (const cat of root.categories) {
        next[cat.key] = false;
      }
    }
    setExpandedCategories(next);
  };


  const candidateSampleInfo = useMemo(() => {
    if (!useMockData && livePayload?.candidateSample?.requestsCount != null) {
      return {
        countStr: `${Number(livePayload.candidateSample.requestsCount).toLocaleString()} requests`,
        summary: livePayload.candidateSample.summary || 'threshold not reported',
      };
    }
    // No real request counter available: never derive samples from probe_success gauges
    return { countStr: 'NO DATA', summary: useMockData ? '(preview — no sample counter)' : '(no request counter wired)' };
  }, [livePayload, useMockData]);

  const gateInfo = useMemo(() => {
    if (!useMockData && livePayload?.gateStatus && parsedData.source === 'live') {
      const st = String(livePayload.gateStatus.status || '').toUpperCase();
      return {
        state: st === 'BLOCKED' ? 'BLOCKED' : st === 'ALLOWED' ? 'ALLOWED' : 'UNKNOWN',
        isBlocked: st !== 'ALLOWED',
        summary: livePayload.gateStatus.summary || st,
      };
    }
    const g = evaluateGate(endpointList, parsedData.source, 10);
    return { state: g.state, isBlocked: g.state !== 'ALLOWED', summary: g.summary };
  }, [livePayload, endpointList, useMockData, parsedData.source]);

  const frontendCatCount = useMemo(() => new Set(fullRoutesAndApis.filter((i) => i.type === 'frontend').map((i) => i.categoryKey)).size, [fullRoutesAndApis]);
  const backendCatCount = useMemo(() => new Set(fullRoutesAndApis.filter((i) => i.type === 'api').map((i) => i.categoryKey)).size, [fullRoutesAndApis]);
  const inventoryCounts = useMemo(() => countOf(fullRoutesAndApis), [fullRoutesAndApis]);
  const feCount = useMemo(() => fullRoutesAndApis.filter((i) => i.type === 'frontend').length, [fullRoutesAndApis]);
  const beCount = useMemo(() => fullRoutesAndApis.filter((i) => i.type === 'api').length, [fullRoutesAndApis]);

  // Helper renderers
  const renderCellBadge = (item: EndpointStatus | undefined) => {
    if (!item) {
      return <span style={{ color: '#4b5563', fontSize: '14px' }}>—</span>;
    }

    const isPass = item.status === 'PASS';
    const isFail = item.status === 'FAIL';

    const bg = isPass ? '#052e16' : isFail ? '#450a0a' : '#181b20';
    const border = isPass ? '1px solid #166534' : isFail ? '1px solid #991b1b' : '1px solid #374151';
    const badgeBg = isPass ? '#16a34a' : isFail ? '#dc2626' : '#4b5563';
    const latColor = isPass ? '#86efac' : isFail ? '#fca5a5' : '#9ca3af';

    return (
      <div
        style={{
          background: bg,
          border: border,
          borderRadius: '4px',
          padding: '4px 6px',
          textAlign: 'center',
          minWidth: '58px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.4)',
        }}
      >
        <div>
          <span
            style={{
              background: badgeBg,
              color: '#ffffff',
              fontSize: '9px',
              fontWeight: 700,
              padding: '1px 5px',
              borderRadius: '3px',
              letterSpacing: '0.5px',
              display: 'inline-block',
            }}
          >
            {item.status}
          </span>
        </div>
        <div style={{ color: '#ffffff', fontSize: '13px', fontWeight: 700, margin: '2px 0 1px 0' }}>
          {item.httpCode}
        </div>
        <div style={{ color: latColor, fontSize: '10px', opacity: 0.9 }}>
          {`${parsedData.latencyLabel} ${item.latencyMs !== '—' && item.latencyMs != null ? `${item.latencyMs} ms` : '—'}`}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        width: '100%',
        height: height ? `${height}px` : '100%',
        maxHeight: height ? `${height}px` : '100%',
        background: '#0d0f15',
        color: '#f3f4f6',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        padding: '16px 20px',
        boxSizing: 'border-box',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      {/* 1. Header & Top KPIs */}
      {(mode === 'all' || mode === 'matrix_only') && showKpis && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <div style={{ color: '#ffffff', fontSize: '22px', fontWeight: 800, letterSpacing: '-0.3px' }}>
                Progressive Release Validation
              </div>
              <div style={{ color: '#8b949e', fontSize: '13px', marginTop: '2px' }}>
                Service × API status matrix for progressive releases ({resolvedEnv})
              </div>
            </div>
            <span
              style={{
                background: parsedData.isLive ? '#14532d' : '#1f2937',
                border: `1px solid ${parsedData.isLive ? '#22c55e' : '#374151'}`,
                color: parsedData.isLive ? '#86efac' : '#9ca3af',
                fontSize: '11px',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '4px',
              }}
            >
              {parsedData.source === 'mock' ? 'PREVIEW MOCK DATA' : parsedData.isLive ? `● LIVE ${resolvedEnv} DATA` : 'NO TELEMETRY'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1.5fr', gap: '12px' }}>
            {/* KPI 1: Environment */}
            <div
              style={{
                background: '#13161f',
                border: '1px solid #232838',
                borderRadius: '6px',
                padding: '12px 16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <div style={{ color: '#8b949e', fontSize: '12px', fontWeight: 500 }}>Environment</div>
              <div style={{ color: '#ffffff', fontSize: '22px', fontWeight: 800, letterSpacing: '0.5px', marginTop: '3px' }}>
                {resolvedEnv}
              </div>
            </div>

            {/* KPI 2: Observation Window */}
            <div
              style={{
                background: '#13161f',
                border: '1px solid #232838',
                borderRadius: '6px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  border: '1px solid #374151',
                  borderRadius: '5px',
                  padding: '6px 8px',
                  fontSize: '20px',
                  lineHeight: 1,
                  color: '#9ca3af',
                }}
              >
                📅
              </div>
              <div>
                <div style={{ color: '#8b949e', fontSize: '12px', fontWeight: 500 }}>Observation window</div>
                <div style={{ color: '#ffffff', fontSize: '15px', fontWeight: 600, marginTop: '2px' }}>
                  {observationWindowStr}
                </div>
              </div>
            </div>

            {/* KPI 3: Release Gate */}
            <div
              style={{
                background: '#13161f',
                border: '1px solid #232838',
                borderRadius: '6px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  border: `2px solid ${gateInfo.isBlocked ? '#ef4444' : '#22c55e'}`,
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 900,
                  color: gateInfo.isBlocked ? '#ef4444' : '#22c55e',
                }}
              >
                {gateInfo.state === 'ALLOWED' ? '✓' : gateInfo.state === 'BLOCKED' ? '✕' : '?'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#8b949e', fontSize: '12px', fontWeight: 500 }}>Release gate (overall)</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                  <span
                    style={{
                      background: gateInfo.isBlocked ? '#dc2626' : '#16a34a',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {gateInfo.state}
                  </span>
                  <span style={{ color: '#d1d5db', fontSize: '13px', fontWeight: 500 }}>
                    {gateInfo.summary}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Service × Endpoint Status Matrix */}
      {(mode === 'all' || mode === 'matrix_only') && showMatrix && (
        <div
          style={{
            background: '#13161f',
            border: '1px solid #232838',
            borderRadius: '6px',
            padding: '14px 16px',
            marginBottom: '16px',
          }}
        >
          <div style={{ color: '#ffffff', fontSize: '15px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Service × Endpoint Status <span style={{ color: '#6b7280', fontSize: '13px', cursor: 'pointer' }}>ⓘ</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '880px' }}>
              <thead>
                <tr>
                  <th
                    rowSpan={2}
                    style={{
                      padding: '8px 12px',
                      color: '#ffffff',
                      fontSize: '12px',
                      fontWeight: 700,
                      borderBottom: '1px solid #2a2f40',
                      borderRight: '1px solid #2a2f40',
                      verticalAlign: 'bottom',
                      width: '130px',
                    }}
                  >
                    Service
                  </th>
                  <th
                    colSpan={3}
                    style={{
                      background: '#172554',
                      color: '#93c5fd',
                      fontSize: '12px',
                      fontWeight: 700,
                      textAlign: 'center',
                      padding: '6px 8px',
                      borderRight: '1px solid #1e3a8a',
                      borderBottom: '1px solid #1e3a8a',
                    }}
                  >
                    Console <span style={{ fontSize: '11px', opacity: 0.8, fontWeight: 400 }}>(console.svc.plus)</span>
                  </th>
                  <th
                    colSpan={4}
                    style={{
                      background: '#3b0764',
                      color: '#d8b4fe',
                      fontSize: '12px',
                      fontWeight: 700,
                      textAlign: 'center',
                      padding: '6px 8px',
                      borderRight: '1px solid #581c87',
                      borderBottom: '1px solid #581c87',
                    }}
                  >
                    Accounts <span style={{ fontSize: '11px', opacity: 0.8, fontWeight: 400 }}>(accounts.svc.plus)</span>
                  </th>
                  <th
                    colSpan={3}
                    style={{
                      background: '#451a03',
                      color: '#fde68a',
                      fontSize: '12px',
                      fontWeight: 700,
                      textAlign: 'center',
                      padding: '6px 8px',
                      borderBottom: '1px solid #78350f',
                    }}
                  >
                    Billing
                  </th>
                </tr>
                <tr style={{ background: '#0b0d13' }}>
                  {/* Console subheaders */}
                  <th style={{ padding: '6px 4px', color: '#60a5fa', fontSize: '11px', textAlign: 'center', borderRight: '1px solid #1f2937' }}>/healthz</th>
                  <th style={{ padding: '6px 4px', color: '#60a5fa', fontSize: '11px', textAlign: 'center', borderRight: '1px solid #1f2937' }}>/login</th>
                  <th style={{ padding: '6px 4px', color: '#60a5fa', fontSize: '11px', textAlign: 'center', borderRight: '1px solid #2a2f40' }}>/panel/agent</th>
                  {/* Accounts subheaders */}
                  <th style={{ padding: '6px 4px', color: '#c084fc', fontSize: '11px', textAlign: 'center', borderRight: '1px solid #1f2937' }}>/healthz</th>
                  <th style={{ padding: '6px 4px', color: '#c084fc', fontSize: '11px', textAlign: 'center', borderRight: '1px solid #1f2937' }}>/readyz</th>
                  <th style={{ padding: '6px 4px', color: '#c084fc', fontSize: '11px', textAlign: 'center', borderRight: '1px solid #1f2937' }}>/api/ping</th>
                  <th style={{ padding: '6px 4px', color: '#c084fc', fontSize: '11px', textAlign: 'center', borderRight: '1px solid #2a2f40' }}>/api/billing/plans</th>
                  {/* Billing subheaders */}
                  <th style={{ padding: '6px 4px', color: '#fcd34d', fontSize: '11px', textAlign: 'center', borderRight: '1px solid #1f2937' }}>/healthz</th>
                  <th style={{ padding: '6px 4px', color: '#fcd34d', fontSize: '11px', textAlign: 'center', borderRight: '1px solid #1f2937' }}>/readyz</th>
                  <th style={{ padding: '6px 4px', color: '#fcd34d', fontSize: '11px', textAlign: 'center' }}>/api/ping</th>
                </tr>
              </thead>
              <tbody>
                {/* Row 1: Console */}
                <tr style={{ borderBottom: '1px solid #1f2430' }}>
                  <td style={{ padding: '8px 12px', borderRight: '1px solid #2a2f40' }}>
                    <div style={{ color: '#ffffff', fontSize: '13px', fontWeight: 700 }}>Console</div>
                    <div style={{ color: '#8b949e', fontSize: '11px' }}>console.svc.plus</div>
                  </td>
                  <td style={{ padding: '6px 4px', textAlign: 'center' }}>{renderCellBadge(endpoints.console?.['/healthz'])}</td>
                  <td style={{ padding: '6px 4px', textAlign: 'center' }}>{renderCellBadge(endpoints.console?.['/login'])}</td>
                  <td style={{ padding: '6px 4px', textAlign: 'center', borderRight: '1px solid #2a2f40' }}>{renderCellBadge(endpoints.console?.['/panel/agent'])}</td>
                  <td style={{ padding: '6px 4px', textAlign: 'center' }}>{renderCellBadge(undefined)}</td>
                  <td style={{ padding: '6px 4px', textAlign: 'center' }}>{renderCellBadge(undefined)}</td>
                  <td style={{ padding: '6px 4px', textAlign: 'center' }}>{renderCellBadge(undefined)}</td>
                  <td style={{ padding: '6px 4px', textAlign: 'center', borderRight: '1px solid #2a2f40' }}>{renderCellBadge(undefined)}</td>
                  <td style={{ padding: '6px 4px', textAlign: 'center' }}>{renderCellBadge(undefined)}</td>
                  <td style={{ padding: '6px 4px', textAlign: 'center' }}>{renderCellBadge(undefined)}</td>
                  <td style={{ padding: '6px 4px', textAlign: 'center' }}>{renderCellBadge(undefined)}</td>
                </tr>

                {/* Row 2: Accounts */}
                <tr style={{ borderBottom: '1px solid #1f2430' }}>
                  <td style={{ padding: '8px 12px', borderRight: '1px solid #2a2f40' }}>
                    <div style={{ color: '#ffffff', fontSize: '13px', fontWeight: 700 }}>Accounts</div>
                    <div style={{ color: '#8b949e', fontSize: '11px' }}>accounts.svc.plus</div>
                  </td>
                  <td style={{ padding: '6px 4px', textAlign: 'center' }}>{renderCellBadge(undefined)}</td>
                  <td style={{ padding: '6px 4px', textAlign: 'center' }}>{renderCellBadge(undefined)}</td>
                  <td style={{ padding: '6px 4px', textAlign: 'center', borderRight: '1px solid #2a2f40' }}>{renderCellBadge(undefined)}</td>
                  <td style={{ padding: '6px 4px', textAlign: 'center' }}>{renderCellBadge(endpoints.accounts?.['/healthz'])}</td>
                  <td style={{ padding: '6px 4px', textAlign: 'center' }}>{renderCellBadge(endpoints.accounts?.['/readyz'])}</td>
                  <td style={{ padding: '6px 4px', textAlign: 'center' }}>{renderCellBadge(endpoints.accounts?.['/api/ping'])}</td>
                  <td style={{ padding: '6px 4px', textAlign: 'center', borderRight: '1px solid #2a2f40' }}>{renderCellBadge(endpoints.accounts?.['/api/billing/plans'])}</td>
                  <td style={{ padding: '6px 4px', textAlign: 'center' }}>{renderCellBadge(undefined)}</td>
                  <td style={{ padding: '6px 4px', textAlign: 'center' }}>{renderCellBadge(undefined)}</td>
                  <td style={{ padding: '6px 4px', textAlign: 'center' }}>{renderCellBadge(undefined)}</td>
                </tr>

                {/* Row 3: Billing */}
                <tr>
                  <td style={{ padding: '8px 12px', borderRight: '1px solid #2a2f40' }}>
                    <div style={{ color: '#ffffff', fontSize: '13px', fontWeight: 700 }}>Billing</div>
                    <div style={{ color: '#8b949e', fontSize: '11px' }}>billing.svc.plus</div>
                  </td>
                  <td style={{ padding: '6px 4px', textAlign: 'center' }}>{renderCellBadge(undefined)}</td>
                  <td style={{ padding: '6px 4px', textAlign: 'center' }}>{renderCellBadge(undefined)}</td>
                  <td style={{ padding: '6px 4px', textAlign: 'center', borderRight: '1px solid #2a2f40' }}>{renderCellBadge(undefined)}</td>
                  <td style={{ padding: '6px 4px', textAlign: 'center' }}>{renderCellBadge(undefined)}</td>
                  <td style={{ padding: '6px 4px', textAlign: 'center' }}>{renderCellBadge(undefined)}</td>
                  <td style={{ padding: '6px 4px', textAlign: 'center' }}>{renderCellBadge(undefined)}</td>
                  <td style={{ padding: '6px 4px', textAlign: 'center', borderRight: '1px solid #2a2f40' }}>{renderCellBadge(undefined)}</td>
                  <td style={{ padding: '6px 4px', textAlign: 'center' }}>{renderCellBadge(endpoints.billing?.['/healthz'])}</td>
                  <td style={{ padding: '6px 4px', textAlign: 'center' }}>{renderCellBadge(endpoints.billing?.['/readyz'])}</td>
                  <td style={{ padding: '6px 4px', textAlign: 'center' }}>{renderCellBadge(endpoints.billing?.['/api/ping'])}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Flagger (Progressive Release) */}
      {(mode === 'all' || mode === 'flagger_only') && showFlagger && (
        <div
          style={{
            background: '#13161f',
            border: '1px solid #232838',
            borderRadius: '6px',
            padding: '14px 16px',
            marginBottom: '16px',
          }}
        >
          <div style={{ color: '#ffffff', fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>
            Flagger (Progressive Release)
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #232838' }}>
                  <th style={{ padding: '8px 12px', color: '#8b949e', fontSize: '12px', fontWeight: 600, width: '220px' }}>Service</th>
                  <th style={{ padding: '8px 12px', color: '#8b949e', fontSize: '12px', fontWeight: 600, width: '140px' }}>Flagger phase</th>
                  <th style={{ padding: '8px 12px', color: '#8b949e', fontSize: '12px', fontWeight: 600, width: '140px' }}>Weight (candidate)</th>
                  <th style={{ padding: '8px 12px', color: '#8b949e', fontSize: '12px', fontWeight: 600 }}>Traffic (primary vs candidate)</th>
                </tr>
              </thead>
              <tbody>
                {flaggerServices.map((fs, idx) => {
                  const isNotConfigured = fs.phase === 'Not configured' || fs.weight === null;
                  const isSucceeded = fs.phase === 'Succeeded';
                  const isProgressing = fs.phase === 'Progressing';
                  const phaseBg = isNotConfigured
                    ? '#1f2430'
                    : isSucceeded
                    ? '#064e3b'
                    : isProgressing
                    ? '#1e3a8a'
                    : '#450a0a';
                  const phaseBorder = isNotConfigured
                    ? '#374151'
                    : isSucceeded
                    ? '#059669'
                    : isProgressing
                    ? '#2563eb'
                    : '#991b1b';
                  const phaseColor = isNotConfigured
                    ? '#9ca3af'
                    : isSucceeded
                    ? '#6ee7b7'
                    : isProgressing
                    ? '#93c5fd'
                    : '#fca5a5';

                  return (
                    <tr key={idx} style={{ borderBottom: idx < flaggerServices.length - 1 ? '1px solid #1b1e2a' : 'none' }}>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: 700 }}>{fs.service}</span>{' '}
                        <span style={{ color: '#8b949e', fontSize: '11px' }}>{fs.subdomain}</span>
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <span
                          style={{
                            background: phaseBg,
                            border: `1px solid ${phaseBorder}`,
                            color: phaseColor,
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '4px',
                          }}
                        >
                          {fs.phase}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', color: '#ffffff', fontSize: '13px', fontWeight: 700 }}>
                        {isNotConfigured ? '—' : `${fs.weight}%`}
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        {isNotConfigured ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9ca3af', fontSize: '12px' }}>
                            <span style={{ color: '#6b7280', fontSize: '13px' }}>ⓘ</span>
                            <span>{fs.message || 'No canary configured for this service'}</span>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div
                              style={{
                                flex: 1,
                                height: '14px',
                                background: '#1e293b',
                                borderRadius: '4px',
                                overflow: 'hidden',
                                display: 'flex',
                                maxWidth: '300px',
                              }}
                            >
                              <div style={{ width: `${fs.primaryPercent}%`, background: '#22c55e', height: '100%' }} />
                              <div style={{ width: `${fs.candidatePercent}%`, background: '#3b82f6', height: '100%' }} />
                            </div>
                            <span style={{ color: '#9ca3af', fontSize: '11px' }}>
                              Primary {fs.primaryPercent}% | Candidate {fs.candidatePercent}%
                            </span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Top 10 Endpoint Details */}
      {(mode === 'all' || mode === 'details_only') && showDetails && (
        <div
          style={{
            background: '#13161f',
            border: '1px solid #232838',
            borderRadius: '6px',
            padding: '14px 16px',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#ffffff', fontSize: '15px', fontWeight: 700 }}>
                Top 10 Endpoint Details ({parsedData.source === 'mock' ? 'Sample Mock Data' : parsedData.isLive ? `Live ${resolvedEnv} Data` : 'No telemetry'})
              </span>
              <span
                style={{
                  background: parsedData.isLive ? '#14532d' : '#1e293b',
                  border: `1px solid ${parsedData.isLive ? '#22c55e' : '#374151'}`,
                  color: parsedData.isLive ? '#86efac' : '#9ca3af',
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '3px',
                }}
              >
                {parsedData.source === 'mock' ? 'SAMPLE MOCK DATA' : parsedData.isLive ? '● LIVE METRICS' : 'NO TELEMETRY'}
              </span>
            </div>
            <div style={{ color: '#8b949e', fontSize: '12px' }}>
              10/10 checks • {failedCount} failed • Updated: {updatedTimeStr}
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #232838' }}>
                  <th style={{ padding: '8px 10px', color: '#8b949e', fontSize: '12px', fontWeight: 600, width: '30px' }}>#</th>
                  <th style={{ padding: '8px 10px', color: '#8b949e', fontSize: '12px', fontWeight: 600 }}>Service</th>
                  <th style={{ padding: '8px 10px', color: '#8b949e', fontSize: '12px', fontWeight: 600 }}>Endpoint (GET)</th>
                  <th style={{ padding: '8px 10px', color: '#8b949e', fontSize: '12px', fontWeight: 600 }}>Expected HTTP</th>
                  <th style={{ padding: '8px 10px', color: '#8b949e', fontSize: '12px', fontWeight: 600 }}>Observed HTTP</th>
                  <th style={{ padding: '8px 10px', color: '#8b949e', fontSize: '12px', fontWeight: 600 }}>{parsedData.latencyLabel === 'p95' ? 'p95 Latency' : 'Duration (last sample)'}</th>
                  <th style={{ padding: '8px 10px', color: '#8b949e', fontSize: '12px', fontWeight: 600 }}>Freshness (age)</th>
                  <th style={{ padding: '8px 10px', color: '#8b949e', fontSize: '12px', fontWeight: 600 }}>Result</th>
                </tr>
              </thead>
              <tbody>
                {endpointList.map((ep, idx) => {
                  const isConsole = ep.service === 'console';
                  const isAccounts = ep.service === 'accounts';
                  const sBg = isConsole ? '#14532d' : isAccounts ? '#1e3a8a' : '#4c1d95';
                  const sColor = isConsole ? '#86efac' : isAccounts ? '#93c5fd' : '#c4b5fd';
                  const isPass = ep.status === 'PASS';
                  const isFail = ep.status === 'FAIL';
                  const httpBg = ep.httpCode === 200 ? '#15803d' : ep.httpCode === 307 ? '#15803d' : '#b91c1c';

                  return (
                    <tr key={idx} style={{ borderBottom: idx < endpointList.length - 1 ? '1px solid #1a1e28' : 'none' }}>
                      <td style={{ padding: '8px 10px', color: '#8b949e', fontSize: '12px' }}>{idx + 1}</td>
                      <td style={{ padding: '8px 10px' }}>
                        <span
                          style={{
                            background: sBg,
                            color: sColor,
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            textTransform: 'capitalize',
                          }}
                        >
                          {ep.service}
                        </span>
                      </td>
                      <td style={{ padding: '8px 10px', color: '#ffffff', fontSize: '12px', fontFamily: 'monospace' }}>
                        {ep.route}
                      </td>
                      <td style={{ padding: '8px 10px', color: '#d1d5db', fontSize: '12px' }}>{ep.expectedHttp}</td>
                      <td style={{ padding: '8px 10px' }}>
                        <span
                          style={{
                            background: httpBg,
                            color: '#ffffff',
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '3px',
                          }}
                        >
                          {ep.httpCode}
                        </span>
                      </td>
                      <td style={{ padding: '8px 10px', color: '#d1d5db', fontSize: '12px' }}>
                        {ep.latencyMs !== '—' ? `${ep.latencyMs} ms` : '—'}
                      </td>
                      <td style={{ padding: '8px 10px', color: '#d1d5db', fontSize: '12px' }}>
                        {ep.freshnessSec != null ? `${ep.freshnessSec} s` : '—'}
                      </td>
                      <td style={{ padding: '8px 10px' }}>
                        <span
                          style={{
                            color: isPass ? '#22c55e' : isFail ? '#ef4444' : '#9ca3af',
                            fontSize: '12px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          {isPass ? '✔ PASS' : isFail ? '✖ FAIL' : 'NO DATA'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Footer Callouts */}
      {(mode === 'all' || mode === 'details_only') && showFooter && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.2fr', gap: '12px' }}>
          <div
            style={{
              background: '#13161f',
              border: '1px solid #232838',
              borderLeft: '4px solid #3b82f6',
              borderRadius: '6px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div style={{ color: '#60a5fa', fontSize: '18px', lineHeight: 1 }}>ⓘ</div>
            <div style={{ color: '#d1d5db', fontSize: '12px', lineHeight: 1.5 }}>
              Gate rule: The release is <strong style={{ color: '#ef4444' }}>BLOCKED</strong> if any endpoint is failed, stale (exceeds freshness), missing samples (NO DATA), or if the candidate request sample is insufficient.
            </div>
          </div>

          <div
            style={{
              background: '#13161f',
              border: '1px solid #232838',
              borderLeft: '4px solid #8b5cf6',
              borderRadius: '6px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div style={{ color: '#a78bfa', fontSize: '18px', lineHeight: 1 }}>🧪</div>
            <div>
              <div style={{ color: '#ffffff', fontSize: '13px', fontWeight: 600 }}>
                Candidate sample: {candidateSampleInfo.countStr}
              </div>
              <div style={{ color: '#22c55e', fontSize: '11px', fontWeight: 600, marginTop: '1px' }}>
                {candidateSampleInfo.summary}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Collapsible Full Routes & Microservices APIs Matrix (3-Level Tree View) */}
      {(showRoutesTable !== false) && (
        <div
          style={{
            background: '#141824',
            border: '1px solid #232838',
            borderRadius: '10px',
            marginTop: '16px',
            overflow: 'hidden',
          }}
        >
          {/* Collapsible Header */}
          <div
            onClick={() => setIsRoutesCollapsed(!isRoutesCollapsed)}
            style={{
              padding: '12px 16px',
              background: '#1a1f30',
              borderBottom: isRoutesCollapsed ? 'none' : '1px solid #232838',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              userSelect: 'none',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: '#8b949e' }}>
                {isRoutesCollapsed ? '▶' : '▼'}
              </span>
              <div>
                <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: 700 }}>
                  全量路由与后端服务 API 清单
                </span>
                <span style={{ color: '#8b949e', fontSize: '11px', marginLeft: '6px' }}>
                  (Collapsible Routes &amp; APIs Matrix • 前端 / 后端 / 大类 / 子组件三级树状展示)
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }} onClick={(e) => e.stopPropagation()}>
              <span
                style={{
                  background: (liveFetchStatus === 'success' || parsedData.isLive) ? 'rgba(34, 197, 94, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                  color: (liveFetchStatus === 'success' || parsedData.isLive) ? '#4ade80' : '#60a5fa',
                  border: `1px solid ${(liveFetchStatus === 'success' || parsedData.isLive) ? 'rgba(34, 197, 94, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: (liveFetchStatus === 'success' || parsedData.isLive) ? '#22c55e' : '#3b82f6' }}></span>
                {liveFetchStatus === 'success' ? 'Live Inventory (BFF)' : parsedData.isLive ? 'Catalog + Prometheus' : parsedData.source === 'mock' ? 'Catalog + Mock Preview' : 'Catalog only · NO DATA'}
              </span>
              <span
                style={{
                  background: 'rgba(59, 130, 246, 0.15)',
                  color: '#60a5fa',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                🌐 {feCount} 前端路由 ({frontendCatCount} 大类)
              </span>
              <span
                style={{
                  background: 'rgba(168, 85, 247, 0.15)',
                  color: '#c084fc',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                ⚙ {beCount} 后端接口 ({backendCatCount} 大类)
              </span>
              <span
                style={{
                  background: 'rgba(34, 197, 94, 0.15)',
                  color: '#4ade80',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }}></span>
                {inventoryCounts.total > 0 && inventoryCounts.pass === inventoryCounts.total ? 'All 100% Online' : `${inventoryCounts.pass}/${inventoryCounts.total} PASS · ${inventoryCounts.fail} FAIL · ${inventoryCounts.noData + inventoryCounts.notProbed} NO DATA/NOT PROBED`}
              </span>
            </div>
          </div>

          {/* Table Body */}
          {!isRoutesCollapsed && (
            <div style={{ padding: '12px 16px' }}>
              {/* Filter tabs & Search & Expand/Collapse All */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '14px',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <div
                    style={{
                      display: 'flex',
                      gap: '4px',
                      background: '#0d0f15',
                      padding: '3px',
                      borderRadius: '6px',
                      border: '1px solid #232838',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setRoutesFilter('all')}
                      style={{
                        background: routesFilter === 'all' ? '#232838' : 'transparent',
                        color: routesFilter === 'all' ? '#ffffff' : '#8b949e',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '3px 10px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      全部 ({fullRoutesAndApis.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setRoutesFilter('frontend')}
                      style={{
                        background: routesFilter === 'frontend' ? '#1e3a8a' : 'transparent',
                        color: routesFilter === 'frontend' ? '#93c5fd' : '#8b949e',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '3px 10px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      🌐 前端 ({feCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setRoutesFilter('api')}
                      style={{
                        background: routesFilter === 'api' ? '#4c1d95' : 'transparent',
                        color: routesFilter === 'api' ? '#c4b5fd' : '#8b949e',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '3px 10px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      ⚙ 后端 ({beCount})
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      type="button"
                      onClick={handleExpandAll}
                      style={{
                        background: '#1e2433',
                        color: '#cbd5e1',
                        border: '1px solid #2b3548',
                        borderRadius: '4px',
                        padding: '3px 8px',
                        fontSize: '11px',
                        cursor: 'pointer',
                      }}
                    >
                      展开全部
                    </button>
                    <button
                      type="button"
                      onClick={handleCollapseAll}
                      style={{
                        background: '#1e2433',
                        color: '#cbd5e1',
                        border: '1px solid #2b3548',
                        borderRadius: '4px',
                        padding: '3px 8px',
                        fontSize: '11px',
                        cursor: 'pointer',
                      }}
                    >
                      折叠全部
                    </button>
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    value={routesSearchQuery}
                    onChange={(e) => setRoutesSearchQuery(e.target.value)}
                    placeholder="按路径、大类、服务或描述搜索..."
                    style={{
                      background: '#0d0f15',
                      border: '1px solid #232838',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '11px',
                      padding: '4px 10px',
                      outline: 'none',
                      minWidth: '220px',
                    }}
                  />
                </div>
              </div>

              {/* 3-Level Tree Container */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {treeData.map((root) => {
                  const isRootExpanded = routesSearchQuery.trim().length > 0 || expandedRoots[root.type] !== false;
                  const isFe = root.type === 'frontend';

                  return (
                    <div
                      key={root.type}
                      style={{
                        background: '#0e121d',
                        border: '1px solid #1f2738',
                        borderRadius: '8px',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Level 1: Root */}
                      <div
                        onClick={() => toggleRoot(root.type)}
                        style={{
                          padding: '10px 14px',
                          background: isFe ? 'rgba(30, 58, 138, 0.25)' : 'rgba(76, 29, 149, 0.25)',
                          borderBottom: isRootExpanded ? '1px solid #1f2738' : 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          userSelect: 'none',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '11px', color: isFe ? '#93c5fd' : '#c4b5fd' }}>
                            {isRootExpanded ? '▼' : '▶'}
                          </span>
                          <span style={{ fontSize: '14px' }}>{isFe ? '🌐' : '⚙'}</span>
                          <div>
                            <span style={{ color: '#ffffff', fontSize: '12px', fontWeight: 700 }}>
                              {root.title}
                            </span>
                            <span style={{ color: '#8b949e', fontSize: '10px', marginLeft: '6px', fontFamily: 'monospace' }}>
                              {root.enTitle}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
                          <span
                            style={{
                              background: '#1a1f30',
                              color: '#94a3b8',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '10px',
                            }}
                          >
                            {root.categories.length} 个大类
                          </span>
                          <span
                            style={{
                              background: '#1a1f30',
                              color: '#94a3b8',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontFamily: 'monospace',
                            }}
                          >
                            {root.totalCount} 项
                          </span>
                          <span
                            style={{
                              background: root.failCount === 0 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                              color: root.failCount === 0 ? '#4ade80' : '#f87171',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: 600,
                            }}
                          >
                            {root.passCount}/{root.totalCount} PASS{root.noDataCount ? ` · ${root.noDataCount} NO DATA` : ''}
                          </span>
                        </div>
                      </div>

                      {/* Level 2: Categories */}
                      {isRootExpanded && (
                        <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {root.categories.map((cat) => {
                            const isCatExpanded = routesSearchQuery.trim().length > 0 || expandedCategories[cat.key] !== false;

                            return (
                              <div
                                key={cat.key}
                                style={{
                                  background: '#141824',
                                  border: '1px solid #232838',
                                  borderRadius: '6px',
                                  overflow: 'hidden',
                                }}
                              >
                                {/* Category Header */}
                                <div
                                  onClick={() => toggleCategory(cat.key)}
                                  style={{
                                    padding: '8px 12px',
                                    background: '#191f2e',
                                    borderBottom: isCatExpanded ? '1px solid #232838' : 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer',
                                    userSelect: 'none',
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ fontSize: '10px', color: '#8b949e' }}>
                                      {isCatExpanded ? '▼' : '▶'}
                                    </span>
                                    <span style={{ color: '#ffffff', fontSize: '12px', fontWeight: 600 }}>
                                      {cat.name}
                                    </span>
                                    <span style={{ color: '#8b949e', fontSize: '10px' }}>
                                      {cat.enName}
                                    </span>
                                    <span style={{ color: '#64748b', fontSize: '10px', fontFamily: 'monospace' }}>
                                      ({cat.key})
                                    </span>
                                  </div>

                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
                                    <span style={{ color: '#94a3b8', fontSize: '10px', fontFamily: 'monospace' }}>
                                      {cat.totalCount} 项
                                    </span>
                                    <span
                                      style={{
                                        background: cat.failCount === 0 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                        color: cat.failCount === 0 ? '#4ade80' : '#f87171',
                                        padding: '1px 5px',
                                        borderRadius: '3px',
                                        fontSize: '10px',
                                        fontWeight: 600,
                                      }}
                                    >
                                      {cat.passCount}/{cat.totalCount} PASS{cat.noDataCount ? ` · ${cat.noDataCount} NO DATA` : ''}
                                    </span>
                                  </div>
                                </div>

                                {/* Level 3: Leaf Items Table */}
                                {isCatExpanded && (
                                  <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                      <thead>
                                        <tr style={{ borderBottom: '1px solid #1f2738', background: '#10141f' }}>
                                          <th style={{ padding: '6px 8px', color: '#8b949e', fontSize: '10px', fontWeight: 600, width: '28px' }}>
                                            #
                                          </th>
                                          <th style={{ padding: '6px 8px', color: '#8b949e', fontSize: '10px', fontWeight: 600, width: '60px' }}>
                                            Method
                                          </th>
                                          <th style={{ padding: '6px 8px', color: '#8b949e', fontSize: '10px', fontWeight: 600, width: '200px' }}>
                                            Path / Route
                                          </th>
                                          <th style={{ padding: '6px 8px', color: '#8b949e', fontSize: '10px', fontWeight: 600, width: '90px' }}>
                                            Service
                                          </th>
                                          <th style={{ padding: '6px 8px', color: '#8b949e', fontSize: '10px', fontWeight: 600 }}>
                                            Description
                                          </th>
                                          <th style={{ padding: '6px 8px', color: '#8b949e', fontSize: '10px', fontWeight: 600, width: '60px' }}>
                                            Expected
                                          </th>
                                          <th style={{ padding: '6px 8px', color: '#8b949e', fontSize: '10px', fontWeight: 600, width: '60px' }}>
                                            Observed
                                          </th>
                                          <th style={{ padding: '6px 8px', color: '#8b949e', fontSize: '10px', fontWeight: 600, width: '80px' }}>
                                            Latency
                                          </th>
                                          <th style={{ padding: '6px 8px', color: '#8b949e', fontSize: '10px', fontWeight: 600, width: '60px' }}>
                                            Result
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {cat.items.map((item, idx) => {
                                          const isPass = item.result === 'PASS';
                                          const m = (item.method || 'GET').split(',')[0].trim().toUpperCase();
                                          const methodColor = m === 'GET' ? '#38bdf8' : m === 'POST' ? '#4ade80' : m === 'PUT' ? '#fbbf24' : '#f87171';
                                          const methodBg = m === 'GET' ? 'rgba(56, 189, 248, 0.15)' : m === 'POST' ? 'rgba(74, 222, 128, 0.15)' : m === 'PUT' ? 'rgba(251, 191, 36, 0.15)' : 'rgba(248, 113, 113, 0.15)';

                                          return (
                                            <tr
                                              key={item.id}
                                              style={{
                                                borderBottom: idx < cat.items.length - 1 ? '1px solid #191f2e' : 'none',
                                              }}
                                            >
                                              <td style={{ padding: '6px 8px', color: '#64748b', fontSize: '10px', fontFamily: 'monospace' }}>
                                                {idx + 1}
                                              </td>
                                              <td style={{ padding: '6px 8px' }}>
                                                <span
                                                  style={{
                                                    background: methodBg,
                                                    color: methodColor,
                                                    fontSize: '9px',
                                                    fontWeight: 700,
                                                    padding: '2px 5px',
                                                    borderRadius: '3px',
                                                    fontFamily: 'monospace',
                                                  }}
                                                >
                                                  {item.method}
                                                </span>
                                              </td>
                                              <td style={{ padding: '6px 8px', color: '#ffffff', fontSize: '11px', fontFamily: 'monospace', fontWeight: 600 }}>
                                                {item.path}
                                              </td>
                                              <td style={{ padding: '6px 8px' }}>
                                                <div style={{ color: '#ffffff', fontSize: '11px', fontWeight: 600 }}>
                                                  {item.service}
                                                </div>
                                                <div style={{ color: '#8b949e', fontSize: '9px', fontFamily: 'monospace' }}>
                                                  {item.serviceDomain}
                                                </div>
                                              </td>
                                              <td style={{ padding: '6px 8px', color: '#cbd5e1', fontSize: '11px' }}>
                                                {item.description}
                                              </td>
                                              <td style={{ padding: '6px 8px', color: '#94a3b8', fontSize: '11px', fontFamily: 'monospace' }}>
                                                {item.expectedHttp ?? '—'}
                                              </td>
                                              <td style={{ padding: '6px 8px' }}>
                                                <span
                                                  style={{
                                                    background: item.observedHttp == null ? '#374151' : item.observedHttp === item.expectedHttp ? '#15803d' : '#b91c1c',
                                                    color: '#ffffff',
                                                    fontSize: '10px',
                                                    fontWeight: 700,
                                                    padding: '1px 5px',
                                                    borderRadius: '3px',
                                                    fontFamily: 'monospace',
                                                  }}
                                                >
                                                  {item.observedHttp ?? '—'}
                                                </span>
                                              </td>
                                              <td style={{ padding: '6px 8px', color: '#cbd5e1', fontSize: '10px', fontFamily: 'monospace' }}>
                                                {item.latencyMs != null ? `${item.latencyMs} ms` : '—'}
                                                <span style={{ display: 'block', color: '#64748b', fontSize: '9px' }}>
                                                  {item.freshnessSec != null ? `${item.freshnessSec}s ago` : item.source}
                                                </span>
                                              </td>
                                              <td style={{ padding: '6px 8px' }}>
                                                <span
                                                  style={{
                                                    color: isPass ? '#22c55e' : item.result === 'FAIL' ? '#ef4444' : '#9ca3af',
                                                    fontSize: '10px',
                                                    fontWeight: 700,
                                                  }}
                                                >
                                                  {isPass ? '✔ PASS' : item.result === 'FAIL' ? '✖ FAIL' : item.result}
                                                </span>
                                                <span title={item.probeNote || ''} style={{ display: 'block', color: '#64748b', fontSize: '9px' }}>
                                                  {item.probeNote || (item.source === 'mock' ? 'mock' : '')}
                                                </span>
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};