# Platform Bridge - Cross-Platform Architecture

> Monorepo architecture for multi-platform support (Desktop, Web, Mobile)

---

## Decision Summary

| What | Decision |
|------|----------|
| **Monorepo** | Yes - Bun workspaces + Turborepo |
| **Packages** | 2: `@hduino/arduino`, `@hduino/platform` |
| **Apps** | 2: `web` (Next.js), `desktop` (Tauri wrapper) |
| **Save/Load** | IndexedDB in `apps/web` (works everywhere) |
| **Blocks + Codegen** | Combined in `@hduino/arduino` |
| **Adapter Scope** | 4 operations: listPorts, upload, export, import |
| **Desktop** | Tauri wraps same Next.js app |

---

## File Structure

```
hduino/
├── apps/
│   ├── web/                          # Next.js app (runs everywhere)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── stores/
│   │   │   ├── types/
│   │   │   └── lib/
│   │   │       ├── storage/          # IndexedDB (stays here)
│   │   │       ├── workspace.ts
│   │   │       └── serialization.ts
│   │   ├── package.json
│   │   └── next.config.js
│   │
│   └── desktop/                      # Tauri shell (wraps web)
│       ├── src-tauri/
│       │   ├── src/
│       │   │   ├── main.rs
│       │   │   └── commands/
│       │   │       ├── mod.rs
│       │   │       ├── serial.rs
│       │   │       ├── files.rs
│       │   │       └── arduino.rs    # Compile, upload, core management
│       │   ├── binaries/             # Sidecar binaries (per-platform)
│       │   │   └── arduino-cli-*     # Downloaded via script
│       │   ├── Cargo.toml
│       │   └── tauri.conf.json       # → points to apps/web
│       ├── scripts/
│       │   ├── download-arduino-cli.sh  # Download binaries
│       │   └── setup-arduino-data.sh    # Initialize AVR core
│       └── package.json              # Just Tauri CLI
│
├── packages/
│   ├── arduino/                      # @hduino/arduino
│   │   ├── src/
│   │   │   ├── types.ts
│   │   │   ├── theme.ts
│   │   │   ├── toolbox.ts
│   │   │   ├── generator.ts
│   │   │   ├── boards.ts
│   │   │   ├── logic/
│   │   │   │   ├── control.ts
│   │   │   │   ├── operators.ts
│   │   │   │   └── index.ts
│   │   │   ├── hardware/
│   │   │   │   ├── arduino.ts
│   │   │   │   ├── display.ts
│   │   │   │   ├── motors.ts
│   │   │   │   ├── sensor.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── platform/                     # @hduino/platform
│       ├── src/
│       │   ├── types.ts
│       │   ├── detect.ts
│       │   ├── web.ts
│       │   ├── tauri.ts
│       │   └── index.ts
│       └── package.json
│
├── package.json                      # Workspace root
├── turbo.json
└── bun.lockb
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         apps/web (Next.js)                          │
│                    Runs in Browser OR Tauri                         │
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐ │
│  │   Blockly   │  │    Code     │  │   Project   │  │  Settings  │ │
│  │   Editor    │  │  Generator  │  │   Manager   │  │            │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └─────┬──────┘ │
│         │                │                │                │       │
│         └───────┬────────┘                └────────┬───────┘       │
│                 ▼                                  ▼               │
│     ┌───────────────────────┐          ┌──────────────────────┐   │
│     │   @hduino/arduino     │          │      IndexedDB       │   │
│     │                       │          │   (stays in web)     │   │
│     │ • blocks + generators │          └──────────────────────┘   │
│     │ • boards              │                                     │
│     │ • theme + toolbox     │                                     │
│     └───────────────────────┘                                     │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                     @hduino/platform                          │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │                  DeviceAdapter                          │  │  │
│  │  │                                                         │  │  │
│  │  │  • getPlatform() → 'web' | 'tauri'                     │  │  │
│  │  │  • getCapabilities() → { canUpload, canListPorts }     │  │  │
│  │  │  • listPorts() → SerialPort[]                          │  │  │
│  │  │  • upload(port, code, board, onProgress?) → Result     │  │  │
│  │  │  • exportProject(name, content) → void                 │  │  │
│  │  │  • importProject() → {name, content} | null            │  │  │
│  │  │                                                         │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────┬───────────────────────────────────┘  │
│                             │                                       │
└─────────────────────────────┼───────────────────────────────────────┘
                              │
                              │ detectAdapter()
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
          ┌─────────────────┐ ┌─────────────────┐
          │   WebAdapter    │ │  TauriAdapter   │
          ├─────────────────┤ ├─────────────────┤
          │                 │ │                 │
          │ • File API      │ │ • Tauri invoke  │
          │ • Download API  │ │ • Native dialog │
          │ • Web Serial?   │ │ • serialport-rs │
          │                 │ │ • arduino-cli   │
          └────────┬────────┘ └────────┬────────┘
                   │                   │
                   ▼                   ▼
             ┌──────────┐        ┌──────────┐
             │ Browser  │        │ Tauri    │
             │ (PWA)    │        │ Desktop  │
             └──────────┘        └──────────┘
                                       │
                                       │ wraps
                                       ▼
                                 ┌───────────┐
                                 │ apps/web  │
                                 │ (same UI) │
                                 └───────────┘
```

