/**
 * Tauri adapter for native desktop functionality
 * Uses Tauri's invoke API to call Rust commands
 */

import type {
  DeviceAdapter,
  SerialPort,
  UploadResult,
  PlatformCapabilities,
  UploadProgressCallback,
  CoreInfo,
  BoardInfo,
  CoreStatus,
} from './types';

/**
 * Compile progress event from Rust backend
 */
interface CompileProgressEvent {
  stage: string;
  percent: number;
  message: string;
}

/**
 * Tauri invoke function type
 */
type InvokeFunction = <T>(cmd: string, args?: Record<string, unknown>) => Promise<T>;

/**
 * Get Tauri invoke function
 * Supports both Tauri v1 and v2 APIs
 */
function getInvoke(): InvokeFunction {
  const tauri = (window as any).__TAURI__;

  if (!tauri) {
    throw new Error('Tauri API not available');
  }

  // Tauri v2: invoke is in core module
  if (tauri.core?.invoke) {
    return tauri.core.invoke;
  }

  // Tauri v1: invoke is in tauri module
  if (tauri.tauri?.invoke) {
    return tauri.tauri.invoke;
  }

  // Direct invoke (older Tauri versions)
  if (typeof tauri.invoke === 'function') {
    return tauri.invoke;
  }

  throw new Error('Could not find Tauri invoke function');
}

/**
 * Invoke a Tauri command
 */
async function invoke<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
  const invokeFn = getInvoke();
  return invokeFn<T>(cmd, args);
}

/**
 * Serial port info returned from Rust
 */
interface TauriSerialPortInfo {
  path: string;
  manufacturer: string | null;
  vendor_id: string | null;
  product_id: string | null;
}

/**
 * Project file returned from Rust
 */
interface TauriProjectFile {
  name: string;
  content: string;
}

/**
 * Tauri adapter for native desktop operations
 */
export class TauriAdapter implements DeviceAdapter {
  getPlatform(): 'web' | 'tauri' {
    return 'tauri';
  }

  getCapabilities(): PlatformCapabilities {
    return {
      canListPorts: true,
      canUpload: true, // Enabled via Arduino CLI integration (Phase 8)
      canAutoDetectBoard: false,
      supportsProgress: true,
    };
  }

  /**
   * List available serial ports using native serialport library
   */
  async listPorts(): Promise<SerialPort[]> {
    try {
      const ports = await invoke<TauriSerialPortInfo[]>('list_ports');

      return ports.map((port) => ({
        path: port.path,
        manufacturer: port.manufacturer ?? undefined,
        vendorId: port.vendor_id ?? undefined,
        productId: port.product_id ?? undefined,
      }));
    } catch (error) {
      console.error('Failed to list serial ports:', error);
      return [];
    }
  }

  /**
   * Verify/compile code without uploading
   */
  async compile(code: string, board: string): Promise<UploadResult> {
    try {
      const result = await invoke<string>('compile_code', {
        code,
        board,
      });

      return {
        success: true,
        stage: 'compile',
        message: 'Compilation successful!\n\nBuild output: ' + result,
      };
    } catch (error) {
      // Log the full error object for debugging
      console.error('Compilation failed - Full error:', error);
      console.error('Error type:', typeof error);
      console.error('Error keys:', error && typeof error === 'object' ? Object.keys(error) : 'N/A');

      // Extract error message from Tauri error
      let errorMessage = 'Unknown compilation error';

      if (typeof error === 'string') {
        // Simple string error
        errorMessage = error;
      } else if (error && typeof error === 'object') {
        // Try different error properties that Tauri might use
        const err = error as any;

        if (err.message) {
          errorMessage = err.message;
        } else if (err.error) {
          errorMessage = err.error;
        } else if (err.toString && err.toString() !== '[object Object]') {
          errorMessage = err.toString();
        } else {
          // Last resort: stringify the entire object
          errorMessage = JSON.stringify(error, null, 2);
        }
      }

      console.error('Extracted error message:', errorMessage);

      return {
        success: false,
        stage: 'compile',
        error: errorMessage,
      };
    }
  }

