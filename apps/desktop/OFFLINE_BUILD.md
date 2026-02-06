# Building Hduino for Offline Use

This guide explains how to build the Hduino desktop app with bundled Arduino AVR core for complete offline functionality.

## Overview

The desktop app can be built with the Arduino AVR core bundled inside, allowing it to compile Arduino sketches without requiring an internet connection. This is ideal for distributing the app via USB or for environments without internet access.

## Prerequisites

1. Download Arduino CLI binaries for all platforms:
   ```bash
   cd apps/desktop
   ./scripts/download-arduino-cli.sh
   ```

2. Install and setup the AVR core in your local development environment:
   ```bash
   ./scripts/setup-arduino-data.sh
   ```

## Building with Offline Support

### Step 1: Package the Arduino Data

Package the AVR core data into the `resources/` directory:

```bash
cd apps/desktop
./scripts/package-arduino-data.sh
```

This will:
- Copy the AVR core from your local Arduino data directory
- Package it into `src-tauri/resources/arduino-data/`
- Create marker files for bundled cores

Expected size: ~150-200MB

### Step 2: Build the Desktop App

Build the app normally. The bundled Arduino data will be included automatically:

```bash
bun run build
```

The build process will:
- Bundle the Arduino CLI binary (as before)
- Bundle the AVR core data (new!)
- Create platform-specific installers (.deb, .AppImage, .dmg, .exe)

### Step 3: Distribute

Your built app now contains:
- Arduino CLI binary
- Complete AVR core (for Uno, Nano, Mega, etc.)
- All necessary toolchains and libraries

Users can install and use the app completely offline!

## How It Works

1. **First Run**: When a user compiles code for the first time, the app automatically extracts the bundled AVR core data to the app's data directory:
   - Linux: `~/.local/share/com.hduino.app/arduino/`
   - macOS: `~/Library/Application Support/com.hduino.app/arduino/`
   - Windows: `%APPDATA%\com.hduino.app\arduino\`

2. **Subsequent Runs**: The app checks if the AVR core exists before compiling. If it's already extracted, it skips initialization.

3. **Offline Compilation**: The app uses the bundled core to compile sketches without any internet connection.

## Troubleshooting

### Build is too large

The bundled AVR core adds ~150-200MB to your app. If this is too large:
- Consider splitting into "lite" (no bundled cores) and "full" (with cores) versions
- Or prompt users to download cores on first run (requires internet)

### Core not found error

If you get "Platform 'arduino:avr' not found" error:
1. Make sure you ran `./scripts/package-arduino-data.sh` before building
2. Check that `src-tauri/resources/arduino-data/` exists and contains data
3. Verify the resources are listed in `tauri.conf.json` under `bundle.resources`

### Development vs Production

- **Development** (`bun dev`): Uses your local Arduino data directory directly
- **Production** (built app): Extracts bundled data on first run

Make sure you have the AVR core installed locally for development:
```bash
./scripts/setup-arduino-data.sh
```

## File Structure

```
apps/desktop/
├── scripts/
│   ├── download-arduino-cli.sh      # Download CLI binaries
│   ├── setup-arduino-data.sh        # Setup local dev environment
│   └── package-arduino-data.sh      # Package data for bundling
├── src-tauri/
│   ├── binaries/                    # Arduino CLI binaries
│   │   ├── arduino-cli-x86_64-unknown-linux-gnu
│   │   ├── arduino-cli-x86_64-apple-darwin
│   │   ├── arduino-cli-aarch64-apple-darwin
│   │   └── arduino-cli-x86_64-pc-windows-msvc.exe
│   └── resources/                   # Bundled resources
│       └── arduino-data/            # AVR core data (created by package script)
│           ├── packages/
│           │   └── arduino/
│           │       └── hardware/
│           │           └── avr/     # AVR core files
│           ├── package_index/       # Package index
│           ├── bundled_cores.txt    # List of bundled cores
│           └── bundle_timestamp.txt # When it was packaged
└── tauri.conf.json                  # Bundle config includes resources
```

## CI/CD Integration

For automated builds, add this to your CI pipeline:

```yaml
- name: Setup Arduino environment
  run: |
    cd apps/desktop
    ./scripts/download-arduino-cli.sh
    ./scripts/setup-arduino-data.sh
    ./scripts/package-arduino-data.sh

- name: Build desktop app
  run: |
    cd apps/desktop
    bun run build
```

## Notes

- Only the `arduino:avr` core is bundled by default (supports Uno, Nano, Mega, etc.)
- Other boards (ESP32, STM32, etc.) require internet to download their cores
- The bundled data is compressed in the installer and extracted on first run
- Subsequent app launches are fast (no extraction needed)
