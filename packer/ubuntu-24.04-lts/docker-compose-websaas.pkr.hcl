packer {
  required_plugins {
    qemu = {
      version = "~> 1.0"
      source  = "github.com/hashicorp/qemu"
    }
    vultr = {
      version = ">= 2.3.2"
      source  = "github.com/vultr/vultr"
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

variable "vultr_api_key" {
  type      = string
  sensitive = true
  default   = env("VULTR_API_KEY")
}

variable "vultr_os_id" {
  type    = number
  default = 0
}

variable "vultr_region_id" {
  type    = string
  default = "nrt"
}

variable "vultr_plan_id" {
  type    = string
  default = "vc2-2c-4gb"
}

variable "vultr_snapshot_description" {
  type    = string
  default = "ubuntu2404-docker-compose-websaas-golden"
}

locals {
  default_iso_urls = {
    "amd64" = "https://releases.ubuntu.com/24.04/ubuntu-24.04.2-live-server-amd64.iso"
    "arm64" = "https://cdimage.ubuntu.com/releases/24.04/release/ubuntu-24.04.2-live-server-arm64.iso"
  }
  qemu_binaries = {
    "amd64" = "qemu-system-x86_64"
    "arm64" = "qemu-system-aarch64"
  }
  iso_url     = var.iso_url != "" ? var.iso_url : lookup(local.default_iso_urls, var.arch, local.default_iso_urls["amd64"])
  qemu_binary = lookup(local.qemu_binaries, var.arch, "qemu-system-x86_64")
}

source "qemu" "ubuntu2404_docker_compose_websaas" {
  iso_url          = local.iso_url
  iso_checksum     = var.iso_checksum
  output_directory = "output-ubuntu2404-docker-compose-websaas-${var.arch}"
  shutdown_command = "echo 'packer' | sudo -S shutdown -P now"
  disk_size        = "40G"
  format           = "qcow2"
  accelerator      = "kvm"
  qemu_binary      = local.qemu_binary
  ssh_username     = "packer"
  ssh_password     = "packer"
  ssh_timeout      = "20m"
  vm_name          = "ubuntu2404-docker-compose-websaas-${var.arch}-golden.qcow2"
  net_device       = "virtio-net"
  disk_interface   = "virtio"
  boot_wait        = "10s"
  boot_command = [
    "e<down><down><down><end>",
    " autoinstall ds=nocloud-net\\;s=http://{{ .HTTPIP }}:{{ .HTTPPort }}/ ",
    "<f10>"
  ]
  http_directory = "${path.root}/http"
}

build {
  sources = ["source.qemu.ubuntu2404_docker_compose_websaas"]

  provisioner "shell" {
    script = "${path.root}/../scripts/setup-websaas-runtime.sh"
  }

  provisioner "shell" {
    script = "${path.root}/../scripts/setup-observability-runtime.sh"
    environment_vars = ["INSTALL_POSTGRES_EXPORTER=1"]
  }

  provisioner "shell" {
    script = "${path.root}/../scripts/cleanup-golden-image.sh"
  }
}

source "vultr" "ubuntu2404_docker_compose_websaas" {
  api_key              = var.vultr_api_key
  os_id                = var.vultr_os_id
  plan_id              = var.vultr_plan_id
  region_id            = var.vultr_region_id
  instance_label       = "packer-ubuntu2404-docker-compose-websaas"
  snapshot_description = var.vultr_snapshot_description
  state_timeout        = "30m"
  ssh_username         = "root"
  ssh_timeout          = "20m"
}

build {
  sources = ["source.vultr.ubuntu2404_docker_compose_websaas"]

  provisioner "shell" {
    script = "${path.root}/../scripts/setup-websaas-runtime.sh"
  }

  provisioner "shell" {
    script = "${path.root}/../scripts/setup-observability-runtime.sh"
    environment_vars = ["INSTALL_POSTGRES_EXPORTER=1"]
  }

  provisioner "shell" {
    script = "${path.root}/../scripts/cleanup-golden-image.sh"
  }
}
