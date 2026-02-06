# Hduino - Project Memory

> Comprehensive reference for AI assistants. Last updated: 2026-02-02 (Image Optimization & Monorepo Structure)

## Overview

**Hduino** is a visual block-based programming IDE for Arduino using Blockly. Multi-platform application supporting web (browser) and desktop (Tauri).

- **Version**: 0.1.0
- **Architecture**: Monorepo (Bun workspaces + Turborepo)
- **Stack**: Next.js 16 + React 19 + TypeScript + Tailwind 4 + Zustand + IndexedDB
- **Platforms**: Web (PWA), Desktop (Tauri wrapper)

## Monorepo Structure

```
hduino/
├── apps/
│   ├── web/                          # Next.js app (runs everywhere)
│   │   ├── src/
│   │   │   ├── app/                  # Next.js App Router
│   │   │   ├── components/           # UI components
│   │   │   ├── hooks/                # React hooks
│   │   │   ├── stores/               # Zustand stores
│   │   │   ├── types/                # TypeScript types
│   │   │   └── lib/                  # Utility libraries
│   │   ├── public/                   # Static assets
│   │   ├── package.json
│   │   └── next.config.ts
│   │
│   └── desktop/                      # Tauri shell (wraps web)
│       ├── src-tauri/
│       │   ├── src/                  # Rust source code
│       │   │   ├── main.rs
│       │   │   └── commands/         # Tauri commands
│       │   ├── binaries/             # Sidecar binaries (arduino-cli)
│       │   ├── Cargo.toml
│       │   └── tauri.conf.json
│       ├── scripts/                  # Setup scripts
│       └── package.json
│
├── packages/
│   ├── arduino/                      # @hduino/arduino
│   │   ├── src/
│   │   │   ├── blocks/               # Blockly block definitions
│   │   │   ├── generators/           # Arduino code generators
│   │   │   ├── logic/                # Logic blocks
│   │   │   ├── hardware/             # Hardware blocks
│   │   │   ├── types.ts
│   │   │   ├── theme.ts
│   │   │   ├── toolbox.ts
│   │   │   ├── generator.ts
│   │   │   ├── boards.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── platform/                     # @hduino/platform
│       ├── src/
│       │   ├── types.ts              # Platform adapter interfaces
│       │   ├── detect.ts             # Auto-detect platform
│       │   ├── web.ts                # Web adapter
│       │   ├── tauri.ts              # Tauri adapter
│       │   └── index.ts
│       └── package.json
│
├── docs/                             # Documentation
│   └── memo.md                       # This file
│
├── Todos/                            # Architecture docs
│   └── todo.md                       # Platform bridge plan
│
├── package.json                      # Workspace root
├── turbo.json                        # Turborepo config
└── bun.lockb                         # Lockfile
```

## Path Aliases (tsconfig.json)

```typescript
@/components  → apps/web/src/components
@/lib         → apps/web/src/lib
@/hooks       → apps/web/src/hooks
@/stores      → apps/web/src/stores
@/types       → apps/web/src/types
@/constants   → apps/web/src/constants
@/assets      → apps/web/src/assets
@hduino/arduino   → packages/arduino
@hduino/platform  → packages/platform
```

## Web App Directory Structure (apps/web/src/)

