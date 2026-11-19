# Multi-OS & Multi-Architecture Packer Golden Images

本目录包含针对多操作系统与多硬件架构规划整理的 Packer 模板、自动化配置脚本与无人值守安装文件。

支持两种构建运行环境：
1. **QEMU 本地虚拟化构建**：支持本地生成 `.qcow2` 镜像（支持多架构如 `amd64`, `arm64`, `loong64`）。
2. **Vultr 云平台自动化构建**：使用官方 `github.com/vultr/vultr` Packer 插件创建临时 VPS，执行标准化 provisioner 脚本并生成快照（Snapshot）。

---

## 1. 目录结构与规划

```text
packer/
├── Cloud-Neutra-VMs/       # 多云中立虚拟机基础镜像定义（保留原有）
├── legacy/                 # 历史遗留脚本与 AWS AMI 模板归档
├── scripts/                # 跨发行版与多架构通用的 runtime provisioner 脚本
│   ├── setup-websaas-runtime.sh        # Docker, Caddy, 核心工具链与网络优化
│   ├── setup-agent-proxy-runtime.sh    # Xray-core, Agent Proxy 服务与 BBR
│   ├── setup-observability-runtime.sh  # Vector, Node Exporter, Process/PG Exporter
│   └── cleanup-golden-image.sh         # 清理 APT/DNF 缓存、日志、cloud-init 与 machine-id
├── debian-13/              # Debian 13 (Trixie) - 支持 amd64, arm64
│   ├── http/preseed.cfg
│   ├── docker-compose-websaas.pkr.hcl
│   ├── systemd-agent-proxy.pkr.hcl
│   ├── docker.pkr.hcl
│   └── k8s.pkr.hcl
├── debian-14/              # Debian 14 (Forky) - 支持 amd64, arm64, loong64
│   ├── http/preseed.cfg
│   ├── docker-compose-websaas.pkr.hcl
│   ├── systemd-agent-proxy.pkr.hcl
│   ├── docker.pkr.hcl
│   └── k8s.pkr.hcl
├── ubuntu-24.04-lts/       # Ubuntu 24.04 LTS (Noble) - 支持 amd64, arm64
│   ├── http/user-data & meta-data
│   ├── docker-compose-websaas.pkr.hcl
│   ├── systemd-agent-proxy.pkr.hcl
│   ├── docker.pkr.hcl
│   └── k8s.pkr.hcl
├── ubuntu-26.04-lts/       # Ubuntu 26.04 LTS (Resolute) - 支持 amd64, arm64
│   ├── http/user-data & meta-data
│   ├── docker-compose-websaas.pkr.hcl
│   ├── systemd-agent-proxy.pkr.hcl
│   ├── docker.pkr.hcl
│   └── k8s.pkr.hcl
├── rocky-9/                # Rocky Linux 9 - 支持 amd64, arm64
│   ├── http/ks.cfg
│   ├── docker-compose-websaas.pkr.hcl
│   ├── systemd-agent-proxy.pkr.hcl
│   ├── docker.pkr.hcl
│   └── k8s.pkr.hcl
└── rocky-10/               # Rocky Linux 10 - 支持 amd64, arm64
    ├── http/ks.cfg
    ├── docker-compose-websaas.pkr.hcl
    ├── systemd-agent-proxy.pkr.hcl
    ├── docker.pkr.hcl
    └── k8s.pkr.hcl
```

---

## 2. 操作系统与硬件架构支持矩阵

| 目录 / 操作系统 | 支持架构 | 包管理器 | 自动安装引导机制 | 预装角色模板 |
| :--- | :--- | :--- | :--- | :--- |
| `debian-13` | `amd64`, `arm64` | APT | Debian Preseed (`http/preseed.cfg`) | Web SaaS, Agent Proxy, Docker, K8s |
| `debian-14` | `amd64`, `arm64`, `loong64` | APT | Debian Preseed (`http/preseed.cfg`) | Web SaaS, Agent Proxy, Docker, K8s |
| `ubuntu-24.04-lts` | `amd64`, `arm64` | APT | Subiquity Autoinstall (`http/user-data`) | Web SaaS, Agent Proxy, Docker, K8s |
| `ubuntu-26.04-lts` | `amd64`, `arm64` | APT | Subiquity Autoinstall (`http/user-data`) | Web SaaS, Agent Proxy, Docker, K8s |
| `rocky-9` | `amd64`, `arm64` | DNF | Red Hat Kickstart (`http/ks.cfg`) | Web SaaS, Agent Proxy, Docker, K8s |
| `rocky-10` | `amd64`, `arm64` | DNF | Red Hat Kickstart (`http/ks.cfg`) | Web SaaS, Agent Proxy, Docker, K8s |

