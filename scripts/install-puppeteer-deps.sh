#!/usr/bin/env bash
# Install system libraries required by Puppeteer/Chrome on Debian/Ubuntu.
# Needed for: npm run build (postbuild prerender step)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

info() { echo "==> $*"; }
warn() { echo "warning: $*" >&2; }
die() { echo "error: $*" >&2; exit 1; }

if [[ "$(uname -s)" != Linux ]]; then
  die "Linux only. On macOS/Windows, npm run build should work without this script."
fi

if command -v apt-get >/dev/null 2>&1; then
  info "Installing Chrome/Puppeteer libraries via apt..."
  sudo apt-get update
  sudo apt-get install -y \
    ca-certificates \
    fonts-liberation \
    libasound2t64 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
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
    wget \
    xdg-utils \
    2>/dev/null || sudo apt-get install -y \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libx11-6 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxkbcommon0 \
    libxrandr2 \
    libxshmfence1 \
    wget \
    xdg-utils

  info "Ensuring Puppeteer Chrome browser is installed..."
  cd "$ROOT"
  npx puppeteer browsers install chrome

  info "Puppeteer dependencies installed."
  exit 0
fi

if command -v dnf >/dev/null 2>&1; then
  info "Trying Puppeteer chrome --install-deps (RHEL/Fedora)..."
  cd "$ROOT"
  npx puppeteer browsers install chrome --install-deps
  exit 0
fi

die "Unsupported package manager. Install Chrome deps manually: https://pptr.dev/troubleshooting"
