{{- define "websaas.name" -}}
{{- $name := printf "%s-%s" .root.Release.Name (.name | lower) -}}
{{- if not (regexMatch "^[a-z0-9]([a-z0-9-]*[a-z0-9])?$" $name) }}{{ fail (printf "invalid generated resource name: %s" $name) }}{{ end -}}
{{- if gt (len $name) 63 }}{{ fail (printf "resource name exceeds 63 characters: %s" $name) }}{{ end -}}
{{- $name -}}
{{- end -}}
{{- define "websaas.image" -}}
{{- if not (regexMatch "^[^ @]+@sha256:[a-f0-9]{64}$" .) }}{{ fail "enabled components require an image pinned by sha256 digest" }}{{ end -}}
{{- . -}}
{{- end -}}
{{- define "websaas.labels" -}}
app.kubernetes.io/instance: {{ .root.Release.Name }}
app.kubernetes.io/part-of: distributed-web-saas-fullstack
app.kubernetes.io/component: {{ .name }}
app.kubernetes.io/managed-by: {{ .root.Release.Service }}
helm.sh/chart: {{ printf "%s-%s" .root.Chart.Name .root.Chart.Version | quote }}
{{- end -}}
{{/* Render a fleet. Services keep boundary identity even when Pods are grouped. */}}
{{- define "websaas.fleet" -}}
{{- $root := .root -}}
{{- $items := .items -}}
{{- range $key, $_ := $root.Values.global.podLabels }}
{{- if has $key (list "app.kubernetes.io/instance" "app.kubernetes.io/part-of" "app.kubernetes.io/component" "app.kubernetes.io/managed-by" "helm.sh/chart" "websaas.io/workload") }}{{ fail (printf "global.podLabels cannot override reserved identity label %s" $key) }}{{ end }}
{{- end -}}
{{- $groups := dict -}}
{{- $assigned := dict -}}
{{- if eq .profile "grouped" -}}
  {{- if not .groups }}{{ fail "grouped profile requires nonempty groups" }}{{ end -}}
  {{- range $group, $config := .groups -}}
    {{- $groupName := printf "%s-%s" ($root.Chart.Name | lower) $group -}}
    {{- $ports := dict -}}
    {{- if not $config.members }}{{ fail "each group requires members" }}{{ end -}}
    {{- range $member := $config.members -}}
      {{- if not (hasKey $items $member) }}{{ fail (printf "unknown group member %s" $member) }}{{ end -}}
      {{- if hasKey $assigned $member }}{{ fail (printf "duplicate group member %s" $member) }}{{ end -}}
      {{- $port := toString (index $items $member).port -}}
      {{- if hasKey $ports $port }}{{ fail (printf "group %s has conflicting container port %s; assign unique ports and matching application listeners" $group $port) }}{{ end -}}
      {{- $_ := set $ports $port true -}}
      {{- $_ := set $assigned $member $groupName -}}
    {{- end -}}
    {{- $_ := set $groups $groupName $config -}}
  {{- end -}}
  {{- range $member, $_ := $items -}}
    {{- if not (hasKey $assigned $member) }}{{ fail (printf "grouped profile omits %s" $member) }}{{ end -}}
  {{- end -}}
{{- else -}}
  {{- if .groups }}{{ fail "groups are only valid with grouped profile" }}{{ end -}}
  {{- range $member, $config := $items -}}
    {{- $_ := set $assigned $member $member -}}
    {{- $_ := set $groups $member (dict "members" (list $member) "replicas" $config.replicas "autoscaling" $config.autoscaling) -}}
  {{- end -}}
{{- end -}}
{{- range $group, $config := $groups }}
{{- $context := dict "root" $root "name" $group }}
{{- $scaling := default (dict "enabled" false) $config.autoscaling }}
{{- if and $scaling.enabled (gt (int $scaling.minReplicas) (int $scaling.maxReplicas)) }}{{ fail "HPA minReplicas exceeds maxReplicas" }}{{ end }}
{{- $groupVolumes := deepCopy (default list $root.Values.volumes) }}
{{- range $member := $config.members }}
{{- range (index $items $member).volumes }}{{ $groupVolumes = append $groupVolumes . }}{{ end }}
{{- end }}
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "websaas.name" $context }}
  labels:
    {{- include "websaas.labels" $context | nindent 4 }}
