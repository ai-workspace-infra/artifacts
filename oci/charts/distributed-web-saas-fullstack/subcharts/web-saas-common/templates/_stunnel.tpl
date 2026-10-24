{{- define "websaas.stunnel.config" -}}
foreground = yes
pid =
syslog = no
debug = notice
[database]
client = {{ ternary "yes" "no" (eq .role "client") }}
accept = 0.0.0.0:{{ .config.port }}
connect = {{ required "stunnel connect is required" .config.connect | replace "RELEASE_NAME" .root.Release.Name }}
CAfile = /tls/{{ .role }}/ca.crt
cert = /tls/{{ .role }}/tls.crt
key = /tls/{{ .role }}/tls.key
verifyChain = yes
{{- if eq .role "client" }}
checkHost = {{ required "stunnelClient.checkHost is required" .config.checkHost }}
{{- else }}
requireCert = yes
{{- end }}
{{- end -}}
{{- define "websaas.stunnel.role" -}}
{{- $root := .root -}}
{{- $role := .role -}}
{{- $config := $root.Values -}}
{{- if $config.enabled }}
{{- $secret := required (printf "stunnel %s existingSecret is required" $role) $config.existingSecret }}
{{- if and (eq $role "server") (not $config.allowedCIDRs) }}{{ fail "stunnelServer.allowedCIDRs is required" }}{{ end }}
{{- $name := printf "stunnel-%s" $role }}
{{- $volumes := list (dict "name" "tls" "secret" (dict "secretName" $secret "defaultMode" 288)) (dict "name" "configuration" "configMap" (dict "name" (printf "%s-%s" $root.Release.Name $name))) }}
{{- $mounts := list (dict "name" "tls" "mountPath" (printf "/tls/%s" $role) "readOnly" true) (dict "name" "configuration" "mountPath" (printf "/etc/stunnel/%s" $role) "readOnly" true) }}
{{- $item := dict "image" $config.image "port" $config.port "servicePort" $config.port "replicas" $config.replicas "resources" $config.resources "command" (list "stunnel") "args" (list (printf "/etc/stunnel/%s/stunnel.conf" $role)) "probes" (dict "readinessProbe" (dict "tcpSocket" (dict "port" $config.port)) "livenessProbe" (dict "tcpSocket" (dict "port" $config.port))) "volumes" $volumes "volumeMounts" $mounts }}
{{- $policy := $config.networkPolicy.enabled }}
{{- $_ := set $root.Values "podSecurityContext" (dict "runAsNonRoot" true "runAsUser" 1000 "runAsGroup" 1000 "fsGroup" 1000) }}
{{- $_ := set $root.Values "networkPolicy" (dict "enabled" false) }}
{{- $_ := set $root.Values.podAnnotations "checksum/stunnel" (include "websaas.stunnel.config" (dict "root" $root "role" $role "config" $config) | sha256sum) }}
{{ include "websaas.fleet" (dict "root" $root "items" (dict $name $item) "profile" "independent" "groups" (dict)) }}
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ $root.Release.Name }}-{{ $name }}
data:
  stunnel.conf: |
    {{- include "websaas.stunnel.config" (dict "root" $root "role" $role "config" $config) | nindent 4 }}
{{- if $policy }}
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: {{ $root.Release.Name }}-{{ $name }}
spec:
  podSelector:
    matchLabels:
      app.kubernetes.io/instance: {{ $root.Release.Name }}
      websaas.io/workload: {{ $name }}
  policyTypes: [Ingress]
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app.kubernetes.io/instance: {{ $root.Release.Name }}
        {{- if eq $role "server" }}
        {{- range $config.allowedCIDRs }}
        - ipBlock:
            cidr: {{ . | quote }}
        {{- end }}
        {{- end }}
      ports:
        - protocol: TCP
          port: {{ $config.port }}
{{- end }}
{{- end }}
{{- end -}}