```
apps/web/src/
├── app/                    # Next.js App Router
│   ├── (home)/projects/    # Projects listing page
│   ├── editor/[projectId]/ # Main editor page
│   └── globals.css         # Global styles
│
├── components/
│   ├── editor/             # Toolbar, Sidebar, CodePanel, Workspace
│   │   ├── Toolbar/        # Toolbar buttons and dialogs
│   │   └── Sidebar/        # Category sidebar
│   ├── projects/           # ProjectList, ProjectCard, dialogs
│   ├── shared/             # Logo, BoardTypeCarousel, etc.
│   └── ui/                 # shadcn/ui components
│
├── lib/
│   ├── storage/            # IndexedDB (stays in web)
│   │   ├── indexeddb.ts    # DB setup
│   │   ├── projects.ts     # Project CRUD
│   │   └── settings.ts     # User settings
│   ├── workspace.ts        # Blockly workspace management
│   ├── serialization.ts    # Workspace XML serialization
│   └── utils.ts            # Utility functions
│
├── hooks/
│   ├── useBlockly.ts       # Workspace initialization
│   ├── useEditor.ts        # Editor state
│   ├── useProject.ts       # Single project ops
│   ├── useProjects.ts      # Project list ops
│   ├── useAutoSave.ts      # Auto-save with timer (3s delay)
│   ├── useUpload.ts        # Upload with progress tracking
│   └── useCoreManager.ts   # Arduino core management
│
├── stores/
│   ├── editorStore.ts      # Workspace, code, zoom, dirty/saving flags
│   ├── projectStore.ts     # Projects list, CRUD, dialogs
│   └── variableDialogStore.ts # Blockly variable dialog state
│
├── types/
│   ├── project.ts          # Project, ProjectRecord
│   ├── arduino.ts          # BoardType, pins, baud rates
│   ├── block.ts            # Block definitions
│   └── editor.ts           # Editor state types
│
├── constants/
│   ├── editorConfig.ts     # Zoom, panel sizes
│   └── categories.ts       # Block categories
│
└── assets/                 # Images and icons
    ├── img/                # Component images
    └── icons/              # Icon assets
```

---

## Platform Packages

### @hduino/arduino

Shared package containing all Blockly blocks, code generators, board configurations, and theme.

**Key exports:**
```typescript
import {
  BOARD_PROFILES,    // Board configurations
  BOARD_KEYS,        // Available board types
  CATEGORY_COLORS,   // Block colors from theme
  arduinoGenerator,  // Code generator
  Order              // Generator precedence
} from '@hduino/arduino';
```

### @hduino/platform

Platform abstraction layer for cross-platform features (file operations, serial ports, Arduino compilation).

**Key exports:**
```typescript
import {
  getAdapter,          // Get current platform adapter
  detectAdapter,       // Auto-detect platform (web/tauri)
  type DeviceAdapter,  // Adapter interface
  type SerialPort,     // Serial port type
  type UploadResult    // Upload result type
} from '@hduino/platform';
```

**Platform Capabilities:**

| Feature | Browser (Web) | Desktop (Tauri) |
|---------|---------------|-----------------|
| List Ports | Web Serial (Chrome only) | Native (all OS) |
| Upload Code | Not supported | arduino-cli |
| Export File | Download API | Native dialog |
| Import File | File picker | Native dialog |
| Offline | No | Yes |
| Core Management | No | Yes |

---

## Image Optimization (2026-02-02)

All images now use Next.js `Image` component for sharp rendering on high-DPI displays.

### Changes Made

1. **Converted `<img>` to `Image` component** in 11 files:
   - Logo component
   - All toolbar buttons (8 files)
   - BoardTypeCarousel
   - EmptyState
   - CategoryIcons
   - CategorySidebar

2. **Updated global CSS** (`apps/web/src/app/globals.css`):
   ```css
   /* Fix blurry images - use high-quality rendering for smooth images */
   img {
     image-rendering: -webkit-optimize-contrast;
     image-rendering: auto;
     -webkit-font-smoothing: antialiased;
     -moz-osx-font-smoothing: grayscale;
   }

   /* Ensure Next.js Image components render sharply on high-DPI displays */
   img[srcset] {
     image-rendering: auto;
   }
   ```

### Image Component Pattern

```typescript
import Image from 'next/image';

// For imported images
import logoImg from '@/assets/img/logo.png';
<Image src={logoImg} alt="Logo" width={40} height={40} unoptimized={false} />

// For public folder images
<Image src="/icons/logo.png" alt="Logo" width={40} height={40} unoptimized={false} />
```

