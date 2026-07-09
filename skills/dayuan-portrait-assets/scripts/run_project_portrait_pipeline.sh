#!/usr/bin/env bash
set -euo pipefail

repo="${1:-${DAYUAN_GAME_ROOT:-$(pwd)}}"
cd "$repo"

if [[ ! -x "scripts/replace_portraits.sh" ]]; then
  echo "Missing executable scripts/replace_portraits.sh in $repo" >&2
  exit 1
fi

"scripts/replace_portraits.sh"