---

## Detection Logic

```typescript
// packages/platform/src/detect.ts

export function detectAdapter(): DeviceAdapter {
  if (typeof window !== 'undefined' && window.__TAURI__) {
    return new TauriAdapter();
  }
  return new WebAdapter();
}
```

---

## Adapter Interface

```typescript
// packages/platform/src/types.ts

export interface DeviceAdapter {
  getPlatform(): 'web' | 'tauri';

  getCapabilities(): {
    canListPorts: boolean;
    canUpload: boolean;
    canAutoDetectBoard: boolean;  // future
    supportsProgress: boolean;     // web serial might not
  };

  listPorts(): Promise<SerialPort[]>;

  upload(
    port: string,
    code: string,
    board: string,
    onProgress?: (stage: 'compiling' | 'uploading', percent: number) => void
  ): Promise<UploadResult>;

  exportProject(name: string, content: string): Promise<void>;
  importProject(): Promise<{ name: string; content: string } | null>;
}

export interface SerialPort {
  path: string;
  manufacturer?: string;
  vendorId?: string;
  productId?: string;
}

export interface UploadResult {
  success: boolean;
  stage?: 'compile' | 'upload';
  message?: string;
  error?: string;
}
```

---

## Tauri Desktop Setup

```json
// apps/desktop/src-tauri/tauri.conf.json
{
  "build": {
    "devPath": "http://localhost:3000",
    "distDir": "../web/.next",
    "beforeDevCommand": "cd ../web && bun dev",
    "beforeBuildCommand": "cd ../web && bun build"
  },
  "package": {
    "productName": "Hduino",
    "version": "0.1.0"
  },
  "tauri": {
    "bundle": {
      "active": true,
      "targets": "all",
      "identifier": "com.hduino.app",
      "resources": ["arduino-cli"]
    }
  }
}
```

---

## Platform Comparison

| Feature | Browser | Tauri Desktop |
|---------|---------|---------------|
| List Ports | Web Serial (Chrome only) | Native (all OS) |
| Upload Code | Limited / Cloud | arduino-cli |
| Export File | Download API | Native dialog |
| Import File | File picker | Native dialog |
| Offline | No | Yes |

---

## TODO List

---

### Part 1: Web Monorepo (Do First)

> Goal: Get monorepo working with web app + packages before adding desktop

---

#### Phase 1: Monorepo + apps/web

- [x] **1.1** Create root `package.json` with Bun workspaces
- [x] **1.2** Create `turbo.json` config
- [x] **1.3** Create `apps/web/` folder structure
- [x] **1.4** Move existing Next.js code to `apps/web`
- [x] **1.5** Update paths and verify `bun dev:web` works

