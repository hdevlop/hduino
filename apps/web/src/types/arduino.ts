/**
 * Arduino Types
 * Board configurations, pin definitions, and compiler settings
 */

// ============================================================
// Board Types - Re-export from boards.ts (Single Source of Truth)
// ============================================================

import type { BoardKey } from '@hduino/arduino/arduino'
export { BOARD_KEYS, BOARD_PROFILES } from '@hduino/arduino/arduino'

export type BoardType = BoardKey

export const DEFAULT_BOARD: BoardType = 'arduino_uno'

// ============================================================
// Pin Types
// ============================================================

export type PinMode = 'INPUT' | 'OUTPUT' | 'INPUT_PULLUP'

export type DigitalValue = 'HIGH' | 'LOW'

export interface PinState {
  pin: number
  mode: PinMode
  value: number // 0-1 for digital, 0-1023 for analog
}

// ============================================================
// Compiler Types
// ============================================================

export interface CompilerOptions {
  board: BoardType
  optimizationLevel?: 'Os' | 'O1' | 'O2' | 'O3'
  verbose?: boolean
}

export interface CompileResult {
  success: boolean
  code: string
  errors: CompileError[]
  warnings: CompileWarning[]
  output?: CompiledOutput
}

export interface CompileError {
  line?: number
  message: string
  block?: string // Block ID that caused the error
}

export interface CompileWarning {
  line?: number
  message: string
  block?: string
}

export interface CompiledOutput {
  sketch: string // .ino file content
  hex?: string // Compiled hex (if local compilation)
  size?: {
    program: number // bytes
    data: number // bytes
    programMax: number
    dataMax: number
  }
}

// ============================================================
// Upload Types
// ============================================================

export type UploadStatus =
  | 'idle'
  | 'compiling'
  | 'connecting'
  | 'uploading'
  | 'verifying'
  | 'success'
  | 'error'

export interface SerialPort {
  path: string
  manufacturer?: string
  vendorId?: string
  productId?: string
}

export interface UploadOptions {
  port: string
  board: BoardType
  verify?: boolean
}

export interface UploadResult {
  success: boolean
  message: string
  duration?: number // ms
}

// ============================================================
// Serial Monitor Types
// ============================================================

export type BaudRate = 300 | 1200 | 2400 | 4800 | 9600 | 19200 | 38400 | 57600 | 115200

export const BAUD_RATES: BaudRate[] = [300, 1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200]

export const DEFAULT_BAUD_RATE: BaudRate = 9600

export interface SerialMessage {
  timestamp: Date
  direction: 'in' | 'out'
  data: string
}