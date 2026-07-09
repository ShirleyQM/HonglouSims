#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

PYTHON_BIN="${PYTHON:-}"

has_pillow() {
  "$1" - <<'PY' >/dev/null 2>&1
from PIL import Image
PY
}

if [[ -z "$PYTHON_BIN" ]]; then
  candidates=(
    "/Users/bytedance/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3"
    "python3"
  )
  for candidate in "${candidates[@]}"; do
    if command -v "$candidate" >/dev/null 2>&1 && has_pillow "$candidate"; then
      PYTHON_BIN="$candidate"
      break
    fi
  done
fi

if [[ -z "$PYTHON_BIN" ]] || ! has_pillow "$PYTHON_BIN"; then
  echo "No Python with Pillow found. Set PYTHON=/path/to/python or install Pillow first." >&2
  exit 1
fi

"$PYTHON_BIN" scripts/process_full_body_portraits.py