**Why it works:**
- `unoptimized={false}` enables per-image optimization even with global `unoptimized: true`
- Next.js Image automatically handles high-DPI displays with proper srcsets
- CSS `image-rendering: auto` ensures smooth scaling instead of pixelation

---

## Block Definition Pattern

Blocks are defined in `src/lib/blockly/blocks/{category}/`. Each block needs a matching generator.

### Standard Block Template

```typescript
import * as Blockly from 'blockly/core';
import { CATEGORY_COLORS } from '../../theme';
import { Arduino } from '../../arduino/boards';
import { Types } from '../../arduino/types';

Blockly.Blocks['block_name'] = {
  init: function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLORS.arduino);  // Use theme colors
    this.setHelpUrl('http://...');

    // Input types:
    this.appendDummyInput()                           // No connection
      .appendField('label')
      .appendField(new Blockly.FieldDropdown([['A', 'a']]), 'FIELD');
    this.appendValueInput('INPUT_NAME')               // Accepts value block
      .setCheck('Number');
    this.appendStatementInput('DO');                  // Accepts statement blocks

    // Connection types:
    this.setOutput(true, 'Number');                   // Has output (value block)
    this.setPreviousStatement(true, null);            // Can connect above
    this.setNextStatement(true, null);                // Can connect below

    this.setInputsInline(true);
    this.setTooltip('...');
  },

  // For blocks with pin dropdowns - called when board changes
  updateFields: function (this: Blockly.Block) {
    Arduino.Boards.refreshBlockFieldDropdown(this, 'PIN', 'digitalPins');
  },

  // Return block's output type for type checking
  getBlockType: function () {
    return Types.NUMBER;
  },
};
```

### JSON-style Block Definition

```typescript
Blockly.Blocks['block_name'] = {
  init: function (this: Blockly.Block) {
    this.jsonInit({
      type: 'block_name',
      message0: 'set %1 to %2',
      args0: [
        { type: 'field_dropdown', name: 'PIN', options: [['0', '0']] },
        { type: 'input_value', name: 'VALUE' },
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: CATEGORY_COLORS.arduino,
    });
  },
};
```

---

## Generator Pattern

Generators in `src/lib/blockly/generators/{category}/` produce Arduino C++ code.

```typescript
import { arduinoGenerator, Order } from '../../arduino/generator';

// Statement block (no return value)
arduinoGenerator.forBlock['block_name'] = function (block, generator) {
  const pin = block.getFieldValue('PIN');
  const value = generator.valueToCode(block, 'VALUE', Order.ATOMIC);

  // Add to setup() function
  generator.addSetup('unique_key', `pinMode(${pin}, OUTPUT);`);

  // Add #include at top
  generator.addInclude('servo', '#include <Servo.h>');

  // Add global variable/declaration
  generator.addDeclaration('var_name', 'int myVar = 0;');

  // Return code for loop() or inline
  return `digitalWrite(${pin}, ${value});\n`;
};

// Value block (returns a value)
arduinoGenerator.forBlock['read_sensor'] = function (block, generator) {
  const pin = block.getFieldValue('PIN');
  return [`analogRead(${pin})`, Order.ATOMIC];
};
```

### Generator Order (Precedence)

```typescript
Order.ATOMIC        // 0 - Highest (literals, parentheses)
Order.UNARY_POSTFIX // 1 - x++ x--
Order.UNARY_PREFIX  // 2 - ++x --x !x ~x
Order.MULTIPLICATIVE// 3 - * / %
Order.ADDITIVE      // 4 - + -
Order.RELATIONAL    // 6 - < <= > >=
Order.EQUALITY      // 7 - == !=
Order.LOGICAL_AND   // 11
Order.LOGICAL_OR    // 12
Order.NONE          // 99 - Lowest
```

---

## Arduino Generator API

Located in `src/lib/blockly/arduino/generator.ts`:

```typescript
// Add code sections
generator.addInclude(tag: string, code: string)      // #include statements
generator.addDeclaration(tag: string, code: string)  // Global vars/objects
generator.addSetup(tag: string, code: string)        // setup() function body

// Get code from connected blocks
generator.valueToCode(block, 'INPUT', Order.ATOMIC)  // Value input → string
generator.statementToCode(block, 'DO')               // Statement input → string

// Field values
block.getFieldValue('FIELD_NAME')                    // Get dropdown/text value
```

---

## Board System

Defined in `src/lib/blockly/arduino/boards.ts`:

```typescript
// Current board access
Arduino.Boards.selected           // Current board config
Arduino.Boards.selected.digitalPins
Arduino.Boards.selected.analogPins
Arduino.Boards.selected.pwmPins
Arduino.Boards.selected.builtinLed

// Change board
changeBoard(boardType: BoardType)

// Refresh block dropdowns after board change
Arduino.Boards.refreshBlockFieldDropdown(block, 'PIN', 'digitalPins')
```

### BoardType Values

```typescript
type BoardType = 'uno' | 'nano' | 'mega' | 'pro' | 'esp32' | 'esp8266';
```

---

## Zustand Store Pattern

```typescript
import { create } from 'zustand';

interface MyState {
  value: string;
  setValue: (v: string) => void;
}

export const useMyStore = create<MyState>((set, get) => ({
  value: '',
  setValue: (v) => set({ value: v }),
}));

// Usage in components
const { value, setValue } = useMyStore();

// Usage outside React (in callbacks)
const value = useMyStore.getState().value;
useMyStore.getState().setValue('new');
```

### editorStore Key Actions

```typescript
useEditorStore.getState().loadProject(id)              // Load from IndexedDB
useEditorStore.getState().saveProject(isAutoSave?)     // Save (isAutoSave=true for silent)
useEditorStore.getState().setGeneratedCode(code)
useEditorStore.getState().markDirty()
useEditorStore.getState().setSelectedPort(port)        // Set serial port (saves to project)
useEditorStore.getState().workspace                    // Blockly.WorkspaceSvg
useEditorStore.getState().isDirty                      // Has unsaved changes
useEditorStore.getState().isSaving                     // Currently saving
useEditorStore.getState().selectedPort                 // Currently selected serial port
```

---

## Toolbox System

Categories defined in `src/constants/categories.ts`, blocks configured in `src/lib/blockly/toolbox/`.

```typescript
// Show category blocks in flyout
showCategoryBlocks(workspace, 'variables')

// Toolbox structure
{
  id: 'category_id',
  name: 'Display Name',
  icon: LucideIcon,
  blocks: ['block_name_1', 'block_name_2'],
}
```

---

## Component Patterns

### shadcn/ui Style

Components use **new-york** variant. Located in `src/components/ui/`.

```typescript
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
```

### Editor Components

```typescript
// Main structure
<EditorToolbar />           // Top bar with actions
<CategorySidebar />         // Left sidebar with block categories
<WorkspaceContainer>        // Contains Blockly
  <div id="hduino-workspace" />
</WorkspaceContainer>
<CodePanel />               // Floating panel showing generated code
```

---

## Storage (IndexedDB)

```typescript
import { getProject, updateProject, createProject, deleteProject } from '@/lib/storage';

// Project operations
await createProject({ name, boardType })  // Returns new project
await getProject(id)                       // Returns Project | undefined
await updateProject(id, { workspace: xml })
await deleteProject(id)
await getAllProjects()                     // Returns Project[]
```

### Project Type

```typescript
interface Project {
  id: string;
  name: string;
  boardType: BoardType;
  workspace?: string;        // XML string
  selectedPort?: string;     // Selected serial port for uploading
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Serialization

```typescript
import { getWorkspaceXml, loadWorkspaceXml } from '@/lib/blockly/serialization';

// Save workspace state
const xml = getWorkspaceXml(workspace);

