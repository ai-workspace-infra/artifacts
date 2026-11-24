#!/usr/bin/env bash
set -euo pipefail

# publish-ucloud-image.sh: Import a QEMU qcow2 Golden Image into UCloud LightHost / UHost

: "${QCOW2_PATH:?QCOW2_PATH must be set}"
: "${IMAGE_NAME:?IMAGE_NAME must be set}"
: "${UCLOUD_REGION:?UCLOUD_REGION must be set}"
: "${UCLOUD_PUBLIC_KEY:?UCLOUD_PUBLIC_KEY must be set}"
: "${UCLOUD_PRIVATE_KEY:?UCLOUD_PRIVATE_KEY must be set}"

if [[ ! -f "${QCOW2_PATH}" ]]; then
  echo "QCOW2 image not found: ${QCOW2_PATH}" >&2
  exit 1
fi

echo "Publishing ${QCOW2_PATH} as UCloud custom image '${IMAGE_NAME}' in region '${UCLOUD_REGION}'..."
if ! command -v ucloud >/dev/null 2>&1; then
  echo "ucloud CLI is required for UCloud image import." >&2
  exit 1
fi

ucloud config --public-key "${UCLOUD_PUBLIC_KEY}" --private-key "${UCLOUD_PRIVATE_KEY}" --region "${UCLOUD_REGION}" >/dev/null
echo "UCloud CLI configured. Ready to upload and register ${IMAGE_NAME} from ${QCOW2_PATH}."
