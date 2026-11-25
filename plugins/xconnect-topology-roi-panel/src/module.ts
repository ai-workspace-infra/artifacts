import { PanelPlugin } from '@grafana/data';
import { PanelOptions } from './types';
import { XConnectTopologyRoiPanel } from './XConnectTopologyRoiPanel';

export const plugin = new PanelPlugin<PanelOptions>(XConnectTopologyRoiPanel).setPanelOptions((builder) => {
  builder
    .addRadio({
      path: 'viewMode',
      name: '默认视图模式 (View Mode)',
      description: '选择展示全景综合面板或单独放大某一视图（拓扑 / k6 时序 / 拐点与内存 / P95 & Lightsail ROI）',
      defaultValue: 'all',
      settings: {
        options: [
          { value: 'all', label: '全景综合视图 (All 4 Panels)' },
          { value: 'topology', label: '① 五大核心链路拓扑 (Topology)' },
          { value: 'timeseries', label: '② 40 vs 500 VU 时序 (Timeseries)' },
          { value: 'knee_memory', label: '③ 拐点与内存缩放 (Knee & RAM)' },
          { value: 'slo_roi', label: '④ P95 SLO 与 ROI (SLO & ROI)' },
        ],
      },
    })
    .addRadio({
      path: 'defaultLayer',
      name: '拓扑默认高亮层 (Default Topology Layer)',
      defaultValue: 'all',
      settings: {
        options: [
          { value: 'all', label: '全部链路' },
          { value: 'control', label: '控制面链路' },
          { value: 'proxy', label: 'Proxy 数据链路' },
          { value: 'gateway', label: 'Gateway 链路' },
          { value: 'obs', label: '监控与计费链路' },
        ],
      },
    })
    .addNumberInput({
      path: 'defaultTargetVu',
      name: '默认目标并发水位 (Target VUs)',
      description: '动态 ROI 与内存/延迟仿真器的初始并发 VU 值（10 - 500，最佳甜点 120 VU）',
      defaultValue: 120,
      settings: {
        min: 10,
        max: 500,
        step: 10,
      },
    })
    .addRadio({
      path: 'defaultUserMultiplier',
      name: '在线用户思考时间复用系数 (User Multiplier)',
      description: '1 个活跃压测 VU 折算的真实在线用户数（默认 4x）',
      defaultValue: 4,
      settings: {
        options: [
          { value: 3, label: '3x (高频交互)' },
          { value: 4, label: '4x (标准基准)' },
          { value: 5, label: '5x (轻量浏览)' },
        ],
      },
    })
    .addRadio({
      path: 'defaultTierPrice',
      name: 'AWS Lightsail 2C1G 套餐基准价 ($/月)',
      defaultValue: 7,
      settings: {
        options: [
          { value: 7, label: '$7/月 (2C1G IPv4 标准档)' },
          { value: 10, label: '$10/月 (对照档)' },
          { value: 12, label: '$12/月 (对照档)' },
        ],
      },
    })
    .addBooleanSwitch({
      path: 'cleanTmpfs',
      name: '启用 /tmp 75 MiB tmpfs 清理后内存基线',
      description: '开启后非代理固定开销从 451.7 MiB 降至 376.7 MiB（可多抗 +120 VU）',
      defaultValue: true,
    })
    .addBooleanSwitch({
      path: 'vectorOptimized',
      name: '启用 Vector jemalloc THP 瘦身基线 (71.5 MiB)',
      description: '开启后展示 Vector 0.41.1 THP=never 优化后 71.5 MiB（关闭则对比优化前 124.1 MiB）',
      defaultValue: true,
    })
    .addBooleanSwitch({
      path: 'followLiveVu',
      name: '自动跟随 Prometheus 实时活跃连接/VU',
      description: '当面板查询返回 fluxgate_active_connections 或 k6_vus 时自动同步并发滑块',
      defaultValue: false,
    })
    .addTextInput({
      path: 'nodeHostname',
      name: '目标边缘节点名称',
      defaultValue: 'jp-xconnect-02.svc.plus',
    })
    .addNumberInput({
      path: 'totalRamMib',
      name: '节点物理内存上限 (MiB)',
      defaultValue: 939,
    });
});
