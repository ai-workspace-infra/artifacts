define(["exports", "react", "react-dom", "@grafana/data", "@grafana/ui", "@grafana/runtime"], function (_exports, _react, _reactDom, _grafanaData, _grafanaUi, _grafanaRuntime) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: true });

  var module = { exports: _exports };
  function require(name) {
    if (name === "react") return _react;
    if (name === "react-dom") return _reactDom;
    if (name === "@grafana/data") return _grafanaData;
    if (name === "@grafana/ui") return _grafanaUi;
    if (name === "@grafana/runtime") return _grafanaRuntime;
    throw new Error("Cannot find module " + name);
  }

  var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/module.ts
var module_exports = {};
__export(module_exports, {
  plugin: () => plugin
});
module.exports = __toCommonJS(module_exports);
var import_data = require("@grafana/data");

// src/XConnectTopologyRoiPanel.tsx
var import_react = __toESM(require("react"));

// src/dataModel.ts
var RAW_S40 = [
  [0, 1.2, 1.08, 107.1],
  [0.25, 2.4, 2, 183.3],
  [0.5, 3.6, 3.2, 135.4],
  [0.75, 4.9, 4.33, 138.5],
  [1, 6.3, 5.53, 138.6],
  [1.25, 7.6, 6.4, 182.3],
  [1.5, 8.8, 7.53, 168.1],
  [1.75, 10.2, 8.93, 145.5],
  [2, 11.5, 10.47, 98.7],
  [2.25, 12.7, 10.93, 161.6],
  [2.5, 14.1, 12.07, 165.7],
  [2.75, 15.4, 13.13, 170.1],
  [3, 16.6, 14.87, 118.8],
  [3.25, 17.9, 15.8, 135],
  [3.5, 19.3, 16.87, 144.3],
  [3.75, 20.6, 17.93, 146.8],
  [4, 21.8, 19.6, 112.2],
  [4.25, 23.2, 20.2, 150.2],
  [4.5, 24.5, 21.6, 134.3],
  [4.75, 25.7, 22.6, 137.2],
  [5, 27.1, 23.2, 166.7],
  [5.25, 28.4, 25.13, 128.6],
  [5.5, 29.6, 26.07, 136.8],
  [5.75, 30.9, 26.93, 148.5],
  [6, 32.3, 28, 153.6],
  [6.25, 33.6, 29.2, 149.5],
  [6.5, 34.8, 30.8, 129.9],
  [6.75, 36.2, 31.47, 151.5],
  [7, 37.5, 33.2, 129.5],
  [7.25, 38.7, 34.8, 112.1],
  [7.5, 39.9, 34.87, 144.4],
  [7.75, 40, 35.93, 113.2],
  [8, 40, 35.33, 132.1],
  [8.25, 40, 35.53, 125.7],
  [8.5, 40, 35.47, 127.8],
  [8.75, 40, 36.07, 109.1],
  [9, 40, 35.8, 117.3],
  [9.25, 40, 35.73, 119.4],
  [9.5, 40, 35.8, 117.3],
  [9.75, 40, 36, 111.1],
  [10, 40, 35.6, 123.6],
  [10.25, 40, 35.73, 119.4],
  [10.5, 40, 35.87, 115.2],
  [10.75, 40, 35.87, 115.2],
  [11, 40, 35.8, 117.3],
  [11.25, 40, 33.93, 178.8],
  [11.5, 40, 35.13, 138.5],
  [11.75, 40, 35.8, 117.3],
  [12, 40, 35.6, 123.6],
  [12.25, 40, 36, 111.1],
  [12.5, 40, 35.4, 129.9],
  [12.75, 40, 35.47, 127.8],
  [13, 40, 36.4, 98.9],
  [13.25, 40, 35.2, 136.4],
  [13.5, 40, 36.73, 88.9],
  [13.75, 40, 35.13, 138.5],
  [14, 40, 36.07, 109.1],
  [14.25, 40, 35.07, 140.7],
  [14.5, 40, 33.4, 197.6],
  [14.75, 40, 34.67, 153.8],
  [15, 40, 33.6, 190.5],
  [15.25, 40, 35.07, 140.7],
  [15.5, 40, 35.33, 132.1],
  [15.75, 40, 35.33, 132.1],
  [16, 40, 35.07, 140.7],
  [16.25, 40, 35.33, 132.1],
  [16.5, 40, 34.73, 151.6],
  [16.75, 40, 36.27, 102.9],
  [17, 40, 35.53, 125.7],
  [17.25, 40, 35.73, 119.4],
  [17.5, 40, 35.67, 121.5],
  [17.75, 40, 35.4, 129.9],
  [18, 40, 35.87, 115.2],
  [18.25, 40, 35.4, 129.9],
  [18.5, 40, 34.67, 153.8],
  [18.75, 40, 35.53, 125.7],
  [19, 40, 35.53, 125.7],
  [19.25, 40, 35.6, 123.6],
  [19.5, 40, 35.4, 129.9],
  [19.75, 40, 35.2, 136.4],
  [20, 40, 35.53, 125.7],
  [20.25, 40, 35.2, 136.4],
  [20.5, 40, 35.4, 129.9],
  [20.75, 40, 35.47, 127.8],
  [21, 40, 35.13, 138.5],
  [21.25, 40, 32.27, 239.7],
  [21.5, 40, 34.8, 149.4],
  [21.75, 40, 35.13, 138.5],
  [22, 40, 34.6, 156.1],
  [22.25, 40, 34.27, 167.3],
  [22.5, 39.9, 34.93, 142.2],
  [22.75, 38.6, 33.87, 138.8],
  [23, 37.4, 33.07, 130],
  [23.25, 35.9, 31.67, 134.7],
  [23.5, 34.6, 30.67, 129.3],
  [23.75, 33.4, 29.53, 129.8],
  [24, 31.9, 28.07, 137.8],
  [24.25, 30.6, 27.2, 126.2],
  [24.5, 29.4, 26.2, 120.9],
  [24.75, 27.9, 24.47, 141.7],
  [25, 26.6, 24, 106.9],
  [25.25, 25.3, 22.53, 122.8],
  [25.5, 24, 21.33, 125],
  [25.75, 22.6, 20.2, 117.2],
  [26, 21.4, 19.13, 116.7],
  [26.25, 20, 18.07, 107],
  [26.5, 18.6, 16.47, 127.5],
  [26.75, 17.4, 15.4, 127.7],
  [27, 16, 14.6, 95.9],
  [27.25, 14.6, 12.87, 132.1],
  [27.5, 13.4, 11.87, 126.4],
  [27.75, 11.9, 10.87, 98.2],
  [28, 10.6, 9.2, 148.6],
  [28.25, 9.3, 8.53, 89.8],
  [28.5, 7.9, 7.07, 122.6],
  [28.75, 6.6, 6, 105.6],
  [29, 5.4, 4.8, 118.1],
  [29.25, 3.9, 3.6, 92.6],
  [29.5, 2.6, 2.33, 128.6],
  [29.75, 1.4, 1.2, 138.9],
  [30, 0.8, 1.25, 0]
];
var RAW_S500 = [
  [0, 8.8, 6, 474.4],
  [0.25, 24.3, 17.13, 418.3],
  [0.5, 40.9, 29.4, 392.3],
  [0.75, 57.6, 28.87, 994.2],
  [1, 74.2, 48.53, 528.2],
  [1.25, 90.9, 58.6, 550.6],
  [1.5, 107.4, 62.2, 727.2],
  [1.75, 124.1, 66.87, 855.4],
  [2, 140.8, 75.6, 862.9],
  [2.25, 157.3, 87.2, 803.9],
  [2.5, 174, 94.6, 839.3],
  [2.75, 190.7, 83.87, 1273.8],
  [3, 207.2, 80.13, 1585.3],
  [3.25, 223.9, 97.67, 1292.8],
  [3.5, 240.6, 101.53, 1369.3],
  [3.75, 257.1, 84.93, 2027.5],
  [4, 273.8, 105.13, 1604.6],
  [4.25, 290.4, 94.53, 2072.3],
  [4.5, 307.1, 100.93, 2042.3],
  [4.75, 323.7, 84.2, 2844.4],
  [5, 340.3, 106.67, 2190.3],
  [5.25, 357, 95.47, 2739.5],
  [5.5, 373.6, 96.73, 2862.5],
  [5.75, 390.2, 98.27, 2970.5],
  [6, 406.9, 96.33, 3224.2],
  [6.25, 423.5, 93.67, 3521.4],
  [6.5, 440.1, 94.93, 3635.5],
  [6.75, 456.8, 84, 4438.5],
  [7, 473.4, 86.53, 4470.3],
  [7.25, 490, 99.53, 3923],
  [7.5, 499.9, 88.93, 4620.7],
  [7.75, 500, 95.33, 4244.8],
  [8, 500, 86.13, 4805],
  [8.25, 500, 89.33, 4597],
  [8.5, 500, 101.8, 3911.6],
  [8.75, 500, 86.53, 4778.1],
  [9, 500, 103.8, 3817],
  [9.25, 500, 92.93, 4380.2],
  [9.5, 500, 88.2, 4668.9],
  [9.75, 500, 33.2, 14060.2],
  [10, 500, 53.67, 8316.8],
  [10.25, 500, 76.93, 5499.1],
  [10.5, 500, 70.4, 6102.3],
  [10.75, 500, 138.2, 2617.9],
  [11, 500, 121.07, 3130],
  [11.25, 500, 121.73, 3107.3],
  [11.5, 500, 132.6, 2770.7],
  [11.75, 500, 160.47, 2115.9],
  [12, 500, 159.07, 2143.3],
  [12.25, 500, 161.53, 2095.3],
  [12.5, 500, 152.27, 2283.7],
  [12.75, 500, 156.67, 2191.5],
  [13, 500, 170.47, 1933.1],
  [13.25, 500, 173.2, 1886.8],
  [13.5, 500, 183.8, 1720.3],
  [13.75, 500, 168.27, 1971.5],
  [14, 500, 181.73, 1751.3],
  [14.25, 500, 206, 1427.2],
  [14.5, 500, 202.2, 1472.8],
  [14.75, 500, 205.8, 1429.5],
  [15, 500, 197.47, 1532.1],
  [15.25, 500, 210.53, 1374.9],
  [15.5, 500, 216.93, 1304.9],
  [15.75, 500, 218.13, 1292.2],
  [16, 500, 207.6, 1408.5],
  [16.25, 500, 201.13, 1485.9],
  [16.5, 500, 218.27, 1290.8],
  [16.75, 500, 214.47, 1331.4],
  [17, 500, 204.73, 1442.2],
  [17.25, 500, 209.73, 1384],
  [17.5, 500, 218.07, 1292.9],
  [17.75, 500, 212.4, 1354],
  [18, 500, 202.07, 1474.4],
  [18.25, 500, 189.33, 1640.8],
  [18.5, 500, 218.6, 1287.3],
  [18.75, 500, 217.2, 1302],
  [19, 500, 206.27, 1424],
  [19.25, 500, 201.47, 1481.8],
  [19.5, 500, 213, 1347.4],
  [19.75, 500, 218.4, 1289.4],
  [20, 500, 216.87, 1305.6],
  [20.25, 500, 208.27, 1400.8],
  [20.5, 500, 194.13, 1575.5],
  [20.75, 500, 220.33, 1269.3],
  [21, 500, 188.13, 1657.7],
  [21.25, 500, 172.8, 1893.5],
  [21.5, 500, 197.33, 1533.8],
  [21.75, 500, 182.33, 1742.2],
  [22, 500, 202.8, 1465.5],
  [22.25, 500, 206.8, 1417.8],
  [22.5, 494.2, 213.67, 1312.9],
  [22.75, 478.2, 210.27, 1274.1],
  [23, 461.8, 194.13, 1378.6],
  [23.25, 444.8, 194, 1292.8],
  [23.5, 427.9, 195.93, 1183.7],
  [23.75, 411.2, 200.87, 1047],
  [24, 394.7, 178.73, 1208.1],
  [24.25, 378, 198.6, 903.2],
  [24.5, 361.1, 196.47, 838],
  [24.75, 344.5, 195.13, 765.5],
  [25, 328, 180.8, 814],
  [25.25, 311, 180.27, 725.4],
  [25.5, 294.2, 173.73, 693.2],
  [25.75, 277.5, 175.27, 583.5],
  [26, 260.9, 172.53, 512.4],
  [26.25, 244, 172.73, 412.6],
  [26.5, 227.5, 156.4, 454.6],
  [26.75, 210.9, 140.93, 496.2],
  [27, 194.1, 137.53, 411.1],
  [27.25, 177.2, 126.13, 404.6],
  [27.5, 160.6, 118.67, 353.7],
  [27.75, 144.1, 107.67, 338.1],
  [28, 127.3, 104.2, 221.4],
  [28.25, 110.5, 90.6, 219.6],
  [28.5, 94.1, 79.33, 185.7],
  [28.75, 77.4, 56.67, 365.9],
  [29, 60.5, 49.93, 211.6],
  [29.25, 44, 37.2, 181.9],
  [29.5, 27.3, 23.6, 155.4],
  [29.75, 10.6, 8.8, 200.8],
  [30, 1.2, 1, 250]
];
var RAW_RAMP = [
  [40, 39.8, 29.67, 0.7457, 341.1],
  [80, 79.7, 53.43, 0.6701, 492.4],
  [100, 99.6, 59.24, 0.5945, 682.1],
  [120, 119.6, 65.71, 0.5493, 820.7],
  [150, 149.6, 86.62, 0.579, 727],
  [180, 179.5, 93.81, 0.5225, 914],
  [200, 199.5, 84.67, 0.4244, 1356.3],
  [250, 249.5, 96.24, 0.3858, 1592],
  [300, 299.4, 97.95, 0.3272, 2056.1],
  [350, 349.3, 100.52, 0.2878, 2474.4],
  [400, 399.1, 96.24, 0.2411, 3147.5],
  [450, 450.1, 92, 0.2044, 3892.9],
  [500, 497.6, 93.05, 0.187, 4347.7]
];
var K6_SERIES_40VU = RAW_S40.map(([minute, avgVu, qps, impliedLatencyMs]) => ({
  minute,
  avgVu,
  qps,
  impliedLatencyMs
}));
var K6_SERIES_500VU = RAW_S500.map(([minute, avgVu, qps, impliedLatencyMs]) => ({
  minute,
  avgVu,
  qps,
  impliedLatencyMs
}));
var K6_RAMP_CHECKPOINTS = RAW_RAMP.map(
  ([targetVu, avgVu, qps, marginalQpsPerVu, impliedLatencyMs]) => ({
    targetVu,
    avgVu,
    qps,
    marginalQpsPerVu,
    impliedLatencyMs
  })
);
var STEADY_QPS_ANCHORS = [
  [10, 9.2],
  [40, 35.34],
  [80, 58],
  [100, 69],
  [120, 80],
  [150, 95],
  [160, 100],
  [200, 110],
  [300, 122],
  [400, 131],
  [500, 138.9]
];
var P95_LATENCY_ANCHORS = [
  [10, 145],
  [40, 207.1],
  [80, 440],
  [100, 560],
  [120, 680],
  [150, 950],
  [160, 1120],
  [200, 1800],
  [300, 2750],
  [400, 3680],
  [500, 4591.6]
];
function lerpPiecewise(x, anchors) {
  if (anchors.length === 0) {
    return 0;
  }
  if (x <= anchors[0][0]) {
    const [x0, y0] = anchors[0];
    if (x <= 0 || x0 <= 0) {
      return y0;
    }
    return x / x0 * y0;
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
function evaluateSlo(p95Ms, ramPct, vu) {
  if (p95Ms > 3e3 || ramPct >= 87 || vu >= 280) {
    return {
      level: "P3_CIRCUIT_BREAK",
      label: "P3 \u5F3A\u5236\u7194\u65AD\u9694\u79BB (>3000ms / RAM>87%)",
      action: "\u5F3A\u5236\u4ECE\u8282\u70B9\u6C60\u6458\u9664\uFF0C\u9632\u6B62 0-Swap OOM",
      color: "#ef4444"
    };
  }
  if (p95Ms > 1500 || ramPct >= 80 || vu >= 200) {
    return {
      level: "P2_DRAIN",
      label: "P2 \u6392\u7A7A\u6269\u5BB9 (>1500ms / VU>=200 / RAM>80%)",
      action: "\u8C03\u5EA6\u5668\u6392\u7A7A\u65B0\u8FDE\u63A5\u81F3\u540C\u533A\u5176\u4ED6\u8282\u70B9",
      color: "#f97316"
    };
  }
  if (p95Ms > 800 || ramPct >= 75 || vu >= 160) {
    return {
      level: "P1_WARN",
      label: "P1 \u4E34\u754C\u9884\u8B66 (>800ms / VU>=160 / RAM>75%)",
      action: "\u4E0B\u8C03\u8282\u70B9\u8C03\u5EA6\u6743\u91CD / \u9884\u70ED\u5907\u7528\u8282\u70B9",
      color: "#fbbf24"
    };
  }
  return {
    level: "PASS",
    label: vu >= 100 && vu <= 150 ? "SLO PASS \xB7 \u6700\u4F73 ROI \u751C\u871C\u533A" : "SLO PASS \xB7 \u6B63\u5E38\u8C03\u5EA6\u533A",
    action: "\u6B63\u5E38\u6D41\u91CF\u8C03\u5EA6 (\u6700\u4F73\u751C\u70B9 100\u2013150 VU)",
    color: "#34d399"
  };
}
function computeOperatingModel(rawVu, options) {
  const vu = Math.max(1, Math.min(500, Math.round(rawVu || 120)));
  const userMultiplier = options?.userMultiplier && options.userMultiplier > 0 ? options.userMultiplier : 4;
  const cleanTmpfs = options?.cleanTmpfs ?? true;
  const vectorOptimized = options?.vectorOptimized ?? true;
  const totalRamMib = options?.totalRamMib && options.totalRamMib > 100 ? options.totalRamMib : 939;
  const gbPerUserMonth = options?.gbPerUserMonth != null && options.gbPerUserMonth > 0 ? Number(options.gbPerUserMonth) : 10;
  const trafficBillingMode = options?.trafficBillingMode || "pooled";
  const rampAnchors = K6_RAMP_CHECKPOINTS.map((p) => [p.targetVu, p.qps]);
  const rampQps = Number(lerpPiecewise(vu, rampAnchors).toFixed(2));
  const steadyQps = Number(lerpPiecewise(vu, STEADY_QPS_ANCHORS).toFixed(2));
  const marginalEfficiency = Number((rampQps / vu).toFixed(4));
  const impliedAvgLatencyMs = Number(Math.max(50, (vu / Math.max(0.1, rampQps) - 1) * 1e3).toFixed(1));
  const estimatedP95Ms = Number(lerpPiecewise(vu, P95_LATENCY_ANCHORS).toFixed(1));
  const fluxgateRssMib = Number((28.1 + 0.342 * vu).toFixed(1));
  const proxyXrayRssMib = Number((59.4 + 0.2452 * vu).toFixed(1));
  const proxyCombinedMib = Number((88.1 + 0.5872 * vu).toFixed(1));
  const gatewayXrayRssMib = 36.8;
  const edgeAgentRssMib = 24.1;
  const vectorRssMib = vectorOptimized ? 71.5 : 124.1;
  const journaldRssMib = 16;
  const supportingProbesMib = Number((20.3 + 16.9 + 7).toFixed(1));
  const coreFiveTotalRssMib = Number(
    (edgeAgentRssMib + fluxgateRssMib + proxyXrayRssMib + gatewayXrayRssMib + vectorRssMib).toFixed(1)
  );
  const vectorDelta = vectorOptimized ? 0 : 52.6;
  const fixedWithTmp = 451.7 + vectorDelta;
  const fixedCleanTmp = 376.7 + vectorDelta;
  const nonProxyFixedMib = Number((cleanTmpfs ? fixedCleanTmp : fixedWithTmp).toFixed(1));
  const totalUsedWithTmpMib = Number((fixedWithTmp + proxyCombinedMib).toFixed(1));
  const totalUsedCleanTmpMib = Number((fixedCleanTmp + proxyCombinedMib).toFixed(1));
  const totalUsedMib = cleanTmpfs ? totalUsedCleanTmpMib : totalUsedWithTmpMib;
  const availMib = Number(Math.max(0, totalRamMib - totalUsedMib).toFixed(1));
  const ramPct = Number((totalUsedMib / totalRamMib * 100).toFixed(1));
  const cap75Mib = totalRamMib * 0.75;
  const cap80Mib = totalRamMib * 0.8;
  const maxSafeVu75 = Math.max(0, Math.floor((cap75Mib - nonProxyFixedMib - 88.1) / 0.5872));
  const maxSafeVu80 = Math.max(0, Math.floor((cap80Mib - nonProxyFixedMib - 88.1) / 0.5872));
  const slo = evaluateSlo(estimatedP95Ms, ramPct, vu);
  const bundledTrafficGb = 2048;
  const overageTrafficRatePerGb = 0.09;
  const onlineUsers = Math.max(1, Math.round(vu * userMultiplier));
  const monthlyReqsM = Number((steadyQps * 2592e3 / 1e6).toFixed(1));
  const estimatedBandwidthMbps = Number((steadyQps * 12 * 1024 * 8 / 1e6).toFixed(2));
  const monthlyTrafficTb = Number((estimatedBandwidthMbps * 2592e3 / 8 / 1e6).toFixed(2));
  const trafficQuotaPct2Tb = Number((monthlyTrafficTb / 2 * 100).toFixed(1));
  const includedGbRaw = bundledTrafficGb / onlineUsers;
  const includedGbPerUser = Number(includedGbRaw.toFixed(2));
  const extraGbRaw = gbPerUserMonth <= includedGbPerUser + 1e-4 ? 0 : Math.max(0, gbPerUserMonth - includedGbRaw);
  const extraGbPerUser = Number(extraGbRaw.toFixed(2));
  const totalUserTrafficTb = Number((onlineUsers * gbPerUserMonth / 1024).toFixed(2));
  const pooledNodesNeeded = Number(Math.max(1, onlineUsers * gbPerUserMonth / bundledTrafficGb).toFixed(2));
  const round4 = (n) => Math.round((n + Number.EPSILON) * 1e4) / 1e4;
  const round6 = (n) => Math.round((n + Number.EPSILON) * 1e6) / 1e6;
  const buildTier = (price) => {
    const computeCostPerUserUsd = round4(price / onlineUsers);
    const pooledRateRaw = price / bundledTrafficGb;
    const pooledTrafficRatePerGb = round6(pooledRateRaw);
    const trafficCostPerUserPooledUsd = round4(extraGbRaw * pooledRateRaw);
    const trafficCostPerUserOverageUsd = round4(extraGbRaw * overageTrafficRatePerGb);
    const totalCostPerUserPooledUsd = round4(computeCostPerUserUsd + trafficCostPerUserPooledUsd);
    const totalCostPerUserOverageUsd = round4(computeCostPerUserUsd + trafficCostPerUserOverageUsd);
    const activeTrafficCostPerUserUsd = trafficBillingMode === "overage" ? trafficCostPerUserOverageUsd : trafficCostPerUserPooledUsd;
    const activeTotalCostPerUserUsd = trafficBillingMode === "overage" ? totalCostPerUserOverageUsd : totalCostPerUserPooledUsd;
    return {
      tierPriceUsd: price,
      costPerVuUsd: round4(price / vu),
      costPerUserUsd: computeCostPerUserUsd,
      computeCostPerUserUsd,
      pooledTrafficRatePerGb,
      overageTrafficRatePerGb,
      trafficCostPerUserPooledUsd,
      trafficCostPerUserOverageUsd,
      totalCostPerUserPooledUsd,
      totalCostPerUserOverageUsd,
      activeTrafficCostPerUserUsd,
      activeTotalCostPerUserUsd,
      costPer1MReqUsd: round4(price / Math.max(0.1, monthlyReqsM))
    };
  };
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
      vectorOptimized
    },
    roi: {
      monthlyReqsM,
      estimatedBandwidthMbps,
      monthlyTrafficTb,
      trafficQuotaPct2Tb,
      bundledTrafficGb,
      includedGbPerUser,
      gbPerUserMonth,
      extraGbPerUser,
      totalUserTrafficTb,
      pooledNodesNeeded,
      trafficBillingMode,
      overageTrafficRatePerGb,
      tiers: {
        7: buildTier(7),
        10: buildTier(10),
        12: buildTier(12)
      }
    }
  };
}
function simulateTimeseriesForVu(targetVu) {
  const vu = Math.max(10, Math.min(500, targetVu));
  const tBlend = Math.max(0, Math.min(1, (vu - 40) / 460));
  const modelAtTarget = computeOperatingModel(vu);
  return K6_SERIES_40VU.map((p40, idx) => {
    const p500 = K6_SERIES_500VU[idx] || p40;
    const ratioVu = p40.avgVu / 40;
    const simVu = Number((vu * ratioVu).toFixed(1));
    const norm40 = p40.qps / 35.34;
    const norm500 = p500.qps / 206.24;
    const blendedNorm = (1 - tBlend) * norm40 + tBlend * norm500;
    const peakSteady = vu <= 150 ? modelAtTarget.steadyQps : modelAtTarget.steadyQps * (1 + 0.45 * tBlend);
    const simQps = Number(Math.max(0.5, blendedNorm * peakSteady).toFixed(2));
    const simLat = Number(Math.max(50, (simVu / Math.max(0.5, simQps) - 1) * 1e3).toFixed(1));
    return {
      minute: p40.minute,
      avgVu: simVu,
      qps: simQps,
      impliedLatencyMs: simLat
    };
  });
}
function parsePrometheusTelemetry(series) {
  const snapshot = {
    hasLiveTelemetry: false,
    hasK6PipelineData: false,
    processRssMib: {},
    liveSeries: []
  };
  if (!Array.isArray(series) || series.length === 0) {
    return snapshot;
  }
  const getFieldLen = (field) => {
    if (!field || !field.values) {
      return 0;
    }
    const vals = field.values;
    return typeof vals.length === "number" ? vals.length : typeof vals.size === "number" ? vals.size : 0;
  };
  const getFieldVal = (field, idx) => {
    const vals = field?.values;
    if (!vals) {
      return null;
    }
    const raw = typeof vals.get === "function" ? vals.get(idx) : vals[idx];
    const num = Number(raw);
    return raw != null && !Number.isNaN(num) ? num : null;
  };
  const lastValue = (field) => {
    const len = getFieldLen(field);
    for (let i = len - 1; i >= 0; i--) {
      const num = getFieldVal(field, i);
      if (num !== null) {
        return num;
      }
    }
    return null;
  };
  const vusByTs = /* @__PURE__ */ new Map();
  const qpsByTs = /* @__PURE__ */ new Map();
  const p95ByTs = /* @__PURE__ */ new Map();
  for (const frame of series) {
    if (!frame || !Array.isArray(frame.fields)) {
      continue;
    }
    const timeField = frame.fields.find((f) => f.type === "time" || f.name === "Time");
    const numFields = frame.fields.filter((f) => f.type === "number" || f.name === "Value");
    if (numFields.length === 0) {
      continue;
    }
    const refId = String(frame.refId || "");
    for (const numField of numFields) {
      const val = lastValue(numField);
      if (val === null) {
        continue;
      }
      const labels = { ...frame.labels || {}, ...numField.labels || {} };
      const metricName = String(labels.__name__ || frame.name || numField.name || "").toLowerCase();
      if (labels.instance && !snapshot.instance) {
        snapshot.instance = labels.instance;
      }
      if (labels.testid && !snapshot.testId) {
        snapshot.testId = labels.testid;
        snapshot.hasK6PipelineData = true;
      }
      if (labels.test_profile && !snapshot.testProfile) {
        snapshot.testProfile = labels.test_profile;
      }
      if (labels.environment && !snapshot.environment) {
        snapshot.environment = labels.environment;
      }
      const extractRangePoints = (targetMap, transform) => {
        const len = getFieldLen(numField);
        if (len <= 1 && !timeField) {
          return;
        }
        for (let i = 0; i < len; i++) {
          const v = getFieldVal(numField, i);
          if (v === null) {
            continue;
          }
          const ts = timeField ? getFieldVal(timeField, i) ?? i * 15e3 : i * 15e3;
          const mapped = transform ? transform(v) : v;
          targetMap.set(ts, mapped);
        }
      };
      if (refId === "K6_VUS_TS" || refId === "FLUX_CONNS_TS" || refId === "VU" || metricName.includes("k6_vus") || metricName.includes("fluxgate_active_connections")) {
        snapshot.activeVusOrConns = Math.round(val);
        snapshot.hasLiveTelemetry = true;
        if (refId === "K6_VUS_TS" || metricName.includes("k6_vus")) {
          snapshot.hasK6PipelineData = true;
        }
        extractRangePoints(vusByTs, (v) => Math.max(0, Number(v.toFixed(1))));
      } else if (refId === "K6_QPS_TS" || refId === "FLUX_QPS_TS" || refId === "QPS" || metricName.includes("k6_http_reqs") || metricName.includes("fluxgate_http_requests")) {
        snapshot.liveQps = Number(val.toFixed(2));
        snapshot.hasLiveTelemetry = true;
        if (refId === "K6_QPS_TS" || metricName.includes("k6_http_reqs")) {
          snapshot.hasK6PipelineData = true;
        }
        extractRangePoints(qpsByTs, (v) => Math.max(0, Number(v.toFixed(2))));
      } else if (refId === "K6_P95_TS" || refId === "P95" || metricName.includes("duration_p95") || metricName.includes("k6_custom_api_latency")) {
        const toMs = (v) => Number((v > 0 && v < 15 ? v * 1e3 : v).toFixed(1));
        snapshot.liveP95Ms = toMs(val);
        snapshot.hasLiveTelemetry = true;
        if (refId === "K6_P95_TS" || metricName.includes("k6_http_req_duration") || metricName.includes("k6_custom_api_latency")) {
          snapshot.hasK6PipelineData = true;
        }
        extractRangePoints(p95ByTs, toMs);
      } else if (refId === "K6_ERR_RATE" || metricName.includes("k6_custom_error_rate") || metricName.includes("http_req_failed")) {
        snapshot.liveErrorRate = Number((val <= 1 ? val * 100 : val).toFixed(2));
        snapshot.hasLiveTelemetry = true;
        snapshot.hasK6PipelineData = true;
      } else if (metricName.includes("node_memory_memtotal_bytes") || refId === "MEM_TOTAL") {
        snapshot.memTotalMib = Number((val / (1024 * 1024)).toFixed(1));
        snapshot.hasLiveTelemetry = true;
      } else if (metricName.includes("node_memory_memavailable_bytes") || refId === "MEM_AVAIL") {
        snapshot.memAvailMib = Number((val / (1024 * 1024)).toFixed(1));
        snapshot.hasLiveTelemetry = true;
      } else if (metricName.includes("namedprocess_namegroup_memory_bytes") || refId === "PROC_RSS") {
        const grp = String(labels.groupname || "").toLowerCase();
        const mib = Number((val / (1024 * 1024)).toFixed(1));
        if (grp.includes("fluxgate")) {
          snapshot.processRssMib.fluxgate = mib;
        } else if (grp.includes("gateway")) {
          snapshot.processRssMib.gatewayXray = mib;
        } else if (grp.includes("xray")) {
          snapshot.processRssMib.proxyXray = mib;
        } else if (grp.includes("edge-agent") || grp.includes("agent-proxy")) {
          snapshot.processRssMib.edgeAgent = mib;
        } else if (grp.includes("vector")) {
          snapshot.processRssMib.vector = mib;
        } else if (grp.includes("journal")) {
          snapshot.processRssMib.journald = mib;
        }
        snapshot.hasLiveTelemetry = true;
      } else if (metricName.includes("xray_up") || refId === "XRAY_UP") {
        snapshot.xrayUp = val;
        snapshot.hasLiveTelemetry = true;
      }
    }
  }
  const allTimestamps = Array.from(
    /* @__PURE__ */ new Set([...vusByTs.keys(), ...qpsByTs.keys(), ...p95ByTs.keys()])
  ).sort((a, b) => a - b);
  if (allTimestamps.length >= 2) {
    const t0 = allTimestamps[0];
    const tEnd = allTimestamps[allTimestamps.length - 1];
    const spanMin = Math.max(0.25, (tEnd - t0) / 6e4);
    const scaleFactor = spanMin > 30 ? 30 / spanMin : 1;
    let lastVu = snapshot.activeVusOrConns ?? 40;
    let lastQps = snapshot.liveQps ?? 1;
    let lastP95 = snapshot.liveP95Ms ?? 150;
    let maxVu = 0;
    let maxQps = 0;
    snapshot.liveSeries = allTimestamps.map((ts) => {
      if (vusByTs.has(ts)) {
        lastVu = vusByTs.get(ts);
      }
      if (qpsByTs.has(ts)) {
        lastQps = qpsByTs.get(ts);
      }
      if (p95ByTs.has(ts)) {
        lastP95 = p95ByTs.get(ts);
      } else if (lastVu > 0 && lastQps > 0) {
        lastP95 = Number(Math.max(50, (lastVu / Math.max(0.5, lastQps) - 1) * 1e3).toFixed(1));
      }
      if (lastVu > maxVu) {
        maxVu = lastVu;
      }
      if (lastQps > maxQps) {
        maxQps = lastQps;
      }
      const rawMin = (ts - t0) / 6e4 * scaleFactor;
      return {
        minute: Number(Math.max(0, Math.min(30, rawMin)).toFixed(2)),
        avgVu: Number(lastVu.toFixed(1)),
        qps: Number(lastQps.toFixed(2)),
        impliedLatencyMs: Number(lastP95.toFixed(1))
      };
    });
    if (maxVu > 0) {
      snapshot.peakVus = Math.round(maxVu);
    }
    if (maxQps > 0) {
      snapshot.peakQps = Number(maxQps.toFixed(2));
    }
  }
  if (snapshot.memTotalMib != null && snapshot.memAvailMib != null) {
    snapshot.memUsedMib = Number(Math.max(0, snapshot.memTotalMib - snapshot.memAvailMib).toFixed(1));
  }
  return snapshot;
}

