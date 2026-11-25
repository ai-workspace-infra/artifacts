import React, { FC, useEffect, useMemo, useState } from 'react';
import { PanelProps } from '@grafana/data';
import {
  K6_RAMP_CHECKPOINTS,
  K6_SERIES_40VU,
  K6_SERIES_500VU,
  computeOperatingModel,
  parsePrometheusTelemetry,
  simulateTimeseriesForVu,
} from './dataModel';
import { K6TimeseriesPoint, PanelOptions, TopologyLayer, ViewMode } from './types';

interface ServiceMeta {
  id: string;
  title: string;
  role: string;
  binary: string;
  listen: string;
  highlights: string[];
  color: string;
}

const SERVICE_CATALOG: Record<string, ServiceMeta> = {
  'edge-agent': {
    id: 'edge-agent',
    title: '1. xconnect-edge-agent.service',
    role: 'roles/vhosts/xconnect-edge-agent',
    binary: '/usr/local/bin/agent-proxy -config /etc/agent/account-agent.yaml',
    listen: '01-agent-proxy.yaml (Proxy) · 02-xconnect-gateway.yaml (Gateway)',
    highlights: [
      '控制面唯一同步器：5m 轮询 + SSE 监听 accounts.svc.plus',
      '单一目标 "proxy" -> /usr/local/etc/xray/config.json (xray run -test + SIGHUP 热重载)',
      '独立管理 jp-xconnect-gateway-02 (net-jp-xconnect-02)，修复 gateway_id 错配',
    ],
    color: '#fbbf24',
  },
  fluxgate: {
    id: 'fluxgate',
    title: '2. fluxgate.service (v0.2.1 L7 Ingress)',
    role: 'roles/vhosts/fluxgate',
    binary: '/usr/local/bin/fluxgate v0.2.1',
    listen: '*:443 (TLS *.svc.plus) · 127.0.0.1:9102/metrics',
    highlights: [
      'Route A: /split/* -> unix:///dev/shm/xray.sock (H2 Stream 4MiB / Conn 16MiB / flush -1)',
      'Route B: /xconnect/* -> unix:///run/xconnect-gateway/xray.sock (h2c / strip x_padding)',
      'Route C: /xray-exporter/* -> http://127.0.0.1:8080 (相比 HAProxy 110 MiB 节省 ~82 MiB)',
    ],
    color: '#38bdf8',
  },
  'proxy-xray': {
    id: 'proxy-xray',
    title: '3. xconnect-proxy-xray.service (单体聚合)',
    role: 'roles/vhosts/xconnect_proxy (xray_merged_mode: true)',
    binary: '/usr/local/bin/xray (内嵌 xray-exporter + 内存 stats.Manager)',
    listen: '/dev/shm/xray.sock (XHTTP) · 0.0.0.0:1443 (TCP Vision) · 127.0.0.1:8080/scrape',
    highlights: [
      '4 进程 319.1 MiB 收敛为 1 进程 59.4 MiB (-83%)，消除 gRPC :10086/:10087 开销',
      '同一进程直读内存 stats.Manager 暴露 :8080/scrape 并每分钟直推 Vector :8686',
      '低延迟参数：bufferSize=128, connIdle=3600, uplinkOnly=15, downlinkOnly=30',
    ],
    color: '#34d399',
  },
  'gateway-xray': {
    id: 'gateway-xray',
    title: '4. xconnect-gateway-xray.service',
    role: 'roles/vhosts/xconnect_gateway',
    binary: '/usr/local/bin/xray -config /var/lib/xconnect-gateway/runtime/xray.json',
    listen: '/run/xconnect-gateway/xray.sock (0660) -> WireGuard 127.0.0.1:51820 (xconzero0)',
    highlights: [
      '与 Proxy 共用同一 /usr/local/bin/xray 二进制，采用裸 -config 模式运行（无 exporter）',
      '配置、Unix Socket 与 systemd 生命周期同 Proxy 完全隔离，互不干扰',
    ],
    color: '#fb7185',
  },
  vector: {
    id: 'vector',
    title: '5. vector.service (核心监控与计费汇聚探针)',
    role: 'roles/vhosts/vector-agent + roles/vhosts/xconnect_node_log_policy',
    binary: '/usr/bin/vector 0.41.1 (MALLOC_CONF=narenas:1,thp:never,retain:false)',
    listen: '127.0.0.1:8686 (256MiB disk_v2 计费缓冲) · 15s Prometheus Scrape',
    highlights: [
      '注入 jemalloc thp:never + TOKIO_WORKER_THREADS=1 + 停用无宿主 system_logs，AnonHugePages 61.4M -> 0',
      '常驻 RSS 从 124.1 MiB 压降至 71.5 MiB (-39.6%)，cgroup MemoryHigh=72M / MemoryMax=128M',
      'systemd-journald 同步收紧至 64M/3d + 24M/48M cgroup，RSS 从 105.8 MiB 降至 16.0 MiB',
    ],
    color: '#a78bfa',
  },
};

