/**
 * Arduino CLI integration commands
 * Provides compile, upload, and core management functionality
 *
 * Uses:
 * - Sidecar binary for arduino-cli (bundled per-platform)
 * - Bundled data directory with AVR core (for offline UNO support)
 * - On-demand core installation for other boards
 */

use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use std::process::Stdio;
use tauri::{AppHandle, Emitter, Manager};
use tempfile::TempDir;
use tokio::io::{AsyncBufReadExt, BufReader};
use tokio::process::Command;

/// Compile/upload progress event payload
#[derive(Debug, Clone, Serialize)]
pub struct CompileProgress {
    pub stage: String,
    pub percent: u8,
    pub message: String,
}

/// Result from upload operation
#[derive(Debug, Serialize, Deserialize)]
pub struct UploadResult {
    pub success: bool,
    pub stage: Option<String>,
    pub message: Option<String>,
    pub error: Option<String>,
}

/// Core information
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CoreInfo {
    pub id: String,
    pub installed: String,
    pub latest: String,
    pub name: String,
}

/// Board information
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BoardInfo {
    pub name: String,
    pub fqbn: String,
}

/// Core installation status
#[derive(Debug, Clone, Serialize)]
pub struct CoreStatus {
    pub core_id: String,
    pub installed: bool,
    pub bundled: bool,
}

/// Arduino CLI error types
#[derive(Debug, thiserror::Error)]
pub enum ArduinoError {
    #[error("Arduino CLI not found: {0}")]
    CliNotFound(String),
    #[error("Compilation failed: {0}")]
    CompileFailed(String),
    #[error("Upload failed: {0}")]
    #[allow(dead_code)]
    UploadFailed(String),
    #[error("Core not installed: {0}")]
    #[allow(dead_code)]
    CoreNotInstalled(String),
    #[error("Core installation failed: {0}")]
    CoreInstallFailed(String),
    #[error("IO error: {0}")]
    IoError(#[from] std::io::Error),
    #[error("Temp directory error: {0}")]
    TempDirError(String),
    #[error("Shell error: {0}")]
    #[allow(dead_code)]
    ShellError(String),
}

impl Serialize for ArduinoError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(&self.to_string())
    }
}

/// Bundled cores that ship with the app
const BUNDLED_CORES: &[&str] = &["arduino:avr"];

/// Get the path to the arduino data directory
/// Uses app data dir (~/.local/share/com.hduino.app/arduino on Linux)
fn get_data_dir(app: &AppHandle) -> Result<PathBuf, ArduinoError> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| ArduinoError::IoError(std::io::Error::new(std::io::ErrorKind::NotFound, e.to_string())))?;

    let arduino_dir = app_data_dir.join("arduino");

    // Create directory if it doesn't exist
    if !arduino_dir.exists() {
        std::fs::create_dir_all(&arduino_dir)
            .map_err(|e| ArduinoError::IoError(e))?;
    }

    Ok(arduino_dir)
}

/// Get the config file path for arduino-cli
/// Creates the config file if it doesn't exist
fn get_config_path(app: &AppHandle) -> Result<PathBuf, ArduinoError> {
    let data_dir = get_data_dir(app)?;
    let config_path = data_dir.join("arduino-cli.yaml");

    // Create config file if it doesn't exist
    if !config_path.exists() {
        let config_content = format!(
            r#"board_manager:
  additional_urls: []
daemon:
  port: "50051"
directories:
  data: {}
  downloads: {}/staging
  user: {}
library:
  enable_unsafe_install: false
logging:
  file: ""
  format: text
  level: info
metrics:
  addr: ":9090"
  enabled: false
output:
  no_color: false
sketch:
  always_export_binaries: false
updater:
  enable_notification: false
"#,
            data_dir.display(),
            data_dir.display(),
            data_dir.display()
        );

        std::fs::write(&config_path, config_content)
            .map_err(|e| ArduinoError::IoError(e))?;
    }

    Ok(config_path)
}