#### Phase 2: @hduino/arduino Package

- [x] **2.1** Create `packages/arduino/package.json`
- [x] **2.2** Move `src/lib/blockly/blocks/` → `packages/arduino/src/blocks/`
- [x] **2.3** Move `src/lib/blockly/generators/` → `packages/arduino/src/generators/`
- [x] **2.4** Move `boards.ts`, `theme.ts`, `toolbox.ts` → `packages/arduino/src/`
- [x] **2.5** Create `packages/arduino/src/index.ts` (exports)
- [x] **2.6** Update `apps/web` imports to use `@hduino/arduino`
- [x] **2.7** Test: blocks load, code generates correctly

#### Phase 3: @hduino/platform Package (Web Only)

- [x] **3.1** Create `packages/platform/package.json`
- [x] **3.2** Create `packages/platform/src/types.ts` (interfaces)
- [x] **3.3** Create `packages/platform/src/detect.ts` (returns WebAdapter for now)
- [x] **3.4** Create `packages/platform/src/web.ts` (WebAdapter implementation)
  - [x] `exportProject()` - download API
  - [x] `importProject()` - file picker
  - [x] `listPorts()` - returns empty or uses Web Serial if available
  - [x] `upload()` - returns "not supported in browser"
- [x] **3.5** Create `packages/platform/src/index.ts` (exports)
- [x] **3.6** Update `apps/web` to use `@hduino/platform` for export/import
  - [x] Add `@hduino/platform` dependency to `apps/web/package.json`
  - [x] Create `usePlatform` hook in `apps/web/src/hooks/`
  - [x] Refactor `projects.ts` to use adapter for export (`downloadProject`)
  - [x] Add `importProjectFromPicker()` using adapter

#### Phase 4: Integration & Testing ✅ CHECKPOINT

- [x] **4.1** Run `bun install` from root - all deps install
- [x] **4.2** Run `bun dev` from root - both packages build
- [ ] **4.3** Test full flow: create project → add blocks → generate code → export (via adapter)
- [ ] **4.4** Test import project (via adapter)
- [x] **4.5** Run `bun build` - production build works
- [ ] **4.6** Run type-check across all packages: `bun type-check`
- [x] **4.7** Verify hot reload works in dev mode
- [ ] **4.8** Test that changes in packages trigger rebuild in apps/web

#### Phase 4.5: Optional Enhancements

- [ ] **4.5.1** Update `turbo.json` with enhanced config:
  - [ ] Add `"ui": "tui"`
  - [ ] Add `type-check` task
  - [ ] Add `inputs` array for build caching

---

### Part 2: Tauri Desktop (Do Later)

> Goal: Wrap the working web app in Tauri for native features

---

#### Phase 5: Tauri Setup

- [x] **5.0** Install Rust and Cargo (prerequisite)
- [x] **5.1** Create `apps/desktop/` folder
- [x] **5.2** Install Tauri CLI: `bun add -D @tauri-apps/cli`
- [x] **5.3** Initialize Tauri: Created Rust project structure manually
  - [x] Created `src-tauri/Cargo.toml`
  - [x] Created `src-tauri/src/main.rs`
  - [x] Created `src-tauri/src/lib.rs`
  - [x] Created `src-tauri/build.rs`
- [x] **5.4** Configure `tauri.conf.json` to point to `apps/web`
- [x] **5.5** Update Turbo config for desktop
  - [x] Added `"ui": "tui"`
  - [x] Added `target/**` to build outputs
  - [x] Added `inputs` array for build caching
  - [x] Added `type-check` task
- [x] **5.6** Generate Tauri application icons
- [x] **5.7** Update root `package.json` with desktop scripts
- [x] **5.8** Install Tauri system dependencies (requires manual sudo)
  - Command: `sudo apt install -y libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev libudev-dev`
