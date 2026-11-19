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
  description = "Target architecture: amd64, arm64, or loong64"
  validation {
    condition     = contains(["amd64", "arm64", "loong64"], var.arch)
    error_message = "arch must be amd64, arm64, or loong64."
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
    "amd64"   = "https://cdimage.debian.org/cdimage/ports/daily-builds/amd64/iso-cd/debian-testing-amd64-netinst.iso"
    "arm64"   = "https://cdimage.debian.org/cdimage/ports/daily-builds/arm64/iso-cd/debian-testing-arm64-netinst.iso"
    "loong64" = "https://cdimage.debian.org/cdimage/ports/daily-builds/loong64/iso-cd/debian-testing-loong64-netinst.iso"
  }
  qemu_binaries = {
    "amd64"   = "qemu-system-x86_64"
    "arm64"   = "qemu-system-aarch64"
    "loong64" = "qemu-system-loongarch64"
  }
  iso_url     = var.iso_url != "" ? var.iso_url : lookup(local.default_iso_urls, var.arch, local.default_iso_urls["amd64"])
  qemu_binary = lookup(local.qemu_binaries, var.arch, "qemu-system-x86_64")
}

source "qemu" "debian14_docker" {
  iso_url           = local.iso_url
  iso_checksum      = var.iso_checksum
  output_directory  = "output-debian14-docker-${var.arch}"
  shutdown_command  = "echo 'packer' | sudo -S shutdown -P now"
  disk_size         = "20G"
  format            = "qcow2"
  accelerator       = "kvm"
  qemu_binary       = local.qemu_binary
  ssh_username      = "packer"
  ssh_password      = "packer"
  ssh_timeout       = "20m"
  vm_name           = "debian14-docker-${var.arch}-base.qcow2"
  net_device        = "virtio-net"
  disk_interface    = "virtio"
  boot_wait         = "10s"
  boot_command      = [
    "<esc><wait>",
    "install <wait>",
    " preseed/url=http://{{ .HTTPIP }}:{{ .HTTPPort }}/preseed.cfg <wait>",
    "debian-installer=en_US.UTF-8 <wait>",
    "auto <wait>",
    "locale=en_US.UTF-8 <wait>",
    "kbd-chooser/method=us <wait>",
    "keyboard-configuration/xkb-keymap=us <wait>",
    "netcfg/get_hostname=debian14-node <wait>",
    "netcfg/get_domain=local <wait>",
    "fb=false <wait>",
    "debconf/frontend=noninteractive <wait>",
    "console-setup/ask_detect=false <wait>",
    "console-keymaps-at/keymap=us <wait>",
    "grub-installer/bootdev=/dev/vda <wait>",
    "<enter><wait>"
  ]
  http_directory    = "${path.root}/http"
}

build {
  sources = ["source.qemu.debian14_docker"]

  provisioner "shell" {
    inline = [
      "sudo apt-get update",
      "sudo apt-get install -y ca-certificates curl gnupg lsb-release",
      "sudo install -m 0755 -d /etc/apt/keyrings",
      "curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg || true",
      "sudo chmod a+r /etc/apt/keyrings/docker.gpg || true",
      "echo \"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian bookworm stable\" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null || true",
      "sudo apt-get update || true",
      "sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin || sudo apt-get install -y docker.io containerd docker-compose",
      "sudo systemctl enable docker"
    ]
  }

  provisioner "shell" {
    script = "${path.root}/../scripts/cleanup-golden-image.sh"
  }
}
