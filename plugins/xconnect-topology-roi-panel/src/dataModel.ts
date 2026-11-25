import {
  DynamicOperatingModel,
  K6RampCheckpoint,
  K6TimeseriesPoint,
  LivePrometheusSnapshot,
  SloLevel,
  TierCostBreakdown,
} from './types';

// 121 points (0.0m to 30.0m at 15s = 0.25m resolution) from real 1s-sampled k6-30m.log (40 VU)
const RAW_S40: Array<[number, number, number, number]> = [
  [0.0, 1.2, 1.08, 107.1], [0.25, 2.4, 2.0, 183.3], [0.5, 3.6, 3.2, 135.4], [0.75, 4.9, 4.33, 138.5],
  [1.0, 6.3, 5.53, 138.6], [1.25, 7.6, 6.4, 182.3], [1.5, 8.8, 7.53, 168.1], [1.75, 10.2, 8.93, 145.5],
  [2.0, 11.5, 10.47, 98.7], [2.25, 12.7, 10.93, 161.6], [2.5, 14.1, 12.07, 165.7], [2.75, 15.4, 13.13, 170.1],
  [3.0, 16.6, 14.87, 118.8], [3.25, 17.9, 15.8, 135.0], [3.5, 19.3, 16.87, 144.3], [3.75, 20.6, 17.93, 146.8],
  [4.0, 21.8, 19.6, 112.2], [4.25, 23.2, 20.2, 150.2], [4.5, 24.5, 21.6, 134.3], [4.75, 25.7, 22.6, 137.2],
  [5.0, 27.1, 23.2, 166.7], [5.25, 28.4, 25.13, 128.6], [5.5, 29.6, 26.07, 136.8], [5.75, 30.9, 26.93, 148.5],
  [6.0, 32.3, 28.0, 153.6], [6.25, 33.6, 29.2, 149.5], [6.5, 34.8, 30.8, 129.9], [6.75, 36.2, 31.47, 151.5],
  [7.0, 37.5, 33.2, 129.5], [7.25, 38.7, 34.8, 112.1], [7.5, 39.9, 34.87, 144.4], [7.75, 40.0, 35.93, 113.2],
  [8.0, 40.0, 35.33, 132.1], [8.25, 40.0, 35.53, 125.7], [8.5, 40.0, 35.47, 127.8], [8.75, 40.0, 36.07, 109.1],
  [9.0, 40.0, 35.8, 117.3], [9.25, 40.0, 35.73, 119.4], [9.5, 40.0, 35.8, 117.3], [9.75, 40.0, 36.0, 111.1],
  [10.0, 40.0, 35.6, 123.6], [10.25, 40.0, 35.73, 119.4], [10.5, 40.0, 35.87, 115.2], [10.75, 40.0, 35.87, 115.2],
  [11.0, 40.0, 35.8, 117.3], [11.25, 40.0, 33.93, 178.8], [11.5, 40.0, 35.13, 138.5], [11.75, 40.0, 35.8, 117.3],
  [12.0, 40.0, 35.6, 123.6], [12.25, 40.0, 36.0, 111.1], [12.5, 40.0, 35.4, 129.9], [12.75, 40.0, 35.47, 127.8],
  [13.0, 40.0, 36.4, 98.9], [13.25, 40.0, 35.2, 136.4], [13.5, 40.0, 36.73, 88.9], [13.75, 40.0, 35.13, 138.5],
  [14.0, 40.0, 36.07, 109.1], [14.25, 40.0, 35.07, 140.7], [14.5, 40.0, 33.4, 197.6], [14.75, 40.0, 34.67, 153.8],
  [15.0, 40.0, 33.6, 190.5], [15.25, 40.0, 35.07, 140.7], [15.5, 40.0, 35.33, 132.1], [15.75, 40.0, 35.33, 132.1],
  [16.0, 40.0, 35.07, 140.7], [16.25, 40.0, 35.33, 132.1], [16.5, 40.0, 34.73, 151.6], [16.75, 40.0, 36.27, 102.9],
  [17.0, 40.0, 35.53, 125.7], [17.25, 40.0, 35.73, 119.4], [17.5, 40.0, 35.67, 121.5], [17.75, 40.0, 35.4, 129.9],
  [18.0, 40.0, 35.87, 115.2], [18.25, 40.0, 35.4, 129.9], [18.5, 40.0, 34.67, 153.8], [18.75, 40.0, 35.53, 125.7],
  [19.0, 40.0, 35.53, 125.7], [19.25, 40.0, 35.6, 123.6], [19.5, 40.0, 35.4, 129.9], [19.75, 40.0, 35.2, 136.4],
  [20.0, 40.0, 35.53, 125.7], [20.25, 40.0, 35.2, 136.4], [20.5, 40.0, 35.4, 129.9], [20.75, 40.0, 35.47, 127.8],
  [21.0, 40.0, 35.13, 138.5], [21.25, 40.0, 32.27, 239.7], [21.5, 40.0, 34.8, 149.4], [21.75, 40.0, 35.13, 138.5],
  [22.0, 40.0, 34.6, 156.1], [22.25, 40.0, 34.27, 167.3], [22.5, 39.9, 34.93, 142.2], [22.75, 38.6, 33.87, 138.8],
  [23.0, 37.4, 33.07, 130.0], [23.25, 35.9, 31.67, 134.7], [23.5, 34.6, 30.67, 129.3], [23.75, 33.4, 29.53, 129.8],
  [24.0, 31.9, 28.07, 137.8], [24.25, 30.6, 27.2, 126.2], [24.5, 29.4, 26.2, 120.9], [24.75, 27.9, 24.47, 141.7],
  [25.0, 26.6, 24.0, 106.9], [25.25, 25.3, 22.53, 122.8], [25.5, 24.0, 21.33, 125.0], [25.75, 22.6, 20.2, 117.2],
  [26.0, 21.4, 19.13, 116.7], [26.25, 20.0, 18.07, 107.0], [26.5, 18.6, 16.47, 127.5], [26.75, 17.4, 15.4, 127.7],
  [27.0, 16.0, 14.6, 95.9], [27.25, 14.6, 12.87, 132.1], [27.5, 13.4, 11.87, 126.4], [27.75, 11.9, 10.87, 98.2],
  [28.0, 10.6, 9.2, 148.6], [28.25, 9.3, 8.53, 89.8], [28.5, 7.9, 7.07, 122.6], [28.75, 6.6, 6.0, 105.6],
  [29.0, 5.4, 4.8, 118.1], [29.25, 3.9, 3.6, 92.6], [29.5, 2.6, 2.33, 128.6], [29.75, 1.4, 1.2, 138.9],
  [30.0, 0.8, 1.25, 0.0],
];

