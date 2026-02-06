// Prevents additional console window on Windows in release builds
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Listener, Manager, Url};

mod commands;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            // Get handles to both windows
            let splash_window = app.get_webview_window("splash").unwrap();
            let main_window = app.get_webview_window("main").unwrap();

            // Load splash screen URL (dev vs prod)
            #[cfg(dev)]
            let splash_url = "http://localhost:3000/splash.html";
            #[cfg(not(dev))]
            let splash_url = "splash.html";

            // Navigate splash to the correct URL
            let _ = splash_window.navigate(Url::parse(splash_url).unwrap());

            // Handle main window close event - quit the entire app
            let app_handle = app.handle().clone();
            main_window.on_window_event(move |event| {
                if let tauri::WindowEvent::CloseRequested { .. } = event {
                    app_handle.exit(0);
                }
            });

            // Clone handles for the event listener
            let splash = splash_window.clone();
            let main = main_window.clone();

            // Listen for "app-ready" event from the main window
            main_window.listen("app-ready", move |_event| {
                // Show main window (ignore errors if already closed)
                let _ = main.show();

                // Small delay before closing splash to ensure smooth transition
                let splash_clone = splash.clone();
                tauri::async_runtime::spawn(async move {
                    tokio::time::sleep(tokio::time::Duration::from_millis(150)).await;
                    let _ = splash_clone.close();
                });
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::serial::list_ports,
            commands::files::save_file_dialog,
            commands::files::open_file_dialog,
            commands::arduino::compile_code,
            commands::arduino::upload_code,
            commands::arduino::check_arduino_cli,
            commands::arduino::get_arduino_cli_version,
            commands::arduino::list_installed_boards,
            commands::arduino::list_installed_cores,
            commands::arduino::check_core_status,
            commands::arduino::install_core,
            commands::arduino::search_cores,
            commands::arduino::get_bundled_cores,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