- [x] **5.9** Test: `bun dev:desktop` opens app in Tauri window ✅

#### Phase 6: Tauri Rust Commands

- [x] **6.1** Add `serialport` crate to `Cargo.toml`
  - [x] Added `serialport = "4.5"`
  - [x] Added `tauri-plugin-dialog = "2"`
  - [x] Added `thiserror = "2"`
- [x] **6.2** Create `src-tauri/src/commands/serial.rs`
  - [x] `list_ports()` command
- [x] **6.3** Create `src-tauri/src/commands/files.rs`
  - [x] `save_file_dialog()` command
  - [x] `open_file_dialog()` command
- [x] **6.4** Register commands in `main.rs`
- [x] **6.5** Create `src-tauri/src/commands/mod.rs` module
- [x] **6.6** Update `lib.rs` to export commands
- **Note**: Requires `libudev-dev` on Linux: `sudo apt install libudev-dev`

#### Phase 7: TauriAdapter

- [x] **7.1** Create `packages/platform/src/tauri.ts`
- [x] **7.2** Implement all DeviceAdapter methods using Tauri invoke
- [x] **7.3** Update `detect.ts` to return TauriAdapter when `window.__TAURI__`
- [x] **7.4** Update package exports in `index.ts`
- [ ] **7.5** Test: export/import uses native dialogs in Tauri

#### Phase 8: Arduino CLI

##### 8A: Rust Integration (Code) ✅

- [x] **8.1** Configure Tauri to bundle `arduino-cli` binary
  - [x] Updated `tauri.conf.json` with resources config for arduino-cli
  - [x] Updated `Cargo.toml` with tokio and tempfile dependencies
- [x] **8.2** Create `compile_code()` Rust command
  - [x] Created `apps/desktop/src-tauri/src/commands/arduino.rs`
  - [x] Implements sketch creation, compilation via arduino-cli
- [x] **8.3** Create `upload_code()` Rust command
  - [x] Combined compile + upload in single command
  - [x] Proper error handling with custom ArduinoError type
- [x] **8.4** Add progress reporting via Tauri events
  - [x] Emits `compile-progress` events with stage/percent/message
  - [x] Frontend listens via Tauri event API
- [x] **8.5** Create `useUpload` hook for progress tracking
  - [x] Created `apps/web/src/hooks/useUpload.ts`
  - [x] Tracks upload state, progress, and errors
  - [x] Updated `@hduino/platform` exports with `getAdapter()`

##### 8B: Binary Setup ✅

- [x] **8.6** Created download script for all platforms
  - [x] `apps/desktop/scripts/download-arduino-cli.sh`
  - [x] Downloads Linux, macOS (Intel + ARM), Windows binaries
  - [x] Places binaries in `src-tauri/binaries/` with Tauri sidecar naming
- [x] **8.7** Configured Tauri sidecar binary bundling
  - [x] Updated `tauri.conf.json` with `externalBin` config
  - [x] Binaries auto-selected per platform at build time

##### 8C: Initialize Arduino CLI ✅

- [x] **8.8** Created setup script for AVR core
  - [x] `apps/desktop/scripts/setup-arduino-data.sh`
  - [x] Creates config in app data dir (`~/.local/share/com.hduino.app/arduino`)
  - [x] Installs Arduino AVR core for offline UNO/Nano/Mega support
- [x] **8.9** Updated Rust code to use app data directory
  - [x] Config file created automatically on first run
  - [x] Falls back to system PATH if sidecar not found

**Setup Commands:**
```bash
cd apps/desktop
./scripts/download-arduino-cli.sh   # Download binaries
./scripts/setup-arduino-data.sh     # Install AVR core
```

##### 8D: Core Management ✅

- [x] **8.10** Added core management Rust commands
  - [x] `list_installed_cores()` - List installed cores
  - [x] `list_installed_boards()` - List available boards
  - [x] `check_core_status()` - Check if core is installed
  - [x] `install_core()` - Install a core
  - [x] `search_cores()` - Search available cores
  - [x] `get_bundled_cores()` - Get list of bundled cores