// 121 points from real 1s-sampled k6-500vu-30m.log (500 VU)
const RAW_S500: Array<[number, number, number, number]> = [
  [0.0, 8.8, 6.0, 474.4], [0.25, 24.3, 17.13, 418.3], [0.5, 40.9, 29.4, 392.3], [0.75, 57.6, 28.87, 994.2],
  [1.0, 74.2, 48.53, 528.2], [1.25, 90.9, 58.6, 550.6], [1.5, 107.4, 62.2, 727.2], [1.75, 124.1, 66.87, 855.4],
  [2.0, 140.8, 75.6, 862.9], [2.25, 157.3, 87.2, 803.9], [2.5, 174.0, 94.6, 839.3], [2.75, 190.7, 83.87, 1273.8],
  [3.0, 207.2, 80.13, 1585.3], [3.25, 223.9, 97.67, 1292.8], [3.5, 240.6, 101.53, 1369.3], [3.75, 257.1, 84.93, 2027.5],
  [4.0, 273.8, 105.13, 1604.6], [4.25, 290.4, 94.53, 2072.3], [4.5, 307.1, 100.93, 2042.3], [4.75, 323.7, 84.2, 2844.4],
  [5.0, 340.3, 106.67, 2190.3], [5.25, 357.0, 95.47, 2739.5], [5.5, 373.6, 96.73, 2862.5], [5.75, 390.2, 98.27, 2970.5],
  [6.0, 406.9, 96.33, 3224.2], [6.25, 423.5, 93.67, 3521.4], [6.5, 440.1, 94.93, 3635.5], [6.75, 456.8, 84.0, 4438.5],
  [7.0, 473.4, 86.53, 4470.3], [7.25, 490.0, 99.53, 3923.0], [7.5, 499.9, 88.93, 4620.7], [7.75, 500.0, 95.33, 4244.8],
  [8.0, 500.0, 86.13, 4805.0], [8.25, 500.0, 89.33, 4597.0], [8.5, 500.0, 101.8, 3911.6], [8.75, 500.0, 86.53, 4778.1],
  [9.0, 500.0, 103.8, 3817.0], [9.25, 500.0, 92.93, 4380.2], [9.5, 500.0, 88.2, 4668.9], [9.75, 500.0, 33.2, 14060.2],
  [10.0, 500.0, 53.67, 8316.8], [10.25, 500.0, 76.93, 5499.1], [10.5, 500.0, 70.4, 6102.3], [10.75, 500.0, 138.2, 2617.9],
  [11.0, 500.0, 121.07, 3130.0], [11.25, 500.0, 121.73, 3107.3], [11.5, 500.0, 132.6, 2770.7], [11.75, 500.0, 160.47, 2115.9],
  [12.0, 500.0, 159.07, 2143.3], [12.25, 500.0, 161.53, 2095.3], [12.5, 500.0, 152.27, 2283.7], [12.75, 500.0, 156.67, 2191.5],
  [13.0, 500.0, 170.47, 1933.1], [13.25, 500.0, 173.2, 1886.8], [13.5, 500.0, 183.8, 1720.3], [13.75, 500.0, 168.27, 1971.5],
  [14.0, 500.0, 181.73, 1751.3], [14.25, 500.0, 206.0, 1427.2], [14.5, 500.0, 202.2, 1472.8], [14.75, 500.0, 205.8, 1429.5],
  [15.0, 500.0, 197.47, 1532.1], [15.25, 500.0, 210.53, 1374.9], [15.5, 500.0, 216.93, 1304.9], [15.75, 500.0, 218.13, 1292.2],
  [16.0, 500.0, 207.6, 1408.5], [16.25, 500.0, 201.13, 1485.9], [16.5, 500.0, 218.27, 1290.8], [16.75, 500.0, 214.47, 1331.4],
  [17.0, 500.0, 204.73, 1442.2], [17.25, 500.0, 209.73, 1384.0], [17.5, 500.0, 218.07, 1292.9], [17.75, 500.0, 212.4, 1354.0],
  [18.0, 500.0, 202.07, 1474.4], [18.25, 500.0, 189.33, 1640.8], [18.5, 500.0, 218.6, 1287.3], [18.75, 500.0, 217.2, 1302.0],
  [19.0, 500.0, 206.27, 1424.0], [19.25, 500.0, 201.47, 1481.8], [19.5, 500.0, 213.0, 1347.4], [19.75, 500.0, 218.4, 1289.4],
  [20.0, 500.0, 216.87, 1305.6], [20.25, 500.0, 208.27, 1400.8], [20.5, 500.0, 194.13, 1575.5], [20.75, 500.0, 220.33, 1269.3],
  [21.0, 500.0, 188.13, 1657.7], [21.25, 500.0, 172.8, 1893.5], [21.5, 500.0, 197.33, 1533.8], [21.75, 500.0, 182.33, 1742.2],
  [22.0, 500.0, 202.8, 1465.5], [22.25, 500.0, 206.8, 1417.8], [22.5, 494.2, 213.67, 1312.9], [22.75, 478.2, 210.27, 1274.1],
  [23.0, 461.8, 194.13, 1378.6], [23.25, 444.8, 194.0, 1292.8], [23.5, 427.9, 195.93, 1183.7], [23.75, 411.2, 200.87, 1047.0],
  [24.0, 394.7, 178.73, 1208.1], [24.25, 378.0, 198.6, 903.2], [24.5, 361.1, 196.47, 838.0], [24.75, 344.5, 195.13, 765.5],
  [25.0, 328.0, 180.8, 814.0], [25.25, 311.0, 180.27, 725.4], [25.5, 294.2, 173.73, 693.2], [25.75, 277.5, 175.27, 583.5],
  [26.0, 260.9, 172.53, 512.4], [26.25, 244.0, 172.73, 412.6], [26.5, 227.5, 156.4, 454.6], [26.75, 210.9, 140.93, 496.2],
  [27.0, 194.1, 137.53, 411.1], [27.25, 177.2, 126.13, 404.6], [27.5, 160.6, 118.67, 353.7], [27.75, 144.1, 107.67, 338.1],
  [28.0, 127.3, 104.2, 221.4], [28.25, 110.5, 90.6, 219.6], [28.5, 94.1, 79.33, 185.7], [28.75, 77.4, 56.67, 365.9],
  [29.0, 60.5, 49.93, 211.6], [29.25, 44.0, 37.2, 181.9], [29.5, 27.3, 23.6, 155.4], [29.75, 10.6, 8.8, 200.8],
  [30.0, 1.2, 1.0, 250.0],
];