/// Get path to sidecar binary for direct process spawning
fn get_sidecar_path(app: &AppHandle) -> Result<PathBuf, ArduinoError> {
    let resource_dir = app
        .path()
        .resource_dir()
        .map_err(|e| ArduinoError::IoError(std::io::Error::new(std::io::ErrorKind::NotFound, e.to_string())))?;

    let binary_name = if cfg!(windows) {
        "arduino-cli.exe"
    } else {
        "arduino-cli"
    };

    // Tauri sidecar binaries are in the resource directory with platform suffix
    let sidecar_path = resource_dir.join(binary_name);

    if sidecar_path.exists() {
        return Ok(sidecar_path);
    }

    // Fallback: check binaries subdirectory (dev mode)
    let dev_path = resource_dir.join("binaries").join(binary_name);
    if dev_path.exists() {
        return Ok(dev_path);
    }

    // Fallback: try system PATH
    if let Ok(output) = std::process::Command::new("which")
        .arg("arduino-cli")
        .output()
    {
        if output.status.success() {
            let path = String::from_utf8_lossy(&output.stdout).trim().to_string();
            if !path.is_empty() {
                return Ok(PathBuf::from(path));
            }
        }
    }

    Err(ArduinoError::CliNotFound(
        "arduino-cli sidecar not found".to_string(),
    ))
}

/// Emit progress event to frontend
fn emit_progress(app: &AppHandle, stage: &str, percent: u8, message: &str) {
    let _ = app.emit(
        "compile-progress",
        CompileProgress {
            stage: stage.to_string(),
            percent,
            message: message.to_string(),
        },
    );
}

/// Check if a core is bundled (ships with app)
fn is_bundled_core(core_id: &str) -> bool {
    BUNDLED_CORES.contains(&core_id)
}

/// Get the core ID needed for a board FQBN
fn get_core_from_fqbn(fqbn: &str) -> String {
    let parts: Vec<&str> = fqbn.split(':').collect();
    if parts.len() >= 2 {
        format!("{}:{}", parts[0], parts[1])
    } else {
        fqbn.to_string()
    }
}

/// Initialize bundled Arduino data (extract on first run)
/// This ensures offline support by copying bundled AVR core data
async fn init_bundled_data(app: &AppHandle) -> Result<(), ArduinoError> {
    let data_dir = get_data_dir(app)?;
    let avr_core_path = data_dir.join("packages/arduino/hardware/avr");

    // Check if AVR core already exists
    if avr_core_path.exists() {
        return Ok(());
    }

    // Get bundled resources directory
    let resource_dir = app
        .path()
        .resource_dir()
        .map_err(|e| ArduinoError::IoError(std::io::Error::new(
            std::io::ErrorKind::NotFound,
            e.to_string()
        )))?;

    let bundled_data = resource_dir.join("arduino-data");

    // Check if bundled data exists
    if !bundled_data.exists() {
        // No bundled data - log for debugging but don't fail
        eprintln!("Bundled arduino-data not found at: {:?}", bundled_data);
        return Ok(());
    }

    eprintln!("Initializing bundled Arduino data from: {:?}", bundled_data);
    emit_progress(app, "initializing", 10, "Setting up Arduino environment...");

    // Copy bundled data to app data directory
    let bundled_packages = bundled_data.join("packages");
    if bundled_packages.exists() {
        let target_packages = data_dir.join("packages");
        tokio::fs::create_dir_all(&target_packages).await?;

        emit_progress(app, "initializing", 50, "Installing AVR core...");

        eprintln!("Copying packages from {:?} to {:?}", bundled_packages, target_packages);
        // Copy the entire packages directory
        copy_dir_recursive(&bundled_packages, &target_packages).await?;
    }

    // Copy package index if exists
    let bundled_index = bundled_data.join("package_index");
    if bundled_index.exists() {
        let target_index = data_dir.join("package_index");
        eprintln!("Copying package_index from {:?} to {:?}", bundled_index, target_index);
        copy_dir_recursive(&bundled_index, &target_index).await?;
    }

    emit_progress(app, "initializing", 100, "Arduino environment ready");
    eprintln!("Arduino environment initialization complete");

    Ok(())
}

