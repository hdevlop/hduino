/**
 * IndexedDB wrapper for Hduino
 * Uses the idb library for a Promise-based API
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb'
import type { ProjectRecord } from '@/types/project'

const DB_NAME = 'hduino'
const DB_VERSION = 1

interface HduinoDB extends DBSchema {
  projects: {
    key: string
    value: ProjectRecord
    indexes: {
      'by-name': string
      'by-updated': string
    }
  }
}

let dbInstance: IDBPDatabase<HduinoDB> | null = null

/**
 * Initialize and get the database instance
 * Uses singleton pattern to reuse connections
 */
export async function getDB(): Promise<IDBPDatabase<HduinoDB>> {
  if (dbInstance) {
    return dbInstance
  }

  dbInstance = await openDB<HduinoDB>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      // Handle migrations based on version
      if (oldVersion < 1) {
        const projectStore = db.createObjectStore('projects', {
          keyPath: 'id',
        })
        // Index for searching by name
        projectStore.createIndex('by-name', 'name')
        // Index for sorting by last updated
        projectStore.createIndex('by-updated', 'updatedAt')
      }
    },
    blocked() {
      console.warn('Database upgrade blocked - close other tabs using Hduino')
    },
    blocking() {
      // Close connection to allow upgrade in other tabs
      dbInstance?.close()
      dbInstance = null
    },
    terminated() {
      dbInstance = null
    },
  })

  return dbInstance
}

/**
 * Close the database connection
 * Useful for cleanup or forcing reconnection
 */
export function closeDB(): void {
  if (dbInstance) {
    dbInstance.close()
    dbInstance = null
  }
}

/**
 * Check if IndexedDB is available in this environment
 */
export function isIndexedDBAvailable(): boolean {
  return typeof window !== 'undefined' && 'indexedDB' in window
}

/**
 * Delete the entire database (use with caution!)
 */
export async function deleteDatabase(): Promise<void> {
  closeDB()
  await indexedDB.deleteDatabase(DB_NAME)
}

export type { HduinoDB }