// 13 ramp checkpoints from real 1s-sampled k6-500vu-30m.log
const RAW_RAMP: Array<[number, number, number, number, number]> = [
  [40, 39.8, 29.67, 0.7457, 341.1],
  [80, 79.7, 53.43, 0.6701, 492.4],
  [100, 99.6, 59.24, 0.5945, 682.1],
  [120, 119.6, 65.71, 0.5493, 820.7],
  [150, 149.6, 86.62, 0.579, 727.0],
  [180, 179.5, 93.81, 0.5225, 914.0],
  [200, 199.5, 84.67, 0.4244, 1356.3],
  [250, 249.5, 96.24, 0.3858, 1592.0],
  [300, 299.4, 97.95, 0.3272, 2056.1],
  [350, 349.3, 100.52, 0.2878, 2474.4],
  [400, 399.1, 96.24, 0.2411, 3147.5],
  [450, 450.1, 92.0, 0.2044, 3892.9],
  [500, 497.6, 93.05, 0.187, 4347.7],
];

export const K6_SERIES_40VU: K6TimeseriesPoint[] = RAW_S40.map(([minute, avgVu, qps, impliedLatencyMs]) => ({
  minute,
  avgVu,
  qps,
  impliedLatencyMs,
}));

export const K6_SERIES_500VU: K6TimeseriesPoint[] = RAW_S500.map(([minute, avgVu, qps, impliedLatencyMs]) => ({
  minute,
  avgVu,
  qps,
  impliedLatencyMs,
}));

