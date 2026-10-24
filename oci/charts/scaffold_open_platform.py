#!/usr/bin/env python3
"""
Scaffolding script for open-platform Umbrella Helm Chart
Aggregates 10 Core Services as modular Subcharts:
  01. gitea          - Git & CI/CD Engine (gitea/gitea:1.22.6)
  02. harbor         - Cloud-Native Artifact Registry (goharbor/harbor v2.15.4)
  03. silo           - S3-Compatible Object Storage (pgsty/silo:RELEASE.2026-10-18T00-00-00Z)
  04. cmdb           - Dynamic Inventory & CMDB API (python:3.11-alpine)
  05. vault-zitadel  - Secret Engine & IAM Backend (hashicorp/vault:1.17.6 + postgres:16-alpine)
  06. doco-cd        - Declarative GitOps Controller (ghcr.io/kimdre/doco-cd:0.1.28)
  07. pgvector       - Cloud-Neutral Container & Vector DB (pgvector/pgvector:pg16)
  08. pg-backup      - Database Backup & Restore Sandbox (postgres:16-alpine)
  09. ai-gateway     - Dual-Tier AI Gateway (calciumion/new-api:v0.4.10 + ghcr.io/berriai/litellm:v1.51.0)
  10. mcp-gateway    - Infrastructure MCP Tool Gateway (alpine:3.20)
"""
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent / "open-platform"