// src/XConnectTopologyRoiPanel.tsx
var SERVICE_CATALOG = {
  "edge-agent": {
    id: "edge-agent",
    title: "1. xconnect-edge-agent.service",
    role: "roles/vhosts/xconnect-edge-agent",
    binary: "/usr/local/bin/agent-proxy -config /etc/agent/account-agent.yaml",
    listen: "01-agent-proxy.yaml (Proxy) \xB7 02-xconnect-gateway.yaml (Gateway)",
    highlights: [
      "\u63A7\u5236\u9762\u552F\u4E00\u540C\u6B65\u5668\uFF1A5m \u8F6E\u8BE2 + SSE \u76D1\u542C accounts.svc.plus",
      '\u5355\u4E00\u76EE\u6807 "proxy" -> /usr/local/etc/xray/config.json (xray run -test + SIGHUP \u70ED\u91CD\u8F7D)',
      "\u72EC\u7ACB\u7BA1\u7406 jp-xconnect-gateway-02 (net-jp-xconnect-02)\uFF0C\u4FEE\u590D gateway_id \u9519\u914D"
    ],
    color: "#fbbf24"
  },
  fluxgate: {
    id: "fluxgate",
    title: "2. fluxgate.service (v0.2.1 L7 Ingress)",
    role: "roles/vhosts/fluxgate",
    binary: "/usr/local/bin/fluxgate v0.2.1",
    listen: "*:443 (TLS *.svc.plus) \xB7 127.0.0.1:9102/metrics",
    highlights: [
      "Route A: /split/* -> unix:///dev/shm/xray.sock (H2 Stream 4MiB / Conn 16MiB / flush -1)",
      "Route B: /xconnect/* -> unix:///run/xconnect-gateway/xray.sock (h2c / strip x_padding)",
      "Route C: /xray-exporter/* -> http://127.0.0.1:8080 (\u76F8\u6BD4 HAProxy 110 MiB \u8282\u7701 ~82 MiB)"
    ],
    color: "#38bdf8"
  },
  "proxy-xray": {
    id: "proxy-xray",
    title: "3. xconnect-proxy-xray.service (\u5355\u4F53\u805A\u5408)",
    role: "roles/vhosts/xconnect_proxy (xray_merged_mode: true)",
    binary: "/usr/local/bin/xray (\u5185\u5D4C xray-exporter + \u5185\u5B58 stats.Manager)",
    listen: "/dev/shm/xray.sock (XHTTP) \xB7 0.0.0.0:1443 (TCP Vision) \xB7 127.0.0.1:8080/scrape",
    highlights: [
      "4 \u8FDB\u7A0B 319.1 MiB \u6536\u655B\u4E3A 1 \u8FDB\u7A0B 59.4 MiB (-83%)\uFF0C\u6D88\u9664 gRPC :10086/:10087 \u5F00\u9500",
      "\u540C\u4E00\u8FDB\u7A0B\u76F4\u8BFB\u5185\u5B58 stats.Manager \u66B4\u9732 :8080/scrape \u5E76\u6BCF\u5206\u949F\u76F4\u63A8 Vector :8686",
      "\u4F4E\u5EF6\u8FDF\u53C2\u6570\uFF1AbufferSize=128, connIdle=3600, uplinkOnly=15, downlinkOnly=30"
    ],
    color: "#34d399"
  },
  "gateway-xray": {
    id: "gateway-xray",
    title: "4. xconnect-gateway-xray.service",
    role: "roles/vhosts/xconnect_gateway",
    binary: "/usr/local/bin/xray -config /var/lib/xconnect-gateway/runtime/xray.json",
    listen: "/run/xconnect-gateway/xray.sock (0660) -> WireGuard 127.0.0.1:51820 (xconzero0)",
    highlights: [
      "\u4E0E Proxy \u5171\u7528\u540C\u4E00 /usr/local/bin/xray \u4E8C\u8FDB\u5236\uFF0C\u91C7\u7528\u88F8 -config \u6A21\u5F0F\u8FD0\u884C\uFF08\u65E0 exporter\uFF09",
      "\u914D\u7F6E\u3001Unix Socket \u4E0E systemd \u751F\u547D\u5468\u671F\u540C Proxy \u5B8C\u5168\u9694\u79BB\uFF0C\u4E92\u4E0D\u5E72\u6270"
    ],
    color: "#fb7185"
  },
  vector: {
    id: "vector",
    title: "5. vector.service (\u6838\u5FC3\u76D1\u63A7\u4E0E\u8BA1\u8D39\u6C47\u805A\u63A2\u9488)",
    role: "roles/vhosts/vector-agent + roles/vhosts/xconnect_node_log_policy",
    binary: "/usr/bin/vector 0.41.1 (MALLOC_CONF=narenas:1,thp:never,retain:false)",
    listen: "127.0.0.1:8686 (256MiB disk_v2 \u8BA1\u8D39\u7F13\u51B2) \xB7 15s Prometheus Scrape",
    highlights: [
      "\u6CE8\u5165 jemalloc thp:never + TOKIO_WORKER_THREADS=1 + \u505C\u7528\u65E0\u5BBF\u4E3B system_logs\uFF0CAnonHugePages 61.4M -> 0",
      "\u5E38\u9A7B RSS \u4ECE 124.1 MiB \u538B\u964D\u81F3 71.5 MiB (-39.6%)\uFF0Ccgroup MemoryHigh=72M / MemoryMax=128M",
      "systemd-journald \u540C\u6B65\u6536\u7D27\u81F3 64M/3d + 24M/48M cgroup\uFF0CRSS \u4ECE 105.8 MiB \u964D\u81F3 16.0 MiB"
    ],
    color: "#a78bfa"
  }
};
function buildSvgPath(points, xFn, yFn) {
  return points.map((pt, idx) => `${idx === 0 ? "M" : "L"} ${xFn(pt[0]).toFixed(1)} ${yFn(pt[1]).toFixed(1)}`).join(" ");
}
var XConnectTopologyRoiPanel = (props) => {
  const { options, data, height, replaceVariables } = props;
  const [activeView, setActiveView] = (0, import_react.useState)(options.viewMode || "all");
  const [activeLayer, setActiveLayer] = (0, import_react.useState)(options.defaultLayer || "all");
  const [selectedServiceId, setSelectedServiceId] = (0, import_react.useState)("proxy-xray");
  const [targetVu, setTargetVu] = (0, import_react.useState)(options.defaultTargetVu || 120);
  const [userMultiplier, setUserMultiplier] = (0, import_react.useState)(options.defaultUserMultiplier || 4);
  const [cleanTmpfs, setCleanTmpfs] = (0, import_react.useState)(options.cleanTmpfs ?? true);
  const [vectorOptimized, setVectorOptimized] = (0, import_react.useState)(options.vectorOptimized ?? true);
  const [selectedTier, setSelectedTier] = (0, import_react.useState)(options.defaultTierPrice || 7);
  const [gbPerUserMonth, setGbPerUserMonth] = (0, import_react.useState)(options.defaultGbPerUserMonth || 10);
  const [trafficBillingMode, setTrafficBillingMode] = (0, import_react.useState)(
    options.defaultTrafficBillingMode || "pooled"
  );
  const [scrubIndex, setScrubIndex] = (0, import_react.useState)(60);
  const [isPlayingTime, setIsPlayingTime] = (0, import_react.useState)(false);
  const [show40VuSeries, setShow40VuSeries] = (0, import_react.useState)(true);
  const [show500VuSeries, setShow500VuSeries] = (0, import_react.useState)(true);
  const [showSimVuSeries, setShowSimVuSeries] = (0, import_react.useState)(true);
  const [showLivePipelineSeries, setShowLivePipelineSeries] = (0, import_react.useState)(true);
  (0, import_react.useEffect)(() => {
    if (options.viewMode) setActiveView(options.viewMode);
  }, [options.viewMode]);
  (0, import_react.useEffect)(() => {
    if (options.defaultLayer) setActiveLayer(options.defaultLayer);
  }, [options.defaultLayer]);
  const liveTelemetry = (0, import_react.useMemo)(() => parsePrometheusTelemetry(data?.series), [data]);
  const k6WorkflowUrl = options.k6WorkflowUrl || "https://github.com/ai-workspace-infra/playbooks/actions/workflows/k6-proxy-performance.yml";
  (0, import_react.useEffect)(() => {
    if (options.followLiveVu && liveTelemetry.activeVusOrConns && liveTelemetry.activeVusOrConns > 0) {
      setTargetVu(Math.max(10, Math.min(500, liveTelemetry.activeVusOrConns)));
    }
  }, [options.followLiveVu, liveTelemetry.activeVusOrConns]);
  (0, import_react.useEffect)(() => {
    if (!isPlayingTime) {
      return;
    }
    const timer = setInterval(() => {
      setScrubIndex((prev) => prev >= K6_SERIES_500VU.length - 1 ? 0 : prev + 1);
    }, 180);
    return () => clearInterval(timer);
  }, [isPlayingTime]);
  const resolvedNodeName = (0, import_react.useMemo)(() => {
    const raw = options.nodeHostname || "jp-xconnect-02.svc.plus";
    if (replaceVariables) {
      try {
        const v = replaceVariables(raw);
        if (v && !v.startsWith("$")) return v;
      } catch {
      }
    }
    return liveTelemetry.instance || raw;
  }, [options.nodeHostname, replaceVariables, liveTelemetry.instance]);
  const model = (0, import_react.useMemo)(
    () => computeOperatingModel(targetVu, {
      userMultiplier,
      cleanTmpfs,
      vectorOptimized,
      totalRamMib: liveTelemetry.memTotalMib || options.totalRamMib || 939,
      gbPerUserMonth,
      trafficBillingMode
    }),
    [
      targetVu,
      userMultiplier,
      cleanTmpfs,
      vectorOptimized,
      liveTelemetry.memTotalMib,
      options.totalRamMib,
      gbPerUserMonth,
      trafficBillingMode
    ]
  );
  const simSeries = (0, import_react.useMemo)(() => simulateTimeseriesForVu(targetVu), [targetVu]);
  const activeTierCost = model.roi.tiers[selectedTier];
  const selectedService = SERVICE_CATALOG[selectedServiceId] || SERVICE_CATALOG["proxy-xray"];
  const fluxgateRss = liveTelemetry.processRssMib.fluxgate ?? model.memory.fluxgateRssMib;
  const proxyXrayRss = liveTelemetry.processRssMib.proxyXray ?? model.memory.proxyXrayRssMib;
  const gatewayXrayRss = liveTelemetry.processRssMib.gatewayXray ?? model.memory.gatewayXrayRssMib;
  const edgeAgentRss = liveTelemetry.processRssMib.edgeAgent ?? model.memory.edgeAgentRssMib;
  const vectorRss = liveTelemetry.processRssMib.vector ?? model.memory.vectorRssMib;
  const journaldRss = liveTelemetry.processRssMib.journald ?? model.memory.journaldRssMib;
  const isLayerVisible = (layersStr) => {
    if (activeLayer === "all") return true;
    return layersStr.split(",").includes(activeLayer);
  };
  const renderTimeseriesChart = () => {
    const w = 1560;
    const h = 620;
    const px1 = (m) => 80 + m / 30 * 640;
    const py1Qps = (q) => 520 - Math.min(q, 250) / 250 * 400;
    const px2 = (m) => 840 + m / 30 * 640;
    const py2Lat = (l) => 520 - Math.min(l, 6e3) / 6e3 * 400;
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
    const hasLiveCurve = liveTelemetry.liveSeries.length >= 2;
    const p1QpsLive = hasLiveCurve ? buildSvgPath(
      liveTelemetry.liveSeries.map((p) => [p.minute, p.qps]),
      px1,
      py1Qps
    ) : "";
    const p2LatLive = hasLiveCurve ? buildSvgPath(
      liveTelemetry.liveSeries.map((p) => [p.minute, p.impliedLatencyMs]),
      px2,
      py2Lat
    ) : "";
    const vuAreaPts = [
      [0, 0],
      ...K6_SERIES_500VU.map((p) => [p.minute, p.avgVu * 0.5]),
      [30, 0]
    ];
    const vuPoly = vuAreaPts.map(([t, y]) => `${px1(t).toFixed(1)},${py1Qps(y).toFixed(1)}`).join(" ");
    const idx = Math.max(0, Math.min(K6_SERIES_500VU.length - 1, scrubIndex));
    const pt40 = K6_SERIES_40VU[idx];
    const pt500 = K6_SERIES_500VU[idx];
    const ptSim = simSeries[idx];
    const curMin = pt500.minute;
    const ptLive = hasLiveCurve ? liveTelemetry.liveSeries.reduce(
      (best, cand) => Math.abs(cand.minute - curMin) < Math.abs(best.minute - curMin) ? cand : best
    ) : null;
    const phaseLabel = curMin < 7.5 ? "0\u20137.5m \u7EBF\u6027\u722C\u5761\u671F" : curMin >= 9.5 && curMin <= 11 ? "t\u224810m \u8FDE\u63A5\u6C60\u91CD\u7F6E\u4E0E H2 \u591A\u8DEF\u590D\u7528\u91CD\u5EFA\u62D0\u70B9" : curMin <= 22.5 ? "7.5\u201322.5m \u5CF0\u503C\u7A33\u6001\u4FDD\u6301\u671F" : "22.5\u201330m \u7EBF\u6027\u964D\u8F7D\u671F";
    return /* @__PURE__ */ import_react.default.createElement(
      "div",
      {
        style: {
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: "12px",
          padding: "14px 16px"
        }
      },
      /* @__PURE__ */ import_react.default.createElement(
        "div",
        {
          style: {
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            marginBottom: "10px"
          }
        },
        /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: "16px", fontWeight: 700, color: "#f8fafc" } }, "\u2461 40 VU vs 500 VU\uFF0830 \u5206\u949F / 1s \u91C7\u6837\u5206\u7BB1\uFF09\u5B9E\u6D4B\u541E\u5410\u4E0E\u5EF6\u8FDF\u52A8\u6001\u5BF9\u6BD4"), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: "12px", color: "#94a3b8", marginTop: "2px" } }, "\u76EE\u6807\u8282\u70B9\uFF1A", /* @__PURE__ */ import_react.default.createElement("span", { style: { fontFamily: "monospace", color: "#38bdf8" } }, resolvedNodeName), "\uFF08VLESS+XHTTP+TLS", " ", /* @__PURE__ */ import_react.default.createElement("code", null, "/split"), "\uFF09\xB7 \u62D6\u52A8\u65F6\u95F4\u8F74\u6216\u60AC\u505C\u66F2\u7EBF\u67E5\u770B\u4EFB\u610F 15s \u5206\u7BB1\u5B9E\u6D4B\u5207\u7247")),
        /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" } }, /* @__PURE__ */ import_react.default.createElement(
          "button",
          {
            onClick: () => setIsPlayingTime((v) => !v),
            style: {
              background: isPlayingTime ? "#dc2626" : "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              padding: "5px 11px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer"
            }
          },
          isPlayingTime ? "\u23F8 \u6682\u505C\u56DE\u653E" : "\u25B6 \u52A8\u6001\u56DE\u653E 30m"
        ), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#cbd5e1" } }, /* @__PURE__ */ import_react.default.createElement("span", null, "\u65F6\u95F4\u5207\u7247: ", curMin.toFixed(2), "m"), /* @__PURE__ */ import_react.default.createElement(
          "input",
          {
            type: "range",
            min: 0,
            max: K6_SERIES_500VU.length - 1,
            value: idx,
            onChange: (e) => setScrubIndex(Number(e.target.value)),
            style: { width: "130px", accentColor: "#38bdf8", cursor: "pointer" }
          }
        )), /* @__PURE__ */ import_react.default.createElement(
          "button",
          {
            onClick: () => setShow500VuSeries((v) => !v),
            style: {
              background: show500VuSeries ? "rgba(56,189,248,0.18)" : "#1e293b",
              border: `1px solid ${show500VuSeries ? "#38bdf8" : "#334155"}`,
              color: show500VuSeries ? "#38bdf8" : "#64748b",
              borderRadius: "6px",
              padding: "4px 9px",
              fontSize: "11px",
              fontWeight: 600,
              cursor: "pointer"
            }
          },
          "\u25CF 500 VU \u5B9E\u6D4B"
        ), /* @__PURE__ */ import_react.default.createElement(
          "button",
          {
            onClick: () => setShow40VuSeries((v) => !v),
            style: {
              background: show40VuSeries ? "rgba(52,211,153,0.18)" : "#1e293b",
              border: `1px solid ${show40VuSeries ? "#34d399" : "#334155"}`,
              color: show40VuSeries ? "#34d399" : "#64748b",
              borderRadius: "6px",
              padding: "4px 9px",
              fontSize: "11px",
              fontWeight: 600,
              cursor: "pointer"
            }
          },
          "\u25CF 40 VU \u5B9E\u6D4B"
        ), /* @__PURE__ */ import_react.default.createElement(
          "button",
          {
            onClick: () => setShowSimVuSeries((v) => !v),
            style: {
              background: showSimVuSeries ? "rgba(167,139,250,0.22)" : "#1e293b",
              border: `1px solid ${showSimVuSeries ? "#a78bfa" : "#334155"}`,
              color: showSimVuSeries ? "#c4b5fd" : "#64748b",
              borderRadius: "6px",
              padding: "4px 9px",
              fontSize: "11px",
              fontWeight: 600,
              cursor: "pointer"
            }
          },
          "\u25C6 \u5F53\u524D ",
          targetVu,
          " VU \u52A8\u6001\u4EFF\u771F"
        ), hasLiveCurve && /* @__PURE__ */ import_react.default.createElement(
          "button",
          {
            onClick: () => setShowLivePipelineSeries((v) => !v),
            style: {
              background: showLivePipelineSeries ? "rgba(251,191,36,0.22)" : "#1e293b",
              border: `1px solid ${showLivePipelineSeries ? "#fbbf24" : "#334155"}`,
              color: showLivePipelineSeries ? "#fde68a" : "#64748b",
              borderRadius: "6px",
              padding: "4px 9px",
              fontSize: "11px",
              fontWeight: 700,
              cursor: "pointer"
            }
          },
          "\u2605 \u5B9E\u65F6\u6D41\u6C34\u7EBF\u91C7\u6837 (",
          liveTelemetry.testId || "Prometheus",
          ")"
        ))
      ),
      /* @__PURE__ */ import_react.default.createElement(
        "div",
        {
          style: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "8px",
            marginBottom: "10px",
            background: "#0b1120",
            border: "1px solid #1e293b",
            borderRadius: "8px",
            padding: "8px 12px",
            fontSize: "12px"
          }
        },
        /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#94a3b8" } }, "\u5F53\u524D\u91C7\u6837\u65F6\u523B\uFF1A"), /* @__PURE__ */ import_react.default.createElement("strong", { style: { color: "#f8fafc", fontFamily: "monospace" } }, "t = ", curMin.toFixed(2), " min"), /* @__PURE__ */ import_react.default.createElement(
          "span",
          {
            style: {
              marginLeft: "8px",
              padding: "1px 6px",
              borderRadius: "4px",
              background: "rgba(251,191,36,0.15)",
              color: "#fbbf24",
              fontSize: "11px"
            }
          },
          phaseLabel
        )),
        /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#34d399", fontWeight: 600 } }, "40 VU \u57FA\u7EBF\uFF1A"), /* @__PURE__ */ import_react.default.createElement("span", { style: { fontFamily: "monospace", color: "#e2e8f0" } }, pt40.avgVu, " VU \xB7 ", /* @__PURE__ */ import_react.default.createElement("strong", null, pt40.qps, " req/s"), " \xB7 \u5747\u5EF6 ", /* @__PURE__ */ import_react.default.createElement("strong", null, pt40.impliedLatencyMs, " ms"))),
        /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#38bdf8", fontWeight: 600 } }, "500 VU \u5B9E\u6D4B\uFF1A"), /* @__PURE__ */ import_react.default.createElement("span", { style: { fontFamily: "monospace", color: "#e2e8f0" } }, pt500.avgVu, " VU \xB7 ", /* @__PURE__ */ import_react.default.createElement("strong", null, pt500.qps, " req/s"), " \xB7 \u5747\u5EF6 ", /* @__PURE__ */ import_react.default.createElement("strong", null, pt500.impliedLatencyMs, " ms"))),
        /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#a78bfa", fontWeight: 600 } }, "\u5F53\u524D ", targetVu, " VU \u52A8\u6001\u5305\u7EDC\uFF1A"), /* @__PURE__ */ import_react.default.createElement("span", { style: { fontFamily: "monospace", color: "#e2e8f0" } }, ptSim.avgVu, " VU \xB7 ", /* @__PURE__ */ import_react.default.createElement("strong", null, ptSim.qps, " req/s"), " \xB7 \u5747\u5EF6 ", /* @__PURE__ */ import_react.default.createElement("strong", null, ptSim.impliedLatencyMs, " ms"))),
        ptLive && /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#fbbf24", fontWeight: 700 } }, "\u2605 \u6D41\u6C34\u7EBF\u5B9E\u65F6\u91C7\u6837\uFF1A"), /* @__PURE__ */ import_react.default.createElement("span", { style: { fontFamily: "monospace", color: "#fef08a" } }, ptLive.avgVu, " VU \xB7 ", /* @__PURE__ */ import_react.default.createElement("strong", null, ptLive.qps, " req/s"), " \xB7 P95 ", /* @__PURE__ */ import_react.default.createElement("strong", null, ptLive.impliedLatencyMs, " ms")))
      ),
      /* @__PURE__ */ import_react.default.createElement("div", { style: { overflowX: "auto" } }, /* @__PURE__ */ import_react.default.createElement(
        "svg",
        {
          viewBox: `0 0 ${w} ${h}`,
          style: { width: "100%", minWidth: "1020px", height: "auto", display: "block", userSelect: "none" }
        },
        /* @__PURE__ */ import_react.default.createElement("rect", { x: "16", y: "16", width: "745", height: "585", rx: "10", fill: "#0b1120", stroke: "#1e293b" }),
        /* @__PURE__ */ import_react.default.createElement("rect", { x: "795", y: "16", width: "749", height: "585", rx: "10", fill: "#0b1120", stroke: "#1e293b" }),
        /* @__PURE__ */ import_react.default.createElement("text", { x: "80", y: "48", fontSize: "14", fontWeight: "700", fill: "#f8fafc" }, "A. \u5B9E\u65F6\u541E\u5410\u91CF QPS (req/s) 15s \u5E73\u6ED1\u66F2\u7EBF (\u70B9\u51FB\u6216\u60AC\u505C\u5B9A\u4F4D\u65F6\u95F4\u5207\u7247)"),
        /* @__PURE__ */ import_react.default.createElement("text", { x: "840", y: "48", fontSize: "14", fontWeight: "700", fill: "#f8fafc" }, "B. Little's Law \u63A8\u7B97\u5E73\u5747\u8BF7\u6C42\u5EF6\u8FDF (ms) \u66F2\u7EBF"),
        [0, 50, 100, 150, 200, 250].map((q) => {
          const y = py1Qps(q);
          return /* @__PURE__ */ import_react.default.createElement("g", { key: `q-${q}` }, /* @__PURE__ */ import_react.default.createElement("line", { x1: "80", y1: y, x2: "720", y2: y, stroke: "#1e293b", strokeWidth: "1" }), /* @__PURE__ */ import_react.default.createElement("text", { x: "70", y: y + 4, textAnchor: "end", fontSize: "11", fill: "#94a3b8" }, q));
        }),
        [0, 1e3, 1500, 3e3, 4500, 6e3].map((l) => {
          const y = py2Lat(l);
          const isSlo = l === 1500;
          return /* @__PURE__ */ import_react.default.createElement("g", { key: `l-${l}` }, /* @__PURE__ */ import_react.default.createElement(
            "line",
            {
              x1: "840",
              y1: y,
              x2: "1480",
              y2: y,
              stroke: isSlo ? "#ef4444" : "#1e293b",
              strokeWidth: isSlo ? "1.6" : "1",
              strokeDasharray: isSlo ? "5 4" : void 0
            }
          ), /* @__PURE__ */ import_react.default.createElement("text", { x: "830", y: y + 4, textAnchor: "end", fontSize: "11", fill: isSlo ? "#f87171" : "#94a3b8" }, l));
        }),
        [0, 5, 7.5, 10, 15, 22.5, 30].map((m) => {
          const x1 = px1(m);
          const x2 = px2(m);
          return /* @__PURE__ */ import_react.default.createElement("g", { key: `xt-${m}` }, /* @__PURE__ */ import_react.default.createElement("line", { x1, y1: "80", x2: x1, y2: "520", stroke: "#1e293b", strokeDasharray: "3 4" }), /* @__PURE__ */ import_react.default.createElement("text", { x: x1, y: "542", textAnchor: "middle", fontSize: "11", fill: "#94a3b8" }, m, "m"), /* @__PURE__ */ import_react.default.createElement("line", { x1: x2, y1: "80", x2, y2: "520", stroke: "#1e293b", strokeDasharray: "3 4" }), /* @__PURE__ */ import_react.default.createElement("text", { x: x2, y: "542", textAnchor: "middle", fontSize: "11", fill: "#94a3b8" }, m, "m"));
        }),
        /* @__PURE__ */ import_react.default.createElement("polygon", { points: vuPoly, fill: "rgba(148,163,184,0.10)" }),
        /* @__PURE__ */ import_react.default.createElement(
          "line",
          {
            x1: px1(10),
            y1: "80",
            x2: px1(10),
            y2: "520",
            stroke: "#fbbf24",
            strokeWidth: "1.3",
            strokeDasharray: "4 3"
          }
        ),
        /* @__PURE__ */ import_react.default.createElement("text", { x: px1(10) + 8, y: "98", fontSize: "11", fontWeight: "600", fill: "#fbbf24" }, "t\u224810m \u8FDE\u63A5\u6C60\u91CD\u8FDE -> 206.2 req/s"),
        /* @__PURE__ */ import_react.default.createElement(
          "line",
          {
            x1: px2(10),
            y1: "80",
            x2: px2(10),
            y2: "520",
            stroke: "#fbbf24",
            strokeWidth: "1.3",
            strokeDasharray: "4 3"
          }
        ),
        /* @__PURE__ */ import_react.default.createElement("text", { x: px2(10) + 8, y: "98", fontSize: "11", fontWeight: "600", fill: "#fbbf24" }, "\u8FDE\u63A5\u590D\u7528\u91CD\u5EFA\u540E\u5747\u5EF6\u56DE\u843D ~1.4s"),
        /* @__PURE__ */ import_react.default.createElement("text", { x: "1475", y: py2Lat(1500) - 6, textAnchor: "end", fontSize: "11", fontWeight: "700", fill: "#f87171" }, "SLO P95 \u7EA2\u7EBF: 1500 ms"),
        show500VuSeries && /* @__PURE__ */ import_react.default.createElement("path", { d: p1Qps500, fill: "none", stroke: "#38bdf8", strokeWidth: "2.4" }),
        show40VuSeries && /* @__PURE__ */ import_react.default.createElement("path", { d: p1Qps40, fill: "none", stroke: "#34d399", strokeWidth: "2.4" }),
        showSimVuSeries && /* @__PURE__ */ import_react.default.createElement("path", { d: p1QpsSim, fill: "none", stroke: "#a78bfa", strokeWidth: "2.2", strokeDasharray: "6 3" }),
        hasLiveCurve && showLivePipelineSeries && /* @__PURE__ */ import_react.default.createElement("path", { d: p1QpsLive, fill: "none", stroke: "#fbbf24", strokeWidth: "2.8" }),
        show500VuSeries && /* @__PURE__ */ import_react.default.createElement("path", { d: p2Lat500, fill: "none", stroke: "#fb7185", strokeWidth: "2.4" }),
        show40VuSeries && /* @__PURE__ */ import_react.default.createElement("path", { d: p2Lat40, fill: "none", stroke: "#34d399", strokeWidth: "2.4" }),
        showSimVuSeries && /* @__PURE__ */ import_react.default.createElement("path", { d: p2LatSim, fill: "none", stroke: "#a78bfa", strokeWidth: "2.2", strokeDasharray: "6 3" }),
        hasLiveCurve && showLivePipelineSeries && /* @__PURE__ */ import_react.default.createElement("path", { d: p2LatLive, fill: "none", stroke: "#fbbf24", strokeWidth: "2.8" }),
        /* @__PURE__ */ import_react.default.createElement("line", { x1: px1(curMin), y1: "80", x2: px1(curMin), y2: "520", stroke: "#f8fafc", strokeWidth: "1.5" }),
        show500VuSeries && /* @__PURE__ */ import_react.default.createElement("circle", { cx: px1(curMin), cy: py1Qps(pt500.qps), r: "5", fill: "#38bdf8", stroke: "#0b1120", strokeWidth: "1.5" }),
        show40VuSeries && /* @__PURE__ */ import_react.default.createElement("circle", { cx: px1(curMin), cy: py1Qps(pt40.qps), r: "5", fill: "#34d399", stroke: "#0b1120", strokeWidth: "1.5" }),
        showSimVuSeries && /* @__PURE__ */ import_react.default.createElement("circle", { cx: px1(curMin), cy: py1Qps(ptSim.qps), r: "5", fill: "#a78bfa", stroke: "#0b1120", strokeWidth: "1.5" }),
        ptLive && showLivePipelineSeries && /* @__PURE__ */ import_react.default.createElement("circle", { cx: px1(curMin), cy: py1Qps(ptLive.qps), r: "6", fill: "#fbbf24", stroke: "#0b1120", strokeWidth: "1.8" }),
        /* @__PURE__ */ import_react.default.createElement("line", { x1: px2(curMin), y1: "80", x2: px2(curMin), y2: "520", stroke: "#f8fafc", strokeWidth: "1.5" }),
        show500VuSeries && /* @__PURE__ */ import_react.default.createElement(
          "circle",
          {
            cx: px2(curMin),
            cy: py2Lat(pt500.impliedLatencyMs),
            r: "5",
            fill: "#fb7185",
            stroke: "#0b1120",
            strokeWidth: "1.5"
          }
        ),
        show40VuSeries && /* @__PURE__ */ import_react.default.createElement(
          "circle",
          {
            cx: px2(curMin),
            cy: py2Lat(pt40.impliedLatencyMs),
            r: "5",
            fill: "#34d399",
            stroke: "#0b1120",
            strokeWidth: "1.5"
          }
        ),
        showSimVuSeries && /* @__PURE__ */ import_react.default.createElement(
          "circle",
          {
            cx: px2(curMin),
            cy: py2Lat(ptSim.impliedLatencyMs),
            r: "5",
            fill: "#a78bfa",
            stroke: "#0b1120",
            strokeWidth: "1.5"
          }
        ),
        ptLive && showLivePipelineSeries && /* @__PURE__ */ import_react.default.createElement(
          "circle",
          {
            cx: px2(curMin),
            cy: py2Lat(ptLive.impliedLatencyMs),
            r: "6",
            fill: "#fbbf24",
            stroke: "#0b1120",
            strokeWidth: "1.8"
          }
        ),
        /* @__PURE__ */ import_react.default.createElement("rect", { x: "88", y: "88", width: "225", height: "86", rx: "8", fill: "#0f172a", fillOpacity: "0.92", stroke: "#334155" }),
        /* @__PURE__ */ import_react.default.createElement("line", { x1: "100", y1: "106", x2: "122", y2: "106", stroke: "#38bdf8", strokeWidth: "3" }),
        /* @__PURE__ */ import_react.default.createElement("text", { x: "128", y: "110", fontSize: "11", fill: "#e2e8f0" }, "500 VU \u5B9E\u6D4B QPS (\u5CF0\u503C 206.2/s)"),
        /* @__PURE__ */ import_react.default.createElement("line", { x1: "100", y1: "126", x2: "122", y2: "126", stroke: "#34d399", strokeWidth: "3" }),
        /* @__PURE__ */ import_react.default.createElement("text", { x: "128", y: "130", fontSize: "11", fill: "#e2e8f0" }, "40 VU \u5B9E\u6D4B QPS (\u7A33\u6001 35.3/s)"),
        /* @__PURE__ */ import_react.default.createElement("line", { x1: "100", y1: "146", x2: "122", y2: "146", stroke: "#a78bfa", strokeWidth: "2.5", strokeDasharray: "5 2" }),
        /* @__PURE__ */ import_react.default.createElement("text", { x: "128", y: "150", fontSize: "11", fill: "#c4b5fd" }, "\u5F53\u524D ", targetVu, " VU \u52A8\u6001\u4EFF\u771F\u66F2\u7EBF"),
        /* @__PURE__ */ import_react.default.createElement("rect", { x: "100", y: "158", width: "22", height: "8", fill: "rgba(148,163,184,0.28)" }),
        /* @__PURE__ */ import_react.default.createElement("text", { x: "128", y: "166", fontSize: "10", fill: "#94a3b8" }, "\u9634\u5F71\uFF1A500 VU \u722C\u5761\u8F6E\u5ED3"),
        /* @__PURE__ */ import_react.default.createElement("rect", { x: "1185", y: "112", width: "286", height: "72", rx: "8", fill: "#0f172a", fillOpacity: "0.92", stroke: "#334155" }),
        /* @__PURE__ */ import_react.default.createElement("line", { x1: "1198", y1: "130", x2: "1222", y2: "130", stroke: "#fb7185", strokeWidth: "3" }),
        /* @__PURE__ */ import_react.default.createElement("text", { x: "1230", y: "134", fontSize: "11", fill: "#e2e8f0" }, "500 VU \u63A8\u7B97\u5EF6\u8FDF (\u5B9E\u6D4B P95 4592 ms)"),
        /* @__PURE__ */ import_react.default.createElement("line", { x1: "1198", y1: "150", x2: "1222", y2: "150", stroke: "#34d399", strokeWidth: "3" }),
        /* @__PURE__ */ import_react.default.createElement("text", { x: "1230", y: "154", fontSize: "11", fill: "#e2e8f0" }, "40 VU \u63A8\u7B97\u5EF6\u8FDF (\u5B9E\u6D4B P95 207 ms)"),
        /* @__PURE__ */ import_react.default.createElement("line", { x1: "1198", y1: "170", x2: "1222", y2: "170", stroke: "#a78bfa", strokeWidth: "2.5", strokeDasharray: "5 2" }),
        /* @__PURE__ */ import_react.default.createElement("text", { x: "1230", y: "174", fontSize: "11", fill: "#c4b5fd" }, "\u5F53\u524D ", targetVu, " VU \u52A8\u6001\u5EF6\u8FDF (P95 ~", model.estimatedP95Ms, " ms)"),
        /* @__PURE__ */ import_react.default.createElement(
          "rect",
          {
            x: "80",
            y: "80",
            width: "640",
            height: "440",
            fill: "transparent",
            style: { cursor: "crosshair" },
            onMouseMove: (e) => {
              const svg = e.currentTarget.ownerSVGElement;
              if (!svg) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / Math.max(1, rect.width)));
              setScrubIndex(Math.round(ratio * (K6_SERIES_500VU.length - 1)));
            }
          }
        ),
        /* @__PURE__ */ import_react.default.createElement(
          "rect",
          {
            x: "840",
            y: "80",
            width: "640",
            height: "440",
            fill: "transparent",
            style: { cursor: "crosshair" },
            onMouseMove: (e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / Math.max(1, rect.width)));
              setScrubIndex(Math.round(ratio * (K6_SERIES_500VU.length - 1)));
            }
          }
        ),
        /* @__PURE__ */ import_react.default.createElement("text", { x: "400", y: "576", textAnchor: "middle", fontSize: "12", fill: "#94a3b8" }, "\u538B\u6D4B\u65F6\u95F4\uFF08\u5206\u949F\uFF0C0\u201330m\uFF0C\u60AC\u505C\u56FE\u8868\u4EFB\u610F\u4F4D\u7F6E\u5B9E\u65F6\u8054\u52A8\uFF09"),
        /* @__PURE__ */ import_react.default.createElement("text", { x: "1160", y: "576", textAnchor: "middle", fontSize: "12", fill: "#94a3b8" }, "\u538B\u6D4B\u65F6\u95F4\uFF08\u5206\u949F\uFF0C0\u201330m\uFF0C\u60AC\u505C\u56FE\u8868\u4EFB\u610F\u4F4D\u7F6E\u5B9E\u65F6\u8054\u52A8\uFF09")
      ))
    );
  };
  const renderKneeAndMemoryChart = () => {
    const w = 1560;
    const h = 620;
    const px1 = (vu) => 85 + vu / 500 * 600;
    const py1Q = (q) => 515 - Math.min(q, 120) / 120 * 400;
    const py1M = (m) => 515 - Math.min(m, 1) / 1 * 400;
    const px2 = (vu) => 865 + vu / 500 * 600;
    const py2R = (r) => 515 - Math.min(r, 1e3) / 1e3 * 400;
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
    const memWithTmpPts = sampleVus.map((v) => [
      v,
      computeOperatingModel(Math.max(1, v), { cleanTmpfs: false, vectorOptimized }).memory.totalUsedWithTmpMib
    ]);
    const memCleanTmpPts = sampleVus.map((v) => [
      v,
      computeOperatingModel(Math.max(1, v), { cleanTmpfs: true, vectorOptimized }).memory.totalUsedCleanTmpMib
    ]);
    const proxyOnlyPts = sampleVus.map((v) => [
      v,
      computeOperatingModel(Math.max(1, v), { cleanTmpfs, vectorOptimized }).memory.proxyCombinedMib
    ]);
    const pTmp = buildSvgPath(memWithTmpPts, px2, py2R);
    const pCln = buildSvgPath(memCleanTmpPts, px2, py2R);
    const pPrx = buildSvgPath(proxyOnlyPts, px2, py2R);
    return /* @__PURE__ */ import_react.default.createElement(
      "div",
      {
        style: {
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: "12px",
          padding: "14px 16px"
        }
      },
      /* @__PURE__ */ import_react.default.createElement(
        "div",
        {
          style: {
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            marginBottom: "10px"
          }
        },
        /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: "16px", fontWeight: 700, color: "#f8fafc" } }, "\u2462 \u5B9E\u6D4B\u5E76\u53D1\u62D0\u70B9\uFF08Little's Law Knee\uFF09\u4E0E ", model.memory.totalRamMib, " MiB \u5185\u5B58\u52A8\u6001\u7F29\u653E\u6A21\u578B"), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: "12px", color: "#94a3b8", marginTop: "2px" } }, "\u57FA\u4E8E 500 VU \u722C\u5761\u9636\u6BB5 1s \u7EA7\u5206\u7BB1\u91C7\u6837 \xB7 Proxy \u8FB9\u9645\u5185\u5B58\u659C\u7387 ", /* @__PURE__ */ import_react.default.createElement("code", null, "0.587 MiB/VU"), " \xB7 \u70B9\u51FB\u6216\u62D6\u52A8\u56FE\u8868\u53EF\u76F4\u63A5\u8BBE\u5B9A\u76EE\u6807\u5E76\u53D1 VU")),
        /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: "8px", fontSize: "12px" } }, /* @__PURE__ */ import_react.default.createElement(
          "span",
          {
            style: {
              padding: "4px 10px",
              borderRadius: "6px",
              background: "rgba(56,189,248,0.14)",
              border: "1px solid rgba(56,189,248,0.4)",
              color: "#38bdf8",
              fontFamily: "monospace"
            }
          },
          "\u5F53\u524D ",
          model.vu,
          " VU: \u722C\u5761 ",
          model.rampQps,
          " req/s \xB7 \u8FB9\u9645\u6548\u7387 ",
          model.marginalEfficiency,
          " QPS/VU"
        ), /* @__PURE__ */ import_react.default.createElement(
          "span",
          {
            style: {
              padding: "4px 10px",
              borderRadius: "6px",
              background: "rgba(52,211,153,0.14)",
              border: "1px solid rgba(52,211,153,0.4)",
              color: "#34d399",
              fontFamily: "monospace"
            }
          },
          "75% RAM \u5B89\u5168\u4E0A\u9650: ",
          model.memory.maxSafeVu75,
          " VU \xB7 80% \u544A\u8B66\u4E0A\u9650: ",
          model.memory.maxSafeVu80,
          " VU"
        ))
      ),
      /* @__PURE__ */ import_react.default.createElement("div", { style: { overflowX: "auto" } }, /* @__PURE__ */ import_react.default.createElement(
        "svg",
        {
          viewBox: `0 0 ${w} ${h}`,
          style: { width: "100%", minWidth: "1020px", height: "auto", display: "block", userSelect: "none" }
        },
        /* @__PURE__ */ import_react.default.createElement("rect", { x: "16", y: "16", width: "745", height: "585", rx: "10", fill: "#0b1120", stroke: "#1e293b" }),
        /* @__PURE__ */ import_react.default.createElement("rect", { x: "795", y: "16", width: "749", height: "585", rx: "10", fill: "#0b1120", stroke: "#1e293b" }),
        /* @__PURE__ */ import_react.default.createElement("text", { x: "85", y: "48", fontSize: "14", fontWeight: "700", fill: "#f8fafc" }, "A. \u722C\u5761\u9636\u6BB5 QPS \u541E\u5410 vs \u8FB9\u9645\u6548\u7387 (QPS/VU) \u62D0\u70B9 (\u70B9\u51FB\u8BBE\u5B9A\u5E76\u53D1)"),
        /* @__PURE__ */ import_react.default.createElement("text", { x: "865", y: "48", fontSize: "14", fontWeight: "700", fill: "#f8fafc" }, "B. \u5185\u5B58\u968F VU \u7EBF\u6027\u7F29\u653E\u6A21\u578B\u4E0E ", model.memory.totalRamMib, " MiB OOM \u5B89\u5168\u4E0A\u9650"),
        /* @__PURE__ */ import_react.default.createElement("rect", { x: px1(100), y: "95", width: px1(150) - px1(100), height: "420", fill: "rgba(52,211,153,0.10)" }),
        /* @__PURE__ */ import_react.default.createElement(
          "line",
          {
            x1: px1(150),
            y1: "95",
            x2: px1(150),
            y2: "515",
            stroke: "#34d399",
            strokeWidth: "1.5",
            strokeDasharray: "5 3"
          }
        ),
        /* @__PURE__ */ import_react.default.createElement("text", { x: px1(125), y: "114", textAnchor: "middle", fontSize: "11", fontWeight: "700", fill: "#34d399" }, "\u751C\u871C\u533A 100-150 VU"),
        /* @__PURE__ */ import_react.default.createElement(
          "line",
          {
            x1: px1(200),
            y1: "95",
            x2: px1(200),
            y2: "515",
            stroke: "#fb7185",
            strokeWidth: "1.8",
            strokeDasharray: "5 3"
          }
        ),
        /* @__PURE__ */ import_react.default.createElement("text", { x: px1(206), y: "132", fontSize: "11", fontWeight: "700", fill: "#fb7185" }, "200 VU \u6392\u961F\u62D0\u70B9"),
        /* @__PURE__ */ import_react.default.createElement("text", { x: px1(206), y: "148", fontSize: "10", fill: "#fda4af" }, "QPS/VU \u8DCC\u81F3 0.424"),
        [0, 30, 60, 90, 120].map((q) => {
          const y = py1Q(q);
          return /* @__PURE__ */ import_react.default.createElement("g", { key: `k1-${q}` }, /* @__PURE__ */ import_react.default.createElement("line", { x1: "85", y1: y, x2: "685", y2: y, stroke: "#1e293b" }), /* @__PURE__ */ import_react.default.createElement("text", { x: "76", y: y + 4, textAnchor: "end", fontSize: "11", fill: "#38bdf8" }, q));
        }),
        [0, 0.25, 0.5, 0.75, 1].map((mVal) => {
          const y = py1M(mVal);
          return /* @__PURE__ */ import_react.default.createElement("text", { key: `m1-${mVal}`, x: "694", y: y + 4, textAnchor: "start", fontSize: "11", fill: "#fbbf24" }, mVal.toFixed(2));
        }),
        [0, 200, 400, 600, 800, 1e3].map((r) => {
          const y = py2R(r);
          return /* @__PURE__ */ import_react.default.createElement("g", { key: `r2-${r}` }, /* @__PURE__ */ import_react.default.createElement("line", { x1: "865", y1: y, x2: "1465", y2: y, stroke: "#1e293b" }), /* @__PURE__ */ import_react.default.createElement("text", { x: "856", y: y + 4, textAnchor: "end", fontSize: "11", fill: "#94a3b8" }, r));
        }),
        [0, 100, 150, 200, 300, 400, 500].map((vu) => /* @__PURE__ */ import_react.default.createElement("g", { key: `kxt-${vu}` }, /* @__PURE__ */ import_react.default.createElement("line", { x1: px1(vu), y1: "95", x2: px1(vu), y2: "515", stroke: "#1e293b", strokeDasharray: "3 4" }), /* @__PURE__ */ import_react.default.createElement("text", { x: px1(vu), y: "536", textAnchor: "middle", fontSize: "11", fill: "#94a3b8" }, vu), /* @__PURE__ */ import_react.default.createElement("line", { x1: px2(vu), y1: "95", x2: px2(vu), y2: "515", stroke: "#1e293b", strokeDasharray: "3 4" }), /* @__PURE__ */ import_react.default.createElement("text", { x: px2(vu), y: "536", textAnchor: "middle", fontSize: "11", fill: "#94a3b8" }, vu))),
        /* @__PURE__ */ import_react.default.createElement("path", { d: qpsLine, fill: "none", stroke: "#38bdf8", strokeWidth: "2.8" }),
        /* @__PURE__ */ import_react.default.createElement("path", { d: effLine, fill: "none", stroke: "#fbbf24", strokeWidth: "2.8" }),
        K6_RAMP_CHECKPOINTS.map((p) => /* @__PURE__ */ import_react.default.createElement("g", { key: `cp-${p.targetVu}` }, /* @__PURE__ */ import_react.default.createElement("circle", { cx: px1(p.targetVu), cy: py1Q(p.qps), r: "4", fill: "#38bdf8" }), /* @__PURE__ */ import_react.default.createElement("circle", { cx: px1(p.targetVu), cy: py1M(p.marginalQpsPerVu), r: "4", fill: "#fbbf24" }))),
        /* @__PURE__ */ import_react.default.createElement("line", { x1: px1(model.vu), y1: "95", x2: px1(model.vu), y2: "515", stroke: "#f8fafc", strokeWidth: "1.6" }),
        /* @__PURE__ */ import_react.default.createElement(
          "circle",
          {
            cx: px1(model.vu),
            cy: py1Q(model.rampQps),
            r: "6",
            fill: "#38bdf8",
            stroke: "#ffffff",
            strokeWidth: "2"
          }
        ),
        /* @__PURE__ */ import_react.default.createElement(
          "circle",
          {
            cx: px1(model.vu),
            cy: py1M(model.marginalEfficiency),
            r: "6",
            fill: "#fbbf24",
            stroke: "#ffffff",
            strokeWidth: "2"
          }
        ),
        /* @__PURE__ */ import_react.default.createElement(
          "line",
          {
            x1: "865",
            y1: py2R(model.memory.totalRamMib),
            x2: "1465",
            y2: py2R(model.memory.totalRamMib),
            stroke: "#ef4444",
            strokeWidth: "2"
          }
        ),
        /* @__PURE__ */ import_react.default.createElement(
          "text",
          {
            x: "1460",
            y: py2R(model.memory.totalRamMib) - 6,
            textAnchor: "end",
            fontSize: "11",
            fontWeight: "700",
            fill: "#ef4444"
          },
          "100% \u7269\u7406\u5185\u5B58 / OOM (",
          model.memory.totalRamMib,
          " MiB, 0 Swap)"
        ),
        /* @__PURE__ */ import_react.default.createElement(
          "line",
          {
            x1: "865",
            y1: py2R(model.memory.totalRamMib * 0.8),
            x2: "1465",
            y2: py2R(model.memory.totalRamMib * 0.8),
            stroke: "#f97316",
            strokeWidth: "1.5",
            strokeDasharray: "5 4"
          }
        ),
        /* @__PURE__ */ import_react.default.createElement(
          "text",
          {
            x: "875",
            y: py2R(model.memory.totalRamMib * 0.8) - 6,
            textAnchor: "start",
            fontSize: "11",
            fontWeight: "700",
            fill: "#fb923c"
          },
          "80% \u786C\u544A\u8B66\u7EBF (",
          (model.memory.totalRamMib * 0.8).toFixed(1),
          " MiB -> ~",
          model.memory.maxSafeVu80,
          " VU)"
        ),
        /* @__PURE__ */ import_react.default.createElement(
          "line",
          {
            x1: "865",
            y1: py2R(model.memory.totalRamMib * 0.75),
            x2: "1465",
            y2: py2R(model.memory.totalRamMib * 0.75),
            stroke: "#fbbf24",
            strokeWidth: "1.5",
            strokeDasharray: "5 4"
          }
        ),
        /* @__PURE__ */ import_react.default.createElement(
          "text",
          {
            x: "875",
            y: py2R(model.memory.totalRamMib * 0.75) + 14,
            textAnchor: "start",
            fontSize: "11",
            fontWeight: "700",
            fill: "#fbbf24"
          },
          "75% \u5B89\u5168\u4E0A\u9650 (",
          (model.memory.totalRamMib * 0.75).toFixed(1),
          " MiB -> ~",
          model.memory.maxSafeVu75,
          " VU)"
        ),
        /* @__PURE__ */ import_react.default.createElement(
          "path",
          {
            d: pTmp,
            fill: "none",
            stroke: "#fb7185",
            strokeWidth: cleanTmpfs ? "2.0" : "3.0",
            opacity: cleanTmpfs ? 0.65 : 1
          }
        ),
        /* @__PURE__ */ import_react.default.createElement(
          "path",
          {
            d: pCln,
            fill: "none",
            stroke: "#34d399",
            strokeWidth: cleanTmpfs ? "3.0" : "2.0",
            strokeDasharray: "6 3"
          }
        ),
        /* @__PURE__ */ import_react.default.createElement("path", { d: pPrx, fill: "none", stroke: "#38bdf8", strokeWidth: "2.5" }),
        /* @__PURE__ */ import_react.default.createElement("line", { x1: px2(model.vu), y1: "95", x2: px2(model.vu), y2: "515", stroke: "#f8fafc", strokeWidth: "1.6" }),
        /* @__PURE__ */ import_react.default.createElement(
          "circle",
          {
            cx: px2(model.vu),
            cy: py2R(model.memory.totalUsedMib),
            r: "6.5",
            fill: cleanTmpfs ? "#34d399" : "#fb7185",
            stroke: "#ffffff",
            strokeWidth: "2"
          }
        ),
        /* @__PURE__ */ import_react.default.createElement(
          "circle",
          {
            cx: px2(model.vu),
            cy: py2R(model.memory.proxyCombinedMib),
            r: "5.5",
            fill: "#38bdf8",
            stroke: "#ffffff",
            strokeWidth: "1.5"
          }
        ),
        /* @__PURE__ */ import_react.default.createElement(
          "text",
          {
            x: Math.min(1445, Math.max(940, px2(model.vu))),
            y: py2R(model.memory.totalUsedMib) - 12,
            textAnchor: "middle",
            fontSize: "11",
            fontWeight: "700",
            fill: "#f8fafc"
          },
          model.vu,
          " VU: ",
          model.memory.totalUsedMib,
          " MiB (",
          model.memory.ramPct,
          "%)"
        ),
        /* @__PURE__ */ import_react.default.createElement("rect", { x: "370", y: "425", width: "295", height: "62", rx: "8", fill: "#0f172a", fillOpacity: "0.92", stroke: "#334155" }),
        /* @__PURE__ */ import_react.default.createElement("line", { x1: "384", y1: "447", x2: "412", y2: "447", stroke: "#38bdf8", strokeWidth: "3" }),
        /* @__PURE__ */ import_react.default.createElement("text", { x: "420", y: "451", fontSize: "12", fill: "#e2e8f0" }, "\u722C\u5761\u541E\u5410\u91CF QPS (\u5DE6\u8F74 req/s)"),
        /* @__PURE__ */ import_react.default.createElement("line", { x1: "384", y1: "470", x2: "412", y2: "470", stroke: "#fbbf24", strokeWidth: "3" }),
        /* @__PURE__ */ import_react.default.createElement("text", { x: "420", y: "474", fontSize: "12", fill: "#e2e8f0" }, "\u8FB9\u9645\u6548\u7387 QPS/VU (\u53F3\u8F74)"),
        /* @__PURE__ */ import_react.default.createElement("rect", { x: "880", y: "102", width: "340", height: "82", rx: "8", fill: "#0f172a", fillOpacity: "0.92", stroke: "#334155" }),
        /* @__PURE__ */ import_react.default.createElement("line", { x1: "894", y1: "124", x2: "922", y2: "124", stroke: "#fb7185", strokeWidth: "3" }),
        /* @__PURE__ */ import_react.default.createElement("text", { x: "930", y: "128", fontSize: "11", fill: "#e2e8f0" }, "\u6574\u673A\u603B\u5185\u5B58\uFF08\u542B /tmp 75 MiB tmpfs\uFF09"),
        /* @__PURE__ */ import_react.default.createElement("line", { x1: "894", y1: "146", x2: "922", y2: "146", stroke: "#34d399", strokeWidth: "3", strokeDasharray: "6 3" }),
        /* @__PURE__ */ import_react.default.createElement("text", { x: "930", y: "150", fontSize: "11", fill: "#e2e8f0" }, "\u6574\u673A\u603B\u5185\u5B58\uFF08\u6E05\u7406 /tmp \u540E\u53EF\u591A\u6297 +120 VU\uFF09"),
        /* @__PURE__ */ import_react.default.createElement("line", { x1: "894", y1: "168", x2: "922", y2: "168", stroke: "#38bdf8", strokeWidth: "3" }),
        /* @__PURE__ */ import_react.default.createElement("text", { x: "930", y: "172", fontSize: "11", fill: "#e2e8f0" }, "\u4EC5 Fluxgate + xconnect-proxy-xray RSS (", model.memory.proxyCombinedMib, " MiB)"),
        /* @__PURE__ */ import_react.default.createElement(
          "rect",
          {
            x: "85",
            y: "95",
            width: "600",
            height: "420",
            fill: "transparent",
            style: { cursor: "pointer" },
            onClick: (e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = Math.max(0.02, Math.min(1, (e.clientX - rect.left) / Math.max(1, rect.width)));
              setTargetVu(Math.round(ratio * 500 / 5) * 5);
            }
          }
        ),
        /* @__PURE__ */ import_react.default.createElement(
          "rect",
          {
            x: "865",
            y: "95",
            width: "600",
            height: "420",
            fill: "transparent",
            style: { cursor: "pointer" },
            onClick: (e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = Math.max(0.02, Math.min(1, (e.clientX - rect.left) / Math.max(1, rect.width)));
              setTargetVu(Math.round(ratio * 500 / 5) * 5);
            }
          }
        ),
        /* @__PURE__ */ import_react.default.createElement("text", { x: "385", y: "574", textAnchor: "middle", fontSize: "12", fill: "#94a3b8" }, "\u5E76\u53D1\u865A\u62DF\u7528\u6237\u6570 (VUs\uFF0C\u70B9\u51FB\u4EFB\u610F\u4F4D\u7F6E\u5207\u6362\u76EE\u6807\u5E76\u53D1\u6C34\u4F4D)"),
        /* @__PURE__ */ import_react.default.createElement("text", { x: "1165", y: "574", textAnchor: "middle", fontSize: "12", fill: "#94a3b8" }, "\u5E76\u53D1\u865A\u62DF\u7528\u6237\u6570 (VUs\uFF0C\u70B9\u51FB\u4EFB\u610F\u4F4D\u7F6E\u5207\u6362\u76EE\u6807\u5E76\u53D1\u6C34\u4F4D)")
      ))
    );
  };
  const renderSloAndRoiChart = () => {
    const w = 1560;
    const h = 620;
    const py1 = (ms) => 510 - Math.min(ms, 5e3) / 5e3 * 395;
    const px2 = (vu) => 875 + (vu - 40) / 460 * 590;
    const roiVus = [40, 80, 100, 120, 150, 160, 200, 250, 300, 400, 500];
    const roiModels = roiVus.map(
      (v) => computeOperatingModel(v, {
        userMultiplier,
        cleanTmpfs,
        vectorOptimized,
        gbPerUserMonth,
        trafficBillingMode
      })
    );
    const maxRoiVal = Math.max(
      0.08,
      ...roiModels.map((m) => m.roi.tiers[12].activeTotalCostPerUserUsd)
    );
    const yAxisMax = maxRoiVal <= 0.1 ? 0.09 : maxRoiVal <= 0.25 ? 0.24 : maxRoiVal <= 0.8 ? 0.8 : maxRoiVal <= 2 ? 2 : Math.ceil(maxRoiVal * 1.1 * 10) / 10;
    const py2User = (usd) => 510 - Math.min(usd, yAxisMax) / yAxisMax * 395;
    const yTicks = [0, 0.25, 0.5, 0.75, 1].map((r) => Number((r * yAxisMax).toFixed(3)));
    const bars = [
      { label1: "40 VU", label2: "\u5B9E\u6D4B\u57FA\u7EBF", val: 207.1, col: "#34d399", vu: 40 },
      { label1: "120 VU", label2: "\u6700\u4F73\u751C\u70B9", val: 680, col: "#38bdf8", vu: 120 },
      { label1: "150 VU", label2: "\u62D0\u70B9\u524D", val: 950, col: "#38bdf8", vu: 150 },
      { label1: "200 VU", label2: "\u6392\u7A7A\u7EBF", val: 1800, col: "#fbbf24", vu: 200 },
      { label1: "500 VU", label2: "\u6781\u9650\u5B9E\u6D4B", val: 4591.6, col: "#fb7185", vu: 500 },
      {
        label1: `\u5F53\u524D ${model.vu} VU`,
        label2: "\u52A8\u6001\u4EFF\u771F",
        val: model.estimatedP95Ms,
        col: "#a78bfa",
        vu: model.vu
      }
    ];
    const l7Total = buildSvgPath(
      roiModels.map((m) => [m.vu, m.roi.tiers[7].activeTotalCostPerUserUsd]),
      px2,
      py2User
    );
    const l10Total = buildSvgPath(
      roiModels.map((m) => [m.vu, m.roi.tiers[10].activeTotalCostPerUserUsd]),
      px2,
      py2User
    );
    const l12Total = buildSvgPath(
      roiModels.map((m) => [m.vu, m.roi.tiers[12].activeTotalCostPerUserUsd]),
      px2,
      py2User
    );
    const l7ComputeOnly = buildSvgPath(
      roiModels.map((m) => [m.vu, m.roi.tiers[7].computeCostPerUserUsd]),
      px2,
      py2User
    );
    const clampedVuForRoiAxis = Math.max(40, Math.min(500, model.vu));
    const tableRows = [
      { vu: 40, tag: "40 VU \u4FDD\u5B88\u57FA\u7EBF", note: "PASS (207ms)" },
      { vu: 120, tag: "120 VU \u6700\u4F73\u751C\u70B9", note: "PASS (\u6700\u4F73 ROI)" },
      { vu: 150, tag: "150 VU \u62D0\u70B9\u524D\u4E0A\u9650", note: "P1 \u4E34\u754C\u89C2\u5BDF" },
      { vu: 160, tag: "160 VU \u8F6F\u4E0A\u9650", note: "P1 \u9884\u8B66\u7EBF" },
      { vu: 200, tag: "200 VU \u6392\u7A7A\u7EBF", note: "P2 \u6392\u961F\u62D0\u70B9\uFF08\u5207\u6D41\uFF09" },
      { vu: 500, tag: "500 VU \u6781\u9650\u538B\u6D4B", note: "P3 FAIL (4.59s, 89% RAM)" }
    ];
    return /* @__PURE__ */ import_react.default.createElement(
      "div",
      {
        style: {
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: "12px",
          padding: "14px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "14px"
        }
      },
      /* @__PURE__ */ import_react.default.createElement(
        "div",
        {
          style: {
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px"
          }
        },
        /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: "16px", fontWeight: 700, color: "#f8fafc" } }, "\u2463 P95 \u5EF6\u8FDF\u5206\u7EA7\u76D1\u63A7\u4E0A\u9650\u4E0E AWS Lightsail 2C1G ($7 / $10 / $12) \u8BA1\u7B97+\u6D41\u91CF\u5747\u644A\u52A8\u6001 ROI \u9762\u677F"), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: "12px", color: "#94a3b8", marginTop: "2px" } }, "\u6309 ", /* @__PURE__ */ import_react.default.createElement("strong", null, userMultiplier, "x"), " \u590D\u7528\u7CFB\u6570 + \u5355\u673A\u514D\u8D39\u914D\u989D ", /* @__PURE__ */ import_react.default.createElement("strong", null, "2 TB/\u6708 (2,048 GB \u2248 ", model.roi.includedGbPerUser, " GB/\u4EBA)"), " ", "+ \u4EBA\u5747 ", /* @__PURE__ */ import_react.default.createElement("strong", null, gbPerUserMonth, " GB/\u6708"), "\uFF08", trafficBillingMode === "pooled" ? `2C1G \u6D41\u91CF\u5305\u6C60\u5316 $${model.roi.tiers[selectedTier].pooledTrafficRatePerGb.toFixed(5)}/GB\uFF0C\u9700 ~${model.roi.pooledNodesNeeded} \u53F0\u6C60\u5316` : "\u5355\u673A\u786C\u6297 AWS \u8D85\u989D\u6D41\u91CF\u8D39 $0.09/GB\uFF08\u8D35 26.3 \u500D\uFF09", "\uFF09\u7EFC\u5408\u6D4B\u7B97")),
        /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" } }, [7, 10, 12].map((price) => /* @__PURE__ */ import_react.default.createElement(
          "button",
          {
            key: `tier-${price}`,
            onClick: () => setSelectedTier(price),
            style: {
              background: selectedTier === price ? "#059669" : "#1e293b",
              border: `1px solid ${selectedTier === price ? "#34d399" : "#334155"}`,
              color: "#ffffff",
              borderRadius: "6px",
              padding: "4px 10px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer"
            }
          },
          "$",
          price,
          "/\u6708 ",
          price === 7 ? "(\u6807\u51C6 IPv4 + 2TB)" : "(\u5BF9\u7167\u6863 + 2TB)"
        )))
      ),
      /* @__PURE__ */ import_react.default.createElement("div", { style: { overflowX: "auto" } }, /* @__PURE__ */ import_react.default.createElement(
        "svg",
        {
          viewBox: `0 0 ${w} ${h}`,
          style: { width: "100%", minWidth: "1020px", height: "auto", display: "block", userSelect: "none" }
        },
        /* @__PURE__ */ import_react.default.createElement("rect", { x: "16", y: "16", width: "745", height: "585", rx: "10", fill: "#0b1120", stroke: "#1e293b" }),
        /* @__PURE__ */ import_react.default.createElement("rect", { x: "795", y: "16", width: "749", height: "585", rx: "10", fill: "#0b1120", stroke: "#1e293b" }),
        /* @__PURE__ */ import_react.default.createElement("text", { x: "85", y: "48", fontSize: "14", fontWeight: "700", fill: "#f8fafc" }, "A. P95 \u5EF6\u8FDF\u9636\u68AF\u5BF9\u6BD4\u4E0E\u5206\u7EA7\u76D1\u63A7\u7EA2\u7EBF (\u542B\u5F53\u524D ", model.vu, " VU \u52A8\u6001\u67F1)"),
        /* @__PURE__ */ import_react.default.createElement("text", { x: "875", y: "48", fontSize: "14", fontWeight: "700", fill: "#f8fafc" }, "B. \u5355\u5728\u7EBF\u7528\u6237\u6708\u7EFC\u5408\u6210\u672C ($/\u4EBA/\u6708 @", userMultiplier, "x \xB7 \u8BA1\u7B97\u5747\u644A + ", gbPerUserMonth, "GB \u6D41\u91CF\u5747\u644A)"),
        [0, 800, 1500, 3e3, 4e3, 5e3].map((ms) => {
          const y = py1(ms);
          const col = ms === 800 ? "#fbbf24" : ms === 1500 ? "#f97316" : ms === 3e3 ? "#ef4444" : "#1e293b";
          const isSlo = ms === 800 || ms === 1500 || ms === 3e3;
          return /* @__PURE__ */ import_react.default.createElement("g", { key: `slo-${ms}` }, /* @__PURE__ */ import_react.default.createElement(
            "line",
            {
              x1: "85",
              y1: y,
              x2: "710",
              y2: y,
              stroke: col,
              strokeWidth: isSlo ? "1.6" : "1",
              strokeDasharray: isSlo ? "5 4" : void 0
            }
          ), /* @__PURE__ */ import_react.default.createElement("text", { x: "76", y: y + 4, textAnchor: "end", fontSize: "11", fill: isSlo ? col : "#94a3b8" }, ms));
        }),
        bars.map((b, idx) => {
          const bw = 64;
          const bx = 104 + idx * 98;
          const by = py1(b.val);
          const bh = 510 - by;
          const isCurrent = idx === bars.length - 1;
          return /* @__PURE__ */ import_react.default.createElement(
            "g",
            {
              key: `bar-${idx}`,
              style: { cursor: "pointer" },
              onClick: () => setTargetVu(b.vu)
            },
            /* @__PURE__ */ import_react.default.createElement(
              "rect",
              {
                x: bx,
                y: by,
                width: bw,
                height: bh,
                rx: "6",
                fill: b.col,
                fillOpacity: isCurrent ? "0.95" : "0.82",
                stroke: isCurrent ? "#ffffff" : "none",
                strokeWidth: isCurrent ? "2" : "0"
              }
            ),
            /* @__PURE__ */ import_react.default.createElement(
              "text",
              {
                x: bx + bw / 2,
                y: by - 8,
                textAnchor: "middle",
                fontSize: "11",
                fontWeight: "700",
                fill: b.col
              },
              Math.round(b.val),
              " ms"
            ),
            /* @__PURE__ */ import_react.default.createElement("text", { x: bx + bw / 2, y: "532", textAnchor: "middle", fontSize: "11", fontWeight: "600", fill: "#e2e8f0" }, b.label1),
            /* @__PURE__ */ import_react.default.createElement("text", { x: bx + bw / 2, y: "548", textAnchor: "middle", fontSize: "10", fill: "#94a3b8" }, b.label2)
          );
        }),
        /* @__PURE__ */ import_react.default.createElement("text", { x: "705", y: py1(800) - 5, textAnchor: "end", fontSize: "11", fontWeight: "700", fill: "#fbbf24" }, "P1 \u9884\u8B66: 800 ms"),
        /* @__PURE__ */ import_react.default.createElement("text", { x: "705", y: py1(1500) - 5, textAnchor: "end", fontSize: "11", fontWeight: "700", fill: "#fb923c" }, "P2 \u6269\u5BB9\u6392\u7A7A: 1500 ms"),
        /* @__PURE__ */ import_react.default.createElement("text", { x: "705", y: py1(3e3) - 5, textAnchor: "end", fontSize: "11", fontWeight: "700", fill: "#ef4444" }, "P3 \u5F3A\u5236\u7194\u65AD: 3000 ms"),
        /* @__PURE__ */ import_react.default.createElement("rect", { x: px2(120), y: "115", width: px2(160) - px2(120), height: "395", fill: "rgba(52,211,153,0.12)" }),
        /* @__PURE__ */ import_react.default.createElement(
          "text",
          {
            x: (px2(120) + px2(160)) / 2,
            y: "135",
            textAnchor: "middle",
            fontSize: "11",
            fontWeight: "700",
            fill: "#34d399"
          },
          "\u6700\u4F73 ROI \u533A\u95F4"
        ),
        /* @__PURE__ */ import_react.default.createElement("text", { x: (px2(120) + px2(160)) / 2, y: "151", textAnchor: "middle", fontSize: "10", fill: "#a7f3d0" }, "120-160 VU"),
        yTicks.map((usd) => {
          const y = py2User(usd);
          return /* @__PURE__ */ import_react.default.createElement("g", { key: `usd-${usd}` }, /* @__PURE__ */ import_react.default.createElement("line", { x1: "875", y1: y, x2: "1465", y2: y, stroke: "#1e293b" }), /* @__PURE__ */ import_react.default.createElement("text", { x: "866", y: y + 4, textAnchor: "end", fontSize: "11", fill: "#94a3b8" }, "$", usd.toFixed(yAxisMax > 0.5 ? 2 : 3)));
        }),
        [40, 120, 160, 200, 300, 400, 500].map((v) => {
          const x = px2(v);
          return /* @__PURE__ */ import_react.default.createElement("g", { key: `rvu-${v}` }, /* @__PURE__ */ import_react.default.createElement("line", { x1: x, y1: "115", x2: x, y2: "510", stroke: "#1e293b", strokeDasharray: "3 4" }), /* @__PURE__ */ import_react.default.createElement("text", { x, y: "534", textAnchor: "middle", fontSize: "11", fill: "#94a3b8" }, v));
        }),
        /* @__PURE__ */ import_react.default.createElement("path", { d: l7ComputeOnly, fill: "none", stroke: "#94a3b8", strokeWidth: "1.8", strokeDasharray: "5 3" }),
        /* @__PURE__ */ import_react.default.createElement("path", { d: l12Total, fill: "none", stroke: "#a78bfa", strokeWidth: selectedTier === 12 ? "3.4" : "2.2" }),
        /* @__PURE__ */ import_react.default.createElement("path", { d: l10Total, fill: "none", stroke: "#38bdf8", strokeWidth: selectedTier === 10 ? "3.4" : "2.2" }),
        /* @__PURE__ */ import_react.default.createElement("path", { d: l7Total, fill: "none", stroke: "#34d399", strokeWidth: selectedTier === 7 ? "3.4" : "2.2" }),
        /* @__PURE__ */ import_react.default.createElement(
          "line",
          {
            x1: px2(clampedVuForRoiAxis),
            y1: "115",
            x2: px2(clampedVuForRoiAxis),
            y2: "510",
            stroke: "#f8fafc",
            strokeWidth: "1.6"
          }
        ),
        /* @__PURE__ */ import_react.default.createElement(
          "circle",
          {
            cx: px2(clampedVuForRoiAxis),
            cy: py2User(model.roi.tiers[7].activeTotalCostPerUserUsd),
            r: "5.5",
            fill: "#34d399",
            stroke: "#ffffff",
            strokeWidth: "1.8"
          }
        ),
        /* @__PURE__ */ import_react.default.createElement(
          "circle",
          {
            cx: px2(clampedVuForRoiAxis),
            cy: py2User(model.roi.tiers[10].activeTotalCostPerUserUsd),
            r: "5.5",
            fill: "#38bdf8",
            stroke: "#ffffff",
            strokeWidth: "1.8"
          }
        ),
        /* @__PURE__ */ import_react.default.createElement(
          "circle",
          {
            cx: px2(clampedVuForRoiAxis),
            cy: py2User(model.roi.tiers[12].activeTotalCostPerUserUsd),
            r: "5.5",
            fill: "#a78bfa",
            stroke: "#ffffff",
            strokeWidth: "1.8"
          }
        ),
        /* @__PURE__ */ import_react.default.createElement("rect", { x: "1095", y: "118", width: "362", height: "106", rx: "8", fill: "#0f172a", fillOpacity: "0.92", stroke: "#334155" }),
        /* @__PURE__ */ import_react.default.createElement("line", { x1: "1108", y1: "138", x2: "1134", y2: "138", stroke: "#34d399", strokeWidth: "3" }),
        /* @__PURE__ */ import_react.default.createElement("text", { x: "1142", y: "142", fontSize: "11", fill: "#e2e8f0" }, "$7/\u6708 \u7EFC\u5408: $", model.roi.tiers[7].activeTotalCostPerUserUsd.toFixed(4), "/\u4EBA (\u7B97$", model.roi.tiers[7].computeCostPerUserUsd.toFixed(4), "+\u6D41$", model.roi.tiers[7].activeTrafficCostPerUserUsd.toFixed(4), ")"),
        /* @__PURE__ */ import_react.default.createElement("line", { x1: "1108", y1: "160", x2: "1134", y2: "160", stroke: "#38bdf8", strokeWidth: "3" }),
        /* @__PURE__ */ import_react.default.createElement("text", { x: "1142", y: "164", fontSize: "11", fill: "#e2e8f0" }, "$10/\u6708 \u7EFC\u5408: $", model.roi.tiers[10].activeTotalCostPerUserUsd.toFixed(4), "/\u4EBA (\u7B97$", model.roi.tiers[10].computeCostPerUserUsd.toFixed(4), "+\u6D41$", model.roi.tiers[10].activeTrafficCostPerUserUsd.toFixed(4), ")"),
        /* @__PURE__ */ import_react.default.createElement("line", { x1: "1108", y1: "182", x2: "1134", y2: "182", stroke: "#a78bfa", strokeWidth: "3" }),
        /* @__PURE__ */ import_react.default.createElement("text", { x: "1142", y: "186", fontSize: "11", fill: "#e2e8f0" }, "$12/\u6708 \u7EFC\u5408: $", model.roi.tiers[12].activeTotalCostPerUserUsd.toFixed(4), "/\u4EBA (\u7B97$", model.roi.tiers[12].computeCostPerUserUsd.toFixed(4), "+\u6D41$", model.roi.tiers[12].activeTrafficCostPerUserUsd.toFixed(4), ")"),
        /* @__PURE__ */ import_react.default.createElement("line", { x1: "1108", y1: "204", x2: "1134", y2: "204", stroke: "#94a3b8", strokeWidth: "2", strokeDasharray: "5 3" }),
        /* @__PURE__ */ import_react.default.createElement("text", { x: "1142", y: "208", fontSize: "10", fill: "#94a3b8" }, "\u865A\u7EBF: $7/\u6708 \u7EAF\u8BA1\u7B97\u5747\u644A\u57FA\u7EBF (2TB \u5305\u5185\u514D\u6D41 ", model.roi.includedGbPerUser, "GB/\u4EBA)"),
        /* @__PURE__ */ import_react.default.createElement(
          "rect",
          {
            x: "875",
            y: "115",
            width: "590",
            height: "395",
            fill: "transparent",
            style: { cursor: "pointer" },
            onClick: (e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / Math.max(1, rect.width)));
              setTargetVu(Math.round((40 + ratio * 460) / 5) * 5);
            }
          }
        ),
        /* @__PURE__ */ import_react.default.createElement("text", { x: "395", y: "576", textAnchor: "middle", fontSize: "12", fill: "#94a3b8" }, "\u70B9\u51FB\u4EFB\u610F\u67F1\u72B6\u56FE\u6216\u53F3\u4FA7\u66F2\u7EBF\u5207\u6362\u5E76\u53D1\u6863\u4F4D"),
        /* @__PURE__ */ import_react.default.createElement("text", { x: "1175", y: "576", textAnchor: "middle", fontSize: "12", fill: "#94a3b8" }, "\u8C03\u5EA6\u76EE\u6807\u5E76\u53D1 (VUs \xB7 2C1G \u6C60\u5316\u6D41\u91CF\u5747\u644A $0.00342/GB \u6BD4 AWS \u8D85\u989D $0.09/GB \u4FBF\u5B9C 26.3x)")
      )),
      /* @__PURE__ */ import_react.default.createElement("div", { style: { overflowX: "auto" } }, /* @__PURE__ */ import_react.default.createElement(
        "table",
        {
          style: {
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "12px",
            background: "#0b1120",
            borderRadius: "8px",
            overflow: "hidden"
          }
        },
        /* @__PURE__ */ import_react.default.createElement("thead", null, /* @__PURE__ */ import_react.default.createElement("tr", { style: { background: "#1e293b", color: "#cbd5e1", textAlign: "left" } }, /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "8px 10px" } }, "\u8FD0\u8425\u5E76\u53D1\u6C34\u4F4D (\u70B9\u51FB\u5207\u6362)"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "8px 10px" } }, "\u5728\u7EBF\u7528\u6237 (@", userMultiplier, "x)"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "8px 10px" } }, "2TB\u5305\u5185\u514D\u6D41\u914D\u989D"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "8px 10px", color: "#94a3b8" } }, "$7 \u7EAF\u8BA1\u7B97\u5747\u644A"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "8px 10px", color: "#fbbf24" } }, "$7 \u6D41\u91CF\u5747\u644A (@", gbPerUserMonth, "GB: \u6C60\u5316 vs \u8D85\u989D)"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "8px 10px", color: "#34d399" } }, "$7/\u6708 \u7EFC\u5408\u603B\u6210\u672C (", trafficBillingMode === "pooled" ? "\u6C60\u5316" : "\u8D85\u989D", ")"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "8px 10px", color: "#38bdf8" } }, "$10 / $12 \u7EFC\u5408\u603B\u6210\u672C"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "8px 10px" } }, "\u9884\u4F30 P95 / SLO \u72B6\u6001"))),
        /* @__PURE__ */ import_react.default.createElement("tbody", null, tableRows.map((row) => {
          const rm = computeOperatingModel(row.vu, {
            userMultiplier,
            cleanTmpfs,
            vectorOptimized,
            gbPerUserMonth,
            trafficBillingMode
          });
          const isSelected = Math.abs(model.vu - row.vu) < 8;
          const t7 = rm.roi.tiers[7];
          const t10 = rm.roi.tiers[10];
          const t12 = rm.roi.tiers[12];
          return /* @__PURE__ */ import_react.default.createElement(
            "tr",
            {
              key: `tbl-${row.vu}`,
              onClick: () => setTargetVu(row.vu),
              style: {
                borderTop: "1px solid #1e293b",
                background: isSelected ? "rgba(56,189,248,0.12)" : "transparent",
                cursor: "pointer"
              }
            },
            /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "7px 10px", fontWeight: 700, color: isSelected ? "#38bdf8" : "#f8fafc" } }, isSelected ? "\u25B6 " : "", row.tag),
            /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "7px 10px", fontFamily: "monospace" } }, "~", rm.onlineUsers, " \u4EBA"),
            /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "7px 10px", fontFamily: "monospace", color: "#cbd5e1" } }, rm.roi.includedGbPerUser, " GB/\u4EBA", " ", /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#64748b", fontSize: "11px" } }, "(\u8D85 ", rm.roi.extraGbPerUser, "G)")),
            /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "7px 10px", fontFamily: "monospace", color: "#cbd5e1" } }, "$", t7.computeCostPerUserUsd.toFixed(4), "/\u4EBA"),
            /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "7px 10px", fontFamily: "monospace", color: "#fde68a" } }, "+$", t7.trafficCostPerUserPooledUsd.toFixed(4), " \u6C60\u5316 |", " ", /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#fca5a5" } }, "+$", t7.trafficCostPerUserOverageUsd.toFixed(4), " \u8D85\u989D")),
            /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "7px 10px", fontFamily: "monospace", color: "#a7f3d0" } }, /* @__PURE__ */ import_react.default.createElement("strong", null, "$", t7.activeTotalCostPerUserUsd.toFixed(4), "/\u4EBA/\u6708"), " ", /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#64748b", fontSize: "11px" } }, "($", t7.costPer1MReqUsd.toFixed(4), "/1M)")),
            /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "7px 10px", fontFamily: "monospace", color: "#bae6fd" } }, "$", t10.activeTotalCostPerUserUsd.toFixed(4), " |", " ", /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#ddd6fe" } }, "$", t12.activeTotalCostPerUserUsd.toFixed(4))),
            /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "7px 10px" } }, /* @__PURE__ */ import_react.default.createElement(
              "span",
              {
                style: {
                  padding: "2px 7px",
                  borderRadius: "4px",
                  background: `${rm.sloColor}22`,
                  color: rm.sloColor,
                  fontWeight: 700,
                  fontSize: "11px"
                }
              },
              rm.estimatedP95Ms,
              " ms \xB7 ",
              row.note
            ))
          );
        }))
      ))
    );
  };
  const renderTopologySection = () => {
    const layerBtns = [
      { id: "all", label: "\u5168\u90E8\u94FE\u8DEF" },
      { id: "control", label: "\u2460 \u63A7\u5236\u9762\u94FE\u8DEF" },
      { id: "proxy", label: "\u2461 Proxy \u6570\u636E\u94FE\u8DEF" },
      { id: "gateway", label: "\u2462 Gateway \u94FE\u8DEF" },
      { id: "obs", label: "\u2463 \u76D1\u63A7\u4E0E\u8BA1\u8D39\u94FE\u8DEF" }
    ];
    return /* @__PURE__ */ import_react.default.createElement(
      "div",
      {
        style: {
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: "12px",
          padding: "14px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }
      },
      /* @__PURE__ */ import_react.default.createElement(
        "div",
        {
          style: {
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px"
          }
        },
        /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: "16px", fontWeight: 700, color: "#f8fafc" } }, "\u2460 XConnect \u8FB9\u7F18\u8282\u70B9\u4E94\u5927\u6838\u5FC3\u670D\u52A1\u52A8\u6001\u94FE\u8DEF\u62D3\u6251 (", resolvedNodeName, ")"), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: "12px", color: "#94a3b8", marginTop: "2px" } }, "\u7269\u7406\u5185\u5B58 ", /* @__PURE__ */ import_react.default.createElement("code", null, model.memory.totalRamMib, " MiB"), " \xB7 \u5F53\u524D ", model.vu, " VU \u9884\u8BA1\u6574\u673A\u5DF2\u7528", " ", /* @__PURE__ */ import_react.default.createElement("strong", { style: { color: model.sloColor } }, model.memory.totalUsedMib, " MiB"), " \xB7 \u53EF\u7528", " ", /* @__PURE__ */ import_react.default.createElement("strong", { style: { color: "#34d399" } }, model.memory.availMib, " MiB"), " \xB7 5 \u5927\u6838\u5FC3\u670D\u52A1\u603B RSS", " ", /* @__PURE__ */ import_react.default.createElement("strong", { style: { color: "#38bdf8" } }, model.memory.coreFiveTotalRssMib, " MiB"), " \xB7 \u70B9\u51FB\u4EFB\u610F\u670D\u52A1\u8282\u70B9\u67E5\u770B Playbook Role \u4E0E\u914D\u7F6E\u8BE6\u60C5")),
        /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: "6px" } }, layerBtns.map((b) => {
          const active = activeLayer === b.id;
          return /* @__PURE__ */ import_react.default.createElement(
            "button",
            {
              key: b.id,
              onClick: () => setActiveLayer(b.id),
              style: {
                background: active ? "#2563eb" : "#1e293b",
                border: `1px solid ${active ? "#60a5fa" : "#334155"}`,
                color: "#ffffff",
                borderRadius: "6px",
                padding: "5px 10px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer"
              }
            },
            b.label
          );
        }))
      ),
      /* @__PURE__ */ import_react.default.createElement("div", { style: { overflowX: "auto", background: "#0b1120", borderRadius: "10px", border: "1px solid #1e293b", padding: "10px" } }, /* @__PURE__ */ import_react.default.createElement(
        "svg",
        {
          viewBox: "0 0 1560 920",
          style: { width: "100%", minWidth: "1080px", height: "auto", display: "block", userSelect: "none" }
        },
        /* @__PURE__ */ import_react.default.createElement("defs", null, /* @__PURE__ */ import_react.default.createElement("marker", { id: "xc-arrow-cyan", viewBox: "0 0 10 10", refX: "9", refY: "5", markerWidth: "7", markerHeight: "7", orient: "auto-start-reverse" }, /* @__PURE__ */ import_react.default.createElement("path", { d: "M 0 1 L 10 5 L 0 9 z", fill: "#38bdf8" })), /* @__PURE__ */ import_react.default.createElement("marker", { id: "xc-arrow-emerald", viewBox: "0 0 10 10", refX: "9", refY: "5", markerWidth: "7", markerHeight: "7", orient: "auto-start-reverse" }, /* @__PURE__ */ import_react.default.createElement("path", { d: "M 0 1 L 10 5 L 0 9 z", fill: "#34d399" })), /* @__PURE__ */ import_react.default.createElement("marker", { id: "xc-arrow-amber", viewBox: "0 0 10 10", refX: "9", refY: "5", markerWidth: "7", markerHeight: "7", orient: "auto-start-reverse" }, /* @__PURE__ */ import_react.default.createElement("path", { d: "M 0 1 L 10 5 L 0 9 z", fill: "#fbbf24" })), /* @__PURE__ */ import_react.default.createElement("marker", { id: "xc-arrow-violet", viewBox: "0 0 10 10", refX: "9", refY: "5", markerWidth: "7", markerHeight: "7", orient: "auto-start-reverse" }, /* @__PURE__ */ import_react.default.createElement("path", { d: "M 0 1 L 10 5 L 0 9 z", fill: "#a78bfa" })), /* @__PURE__ */ import_react.default.createElement("marker", { id: "xc-arrow-rose", viewBox: "0 0 10 10", refX: "9", refY: "5", markerWidth: "7", markerHeight: "7", orient: "auto-start-reverse" }, /* @__PURE__ */ import_react.default.createElement("path", { d: "M 0 1 L 10 5 L 0 9 z", fill: "#fb7185" }))),
        /* @__PURE__ */ import_react.default.createElement("rect", { x: "20", y: "20", width: "270", height: "880", rx: "14", fill: "rgba(148,163,184,0.06)", stroke: "rgba(148,163,184,0.28)", strokeDasharray: "6 4" }),
        /* @__PURE__ */ import_react.default.createElement("text", { x: "38", y: "48", fontSize: "13", fontWeight: "700", fill: "#cbd5e1" }, "\u5916\u90E8\u5BA2\u6237\u7AEF / \u4E91\u7AEF\u4E2D\u5FC3"),
        /* @__PURE__ */ import_react.default.createElement(
          "rect",
          {
            x: "315",
            y: "20",
            width: "935",
            height: "880",
            rx: "16",
            fill: "rgba(56,189,248,0.04)",
            stroke: model.sloColor,
            strokeWidth: "1.8"
          }
        ),
        /* @__PURE__ */ import_react.default.createElement("text", { x: "335", y: "48", fontSize: "14", fontWeight: "700", fill: "#38bdf8" }, "\u8FB9\u7F18\u8282\u70B9\uFF1A", resolvedNodeName, "\uFF084 \u8FDB\u7A0B\u4E25\u683C\u9694\u79BB + Vector \u6C47\u805A \xB7 \u5F53\u524D\u6C34\u4F4D ", model.vu, " VU / ", model.onlineUsers, " \u5728\u7EBF\u7528\u6237 \xB7 ", model.sloLabel, "\uFF09"),
        /* @__PURE__ */ import_react.default.createElement("rect", { x: "1275", y: "20", width: "265", height: "880", rx: "14", fill: "rgba(148,163,184,0.06)", stroke: "rgba(148,163,184,0.28)", strokeDasharray: "6 4" }),
        /* @__PURE__ */ import_react.default.createElement("text", { x: "1293", y: "48", fontSize: "13", fontWeight: "700", fill: "#cbd5e1" }, "\u4E0A\u6E38\u51FA\u7AD9\u4E0E\u4E2D\u5FC3\u5B58\u50A8"),
        /* @__PURE__ */ import_react.default.createElement("rect", { x: "335", y: "66", width: "895", height: "170", rx: "12", fill: "rgba(251,191,36,0.05)", stroke: "rgba(251,191,36,0.28)" }),
        /* @__PURE__ */ import_react.default.createElement("text", { x: "352", y: "88", fontSize: "12", fontWeight: "700", fill: "#fbbf24" }, "\u2460 \u63A7\u5236\u9762 (Control Plane)"),
        /* @__PURE__ */ import_react.default.createElement("rect", { x: "335", y: "254", width: "895", height: "400", rx: "12", fill: "rgba(52,211,153,0.04)", stroke: "rgba(52,211,153,0.25)" }),
        /* @__PURE__ */ import_react.default.createElement("text", { x: "352", y: "276", fontSize: "12", fontWeight: "700", fill: "#34d399" }, "\u2461 \u6570\u636E\u9762 (L7 Ingress + Proxy / Gateway \u72EC\u7ACB\u5B9E\u4F8B \xB7 \u5B9E\u65F6\u541E\u5410 ", model.steadyQps, " req/s \xB7 P95 ~", model.estimatedP95Ms, " ms)"),
        /* @__PURE__ */ import_react.default.createElement("rect", { x: "335", y: "672", width: "895", height: "212", rx: "12", fill: "rgba(167,139,250,0.05)", stroke: "rgba(167,139,250,0.28)" }),
        /* @__PURE__ */ import_react.default.createElement("text", { x: "352", y: "694", fontSize: "12", fontWeight: "700", fill: "#a78bfa" }, "\u2462 \u6838\u5FC3\u76D1\u63A7\u4E0E\u8BA1\u8D39\u6C47\u805A\u9762 (Observability & Billing)"),
        /* @__PURE__ */ import_react.default.createElement("g", { opacity: isLayerVisible("control") ? 1 : 0.16 }, /* @__PURE__ */ import_react.default.createElement("rect", { x: "40", y: "95", width: "230", height: "106", rx: "10", fill: "#0f172a", stroke: "#fbbf24", strokeWidth: "2" }), /* @__PURE__ */ import_react.default.createElement("text", { x: "56", y: "122", fontSize: "14", fontWeight: "700", fill: "#f8fafc" }, "accounts.svc.plus"), /* @__PURE__ */ import_react.default.createElement("text", { x: "56", y: "143", fontSize: "12", fill: "#cbd5e1" }, "\u63A7\u5236\u9762 SaaS / \u8C03\u5EA6\u4E2D\u5FC3"), /* @__PURE__ */ import_react.default.createElement("text", { x: "56", y: "164", fontSize: "11", fontFamily: "monospace", fill: "#fbbf24" }, "Users \xB7 Routing \xB7 Gateway Policy"), /* @__PURE__ */ import_react.default.createElement("text", { x: "56", y: "182", fontSize: "11", fontFamily: "monospace", fill: "#94a3b8" }, "HTTPS / Sync 5m + SSE")),
        /* @__PURE__ */ import_react.default.createElement("g", { opacity: isLayerVisible("proxy") ? 1 : 0.16 }, /* @__PURE__ */ import_react.default.createElement("rect", { x: "40", y: "295", width: "230", height: "104", rx: "10", fill: "#0f172a", stroke: "#38bdf8", strokeWidth: "2" }), /* @__PURE__ */ import_react.default.createElement("text", { x: "56", y: "322", fontSize: "14", fontWeight: "700", fill: "#f8fafc" }, "\u4EE3\u7406\u5BA2\u6237\u7AEF (XHTTP \xB7 ", model.vu, " VU)"), /* @__PURE__ */ import_react.default.createElement("text", { x: "56", y: "343", fontSize: "12", fill: "#cbd5e1" }, "VLESS + XHTTP + TLS (fp=chrome)"), /* @__PURE__ */ import_react.default.createElement("text", { x: "56", y: "364", fontSize: "11", fontFamily: "monospace", fill: "#38bdf8" }, resolvedNodeName, ":443"), /* @__PURE__ */ import_react.default.createElement("text", { x: "56", y: "382", fontSize: "11", fontFamily: "monospace", fill: "#94a3b8" }, "path=/split \xB7 alpn=h2,http/1.1")),
        /* @__PURE__ */ import_react.default.createElement("g", { opacity: isLayerVisible("proxy") ? 1 : 0.16 }, /* @__PURE__ */ import_react.default.createElement("rect", { x: "40", y: "425", width: "230", height: "92", rx: "10", fill: "#0f172a", stroke: "#34d399", strokeWidth: "2" }), /* @__PURE__ */ import_react.default.createElement("text", { x: "56", y: "452", fontSize: "14", fontWeight: "700", fill: "#f8fafc" }, "\u4EE3\u7406\u5BA2\u6237\u7AEF (TCP Vision)"), /* @__PURE__ */ import_react.default.createElement("text", { x: "56", y: "473", fontSize: "12", fill: "#cbd5e1" }, "VLESS + TLS + xtls-rprx-vision"), /* @__PURE__ */ import_react.default.createElement("text", { x: "56", y: "494", fontSize: "11", fontFamily: "monospace", fill: "#34d399" }, resolvedNodeName, ":1443")),
        /* @__PURE__ */ import_react.default.createElement("g", { opacity: isLayerVisible("gateway") ? 1 : 0.16 }, /* @__PURE__ */ import_react.default.createElement("rect", { x: "40", y: "545", width: "230", height: "98", rx: "10", fill: "#0f172a", stroke: "#fb7185", strokeWidth: "2" }), /* @__PURE__ */ import_react.default.createElement("text", { x: "56", y: "572", fontSize: "14", fontWeight: "700", fill: "#f8fafc" }, "\u96F6\u4FE1\u4EFB Gateway \u5BA2\u6237\u7AEF"), /* @__PURE__ */ import_react.default.createElement("text", { x: "56", y: "593", fontSize: "12", fill: "#cbd5e1" }, "XConnect Overlay Tunnel"), /* @__PURE__ */ import_react.default.createElement("text", { x: "56", y: "614", fontSize: "11", fontFamily: "monospace", fill: "#fb7185" }, "jp-xconnect-gateway-02.svc.plus:443"), /* @__PURE__ */ import_react.default.createElement("text", { x: "56", y: "631", fontSize: "11", fontFamily: "monospace", fill: "#94a3b8" }, "path=/xconnect")),
        /* @__PURE__ */ import_react.default.createElement("g", { opacity: isLayerVisible("obs") ? 1 : 0.16 }, /* @__PURE__ */ import_react.default.createElement("rect", { x: "40", y: "715", width: "230", height: "118", rx: "10", fill: "#0f172a", stroke: "#a78bfa", strokeWidth: "1.5" }), /* @__PURE__ */ import_react.default.createElement("text", { x: "56", y: "742", fontSize: "14", fontWeight: "700", fill: "#f8fafc" }, "GitOps + Playbooks"), /* @__PURE__ */ import_react.default.createElement("text", { x: "56", y: "763", fontSize: "12", fill: "#cbd5e1" }, "\u6BCF\u65E5\u5B9A\u65F6\u81EA\u6211\u6536\u655B (ansible-pull)"), /* @__PURE__ */ import_react.default.createElement("text", { x: "56", y: "784", fontSize: "11", fontFamily: "monospace", fill: "#a78bfa" }, "xconnect-regional-pools.yaml"), /* @__PURE__ */ import_react.default.createElement("text", { x: "56", y: "802", fontSize: "11", fontFamily: "monospace", fill: "#cbd5e1" }, "sysctl / fluxgate / xray / journald"), /* @__PURE__ */ import_react.default.createElement("text", { x: "56", y: "820", fontSize: "11", fontFamily: "monospace", fill: "#94a3b8" }, "\u5DF2\u505C\u975E\u6838\u5FC3: fail2ban/unattended/auditd")),
        /* @__PURE__ */ import_react.default.createElement(
          "g",
          {
            opacity: isLayerVisible("control") ? 1 : 0.16,
            style: { cursor: "pointer" },
            onClick: () => setSelectedServiceId("edge-agent")
          },
          /* @__PURE__ */ import_react.default.createElement(
            "rect",
            {
              x: "480",
              y: "102",
              width: "540",
              height: "118",
              rx: "12",
              fill: "#0f172a",
              stroke: "#fbbf24",
              strokeWidth: selectedServiceId === "edge-agent" ? "3.5" : "2.5"
            }
          ),
          /* @__PURE__ */ import_react.default.createElement("text", { x: "500", y: "129", fontSize: "15", fontWeight: "700", fill: "#f8fafc" }, "1. xconnect-edge-agent.service"),
          /* @__PURE__ */ import_react.default.createElement("rect", { x: "885", y: "110", width: "120", height: "22", rx: "6", fill: "rgba(251,191,36,0.18)" }),
          /* @__PURE__ */ import_react.default.createElement("text", { x: "945", y: "125", textAnchor: "middle", fontSize: "11", fontWeight: "700", fill: "#fbbf24" }, "RSS ", edgeAgentRss, " MB"),
          /* @__PURE__ */ import_react.default.createElement("text", { x: "500", y: "150", fontSize: "12", fontFamily: "monospace", fill: "#cbd5e1" }, "/usr/local/bin/agent-proxy -config /etc/agent/account-agent.yaml"),
          /* @__PURE__ */ import_react.default.createElement("text", { x: "500", y: "171", fontSize: "12", fill: "#e2e8f0" }, '\u2022 01-agent-proxy.yaml -> \u5355\u4E00\u76EE\u6807 "proxy" (/usr/local/etc/xray/config.json \xB7 14 clients)'),
          /* @__PURE__ */ import_react.default.createElement("text", { x: "500", y: "190", fontSize: "12", fill: "#e2e8f0" }, "\u2022 02-xconnect-gateway.yaml -> jp-xconnect-gateway-02 (net-jp-xconnect-02)"),
          /* @__PURE__ */ import_react.default.createElement("text", { x: "500", y: "209", fontSize: "11", fontFamily: "monospace", fill: "#fbbf24" }, "Role: roles/vhosts/xconnect-edge-agent \xB7 SIGHUP \u70ED\u91CD\u8F7D")
        ),
        /* @__PURE__ */ import_react.default.createElement(
          "g",
          {
            opacity: isLayerVisible("proxy,gateway,obs") ? 1 : 0.16,
            style: { cursor: "pointer" },
            onClick: () => setSelectedServiceId("fluxgate")
          },
          /* @__PURE__ */ import_react.default.createElement(
            "rect",
            {
              x: "355",
              y: "300",
              width: "295",
              height: "315",
              rx: "12",
              fill: "#0f172a",
              stroke: "#38bdf8",
              strokeWidth: selectedServiceId === "fluxgate" ? "3.5" : "2.5"
            }
          ),
          /* @__PURE__ */ import_react.default.createElement("text", { x: "373", y: "328", fontSize: "15", fontWeight: "700", fill: "#f8fafc" }, "2. fluxgate.service"),
          /* @__PURE__ */ import_react.default.createElement("rect", { x: "520", y: "309", width: "116", height: "22", rx: "6", fill: "rgba(56,189,248,0.18)" }),
          /* @__PURE__ */ import_react.default.createElement("text", { x: "578", y: "324", textAnchor: "middle", fontSize: "11", fontWeight: "700", fill: "#38bdf8" }, "RSS ", fluxgateRss, " MB"),
          /* @__PURE__ */ import_react.default.createElement("text", { x: "373", y: "350", fontSize: "12", fontFamily: "monospace", fill: "#cbd5e1" }, "fluxgate v0.2.1 \xB7 L7 Ingress"),
          /* @__PURE__ */ import_react.default.createElement("text", { x: "373", y: "372", fontSize: "12", fontFamily: "monospace", fill: "#38bdf8" }, "Listen :443 (TLS *.svc.plus)"),
          /* @__PURE__ */ import_react.default.createElement("text", { x: "373", y: "391", fontSize: "11", fontFamily: "monospace", fill: "#94a3b8" }, "Metrics: 127.0.0.1:9102/metrics"),
          /* @__PURE__ */ import_react.default.createElement("rect", { x: "371", y: "408", width: "263", height: "62", rx: "8", fill: "rgba(56,189,248,0.08)", stroke: "rgba(56,189,248,0.35)" }),
          /* @__PURE__ */ import_react.default.createElement("text", { x: "382", y: "427", fontSize: "12", fontWeight: "600", fill: "#38bdf8" }, "Route A: /split/* (Proxy XHTTP)"),
          /* @__PURE__ */ import_react.default.createElement("text", { x: "382", y: "445", fontSize: "11", fontFamily: "monospace", fill: "#cbd5e1" }, "H2 Win 4MiB/16MiB \xB7 flush -1"),
          /* @__PURE__ */ import_react.default.createElement("text", { x: "382", y: "461", fontSize: "11", fontFamily: "monospace", fill: "#cbd5e1" }, "-> unix:///dev/shm/xray.sock"),
          /* @__PURE__ */ import_react.default.createElement("rect", { x: "371", y: "482", width: "263", height: "58", rx: "8", fill: "rgba(251,113,133,0.08)", stroke: "rgba(251,113,133,0.35)" }),
          /* @__PURE__ */ import_react.default.createElement("text", { x: "382", y: "501", fontSize: "12", fontWeight: "600", fill: "#fb7185" }, "Route B: /xconnect/* (Gateway)"),
          /* @__PURE__ */ import_react.default.createElement("text", { x: "382", y: "518", fontSize: "11", fontFamily: "monospace", fill: "#cbd5e1" }, "h2c \xB7 flush -1 \xB7 strip x_padding"),
          /* @__PURE__ */ import_react.default.createElement("text", { x: "382", y: "534", fontSize: "11", fontFamily: "monospace", fill: "#cbd5e1" }, "-> unix:///run/xconnect-gateway/xray.sock"),
          /* @__PURE__ */ import_react.default.createElement("rect", { x: "371", y: "552", width: "263", height: "48", rx: "8", fill: "rgba(148,163,184,0.08)", stroke: "rgba(148,163,184,0.3)" }),
          /* @__PURE__ */ import_react.default.createElement("text", { x: "382", y: "571", fontSize: "11", fontWeight: "600", fill: "#e2e8f0" }, "Route C: /xray-exporter/*"),
          /* @__PURE__ */ import_react.default.createElement("text", { x: "382", y: "588", fontSize: "11", fontFamily: "monospace", fill: "#cbd5e1" }, "-> http://127.0.0.1:8080")
        ),
        /* @__PURE__ */ import_react.default.createElement(
          "g",
          {
            opacity: isLayerVisible("proxy,control,obs") ? 1 : 0.16,
            style: { cursor: "pointer" },
            onClick: () => setSelectedServiceId("proxy-xray")
          },
          /* @__PURE__ */ import_react.default.createElement(
            "rect",
            {
              x: "735",
              y: "294",
              width: "475",
              height: "202",
              rx: "12",
              fill: "#0f172a",
              stroke: "#34d399",
              strokeWidth: selectedServiceId === "proxy-xray" ? "3.5" : "2.5"
            }
          ),
          /* @__PURE__ */ import_react.default.createElement("text", { x: "755", y: "322", fontSize: "15", fontWeight: "700", fill: "#f8fafc" }, "3. xconnect-proxy-xray.service"),
          /* @__PURE__ */ import_react.default.createElement("rect", { x: "1080", y: "303", width: "116", height: "22", rx: "6", fill: "rgba(52,211,153,0.18)" }),
          /* @__PURE__ */ import_react.default.createElement("text", { x: "1138", y: "318", textAnchor: "middle", fontSize: "11", fontWeight: "700", fill: "#34d399" }, "RSS ", proxyXrayRss, " MB"),
          /* @__PURE__ */ import_react.default.createElement("text", { x: "755", y: "343", fontSize: "12", fontFamily: "monospace", fill: "#cbd5e1" }, "Xray-core + \u5185\u5D4C xray-exporter (Role: xconnect_proxy)"),
          /* @__PURE__ */ import_react.default.createElement("text", { x: "755", y: "363", fontSize: "11", fontFamily: "monospace", fill: "#94a3b8" }, "Config: /usr/local/etc/xray/config.json (bufferSize=128, connIdle=3600)"),
          /* @__PURE__ */ import_react.default.createElement("rect", { x: "753", y: "376", width: "215", height: "54", rx: "8", fill: "rgba(56,189,248,0.08)", stroke: "rgba(56,189,248,0.35)" }),
          /* @__PURE__ */ import_react.default.createElement("text", { x: "763", y: "395", fontSize: "12", fontWeight: "600", fill: "#38bdf8" }, "Inbound: proxy-xhttp-in"),
          /* @__PURE__ */ import_react.default.createElement("text", { x: "763", y: "414", fontSize: "11", fontFamily: "monospace", fill: "#cbd5e1" }, "/dev/shm/xray.sock (0666)"),
          /* @__PURE__ */ import_react.default.createElement("rect", { x: "980", y: "376", width: "212", height: "54", rx: "8", fill: "rgba(52,211,153,0.08)", stroke: "rgba(52,211,153,0.35)" }),
          /* @__PURE__ */ import_react.default.createElement("text", { x: "990", y: "395", fontSize: "12", fontWeight: "600", fill: "#34d399" }, "Inbound: proxy-tcp-in"),
          /* @__PURE__ */ import_react.default.createElement("text", { x: "990", y: "414", fontSize: "11", fontFamily: "monospace", fill: "#cbd5e1" }, "0.0.0.0:1443 (TLS Vision)"),
          /* @__PURE__ */ import_react.default.createElement("rect", { x: "753", y: "440", width: "439", height: "44", rx: "8", fill: "rgba(167,139,250,0.1)", stroke: "rgba(167,139,250,0.4)" }),
          /* @__PURE__ */ import_react.default.createElement("text", { x: "765", y: "458", fontSize: "12", fontWeight: "600", fill: "#a78bfa" }, "\u8FDB\u7A0B\u5185\u5185\u5B58 stats.Manager\uFF08\u96F6 gRPC 10086/10087\uFF09"),
          /* @__PURE__ */ import_react.default.createElement("text", { x: "765", y: "475", fontSize: "11", fontFamily: "monospace", fill: "#cbd5e1" }, "Expose 127.0.0.1:8080/scrape \xB7 1m Push Snapshot -> 127.0.0.1:8686")
        ),
        /* @__PURE__ */ import_react.default.createElement(
          "g",
          {
            opacity: isLayerVisible("gateway,control") ? 1 : 0.16,
            style: { cursor: "pointer" },
            onClick: () => setSelectedServiceId("gateway-xray")
          },
          /* @__PURE__ */ import_react.default.createElement(
            "rect",
            {
              x: "735",
              y: "514",
              width: "475",
              height: "122",
              rx: "12",
              fill: "#0f172a",
              stroke: "#fb7185",
              strokeWidth: selectedServiceId === "gateway-xray" ? "3.5" : "2.5"
            }
          ),
          /* @__PURE__ */ import_react.default.createElement("text", { x: "755", y: "542", fontSize: "15", fontWeight: "700", fill: "#f8fafc" }, "4. xconnect-gateway-xray.service"),
          /* @__PURE__ */ import_react.default.createElement("rect", { x: "1080", y: "523", width: "116", height: "22", rx: "6", fill: "rgba(251,113,133,0.18)" }),
          /* @__PURE__ */ import_react.default.createElement("text", { x: "1138", y: "538", textAnchor: "middle", fontSize: "11", fontWeight: "700", fill: "#fb7185" }, "RSS ", gatewayXrayRss, " MB"),
          /* @__PURE__ */ import_react.default.createElement("text", { x: "755", y: "563", fontSize: "12", fontFamily: "monospace", fill: "#cbd5e1" }, "\u72EC\u7ACB\u88F8 /usr/local/bin/xray \u8FDB\u7A0B (Role: xconnect_gateway)"),
          /* @__PURE__ */ import_react.default.createElement("text", { x: "755", y: "583", fontSize: "11", fontFamily: "monospace", fill: "#94a3b8" }, "Config: /var/lib/xconnect-gateway/runtime/xray.json (\u914D\u7F6E\u5B8C\u5168\u72EC\u7ACB)"),
          /* @__PURE__ */ import_react.default.createElement("text", { x: "755", y: "603", fontSize: "12", fontFamily: "monospace", fill: "#fb7185" }, "Inbound: xconnect-vless-in (/run/xconnect-gateway/xray.sock)"),
          /* @__PURE__ */ import_react.default.createElement("text", { x: "755", y: "622", fontSize: "12", fontFamily: "monospace", fill: "#cbd5e1" }, "Outbound: xconnect-wireguard -> redirect 127.0.0.1:51820")
        ),
        /* @__PURE__ */ import_react.default.createElement(
          "g",
          {
            opacity: isLayerVisible("obs") ? 1 : 0.16,
            style: { cursor: "pointer" },
            onClick: () => setSelectedServiceId("vector")
          },
          /* @__PURE__ */ import_react.default.createElement(
            "rect",
            {
              x: "440",
              y: "712",
              width: "485",
              height: "154",
              rx: "12",
              fill: "#0f172a",
              stroke: "#a78bfa",
              strokeWidth: selectedServiceId === "vector" ? "3.5" : "2.5"
            }
          ),
          /* @__PURE__ */ import_react.default.createElement("text", { x: "460", y: "740", fontSize: "15", fontWeight: "700", fill: "#f8fafc" }, "5. vector.service\uFF08\u6838\u5FC3\u76D1\u63A7\u4E0E\u8BA1\u8D39\u6C47\u805A\u63A2\u9488\uFF09"),
          /* @__PURE__ */ import_react.default.createElement("rect", { x: "785", y: "721", width: "126", height: "22", rx: "6", fill: "rgba(167,139,250,0.18)" }),
          /* @__PURE__ */ import_react.default.createElement("text", { x: "848", y: "736", textAnchor: "middle", fontSize: "11", fontWeight: "700", fill: "#a78bfa" }, "RSS ", vectorRss, " MB ", vectorOptimized ? "(-40%)" : ""),
          /* @__PURE__ */ import_react.default.createElement("text", { x: "460", y: "762", fontSize: "12", fontFamily: "monospace", fill: "#cbd5e1" }, "/etc/vector/vector.toml \xB7 MemoryHigh=72M / MemoryMax=128M \xB7 thp:never"),
          /* @__PURE__ */ import_react.default.createElement("text", { x: "460", y: "784", fontSize: "12", fill: "#e2e8f0" }, "\u2022 Billing HTTP Server (:8686) -> 256MiB Disk Buffer \u5F02\u6B65\u63A8\u9001\u8BA1\u8D39"),
          /* @__PURE__ */ import_react.default.createElement("text", { x: "460", y: "805", fontSize: "12", fill: "#e2e8f0" }, "\u2022 15s Prometheus Scrape: xray:8080 \xB7 fluxgate:9102 \xB7 node:9100 \xB7 proc:9256"),
          /* @__PURE__ */ import_react.default.createElement("text", { x: "460", y: "826", fontSize: "12", fill: "#e2e8f0" }, "\u2022 Single Journald Reader: \u91C7\u96C6\u5355\u5143\u65E5\u5FD7\u5E76\u63D0\u70BC xhttp_events_total \u4E8B\u4EF6"),
          /* @__PURE__ */ import_react.default.createElement("text", { x: "460", y: "847", fontSize: "11", fontFamily: "monospace", fill: "#a78bfa" }, "AnonHugePages: 0 kB \xB7 TOKIO_WORKER_THREADS=1 \xB7 narenas:1")
        ),
        /* @__PURE__ */ import_react.default.createElement("g", { opacity: isLayerVisible("obs") ? 1 : 0.16 }, /* @__PURE__ */ import_react.default.createElement("rect", { x: "960", y: "712", width: "250", height: "154", rx: "10", fill: "#0f172a", stroke: "rgba(167,139,250,0.45)", strokeWidth: "1.5" }), /* @__PURE__ */ import_react.default.createElement("text", { x: "976", y: "738", fontSize: "13", fontWeight: "700", fill: "#f8fafc" }, "\u57FA\u7840\u652F\u6491\u91C7\u96C6\u8FDB\u7A0B"), /* @__PURE__ */ import_react.default.createElement("text", { x: "976", y: "762", fontSize: "12", fontFamily: "monospace", fill: "#cbd5e1" }, "\u2022 systemd-journald  ", journaldRss, " MB"), /* @__PURE__ */ import_react.default.createElement("text", { x: "976", y: "781", fontSize: "11", fontFamily: "monospace", fill: "#a78bfa" }, "cap: 24M/48M \xB7 disk 64M/3d"), /* @__PURE__ */ import_react.default.createElement("text", { x: "976", y: "803", fontSize: "12", fontFamily: "monospace", fill: "#cbd5e1" }, "\u2022 node_exporter     20.3 MB"), /* @__PURE__ */ import_react.default.createElement("text", { x: "976", y: "822", fontSize: "12", fontFamily: "monospace", fill: "#cbd5e1" }, "\u2022 process-exporter  16.9 MB"), /* @__PURE__ */ import_react.default.createElement("text", { x: "976", y: "841", fontSize: "12", fontFamily: "monospace", fill: "#cbd5e1" }, "\u2022 metrics-sup.py     7.0 MB")),
        /* @__PURE__ */ import_react.default.createElement("g", { opacity: isLayerVisible("proxy") ? 1 : 0.16 }, /* @__PURE__ */ import_react.default.createElement("rect", { x: "1295", y: "295", width: "225", height: "186", rx: "10", fill: "#0f172a", stroke: "#34d399", strokeWidth: "2" }), /* @__PURE__ */ import_react.default.createElement("text", { x: "1312", y: "322", fontSize: "14", fontWeight: "700", fill: "#f8fafc" }, "Proxy \u7B56\u7565\u8DEF\u7531\u51FA\u7AD9"), /* @__PURE__ */ import_react.default.createElement("text", { x: "1312", y: "346", fontSize: "12", fontFamily: "monospace", fill: "#34d399" }, "\u2022 pool-media-stream"), /* @__PURE__ */ import_react.default.createElement("text", { x: "1312", y: "366", fontSize: "12", fontFamily: "monospace", fill: "#34d399" }, "\u2022 pool-pro-ai-dev"), /* @__PURE__ */ import_react.default.createElement("text", { x: "1312", y: "386", fontSize: "12", fontFamily: "monospace", fill: "#34d399" }, "\u2022 pool-media-fallback"), /* @__PURE__ */ import_react.default.createElement("text", { x: "1312", y: "408", fontSize: "12", fontFamily: "monospace", fill: "#cbd5e1" }, "\u2022 direct-cn (geosite/ip)"), /* @__PURE__ */ import_react.default.createElement("text", { x: "1312", y: "428", fontSize: "12", fontFamily: "monospace", fill: "#94a3b8" }, "\u2022 blocked-private"), /* @__PURE__ */ import_react.default.createElement("text", { x: "1312", y: "458", fontSize: "11", fill: "#94a3b8" }, "DomainStrategy: IPIfNonMatch")),
        /* @__PURE__ */ import_react.default.createElement("g", { opacity: isLayerVisible("gateway") ? 1 : 0.16 }, /* @__PURE__ */ import_react.default.createElement("rect", { x: "1295", y: "514", width: "225", height: "122", rx: "10", fill: "#0f172a", stroke: "#fb7185", strokeWidth: "2" }), /* @__PURE__ */ import_react.default.createElement("text", { x: "1312", y: "542", fontSize: "14", fontWeight: "700", fill: "#f8fafc" }, "WireGuard Overlay"), /* @__PURE__ */ import_react.default.createElement("text", { x: "1312", y: "566", fontSize: "12", fontFamily: "monospace", fill: "#fb7185" }, "interface: xconzero0"), /* @__PURE__ */ import_react.default.createElement("text", { x: "1312", y: "586", fontSize: "12", fontFamily: "monospace", fill: "#cbd5e1" }, "UDP 127.0.0.1:51820"), /* @__PURE__ */ import_react.default.createElement("text", { x: "1312", y: "608", fontSize: "11", fontFamily: "monospace", fill: "#94a3b8" }, "net-jp-xconnect-02")),
        /* @__PURE__ */ import_react.default.createElement("g", { opacity: isLayerVisible("obs") ? 1 : 0.16 }, /* @__PURE__ */ import_react.default.createElement("rect", { x: "1295", y: "685", width: "225", height: "92", rx: "10", fill: "#0f172a", stroke: "#a78bfa", strokeWidth: "2" }), /* @__PURE__ */ import_react.default.createElement("text", { x: "1312", y: "712", fontSize: "14", fontWeight: "700", fill: "#f8fafc" }, "billing.svc.plus"), /* @__PURE__ */ import_react.default.createElement("text", { x: "1312", y: "734", fontSize: "12", fontFamily: "monospace", fill: "#a78bfa" }, "/v1/ingest/snapshots"), /* @__PURE__ */ import_react.default.createElement("text", { x: "1312", y: "754", fontSize: "11", fill: "#cbd5e1" }, "\u6BCF\u5206\u949F\u6D41\u91CF\u8BA1\u8D39\u5165\u5E93 (PG)")),
        /* @__PURE__ */ import_react.default.createElement("g", { opacity: isLayerVisible("obs") ? 1 : 0.16 }, /* @__PURE__ */ import_react.default.createElement("rect", { x: "1295", y: "795", width: "225", height: "92", rx: "10", fill: "#0f172a", stroke: "#a78bfa", strokeWidth: "2" }), /* @__PURE__ */ import_react.default.createElement("text", { x: "1312", y: "822", fontSize: "14", fontWeight: "700", fill: "#f8fafc" }, "observability.svc.plus"), /* @__PURE__ */ import_react.default.createElement("text", { x: "1312", y: "844", fontSize: "11", fontFamily: "monospace", fill: "#a78bfa" }, "VictoriaMetrics + VictoriaLogs"), /* @__PURE__ */ import_react.default.createElement("text", { x: "1312", y: "864", fontSize: "11", fill: "#cbd5e1" }, "\u8282\u70B9/\u8FDB\u7A0B/Xray/Fluxgate \u5168\u666F\u76D1\u63A7")),
        /* @__PURE__ */ import_react.default.createElement("g", { opacity: isLayerVisible("control") ? 1 : 0.12 }, /* @__PURE__ */ import_react.default.createElement("path", { d: "M 270 148 L 474 148", fill: "none", stroke: "#fbbf24", strokeWidth: "2.5", markerEnd: "url(#xc-arrow-amber)" }), /* @__PURE__ */ import_react.default.createElement("text", { x: "372", y: "138", textAnchor: "middle", fontSize: "11", fontWeight: "600", fill: "#fbbf24" }, "5m Sync / SSE"), /* @__PURE__ */ import_react.default.createElement("path", { d: "M 880 220 L 880 288", fill: "none", stroke: "#fbbf24", strokeWidth: "2.3", strokeDasharray: "6 3", markerEnd: "url(#xc-arrow-amber)" }), /* @__PURE__ */ import_react.default.createElement("text", { x: "888", y: "250", fontSize: "11", fontWeight: "600", fill: "#fbbf24" }, "\u5199 config.json + SIGHUP \u70ED\u52A0\u8F7D"), /* @__PURE__ */ import_react.default.createElement("path", { d: "M 700 220 L 700 575 L 729 575", fill: "none", stroke: "#fbbf24", strokeWidth: "2.3", strokeDasharray: "6 3", markerEnd: "url(#xc-arrow-amber)" }), /* @__PURE__ */ import_react.default.createElement("text", { x: "706", y: "425", fontSize: "11", fontWeight: "600", fill: "#fbbf24", transform: "rotate(-90 706 425)" }, "xconnect-gateway apply")),
        /* @__PURE__ */ import_react.default.createElement("g", { opacity: isLayerVisible("proxy") ? 1 : 0.12 }, /* @__PURE__ */ import_react.default.createElement("path", { d: "M 270 347 L 349 347", fill: "none", stroke: "#38bdf8", strokeWidth: "2.8", markerEnd: "url(#xc-arrow-cyan)" }), /* @__PURE__ */ import_react.default.createElement("text", { x: "308", y: "337", textAnchor: "middle", fontSize: "11", fontWeight: "600", fill: "#38bdf8" }, ":443 TLS"), /* @__PURE__ */ import_react.default.createElement("path", { d: "M 634 438 L 729 403", fill: "none", stroke: "#38bdf8", strokeWidth: "2.8", markerEnd: "url(#xc-arrow-cyan)" }), /* @__PURE__ */ import_react.default.createElement("text", { x: "684", y: "403", textAnchor: "middle", fontSize: "11", fontWeight: "600", fill: "#38bdf8" }, "UDS h2c (", model.steadyQps, "/s)"), /* @__PURE__ */ import_react.default.createElement(
          "path",
          {
            d: "M 270 471 C 320 471, 305 648, 675 648 C 710 648, 705 422, 974 422",
            fill: "none",
            stroke: "#34d399",
            strokeWidth: "2.5",
            markerEnd: "url(#xc-arrow-emerald)"
          }
        ), /* @__PURE__ */ import_react.default.createElement("text", { x: "500", y: "641", textAnchor: "middle", fontSize: "11", fontWeight: "600", fill: "#34d399" }, "TCP :1443 \u76F4\u8FDE VLESS+TLS+Vision (\u7ED5\u8FC7 Fluxgate)"), /* @__PURE__ */ import_react.default.createElement("path", { d: "M 1210 388 L 1289 388", fill: "none", stroke: "#34d399", strokeWidth: "2.8", markerEnd: "url(#xc-arrow-emerald)" })),
        /* @__PURE__ */ import_react.default.createElement("g", { opacity: isLayerVisible("gateway") ? 1 : 0.12 }, /* @__PURE__ */ import_react.default.createElement("path", { d: "M 270 594 L 349 514", fill: "none", stroke: "#fb7185", strokeWidth: "2.6", markerEnd: "url(#xc-arrow-rose)" }), /* @__PURE__ */ import_react.default.createElement("path", { d: "M 634 514 L 729 586", fill: "none", stroke: "#fb7185", strokeWidth: "2.6", markerEnd: "url(#xc-arrow-rose)" }), /* @__PURE__ */ import_react.default.createElement("text", { x: "682", y: "564", textAnchor: "middle", fontSize: "11", fontWeight: "600", fill: "#fb7185" }, "GW UDS"), /* @__PURE__ */ import_react.default.createElement("path", { d: "M 1210 575 L 1289 575", fill: "none", stroke: "#fb7185", strokeWidth: "2.6", markerEnd: "url(#xc-arrow-rose)" })),
        /* @__PURE__ */ import_react.default.createElement("g", { opacity: isLayerVisible("obs") ? 1 : 0.12 }, /* @__PURE__ */ import_react.default.createElement("path", { d: "M 880 484 L 880 706", fill: "none", stroke: "#a78bfa", strokeWidth: "2.5", markerEnd: "url(#xc-arrow-violet)" }), /* @__PURE__ */ import_react.default.createElement("text", { x: "888", y: "660", fontSize: "11", fontWeight: "600", fill: "#a78bfa" }, "POST :8686 + Scrape :8080"), /* @__PURE__ */ import_react.default.createElement("path", { d: "M 505 615 L 505 706", fill: "none", stroke: "#a78bfa", strokeWidth: "2", strokeDasharray: "5 4", markerEnd: "url(#xc-arrow-violet)" }), /* @__PURE__ */ import_react.default.createElement("text", { x: "512", y: "662", fontSize: "11", fill: "#a78bfa" }, ":9102/metrics"), /* @__PURE__ */ import_react.default.createElement("path", { d: "M 960 790 L 931 790", fill: "none", stroke: "#a78bfa", strokeWidth: "2", strokeDasharray: "5 4", markerEnd: "url(#xc-arrow-violet)" }), /* @__PURE__ */ import_react.default.createElement("path", { d: "M 925 752 L 1289 731", fill: "none", stroke: "#a78bfa", strokeWidth: "2.6", markerEnd: "url(#xc-arrow-violet)" }), /* @__PURE__ */ import_react.default.createElement("path", { d: "M 925 832 L 1289 841", fill: "none", stroke: "#a78bfa", strokeWidth: "2.6", markerEnd: "url(#xc-arrow-violet)" }))
      )),
      /* @__PURE__ */ import_react.default.createElement(
        "div",
        {
          style: {
            background: "#0b1120",
            border: `1px solid ${selectedService.color}66`,
            borderRadius: "10px",
            padding: "10px 14px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "12px"
          }
        },
        /* @__PURE__ */ import_react.default.createElement("div", { style: { flex: "1 1 520px" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: "14px", fontWeight: 700, color: selectedService.color } }, selectedService.title), /* @__PURE__ */ import_react.default.createElement(
          "span",
          {
            style: {
              fontSize: "11px",
              fontFamily: "monospace",
              padding: "2px 8px",
              borderRadius: "4px",
              background: "#1e293b",
              color: "#f8fafc"
            }
          },
          "Playbook Role: ",
          selectedService.role
        )), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: "11px", fontFamily: "monospace", color: "#94a3b8", marginTop: "4px" } }, "Binary: ", selectedService.binary, " | Listen/Socket: ", selectedService.listen), /* @__PURE__ */ import_react.default.createElement("div", { style: { marginTop: "6px", display: "flex", flexDirection: "column", gap: "3px", fontSize: "12px", color: "#cbd5e1" } }, selectedService.highlights.map((h, i) => /* @__PURE__ */ import_react.default.createElement("div", { key: i }, "\u2022 ", h)))),
        /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", gap: "6px", flexWrap: "wrap" } }, Object.values(SERVICE_CATALOG).map((svc) => /* @__PURE__ */ import_react.default.createElement(
          "button",
          {
            key: svc.id,
            onClick: () => setSelectedServiceId(svc.id),
            style: {
              background: selectedServiceId === svc.id ? `${svc.color}26` : "#1e293b",
              border: `1px solid ${selectedServiceId === svc.id ? svc.color : "#334155"}`,
              color: selectedServiceId === svc.id ? svc.color : "#cbd5e1",
              borderRadius: "6px",
              padding: "4px 9px",
              fontSize: "11px",
              fontWeight: 600,
              cursor: "pointer"
            }
          },
          svc.id
        )))
      )
    );
  };
  return /* @__PURE__ */ import_react.default.createElement(
    "div",
    {
      style: {
        width: "100%",
        height: height ? `${height}px` : "100%",
        maxHeight: height ? `${height}px` : "100%",
        background: "#090d16",
        color: "#f8fafc",
        fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", Inter, sans-serif',
        padding: "14px 18px",
        boxSizing: "border-box",
        overflowY: "auto",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: "14px"
      }
    },
    /* @__PURE__ */ import_react.default.createElement(
      "div",
      {
        style: {
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: "12px",
          padding: "12px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }
      },
      /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px" } }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: "19px", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.2px" } }, "XConnect \u8FB9\u7F18\u8282\u70B9\u5355\u4F53\u805A\u5408\u62D3\u6251\u4E0E 2C1G Lightsail \u52A8\u6001 ROI \u9762\u677F"), /* @__PURE__ */ import_react.default.createElement(
        "span",
        {
          style: {
            padding: "2px 8px",
            borderRadius: "4px",
            fontSize: "11px",
            fontWeight: 700,
            background: liveTelemetry.hasLiveTelemetry ? "rgba(34,197,94,0.18)" : "rgba(56,189,248,0.18)",
            border: `1px solid ${liveTelemetry.hasLiveTelemetry ? "#22c55e" : "#38bdf8"}`,
            color: liveTelemetry.hasLiveTelemetry ? "#86efac" : "#7dd3fc"
          }
        },
        liveTelemetry.hasK6PipelineData ? `\u25CF LIVE K6 PIPELINE (${liveTelemetry.testId || "active"})` : liveTelemetry.hasLiveTelemetry ? "\u25CF LIVE PROMETHEUS + ROI MODEL" : "\u25CF K6 1S BENCHMARK & ROI SIMULATOR"
      ), /* @__PURE__ */ import_react.default.createElement(
        "a",
        {
          href: k6WorkflowUrl,
          target: "_blank",
          rel: "noopener noreferrer",
          style: {
            padding: "3px 9px",
            borderRadius: "5px",
            fontSize: "11px",
            fontWeight: 700,
            background: "rgba(251,191,36,0.16)",
            border: "1px solid #fbbf24",
            color: "#fde68a",
            textDecoration: "none"
          }
        },
        "\u26A1 \u89E6\u53D1 / \u67E5\u770B Playbooks k6 \u538B\u6D4B\u6D41\u6C34\u7EBF"
      )), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: "12px", color: "#94a3b8", marginTop: "3px" } }, "\u91D1\u4E1D\u96C0\u8282\u70B9\uFF1A", /* @__PURE__ */ import_react.default.createElement("code", { style: { color: "#38bdf8" } }, resolvedNodeName), "\uFF08AWS Lightsail 2 vCPU /", " ", model.memory.totalRamMib, " MiB RAM / 0 Swap / 2 TB \u514D\u6D41\u5305\uFF09\xB7 \u62D6\u52A8\u4E0B\u65B9\u5E76\u53D1\u6ED1\u5757\u6216\u5207\u6362\u4EBA\u5747\u6708\u6D41\u91CF\u4E0E\u6C60\u5316\u7B56\u7565\uFF0C\u56DB\u5927\u56FE\u8868\u5B9E\u65F6\u8054\u52A8\u8BA1\u7B97")), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: "6px" } }, [
        { id: "all", label: "\u5168\u666F\u56DB\u5408\u4E00\u89C6\u56FE" },
        { id: "topology", label: "\u2460 \u6838\u5FC3\u670D\u52A1\u62D3\u6251" },
        { id: "timeseries", label: "\u2461 40 vs 500 VU \u65F6\u5E8F" },
        { id: "knee_memory", label: "\u2462 \u62D0\u70B9\u4E0E\u5185\u5B58\u7F29\u653E" },
        { id: "slo_roi", label: "\u2463 P95 SLO & Lightsail ROI" }
      ].map((tab) => {
        const active = activeView === tab.id;
        return /* @__PURE__ */ import_react.default.createElement(
          "button",
          {
            key: tab.id,
            onClick: () => setActiveView(tab.id),
            style: {
              background: active ? "#2563eb" : "#1e293b",
              border: `1px solid ${active ? "#60a5fa" : "#334155"}`,
              color: "#ffffff",
              borderRadius: "6px",
              padding: "6px 11px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer"
            }
          },
          tab.label
        );
      }))),
      /* @__PURE__ */ import_react.default.createElement(
        "div",
        {
          style: {
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            background: "#0b1120",
            border: "1px solid #1e293b",
            borderRadius: "8px",
            padding: "10px 14px"
          }
        },
        /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px" } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: "12px", fontWeight: 700, color: "#e2e8f0" } }, "\u8C03\u5EA6\u5E76\u53D1\u6C34\u4F4D:", " ", /* @__PURE__ */ import_react.default.createElement("strong", { style: { color: "#38bdf8", fontFamily: "monospace", fontSize: "14px" } }, targetVu, " VU")), /* @__PURE__ */ import_react.default.createElement(
          "input",
          {
            type: "range",
            min: 10,
            max: 500,
            step: 5,
            value: targetVu,
            onChange: (e) => setTargetVu(Number(e.target.value)),
            style: { width: "180px", accentColor: "#38bdf8", cursor: "pointer" }
          }
        ), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", gap: "5px", flexWrap: "wrap" } }, [
          { vu: 40, label: "40 VU \u57FA\u7EBF" },
          { vu: 120, label: "120 VU \u6700\u4F73\u751C\u70B9" },
          { vu: 150, label: "150 VU \u62D0\u70B9\u524D" },
          { vu: 200, label: "200 VU \u6392\u7A7A\u7EBF" },
          { vu: 500, label: "500 VU \u6781\u9650" }
        ].map((p) => /* @__PURE__ */ import_react.default.createElement(
          "button",
          {
            key: p.vu,
            onClick: () => setTargetVu(p.vu),
            style: {
              background: targetVu === p.vu ? "rgba(56,189,248,0.22)" : "#1e293b",
              border: `1px solid ${targetVu === p.vu ? "#38bdf8" : "#334155"}`,
              color: targetVu === p.vu ? "#38bdf8" : "#cbd5e1",
              borderRadius: "5px",
              padding: "3px 8px",
              fontSize: "11px",
              fontWeight: 600,
              cursor: "pointer"
            }
          },
          p.label
        )))),
        /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" } }, /* @__PURE__ */ import_react.default.createElement(
          "button",
          {
            onClick: () => setCleanTmpfs((v) => !v),
            style: {
              background: cleanTmpfs ? "rgba(52,211,153,0.18)" : "#1e293b",
              border: `1px solid ${cleanTmpfs ? "#34d399" : "#334155"}`,
              color: cleanTmpfs ? "#34d399" : "#94a3b8",
              borderRadius: "6px",
              padding: "4px 10px",
              fontSize: "11px",
              fontWeight: 600,
              cursor: "pointer"
            }
          },
          cleanTmpfs ? "\u2713 \u5DF2\u6E05\u7406 /tmp 75M (+120 VU)" : "\u25CB \u4FDD\u7559 /tmp 75M tmpfs"
        ), /* @__PURE__ */ import_react.default.createElement(
          "button",
          {
            onClick: () => setVectorOptimized((v) => !v),
            style: {
              background: vectorOptimized ? "rgba(167,139,250,0.2)" : "#1e293b",
              border: `1px solid ${vectorOptimized ? "#a78bfa" : "#334155"}`,
              color: vectorOptimized ? "#c4b5fd" : "#94a3b8",
              borderRadius: "6px",
              padding: "4px 10px",
              fontSize: "11px",
              fontWeight: 600,
              cursor: "pointer"
            }
          },
          vectorOptimized ? "\u2713 Vector THP \u7626\u8EAB (71.5 MiB)" : "\u25CB Vector \u4F18\u5316\u524D (124.1 MiB)"
        ), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#94a3b8" } }, /* @__PURE__ */ import_react.default.createElement("span", null, "\u7528\u6237\u590D\u7528:"), [3, 4, 5].map((mult) => /* @__PURE__ */ import_react.default.createElement(
          "button",
          {
            key: mult,
            onClick: () => setUserMultiplier(mult),
            style: {
              background: userMultiplier === mult ? "#2563eb" : "#1e293b",
              border: `1px solid ${userMultiplier === mult ? "#60a5fa" : "#334155"}`,
              color: "#ffffff",
              borderRadius: "4px",
              padding: "2px 7px",
              fontSize: "11px",
              fontWeight: 600,
              cursor: "pointer"
            }
          },
          mult,
          "x"
        ))), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#94a3b8" } }, /* @__PURE__ */ import_react.default.createElement("span", null, "\u4EBA\u5747\u6708\u6D41\u91CF:"), [
          { gb: 4.27, label: "4.27G(\u5305\u5185)" },
          { gb: 10, label: "10G" },
          { gb: 20, label: "20G" },
          { gb: 50, label: "50G" }
        ].map((item) => {
          const active = Math.abs(gbPerUserMonth - item.gb) < 0.05;
          return /* @__PURE__ */ import_react.default.createElement(
            "button",
            {
              key: item.gb,
              onClick: () => setGbPerUserMonth(item.gb),
              style: {
                background: active ? "#059669" : "#1e293b",
                border: `1px solid ${active ? "#34d399" : "#334155"}`,
                color: "#ffffff",
                borderRadius: "4px",
                padding: "2px 7px",
                fontSize: "11px",
                fontWeight: 600,
                cursor: "pointer"
              }
            },
            item.label
          );
        })), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#94a3b8" } }, /* @__PURE__ */ import_react.default.createElement("span", null, "\u8D85\u989D\u6D41\u91CF\u7B56\u7565:"), [
          { mode: "pooled", label: "2C1G\u6C60\u5316($0.0034/G)" },
          { mode: "overage", label: "\u5355\u673A\u8D85\u989D($0.09/G)" }
        ].map((item) => {
          const active = trafficBillingMode === item.mode;
          return /* @__PURE__ */ import_react.default.createElement(
            "button",
            {
              key: item.mode,
              onClick: () => setTrafficBillingMode(item.mode),
              style: {
                background: active ? item.mode === "pooled" ? "#2563eb" : "#dc2626" : "#1e293b",
                border: `1px solid ${active ? item.mode === "pooled" ? "#60a5fa" : "#f87171" : "#334155"}`,
                color: "#ffffff",
                borderRadius: "4px",
                padding: "2px 7px",
                fontSize: "11px",
                fontWeight: 600,
                cursor: "pointer"
              }
            },
            item.label
          );
        })))
      ),
      /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(215px, 1fr))", gap: "10px" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { background: "#0b1120", border: "1px solid #1e293b", borderRadius: "8px", padding: "10px 12px" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: "11px", color: "#94a3b8" } }, "\u5F53\u524D\u5E76\u53D1 / \u6298\u7B97\u5728\u7EBF\u7528\u6237"), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: "19px", fontWeight: 800, color: "#38bdf8", marginTop: "3px", fontFamily: "monospace" } }, model.vu, " VU ", /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: "14px", color: "#cbd5e1" } }, "\u2248 ", model.onlineUsers, " \u4EBA")), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: "11px", color: "#64748b", marginTop: "2px" } }, "\u6309 ", model.userMultiplier, "x \u601D\u8003\u65F6\u95F4\u590D\u7528 \xB7 \u8FB9\u9645\u6548\u7387 ", model.marginalEfficiency, " QPS/VU")), /* @__PURE__ */ import_react.default.createElement("div", { style: { background: "#0b1120", border: "1px solid #1e293b", borderRadius: "8px", padding: "10px 12px" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: "11px", color: "#94a3b8" } }, "\u7A33\u6001\u541E\u5410 QPS / \u6708\u5904\u7406\u80FD\u529B"), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: "19px", fontWeight: 800, color: "#34d399", marginTop: "3px", fontFamily: "monospace" } }, liveTelemetry.liveQps ?? model.steadyQps, " req/s", " ", /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: "13px", color: "#cbd5e1" } }, "(", model.roi.monthlyReqsM, "M/\u6708)")), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: "11px", color: "#64748b", marginTop: "2px" } }, "\u722C\u5761\u671F\u77AC\u65F6 QPS: ", model.rampQps, " req/s \xB7 2TB \u6D41\u91CF\u5305\u6D88\u8017 ~", model.roi.trafficQuotaPct2Tb, "%")), /* @__PURE__ */ import_react.default.createElement(
        "div",
        {
          style: {
            background: "#0b1120",
            border: `1px solid ${model.sloColor}66`,
            borderRadius: "8px",
            padding: "10px 12px"
          }
        },
        /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: "11px", color: "#94a3b8" } }, "\u9884\u4F30 P95 \u5EF6\u8FDF / SLO \u95E8\u7981\u72B6\u6001"),
        /* @__PURE__ */ import_react.default.createElement(
          "div",
          {
            style: {
              fontSize: "19px",
              fontWeight: 800,
              color: model.sloColor,
              marginTop: "3px",
              fontFamily: "monospace"
            }
          },
          liveTelemetry.liveP95Ms ?? model.estimatedP95Ms,
          " ms",
          " ",
          /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: "12px" } }, "(", model.sloLevel, ")")
        ),
        /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: "11px", color: model.sloColor, marginTop: "2px" } }, model.sloAction)
      ), /* @__PURE__ */ import_react.default.createElement("div", { style: { background: "#0b1120", border: "1px solid #1e293b", borderRadius: "8px", padding: "10px 12px" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: "11px", color: "#94a3b8" } }, "\u6574\u673A\u5185\u5B58\u5360\u7528 / OOM \u5B89\u5168\u5BB9\u91CF"), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: "19px", fontWeight: 800, color: "#f8fafc", marginTop: "3px", fontFamily: "monospace" } }, liveTelemetry.memUsedMib ?? model.memory.totalUsedMib, " MiB", " ", /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: "13px", color: model.memory.ramPct >= 80 ? "#ef4444" : "#34d399" } }, "(", model.memory.ramPct, "%)")), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: "11px", color: "#64748b", marginTop: "2px" } }, "\u53EF\u7528 ", liveTelemetry.memAvailMib ?? model.memory.availMib, " MiB \xB7 75%\u5B89\u5168\u7EBF ", model.memory.maxSafeVu75, " VU")), /* @__PURE__ */ import_react.default.createElement("div", { style: { background: "#0b1120", border: "1px solid #1e293b", borderRadius: "8px", padding: "10px 12px" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: "11px", color: "#94a3b8" } }, "2C1G ($", selectedTier, "/\u6708) \u8BA1\u7B97+\u6D41\u91CF\u7EFC\u5408 ROI"), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: "19px", fontWeight: 800, color: "#34d399", marginTop: "3px", fontFamily: "monospace" } }, "$", activeTierCost.activeTotalCostPerUserUsd.toFixed(4), "/\u4EBA/\u6708", " ", /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: "12px", color: "#cbd5e1" } }, "(@", gbPerUserMonth, "G)")), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: "11px", color: "#64748b", marginTop: "2px" } }, "\u7EAF\u8BA1\u7B97 $", activeTierCost.computeCostPerUserUsd.toFixed(4), " (\u514D\u6D41", model.roi.includedGbPerUser, "G) + \u6D41\u91CF $", activeTierCost.activeTrafficCostPerUserUsd.toFixed(4), " (", trafficBillingMode === "pooled" ? "\u6C60\u5316" : "\u8D85\u989D", ")")), /* @__PURE__ */ import_react.default.createElement("div", { style: { background: "#0b1120", border: "1px solid #1e293b", borderRadius: "8px", padding: "10px 12px" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: "11px", color: "#94a3b8" } }, "5 \u5927\u6838\u5FC3\u670D\u52A1\u603B RSS"), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: "19px", fontWeight: 800, color: "#a78bfa", marginTop: "3px", fontFamily: "monospace" } }, model.memory.coreFiveTotalRssMib, " MiB"), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: "11px", color: "#64748b", marginTop: "2px" } }, "Fluxgate ", fluxgateRss, "M + Proxy ", proxyXrayRss, "M + Vector ", vectorRss, "M")))
    ),
    (activeView === "all" || activeView === "topology") && renderTopologySection(),
    (activeView === "all" || activeView === "timeseries") && renderTimeseriesChart(),
    (activeView === "all" || activeView === "knee_memory") && renderKneeAndMemoryChart(),
    (activeView === "all" || activeView === "slo_roi") && renderSloAndRoiChart()
  );
};

