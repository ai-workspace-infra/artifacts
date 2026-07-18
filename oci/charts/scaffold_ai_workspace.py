import os

CHART_DIR = "/Users/shenlan/workspaces/ai-workspace-infra/artifacts/oci/charts/ai-workspace"

def create_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        f.write(content)

# 1. Main Chart
create_file(f"{CHART_DIR}/Chart.yaml", """apiVersion: v2
name: ai-workspace
description: A Helm chart for AI Workspace domain (console, bridge, postgres, vault, litellm, qmd, x-memory-hub, caddy)
type: application
version: 0.1.0
appVersion: "1.0.0"
dependencies:
  - name: xworkspace-console
    version: 0.1.0
    repository: "file://./charts/xworkspace-console"
  - name: xworkmate-bridge
    version: 0.1.0
    repository: "file://./charts/xworkmate-bridge"
  - name: postgresql
    version: 0.1.0
    repository: "file://./charts/postgresql"
  - name: vault
    version: 0.1.0
    repository: "file://./charts/vault"
  - name: litellm
    version: 0.1.0
    repository: "file://./charts/litellm"
  - name: qmd
    version: 0.1.0
    repository: "file://./charts/qmd"
  - name: x-memory-hub
    version: 0.1.0
    repository: "file://./charts/x-memory-hub"
  - name: caddy
    version: 0.1.0
    repository: "file://./charts/caddy"
""")

create_file(f"{CHART_DIR}/values.yaml", """# Global values
global:
  domain: local

xworkspace-console:
  enabled: true
xworkmate-bridge:
  enabled: true
postgresql:
  enabled: true
vault:
  enabled: true
litellm:
  enabled: true
qmd:
  enabled: true
x-memory-hub:
  enabled: true
caddy:
  enabled: true
""")

subcharts = ["xworkspace-console", "xworkmate-bridge", "postgresql", "vault", "litellm", "qmd", "x-memory-hub", "caddy"]

for sub in subcharts:
    create_file(f"{CHART_DIR}/charts/{sub}/Chart.yaml", f"""apiVersion: v2
name: {sub}
description: A Helm chart for {sub}
type: application
version: 0.1.0
appVersion: "1.0.0"
""")
    create_file(f"{CHART_DIR}/charts/{sub}/values.yaml", f"""replicaCount: 1
image:
  repository: my-repo/{sub}
  tag: "latest"
  pullPolicy: IfNotPresent
service:
  type: ClusterIP
  port: 80
""")
    create_file(f"{CHART_DIR}/charts/{sub}/templates/deployment.yaml", f"""apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{{{ include "{sub}.fullname" . }}}}
  labels:
    app: {sub}
spec:
  replicas: {{{{ .Values.replicaCount }}}}
  selector:
    matchLabels:
      app: {sub}
  template:
    metadata:
      labels:
        app: {sub}
    spec:
      containers:
        - name: {sub}
          image: "{{{{ .Values.image.repository }}}}:{{{{ .Values.image.tag }}}}"
          imagePullPolicy: {{{{ .Values.image.pullPolicy }}}}
          ports:
            - name: http
              containerPort: {{{{ .Values.service.port }}}}
              protocol: TCP
""")
    create_file(f"{CHART_DIR}/charts/{sub}/templates/service.yaml", f"""apiVersion: v1
kind: Service
metadata:
  name: {{{{ include "{sub}.fullname" . }}}}
  labels:
    app: {sub}
spec:
  type: {{{{ .Values.service.type }}}}
  ports:
    - port: {{{{ .Values.service.port }}}}
      targetPort: http
      protocol: TCP
      name: http
  selector:
    app: {sub}
""")
    create_file(f"{CHART_DIR}/charts/{sub}/templates/_helpers.tpl", f"""{{{{- define "{sub}.name" -}}}}
{{{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}}}
{{{{- end }}}}
{{{{- define "{sub}.fullname" -}}}}
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
""")

print("ai-workspace Helm chart scaffolded successfully.")
