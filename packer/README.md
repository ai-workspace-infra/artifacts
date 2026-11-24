# Multi-OS, Multi-Architecture & Multi-Cloud Packer Golden Images

本目录包含针对多操作系统、多硬件架构、多云与 VPS 平台规划整理的 Packer 模板、模块化 Provisioner 脚本与无人值守安装配置。

---

## 1. 支持平台与 Builder 矩阵

| 分类 | 目标平台 | Packer Builder / 方式 | 镜像产物 |
| :--- | :--- | :--- | :--- |
| **本地 / 通用** | **QEMU** | `source "qemu"` | `.qcow2` (`amd64`, `arm64`, `loong64`) |
| **VPS** | **Vultr** | `source "vultr"` | Vultr Snapshot |
| **VPS** | **Linode** | `source "linode"` | Linode Private Image |
| **VPS / 公有云** | **AWS (EC2 / Lightsail)** | `source "amazon-ebs"` | AWS AMI |
| **VPS** | **UCloud LightHost** | `source "qemu"` + `publish-ucloud-image.sh` | UCloud 自定义镜像 |
| **公有云** | **GCP** | `source "googlecompute"` | GCE Custom Image |
| **公有云** | **Alicloud (阿里云)** | `source "alicloud-ecs"` | 阿里云自定义镜像 |

---

## 2. 操作系统与架构矩阵

| 子目录 | 发行版 | 支持架构 (`arch`) | 引导机制 | 角色模板 |
| :--- | :--- | :--- | :--- | :--- |
| `debian-13/` | Debian 13 (Trixie) | `amd64`, `arm64` | `http/preseed.cfg` | Web SaaS, Agent Proxy, Docker, K8s |
| `debian-14/` | Debian 14 (Forky) | `amd64`, `arm64`, `loong64` | `http/preseed.cfg` | Web SaaS, Agent Proxy, Docker, K8s |
| `ubuntu-24.04-lts/` | Ubuntu 24.04 LTS | `amd64`, `arm64` | `http/user-data` | Web SaaS, Agent Proxy, Docker, K8s |
| `ubuntu-26.04-lts/` | Ubuntu 26.04 LTS | `amd64`, `arm64` | `http/user-data` | Web SaaS, Agent Proxy, Docker, K8s |
| `rocky-9/` | Rocky Linux 9 | `amd64`, `arm64` | `http/ks.cfg` | Web SaaS, Agent Proxy, Docker, K8s |
| `rocky-10/` | Rocky Linux 10 | `amd64`, `arm64` | `http/ks.cfg` | Web SaaS, Agent Proxy, Docker, K8s |

---

## 3. 细分 Provisioner 架构 (`packer/scripts/`)

1. **基础与安全基线层**：`00-base-os.sh`、`01-security-hardening.sh`
2. **运行时与角色层**：`10-docker-runtime.sh`、`11-caddy-websaas.sh`、`12-k3s-runtime.sh`、`13-agent-proxy-runtime.sh`
3. **可观测性层**：`20-observability-core.sh`、`21-observability-postgres.sh`
4. **云适配与清理层**：`90-cloud-init-prep.sh`、`99-cleanup-golden-image.sh`、`publish-ucloud-image.sh`

---

## 4. 统一 Vault KV Path 与可复用工作流

所有平台凭据统一收敛到 Vault 路径 `kv/data/CICD/uat`：
- `VULTR_API_KEY`
- `LINODE_TOKEN`
- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`
- `GCP_PROJECT_ID` / `GCP_CREDENTIALS_JSON`
- `ALICLOUD_ACCESS_KEY` / `ALICLOUD_SECRET_KEY`
- `UCLOUD_PUBLIC_KEY` / `UCLOUD_PRIVATE_KEY`

`.github/workflows/` 下保留并支持以下可复用工作流：
- `packer-vultr-publish-reusable.yml`
- `packer-linode-publish-reusable.yml`
- `packer-aws-publish-reusable.yml`
- `packer-gcp-publish-reusable.yml`
- `packer-alicloud-publish-reusable.yml`
- `packer-ucloud-publish-reusable.yml`
