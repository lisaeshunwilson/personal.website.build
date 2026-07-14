#!/usr/bin/env bash
# Regenerates cv.pdf from cv.html using headless Chrome (via puppeteer-core).
# Run this any time cv.html changes, before pushing/deploying.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if ! command -v node >/dev/null 2>&1; then
  echo "Error: Node.js is not installed." >&2
  echo "Install it on macOS with Homebrew:" >&2
  echo "  brew install node" >&2
  exit 1
fi

if [ -z "${CHROME_PATH:-}" ] \
   && [ ! -e "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" ] \
   && [ ! -e "/Applications/Chromium.app/Contents/MacOS/Chromium" ] \
   && [ ! -e "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" ]; then
  echo "Error: no Chrome/Chromium/Edge install found." >&2
  echo "Install Google Chrome (https://google.com/chrome), or set CHROME_PATH" >&2
  echo "to point at your browser binary." >&2
  exit 1
fi

if [ ! -d "$SCRIPT_DIR/node_modules/puppeteer-core" ]; then
  echo "Installing build dependency (puppeteer-core)..."
  (cd "$SCRIPT_DIR" && npm install --no-audit --no-fund)
fi

node "$SCRIPT_DIR/generate-cv-pdf.js"