// Restore workspace state
loadWorkspaceXml(workspace, xmlString);
```

---

## Adding a New Block (Checklist)

1. **Define block** in `src/lib/blockly/blocks/{category}/{file}.ts`
2. **Define generator** in `src/lib/blockly/generators/{category}/{file}.ts`
3. **Add to category** in `src/lib/blockly/toolbox/categories.ts`
4. **Export** from category's `index.ts` if needed

---

## Platform Adapter System

The platform adapter provides a unified API for cross-platform features that work differently on web vs desktop.

### Adapter Interface

```typescript
interface DeviceAdapter {
  getPlatform(): 'web' | 'tauri';

  getCapabilities(): {
    canListPorts: boolean;      // Can list serial ports
    canUpload: boolean;          // Can upload to Arduino
    canAutoDetectBoard: boolean; // Can detect board type
    supportsProgress: boolean;   // Supports upload progress
  };

  // Serial port operations
  listPorts(): Promise<SerialPort[]>;

  // Upload with progress tracking
  upload(
    port: string,
    code: string,
    board: string,
    onProgress?: (stage: 'compiling' | 'uploading', percent: number) => void
  ): Promise<UploadResult>;

  // Compilation only (desktop)
  compile(code: string, board: string): Promise<UploadResult>;

  // File operations
  exportProject(name: string, content: string): Promise<void>;
  importProject(): Promise<{ name: string; content: string } | null>;

  // Arduino core management (desktop only)
  listInstalledCores(): Promise<CoreInfo[]>;
  listInstalledBoards(): Promise<BoardInfo[]>;
  checkCoreStatus(coreId: string): Promise<CoreStatus>;
  installCore(coreId: string, onProgress?: (percent: number) => void): Promise<void>;
  searchCores(query?: string): Promise<CoreInfo[]>;
  getBundledCores(): Promise<CoreInfo[]>;
}
```

### Usage in Components

```typescript
import { getAdapter } from '@hduino/platform';

function MyComponent() {
  const adapter = getAdapter();
  const capabilities = adapter.getCapabilities();

  // Check if feature is available
  if (!capabilities.canUpload) {
    toast.error('Upload not supported', {
      description: 'Please use the desktop app'
    });
    return;
  }

  // Use adapter features
  const ports = await adapter.listPorts();
  await adapter.upload(port, code, board);
}
```

### Platform Detection

```typescript
// Auto-detection based on environment
import { detectAdapter } from '@hduino/platform';

const adapter = detectAdapter();
// Returns WebAdapter in browser
// Returns TauriAdapter when running in Tauri window
```

---

## Common Imports

```typescript
// Blockly (via @hduino/arduino package)
import * as Blockly from 'blockly/core';
import {
  CATEGORY_COLORS,
  BOARD_PROFILES,
  BOARD_KEYS,
  arduinoGenerator,
  Order,
  Types
} from '@hduino/arduino';

// Platform adapter (via @hduino/platform package)
import { getAdapter, type DeviceAdapter, type SerialPort } from '@hduino/platform';

// State
import { useEditorStore } from '@/stores/editorStore';
import { useProjectStore } from '@/stores/projectStore';

// Hooks
import { useAutoSave } from '@/hooks/useAutoSave';
import { useUpload } from '@/hooks/useUpload';
import { useCoreManager } from '@/hooks/useCoreManager';

// UI
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import Image from 'next/image';
```

---

## UI Layout

```
┌─────────────────────────────────┐
│     EditorToolbar (48px)        │
├──────────┬──────────────────────┤
│ Category │   WorkspaceContainer │
│ Sidebar  │   + Blockly          │
│ (140px)  │   + CodePanel (float)│
└──────────┴──────────────────────┘
```

---

## Commands

### Root Commands (Turborepo)

```bash
# Development
bun install              # Install all dependencies
bun dev                  # Run all apps in dev mode (turbo)
bun dev:web              # Just Next.js web app
bun dev:desktop          # Tauri desktop app

