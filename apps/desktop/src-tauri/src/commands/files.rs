use serde::{Deserialize, Serialize};
use std::fs;
use tauri_plugin_dialog::{DialogExt, FilePath};

#[derive(Debug, Serialize, Deserialize)]
pub struct ProjectFile {
    pub name: String,
    pub content: String,
}

#[derive(Debug, Serialize, thiserror::Error)]
pub enum FileError {
    #[error("Failed to save file: {0}")]
    SaveError(String),
    #[error("Failed to read file: {0}")]
    ReadError(String),
    #[error("Dialog cancelled")]
    #[allow(dead_code)]
    Cancelled,
}

#[tauri::command]
pub async fn save_file_dialog(
    app: tauri::AppHandle,
    name: String,
    content: String,
) -> Result<bool, FileError> {
    let file_name = format!("{}.hduino", name);

    let file_path = app
        .dialog()
        .file()
        .set_file_name(&file_name)
        .add_filter("Hduino Project", &["hduino", "json"])
        .blocking_save_file();

    match file_path {
        Some(path) => {
            let path_str = match path {
                FilePath::Path(p) => p,
                FilePath::Url(url) => url.to_file_path().map_err(|_| {
                    FileError::SaveError("Invalid file URL".to_string())
                })?,
            };
            fs::write(&path_str, &content).map_err(|e| FileError::SaveError(e.to_string()))?;
            Ok(true)
        }
        None => Ok(false),
    }
}

#[tauri::command]
pub async fn open_file_dialog(app: tauri::AppHandle) -> Result<Option<ProjectFile>, FileError> {
    let file_path = app
        .dialog()
        .file()
        .add_filter("Hduino Project", &["hduino", "json"])
        .blocking_pick_file();

    match file_path {
        Some(path) => {
            let path_buf = match path {
                FilePath::Path(p) => p,
                FilePath::Url(url) => url.to_file_path().map_err(|_| {
                    FileError::ReadError("Invalid file URL".to_string())
                })?,
            };

            let content =
                fs::read_to_string(&path_buf).map_err(|e| FileError::ReadError(e.to_string()))?;

            let name = path_buf
                .file_stem()
                .and_then(|s| s.to_str())
                .unwrap_or("untitled")
                .to_string();

            Ok(Some(ProjectFile { name, content }))
        }
        None => Ok(None),
    }
}
