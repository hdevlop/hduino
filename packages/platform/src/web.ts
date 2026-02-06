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


export class WebAdapter implements DeviceAdapter {
  getPlatform(): 'web' | 'tauri' {
    return 'web';
  }

  getCapabilities(): PlatformCapabilities {
    return {
      canListPorts: this.hasWebSerial(),
      canUpload: false, // Not implemented yet
      canAutoDetectBoard: false,
      supportsProgress: false,
    };
  }

  /**
   * Check if Web Serial API is available
   */
  private hasWebSerial(): boolean {
    return 'serial' in navigator;
  }

  /**
   * List serial ports using Web Serial API
   * Note: Requires user permission and HTTPS
   */
  async listPorts(): Promise<SerialPort[]> {
    if (!this.hasWebSerial()) {
      console.warn('Web Serial API not available in this browser');
      return [];
    }

    try {
      const ports = await (navigator as any).serial.getPorts();
      return ports.map((port: any) => ({
        path: port.toString(),
        manufacturer: port.getInfo?.()?.usbVendorId?.toString(),
        vendorId: port.getInfo?.()?.usbVendorId?.toString(16),
        productId: port.getInfo?.()?.usbProductId?.toString(16),
      }));
    } catch (error) {
      console.error('Failed to list serial ports:', error);
      return [];
    }
  }

  /**
   * Verify/compile code
   * Not supported in browser without backend service
   */
  async compile(code: string, board: string): Promise<UploadResult> {
    return {
      success: false,
      error: 'Code verification not supported in browser. Please use the desktop app.',
    };
  }

  /**
   * Upload code to Arduino
   * Not supported in browser without backend service
   */
  async upload(
    port: string,
    code: string,
    board: string,
    onProgress?: UploadProgressCallback
  ): Promise<UploadResult> {
    return {
      success: false,
      error: 'Upload not supported in browser. Please use the desktop app or a cloud service.',
    };
  }

  /**
   * Export project file using Download API
   */
  async exportProject(name: string, content: string): Promise<void> {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.hduino`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Import project file using File Picker API
   */
  async importProject(): Promise<{ name: string; content: string } | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.hduino,application/json';
      input.onchange = async (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) {
          resolve(null);
          return;
        }

        try {
          const content = await file.text();
          const name = file.name.replace(/\.hduino$/, '');
          resolve({ name, content });
        } catch (error) {
          console.error('Failed to read project file:', error);
          resolve(null);
        }
      };
      input.oncancel = () => resolve(null);
      input.click();
    });
  }

  // ========== Core Management (Not available in browser) ==========

  async checkArduinoCli(): Promise<boolean> {
    return false;
  }

  async getArduinoCliVersion(): Promise<string> {
    return 'Not available in browser';
  }

  async listInstalledCores(): Promise<CoreInfo[]> {
    return [];
  }

  async listInstalledBoards(): Promise<BoardInfo[]> {
    return [];
  }

  async checkCoreStatus(_boardFqbn: string): Promise<CoreStatus> {
    return {
      coreId: '',
      installed: false,
      bundled: false,
    };
  }

  async installCore(_coreId: string): Promise<string> {
    throw new Error('Core installation not available in browser. Please use the desktop app.');
  }

  async searchCores(_query: string): Promise<CoreInfo[]> {
    return [];
  }

  async getBundledCores(): Promise<string[]> {
    return [];
  }
}
