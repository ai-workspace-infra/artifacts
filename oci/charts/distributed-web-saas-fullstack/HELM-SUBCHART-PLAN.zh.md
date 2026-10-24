# Distributed Web SaaS Helm 主 Chart 与子 Chart 规划

日期：2026-10-24
状态：已落实 Chart 0.2.0 模板与离线验证；真实 Kubernetes 部署、数据迁移和业务验收均为 NOT_RUN。

## 目标

将 Console、Accounts、Billing、PostgreSQL、Content、Caddy 和数据库隧道包装为可单独维护版本的 Helm 子 Chart，由 `distributed-web-saas-fullstack` 作为统一 umbrella chart 组合发布。GitOps 固定 Chart 版本、镜像 digest 与非敏感运行参数；Flux 负责从 GitOps 声明协调应用。

本计划基于 artifacts `main` `049bc37` 和 GitOps `main` `f9d42a6`。当前 V5 仍使用 Docker Compose 与 Doco-CD；Helm/Kubernetes 是新部署目标，不是直接替换 V5 现有部署的操作步骤。

## 实施前 Chart 盘点（基于上述 main 采样）

- `distributed-web-saas-fullstack` 已有通用组件 Deployment/Service 模板、Ingress 及 PostgreSQL StatefulSet/PVC，但服务仍通过一个 `components` values 集合渲染，没有各服务独立的子 Chart。
- 旧 `web-saas` 目录虽含六个子 Chart 脚手架，但应用值仍有 `latest`/占位镜像；PostgreSQL 子 Chart 是通用 Deployment/HTTP Service，不具备数据库状态与持久化语义。不要把它直接作为生产数据库 Chart 发布。
- 当前 `release-oci-charts.yml` 的 lint/package/push 清单未包含 `web-saas` 或 `distributed-web-saas-fullstack`，新 Chart 即使存在也不会由当前发布工作流打包。
- 当前 V5 Compose 候选包含 Accounts、Billing、Console、Content、PostgreSQL、Caddy、stunnel client/server；Doco-CD 是单独的部署控制面。其持久数据、TLS/路由和秘密配置合同须先映射到 Kubernetes 对象，不能只按容器名搬迁。

## Serverless 前端与 Gateway 的 Kubernetes 组合

源 Serverless 发布单元是 **1 个静态 Pages 项目、5 个 SSR boundary、1 个 Frontend Router Worker、3 个 Edge Gateway boundary**。Kubernetes 目标保留这 10 个逻辑组件的身份和路由边界；Chart 暴露每个组件的镜像、资源、端口、探针和副本数配置，部署者可按环境选择独立 Deployment 或经过评估的同 Pod 组合。

### 推荐的默认部署

| Serverless 单元 | Kubernetes 资源建议 | 默认隔离方式 | 扩缩容配置 |
| --- | --- | --- | --- |
| 静态 Pages 项目 | `static-pages` Deployment + ClusterIP Service；镜像内置静态资产和轻量文件服务 | 独立 Deployment | `console.components.static-pages.replicas` / HPA |
| SSR：`public`、`content`、`auth`、`console`、`workspace` | 每个 boundary 一个 Deployment + ClusterIP Service | 默认五个独立 Deployment | 每个 `console.components.ssr-<boundary>.replicas` / HPA 独立设置 |
| Frontend Router Worker | `frontend-router` Deployment + ClusterIP Service | 独立 Deployment，连接静态 Pages 与五个 SSR Service | `console.components.frontend-router.replicas` / HPA |
| Edge Gateway：`auth`、`admin`、`core` | 每个 boundary 一个 Deployment + ClusterIP Service | 默认三个独立 Deployment；不直接公开为 LoadBalancer/NodePort | 每个 `edgeGateway.boundaries.<boundary>.replicas` / HPA 独立设置 |

以上前端与 Gateway 组件默认合计 **10 个 Deployment 工作负载模板**（不含 Caddy 和 Accounts/Billing/Content/数据库等后端服务）。Pod 副本数由各组件 values 独立设置，实际 Pod 数是各副本数之和；“5 个 SSR”表示 5 个不同的 SSR boundary，不是固定 5 个 Pod，也不是一个 5 容器 Pod。

