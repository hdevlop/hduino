/**
 * Platform adapter types for cross-platform device communication
 */
/**
 * Serial port information
 */
interface SerialPort {
    path: string;
    manufacturer?: string;
    vendorId?: string;
    productId?: string;
}
/**
 * Arduino core information
 */
interface CoreInfo {
    id: string;
    installed: string;
    latest: string;
    name: string;
}
/**
 * Arduino board information
 */
interface BoardInfo {
    name: string;
    fqbn: string;
}
/**
 * Core installation status
 */
interface CoreStatus {
    coreId: string;
    installed: boolean;
    bundled: boolean;
}
/**
 * Upload result from Arduino compilation/upload
 */
interface UploadResult {
    success: boolean;
    stage?: 'compile' | 'upload';
    message?: string;
    error?: string;
}
/**
 * Platform capabilities
 */
interface PlatformCapabilities {
    canListPorts: boolean;
    canUpload: boolean;
    canAutoDetectBoard: boolean;
    supportsProgress: boolean;
}
/**
 * Upload progress callback type
 */
type UploadProgressCallback = (stage: 'compiling' | 'uploading', percent: number) => void;
/**
 * Device adapter interface for platform-specific operations
 * Implementations: WebAdapter (browser), TauriAdapter (desktop)
 */
interface DeviceAdapter {
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
    upload(port: string, code: string, board: string, onProgress?: UploadProgressCallback): Promise<UploadResult>;
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
    importProject(): Promise<{
        name: string;
        content: string;
    } | null>;
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

/**
 * Platform detection and adapter selection
 */

/**
 * Detect the current platform and return appropriate adapter
 * Creates a new adapter instance each time (use getAdapter for cached version)
 * @returns The platform-specific device adapter
 */
declare function detectAdapter(): DeviceAdapter;
/**
 * Get the cached adapter instance
 * Creates and caches the adapter on first call
 * @returns The cached platform-specific device adapter
 */
declare function getAdapter(): DeviceAdapter;
/**
 * Check if running in Tauri desktop app
 */
declare function isTauri(): boolean;
/**
 * Check if running in web browser
 */
declare function isWeb(): boolean;

declare class WebAdapter implements DeviceAdapter {
    getPlatform(): 'web' | 'tauri';
    getCapabilities(): PlatformCapabilities;
    /**
     * Check if Web Serial API is available
     */
    private hasWebSerial;
    /**
     * List serial ports using Web Serial API
     * Note: Requires user permission and HTTPS
     */
    listPorts(): Promise<SerialPort[]>;
    /**
     * Verify/compile code
     * Not supported in browser without backend service
     */
    compile(code: string, board: string): Promise<UploadResult>;
    /**
     * Upload code to Arduino
     * Not supported in browser without backend service
     */
    upload(port: string, code: string, board: string, onProgress?: UploadProgressCallback): Promise<UploadResult>;
    /**
     * Export project file using Download API
     */
    exportProject(name: string, content: string): Promise<void>;
    /**
     * Import project file using File Picker API
     */
    importProject(): Promise<{
        name: string;
        content: string;
    } | null>;
    checkArduinoCli(): Promise<boolean>;
    getArduinoCliVersion(): Promise<string>;
    listInstalledCores(): Promise<CoreInfo[]>;
    listInstalledBoards(): Promise<BoardInfo[]>;
    checkCoreStatus(_boardFqbn: string): Promise<CoreStatus>;
    installCore(_coreId: string): Promise<string>;
    searchCores(_query: string): Promise<CoreInfo[]>;
    getBundledCores(): Promise<string[]>;
}

/**
 * Tauri adapter for native desktop functionality
 * Uses Tauri's invoke API to call Rust commands
 */

/**
 * Tauri adapter for native desktop operations
 */
declare class TauriAdapter implements DeviceAdapter {
    getPlatform(): 'web' | 'tauri';
    getCapabilities(): PlatformCapabilities;
    /**
     * List available serial ports using native serialport library
     */
    listPorts(): Promise<SerialPort[]>;
    /**
     * Verify/compile code without uploading
     */
    compile(code: string, board: string): Promise<UploadResult>;
    /**
     * Upload code to Arduino using arduino-cli
     * Compiles and uploads in a single operation with progress reporting
     */
    upload(port: string, code: string, board: string, onProgress?: UploadProgressCallback): Promise<UploadResult>;
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
     * List installed Arduino boards
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
    /**
     * Export project file using native save dialog
     */
    exportProject(name: string, content: string): Promise<void>;
    /**
     * Import project file using native open dialog
     */
    importProject(): Promise<{
        name: string;
        content: string;
    } | null>;
}
/**
 * Emit app-ready event to Tauri backend
 * Signals that the app is fully loaded and ready to show
 */
declare function emitAppReady(): void;

export { type BoardInfo, type CoreInfo, type CoreStatus, type DeviceAdapter, type PlatformCapabilities, type SerialPort, TauriAdapter, type UploadProgressCallback, type UploadResult, WebAdapter, detectAdapter, emitAppReady, getAdapter, isTauri, isWeb };
