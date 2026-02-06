/**
 * Storage Layer - Barrel Exports
 * Exports all storage-related functions and utilities
 */

// IndexedDB utilities
export {
  getDB,
  closeDB,
  isIndexedDBAvailable,
  deleteDatabase,
  type HduinoDB,
} from './indexeddb'

// Project CRUD operations
export {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  exportProject,
  downloadProject,
  importProject,
  importProjectFromPicker,
  importProjectFromContent,
  duplicateProject,
  searchProjects,
} from './projects'