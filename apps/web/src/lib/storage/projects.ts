/**
 * Project CRUD Operations
 * Handles all project-related database operations
 */

import { getDB, isIndexedDBAvailable } from './indexeddb'
import { detectAdapter } from '@hduino/platform'
import type {
  Project,
  ProjectCreate,
  ProjectUpdate,
  HduinoExportFile,
  ProjectRecord,
} from '@/types/project'
import { BoardType, DEFAULT_BOARD } from '@/types/arduino'
import {
  HDUINO_FILE_VERSION,
  HDUINO_FILE_EXTENSION,
} from '@/types/project'

// Get platform adapter (cached)
let adapter: ReturnType<typeof detectAdapter> | null = null
function getAdapter() {
  if (!adapter) {
    adapter = detectAdapter()
  }
  return adapter
}



/**
 * Generate a unique ID for new projects
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Convert a database record to a Project object
 */
function recordToProject(record: ProjectRecord): Project {
  return {
    ...record,
    boardType: record.boardType as BoardType,
    createdAt: new Date(record.createdAt),
    updatedAt: new Date(record.updatedAt),
  }
}

/**
 * Convert a Project to a database record
 */
function projectToRecord(project: Project): ProjectRecord {
  return {
    ...project,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  }
}

/**
 * Get all projects, sorted by last updated (newest first)
 */
export async function getProjects(): Promise<Project[]> {
  if (!isIndexedDBAvailable()) {
    console.warn('IndexedDB not available')
    return []
  }

  const db = await getDB()
  const records = await db.getAllFromIndex('projects', 'by-updated')
  
  // Reverse for newest first (index is ascending)
  return records.reverse().map(recordToProject)
}

/**
 * Get a single project by ID
 */
export async function getProject(id: string): Promise<Project | null> {
  if (!isIndexedDBAvailable()) {
    return null
  }

  const db = await getDB()
  const record = await db.get('projects', id)
  
  return record ? recordToProject(record) : null
}

/**
 * Create a new project
 */
export async function createProject(input: ProjectCreate): Promise<Project> {
  if (!isIndexedDBAvailable()) {
    throw new Error('IndexedDB not available')
  }

  const now = new Date()
  const project: Project = {
    id: generateId(),
    name: input.name.trim() || 'Untitled Project',
    createdAt: now,
    updatedAt: now,
    workspace: '', // Empty Blockly workspace
    boardType: input.boardType ?? DEFAULT_BOARD,
    description: input.description,
  }

  const db = await getDB()
  await db.put('projects', projectToRecord(project))

  return project
}

/**
 * Update an existing project
 */
export async function updateProject(
  id: string,
  updates: ProjectUpdate
): Promise<Project | null> {
  if (!isIndexedDBAvailable()) {
    return null
  }

  const db = await getDB()
  const existing = await db.get('projects', id)

  if (!existing) {
    return null
  }

  const updated: ProjectRecord = {
    ...existing,
    ...updates,
    name: updates.name?.trim() ?? existing.name,
    updatedAt: new Date().toISOString(),
  }

  await db.put('projects', updated)

  return recordToProject(updated)
}

/**
 * Delete a project by ID
 */
export async function deleteProject(id: string): Promise<boolean> {
  if (!isIndexedDBAvailable()) {
    return false
  }

  const db = await getDB()
  const existing = await db.get('projects', id)

  if (!existing) {
    return false
  }

  await db.delete('projects', id)
  return true
}

/**
 * Export a project to a .hduino file
 * Returns a Blob that can be downloaded
 */
export async function exportProject(id: string): Promise<Blob | null> {
  const project = await getProject(id)

  if (!project) {
    return null
  }

  const exportData: HduinoExportFile = {
    version: HDUINO_FILE_VERSION,
    exportedAt: new Date().toISOString(),
    project,
  }

  const json = JSON.stringify(exportData, null, 2)
  return new Blob([json], { type: 'application/json' })
}

/**
 * Trigger download of an exported project
 * Uses platform adapter for cross-platform support (web download / native dialog)
 */
export async function downloadProject(id: string): Promise<boolean> {
  const project = await getProject(id)
  if (!project) {
    return false
  }

  const exportData: HduinoExportFile = {
    version: HDUINO_FILE_VERSION,
    exportedAt: new Date().toISOString(),
    project,
  }

  const content = JSON.stringify(exportData, null, 2)
  const filename = sanitizeFilename(project.name)

  // Use platform adapter for export (handles web download API / Tauri native dialog)
  await getAdapter().exportProject(filename, content)

  return true
}

/**
 * Import a project using platform adapter (opens file picker)
 * Uses native dialog on Tauri, file picker on web
 */
export async function importProjectFromPicker(): Promise<Project | null> {
  const result = await getAdapter().importProject()
  if (!result) {
    return null // User cancelled
  }

  // Parse and validate the content
  return importProjectFromContent(result.name, result.content)
}

/**
 * Import a project from content string
 * Shared logic for both file drop and adapter import
 */
export async function importProjectFromContent(
  filename: string,
  content: string
): Promise<Project> {
  if (!isIndexedDBAvailable()) {
    throw new Error('IndexedDB not available')
  }

  let data: HduinoExportFile

  try {
    data = JSON.parse(content)
  } catch {
    throw new Error('Invalid file format: Could not parse JSON')
  }

  // Validate structure
  if (!data.version || !data.project) {
    throw new Error('Invalid file format: Missing required fields')
  }

  // Create new project from imported data
  const now = new Date()
  const project: Project = {
    id: generateId(),
    name: `${data.project.name}`,
    createdAt: now,
    updatedAt: now,
    workspace: data.project.workspace || '',
    boardType: data.project.boardType || DEFAULT_BOARD,
    description: data.project.description,
    thumbnail: data.project.thumbnail,
  }

  const db = await getDB()
  await db.put('projects', projectToRecord(project))

  return project
}

/**
 * Import a project from a .hduino file (drag & drop / file input)
 * Creates a new project with a new ID (doesn't overwrite)
 */
export async function importProject(file: File): Promise<Project> {
  // Validate file extension
  if (!file.name.toLowerCase().endsWith(HDUINO_FILE_EXTENSION)) {
    throw new Error(`Invalid file type. Expected ${HDUINO_FILE_EXTENSION} file`)
  }

  // Read file content
  const content = await file.text()

  // Use shared import logic
  return importProjectFromContent(file.name, content)
}

/**
 * Duplicate an existing project
 */
export async function duplicateProject(id: string): Promise<Project | null> {
  const original = await getProject(id)

  if (!original) {
    return null
  }

  const newProject = await createProject({
    name: `${original.name} (copy)`,
    boardType: original.boardType,
    description: original.description,
  })

  // Copy the workspace to the new project
  return updateProject(newProject.id, {
    workspace: original.workspace,
    thumbnail: original.thumbnail,
  })
}

/**
 * Search projects by name
 */
export async function searchProjects(query: string): Promise<Project[]> {
  const projects = await getProjects()
  const lowerQuery = query.toLowerCase().trim()

  if (!lowerQuery) {
    return projects
  }

  return projects.filter((p) =>
    p.name.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Sanitize a string for use as a filename
 */
function sanitizeFilename(name: string): string {
  return name
    .replace(/[<>:"/\\|?*]/g, '-')
    .replace(/\s+/g, '_')
    .substring(0, 100)
}