/// Recursively copy directory
async fn copy_dir_recursive(src: &PathBuf, dst: &PathBuf) -> Result<(), ArduinoError> {
    tokio::fs::create_dir_all(dst).await?;

    let mut entries = tokio::fs::read_dir(src).await?;
    while let Some(entry) = entries.next_entry().await? {
        let src_path = entry.path();
        let dst_path = dst.join(entry.file_name());

        if src_path.is_dir() {
            Box::pin(copy_dir_recursive(&src_path, &dst_path)).await?;
        } else {
            tokio::fs::copy(&src_path, &dst_path).await?;
        }
    }

    Ok(())
}

// ============================================================================
// PUBLIC COMMANDS
// ============================================================================

/// Compile Arduino code without uploading
#[tauri::command]
pub async fn compile_code(
    app: AppHandle,
    code: String,
    board: String,
) -> Result<String, ArduinoError> {
    // Initialize bundled data on first run (for offline support)
    init_bundled_data(&app).await?;

    let cli_path = get_sidecar_path(&app)?;
    let config_path = get_config_path(&app)?;

    // Create temp directory for sketch
    let temp_dir = TempDir::new().map_err(|e| ArduinoError::TempDirError(e.to_string()))?;
    let sketch_dir = temp_dir.path().join("sketch");
    let build_dir = temp_dir.path().join("build");

    tokio::fs::create_dir_all(&sketch_dir).await?;
    tokio::fs::create_dir_all(&build_dir).await?;

    let sketch_file = sketch_dir.join("sketch.ino");
    tokio::fs::write(&sketch_file, &code).await?;

    emit_progress(&app, "compiling", 10, "Starting compilation...");

    let mut cmd = Command::new(&cli_path);

    if config_path.exists() {
        cmd.arg("--config-file").arg(&config_path);
    }

    let mut child = cmd
        .args([
            "compile",
            "--fqbn",
            &board,
            "--output-dir",
            build_dir.to_str().unwrap(),
            sketch_dir.to_str().unwrap(),
            "--verbose",
        ])
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()?;

    let stderr = child.stderr.take().unwrap();
    let mut reader = BufReader::new(stderr).lines();

    // Collect all stderr output for both progress and error reporting
    let mut stderr_output = Vec::new();
    let mut progress = 10u8;

    while let Ok(Some(line)) = reader.next_line().await {
        stderr_output.push(line.clone());

        if line.contains("Compiling") {
            progress = progress.saturating_add(5).min(80);
            emit_progress(&app, "compiling", progress, &line);
        } else if line.contains("Linking") {
            emit_progress(&app, "compiling", 85, "Linking...");
        }
    }

    let status = child.wait().await?;

    if !status.success() {
        // Join all stderr lines to create the full error message
        let error_msg = stderr_output.join("\n");
        emit_progress(&app, "compiling", 0, "Compilation failed");
        return Err(ArduinoError::CompileFailed(error_msg));
    }

    emit_progress(&app, "compiling", 100, "Compilation complete");

    let build_path = build_dir.to_string_lossy().to_string();
    std::mem::forget(temp_dir);

    Ok(build_path)
}

