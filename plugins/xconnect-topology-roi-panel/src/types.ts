export type ViewMode = 'all' | 'topology' | 'timeseries' | 'knee_memory' | 'slo_roi';
export type TopologyLayer = 'all' | 'control' | 'proxy' | 'gateway' | 'obs';
export type SloLevel = 'PASS' | 'P1_WARN' | 'P2_DRAIN' | 'P3_CIRCUIT_BREAK';

export interface PanelOptions {
  viewMode: ViewMode;
  defaultLayer: TopologyLayer;
  defaultTargetVu: number;
  defaultUserMultiplier: number;
  cleanTmpfs: boolean;
  vectorOptimized: boolean;
  defaultTierPrice: 7 | 10 | 12;
  nodeHostname: string;
  totalRamMib: number;
  followLiveVu: boolean;
}

export interface K6TimeseriesPoint {
  minute: number;
  avgVu: number;
  qps: number;
  impliedLatencyMs: number;
}

export interface K6RampCheckpoint {
  targetVu: number;
  avgVu: number;
  qps: number;
  marginalQpsPerVu: number;
  impliedLatencyMs: number;
}

export interface TierCostBreakdown {
  tierPriceUsd: 7 | 10 | 12;
  costPerVuUsd: number;
  costPerUserUsd: number;
  costPer1MReqUsd: number;
}

export interface DynamicOperatingModel {
  vu: number;
  onlineUsers: number;
  userMultiplier: number;
  rampQps: number;
  steadyQps: number;
  marginalEfficiency: number;
  impliedAvgLatencyMs: number;
  estimatedP95Ms: number;
  sloLevel: SloLevel;
  sloLabel: string;
  sloAction: string;
  sloColor: string;
  memory: {
    totalRamMib: number;
    fluxgateRssMib: number;
    proxyXrayRssMib: number;
    proxyCombinedMib: number;
    gatewayXrayRssMib: number;
    edgeAgentRssMib: number;
    vectorRssMib: number;
    journaldRssMib: number;
    supportingProbesMib: number;
    coreFiveTotalRssMib: number;
    nonProxyFixedMib: number;
    totalUsedMib: number;
    totalUsedWithTmpMib: number;
    totalUsedCleanTmpMib: number;
    availMib: number;
    ramPct: number;
    maxSafeVu75: number;
    maxSafeVu80: number;
    cleanTmpfs: boolean;
    vectorOptimized: boolean;
  };
  roi: {
    monthlyReqsM: number;
    estimatedBandwidthMbps: number;
    monthlyTrafficTb: number;
    trafficQuotaPct2Tb: number;
    tiers: Record<7 | 10 | 12, TierCostBreakdown>;
  };
}

export interface LivePrometheusSnapshot {
  hasLiveTelemetry: boolean;
  instance?: string;
  activeVusOrConns?: number;
  liveQps?: number;
  liveP95Ms?: number;
  memTotalMib?: number;
  memAvailMib?: number;
  memUsedMib?: number;
  processRssMib: {
    fluxgate?: number;
    proxyXray?: number;
    gatewayXray?: number;
    edgeAgent?: number;
    vector?: number;
    journald?: number;
  };
  xrayUp?: number;
}