### 同 Pod 合并与灵活度

同一个 Pod 中可放多个容器，但它们共享调度、网络命名空间、生命周期和副本计数。Deployment 的 `replicas` 会复制整份 Pod 模板，因此把五个 SSR 容器放进同一个 Deployment，会令五个 SSR 一起扩缩容；把三个 Gateway 放进同一个 Deployment 也会耦合它们的副本数。只有确实需要共享本地文件、代理或生命周期的紧耦合组件才适合 sidecar/同 Pod。

Chart 规划提供三类组合策略：

1. **`independent`（默认）**：Pages、Router、每个 SSR、每个 Gateway 各自 Deployment/Service；可独立升级、扩缩容和设置资源。
2. **`grouped`（可选）**：GitOps 声明显式列出 Pod 组合组。每组是一个 Deployment；组内各容器镜像/端口分别配置，但副本数、调度与发布生命周期共享。仅用于负载模式接近且可接受耦合的 boundary。
3. **`single-container`（已有 Console 形态）**：使用 Portal all-in-one 镜像作为单一 Console Deployment；不启动 Pages/SSR/Router 拆分资源。Edge Gateway 是否启用由独立开关控制。

不得通过“一个容器里启动多个应用进程”冒充多个 Kubernetes 容器，也不得把同 Pod 中的容器误认为可独立扩缩容的 Deployment。values schema 应校验同一 boundary 只能由一种 profile 管理，并拒绝重复渲染。

### Caddy 保持唯一外部 Ingress

保留现有 Caddy Deployment/Service 作为对集群外的 HTTPS 入口。Caddy 的公共 host/path 规则来自 GitOps 非敏感 values，渲染为受控 Caddyfile：Console host 转发到 `frontend-router` Service；Console/Accounts API 请求按现有 `/api/auth/*`、`/api/v1/auth/*`、`/api/admin/*`、`/api/*` 边界转发到 `gateway-auth`、`gateway-admin`、`gateway-core` Service，专用 Billing host 直接转发 Billing Service，Gateway 内部的 Billing API 分派仍由对应 Gateway 实现。匹配次序先处理 auth/admin 精确前缀，再处理 `/api/*`，并保留 Host 与必要请求头。

这些是 Caddy 的站点/路径路由声明；在当前 Caddyfile 模式下，不应把它们误称为 Kubernetes `HTTPRoute` 对象。Kubernetes `Ingress`/Gateway API `HTTPRoute` 资源必须由对应 Controller 接管；只有未来明确安装并验证 Caddy Controller 后，才考虑改成 Kubernetes Route 资源。本方案不增加第二个外部 Ingress 或 Gateway 数据面。

Public DNS 中 Console、Accounts、Billing 等别名仍由 GitOps/IaC 管理；Caddy 只按 Host 接流量，不创建 DNS。Front Router 的 Cloudflare Worker bindings/service bindings 也不能直接假定等同于 Kubernetes Service 调用：实施前需完成 Worker API/runtime、缓存、SSR asset manifest、请求/响应头及内部 Service 发现的容器适配验证。CI 产出的 Worker artifact 不可直接当作容器镜像。

| 配置维度 | 规划字段示例 | 说明 |
| --- | --- | --- |
| 部署策略 | `console.deploymentProfile: independent` | `independent` / `grouped` / `single-container` 互斥选择 |
| SSR boundary | `console.components.ssr-<id>.image`、`replicas`、`resources`、`port`、`probes` | 5 个 id 固定为 `public/content/auth/console/workspace`；每个副本数可独立设置 |
| Gateway boundary | `edgeGateway.boundaries.<id>.image`、`replicas`、`resources`、`port` | 3 个 id 固定为 `auth/admin/core`；仅 ClusterIP，入口由 Caddy 代理 |
| 前端组件 | `console.components.static-pages.*`、`console.components.frontend-router.*` | 静态资产与 Router 分开发布、部署和扩缩容 |
| Caddy 路由 | `caddy.routes.consoleHost`、`accountsHost`、`billingHost`、`gatewayPaths` | 由 Helm 渲染配置；host 值由 GitOps 提供，证书私钥只引用 Secret |

