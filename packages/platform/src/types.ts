/**
 * Platform adapter types for cross-platform device communication
 */

/**
 * Serial port information
 */
export interface SerialPort {
  path: string;
  manufacturer?: string;
  vendorId?: string;
  productId?: string;
}

/**
 * Arduino core information
 */
export interface CoreInfo {
  id: string;
  installed: string;
  latest: string;
  name: string;
}

/**
 * Arduino board information
 */
export interface BoardInfo {
  name: string;
  fqbn: string;
}

/**
 * Core installation status
 */
export interface CoreStatus {
  coreId: string;
  installed: boolean;
  bundled: boolean;
}

/**
 * Upload result from Arduino compilation/upload
 */
export interface UploadResult {
  success: boolean;
  stage?: 'compile' | 'upload';
  message?: string;
  error?: string;
}

/**
 * Platform capabilities
 */
export interface PlatformCapabilities {
  canListPorts: boolean;
  canUpload: boolean;
  canAutoDetectBoard: boolean;
  supportsProgress: boolean;
}

/**
 * Upload progress callback type
 */
export type UploadProgressCallback = (
  stage: 'compiling' | 'uploading',
  percent: number
) => void;

/**
 * Device adapter interface for platform-specific operations
 * Implementations: WebAdapter (browser), TauriAdapter (desktop)
 */
export interface DeviceAdapter {
  /**
   * Get the current platform
   */
  getPlatform(): 'web' | 'tauri';

  /**
   * Get platform capabilities
   */
  getCapabilities(): PlatformCapabilities;

  /**
   * List available serial ports
   */
  listPorts(): Promise<SerialPort[]>;

  /**
   * Verify/compile code without uploading
   * @param code Arduino C++ code
   * @param board Board type (uno, nano, mega, etc.)
   */
  compile(code: string, board: string): Promise<UploadResult>;

  /**
   * Upload code to Arduino
   * @param port Serial port path
   * @param code Arduino C++ code
   * @param board Board type (uno, nano, mega, etc.)
   * @param onProgress Optional progress callback
   */
  upload(
    port: string,
    code: string,
    board: string,
    onProgress?: UploadProgressCallback
  ): Promise<UploadResult>;

  /**
   * Export project file (download or save dialog)
   * @param name Project name
   * @param content Project content (JSON string)
   */
  exportProject(name: string, content: string): Promise<void>;

  /**
   * Import project file (file picker)
   * @returns Project data or null if cancelled
   */
  importProject(): Promise<{ name: string; content: string } | null>;

  // ========== Core Management (Desktop only) ==========

  /**
   * Check if arduino-cli is available
   */
  checkArduinoCli(): Promise<boolean>;

  /**
   * Get arduino-cli version
   */
  getArduinoCliVersion(): Promise<string>;

  /**
   * List installed Arduino cores
   */
  listInstalledCores(): Promise<CoreInfo[]>;

  /**
   * List available boards from installed cores
   */
  listInstalledBoards(): Promise<BoardInfo[]>;

  /**
   * Check if a core is installed for a board FQBN
   */
  checkCoreStatus(boardFqbn: string): Promise<CoreStatus>;

  /**
   * Install an Arduino core
   */
  installCore(coreId: string): Promise<string>;

  /**
   * Search for available cores
   */
  searchCores(query: string): Promise<CoreInfo[]>;

  /**
   * Get list of bundled cores
   */
  getBundledCores(): Promise<string[]>;
}