# Building
bun build                # Build all packages and apps
bun build:web            # Build web app only
bun build:desktop        # Build desktop app (creates installer)

# Quality
bun lint                 # Lint all packages
bun type-check           # Type check all packages

# Maintenance
bun clean                # Clean all build artifacts
```

### Package Development

```bash
cd packages/arduino && bun dev    # Watch mode for arduino package
cd packages/platform && bun dev   # Watch mode for platform package
```

### Desktop Setup (First Time)

```bash
cd apps/desktop
./scripts/download-arduino-cli.sh   # Download arduino-cli binaries
./scripts/setup-arduino-data.sh     # Initialize AVR core for UNO/Nano/Mega
```

### System Dependencies (Linux)

```bash
# Tauri dependencies
sudo apt install -y libwebkit2gtk-4.1-dev build-essential curl wget \
  file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev \
  libudev-dev

# Rust (if not installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

---

## Supported Boards

| Board | Digital | Analog | PWM | Voltage |
|-------|---------|--------|-----|---------|
| Arduino Uno | 14 | 6 | 6 | 5V |
| Arduino Nano | 14 | 8 | 6 | 5V |
| Arduino Mega | 54 | 16 | 15 | 5V |
| Arduino Pro | 20 | 12 | 6 | 5V |
| ESP32 | 34 | 18 | 16 | 3.3V |
| ESP8266 | 17 | 1 | 4 | 3.3V |

---

## Block Categories

**Logic**: control, operators, variables, functions, text, arrays, math

**Hardware**: arduino, light, motors, sensor, serial, switch, telecom, time

---

## Architecture Notes

- Client-side only, no backend
- TypeScript strict mode OFF
- Blockly flyout toolbox (not tree)
- XML serialization for workspace state
- Custom Arduino code generators per block
- Workspace div ID: `hduino-workspace`
- All blocks use `CATEGORY_COLORS` from theme

---

## Auto-Save System

**Location**: `src/hooks/useAutoSave.ts`

### How It Works

The auto-save system automatically saves projects without user intervention:

1. **Timer-based auto-save** (3 seconds after last change)
2. **Navigation-based auto-save** (when clicking home button)
3. **Page unload auto-save** (when closing/reloading page)

### Implementation Details

```typescript
// Enable auto-save in editor
import { useAutoSave } from '@/hooks/useAutoSave';

export default function EditorPage() {
  useAutoSave(); // Activates auto-save
}
```

### Save Function Signature

```typescript
saveProject(isAutoSave?: boolean)
// isAutoSave = false: Manual save (shows toast)
// isAutoSave = true:  Auto-save (silent, no toast)
```

### Visual Indicators

- **Orange dot**: Appears when there are unsaved changes (`isDirty`)
- **Blue spinner**: Appears when actively saving (`isSaving`)
- Located next to project name in toolbar

### Toast Notifications

Toasts only appear in specific scenarios to avoid spam:

```typescript
// Silent auto-save (no toast)
- After 3 seconds of inactivity

// Toast shown
- When navigating home with unsaved changes
- When closing/reloading page with unsaved changes
- On save errors
```

### Configuration

```typescript
const AUTO_SAVE_DELAY = 3000; // 3 seconds
```

---

## Port Selection System

**Location**: `src/components/editor/Toolbar/PortSelectionDialog.tsx`

### How It Works

The port selection system allows users to select a serial port for uploading Arduino code:

1. **Port selection dialog** - Opens when clicking the port button in toolbar
2. **Port state persisted** - Selected port is saved to project in IndexedDB
3. **Auto-restore** - Port is loaded when opening a project

### Implementation Details

```typescript
// Port selection in editorStore
interface EditorState {
  selectedPort: string | null;      // Currently selected serial port
  setSelectedPort: (port: string | null) => Promise<void>;
}

// Usage in components
const { selectedPort, setSelectedPort } = useEditorStore();
await setSelectedPort('COM3');
```

