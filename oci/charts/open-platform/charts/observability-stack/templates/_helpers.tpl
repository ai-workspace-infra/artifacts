{{/*
Expand the name of the chart.
*/}}
{{- define "observability-stack.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "observability-stack.fullname" -}}
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
{{- define "observability-stack.labels" -}}
helm.sh/chart: {{ include "observability-stack.name" . }}-{{ .Chart.Version | replace "+" "_" }}
app.kubernetes.io/name: {{ include "observability-stack.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "observability-stack.selectorLabels" -}}
app.kubernetes.io/name: {{ include "observability-stack.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Allowed hosts for mcp-grafana dynamically assembled from domain, services, and localhost
*/}}
{{- define "observability-stack.mcpGrafanaAllowedHosts" -}}
{{- $hosts := list -}}
{{- $svcName := printf "%s-mcp-grafana" (include "observability-stack.fullname" .) -}}
{{- $port := int (.Values.mcp.grafana.port | default 8000) -}}
{{- $ns := .Release.Namespace | default "default" -}}
{{- $hosts = append $hosts "mcp-grafana" -}}
{{- $hosts = append $hosts (printf "mcp-grafana:%d" $port) -}}
{{- $hosts = append $hosts $svcName -}}
{{- $hosts = append $hosts (printf "%s:%d" $svcName $port) -}}
{{- $hosts = append $hosts (printf "%s.%s.svc" $svcName $ns) -}}
{{- $hosts = append $hosts (printf "%s.%s.svc:%d" $svcName $ns $port) -}}
{{- $hosts = append $hosts (printf "%s.%s.svc.cluster.local" $svcName $ns) -}}
{{- $hosts = append $hosts (printf "%s.%s.svc.cluster.local:%d" $svcName $ns $port) -}}
{{- $hosts = append $hosts (printf "mcp-grafana.%s.svc.cluster.local" $ns) -}}
{{- $hosts = append $hosts (printf "mcp-grafana.%s.svc.cluster.local:%d" $ns $port) -}}
{{- if and .Values.mcp.grafana.serviceName (ne .Values.mcp.grafana.serviceName $svcName) -}}
  {{- $customSvc := .Values.mcp.grafana.serviceName -}}
  {{- $hosts = append $hosts $customSvc -}}
  {{- $hosts = append $hosts (printf "%s:%d" $customSvc $port) -}}
  {{- $hosts = append $hosts (printf "%s.%s.svc" $customSvc $ns) -}}
  {{- $hosts = append $hosts (printf "%s.%s.svc:%d" $customSvc $ns $port) -}}
  {{- $hosts = append $hosts (printf "%s.%s.svc.cluster.local" $customSvc $ns) -}}
  {{- $hosts = append $hosts (printf "%s.%s.svc.cluster.local:%d" $customSvc $ns $port) -}}
{{- end -}}
{{- $hosts = append $hosts "localhost" -}}
{{- $hosts = append $hosts (printf "localhost:%d" $port) -}}
{{- $hosts = append $hosts "127.0.0.1" -}}
{{- $hosts = append $hosts (printf "127.0.0.1:%d" $port) -}}
{{- if .Values.domain -}}
  {{- $hosts = append $hosts .Values.domain -}}
  {{- $hosts = append $hosts (printf "%s:443" .Values.domain) -}}
  {{- $hosts = append $hosts (printf "observability.%s" .Values.domain) -}}
  {{- $hosts = append $hosts (printf "observability.%s:443" .Values.domain) -}}
  {{- $hosts = append $hosts (printf "mcp.%s" .Values.domain) -}}
  {{- $hosts = append $hosts (printf "mcp.%s:443" .Values.domain) -}}
{{- end -}}
{{- if and .Values.traefik (and .Values.traefik.ingressRoute .Values.traefik.ingressRoute.host) -}}
  {{- $hosts = append $hosts .Values.traefik.ingressRoute.host -}}
  {{- $hosts = append $hosts (printf "%s:443" .Values.traefik.ingressRoute.host) -}}
{{- end -}}
{{- if and .Values.mcp .Values.mcp.grafana .Values.mcp.grafana.extraAllowedHosts -}}
  {{- range .Values.mcp.grafana.extraAllowedHosts -}}
    {{- $hosts = append $hosts . -}}
  {{- end -}}
{{- end -}}
{{- $hosts | uniq | join "," -}}
{{- end -}}
