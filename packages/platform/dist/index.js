// src/web.ts
var WebAdapter = class {
  getPlatform() {
    return "web";
  }
  getCapabilities() {
    return {
      canListPorts: this.hasWebSerial(),
      canUpload: false,
      // Not implemented yet
      canAutoDetectBoard: false,
      supportsProgress: false
    };
  }
  /**
   * Check if Web Serial API is available
   */
  hasWebSerial() {
    return "serial" in navigator;
  }
  /**
   * List serial ports using Web Serial API
   * Note: Requires user permission and HTTPS
   */
  async listPorts() {
    if (!this.hasWebSerial()) {
      console.warn("Web Serial API not available in this browser");
      return [];
    }
    try {
      const ports = await navigator.serial.getPorts();
      return ports.map((port) => ({
        path: port.toString(),
        manufacturer: port.getInfo?.()?.usbVendorId?.toString(),
        vendorId: port.getInfo?.()?.usbVendorId?.toString(16),
        productId: port.getInfo?.()?.usbProductId?.toString(16)
      }));
    } catch (error) {
      console.error("Failed to list serial ports:", error);
      return [];
    }
  }
  /**
   * Verify/compile code
   * Not supported in browser without backend service
   */
  async compile(code, board) {
    return {
      success: false,
      error: "Code verification not supported in browser. Please use the desktop app."
    };
  }
  /**
   * Upload code to Arduino
   * Not supported in browser without backend service
   */
  async upload(port, code, board, onProgress) {
    return {
      success: false,
      error: "Upload not supported in browser. Please use the desktop app or a cloud service."
    };
  }
  /**
   * Export project file using Download API
   */
  async exportProject(name, content) {
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
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
  async importProject() {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".hduino,application/json";
      input.onchange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) {
          resolve(null);
          return;
        }
        try {
          const content = await file.text();
          const name = file.name.replace(/\.hduino$/, "");
          resolve({ name, content });
        } catch (error) {
          console.error("Failed to read project file:", error);
          resolve(null);
        }
      };
      input.oncancel = () => resolve(null);
      input.click();
    });
  }
  // ========== Core Management (Not available in browser) ==========
  async checkArduinoCli() {
    return false;
  }
  async getArduinoCliVersion() {
    return "Not available in browser";
  }
  async listInstalledCores() {
    return [];
  }
  async listInstalledBoards() {
    return [];
  }
  async checkCoreStatus(_boardFqbn) {
    return {
      coreId: "",
      installed: false,
      bundled: false
    };
  }
  async installCore(_coreId) {
    throw new Error("Core installation not available in browser. Please use the desktop app.");
  }
  async searchCores(_query) {
    return [];
  }
  async getBundledCores() {
    return [];
  }
};

