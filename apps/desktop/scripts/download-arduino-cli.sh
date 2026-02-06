#!/bin/bash
# Download arduino-cli binaries for all platforms
# Run this script from apps/desktop directory

set -e

VERSION="1.1.1"
BASE_URL="https://github.com/arduino/arduino-cli/releases/download/v${VERSION}"

BINARIES_DIR="src-tauri/binaries"
mkdir -p "$BINARIES_DIR"

echo "Downloading arduino-cli v${VERSION}..."

# Linux x86_64
echo "Downloading Linux x86_64..."
curl -sL "${BASE_URL}/arduino-cli_${VERSION}_Linux_64bit.tar.gz" | tar xz -C /tmp arduino-cli
mv /tmp/arduino-cli "$BINARIES_DIR/arduino-cli-x86_64-unknown-linux-gnu"
chmod +x "$BINARIES_DIR/arduino-cli-x86_64-unknown-linux-gnu"

# macOS x86_64 (Intel)
echo "Downloading macOS x86_64..."
curl -sL "${BASE_URL}/arduino-cli_${VERSION}_macOS_64bit.tar.gz" | tar xz -C /tmp arduino-cli
mv /tmp/arduino-cli "$BINARIES_DIR/arduino-cli-x86_64-apple-darwin"
chmod +x "$BINARIES_DIR/arduino-cli-x86_64-apple-darwin"

# macOS ARM64 (Apple Silicon)
echo "Downloading macOS ARM64..."
curl -sL "${BASE_URL}/arduino-cli_${VERSION}_macOS_ARM64.tar.gz" | tar xz -C /tmp arduino-cli
mv /tmp/arduino-cli "$BINARIES_DIR/arduino-cli-aarch64-apple-darwin"
chmod +x "$BINARIES_DIR/arduino-cli-aarch64-apple-darwin"

# Windows x86_64
echo "Downloading Windows x86_64..."
curl -sL "${BASE_URL}/arduino-cli_${VERSION}_Windows_64bit.zip" -o /tmp/arduino-cli-win.zip
unzip -q -o /tmp/arduino-cli-win.zip -d /tmp/arduino-cli-win
mv /tmp/arduino-cli-win/arduino-cli.exe "$BINARIES_DIR/arduino-cli-x86_64-pc-windows-msvc.exe"
rm -rf /tmp/arduino-cli-win /tmp/arduino-cli-win.zip

echo ""
echo "✅ Downloaded arduino-cli binaries:"
ls -la "$BINARIES_DIR"

echo ""
echo "Next steps:"
echo "1. Initialize arduino-cli data directory:"
echo "   ./scripts/setup-arduino-data.sh"