export const K6_RAMP_CHECKPOINTS: K6RampCheckpoint[] = RAW_RAMP.map(
  ([targetVu, avgVu, qps, marginalQpsPerVu, impliedLatencyMs]) => ({
    targetVu,
    avgVu,
    qps,
    marginalQpsPerVu,
    impliedLatencyMs,
  })
);

// Steady-state QPS anchor curve across operating VUs (calibrated to 40 VU = 35.34, 120 VU = 80.0, 160 VU = 100.0, 200 VU = 110.0, 500 VU = 138.9 avg / 206.2 peak)
const STEADY_QPS_ANCHORS: Array<[number, number]> = [
  [10, 9.2],
  [40, 35.34],
  [80, 58.0],
  [100, 69.0],
  [120, 80.0],
  [150, 95.0],
  [160, 100.0],
  [200, 110.0],
  [300, 122.0],
  [400, 131.0],
  [500, 138.9],
];

// Calibrated P95 latency anchors (ms) from report Section 5
const P95_LATENCY_ANCHORS: Array<[number, number]> = [
  [10, 145.0],
  [40, 207.1],
  [80, 440.0],
  [100, 560.0],
  [120, 680.0],
  [150, 950.0],
  [160, 1120.0],
  [200, 1800.0],
  [300, 2750.0],
  [400, 3680.0],
  [500, 4591.6],
];

export function lerpPiecewise(x: number, anchors: Array<[number, number]>): number {
  if (anchors.length === 0) {
    return 0;
  }
  if (x <= anchors[0][0]) {
    const [x0, y0] = anchors[0];
    if (x <= 0 || x0 <= 0) {
      return y0;
    }
    return (x / x0) * y0;
  }
  for (let i = 1; i < anchors.length; i++) {
    const [x0, y0] = anchors[i - 1];
    const [x1, y1] = anchors[i];
    if (x <= x1) {
      const t = (x - x0) / Math.max(1e-6, x1 - x0);
      return y0 + t * (y1 - y0);
    }
  }
  return anchors[anchors.length - 1][1];
}

export function evaluateSlo(p95Ms: number, ramPct: number, vu: number): {
  level: SloLevel;
  label: string;
  action: string;
  color: string;
} {
  if (p95Ms > 3000 || ramPct >= 87 || vu >= 280) {
    return {
      level: 'P3_CIRCUIT_BREAK',
      label: 'P3 强制熔断隔离 (>3000ms / RAM>87%)',
      action: '强制从节点池摘除，防止 0-Swap OOM',
      color: '#ef4444',
    };
  }
  if (p95Ms > 1500 || ramPct >= 80 || vu >= 200) {
    return {
      level: 'P2_DRAIN',
      label: 'P2 排空扩容 (>1500ms / VU>=200 / RAM>80%)',
      action: '调度器排空新连接至同区其他节点',
      color: '#f97316',
    };
  }
  if (p95Ms > 800 || ramPct >= 75 || vu >= 160) {
    return {
      level: 'P1_WARN',
      label: 'P1 临界预警 (>800ms / VU>=160 / RAM>75%)',
      action: '下调节点调度权重 / 预热备用节点',
      color: '#fbbf24',
    };
  }
  return {
    level: 'PASS',
    label: vu >= 100 && vu <= 150 ? 'SLO PASS · 最佳 ROI 甜蜜区' : 'SLO PASS · 正常调度区',
    action: '正常流量调度 (最佳甜点 100–150 VU)',
    color: '#34d399',
  };
}

