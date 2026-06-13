use tauri::{Builder, State, AppHandle};
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
fn toggle_theme(app: State<ThemeState>) -> String {
    let state = app.inner().lock().unwrap();
    let new_theme = if state.current_theme == "dark" {
        "light"
    } else {
        "dark"
    }.to_string();
    
    let mut state = app.inner().lock().unwrap();
    state.current_theme = new_theme.clone();
    new_theme
}

#[tauri::command]
fn send_notification(title: &str, body: &str, app: AppHandle) -> Result<(), String> {
    app.notification()
        .builder(&app.config().app.name.clone().unwrap_or_else(|| "App".to_string()))
        .title(title)
        .body(body)
        .show()
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn get_theme(app: State<ThemeState>) -> String {
    let state = app.inner().lock().unwrap();
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