实际配置合同见 [README](README.md)、[独立部署示例](values-open.yaml)、[同 Pod 分组覆盖](values-grouped.yaml)及[单容器覆盖](values-single-container.yaml)。Console 子 Chart 统一拥有 7 个前端边界；独立的 static-pages/frontend-router/frontend-ssr 子 Chart 作为单独 release 的可复用包发布，umbrella 不重复安装它们。所有子 Chart 的 OCI 名称使用 `web-saas-` 前缀，避免与既有通用 Chart 冲突。

Gateway API 的 `HTTPRoute` 可以按 hostname/path 绑定 Gateway 并指向 Kubernetes Service；若将来采用该路线，需把 Caddy 配为实际的 Gateway API Controller，避免仅创建 Route 资源却无人消费。当前保持 Caddyfile 入口更贴近现有交付模式。[Kubernetes Ingress 文档](https://kubernetes.io/docs/concepts/services-networking/ingress/)说明 Ingress 需要 Controller 才会生效；[Gateway API HTTPRoute 文档](https://gateway-api.sigs.k8s.io/reference/api-types/httproute/)定义了 parent Gateway、hostnames、matches 与 backendRefs 的模型。

## 目标目录结构

```text
oci/charts/distributed-web-saas-fullstack/
├── Chart.yaml                         # umbrella chart，锁定子 Chart 依赖版本
├── values.yaml                        # 通用安全默认值，不含生产目标或凭据
├── values-open.yaml                   # 可公开的本地/K3s 示例，不用于 PROD
├── subcharts/                     # 子 Chart 源码；charts/ 仅存放生成依赖包
│   ├── console/                       # Console 部署模式选择器/配置
│   ├── static-pages/                  # 单一静态 Pages 项目的容器化服务
│   ├── frontend-router/               # 前端 host/path 到 SSR 与静态服务的内部路由
│   ├── frontend-ssr/                  # SSR boundary 公共模板，可实例化五个独立 release/workload
│   ├── edge-gateway/                  # auth/admin/core 三个独立 boundary
│   ├── accounts/
│   ├── billing/
│   ├── content/
│   ├── postgresql/                    # StatefulSet、Service、PVC
│   ├── caddy/                         # HTTP(S) 入口与应用路由
│   └── stunnel/                       # client/server 隧道组件
└── README.md / HELM-SUBCHART-PLAN.zh.md

oci/charts/flux-system/                # 可选的独立 Flux 安装/升级包；不作为应用子 Chart
```

子 Chart 应有自己的 `Chart.yaml`、values schema、模板、README 和版本；umbrella chart 锁定依赖并组合发布。应用通用模板可以复用，但各服务的端口、健康检查、资源、Secret 引用和升级语义应由各自 values schema 明确表达。

## 子 Chart 职责与边界

| 子 Chart | 主要资源与合同 | 关键验收 |
| --- | --- | --- |
| Console / 静态 Pages / Frontend Router / SSR | `console` 选择器控制互斥部署模式；分布式模式使用 1 个静态 Pages、5 个 SSR、1 个 Router，各自可配置 replicas 与资源 | 页面/登录/SSR/API 路由准确；每个 boundary 版本、探针和扩缩容独立性符合声明 |
| Edge Gateway | `auth/admin/core` 分别部署为内部 Deployment/ClusterIP Service；路由与默认/备用 Accounts、Billing upstream 由 GitOps 配置 | `/api/auth/*`、`/api/v1/auth/*`、`/api/admin/*`、`/api/*` 转发行为与源 Worker 一致；不得暴露公网 Service |
| Accounts | Deployment/Service、readiness/liveness、配置和 Secret 引用 | DB 身份摘要、只读探针、真实认证与业务接口分别验收 |
| Billing | Deployment/Service、push 接收和健康检查 | Exporter → Vector → Billing → Accounts → 页面，确认真实样本入库与汇总 |
| Content | Deployment/Service、文档服务端口及探针 | Console 可访问文档服务，内容版本与应用版本可追踪 |
| PostgreSQL | 自有镜像 StatefulSet、Headless/ClusterIP Service、PVC、探针、备份标签与持久化策略 | 不使用通用 Deployment；PVC 删除/回收策略显式；备份恢复演练通过 |
| Caddy | 专用 Deployment/Service、受控 Caddyfile/站点配置、TLS Secret 引用 | `caddy validate`、Host matcher 去重、HTTPS/SNI 和每个上游路由核验 |
| stunnel | 同一子 Chart 管理 client 与 server 工作负载/Service，按网络边界限制端口 | 应用只连客户端入口；服务端 TLS、CA/证书挂载及来源限制通过 |

PostgreSQL 的 5432 不公开；如需要跨节点数据库访问，只能经 stunnel server 的受限入口，并由网络/IaC 声明来源策略。`postgresql.svc.plus` 等 DNS CNAME 仍归 GitOps/IaC owner 管理，不由 Helm 修改。

## Flux 与当前 V5 Doco-CD 的关系

这里将“Flux-CD”理解为 Flux CD/FluxCD。Flux 属于集群控制面，应独立安装在 `flux-system` namespace，通过 GitRepository/OCIRepository 与 HelmRelease 协调本主 Chart；不应被应用 umbrella chart 安装或升级，否则会形成控制器自举和自管理依赖环。

V5 当前使用 Doco-CD。将 V5 从 Doco-CD 切换到 Flux 是独立的控制面迁移，需要单独规划状态交接、调用身份、回滚和环境验收。本次 Chart 拆分不包含该切换，也不改变 V5 线上运行方式。

## 配置、秘密与版本来源

- **Artifacts**：保存可复用 Chart、schema、模板和 Chart 发布流水线。
- **GitOps**：唯一环境配置源，选择 umbrella Chart 版本、各镜像 digest、公开域名、资源额度、存储类及非敏感参数；不复制第二份环境矩阵。
- **Vault/External Secrets**：只通过 Secret 引用向 Pod 提供数据库密码、OAuth 密钥、服务 Token、DNS API Token 和 TLS 私钥；秘密值不得进入 values、Chart archive、ConfigMap、CI 日志或 OCI metadata。
- **IaC/CMDB**：创建/描述集群、网络、持久盘、入口 IP 与 DNS 等云资源，并提供权威 CMDB；Helm 不创建云网络或 DNS。
- **Playbooks**：准备目标操作系统/K3s、证书和主机基线，并承担受控备份/恢复等主机侧操作。
- **migratectl**：继续独立执行有预览、检查点、回滚点和逐表回执的数据迁移；不使用 Helm lifecycle hook 执行 schema 或业务数据迁移。
- **镜像**：values 使用经核验的 immutable digest；Chart 版本和应用镜像版本分别编号。

## 发布与部署顺序

1. 对照当前 Compose、Playbooks 模板、GitOps V5 声明和运行基线，形成逐服务配置/挂载/端口/Secret/健康检查映射表，并标出不能直接迁移的持久化字段。
2. 修复或替换旧脚手架，先完成 PostgreSQL、stunnel、Caddy 等有状态/安全边界组件，再完成 Console 的三种部署 profile、Pages/Router/SSR/Gateway 与业务服务子 Chart；不从旧 PostgreSQL Deployment 模板继承。
3. 更新 OCI release workflow 的触发路径与 Chart 清单：子 Chart、umbrella Chart、Flux 安装包（如决定维护）分别执行依赖锁定、`helm lint`、schema 校验和 `helm template`；发布时记录 Chart 版本、Git SHA 与 OCI digest。
4. GitOps 增加隔离 SIT/UAT Kubernetes namespace 的 HelmRelease，固定 Chart OCI 版本与镜像 digest；Flux 从同一 GitOps commit 收敛，Toolkit 只负责编排、审批和回执关联。
5. 在独立集群验证安装、重复 reconcile、Pod 更新、PVC 保留、密钥注入、证书/路由、只读巡检、备份恢复及真实业务回归；数据库迁移从独立恢复点执行，不共用当前 V5 的数据目录。
6. 只有非生产验收、数据恢复/一致性、业务验收和人工变更审批都通过后，另立生产迁移与回滚计划。DNS、写入权和旧环境退役继续作为单独阶段。

## PR / CI 验收门槛

- 每个子 Chart 与 umbrella chart 均可独立 lint/render；`independent/grouped/single-container` profile 的正反例验证无重复 boundary、遗漏 Service 或冲突选择器；所有依赖存在锁文件，模板不得依赖机器本地文件。
- 生产 Profile 必须显式提供镜像 digest、namespace、StorageClass、资源与 Secret 引用；缺少必填值时渲染失败，不允许 `latest` 或生产默认域名。
- PostgreSQL StatefulSet 与 PVC 具备升级兼容和回收策略；负例检查不得意外删除 PVC、Secret 或跨环境资源。
- 机密扫描、Kubernetes schema 校验、镜像来源/摘要校验通过；所有公网入口和跨节点端口均有最小暴露规则。
- OCI 发布工作流只在目标 PR/main 路径触发，分别发布子 Chart 与 umbrella 包；GitOps 只消费已发布、不可变且已验证的版本。
- SIT/UAT 真实部署、恢复和业务回归通过前，不声称生产可部署；Chart 构建成功不等于部署、迁移或业务验收成功。SSR/Gateway 的每个独立副本数、健康检查、路由和滚动升级需在 Kubernetes 真实环境验证。

## 尚待实现的事项

Chart 模板、schema、锁文件、三种部署模式、Caddy/stunnel、PostgreSQL 保留策略与 OCI 发布路径已实现。公共工作负载模板由 web-saas-common library 复用；Flux 不包含在应用 Chart 内。尚未完成 Worker 容器适配构件、真实集群部署、备份恢复、三轮在线幂等部署/迁移及业务验收。回滚需恢复上一 Chart/GitOps 固定版本，数据库不得依赖 Helm 回滚恢复，持久数据恢复须走独立流程。

## 盘点依据

- [本 Chart 当前说明](README.md)、[`Chart.yaml`](Chart.yaml)、[`values-open.yaml`](values-open.yaml)
- [旧 `web-saas` 脚手架](../web-saas/Chart.yaml)及其应用/数据库子 Chart
- [OCI chart 发布工作流](../../../.github/workflows/release-oci-charts.yml)
- [Serverless 发布编排工作流（固定提交）](https://github.com/ai-workspace-infra/platform-ops-toolkit/blob/7fa316dd61dcb1b15e261d24c8b22ae4357c1fd8/.github/workflows/serverless-orchestrator.yml)
- [GitOps V5 Compose 候选](https://github.com/ai-workspace-infra/gitops/blob/f9d42a6980cf3e14f488e786ec8a29404513f76c/compose/web-saas/docker-compose.prod-v5-candidate.yml)
- [GitOps Serverless 运行拓扑（固定提交）](https://github.com/ai-workspace-infra/gitops/blob/f9d42a6980cf3e14f488e786ec8a29404513f76c/topology/prod/serverless/runtime-topology.yaml)

## 本轮实现与验证回执

- Chart 合同：umbrella `0.2.0`；独立子 Chart/library 首版 `0.1.0`，旧 values 合同不兼容并明确拒绝。
- Helm `3.15.4` 与本地 Helm `4.3.1` lint/render/package：PASS。
- 11 项离线语义检查（含真实 Caddy 2.10.2 配置验证、独立/分组/单容器、Secret 引用、PVC 保留、非法配置和打包依赖）：PASS。
- Kubernetes `1.32.0` 严格 schema：13 份有效场景渲染、276 个资源，全部有效，无跳过。
- 三次重复模板渲染无差异：PASS；不等同于三轮在线部署/迁移幂等验收。
- 真实 Worker 容器适配镜像、Kubernetes 部署、恢复演练、迁移及业务验收：NOT_RUN。

以上使用通用测试域名与合成 digest；测试构件不能作为部署构件。命令与实际 values 合同见 README 和仓库内校验脚本。