export function computeOperatingModel(
  rawVu: number,
  options?: {
    userMultiplier?: number;
    cleanTmpfs?: boolean;
    vectorOptimized?: boolean;
    totalRamMib?: number;
  }
): DynamicOperatingModel {
  const vu = Math.max(1, Math.min(500, Math.round(rawVu || 120)));
  const userMultiplier = options?.userMultiplier && options.userMultiplier > 0 ? options.userMultiplier : 4;
  const cleanTmpfs = options?.cleanTmpfs ?? true;
  const vectorOptimized = options?.vectorOptimized ?? true;
  const totalRamMib = options?.totalRamMib && options.totalRamMib > 100 ? options.totalRamMib : 939;

  const rampAnchors: Array<[number, number]> = K6_RAMP_CHECKPOINTS.map((p) => [p.targetVu, p.qps]);
  const rampQps = Number(lerpPiecewise(vu, rampAnchors).toFixed(2));
  const steadyQps = Number(lerpPiecewise(vu, STEADY_QPS_ANCHORS).toFixed(2));
  const marginalEfficiency = Number((rampQps / vu).toFixed(4));
  const impliedAvgLatencyMs = Number(Math.max(50, (vu / Math.max(0.1, rampQps) - 1) * 1000).toFixed(1));
  const estimatedP95Ms = Number(lerpPiecewise(vu, P95_LATENCY_ANCHORS).toFixed(1));

  // Memory model calibrated to jp-xconnect-02.svc.plus empirical measurements:
  // Proxy slope: 88.1 MiB at 0 VU -> 381.7 MiB at 500 VU (0.5872 MiB/VU)
  // Fluxgate: 28.1 MiB -> 199.1 MiB (0.342 MiB/VU)
  // xconnect-proxy-xray: 59.4 MiB -> 182.6 MiB (0.2452 MiB/VU)
  const fluxgateRssMib = Number((28.1 + 0.342 * vu).toFixed(1));
  const proxyXrayRssMib = Number((59.4 + 0.2452 * vu).toFixed(1));
  const proxyCombinedMib = Number((88.1 + 0.5872 * vu).toFixed(1));
  const gatewayXrayRssMib = 36.8;
  const edgeAgentRssMib = 24.1;
  const vectorRssMib = vectorOptimized ? 71.5 : 124.1;
  const journaldRssMib = 16.0;
  const supportingProbesMib = Number((20.3 + 16.9 + 7.0).toFixed(1)); // node_exporter + process-exporter + metrics-sup.py = 44.2
  const coreFiveTotalRssMib = Number(
    (edgeAgentRssMib + fluxgateRssMib + proxyXrayRssMib + gatewayXrayRssMib + vectorRssMib).toFixed(1)
  );

  // Non-proxy fixed baseline on jp-xconnect-02:
  // Vector optimized + with /tmp 75M tmpfs = 451.7 MiB; without /tmp 75M = 376.7 MiB
  // If Vector unoptimized (+52.6 MiB), shift accordingly.
  const vectorDelta = vectorOptimized ? 0 : 52.6;
  const fixedWithTmp = 451.7 + vectorDelta;
  const fixedCleanTmp = 376.7 + vectorDelta;
  const nonProxyFixedMib = Number((cleanTmpfs ? fixedCleanTmp : fixedWithTmp).toFixed(1));

  const totalUsedWithTmpMib = Number((fixedWithTmp + proxyCombinedMib).toFixed(1));
  const totalUsedCleanTmpMib = Number((fixedCleanTmp + proxyCombinedMib).toFixed(1));
  const totalUsedMib = cleanTmpfs ? totalUsedCleanTmpMib : totalUsedWithTmpMib;
  const availMib = Number(Math.max(0, totalRamMib - totalUsedMib).toFixed(1));
  const ramPct = Number(((totalUsedMib / totalRamMib) * 100).toFixed(1));

  const cap75Mib = totalRamMib * 0.75; // 704.25 MiB
  const cap80Mib = totalRamMib * 0.80; // 751.20 MiB
  const maxSafeVu75 = Math.max(0, Math.floor((cap75Mib - nonProxyFixedMib - 88.1) / 0.5872));
  const maxSafeVu80 = Math.max(0, Math.floor((cap80Mib - nonProxyFixedMib - 88.1) / 0.5872));

  const slo = evaluateSlo(estimatedP95Ms, ramPct, vu);

  // ROI economics (30d = 2,592,000s)
  const onlineUsers = Math.round(vu * userMultiplier);
  const monthlyReqsM = Number(((steadyQps * 2592000) / 1e6).toFixed(1));
  // Avg bytes per request in k6 test was ~680 B for generate_204; for real proxy traffic (~12 KB/req avg mix)
  const estimatedBandwidthMbps = Number(((steadyQps * 12 * 1024 * 8) / 1e6).toFixed(2));
  const monthlyTrafficTb = Number(((estimatedBandwidthMbps * 2592000) / 8 / 1e6).toFixed(2));
  const trafficQuotaPct2Tb = Number(((monthlyTrafficTb / 2.0) * 100).toFixed(1));

  const round4 = (n: number) => Math.round((n + Number.EPSILON) * 10000) / 10000;
  const buildTier = (price: 7 | 10 | 12): TierCostBreakdown => ({
    tierPriceUsd: price,
    costPerVuUsd: round4(price / vu),
    costPerUserUsd: round4(price / Math.max(1, onlineUsers)),
    costPer1MReqUsd: round4(price / Math.max(0.1, monthlyReqsM)),
  });

  return {
    vu,
    onlineUsers,
    userMultiplier,
    rampQps,
    steadyQps,
    marginalEfficiency,
    impliedAvgLatencyMs,
    estimatedP95Ms,
    sloLevel: slo.level,
    sloLabel: slo.label,
    sloAction: slo.action,
    sloColor: slo.color,
    memory: {
      totalRamMib,
      fluxgateRssMib,
      proxyXrayRssMib,
      proxyCombinedMib,
      gatewayXrayRssMib,
      edgeAgentRssMib,
      vectorRssMib,
      journaldRssMib,
      supportingProbesMib,
      coreFiveTotalRssMib,
      nonProxyFixedMib,
      totalUsedMib,
      totalUsedWithTmpMib,
      totalUsedCleanTmpMib,
      availMib,
      ramPct,
      maxSafeVu75,
      maxSafeVu80,
      cleanTmpfs,
      vectorOptimized,
    },
    roi: {
      monthlyReqsM,
      estimatedBandwidthMbps,
      monthlyTrafficTb,
      trafficQuotaPct2Tb,
      tiers: {
        7: buildTier(7),
        10: buildTier(10),
        12: buildTier(12),
      },
    },
  };
}