/// Upload code to Arduino board
#[tauri::command]
pub async fn upload_code(
    app: AppHandle,
    port: String,
    code: String,
    board: String,
) -> Result<UploadResult, ArduinoError> {
    // Initialize bundled data on first run (for offline support)
    init_bundled_data(&app).await?;

    let cli_path = get_sidecar_path(&app)?;
    let config_path = get_config_path(&app)?;

    // Create temp directory for sketch
    let temp_dir = TempDir::new().map_err(|e| ArduinoError::TempDirError(e.to_string()))?;
    let sketch_dir = temp_dir.path().join("sketch");
    let build_dir = temp_dir.path().join("build");

    tokio::fs::create_dir_all(&sketch_dir).await?;
    tokio::fs::create_dir_all(&build_dir).await?;

    let sketch_file = sketch_dir.join("sketch.ino");
    tokio::fs::write(&sketch_file, &code).await?;

    // === COMPILE PHASE ===
    emit_progress(&app, "compiling", 5, "Starting compilation...");

    let mut compile_cmd = Command::new(&cli_path);
    if config_path.exists() {
        compile_cmd.arg("--config-file").arg(&config_path);
    }

    let compile_output = compile_cmd
        .args([
            "compile",
            "--fqbn",
            &board,
            "--output-dir",
            build_dir.to_str().unwrap(),
            sketch_dir.to_str().unwrap(),
        ])
        .output()
        .await?;

    if !compile_output.status.success() {
        let error_msg = String::from_utf8_lossy(&compile_output.stderr).to_string();
        emit_progress(&app, "compiling", 0, "Compilation failed");
        return Ok(UploadResult {
            success: false,
            stage: Some("compile".to_string()),
            message: None,
            error: Some(error_msg),
        });
    }

    emit_progress(&app, "compiling", 50, "Compilation complete");

    // === UPLOAD PHASE ===
    emit_progress(&app, "uploading", 55, "Starting upload...");

    let mut upload_cmd = Command::new(&cli_path);
    if config_path.exists() {
        upload_cmd.arg("--config-file").arg(&config_path);
    }

    let upload_output = upload_cmd
        .args([
            "upload",
            "--fqbn",
            &board,
            "--port",
            &port,
            "--input-dir",
            build_dir.to_str().unwrap(),
        ])
        .output()
        .await?;

    if !upload_output.status.success() {
        let error_msg = String::from_utf8_lossy(&upload_output.stderr).to_string();
        emit_progress(&app, "uploading", 0, "Upload failed");
        return Ok(UploadResult {
            success: false,
            stage: Some("upload".to_string()),
            message: None,
            error: Some(error_msg),
        });
    }

    emit_progress(&app, "uploading", 100, "Upload complete!");

    Ok(UploadResult {
        success: true,
        stage: Some("upload".to_string()),
        message: Some("Code uploaded successfully!".to_string()),
        error: None,
    })
}

/// Check if arduino-cli is available
#[tauri::command]
pub async fn check_arduino_cli(app: AppHandle) -> Result<bool, String> {
    match get_sidecar_path(&app) {
        Ok(path) => {
            match Command::new(&path).arg("version").output().await {
                Ok(output) => Ok(output.status.success()),
                Err(_) => Ok(false),
            }
        }
        Err(_) => Ok(false),
    }
}

/// Get arduino-cli version info
#[tauri::command]
pub async fn get_arduino_cli_version(app: AppHandle) -> Result<String, String> {
    let cli_path = get_sidecar_path(&app).map_err(|e| e.to_string())?;

    let output = Command::new(&cli_path)
        .arg("version")
        .output()
        .await
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).trim().to_string())
    } else {
        Err("Failed to get arduino-cli version".to_string())
    }
}