  /**
   * Upload code to Arduino using arduino-cli
   * Compiles and uploads in a single operation with progress reporting
   */
  async upload(
    port: string,
    code: string,
    board: string,
    onProgress?: UploadProgressCallback
  ): Promise<UploadResult> {
    // Set up event listener for progress updates
    let unlisten: (() => void) | undefined;

    try {
      // Listen for compile-progress events from Rust backend
      if (onProgress) {
        const tauri = (window as any).__TAURI__;
        if (tauri?.event?.listen) {
          unlisten = await tauri.event.listen(
            'compile-progress',
            (event: { payload: CompileProgressEvent }) => {
              const { stage, percent } = event.payload;
              onProgress(stage as 'compiling' | 'uploading', percent);
            }
          );
        }
      }

      // Call the Rust upload_code command
      const result = await invoke<UploadResult>('upload_code', {
        port,
        code,
        board,
      });

      return result;
    } catch (error) {
      console.error('Upload failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    } finally {
      // Clean up event listener
      if (unlisten) {
        unlisten();
      }
    }
  }

  /**
   * Check if arduino-cli is available
   */
  async checkArduinoCli(): Promise<boolean> {
    try {
      return await invoke<boolean>('check_arduino_cli');
    } catch {
      return false;
    }
  }

  /**
   * Get arduino-cli version
   */
  async getArduinoCliVersion(): Promise<string> {
    try {
      return await invoke<string>('get_arduino_cli_version');
    } catch {
      return 'Not available';
    }
  }

  /**
   * List installed Arduino cores
   */
  async listInstalledCores(): Promise<CoreInfo[]> {
    try {
      const cores = await invoke<Array<{
        id: string;
        installed: string;
        latest: string;
        name: string;
      }>>('list_installed_cores');
      return cores;
    } catch {
      return [];
    }
  }

  /**
   * List installed Arduino boards
   */
  async listInstalledBoards(): Promise<BoardInfo[]> {
    try {
      const boards = await invoke<Array<{
        name: string;
        fqbn: string;
      }>>('list_installed_boards');
      return boards;
    } catch {
      return [];
    }
  }

  /**
   * Check if a core is installed for a board FQBN
   */
  async checkCoreStatus(boardFqbn: string): Promise<CoreStatus> {
    try {
      const status = await invoke<{
        core_id: string;
        installed: boolean;
        bundled: boolean;
      }>('check_core_status', { boardFqbn });
      return {
        coreId: status.core_id,
        installed: status.installed,
        bundled: status.bundled,
      };
    } catch {
      return {
        coreId: '',
        installed: false,
        bundled: false,
      };
    }
  }

  /**
   * Install an Arduino core
   */
  async installCore(coreId: string): Promise<string> {
    return await invoke<string>('install_core', { coreId });
  }

  /**
   * Search for available cores
   */
  async searchCores(query: string): Promise<CoreInfo[]> {
    try {
      const cores = await invoke<Array<{
        id: string;
        installed: string;
        latest: string;
        name: string;
      }>>('search_cores', { query });
      return cores;
    } catch {
      return [];
    }
  }

  /**
   * Get list of bundled cores
   */
  async getBundledCores(): Promise<string[]> {
    try {
      return await invoke<string[]>('get_bundled_cores');
    } catch {
      return [];
    }
  }

  /**
   * Export project file using native save dialog
   */
  async exportProject(name: string, content: string): Promise<void> {
    try {
      const saved = await invoke<boolean>('save_file_dialog', { name, content });

      if (!saved) {
        // User cancelled the dialog - this is not an error
        console.log('Export cancelled by user');
      }
    } catch (error) {
      console.error('Failed to export project:', error);
      throw new Error(`Failed to export project: ${error}`);
    }
  }

  /**
   * Import project file using native open dialog
   */
  async importProject(): Promise<{ name: string; content: string } | null> {
    try {
      const result = await invoke<TauriProjectFile | null>('open_file_dialog');

      if (!result) {
        // User cancelled the dialog
        return null;
      }

      return {
        name: result.name,
        content: result.content,
      };
    } catch (error) {
      console.error('Failed to import project:', error);
      return null;
    }
  }
}

/**
 * Emit app-ready event to Tauri backend
 * Signals that the app is fully loaded and ready to show
 */
export function emitAppReady(): void {
  if (typeof window !== 'undefined') {
    const tauri = (window as any).__TAURI__;
    if (tauri?.event?.emit) {
      tauri.event.emit('app-ready');
    }
  }
}