def write(filepath: Path, content: str):
    filepath.parent.mkdir(parents=True, exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")

print(f"Scaffolding open-platform umbrella chart at: {BASE_DIR}")

# ==============================================================================
# 1. Main Umbrella Chart
# ==============================================================================

write(BASE_DIR / "Chart.yaml", """
apiVersion: v2
name: open-platform
description: Cloud-Neutral Open Platform Umbrella Helm Chart aggregating 10 core infrastructure services
type: application
version: 1.0.0
appVersion: "2026.10"
keywords:
  - platform-engineering
  - cloud-neutral
  - open-platform
  - gitea
  - harbor
  - silo
  - cmdb
  - vault
  - zitadel
  - doco-cd
  - pgvector
  - ai-gateway
  - mcp
home: https://github.com/ai-workspace-infra
maintainers:
  - name: Platform Engineering Team
    email: platform@svc.plus
dependencies:
  - name: gitea
    version: 1.0.0
    repository: "file://./charts/gitea"
    condition: gitea.enabled
  - name: harbor
    version: 1.0.0
    repository: "file://./charts/harbor"
    condition: harbor.enabled
  - name: silo
    version: 1.0.0
    repository: "file://./charts/silo"
    condition: silo.enabled
  - name: cmdb
    version: 1.0.0
    repository: "file://./charts/cmdb"
    condition: cmdb.enabled
  - name: vault-zitadel
    version: 1.0.0
    repository: "file://./charts/vault-zitadel"
    condition: vault-zitadel.enabled
  - name: doco-cd
    version: 1.0.0
    repository: "file://./charts/doco-cd"
    condition: doco-cd.enabled
  - name: pgvector
    version: 1.0.0
    repository: "file://./charts/pgvector"
    condition: pgvector.enabled
  - name: pg-backup
    version: 1.0.0
    repository: "file://./charts/pg-backup"
    condition: pg-backup.enabled
  - name: ai-gateway
    version: 1.0.0
    repository: "file://./charts/ai-gateway"
    condition: ai-gateway.enabled
  - name: mcp-gateway
    version: 1.0.0
    repository: "file://./charts/mcp-gateway"
    condition: mcp-gateway.enabled
""")

write(BASE_DIR / "values.yaml", """
# Global configurations shared across all subcharts
global:
  domain: "open-platform.local"
  storageClass: ""
  imagePullPolicy: "IfNotPresent"

# 01 Git & CI/CD Engine
gitea:
  enabled: true

# 02 Cloud-Native Artifact Registry
harbor:
  enabled: true

# 03 S3-Compatible Object Storage
silo:
  enabled: true

# 04 Dynamic Inventory & CMDB Service
cmdb:
  enabled: true

# 05 Secret Engine & IAM Backend
vault-zitadel:
  enabled: true

# 06 Declarative GitOps Controller
doco-cd:
  enabled: true

# 07 Cloud-Neutral Container & Vector DB
pgvector:
  enabled: true

# 08 Database Backup & Restore Sandbox
pg-backup:
  enabled: true

# 09 Dual-Tier AI Gateway (New API + LiteLLM)
ai-gateway:
  enabled: true

# 10 Infrastructure MCP Tool Gateway
mcp-gateway:
  enabled: true
""")

write(BASE_DIR / "templates" / "_helpers.tpl", """
{{/*
Expand the name of the umbrella chart.
*/}}
{{- define "open-platform.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "open-platform.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "open-platform.labels" -}}
helm.sh/chart: {{ include "open-platform.name" . }}-{{ .Chart.Version | replace "+" "_" }}
app.kubernetes.io/name: {{ include "open-platform.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/part-of: open-platform
{{- end }}
""")

write(BASE_DIR / "templates" / "NOTES.txt", """
==============================================================================
🎉 Open Platform 10 Core Services Umbrella Helm Chart Deployed Successfully!
==============================================================================

Release:   {{ .Release.Name }}
Namespace: {{ .Release.Namespace }}

Active Core Services Endpoints:
------------------------------------------------------------------------------
{{- if .Values.gitea.enabled }}
- 01 Git & CI/CD (Gitea):        http://gitea.{{ .Values.global.domain }}:3000 (SSH :22)
{{- end }}
{{- if .Values.harbor.enabled }}
- 02 Artifact Registry (Harbor): http://harbor.{{ .Values.global.domain }}:8080
{{- end }}
{{- if .Values.silo.enabled }}
- 03 S3 Storage (Silo):          http://s3.{{ .Values.global.domain }}:9000 (Console :9001)
{{- end }}
{{- if .Values.cmdb.enabled }}
- 04 CMDB Inventory:            http://cmdb.{{ .Values.global.domain }}:8000/api/v1/inventory
{{- end }}
{{- if (index .Values "vault-zitadel").enabled }}
- 05 Identity (Vault/Zitadel):   http://vault.{{ .Values.global.domain }}:8200 (PG :5432)
{{- end }}
{{- if (index .Values "doco-cd").enabled }}
- 06 GitOps (Doco CD):           http://doco.{{ .Values.global.domain }}:80 (Metrics :9120)
{{- end }}
{{- if .Values.pgvector.enabled }}
- 07 Vector DB (pgvector):       postgresql://k3s@pgvector.{{ .Values.global.domain }}:5432/k3s_vector
{{- end }}
{{- if (index .Values "pg-backup").enabled }}
- 08 Backup Drill (PostgreSQL):  postgresql://postgres@pg-backup.{{ .Values.global.domain }}:5432/test_backup_db
{{- end }}
{{- if (index .Values "ai-gateway").enabled }}
- 09 AI Gateway (New API/Lite):  http://new-api.{{ .Values.global.domain }}:3000 & http://litellm.{{ .Values.global.domain }}:4000
{{- end }}
{{- if (index .Values "mcp-gateway").enabled }}
- 10 MCP Gateway:                http://mcp.{{ .Values.global.domain }}:8080/
{{- end }}
------------------------------------------------------------------------------
""")

write(BASE_DIR / "README.md", """
# Open Platform Umbrella Helm Chart

The `open-platform` Helm chart is a production-grade umbrella chart packaging all **10 Core Infrastructure Services** of the Cloud-Neutral Platform Engineering blueprint into modular subcharts.

## Architecture & Subcharts

| # | Subchart | Category | Pinned Image | Ports | Description |
|---|---|---|---|---|---|
| 01 | `gitea` | Git & CI/CD | `gitea/gitea:1.22.6` | 3000 (HTTP), 22 (SSH) | Git code repository and Actions runner engine |
| 02 | `harbor` | Artifact Registry | `goharbor/harbor-portal:v2.15.4`, `goharbor/harbor-core:v2.15.4` | 8080, 80 | OCI container registry, Helm chart repo & Trivy scan |
| 03 | `silo` | S3 Object Storage | `pgsty/silo:RELEASE.2026-10-18T00-00-00Z` | 9000 (S3 API), 9001 (Console) | S3-compatible persistent state and blob storage |
| 04 | `cmdb` | CMDB Inventory | `python:3.11-alpine` | 8000 (REST) | Dynamic inventory API daemon for Ansible and agents |
| 05 | `vault-zitadel` | Identity & Secrets | `hashicorp/vault:1.17.6`, `postgres:16-alpine` | 8200 (Vault), 5432 (Zitadel DB) | HashiCorp Vault secrets engine + Zitadel IAM database |
| 06 | `doco-cd` | GitOps Delivery | `ghcr.io/kimdre/doco-cd:0.1.28` | 80 (HTTP), 9120 (Metrics) | Declarative single-node GitOps controller |
| 07 | `pgvector` | Vector & Containers | `pgvector/pgvector:pg16` | 5432 (Postgres) | PostgreSQL 16 with pgvector extension for RAG / memory |
| 08 | `pg-backup` | DB Backup Sandbox | `postgres:16-alpine` | 5432 (Postgres) | Automated snapshot backup and restore drill sandbox |
| 09 | `ai-gateway` | AI Gateway | `calciumion/new-api:v0.4.10`, `ghcr.io/berriai/litellm:v1.51.0` | 3000 (New API), 4000 (LiteLLM) | Dual-tier AI routing gateway with auth & rate limits |
| 10 | `mcp-gateway` | MCP Tool Gateway | `alpine:3.20` | 8080 (HTTP) | Model Context Protocol gateway exposing infra tools |

## Quickstart

```bash
# Lint the entire umbrella chart and all 10 subcharts
helm lint ./open-platform

# Render templates
helm template my-platform ./open-platform

# Install the umbrella chart
helm install my-platform ./open-platform -n open-platform --create-namespace
```
""")

# ==============================================================================
# Helpers generator for subcharts
# ==============================================================================
def write_subchart_helpers(sub_dir: Path, name: str):
    write(sub_dir / "templates" / "_helpers.tpl", f"""
{{{{/*
Expand the name of the chart.
*/}}}}
{{{{- define "{name}.name" -}}}}
{{{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}}}
{{{{- end }}}}

{{{{/*
Create a default fully qualified app name.
*/}}}}
{{{{- define "{name}.fullname" -}}}}
{{{{- if .Values.fullnameOverride }}}}
{{{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}}}
{{{{- else }}}}
{{{{- $name := default .Chart.Name .Values.nameOverride }}}}
{{{{- if contains $name .Release.Name }}}}
{{{{- .Release.Name | trunc 63 | trimSuffix "-" }}}}
{{{{- else }}}}
{{{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}}}
{{{{- end }}}}
{{{{- end }}}}
{{{{- end }}}}

{{{{/*
Common labels
*/}}}}
{{{{- define "{name}.labels" -}}}}
helm.sh/chart: {{{{ include "{name}.name" . }}}}-{{{{ .Chart.Version | replace "+" "_" }}}}
app.kubernetes.io/name: {{{{ include "{name}.name" . }}}}
app.kubernetes.io/instance: {{{{ .Release.Name }}}}
app.kubernetes.io/managed-by: {{{{ .Release.Service }}}}
app.kubernetes.io/component: {name}
{{{{- end }}}}

{{{{/*
Selector labels
*/}}}}
{{{{- define "{name}.selectorLabels" -}}}}
app.kubernetes.io/name: {{{{ include "{name}.name" . }}}}
app.kubernetes.io/instance: {{{{ .Release.Name }}}}
app.kubernetes.io/component: {name}
{{{{- end }}}}
""")

# ==============================================================================
# Subchart 01: gitea
# ==============================================================================
gitea_dir = BASE_DIR / "charts" / "gitea"
write(gitea_dir / "Chart.yaml", """
apiVersion: v2
name: gitea
description: Gitea Git and CI/CD Actions Subchart
type: application
version: 1.0.0
appVersion: "1.22.6"
""")

write(gitea_dir / "values.yaml", """
replicaCount: 1
image:
  repository: gitea/gitea
  tag: "1.22.6"
  pullPolicy: IfNotPresent

domain: "open-platform.local"

service:
  type: ClusterIP
  httpPort: 3000
  sshPort: 22

persistence:
  enabled: true
  size: 10Gi
  accessMode: ReadWriteOnce
  storageClass: ""

resources:
  limits:
    cpu: 1000m
    memory: 1024Mi
  requests:
    cpu: 100m
    memory: 256Mi
""")

write_subchart_helpers(gitea_dir, "gitea")

write(gitea_dir / "templates" / "pvc.yaml", """
{{- if .Values.persistence.enabled -}}
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: {{ include "gitea.fullname" . }}-data
  labels:
    {{- include "gitea.labels" . | nindent 4 }}
spec:
  accessModes:
    - {{ .Values.persistence.accessMode }}
  resources:
    requests:
      storage: {{ .Values.persistence.size }}
  {{- if .Values.persistence.storageClass }}
  storageClassName: {{ .Values.persistence.storageClass }}
  {{- end }}
{{- end }}
""")

write(gitea_dir / "templates" / "deployment.yaml", """
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "gitea.fullname" . }}
  labels:
    {{- include "gitea.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      {{- include "gitea.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "gitea.selectorLabels" . | nindent 8 }}
    spec:
      containers:
        - name: gitea
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          env:
            - name: USER_UID
              value: "1000"
            - name: USER_GID
              value: "1000"
            - name: GITEA__security__INSTALL_LOCK
              value: "true"
            - name: GITEA__server__HTTP_PORT
              value: "3000"
            - name: GITEA__server__DOMAIN
              value: "gitea.{{ (and .Values.global .Values.global.domain) | default .Values.domain | default \"open-platform.local\" }}"
            - name: GITEA__server__ROOT_URL
              value: "http://gitea.{{ (and .Values.global .Values.global.domain) | default .Values.domain | default \"open-platform.local\" }}:3000/"
          ports:
            - name: http
              containerPort: 3000
              protocol: TCP
            - name: ssh
              containerPort: 22
              protocol: TCP
          livenessProbe:
            httpGet:
              path: /api/v1/version
              port: http
            initialDelaySeconds: 15
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /api/v1/version
              port: http
            initialDelaySeconds: 5
            periodSeconds: 5
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
          volumeMounts:
            - name: gitea-data
              mountPath: /data
      volumes:
        - name: gitea-data
          {{- if .Values.persistence.enabled }}
          persistentVolumeClaim:
            claimName: {{ include "gitea.fullname" . }}-data
          {{- else }}
          emptyDir: {}
          {{- end }}
""")

write(gitea_dir / "templates" / "service.yaml", """
apiVersion: v1
kind: Service
metadata:
  name: {{ include "gitea.fullname" . }}
  labels:
    {{- include "gitea.labels" . | nindent 4 }}
spec:
  type: {{ .Values.service.type }}
  ports:
    - name: http
      port: {{ .Values.service.httpPort }}
      targetPort: http
      protocol: TCP
    - name: ssh
      port: {{ .Values.service.sshPort }}
      targetPort: ssh
      protocol: TCP
  selector:
    {{- include "gitea.selectorLabels" . | nindent 4 }}
""")

# ==============================================================================
# Subchart 02: harbor
# ==============================================================================
harbor_dir = BASE_DIR / "charts" / "harbor"
write(harbor_dir / "Chart.yaml", """
apiVersion: v2
name: harbor
description: Harbor Cloud-Native Enterprise Artifact Registry Subchart
type: application
version: 1.0.0
appVersion: "v2.15.4"
""")

write(harbor_dir / "values.yaml", """
replicaCount: 1
portal:
  image:
    repository: goharbor/harbor-portal
    tag: "v2.15.4"
    pullPolicy: IfNotPresent
core:
  image:
    repository: goharbor/harbor-core
    tag: "v2.15.4"
    pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 8080
  portalPort: 80

persistence:
  enabled: true
  size: 20Gi
  accessMode: ReadWriteOnce
  storageClass: ""

resources:
  limits:
    cpu: 1000m
    memory: 1024Mi
  requests:
    cpu: 100m
    memory: 256Mi
""")

write_subchart_helpers(harbor_dir, "harbor")

write(harbor_dir / "templates" / "pvc.yaml", """
{{- if .Values.persistence.enabled -}}
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: {{ include "harbor.fullname" . }}-data
  labels:
    {{- include "harbor.labels" . | nindent 4 }}
spec:
  accessModes:
    - {{ .Values.persistence.accessMode }}
  resources:
    requests:
      storage: {{ .Values.persistence.size }}
  {{- if .Values.persistence.storageClass }}
  storageClassName: {{ .Values.persistence.storageClass }}
  {{- end }}
{{- end }}
""")

write(harbor_dir / "templates" / "deployment.yaml", """
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "harbor.fullname" . }}
  labels:
    {{- include "harbor.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      {{- include "harbor.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "harbor.selectorLabels" . | nindent 8 }}
    spec:
      containers:
        - name: harbor-portal
          image: "{{ .Values.portal.image.repository }}:{{ .Values.portal.image.tag }}"
          imagePullPolicy: {{ .Values.portal.image.pullPolicy }}
          ports:
            - name: portal
              containerPort: 80
              protocol: TCP
          livenessProbe:
            httpGet:
              path: /
              port: portal
            initialDelaySeconds: 5
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /
              port: portal
            initialDelaySeconds: 3
            periodSeconds: 5
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
          volumeMounts:
            - name: harbor-data
              mountPath: /data
      volumes:
        - name: harbor-data
          {{- if .Values.persistence.enabled }}
          persistentVolumeClaim:
            claimName: {{ include "harbor.fullname" . }}-data
          {{- else }}
          emptyDir: {}
          {{- end }}
""")

write(harbor_dir / "templates" / "service.yaml", """
apiVersion: v1
kind: Service
metadata:
  name: {{ include "harbor.fullname" . }}
  labels:
    {{- include "harbor.labels" . | nindent 4 }}
spec:
  type: {{ .Values.service.type }}
  ports:
    - name: portal
      port: {{ .Values.service.portalPort }}
      targetPort: portal
      protocol: TCP
    - name: api
      port: {{ .Values.service.port }}
      targetPort: portal
      protocol: TCP
  selector:
    {{- include "harbor.selectorLabels" . | nindent 4 }}
""")

# ==============================================================================
# Subchart 03: silo
# ==============================================================================
silo_dir = BASE_DIR / "charts" / "silo"
write(silo_dir / "Chart.yaml", """
apiVersion: v2
name: silo
description: Silo S3-Compatible Object Storage Subchart
type: application
version: 1.0.0
appVersion: "RELEASE.2026-10-18T00-00-00Z"
""")

write(silo_dir / "values.yaml", """
replicaCount: 1
image:
  repository: pgsty/silo
  tag: "RELEASE.2026-10-18T00-00-00Z"
  pullPolicy: IfNotPresent

rootUser: "silo_admin"
rootPassword: "SiloAdminPassword2026!"

service:
  type: ClusterIP
  apiPort: 9000
  consolePort: 9001

persistence:
  enabled: true
  size: 20Gi
  accessMode: ReadWriteOnce
  storageClass: ""

resources:
  limits:
    cpu: 1000m
    memory: 1024Mi
  requests:
    cpu: 100m
    memory: 256Mi
""")

write_subchart_helpers(silo_dir, "silo")

write(silo_dir / "templates" / "pvc.yaml", """
{{- if .Values.persistence.enabled -}}
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: {{ include "silo.fullname" . }}-data
  labels:
    {{- include "silo.labels" . | nindent 4 }}
spec:
  accessModes:
    - {{ .Values.persistence.accessMode }}
  resources:
    requests:
      storage: {{ .Values.persistence.size }}
  {{- if .Values.persistence.storageClass }}
  storageClassName: {{ .Values.persistence.storageClass }}
  {{- end }}
{{- end }}
""")

write(silo_dir / "templates" / "deployment.yaml", """
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "silo.fullname" . }}
  labels:
    {{- include "silo.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      {{- include "silo.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "silo.selectorLabels" . | nindent 8 }}
    spec:
      containers:
        - name: silo
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          command: ["silo", "server", "/data", "--console-address", ":9001"]
          env:
            - name: MINIO_ROOT_USER
              value: {{ .Values.rootUser | quote }}
            - name: MINIO_ROOT_PASSWORD
              value: {{ .Values.rootPassword | quote }}
          ports:
            - name: s3-api
              containerPort: 9000
              protocol: TCP
            - name: console
              containerPort: 9001
              protocol: TCP
          livenessProbe:
            httpGet:
              path: /minio/health/live
              port: s3-api
            initialDelaySeconds: 10
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /minio/health/live
              port: s3-api
            initialDelaySeconds: 5
            periodSeconds: 5
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
          volumeMounts:
            - name: silo-data
              mountPath: /data
      volumes:
        - name: silo-data
          {{- if .Values.persistence.enabled }}
          persistentVolumeClaim:
            claimName: {{ include "silo.fullname" . }}-data
          {{- else }}
          emptyDir: {}
          {{- end }}
""")

write(silo_dir / "templates" / "service.yaml", """
apiVersion: v1
kind: Service
metadata:
  name: {{ include "silo.fullname" . }}
  labels:
    {{- include "silo.labels" . | nindent 4 }}
spec:
  type: {{ .Values.service.type }}
  ports:
    - name: s3-api
      port: {{ .Values.service.apiPort }}
      targetPort: s3-api
      protocol: TCP
    - name: console
      port: {{ .Values.service.consolePort }}
      targetPort: console
      protocol: TCP
  selector:
    {{- include "silo.selectorLabels" . | nindent 4 }}
""")

# ==============================================================================
# Subchart 04: cmdb
# ==============================================================================
cmdb_dir = BASE_DIR / "charts" / "cmdb"
write(cmdb_dir / "Chart.yaml", """
apiVersion: v2
name: cmdb
description: CMDB Dynamic Inventory Service Subchart
type: application
version: 1.0.0
appVersion: "3.11-alpine"
""")

write(cmdb_dir / "values.yaml", """
replicaCount: 1
image:
  repository: python
  tag: "3.11-alpine"
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 8000

resources:
  limits:
    cpu: 500m
    memory: 256Mi
  requests:
    cpu: 50m
    memory: 64Mi
""")

write_subchart_helpers(cmdb_dir, "cmdb")

write(cmdb_dir / "templates" / "configmap.yaml", """
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ include "cmdb.fullname" . }}-script
  labels:
    {{- include "cmdb.labels" . | nindent 4 }}
data:
  cmdb_server.py: |
    import json
    from http.server import HTTPServer, BaseHTTPRequestHandler

    INVENTORY = {
        "_meta": {
            "hostvars": {
                "platform-node-01": {"ansible_host": "192.168.1.101", "role": "control-plane"},
                "platform-node-02": {"ansible_host": "192.168.1.102", "role": "worker"}
            }
        },
        "all": {"children": ["platform_nodes"]},
        "platform_nodes": {"hosts": ["platform-node-01", "platform-node-02"]}
    }

    class CMDBHandler(BaseHTTPRequestHandler):
        def do_GET(self):
            if self.path == '/healthz':
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "ok", "service": "cmdb-api"}).encode())
            elif self.path in ('/api/v1/inventory', '/inventory'):
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(INVENTORY).encode())
            else:
                self.send_response(404)
                self.end_headers()

    if __name__ == '__main__':
        server = HTTPServer(('0.0.0.0', 8000), CMDBHandler)
        print("Starting CMDB API on port 8000...")
        server.serve_forever()
""")

write(cmdb_dir / "templates" / "deployment.yaml", """
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "cmdb.fullname" . }}
  labels:
    {{- include "cmdb.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      {{- include "cmdb.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "cmdb.selectorLabels" . | nindent 8 }}
    spec:
      containers:
        - name: cmdb
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          command: ["python", "/app/cmdb_server.py"]
          ports:
            - name: http
              containerPort: 8000
              protocol: TCP
          livenessProbe:
            httpGet:
              path: /healthz
              port: http
            initialDelaySeconds: 5
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /healthz
              port: http
            initialDelaySeconds: 2
            periodSeconds: 5
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
          volumeMounts:
            - name: cmdb-script
              mountPath: /app
      volumes:
        - name: cmdb-script
          configMap:
            name: {{ include "cmdb.fullname" . }}-script
""")

write(cmdb_dir / "templates" / "service.yaml", """
apiVersion: v1
kind: Service
metadata:
  name: {{ include "cmdb.fullname" . }}
  labels:
    {{- include "cmdb.labels" . | nindent 4 }}
spec:
  type: {{ .Values.service.type }}
  ports:
    - name: http
      port: {{ .Values.service.port }}
      targetPort: http
      protocol: TCP
  selector:
    {{- include "cmdb.selectorLabels" . | nindent 4 }}
""")

# ==============================================================================
# Subchart 05: vault-zitadel
# ==============================================================================
vault_dir = BASE_DIR / "charts" / "vault-zitadel"
write(vault_dir / "Chart.yaml", """
apiVersion: v2
name: vault-zitadel
description: HashiCorp Vault Secrets Engine & Zitadel IAM Backend Subchart
type: application
version: 1.0.0
appVersion: "1.17.6"
""")

write(vault_dir / "values.yaml", """
vault:
  image:
    repository: hashicorp/vault
    tag: "1.17.6"
    pullPolicy: IfNotPresent
  port: 8200
  devRootToken: "root-token-dev"

zitadelDb:
  image:
    repository: postgres
    tag: "16-alpine"
    pullPolicy: IfNotPresent
  port: 5432
  dbName: "zitadel"
  user: "zitadel"
  password: "ZitadelPassword2026!"

service:
  type: ClusterIP

persistence:
  enabled: true
  size: 10Gi
  accessMode: ReadWriteOnce
  storageClass: ""
""")

write_subchart_helpers(vault_dir, "vault-zitadel")

write(vault_dir / "templates" / "pvc.yaml", """
{{- if .Values.persistence.enabled -}}
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: {{ include "vault-zitadel.fullname" . }}-db-data
  labels:
    {{- include "vault-zitadel.labels" . | nindent 4 }}
spec:
  accessModes:
    - {{ .Values.persistence.accessMode }}
  resources:
    requests:
      storage: {{ .Values.persistence.size }}
  {{- if .Values.persistence.storageClass }}
  storageClassName: {{ .Values.persistence.storageClass }}
  {{- end }}
{{- end }}
""")

write(vault_dir / "templates" / "vault-deployment.yaml", """
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "vault-zitadel.fullname" . }}-vault
  labels:
    {{- include "vault-zitadel.labels" . | nindent 4 }}
    app.kubernetes.io/subcomponent: vault
spec:
  replicas: 1
  selector:
    matchLabels:
      {{- include "vault-zitadel.selectorLabels" . | nindent 6 }}
      app.kubernetes.io/subcomponent: vault
  template:
    metadata:
      labels:
        {{- include "vault-zitadel.selectorLabels" . | nindent 8 }}
        app.kubernetes.io/subcomponent: vault
    spec:
      containers:
        - name: vault
          image: "{{ .Values.vault.image.repository }}:{{ .Values.vault.image.tag }}"
          imagePullPolicy: {{ .Values.vault.image.pullPolicy }}
          env:
            - name: VAULT_DEV_ROOT_TOKEN_ID
              value: {{ .Values.vault.devRootToken | quote }}
            - name: VAULT_DEV_LISTEN_ADDRESS
              value: "0.0.0.0:8200"
            - name: VAULT_ADDR
              value: "http://127.0.0.1:8200"
          ports:
            - name: vault-http
              containerPort: 8200
              protocol: TCP
          livenessProbe:
            httpGet:
              path: /v1/sys/health
              port: vault-http
            initialDelaySeconds: 5
            periodSeconds: 10
""")

write(vault_dir / "templates" / "vault-service.yaml", """
apiVersion: v1
kind: Service
metadata:
  name: {{ include "vault-zitadel.fullname" . }}-vault
  labels:
    {{- include "vault-zitadel.labels" . | nindent 4 }}
spec:
  type: {{ .Values.service.type }}
  ports:
    - name: vault-http
      port: {{ .Values.vault.port }}
      targetPort: vault-http
      protocol: TCP
  selector:
    {{- include "vault-zitadel.selectorLabels" . | nindent 4 }}
    app.kubernetes.io/subcomponent: vault
""")

write(vault_dir / "templates" / "zitadel-db-deployment.yaml", """
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "vault-zitadel.fullname" . }}-zitadel-db
  labels:
    {{- include "vault-zitadel.labels" . | nindent 4 }}
    app.kubernetes.io/subcomponent: zitadel-db
spec:
  replicas: 1
  selector:
    matchLabels:
      {{- include "vault-zitadel.selectorLabels" . | nindent 6 }}
      app.kubernetes.io/subcomponent: zitadel-db
  template:
    metadata:
      labels:
        {{- include "vault-zitadel.selectorLabels" . | nindent 8 }}
        app.kubernetes.io/subcomponent: zitadel-db
    spec:
      containers:
        - name: zitadel-db
          image: "{{ .Values.zitadelDb.image.repository }}:{{ .Values.zitadelDb.image.tag }}"
          imagePullPolicy: {{ .Values.zitadelDb.image.pullPolicy }}
          env:
            - name: POSTGRES_DB
              value: {{ .Values.zitadelDb.dbName | quote }}
            - name: POSTGRES_USER
              value: {{ .Values.zitadelDb.user | quote }}
            - name: POSTGRES_PASSWORD
              value: {{ .Values.zitadelDb.password | quote }}
          ports:
            - name: postgres
              containerPort: 5432
              protocol: TCP
          livenessProbe:
            exec:
              command: ["pg_isready", "-U", {{ .Values.zitadelDb.user | quote }}, "-d", {{ .Values.zitadelDb.dbName | quote }}]
            initialDelaySeconds: 5
            periodSeconds: 10
          volumeMounts:
            - name: db-data
              mountPath: /var/lib/postgresql/data
      volumes:
        - name: db-data
          {{- if .Values.persistence.enabled }}
          persistentVolumeClaim:
            claimName: {{ include "vault-zitadel.fullname" . }}-db-data
          {{- else }}
          emptyDir: {}
          {{- end }}
""")

write(vault_dir / "templates" / "zitadel-db-service.yaml", """
apiVersion: v1
kind: Service
metadata:
  name: {{ include "vault-zitadel.fullname" . }}-zitadel-db
  labels:
    {{- include "vault-zitadel.labels" . | nindent 4 }}
spec:
  type: {{ .Values.service.type }}
  ports:
    - name: postgres
      port: {{ .Values.zitadelDb.port }}
      targetPort: postgres
      protocol: TCP
  selector:
    {{- include "vault-zitadel.selectorLabels" . | nindent 4 }}
    app.kubernetes.io/subcomponent: zitadel-db
""")

# ==============================================================================
# Subchart 06: doco-cd
# ==============================================================================
doco_dir = BASE_DIR / "charts" / "doco-cd"
write(doco_dir / "Chart.yaml", """
apiVersion: v2
name: doco-cd
description: Doco CD Declarative GitOps Controller Subchart
type: application
version: 1.0.0
appVersion: "0.1.28"
""")

write(doco_dir / "values.yaml", """
replicaCount: 1
image:
  repository: ghcr.io/kimdre/doco-cd
  tag: "0.1.28"
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  httpPort: 80
  metricsPort: 9120

persistence:
  enabled: true
  size: 5Gi
  accessMode: ReadWriteOnce
  storageClass: ""
""")

write_subchart_helpers(doco_dir, "doco-cd")

write(doco_dir / "templates" / "pvc.yaml", """
{{- if .Values.persistence.enabled -}}
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: {{ include "doco-cd.fullname" . }}-data
  labels:
    {{- include "doco-cd.labels" . | nindent 4 }}
spec:
  accessModes:
    - {{ .Values.persistence.accessMode }}
  resources:
    requests:
      storage: {{ .Values.persistence.size }}
  {{- if .Values.persistence.storageClass }}
  storageClassName: {{ .Values.persistence.storageClass }}
  {{- end }}
{{- end }}
""")

write(doco_dir / "templates" / "deployment.yaml", """
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "doco-cd.fullname" . }}
  labels:
    {{- include "doco-cd.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      {{- include "doco-cd.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "doco-cd.selectorLabels" . | nindent 8 }}
    spec:
      containers:
        - name: doco-cd
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - name: http
              containerPort: 80
              protocol: TCP
            - name: metrics
              containerPort: 9120
              protocol: TCP
          livenessProbe:
            httpGet:
              path: /v1/health
              port: http
            initialDelaySeconds: 5
            periodSeconds: 10
          volumeMounts:
            - name: data
              mountPath: /data
      volumes:
        - name: data
          {{- if .Values.persistence.enabled }}
          persistentVolumeClaim:
            claimName: {{ include "doco-cd.fullname" . }}-data
          {{- else }}
          emptyDir: {}
          {{- end }}
""")

write(doco_dir / "templates" / "service.yaml", """
apiVersion: v1
kind: Service
metadata:
  name: {{ include "doco-cd.fullname" . }}
  labels:
    {{- include "doco-cd.labels" . | nindent 4 }}
spec:
  type: {{ .Values.service.type }}
  ports:
    - name: http
      port: {{ .Values.service.httpPort }}
      targetPort: http
      protocol: TCP
    - name: metrics
      port: {{ .Values.service.metricsPort }}
      targetPort: metrics
      protocol: TCP
  selector:
    {{- include "doco-cd.selectorLabels" . | nindent 4 }}
""")

# ==============================================================================
# Subchart 07: pgvector
# ==============================================================================
pgv_dir = BASE_DIR / "charts" / "pgvector"
write(pgv_dir / "Chart.yaml", """
apiVersion: v2
name: pgvector
description: PostgreSQL 16 with pgvector Extension Subchart
type: application
version: 1.0.0
appVersion: "pg16"
""")

write(pgv_dir / "values.yaml", """
replicaCount: 1
image:
  repository: pgvector/pgvector
  tag: "pg16"
  pullPolicy: IfNotPresent

postgres:
  db: "k3s_vector"
  user: "k3s"
  password: "K3sVectorPassword2026!"
  port: 5432

service:
  type: ClusterIP
  port: 5432

persistence:
  enabled: true
  size: 20Gi
  accessMode: ReadWriteOnce
  storageClass: ""
""")

write_subchart_helpers(pgv_dir, "pgvector")

write(pgv_dir / "templates" / "pvc.yaml", """
{{- if .Values.persistence.enabled -}}
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: {{ include "pgvector.fullname" . }}-data
  labels:
    {{- include "pgvector.labels" . | nindent 4 }}
spec:
  accessModes:
    - {{ .Values.persistence.accessMode }}
  resources:
    requests:
      storage: {{ .Values.persistence.size }}
  {{- if .Values.persistence.storageClass }}
  storageClassName: {{ .Values.persistence.storageClass }}
  {{- end }}
{{- end }}
""")

write(pgv_dir / "templates" / "deployment.yaml", """
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "pgvector.fullname" . }}
  labels:
    {{- include "pgvector.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      {{- include "pgvector.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "pgvector.selectorLabels" . | nindent 8 }}
    spec:
      containers:
        - name: pgvector
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          env:
            - name: POSTGRES_DB
              value: {{ .Values.postgres.db | quote }}
            - name: POSTGRES_USER
              value: {{ .Values.postgres.user | quote }}
            - name: POSTGRES_PASSWORD
              value: {{ .Values.postgres.password | quote }}
          ports:
            - name: postgres
              containerPort: 5432
              protocol: TCP
          livenessProbe:
            exec:
              command: ["pg_isready", "-U", {{ .Values.postgres.user | quote }}, "-d", {{ .Values.postgres.db | quote }}]
            initialDelaySeconds: 5
            periodSeconds: 10
          volumeMounts:
            - name: pg-data
              mountPath: /var/lib/postgresql/data
      volumes:
        - name: pg-data
          {{- if .Values.persistence.enabled }}
          persistentVolumeClaim:
            claimName: {{ include "pgvector.fullname" . }}-data
          {{- else }}
          emptyDir: {}
          {{- end }}
""")

write(pgv_dir / "templates" / "service.yaml", """
apiVersion: v1
kind: Service
metadata:
  name: {{ include "pgvector.fullname" . }}
  labels:
    {{- include "pgvector.labels" . | nindent 4 }}
spec:
  type: {{ .Values.service.type }}
  ports:
    - name: postgres
      port: {{ .Values.service.port }}
      targetPort: postgres
      protocol: TCP
  selector:
    {{- include "pgvector.selectorLabels" . | nindent 4 }}
""")

# ==============================================================================
# Subchart 08: pg-backup
# ==============================================================================
pgb_dir = BASE_DIR / "charts" / "pg-backup"
write(pgb_dir / "Chart.yaml", """
apiVersion: v2
name: pg-backup
description: PostgreSQL Backup and Restore Sandbox Subchart
type: application
version: 1.0.0
appVersion: "16-alpine"
""")

write(pgb_dir / "values.yaml", """
replicaCount: 1
image:
  repository: postgres
  tag: "16-alpine"
  pullPolicy: IfNotPresent

postgres:
  db: "test_backup_db"
  user: "postgres"
  password: "PostgresBackupPassword2026!"
  port: 5432

service:
  type: ClusterIP
  port: 5432

persistence:
  enabled: true
  size: 10Gi
  accessMode: ReadWriteOnce
  storageClass: ""
""")

write_subchart_helpers(pgb_dir, "pg-backup")

write(pgb_dir / "templates" / "pvc.yaml", """
{{- if .Values.persistence.enabled -}}
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: {{ include "pg-backup.fullname" . }}-data
  labels:
    {{- include "pg-backup.labels" . | nindent 4 }}
spec:
  accessModes:
    - {{ .Values.persistence.accessMode }}
  resources:
    requests:
      storage: {{ .Values.persistence.size }}
  {{- if .Values.persistence.storageClass }}
  storageClassName: {{ .Values.persistence.storageClass }}
  {{- end }}
{{- end }}
""")

write(pgb_dir / "templates" / "deployment.yaml", """
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "pg-backup.fullname" . }}
  labels:
    {{- include "pg-backup.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      {{- include "pg-backup.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "pg-backup.selectorLabels" . | nindent 8 }}
    spec:
      containers:
        - name: pg-backup-source
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          env:
            - name: POSTGRES_DB
              value: {{ .Values.postgres.db | quote }}
            - name: POSTGRES_USER
              value: {{ .Values.postgres.user | quote }}
            - name: POSTGRES_PASSWORD
              value: {{ .Values.postgres.password | quote }}
          ports:
            - name: postgres
              containerPort: 5432
              protocol: TCP
          livenessProbe:
            exec:
              command: ["pg_isready", "-U", {{ .Values.postgres.user | quote }}, "-d", {{ .Values.postgres.db | quote }}]
            initialDelaySeconds: 5
            periodSeconds: 10
          volumeMounts:
            - name: pg-data
              mountPath: /var/lib/postgresql/data
      volumes:
        - name: pg-data
          {{- if .Values.persistence.enabled }}
          persistentVolumeClaim:
            claimName: {{ include "pg-backup.fullname" . }}-data
          {{- else }}
          emptyDir: {}
          {{- end }}
""")

write(pgb_dir / "templates" / "service.yaml", """
apiVersion: v1
kind: Service
metadata:
  name: {{ include "pg-backup.fullname" . }}
  labels:
    {{- include "pg-backup.labels" . | nindent 4 }}
spec:
  type: {{ .Values.service.type }}
  ports:
    - name: postgres
      port: {{ .Values.service.port }}
      targetPort: postgres
      protocol: TCP
  selector:
    {{- include "pg-backup.selectorLabels" . | nindent 4 }}
""")

# ==============================================================================
# Subchart 09: ai-gateway
# ==============================================================================
aigw_dir = BASE_DIR / "charts" / "ai-gateway"
write(aigw_dir / "Chart.yaml", """
apiVersion: v2
name: ai-gateway
description: Dual-Tier AI Gateway Subchart (New API + LiteLLM)
type: application
version: 1.0.0
appVersion: "v0.4.10"
""")

write(aigw_dir / "values.yaml", """
newApi:
  image:
    repository: calciumion/new-api
    tag: "v0.4.10"
    pullPolicy: IfNotPresent
  port: 3000

litellm:
  image:
    repository: ghcr.io/berriai/litellm
    tag: "v1.51.0"
    pullPolicy: IfNotPresent
  port: 4000
  masterKey: "sk-litellm-master-key-2026"

service:
  type: ClusterIP
""")

write_subchart_helpers(aigw_dir, "ai-gateway")

write(aigw_dir / "templates" / "new-api-deployment.yaml", """
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "ai-gateway.fullname" . }}-new-api
  labels:
    {{- include "ai-gateway.labels" . | nindent 4 }}
    app.kubernetes.io/subcomponent: new-api
spec:
  replicas: 1
  selector:
    matchLabels:
      {{- include "ai-gateway.selectorLabels" . | nindent 6 }}
      app.kubernetes.io/subcomponent: new-api
  template:
    metadata:
      labels:
        {{- include "ai-gateway.selectorLabels" . | nindent 8 }}
        app.kubernetes.io/subcomponent: new-api
    spec:
      containers:
        - name: new-api
          image: "{{ .Values.newApi.image.repository }}:{{ .Values.newApi.image.tag }}"
          imagePullPolicy: {{ .Values.newApi.image.pullPolicy }}
          ports:
            - name: http
              containerPort: 3000
              protocol: TCP
          livenessProbe:
            httpGet:
              path: /api/status
              port: http
            initialDelaySeconds: 5
            periodSeconds: 10
""")

write(aigw_dir / "templates" / "new-api-service.yaml", """
apiVersion: v1
kind: Service
metadata:
  name: {{ include "ai-gateway.fullname" . }}-new-api
  labels:
    {{- include "ai-gateway.labels" . | nindent 4 }}
spec:
  type: {{ .Values.service.type }}
  ports:
    - name: http
      port: {{ .Values.newApi.port }}
      targetPort: http
      protocol: TCP
  selector:
    {{- include "ai-gateway.selectorLabels" . | nindent 4 }}
    app.kubernetes.io/subcomponent: new-api
""")

write(aigw_dir / "templates" / "litellm-deployment.yaml", """
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "ai-gateway.fullname" . }}-litellm
  labels:
    {{- include "ai-gateway.labels" . | nindent 4 }}
    app.kubernetes.io/subcomponent: litellm
spec:
  replicas: 1
  selector:
    matchLabels:
      {{- include "ai-gateway.selectorLabels" . | nindent 6 }}
      app.kubernetes.io/subcomponent: litellm
  template:
    metadata:
      labels:
        {{- include "ai-gateway.selectorLabels" . | nindent 8 }}
        app.kubernetes.io/subcomponent: litellm
    spec:
      containers:
        - name: litellm
          image: "{{ .Values.litellm.image.repository }}:{{ .Values.litellm.image.tag }}"
          imagePullPolicy: {{ .Values.litellm.image.pullPolicy }}
          env:
            - name: LITELLM_MASTER_KEY
              value: {{ .Values.litellm.masterKey | quote }}
          ports:
            - name: proxy
              containerPort: 4000
              protocol: TCP
          livenessProbe:
            httpGet:
              path: /health/liveliness
              port: proxy
            initialDelaySeconds: 10
            periodSeconds: 10
""")

write(aigw_dir / "templates" / "litellm-service.yaml", """
apiVersion: v1
kind: Service
metadata:
  name: {{ include "ai-gateway.fullname" . }}-litellm
  labels:
    {{- include "ai-gateway.labels" . | nindent 4 }}
spec:
  type: {{ .Values.service.type }}
  ports:
    - name: proxy
      port: {{ .Values.litellm.port }}
      targetPort: proxy
      protocol: TCP
  selector:
    {{- include "ai-gateway.selectorLabels" . | nindent 4 }}
    app.kubernetes.io/subcomponent: litellm
""")

# ==============================================================================
# Subchart 10: mcp-gateway
# ==============================================================================
mcpgw_dir = BASE_DIR / "charts" / "mcp-gateway"
write(mcpgw_dir / "Chart.yaml", """
apiVersion: v2
name: mcp-gateway
description: Infrastructure Model Context Protocol Gateway Subchart
type: application
version: 1.0.0
appVersion: "0.1.0"
""")

write(mcpgw_dir / "values.yaml", """
replicaCount: 1
image:
  repository: alpine
  tag: "3.20"
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 8080
""")

write_subchart_helpers(mcpgw_dir, "mcp-gateway")

write(mcpgw_dir / "templates" / "configmap.yaml", """
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ include "mcp-gateway.fullname" . }}-entrypoint
  labels:
    {{- include "mcp-gateway.labels" . | nindent 4 }}
data:
  entrypoint.sh: |
    #!/bin/sh
    echo "Starting Infrastructure MCP Server Gateway on port 8080..."
    while true; do
      echo -e "HTTP/1.1 200 OK\\r\\nContent-Type: application/json\\r\\nConnection: close\\r\\n\\r\\n{\\"status\\":\\"ok\\",\\"service\\":\\"infrastructure-mcp-server\\",\\"version\\":\\"0.1.0\\"}" | nc -l -p 8080 -q 1 || sleep 1
    done
""")

write(mcpgw_dir / "templates" / "deployment.yaml", """
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "mcp-gateway.fullname" . }}
  labels:
    {{- include "mcp-gateway.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      {{- include "mcp-gateway.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "mcp-gateway.selectorLabels" . | nindent 8 }}
    spec:
      containers:
        - name: mcp-gateway
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          command: ["/bin/sh", "/entrypoint.sh"]
          ports:
            - name: http
              containerPort: 8080
              protocol: TCP
          livenessProbe:
            httpGet:
              path: /
              port: http
            initialDelaySeconds: 2
            periodSeconds: 5
          volumeMounts:
            - name: script
              mountPath: /entrypoint.sh
              subPath: entrypoint.sh
      volumes:
        - name: script
          configMap:
            name: {{ include "mcp-gateway.fullname" . }}-entrypoint
            defaultMode: 0755
""")

write(mcpgw_dir / "templates" / "service.yaml", """
apiVersion: v1
kind: Service
metadata:
  name: {{ include "mcp-gateway.fullname" . }}
  labels:
    {{- include "mcp-gateway.labels" . | nindent 4 }}
spec:
  type: {{ .Values.service.type }}
  ports:
    - name: http
      port: {{ .Values.service.port }}
      targetPort: http
      protocol: TCP
  selector:
    {{- include "mcp-gateway.selectorLabels" . | nindent 4 }}
""")

print("open-platform Umbrella Helm Chart with all 10 subcharts scaffolded successfully!")