- [x] **8.11** Updated `@hduino/platform` with core management
  - [x] Added `CoreInfo`, `BoardInfo`, `CoreStatus` types
  - [x] Updated `DeviceAdapter` interface with core methods
  - [x] Implemented in `TauriAdapter` and `WebAdapter`
- [x] **8.12** Created core management UI components
  - [x] `useCoreManager` hook for React
  - [x] `BoardManagerDialog` - Browse and install cores
  - [x] `CoreInstallDialog` - Wizard for missing core installation

##### 8E: Testing

- [ ] **8.13** Test full upload flow: blocks → compile → upload to Arduino
- [ ] **8.14** Test core installation via Board Manager UI
- [ ] **8.15** Test offline compilation with bundled AVR core

---

## Progress Tracker

| Phase | Description | Status |
|-------|-------------|--------|
| **Part 1** | **Web Monorepo** | |
| 1 | Monorepo + apps/web | ✅ Complete |
| 2 | @hduino/arduino | ✅ Complete |
| 3 | @hduino/platform (web) | ✅ Complete |
| 4 | Integration & Testing | ⬜ Pending |
| **Part 2** | **Tauri Desktop** | |
| 5 | Tauri Setup | ✅ Complete |
| 6 | Rust Commands | ✅ Complete |
| 7 | TauriAdapter | ✅ Complete |
| 8 | Arduino CLI | ✅ Complete |
| | 8A: Rust Integration | ✅ Complete |
| | 8B: Binary Setup | ✅ Complete |
| | 8C: Initialize CLI | ✅ Complete |
| | 8D: Core Management | ✅ Complete |
| | 8E: Testing | ⬜ Pending |

---

## Commands

```bash
# Root
bun install              # Install all deps
bun dev                  # Run all in dev mode (turbo)
bun build                # Build all (turbo)
bun type-check           # Type check all packages
bun clean                # Clean all build artifacts

# Specific apps
bun dev:web              # Just Next.js
bun dev:desktop          # Tauri + Next.js

# Build desktop
bun build:desktop        # Creates installer

# Package development
cd packages/arduino && bun dev    # Watch mode for arduino package
cd packages/platform && bun dev   # Watch mode for platform package

# Desktop Setup (First Time)
cd apps/desktop
./scripts/download-arduino-cli.sh   # Download arduino-cli binaries
./scripts/setup-arduino-data.sh     # Initialize AVR core for UNO/Nano/Mega
```

---

## New Components (Phase 8D)

### Hooks
| Hook | Location | Description |
|------|----------|-------------|
| `useCoreManager` | `apps/web/src/hooks/useCoreManager.ts` | Core management (list, install, search) |

### UI Components
| Component | Location | Description |
|-----------|----------|-------------|
| `BoardManagerDialog` | `apps/web/src/components/editor/Toolbar/BoardManagerDialog.tsx` | Browse/install Arduino cores |
| `CoreInstallDialog` | `apps/web/src/components/editor/Toolbar/CoreInstallDialog.tsx` | Wizard for missing core installation |

### Platform Types
| Type | Description |
|------|-------------|
| `CoreInfo` | Arduino core information (id, name, version) |
| `BoardInfo` | Arduino board information (name, fqbn) |
| `CoreStatus` | Core installation status (installed, bundled) |

---

## Resources

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Turborepo + Bun](https://turbo.build/repo/docs/getting-started/installation#install-per-package-manager)
- [Tauri Documentation](https://tauri.app/v1/guides/)
- [Tauri + Next.js Guide](https://tauri.app/v1/guides/getting-started/setup/next-js)
- [serialport-rs crate](https://crates.io/crates/serialport)
- [Web Serial API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API)
- [arduino-cli](https://arduino.github.io/arduino-cli/)
