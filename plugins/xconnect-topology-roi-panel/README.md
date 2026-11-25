# XConnect Topology & Dynamic ROI Panel (`xconnect-topology-roi-panel`)

Grafana custom panel plugin converting `xconnect-core-topology.html` and the 3 empirical `jp-xconnect-02.svc.plus` capacity & ROI charts into an interactive, dynamic Grafana dashboard panel.

## Included Dynamic Views

1. **① XConnect 五大核心服务动态链路拓扑 (`topology`)**:
   - Interactive layer filter (`全部链路` / `控制面链路` / `Proxy 数据链路` / `Gateway 链路` / `监控与计费链路`).
   - Live/simulated RSS badges on all 5 core services (`xconnect-edge-agent`, `fluxgate`, `xconnect-proxy-xray`, `xconnect-gateway-xray`, `vector`) and supporting probes (`systemd-journald`, `node_exporter`, `process-exporter`).
   - Clickable service inspection drawer displaying Playbook Role, binary path, sockets, and dynamic memory/traffic footprint.

2. **② 40 VU × 30m vs 500 VU × 30m k6 动态时序对比 (`timeseries`)**:
   - Dynamic SVG rendering of `k6-40vu-vs-500vu-timeseries.png` from 121 real 15s-binned datapoints (`1s` k6 sampling).
   - Interactive time scrubber (`0.0m – 30.0m`), hover crosshair, series toggles (`500 VU 实测` / `40 VU 实测` / `当前目标 VU 动态模拟包络线`), and phase annotations (`t≈10m 连接池重连 -> 206.2 req/s`).

3. **③ Little's Law 实测拐点与 939 MiB 内存缩放模型 (`knee_memory`)**:
   - Dynamic SVG rendering of `knee-and-memory-scaling.png`.
   - Interactive VU cursor (`10 – 500 VU`) tracking `QPS`, `Marginal Efficiency (QPS/VU)`, `Little's Law Implied Latency`, and node memory lines (`含 /tmp 75 MiB tmpfs` vs `清理 /tmp 后 +120 VU` vs `Proxy 仅进程 RSS`) against `75% / 80% / 100% OOM` ceilings.

4. **④ P95 延迟监控上限与 2C1G AWS Lightsail ($7/$10/$12) 动态 ROI 面板 (`slo_roi`)**:
   - Dynamic SVG rendering of `p95-slo-and-lightsail-roi.png`.
   - Real-time dynamic bar for current target VU alongside empirical P95 benchmarks and `P1 (800ms) / P2 (1500ms) / P3 (3000ms)` alert thresholds.
   - Interactive ROI curve and table across `$7/月`、`10/月`、`12/月` tiers and `3x / 4x / 5x` user thinking-time multipliers.

## Build & Test

```bash
npm test
npm run build
```
