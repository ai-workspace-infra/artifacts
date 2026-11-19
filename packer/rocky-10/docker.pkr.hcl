packer {
  required_plugins {
    qemu = {
      version = "~> 1.0"
      source  = "github.com/hashicorp/qemu"
    }
  }
}

variable "arch" {
  type        = string
  default     = "amd64"
  description = "Target architecture: amd64 or arm64"
  validation {
    condition     = contains(["amd64", "arm64"], var.arch)
    error_message = "arch must be either amd64 or arm64."
  }
}

variable "iso_url" {
  type        = string
  default     = ""
  description = "Optional custom ISO URL override"
}

variable "iso_checksum" {
  type    = string
  default = "none"
}

locals {
  default_iso_urls = {
    "amd64" = "https://download.rockylinux.org/pub/rocky/10/isos/x86_64/Rocky-10-latest-x86_64-minimal.iso"
    "arm64" = "https://download.rockylinux.org/pub/rocky/10/isos/aarch64/Rocky-10-latest-aarch64-minimal.iso"
  }
  qemu_binaries = {
    "amd64" = "qemu-system-x86_64"
    "arm64" = "qemu-system-aarch64"
  }
  iso_url     = var.iso_url != "" ? var.iso_url : lookup(local.default_iso_urls, var.arch, local.default_iso_urls["amd64"])
  qemu_binary = lookup(local.qemu_binaries, var.arch, "qemu-system-x86_64")
}

source "qemu" "rocky10_docker" {
  iso_url           = local.iso_url
  iso_checksum      = var.iso_checksum
  output_directory  = "output-rocky10-docker-${var.arch}"
  shutdown_command  = "echo 'packer' | sudo -S shutdown -P now"
  disk_size         = "20G"
  format            = "qcow2"
  accelerator       = "kvm"
  qemu_binary       = local.qemu_binary
  ssh_username      = "packer"
  ssh_password      = "packer"
  ssh_timeout       = "20m"
  vm_name           = "rocky10-docker-${var.arch}-base.qcow2"
  net_device        = "virtio-net"
  disk_interface    = "virtio"
  boot_wait         = "10s"
  boot_command      = [
    "<tab> inst.text inst.ks=http://{{ .HTTPIP }}:{{ .HTTPPort }}/ks.cfg<enter>"
  ]
  http_directory    = "${path.root}/http"
}

build {
  sources = ["source.qemu.rocky10_docker"]

  provisioner "shell" {
    inline = [
      "sudo dnf install -y dnf-plugins-core",
      "sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo",
      "sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin || sudo dnf install -y podman podman-docker docker-compose",
      "sudo systemctl enable docker || true"
    ]
  }

  provisioner "shell" {
    script = "${path.root}/../scripts/cleanup-golden-image.sh"
  }
}
