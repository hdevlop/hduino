/**
 * Project Types
 * Defines the structure for Hduino projects
 */

import type { BoardType } from './arduino'

// ============================================================
// Project Interface
// ============================================================

export interface Project {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
  workspace: string // Blockly workspace state as JSON
  boardType: BoardType
  selectedPort?: string // Selected serial port for uploading
  description?: string
  thumbnail?: string // Base64 or URL for project preview
}

/**
 * Database record type (stores dates as ISO strings)
 * Automatically derived from Project for IndexedDB storage
 */
export type ProjectRecord = Omit<Project, 'createdAt' | 'updatedAt' | 'boardType'> & {
  createdAt: string
  updatedAt: string
  boardType: string
}


// ============================================================
// Project Operations
// ============================================================

export interface ProjectCreate {
  name: string
  boardType?: BoardType
  description?: string
}

export interface ProjectUpdate {
  name?: string
  workspace?: string
  boardType?: BoardType
  selectedPort?: string
  description?: string
  thumbnail?: string
}

export interface ProjectExport {
  version: string
  exportedAt: string
  project: Project
}


// ============================================================
// Import/Export
// ============================================================

export interface HduinoExportFile {
  version: string
  exportedAt: string
  project: Project
}

export const HDUINO_FILE_EXTENSION = '.hduino'
export const HDUINO_FILE_VERSION = '1.0.0'

// ============================================================
// Project List & Sorting
// ============================================================

export type ProjectSortField = 'name' | 'createdAt' | 'updatedAt'
export type SortDirection = 'asc' | 'desc'

export interface ProjectSortOptions {
  field: ProjectSortField
  direction: SortDirection
}

export interface ProjectFilters {
  search?: string
  boardType?: BoardType
}