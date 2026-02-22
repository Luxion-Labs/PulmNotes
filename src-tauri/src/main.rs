// Prevents additional console window on Windows in release builds
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod db;

use db::Database;
use std::path::PathBuf;
use std::sync::Arc;
use tauri::Manager;

struct AppState {
    db: Arc<Database>,
    db_path: PathBuf,
}

#[tauri::command]
fn load_notes(state: tauri::State<AppState>) -> Result<String, String> {
    state.db.load_notes().map_err(|e| e.to_string())
}

#[tauri::command]
fn save_notes(data: String, state: tauri::State<AppState>) -> Result<(), String> {
    state.db.save_notes(data).map_err(|e| e.to_string())
}

#[tauri::command]
fn load_categories(state: tauri::State<AppState>) -> Result<String, String> {
    state.db.load_categories().map_err(|e| e.to_string())
}

#[tauri::command]
fn save_categories(data: String, state: tauri::State<AppState>) -> Result<(), String> {
    state.db.save_categories(data).map_err(|e| e.to_string())
}

#[tauri::command]
fn load_subcategories(state: tauri::State<AppState>) -> Result<String, String> {
    state.db.load_subcategories().map_err(|e| e.to_string())
}

#[tauri::command]
fn save_subcategories(data: String, state: tauri::State<AppState>) -> Result<(), String> {
    state.db.save_subcategories(data).map_err(|e| e.to_string())
}

#[tauri::command]
fn load_assets(state: tauri::State<AppState>) -> Result<String, String> {
    state.db.load_assets().map_err(|e| e.to_string())
}

#[tauri::command]
fn save_assets(data: String, state: tauri::State<AppState>) -> Result<(), String> {
    state.db.save_assets(data).map_err(|e| e.to_string())
}

#[tauri::command]
fn load_reflections(state: tauri::State<AppState>) -> Result<String, String> {
    state.db.load_reflections().map_err(|e| e.to_string())
}

#[tauri::command]
fn save_reflections(data: String, state: tauri::State<AppState>) -> Result<(), String> {
    state.db.save_reflections(data).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_database_size(state: tauri::State<AppState>) -> Result<u64, String> {
    state.db.get_database_size(&state.db_path).map_err(|e| e.to_string())
}

fn main() {
    if let Err(error) = run() {
        eprintln!("failed to start Pulm Notes: {error}");
        std::process::exit(1);
    }
}

fn run() -> tauri::Result<()> {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_http::init())
        .setup(|app| {
            let app_data_dir = app.path().app_data_dir()?;
            std::fs::create_dir_all(&app_data_dir)?;
            let db_path = app_data_dir.join("pulm_notes.db");
            
            let db = Database::new(db_path.clone())
                .map_err(|e| std::io::Error::other(e.to_string()))?;
            
            app.manage(AppState {
                db: Arc::new(db),
                db_path,
            });

            #[cfg(target_os = "macos")]
            {
                use tauri::Manager;
                let window = app.get_webview_window("main").unwrap();
                window.set_title_bar_style(tauri::TitleBarStyle::Transparent).ok();
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            load_notes,
            save_notes,
            load_categories,
            save_categories,
            load_subcategories,
            save_subcategories,
            load_assets,
            save_assets,
            load_reflections,
            save_reflections,
            get_database_size
        ])
        .run(tauri::generate_context!())
}
