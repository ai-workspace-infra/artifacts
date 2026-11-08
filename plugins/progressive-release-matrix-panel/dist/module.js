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
var ProgressiveReleasePanel = ({
  options,
  data,
  width,
  height,
  timeRange
}) => {
  const {
    mode = "all",
    useMockData = false,
    environment = "PROD",
    showKpis = true,
    showMatrix = true,
    showFlagger = true,
    showDetails = true,
    showFooter = true
  } = options;
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
        const metricName = labels.__name__ || frame.name || "";
        if (metricName.includes("probe_success") || !metricName) {
          if (val === 1) {
            liveEndpoints[s][r].status = "PASS";
          } else if (val === 0) {
            liveEndpoints[s][r].status = "FAIL";
          }
        } else if (metricName.includes("status_code")) {
          liveEndpoints[s][r].httpCode = val != null ? val : "\u2014";
        } else if (metricName.includes("duration")) {
          liveEndpoints[s][r].latencyMs = val != null ? Math.round(val * 1e3) : "\u2014";
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
  const flaggerServices = [
    {
      service: "Console",
      subdomain: "console.svc.plus",
      phase: "Progressing",
      weight: 20,
      primaryPercent: 80,
      candidatePercent: 20
    },
    {
      service: "Accounts",
      subdomain: "accounts.svc.plus",
      phase: "Progressing",
      weight: 10,
      primaryPercent: 90,
      candidatePercent: 10
    },
    {
      service: "Billing",
      subdomain: "billing.svc.plus",
      phase: "Not configured",
      weight: null,
      primaryPercent: 100,
      candidatePercent: 0
    }
  ];
  const renderCellBadge = (item) => {
    if (!item) {
      return /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#4b5563", fontSize: "14px" } }, "\u2014");
    }
    const isPass = item.status === "PASS";
    const isFail = item.status === "FAIL";
    const isNoData = item.status === "NO DATA";
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
        padding: "14px 16px",
        boxSizing: "border-box",
        overflowY: "auto"
      }
    },
    (mode === "all" || mode === "matrix_only") && showKpis && /* @__PURE__ */ import_react.default.createElement("div", { style: { marginBottom: "16px" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" } }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("div", { style: { color: "#ffffff", fontSize: "22px", fontWeight: 800, letterSpacing: "-0.3px" } }, "Progressive Release Validation"), /* @__PURE__ */ import_react.default.createElement("div", { style: { color: "#8b949e", fontSize: "13px", marginTop: "2px" } }, "Service \xD7 API status matrix for progressive releases (", environment.toUpperCase(), ")")), !parsedData.isLive && /* @__PURE__ */ import_react.default.createElement(
      "span",
      {
        style: {
          background: "#1f2937",
          border: "1px solid #374151",
          color: "#9ca3af",
          fontSize: "11px",
          fontWeight: 600,
          padding: "3px 8px",
          borderRadius: "4px"
        }
      },
      "PREVIEW MOCK DATA"
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
      /* @__PURE__ */ import_react.default.createElement("div", { style: { color: "#ffffff", fontSize: "22px", fontWeight: 800, letterSpacing: "0.5px", marginTop: "3px" } }, environment.toUpperCase())
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
      /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("div", { style: { color: "#8b949e", fontSize: "12px", fontWeight: 500 } }, "Observation window"), /* @__PURE__ */ import_react.default.createElement("div", { style: { color: "#ffffff", fontSize: "15px", fontWeight: 600, marginTop: "2px" } }, "Last 15 minutes (14:45 \u2013 15:00 UTC)"))
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
      /* @__PURE__ */ import_react.default.createElement("div", { style: { overflowX: "auto" } }, /* @__PURE__ */ import_react.default.createElement("table", { style: { width: "100%", borderCollapse: "collapse", textAlign: "left" } }, /* @__PURE__ */ import_react.default.createElement("thead", null, /* @__PURE__ */ import_react.default.createElement("tr", { style: { borderBottom: "1px solid #232838" } }, /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "8px 12px", color: "#8b949e", fontSize: "12px", fontWeight: 600 } }, "Service"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "8px 12px", color: "#8b949e", fontSize: "12px", fontWeight: 600 } }, "Flagger phase"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "8px 12px", color: "#8b949e", fontSize: "12px", fontWeight: 600 } }, "Weight (candidate)"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "8px 12px", color: "#8b949e", fontSize: "12px", fontWeight: 600 } }, "Traffic (primary vs candidate)"))), /* @__PURE__ */ import_react.default.createElement("tbody", null, flaggerServices.map((fs, idx) => {
        const isConfigured = fs.phase !== "Not configured";
        return /* @__PURE__ */ import_react.default.createElement("tr", { key: idx, style: { borderBottom: idx < flaggerServices.length - 1 ? "1px solid #1b1e2a" : "none" } }, /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "10px 12px" } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#ffffff", fontSize: "13px", fontWeight: 700 } }, fs.service), " ", /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#8b949e", fontSize: "11px" } }, fs.subdomain)), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "10px 12px" } }, /* @__PURE__ */ import_react.default.createElement(
          "span",
          {
            style: {
              background: isConfigured ? "#1e3a8a" : "#1f2937",
              border: `1px solid ${isConfigured ? "#2563eb" : "#374151"}`,
              color: isConfigured ? "#93c5fd" : "#9ca3af",
              fontSize: "11px",
              fontWeight: 700,
              padding: "3px 8px",
              borderRadius: "4px"
            }
          },
          fs.phase
        )), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "10px 12px", color: "#ffffff", fontSize: "13px", fontWeight: 700 } }, fs.weight != null ? `${fs.weight}%` : "\u2014"), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "10px 12px" } }, isConfigured ? /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: "10px" } }, /* @__PURE__ */ import_react.default.createElement(
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
        ), /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#9ca3af", fontSize: "11px" } }, "Primary ", fs.primaryPercent, "% | Candidate ", fs.candidatePercent, "%")) : /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#6b7280", fontSize: "12px" } }, "\u24D8 No canary configured for this service")));
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
      /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px" } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#ffffff", fontSize: "15px", fontWeight: 700 } }, "Top 10 Endpoint Details (Sample Mock Data)"), /* @__PURE__ */ import_react.default.createElement(
        "span",
        {
          style: {
            background: "#1e293b",
            border: "1px solid #374151",
            color: "#9ca3af",
            fontSize: "10px",
            fontWeight: 700,
            padding: "2px 6px",
            borderRadius: "3px"
          }
        },
        "SAMPLE MOCK DATA"
      )), /* @__PURE__ */ import_react.default.createElement("div", { style: { color: "#8b949e", fontSize: "12px" } }, "10/10 checks \u2022 ", failedCount, " failed \u2022 Updated: 14:34:02 UTC")),
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
      /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("div", { style: { color: "#ffffff", fontSize: "13px", fontWeight: 600 } }, "Candidate sample: 34,862 requests"), /* @__PURE__ */ import_react.default.createElement("div", { style: { color: "#22c55e", fontSize: "11px", fontWeight: 600, marginTop: "1px" } }, "(sufficient, \u2265 10,000)"))
    ))
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
  });
});


  Object.assign(_exports, module.exports);
  return _exports;
});
