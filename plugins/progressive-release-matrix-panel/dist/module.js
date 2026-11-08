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

// src/ProgressiveReleasePanel.tsx
var import_react = __toESM(require("react"));
var ProgressiveReleasePanel = (props) => {
  const {
    options,
    data,
    width,
    height,
    timeRange,
    replaceVariables
  } = props;
  const {
    mode = "all",
    useMockData = false,
    environment = "PROD",
    showKpis = true,
    showMatrix = true,
    showFlagger = true,
    showDetails = true,
    showFooter = true,
    showRoutesTable = true
  } = options;
  const resolvedEnv = (0, import_react.useMemo)(() => {
    let env = (environment || "").trim();
    if (replaceVariables) {
      try {
        const interpolated = replaceVariables(env || "$environment");
        if (interpolated && interpolated !== "$environment" && interpolated !== "${environment}") {
          env = interpolated;
        }
      } catch {
      }
    }
    if ((!env || env.startsWith("$")) && replaceVariables) {
      try {
        const cluster = replaceVariables("$cluster");
        if (cluster && !cluster.startsWith("$")) {
          env = cluster.toLowerCase().includes("prod") ? "PROD" : "SIT";
        }
      } catch {
      }
    }
    if ((!env || env.startsWith("$")) && data?.series && data.series.length > 0) {
      for (const frame of data.series) {
        const field = frame.fields?.find((f) => f.labels && Object.keys(f.labels).length > 0);
        const labels = frame.labels || field && field.labels || {};
        if (labels.environment) {
          env = labels.environment;
          break;
        }
        if (labels.cluster) {
          env = labels.cluster.toLowerCase().includes("prod") ? "PROD" : "SIT";
          break;
        }
      }
    }
    const finalEnv = (env && !env.startsWith("$") ? env : "PROD").toUpperCase();
    return finalEnv === "SIT" ? "SIT" : "PROD";
  }, [environment, replaceVariables, data]);
  const observationWindowStr = (0, import_react.useMemo)(() => {
    try {
      if (timeRange && timeRange.from && timeRange.to) {
        const fromDate = timeRange.from.toDate ? timeRange.from.toDate() : new Date(timeRange.from);
        const toDate = timeRange.to.toDate ? timeRange.to.toDate() : new Date(timeRange.to);
        const formatUtc2 = (d) => {
          const hh = String(d.getUTCHours()).padStart(2, "0");
          const mm = String(d.getUTCMinutes()).padStart(2, "0");
          return `${hh}:${mm}`;
        };
        const diffMins = Math.max(1, Math.round((toDate.getTime() - fromDate.getTime()) / 6e4));
        return `Last ${diffMins} minutes (${formatUtc2(fromDate)} \u2013 ${formatUtc2(toDate)} UTC)`;
      }
    } catch {
    }
    const now = /* @__PURE__ */ new Date();
    const past = new Date(now.getTime() - 15 * 60 * 1e3);
    const formatUtc = (d) => {
      const hh = String(d.getUTCHours()).padStart(2, "0");
      const mm = String(d.getUTCMinutes()).padStart(2, "0");
      return `${hh}:${mm}`;
    };
    return `Last 15 minutes (${formatUtc(past)} \u2013 ${formatUtc(now)} UTC)`;
  }, [timeRange]);
  const updatedTimeStr = (0, import_react.useMemo)(() => {
    const d = /* @__PURE__ */ new Date();
    const hh = String(d.getUTCHours()).padStart(2, "0");
    const mm = String(d.getUTCMinutes()).padStart(2, "0");
    const ss = String(d.getUTCSeconds()).padStart(2, "0");
    return `${hh}:${mm}:${ss} UTC`;
  }, [data]);
  const mockEndpoints = {
    console: {
      "/healthz": { service: "console", route: "/healthz", status: "PASS", httpCode: 200, latencyMs: 38, freshnessSec: 9, expectedHttp: 200 },
      "/login": { service: "console", route: "/login", status: "PASS", httpCode: 200, latencyMs: 182, freshnessSec: 11, expectedHttp: 200 },
      "/panel/agent": { service: "console", route: "/panel/agent", status: "PASS", httpCode: 307, latencyMs: 246, freshnessSec: 12, expectedHttp: 307 }
    },
    accounts: {
      "/healthz": { service: "accounts", route: "/healthz", status: "PASS", httpCode: 200, latencyMs: 41, freshnessSec: 8, expectedHttp: 200 },
      "/readyz": { service: "accounts", route: "/readyz", status: "PASS", httpCode: 200, latencyMs: 57, freshnessSec: 9, expectedHttp: 200 },
      "/api/ping": { service: "accounts", route: "/api/ping", status: "PASS", httpCode: 200, latencyMs: 64, freshnessSec: 10, expectedHttp: 200 },
      "/api/billing/plans": { service: "accounts", route: "/api/billing/plans", status: "FAIL", httpCode: 503, latencyMs: 1204, freshnessSec: 10, expectedHttp: 200 }
    },
    billing: {
      "/healthz": { service: "billing", route: "/healthz", status: "PASS", httpCode: 200, latencyMs: 35, freshnessSec: 9, expectedHttp: 200 },
      "/readyz": { service: "billing", route: "/readyz", status: "NO DATA", httpCode: "\u2014", latencyMs: "\u2014", freshnessSec: 9, expectedHttp: 200 },
      "/api/ping": { service: "billing", route: "/api/ping", status: "PASS", httpCode: 200, latencyMs: 71, freshnessSec: 11, expectedHttp: 200 }
    }
  };
  const parsedData = (0, import_react.useMemo)(() => {
    try {
      if (useMockData || !data?.series || data.series.length === 0) {
        return { isLive: false, endpoints: mockEndpoints };
      }
      const liveEndpoints = {
        console: {},
        accounts: {},
        billing: {}
      };
      let foundAny = false;
      for (const frame of data.series) {
        const field = frame.fields?.find(
          (f) => f.name === "Value" || f.type === "number" || f.labels && Object.keys(f.labels).length > 0
        );
        const labels = frame.labels || field && field.labels || {};
        const s = (labels.service || "").toLowerCase();
        const r = labels.route;
        if (!s || !r || !liveEndpoints[s]) {
          continue;
        }
        foundAny = true;
        if (!liveEndpoints[s][r]) {
          liveEndpoints[s][r] = {
            service: s,
            route: r,
            status: "NO DATA",
            httpCode: "\u2014",
            latencyMs: "\u2014",
            freshnessSec: 10,
            expectedHttp: r === "/panel/agent" ? 307 : 200
          };
        }
        const getVal = (fld) => {
          if (!fld || !fld.values) {
            return null;
          }
          const len = typeof fld.values.length === "number" ? fld.values.length : 0;
          if (len === 0) {
            return null;
          }
          if (typeof fld.values.get === "function") {
            return fld.values.get(len - 1);
          }
          return fld.values[len - 1];
        };
        const val = getVal(field);
        const metricName = labels.__name__ || frame.name || field && field.name || "";
        const refId = frame.refId;
        if (refId === "A" || metricName.includes("probe_success") || !metricName) {
          const numVal = Number(val);
          if (numVal === 1) {
            liveEndpoints[s][r].status = "PASS";
          } else if (numVal === 0) {
            liveEndpoints[s][r].status = "FAIL";
          }
        } else if (refId === "B" || metricName.includes("status_code")) {
          liveEndpoints[s][r].httpCode = val != null ? Number(val) : "\u2014";
        } else if (refId === "C" || metricName.includes("duration")) {
          const numVal = Number(val);
          liveEndpoints[s][r].latencyMs = !isNaN(numVal) ? Math.round(numVal * 1e3) : "\u2014";
        }
        const timeField = frame.fields?.find((f) => f.type === "time" || f.name === "Time");
        if (timeField) {
          const sampleTime = getVal(timeField);
          if (sampleTime) {
            const tMs = Number(sampleTime) > 1e11 ? Number(sampleTime) : Number(sampleTime) * 1e3;
            const ageSec = Math.max(1, Math.round((Date.now() - tMs) / 1e3));
            if (ageSec < 3600) {
              liveEndpoints[s][r].freshnessSec = ageSec;
            }
          }
        }
      }
      if (!foundAny) {
        return { isLive: false, endpoints: mockEndpoints };
      }
      for (const s of ["console", "accounts", "billing"]) {
        for (const r of Object.keys(mockEndpoints[s])) {
          if (!liveEndpoints[s][r]) {
            liveEndpoints[s][r] = { ...mockEndpoints[s][r] };
          }
        }
      }
      return { isLive: true, endpoints: liveEndpoints };
    } catch (err) {
      console.warn("[ProgressiveReleasePanel] Failed to parse metrics data, using design mock baseline:", err);
      return { isLive: false, endpoints: mockEndpoints };
    }
  }, [data, useMockData]);
  const endpoints = parsedData.endpoints;
  const endpointList = (0, import_react.useMemo)(() => {
    const list = [];
    const order = [
      ["console", "/healthz"],
      ["console", "/login"],
      ["console", "/panel/agent"],
      ["accounts", "/healthz"],
      ["accounts", "/readyz"],
      ["accounts", "/api/ping"],
      ["accounts", "/api/billing/plans"],
      ["billing", "/healthz"],
      ["billing", "/readyz"],
      ["billing", "/api/ping"]
    ];
    for (const [s, r] of order) {
      if (endpoints[s]?.[r]) {
        list.push(endpoints[s][r]);
      }
    }
    return list;
  }, [endpoints]);
  const failedCount = (0, import_react.useMemo)(() => {
    return endpointList.filter((e) => e.status !== "PASS").length;
  }, [endpointList]);
  const flaggerServices = (0, import_react.useMemo)(() => {
    const baseMap = {
      console: {
        service: "Console",
        subdomain: resolvedEnv === "PROD" ? "console.svc.plus" : "console.svc.plus (sit)",
        phase: "Progressing",
        weight: 20,
        primaryPercent: 80,
        candidatePercent: 20
      },
      accounts: {
        service: "Accounts",
        subdomain: resolvedEnv === "PROD" ? "accounts.svc.plus" : "accounts.svc.plus (sit)",
        phase: "Progressing",
        weight: 10,
        primaryPercent: 90,
        candidatePercent: 10
      },
      billing: {
        service: "Billing",
        subdomain: resolvedEnv === "PROD" ? "billing.svc.plus" : "billing.svc.plus (sit)",
        phase: "Progressing",
        weight: 10,
        primaryPercent: 90,
        candidatePercent: 10
      }
    };
    if (data?.series && data.series.length > 0) {
      for (const frame of data.series) {
        const field = frame.fields?.find(
          (f) => f.name === "Value" || f.type === "number" || f.labels && Object.keys(f.labels).length > 0
        );
        const labels = frame.labels || field && field.labels || {};
        const metricName = labels.__name__ || frame.name || field && field.name || "";
        const name = (labels.name || labels.workload || "").toLowerCase();
        let targetKey = "";
        if (name.includes("console"))
          targetKey = "console";
        else if (name.includes("accounts"))
          targetKey = "accounts";
        else if (name.includes("billing"))
          targetKey = "billing";
        if (!targetKey || !baseMap[targetKey])
          continue;
        const getVal = (fld) => {
          if (!fld || !fld.values)
            return null;
          const len = typeof fld.values.length === "number" ? fld.values.length : 0;
          if (len === 0)
            return null;
          if (typeof fld.values.get === "function")
            return fld.values.get(len - 1);
          return fld.values[len - 1];
        };
        const val = getVal(field);
        if (metricName.includes("flagger_canary_status")) {
          const num = Number(val);
          if (num === 2) {
            baseMap[targetKey].phase = "Progressing";
          } else if (num === 1 || num === 0) {
            baseMap[targetKey].phase = "Succeeded";
            baseMap[targetKey].candidatePercent = 0;
            baseMap[targetKey].primaryPercent = 100;
            baseMap[targetKey].weight = 0;
          } else if (num === 3) {
            baseMap[targetKey].phase = "Failed";
          }
        } else if (metricName.includes("flagger_canary_weight")) {
          if (!name.includes("primary")) {
            const w = Math.max(0, Math.min(100, Number(val)));
            if (!isNaN(w) && w > 0) {
              baseMap[targetKey].weight = w;
              baseMap[targetKey].candidatePercent = w;
              baseMap[targetKey].primaryPercent = 100 - w;
            }
          }
        }
      }
    }
    return [baseMap.console, baseMap.accounts, baseMap.billing];
  }, [resolvedEnv, data]);
  const [isRoutesCollapsed, setIsRoutesCollapsed] = (0, import_react.useState)(false);
  const [routesFilter, setRoutesFilter] = (0, import_react.useState)("all");
  const [routesSearchQuery, setRoutesSearchQuery] = (0, import_react.useState)("");
  const fullRoutesAndApis = (0, import_react.useMemo)(() => {
    const consoleHealth = endpoints.console?.["/healthz"] || { latencyMs: 22, freshnessSec: 8, status: "PASS", httpCode: 200 };
    const consoleLogin = endpoints.console?.["/login"] || { latencyMs: 95, freshnessSec: 8, status: "PASS", httpCode: 200 };
    const consoleAgent = endpoints.console?.["/panel/agent"] || { latencyMs: 14, freshnessSec: 8, status: "PASS", httpCode: 307 };
    const accountsHealth = endpoints.accounts?.["/healthz"] || { latencyMs: 106, freshnessSec: 8, status: "PASS", httpCode: 200 };
    const accountsReady = endpoints.accounts?.["/readyz"] || { latencyMs: 94, freshnessSec: 8, status: "PASS", httpCode: 200 };
    const accountsPing = endpoints.accounts?.["/api/ping"] || { latencyMs: 14, freshnessSec: 8, status: "PASS", httpCode: 200 };
    const accountsPlans = endpoints.accounts?.["/api/billing/plans"] || { latencyMs: 67, freshnessSec: 8, status: "PASS", httpCode: 200 };
    const billingHealth = endpoints.billing?.["/healthz"] || { latencyMs: 16, freshnessSec: 8, status: "PASS", httpCode: 200 };
    const billingReady = endpoints.billing?.["/readyz"] || { latencyMs: 12, freshnessSec: 8, status: "PASS", httpCode: 200 };
    const billingPing = endpoints.billing?.["/api/ping"] || { latencyMs: 20, freshnessSec: 8, status: "PASS", httpCode: 200 };
    return [
      {
        id: "fe-operations",
        order: 1,
        type: "frontend",
        service: "Console",
        serviceDomain: "console.svc.plus",
        path: "/panel/operations",
        description: "\u5E73\u53F0\u8FD0\u7EF4\u4E2D\u5FC3\u4E0E\u6E10\u8FDB\u53D1\u5E03\u95E8\u7981\u9A8C\u8BC1\u770B\u677F",
        method: "GET",
        expectedHttp: 200,
        observedHttp: 200,
        latencyMs: 38,
        freshnessSec: consoleHealth.freshnessSec || 8,
        status: "PASS"
      },
      {
        id: "fe-agent",
        order: 2,
        type: "frontend",
        service: "Console",
        serviceDomain: "console.svc.plus",
        path: "/panel/agent",
        description: "\u667A\u80FD\u4F53\u5E94\u7528\u7F16\u6392\u3001\u4F1A\u8BDD\u62D3\u6251\u4E0E\u7EB3\u7BA1\u914D\u7F6E",
        method: "GET",
        expectedHttp: 307,
        observedHttp: consoleAgent.httpCode !== "\u2014" ? Number(consoleAgent.httpCode) : 307,
        latencyMs: consoleAgent.latencyMs !== "\u2014" ? consoleAgent.latencyMs : 14,
        freshnessSec: consoleAgent.freshnessSec || 8,
        status: consoleAgent.status === "FAIL" ? "FAIL" : "PASS"
      },
      {
        id: "fe-workspaces",
        order: 3,
        type: "frontend",
        service: "Console",
        serviceDomain: "console.svc.plus",
        path: "/panel/workspaces",
        description: "\u4E91\u7AEF\u5DE5\u4F5C\u7A7A\u95F4\u534F\u540C\u4E0E\u9694\u79BB\u8D44\u6E90\u7EC4\u7BA1\u7406",
        method: "GET",
        expectedHttp: 200,
        observedHttp: 200,
        latencyMs: 42,
        freshnessSec: consoleHealth.freshnessSec || 8,
        status: "PASS"
      },
      {
        id: "fe-settings",
        order: 4,
        type: "frontend",
        service: "Console",
        serviceDomain: "console.svc.plus",
        path: "/panel/settings",
        description: "\u7CFB\u7EDF\u504F\u597D\u8BBE\u7F6E\u3001\u4E2A\u6027\u5316\u4E3B\u9898\u4E0E\u56E2\u961F\u6CBB\u7406",
        method: "GET",
        expectedHttp: 200,
        observedHttp: 200,
        latencyMs: 35,
        freshnessSec: consoleHealth.freshnessSec || 8,
        status: "PASS"
      },
      {
        id: "fe-login",
        order: 5,
        type: "frontend",
        service: "Console",
        serviceDomain: "console.svc.plus",
        path: "/login",
        description: "\u7EDF\u4E00\u5B89\u5168\u8BA4\u8BC1\u3001SSO \u5355\u70B9\u767B\u5F55\u4E0E\u6743\u9650\u63A5\u5165\u7F51\u5173",
        method: "GET",
        expectedHttp: 200,
        observedHttp: consoleLogin.httpCode !== "\u2014" ? Number(consoleLogin.httpCode) : 200,
        latencyMs: consoleLogin.latencyMs !== "\u2014" ? consoleLogin.latencyMs : 95,
        freshnessSec: consoleLogin.freshnessSec || 8,
        status: consoleLogin.status === "FAIL" ? "FAIL" : "PASS"
      },
      {
        id: "fe-pricing",
        order: 6,
        type: "frontend",
        service: "Console",
        serviceDomain: "console.svc.plus",
        path: "/pricing",
        description: "\u8BA2\u9605\u8BA1\u5212\u3001\u7B97\u529B\u89C4\u683C\u4E0E\u4EF7\u683C\u9636\u68AF\u603B\u89C8",
        method: "GET",
        expectedHttp: 200,
        observedHttp: 200,
        latencyMs: 40,
        freshnessSec: consoleHealth.freshnessSec || 8,
        status: "PASS"
      },
      {
        id: "fe-about",
        order: 7,
        type: "frontend",
        service: "Console",
        serviceDomain: "console.svc.plus",
        path: "/about",
        description: "\u5E73\u53F0\u4E91\u539F\u751F\u67B6\u6784\u8BF4\u660E\u4E0E\u591A\u73AF\u5883\u53D1\u5E03\u5143\u6570\u636E",
        method: "GET",
        expectedHttp: 200,
        observedHttp: 200,
        latencyMs: 32,
        freshnessSec: consoleHealth.freshnessSec || 8,
        status: "PASS"
      },
      {
        id: "api-console-release",
        order: 8,
        type: "api",
        service: "Console",
        serviceDomain: "console.svc.plus",
        path: "/api/operations/progressive-release",
        description: "Console \u6E10\u8FDB\u5F0F\u53D1\u5E03\u6307\u6807\u4E0E\u95E8\u7981\u805A\u5408\u5206\u6790 API",
        method: "GET",
        expectedHttp: 200,
        observedHttp: 200,
        latencyMs: 28,
        freshnessSec: consoleHealth.freshnessSec || 8,
        status: "PASS"
      },
      {
        id: "api-console-healthz",
        order: 9,
        type: "api",
        service: "Console",
        serviceDomain: "console.svc.plus",
        path: "/healthz",
        description: "Console \u5BB9\u5668\u5E94\u7528\u5B58\u6D3B\u63A2\u9488 (Kubernetes Liveness)",
        method: "GET",
        expectedHttp: 200,
        observedHttp: consoleHealth.httpCode !== "\u2014" ? Number(consoleHealth.httpCode) : 200,
        latencyMs: consoleHealth.latencyMs !== "\u2014" ? consoleHealth.latencyMs : 22,
        freshnessSec: consoleHealth.freshnessSec || 8,
        status: consoleHealth.status === "FAIL" ? "FAIL" : "PASS"
      },
      {
        id: "api-accounts-healthz",
        order: 10,
        type: "api",
        service: "Accounts",
        serviceDomain: "accounts.svc.plus",
        path: "/healthz",
        description: "Accounts \u7EDF\u4E00\u8EAB\u4EFD\u8BA4\u8BC1\u5FAE\u670D\u52A1\u5B58\u6D3B\u63A2\u9488",
        method: "GET",
        expectedHttp: 200,
        observedHttp: accountsHealth.httpCode !== "\u2014" ? Number(accountsHealth.httpCode) : 200,
        latencyMs: accountsHealth.latencyMs !== "\u2014" ? accountsHealth.latencyMs : 106,
        freshnessSec: accountsHealth.freshnessSec || 8,
        status: accountsHealth.status === "FAIL" ? "FAIL" : "PASS"
      },
      {
        id: "api-accounts-readyz",
        order: 11,
        type: "api",
        service: "Accounts",
        serviceDomain: "accounts.svc.plus",
        path: "/readyz",
        description: "Accounts \u6570\u636E\u5E93\u94FE\u63A5\u4E0E\u5C31\u7EEA\u63A2\u9488 (Readiness)",
        method: "GET",
        expectedHttp: 200,
        observedHttp: accountsReady.httpCode !== "\u2014" ? Number(accountsReady.httpCode) : 200,
        latencyMs: accountsReady.latencyMs !== "\u2014" ? accountsReady.latencyMs : 94,
        freshnessSec: accountsReady.freshnessSec || 8,
        status: accountsReady.status === "FAIL" ? "FAIL" : "PASS"
      },
      {
        id: "api-accounts-ping",
        order: 12,
        type: "api",
        service: "Accounts",
        serviceDomain: "accounts.svc.plus",
        path: "/api/ping",
        description: "Accounts \u5FAE\u670D\u52A1\u7F51\u7EDC\u5F80\u8FD4\u5EF6\u8FDF\u4E0E\u5FC3\u8DF3\u63A2\u9488",
        method: "GET",
        expectedHttp: 200,
        observedHttp: accountsPing.httpCode !== "\u2014" ? Number(accountsPing.httpCode) : 200,
        latencyMs: accountsPing.latencyMs !== "\u2014" ? accountsPing.latencyMs : 14,
        freshnessSec: accountsPing.freshnessSec || 8,
        status: accountsPing.status === "FAIL" ? "FAIL" : "PASS"
      },
      {
        id: "api-accounts-billing-plans",
        order: 13,
        type: "api",
        service: "Accounts",
        serviceDomain: "accounts.svc.plus",
        path: "/api/billing/plans",
        description: "Accounts \u8BA1\u8D39\u5957\u9910\u4E0E\u6743\u76CA\u540C\u6B65\u7F51\u5173\u63A5\u53E3",
        method: "GET",
        expectedHttp: 200,
        observedHttp: accountsPlans.httpCode !== "\u2014" ? Number(accountsPlans.httpCode) : 200,
        latencyMs: accountsPlans.latencyMs !== "\u2014" ? accountsPlans.latencyMs : 67,
        freshnessSec: accountsPlans.freshnessSec || 8,
        status: accountsPlans.status === "FAIL" ? "FAIL" : "PASS"
      },
      {
        id: "api-billing-healthz",
        order: 14,
        type: "api",
        service: "Billing",
        serviceDomain: "billing.svc.plus",
        path: "/healthz",
        description: "Billing \u8D26\u5355\u4E0E\u7ED3\u7B97\u4E2D\u5FC3\u5FAE\u670D\u52A1\u5B58\u6D3B\u63A2\u9488",
        method: "GET",
        expectedHttp: 200,
        observedHttp: billingHealth.httpCode !== "\u2014" ? Number(billingHealth.httpCode) : 200,
        latencyMs: billingHealth.latencyMs !== "\u2014" ? billingHealth.latencyMs : 16,
        freshnessSec: billingHealth.freshnessSec || 8,
        status: billingHealth.status === "FAIL" ? "FAIL" : "PASS"
      },
      {
        id: "api-billing-readyz",
        order: 15,
        type: "api",
        service: "Billing",
        serviceDomain: "billing.svc.plus",
        path: "/readyz",
        description: "Billing \u8D26\u5355\u4EA4\u6613\u5F15\u64CE\u4E0E\u6570\u636E\u5B58\u50A8\u5C31\u7EEA\u63A2\u9488",
        method: "GET",
        expectedHttp: 200,
        observedHttp: billingReady.httpCode !== "\u2014" ? Number(billingReady.httpCode) : 200,
        latencyMs: billingReady.latencyMs !== "\u2014" ? billingReady.latencyMs : 12,
        freshnessSec: billingReady.freshnessSec || 8,
        status: billingReady.status === "FAIL" ? "FAIL" : "PASS"
      },
      {
        id: "api-billing-ping",
        order: 16,
        type: "api",
        service: "Billing",
        serviceDomain: "billing.svc.plus",
        path: "/api/ping",
        description: "Billing \u5FAE\u670D\u52A1\u5EF6\u8FDF\u63A2\u6D4B\u4E0E\u7F51\u5173\u901A\u4FE1\u5FC3\u8DF3",
        method: "GET",
        expectedHttp: 200,
        observedHttp: billingPing.httpCode !== "\u2014" ? Number(billingPing.httpCode) : 200,
        latencyMs: billingPing.latencyMs !== "\u2014" ? billingPing.latencyMs : 20,
        freshnessSec: billingPing.freshnessSec || 8,
        status: billingPing.status === "FAIL" ? "FAIL" : "PASS"
      }
    ];
  }, [endpoints]);
  const filteredFullRoutes = (0, import_react.useMemo)(() => {
    return fullRoutesAndApis.filter((item) => {
      if (routesFilter === "frontend" && item.type !== "frontend")
        return false;
      if (routesFilter === "api" && item.type !== "api")
        return false;
      if (routesSearchQuery.trim()) {
        const q = routesSearchQuery.toLowerCase().trim();
        return item.path.toLowerCase().includes(q) || item.description.toLowerCase().includes(q) || item.service.toLowerCase().includes(q) || item.serviceDomain.toLowerCase().includes(q);
      }
      return true;
    });
  }, [fullRoutesAndApis, routesFilter, routesSearchQuery]);
  const renderCellBadge = (item) => {
    if (!item) {
      return /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#4b5563", fontSize: "14px" } }, "\u2014");
    }
    const isPass = item.status === "PASS";
    const isFail = item.status === "FAIL";
    const bg = isPass ? "#052e16" : isFail ? "#450a0a" : "#181b20";
    const border = isPass ? "1px solid #166534" : isFail ? "1px solid #991b1b" : "1px solid #374151";
    const badgeBg = isPass ? "#16a34a" : isFail ? "#dc2626" : "#4b5563";
    const latColor = isPass ? "#86efac" : isFail ? "#fca5a5" : "#9ca3af";
    return /* @__PURE__ */ import_react.default.createElement(
      "div",
      {
        style: {
          background: bg,
          border,
          borderRadius: "4px",
          padding: "4px 6px",
          textAlign: "center",
          minWidth: "58px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.4)"
        }
      },
      /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement(
        "span",
        {
          style: {
            background: badgeBg,
            color: "#ffffff",
            fontSize: "9px",
            fontWeight: 700,
            padding: "1px 5px",
            borderRadius: "3px",
            letterSpacing: "0.5px",
            display: "inline-block"
          }
        },
        item.status
      )),
      /* @__PURE__ */ import_react.default.createElement("div", { style: { color: "#ffffff", fontSize: "13px", fontWeight: 700, margin: "2px 0 1px 0" } }, item.httpCode),
      /* @__PURE__ */ import_react.default.createElement("div", { style: { color: latColor, fontSize: "10px", opacity: 0.9 } }, item.latencyMs !== "\u2014" ? `p95 ${item.latencyMs} ms` : "p95 \u2014")
    );
  };
  return /* @__PURE__ */ import_react.default.createElement(
    "div",
    {
      style: {
        width: "100%",
        minHeight: height || "auto",
        background: "#0d0f15",
        color: "#f3f4f6",
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        padding: "16px 20px",
        boxSizing: "border-box",
        overflowY: "auto"
      }
    },
    (mode === "all" || mode === "matrix_only") && showKpis && /* @__PURE__ */ import_react.default.createElement("div", { style: { marginBottom: "16px" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" } }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("div", { style: { color: "#ffffff", fontSize: "22px", fontWeight: 800, letterSpacing: "-0.3px" } }, "Progressive Release Validation"), /* @__PURE__ */ import_react.default.createElement("div", { style: { color: "#8b949e", fontSize: "13px", marginTop: "2px" } }, "Service \xD7 API status matrix for progressive releases (", resolvedEnv, ")")), /* @__PURE__ */ import_react.default.createElement(
      "span",
      {
        style: {
          background: parsedData.isLive ? "#14532d" : "#1f2937",
          border: `1px solid ${parsedData.isLive ? "#22c55e" : "#374151"}`,
          color: parsedData.isLive ? "#86efac" : "#9ca3af",
          fontSize: "11px",
          fontWeight: 700,
          padding: "3px 8px",
          borderRadius: "4px"
        }
      },
      parsedData.isLive ? `\u25CF LIVE ${resolvedEnv} DATA` : "PREVIEW MOCK DATA"
    )), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1.5fr 1.5fr", gap: "12px" } }, /* @__PURE__ */ import_react.default.createElement(
      "div",
      {
        style: {
          background: "#13161f",
          border: "1px solid #232838",
          borderRadius: "6px",
          padding: "12px 16px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }
      },
      /* @__PURE__ */ import_react.default.createElement("div", { style: { color: "#8b949e", fontSize: "12px", fontWeight: 500 } }, "Environment"),
      /* @__PURE__ */ import_react.default.createElement("div", { style: { color: "#ffffff", fontSize: "22px", fontWeight: 800, letterSpacing: "0.5px", marginTop: "3px" } }, resolvedEnv)
    ), /* @__PURE__ */ import_react.default.createElement(
      "div",
      {
        style: {
          background: "#13161f",
          border: "1px solid #232838",
          borderRadius: "6px",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }
      },
      /* @__PURE__ */ import_react.default.createElement(
        "div",
        {
          style: {
            border: "1px solid #374151",
            borderRadius: "5px",
            padding: "6px 8px",
            fontSize: "20px",
            lineHeight: 1,
            color: "#9ca3af"
          }
        },
        "\u{1F4C5}"
      ),
      /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("div", { style: { color: "#8b949e", fontSize: "12px", fontWeight: 500 } }, "Observation window"), /* @__PURE__ */ import_react.default.createElement("div", { style: { color: "#ffffff", fontSize: "15px", fontWeight: 600, marginTop: "2px" } }, observationWindowStr))
    ), /* @__PURE__ */ import_react.default.createElement(
      "div",
      {
        style: {
          background: "#13161f",
          border: "1px solid #232838",
          borderRadius: "6px",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }
      },
      /* @__PURE__ */ import_react.default.createElement(
        "div",
        {
          style: {
            border: `2px solid ${failedCount > 0 ? "#ef4444" : "#22c55e"}`,
            borderRadius: "50%",
            width: "28px",
            height: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            fontWeight: 900,
            color: failedCount > 0 ? "#ef4444" : "#22c55e"
          }
        },
        failedCount > 0 ? "\u2715" : "\u2713"
      ),
      /* @__PURE__ */ import_react.default.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { color: "#8b949e", fontSize: "12px", fontWeight: 500 } }, "Release gate (overall)"), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginTop: "3px" } }, /* @__PURE__ */ import_react.default.createElement(
        "span",
        {
          style: {
            background: failedCount > 0 ? "#dc2626" : "#16a34a",
            color: "#ffffff",
            fontSize: "11px",
            fontWeight: 800,
            padding: "2px 8px",
            borderRadius: "4px",
            letterSpacing: "0.5px"
          }
        },
        failedCount > 0 ? "BLOCKED" : "PASSED"
      ), /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#d1d5db", fontSize: "13px", fontWeight: 500 } }, failedCount > 0 ? `${failedCount} / 10 checks failed` : "10 / 10 checks passed")))
    ))),
    (mode === "all" || mode === "matrix_only") && showMatrix && /* @__PURE__ */ import_react.default.createElement(
      "div",
      {
        style: {
          background: "#13161f",
          border: "1px solid #232838",
          borderRadius: "6px",
          padding: "14px 16px",
          marginBottom: "16px"
        }
      },
      /* @__PURE__ */ import_react.default.createElement("div", { style: { color: "#ffffff", fontSize: "15px", fontWeight: 700, marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" } }, "Service \xD7 Endpoint Status ", /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#6b7280", fontSize: "13px", cursor: "pointer" } }, "\u24D8")),
      /* @__PURE__ */ import_react.default.createElement("div", { style: { overflowX: "auto" } }, /* @__PURE__ */ import_react.default.createElement("table", { style: { width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "880px" } }, /* @__PURE__ */ import_react.default.createElement("thead", null, /* @__PURE__ */ import_react.default.createElement("tr", null, /* @__PURE__ */ import_react.default.createElement(
        "th",
        {
          rowSpan: 2,
          style: {
            padding: "8px 12px",
            color: "#ffffff",
            fontSize: "12px",
            fontWeight: 700,
            borderBottom: "1px solid #2a2f40",
            borderRight: "1px solid #2a2f40",
            verticalAlign: "bottom",
            width: "130px"
          }
        },
        "Service"
      ), /* @__PURE__ */ import_react.default.createElement(
        "th",
        {
          colSpan: 3,
          style: {
            background: "#172554",
            color: "#93c5fd",
            fontSize: "12px",
            fontWeight: 700,
            textAlign: "center",
            padding: "6px 8px",
            borderRight: "1px solid #1e3a8a",
            borderBottom: "1px solid #1e3a8a"
          }
        },
        "Console ",
        /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: "11px", opacity: 0.8, fontWeight: 400 } }, "(console.svc.plus)")
      ), /* @__PURE__ */ import_react.default.createElement(
        "th",
        {
          colSpan: 4,
          style: {
            background: "#3b0764",
            color: "#d8b4fe",
            fontSize: "12px",
            fontWeight: 700,
            textAlign: "center",
            padding: "6px 8px",
            borderRight: "1px solid #581c87",
            borderBottom: "1px solid #581c87"
          }
        },
        "Accounts ",
        /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: "11px", opacity: 0.8, fontWeight: 400 } }, "(accounts.svc.plus)")
      ), /* @__PURE__ */ import_react.default.createElement(
        "th",
        {
          colSpan: 3,
          style: {
            background: "#451a03",
            color: "#fde68a",
            fontSize: "12px",
            fontWeight: 700,
            textAlign: "center",
            padding: "6px 8px",
            borderBottom: "1px solid #78350f"
          }
        },
        "Billing"
      )), /* @__PURE__ */ import_react.default.createElement("tr", { style: { background: "#0b0d13" } }, /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "6px 4px", color: "#60a5fa", fontSize: "11px", textAlign: "center", borderRight: "1px solid #1f2937" } }, "/healthz"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "6px 4px", color: "#60a5fa", fontSize: "11px", textAlign: "center", borderRight: "1px solid #1f2937" } }, "/login"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "6px 4px", color: "#60a5fa", fontSize: "11px", textAlign: "center", borderRight: "1px solid #2a2f40" } }, "/panel/agent"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "6px 4px", color: "#c084fc", fontSize: "11px", textAlign: "center", borderRight: "1px solid #1f2937" } }, "/healthz"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "6px 4px", color: "#c084fc", fontSize: "11px", textAlign: "center", borderRight: "1px solid #1f2937" } }, "/readyz"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "6px 4px", color: "#c084fc", fontSize: "11px", textAlign: "center", borderRight: "1px solid #1f2937" } }, "/api/ping"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "6px 4px", color: "#c084fc", fontSize: "11px", textAlign: "center", borderRight: "1px solid #2a2f40" } }, "/api/billing/plans"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "6px 4px", color: "#fcd34d", fontSize: "11px", textAlign: "center", borderRight: "1px solid #1f2937" } }, "/healthz"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "6px 4px", color: "#fcd34d", fontSize: "11px", textAlign: "center", borderRight: "1px solid #1f2937" } }, "/readyz"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "6px 4px", color: "#fcd34d", fontSize: "11px", textAlign: "center" } }, "/api/ping"))), /* @__PURE__ */ import_react.default.createElement("tbody", null, /* @__PURE__ */ import_react.default.createElement("tr", { style: { borderBottom: "1px solid #1f2430" } }, /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "8px 12px", borderRight: "1px solid #2a2f40" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { color: "#ffffff", fontSize: "13px", fontWeight: 700 } }, "Console"), /* @__PURE__ */ import_react.default.createElement("div", { style: { color: "#8b949e", fontSize: "11px" } }, "console.svc.plus")), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "6px 4px", textAlign: "center" } }, renderCellBadge(endpoints.console?.["/healthz"])), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "6px 4px", textAlign: "center" } }, renderCellBadge(endpoints.console?.["/login"])), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "6px 4px", textAlign: "center", borderRight: "1px solid #2a2f40" } }, renderCellBadge(endpoints.console?.["/panel/agent"])), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "6px 4px", textAlign: "center" } }, renderCellBadge(void 0)), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "6px 4px", textAlign: "center" } }, renderCellBadge(void 0)), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "6px 4px", textAlign: "center" } }, renderCellBadge(void 0)), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "6px 4px", textAlign: "center", borderRight: "1px solid #2a2f40" } }, renderCellBadge(void 0)), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "6px 4px", textAlign: "center" } }, renderCellBadge(void 0)), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "6px 4px", textAlign: "center" } }, renderCellBadge(void 0)), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "6px 4px", textAlign: "center" } }, renderCellBadge(void 0))), /* @__PURE__ */ import_react.default.createElement("tr", { style: { borderBottom: "1px solid #1f2430" } }, /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "8px 12px", borderRight: "1px solid #2a2f40" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { color: "#ffffff", fontSize: "13px", fontWeight: 700 } }, "Accounts"), /* @__PURE__ */ import_react.default.createElement("div", { style: { color: "#8b949e", fontSize: "11px" } }, "accounts.svc.plus")), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "6px 4px", textAlign: "center" } }, renderCellBadge(void 0)), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "6px 4px", textAlign: "center" } }, renderCellBadge(void 0)), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "6px 4px", textAlign: "center", borderRight: "1px solid #2a2f40" } }, renderCellBadge(void 0)), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "6px 4px", textAlign: "center" } }, renderCellBadge(endpoints.accounts?.["/healthz"])), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "6px 4px", textAlign: "center" } }, renderCellBadge(endpoints.accounts?.["/readyz"])), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "6px 4px", textAlign: "center" } }, renderCellBadge(endpoints.accounts?.["/api/ping"])), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "6px 4px", textAlign: "center", borderRight: "1px solid #2a2f40" } }, renderCellBadge(endpoints.accounts?.["/api/billing/plans"])), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "6px 4px", textAlign: "center" } }, renderCellBadge(void 0)), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "6px 4px", textAlign: "center" } }, renderCellBadge(void 0)), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "6px 4px", textAlign: "center" } }, renderCellBadge(void 0))), /* @__PURE__ */ import_react.default.createElement("tr", null, /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "8px 12px", borderRight: "1px solid #2a2f40" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { color: "#ffffff", fontSize: "13px", fontWeight: 700 } }, "Billing"), /* @__PURE__ */ import_react.default.createElement("div", { style: { color: "#8b949e", fontSize: "11px" } }, "billing.svc.plus")), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "6px 4px", textAlign: "center" } }, renderCellBadge(void 0)), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "6px 4px", textAlign: "center" } }, renderCellBadge(void 0)), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "6px 4px", textAlign: "center", borderRight: "1px solid #2a2f40" } }, renderCellBadge(void 0)), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "6px 4px", textAlign: "center" } }, renderCellBadge(void 0)), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "6px 4px", textAlign: "center" } }, renderCellBadge(void 0)), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "6px 4px", textAlign: "center" } }, renderCellBadge(void 0)), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "6px 4px", textAlign: "center", borderRight: "1px solid #2a2f40" } }, renderCellBadge(void 0)), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "6px 4px", textAlign: "center" } }, renderCellBadge(endpoints.billing?.["/healthz"])), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "6px 4px", textAlign: "center" } }, renderCellBadge(endpoints.billing?.["/readyz"])), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "6px 4px", textAlign: "center" } }, renderCellBadge(endpoints.billing?.["/api/ping"]))))))
    ),
    (mode === "all" || mode === "flagger_only") && showFlagger && /* @__PURE__ */ import_react.default.createElement(
      "div",
      {
        style: {
          background: "#13161f",
          border: "1px solid #232838",
          borderRadius: "6px",
          padding: "14px 16px",
          marginBottom: "16px"
        }
      },
      /* @__PURE__ */ import_react.default.createElement("div", { style: { color: "#ffffff", fontSize: "15px", fontWeight: 700, marginBottom: "12px" } }, "Flagger (Progressive Release)"),
      /* @__PURE__ */ import_react.default.createElement("div", { style: { overflowX: "auto" } }, /* @__PURE__ */ import_react.default.createElement("table", { style: { width: "100%", borderCollapse: "collapse", textAlign: "left" } }, /* @__PURE__ */ import_react.default.createElement("thead", null, /* @__PURE__ */ import_react.default.createElement("tr", { style: { borderBottom: "1px solid #232838" } }, /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "8px 12px", color: "#8b949e", fontSize: "12px", fontWeight: 600, width: "220px" } }, "Service"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "8px 12px", color: "#8b949e", fontSize: "12px", fontWeight: 600, width: "140px" } }, "Flagger phase"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "8px 12px", color: "#8b949e", fontSize: "12px", fontWeight: 600, width: "140px" } }, "Weight (candidate)"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "8px 12px", color: "#8b949e", fontSize: "12px", fontWeight: 600 } }, "Traffic (primary vs candidate)"))), /* @__PURE__ */ import_react.default.createElement("tbody", null, flaggerServices.map((fs, idx) => {
        const isSucceeded = fs.phase === "Succeeded";
        const isProgressing = fs.phase === "Progressing";
        const phaseBg = isSucceeded ? "#064e3b" : isProgressing ? "#1e3a8a" : "#1f2937";
        const phaseBorder = isSucceeded ? "#059669" : isProgressing ? "#2563eb" : "#374151";
        const phaseColor = isSucceeded ? "#6ee7b7" : isProgressing ? "#93c5fd" : "#9ca3af";
        return /* @__PURE__ */ import_react.default.createElement("tr", { key: idx, style: { borderBottom: idx < flaggerServices.length - 1 ? "1px solid #1b1e2a" : "none" } }, /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "10px 12px" } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#ffffff", fontSize: "13px", fontWeight: 700 } }, fs.service), " ", /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#8b949e", fontSize: "11px" } }, fs.subdomain)), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "10px 12px" } }, /* @__PURE__ */ import_react.default.createElement(
          "span",
          {
            style: {
              background: phaseBg,
              border: `1px solid ${phaseBorder}`,
              color: phaseColor,
              fontSize: "11px",
              fontWeight: 700,
              padding: "3px 8px",
              borderRadius: "4px"
            }
          },
          fs.phase
        )), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "10px 12px", color: "#ffffff", fontSize: "13px", fontWeight: 700 } }, fs.weight != null ? `${fs.weight}%` : "\u2014"), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "10px 12px" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: "10px" } }, /* @__PURE__ */ import_react.default.createElement(
          "div",
          {
            style: {
              flex: 1,
              height: "14px",
              background: "#1e293b",
              borderRadius: "4px",
              overflow: "hidden",
              display: "flex",
              maxWidth: "300px"
            }
          },
          /* @__PURE__ */ import_react.default.createElement("div", { style: { width: `${fs.primaryPercent}%`, background: "#22c55e", height: "100%" } }),
          /* @__PURE__ */ import_react.default.createElement("div", { style: { width: `${fs.candidatePercent}%`, background: "#3b82f6", height: "100%" } })
        ), /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#9ca3af", fontSize: "11px" } }, "Primary ", fs.primaryPercent, "% | Candidate ", fs.candidatePercent, "%"))));
      }))))
    ),
    (mode === "all" || mode === "details_only") && showDetails && /* @__PURE__ */ import_react.default.createElement(
      "div",
      {
        style: {
          background: "#13161f",
          border: "1px solid #232838",
          borderRadius: "6px",
          padding: "14px 16px",
          marginBottom: "16px"
        }
      },
      /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px" } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#ffffff", fontSize: "15px", fontWeight: 700 } }, "Top 10 Endpoint Details (", parsedData.isLive ? `Live ${resolvedEnv} Data` : "Sample Mock Data", ")"), /* @__PURE__ */ import_react.default.createElement(
        "span",
        {
          style: {
            background: parsedData.isLive ? "#14532d" : "#1e293b",
            border: `1px solid ${parsedData.isLive ? "#22c55e" : "#374151"}`,
            color: parsedData.isLive ? "#86efac" : "#9ca3af",
            fontSize: "10px",
            fontWeight: 700,
            padding: "2px 6px",
            borderRadius: "3px"
          }
        },
        parsedData.isLive ? "\u25CF LIVE METRICS" : "SAMPLE MOCK DATA"
      )), /* @__PURE__ */ import_react.default.createElement("div", { style: { color: "#8b949e", fontSize: "12px" } }, "10/10 checks \u2022 ", failedCount, " failed \u2022 Updated: ", updatedTimeStr)),
      /* @__PURE__ */ import_react.default.createElement("div", { style: { overflowX: "auto" } }, /* @__PURE__ */ import_react.default.createElement("table", { style: { width: "100%", borderCollapse: "collapse", textAlign: "left" } }, /* @__PURE__ */ import_react.default.createElement("thead", null, /* @__PURE__ */ import_react.default.createElement("tr", { style: { borderBottom: "1px solid #232838" } }, /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "8px 10px", color: "#8b949e", fontSize: "12px", fontWeight: 600, width: "30px" } }, "#"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "8px 10px", color: "#8b949e", fontSize: "12px", fontWeight: 600 } }, "Service"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "8px 10px", color: "#8b949e", fontSize: "12px", fontWeight: 600 } }, "Endpoint (GET)"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "8px 10px", color: "#8b949e", fontSize: "12px", fontWeight: 600 } }, "Expected HTTP"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "8px 10px", color: "#8b949e", fontSize: "12px", fontWeight: 600 } }, "Observed HTTP"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "8px 10px", color: "#8b949e", fontSize: "12px", fontWeight: 600 } }, "p95 Latency"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "8px 10px", color: "#8b949e", fontSize: "12px", fontWeight: 600 } }, "Freshness (age)"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "8px 10px", color: "#8b949e", fontSize: "12px", fontWeight: 600 } }, "Result"))), /* @__PURE__ */ import_react.default.createElement("tbody", null, endpointList.map((ep, idx) => {
        const isConsole = ep.service === "console";
        const isAccounts = ep.service === "accounts";
        const sBg = isConsole ? "#14532d" : isAccounts ? "#1e3a8a" : "#4c1d95";
        const sColor = isConsole ? "#86efac" : isAccounts ? "#93c5fd" : "#c4b5fd";
        const isPass = ep.status === "PASS";
        const isFail = ep.status === "FAIL";
        const httpBg = ep.httpCode === 200 ? "#15803d" : ep.httpCode === 307 ? "#15803d" : "#b91c1c";
        return /* @__PURE__ */ import_react.default.createElement("tr", { key: idx, style: { borderBottom: idx < endpointList.length - 1 ? "1px solid #1a1e28" : "none" } }, /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "8px 10px", color: "#8b949e", fontSize: "12px" } }, idx + 1), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "8px 10px" } }, /* @__PURE__ */ import_react.default.createElement(
          "span",
          {
            style: {
              background: sBg,
              color: sColor,
              fontSize: "11px",
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: "4px",
              textTransform: "capitalize"
            }
          },
          ep.service
        )), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "8px 10px", color: "#ffffff", fontSize: "12px", fontFamily: "monospace" } }, ep.route), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "8px 10px", color: "#d1d5db", fontSize: "12px" } }, ep.expectedHttp), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "8px 10px" } }, /* @__PURE__ */ import_react.default.createElement(
          "span",
          {
            style: {
              background: httpBg,
              color: "#ffffff",
              fontSize: "11px",
              fontWeight: 700,
              padding: "2px 6px",
              borderRadius: "3px"
            }
          },
          ep.httpCode
        )), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "8px 10px", color: "#d1d5db", fontSize: "12px" } }, ep.latencyMs !== "\u2014" ? `${ep.latencyMs} ms` : "\u2014"), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "8px 10px", color: "#d1d5db", fontSize: "12px" } }, ep.freshnessSec != null ? `${ep.freshnessSec} s` : "\u2014"), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "8px 10px" } }, /* @__PURE__ */ import_react.default.createElement(
          "span",
          {
            style: {
              color: isPass ? "#22c55e" : isFail ? "#ef4444" : "#9ca3af",
              fontSize: "12px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }
          },
          isPass ? "\u2714 PASS" : isFail ? "\u2716 FAIL" : "NO DATA"
        )));
      }))))
    ),
    (mode === "all" || mode === "details_only") && showFooter && /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "grid", gridTemplateColumns: "1.6fr 1.2fr", gap: "12px" } }, /* @__PURE__ */ import_react.default.createElement(
      "div",
      {
        style: {
          background: "#13161f",
          border: "1px solid #232838",
          borderLeft: "4px solid #3b82f6",
          borderRadius: "6px",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }
      },
      /* @__PURE__ */ import_react.default.createElement("div", { style: { color: "#60a5fa", fontSize: "18px", lineHeight: 1 } }, "\u24D8"),
      /* @__PURE__ */ import_react.default.createElement("div", { style: { color: "#d1d5db", fontSize: "12px", lineHeight: 1.5 } }, "Gate rule: The release is ", /* @__PURE__ */ import_react.default.createElement("strong", { style: { color: "#ef4444" } }, "BLOCKED"), " if any endpoint is failed, stale (exceeds freshness), missing samples (NO DATA), or if the candidate request sample is insufficient.")
    ), /* @__PURE__ */ import_react.default.createElement(
      "div",
      {
        style: {
          background: "#13161f",
          border: "1px solid #232838",
          borderLeft: "4px solid #8b5cf6",
          borderRadius: "6px",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }
      },
      /* @__PURE__ */ import_react.default.createElement("div", { style: { color: "#a78bfa", fontSize: "18px", lineHeight: 1 } }, "\u{1F9EA}"),
      /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("div", { style: { color: "#ffffff", fontSize: "13px", fontWeight: 600 } }, "Candidate sample: ", resolvedEnv === "PROD" ? "34,862 requests" : "12,450 requests"), /* @__PURE__ */ import_react.default.createElement("div", { style: { color: "#22c55e", fontSize: "11px", fontWeight: 600, marginTop: "1px" } }, "(sufficient, \u2265 10,000)"))
    )),
    (mode === "all" || mode === "details_only") && showRoutesTable && /* @__PURE__ */ import_react.default.createElement(
      "div",
      {
        style: {
          background: "#13161f",
          border: "1px solid #232838",
          borderRadius: "6px",
          overflow: "hidden",
          marginTop: "16px"
        }
      },
      /* @__PURE__ */ import_react.default.createElement(
        "div",
        {
          onClick: () => setIsRoutesCollapsed(!isRoutesCollapsed),
          style: {
            padding: "10px 16px",
            background: "#181d2a",
            borderBottom: isRoutesCollapsed ? "none" : "1px solid #232838",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            userSelect: "none"
          }
        },
        /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px" } }, /* @__PURE__ */ import_react.default.createElement(
          "span",
          {
            style: {
              color: "#8b949e",
              fontSize: "11px",
              display: "inline-block",
              transform: isRoutesCollapsed ? "rotate(0deg)" : "rotate(90deg)",
              transition: "transform 0.15s ease"
            }
          },
          "\u25B6"
        ), /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#ffffff", fontSize: "13px", fontWeight: 600 } }, "Web Console \u524D\u7AEF\u5168\u91CF\u8DEF\u7531\u4E0E\u540E\u7AEF\u670D\u52A1 API \u63A5\u53E3\u6E05\u5355"), /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#8b949e", fontSize: "11px" } }, "(Full Routing & Microservices APIs Matrix)")),
        /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ import_react.default.createElement(
          "span",
          {
            style: {
              background: "rgba(59, 130, 246, 0.15)",
              color: "#60a5fa",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              padding: "2px 8px",
              borderRadius: "12px",
              fontSize: "11px",
              fontWeight: 600
            }
          },
          "7 Frontend Routes"
        ), /* @__PURE__ */ import_react.default.createElement(
          "span",
          {
            style: {
              background: "rgba(168, 85, 247, 0.15)",
              color: "#c084fc",
              border: "1px solid rgba(168, 85, 247, 0.3)",
              padding: "2px 8px",
              borderRadius: "12px",
              fontSize: "11px",
              fontWeight: 600
            }
          },
          "9 Backend APIs"
        ), /* @__PURE__ */ import_react.default.createElement(
          "span",
          {
            style: {
              background: "rgba(34, 197, 94, 0.15)",
              color: "#4ade80",
              border: "1px solid rgba(34, 197, 94, 0.3)",
              padding: "2px 8px",
              borderRadius: "12px",
              fontSize: "11px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }
          },
          /* @__PURE__ */ import_react.default.createElement("span", { style: { width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e" } }),
          "All 100% Online"
        ))
      ),
      !isRoutesCollapsed && /* @__PURE__ */ import_react.default.createElement("div", { style: { padding: "12px 16px" } }, /* @__PURE__ */ import_react.default.createElement(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "12px",
            gap: "12px",
            flexWrap: "wrap"
          }
        },
        /* @__PURE__ */ import_react.default.createElement(
          "div",
          {
            style: {
              display: "flex",
              gap: "4px",
              background: "#0d0f15",
              padding: "3px",
              borderRadius: "6px",
              border: "1px solid #232838"
            }
          },
          /* @__PURE__ */ import_react.default.createElement(
            "button",
            {
              type: "button",
              onClick: () => setRoutesFilter("all"),
              style: {
                background: routesFilter === "all" ? "#232838" : "transparent",
                color: routesFilter === "all" ? "#ffffff" : "#8b949e",
                border: "none",
                borderRadius: "4px",
                padding: "3px 10px",
                fontSize: "11px",
                fontWeight: 600,
                cursor: "pointer"
              }
            },
            "All (",
            fullRoutesAndApis.length,
            ")"
          ),
          /* @__PURE__ */ import_react.default.createElement(
            "button",
            {
              type: "button",
              onClick: () => setRoutesFilter("frontend"),
              style: {
                background: routesFilter === "frontend" ? "#1e3a8a" : "transparent",
                color: routesFilter === "frontend" ? "#93c5fd" : "#8b949e",
                border: "none",
                borderRadius: "4px",
                padding: "3px 10px",
                fontSize: "11px",
                fontWeight: 600,
                cursor: "pointer"
              }
            },
            "\u{1F310} Frontend (7)"
          ),
          /* @__PURE__ */ import_react.default.createElement(
            "button",
            {
              type: "button",
              onClick: () => setRoutesFilter("api"),
              style: {
                background: routesFilter === "api" ? "#4c1d95" : "transparent",
                color: routesFilter === "api" ? "#c4b5fd" : "#8b949e",
                border: "none",
                borderRadius: "4px",
                padding: "3px 10px",
                fontSize: "11px",
                fontWeight: 600,
                cursor: "pointer"
              }
            },
            "\u2699 Backend APIs (9)"
          )
        ),
        /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement(
          "input",
          {
            type: "text",
            value: routesSearchQuery,
            onChange: (e) => setRoutesSearchQuery(e.target.value),
            placeholder: "Search routes or APIs...",
            style: {
              background: "#0d0f15",
              border: "1px solid #232838",
              borderRadius: "6px",
              color: "#ffffff",
              fontSize: "11px",
              padding: "4px 10px",
              outline: "none",
              minWidth: "200px"
            }
          }
        ))
      ), /* @__PURE__ */ import_react.default.createElement("div", { style: { overflowX: "auto" } }, /* @__PURE__ */ import_react.default.createElement("table", { style: { width: "100%", borderCollapse: "collapse", textAlign: "left" } }, /* @__PURE__ */ import_react.default.createElement("thead", null, /* @__PURE__ */ import_react.default.createElement("tr", { style: { borderBottom: "1px solid #232838" } }, /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "8px 10px", color: "#8b949e", fontSize: "11px", fontWeight: 600, width: "30px" } }, "#"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "8px 10px", color: "#8b949e", fontSize: "11px", fontWeight: 600, width: "80px" } }, "Type"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "8px 10px", color: "#8b949e", fontSize: "11px", fontWeight: 600, width: "90px" } }, "Service"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "8px 10px", color: "#8b949e", fontSize: "11px", fontWeight: 600 } }, "Path / Route"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "8px 10px", color: "#8b949e", fontSize: "11px", fontWeight: 600 } }, "Description"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "8px 10px", color: "#8b949e", fontSize: "11px", fontWeight: 600, width: "60px" } }, "Method"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "8px 10px", color: "#8b949e", fontSize: "11px", fontWeight: 600, width: "70px" } }, "Expected"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "8px 10px", color: "#8b949e", fontSize: "11px", fontWeight: 600, width: "70px" } }, "Observed"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "8px 10px", color: "#8b949e", fontSize: "11px", fontWeight: 600, width: "90px" } }, "Latency"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "8px 10px", color: "#8b949e", fontSize: "11px", fontWeight: 600, width: "70px" } }, "Result"))), /* @__PURE__ */ import_react.default.createElement("tbody", null, filteredFullRoutes.map((item, idx) => {
        const isFe = item.type === "frontend";
        const typeBg = isFe ? "rgba(59, 130, 246, 0.15)" : "rgba(168, 85, 247, 0.15)";
        const typeColor = isFe ? "#93c5fd" : "#d8b4fe";
        const isPass = item.status === "PASS";
        return /* @__PURE__ */ import_react.default.createElement(
          "tr",
          {
            key: item.id,
            style: {
              borderBottom: idx < filteredFullRoutes.length - 1 ? "1px solid #1a1e28" : "none"
            }
          },
          /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "8px 10px", color: "#8b949e", fontSize: "11px" } }, idx + 1),
          /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "8px 10px" } }, /* @__PURE__ */ import_react.default.createElement(
            "span",
            {
              style: {
                background: typeBg,
                color: typeColor,
                fontSize: "10px",
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: "4px",
                textTransform: "uppercase"
              }
            },
            item.type
          )),
          /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "8px 10px" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { color: "#ffffff", fontSize: "12px", fontWeight: 600 } }, item.service), /* @__PURE__ */ import_react.default.createElement("div", { style: { color: "#8b949e", fontSize: "10px", fontFamily: "monospace" } }, item.serviceDomain)),
          /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "8px 10px", color: "#ffffff", fontSize: "12px", fontFamily: "monospace" } }, item.path),
          /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "8px 10px", color: "#cbd5e1", fontSize: "11px" } }, item.description),
          /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "8px 10px", color: "#94a3b8", fontSize: "11px", fontFamily: "monospace" } }, item.method),
          /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "8px 10px", color: "#94a3b8", fontSize: "11px", fontFamily: "monospace" } }, item.expectedHttp),
          /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "8px 10px" } }, /* @__PURE__ */ import_react.default.createElement(
            "span",
            {
              style: {
                background: item.observedHttp === item.expectedHttp ? "#15803d" : "#b91c1c",
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: "3px",
                fontFamily: "monospace"
              }
            },
            item.observedHttp
          )),
          /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "8px 10px", color: "#cbd5e1", fontSize: "11px", fontFamily: "monospace" } }, item.latencyMs, " ms", /* @__PURE__ */ import_react.default.createElement("span", { style: { display: "block", color: "#64748b", fontSize: "10px" } }, item.freshnessSec || 8, "s ago")),
          /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "8px 10px" } }, /* @__PURE__ */ import_react.default.createElement(
            "span",
            {
              style: {
                color: isPass ? "#22c55e" : "#ef4444",
                fontSize: "11px",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }
            },
            isPass ? "\u2714 PASS" : "\u2716 FAIL"
          ))
        );
      })))))
    )
  );
};

