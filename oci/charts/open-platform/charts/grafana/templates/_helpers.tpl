{{- define "grafana.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "grafana.fullname" -}}
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

{{- define "grafana.selectorLabels" -}}
app.kubernetes.io/name: {{ include "grafana.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/component: grafana
{{- end }}

{{- define "grafana.labels" -}}
helm.sh/chart: {{ include "grafana.name" . }}-{{ .Chart.Version | replace "+" "_" }}
{{ include "grafana.selectorLabels" . }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{- define "grafana.dataClaim" -}}
{{- .Values.persistence.existingClaim | default (printf "%s-data" (include "grafana.fullname" .)) }}
{{- end }}

{{- define "grafana.mcpSelectorLabels" -}}
app.kubernetes.io/name: {{ include "grafana.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/component: mcp-grafana
{{- end }}

{{/* observability-stack fullname that owns the Victoria* services; empty -> "<release>-observability-stack". */}}
{{- define "grafana.backendFullname" -}}
{{- .Values.backendFullname | default (printf "%s-observability-stack" .Release.Name | trunc 63 | trimSuffix "-") }}
{{- end }}

{{/* MCP bearer token Secret ref: mcp.bearerToken, falling back to global.mcp.bearerToken. */}}
{{- define "grafana.mcpBearerToken" -}}
{{- $g := dig "mcp" "bearerToken" dict (.Values.global | default dict) -}}
{{- $l := .Values.mcp.bearerToken | default dict -}}
{{- $secret := $l.existingSecret | default $g.existingSecret | default "" -}}
{{- $key := $l.key | default $g.key | default "mcp-service-token" -}}
{{- if $secret }}{{ dict "secret" $secret "key" $key | toJson }}{{ end -}}
{{- end }}