/// List installed Arduino cores
#[tauri::command]
pub async fn list_installed_cores(app: AppHandle) -> Result<Vec<CoreInfo>, String> {
    let cli_path = get_sidecar_path(&app).map_err(|e| e.to_string())?;
    let config_path = get_config_path(&app).map_err(|e| e.to_string())?;

    let mut cmd = Command::new(&cli_path);
    if config_path.exists() {
        cmd.arg("--config-file").arg(&config_path);
    }

    let output = cmd
        .args(["core", "list", "--format", "json"])
        .output()
        .await
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        let json: serde_json::Value = serde_json::from_slice(&output.stdout)
            .map_err(|e| e.to_string())?;

        let mut cores = Vec::new();
        if let Some(arr) = json.as_array() {
            for item in arr {
                if let (Some(id), Some(installed), Some(name)) = (
                    item.get("id").and_then(|v| v.as_str()),
                    item.get("installed_version").and_then(|v| v.as_str()),
                    item.get("name").and_then(|v| v.as_str()),
                ) {
                    cores.push(CoreInfo {
                        id: id.to_string(),
                        installed: installed.to_string(),
                        latest: item.get("latest_version")
                            .and_then(|v| v.as_str())
                            .unwrap_or(installed)
                            .to_string(),
                        name: name.to_string(),
                    });
                }
            }
        }
        Ok(cores)
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

/// List all available boards from installed cores
#[tauri::command]
pub async fn list_installed_boards(app: AppHandle) -> Result<Vec<BoardInfo>, String> {
    let cli_path = get_sidecar_path(&app).map_err(|e| e.to_string())?;
    let config_path = get_config_path(&app).map_err(|e| e.to_string())?;

    let mut cmd = Command::new(&cli_path);
    if config_path.exists() {
        cmd.arg("--config-file").arg(&config_path);
    }

    let output = cmd
        .args(["board", "listall", "--format", "json"])
        .output()
        .await
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        let json: serde_json::Value = serde_json::from_slice(&output.stdout)
            .map_err(|e| e.to_string())?;

        let mut boards = Vec::new();
        if let Some(arr) = json.get("boards").and_then(|v| v.as_array()) {
            for item in arr {
                if let (Some(name), Some(fqbn)) = (
                    item.get("name").and_then(|v| v.as_str()),
                    item.get("fqbn").and_then(|v| v.as_str()),
                ) {
                    boards.push(BoardInfo {
                        name: name.to_string(),
                        fqbn: fqbn.to_string(),
                    });
                }
            }
        }
        Ok(boards)
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

/// Check if a core is installed (and whether it's bundled)
#[tauri::command]
pub async fn check_core_status(app: AppHandle, board_fqbn: String) -> Result<CoreStatus, String> {
    let core_id = get_core_from_fqbn(&board_fqbn);
    let bundled = is_bundled_core(&core_id);

    // Check if installed
    let cores = list_installed_cores(app).await?;
    let installed = cores.iter().any(|c| c.id == core_id);

    Ok(CoreStatus {
        core_id,
        installed,
        bundled,
    })
}

/// Install an Arduino core
#[tauri::command]
pub async fn install_core(app: AppHandle, core_id: String) -> Result<String, ArduinoError> {
    let cli_path = get_sidecar_path(&app)?;
    let config_path = get_config_path(&app)?;

    emit_progress(&app, "installing", 10, &format!("Installing {}...", core_id));

    // First update the index
    let mut update_cmd = Command::new(&cli_path);
    if config_path.exists() {
        update_cmd.arg("--config-file").arg(&config_path);
    }

    let _ = update_cmd
        .args(["core", "update-index"])
        .output()
        .await?;

    emit_progress(&app, "installing", 30, "Downloading core...");

    // Install the core
    let mut install_cmd = Command::new(&cli_path);
    if config_path.exists() {
        install_cmd.arg("--config-file").arg(&config_path);
    }

    let output = install_cmd
        .args(["core", "install", &core_id])
        .output()
        .await?;

    if output.status.success() {
        emit_progress(&app, "installing", 100, "Core installed successfully!");
        Ok(format!("Successfully installed {}", core_id))
    } else {
        let error = String::from_utf8_lossy(&output.stderr).to_string();
        emit_progress(&app, "installing", 0, "Installation failed");
        Err(ArduinoError::CoreInstallFailed(error))
    }
}

/// Search for available cores
#[tauri::command]
pub async fn search_cores(app: AppHandle, query: String) -> Result<Vec<CoreInfo>, String> {
    let cli_path = get_sidecar_path(&app).map_err(|e| e.to_string())?;
    let config_path = get_config_path(&app).map_err(|e| e.to_string())?;

    let mut cmd = Command::new(&cli_path);
    if config_path.exists() {
        cmd.arg("--config-file").arg(&config_path);
    }

    let output = cmd
        .args(["core", "search", &query, "--format", "json"])
        .output()
        .await
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        let json: serde_json::Value = serde_json::from_slice(&output.stdout)
            .map_err(|e| e.to_string())?;

        let mut cores = Vec::new();
        if let Some(arr) = json.as_array() {
            for item in arr {
                if let (Some(id), Some(name)) = (
                    item.get("id").and_then(|v| v.as_str()),
                    item.get("name").and_then(|v| v.as_str()),
                ) {
                    cores.push(CoreInfo {
                        id: id.to_string(),
                        installed: item.get("installed_version")
                            .and_then(|v| v.as_str())
                            .unwrap_or("")
                            .to_string(),
                        latest: item.get("latest_version")
                            .and_then(|v| v.as_str())
                            .unwrap_or("")
                            .to_string(),
                        name: name.to_string(),
                    });
                }
            }
        }
        Ok(cores)
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

/// Get list of bundled cores
#[tauri::command]
pub fn get_bundled_cores() -> Vec<String> {
    BUNDLED_CORES.iter().map(|s| s.to_string()).collect()
}
