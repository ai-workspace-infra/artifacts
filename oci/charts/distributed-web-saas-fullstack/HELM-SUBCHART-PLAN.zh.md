# Distributed Web SaaS Helm 主 Chart 与子 Chart 规划

日期：2026-10-24
状态：规划稿；未修改 Chart、GitOps 声明或运行环境。

## 目标

将 Console、Accounts、Billing、PostgreSQL、Content、Caddy 和数据库隧道包装为可单独维护版本的 Helm 子 Chart，由 `distributed-web-saas-fullstack` 作为统一 umbrella chart 组合发布。GitOps 固定 Chart 版本、镜像 digest 与非敏感运行参数；Flux 负责从 GitOps 声明协调应用。

本计划基于 artifacts `main` `5542a66` 和 GitOps `main` `f9d42a6`。当前 V5 仍使用 Docker Compose 与 Doco-CD；Helm/Kubernetes 是新部署目标，不是直接替换 V5 现有部署的操作步骤。

## 当前 Chart 盘点

- `distributed-web-saas-fullstack` 已有通用组件 Deployment/Service 模板、Ingress 及 PostgreSQL StatefulSet/PVC，但服务仍通过一个 `components` values 集合渲染，没有各服务独立的子 Chart。
- 旧 `web-saas` 目录虽含六个子 Chart 脚手架，但应用值仍有 `latest`/占位镜像；PostgreSQL 子 Chart 是通用 Deployment/HTTP Service，不具备数据库状态与持久化语义。不要把它直接作为生产数据库 Chart 发布。
- 当前 `release-oci-charts.yml` 的 lint/package/push 清单未包含 `web-saas` 或 `distributed-web-saas-fullstack`，新 Chart 即使存在也不会由当前发布工作流打包。
- 当前 V5 Compose 候选包含 Accounts、Billing、Console、Content、PostgreSQL、Caddy、stunnel client/server；Doco-CD 是单独的部署控制面。其持久数据、TLS/路由和秘密配置合同须先映射到 Kubernetes 对象，不能只按容器名搬迁。

## 目标目录结构

```text
oci/charts/distributed-web-saas-fullstack/
├── Chart.yaml                         # umbrella chart，锁定子 Chart 依赖版本
├── values.yaml                        # 通用安全默认值，不含生产目标或凭据
├── values-open.yaml                   # 可公开的本地/K3s 示例，不用于 PROD
├── charts/
│   ├── console/                       # Console 与静态资源更新任务
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
| Console | Deployment/Service；静态资源更新为受控 Job 或 init 流程，使用固定镜像 | 首页、登录页/API 路由、静态资源随镜像版本更新 |
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
2. 修复或替换旧脚手架，先完成 PostgreSQL、stunnel、Caddy 等有状态/安全边界组件，再完成四个应用子 Chart；不从旧 PostgreSQL Deployment 模板继承。
3. 更新 OCI release workflow 的触发路径与 Chart 清单：子 Chart、umbrella Chart、Flux 安装包（如决定维护）分别执行依赖锁定、`helm lint`、schema 校验和 `helm template`；发布时记录 Chart 版本、Git SHA 与 OCI digest。
4. GitOps 增加隔离 SIT/UAT Kubernetes namespace 的 HelmRelease，固定 Chart OCI 版本与镜像 digest；Flux 从同一 GitOps commit 收敛，Toolkit 只负责编排、审批和回执关联。
5. 在独立集群验证安装、重复 reconcile、Pod 更新、PVC 保留、密钥注入、证书/路由、只读巡检、备份恢复及真实业务回归；数据库迁移从独立恢复点执行，不共用当前 V5 的数据目录。
6. 只有非生产验收、数据恢复/一致性、业务验收和人工变更审批都通过后，另立生产迁移与回滚计划。DNS、写入权和旧环境退役继续作为单独阶段。

## PR / CI 验收门槛

- 每个子 Chart 与 umbrella chart 均可独立 lint/render；所有依赖存在锁文件，模板不得依赖机器本地文件。
- 生产 Profile 必须显式提供镜像 digest、namespace、StorageClass、资源与 Secret 引用；缺少必填值时渲染失败，不允许 `latest` 或生产默认域名。
- PostgreSQL StatefulSet 与 PVC 具备升级兼容和回收策略；负例检查不得意外删除 PVC、Secret 或跨环境资源。
- 机密扫描、Kubernetes schema 校验、镜像来源/摘要校验通过；所有公网入口和跨节点端口均有最小暴露规则。
- OCI 发布工作流只在目标 PR/main 路径触发，分别发布子 Chart 与 umbrella 包；GitOps 只消费已发布、不可变且已验证的版本。
- SIT/UAT 真实部署、恢复和业务回归通过前，不声称生产可部署；Chart 构建成功不等于部署、迁移或业务验收成功。

## 尚待实现的事项

本文件是方案，不代表上述 Chart、Flux 安装方式、CI 发布路径或 Kubernetes 目标集群已经实现。首个实施 PR 应先解决 chart 归属/命名、`apps/app-service` 的复用方式、PostgreSQL PVC/备份 owner、Caddy/stunnel 网络暴露模型以及 Flux 与 Doco-CD 的目标关系，并附具体验证命令和回滚计划。

## 盘点依据

- [本 Chart 当前说明](README.md)、[`Chart.yaml`](Chart.yaml)、[`values-open.yaml`](values-open.yaml)
- [旧 `web-saas` 脚手架](../web-saas/Chart.yaml)及其应用/数据库子 Chart
- [OCI chart 发布工作流](../../../.github/workflows/release-oci-charts.yml)
- [GitOps V5 Compose 候选](https://github.com/ai-workspace-infra/gitops/blob/f9d42a6980cf3e14f488e786ec8a29404513f76c/compose/web-saas/docker-compose.prod-v5-candidate.yml)