// src/tauri.ts
function getInvoke() {
  const tauri = window.__TAURI__;
  if (!tauri) {
    throw new Error("Tauri API not available");
  }
  if (tauri.core?.invoke) {
    return tauri.core.invoke;
  }
  if (tauri.tauri?.invoke) {
    return tauri.tauri.invoke;
  }
  if (typeof tauri.invoke === "function") {
    return tauri.invoke;
  }
  throw new Error("Could not find Tauri invoke function");
}
async function invoke(cmd, args) {
  const invokeFn = getInvoke();
  return invokeFn(cmd, args);
}
var TauriAdapter = class {
  getPlatform() {
    return "tauri";
  }
  getCapabilities() {
    return {
      canListPorts: true,
      canUpload: true,
      // Enabled via Arduino CLI integration (Phase 8)
      canAutoDetectBoard: false,
      supportsProgress: true
    };
  }
  /**
   * List available serial ports using native serialport library
   */
  async listPorts() {
    try {
      const ports = await invoke("list_ports");
      return ports.map((port) => ({
        path: port.path,
        manufacturer: port.manufacturer ?? void 0,
        vendorId: port.vendor_id ?? void 0,
        productId: port.product_id ?? void 0
      }));
    } catch (error) {
      console.error("Failed to list serial ports:", error);
      return [];
    }
  }
  /**
   * Verify/compile code without uploading
   */
  async compile(code, board) {
    try {
      const result = await invoke("compile_code", {
        code,
        board
      });
      return {
        success: true,
        stage: "compile",
        message: "Compilation successful!\n\nBuild output: " + result
      };
    } catch (error) {
      console.error("Compilation failed - Full error:", error);
      console.error("Error type:", typeof error);
      console.error("Error keys:", error && typeof error === "object" ? Object.keys(error) : "N/A");
      let errorMessage = "Unknown compilation error";
      if (typeof error === "string") {
        errorMessage = error;
      } else if (error && typeof error === "object") {
        const err = error;
        if (err.message) {
          errorMessage = err.message;
        } else if (err.error) {
          errorMessage = err.error;
        } else if (err.toString && err.toString() !== "[object Object]") {
          errorMessage = err.toString();
        } else {
          errorMessage = JSON.stringify(error, null, 2);
        }
      }
      console.error("Extracted error message:", errorMessage);
      return {
        success: false,
        stage: "compile",
        error: errorMessage
      };
    }
  }
  /**
   * Upload code to Arduino using arduino-cli
   * Compiles and uploads in a single operation with progress reporting
   */
  async upload(port, code, board, onProgress) {
    let unlisten;
    try {
      if (onProgress) {
        const tauri = window.__TAURI__;
        if (tauri?.event?.listen) {
          unlisten = await tauri.event.listen(
            "compile-progress",
            (event) => {
              const { stage, percent } = event.payload;
              onProgress(stage, percent);
            }
          );
        }
      }
      const result = await invoke("upload_code", {
        port,
        code,
        board
      });
      return result;
    } catch (error) {
      console.error("Upload failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    } finally {
      if (unlisten) {
        unlisten();
      }
    }
  }
  /**
   * Check if arduino-cli is available
   */
  async checkArduinoCli() {
    try {
      return await invoke("check_arduino_cli");
    } catch {
      return false;
    }
  }
  /**
   * Get arduino-cli version
   */
  async getArduinoCliVersion() {
    try {
      return await invoke("get_arduino_cli_version");
    } catch {
      return "Not available";
    }
  }
  /**
   * List installed Arduino cores
   */
  async listInstalledCores() {
    try {
      const cores = await invoke("list_installed_cores");
      return cores;
    } catch {
      return [];
    }
  }
  /**
   * List installed Arduino boards
   */
  async listInstalledBoards() {
    try {
      const boards = await invoke("list_installed_boards");
      return boards;
    } catch {
      return [];
    }
  }
  /**
   * Check if a core is installed for a board FQBN
   */
  async checkCoreStatus(boardFqbn) {
    try {
      const status = await invoke("check_core_status", { boardFqbn });
      return {
        coreId: status.core_id,
        installed: status.installed,
        bundled: status.bundled
      };
    } catch {
      return {
        coreId: "",
        installed: false,
        bundled: false
      };
    }
  }
  /**
   * Install an Arduino core
   */
  async installCore(coreId) {
    return await invoke("install_core", { coreId });
  }
  /**
   * Search for available cores
   */
  async searchCores(query) {
    try {
      const cores = await invoke("search_cores", { query });
      return cores;
    } catch {
      return [];
    }
  }
  /**
   * Get list of bundled cores
   */
  async getBundledCores() {
    try {
      return await invoke("get_bundled_cores");
    } catch {
      return [];
    }
  }
  /**
   * Export project file using native save dialog
   */
  async exportProject(name, content) {
    try {
      const saved = await invoke("save_file_dialog", { name, content });
      if (!saved) {
        console.log("Export cancelled by user");
      }
    } catch (error) {
      console.error("Failed to export project:", error);
      throw new Error(`Failed to export project: ${error}`);
    }
  }
  /**
   * Import project file using native open dialog
   */
  async importProject() {
    try {
      const result = await invoke("open_file_dialog");
      if (!result) {
        return null;
      }
      return {
        name: result.name,
        content: result.content
      };
    } catch (error) {
      console.error("Failed to import project:", error);
      return null;
    }
  }
};
function emitAppReady() {
  if (typeof window !== "undefined") {
    const tauri = window.__TAURI__;
    if (tauri?.event?.emit) {
      tauri.event.emit("app-ready");
    }
  }
}

// src/detect.ts
var cachedAdapter = null;
function detectAdapter() {
  if (typeof window !== "undefined" && window.__TAURI__) {
    return new TauriAdapter();
  }
  return new WebAdapter();
}
function getAdapter() {
  if (!cachedAdapter) {
    cachedAdapter = detectAdapter();
  }
  return cachedAdapter;
}
function isTauri() {
  return typeof window !== "undefined" && !!window.__TAURI__;
}
function isWeb() {
  return !isTauri();
}
export {
  TauriAdapter,
  WebAdapter,
  detectAdapter,
  emitAppReady,
  getAdapter,
  isTauri,
  isWeb
};
//# sourceMappingURL=index.js.map