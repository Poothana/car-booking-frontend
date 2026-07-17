#!/usr/bin/env bash
# Install system libraries required by Puppeteer/Chrome on Debian/Ubuntu.
# Needed for: npm run build (postbuild prerender step)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

info() { echo "==> $*"; }
die() { echo "error: $*" >&2; exit 1; }

if [[ "$(uname -s)" != Linux ]]; then
  die "Linux only. On macOS/Windows, npm run build should work without this script."
fi

if ! command -v apt-get >/dev/null 2>&1; then
  die "apt-get not found. Install Chrome deps manually: https://pptr.dev/troubleshooting"
fi

# Prefer t64 package names (Ubuntu 24.04+); fall back to classic names (22.04).
pkg_available() {
  apt-cache show "$1" >/dev/null 2>&1
}

pick_pkg() {
  local preferred="$1" fallback="$2"
  if pkg_available "$preferred"; then
    echo "$preferred"
  else
    echo "$fallback"
  fi
}

ASOUND="$(pick_pkg libasound2t64 libasound2)"
ATK="$(pick_pkg libatk1.0-0t64 libatk1.0-0)"
ATK_BRIDGE="$(pick_pkg libatk-bridge2.0-0t64 libatk-bridge2.0-0)"
CUPS="$(pick_pkg libcups2t64 libcups2)"
GTK="$(pick_pkg libgtk-3-0t64 libgtk-3-0)"
GLIB="$(pick_pkg libglib2.0-0t64 libglib2.0-0)"

info "Installing Chrome/Puppeteer libraries via apt..."
sudo apt-get update
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y \
  ca-certificates \
  fonts-liberation \
  "$ASOUND" \
  "$ATK" \
  "$ATK_BRIDGE" \
  "$CUPS" \
  libdrm2 \
  libgbm1 \
  "$GLIB" \
  "$GTK" \
  libnspr4 \
  libnss3 \
  libpango-1.0-0 \
  libcairo2 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libxkbcommon0 \
  libxrandr2 \
  libxrender1 \
  libxshmfence1 \
  libxss1 \
  libxtst6 \
  libdbus-1-3 \
  wget \
  xdg-utils

info "Ensuring Puppeteer Chrome browser is installed..."
cd "$ROOT"
npx puppeteer browsers install chrome

info "Puppeteer dependencies installed. Run: npm run build"