spec:
  {{- if not $scaling.enabled }}
  replicas: {{ $config.replicas }}
  {{- end }}
  revisionHistoryLimit: 3
  selector:
    matchLabels:
      app.kubernetes.io/instance: {{ $root.Release.Name }}
      websaas.io/workload: {{ $group }}
  template:
    metadata:
      labels:
        {{- with $root.Values.global.podLabels }}
        {{- toYaml . | nindent 8 }}
        {{- end }}
        {{- include "websaas.labels" $context | nindent 8 }}
        websaas.io/workload: {{ $group }}
      {{- with $root.Values.podAnnotations }}
      annotations:
        {{- toYaml . | nindent 8 }}
      {{- end }}
    spec:
      automountServiceAccountToken: false
      {{- with $root.Values.global.imagePullSecrets }}
      imagePullSecrets:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with $root.Values.podSecurityContext }}
      securityContext:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with $root.Values.nodeSelector }}
      nodeSelector:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with $root.Values.tolerations }}
      tolerations:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with $root.Values.affinity }}
      affinity:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      containers:
      {{- range $member := $config.members }}
      {{- $item := index $items $member }}
        - name: {{ $member }}
          image: {{ include "websaas.image" $item.image | quote }}
          imagePullPolicy: IfNotPresent
          {{- with $item.command }}
          command: {{ toJson . }}
          {{- end }}
          {{- with $item.args }}
          args: {{ toJson . }}
          {{- end }}
          securityContext:
            {{- toYaml (mergeOverwrite (dict "allowPrivilegeEscalation" false "capabilities" (dict "drop" (list "ALL"))) (default dict $item.securityContext)) | nindent 12 }}
          ports:
            - name: {{ $member | trunc 15 | quote }}
              containerPort: {{ $item.port }}
            {{- with $item.extraPorts }}
            {{- toYaml . | nindent 12 }}
            {{- end }}
          env:
            - name: PORT
              value: {{ $item.port | quote }}
            {{- range $key, $value := $item.env }}
            {{- if eq $key "PORT" }}{{ fail "set the workload port instead of env.PORT" }}{{ end }}
            - name: {{ $key }}
              value: {{ $value | replace "RELEASE_NAME" $root.Release.Name | quote }}
            {{- end }}
          {{- with $item.secretRefs }}
          envFrom:
            {{- range . }}
            - secretRef:
                name: {{ . }}
            {{- end }}
          {{- end }}
          {{- $probes := deepCopy (default dict $item.probes) }}
          {{- range $probe := $probes }}
          {{- range $type := list "httpGet" "tcpSocket" }}
          {{- if hasKey $probe $type }}
          {{- $handler := index $probe $type }}
          {{- if eq (toString $handler.port) "primary" }}{{ $_ := set $handler "port" $item.port }}{{ end }}
          {{- end }}
          {{- end }}
          {{- end }}
          {{- with $probes }}
          {{- toYaml . | nindent 10 }}
          {{- end }}
          resources:
            {{- toYaml $item.resources | nindent 12 }}
          {{- with $item.volumeMounts }}
          volumeMounts:
            {{- toYaml . | nindent 12 }}
          {{- end }}
      {{- end }}
      {{- with $groupVolumes }}
      volumes:
        {{- toYaml . | nindent 8 }}
      {{- end }}
{{- if $scaling.enabled }}
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: {{ include "websaas.name" $context }}
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: {{ include "websaas.name" $context }}
  minReplicas: {{ $scaling.minReplicas }}
  maxReplicas: {{ $scaling.maxReplicas }}
  metrics:
    {{- toYaml $scaling.metrics | nindent 4 }}
{{- end }}
{{- end }}
{{- range $member, $item := $items }}
{{- $context := dict "root" $root "name" $member }}
---
apiVersion: v1
kind: Service
metadata:
  name: {{ include "websaas.name" $context }}
  labels:
    {{- include "websaas.labels" $context | nindent 4 }}
spec:
  type: ClusterIP
  selector:
    app.kubernetes.io/instance: {{ $root.Release.Name }}
    websaas.io/workload: {{ index $assigned $member }}
  ports:
    - name: http
      port: {{ default 80 $item.servicePort }}
      targetPort: {{ $item.port }}
{{- end }}
{{- if $root.Values.networkPolicy.enabled }}
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: {{ include "websaas.name" (dict "root" $root "name" $root.Chart.Name) }}
spec:
  podSelector:
    matchLabels:
      app.kubernetes.io/instance: {{ $root.Release.Name }}
    matchExpressions:
      - key: websaas.io/workload
        operator: In
        values: {{ keys $groups | sortAlpha | toJson }}
  policyTypes: [Ingress]
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app.kubernetes.io/instance: {{ $root.Release.Name }}
{{- end }}
{{- end -}}
