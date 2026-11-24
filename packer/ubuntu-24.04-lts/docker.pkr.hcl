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
    linode = {
      version = ">= 1.0.0"
      source  = "github.com/linode/linode"
    }
    amazon = {
      version = ">= 1.2.0"
      source  = "github.com/hashicorp/amazon"
    }
    googlecompute = {
      version = ">= 1.1.0"
      source  = "github.com/hashicorp/googlecompute"
    }
    alicloud = {
      version = ">= 1.1.0"
      source  = "github.com/hashicorp/alicloud"
    }
  }
}

variable "arch" {
  type        = string
  default     = "amd64"
  description = "Target architecture (amd64, arm64)"
  validation {
    condition     = contains(["amd64", "arm64"], var.arch)
    error_message = "arch must be one of: amd64, arm64."
  }
}

variable "iso_url" {
  type    = string
  default = ""
}

variable "iso_checksum" {
  type    = string
  default = "none"
}

# --- Vultr Variables ---
variable "vultr_api_key" {
  type      = string
  sensitive = true
  default   = env("VULTR_API_KEY")
}
variable "vultr_os_id" { type = number; default = 0 }
variable "vultr_region_id" { type = string; default = "nrt" }
variable "vultr_plan_id" { type = string; default = "vc2-2c-4gb" }
variable "vultr_snapshot_description" { type = string; default = "ubuntu2404-docker-golden" }

# --- Linode Variables ---
variable "linode_token" {
  type      = string
  sensitive = true
  default   = env("LINODE_TOKEN")
}
variable "linode_region" { type = string; default = "ap-northeast" }
variable "linode_instance_type" { type = string; default = "g6-standard-2" }

# --- AWS Variables ---
variable "aws_region" { type = string; default = "ap-northeast-1" }
variable "aws_instance_type" { type = string; default = "t3.medium" }

# --- GCP Variables ---
variable "gcp_project_id" { type = string; default = env("GCP_PROJECT_ID") }
variable "gcp_zone" { type = string; default = "asia-northeast1-a" }

# --- Alicloud Variables ---
variable "alicloud_region" { type = string; default = "cn-hongkong" }
variable "alicloud_instance_type" { type = string; default = "ecs.g6.large" }

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

source "qemu" "ubuntu2404_docker" {
  iso_url          = local.iso_url
  iso_checksum     = var.iso_checksum
  output_directory = "output-ubuntu2404-docker-${var.arch}"
  shutdown_command = "echo 'packer' | sudo -S shutdown -P now"
  disk_size        = "20G"
  format           = "qcow2"
  accelerator      = "kvm"
  qemu_binary      = local.qemu_binary
  ssh_username     = "packer"
  ssh_password     = "packer"
  ssh_timeout      = "20m"
  vm_name          = "ubuntu2404-docker-${var.arch}-golden.qcow2"
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

source "vultr" "ubuntu2404_docker" {
  api_key              = var.vultr_api_key
  os_id                = var.vultr_os_id
  plan_id              = var.vultr_plan_id
  region_id            = var.vultr_region_id
  instance_label       = "packer-ubuntu2404-docker"
  snapshot_description = var.vultr_snapshot_description
  state_timeout        = "30m"
  ssh_username         = "root"
  ssh_timeout          = "20m"
}

source "linode" "ubuntu2404_docker" {
  linode_token      = var.linode_token
  image             = "linode/ubuntu24.04"
  region            = var.linode_region
  instance_type     = var.linode_instance_type
  instance_label    = "packer-ubuntu2404-docker"
  image_label       = "ubuntu2404-docker-golden"
  image_description = "Golden image for ubuntu2404 docker"
  ssh_username      = "root"
}

source "amazon-ebs" "ubuntu2404_docker" {
  region        = var.aws_region
  instance_type = var.aws_instance_type
  ami_name      = "ubuntu2404-docker-golden-{{timestamp}}"
  ssh_username  = "ubuntu"
  source_ami_filter {
    filters = {
      name                = "ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-*"
      root-device-type    = "ebs"
      virtualization-type = "hvm"
    }
    most_recent = true
    owners      = ["099720109477"]
  }
}

source "googlecompute" "ubuntu2404_docker" {
  project_id          = var.gcp_project_id
  source_image_family = "ubuntu-2404-lts-amd64"
  source_image_project_id = ["ubuntu-os-cloud"]
  zone                = var.gcp_zone
  image_name          = "ubuntu2404-docker-golden-{{timestamp}}"
  image_family        = "ubuntu2404-docker"
  ssh_username        = "packer"
}

source "alicloud-ecs" "ubuntu2404_docker" {
  region           = var.alicloud_region
  image_name       = "ubuntu2404-docker-golden-{{timestamp}}"
  source_image     = "ubuntu_24_04*"
  instance_type    = var.alicloud_instance_type
  ssh_username     = "root"
  internet_charge_type = "PayByTraffic"
}

build {
  sources = [
    "source.qemu.ubuntu2404_docker",
    "source.vultr.ubuntu2404_docker",
    "source.linode.ubuntu2404_docker",
    "source.amazon-ebs.ubuntu2404_docker",
    "source.googlecompute.ubuntu2404_docker",
    "source.alicloud-ecs.ubuntu2404_docker",
  ]

  provisioner "shell" {
    script = "${path.root}/../scripts/00-base-os.sh"
  }

  provisioner "shell" {
    script = "${path.root}/../scripts/01-security-hardening.sh"
  }

  provisioner "shell" {
    script = "${path.root}/../scripts/10-docker-runtime.sh"
  }

  provisioner "shell" {
    script = "${path.root}/../scripts/90-cloud-init-prep.sh"
  }

  provisioner "shell" {
    script = "${path.root}/../scripts/99-cleanup-golden-image.sh"
  }
}
