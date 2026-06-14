use tauri::{Builder, State, AppHandle, Manager};
use tauri_plugin_notification::NotificationExt;
use serde::{Serialize, Deserialize};
use std::sync::{Arc, Mutex};

#[derive(Debug, Serialize, Deserialize, Clone)]
struct ThemeState {
    current_theme: String,
}

impl Default for ThemeState {
    fn default() -> Self {
        ThemeState {
            current_theme: "dark".to_string(),
        }
    }
}

#[tauri::command]
fn toggle_theme(app: State<Arc<Mutex<ThemeState>>>) -> String {
    let mut state = app.lock().unwrap();
    let current = state.current_theme.clone();
    let new_theme = if current == "dark" {
        "light"
    } else {
        "dark"
    }.to_string();
    
    state.current_theme = new_theme.clone();
    new_theme
}

#[tauri::command]
fn send_notification(title: &str, body: &str, app: AppHandle) -> Result<(), String> {
    app.notification()
        .builder()
        .title(title)
        .body(body)
        .show()
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn get_theme(app: State<Arc<Mutex<ThemeState>>>) -> String {
    let state = app.lock().unwrap();
    state.current_theme.clone()
}

pub fn run() {
    Builder::default()
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            
            app.manage(Arc::new(Mutex::new(ThemeState::default())));
            
            Ok(())
        })
        .plugin(tauri_plugin_notification::init())
        .invoke_handler(tauri::generate_handler![
            toggle_theme,
            send_notification,
            get_theme
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
