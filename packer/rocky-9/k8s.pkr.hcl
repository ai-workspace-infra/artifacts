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
variable "vultr_snapshot_description" { type = string; default = "rocky9-k8s-golden" }

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
    "amd64" = "https://download.rockylinux.org/pub/rocky/9/isos/x86_64/Rocky-9-latest-x86_64-minimal.iso"
    "arm64" = "https://download.rockylinux.org/pub/rocky/9/isos/aarch64/Rocky-9-latest-aarch64-minimal.iso"
  }
  qemu_binaries = {
    "amd64" = "qemu-system-x86_64"
    "arm64" = "qemu-system-aarch64"
  }
  iso_url     = var.iso_url != "" ? var.iso_url : lookup(local.default_iso_urls, var.arch, local.default_iso_urls["amd64"])
  qemu_binary = lookup(local.qemu_binaries, var.arch, "qemu-system-x86_64")
}

source "qemu" "rocky9_k8s" {
  iso_url          = local.iso_url
  iso_checksum     = var.iso_checksum
  output_directory = "output-rocky9-k8s-${var.arch}"
  shutdown_command = "echo 'packer' | sudo -S shutdown -P now"
  disk_size        = "20G"
  format           = "qcow2"
  accelerator      = "kvm"
  qemu_binary      = local.qemu_binary
  ssh_username     = "packer"
  ssh_password     = "packer"
  ssh_timeout      = "20m"
  vm_name          = "rocky9-k8s-${var.arch}-golden.qcow2"
  net_device       = "virtio-net"
  disk_interface   = "virtio"
  boot_wait        = "10s"
  boot_command = [
    "<tab> inst.text inst.ks=http://{{ .HTTPIP }}:{{ .HTTPPort }}/ks.cfg<enter>"
  ]
  http_directory = "${path.root}/http"
}

source "vultr" "rocky9_k8s" {
  api_key              = var.vultr_api_key
  os_id                = var.vultr_os_id
  plan_id              = var.vultr_plan_id
  region_id            = var.vultr_region_id
  instance_label       = "packer-rocky9-k8s"
  snapshot_description = var.vultr_snapshot_description
  state_timeout        = "30m"
  ssh_username         = "root"
  ssh_timeout          = "20m"
}

source "linode" "rocky9_k8s" {
  linode_token      = var.linode_token
  image             = "linode/rocky9"
  region            = var.linode_region
  instance_type     = var.linode_instance_type
  instance_label    = "packer-rocky9-k8s"
  image_label       = "rocky9-k8s-golden"
  image_description = "Golden image for rocky9 k8s"
  ssh_username      = "root"
}

source "amazon-ebs" "rocky9_k8s" {
  region        = var.aws_region
  instance_type = var.aws_instance_type
  ami_name      = "rocky9-k8s-golden-{{timestamp}}"
  ssh_username  = "rocky"
  source_ami_filter {
    filters = {
      name                = "Rocky-9-EC2-Base-*"
      root-device-type    = "ebs"
      virtualization-type = "hvm"
    }
    most_recent = true
    owners      = ["792107900819"]
  }
}

source "googlecompute" "rocky9_k8s" {
  project_id          = var.gcp_project_id
  source_image_family = "rocky-linux-9"
  source_image_project_id = ["rocky-linux-cloud"]
  zone                = var.gcp_zone
  image_name          = "rocky9-k8s-golden-{{timestamp}}"
  image_family        = "rocky9-k8s"
  ssh_username        = "packer"
}

source "alicloud-ecs" "rocky9_k8s" {
  region           = var.alicloud_region
  image_name       = "rocky9-k8s-golden-{{timestamp}}"
  source_image     = "rockylinux_9*"
  instance_type    = var.alicloud_instance_type
  ssh_username     = "root"
  internet_charge_type = "PayByTraffic"
}

build {
  sources = [
    "source.qemu.rocky9_k8s",
    "source.vultr.rocky9_k8s",
    "source.linode.rocky9_k8s",
    "source.amazon-ebs.rocky9_k8s",
    "source.googlecompute.rocky9_k8s",
    "source.alicloud-ecs.rocky9_k8s",
  ]

  provisioner "shell" {
    script = "${path.root}/../scripts/00-base-os.sh"
  }

  provisioner "shell" {
    script = "${path.root}/../scripts/01-security-hardening.sh"
  }

  provisioner "shell" {
    script = "${path.root}/../scripts/12-k3s-runtime.sh"
  }

  provisioner "shell" {
    script = "${path.root}/../scripts/90-cloud-init-prep.sh"
  }

  provisioner "shell" {
    script = "${path.root}/../scripts/99-cleanup-golden-image.sh"
  }
}