function buildSvgPath(points: Array<[number, number]>, xFn: (x: number) => number, yFn: (y: number) => number): string {
  return points
    .map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${xFn(pt[0]).toFixed(1)} ${yFn(pt[1]).toFixed(1)}`)
    .join(' ');
}

export const XConnectTopologyRoiPanel: FC<PanelProps<PanelOptions>> = (props) => {
  const { options, data, height, replaceVariables } = props;

  const [activeView, setActiveView] = useState<ViewMode>(options.viewMode || 'all');
  const [activeLayer, setActiveLayer] = useState<TopologyLayer>(options.defaultLayer || 'all');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('proxy-xray');
  const [targetVu, setTargetVu] = useState<number>(options.defaultTargetVu || 120);
  const [userMultiplier, setUserMultiplier] = useState<number>(options.defaultUserMultiplier || 4);
  const [cleanTmpfs, setCleanTmpfs] = useState<boolean>(options.cleanTmpfs ?? true);
  const [vectorOptimized, setVectorOptimized] = useState<boolean>(options.vectorOptimized ?? true);
  const [selectedTier, setSelectedTier] = useState<7 | 10 | 12>(options.defaultTierPrice || 7);

  // Timeseries interactive state
  const [scrubIndex, setScrubIndex] = useState<number>(60); // 15.0m (steady state)
  const [isPlayingTime, setIsPlayingTime] = useState<boolean>(false);
  const [show40VuSeries, setShow40VuSeries] = useState<boolean>(true);
  const [show500VuSeries, setShow500VuSeries] = useState<boolean>(true);
  const [showSimVuSeries, setShowSimVuSeries] = useState<boolean>(true);

  useEffect(() => {
    if (options.viewMode) setActiveView(options.viewMode);
  }, [options.viewMode]);

  useEffect(() => {
    if (options.defaultLayer) setActiveLayer(options.defaultLayer);
  }, [options.defaultLayer]);

  const liveTelemetry = useMemo(() => parsePrometheusTelemetry(data?.series), [data]);

  useEffect(() => {
    if (options.followLiveVu && liveTelemetry.activeVusOrConns && liveTelemetry.activeVusOrConns > 0) {
      setTargetVu(Math.max(10, Math.min(500, liveTelemetry.activeVusOrConns)));
    }
  }, [options.followLiveVu, liveTelemetry.activeVusOrConns]);

  useEffect(() => {
    if (!isPlayingTime) {
      return;
    }
    const timer = setInterval(() => {
      setScrubIndex((prev) => (prev >= K6_SERIES_500VU.length - 1 ? 0 : prev + 1));
    }, 180);
    return () => clearInterval(timer);
  }, [isPlayingTime]);

  const resolvedNodeName = useMemo(() => {
    const raw = options.nodeHostname || 'jp-xconnect-02.svc.plus';
    if (replaceVariables) {
      try {
        const v = replaceVariables(raw);
        if (v && !v.startsWith('$')) return v;
      } catch {
        // ignore
      }
    }
    return liveTelemetry.instance || raw;
  }, [options.nodeHostname, replaceVariables, liveTelemetry.instance]);

  const model = useMemo(
    () =>
      computeOperatingModel(targetVu, {
        userMultiplier,
        cleanTmpfs,
        vectorOptimized,
        totalRamMib: liveTelemetry.memTotalMib || options.totalRamMib || 939,
      }),
    [targetVu, userMultiplier, cleanTmpfs, vectorOptimized, liveTelemetry.memTotalMib, options.totalRamMib]
  );

  const simSeries = useMemo<K6TimeseriesPoint[]>(() => simulateTimeseriesForVu(targetVu), [targetVu]);

  const activeTierCost = model.roi.tiers[selectedTier];
  const selectedService = SERVICE_CATALOG[selectedServiceId] || SERVICE_CATALOG['proxy-xray'];

  // Effective RSS values for topology nodes (prefer live Prometheus if available and followLiveVu is active, else dynamic model)
  const fluxgateRss = liveTelemetry.processRssMib.fluxgate ?? model.memory.fluxgateRssMib;
  const proxyXrayRss = liveTelemetry.processRssMib.proxyXray ?? model.memory.proxyXrayRssMib;
  const gatewayXrayRss = liveTelemetry.processRssMib.gatewayXray ?? model.memory.gatewayXrayRssMib;
  const edgeAgentRss = liveTelemetry.processRssMib.edgeAgent ?? model.memory.edgeAgentRssMib;
  const vectorRss = liveTelemetry.processRssMib.vector ?? model.memory.vectorRssMib;
  const journaldRss = liveTelemetry.processRssMib.journald ?? model.memory.journaldRssMib;

  const isLayerVisible = (layersStr: string): boolean => {
    if (activeLayer === 'all') return true;
    return layersStr.split(',').includes(activeLayer);
  };

  // ============================================================================
  // CHART 1: k6 40 VU vs 500 VU (30m) Dynamic Timeseries SVG
  // ============================================================================
  const renderTimeseriesChart = () => {
    const w = 1560;
    const h = 620;
    const px1 = (m: number) => 80 + (m / 30.0) * 640;
    const py1Qps = (q: number) => 520 - (Math.min(q, 250.0) / 250.0) * 400;
    const px2 = (m: number) => 840 + (m / 30.0) * 640;
    const py2Lat = (l: number) => 520 - (Math.min(l, 6000.0) / 6000.0) * 400;

    const p1Qps500 = buildSvgPath(
      K6_SERIES_500VU.map((p) => [p.minute, p.qps]),
      px1,
      py1Qps
    );
    const p1Qps40 = buildSvgPath(
      K6_SERIES_40VU.map((p) => [p.minute, p.qps]),
      px1,
      py1Qps
    );
    const p1QpsSim = buildSvgPath(
      simSeries.map((p) => [p.minute, p.qps]),
      px1,
      py1Qps
    );

    const p2Lat500 = buildSvgPath(
      K6_SERIES_500VU.map((p) => [p.minute, p.impliedLatencyMs]),
      px2,
      py2Lat
    );
    const p2Lat40 = buildSvgPath(
      K6_SERIES_40VU.map((p) => [p.minute, p.impliedLatencyMs]),
      px2,
      py2Lat
    );
    const p2LatSim = buildSvgPath(
      simSeries.map((p) => [p.minute, p.impliedLatencyMs]),
      px2,
      py2Lat
    );

    const vuAreaPts: Array<[number, number]> = [
      [0, 0],
      ...K6_SERIES_500VU.map((p): [number, number] => [p.minute, p.avgVu * 0.5]),
      [30, 0],
    ];
    const vuPoly = vuAreaPts.map(([t, y]) => `${px1(t).toFixed(1)},${py1Qps(y).toFixed(1)}`).join(' ');

    const idx = Math.max(0, Math.min(K6_SERIES_500VU.length - 1, scrubIndex));
    const pt40 = K6_SERIES_40VU[idx];
    const pt500 = K6_SERIES_500VU[idx];
    const ptSim = simSeries[idx];
    const curMin = pt500.minute;
    const phaseLabel =
      curMin < 7.5
        ? '0–7.5m 线性爬坡期'
        : curMin >= 9.5 && curMin <= 11.0
        ? 't≈10m 连接池重置与 H2 多路复用重建拐点'
        : curMin <= 22.5
        ? '7.5–22.5m 峰值稳态保持期'
        : '22.5–30m 线性降载期';

    return (
      <div
        style={{
          background: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: '12px',
          padding: '14px 16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '10px',
          }}
        >
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc' }}>
              ② 40 VU vs 500 VU（30 分钟 / 1s 采样分箱）实测吞吐与延迟动态对比
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
              目标节点：<span style={{ fontFamily: 'monospace', color: '#38bdf8' }}>{resolvedNodeName}</span>（VLESS+XHTTP+TLS{' '}
              <code>/split</code>）· 拖动时间轴或悬停曲线查看任意 15s 分箱实测切片
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setIsPlayingTime((v) => !v)}
              style={{
                background: isPlayingTime ? '#dc2626' : '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '5px 11px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {isPlayingTime ? '⏸ 暂停回放' : '▶ 动态回放 30m'}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#cbd5e1' }}>
              <span>时间切片: {curMin.toFixed(2)}m</span>
              <input
                type="range"
                min={0}
                max={K6_SERIES_500VU.length - 1}
                value={idx}
                onChange={(e) => setScrubIndex(Number(e.target.value))}
                style={{ width: '130px', accentColor: '#38bdf8', cursor: 'pointer' }}
              />
            </div>
            <button
              onClick={() => setShow500VuSeries((v) => !v)}
              style={{
                background: show500VuSeries ? 'rgba(56,189,248,0.18)' : '#1e293b',
                border: `1px solid ${show500VuSeries ? '#38bdf8' : '#334155'}`,
                color: show500VuSeries ? '#38bdf8' : '#64748b',
                borderRadius: '6px',
                padding: '4px 9px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ● 500 VU 实测
            </button>
            <button
              onClick={() => setShow40VuSeries((v) => !v)}
              style={{
                background: show40VuSeries ? 'rgba(52,211,153,0.18)' : '#1e293b',
                border: `1px solid ${show40VuSeries ? '#34d399' : '#334155'}`,
                color: show40VuSeries ? '#34d399' : '#64748b',
                borderRadius: '6px',
                padding: '4px 9px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ● 40 VU 实测
            </button>
            <button
              onClick={() => setShowSimVuSeries((v) => !v)}
              style={{
                background: showSimVuSeries ? 'rgba(167,139,250,0.22)' : '#1e293b',
                border: `1px solid ${showSimVuSeries ? '#a78bfa' : '#334155'}`,
                color: showSimVuSeries ? '#c4b5fd' : '#64748b',
                borderRadius: '6px',
                padding: '4px 9px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ◆ 当前 {targetVu} VU 动态仿真
            </button>
          </div>
        </div>

        {/* Live Time-Slice Readout Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '8px',
            marginBottom: '10px',
            background: '#0b1120',
            border: '1px solid #1e293b',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '12px',
          }}
        >
          <div>
            <span style={{ color: '#94a3b8' }}>当前采样时刻：</span>
            <strong style={{ color: '#f8fafc', fontFamily: 'monospace' }}>t = {curMin.toFixed(2)} min</strong>
            <span
              style={{
                marginLeft: '8px',
                padding: '1px 6px',
                borderRadius: '4px',
                background: 'rgba(251,191,36,0.15)',
                color: '#fbbf24',
                fontSize: '11px',
              }}
            >
              {phaseLabel}
            </span>
          </div>
          <div>
            <span style={{ color: '#34d399', fontWeight: 600 }}>40 VU 基线：</span>
            <span style={{ fontFamily: 'monospace', color: '#e2e8f0' }}>
              {pt40.avgVu} VU · <strong>{pt40.qps} req/s</strong> · 均延 <strong>{pt40.impliedLatencyMs} ms</strong>
            </span>
          </div>
          <div>
            <span style={{ color: '#38bdf8', fontWeight: 600 }}>500 VU 实测：</span>
            <span style={{ fontFamily: 'monospace', color: '#e2e8f0' }}>
              {pt500.avgVu} VU · <strong>{pt500.qps} req/s</strong> · 均延 <strong>{pt500.impliedLatencyMs} ms</strong>
            </span>
          </div>
          <div>
            <span style={{ color: '#a78bfa', fontWeight: 600 }}>当前 {targetVu} VU 动态包络：</span>
            <span style={{ fontFamily: 'monospace', color: '#e2e8f0' }}>
              {ptSim.avgVu} VU · <strong>{ptSim.qps} req/s</strong> · 均延 <strong>{ptSim.impliedLatencyMs} ms</strong>
            </span>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <svg
            viewBox={`0 0 ${w} ${h}`}
            style={{ width: '100%', minWidth: '1020px', height: 'auto', display: 'block', userSelect: 'none' }}
          >
            <rect x="16" y="16" width="745" height="585" rx="10" fill="#0b1120" stroke="#1e293b" />
            <rect x="795" y="16" width="749" height="585" rx="10" fill="#0b1120" stroke="#1e293b" />

            <text x="80" y="48" fontSize="14" fontWeight="700" fill="#f8fafc">
              A. 实时吞吐量 QPS (req/s) 15s 平滑曲线 (点击或悬停定位时间切片)
            </text>
            <text x="840" y="48" fontSize="14" fontWeight="700" fill="#f8fafc">
              B. Little&apos;s Law 推算平均请求延迟 (ms) 曲线
            </text>

            {/* Panel 1 Y grid */}
            {[0, 50, 100, 150, 200, 250].map((q) => {
              const y = py1Qps(q);
              return (
                <g key={`q-${q}`}>
                  <line x1="80" y1={y} x2="720" y2={y} stroke="#1e293b" strokeWidth="1" />
                  <text x="70" y={y + 4} textAnchor="end" fontSize="11" fill="#94a3b8">
                    {q}
                  </text>
                </g>
              );
            })}

            {/* Panel 2 Y grid */}
            {[0, 1000, 1500, 3000, 4500, 6000].map((l) => {
              const y = py2Lat(l);
              const isSlo = l === 1500;
              return (
                <g key={`l-${l}`}>
                  <line
                    x1="840"
                    y1={y}
                    x2="1480"
                    y2={y}
                    stroke={isSlo ? '#ef4444' : '#1e293b'}
                    strokeWidth={isSlo ? '1.6' : '1'}
                    strokeDasharray={isSlo ? '5 4' : undefined}
                  />
                  <text x="830" y={y + 4} textAnchor="end" fontSize="11" fill={isSlo ? '#f87171' : '#94a3b8'}>
                    {l}
                  </text>
                </g>
              );
            })}

            {/* X ticks on both panels */}
            {[0, 5, 7.5, 10, 15, 22.5, 30].map((m) => {
              const x1 = px1(m);
              const x2 = px2(m);
              return (
                <g key={`xt-${m}`}>
                  <line x1={x1} y1="80" x2={x1} y2="520" stroke="#1e293b" strokeDasharray="3 4" />
                  <text x={x1} y="542" textAnchor="middle" fontSize="11" fill="#94a3b8">
                    {m}m
                  </text>
                  <line x1={x2} y1="80" x2={x2} y2="520" stroke="#1e293b" strokeDasharray="3 4" />
                  <text x={x2} y="542" textAnchor="middle" fontSize="11" fill="#94a3b8">
                    {m}m
                  </text>
                </g>
              );
            })}

            {/* VU ramp shaded outline */}
            <polygon points={vuPoly} fill="rgba(148,163,184,0.10)" />

            {/* t=10m pool reset annotation */}
            <line
              x1={px1(10)}
              y1="80"
              x2={px1(10)}
              y2="520"
              stroke="#fbbf24"
              strokeWidth="1.3"
              strokeDasharray="4 3"
            />
            <text x={px1(10) + 8} y="98" fontSize="11" fontWeight="600" fill="#fbbf24">
              t≈10m 连接池重连 -&gt; 206.2 req/s
            </text>

            <line
              x1={px2(10)}
              y1="80"
              x2={px2(10)}
              y2="520"
              stroke="#fbbf24"
              strokeWidth="1.3"
              strokeDasharray="4 3"
            />
            <text x={px2(10) + 8} y="98" fontSize="11" fontWeight="600" fill="#fbbf24">
              连接复用重建后均延回落 ~1.4s
            </text>
            <text x="1475" y={py2Lat(1500) - 6} textAnchor="end" fontSize="11" fontWeight="700" fill="#f87171">
              SLO P95 红线: 1500 ms
            </text>

            {/* Series paths */}
            {show500VuSeries && <path d={p1Qps500} fill="none" stroke="#38bdf8" strokeWidth="2.4" />}
            {show40VuSeries && <path d={p1Qps40} fill="none" stroke="#34d399" strokeWidth="2.4" />}
            {showSimVuSeries && (
              <path d={p1QpsSim} fill="none" stroke="#a78bfa" strokeWidth="2.2" strokeDasharray="6 3" />
            )}

            {show500VuSeries && <path d={p2Lat500} fill="none" stroke="#fb7185" strokeWidth="2.4" />}
            {show40VuSeries && <path d={p2Lat40} fill="none" stroke="#34d399" strokeWidth="2.4" />}
            {showSimVuSeries && (
              <path d={p2LatSim} fill="none" stroke="#a78bfa" strokeWidth="2.2" strokeDasharray="6 3" />
            )}

            {/* Interactive Scrubber Crosshair on Panel A & Panel B */}
            <line x1={px1(curMin)} y1="80" x2={px1(curMin)} y2="520" stroke="#f8fafc" strokeWidth="1.5" />
            {show500VuSeries && <circle cx={px1(curMin)} cy={py1Qps(pt500.qps)} r="5" fill="#38bdf8" stroke="#0b1120" strokeWidth="1.5" />}
            {show40VuSeries && <circle cx={px1(curMin)} cy={py1Qps(pt40.qps)} r="5" fill="#34d399" stroke="#0b1120" strokeWidth="1.5" />}
            {showSimVuSeries && <circle cx={px1(curMin)} cy={py1Qps(ptSim.qps)} r="5" fill="#a78bfa" stroke="#0b1120" strokeWidth="1.5" />}

            <line x1={px2(curMin)} y1="80" x2={px2(curMin)} y2="520" stroke="#f8fafc" strokeWidth="1.5" />
            {show500VuSeries && (
              <circle
                cx={px2(curMin)}
                cy={py2Lat(pt500.impliedLatencyMs)}
                r="5"
                fill="#fb7185"
                stroke="#0b1120"
                strokeWidth="1.5"
              />
            )}
            {show40VuSeries && (
              <circle
                cx={px2(curMin)}
                cy={py2Lat(pt40.impliedLatencyMs)}
                r="5"
                fill="#34d399"
                stroke="#0b1120"
                strokeWidth="1.5"
              />
            )}
            {showSimVuSeries && (
              <circle
                cx={px2(curMin)}
                cy={py2Lat(ptSim.impliedLatencyMs)}
                r="5"
                fill="#a78bfa"
                stroke="#0b1120"
                strokeWidth="1.5"
              />
            )}

            {/* Legends */}
            <rect x="88" y="88" width="225" height="86" rx="8" fill="#0f172a" fillOpacity="0.92" stroke="#334155" />
            <line x1="100" y1="106" x2="122" y2="106" stroke="#38bdf8" strokeWidth="3" />
            <text x="128" y="110" fontSize="11" fill="#e2e8f0">
              500 VU 实测 QPS (峰值 206.2/s)
            </text>
            <line x1="100" y1="126" x2="122" y2="126" stroke="#34d399" strokeWidth="3" />
            <text x="128" y="130" fontSize="11" fill="#e2e8f0">
              40 VU 实测 QPS (稳态 35.3/s)
            </text>
            <line x1="100" y1="146" x2="122" y2="146" stroke="#a78bfa" strokeWidth="2.5" strokeDasharray="5 2" />
            <text x="128" y="150" fontSize="11" fill="#c4b5fd">
              当前 {targetVu} VU 动态仿真曲线
            </text>
            <rect x="100" y="158" width="22" height="8" fill="rgba(148,163,184,0.28)" />
            <text x="128" y="166" fontSize="10" fill="#94a3b8">
              阴影：500 VU 爬坡轮廓
            </text>

            <rect x="1185" y="112" width="286" height="72" rx="8" fill="#0f172a" fillOpacity="0.92" stroke="#334155" />
            <line x1="1198" y1="130" x2="1222" y2="130" stroke="#fb7185" strokeWidth="3" />
            <text x="1230" y="134" fontSize="11" fill="#e2e8f0">
              500 VU 推算延迟 (实测 P95 4592 ms)
            </text>
            <line x1="1198" y1="150" x2="1222" y2="150" stroke="#34d399" strokeWidth="3" />
            <text x="1230" y="154" fontSize="11" fill="#e2e8f0">
              40 VU 推算延迟 (实测 P95 207 ms)
            </text>
            <line x1="1198" y1="170" x2="1222" y2="170" stroke="#a78bfa" strokeWidth="2.5" strokeDasharray="5 2" />
            <text x="1230" y="174" fontSize="11" fill="#c4b5fd">
              当前 {targetVu} VU 动态延迟 (P95 ~{model.estimatedP95Ms} ms)
            </text>

            {/* Invisible interactive overlay on Panel A & Panel B for hover/click scrubbing */}
            <rect
              x="80"
              y="80"
              width="640"
              height="440"
              fill="transparent"
              style={{ cursor: 'crosshair' }}
              onMouseMove={(e) => {
                const svg = e.currentTarget.ownerSVGElement;
                if (!svg) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / Math.max(1, rect.width)));
                setScrubIndex(Math.round(ratio * (K6_SERIES_500VU.length - 1)));
              }}
            />
            <rect
              x="840"
              y="80"
              width="640"
              height="440"
              fill="transparent"
              style={{ cursor: 'crosshair' }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / Math.max(1, rect.width)));
                setScrubIndex(Math.round(ratio * (K6_SERIES_500VU.length - 1)));
              }}
            />

            <text x="400" y="576" textAnchor="middle" fontSize="12" fill="#94a3b8">
              压测时间（分钟，0–30m，悬停图表任意位置实时联动）
            </text>
            <text x="1160" y="576" textAnchor="middle" fontSize="12" fill="#94a3b8">
              压测时间（分钟，0–30m，悬停图表任意位置实时联动）
            </text>
          </svg>
        </div>
      </div>
    );
  };

  // ============================================================================
  // CHART 2: Little's Law Knee & 939 MiB Memory Scaling Dynamic SVG
  // ============================================================================
  const renderKneeAndMemoryChart = () => {
    const w = 1560;
    const h = 620;
    const px1 = (vu: number) => 85 + (vu / 500.0) * 600;
    const py1Q = (q: number) => 515 - (Math.min(q, 120.0) / 120.0) * 400;
    const py1M = (m: number) => 515 - (Math.min(m, 1.0) / 1.0) * 400;

    const px2 = (vu: number) => 865 + (vu / 500.0) * 600;
    const py2R = (r: number) => 515 - (Math.min(r, 1000.0) / 1000.0) * 400;

    const qpsLine = buildSvgPath(
      K6_RAMP_CHECKPOINTS.map((p) => [p.targetVu, p.qps]),
      px1,
      py1Q
    );
    const effLine = buildSvgPath(
      K6_RAMP_CHECKPOINTS.map((p) => [p.targetVu, p.marginalQpsPerVu]),
      px1,
      py1M
    );

    const sampleVus = [0, 40, 100, 120, 150, 200, 296, 370, 415, 500];
    const memWithTmpPts: Array<[number, number]> = sampleVus.map((v) => [
      v,
      computeOperatingModel(Math.max(1, v), { cleanTmpfs: false, vectorOptimized }).memory.totalUsedWithTmpMib,
    ]);
    const memCleanTmpPts: Array<[number, number]> = sampleVus.map((v) => [
      v,
      computeOperatingModel(Math.max(1, v), { cleanTmpfs: true, vectorOptimized }).memory.totalUsedCleanTmpMib,
    ]);
    const proxyOnlyPts: Array<[number, number]> = sampleVus.map((v) => [
      v,
      computeOperatingModel(Math.max(1, v), { cleanTmpfs, vectorOptimized }).memory.proxyCombinedMib,
    ]);

    const pTmp = buildSvgPath(memWithTmpPts, px2, py2R);
    const pCln = buildSvgPath(memCleanTmpPts, px2, py2R);
    const pPrx = buildSvgPath(proxyOnlyPts, px2, py2R);

    return (
      <div
        style={{
          background: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: '12px',
          padding: '14px 16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '10px',
          }}
        >
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc' }}>
              ③ 实测并发拐点（Little&apos;s Law Knee）与 {model.memory.totalRamMib} MiB 内存动态缩放模型
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
              基于 500 VU 爬坡阶段 1s 级分箱采样 · Proxy 边际内存斜率 <code>0.587 MiB/VU</code> · 点击或拖动图表可直接设定目标并发 VU
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '12px' }}>
            <span
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                background: 'rgba(56,189,248,0.14)',
                border: '1px solid rgba(56,189,248,0.4)',
                color: '#38bdf8',
                fontFamily: 'monospace',
              }}
            >
              当前 {model.vu} VU: 爬坡 {model.rampQps} req/s · 边际效率 {model.marginalEfficiency} QPS/VU
            </span>
            <span
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                background: 'rgba(52,211,153,0.14)',
                border: '1px solid rgba(52,211,153,0.4)',
                color: '#34d399',
                fontFamily: 'monospace',
              }}
            >
              75% RAM 安全上限: {model.memory.maxSafeVu75} VU · 80% 告警上限: {model.memory.maxSafeVu80} VU
            </span>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <svg
            viewBox={`0 0 ${w} ${h}`}
            style={{ width: '100%', minWidth: '1020px', height: 'auto', display: 'block', userSelect: 'none' }}
          >
            <rect x="16" y="16" width="745" height="585" rx="10" fill="#0b1120" stroke="#1e293b" />
            <rect x="795" y="16" width="749" height="585" rx="10" fill="#0b1120" stroke="#1e293b" />

            <text x="85" y="48" fontSize="14" fontWeight="700" fill="#f8fafc">
              A. 爬坡阶段 QPS 吞吐 vs 边际效率 (QPS/VU) 拐点 (点击设定并发)
            </text>
            <text x="865" y="48" fontSize="14" fontWeight="700" fill="#f8fafc">
              B. 内存随 VU 线性缩放模型与 {model.memory.totalRamMib} MiB OOM 安全上限
            </text>

            {/* Optimal sweet spot highlight 100-150 VU */}
            <rect x={px1(100)} y="95" width={px1(150) - px1(100)} height="420" fill="rgba(52,211,153,0.10)" />
            <line
              x1={px1(150)}
              y1="95"
              x2={px1(150)}
              y2="515"
              stroke="#34d399"
              strokeWidth="1.5"
              strokeDasharray="5 3"
            />
            <text x={px1(125)} y="114" textAnchor="middle" fontSize="11" fontWeight="700" fill="#34d399">
              甜蜜区 100-150 VU
            </text>

            {/* 200 VU Knee line */}
            <line
              x1={px1(200)}
              y1="95"
              x2={px1(200)}
              y2="515"
              stroke="#fb7185"
              strokeWidth="1.8"
              strokeDasharray="5 3"
            />
            <text x={px1(206)} y="132" fontSize="11" fontWeight="700" fill="#fb7185">
              200 VU 排队拐点
            </text>
            <text x={px1(206)} y="148" fontSize="10" fill="#fda4af">
              QPS/VU 跌至 0.424
            </text>

            {/* Panel 1 grids */}
            {[0, 30, 60, 90, 120].map((q) => {
              const y = py1Q(q);
              return (
                <g key={`k1-${q}`}>
                  <line x1="85" y1={y} x2="685" y2={y} stroke="#1e293b" />
                  <text x="76" y={y + 4} textAnchor="end" fontSize="11" fill="#38bdf8">
                    {q}
                  </text>
                </g>
              );
            })}
            {[0.0, 0.25, 0.5, 0.75, 1.0].map((mVal) => {
              const y = py1M(mVal);
              return (
                <text key={`m1-${mVal}`} x="694" y={y + 4} textAnchor="start" fontSize="11" fill="#fbbf24">
                  {mVal.toFixed(2)}
                </text>
              );
            })}

            {/* Panel 2 grids */}
            {[0, 200, 400, 600, 800, 1000].map((r) => {
              const y = py2R(r);
              return (
                <g key={`r2-${r}`}>
                  <line x1="865" y1={y} x2="1465" y2={y} stroke="#1e293b" />
                  <text x="856" y={y + 4} textAnchor="end" fontSize="11" fill="#94a3b8">
                    {r}
                  </text>
                </g>
              );
            })}

            {/* X ticks */}
            {[0, 100, 150, 200, 300, 400, 500].map((vu) => (
              <g key={`kxt-${vu}`}>
                <line x1={px1(vu)} y1="95" x2={px1(vu)} y2="515" stroke="#1e293b" strokeDasharray="3 4" />
                <text x={px1(vu)} y="536" textAnchor="middle" fontSize="11" fill="#94a3b8">
                  {vu}
                </text>
                <line x1={px2(vu)} y1="95" x2={px2(vu)} y2="515" stroke="#1e293b" strokeDasharray="3 4" />
                <text x={px2(vu)} y="536" textAnchor="middle" fontSize="11" fill="#94a3b8">
                  {vu}
                </text>
              </g>
            ))}

            {/* Panel 1 Curves & Checkpoints */}
            <path d={qpsLine} fill="none" stroke="#38bdf8" strokeWidth="2.8" />
            <path d={effLine} fill="none" stroke="#fbbf24" strokeWidth="2.8" />
            {K6_RAMP_CHECKPOINTS.map((p) => (
              <g key={`cp-${p.targetVu}`}>
                <circle cx={px1(p.targetVu)} cy={py1Q(p.qps)} r="4" fill="#38bdf8" />
                <circle cx={px1(p.targetVu)} cy={py1M(p.marginalQpsPerVu)} r="4" fill="#fbbf24" />
              </g>
            ))}

            {/* Live Cursor on Panel 1 */}
            <line x1={px1(model.vu)} y1="95" x2={px1(model.vu)} y2="515" stroke="#f8fafc" strokeWidth="1.6" />
            <circle
              cx={px1(model.vu)}
              cy={py1Q(model.rampQps)}
              r="6"
              fill="#38bdf8"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <circle
              cx={px1(model.vu)}
              cy={py1M(model.marginalEfficiency)}
              r="6"
              fill="#fbbf24"
              stroke="#ffffff"
              strokeWidth="2"
            />

            {/* Panel 2 Memory Thresholds */}
            <line
              x1="865"
              y1={py2R(model.memory.totalRamMib)}
              x2="1465"
              y2={py2R(model.memory.totalRamMib)}
              stroke="#ef4444"
              strokeWidth="2"
            />
            <text
              x="1460"
              y={py2R(model.memory.totalRamMib) - 6}
              textAnchor="end"
              fontSize="11"
              fontWeight="700"
              fill="#ef4444"
            >
              100% 物理内存 / OOM ({model.memory.totalRamMib} MiB, 0 Swap)
            </text>

            <line
              x1="865"
              y1={py2R(model.memory.totalRamMib * 0.8)}
              x2="1465"
              y2={py2R(model.memory.totalRamMib * 0.8)}
              stroke="#f97316"
              strokeWidth="1.5"
              strokeDasharray="5 4"
            />
            <text
              x="875"
              y={py2R(model.memory.totalRamMib * 0.8) - 6}
              textAnchor="start"
              fontSize="11"
              fontWeight="700"
              fill="#fb923c"
            >
              80% 硬告警线 ({(model.memory.totalRamMib * 0.8).toFixed(1)} MiB -&gt; ~{model.memory.maxSafeVu80} VU)
            </text>

            <line
              x1="865"
              y1={py2R(model.memory.totalRamMib * 0.75)}
              x2="1465"
              y2={py2R(model.memory.totalRamMib * 0.75)}
              stroke="#fbbf24"
              strokeWidth="1.5"
              strokeDasharray="5 4"
            />
            <text
              x="875"
              y={py2R(model.memory.totalRamMib * 0.75) + 14}
              textAnchor="start"
              fontSize="11"
              fontWeight="700"
              fill="#fbbf24"
            >
              75% 安全上限 ({(model.memory.totalRamMib * 0.75).toFixed(1)} MiB -&gt; ~{model.memory.maxSafeVu75} VU)
            </text>

            {/* Panel 2 Memory Scaling Paths */}
            <path
              d={pTmp}
              fill="none"
              stroke="#fb7185"
              strokeWidth={cleanTmpfs ? '2.0' : '3.0'}
              opacity={cleanTmpfs ? 0.65 : 1}
            />
            <path
              d={pCln}
              fill="none"
              stroke="#34d399"
              strokeWidth={cleanTmpfs ? '3.0' : '2.0'}
              strokeDasharray="6 3"
            />
            <path d={pPrx} fill="none" stroke="#38bdf8" strokeWidth="2.5" />

            {/* Live Cursor on Panel 2 */}
            <line x1={px2(model.vu)} y1="95" x2={px2(model.vu)} y2="515" stroke="#f8fafc" strokeWidth="1.6" />
            <circle
              cx={px2(model.vu)}
              cy={py2R(model.memory.totalUsedMib)}
              r="6.5"
              fill={cleanTmpfs ? '#34d399' : '#fb7185'}
              stroke="#ffffff"
              strokeWidth="2"
            />
            <circle
              cx={px2(model.vu)}
              cy={py2R(model.memory.proxyCombinedMib)}
              r="5.5"
              fill="#38bdf8"
              stroke="#ffffff"
              strokeWidth="1.5"
            />

            <text
              x={Math.min(1445, Math.max(940, px2(model.vu)))}
              y={py2R(model.memory.totalUsedMib) - 12}
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill="#f8fafc"
            >
              {model.vu} VU: {model.memory.totalUsedMib} MiB ({model.memory.ramPct}%)
            </text>

            {/* Legends */}
            <rect x="370" y="425" width="295" height="62" rx="8" fill="#0f172a" fillOpacity="0.92" stroke="#334155" />
            <line x1="384" y1="447" x2="412" y2="447" stroke="#38bdf8" strokeWidth="3" />
            <text x="420" y="451" fontSize="12" fill="#e2e8f0">
              爬坡吞吐量 QPS (左轴 req/s)
            </text>
            <line x1="384" y1="470" x2="412" y2="470" stroke="#fbbf24" strokeWidth="3" />
            <text x="420" y="474" fontSize="12" fill="#e2e8f0">
              边际效率 QPS/VU (右轴)
            </text>

            <rect x="880" y="102" width="340" height="82" rx="8" fill="#0f172a" fillOpacity="0.92" stroke="#334155" />
            <line x1="894" y1="124" x2="922" y2="124" stroke="#fb7185" strokeWidth="3" />
            <text x="930" y="128" fontSize="11" fill="#e2e8f0">
              整机总内存（含 /tmp 75 MiB tmpfs）
            </text>
            <line x1="894" y1="146" x2="922" y2="146" stroke="#34d399" strokeWidth="3" strokeDasharray="6 3" />
            <text x="930" y="150" fontSize="11" fill="#e2e8f0">
              整机总内存（清理 /tmp 后可多抗 +120 VU）
            </text>
            <line x1="894" y1="168" x2="922" y2="168" stroke="#38bdf8" strokeWidth="3" />
            <text x="930" y="172" fontSize="11" fill="#e2e8f0">
              仅 Fluxgate + xconnect-proxy-xray RSS ({model.memory.proxyCombinedMib} MiB)
            </text>

            {/* Interactive click/drag overlay to adjust targetVu directly */}
            <rect
              x="85"
              y="95"
              width="600"
              height="420"
              fill="transparent"
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const ratio = Math.max(0.02, Math.min(1, (e.clientX - rect.left) / Math.max(1, rect.width)));
                setTargetVu(Math.round((ratio * 500) / 5) * 5);
              }}
            />
            <rect
              x="865"
              y="95"
              width="600"
              height="420"
              fill="transparent"
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const ratio = Math.max(0.02, Math.min(1, (e.clientX - rect.left) / Math.max(1, rect.width)));
                setTargetVu(Math.round((ratio * 500) / 5) * 5);
              }}
            />

            <text x="385" y="574" textAnchor="middle" fontSize="12" fill="#94a3b8">
              并发虚拟用户数 (VUs，点击任意位置切换目标并发水位)
            </text>
            <text x="1165" y="574" textAnchor="middle" fontSize="12" fill="#94a3b8">
              并发虚拟用户数 (VUs，点击任意位置切换目标并发水位)
            </text>
          </svg>
        </div>
      </div>
    );
  };

  // ============================================================================
  // CHART 3: P95 SLO Thresholds & 2C1G AWS Lightsail Dynamic ROI Panel
  // ============================================================================
  const renderSloAndRoiChart = () => {
    const w = 1560;
    const h = 620;
    const py1 = (ms: number) => 510 - (Math.min(ms, 5000.0) / 5000.0) * 395;
    const px2 = (vu: number) => 875 + ((vu - 40) / 460.0) * 590;
    const py2User = (usd: number) => 510 - (Math.min(usd, 0.09) / 0.09) * 395;

    const bars = [
      { label1: '40 VU', label2: '实测基线', val: 207.1, col: '#34d399', vu: 40 },
      { label1: '120 VU', label2: '最佳甜点', val: 680.0, col: '#38bdf8', vu: 120 },
      { label1: '150 VU', label2: '拐点前', val: 950.0, col: '#38bdf8', vu: 150 },
      { label1: '200 VU', label2: '排空线', val: 1800.0, col: '#fbbf24', vu: 200 },
      { label1: '500 VU', label2: '极限实测', val: 4591.6, col: '#fb7185', vu: 500 },
      {
        label1: `当前 ${model.vu} VU`,
        label2: '动态仿真',
        val: model.estimatedP95Ms,
        col: '#a78bfa',
        vu: model.vu,
      },
    ];

    const roiVus = [40, 80, 100, 120, 150, 160, 200, 250, 300, 400, 500];
    const roiModels = roiVus.map((v) => computeOperatingModel(v, { userMultiplier, cleanTmpfs, vectorOptimized }));

    const l7 = buildSvgPath(
      roiModels.map((m) => [m.vu, m.roi.tiers[7].costPerUserUsd]),
      px2,
      py2User
    );
    const l10 = buildSvgPath(
      roiModels.map((m) => [m.vu, m.roi.tiers[10].costPerUserUsd]),
      px2,
      py2User
    );
    const l12 = buildSvgPath(
      roiModels.map((m) => [m.vu, m.roi.tiers[12].costPerUserUsd]),
      px2,
      py2User
    );

    const clampedVuForRoiAxis = Math.max(40, Math.min(500, model.vu));

    const tableRows = [
      { vu: 40, tag: '40 VU 保守基线', note: 'PASS (207ms)' },
      { vu: 120, tag: '120 VU 最佳甜点', note: 'PASS (最佳 ROI)' },
      { vu: 150, tag: '150 VU 拐点前上限', note: 'P1 临界观察' },
      { vu: 160, tag: '160 VU 软上限', note: 'P1 预警线' },
      { vu: 200, tag: '200 VU 排空线', note: 'P2 排队拐点（切流）' },
      { vu: 500, tag: '500 VU 极限压测', note: 'P3 FAIL (4.59s, 89% RAM)' },
    ];

    return (
      <div
        style={{
          background: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: '12px',
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc' }}>
              ④ P95 延迟分级监控上限与 AWS Lightsail 2C1G ($7 / $10 / $12) 动态 ROI 面板
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
              SLO 阈值体系（800ms 预警 / 1500ms 排空 / 3000ms 熔断）及按 <strong>{userMultiplier}x</strong>{' '}
              思考时间复用系数折算的单在线用户月成本与百万请求成本
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
            {([7, 10, 12] as Array<7 | 10 | 12>).map((price) => (
              <button
                key={`tier-${price}`}
                onClick={() => setSelectedTier(price)}
                style={{
                  background: selectedTier === price ? '#059669' : '#1e293b',
                  border: `1px solid ${selectedTier === price ? '#34d399' : '#334155'}`,
                  color: '#ffffff',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                ${price}/月 {price === 7 ? '(标准 IPv4)' : '(对照档)'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <svg
            viewBox={`0 0 ${w} ${h}`}
            style={{ width: '100%', minWidth: '1020px', height: 'auto', display: 'block', userSelect: 'none' }}
          >
            <rect x="16" y="16" width="745" height="585" rx="10" fill="#0b1120" stroke="#1e293b" />
            <rect x="795" y="16" width="749" height="585" rx="10" fill="#0b1120" stroke="#1e293b" />

            <text x="85" y="48" fontSize="14" fontWeight="700" fill="#f8fafc">
              A. P95 延迟阶梯对比与分级监控红线 (含当前 {model.vu} VU 动态柱)
            </text>
            <text x="875" y="48" fontSize="14" fontWeight="700" fill="#f8fafc">
              B. 单在线用户月成本 ($/User/mo @{userMultiplier}x) ROI 曲线
            </text>

            {/* Panel 1 Y grid & SLO threshold lines */}
            {[0, 800, 1500, 3000, 4000, 5000].map((ms) => {
              const y = py1(ms);
              const col =
                ms === 800 ? '#fbbf24' : ms === 1500 ? '#f97316' : ms === 3000 ? '#ef4444' : '#1e293b';
              const isSlo = ms === 800 || ms === 1500 || ms === 3000;
              return (
                <g key={`slo-${ms}`}>
                  <line
                    x1="85"
                    y1={y}
                    x2="710"
                    y2={y}
                    stroke={col}
                    strokeWidth={isSlo ? '1.6' : '1'}
                    strokeDasharray={isSlo ? '5 4' : undefined}
                  />
                  <text x="76" y={y + 4} textAnchor="end" fontSize="11" fill={isSlo ? col : '#94a3b8'}>
                    {ms}
                  </text>
                </g>
              );
            })}

            {/* Bars */}
            {bars.map((b, idx) => {
              const bw = 64;
              const bx = 104 + idx * 98;
              const by = py1(b.val);
              const bh = 510 - by;
              const isCurrent = idx === bars.length - 1;
              return (
                <g
                  key={`bar-${idx}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setTargetVu(b.vu)}
                >
                  <rect
                    x={bx}
                    y={by}
                    width={bw}
                    height={bh}
                    rx="6"
                    fill={b.col}
                    fillOpacity={isCurrent ? '0.95' : '0.82'}
                    stroke={isCurrent ? '#ffffff' : 'none'}
                    strokeWidth={isCurrent ? '2' : '0'}
                  />
                  <text
                    x={bx + bw / 2}
                    y={by - 8}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    fill={b.col}
                  >
                    {Math.round(b.val)} ms
                  </text>
                  <text x={bx + bw / 2} y="532" textAnchor="middle" fontSize="11" fontWeight="600" fill="#e2e8f0">
                    {b.label1}
                  </text>
                  <text x={bx + bw / 2} y="548" textAnchor="middle" fontSize="10" fill="#94a3b8">
                    {b.label2}
                  </text>
                </g>
              );
            })}

            <text x="705" y={py1(800) - 5} textAnchor="end" fontSize="11" fontWeight="700" fill="#fbbf24">
              P1 预警: 800 ms
            </text>
            <text x="705" y={py1(1500) - 5} textAnchor="end" fontSize="11" fontWeight="700" fill="#fb923c">
              P2 扩容排空: 1500 ms
            </text>
            <text x="705" y={py1(3000) - 5} textAnchor="end" fontSize="11" fontWeight="700" fill="#ef4444">
              P3 强制熔断: 3000 ms
            </text>

            {/* Sweet spot band on ROI chart */}
            <rect x={px2(120)} y="115" width={px2(160) - px2(120)} height="395" fill="rgba(52,211,153,0.12)" />
            <text
              x={(px2(120) + px2(160)) / 2}
              y="135"
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill="#34d399"
            >
              最佳 ROI 区间
            </text>
            <text x={(px2(120) + px2(160)) / 2} y="151" textAnchor="middle" fontSize="10" fill="#a7f3d0">
              120-160 VU
            </text>

            {/* Panel 2 grids */}
            {[0.0, 0.02, 0.04, 0.06, 0.08].map((usd) => {
              const y = py2User(usd);
              return (
                <g key={`usd-${usd}`}>
                  <line x1="875" y1={y} x2="1465" y2={y} stroke="#1e293b" />
                  <text x="866" y={y + 4} textAnchor="end" fontSize="11" fill="#94a3b8">
                    ${usd.toFixed(2)}
                  </text>
                </g>
              );
            })}
            {[40, 120, 160, 200, 300, 400, 500].map((v) => {
              const x = px2(v);
              return (
                <g key={`rvu-${v}`}>
                  <line x1={x} y1="115" x2={x} y2="510" stroke="#1e293b" strokeDasharray="3 4" />
                  <text x={x} y="534" textAnchor="middle" fontSize="11" fill="#94a3b8">
                    {v}
                  </text>
                </g>
              );
            })}

            {/* ROI curves */}
            <path d={l12} fill="none" stroke="#a78bfa" strokeWidth={selectedTier === 12 ? '3.4' : '2.2'} />
            <path d={l10} fill="none" stroke="#38bdf8" strokeWidth={selectedTier === 10 ? '3.4' : '2.2'} />
            <path d={l7} fill="none" stroke="#34d399" strokeWidth={selectedTier === 7 ? '3.4' : '2.2'} />

            {/* Live VU vertical cursor on ROI chart */}
            <line
              x1={px2(clampedVuForRoiAxis)}
              y1="115"
              x2={px2(clampedVuForRoiAxis)}
              y2="510"
              stroke="#f8fafc"
              strokeWidth="1.6"
            />
            <circle
              cx={px2(clampedVuForRoiAxis)}
              cy={py2User(model.roi.tiers[7].costPerUserUsd)}
              r="5.5"
              fill="#34d399"
              stroke="#ffffff"
              strokeWidth="1.8"
            />
            <circle
              cx={px2(clampedVuForRoiAxis)}
              cy={py2User(model.roi.tiers[10].costPerUserUsd)}
              r="5.5"
              fill="#38bdf8"
              stroke="#ffffff"
              strokeWidth="1.8"
            />
            <circle
              cx={px2(clampedVuForRoiAxis)}
              cy={py2User(model.roi.tiers[12].costPerUserUsd)}
              r="5.5"
              fill="#a78bfa"
              stroke="#ffffff"
              strokeWidth="1.8"
            />

            {/* Legend */}
            <rect x="1145" y="122" width="310" height="86" rx="8" fill="#0f172a" fillOpacity="0.92" stroke="#334155" />
            <line x1="1160" y1="144" x2="1188" y2="144" stroke="#34d399" strokeWidth="3" />
            <text x="1196" y="148" fontSize="11" fill="#e2e8f0">
              $7/月: ${model.roi.tiers[7].costPerUserUsd.toFixed(4)}/人 · ${model.roi.tiers[7].costPer1MReqUsd.toFixed(4)}/1M req
            </text>
            <line x1="1160" y1="166" x2="1188" y2="166" stroke="#38bdf8" strokeWidth="3" />
            <text x="1196" y="170" fontSize="11" fill="#e2e8f0">
              $10/月: ${model.roi.tiers[10].costPerUserUsd.toFixed(4)}/人 · ${model.roi.tiers[10].costPer1MReqUsd.toFixed(4)}/1M req
            </text>
            <line x1="1160" y1="188" x2="1188" y2="188" stroke="#a78bfa" strokeWidth="3" />
            <text x="1196" y="192" fontSize="11" fill="#e2e8f0">
              $12/月: ${model.roi.tiers[12].costPerUserUsd.toFixed(4)}/人 · ${model.roi.tiers[12].costPer1MReqUsd.toFixed(4)}/1M req
            </text>

            {/* Clickable overlay on ROI chart */}
            <rect
              x="875"
              y="115"
              width="590"
              height="395"
              fill="transparent"
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / Math.max(1, rect.width)));
                setTargetVu(Math.round((40 + ratio * 460) / 5) * 5);
              }}
            />

            <text x="395" y="576" textAnchor="middle" fontSize="12" fill="#94a3b8">
              点击任意柱状图或右侧曲线切换并发档位
            </text>
            <text x="1175" y="576" textAnchor="middle" fontSize="12" fill="#94a3b8">
              调度目标并发 (VUs，40 -&gt; 120 VU 单用户成本下降 ~3x)
            </text>
          </svg>
        </div>

        {/* Dynamic ROI Comparison Table */}
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '12px',
              background: '#0b1120',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <thead>
              <tr style={{ background: '#1e293b', color: '#cbd5e1', textAlign: 'left' }}>
                <th style={{ padding: '8px 10px' }}>运营并发水位 (点击切换)</th>
                <th style={{ padding: '8px 10px' }}>折算在线用户 (@{userMultiplier}x)</th>
                <th style={{ padding: '8px 10px' }}>稳态 QPS</th>
                <th style={{ padding: '8px 10px' }}>月吞吐量</th>
                <th style={{ padding: '8px 10px', color: '#34d399' }}>$7/月 ($/VU | $/用户 | $/1M req)</th>
                <th style={{ padding: '8px 10px', color: '#38bdf8' }}>$10/月 ($/VU | $/用户 | $/1M req)</th>
                <th style={{ padding: '8px 10px', color: '#a78bfa' }}>$12/月 ($/VU | $/用户 | $/1M req)</th>
                <th style={{ padding: '8px 10px' }}>预估 P95 / SLO 状态</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row) => {
                const rm = computeOperatingModel(row.vu, { userMultiplier, cleanTmpfs, vectorOptimized });
                const isSelected = Math.abs(model.vu - row.vu) < 8;
                return (
                  <tr
                    key={`tbl-${row.vu}`}
                    onClick={() => setTargetVu(row.vu)}
                    style={{
                      borderTop: '1px solid #1e293b',
                      background: isSelected ? 'rgba(56,189,248,0.12)' : 'transparent',
                      cursor: 'pointer',
                    }}
                  >
                    <td style={{ padding: '7px 10px', fontWeight: 700, color: isSelected ? '#38bdf8' : '#f8fafc' }}>
                      {isSelected ? '▶ ' : ''}
                      {row.tag}
                    </td>
                    <td style={{ padding: '7px 10px', fontFamily: 'monospace' }}>~{rm.onlineUsers} 人</td>
                    <td style={{ padding: '7px 10px', fontFamily: 'monospace' }}>{rm.steadyQps} req/s</td>
                    <td style={{ padding: '7px 10px', fontFamily: 'monospace' }}>{rm.roi.monthlyReqsM}M / 月</td>
                    <td style={{ padding: '7px 10px', fontFamily: 'monospace', color: '#a7f3d0' }}>
                      ${rm.roi.tiers[7].costPerVuUsd.toFixed(4)} | <strong>${rm.roi.tiers[7].costPerUserUsd.toFixed(4)}</strong> | $
                      {rm.roi.tiers[7].costPer1MReqUsd.toFixed(4)}
                    </td>
                    <td style={{ padding: '7px 10px', fontFamily: 'monospace', color: '#bae6fd' }}>
                      ${rm.roi.tiers[10].costPerVuUsd.toFixed(4)} | <strong>${rm.roi.tiers[10].costPerUserUsd.toFixed(4)}</strong> | $
                      {rm.roi.tiers[10].costPer1MReqUsd.toFixed(4)}
                    </td>
                    <td style={{ padding: '7px 10px', fontFamily: 'monospace', color: '#ddd6fe' }}>
                      ${rm.roi.tiers[12].costPerVuUsd.toFixed(4)} | <strong>${rm.roi.tiers[12].costPerUserUsd.toFixed(4)}</strong> | $
                      {rm.roi.tiers[12].costPer1MReqUsd.toFixed(4)}
                    </td>
                    <td style={{ padding: '7px 10px' }}>
                      <span
                        style={{
                          padding: '2px 7px',
                          borderRadius: '4px',
                          background: `${rm.sloColor}22`,
                          color: rm.sloColor,
                          fontWeight: 700,
                          fontSize: '11px',
                        }}
                      >
                        {rm.estimatedP95Ms} ms · {row.note}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ============================================================================
  // TOPOLOGY VIEW: Interactive XConnect 5-Service Core Topology SVG
  // ============================================================================
  const renderTopologySection = () => {
    const layerBtns: Array<{ id: TopologyLayer; label: string }> = [
      { id: 'all', label: '全部链路' },
      { id: 'control', label: '① 控制面链路' },
      { id: 'proxy', label: '② Proxy 数据链路' },
      { id: 'gateway', label: '③ Gateway 链路' },
      { id: 'obs', label: '④ 监控与计费链路' },
    ];

    return (
      <div
        style={{
          background: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: '12px',
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc' }}>
              ① XConnect 边缘节点五大核心服务动态链路拓扑 ({resolvedNodeName})
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
              物理内存 <code>{model.memory.totalRamMib} MiB</code> · 当前 {model.vu} VU 预计整机已用{' '}
              <strong style={{ color: model.sloColor }}>{model.memory.totalUsedMib} MiB</strong> · 可用{' '}
              <strong style={{ color: '#34d399' }}>{model.memory.availMib} MiB</strong> · 5 大核心服务总 RSS{' '}
              <strong style={{ color: '#38bdf8' }}>{model.memory.coreFiveTotalRssMib} MiB</strong> · 点击任意服务节点查看
              Playbook Role 与配置详情
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {layerBtns.map((b) => {
              const active = activeLayer === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => setActiveLayer(b.id)}
                  style={{
                    background: active ? '#2563eb' : '#1e293b',
                    border: `1px solid ${active ? '#60a5fa' : '#334155'}`,
                    color: '#ffffff',
                    borderRadius: '6px',
                    padding: '5px 10px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {b.label}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ overflowX: 'auto', background: '#0b1120', borderRadius: '10px', border: '1px solid #1e293b', padding: '10px' }}>
          <svg
            viewBox="0 0 1560 920"
            style={{ width: '100%', minWidth: '1080px', height: 'auto', display: 'block', userSelect: 'none' }}
          >
            <defs>
              <marker id="xc-arrow-cyan" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
              </marker>
              <marker id="xc-arrow-emerald" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#34d399" />
              </marker>
              <marker id="xc-arrow-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#fbbf24" />
              </marker>
              <marker id="xc-arrow-violet" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#a78bfa" />
              </marker>
              <marker id="xc-arrow-rose" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#fb7185" />
              </marker>
            </defs>

            {/* Background Zone Frames */}
            <rect x="20" y="20" width="270" height="880" rx="14" fill="rgba(148,163,184,0.06)" stroke="rgba(148,163,184,0.28)" strokeDasharray="6 4" />
            <text x="38" y="48" fontSize="13" fontWeight="700" fill="#cbd5e1">
              外部客户端 / 云端中心
            </text>

            <rect
              x="315"
              y="20"
              width="935"
              height="880"
              rx="16"
              fill="rgba(56,189,248,0.04)"
              stroke={model.sloColor}
              strokeWidth="1.8"
            />
            <text x="335" y="48" fontSize="14" fontWeight="700" fill="#38bdf8">
              边缘节点：{resolvedNodeName}（4 进程严格隔离 + Vector 汇聚 · 当前水位 {model.vu} VU / {model.onlineUsers} 在线用户 · {model.sloLabel}）
            </text>

            <rect x="1275" y="20" width="265" height="880" rx="14" fill="rgba(148,163,184,0.06)" stroke="rgba(148,163,184,0.28)" strokeDasharray="6 4" />
            <text x="1293" y="48" fontSize="13" fontWeight="700" fill="#cbd5e1">
              上游出站与中心存储
            </text>

            {/* Band Labels inside node */}
            <rect x="335" y="66" width="895" height="170" rx="12" fill="rgba(251,191,36,0.05)" stroke="rgba(251,191,36,0.28)" />
            <text x="352" y="88" fontSize="12" fontWeight="700" fill="#fbbf24">
              ① 控制面 (Control Plane)
            </text>

            <rect x="335" y="254" width="895" height="400" rx="12" fill="rgba(52,211,153,0.04)" stroke="rgba(52,211,153,0.25)" />
            <text x="352" y="276" fontSize="12" fontWeight="700" fill="#34d399">
              ② 数据面 (L7 Ingress + Proxy / Gateway 独立实例 · 实时吞吐 {model.steadyQps} req/s · P95 ~{model.estimatedP95Ms} ms)
            </text>

            <rect x="335" y="672" width="895" height="212" rx="12" fill="rgba(167,139,250,0.05)" stroke="rgba(167,139,250,0.28)" />
            <text x="352" y="694" fontSize="12" fontWeight="700" fill="#a78bfa">
              ③ 核心监控与计费汇聚面 (Observability &amp; Billing)
            </text>

            {/* EXTERNAL LEFT NODES */}
            <g opacity={isLayerVisible('control') ? 1 : 0.16}>
              <rect x="40" y="95" width="230" height="106" rx="10" fill="#0f172a" stroke="#fbbf24" strokeWidth="2" />
              <text x="56" y="122" fontSize="14" fontWeight="700" fill="#f8fafc">
                accounts.svc.plus
              </text>
              <text x="56" y="143" fontSize="12" fill="#cbd5e1">
                控制面 SaaS / 调度中心
              </text>
              <text x="56" y="164" fontSize="11" fontFamily="monospace" fill="#fbbf24">
                Users · Routing · Gateway Policy
              </text>
              <text x="56" y="182" fontSize="11" fontFamily="monospace" fill="#94a3b8">
                HTTPS / Sync 5m + SSE
              </text>
            </g>

            <g opacity={isLayerVisible('proxy') ? 1 : 0.16}>
              <rect x="40" y="295" width="230" height="104" rx="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
              <text x="56" y="322" fontSize="14" fontWeight="700" fill="#f8fafc">
                代理客户端 (XHTTP · {model.vu} VU)
              </text>
              <text x="56" y="343" fontSize="12" fill="#cbd5e1">
                VLESS + XHTTP + TLS (fp=chrome)
              </text>
              <text x="56" y="364" fontSize="11" fontFamily="monospace" fill="#38bdf8">
                {resolvedNodeName}:443
              </text>
              <text x="56" y="382" fontSize="11" fontFamily="monospace" fill="#94a3b8">
                path=/split · alpn=h2,http/1.1
              </text>
            </g>

            <g opacity={isLayerVisible('proxy') ? 1 : 0.16}>
              <rect x="40" y="425" width="230" height="92" rx="10" fill="#0f172a" stroke="#34d399" strokeWidth="2" />
              <text x="56" y="452" fontSize="14" fontWeight="700" fill="#f8fafc">
                代理客户端 (TCP Vision)
              </text>
              <text x="56" y="473" fontSize="12" fill="#cbd5e1">
                VLESS + TLS + xtls-rprx-vision
              </text>
              <text x="56" y="494" fontSize="11" fontFamily="monospace" fill="#34d399">
                {resolvedNodeName}:1443
              </text>
            </g>

            <g opacity={isLayerVisible('gateway') ? 1 : 0.16}>
              <rect x="40" y="545" width="230" height="98" rx="10" fill="#0f172a" stroke="#fb7185" strokeWidth="2" />
              <text x="56" y="572" fontSize="14" fontWeight="700" fill="#f8fafc">
                零信任 Gateway 客户端
              </text>
              <text x="56" y="593" fontSize="12" fill="#cbd5e1">
                XConnect Overlay Tunnel
              </text>
              <text x="56" y="614" fontSize="11" fontFamily="monospace" fill="#fb7185">
                jp-xconnect-gateway-02.svc.plus:443
              </text>
              <text x="56" y="631" fontSize="11" fontFamily="monospace" fill="#94a3b8">
                path=/xconnect
              </text>
            </g>

            <g opacity={isLayerVisible('obs') ? 1 : 0.16}>
              <rect x="40" y="715" width="230" height="118" rx="10" fill="#0f172a" stroke="#a78bfa" strokeWidth="1.5" />
              <text x="56" y="742" fontSize="14" fontWeight="700" fill="#f8fafc">
                GitOps + Playbooks
              </text>
              <text x="56" y="763" fontSize="12" fill="#cbd5e1">
                每日定时自我收敛 (ansible-pull)
              </text>
              <text x="56" y="784" fontSize="11" fontFamily="monospace" fill="#a78bfa">
                xconnect-regional-pools.yaml
              </text>
              <text x="56" y="802" fontSize="11" fontFamily="monospace" fill="#cbd5e1">
                sysctl / fluxgate / xray / journald
              </text>
              <text x="56" y="820" fontSize="11" fontFamily="monospace" fill="#94a3b8">
                已停非核心: fail2ban/unattended/auditd
              </text>
            </g>

            {/* CORE 1: xconnect-edge-agent */}
            <g
              opacity={isLayerVisible('control') ? 1 : 0.16}
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedServiceId('edge-agent')}
            >
              <rect
                x="480"
                y="102"
                width="540"
                height="118"
                rx="12"
                fill="#0f172a"
                stroke="#fbbf24"
                strokeWidth={selectedServiceId === 'edge-agent' ? '3.5' : '2.5'}
              />
              <text x="500" y="129" fontSize="15" fontWeight="700" fill="#f8fafc">
                1. xconnect-edge-agent.service
              </text>
              <rect x="885" y="110" width="120" height="22" rx="6" fill="rgba(251,191,36,0.18)" />
              <text x="945" y="125" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fbbf24">
                RSS {edgeAgentRss} MB
              </text>
              <text x="500" y="150" fontSize="12" fontFamily="monospace" fill="#cbd5e1">
                /usr/local/bin/agent-proxy -config /etc/agent/account-agent.yaml
              </text>
              <text x="500" y="171" fontSize="12" fill="#e2e8f0">
                • 01-agent-proxy.yaml -&gt; 单一目标 &quot;proxy&quot; (/usr/local/etc/xray/config.json · 14 clients)
              </text>
              <text x="500" y="190" fontSize="12" fill="#e2e8f0">
                • 02-xconnect-gateway.yaml -&gt; jp-xconnect-gateway-02 (net-jp-xconnect-02)
              </text>
              <text x="500" y="209" fontSize="11" fontFamily="monospace" fill="#fbbf24">
                Role: roles/vhosts/xconnect-edge-agent · SIGHUP 热重载
              </text>
            </g>

            {/* CORE 2: fluxgate */}
            <g
              opacity={isLayerVisible('proxy,gateway,obs') ? 1 : 0.16}
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedServiceId('fluxgate')}
            >
              <rect
                x="355"
                y="300"
                width="295"
                height="315"
                rx="12"
                fill="#0f172a"
                stroke="#38bdf8"
                strokeWidth={selectedServiceId === 'fluxgate' ? '3.5' : '2.5'}
              />
              <text x="373" y="328" fontSize="15" fontWeight="700" fill="#f8fafc">
                2. fluxgate.service
              </text>
              <rect x="520" y="309" width="116" height="22" rx="6" fill="rgba(56,189,248,0.18)" />
              <text x="578" y="324" textAnchor="middle" fontSize="11" fontWeight="700" fill="#38bdf8">
                RSS {fluxgateRss} MB
              </text>
              <text x="373" y="350" fontSize="12" fontFamily="monospace" fill="#cbd5e1">
                fluxgate v0.2.1 · L7 Ingress
              </text>
              <text x="373" y="372" fontSize="12" fontFamily="monospace" fill="#38bdf8">
                Listen :443 (TLS *.svc.plus)
              </text>
              <text x="373" y="391" fontSize="11" fontFamily="monospace" fill="#94a3b8">
                Metrics: 127.0.0.1:9102/metrics
              </text>

              <rect x="371" y="408" width="263" height="62" rx="8" fill="rgba(56,189,248,0.08)" stroke="rgba(56,189,248,0.35)" />
              <text x="382" y="427" fontSize="12" fontWeight="600" fill="#38bdf8">
                Route A: /split/* (Proxy XHTTP)
              </text>
              <text x="382" y="445" fontSize="11" fontFamily="monospace" fill="#cbd5e1">
                H2 Win 4MiB/16MiB · flush -1
              </text>
              <text x="382" y="461" fontSize="11" fontFamily="monospace" fill="#cbd5e1">
                -&gt; unix:///dev/shm/xray.sock
              </text>

              <rect x="371" y="482" width="263" height="58" rx="8" fill="rgba(251,113,133,0.08)" stroke="rgba(251,113,133,0.35)" />
              <text x="382" y="501" fontSize="12" fontWeight="600" fill="#fb7185">
                Route B: /xconnect/* (Gateway)
              </text>
              <text x="382" y="518" fontSize="11" fontFamily="monospace" fill="#cbd5e1">
                h2c · flush -1 · strip x_padding
              </text>
              <text x="382" y="534" fontSize="11" fontFamily="monospace" fill="#cbd5e1">
                -&gt; unix:///run/xconnect-gateway/xray.sock
              </text>

              <rect x="371" y="552" width="263" height="48" rx="8" fill="rgba(148,163,184,0.08)" stroke="rgba(148,163,184,0.3)" />
              <text x="382" y="571" fontSize="11" fontWeight="600" fill="#e2e8f0">
                Route C: /xray-exporter/*
              </text>
              <text x="382" y="588" fontSize="11" fontFamily="monospace" fill="#cbd5e1">
                -&gt; http://127.0.0.1:8080
              </text>
            </g>

            {/* CORE 3: xconnect-proxy-xray */}
            <g
              opacity={isLayerVisible('proxy,control,obs') ? 1 : 0.16}
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedServiceId('proxy-xray')}
            >
              <rect
                x="735"
                y="294"
                width="475"
                height="202"
                rx="12"
                fill="#0f172a"
                stroke="#34d399"
                strokeWidth={selectedServiceId === 'proxy-xray' ? '3.5' : '2.5'}
              />
              <text x="755" y="322" fontSize="15" fontWeight="700" fill="#f8fafc">
                3. xconnect-proxy-xray.service
              </text>
              <rect x="1080" y="303" width="116" height="22" rx="6" fill="rgba(52,211,153,0.18)" />
              <text x="1138" y="318" textAnchor="middle" fontSize="11" fontWeight="700" fill="#34d399">
                RSS {proxyXrayRss} MB
              </text>
              <text x="755" y="343" fontSize="12" fontFamily="monospace" fill="#cbd5e1">
                Xray-core + 内嵌 xray-exporter (Role: xconnect_proxy)
              </text>
              <text x="755" y="363" fontSize="11" fontFamily="monospace" fill="#94a3b8">
                Config: /usr/local/etc/xray/config.json (bufferSize=128, connIdle=3600)
              </text>

              <rect x="753" y="376" width="215" height="54" rx="8" fill="rgba(56,189,248,0.08)" stroke="rgba(56,189,248,0.35)" />
              <text x="763" y="395" fontSize="12" fontWeight="600" fill="#38bdf8">
                Inbound: proxy-xhttp-in
              </text>
              <text x="763" y="414" fontSize="11" fontFamily="monospace" fill="#cbd5e1">
                /dev/shm/xray.sock (0666)
              </text>

              <rect x="980" y="376" width="212" height="54" rx="8" fill="rgba(52,211,153,0.08)" stroke="rgba(52,211,153,0.35)" />
              <text x="990" y="395" fontSize="12" fontWeight="600" fill="#34d399">
                Inbound: proxy-tcp-in
              </text>
              <text x="990" y="414" fontSize="11" fontFamily="monospace" fill="#cbd5e1">
                0.0.0.0:1443 (TLS Vision)
              </text>

              <rect x="753" y="440" width="439" height="44" rx="8" fill="rgba(167,139,250,0.1)" stroke="rgba(167,139,250,0.4)" />
              <text x="765" y="458" fontSize="12" fontWeight="600" fill="#a78bfa">
                进程内内存 stats.Manager（零 gRPC 10086/10087）
              </text>
              <text x="765" y="475" fontSize="11" fontFamily="monospace" fill="#cbd5e1">
                Expose 127.0.0.1:8080/scrape · 1m Push Snapshot -&gt; 127.0.0.1:8686
              </text>
            </g>

            {/* CORE 4: xconnect-gateway-xray */}
            <g
              opacity={isLayerVisible('gateway,control') ? 1 : 0.16}
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedServiceId('gateway-xray')}
            >
              <rect
                x="735"
                y="514"
                width="475"
                height="122"
                rx="12"
                fill="#0f172a"
                stroke="#fb7185"
                strokeWidth={selectedServiceId === 'gateway-xray' ? '3.5' : '2.5'}
              />
              <text x="755" y="542" fontSize="15" fontWeight="700" fill="#f8fafc">
                4. xconnect-gateway-xray.service
              </text>
              <rect x="1080" y="523" width="116" height="22" rx="6" fill="rgba(251,113,133,0.18)" />
              <text x="1138" y="538" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fb7185">
                RSS {gatewayXrayRss} MB
              </text>
              <text x="755" y="563" fontSize="12" fontFamily="monospace" fill="#cbd5e1">
                独立裸 /usr/local/bin/xray 进程 (Role: xconnect_gateway)
              </text>
              <text x="755" y="583" fontSize="11" fontFamily="monospace" fill="#94a3b8">
                Config: /var/lib/xconnect-gateway/runtime/xray.json (配置完全独立)
              </text>
              <text x="755" y="603" fontSize="12" fontFamily="monospace" fill="#fb7185">
                Inbound: xconnect-vless-in (/run/xconnect-gateway/xray.sock)
              </text>
              <text x="755" y="622" fontSize="12" fontFamily="monospace" fill="#cbd5e1">
                Outbound: xconnect-wireguard -&gt; redirect 127.0.0.1:51820
              </text>
            </g>

            {/* CORE 5: vector */}
            <g
              opacity={isLayerVisible('obs') ? 1 : 0.16}
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedServiceId('vector')}
            >
              <rect
                x="440"
                y="712"
                width="485"
                height="154"
                rx="12"
                fill="#0f172a"
                stroke="#a78bfa"
                strokeWidth={selectedServiceId === 'vector' ? '3.5' : '2.5'}
              />
              <text x="460" y="740" fontSize="15" fontWeight="700" fill="#f8fafc">
                5. vector.service（核心监控与计费汇聚探针）
              </text>
              <rect x="785" y="721" width="126" height="22" rx="6" fill="rgba(167,139,250,0.18)" />
              <text x="848" y="736" textAnchor="middle" fontSize="11" fontWeight="700" fill="#a78bfa">
                RSS {vectorRss} MB {vectorOptimized ? '(-40%)' : ''}
              </text>
              <text x="460" y="762" fontSize="12" fontFamily="monospace" fill="#cbd5e1">
                /etc/vector/vector.toml · MemoryHigh=72M / MemoryMax=128M · thp:never
              </text>
              <text x="460" y="784" fontSize="12" fill="#e2e8f0">
                • Billing HTTP Server (:8686) -&gt; 256MiB Disk Buffer 异步推送计费
              </text>
              <text x="460" y="805" fontSize="12" fill="#e2e8f0">
                • 15s Prometheus Scrape: xray:8080 · fluxgate:9102 · node:9100 · proc:9256
              </text>
              <text x="460" y="826" fontSize="12" fill="#e2e8f0">
                • Single Journald Reader: 采集单元日志并提炼 xhttp_events_total 事件
              </text>
              <text x="460" y="847" fontSize="11" fontFamily="monospace" fill="#a78bfa">
                AnonHugePages: 0 kB · TOKIO_WORKER_THREADS=1 · narenas:1
              </text>
            </g>

            {/* Supporting Probes inside obs band */}
            <g opacity={isLayerVisible('obs') ? 1 : 0.16}>
              <rect x="960" y="712" width="250" height="154" rx="10" fill="#0f172a" stroke="rgba(167,139,250,0.45)" strokeWidth="1.5" />
              <text x="976" y="738" fontSize="13" fontWeight="700" fill="#f8fafc">
                基础支撑采集进程
              </text>
              <text x="976" y="762" fontSize="12" fontFamily="monospace" fill="#cbd5e1">
                • systemd-journald  {journaldRss} MB
              </text>
              <text x="976" y="781" fontSize="11" fontFamily="monospace" fill="#a78bfa">
                cap: 24M/48M · disk 64M/3d
              </text>
              <text x="976" y="803" fontSize="12" fontFamily="monospace" fill="#cbd5e1">
                • node_exporter     20.3 MB
              </text>
              <text x="976" y="822" fontSize="12" fontFamily="monospace" fill="#cbd5e1">
                • process-exporter  16.9 MB
              </text>
              <text x="976" y="841" fontSize="12" fontFamily="monospace" fill="#cbd5e1">
                • metrics-sup.py     7.0 MB
              </text>
            </g>

            {/* EXTERNAL RIGHT NODES */}
            <g opacity={isLayerVisible('proxy') ? 1 : 0.16}>
              <rect x="1295" y="295" width="225" height="186" rx="10" fill="#0f172a" stroke="#34d399" strokeWidth="2" />
              <text x="1312" y="322" fontSize="14" fontWeight="700" fill="#f8fafc">
                Proxy 策略路由出站
              </text>
              <text x="1312" y="346" fontSize="12" fontFamily="monospace" fill="#34d399">
                • pool-media-stream
              </text>
              <text x="1312" y="366" fontSize="12" fontFamily="monospace" fill="#34d399">
                • pool-pro-ai-dev
              </text>
              <text x="1312" y="386" fontSize="12" fontFamily="monospace" fill="#34d399">
                • pool-media-fallback
              </text>
              <text x="1312" y="408" fontSize="12" fontFamily="monospace" fill="#cbd5e1">
                • direct-cn (geosite/ip)
              </text>
              <text x="1312" y="428" fontSize="12" fontFamily="monospace" fill="#94a3b8">
                • blocked-private
              </text>
              <text x="1312" y="458" fontSize="11" fill="#94a3b8">
                DomainStrategy: IPIfNonMatch
              </text>
            </g>

            <g opacity={isLayerVisible('gateway') ? 1 : 0.16}>
              <rect x="1295" y="514" width="225" height="122" rx="10" fill="#0f172a" stroke="#fb7185" strokeWidth="2" />
              <text x="1312" y="542" fontSize="14" fontWeight="700" fill="#f8fafc">
                WireGuard Overlay
              </text>
              <text x="1312" y="566" fontSize="12" fontFamily="monospace" fill="#fb7185">
                interface: xconzero0
              </text>
              <text x="1312" y="586" fontSize="12" fontFamily="monospace" fill="#cbd5e1">
                UDP 127.0.0.1:51820
              </text>
              <text x="1312" y="608" fontSize="11" fontFamily="monospace" fill="#94a3b8">
                net-jp-xconnect-02
              </text>
            </g>

            <g opacity={isLayerVisible('obs') ? 1 : 0.16}>
              <rect x="1295" y="685" width="225" height="92" rx="10" fill="#0f172a" stroke="#a78bfa" strokeWidth="2" />
              <text x="1312" y="712" fontSize="14" fontWeight="700" fill="#f8fafc">
                billing.svc.plus
              </text>
              <text x="1312" y="734" fontSize="12" fontFamily="monospace" fill="#a78bfa">
                /v1/ingest/snapshots
              </text>
              <text x="1312" y="754" fontSize="11" fill="#cbd5e1">
                每分钟流量计费入库 (PG)
              </text>
            </g>

            <g opacity={isLayerVisible('obs') ? 1 : 0.16}>
              <rect x="1295" y="795" width="225" height="92" rx="10" fill="#0f172a" stroke="#a78bfa" strokeWidth="2" />
              <text x="1312" y="822" fontSize="14" fontWeight="700" fill="#f8fafc">
                observability.svc.plus
              </text>
              <text x="1312" y="844" fontSize="11" fontFamily="monospace" fill="#a78bfa">
                VictoriaMetrics + VictoriaLogs
              </text>
              <text x="1312" y="864" fontSize="11" fill="#cbd5e1">
                节点/进程/Xray/Fluxgate 全景监控
              </text>
            </g>

            {/* EDGES */}
            <g opacity={isLayerVisible('control') ? 1 : 0.12}>
              <path d="M 270 148 L 474 148" fill="none" stroke="#fbbf24" strokeWidth="2.5" markerEnd="url(#xc-arrow-amber)" />
              <text x="372" y="138" textAnchor="middle" fontSize="11" fontWeight="600" fill="#fbbf24">
                5m Sync / SSE
              </text>
              <path d="M 880 220 L 880 288" fill="none" stroke="#fbbf24" strokeWidth="2.3" strokeDasharray="6 3" markerEnd="url(#xc-arrow-amber)" />
              <text x="888" y="250" fontSize="11" fontWeight="600" fill="#fbbf24">
                写 config.json + SIGHUP 热加载
              </text>
              <path d="M 700 220 L 700 575 L 729 575" fill="none" stroke="#fbbf24" strokeWidth="2.3" strokeDasharray="6 3" markerEnd="url(#xc-arrow-amber)" />
              <text x="706" y="425" fontSize="11" fontWeight="600" fill="#fbbf24" transform="rotate(-90 706 425)">
                xconnect-gateway apply
              </text>
            </g>

            <g opacity={isLayerVisible('proxy') ? 1 : 0.12}>
              <path d="M 270 347 L 349 347" fill="none" stroke="#38bdf8" strokeWidth="2.8" markerEnd="url(#xc-arrow-cyan)" />
              <text x="308" y="337" textAnchor="middle" fontSize="11" fontWeight="600" fill="#38bdf8">
                :443 TLS
              </text>
              <path d="M 634 438 L 729 403" fill="none" stroke="#38bdf8" strokeWidth="2.8" markerEnd="url(#xc-arrow-cyan)" />
              <text x="684" y="403" textAnchor="middle" fontSize="11" fontWeight="600" fill="#38bdf8">
                UDS h2c ({model.steadyQps}/s)
              </text>
              <path
                d="M 270 471 C 320 471, 305 648, 675 648 C 710 648, 705 422, 974 422"
                fill="none"
                stroke="#34d399"
                strokeWidth="2.5"
                markerEnd="url(#xc-arrow-emerald)"
              />
              <text x="500" y="641" textAnchor="middle" fontSize="11" fontWeight="600" fill="#34d399">
                TCP :1443 直连 VLESS+TLS+Vision (绕过 Fluxgate)
              </text>
              <path d="M 1210 388 L 1289 388" fill="none" stroke="#34d399" strokeWidth="2.8" markerEnd="url(#xc-arrow-emerald)" />
            </g>

            <g opacity={isLayerVisible('gateway') ? 1 : 0.12}>
              <path d="M 270 594 L 349 514" fill="none" stroke="#fb7185" strokeWidth="2.6" markerEnd="url(#xc-arrow-rose)" />
              <path d="M 634 514 L 729 586" fill="none" stroke="#fb7185" strokeWidth="2.6" markerEnd="url(#xc-arrow-rose)" />
              <text x="682" y="564" textAnchor="middle" fontSize="11" fontWeight="600" fill="#fb7185">
                GW UDS
              </text>
              <path d="M 1210 575 L 1289 575" fill="none" stroke="#fb7185" strokeWidth="2.6" markerEnd="url(#xc-arrow-rose)" />
            </g>

            <g opacity={isLayerVisible('obs') ? 1 : 0.12}>
              <path d="M 880 484 L 880 706" fill="none" stroke="#a78bfa" strokeWidth="2.5" markerEnd="url(#xc-arrow-violet)" />
              <text x="888" y="660" fontSize="11" fontWeight="600" fill="#a78bfa">
                POST :8686 + Scrape :8080
              </text>
              <path d="M 505 615 L 505 706" fill="none" stroke="#a78bfa" strokeWidth="2" strokeDasharray="5 4" markerEnd="url(#xc-arrow-violet)" />
              <text x="512" y="662" fontSize="11" fill="#a78bfa">
                :9102/metrics
              </text>
              <path d="M 960 790 L 931 790" fill="none" stroke="#a78bfa" strokeWidth="2" strokeDasharray="5 4" markerEnd="url(#xc-arrow-violet)" />
              <path d="M 925 752 L 1289 731" fill="none" stroke="#a78bfa" strokeWidth="2.6" markerEnd="url(#xc-arrow-violet)" />
              <path d="M 925 832 L 1289 841" fill="none" stroke="#a78bfa" strokeWidth="2.6" markerEnd="url(#xc-arrow-violet)" />
            </g>
          </svg>
        </div>

        {/* Selected Service Interactive Inspection Drawer */}
        <div
          style={{
            background: '#0b1120',
            border: `1px solid ${selectedService.color}66`,
            borderRadius: '10px',
            padding: '10px 14px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          <div style={{ flex: '1 1 520px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: selectedService.color }}>
                {selectedService.title}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: '#1e293b',
                  color: '#f8fafc',
                }}
              >
                Playbook Role: {selectedService.role}
              </span>
            </div>
            <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#94a3b8', marginTop: '4px' }}>
              Binary: {selectedService.binary} | Listen/Socket: {selectedService.listen}
            </div>
            <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '12px', color: '#cbd5e1' }}>
              {selectedService.highlights.map((h, i) => (
                <div key={i}>• {h}</div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {Object.values(SERVICE_CATALOG).map((svc) => (
              <button
                key={svc.id}
                onClick={() => setSelectedServiceId(svc.id)}
                style={{
                  background: selectedServiceId === svc.id ? `${svc.color}26` : '#1e293b',
                  border: `1px solid ${selectedServiceId === svc.id ? svc.color : '#334155'}`,
                  color: selectedServiceId === svc.id ? svc.color : '#cbd5e1',
                  borderRadius: '6px',
                  padding: '4px 9px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {svc.id}
              </button>
            ))}
          </div>
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
        background: '#090d16',
        color: '#f8fafc',
        fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", Inter, sans-serif',
        padding: '14px 18px',
        boxSizing: 'border-box',
        overflowY: 'auto',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      {/* Top Interactive Control Header */}
      <div
        style={{
          background: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: '12px',
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '19px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.2px' }}>
                XConnect 边缘节点单体聚合拓扑与 2C1G Lightsail 动态 ROI 面板
              </span>
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 700,
                  background: liveTelemetry.hasLiveTelemetry ? 'rgba(34,197,94,0.18)' : 'rgba(56,189,248,0.18)',
                  border: `1px solid ${liveTelemetry.hasLiveTelemetry ? '#22c55e' : '#38bdf8'}`,
                  color: liveTelemetry.hasLiveTelemetry ? '#86efac' : '#7dd3fc',
                }}
              >
                {liveTelemetry.hasLiveTelemetry ? '● LIVE PROMETHEUS + ROI MODEL' : '● K6 1S BENCHMARK & ROI SIMULATOR'}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '3px' }}>
              金丝雀节点：<code style={{ color: '#38bdf8' }}>{resolvedNodeName}</code>（AWS Lightsail 2 vCPU /{' '}
              {model.memory.totalRamMib} MiB RAM / 0 Swap）· 拖动下方并发滑块或点击快捷档位，四大图表实时联动计算
            </div>
          </div>

          {/* View Mode Selector Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {(
              [
                { id: 'all', label: '全景四合一视图' },
                { id: 'topology', label: '① 核心服务拓扑' },
                { id: 'timeseries', label: '② 40 vs 500 VU 时序' },
                { id: 'knee_memory', label: '③ 拐点与内存缩放' },
                { id: 'slo_roi', label: '④ P95 SLO & Lightsail ROI' },
              ] as Array<{ id: ViewMode; label: string }>
            ).map((tab) => {
              const active = activeView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id)}
                  style={{
                    background: active ? '#2563eb' : '#1e293b',
                    border: `1px solid ${active ? '#60a5fa' : '#334155'}`,
                    color: '#ffffff',
                    borderRadius: '6px',
                    padding: '6px 11px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Parameter Controls Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            background: '#0b1120',
            border: '1px solid #1e293b',
            borderRadius: '8px',
            padding: '10px 14px',
          }}
        >
          {/* VU Slider & Presets */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#e2e8f0' }}>
              调度并发水位:{' '}
              <strong style={{ color: '#38bdf8', fontFamily: 'monospace', fontSize: '14px' }}>{targetVu} VU</strong>
            </span>
            <input
              type="range"
              min={10}
              max={500}
              step={5}
              value={targetVu}
              onChange={(e) => setTargetVu(Number(e.target.value))}
              style={{ width: '180px', accentColor: '#38bdf8', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
              {[
                { vu: 40, label: '40 VU 基线' },
                { vu: 120, label: '120 VU 最佳甜点' },
                { vu: 150, label: '150 VU 拐点前' },
                { vu: 200, label: '200 VU 排空线' },
                { vu: 500, label: '500 VU 极限' },
              ].map((p) => (
                <button
                  key={p.vu}
                  onClick={() => setTargetVu(p.vu)}
                  style={{
                    background: targetVu === p.vu ? 'rgba(56,189,248,0.22)' : '#1e293b',
                    border: `1px solid ${targetVu === p.vu ? '#38bdf8' : '#334155'}`,
                    color: targetVu === p.vu ? '#38bdf8' : '#cbd5e1',
                    borderRadius: '5px',
                    padding: '3px 8px',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Optimization & Economics Toggles */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setCleanTmpfs((v) => !v)}
              style={{
                background: cleanTmpfs ? 'rgba(52,211,153,0.18)' : '#1e293b',
                border: `1px solid ${cleanTmpfs ? '#34d399' : '#334155'}`,
                color: cleanTmpfs ? '#34d399' : '#94a3b8',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {cleanTmpfs ? '✓ 已清理 /tmp 75M (+120 VU)' : '○ 保留 /tmp 75M tmpfs'}
            </button>

            <button
              onClick={() => setVectorOptimized((v) => !v)}
              style={{
                background: vectorOptimized ? 'rgba(167,139,250,0.2)' : '#1e293b',
                border: `1px solid ${vectorOptimized ? '#a78bfa' : '#334155'}`,
                color: vectorOptimized ? '#c4b5fd' : '#94a3b8',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {vectorOptimized ? '✓ Vector THP 瘦身 (71.5 MiB)' : '○ Vector 优化前 (124.1 MiB)'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#94a3b8' }}>
              <span>用户复用:</span>
              {[3, 4, 5].map((mult) => (
                <button
                  key={mult}
                  onClick={() => setUserMultiplier(mult)}
                  style={{
                    background: userMultiplier === mult ? '#2563eb' : '#1e293b',
                    border: `1px solid ${userMultiplier === mult ? '#60a5fa' : '#334155'}`,
                    color: '#ffffff',
                    borderRadius: '4px',
                    padding: '2px 7px',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {mult}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 6 Real-Time Dynamic KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(215px, 1fr))', gap: '10px' }}>
          <div style={{ background: '#0b1120', border: '1px solid #1e293b', borderRadius: '8px', padding: '10px 12px' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>当前并发 / 折算在线用户</div>
            <div style={{ fontSize: '19px', fontWeight: 800, color: '#38bdf8', marginTop: '3px', fontFamily: 'monospace' }}>
              {model.vu} VU <span style={{ fontSize: '14px', color: '#cbd5e1' }}>≈ {model.onlineUsers} 人</span>
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
              按 {model.userMultiplier}x 思考时间复用 · 边际效率 {model.marginalEfficiency} QPS/VU
            </div>
          </div>

          <div style={{ background: '#0b1120', border: '1px solid #1e293b', borderRadius: '8px', padding: '10px 12px' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>稳态吞吐 QPS / 月处理能力</div>
            <div style={{ fontSize: '19px', fontWeight: 800, color: '#34d399', marginTop: '3px', fontFamily: 'monospace' }}>
              {liveTelemetry.liveQps ?? model.steadyQps} req/s{' '}
              <span style={{ fontSize: '13px', color: '#cbd5e1' }}>({model.roi.monthlyReqsM}M/月)</span>
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
              爬坡期瞬时 QPS: {model.rampQps} req/s · 2TB 流量包消耗 ~{model.roi.trafficQuotaPct2Tb}%
            </div>
          </div>

          <div
            style={{
              background: '#0b1120',
              border: `1px solid ${model.sloColor}66`,
              borderRadius: '8px',
              padding: '10px 12px',
            }}
          >
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>预估 P95 延迟 / SLO 门禁状态</div>
            <div
              style={{
                fontSize: '19px',
                fontWeight: 800,
                color: model.sloColor,
                marginTop: '3px',
                fontFamily: 'monospace',
              }}
            >
              {liveTelemetry.liveP95Ms ?? model.estimatedP95Ms} ms{' '}
              <span style={{ fontSize: '12px' }}>({model.sloLevel})</span>
            </div>
            <div style={{ fontSize: '11px', color: model.sloColor, marginTop: '2px' }}>{model.sloAction}</div>
          </div>

          <div style={{ background: '#0b1120', border: '1px solid #1e293b', borderRadius: '8px', padding: '10px 12px' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>整机内存占用 / OOM 安全容量</div>
            <div style={{ fontSize: '19px', fontWeight: 800, color: '#f8fafc', marginTop: '3px', fontFamily: 'monospace' }}>
              {liveTelemetry.memUsedMib ?? model.memory.totalUsedMib} MiB{' '}
              <span style={{ fontSize: '13px', color: model.memory.ramPct >= 80 ? '#ef4444' : '#34d399' }}>
                ({model.memory.ramPct}%)
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
              可用 {liveTelemetry.memAvailMib ?? model.memory.availMib} MiB · 75%安全线 {model.memory.maxSafeVu75} VU
            </div>
          </div>

          <div style={{ background: '#0b1120', border: '1px solid #1e293b', borderRadius: '8px', padding: '10px 12px' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>
              Lightsail 2C1G (${selectedTier}/月) 单位 ROI
            </div>
            <div style={{ fontSize: '19px', fontWeight: 800, color: '#34d399', marginTop: '3px', fontFamily: 'monospace' }}>
              ${activeTierCost.costPerUserUsd.toFixed(4)}/人/月
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
              ${activeTierCost.costPerVuUsd.toFixed(4)}/VU/月 · ${activeTierCost.costPer1MReqUsd.toFixed(4)} / 1M req
            </div>
          </div>

          <div style={{ background: '#0b1120', border: '1px solid #1e293b', borderRadius: '8px', padding: '10px 12px' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>5 大核心服务总 RSS</div>
            <div style={{ fontSize: '19px', fontWeight: 800, color: '#a78bfa', marginTop: '3px', fontFamily: 'monospace' }}>
              {model.memory.coreFiveTotalRssMib} MiB
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
              Fluxgate {fluxgateRss}M + Proxy {proxyXrayRss}M + Vector {vectorRss}M
            </div>
          </div>
        </div>
      </div>

      {/* Main Dynamic Views */}
      {(activeView === 'all' || activeView === 'topology') && renderTopologySection()}
      {(activeView === 'all' || activeView === 'timeseries') && renderTimeseriesChart()}
      {(activeView === 'all' || activeView === 'knee_memory') && renderKneeAndMemoryChart()}
      {(activeView === 'all' || activeView === 'slo_roi') && renderSloAndRoiChart()}
    </div>
  );
};
