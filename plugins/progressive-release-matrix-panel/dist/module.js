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

// src/routesCatalog.ts
var RAW_ROUTES_CATALOG = [
  {
    "id": "fe-1",
    "order": 1,
    "type": "frontend",
    "categoryKey": "fe-portal",
    "categoryName": "\u4EA7\u54C1\u3001\u670D\u52A1\u4E0E\u95E8\u6237",
    "categoryEnName": "Portal, Products & Services",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/",
    "description": "\u4E91\u539F\u751F\u667A\u80FD\u4F53\u534F\u540C\u5E73\u53F0\u9996\u9875\u4E0E\u4EA7\u54C1\u77E9\u9635\u5165\u53E3",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 33,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-2",
    "order": 2,
    "type": "frontend",
    "categoryKey": "fe-support",
    "categoryName": "\u5BA2\u6237\u652F\u6301\u4E0E\u670D\u52A1\u6761\u6B3E",
    "categoryEnName": "Support, Legal & System",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/404",
    "description": "\u9875\u9762\u672A\u627E\u5230\u5F15\u5BFC\u4E0E\u8DEF\u7531\u56DE\u9000\u9875",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 34,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-3",
    "order": 3,
    "type": "frontend",
    "categoryKey": "fe-support",
    "categoryName": "\u5BA2\u6237\u652F\u6301\u4E0E\u670D\u52A1\u6761\u6B3E",
    "categoryEnName": "Support, Legal & System",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/500",
    "description": "\u670D\u52A1\u5668\u5185\u90E8\u5F02\u5E38\u5904\u7406\u4E0E\u7CFB\u7EDF\u72B6\u6001\u6062\u590D\u9875",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 35,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-4",
    "order": 4,
    "type": "frontend",
    "categoryKey": "fe-support",
    "categoryName": "\u5BA2\u6237\u652F\u6301\u4E0E\u670D\u52A1\u6761\u6B3E",
    "categoryEnName": "Support, Legal & System",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/[slug]",
    "description": "\u5E73\u53F0\u52A8\u6001\u843D\u5730\u9875\u4E0E\u4E13\u9898\u5185\u5BB9\u5C55\u793A",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 36,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-5",
    "order": 5,
    "type": "frontend",
    "categoryKey": "fe-portal",
    "categoryName": "\u4EA7\u54C1\u3001\u670D\u52A1\u4E0E\u95E8\u6237",
    "categoryEnName": "Portal, Products & Services",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/about",
    "description": "\u5E73\u53F0\u67B6\u6784\u3001\u6280\u672F\u6F14\u8FDB\u4E0E\u613F\u666F\u4ECB\u7ECD",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 37,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-6",
    "order": 6,
    "type": "frontend",
    "categoryKey": "fe-auth",
    "categoryName": "\u7EDF\u4E00\u8EAB\u4EFD\u8BA4\u8BC1\u4E0E\u7528\u6237\u4E2D\u5FC3",
    "categoryEnName": "Auth & User Center",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/account-recovery",
    "description": "\u7528\u6237\u8D26\u53F7\u4E0E\u5B89\u5168\u51ED\u636E\u627E\u56DE\u5411\u5BFC",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 38,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-7",
    "order": 7,
    "type": "frontend",
    "categoryKey": "fe-workspace",
    "categoryName": "\u667A\u80FD\u4F53\u4E0E\u5DE5\u4F5C\u7A7A\u95F4",
    "categoryEnName": "AI Workspace & Studio",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/ai-workspace",
    "description": "AI \u667A\u80FD\u4F53\u5DE5\u4F5C\u7A7A\u95F4\u4E3B\u754C\u9762\u4E0E\u4E0A\u4E0B\u6587\u7BA1\u7406",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 39,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-8",
    "order": 8,
    "type": "frontend",
    "categoryKey": "fe-workspace",
    "categoryName": "\u667A\u80FD\u4F53\u4E0E\u5DE5\u4F5C\u7A7A\u95F4",
    "categoryEnName": "AI Workspace & Studio",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/ai-workspace/bot-team",
    "description": "\u591A\u667A\u80FD\u4F53\u534F\u4F5C\u6218\u961F\u4E0E\u8C03\u5EA6\u62D3\u6251",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 40,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-9",
    "order": 9,
    "type": "frontend",
    "categoryKey": "fe-workspace",
    "categoryName": "\u667A\u80FD\u4F53\u4E0E\u5DE5\u4F5C\u7A7A\u95F4",
    "categoryEnName": "AI Workspace & Studio",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/ai-workspace/conversation/[id]",
    "description": "\u6C89\u6D78\u5F0F\u4EBA\u673A\u534F\u4F5C\u4F1A\u8BDD\u6D41\u4E0E\u4EE3\u7801\u6267\u884C\u7A7A\u95F4",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 41,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-10",
    "order": 10,
    "type": "frontend",
    "categoryKey": "fe-workspace",
    "categoryName": "\u667A\u80FD\u4F53\u4E0E\u5DE5\u4F5C\u7A7A\u95F4",
    "categoryEnName": "AI Workspace & Studio",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/ai-workspace/tasks",
    "description": "\u957F\u751F\u547D\u5468\u671F\u5F02\u6B65\u4EFB\u52A1\u4E0E\u6267\u884C\u5386\u53F2\u9762\u677F",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 42,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-11",
    "order": 11,
    "type": "frontend",
    "categoryKey": "fe-docs",
    "categoryName": "\u77E5\u8BC6\u5E93\u3001\u6587\u6863\u4E0E\u535A\u5BA2",
    "categoryEnName": "Docs, Knowledge & Blogs",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/blogs",
    "description": "\u5E73\u53F0\u67B6\u6784\u6F14\u8FDB\u4E0E\u524D\u6CBF\u6280\u672F\u535A\u5BA2\u4E13\u680F",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 43,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-12",
    "order": 12,
    "type": "frontend",
    "categoryKey": "fe-docs",
    "categoryName": "\u77E5\u8BC6\u5E93\u3001\u6587\u6863\u4E0E\u535A\u5BA2",
    "categoryEnName": "Docs, Knowledge & Blogs",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/blogs/[...slug]",
    "description": "\u6280\u672F\u535A\u5BA2\u6B63\u6587\u4E0E\u67B6\u6784\u6DF1\u5EA6\u89E3\u6790\u8BE6\u60C5\u9875",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 44,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-13",
    "order": 13,
    "type": "frontend",
    "categoryKey": "fe-edge",
    "categoryName": "\u8FB9\u7F18\u5957\u4EF6\u4E0E\u57FA\u7840\u8BBE\u65BD\u5DE5\u5177",
    "categoryEnName": "Edge Suites & Cloud IaC",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/cloud_iac",
    "description": "\u591A\u4E91\u57FA\u7840\u8BBE\u65BD\u4EE3\u7801\u5316 (IaC) \u7F16\u6392\u603B\u89C8",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 45,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-14",
    "order": 14,
    "type": "frontend",
    "categoryKey": "fe-edge",
    "categoryName": "\u8FB9\u7F18\u5957\u4EF6\u4E0E\u57FA\u7840\u8BBE\u65BD\u5DE5\u5177",
    "categoryEnName": "Edge Suites & Cloud IaC",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/cloud_iac/[provider]",
    "description": "\u6307\u5B9A\u4E91\u5382\u5546 IaC \u8D44\u6E90\u6808\u6A21\u7248\u7BA1\u7406",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 46,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-15",
    "order": 15,
    "type": "frontend",
    "categoryKey": "fe-edge",
    "categoryName": "\u8FB9\u7F18\u5957\u4EF6\u4E0E\u57FA\u7840\u8BBE\u65BD\u5DE5\u5177",
    "categoryEnName": "Edge Suites & Cloud IaC",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/cloud_iac/[provider]/[service]",
    "description": "\u5177\u4F53\u4E91\u670D\u52A1 IaC \u4EA4\u4ED8\u6A21\u7248\u4E0E\u914D\u7F6E",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 47,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-16",
    "order": 16,
    "type": "frontend",
    "categoryKey": "fe-portal",
    "categoryName": "\u4EA7\u54C1\u3001\u670D\u52A1\u4E0E\u95E8\u6237",
    "categoryEnName": "Portal, Products & Services",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/company",
    "description": "\u4F01\u4E1A\u80CC\u666F\u3001\u56E2\u961F\u4ECB\u7ECD\u4E0E\u5408\u89C4\u8D44\u8D28",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 48,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-17",
    "order": 17,
    "type": "frontend",
    "categoryKey": "fe-portal",
    "categoryName": "\u4EA7\u54C1\u3001\u670D\u52A1\u4E0E\u95E8\u6237",
    "categoryEnName": "Portal, Products & Services",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/contact",
    "description": "\u5546\u52A1\u5408\u4F5C\u3001\u6280\u672F\u652F\u6301\u4E0E\u670D\u52A1\u54A8\u8BE2",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 49,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-18",
    "order": 18,
    "type": "frontend",
    "categoryKey": "fe-docs",
    "categoryName": "\u77E5\u8BC6\u5E93\u3001\u6587\u6863\u4E0E\u535A\u5BA2",
    "categoryEnName": "Docs, Knowledge & Blogs",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/docs",
    "description": "\u5F00\u53D1\u8005\u67B6\u6784\u6587\u6863\u4E2D\u5FC3\u4E0E\u96C6\u6210\u6307\u5357",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 50,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-19",
    "order": 19,
    "type": "frontend",
    "categoryKey": "fe-docs",
    "categoryName": "\u77E5\u8BC6\u5E93\u3001\u6587\u6863\u4E0E\u535A\u5BA2",
    "categoryEnName": "Docs, Knowledge & Blogs",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/docs/[collection]",
    "description": "\u6280\u672F\u6587\u6863\u5408\u96C6\u5BFC\u822A\u4E0E\u4E13\u680F\u7D22\u5F15",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 51,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-20",
    "order": 20,
    "type": "frontend",
    "categoryKey": "fe-docs",
    "categoryName": "\u77E5\u8BC6\u5E93\u3001\u6587\u6863\u4E0E\u535A\u5BA2",
    "categoryEnName": "Docs, Knowledge & Blogs",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/docs/[collection]/[...slug]",
    "description": "\u6280\u672F\u6587\u6863\u4E0E API \u89C4\u8303\u6B63\u6587\u8BE6\u60C5\u9875",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 52,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-21",
    "order": 21,
    "type": "frontend",
    "categoryKey": "fe-docs",
    "categoryName": "\u77E5\u8BC6\u5E93\u3001\u6587\u6863\u4E0E\u535A\u5BA2",
    "categoryEnName": "Docs, Knowledge & Blogs",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/docs/ebooks",
    "description": "\u5B98\u65B9\u7CBE\u9009\u7535\u5B50\u4E66\u4E0E\u67B6\u6784\u767D\u76AE\u4E66\u4E0B\u8F7D",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 53,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-22",
    "order": 22,
    "type": "frontend",
    "categoryKey": "fe-docs",
    "categoryName": "\u77E5\u8BC6\u5E93\u3001\u6587\u6863\u4E0E\u535A\u5BA2",
    "categoryEnName": "Docs, Knowledge & Blogs",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/download",
    "description": "\u591A\u67B6\u6784\u5BA2\u6237\u7AEF\u4E0E\u5DE5\u5177\u94FE\u8D44\u6E90\u4E0B\u8F7D\u4E2D\u5FC3",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 54,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-23",
    "order": 23,
    "type": "frontend",
    "categoryKey": "fe-docs",
    "categoryName": "\u77E5\u8BC6\u5E93\u3001\u6587\u6863\u4E0E\u535A\u5BA2",
    "categoryEnName": "Docs, Knowledge & Blogs",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/download/[...segments]",
    "description": "\u5BA2\u6237\u7AEF\u5206\u53D1\u5305\u4E0E\u955C\u50CF\u4E0B\u8F7D\u76F4\u94FE",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 55,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-24",
    "order": 24,
    "type": "frontend",
    "categoryKey": "fe-auth",
    "categoryName": "\u7EDF\u4E00\u8EAB\u4EFD\u8BA4\u8BC1\u4E0E\u7528\u6237\u4E2D\u5FC3",
    "categoryEnName": "Auth & User Center",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/email-verification",
    "description": "\u7528\u6237\u90AE\u7BB1\u6FC0\u6D3B\u4E0E\u5B89\u5168\u9A8C\u8BC1\u6D41\u7A0B",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 56,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-25",
    "order": 25,
    "type": "frontend",
    "categoryKey": "fe-auth",
    "categoryName": "\u7EDF\u4E00\u8EAB\u4EFD\u8BA4\u8BC1\u4E0E\u7528\u6237\u4E2D\u5FC3",
    "categoryEnName": "Auth & User Center",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/email/preferences",
    "description": "\u7CFB\u7EDF\u90AE\u4EF6\u4E0E\u4E8B\u4EF6\u901A\u77E5\u504F\u597D\u914D\u7F6E",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 57,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-26",
    "order": 26,
    "type": "frontend",
    "categoryKey": "fe-auth",
    "categoryName": "\u7EDF\u4E00\u8EAB\u4EFD\u8BA4\u8BC1\u4E0E\u7528\u6237\u4E2D\u5FC3",
    "categoryEnName": "Auth & User Center",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/email/unsubscribe",
    "description": "\u5FEB\u6377\u90AE\u4EF6\u4E00\u952E\u9000\u8BA2\u5904\u7406\u4E2D\u5FC3",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 58,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-27",
    "order": 27,
    "type": "frontend",
    "categoryKey": "fe-support",
    "categoryName": "\u5BA2\u6237\u652F\u6301\u4E0E\u670D\u52A1\u6761\u6B3E",
    "categoryEnName": "Support, Legal & System",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/github",
    "description": "\u5B98\u65B9\u5F00\u6E90\u4EE3\u7801\u4ED3\u5E93\u4E0E\u793E\u533A\u8DF3\u8F6C\u9875",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 59,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-28",
    "order": 28,
    "type": "frontend",
    "categoryKey": "fe-auth",
    "categoryName": "\u7EDF\u4E00\u8EAB\u4EFD\u8BA4\u8BC1\u4E0E\u7528\u6237\u4E2D\u5FC3",
    "categoryEnName": "Auth & User Center",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/login",
    "description": "\u7EDF\u4E00\u8EAB\u4EFD\u5B89\u5168\u767B\u5F55\u4E0E\u5355\u70B9\u767B\u5F55\u5165\u53E3",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 60,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-29",
    "order": 29,
    "type": "frontend",
    "categoryKey": "fe-auth",
    "categoryName": "\u7EDF\u4E00\u8EAB\u4EFD\u8BA4\u8BC1\u4E0E\u7528\u6237\u4E2D\u5FC3",
    "categoryEnName": "Auth & User Center",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/logout",
    "description": "\u5B89\u5168\u9000\u51FA\u767B\u5F55\u4E0E\u672C\u5730\u4F1A\u8BDD\u9500\u6BC1",
    "method": "GET",
    "expectedHttp": 307,
    "observedHttp": 307,
    "latencyMs": 61,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-30",
    "order": 30,
    "type": "frontend",
    "categoryKey": "fe-panel",
    "categoryName": "\u5E73\u53F0\u8FD0\u7EF4\u4E0E\u63A7\u5236\u53F0",
    "categoryEnName": "Panel & Operations",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/panel",
    "description": "\u7EDF\u4E00\u8FD0\u7EF4\u63A7\u5236\u53F0\u4E3B\u9762\u677F\u4E0E\u5BFC\u822A\u5927\u5385",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 62,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-31",
    "order": 31,
    "type": "frontend",
    "categoryKey": "fe-panel",
    "categoryName": "\u5E73\u53F0\u8FD0\u7EF4\u4E0E\u63A7\u5236\u53F0",
    "categoryEnName": "Panel & Operations",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/panel/[...segments]",
    "description": "\u63A7\u5236\u53F0\u52A8\u6001\u5B50\u6A21\u5757\u901A\u7528\u5206\u53D1\u8DEF\u7531",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 63,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-32",
    "order": 32,
    "type": "frontend",
    "categoryKey": "fe-panel",
    "categoryName": "\u5E73\u53F0\u8FD0\u7EF4\u4E0E\u63A7\u5236\u53F0",
    "categoryEnName": "Panel & Operations",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/panel/account",
    "description": "\u4E2A\u4EBA\u8D26\u6237\u8D44\u6599\u3001\u5B89\u5168\u5BC6\u94A5\u4E0E\u4F1A\u8BDD\u7BA1\u7406",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 64,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-33",
    "order": 33,
    "type": "frontend",
    "categoryKey": "fe-panel",
    "categoryName": "\u5E73\u53F0\u8FD0\u7EF4\u4E0E\u63A7\u5236\u53F0",
    "categoryEnName": "Panel & Operations",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/panel/agent",
    "description": "\u667A\u80FD\u4F53\u5E94\u7528\u7F16\u6392\u3001\u4F1A\u8BDD\u62D3\u6251\u4E0E\u7EB3\u7BA1\u914D\u7F6E",
    "method": "GET",
    "expectedHttp": 307,
    "observedHttp": 307,
    "latencyMs": 65,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-34",
    "order": 34,
    "type": "frontend",
    "categoryKey": "fe-panel",
    "categoryName": "\u5E73\u53F0\u8FD0\u7EF4\u4E0E\u63A7\u5236\u53F0",
    "categoryEnName": "Panel & Operations",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/panel/ai-aggregator",
    "description": "AI \u5927\u6A21\u578B\u805A\u5408\u8DEF\u7531\u4E0E\u4EE3\u7406\u914D\u7F6E\u7F51\u5173",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 66,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-35",
    "order": 35,
    "type": "frontend",
    "categoryKey": "fe-panel",
    "categoryName": "\u5E73\u53F0\u8FD0\u7EF4\u4E0E\u63A7\u5236\u53F0",
    "categoryEnName": "Panel & Operations",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/panel/api",
    "description": "\u5E73\u53F0 API \u5BC6\u94A5\u751F\u547D\u5468\u671F\u7BA1\u7406\u4E0E\u9274\u6743\u4EE4\u724C",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 67,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-36",
    "order": 36,
    "type": "frontend",
    "categoryKey": "fe-panel",
    "categoryName": "\u5E73\u53F0\u8FD0\u7EF4\u4E0E\u63A7\u5236\u53F0",
    "categoryEnName": "Panel & Operations",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/panel/appearance",
    "description": "\u63A7\u5236\u53F0\u754C\u9762\u4E3B\u9898\u4E0E\u6697\u9ED1/\u6D45\u8272\u81EA\u9002\u5E94\u5916\u89C2",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 68,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-37",
    "order": 37,
    "type": "frontend",
    "categoryKey": "fe-panel",
    "categoryName": "\u5E73\u53F0\u8FD0\u7EF4\u4E0E\u63A7\u5236\u53F0",
    "categoryEnName": "Panel & Operations",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/panel/cloud-hub",
    "description": "\u4E91\u539F\u751F\u8D44\u6E90\u7EB3\u7BA1\u4E0E\u591A\u96C6\u7FA4\u62D3\u6251\u63A7\u5236\u4E2D\u5FC3",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 69,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-38",
    "order": 38,
    "type": "frontend",
    "categoryKey": "fe-panel",
    "categoryName": "\u5E73\u53F0\u8FD0\u7EF4\u4E0E\u63A7\u5236\u53F0",
    "categoryEnName": "Panel & Operations",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/panel/ldp",
    "description": "\u8F7B\u91CF\u5316\u90E8\u7F72\u4E0E\u4EA4\u4ED8\u6D41\u6C34\u7EBF (LDP) \u4EEA\u8868\u76D8",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 70,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-39",
    "order": 39,
    "type": "frontend",
    "categoryKey": "fe-panel",
    "categoryName": "\u5E73\u53F0\u8FD0\u7EF4\u4E0E\u63A7\u5236\u53F0",
    "categoryEnName": "Panel & Operations",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/panel/management",
    "description": "\u4F01\u4E1A\u79DF\u6237\u6CBB\u7406\u3001\u914D\u989D\u5206\u914D\u4E0E\u7CFB\u7EDF\u5168\u5C40\u914D\u7F6E",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 71,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-40",
    "order": 40,
    "type": "frontend",
    "categoryKey": "fe-panel",
    "categoryName": "\u5E73\u53F0\u8FD0\u7EF4\u4E0E\u63A7\u5236\u53F0",
    "categoryEnName": "Panel & Operations",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/panel/operations",
    "description": "\u5E73\u53F0\u8FD0\u7EF4\u4E2D\u5FC3\u4E0E\u6E10\u8FDB\u53D1\u5E03\u95E8\u7981\u9A8C\u8BC1\u770B\u677F",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 32,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-41",
    "order": 41,
    "type": "frontend",
    "categoryKey": "fe-panel",
    "categoryName": "\u5E73\u53F0\u8FD0\u7EF4\u4E0E\u63A7\u5236\u53F0",
    "categoryEnName": "Panel & Operations",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/panel/subscription",
    "description": "\u5957\u9910\u8BA2\u9605\u7BA1\u7406\u3001\u6743\u76CA\u5C65\u7EA6\u4E0E\u8D26\u5355\u660E\u7EC6",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 33,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-42",
    "order": 42,
    "type": "frontend",
    "categoryKey": "fe-panel",
    "categoryName": "\u5E73\u53F0\u8FD0\u7EF4\u4E0E\u63A7\u5236\u53F0",
    "categoryEnName": "Panel & Operations",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/panel/team",
    "description": "\u56E2\u961F\u534F\u4F5C\u7A7A\u95F4\u3001\u6210\u5458\u89D2\u8272\u4E0E RBAC \u6743\u9650\u5206\u914D",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 34,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-43",
    "order": 43,
    "type": "frontend",
    "categoryKey": "fe-portal",
    "categoryName": "\u4EA7\u54C1\u3001\u670D\u52A1\u4E0E\u95E8\u6237",
    "categoryEnName": "Portal, Products & Services",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/prices",
    "description": "\u8BA2\u9605\u5957\u9910\u9636\u68AF\u3001\u7B97\u529B\u89C4\u683C\u4E0E\u4EF7\u683C\u603B\u89C8",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 35,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-44",
    "order": 44,
    "type": "frontend",
    "categoryKey": "fe-support",
    "categoryName": "\u5BA2\u6237\u652F\u6301\u4E0E\u670D\u52A1\u6761\u6B3E",
    "categoryEnName": "Support, Legal & System",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/privacy",
    "description": "\u7528\u6237\u9690\u79C1\u4FDD\u62A4\u6761\u4F8B\u4E0E\u6570\u636E\u5408\u89C4\u627F\u8BFA",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 36,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-45",
    "order": 45,
    "type": "frontend",
    "categoryKey": "fe-portal",
    "categoryName": "\u4EA7\u54C1\u3001\u670D\u52A1\u4E0E\u95E8\u6237",
    "categoryEnName": "Portal, Products & Services",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/products",
    "description": "\u5E73\u53F0\u4EA7\u54C1\u77E9\u9635\u603B\u89C8\u4E0E\u80FD\u529B\u5168\u666F",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 37,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-46",
    "order": 46,
    "type": "frontend",
    "categoryKey": "fe-portal",
    "categoryName": "\u4EA7\u54C1\u3001\u670D\u52A1\u4E0E\u95E8\u6237",
    "categoryEnName": "Portal, Products & Services",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/products/[slug]",
    "description": "\u5177\u4F53\u4EA7\u54C1\u7279\u6743\u4E0E\u7279\u6027\u6DF1\u5EA6\u5C55\u793A\u4E13\u9875",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 38,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-47",
    "order": 47,
    "type": "frontend",
    "categoryKey": "fe-portal",
    "categoryName": "\u4EA7\u54C1\u3001\u670D\u52A1\u4E0E\u95E8\u6237",
    "categoryEnName": "Portal, Products & Services",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/products/ai-workspace",
    "description": "AI Workspace \u534F\u540C\u667A\u80FD\u4F53\u5957\u4EF6\u4E13\u9875",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 39,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-48",
    "order": 48,
    "type": "frontend",
    "categoryKey": "fe-portal",
    "categoryName": "\u4EA7\u54C1\u3001\u670D\u52A1\u4E0E\u95E8\u6237",
    "categoryEnName": "Portal, Products & Services",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/products/cloud-hub",
    "description": "CloudHub \u8DE8\u4E91\u7F16\u6392\u63A7\u5236\u9762\u4E13\u9875",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 40,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-49",
    "order": 49,
    "type": "frontend",
    "categoryKey": "fe-portal",
    "categoryName": "\u4EA7\u54C1\u3001\u670D\u52A1\u4E0E\u95E8\u6237",
    "categoryEnName": "Portal, Products & Services",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/products/open-platform",
    "description": "OpenPlatform \u5F00\u653E\u751F\u6001\u4E0E\u6269\u5C55\u7CFB\u7EDF",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 41,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-50",
    "order": 50,
    "type": "frontend",
    "categoryKey": "fe-portal",
    "categoryName": "\u4EA7\u54C1\u3001\u670D\u52A1\u4E0E\u95E8\u6237",
    "categoryEnName": "Portal, Products & Services",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/products/xconnect",
    "description": "XConnect \u96F6\u4FE1\u4EFB\u8FB9\u7F18\u4E92\u8054\u4E13\u9875",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 42,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-51",
    "order": 51,
    "type": "frontend",
    "categoryKey": "fe-portal",
    "categoryName": "\u4EA7\u54C1\u3001\u670D\u52A1\u4E0E\u95E8\u6237",
    "categoryEnName": "Portal, Products & Services",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/products/xconnect/referral",
    "description": "XConnect \u9080\u8BF7\u5956\u52B1\u4E0E\u63A8\u5E7F\u88C2\u53D8\u9875",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 43,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-52",
    "order": 52,
    "type": "frontend",
    "categoryKey": "fe-portal",
    "categoryName": "\u4EA7\u54C1\u3001\u670D\u52A1\u4E0E\u95E8\u6237",
    "categoryEnName": "Portal, Products & Services",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/products/xworkmate",
    "description": "XWorkmate \u81EA\u52A8\u5316\u534F\u4F5C\u529E\u516C\u5957\u4EF6\u4E13\u9875",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 44,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-53",
    "order": 53,
    "type": "frontend",
    "categoryKey": "fe-support",
    "categoryName": "\u5BA2\u6237\u652F\u6301\u4E0E\u670D\u52A1\u6761\u6B3E",
    "categoryEnName": "Support, Legal & System",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/referral",
    "description": "\u63A8\u5E7F\u9080\u8BF7\u8BA1\u5212\u4E0E\u6743\u76CA\u8FD4\u4F63\u8BF4\u660E",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 45,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-54",
    "order": 54,
    "type": "frontend",
    "categoryKey": "fe-support",
    "categoryName": "\u5BA2\u6237\u652F\u6301\u4E0E\u670D\u52A1\u6761\u6B3E",
    "categoryEnName": "Support, Legal & System",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/referrals",
    "description": "\u63A8\u8350\u9080\u8BF7\u7BA1\u7406\u5927\u76D8\u4E0E\u7ED3\u7B97\u63D0\u73B0\u8BB0\u5F55",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 46,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-55",
    "order": 55,
    "type": "frontend",
    "categoryKey": "fe-auth",
    "categoryName": "\u7EDF\u4E00\u8EAB\u4EFD\u8BA4\u8BC1\u4E0E\u7528\u6237\u4E2D\u5FC3",
    "categoryEnName": "Auth & User Center",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/register",
    "description": "\u65B0\u7528\u6237\u8D26\u53F7\u5FEB\u901F\u6CE8\u518C\u4E0E\u5B89\u5168\u6821\u9A8C",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 47,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-56",
    "order": 56,
    "type": "frontend",
    "categoryKey": "fe-portal",
    "categoryName": "\u4EA7\u54C1\u3001\u670D\u52A1\u4E0E\u95E8\u6237",
    "categoryEnName": "Portal, Products & Services",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/services",
    "description": "\u4E13\u4E1A\u6280\u672F\u54A8\u8BE2\u4E0E\u4F01\u4E1A\u7EA7\u5B9A\u5236\u670D\u52A1\u77E9\u9635",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 48,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-57",
    "order": 57,
    "type": "frontend",
    "categoryKey": "fe-portal",
    "categoryName": "\u4EA7\u54C1\u3001\u670D\u52A1\u4E0E\u95E8\u6237",
    "categoryEnName": "Portal, Products & Services",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/services/insight",
    "description": "\u67B6\u6784\u6DF1\u5EA6\u6D1E\u5BDF\u4E0E\u6027\u80FD\u5168\u94FE\u8DEF\u8BCA\u65AD\u670D\u52A1",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 49,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-58",
    "order": 58,
    "type": "frontend",
    "categoryKey": "fe-portal",
    "categoryName": "\u4EA7\u54C1\u3001\u670D\u52A1\u4E0E\u95E8\u6237",
    "categoryEnName": "Portal, Products & Services",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/services/openclaw",
    "description": "OpenClaw \u5F00\u6E90\u81EA\u52A8\u5316\u91C7\u96C6\u5DE5\u5177\u94FE\u670D\u52A1",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 50,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-59",
    "order": 59,
    "type": "frontend",
    "categoryKey": "fe-support",
    "categoryName": "\u5BA2\u6237\u652F\u6301\u4E0E\u670D\u52A1\u6761\u6B3E",
    "categoryEnName": "Support, Legal & System",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/support",
    "description": "\u5E2E\u52A9\u652F\u6301\u4E2D\u5FC3\u3001\u5E38\u89C1\u95EE\u9898\u4E0E\u5728\u7EBF\u5DE5\u5355",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 51,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-60",
    "order": 60,
    "type": "frontend",
    "categoryKey": "fe-support",
    "categoryName": "\u5BA2\u6237\u652F\u6301\u4E0E\u670D\u52A1\u6761\u6B3E",
    "categoryEnName": "Support, Legal & System",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/support/discussions",
    "description": "\u5F00\u53D1\u8005\u6280\u672F\u4EA4\u6D41\u793E\u533A\u4E0E\u65B9\u6848\u63A2\u8BA8\u770B\u677F",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 52,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-61",
    "order": 61,
    "type": "frontend",
    "categoryKey": "fe-support",
    "categoryName": "\u5BA2\u6237\u652F\u6301\u4E0E\u670D\u52A1\u6761\u6B3E",
    "categoryEnName": "Support, Legal & System",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/terms",
    "description": "\u5E73\u53F0\u670D\u52A1\u6761\u6B3E\u4E0E\u6700\u7EC8\u7528\u6237\u8BB8\u53EF\u534F\u8BAE (EULA)",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 53,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-62",
    "order": 62,
    "type": "frontend",
    "categoryKey": "fe-edge",
    "categoryName": "\u8FB9\u7F18\u5957\u4EF6\u4E0E\u57FA\u7840\u8BBE\u65BD\u5DE5\u5177",
    "categoryEnName": "Edge Suites & Cloud IaC",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/xworkmate",
    "description": "XWorkmate \u684C\u9762\u7AEF\u534F\u4F5C\u95E8\u6237",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 54,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-63",
    "order": 63,
    "type": "frontend",
    "categoryKey": "fe-edge",
    "categoryName": "\u8FB9\u7F18\u5957\u4EF6\u4E0E\u57FA\u7840\u8BBE\u65BD\u5DE5\u5177",
    "categoryEnName": "Edge Suites & Cloud IaC",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/xworkmate-suite",
    "description": "XWorkmate \u4F01\u4E1A\u6548\u80FD\u534F\u540C\u5957\u4EF6",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 55,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-64",
    "order": 64,
    "type": "frontend",
    "categoryKey": "fe-edge",
    "categoryName": "\u8FB9\u7F18\u5957\u4EF6\u4E0E\u57FA\u7840\u8BBE\u65BD\u5DE5\u5177",
    "categoryEnName": "Edge Suites & Cloud IaC",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/xworkmate/admin",
    "description": "XWorkmate \u534F\u4F5C\u5957\u4EF6\u4F01\u4E1A\u6CBB\u7406\u540E\u53F0",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 56,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "fe-65",
    "order": 65,
    "type": "frontend",
    "categoryKey": "fe-edge",
    "categoryName": "\u8FB9\u7F18\u5957\u4EF6\u4E0E\u57FA\u7840\u8BBE\u65BD\u5DE5\u5177",
    "categoryEnName": "Edge Suites & Cloud IaC",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/xworkmate/integrations",
    "description": "XWorkmate \u7B2C\u4E09\u65B9\u5E94\u7528\u751F\u6001\u96C6\u6210\u4E2D\u5FC3",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 57,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-66",
    "order": 66,
    "type": "api",
    "categoryKey": "be-auth",
    "categoryName": "\u8EAB\u4EFD\u8BA4\u8BC1\u4E0E\u7528\u6237\u8D26\u6237",
    "categoryEnName": "Authentication & Account Management",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/account/[...segments]",
    "description": "\u8D26\u6237\u591A\u7EF4\u5C5E\u6027\u67E5\u8BE2\u4E0E\u4E2A\u4EBA\u4FE1\u606F\u6279\u91CF\u66F4\u65B0\u63A5\u53E3",
    "method": "GET, POST, PUT, DELETE, PATCH",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 55,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-67",
    "order": 67,
    "type": "api",
    "categoryKey": "be-admin",
    "categoryName": "\u5E73\u53F0\u6CBB\u7406\u4E0E\u7BA1\u7406\u63A7\u5236\u53F0",
    "categoryEnName": "Admin & Governance Platform",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/admin/agents/team-enrollments",
    "description": "\u667A\u80FD\u4F53\u56E2\u961F\u79DF\u6237\u5F52\u5C5E\u4E0E\u591A\u667A\u80FD\u4F53\u7EB3\u7BA1\u6388\u6743 API",
    "method": "GET, PUT",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 56,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-68",
    "order": 68,
    "type": "api",
    "categoryKey": "be-admin",
    "categoryName": "\u5E73\u53F0\u6CBB\u7406\u4E0E\u7BA1\u7406\u63A7\u5236\u53F0",
    "categoryEnName": "Admin & Governance Platform",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/admin/audit",
    "description": "\u5168\u5E73\u53F0\u5B89\u5168\u5BA1\u8BA1\u65E5\u5FD7\u68C0\u7D22\u3001\u8FFD\u6EAF\u4E0E\u7559\u5B58\u63A5\u53E3",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 57,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-69",
    "order": 69,
    "type": "api",
    "categoryKey": "be-billing",
    "categoryName": "\u5546\u4E1A\u5316\u3001\u8BA1\u8D39\u4E0E\u8BA2\u9605",
    "categoryEnName": "Billing, Payments & Subscriptions",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/admin/billing/accounts",
    "description": "\u79DF\u6237\u8BA1\u8D39\u8D26\u672C\u8D26\u6237\u4E0E\u4F59\u989D\u4FE1\u606F\u68C0\u7D22",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 58,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-70",
    "order": 70,
    "type": "api",
    "categoryKey": "be-billing",
    "categoryName": "\u5546\u4E1A\u5316\u3001\u8BA1\u8D39\u4E0E\u8BA2\u9605",
    "categoryEnName": "Billing, Payments & Subscriptions",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/admin/billing/accounts/[...segments]",
    "description": "\u79DF\u6237\u660E\u7EC6\u8D26\u5355\u8C03\u8D26\u4E0E\u7ED3\u7B97\u4EA4\u6613\u8BB0\u5F55",
    "method": "GET, POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 24,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-71",
    "order": 71,
    "type": "api",
    "categoryKey": "be-billing",
    "categoryName": "\u5546\u4E1A\u5316\u3001\u8BA1\u8D39\u4E0E\u8BA2\u9605",
    "categoryEnName": "Billing, Payments & Subscriptions",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/admin/billing/ledger",
    "description": "\u5168\u5C40\u4EA4\u6613\u6D41\u6C34\u8D26\u76EE\u4E0E\u8D22\u52A1\u6263\u8D39\u660E\u7EC6\u67E5\u8BE2",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 25,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-72",
    "order": 72,
    "type": "api",
    "categoryKey": "be-billing",
    "categoryName": "\u5546\u4E1A\u5316\u3001\u8BA1\u8D39\u4E0E\u8BA2\u9605",
    "categoryEnName": "Billing, Payments & Subscriptions",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/admin/billing/overview",
    "description": "\u5168\u5E73\u53F0\u8D22\u52A1\u6536\u76CA\u5927\u76D8\u4E0E\u8425\u6536\u6C47\u603B\u6307\u6807",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 26,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-73",
    "order": 73,
    "type": "api",
    "categoryKey": "be-billing",
    "categoryName": "\u5546\u4E1A\u5316\u3001\u8BA1\u8D39\u4E0E\u8BA2\u9605",
    "categoryEnName": "Billing, Payments & Subscriptions",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/admin/billing/plans",
    "description": "\u8BA1\u8D39\u65B9\u6848\u4E0E\u5957\u9910\u5B9A\u4EF7\u7BA1\u7406\u914D\u7F6E API",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 27,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-74",
    "order": 74,
    "type": "api",
    "categoryKey": "be-billing",
    "categoryName": "\u5546\u4E1A\u5316\u3001\u8BA1\u8D39\u4E0E\u8BA2\u9605",
    "categoryEnName": "Billing, Payments & Subscriptions",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/admin/billing/plans/[planId]",
    "description": "\u7279\u5B9A\u5957\u9910\u5B9A\u4EF7\u4FEE\u6539\u3001\u5F52\u6863\u4E0E\u4E0A\u4E0B\u67B6\u63A7\u5236",
    "method": "PUT, DELETE",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 28,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-75",
    "order": 75,
    "type": "api",
    "categoryKey": "be-admin",
    "categoryName": "\u5E73\u53F0\u6CBB\u7406\u4E0E\u7BA1\u7406\u63A7\u5236\u53F0",
    "categoryEnName": "Admin & Governance Platform",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/admin/blacklist",
    "description": "\u5B89\u5168\u9ED1\u540D\u5355\u89C4\u5219\u68C0\u7D22\u4E0E\u9AD8\u5371 IP/\u90AE\u7BB1\u62C9\u9ED1",
    "method": "GET, POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 29,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-76",
    "order": 76,
    "type": "api",
    "categoryKey": "be-admin",
    "categoryName": "\u5E73\u53F0\u6CBB\u7406\u4E0E\u7BA1\u7406\u63A7\u5236\u53F0",
    "categoryEnName": "Admin & Governance Platform",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/admin/blacklist/[email]",
    "description": "\u89E3\u9664\u7279\u5B9A\u90AE\u7BB1/\u7528\u6237\u5B89\u5168\u540D\u5355\u5C01\u7981\u89C4\u5219",
    "method": "DELETE",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 30,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-77",
    "order": 77,
    "type": "api",
    "categoryKey": "be-admin",
    "categoryName": "\u5E73\u53F0\u6CBB\u7406\u4E0E\u7BA1\u7406\u63A7\u5236\u53F0",
    "categoryEnName": "Admin & Governance Platform",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/admin/collector/[...segments]",
    "description": "\u96C6\u7FA4\u5206\u5E03\u5F0F\u53EF\u89C2\u6D4B\u6027\u91C7\u96C6\u5668\u72B6\u6001\u67E5\u8BE2",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 31,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-78",
    "order": 78,
    "type": "api",
    "categoryKey": "be-admin",
    "categoryName": "\u5E73\u53F0\u6CBB\u7406\u4E0E\u7BA1\u7406\u63A7\u5236\u53F0",
    "categoryEnName": "Admin & Governance Platform",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/admin/homepage-video",
    "description": "\u95E8\u6237\u9996\u9875\u89C6\u9891\u5C55\u793A\u914D\u7F6E\u4E0E\u6D41\u5A92\u4F53\u5143\u6570\u636E",
    "method": "GET, PUT",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 32,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-79",
    "order": 79,
    "type": "api",
    "categoryKey": "be-admin",
    "categoryName": "\u5E73\u53F0\u6CBB\u7406\u4E0E\u7BA1\u7406\u63A7\u5236\u53F0",
    "categoryEnName": "Admin & Governance Platform",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/admin/network-teams",
    "description": "\u4F01\u4E1A\u7F51\u7EDC\u56E2\u961F\u865A\u62DF\u4E13\u7F51\u8D44\u6E90\u4E0E\u5217\u8868\u7BA1\u7406",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 33,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-80",
    "order": 80,
    "type": "api",
    "categoryKey": "be-admin",
    "categoryName": "\u5E73\u53F0\u6CBB\u7406\u4E0E\u7BA1\u7406\u63A7\u5236\u53F0",
    "categoryEnName": "Admin & Governance Platform",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/admin/network-teams/[teamId]",
    "description": "\u4F01\u4E1A\u7F51\u7EDC\u56E2\u961F\u865A\u62DF\u4E13\u7F51\u914D\u7F6E\u4E0E\u6210\u5458\u9650\u5236\u4FEE\u6539",
    "method": "PUT",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 34,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-81",
    "order": 81,
    "type": "api",
    "categoryKey": "be-admin",
    "categoryName": "\u5E73\u53F0\u6CBB\u7406\u4E0E\u7BA1\u7406\u63A7\u5236\u53F0",
    "categoryEnName": "Admin & Governance Platform",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/admin/scheduler/[...segments]",
    "description": "\u540E\u53F0\u5206\u5E03\u5F0F\u5B9A\u65F6\u4EFB\u52A1\u8C03\u5EA6\u72B6\u6001\u4E0E\u5FC3\u8DF3",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 35,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-82",
    "order": 82,
    "type": "api",
    "categoryKey": "be-admin",
    "categoryName": "\u5E73\u53F0\u6CBB\u7406\u4E0E\u7BA1\u7406\u63A7\u5236\u53F0",
    "categoryEnName": "Admin & Governance Platform",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/admin/settings",
    "description": "\u5168\u5C40\u7CFB\u7EDF\u73AF\u5883\u53C2\u6570\u914D\u7F6E\u3001\u70ED\u66F4\u65B0\u4E0E\u5B57\u5178\u8868",
    "method": "GET, POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 36,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-83",
    "order": 83,
    "type": "api",
    "categoryKey": "be-admin",
    "categoryName": "\u5E73\u53F0\u6CBB\u7406\u4E0E\u7BA1\u7406\u63A7\u5236\u53F0",
    "categoryEnName": "Admin & Governance Platform",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/admin/traffic/[...segments]",
    "description": "\u8FB9\u7F18\u7F51\u7EDC\u5B9E\u65F6\u6D41\u91CF\u76D1\u63A7\u4E0E\u5BA1\u8BA1\u63A5\u53E3",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 37,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-84",
    "order": 84,
    "type": "api",
    "categoryKey": "be-admin",
    "categoryName": "\u5E73\u53F0\u6CBB\u7406\u4E0E\u7BA1\u7406\u63A7\u5236\u53F0",
    "categoryEnName": "Admin & Governance Platform",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/admin/users",
    "description": "\u4F01\u4E1A\u7528\u6237\u6279\u91CF\u68C0\u7D22\u4E0E\u8D26\u53F7\u7BA1\u7406\u5458\u521B\u5EFA",
    "method": "POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 38,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-85",
    "order": 85,
    "type": "api",
    "categoryKey": "be-admin",
    "categoryName": "\u5E73\u53F0\u6CBB\u7406\u4E0E\u7BA1\u7406\u63A7\u5236\u53F0",
    "categoryEnName": "Admin & Governance Platform",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/admin/users/[userId]",
    "description": "\u7279\u5B9A\u7528\u6237\u4FE1\u606F\u4FEE\u6539\u4E0E\u8D26\u53F7\u8F6F\u5220\u9664/\u6CE8\u9500",
    "method": "DELETE",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 39,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-86",
    "order": 86,
    "type": "api",
    "categoryKey": "be-admin",
    "categoryName": "\u5E73\u53F0\u6CBB\u7406\u4E0E\u7BA1\u7406\u63A7\u5236\u53F0",
    "categoryEnName": "Admin & Governance Platform",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/admin/users/[userId]/network-access",
    "description": "\u7528\u6237\u7F51\u7EDC\u8FB9\u754C\u51C6\u5165\u89C4\u5219\u4E0E\u63A5\u5165\u6388\u6743",
    "method": "GET, PUT",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 40,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-87",
    "order": 87,
    "type": "api",
    "categoryKey": "be-admin",
    "categoryName": "\u5E73\u53F0\u6CBB\u7406\u4E0E\u7BA1\u7406\u63A7\u5236\u53F0",
    "categoryEnName": "Admin & Governance Platform",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/admin/users/[userId]/pause",
    "description": "\u5F3A\u5236\u6682\u505C\u7528\u6237\u670D\u52A1\u8BBF\u95EE\u4E0E\u63A5\u5165\u5C01\u63A7",
    "method": "POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 41,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-88",
    "order": 88,
    "type": "api",
    "categoryKey": "be-admin",
    "categoryName": "\u5E73\u53F0\u6CBB\u7406\u4E0E\u7BA1\u7406\u63A7\u5236\u53F0",
    "categoryEnName": "Admin & Governance Platform",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/admin/users/[userId]/plan-group",
    "description": "\u8C03\u6574\u7528\u6237\u6240\u5C5E\u8BA2\u9605\u914D\u989D\u5206\u7EC4\u4E0E\u7B56\u7565",
    "method": "PUT",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 42,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-89",
    "order": 89,
    "type": "api",
    "categoryKey": "be-admin",
    "categoryName": "\u5E73\u53F0\u6CBB\u7406\u4E0E\u7BA1\u7406\u63A7\u5236\u53F0",
    "categoryEnName": "Admin & Governance Platform",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/admin/users/[userId]/renew-uuid",
    "description": "\u5F3A\u5236\u91CD\u7F6E\u7528\u6237\u552F\u4E00\u901A\u4FE1\u51ED\u8BC1\u4E0E\u901A\u4FE1\u5BC6\u94A5",
    "method": "POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 43,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-90",
    "order": 90,
    "type": "api",
    "categoryKey": "be-admin",
    "categoryName": "\u5E73\u53F0\u6CBB\u7406\u4E0E\u7BA1\u7406\u63A7\u5236\u53F0",
    "categoryEnName": "Admin & Governance Platform",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/admin/users/[userId]/resume",
    "description": "\u89E3\u9664\u7528\u6237\u670D\u52A1\u5C01\u63A7\u5E76\u6062\u590D\u6B63\u5E38\u8BBF\u95EE\u6743\u9650",
    "method": "POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 44,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-91",
    "order": 91,
    "type": "api",
    "categoryKey": "be-admin",
    "categoryName": "\u5E73\u53F0\u6CBB\u7406\u4E0E\u7BA1\u7406\u63A7\u5236\u53F0",
    "categoryEnName": "Admin & Governance Platform",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/admin/users/[userId]/role",
    "description": "\u4E3A\u7528\u6237\u5206\u914D RBAC \u7BA1\u7406\u89D2\u8272\u4E0E\u6743\u9650\u89E3\u7ED1",
    "method": "POST, DELETE",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 45,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-92",
    "order": 92,
    "type": "api",
    "categoryKey": "be-admin",
    "categoryName": "\u5E73\u53F0\u6CBB\u7406\u4E0E\u7BA1\u7406\u63A7\u5236\u53F0",
    "categoryEnName": "Admin & Governance Platform",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/admin/users/metrics",
    "description": "\u7528\u6237\u589E\u957F\u8D8B\u52BF\u3001\u6D3B\u8DC3\u5EA6\u4E0E\u5E76\u53D1\u5206\u5E03\u6307\u6807",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 46,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-93",
    "order": 93,
    "type": "api",
    "categoryKey": "be-admin",
    "categoryName": "\u5E73\u53F0\u6CBB\u7406\u4E0E\u7BA1\u7406\u63A7\u5236\u53F0",
    "categoryEnName": "Admin & Governance Platform",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/admin/users/plan-groups/batch",
    "description": "\u6279\u91CF\u8C03\u6574\u591A\u4E2A\u7528\u6237\u7684\u65B9\u6848\u7FA4\u7EC4\u4E0E\u914D\u989D\u7B56\u7565",
    "method": "PUT",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 47,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-94",
    "order": 94,
    "type": "api",
    "categoryKey": "be-agent",
    "categoryName": "AI \u667A\u80FD\u4F53\u4E0E\u5DE5\u4F5C\u7A7A\u95F4",
    "categoryEnName": "AI Workspace & Agent Runtime",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/agent-server/[...segments]",
    "description": "\u5206\u5E03\u5F0F Agent Runtime \u8FB9\u7F18\u4EE3\u7406\u8DEF\u7531\u7F51\u5173",
    "method": "GET, POST, PUT, DELETE, PATCH",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 48,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-95",
    "order": 95,
    "type": "api",
    "categoryKey": "be-agent",
    "categoryName": "AI \u667A\u80FD\u4F53\u4E0E\u5DE5\u4F5C\u7A7A\u95F4",
    "categoryEnName": "AI Workspace & Agent Runtime",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/agent/[...segments]",
    "description": "\u667A\u80FD\u4F53\u6838\u5FC3\u72B6\u6001\u673A\u8C03\u5EA6\u3001\u5DE5\u5177\u8C03\u7528\u4E0E\u4EA4\u4E92\u901A\u9053",
    "method": "GET, POST, PUT, DELETE, PATCH",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 49,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-96",
    "order": 96,
    "type": "api",
    "categoryKey": "be-agent",
    "categoryName": "AI \u667A\u80FD\u4F53\u4E0E\u5DE5\u4F5C\u7A7A\u95F4",
    "categoryEnName": "AI Workspace & Agent Runtime",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/ai-workspace/[...path]",
    "description": "AI \u5DE5\u4F5C\u7A7A\u95F4\u6838\u5FC3\u8D44\u6E90\u521B\u5EFA\u3001\u72B6\u6001\u540C\u6B65\u4E0E\u7BA1\u7406",
    "method": "GET, POST, PUT, DELETE, PATCH",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 50,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-97",
    "order": 97,
    "type": "api",
    "categoryKey": "be-agent",
    "categoryName": "AI \u667A\u80FD\u4F53\u4E0E\u5DE5\u4F5C\u7A7A\u95F4",
    "categoryEnName": "AI Workspace & Agent Runtime",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/ai-workspace/bridge",
    "description": "\u5DE5\u4F5C\u7A7A\u95F4\u73AF\u5883\u4E0E\u5BBF\u4E3B\u670D\u52A1\u901A\u4FE1\u6865\u63A5\u5668",
    "method": "GET, POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 51,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-98",
    "order": 98,
    "type": "api",
    "categoryKey": "be-agent",
    "categoryName": "AI \u667A\u80FD\u4F53\u4E0E\u5DE5\u4F5C\u7A7A\u95F4",
    "categoryEnName": "AI Workspace & Agent Runtime",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/ai-workspace/free",
    "description": "\u6BCF\u65E5\u514D\u8D39\u7B97\u529B\u989D\u5EA6\u9886\u53D6\u4E0E\u914D\u989D\u6263\u51CF\u6821\u9A8C",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 52,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-99",
    "order": 99,
    "type": "api",
    "categoryKey": "be-agent",
    "categoryName": "AI \u667A\u80FD\u4F53\u4E0E\u5DE5\u4F5C\u7A7A\u95F4",
    "categoryEnName": "AI Workspace & Agent Runtime",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/ai-workspace/sessions/[...segments]",
    "description": "\u4EA4\u4E92\u5F0F\u5DE5\u4F5C\u7A7A\u95F4\u5386\u53F2\u4F1A\u8BDD\u4E0E\u4E0A\u4E0B\u6587\u68C0\u7D22",
    "method": "GET, POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 53,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-100",
    "order": 100,
    "type": "api",
    "categoryKey": "be-agent",
    "categoryName": "AI \u667A\u80FD\u4F53\u4E0E\u5DE5\u4F5C\u7A7A\u95F4",
    "categoryEnName": "AI Workspace & Agent Runtime",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/ai-workspace/tasks/catalog",
    "description": "\u667A\u80FD\u4F53\u6807\u51C6\u5316\u4F5C\u4E1A\u4EFB\u52A1\u6A21\u7248\u76EE\u5F55\u5E93",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 54,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-101",
    "order": 101,
    "type": "api",
    "categoryKey": "be-agent",
    "categoryName": "AI \u667A\u80FD\u4F53\u4E0E\u5DE5\u4F5C\u7A7A\u95F4",
    "categoryEnName": "AI Workspace & Agent Runtime",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/ai-workspace/trial",
    "description": "\u65B0\u7528\u6237\u8BD5\u7528\u671F\u6743\u76CA\u6FC0\u6D3B\u4E0E\u8D44\u683C\u5224\u5B9A\u63A5\u53E3",
    "method": "GET, POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 55,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-102",
    "order": 102,
    "type": "api",
    "categoryKey": "be-agent",
    "categoryName": "AI \u667A\u80FD\u4F53\u4E0E\u5DE5\u4F5C\u7A7A\u95F4",
    "categoryEnName": "AI Workspace & Agent Runtime",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/askai",
    "description": "\u901A\u7528\u95EE\u7B54 AI \u6A21\u578B\u63A8\u7406\u63A5\u53E3\u4E0E\u5FEB\u901F\u8865\u5168\u670D\u52A1",
    "method": "POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 56,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-103",
    "order": 103,
    "type": "api",
    "categoryKey": "be-auth",
    "categoryName": "\u8EAB\u4EFD\u8BA4\u8BC1\u4E0E\u7528\u6237\u8D26\u6237",
    "categoryEnName": "Authentication & Account Management",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/auth/account",
    "description": "\u7528\u6237\u81EA\u4E3B\u6CE8\u9500\u8D26\u6237\u4E0E\u9690\u79C1\u6570\u636E\u533F\u540D\u5316\u5904\u7406",
    "method": "DELETE",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 57,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-104",
    "order": 104,
    "type": "api",
    "categoryKey": "be-auth",
    "categoryName": "\u8EAB\u4EFD\u8BA4\u8BC1\u4E0E\u7528\u6237\u8D26\u6237",
    "categoryEnName": "Authentication & Account Management",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/auth/account/reactivate",
    "description": "\u51B7\u51BB\u671F\u8D26\u6237\u5FEB\u901F\u6062\u590D\u6FC0\u6D3B\u4E0E\u91CD\u7F6E",
    "method": "POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 58,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-105",
    "order": 105,
    "type": "api",
    "categoryKey": "be-admin",
    "categoryName": "\u5E73\u53F0\u6CBB\u7406\u4E0E\u7BA1\u7406\u63A7\u5236\u53F0",
    "categoryEnName": "Admin & Governance Platform",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/auth/admin/[...segments]",
    "description": "\u7BA1\u7406\u5458\u7279\u6743\u8EAB\u4EFD\u9A8C\u8BC1\u4E0E\u9274\u6743\u5206\u53D1\u7F51\u5173",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 24,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-106",
    "order": 106,
    "type": "api",
    "categoryKey": "be-admin",
    "categoryName": "\u5E73\u53F0\u6CBB\u7406\u4E0E\u7BA1\u7406\u63A7\u5236\u53F0",
    "categoryEnName": "Admin & Governance Platform",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/auth/admin/users/metrics",
    "description": "\u8BA4\u8BC1\u670D\u52A1\u5185\u90E8\u6D3B\u8DC3\u5EA6\u4E0E\u9274\u6743\u541E\u5410\u91CF\u7EDF\u8BA1",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 25,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-107",
    "order": 107,
    "type": "api",
    "categoryKey": "be-auth",
    "categoryName": "\u8EAB\u4EFD\u8BA4\u8BC1\u4E0E\u7528\u6237\u8D26\u6237",
    "categoryEnName": "Authentication & Account Management",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/auth/email-preferences",
    "description": "\u7528\u6237\u7CFB\u7EDF\u901A\u77E5\u4E0E\u90AE\u4EF6\u63A5\u6536\u504F\u597D\u8BFB\u5199\u63A5\u53E3",
    "method": "GET, PUT",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 26,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-108",
    "order": 108,
    "type": "api",
    "categoryKey": "be-auth",
    "categoryName": "\u8EAB\u4EFD\u8BA4\u8BC1\u4E0E\u7528\u6237\u8D26\u6237",
    "categoryEnName": "Authentication & Account Management",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/auth/email-unsubscribe",
    "description": "\u901A\u8FC7\u9000\u8BA2\u94FE\u63A5\u4E00\u952E\u9000\u8BA2\u90AE\u4EF6\u670D\u52A1\u5904\u7406",
    "method": "POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 27,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-109",
    "order": 109,
    "type": "api",
    "categoryKey": "be-auth",
    "categoryName": "\u8EAB\u4EFD\u8BA4\u8BC1\u4E0E\u7528\u6237\u8D26\u6237",
    "categoryEnName": "Authentication & Account Management",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/auth/login",
    "description": "\u7EDF\u4E00\u8D26\u53F7\u5BC6\u7801/SSO \u51ED\u636E\u767B\u5F55\u4E0E JWT Session \u7B7E\u53D1",
    "method": "GET, POST, DELETE",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 28,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-110",
    "order": 110,
    "type": "api",
    "categoryKey": "be-mfa",
    "categoryName": "MFA \u591A\u56E0\u7D20\u5B89\u5168\u8BA4\u8BC1",
    "categoryEnName": "Multi-Factor Authentication",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/auth/mfa/disable",
    "description": "\u7528\u6237\u89E3\u9664 TOTP \u53CC\u56E0\u5B50\u4FDD\u62A4\u4E0E\u5B89\u5168\u786E\u8BA4",
    "method": "GET, POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 29,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-111",
    "order": 111,
    "type": "api",
    "categoryKey": "be-mfa",
    "categoryName": "MFA \u591A\u56E0\u7D20\u5B89\u5168\u8BA4\u8BC1",
    "categoryEnName": "Multi-Factor Authentication",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/auth/mfa/recovery-codes",
    "description": "\u751F\u6210\u4E0E\u5237\u65B0 MFA \u4E00\u6B21\u6027\u5E94\u6025\u6062\u590D\u5BC6\u94A5",
    "method": "GET, POST, DELETE",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 30,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-112",
    "order": 112,
    "type": "api",
    "categoryKey": "be-mfa",
    "categoryName": "MFA \u591A\u56E0\u7D20\u5B89\u5168\u8BA4\u8BC1",
    "categoryEnName": "Multi-Factor Authentication",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/auth/mfa/recovery/[action]",
    "description": "\u4F7F\u7528\u5E94\u6025\u6062\u590D\u5BC6\u94A5\u8FDB\u884C\u7D27\u6025\u8EAB\u4EFD\u6551\u63F4",
    "method": "POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 31,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-113",
    "order": 113,
    "type": "api",
    "categoryKey": "be-mfa",
    "categoryName": "MFA \u591A\u56E0\u7D20\u5B89\u5168\u8BA4\u8BC1",
    "categoryEnName": "Multi-Factor Authentication",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/auth/mfa/setup",
    "description": "\u751F\u6210 TOTP \u4E8C\u6B21\u9A8C\u8BC1\u5BC6\u94A5\u4E0E\u7ED1\u5B9A\u4E8C\u7EF4\u7801",
    "method": "GET, POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 32,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-114",
    "order": 114,
    "type": "api",
    "categoryKey": "be-mfa",
    "categoryName": "MFA \u591A\u56E0\u7D20\u5B89\u5168\u8BA4\u8BC1",
    "categoryEnName": "Multi-Factor Authentication",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/auth/mfa/status",
    "description": "\u5F53\u524D\u767B\u5F55\u8D26\u53F7 MFA \u542F\u7528\u72B6\u6001\u4E0E\u5B89\u5168\u7EA7\u522B",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 33,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-115",
    "order": 115,
    "type": "api",
    "categoryKey": "be-mfa",
    "categoryName": "MFA \u591A\u56E0\u7D20\u5B89\u5168\u8BA4\u8BC1",
    "categoryEnName": "Multi-Factor Authentication",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/auth/mfa/verify",
    "description": "\u63D0\u4EA4 TOTP 6\u4F4D\u52A8\u6001\u9A8C\u8BC1\u7801\u5B8C\u6210\u4E8C\u6B21\u9274\u6743",
    "method": "GET, POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 34,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-116",
    "order": 116,
    "type": "api",
    "categoryKey": "be-auth",
    "categoryName": "\u8EAB\u4EFD\u8BA4\u8BC1\u4E0E\u7528\u6237\u8D26\u6237",
    "categoryEnName": "Authentication & Account Management",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/auth/network-access",
    "description": "\u5F53\u524D\u7528\u6237\u79C1\u6709\u865A\u62DF\u7F51\u7EDC\u63A5\u5165\u8BC1\u4E66\u4E0E\u89C4\u5219\u67E5\u8BE2",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 35,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-117",
    "order": 117,
    "type": "api",
    "categoryKey": "be-auth",
    "categoryName": "\u8EAB\u4EFD\u8BA4\u8BC1\u4E0E\u7528\u6237\u8D26\u6237",
    "categoryEnName": "Authentication & Account Management",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/auth/network-team",
    "description": "\u4F01\u4E1A\u7EC4\u7F51\u534F\u4F5C\u56E2\u961F\u5217\u8868\u67E5\u8BE2\u4E0E\u56E2\u961F\u521B\u5EFA",
    "method": "GET, POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 36,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-118",
    "order": 118,
    "type": "api",
    "categoryKey": "be-auth",
    "categoryName": "\u8EAB\u4EFD\u8BA4\u8BC1\u4E0E\u7528\u6237\u8D26\u6237",
    "categoryEnName": "Authentication & Account Management",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/auth/network-team/members/[userId]",
    "description": "\u4F01\u4E1A\u7F51\u7EDC\u56E2\u961F\u6210\u5458\u6388\u6743\u4E0E\u8E22\u51FA\u63A5\u53E3",
    "method": "PUT, DELETE",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 37,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-119",
    "order": 119,
    "type": "api",
    "categoryKey": "be-auth",
    "categoryName": "\u8EAB\u4EFD\u8BA4\u8BC1\u4E0E\u7528\u6237\u8D26\u6237",
    "categoryEnName": "Authentication & Account Management",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/auth/oauth/login/[provider]",
    "description": "\u7B2C\u4E09\u65B9 OAuth (GitHub/Google) \u5355\u70B9\u767B\u5F55\u8DF3\u8F6C",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 38,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-120",
    "order": 120,
    "type": "api",
    "categoryKey": "be-auth",
    "categoryName": "\u8EAB\u4EFD\u8BA4\u8BC1\u4E0E\u7528\u6237\u8D26\u6237",
    "categoryEnName": "Authentication & Account Management",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/auth/password/forgot",
    "description": "\u53D1\u8D77\u5BC6\u7801\u627E\u56DE\u6D41\u7A0B\u5E76\u521D\u59CB\u5316\u9A8C\u8BC1\u6311\u6218",
    "method": "GET, POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 39,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-121",
    "order": 121,
    "type": "api",
    "categoryKey": "be-auth",
    "categoryName": "\u8EAB\u4EFD\u8BA4\u8BC1\u4E0E\u7528\u6237\u8D26\u6237",
    "categoryEnName": "Authentication & Account Management",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/auth/password/forgot/confirm-code",
    "description": "\u6821\u9A8C\u627E\u56DE\u5BC6\u7801\u6536\u5230\u7684\u5B89\u5168\u9A8C\u8BC1\u7801",
    "method": "GET, POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 40,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-122",
    "order": 122,
    "type": "api",
    "categoryKey": "be-auth",
    "categoryName": "\u8EAB\u4EFD\u8BA4\u8BC1\u4E0E\u7528\u6237\u8D26\u6237",
    "categoryEnName": "Authentication & Account Management",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/auth/password/forgot/send-code",
    "description": "\u4E0B\u53D1\u627E\u56DE\u5BC6\u7801\u9A8C\u8BC1\u7801\u90AE\u4EF6\u81F3\u7528\u6237\u90AE\u7BB1",
    "method": "GET, POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 41,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-123",
    "order": 123,
    "type": "api",
    "categoryKey": "be-auth",
    "categoryName": "\u8EAB\u4EFD\u8BA4\u8BC1\u4E0E\u7528\u6237\u8D26\u6237",
    "categoryEnName": "Authentication & Account Management",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/auth/password/reset/mfa",
    "description": "\u5728\u5177\u5907 MFA \u4FDD\u62A4\u7684\u73AF\u5883\u4E0B\u5B89\u5168\u91CD\u7F6E\u5BC6\u7801",
    "method": "POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 42,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-124",
    "order": 124,
    "type": "api",
    "categoryKey": "be-auth",
    "categoryName": "\u8EAB\u4EFD\u8BA4\u8BC1\u4E0E\u7528\u6237\u8D26\u6237",
    "categoryEnName": "Authentication & Account Management",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/auth/password/set",
    "description": "\u5BC6\u7801\u8BBE\u7F6E/\u4FEE\u6539\u5E76\u89E6\u53D1\u5168\u7AEF\u4F1A\u8BDD\u5B89\u5168\u91CD\u68C0",
    "method": "POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 43,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-125",
    "order": 125,
    "type": "api",
    "categoryKey": "be-auth",
    "categoryName": "\u8EAB\u4EFD\u8BA4\u8BC1\u4E0E\u7528\u6237\u8D26\u6237",
    "categoryEnName": "Authentication & Account Management",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/auth/referrals",
    "description": "\u5F53\u524D\u7528\u6237\u63A8\u5E7F\u88C2\u53D8\u9080\u8BF7\u8BB0\u5F55\u4E0E\u6536\u76CA\u62A5\u8868",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 44,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-126",
    "order": 126,
    "type": "api",
    "categoryKey": "be-auth",
    "categoryName": "\u8EAB\u4EFD\u8BA4\u8BC1\u4E0E\u7528\u6237\u8D26\u6237",
    "categoryEnName": "Authentication & Account Management",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/auth/referrals/settlements",
    "description": "\u63A8\u5E7F\u8FD4\u5229\u7533\u8BF7\u63D0\u73B0\u4E0E\u4F63\u91D1\u7ED3\u7B97\u7533\u8BF7",
    "method": "POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 45,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-127",
    "order": 127,
    "type": "api",
    "categoryKey": "be-auth",
    "categoryName": "\u8EAB\u4EFD\u8BA4\u8BC1\u4E0E\u7528\u6237\u8D26\u6237",
    "categoryEnName": "Authentication & Account Management",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/auth/register",
    "description": "\u63D0\u4EA4\u65B0\u7528\u6237\u6CE8\u518C\u4FE1\u606F\u5E76\u521D\u59CB\u5316\u79DF\u6237\u7A7A\u95F4",
    "method": "GET, POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 46,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-128",
    "order": 128,
    "type": "api",
    "categoryKey": "be-auth",
    "categoryName": "\u8EAB\u4EFD\u8BA4\u8BC1\u4E0E\u7528\u6237\u8D26\u6237",
    "categoryEnName": "Authentication & Account Management",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/auth/register/send",
    "description": "\u5411\u6CE8\u518C\u90AE\u7BB1\u53D1\u9001\u9A8C\u8BC1\u7801\u6216\u6FC0\u6D3B\u9A8C\u8BC1\u94FE\u63A5",
    "method": "GET, POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 47,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-129",
    "order": 129,
    "type": "api",
    "categoryKey": "be-auth",
    "categoryName": "\u8EAB\u4EFD\u8BA4\u8BC1\u4E0E\u7528\u6237\u8D26\u6237",
    "categoryEnName": "Authentication & Account Management",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/auth/register/verify",
    "description": "\u9A8C\u8BC1\u6CE8\u518C\u90AE\u7BB1\u9A8C\u8BC1\u7801\u5E76\u5B8C\u6210\u8D26\u6237\u6FC0\u6D3B",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 48,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-130",
    "order": 130,
    "type": "api",
    "categoryKey": "be-auth",
    "categoryName": "\u8EAB\u4EFD\u8BA4\u8BC1\u4E0E\u7528\u6237\u8D26\u6237",
    "categoryEnName": "Authentication & Account Management",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/auth/registration-policy",
    "description": "\u83B7\u53D6\u5168\u7AD9\u5F53\u524D\u5F00\u653E\u6CE8\u518C\u72B6\u6001\u4E0E\u9A8C\u8BC1\u7B56\u7565",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 49,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-131",
    "order": 131,
    "type": "api",
    "categoryKey": "be-auth",
    "categoryName": "\u8EAB\u4EFD\u8BA4\u8BC1\u4E0E\u7528\u6237\u8D26\u6237",
    "categoryEnName": "Authentication & Account Management",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/auth/session",
    "description": "\u6821\u9A8C\u5F53\u524D\u5BA2\u6237\u7AEF\u767B\u5F55\u51ED\u636E\u6709\u6548\u6027\u4E0E\u5B89\u5168\u767B\u51FA",
    "method": "GET, DELETE",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 50,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-132",
    "order": 132,
    "type": "api",
    "categoryKey": "be-billing",
    "categoryName": "\u5546\u4E1A\u5316\u3001\u8BA1\u8D39\u4E0E\u8BA2\u9605",
    "categoryEnName": "Billing, Payments & Subscriptions",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/auth/stripe/checkout",
    "description": "\u521B\u5EFA Stripe Checkout \u6536\u94F6\u53F0\u7ED3\u7B97\u4F1A\u8BDD",
    "method": "POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 51,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-133",
    "order": 133,
    "type": "api",
    "categoryKey": "be-billing",
    "categoryName": "\u5546\u4E1A\u5316\u3001\u8BA1\u8D39\u4E0E\u8BA2\u9605",
    "categoryEnName": "Billing, Payments & Subscriptions",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/auth/stripe/portal",
    "description": "\u521B\u5EFA Stripe \u5BA2\u6237\u81EA\u4E3B\u8D26\u5355\u7BA1\u7406 Portal \u4F1A\u8BDD",
    "method": "POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 52,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-134",
    "order": 134,
    "type": "api",
    "categoryKey": "be-billing",
    "categoryName": "\u5546\u4E1A\u5316\u3001\u8BA1\u8D39\u4E0E\u8BA2\u9605",
    "categoryEnName": "Billing, Payments & Subscriptions",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/auth/stripe/subscription/pending",
    "description": "\u67E5\u8BE2\u5904\u7406\u4E2D/\u5F85\u652F\u4ED8\u7684 Stripe \u8BA2\u9605\u4EA4\u6613",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 53,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-135",
    "order": 135,
    "type": "api",
    "categoryKey": "be-billing",
    "categoryName": "\u5546\u4E1A\u5316\u3001\u8BA1\u8D39\u4E0E\u8BA2\u9605",
    "categoryEnName": "Billing, Payments & Subscriptions",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/auth/stripe/subscription/preview",
    "description": "\u8BA2\u9605\u5347\u964D\u7EA7\u4EF7\u683C\u53D8\u52A8\u5B9E\u65F6\u8BD5\u7B97\u9884\u89C8",
    "method": "POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 54,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-136",
    "order": 136,
    "type": "api",
    "categoryKey": "be-billing",
    "categoryName": "\u5546\u4E1A\u5316\u3001\u8BA1\u8D39\u4E0E\u8BA2\u9605",
    "categoryEnName": "Billing, Payments & Subscriptions",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/auth/stripe/subscription/renewal",
    "description": "\u624B\u52A8\u89E6\u53D1\u5230\u671F\u8BA2\u9605\u81EA\u52A8\u7EED\u671F\u6263\u6B3E\u6D41\u7A0B",
    "method": "GET, POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 55,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-137",
    "order": 137,
    "type": "api",
    "categoryKey": "be-billing",
    "categoryName": "\u5546\u4E1A\u5316\u3001\u8BA1\u8D39\u4E0E\u8BA2\u9605",
    "categoryEnName": "Billing, Payments & Subscriptions",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/auth/stripe/subscription/renewal/preview",
    "description": "\u4E0B\u4E00\u8BA1\u8D39\u5468\u671F\u8D26\u5355\u660E\u7EC6\u4E0E\u7EED\u8D39\u4EF7\u683C\u9884\u6D4B",
    "method": "POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 56,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-138",
    "order": 138,
    "type": "api",
    "categoryKey": "be-billing",
    "categoryName": "\u5546\u4E1A\u5316\u3001\u8BA1\u8D39\u4E0E\u8BA2\u9605",
    "categoryEnName": "Billing, Payments & Subscriptions",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/auth/stripe/subscription/retry",
    "description": "\u9488\u5BF9\u5931\u8D25\u7684\u6263\u6B3E\u8BA2\u5355\u6267\u884C\u624B\u52A8\u91CD\u8BD5\u6263\u8D39",
    "method": "POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 57,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-139",
    "order": 139,
    "type": "api",
    "categoryKey": "be-billing",
    "categoryName": "\u5546\u4E1A\u5316\u3001\u8BA1\u8D39\u4E0E\u8BA2\u9605",
    "categoryEnName": "Billing, Payments & Subscriptions",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/auth/subscriptions",
    "description": "\u7528\u6237\u5F53\u524D\u6D3B\u8DC3\u8BA2\u9605\u65B9\u6848\u4E0E\u6743\u76CA\u914D\u989D\u67E5\u8BE2",
    "method": "GET, POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 58,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-140",
    "order": 140,
    "type": "api",
    "categoryKey": "be-billing",
    "categoryName": "\u5546\u4E1A\u5316\u3001\u8BA1\u8D39\u4E0E\u8BA2\u9605",
    "categoryEnName": "Billing, Payments & Subscriptions",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/auth/subscriptions/cancel",
    "description": "\u53D6\u6D88\u8BA2\u9605\u65B9\u6848\u5E76\u5728\u5F53\u524D\u8BA1\u8D39\u5468\u671F\u540E\u5931\u6548",
    "method": "POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 24,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-141",
    "order": 141,
    "type": "api",
    "categoryKey": "be-billing",
    "categoryName": "\u5546\u4E1A\u5316\u3001\u8BA1\u8D39\u4E0E\u8BA2\u9605",
    "categoryEnName": "Billing, Payments & Subscriptions",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/auth/subscriptions/refund",
    "description": "\u7533\u8BF7\u8BA2\u9605\u6B3E\u9879\u9000\u56DE\u4E0E\u9000\u6B3E\u8FDB\u5EA6\u67E5\u8BE2",
    "method": "GET, POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 25,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-142",
    "order": 142,
    "type": "api",
    "categoryKey": "be-auth",
    "categoryName": "\u8EAB\u4EFD\u8BA4\u8BC1\u4E0E\u7528\u6237\u8D26\u6237",
    "categoryEnName": "Authentication & Account Management",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/auth/token/exchange",
    "description": "OAuth \u6388\u6743\u7801\u4E0E\u5185\u90E8\u8EAB\u4EFD\u4EE4\u724C\u7F6E\u6362 API",
    "method": "POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 26,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-143",
    "order": 143,
    "type": "api",
    "categoryKey": "be-auth",
    "categoryName": "\u8EAB\u4EFD\u8BA4\u8BC1\u4E0E\u7528\u6237\u8D26\u6237",
    "categoryEnName": "Authentication & Account Management",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/auth/verify-email",
    "description": "\u90AE\u7BB1\u9A8C\u8BC1\u4EE4\u724C\u751F\u6548\u5E76\u6FC0\u6D3B\u7528\u6237\u5B8C\u5168\u7279\u6743",
    "method": "GET, POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 27,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-144",
    "order": 144,
    "type": "api",
    "categoryKey": "be-auth",
    "categoryName": "\u8EAB\u4EFD\u8BA4\u8BC1\u4E0E\u7528\u6237\u8D26\u6237",
    "categoryEnName": "Authentication & Account Management",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/auth/verify-email/send",
    "description": "\u8865\u53D1\u7528\u6237\u90AE\u7BB1\u6240\u6709\u6743\u786E\u8BA4\u90AE\u4EF6",
    "method": "GET, POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 28,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-145",
    "order": 145,
    "type": "api",
    "categoryKey": "be-billing",
    "categoryName": "\u5546\u4E1A\u5316\u3001\u8BA1\u8D39\u4E0E\u8BA2\u9605",
    "categoryEnName": "Billing, Payments & Subscriptions",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/billing/plans",
    "description": "\u6807\u51C6\u5546\u4E1A\u5316\u8BA1\u8D39\u65B9\u6848\u4E0E\u89C4\u683C\u53C2\u6570\u516C\u5F00\u5C55\u73B0",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 29,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-146",
    "order": 146,
    "type": "api",
    "categoryKey": "be-content",
    "categoryName": "\u6587\u6863\u68C0\u7D22\u3001\u8425\u9500\u4E0E\u96C6\u6210\u670D\u52A1",
    "categoryEnName": "Docs, Content & Integrations",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/blogs/latest",
    "description": "\u83B7\u53D6\u6700\u65B0\u53D1\u8868\u7684\u6280\u672F\u535A\u5BA2\u4E0E\u67B6\u6784\u6587\u7AE0\u63A8\u8350",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 30,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-147",
    "order": 147,
    "type": "api",
    "categoryKey": "be-content",
    "categoryName": "\u6587\u6863\u68C0\u7D22\u3001\u8425\u9500\u4E0E\u96C6\u6210\u670D\u52A1",
    "categoryEnName": "Docs, Content & Integrations",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/content-meta",
    "description": "\u5168\u7AD9 SEO \u5185\u5BB9\u5143\u6570\u636E\u4E0E OpenGraph \u6807\u7B7E\u7D22\u5F15",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 31,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-148",
    "order": 148,
    "type": "api",
    "categoryKey": "be-content",
    "categoryName": "\u6587\u6863\u68C0\u7D22\u3001\u8425\u9500\u4E0E\u96C6\u6210\u670D\u52A1",
    "categoryEnName": "Docs, Content & Integrations",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/dl-index/artifacts-manifest",
    "description": "\u4E91\u539F\u751F\u4EA4\u4ED8\u5DE5\u4EF6\u5206\u53D1\u6E05\u5355\u4E0E\u6821\u9A8C\u54C8\u5E0C",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 32,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-149",
    "order": 149,
    "type": "api",
    "categoryKey": "be-content",
    "categoryName": "\u6587\u6863\u68C0\u7D22\u3001\u8425\u9500\u4E0E\u96C6\u6210\u670D\u52A1",
    "categoryEnName": "Docs, Content & Integrations",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/dl-index/docs-manifest",
    "description": "\u79BB\u7EBF\u6280\u672F\u6587\u6863\u7D22\u5F15\u6253\u5305\u4E0E\u5206\u53D1\u5143\u6570\u636E",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 33,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-150",
    "order": 150,
    "type": "api",
    "categoryKey": "be-content",
    "categoryName": "\u6587\u6863\u68C0\u7D22\u3001\u8425\u9500\u4E0E\u96C6\u6210\u670D\u52A1",
    "categoryEnName": "Docs, Content & Integrations",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/docs/catalog",
    "description": "\u5168\u7AD9\u6280\u672F\u6587\u6863\u4F53\u7CFB\u7ED3\u6784\u4E0E\u5C42\u7EA7\u5BFC\u822A\u6811",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 34,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-151",
    "order": 151,
    "type": "api",
    "categoryKey": "be-content",
    "categoryName": "\u6587\u6863\u68C0\u7D22\u3001\u8425\u9500\u4E0E\u96C6\u6210\u670D\u52A1",
    "categoryEnName": "Docs, Content & Integrations",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/docs/markdown/[collection]/[...slug]",
    "description": "\u83B7\u53D6\u6280\u672F\u6587\u6863 Markdown \u539F\u751F\u5185\u5BB9\u4E0E\u5143\u6570\u636E",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 35,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-152",
    "order": 152,
    "type": "api",
    "categoryKey": "be-content",
    "categoryName": "\u6587\u6863\u68C0\u7D22\u3001\u8425\u9500\u4E0E\u96C6\u6210\u670D\u52A1",
    "categoryEnName": "Docs, Content & Integrations",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/docs/search",
    "description": "\u5168\u7AD9\u6280\u672F\u6587\u6863\u4E0E API \u89C4\u8303\u5168\u6587\u5012\u6392\u68C0\u7D22",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 36,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-153",
    "order": 153,
    "type": "api",
    "categoryKey": "be-edge",
    "categoryName": "\u8FB9\u7F18\u534F\u540C\u4E0E\u4E92\u8054\u7F51\u7EDC",
    "categoryEnName": "Edge Connect & Collaboration",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/global-mesh/nodes",
    "description": "\u5168\u7403\u5206\u5E03\u5F0F\u7F51\u7EDC\u8282\u70B9\u62D3\u6251\u5206\u5E03\u4E0E\u5EF6\u8FDF\u76D1\u63A7",
    "method": "GET, POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 37,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-154",
    "order": 154,
    "type": "api",
    "categoryKey": "be-content",
    "categoryName": "\u6587\u6863\u68C0\u7D22\u3001\u8425\u9500\u4E0E\u96C6\u6210\u670D\u52A1",
    "categoryEnName": "Docs, Content & Integrations",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/homepage-video",
    "description": "\u5B98\u7F51\u9996\u9875\u5C55\u793A\u89C6\u9891\u63A8\u6D41\u5730\u5740\u4E0E\u5C01\u9762\u5143\u6570\u636E",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 38,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-155",
    "order": 155,
    "type": "api",
    "categoryKey": "be-content",
    "categoryName": "\u6587\u6863\u68C0\u7D22\u3001\u8425\u9500\u4E0E\u96C6\u6210\u670D\u52A1",
    "categoryEnName": "Docs, Content & Integrations",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/integrations/defaults",
    "description": "\u5E73\u53F0\u9884\u7F6E\u7B2C\u4E09\u65B9\u96C6\u6210\u5DE5\u5177\u4E0E Webhook \u6A21\u677F",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 39,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-156",
    "order": 156,
    "type": "api",
    "categoryKey": "be-content",
    "categoryName": "\u6587\u6863\u68C0\u7D22\u3001\u8425\u9500\u4E0E\u96C6\u6210\u670D\u52A1",
    "categoryEnName": "Docs, Content & Integrations",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/integrations/probe",
    "description": "\u7B2C\u4E09\u65B9\u96C6\u6210\u76EE\u6807\u8FDE\u901A\u6027\u4E0E\u5065\u5EB7\u5EA6\u4E3B\u52A8\u63A2\u6D4B",
    "method": "POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 40,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-157",
    "order": 157,
    "type": "api",
    "categoryKey": "be-content",
    "categoryName": "\u6587\u6863\u68C0\u7D22\u3001\u8425\u9500\u4E0E\u96C6\u6210\u670D\u52A1",
    "categoryEnName": "Docs, Content & Integrations",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/marketing/home-stats",
    "description": "\u5E73\u53F0\u6838\u5FC3\u8FD0\u884C\u6307\u6807\u4E0E\u516C\u5171\u5927\u76D8\u6570\u636E\u6C47\u603B",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 41,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-158",
    "order": 158,
    "type": "api",
    "categoryKey": "be-agent",
    "categoryName": "AI \u667A\u80FD\u4F53\u4E0E\u5DE5\u4F5C\u7A7A\u95F4",
    "categoryEnName": "AI Workspace & Agent Runtime",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/moltbot/chat",
    "description": "MoltBot \u81EA\u52A8\u5316\u8FD0\u7EF4\u5BF9\u8BDD\u673A\u5668\u4EBA\u4EA4\u4E92\u63A5\u53E3",
    "method": "POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 42,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-159",
    "order": 159,
    "type": "api",
    "categoryKey": "be-agent",
    "categoryName": "AI \u667A\u80FD\u4F53\u4E0E\u5DE5\u4F5C\u7A7A\u95F4",
    "categoryEnName": "AI Workspace & Agent Runtime",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/openclaw/assistant",
    "description": "OpenClaw \u5F00\u6E90\u8F85\u52A9\u673A\u5668\u4EBA\u4EFB\u52A1\u63D0\u4EA4\u63A5\u53E3",
    "method": "POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 43,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-160",
    "order": 160,
    "type": "api",
    "categoryKey": "be-ops",
    "categoryName": "\u8FD0\u7EF4\u76D1\u63A7\u4E0E\u53D1\u5E03\u95E8\u7981",
    "categoryEnName": "Operations & Progressive Release",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/operations/catalog",
    "description": "\u5E73\u53F0\u6807\u51C6\u5316\u8FD0\u7EF4\u64CD\u4F5C\u76EE\u5F55\u4E0E\u7F16\u6392\u6307\u4EE4",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 44,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-161",
    "order": 161,
    "type": "api",
    "categoryKey": "be-ops",
    "categoryName": "\u8FD0\u7EF4\u76D1\u63A7\u4E0E\u53D1\u5E03\u95E8\u7981",
    "categoryEnName": "Operations & Progressive Release",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/operations/mcp",
    "description": "MCP Model Context Protocol \u670D\u52A1\u7AEF\u8C03\u7528\u4EE3\u7406",
    "method": "GET, POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 45,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-162",
    "order": 162,
    "type": "api",
    "categoryKey": "be-ops",
    "categoryName": "\u8FD0\u7EF4\u76D1\u63A7\u4E0E\u53D1\u5E03\u95E8\u7981",
    "categoryEnName": "Operations & Progressive Release",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/operations/plans",
    "description": "\u521B\u5EFA\u5E76\u63D0\u4EA4\u5E73\u53F0\u81EA\u52A8\u5316\u8FD0\u7EF4\u4E0E\u53D1\u5E03\u8BA1\u5212",
    "method": "POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 46,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-163",
    "order": 163,
    "type": "api",
    "categoryKey": "be-ops",
    "categoryName": "\u8FD0\u7EF4\u76D1\u63A7\u4E0E\u53D1\u5E03\u95E8\u7981",
    "categoryEnName": "Operations & Progressive Release",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/operations/progressive-release",
    "description": "\u6E10\u8FDB\u5F0F\u53D1\u5E03\u6307\u6807\u770B\u677F\u4E0E\u591A\u73AF\u5883\u95E8\u7981\u51B3\u7B56 API",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 47,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-164",
    "order": 164,
    "type": "api",
    "categoryKey": "be-ops",
    "categoryName": "\u8FD0\u7EF4\u76D1\u63A7\u4E0E\u53D1\u5E03\u95E8\u7981",
    "categoryEnName": "Operations & Progressive Release",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/operations/releases",
    "description": "\u53D1\u5E03\u5386\u53F2\u7248\u672C\u8BB0\u5F55\u3001\u56DE\u6EDA\u5FEB\u7167\u4E0E\u53D8\u66F4\u8FFD\u8E2A",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 48,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-165",
    "order": 165,
    "type": "api",
    "categoryKey": "be-ops",
    "categoryName": "\u8FD0\u7EF4\u76D1\u63A7\u4E0E\u53D1\u5E03\u95E8\u7981",
    "categoryEnName": "Operations & Progressive Release",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/ping",
    "description": "Console \u63A7\u5236\u53F0\u57FA\u7840\u670D\u52A1\u8FDE\u901A\u6027\u4E0E\u5F80\u8FD4\u65F6\u5EF6\u63A2\u9488",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 49,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-166",
    "order": 166,
    "type": "api",
    "categoryKey": "be-agent",
    "categoryName": "AI \u667A\u80FD\u4F53\u4E0E\u5DE5\u4F5C\u7A7A\u95F4",
    "categoryEnName": "AI Workspace & Agent Runtime",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/rag/query",
    "description": "\u4F01\u4E1A\u79C1\u6709\u77E5\u8BC6\u5E93\u8BED\u4E49\u5411\u91CF\u68C0\u7D22\u4E0E\u53EC\u56DE\u63A5\u53E3",
    "method": "POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 50,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-167",
    "order": 167,
    "type": "api",
    "categoryKey": "be-content",
    "categoryName": "\u6587\u6863\u68C0\u7D22\u3001\u8425\u9500\u4E0E\u96C6\u6210\u670D\u52A1",
    "categoryEnName": "Docs, Content & Integrations",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/referrals/campaign",
    "description": "\u5E73\u53F0\u63A8\u8350\u88C2\u53D8\u63A8\u5E7F\u8425\u9500\u6D3B\u52A8\u89C4\u5219\u4E0E\u5956\u52B1",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 51,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-168",
    "order": 168,
    "type": "api",
    "categoryKey": "be-content",
    "categoryName": "\u6587\u6863\u68C0\u7D22\u3001\u8425\u9500\u4E0E\u96C6\u6210\u670D\u52A1",
    "categoryEnName": "Docs, Content & Integrations",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/render-markdown",
    "description": "\u670D\u52A1\u7AEF\u5B89\u5168 Markdown \u8F6C HTML \u5BCC\u6587\u672C\u6E32\u67D3\u5668",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 52,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-169",
    "order": 169,
    "type": "api",
    "categoryKey": "be-agent",
    "categoryName": "AI \u667A\u80FD\u4F53\u4E0E\u5DE5\u4F5C\u7A7A\u95F4",
    "categoryEnName": "AI Workspace & Agent Runtime",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/task/[...segments]",
    "description": "\u957F\u5468\u671F\u5F02\u6B65\u4F5C\u4E1A\u4EFB\u52A1\u8FDB\u5EA6\u8F6E\u8BE2\u4E0E\u72B6\u6001\u673A",
    "method": "GET, POST, PUT, DELETE, PATCH",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 53,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-170",
    "order": 170,
    "type": "api",
    "categoryKey": "be-auth",
    "categoryName": "\u8EAB\u4EFD\u8BA4\u8BC1\u4E0E\u7528\u6237\u8D26\u6237",
    "categoryEnName": "Authentication & Account Management",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/users",
    "description": "\u5E73\u53F0\u7528\u6237\u5217\u8868\u57FA\u7840\u6458\u8981\u4E0E\u591A\u7EF4\u6807\u7B7E\u67E5\u8BE2",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 54,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-171",
    "order": 171,
    "type": "api",
    "categoryKey": "be-edge",
    "categoryName": "\u8FB9\u7F18\u534F\u540C\u4E0E\u4E92\u8054\u7F51\u7EDC",
    "categoryEnName": "Edge Connect & Collaboration",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/xconnect-zero/[...segments]",
    "description": "XConnect \u96F6\u4FE1\u4EFB\u8FB9\u7F18\u4E92\u8054\u534F\u8BAE\u4EE3\u7406\u7F51\u5173",
    "method": "GET, POST, PUT, DELETE, PATCH",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 55,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-172",
    "order": 172,
    "type": "api",
    "categoryKey": "be-edge",
    "categoryName": "\u8FB9\u7F18\u534F\u540C\u4E0E\u4E92\u8054\u7F51\u7EDC",
    "categoryEnName": "Edge Connect & Collaboration",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/xworkmate/bridge",
    "description": "XWorkmate \u8DE8\u7AEF\u534F\u540C\u901A\u4FE1\u4E0E\u6D88\u606F\u8C03\u5EA6\u534F\u8BAE\u6865",
    "method": "GET, POST",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 56,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-173",
    "order": 173,
    "type": "api",
    "categoryKey": "be-edge",
    "categoryName": "\u8FB9\u7F18\u534F\u540C\u4E0E\u4E92\u8054\u7F51\u7EDC",
    "categoryEnName": "Edge Connect & Collaboration",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/api/xworkmate/profile",
    "description": "XWorkmate \u672C\u5730\u5BA2\u6237\u7AEF\u914D\u7F6E\u4E0E\u540C\u6B65\u72B6\u6001",
    "method": "GET, PUT",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 57,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-console-174",
    "order": 174,
    "type": "api",
    "categoryKey": "be-ops",
    "categoryName": "\u8FD0\u7EF4\u76D1\u63A7\u4E0E\u53D1\u5E03\u95E8\u7981",
    "categoryEnName": "Operations & Progressive Release",
    "service": "Console",
    "serviceDomain": "console.svc.plus",
    "path": "/healthz",
    "description": "Console \u5BB9\u5668\u5E94\u7528\u5B58\u6D3B\u4E0E\u5C31\u7EEA\u63A2\u9488 (Kubernetes Liveness)",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 22,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-accounts-175",
    "order": 175,
    "type": "api",
    "categoryKey": "be-ops",
    "categoryName": "\u8FD0\u7EF4\u76D1\u63A7\u4E0E\u53D1\u5E03\u95E8\u7981",
    "categoryEnName": "Operations & Progressive Release",
    "service": "Accounts",
    "serviceDomain": "accounts.svc.plus",
    "path": "/healthz",
    "description": "Accounts \u7EDF\u4E00\u8EAB\u4EFD\u8BA4\u8BC1\u5FAE\u670D\u52A1\u5BB9\u5668\u5B58\u6D3B\u63A2\u9488 (Liveness)",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 106,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-accounts-176",
    "order": 176,
    "type": "api",
    "categoryKey": "be-ops",
    "categoryName": "\u8FD0\u7EF4\u76D1\u63A7\u4E0E\u53D1\u5E03\u95E8\u7981",
    "categoryEnName": "Operations & Progressive Release",
    "service": "Accounts",
    "serviceDomain": "accounts.svc.plus",
    "path": "/readyz",
    "description": "Accounts \u7EDF\u4E00\u8EAB\u4EFD\u5FAE\u670D\u52A1\u6570\u636E\u5E93\u4E0E\u4F9D\u8D56\u5C31\u7EEA\u63A2\u9488 (Readiness)",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 94,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-accounts-177",
    "order": 177,
    "type": "api",
    "categoryKey": "be-ops",
    "categoryName": "\u8FD0\u7EF4\u76D1\u63A7\u4E0E\u53D1\u5E03\u95E8\u7981",
    "categoryEnName": "Operations & Progressive Release",
    "service": "Accounts",
    "serviceDomain": "accounts.svc.plus",
    "path": "/api/ping",
    "description": "Accounts \u5FAE\u670D\u52A1\u5185\u90E8 RPC \u5FC3\u8DF3\u4E0E\u7F51\u7EDC\u8FDE\u901A\u6027\u63A2\u9488",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 14,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-accounts-178",
    "order": 178,
    "type": "api",
    "categoryKey": "be-ops",
    "categoryName": "\u8FD0\u7EF4\u76D1\u63A7\u4E0E\u53D1\u5E03\u95E8\u7981",
    "categoryEnName": "Operations & Progressive Release",
    "service": "Accounts",
    "serviceDomain": "accounts.svc.plus",
    "path": "/api/billing/plans",
    "description": "Accounts \u8BA1\u8D39\u5957\u9910\u4E0E\u6743\u9650\u540C\u6B65\u7F51\u5173\u63A5\u53E3",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 67,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-billing-179",
    "order": 179,
    "type": "api",
    "categoryKey": "be-ops",
    "categoryName": "\u8FD0\u7EF4\u76D1\u63A7\u4E0E\u53D1\u5E03\u95E8\u7981",
    "categoryEnName": "Operations & Progressive Release",
    "service": "Billing",
    "serviceDomain": "billing.svc.plus",
    "path": "/healthz",
    "description": "Billing \u5546\u4E1A\u5316\u8BA1\u8D39\u5FAE\u670D\u52A1\u5BB9\u5668\u5B58\u6D3B\u63A2\u9488 (Liveness)",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 16,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-billing-180",
    "order": 180,
    "type": "api",
    "categoryKey": "be-ops",
    "categoryName": "\u8FD0\u7EF4\u76D1\u63A7\u4E0E\u53D1\u5E03\u95E8\u7981",
    "categoryEnName": "Operations & Progressive Release",
    "service": "Billing",
    "serviceDomain": "billing.svc.plus",
    "path": "/readyz",
    "description": "Billing \u5546\u4E1A\u5316\u8BA1\u8D39\u5FAE\u670D\u52A1\u652F\u4ED8\u7F51\u5173\u4E0E\u6570\u636E\u5E93\u5C31\u7EEA\u63A2\u9488",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 12,
    "freshnessSec": 8,
    "result": "PASS"
  },
  {
    "id": "be-billing-181",
    "order": 181,
    "type": "api",
    "categoryKey": "be-ops",
    "categoryName": "\u8FD0\u7EF4\u76D1\u63A7\u4E0E\u53D1\u5E03\u95E8\u7981",
    "categoryEnName": "Operations & Progressive Release",
    "service": "Billing",
    "serviceDomain": "billing.svc.plus",
    "path": "/api/ping",
    "description": "Billing \u5FAE\u670D\u52A1\u6838\u5FC3\u7F51\u7EDC\u5F80\u8FD4\u65F6\u5EF6\u4E0E\u5FC3\u8DF3\u63A2\u9488",
    "method": "GET",
    "expectedHttp": 200,
    "observedHttp": 200,
    "latencyMs": 20,
    "freshnessSec": 8,
    "result": "PASS"
  }
];