### PortSelectionDialog Component

**Features:**
- Displays available serial ports with icons (Usb from lucide-react)
- Shows manufacturer information inline with port path
- Refresh button to scan for new ports (RefreshCw icon)
- Check icon for selected port
- Compact layout with single-line port items

**Mock Ports (for demonstration):**
```typescript
const MOCK_PORTS: SerialPort[] = [
  { path: 'COM3', manufacturer: 'Arduino LLC', vendorId: '2341', productId: '0043' },
  { path: 'COM4', manufacturer: 'FTDI', vendorId: '0403', productId: '6001' },
  { path: '/dev/ttyUSB0', manufacturer: 'Arduino LLC' },
  { path: '/dev/ttyACM0', manufacturer: 'Arduino SA' },
];
```

### Icons Used

- **Usb** (lucide-react) - Port items
- **Check** (lucide-react) - Selected port indicator
- **RefreshCw** (lucide-react) - Refresh ports button

### Toast Notification

When a port is selected:
```typescript
toast.success('Port selected', {
  description: `Connected to ${port}`,
  duration: 2000,
});
```

### Future Enhancement

In production, replace mock ports with actual port detection using:
- **Web Serial API** (browser-based, requires user permission)
- **Backend service** (for Electron/Tauri apps)

---

## Toast System

**Library**: `sonner` (already installed)
**Component**: `src/components/ui/sonner.tsx`

### Usage

```typescript
import { toast } from 'sonner';

// Success toast
toast.success('Title', {
  description: 'Description text',
  duration: 2000, // milliseconds
});

// Error toast
toast.error('Title', {
  description: 'Error details',
});

// Info/warning/loading variants
toast.info('Info message');
toast.warning('Warning message');
toast.loading('Loading...');
```

### Custom Icons

The Toaster component has custom icons configured:
- Success: CircleCheckIcon
- Error: OctagonXIcon
- Warning: TriangleAlertIcon
- Info: InfoIcon
- Loading: Loader2Icon (animated spin)

---

## Error Handling

### Store-level Error Handling

All async store actions include try/catch blocks with:

```typescript
try {
  // Operation
} catch (error) {
  const message = error instanceof Error ? error.message : 'Generic message';
  set({ error: message, isLoading: false });
  toast.error('Title', { description: message });
  throw error; // Re-throw for caller handling
}
```

### Auto-Save Error Handling

Auto-save failures are handled gracefully:

```typescript
// Silent failure (no toast during normal auto-save)
if (isAutoSave) {
  console.error('[editorStore] Auto-save failed:', message);
  return; // Don't throw
}

// User-triggered navigation/close (show toast)
toast.error('Failed to save', {
  description: 'Could not save your changes'
});
```

---

## State Management Updates

### Editor Store Changes

```typescript
interface EditorState {
  isSaving: boolean;       // Currently saving (for spinner)
  isDirty: boolean;        // Has unsaved changes (for orange dot)
  selectedPort: string | null;  // Selected serial port (persisted to project)

  saveProject: (isAutoSave?: boolean) => Promise<void>;
  setSelectedPort: (port: string | null) => Promise<void>;
}
```

### Manual Save Removed

- ❌ No more Save button in toolbar
- ❌ No more Ctrl+S keyboard shortcut
- ❌ No more `useUnsavedChanges` hook (replaced by auto-save)

---

## Responsive Design

### Toolbar Responsive Layout

```typescript
// HomeButton only visible on large screens
<div className="hidden lg:block">
  <HomeButton />
</div>
```

### Breakpoints (Tailwind)

- `sm:` 640px
- `md:` 768px
- `lg:` 1024px
- `xl:` 1280px
- `2xl:` 1536px

---

## Keyboard Shortcuts

Current active shortcuts:

| Shortcut | Action |
|----------|--------|
| Ctrl+Z / Cmd+Z | Undo |
| Ctrl+Y / Cmd+Shift+Z | Redo |

**Removed shortcuts:**
- ~~Ctrl+S~~ (replaced by auto-save)

---

## Recent Updates (2026-02-02)

### Image Optimization
- Converted all `<img>` tags to Next.js `Image` component (11 files)
- Updated global CSS for proper image rendering on high-DPI displays
- Images now render sharply on both desktop and web platforms

### Files Modified
1. **Components** (11 files):
   - [Logo.tsx](apps/web/src/components/shared/logo.tsx)
   - [CategoryIcons.tsx](apps/web/src/components/editor/Sidebar/CategoryIcons.tsx)
   - [BoardTypeCarousel.tsx](apps/web/src/components/shared/BoardTypeCarousel.tsx)
   - [EmptyState.tsx](apps/web/src/components/projects/EmptyState.tsx)
   - [CategorySidebar.tsx](apps/web/src/components/editor/Sidebar/CategorySidebar.tsx)
   - [VerifyButton.tsx](apps/web/src/components/editor/Toolbar/VerifyButton.tsx)
   - [UploadButton.tsx](apps/web/src/components/editor/Toolbar/UploadButton.tsx)
   - [SaveButton.tsx](apps/web/src/components/editor/Toolbar/SaveButton.tsx)
   - [HomeButton.tsx](apps/web/src/components/editor/Toolbar/HomeButton.tsx)
   - [CodePanelButton.tsx](apps/web/src/components/editor/Toolbar/CodePanelButton.tsx)
   - [SelectBoardButton.tsx](apps/web/src/components/editor/Toolbar/SelectBoardButton.tsx)
   - [SelectPortButton.tsx](apps/web/src/components/editor/Toolbar/SelectPortButton.tsx)

2. **Styles**:
   - [globals.css](apps/web/src/app/globals.css) - Updated image rendering CSS

### Current Architecture Status

| Component | Status |
|-----------|--------|
| **Monorepo Structure** | ✅ Complete |
| **@hduino/arduino Package** | ✅ Complete |
| **@hduino/platform Package** | ✅ Complete |
| **Web App (Next.js)** | ✅ Complete |
| **Desktop App (Tauri)** | ✅ Complete |
| **Arduino CLI Integration** | ✅ Complete |
| **Core Management UI** | ✅ Complete |
| **Image Optimization** | ✅ Complete |
| **Auto-Save System** | ✅ Complete |
| **Port Selection** | ✅ Complete |

### Next Steps (from todo.md)

**Testing Phase:**
- [ ] Test full flow: create project → add blocks → generate code → export
- [ ] Test import project functionality
- [ ] Test cross-package type checking
- [ ] Test hot reload for package changes
- [ ] Test full upload flow: blocks → compile → upload to Arduino
- [ ] Test core installation via Board Manager UI
- [ ] Test offline compilation with bundled AVR core

---

## Troubleshooting

### Common Issues

**Blurry images on desktop:**
- **Fixed**: All images now use Next.js Image component with proper optimization

**TypeScript errors after monorepo migration:**
- Solution: Run `bun install` from root to sync workspace dependencies
- Check that `@hduino/arduino` and `@hduino/platform` are in `package.json`

**Tauri build fails:**
- Ensure system dependencies are installed (see Commands > System Dependencies)
- Run `cd apps/desktop && ./scripts/download-arduino-cli.sh`

**Arduino upload fails:**
- Desktop only: Ensure AVR core is installed (`./scripts/setup-arduino-data.sh`)
- Check that selected port is correct
- Verify board type matches physical board

---

## Related Documentation

- [CLAUDE.md](apps/web/CLAUDE.md) - Project instructions for AI assistants
- [todo.md](Todos/todo.md) - Platform bridge architecture and progress
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Tauri Documentation](https://tauri.app/v1/guides/)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