/**
 * Generates a synthetic 30-minute (121-point) timeseries curve for any target VU (10..500)
 * by blending the empirical 40 VU and 500 VU 1s-sampled profiles.
 */
export function simulateTimeseriesForVu(targetVu: number): K6TimeseriesPoint[] {
  const vu = Math.max(10, Math.min(500, targetVu));
  const tBlend = Math.max(0, Math.min(1, (vu - 40) / 460));
  const modelAtTarget = computeOperatingModel(vu);

  return K6_SERIES_40VU.map((p40, idx) => {
    const p500 = K6_SERIES_500VU[idx] || p40;
    const ratioVu = p40.avgVu / 40.0;
    const simVu = Number((vu * ratioVu).toFixed(1));
    // Blend normalized QPS profile between 40 VU (smooth linear) and 500 VU (hysteresis + pool reset at 10m)
    const norm40 = p40.qps / 35.34;
    const norm500 = p500.qps / 206.24;
    const blendedNorm = (1 - tBlend) * norm40 + tBlend * norm500;
    const peakSteady = vu <= 150 ? modelAtTarget.steadyQps : modelAtTarget.steadyQps * (1 + 0.45 * tBlend);
    const simQps = Number(Math.max(0.5, blendedNorm * peakSteady).toFixed(2));
    const simLat = Number(Math.max(50, ((simVu / Math.max(0.5, simQps)) - 1) * 1000).toFixed(1));
    return {
      minute: p40.minute,
      avgVu: simVu,
      qps: simQps,
      impliedLatencyMs: simLat,
    };
  });
}

