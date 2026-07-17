#!/usr/bin/env bash
# Build production frontend and print nginx switch instructions.
# Usage: ./scripts/deploy-static.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

info() { echo "==> $*"; }
die() { echo "error: $*" >&2; exit 1; }

command -v npm >/dev/null 2>&1 || die "npm is required"

info "Installing Puppeteer Chrome deps if needed (Ubuntu)..."
if [[ "$(uname -s)" == Linux ]] && ! ldconfig -p 2>/dev/null | grep -q 'libatk-1.0.so'; then
  npm run install:prerender-deps || die "Install Chrome libs first: npm run install:prerender-deps"
fi

info "Building production site (sitemap + vite + prerender)..."
npm run build

info "Build complete. Static files are in: $ROOT/dist"
echo
echo "CRITICAL: Google currently sees Vite DEV HTML (blank title) if nginx proxies to port 5173."
echo "Point nginx at the dist folder instead of the Vite dev server."
echo
echo "Example nginx site root:"
echo "  root $ROOT/dist;"
echo "  location / {"
echo "    try_files \$uri \$uri/ /index.html;"
echo "  }"
echo
echo "Or copy dist to your web root:"
echo "  sudo rsync -a --delete $ROOT/dist/ /var/www/mathicabs.in/"
echo
echo "Verify crawlers see a title (must NOT contain @vite/client):"
echo "  curl -sL https://mathicabs.in/ | grep -E '<title>|@vite'"
echo
echo "Then in Google Search Console: URL Inspection → Request Indexing for"
echo "  https://mathicabs.in/"
echo "  https://mathicabs.in/madurai-tourism"
echo "  https://mathicabs.in/madurai-tourism-packages"