// src/ProgressiveReleasePanel.tsx
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
  const [livePayload, setLivePayload] = (0, import_react.useState)(null);
  const [liveFetchStatus, setLiveFetchStatus] = (0, import_react.useState)("idle");
  const [lastFetchedAt, setLastFetchedAt] = (0, import_react.useState)(null);
  (0, import_react.useEffect)(() => {
    let isMounted = true;
    let timer = null;
    const fetchTelemetry = async () => {
      try {
        const targetEnv = resolvedEnv.toLowerCase().includes("sit") ? "SIT" : "PROD";
        const url = `https://console.svc.plus/api/operations/progressive-release?environment=${targetEnv}`;
        const res = await fetch(url, {
          headers: { Accept: "application/json" },
          mode: "cors"
        });
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json && Array.isArray(json.allRoutesAndApis)) {
            setLivePayload(json);
            setLiveFetchStatus("success");
            setLastFetchedAt(/* @__PURE__ */ new Date());
          }
        } else {
          if (isMounted) setLiveFetchStatus("error");
        }
      } catch (err) {
        if (isMounted) setLiveFetchStatus("error");
      }
    };
    fetchTelemetry();
    timer = setInterval(fetchTelemetry, 15e3);
    return () => {
      isMounted = false;
      if (timer) clearInterval(timer);
    };
  }, [resolvedEnv]);
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
      if (!useMockData && livePayload?.endpoints && Array.isArray(livePayload.endpoints) && livePayload.endpoints.length > 0) {
        const liveEp = {
          console: {},
          accounts: {},
          billing: {}
        };
        for (const ep of livePayload.endpoints) {
          const s = (ep.service || "").toLowerCase();
          if (liveEp[s]) {
            liveEp[s][ep.endpoint] = {
              service: s,
              route: ep.endpoint,
              status: ep.result === "PASS" ? "PASS" : ep.result === "FAIL" ? "FAIL" : "NO DATA",
              httpCode: ep.observedHttp != null ? ep.observedHttp : "\u2014",
              latencyMs: ep.p95LatencyMs != null ? ep.p95LatencyMs : "\u2014",
              freshnessSec: ep.freshnessSec || 8,
              expectedHttp: ep.expectedHttp || (ep.endpoint === "/panel/agent" ? 307 : 200)
            };
          }
        }
        return { isLive: true, endpoints: liveEp };
      }
      if (useMockData || !data?.series || data.series.length === 0) {
        return { isLive: false, endpoints: mockEndpoints };
      }
      const liveEndpoints = {
        console: {},
        accounts: {},
        billing: {}
      };
      let foundAny = false;
      const getVal = (fld, idx) => {
        if (!fld || !fld.values) {
          return null;
        }
        const len = typeof fld.values.length === "number" ? fld.values.length : typeof fld.values.size === "number" ? fld.values.size : 0;
        if (len === 0) {
          return null;
        }
        const i = idx !== void 0 ? idx : len - 1;
        if (typeof fld.values.get === "function") {
          return fld.values.get(i);
        }
        return fld.values[i];
      };
      for (const frame of data.series) {
        if (!frame || !frame.fields || frame.fields.length === 0) {
          continue;
        }
        const sField = frame.fields.find((f) => f.name === "service" || f.labels && f.labels.service);
        const rField = frame.fields.find((f) => f.name === "route" || f.labels && f.labels.route);
        const valField = frame.fields.find(
          (f) => f.name === "Value" || f.type === "number" || f.labels && Object.keys(f.labels).length > 0
        );
        const timeField = frame.fields.find((f) => f.type === "time" || f.name === "Time");
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
                status: "NO DATA",
                httpCode: "\u2014",
                latencyMs: "\u2014",
                freshnessSec: 10,
                expectedHttp: r === "/panel/agent" ? 307 : 200
              };
            }
            const val = getVal(valField, row);
            const metricName = valField && valField.name || frame.name || "";
            const refId = frame.refId;
            if (refId === "A" || metricName.includes("probe_success") || !metricName) {
              const numVal = Number(val);
              if (numVal === 1) {
                liveEndpoints[s][r].status = "PASS";
              } else if (numVal === 0) {
                liveEndpoints[s][r].status = "FAIL";
              }
            } else if (refId === "B" || metricName.includes("status_code") || metricName.includes("http")) {
              liveEndpoints[s][r].httpCode = val != null ? Number(val) : "\u2014";
            } else if (refId === "C" || metricName.includes("duration") || metricName.includes("latency")) {
              const numVal = Number(val);
              liveEndpoints[s][r].latencyMs = !isNaN(numVal) ? Math.round(numVal * 1e3) : "\u2014";
            }
            if (timeField) {
              const sampleTime = getVal(timeField, row);
              if (sampleTime) {
                const tMs = Number(sampleTime) > 1e11 ? Number(sampleTime) : Number(sampleTime) * 1e3;
                const ageSec = Math.max(1, Math.round((Date.now() - tMs) / 1e3));
                if (ageSec < 3600) {
                  liveEndpoints[s][r].freshnessSec = ageSec;
                }
              }
            }
          }
        } else {
          const labels = frame.labels || valField && valField.labels || {};
          let s = (labels.service || "").toLowerCase();
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
              status: "NO DATA",
              httpCode: "\u2014",
              latencyMs: "\u2014",
              freshnessSec: 10,
              expectedHttp: r === "/panel/agent" ? 307 : 200
            };
          }
          const val = getVal(valField);
          const metricName = labels.__name__ || frame.name || valField && valField.name || "";
          const refId = frame.refId;
          if (refId === "A" || metricName.includes("probe_success") || !metricName) {
            const numVal = Number(val);
            if (numVal === 1) {
              liveEndpoints[s][r].status = "PASS";
            } else if (numVal === 0) {
              liveEndpoints[s][r].status = "FAIL";
            }
          } else if (refId === "B" || metricName.includes("status_code") || metricName.includes("http")) {
            liveEndpoints[s][r].httpCode = val != null ? Number(val) : "\u2014";
          } else if (refId === "C" || metricName.includes("duration") || metricName.includes("latency")) {
            const numVal = Number(val);
            liveEndpoints[s][r].latencyMs = !isNaN(numVal) ? Math.round(numVal * 1e3) : "\u2014";
          }
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
  }, [data, useMockData, livePayload]);
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
    if (!useMockData && livePayload?.flaggerServices && Array.isArray(livePayload.flaggerServices) && livePayload.flaggerServices.length > 0) {
      return livePayload.flaggerServices.map((fs) => {
        const isNotConfigured = fs.phase === "Not configured" || fs.weight === null && fs.phase !== "Succeeded";
        const candidateTrafficPct = isNotConfigured ? 0 : fs.candidateTrafficPct ?? fs.weight ?? 0;
        const primaryTrafficPct = isNotConfigured ? 100 : fs.primaryTrafficPct ?? 100 - candidateTrafficPct;
        return {
          service: fs.service,
          subdomain: fs.serviceDomain || (fs.service === "Console" ? "console.svc.plus" : fs.service === "Accounts" ? "accounts.svc.plus" : "billing.svc.plus"),
          phase: isNotConfigured ? "Not configured" : fs.phase,
          weight: isNotConfigured ? null : fs.weight ?? candidateTrafficPct,
          primaryPercent: primaryTrafficPct,
          candidatePercent: candidateTrafficPct,
          message: isNotConfigured ? fs.message || "No canary configured for this service" : void 0
        };
      });
    }
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
        if (name.includes("console")) targetKey = "console";
        else if (name.includes("accounts")) targetKey = "accounts";
        else if (name.includes("billing")) targetKey = "billing";
        if (!targetKey || !baseMap[targetKey]) continue;
        const getVal = (fld) => {
          if (!fld || !fld.values) return null;
          const len = typeof fld.values.length === "number" ? fld.values.length : 0;
          if (len === 0) return null;
          if (typeof fld.values.get === "function") return fld.values.get(len - 1);
          return fld.values[len - 1];
        };
        const val = getVal(field);
        if (metricName.includes("flagger_canary_status")) {
          const num = Number(val);
          if (num === 0) {
            baseMap[targetKey].phase = "Progressing";
            baseMap[targetKey].weight = baseMap[targetKey].weight ?? 10;
            baseMap[targetKey].message = void 0;
          } else if (num === 1) {
            baseMap[targetKey].phase = "Succeeded";
            baseMap[targetKey].candidatePercent = 0;
            baseMap[targetKey].primaryPercent = 100;
            baseMap[targetKey].weight = 0;
            baseMap[targetKey].message = void 0;
          } else if (num === 2) {
            baseMap[targetKey].phase = "Failed";
            baseMap[targetKey].weight = 0;
            baseMap[targetKey].message = void 0;
          }
        } else if (metricName.includes("flagger_canary_weight")) {
          if (!name.includes("primary")) {
            const w = Math.max(0, Math.min(100, Number(val)));
            if (!isNaN(w) && w > 0) {
              baseMap[targetKey].weight = w;
              baseMap[targetKey].candidatePercent = w;
              baseMap[targetKey].primaryPercent = 100 - w;
              baseMap[targetKey].phase = "Progressing";
              baseMap[targetKey].message = void 0;
            }
          }
        }
      }
    }
    return [baseMap.console, baseMap.accounts, baseMap.billing];
  }, [resolvedEnv, data, livePayload, useMockData]);
  const [isRoutesCollapsed, setIsRoutesCollapsed] = (0, import_react.useState)(false);
  const [routesFilter, setRoutesFilter] = (0, import_react.useState)("all");
  const [routesSearchQuery, setRoutesSearchQuery] = (0, import_react.useState)("");
  const fullRoutesAndApis = (0, import_react.useMemo)(() => {
    if (!useMockData && livePayload?.allRoutesAndApis && Array.isArray(livePayload.allRoutesAndApis) && livePayload.allRoutesAndApis.length > 0) {
      return livePayload.allRoutesAndApis.map((item) => ({
        id: item.id,
        order: item.order,
        type: item.type,
        categoryKey: item.categoryKey,
        categoryName: item.categoryName,
        categoryEnName: item.categoryEnName,
        service: item.service,
        serviceDomain: item.serviceDomain,
        path: item.path,
        description: item.description,
        method: item.method,
        expectedHttp: item.expectedHttp,
        observedHttp: item.observedHttp,
        latencyMs: item.latencyMs,
        freshnessSec: item.freshnessSec,
        status: item.result === "PASS" ? "PASS" : "FAIL"
      }));
    }
    return RAW_ROUTES_CATALOG.map((item) => {
      const svc = item.service.toLowerCase();
      const epData = endpoints?.[svc]?.[item.path];
      let observedHttp = item.expectedHttp;
      let latencyMs = resolvedEnv.includes("PROD") ? Math.max(10, Math.round(item.latencyMs * 0.85)) : item.latencyMs;
      let freshnessSec = 8;
      let status = "PASS";
      if (epData) {
        if (epData.httpCode !== "\u2014" && epData.httpCode !== null && epData.httpCode !== void 0) {
          observedHttp = Number(epData.httpCode);
        }
        if (epData.latencyMs !== "\u2014" && epData.latencyMs !== null && epData.latencyMs !== void 0) {
          latencyMs = epData.latencyMs;
        }
        if (epData.freshnessSec) {
          freshnessSec = epData.freshnessSec;
        }
        if (epData.status === "FAIL") {
          status = "FAIL";
        }
      }
      return {
        id: item.id,
        order: item.order,
        type: item.type,
        categoryKey: item.categoryKey,
        categoryName: item.categoryName,
        categoryEnName: item.categoryEnName,
        service: item.service,
        serviceDomain: item.serviceDomain,
        path: item.path,
        description: item.description,
        method: item.method,
        expectedHttp: item.expectedHttp,
        observedHttp,
        latencyMs,
        freshnessSec,
        status
      };
    });
  }, [endpoints, resolvedEnv, livePayload, useMockData]);
  const [expandedRoots, setExpandedRoots] = (0, import_react.useState)({
    frontend: true,
    api: true
  });
  const [expandedCategories, setExpandedCategories] = (0, import_react.useState)({});
  const toggleRoot = (type) => {
    setExpandedRoots((prev) => ({ ...prev, [type]: !prev[type] }));
  };
  const toggleCategory = (key) => {
    setExpandedCategories((prev) => ({ ...prev, [key]: prev[key] === false ? true : false }));
  };
  const treeData = (0, import_react.useMemo)(() => {
    const list = fullRoutesAndApis;
    const filterItem = (item) => {
      if (routesFilter === "frontend" && item.type !== "frontend") return false;
      if (routesFilter === "api" && item.type !== "api") return false;
      if (routesSearchQuery.trim()) {
        const q = routesSearchQuery.toLowerCase().trim();
        return item.path.toLowerCase().includes(q) || item.description.toLowerCase().includes(q) || item.service.toLowerCase().includes(q) || item.serviceDomain.toLowerCase().includes(q) || (item.categoryName || "").toLowerCase().includes(q) || (item.categoryEnName || "").toLowerCase().includes(q) || (item.method || "").toLowerCase().includes(q);
      }
      return true;
    };
    const feItems = list.filter((i) => i.type === "frontend" && filterItem(i));
    const beItems = list.filter((i) => i.type === "api" && filterItem(i));
    const groupByCategory = (items, rootType) => {
      const map = /* @__PURE__ */ new Map();
      for (const item of items) {
        const key = item.categoryKey || (rootType === "frontend" ? "fe-other" : "be-other");
        const name = item.categoryName || key;
        const enName = item.categoryEnName || key;
        if (!map.has(key)) {
          map.set(key, { key, name, enName, items: [] });
        }
        map.get(key).items.push(item);
      }
      const groups = [];
      map.forEach((entry) => {
        const passCount = entry.items.filter((i) => i.status === "PASS").length;
        const failCount = entry.items.filter((i) => i.status === "FAIL").length;
        groups.push({
          key: entry.key,
          name: entry.name,
          enName: entry.enName,
          type: rootType,
          items: entry.items,
          totalCount: entry.items.length,
          passCount,
          failCount
        });
      });
      return groups;
    };
    const roots = [];
    if (routesFilter === "all" || routesFilter === "frontend") {
      roots.push({
        type: "frontend",
        title: "\u524D\u7AEF\u9875\u9762\u8DEF\u7531 (Frontend Pages & Routes)",
        enTitle: "Frontend Web Console Pages",
        categories: groupByCategory(feItems, "frontend"),
        totalCount: feItems.length,
        passCount: feItems.filter((i) => i.status === "PASS").length,
        failCount: feItems.filter((i) => i.status === "FAIL").length
      });
    }
    if (routesFilter === "all" || routesFilter === "api") {
      roots.push({
        type: "api",
        title: "\u540E\u7AEF\u670D\u52A1\u4E0E\u5FAE\u670D\u52A1 API (Backend Services & APIs)",
        enTitle: "Backend Microservices & Gateway Endpoints",
        categories: groupByCategory(beItems, "api"),
        totalCount: beItems.length,
        passCount: beItems.filter((i) => i.status === "PASS").length,
        failCount: beItems.filter((i) => i.status === "FAIL").length
      });
    }
    return roots;
  }, [fullRoutesAndApis, routesFilter, routesSearchQuery]);
  const handleExpandAll = () => {
    setExpandedRoots({ frontend: true, api: true });
    const next = {};
    for (const root of treeData) {
      for (const cat of root.categories) {
        next[cat.key] = true;
      }
    }
    setExpandedCategories(next);
  };
  const handleCollapseAll = () => {
    setExpandedRoots({ frontend: false, api: false });
    const next = {};
    for (const root of treeData) {
      for (const cat of root.categories) {
        next[cat.key] = false;
      }
    }
    setExpandedCategories(next);
  };
  const candidateSampleInfo = (0, import_react.useMemo)(() => {
    if (!useMockData && livePayload?.candidateSample?.requestsCount != null) {
      return {
        countStr: `${Number(livePayload.candidateSample.requestsCount).toLocaleString()} requests`,
        summary: livePayload.candidateSample.summary || "(sufficient, \u2265 10,000)"
      };
    }
    return {
      countStr: resolvedEnv === "PROD" ? "34,862 requests" : "12,450 requests",
      summary: "(sufficient, \u2265 10,000)"
    };
  }, [livePayload, resolvedEnv, useMockData]);
  const gateInfo = (0, import_react.useMemo)(() => {
    if (!useMockData && livePayload?.gateStatus) {
      return {
        isBlocked: livePayload.gateStatus.status === "BLOCKED",
        summary: livePayload.gateStatus.summary || (failedCount > 0 ? `${failedCount} / 10 checks failed` : "10 / 10 checks passed")
      };
    }
    return {
      isBlocked: failedCount > 0,
      summary: failedCount > 0 ? `${failedCount} / 10 checks failed` : "10 / 10 checks passed"
    };
  }, [livePayload, failedCount, useMockData]);
  const feCount = (0, import_react.useMemo)(() => fullRoutesAndApis.filter((i) => i.type === "frontend").length, [fullRoutesAndApis]);
  const beCount = (0, import_react.useMemo)(() => fullRoutesAndApis.filter((i) => i.type === "api").length, [fullRoutesAndApis]);
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
        height: height ? `${height}px` : "100%",
        maxHeight: height ? `${height}px` : "100%",
        background: "#0d0f15",
        color: "#f3f4f6",
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        padding: "16px 20px",
        boxSizing: "border-box",
        overflowY: "auto",
        overflowX: "hidden"
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
            border: `2px solid ${gateInfo.isBlocked ? "#ef4444" : "#22c55e"}`,
            borderRadius: "50%",
            width: "28px",
            height: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            fontWeight: 900,
            color: gateInfo.isBlocked ? "#ef4444" : "#22c55e"
          }
        },
        gateInfo.isBlocked ? "\u2715" : "\u2713"
      ),
      /* @__PURE__ */ import_react.default.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { color: "#8b949e", fontSize: "12px", fontWeight: 500 } }, "Release gate (overall)"), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginTop: "3px" } }, /* @__PURE__ */ import_react.default.createElement(
        "span",
        {
          style: {
            background: gateInfo.isBlocked ? "#dc2626" : "#16a34a",
            color: "#ffffff",
            fontSize: "11px",
            fontWeight: 800,
            padding: "2px 8px",
            borderRadius: "4px",
            letterSpacing: "0.5px"
          }
        },
        gateInfo.isBlocked ? "BLOCKED" : "PASSED"
      ), /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#d1d5db", fontSize: "13px", fontWeight: 500 } }, gateInfo.summary)))
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
        const isNotConfigured = fs.phase === "Not configured" || fs.weight === null;
        const isSucceeded = fs.phase === "Succeeded";
        const isProgressing = fs.phase === "Progressing";
        const phaseBg = isNotConfigured ? "#1f2430" : isSucceeded ? "#064e3b" : isProgressing ? "#1e3a8a" : "#450a0a";
        const phaseBorder = isNotConfigured ? "#374151" : isSucceeded ? "#059669" : isProgressing ? "#2563eb" : "#991b1b";
        const phaseColor = isNotConfigured ? "#9ca3af" : isSucceeded ? "#6ee7b7" : isProgressing ? "#93c5fd" : "#fca5a5";
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
        )), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "10px 12px", color: "#ffffff", fontSize: "13px", fontWeight: 700 } }, isNotConfigured ? "\u2014" : `${fs.weight}%`), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "10px 12px" } }, isNotConfigured ? /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: "6px", color: "#9ca3af", fontSize: "12px" } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#6b7280", fontSize: "13px" } }, "\u24D8"), /* @__PURE__ */ import_react.default.createElement("span", null, fs.message || "No canary configured for this service")) : /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: "10px" } }, /* @__PURE__ */ import_react.default.createElement(
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
      /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("div", { style: { color: "#ffffff", fontSize: "13px", fontWeight: 600 } }, "Candidate sample: ", candidateSampleInfo.countStr), /* @__PURE__ */ import_react.default.createElement("div", { style: { color: "#22c55e", fontSize: "11px", fontWeight: 600, marginTop: "1px" } }, candidateSampleInfo.summary))
    )),
    showRoutesTable !== false && /* @__PURE__ */ import_react.default.createElement(
      "div",
      {
        style: {
          background: "#141824",
          border: "1px solid #232838",
          borderRadius: "10px",
          marginTop: "16px",
          overflow: "hidden"
        }
      },
      /* @__PURE__ */ import_react.default.createElement(
        "div",
        {
          onClick: () => setIsRoutesCollapsed(!isRoutesCollapsed),
          style: {
            padding: "12px 16px",
            background: "#1a1f30",
            borderBottom: isRoutesCollapsed ? "none" : "1px solid #232838",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            userSelect: "none",
            flexWrap: "wrap",
            gap: "8px"
          }
        },
        /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px" } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: "12px", color: "#8b949e" } }, isRoutesCollapsed ? "\u25B6" : "\u25BC"), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#ffffff", fontSize: "13px", fontWeight: 700 } }, "\u5168\u91CF\u8DEF\u7531\u4E0E\u540E\u7AEF\u670D\u52A1 API \u6E05\u5355"), /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#8b949e", fontSize: "11px", marginLeft: "6px" } }, "(Collapsible Routes & APIs Matrix \u2022 \u524D\u7AEF / \u540E\u7AEF / \u5927\u7C7B / \u5B50\u7EC4\u4EF6\u4E09\u7EA7\u6811\u72B6\u5C55\u793A)"))),
        /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }, onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ import_react.default.createElement(
          "span",
          {
            style: {
              background: liveFetchStatus === "success" || parsedData.isLive ? "rgba(34, 197, 94, 0.15)" : "rgba(59, 130, 246, 0.15)",
              color: liveFetchStatus === "success" || parsedData.isLive ? "#4ade80" : "#60a5fa",
              border: `1px solid ${liveFetchStatus === "success" || parsedData.isLive ? "rgba(34, 197, 94, 0.3)" : "rgba(59, 130, 246, 0.3)"}`,
              padding: "2px 8px",
              borderRadius: "12px",
              fontSize: "11px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }
          },
          /* @__PURE__ */ import_react.default.createElement("span", { style: { width: "6px", height: "6px", borderRadius: "50%", background: liveFetchStatus === "success" || parsedData.isLive ? "#22c55e" : "#3b82f6" } }),
          liveFetchStatus === "success" || parsedData.isLive ? "Live Telemetry Dynamic" : "Catalog Synchronized"
        ), /* @__PURE__ */ import_react.default.createElement(
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
          "\u{1F310} ",
          feCount,
          " \u524D\u7AEF\u8DEF\u7531 (7 \u5927\u7C7B)"
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
          "\u2699 ",
          beCount,
          " \u540E\u7AEF\u63A5\u53E3 (8 \u5927\u7C7B)"
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
            marginBottom: "14px",
            gap: "12px",
            flexWrap: "wrap"
          }
        },
        /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" } }, /* @__PURE__ */ import_react.default.createElement(
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
            "\u5168\u90E8 (",
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
            "\u{1F310} \u524D\u7AEF (",
            feCount,
            ")"
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
            "\u2699 \u540E\u7AEF (",
            beCount,
            ")"
          )
        ), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", gap: "4px" } }, /* @__PURE__ */ import_react.default.createElement(
          "button",
          {
            type: "button",
            onClick: handleExpandAll,
            style: {
              background: "#1e2433",
              color: "#cbd5e1",
              border: "1px solid #2b3548",
              borderRadius: "4px",
              padding: "3px 8px",
              fontSize: "11px",
              cursor: "pointer"
            }
          },
          "\u5C55\u5F00\u5168\u90E8"
        ), /* @__PURE__ */ import_react.default.createElement(
          "button",
          {
            type: "button",
            onClick: handleCollapseAll,
            style: {
              background: "#1e2433",
              color: "#cbd5e1",
              border: "1px solid #2b3548",
              borderRadius: "4px",
              padding: "3px 8px",
              fontSize: "11px",
              cursor: "pointer"
            }
          },
          "\u6298\u53E0\u5168\u90E8"
        ))),
        /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement(
          "input",
          {
            type: "text",
            value: routesSearchQuery,
            onChange: (e) => setRoutesSearchQuery(e.target.value),
            placeholder: "\u6309\u8DEF\u5F84\u3001\u5927\u7C7B\u3001\u670D\u52A1\u6216\u63CF\u8FF0\u641C\u7D22...",
            style: {
              background: "#0d0f15",
              border: "1px solid #232838",
              borderRadius: "6px",
              color: "#ffffff",
              fontSize: "11px",
              padding: "4px 10px",
              outline: "none",
              minWidth: "220px"
            }
          }
        ))
      ), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "14px" } }, treeData.map((root) => {
        const isRootExpanded = routesSearchQuery.trim().length > 0 || expandedRoots[root.type] !== false;
        const isFe = root.type === "frontend";
        return /* @__PURE__ */ import_react.default.createElement(
          "div",
          {
            key: root.type,
            style: {
              background: "#0e121d",
              border: "1px solid #1f2738",
              borderRadius: "8px",
              overflow: "hidden"
            }
          },
          /* @__PURE__ */ import_react.default.createElement(
            "div",
            {
              onClick: () => toggleRoot(root.type),
              style: {
                padding: "10px 14px",
                background: isFe ? "rgba(30, 58, 138, 0.25)" : "rgba(76, 29, 149, 0.25)",
                borderBottom: isRootExpanded ? "1px solid #1f2738" : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                userSelect: "none"
              }
            },
            /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px" } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: "11px", color: isFe ? "#93c5fd" : "#c4b5fd" } }, isRootExpanded ? "\u25BC" : "\u25B6"), /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: "14px" } }, isFe ? "\u{1F310}" : "\u2699"), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#ffffff", fontSize: "12px", fontWeight: 700 } }, root.title), /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#8b949e", fontSize: "10px", marginLeft: "6px", fontFamily: "monospace" } }, root.enTitle))),
            /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: "6px" }, onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ import_react.default.createElement(
              "span",
              {
                style: {
                  background: "#1a1f30",
                  color: "#94a3b8",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "10px"
                }
              },
              root.categories.length,
              " \u4E2A\u5927\u7C7B"
            ), /* @__PURE__ */ import_react.default.createElement(
              "span",
              {
                style: {
                  background: "#1a1f30",
                  color: "#94a3b8",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "10px",
                  fontFamily: "monospace"
                }
              },
              root.totalCount,
              " \u9879"
            ), /* @__PURE__ */ import_react.default.createElement(
              "span",
              {
                style: {
                  background: root.failCount === 0 ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)",
                  color: root.failCount === 0 ? "#4ade80" : "#f87171",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "10px",
                  fontWeight: 600
                }
              },
              root.passCount,
              "/",
              root.totalCount,
              " PASS"
            ))
          ),
          isRootExpanded && /* @__PURE__ */ import_react.default.createElement("div", { style: { padding: "10px", display: "flex", flexDirection: "column", gap: "10px" } }, root.categories.map((cat) => {
            const isCatExpanded = routesSearchQuery.trim().length > 0 || expandedCategories[cat.key] !== false;
            return /* @__PURE__ */ import_react.default.createElement(
              "div",
              {
                key: cat.key,
                style: {
                  background: "#141824",
                  border: "1px solid #232838",
                  borderRadius: "6px",
                  overflow: "hidden"
                }
              },
              /* @__PURE__ */ import_react.default.createElement(
                "div",
                {
                  onClick: () => toggleCategory(cat.key),
                  style: {
                    padding: "8px 12px",
                    background: "#191f2e",
                    borderBottom: isCatExpanded ? "1px solid #232838" : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    userSelect: "none"
                  }
                },
                /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: "6px" } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: "10px", color: "#8b949e" } }, isCatExpanded ? "\u25BC" : "\u25B6"), /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#ffffff", fontSize: "12px", fontWeight: 600 } }, cat.name), /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#8b949e", fontSize: "10px" } }, cat.enName), /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#64748b", fontSize: "10px", fontFamily: "monospace" } }, "(", cat.key, ")")),
                /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: "6px" }, onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#94a3b8", fontSize: "10px", fontFamily: "monospace" } }, cat.totalCount, " \u9879"), /* @__PURE__ */ import_react.default.createElement(
                  "span",
                  {
                    style: {
                      background: cat.failCount === 0 ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                      color: cat.failCount === 0 ? "#4ade80" : "#f87171",
                      padding: "1px 5px",
                      borderRadius: "3px",
                      fontSize: "10px",
                      fontWeight: 600
                    }
                  },
                  cat.passCount,
                  "/",
                  cat.totalCount,
                  " PASS"
                ))
              ),
              isCatExpanded && /* @__PURE__ */ import_react.default.createElement("div", { style: { overflowX: "auto" } }, /* @__PURE__ */ import_react.default.createElement("table", { style: { width: "100%", borderCollapse: "collapse", textAlign: "left" } }, /* @__PURE__ */ import_react.default.createElement("thead", null, /* @__PURE__ */ import_react.default.createElement("tr", { style: { borderBottom: "1px solid #1f2738", background: "#10141f" } }, /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "6px 8px", color: "#8b949e", fontSize: "10px", fontWeight: 600, width: "28px" } }, "#"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "6px 8px", color: "#8b949e", fontSize: "10px", fontWeight: 600, width: "60px" } }, "Method"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "6px 8px", color: "#8b949e", fontSize: "10px", fontWeight: 600, width: "200px" } }, "Path / Route"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "6px 8px", color: "#8b949e", fontSize: "10px", fontWeight: 600, width: "90px" } }, "Service"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "6px 8px", color: "#8b949e", fontSize: "10px", fontWeight: 600 } }, "Description"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "6px 8px", color: "#8b949e", fontSize: "10px", fontWeight: 600, width: "60px" } }, "Expected"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "6px 8px", color: "#8b949e", fontSize: "10px", fontWeight: 600, width: "60px" } }, "Observed"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "6px 8px", color: "#8b949e", fontSize: "10px", fontWeight: 600, width: "80px" } }, "Latency"), /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "6px 8px", color: "#8b949e", fontSize: "10px", fontWeight: 600, width: "60px" } }, "Result"))), /* @__PURE__ */ import_react.default.createElement("tbody", null, cat.items.map((item, idx) => {
                const isPass = item.status === "PASS";
                const m = (item.method || "GET").split(",")[0].trim().toUpperCase();
                const methodColor = m === "GET" ? "#38bdf8" : m === "POST" ? "#4ade80" : m === "PUT" ? "#fbbf24" : "#f87171";
                const methodBg = m === "GET" ? "rgba(56, 189, 248, 0.15)" : m === "POST" ? "rgba(74, 222, 128, 0.15)" : m === "PUT" ? "rgba(251, 191, 36, 0.15)" : "rgba(248, 113, 113, 0.15)";
                return /* @__PURE__ */ import_react.default.createElement(
                  "tr",
                  {
                    key: item.id,
                    style: {
                      borderBottom: idx < cat.items.length - 1 ? "1px solid #191f2e" : "none"
                    }
                  },
                  /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "6px 8px", color: "#64748b", fontSize: "10px", fontFamily: "monospace" } }, idx + 1),
                  /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "6px 8px" } }, /* @__PURE__ */ import_react.default.createElement(
                    "span",
                    {
                      style: {
                        background: methodBg,
                        color: methodColor,
                        fontSize: "9px",
                        fontWeight: 700,
                        padding: "2px 5px",
                        borderRadius: "3px",
                        fontFamily: "monospace"
                      }
                    },
                    item.method
                  )),
                  /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "6px 8px", color: "#ffffff", fontSize: "11px", fontFamily: "monospace", fontWeight: 600 } }, item.path),
                  /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "6px 8px" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { color: "#ffffff", fontSize: "11px", fontWeight: 600 } }, item.service), /* @__PURE__ */ import_react.default.createElement("div", { style: { color: "#8b949e", fontSize: "9px", fontFamily: "monospace" } }, item.serviceDomain)),
                  /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "6px 8px", color: "#cbd5e1", fontSize: "11px" } }, item.description),
                  /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "6px 8px", color: "#94a3b8", fontSize: "11px", fontFamily: "monospace" } }, item.expectedHttp),
                  /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "6px 8px" } }, /* @__PURE__ */ import_react.default.createElement(
                    "span",
                    {
                      style: {
                        background: item.observedHttp === item.expectedHttp ? "#15803d" : "#b91c1c",
                        color: "#ffffff",
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "1px 5px",
                        borderRadius: "3px",
                        fontFamily: "monospace"
                      }
                    },
                    item.observedHttp
                  )),
                  /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "6px 8px", color: "#cbd5e1", fontSize: "10px", fontFamily: "monospace" } }, item.latencyMs, " ms", /* @__PURE__ */ import_react.default.createElement("span", { style: { display: "block", color: "#64748b", fontSize: "9px" } }, item.freshnessSec || 8, "s ago")),
                  /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "6px 8px" } }, /* @__PURE__ */ import_react.default.createElement(
                    "span",
                    {
                      style: {
                        color: isPass ? "#22c55e" : "#ef4444",
                        fontSize: "10px",
                        fontWeight: 700
                      }
                    },
                    isPass ? "\u2714 PASS" : "\u2716 FAIL"
                  ))
                );
              }))))
            );
          }))
        );
      })))
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