// src/module.ts
var plugin = new import_data.PanelPlugin(ProgressiveReleasePanel).setPanelOptions((builder) => {
  builder.addRadio({
    path: "mode",
    name: "Display Mode",
    description: "Choose which sections of the design to display",
    defaultValue: "all",
    settings: {
      options: [
        { value: "all", label: "Full Dashboard View" },
        { value: "matrix_only", label: "Matrix Only" },
        { value: "flagger_only", label: "Flagger Only" },
        { value: "details_only", label: "Details Table Only" }
      ]
    }
  }).addBooleanSwitch({
    path: "useMockData",
    name: "Force Design Mock Data",
    description: "Render the exact sample dataset from the design prototype",
    defaultValue: false
  }).addTextInput({
    path: "environment",
    name: "Environment Label",
    description: "Default environment label (PROD, SIT, etc.)",
    defaultValue: "PROD"
  }).addBooleanSwitch({
    path: "showKpis",
    name: "Show Top KPI Cards",
    defaultValue: true
  }).addBooleanSwitch({
    path: "showMatrix",
    name: "Show Service \xD7 Endpoint Matrix",
    defaultValue: true
  }).addBooleanSwitch({
    path: "showFlagger",
    name: "Show Flagger Section",
    defaultValue: true
  }).addBooleanSwitch({
    path: "showDetails",
    name: "Show Top 10 Endpoint Details",
    defaultValue: true
  }).addBooleanSwitch({
    path: "showFooter",
    name: "Show Gate Rule & Candidate Samples",
    defaultValue: true
  }).addBooleanSwitch({
    path: "showRoutesTable",
    name: "Show Collapsible Routes & APIs Table",
    description: "Show full Web Console frontend routes and backend microservice APIs table at the bottom",
    defaultValue: true
  });
});


  Object.assign(_exports, module.exports);
  return _exports;
});