/**
 * Parses optional live Prometheus / VictoriaMetrics frames from Grafana `data.series`.
 * Never throws; returns `hasLiveTelemetry: false` when no matching series exist.
 */
export function parsePrometheusTelemetry(series: any[] | undefined): LivePrometheusSnapshot {
  const snapshot: LivePrometheusSnapshot = {
    hasLiveTelemetry: false,
    processRssMib: {},
  };
  if (!Array.isArray(series) || series.length === 0) {
    return snapshot;
  }

  const lastValue = (field: any): number | null => {
    if (!field || !field.values) {
      return null;
    }
    const vals = field.values;
    const len = typeof vals.length === 'number' ? vals.length : typeof vals.size === 'number' ? vals.size : 0;
    if (len <= 0) {
      return null;
    }
    for (let i = len - 1; i >= 0; i--) {
      const v = typeof vals.get === 'function' ? vals.get(i) : vals[i];
      const num = Number(v);
      if (v != null && !Number.isNaN(num)) {
        return num;
      }
    }
    return null;
  };

  for (const frame of series) {
    if (!frame || !Array.isArray(frame.fields)) {
      continue;
    }
    const numField = frame.fields.find((f: any) => f.type === 'number' || f.name === 'Value');
    if (!numField) {
      continue;
    }
    const val = lastValue(numField);
    if (val === null) {
      continue;
    }
    const labels: Record<string, string> = frame.labels || numField.labels || {};
    const metricName = String(labels.__name__ || frame.name || numField.name || '').toLowerCase();
    const refId = String(frame.refId || '');

    if (labels.instance && !snapshot.instance) {
      snapshot.instance = labels.instance;
    }

    if (metricName.includes('fluxgate_active_connections') || metricName.includes('k6_vus') || refId === 'VU') {
      snapshot.activeVusOrConns = Math.round(val);
      snapshot.hasLiveTelemetry = true;
    } else if (metricName.includes('k6_http_reqs') || metricName.includes('fluxgate_http_requests') || refId === 'QPS') {
      snapshot.liveQps = Number(val.toFixed(2));
      snapshot.hasLiveTelemetry = true;
    } else if (metricName.includes('duration_p95') || refId === 'P95') {
      snapshot.liveP95Ms = Number((val < 30 ? val * 1000 : val).toFixed(1));
      snapshot.hasLiveTelemetry = true;
    } else if (metricName.includes('node_memory_memtotal_bytes') || refId === 'MEM_TOTAL') {
      snapshot.memTotalMib = Number((val / (1024 * 1024)).toFixed(1));
      snapshot.hasLiveTelemetry = true;
    } else if (metricName.includes('node_memory_memavailable_bytes') || refId === 'MEM_AVAIL') {
      snapshot.memAvailMib = Number((val / (1024 * 1024)).toFixed(1));
      snapshot.hasLiveTelemetry = true;
    } else if (metricName.includes('namedprocess_namegroup_memory_bytes') || refId === 'PROC_RSS') {
      const grp = String(labels.groupname || '').toLowerCase();
      const mib = Number((val / (1024 * 1024)).toFixed(1));
      if (grp.includes('fluxgate')) {
        snapshot.processRssMib.fluxgate = mib;
      } else if (grp.includes('gateway')) {
        snapshot.processRssMib.gatewayXray = mib;
      } else if (grp.includes('xray')) {
        snapshot.processRssMib.proxyXray = mib;
      } else if (grp.includes('edge-agent') || grp.includes('agent-proxy')) {
        snapshot.processRssMib.edgeAgent = mib;
      } else if (grp.includes('vector')) {
        snapshot.processRssMib.vector = mib;
      } else if (grp.includes('journal')) {
        snapshot.processRssMib.journald = mib;
      }
      snapshot.hasLiveTelemetry = true;
    } else if (metricName.includes('xray_up') || refId === 'XRAY_UP') {
      snapshot.xrayUp = val;
      snapshot.hasLiveTelemetry = true;
    }
  }

  if (snapshot.memTotalMib != null && snapshot.memAvailMib != null) {
    snapshot.memUsedMib = Number(Math.max(0, snapshot.memTotalMib - snapshot.memAvailMib).toFixed(1));
  }

  return snapshot;
}