// src/module.ts
var plugin = new import_data.PanelPlugin(XConnectTopologyRoiPanel).setPanelOptions((builder) => {
  builder.addRadio({
    path: "viewMode",
    name: "\u9ED8\u8BA4\u89C6\u56FE\u6A21\u5F0F (View Mode)",
    description: "\u9009\u62E9\u5C55\u793A\u5168\u666F\u7EFC\u5408\u9762\u677F\u6216\u5355\u72EC\u653E\u5927\u67D0\u4E00\u89C6\u56FE\uFF08\u62D3\u6251 / k6 \u65F6\u5E8F / \u62D0\u70B9\u4E0E\u5185\u5B58 / P95 & Lightsail ROI\uFF09",
    defaultValue: "all",
    settings: {
      options: [
        { value: "all", label: "\u5168\u666F\u7EFC\u5408\u89C6\u56FE (All 4 Panels)" },
        { value: "topology", label: "\u2460 \u4E94\u5927\u6838\u5FC3\u94FE\u8DEF\u62D3\u6251 (Topology)" },
        { value: "timeseries", label: "\u2461 40 vs 500 VU \u65F6\u5E8F (Timeseries)" },
        { value: "knee_memory", label: "\u2462 \u62D0\u70B9\u4E0E\u5185\u5B58\u7F29\u653E (Knee & RAM)" },
        { value: "slo_roi", label: "\u2463 P95 SLO \u4E0E ROI (SLO & ROI)" }
      ]
    }
  }).addRadio({
    path: "defaultLayer",
    name: "\u62D3\u6251\u9ED8\u8BA4\u9AD8\u4EAE\u5C42 (Default Topology Layer)",
    defaultValue: "all",
    settings: {
      options: [
        { value: "all", label: "\u5168\u90E8\u94FE\u8DEF" },
        { value: "control", label: "\u63A7\u5236\u9762\u94FE\u8DEF" },
        { value: "proxy", label: "Proxy \u6570\u636E\u94FE\u8DEF" },
        { value: "gateway", label: "Gateway \u94FE\u8DEF" },
        { value: "obs", label: "\u76D1\u63A7\u4E0E\u8BA1\u8D39\u94FE\u8DEF" }
      ]
    }
  }).addNumberInput({
    path: "defaultTargetVu",
    name: "\u9ED8\u8BA4\u76EE\u6807\u5E76\u53D1\u6C34\u4F4D (Target VUs)",
    description: "\u52A8\u6001 ROI \u4E0E\u5185\u5B58/\u5EF6\u8FDF\u4EFF\u771F\u5668\u7684\u521D\u59CB\u5E76\u53D1 VU \u503C\uFF0810 - 500\uFF0C\u6700\u4F73\u751C\u70B9 120 VU\uFF09",
    defaultValue: 120,
    settings: {
      min: 10,
      max: 500,
      step: 10
    }
  }).addRadio({
    path: "defaultUserMultiplier",
    name: "\u5728\u7EBF\u7528\u6237\u601D\u8003\u65F6\u95F4\u590D\u7528\u7CFB\u6570 (User Multiplier)",
    description: "1 \u4E2A\u6D3B\u8DC3\u538B\u6D4B VU \u6298\u7B97\u7684\u771F\u5B9E\u5728\u7EBF\u7528\u6237\u6570\uFF08\u9ED8\u8BA4 4x\uFF09",
    defaultValue: 4,
    settings: {
      options: [
        { value: 3, label: "3x (\u9AD8\u9891\u4EA4\u4E92)" },
        { value: 4, label: "4x (\u6807\u51C6\u57FA\u51C6)" },
        { value: 5, label: "5x (\u8F7B\u91CF\u6D4F\u89C8)" }
      ]
    }
  }).addRadio({
    path: "defaultTierPrice",
    name: "AWS Lightsail 2C1G \u5957\u9910\u57FA\u51C6\u4EF7 ($/\u6708)",
    defaultValue: 7,
    settings: {
      options: [
        { value: 7, label: "$7/\u6708 (2C1G IPv4 \u6807\u51C6\u6863, \u542B 2TB \u6D41\u91CF)" },
        { value: 10, label: "$10/\u6708 (\u5BF9\u7167\u6863, \u542B 2TB \u6D41\u91CF)" },
        { value: 12, label: "$12/\u6708 (\u5BF9\u7167\u6863, \u542B 2TB \u6D41\u91CF)" }
      ]
    }
  }).addRadio({
    path: "defaultGbPerUserMonth",
    name: "\u4EBA\u5747\u6708\u6D41\u91CF\u6A21\u578B (GB/\u4EBA/\u6708)",
    description: "\u8BA1\u7B97\u5747\u644A + \u6D41\u91CF\u5747\u644A\u6A21\u578B\u4E0B\u6BCF\u4F4D\u5728\u7EBF\u7528\u6237\u7684\u5E73\u5747\u6708\u6D88\u8017\u6D41\u91CF\uFF08120 VU @4x \u4E0B 2TB \u5305\u5185\u7EA6 4.27 GB/\u4EBA\uFF09",
    defaultValue: 10,
    settings: {
      options: [
        { value: 4.27, label: "4.27 GB (2TB \u5305\u5185\u514D\u8D85\u989D)" },
        { value: 10, label: "10 GB (\u8F7B\u91CF\u65E5\u5E38\u529E\u516C)" },
        { value: 20, label: "20 GB (\u6807\u51C6\u7814\u53D1+\u6D41\u5A92\u4F53)" },
        { value: 50, label: "50 GB (\u91CD\u5EA6\u6D41\u91CF\u7528\u6237)" }
      ]
    }
  }).addRadio({
    path: "defaultTrafficBillingMode",
    name: "\u8D85\u989D\u6D41\u91CF\u8BA1\u8D39\u4E0E\u6269\u5BB9\u7B56\u7565",
    description: "\u5BF9\u6BD4\u591A\u53F0 2C1G \u8282\u70B9\u6C60\u5316\u6D41\u91CF\u5305 ($0.00342/GB @ $7) \u4E0E\u5355\u673A\u786C\u6297 AWS \u8D85\u989D\u6D41\u91CF\u8D39 ($0.09/GB)",
    defaultValue: "pooled",
    settings: {
      options: [
        { value: "pooled", label: "2C1G \u6D41\u91CF\u5305\u6C60\u5316\u5747\u644A ($0.00342/GB)" },
        { value: "overage", label: "\u5355\u673A\u786C\u6297 AWS \u8D85\u989D ($0.09/GB)" }
      ]
    }
  }).addBooleanSwitch({
    path: "cleanTmpfs",
    name: "\u542F\u7528 /tmp 75 MiB tmpfs \u6E05\u7406\u540E\u5185\u5B58\u57FA\u7EBF",
    description: "\u5F00\u542F\u540E\u975E\u4EE3\u7406\u56FA\u5B9A\u5F00\u9500\u4ECE 451.7 MiB \u964D\u81F3 376.7 MiB\uFF08\u53EF\u591A\u6297 +120 VU\uFF09",
    defaultValue: true
  }).addBooleanSwitch({
    path: "vectorOptimized",
    name: "\u542F\u7528 Vector jemalloc THP \u7626\u8EAB\u57FA\u7EBF (71.5 MiB)",
    description: "\u5F00\u542F\u540E\u5C55\u793A Vector 0.41.1 THP=never \u4F18\u5316\u540E 71.5 MiB\uFF08\u5173\u95ED\u5219\u5BF9\u6BD4\u4F18\u5316\u524D 124.1 MiB\uFF09",
    defaultValue: true
  }).addBooleanSwitch({
    path: "followLiveVu",
    name: "\u81EA\u52A8\u8DDF\u968F Prometheus \u5B9E\u65F6\u6D3B\u8DC3\u8FDE\u63A5/VU",
    description: "\u5F53\u9762\u677F\u67E5\u8BE2\u8FD4\u56DE fluxgate_active_connections \u6216 k6_vus \u65F6\u81EA\u52A8\u540C\u6B65\u5E76\u53D1\u6ED1\u5757",
    defaultValue: false
  }).addTextInput({
    path: "nodeHostname",
    name: "\u76EE\u6807\u8FB9\u7F18\u8282\u70B9\u540D\u79F0",
    defaultValue: "jp-xconnect-02.svc.plus"
  }).addNumberInput({
    path: "totalRamMib",
    name: "\u8282\u70B9\u7269\u7406\u5185\u5B58\u4E0A\u9650 (MiB)",
    defaultValue: 939
  }).addTextInput({
    path: "k6WorkflowUrl",
    name: "Playbooks k6 \u538B\u6D4B\u6D41\u6C34\u7EBF\u94FE\u63A5",
    defaultValue: "https://github.com/ai-workspace-infra/playbooks/actions/workflows/k6-proxy-performance.yml"
  });
});


  Object.assign(_exports, module.exports);
  return _exports;
});
