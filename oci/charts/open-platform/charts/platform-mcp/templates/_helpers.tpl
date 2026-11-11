{{- define "platform-mcp.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/* Labels for one component: (dict "root" $ "component" "<name>") */}}
{{- define "platform-mcp.labels" -}}
helm.sh/chart: {{ .root.Chart.Name }}-{{ .root.Chart.Version | replace "+" "_" }}
{{ include "platform-mcp.selectorLabels" . }}
app.kubernetes.io/part-of: platform-mcp
app.kubernetes.io/managed-by: {{ .root.Release.Service }}
{{- end }}

{{- define "platform-mcp.selectorLabels" -}}
app.kubernetes.io/name: {{ .component }}
app.kubernetes.io/instance: {{ .root.Release.Name }}
{{- end }}

{{/* Shared bearer token Secret ref as JSON ({"secret","key"}), or empty when auth is explicitly off. */}}
{{- define "platform-mcp.bearerToken" -}}
{{- $g := dig "mcp" "bearerToken" dict (.Values.global | default dict) -}}
{{- $enabled := ternary $g.enabled true (hasKey $g "enabled") -}}
{{- if $enabled -}}
{{- if not $g.existingSecret }}{{ fail "MCP bearer token auth is on but no Secret is set: set global.mcp.bearerToken.existingSecret (or disable it explicitly with global.mcp.bearerToken.enabled=false)" }}{{ end -}}
{{ dict "secret" $g.existingSecret "key" ($g.key | default "mcp-service-token") | toJson }}
{{- end -}}
{{- end }}

{{/* env entry for the bearer token: (dict "root" $ "env" "<ENV_NAME>") */}}
{{- define "platform-mcp.tokenEnv" -}}
{{- $tok := include "platform-mcp.bearerToken" .root -}}
{{- if and $tok .env }}
{{- $t := $tok | fromJson }}
- name: {{ .env }}
  valueFrom:
    secretKeyRef:
      name: {{ $t.secret | quote }}
      key: {{ $t.key | quote }}
{{- end }}
{{- end }}

{{/* Replica count, omitted when the HPA owns it. */}}
{{- define "platform-mcp.replicas" -}}
{{- if not .Values.hpa.enabled }}
replicas: {{ .Values.replicaCount | default 1 }}
{{- end }}
{{- end }}

{{/* The three VictoriaMetrics-family MCP servers, in render order. */}}
{{- define "platform-mcp.victoriaKeys" -}}
victoriametrics victorialogs victoriatraces
{{- end }}

{{/* Gateway config.json, backends generated from the toggles. */}}
{{- define "platform-mcp.gatewayConfig" -}}
{{- $root := . -}}
{{- $auth := include "platform-mcp.bearerToken" . -}}
{{- $backends := list -}}
{{- range $k := splitList " " (include "platform-mcp.victoriaKeys" .) }}
{{- $v := index $root.Values $k }}
{{- if $v.enabled }}
{{- $b := dict "name" $v.backend.name "capability" $v.backend.capability "transport" "streamable-http" "url" (printf "http://%s.%s.svc.cluster.local:%d/mcp" $v.name $root.Release.Namespace (int $v.port)) "enabled" true }}
{{- if $auth }}{{ $_ := set $b "bearer_token_env" "MCP_SERVICE_TOKEN" }}{{ end }}
{{- $backends = append $backends $b }}
{{- end }}
{{- end }}
{{- $s := .Values.sshMcpServer }}
{{- if $s.enabled }}
{{- $b := dict "name" $s.backend.name "capability" $s.backend.capability "transport" "streamable-http" "url" (printf "http://%s.%s.svc.cluster.local:%d/mcp" $s.name .Release.Namespace (int $s.port)) "timeout_seconds" (int $s.backend.timeoutSeconds) "allowed_tools" $s.backend.allowedTools "disabled_tools" $s.backend.disabledTools "enabled" true }}
{{- if $auth }}{{ $_ := set $b "bearer_token_env" "MCP_SERVICE_TOKEN" }}{{ end }}
{{- $backends = append $backends $b }}
{{- end }}
{{- $backends = concat .Values.gateway.extraBackends $backends }}
{{- dict "server" (dict "name" .Values.gateway.name "version" .Values.gateway.serverVersion) "backends" $backends | toPrettyJson }}
{{- end }}
