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
    "amd64" = "https://releases.ubuntu.com/26.04/ubuntu-26.04-live-server-amd64.iso"
    "arm64" = "https://cdimage.ubuntu.com/releases/26.04/release/ubuntu-26.04-live-server-arm64.iso"
  }
  qemu_binaries = {
    "amd64" = "qemu-system-x86_64"
    "arm64" = "qemu-system-aarch64"
  }
  iso_url     = var.iso_url != "" ? var.iso_url : lookup(local.default_iso_urls, var.arch, local.default_iso_urls["amd64"])
  qemu_binary = lookup(local.qemu_binaries, var.arch, "qemu-system-x86_64")
}

source "qemu" "ubuntu2604_k8s" {
  iso_url           = local.iso_url
  iso_checksum      = var.iso_checksum
  output_directory  = "output-ubuntu2604-k8s-${var.arch}"
  shutdown_command  = "echo 'packer' | sudo -S shutdown -P now"
  disk_size         = "20G"
  format            = "qcow2"
  accelerator       = "kvm"
  qemu_binary       = local.qemu_binary
  ssh_username      = "packer"
  ssh_password      = "packer"
  ssh_timeout       = "20m"
  vm_name           = "ubuntu2604-k8s-${var.arch}-node.qcow2"
  net_device        = "virtio-net"
  disk_interface    = "virtio"
  boot_wait         = "10s"
  boot_command      = [
    "e<down><down><down><end>",
    " autoinstall ds=nocloud-net\\;s=http://{{ .HTTPIP }}:{{ .HTTPPort }}/ ",
    "<f10>"
  ]
  http_directory    = "${path.root}/http"
}

build {
  sources = ["source.qemu.ubuntu2604_k8s"]

  provisioner "shell" {
    inline = [
      "sudo apt-get update",
      "sudo apt-get install -y curl ca-certificates iptables",
      "curl -sfL https://get.k3s.io | INSTALL_K3S_SKIP_START=true sh -",
      "sudo systemctl enable k3s-agent"
    ]
  }

  provisioner "shell" {
    script = "${path.root}/../scripts/cleanup-golden-image.sh"
  }
}
