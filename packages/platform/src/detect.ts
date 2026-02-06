/**
 * Platform detection and adapter selection
 */

import type { DeviceAdapter } from './types';
import { WebAdapter } from './web';
import { TauriAdapter } from './tauri';

// Cached adapter instance
let cachedAdapter: DeviceAdapter | null = null;

/**
 * Detect the current platform and return appropriate adapter
 * Creates a new adapter instance each time (use getAdapter for cached version)
 * @returns The platform-specific device adapter
 */
export function detectAdapter(): DeviceAdapter {
  // Check if running in Tauri (desktop app)
  if (typeof window !== 'undefined' && (window as any).__TAURI__) {
    return new TauriAdapter();
  }

  // Default to web adapter (browser/PWA)
  return new WebAdapter();
}

/**
 * Get the cached adapter instance
 * Creates and caches the adapter on first call
 * @returns The cached platform-specific device adapter
 */
export function getAdapter(): DeviceAdapter {
  if (!cachedAdapter) {
    cachedAdapter = detectAdapter();
  }
  return cachedAdapter;
}

/**
 * Check if running in Tauri desktop app
 */
export function isTauri(): boolean {
  return typeof window !== 'undefined' && !!(window as any).__TAURI__;
}

/**
 * Check if running in web browser
 */
export function isWeb(): boolean {
  return !isTauri();
}
