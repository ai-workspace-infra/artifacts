# Progressive Release Matrix Panel (Grafana Custom Panel Plugin)

This plugin provides a high-fidelity visual dashboard panel for Grafana, implementing the **Progressive Release Validation** matrix design.

## Features

1. **Top KPI Cards**:
   - `Environment`: Displays PROD or SIT with cluster metadata.
   - `Observation window`: Calendar icon with active time range and UTC range formatting.
   - `Release gate (overall)`: Visual shield indicator with `BLOCKED` / `ALLOWED` badges and failed check counts.

2. **Service × Endpoint Status Matrix**:
   - Multi-service grouped table headers: `Console (console.svc.plus)`, `Accounts (accounts.svc.plus)`, `Billing`.
   - Micro-cards for probe results:
     - Green badge: `PASS`, observed HTTP code (e.g. `200`, `307`), and `p95 xx ms` latency.
     - Red badge: `FAIL`, observed HTTP code (e.g. `503`), and `p95 1,204 ms` latency.
     - Gray badge: `NO DATA`, placeholder latency `p95 —`.
     - Cross-service placeholder dashes (`—`).

3. **Flagger Progressive Release Section**:
   - Tracks Canary status (`Progressing`, `Succeeded`, `Not configured`).
   - Dual-color progress bars representing primary vs. candidate traffic weights.

4. **Top 10 Endpoint Details Wide Table**:
   - Complete probe inventory with GET endpoints, expected vs. observed HTTP codes, p95 latencies, freshness in seconds, and `✔ PASS` / `✖ FAIL` status.

5. **Footer Rules & Callouts**:
   - Gate rule callout banner with blocked criteria.
   - Candidate sample counter with threshold sufficiency status.

## Build and Package

```bash
node build.js
```

Outputs will be generated into the `dist/` folder:
- `dist/plugin.json`
- `dist/module.js`
- `dist/img/logo.svg`

## Installation in Grafana

1. Copy the `dist/` contents into your Grafana plugins directory:
   ```bash
   cp -r dist /var/lib/grafana/plugins/progressive-release-matrix-panel
   ```
2. Enable unsigned plugin loading via environment variable:
   ```bash
   GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS=progressive-release-matrix-panel
   ```
3. Restart Grafana to load the plugin.

## Collapsible Routes & APIs Matrix (dynamic inventory)

Aligned with the Web Console ops board: Service × Endpoint core matrix → Flagger weight matrix → three-level asset tree
(`前端 / 后端` → `大类 / 子组件` → route or API rows) with expand/collapse all, search and type filter.

Data contract (`src/dataModel.ts`):

- **Inventory** = optional console BFF payload (`allRoutesAndApis`, option *Inventory / telemetry URL*) or, if empty, the static `routesCatalog.ts`. Deduplicated by service/method/path; all totals and category counts are computed, never hardcoded.
- **Telemetry** is merged separately. No sample → `NO DATA` (never PASS). Unsafe methods (POST/PUT/DELETE), side-effect flows (logout, unsubscribe) and dynamic templates → `NOT PROBED`; the plugin itself never sends requests to inventory assets.
- `—` = not applicable cell; `NO DATA` = no valid observation; `FAIL` / `PASS` only from telemetry.
- **Mock** (*Force Design Mock Data*) is labelled and the gate shows `PREVIEW`; it can never produce `ALLOWED`. Missing core checks give `UNKNOWN`.
- **Latency**: BFF `p95LatencyMs` is labelled p95; Prometheus `probe_duration_seconds` is shown as last-sample duration, not p95.
- **Candidate samples** require a real request counter from the BFF; otherwise `NO DATA` (no `increase(probe_success)`).
- **Flagger**: `Not configured` only when explicitly reported; missing telemetry is `Unknown`; `Succeeded 0%` only with an actual weight.

Run `npm test` for the data-model tests.
