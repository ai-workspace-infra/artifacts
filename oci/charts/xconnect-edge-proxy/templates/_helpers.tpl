{{/*
Expand the name of the chart.
*/}}
{{- define "xconnect-edge-proxy.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "xconnect-edge-proxy.fullname" -}}
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
Create chart name and version as used by the chart label.
*/}}
{{- define "xconnect-edge-proxy.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "xconnect-edge-proxy.labels" -}}
helm.sh/chart: {{ include "xconnect-edge-proxy.chart" . }}
{{ include "xconnect-edge-proxy.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "xconnect-edge-proxy.selectorLabels" -}}
app.kubernetes.io/name: {{ include "xconnect-edge-proxy.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "xconnect-edge-proxy.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "xconnect-edge-proxy.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Resolve Secret name for credentials
*/}}
{{- define "xconnect-edge-proxy.secretName" -}}
{{- if .Values.security.existingSecret }}
{{- .Values.security.existingSecret }}
{{- else }}
{{- printf "%s-credentials" (include "xconnect-edge-proxy.fullname" .) }}
{{- end }}
{{- end }}

{{/*
Resolve metrics port based on selected proxy engine
*/}}
{{- define "xconnect-edge-proxy.metricsPort" -}}
{{- if eq .Values.ingress.provider "fluxgate" }}
{{- default 9102 .Values.engines.fluxgate.metricsPort }}
{{- else if eq .Values.ingress.provider "haproxy" }}
{{- default 8404 .Values.engines.haproxy.metricsPort }}
{{- else if eq .Values.ingress.provider "caddy" }}
{{- default 2019 .Values.engines.caddy.metricsPort }}
{{- else }}
{{- default 8080 .Values.engines.traefik.metricsPort }}
{{- end }}
{{- end }}
