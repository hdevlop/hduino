/**
 * @hduino/platform
 * Cross-platform device communication adapter
 */

// Export types
export type {
  DeviceAdapter,
  SerialPort,
  UploadResult,
  PlatformCapabilities,
  UploadProgressCallback,
  CoreInfo,
  BoardInfo,
  CoreStatus,
} from './types';

// Export platform detection
export { detectAdapter, getAdapter, isTauri, isWeb } from './detect';

// Export adapters
export { WebAdapter } from './web';
export { TauriAdapter, emitAppReady } from './tauri';
