{{/*
Expand the name of the chart.
*/}}
{{- define "observability-agent.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "observability-agent.fullname" -}}
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
{{- define "observability-agent.labels" -}}
helm.sh/chart: {{ include "observability-agent.name" . }}-{{ .Chart.Version | replace "+" "_" }}
app.kubernetes.io/name: {{ include "observability-agent.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/component: observability-agent
{{- end }}

{{/*
Selector labels
*/}}
{{- define "observability-agent.selectorLabels" -}}
app.kubernetes.io/name: {{ include "observability-agent.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/component: observability-agent
{{- end }}

{{- define "process-exporter.name" -}}
{{- default "process-exporter" .Values.processExporter.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- define "process-exporter.fullname" -}}
{{- default (printf "%s-process" (include "observability-agent.fullname" .)) .Values.processExporter.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- define "process-exporter.selectorLabels" -}}
app.kubernetes.io/name: {{ include "process-exporter.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}
{{- define "process-exporter.serviceAccountName" -}}
{{- default (include "process-exporter.fullname" .) .Values.processExporter.serviceAccount.name -}}
{{- end -}}
