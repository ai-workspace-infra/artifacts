import os

CHART_DIR = "/Users/shenlan/workspaces/ai-workspace-infra/artifacts/oci/charts/infra-platform"

def create_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        f.write(content)

# 1. Main Chart
create_file(f"{CHART_DIR}/Chart.yaml", """apiVersion: v2
name: infra-platform
description: A Helm chart for Infra Platform domain (gitea, zitadel, observability, caddy)
type: application
version: 0.1.0
appVersion: "1.0.0"
dependencies:
  - name: gitea
    version: 0.1.0
    repository: "file://./charts/gitea"
  - name: zitadel
    version: 0.1.0
    repository: "file://./charts/zitadel"
  - name: observability
    version: 0.1.0
    repository: "file://./charts/observability"
  - name: caddy
    version: 0.1.0
    repository: "file://./charts/caddy"
""")

create_file(f"{CHART_DIR}/values.yaml", """# Global values
global:
  domain: local

gitea:
  enabled: true
zitadel:
  enabled: true
observability:
  enabled: true
caddy:
  enabled: true
""")

subcharts = ["gitea", "zitadel", "observability", "caddy"]

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

print("infra-platform Helm chart scaffolded successfully.")
