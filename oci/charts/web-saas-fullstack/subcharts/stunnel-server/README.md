# web-saas-stunnel-server

Independent stunnel server Deployment, ClusterIP Service, ConfigMap and ingress
NetworkPolicy. Enable explicitly; provide a digest-pinned image with a `stunnel`
binary and `existingSecret` containing `ca.crt`, `tls.crt`, `tls.key`.

Configure `connect`, `port`, `replicas`, resources and scheduling separately from
the other tunnel role. The client requires `checkHost`; the server requires
`allowedCIDRs` and verifies client certificates. UID/fsGroup 1000 can read the
0440 Secret mount. A TCP probe checks the local listener only.

Run `helm dependency build .`, then `helm lint .` and `helm template example .`
with a reviewed values overlay. See the umbrella README for environment ownership,
certificate rotation and private network routing requirements.
