#!/bin/bash
# Initialize Arduino CLI for Hduino Desktop App
# This script sets up the bundled arduino-cli with AVR core
#
# Run this script from apps/desktop directory AFTER downloading binaries:
#   ./scripts/setup-arduino-data.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Hduino Arduino CLI Setup ===${NC}"
echo ""

BINARIES_DIR="src-tauri/binaries"

# Detect current platform
ARCH=$(uname -m)
OS=$(uname -s)

if [ "$OS" = "Linux" ]; then
    CLI_BINARY="$BINARIES_DIR/arduino-cli-x86_64-unknown-linux-gnu"
elif [ "$OS" = "Darwin" ]; then
    if [ "$ARCH" = "arm64" ]; then
        CLI_BINARY="$BINARIES_DIR/arduino-cli-aarch64-apple-darwin"
    else
        CLI_BINARY="$BINARIES_DIR/arduino-cli-x86_64-apple-darwin"
    fi
else
    echo -e "${RED}Error: Unsupported OS: $OS${NC}"
    echo "This script supports Linux and macOS only."
    echo "For Windows, run the equivalent commands in PowerShell."
    exit 1
fi

# Check if arduino-cli binary exists
if [ ! -f "$CLI_BINARY" ]; then
    echo -e "${RED}Error: arduino-cli binary not found at $CLI_BINARY${NC}"
    echo ""
    echo "Please download the arduino-cli binaries first:"
    echo "  ./scripts/download-arduino-cli.sh"
    exit 1
fi

echo -e "${GREEN}✓${NC} Found arduino-cli: $CLI_BINARY"

# Get the app data directory (mirrors what Rust code does)
if [ "$OS" = "Linux" ]; then
    APP_DATA_DIR="$HOME/.local/share/com.hduino.app/arduino"
elif [ "$OS" = "Darwin" ]; then
    APP_DATA_DIR="$HOME/Library/Application Support/com.hduino.app/arduino"
fi

echo -e "${GREEN}✓${NC} Data directory: $APP_DATA_DIR"

# Create data directory
mkdir -p "$APP_DATA_DIR"

# Create arduino-cli config pointing to our data directory
CONFIG_FILE="$APP_DATA_DIR/arduino-cli.yaml"
cat > "$CONFIG_FILE" << EOF
board_manager:
  additional_urls: []
daemon:
  port: "50051"
directories:
  data: $APP_DATA_DIR
  downloads: $APP_DATA_DIR/staging
  user: $APP_DATA_DIR
library:
  enable_unsafe_install: false
logging:
  file: ""
  format: text
  level: info
metrics:
  addr: ":9090"
  enabled: false
output:
  no_color: false
sketch:
  always_export_binaries: false
updater:
  enable_notification: false
EOF

echo -e "${GREEN}✓${NC} Created config: $CONFIG_FILE"

# Initialize arduino-cli
echo ""
echo -e "${YELLOW}Updating board index...${NC}"
"$CLI_BINARY" --config-file "$CONFIG_FILE" core update-index

echo ""
echo -e "${YELLOW}Installing Arduino AVR core (for UNO, Nano, Mega)...${NC}"
echo "This may take a few minutes..."
"$CLI_BINARY" --config-file "$CONFIG_FILE" core install arduino:avr

echo ""
echo -e "${GREEN}=== Setup Complete ===${NC}"
echo ""
echo "Installed cores:"
"$CLI_BINARY" --config-file "$CONFIG_FILE" core list
echo ""
echo "Available boards (sample):"
"$CLI_BINARY" --config-file "$CONFIG_FILE" board listall | head -15
echo "..."
echo ""
echo "Data directory size:"
du -sh "$APP_DATA_DIR"
echo ""
echo -e "${GREEN}You can now run the desktop app:${NC}"
echo "  bun dev:desktop"