---

## 3. 模板角色说明

1. **`docker-compose-websaas.pkr.hcl`**
   - 生产级 Web SaaS 宿主节点。
   - 预装 Docker CE, containerd, Docker Compose Plugin, Caddy。
   - 预装可观测组件：Vector, Node Exporter, Process Exporter, PostgreSQL Exporter。
   - 调优内核网络参数（`somaxconn`, `ip_forward`, `syn_backlog`）。
2. **`systemd-agent-proxy.pkr.hcl`**
   - 生产级 Agent 代理节点（轻量、高性能、不安装 Docker）。
   - 预装 Xray-core、配置 systemd 服务与 Agent-proxy 服务模板。
   - 预装可观测组件：Vector, Node Exporter, Process Exporter。
   - 启用 BBR 拥塞控制与高并发文件句柄限制。
3. **`docker.pkr.hcl`**
   - 通用基础 Docker 容器主机镜像。
4. **`k8s.pkr.hcl`**
   - 轻量 Kubernetes (k3s-agent) 容器集群计算节点镜像。

---

## 4. 本地构建与验证

### 4.1 本地 QEMU 构建不同架构镜像

通过传入 `arch` 变量指定目标架构：

```bash
# 构建 Debian 13 amd64 镜像
cd packer/debian-13
packer init docker-compose-websaas.pkr.hcl
packer build -only="qemu.debian13_docker_compose_websaas" -var="arch=amd64" docker-compose-websaas.pkr.hcl

# 构建 Debian 13 arm64 镜像
packer build -only="qemu.debian13_docker_compose_websaas" -var="arch=arm64" docker-compose-websaas.pkr.hcl

# 构建 Debian 14 龙芯架构 (loong64) 镜像
cd ../debian-14
packer init docker-compose-websaas.pkr.hcl
packer build -only="qemu.debian14_docker_compose_websaas" -var="arch=loong64" docker-compose-websaas.pkr.hcl

# 构建 Rocky Linux 9 arm64 镜像
cd ../rocky-9
packer init docker-compose-websaas.pkr.hcl
packer build -only="qemu.rocky9_docker_compose_websaas" -var="arch=arm64" docker-compose-websaas.pkr.hcl
```

### 4.2 本地调用 Vultr 自动化脚本构建

```bash
cd <repo_root>
VULTR_API_KEY=... \
VULTR_REGION_ID=nrt \
VULTR_PLAN_ID=vc2-2c-4gb \
VULTR_OS_REGEX='^Debian 13' \
TEMPLATE=packer/debian-13/docker-compose-websaas.pkr.hcl \
SOURCE_NAME=debian13_docker_compose_websaas \
bash .github/scripts/packer-vultr-build.sh
```

---

## 5. GitHub Actions CI/CD 流水线

`.github/workflows/` 下提供按操作系统与模板拆分的自动化流水线：
- `packer-vultr-debian13-docker-compose-websaas.yml`
- `packer-vultr-debian13-systemd-agent-proxy.yml`
- `packer-vultr-ubuntu2404-docker-compose-websaas.yml`
- `packer-vultr-ubuntu2404-systemd-agent-proxy.yml`
- `packer-vultr-ubuntu2604-docker-compose-websaas.yml`
- `packer-vultr-ubuntu2604-systemd-agent-proxy.yml`
- `packer-vultr-rocky9-docker-compose-websaas.yml`
- `packer-vultr-rocky9-systemd-agent-proxy.yml`

工作流使用 GitHub OIDC 登录 HashiCorp Vault 获取 `VULTR_API_KEY`，实现安全零凭据泄漏发布。
构建成功后，工作流会自动保留最新快照，并清理对应 source 历史过期快照。
