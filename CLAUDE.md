# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hduino is a visual block-based programming IDE for Arduino using Blockly. It's a web-based, client-side only application (no backend) that generates Arduino C++ code from visual blocks.

**Stack**: Next.js 16 + React 19 + TypeScript + Tailwind 4 + Zustand + IndexedDB

## Development Commands

```bash
bun dev      # Development server at localhost:3000
bun build    # Production build
bun lint     # ESLint
```

## Architecture

### Block System
Blocks are defined in paired files:
- **Block definitions**: `src/lib/blockly/blocks/{category}/{file}.ts`
- **Code generators**: `src/lib/blockly/generators/{category}/{file}.ts`

Block categories are split into:
- `logic/` - control flow, operators, variables, functions, math, arrays, text
- `hardware/` - Arduino I/O, sensors, motors, serial, LEDs, timing

When adding a new block, create both the block definition and its corresponding generator.

### State Management
- **Zustand stores** in `src/stores/` manage global state
- `editorStore.ts` - workspace, code generation, zoom, dirty/saving flags
- `projectStore.ts` - projects CRUD operations
- Custom hooks in `src/hooks/` wrap store actions

### Auto-Save System
- **No manual save required** - projects auto-save after 3 seconds of inactivity
- **Visual indicators**: Orange dot (unsaved), blue spinner (saving)
- **Smart toasts**: Only shown on navigation/close, not during normal auto-save
- Implemented via `useAutoSave` hook in editor page
- `saveProject(isAutoSave?: boolean)` - pass `true` for silent auto-save

### Workspace Flow
1. User edits blocks in Blockly workspace
2. `useBlockly` hook detects changes via `onChange` callback
3. `generateArduinoCode()` produces Arduino C++ code
4. Code is stored in `editorStore.generatedCode` and displayed in CodePanel

### Persistence
- Projects stored in IndexedDB (database: `hduino`, store: `projects`)
- Workspace state serialized as XML via `src/lib/blockly/serialization.ts`
- Project export format: `.hduino` files containing metadata + workspace XML

### Board Support
Dynamic pin configuration based on selected board. Blocks with pin dropdowns use `updateFields()` method to refresh options when board changes. Supported boards are defined in `src/lib/blockly/arduino/boards.ts`.

## UI Components

- Uses **shadcn/ui** with `new-york` style variant
- UI primitives in `src/components/ui/` wrap Radix UI
- Icons from `lucide-react`
- Editor layout: Toolbar (top) + CategorySidebar (left) + Workspace (center) + floating CodePanel

## Key Files

| File | Purpose |
|------|---------|
| `src/stores/editorStore.ts` | Central editor state (workspace, dirty/saving flags) |
| `src/lib/blockly/workspace.ts` | Blockly workspace init/dispose |
| `src/lib/blockly/arduino/generator.ts` | Arduino code generator base |
| `src/hooks/useBlockly.ts` | Workspace initialization hook |
| `src/hooks/useAutoSave.ts` | Auto-save with 3s timer + navigation/close triggers |
| `src/lib/storage/projects.ts` | IndexedDB project operations |
| `src/components/ui/sonner.tsx` | Toast notification system (sonner) |

## Conventions

- TypeScript strict mode is OFF
- Blockly uses flyout toolbox (not tree view)
- All Blockly imports use `import * as Blockly from 'blockly/core'` pattern
- Block colors defined in `src/lib/blockly/theme.ts` via `CATEGORY_COLORS`

## UX & Polish

### Keyboard Shortcuts
- **Ctrl+Z / Cmd+Z**: Undo
- **Ctrl+Y / Cmd+Shift+Z**: Redo
- ~~Ctrl+S~~: Removed (replaced by auto-save)

### Toast Notifications
Uses **sonner** library for toast notifications:
- Success toasts: Green with CircleCheckIcon
- Error toasts: Red with OctagonXIcon
- Auto-save toasts: Only on navigation/close, not during normal auto-save
- Duration: 2000ms (auto-save), 4000ms (manual actions)

### Error Handling
- All async operations wrapped in try/catch
- Errors display toast notifications
- Auto-save errors logged silently (no toast spam)
- User-triggered failures show error toasts

### Responsive Behavior
- Home button hidden on screens < 1024px (`lg:` breakpoint)
- Toolbar items stack/hide based on screen size
- Tailwind breakpoints: sm(640), md(768), lg(1024), xl(1280), 2xl(1536)
