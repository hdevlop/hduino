#!/bin/bash
# Package Arduino AVR core data for bundling with the app
# This creates a compressed archive of the AVR core for offline use
#
# Run this script from apps/desktop directory:
#   ./scripts/package-arduino-data.sh

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}=== Package Arduino Core Data ===${NC}"
echo ""

# Paths
BINARIES_DIR="src-tauri/binaries"
RESOURCES_DIR="src-tauri/resources"
OUTPUT_DIR="$RESOURCES_DIR/arduino-data"

# Detect platform
ARCH=$(uname -m)
OS=$(uname -s)

if [ "$OS" = "Linux" ]; then
    CLI_BINARY="$BINARIES_DIR/arduino-cli-x86_64-unknown-linux-gnu"
    APP_DATA_DIR="$HOME/.local/share/com.hduino.app/arduino"
elif [ "$OS" = "Darwin" ]; then
    if [ "$ARCH" = "arm64" ]; then
        CLI_BINARY="$BINARIES_DIR/arduino-cli-aarch64-apple-darwin"
    else
        CLI_BINARY="$BINARIES_DIR/arduino-cli-x86_64-apple-darwin"
    fi
    APP_DATA_DIR="$HOME/Library/Application Support/com.hduino.app/arduino"
else
    echo -e "${RED}Error: Unsupported OS${NC}"
    exit 1
fi

# Check if arduino-cli exists
if [ ! -f "$CLI_BINARY" ]; then
    echo -e "${RED}Error: arduino-cli not found at $CLI_BINARY${NC}"
    echo "Run: ./scripts/download-arduino-cli.sh"
    exit 1
fi

# Check if AVR core is installed
if [ ! -d "$APP_DATA_DIR/packages/arduino/hardware/avr" ]; then
    echo -e "${YELLOW}AVR core not found. Installing...${NC}"
    ./scripts/setup-arduino-data.sh
fi

echo -e "${GREEN}✓${NC} Found AVR core at: $APP_DATA_DIR"

# Create resources directory
mkdir -p "$OUTPUT_DIR"

# Copy AVR core data
echo -e "${YELLOW}Copying AVR core data...${NC}"
mkdir -p "$OUTPUT_DIR/packages/arduino/hardware"
cp -r "$APP_DATA_DIR/packages/arduino/hardware/avr" "$OUTPUT_DIR/packages/arduino/hardware/"

# Copy tools (compiler, uploader - REQUIRED for compilation)
if [ -d "$APP_DATA_DIR/packages/arduino/tools" ]; then
    echo -e "${YELLOW}Copying compilation tools (avr-gcc, avrdude)...${NC}"
    echo -e "${YELLOW}This may take a moment (228MB)...${NC}"
    mkdir -p "$OUTPUT_DIR/packages/arduino"
    cp -r "$APP_DATA_DIR/packages/arduino/tools" "$OUTPUT_DIR/packages/arduino/"
fi

# Copy package index (REQUIRED for arduino-cli)
echo -e "${YELLOW}Copying package index...${NC}"
if [ -d "$APP_DATA_DIR/package_index" ]; then
    cp -r "$APP_DATA_DIR/package_index" "$OUTPUT_DIR/"
else
    echo -e "${YELLOW}Generating package index...${NC}"
    mkdir -p "$APP_DATA_DIR/package_index"
    "$CLI_BINARY" --config-file "$APP_DATA_DIR/arduino-cli.yaml" core update-index --additional-urls ""
    cp -r "$APP_DATA_DIR/package_index" "$OUTPUT_DIR/"
fi

# Copy package index JSON files (REQUIRED for arduino-cli to recognize installed cores)
if [ -f "$APP_DATA_DIR/package_index.json" ]; then
    cp "$APP_DATA_DIR/package_index.json" "$OUTPUT_DIR/"
    cp "$APP_DATA_DIR/package_index.json.sig" "$OUTPUT_DIR/" 2>/dev/null || true
fi

# Copy inventory.yaml if it exists
if [ -f "$APP_DATA_DIR/inventory.yaml" ]; then
    cp "$APP_DATA_DIR/inventory.yaml" "$OUTPUT_DIR/"
fi

# Copy packages metadata (installed.json)
if [ -f "$APP_DATA_DIR/packages/arduino/installed.json" ]; then
    echo -e "${YELLOW}Copying package metadata...${NC}"
    mkdir -p "$OUTPUT_DIR/packages/arduino"
    cp "$APP_DATA_DIR/packages/arduino/installed.json" "$OUTPUT_DIR/packages/arduino/"
fi

# Create a marker file to indicate bundled data
echo "arduino:avr" > "$OUTPUT_DIR/bundled_cores.txt"
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > "$OUTPUT_DIR/bundle_timestamp.txt"

# Show size
echo ""
echo -e "${GREEN}✓ Packaged Arduino data${NC}"
echo "Location: $OUTPUT_DIR"
echo "Size: $(du -sh "$OUTPUT_DIR" | cut -f1)"
echo ""
echo "Contents:"
ls -lh "$OUTPUT_DIR"
echo ""
echo -e "${GREEN}Ready to build!${NC}"
echo "The AVR core will be bundled with your app for offline use."
