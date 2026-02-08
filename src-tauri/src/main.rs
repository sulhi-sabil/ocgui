// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::path::Path;
use std::sync::{Arc, Mutex};
use notify::{Config, RecommendedWatcher, RecursiveMode, Watcher};
use rusqlite::{Connection, Result as SqlResult};
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager, State};
use std::process::Command;

// Database state
pub struct DbState {
    conn: Arc<Mutex<Connection>>,
}

// Run record for SQLite
#[derive(Debug, Serialize, Deserialize)]
pub struct Run {
    pub id: String,
    pub timestamp: String,
    pub agent_id: String,
    pub agent_name: String,
    pub prompt: String,
    pub output: String,
    pub status: String,
    pub duration_ms: i64,
}

// Initialize SQLite database
fn init_database(app_handle: &AppHandle) -> SqlResult<Connection> {
    let app_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .expect("Failed to get app data directory");
    
    std::fs::create_dir_all(&app_dir).expect("Failed to create app data directory");
    
    let db_path = app_dir.join("ocgui.db");
    let conn = Connection::open(&db_path)?;
    
    // Create runs table
    conn.execute(
        "CREATE TABLE IF NOT EXISTS runs (
            id TEXT PRIMARY KEY,
            timestamp TEXT NOT NULL,
            agent_id TEXT NOT NULL,
            agent_name TEXT NOT NULL,
            prompt TEXT NOT NULL,
            output TEXT,
            status TEXT NOT NULL,
            duration_ms INTEGER
        )",
        [],
    )?;
    
    // Create index for faster queries
    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_runs_timestamp ON runs(timestamp DESC)",
        [],
    )?;
    
    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_runs_agent ON runs(agent_id)",
        [],
    )?;
    
    Ok(conn)
}

#[tauri::command]
fn add_run(state: State<DbState>, run: Run) -> Result<(), String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    
    conn.execute(
        "INSERT INTO runs (id, timestamp, agent_id, agent_name, prompt, output, status, duration_ms)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
        [
            &run.id,
            &run.timestamp,
            &run.agent_id,
            &run.agent_name,
            &run.prompt,
            &run.output,
            &run.status,
            &run.duration_ms.to_string(),
        ],
    ).map_err(|e| e.to_string())?;
    
    Ok(())
}

#[tauri::command]
fn get_runs(state: State<DbState>, limit: i64) -> Result<Vec<Run>, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    
    let mut stmt = conn
        .prepare("SELECT id, timestamp, agent_id, agent_name, prompt, output, status, duration_ms 
                  FROM runs ORDER BY timestamp DESC LIMIT ?1")
        .map_err(|e| e.to_string())?;
    
    let runs = stmt
        .query_map([limit], |row| {
            Ok(Run {
                id: row.get(0)?,
                timestamp: row.get(1)?,
                agent_id: row.get(2)?,
                agent_name: row.get(3)?,
                prompt: row.get(4)?,
                output: row.get(5)?,
                status: row.get(6)?,
                duration_ms: row.get(7)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<SqlResult<Vec<Run>>>()
        .map_err(|e| e.to_string())?;
    
    Ok(runs)
}

#[tauri::command]
fn get_run_by_id(state: State<DbState>, run_id: String) -> Result<Option<Run>, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    
    let mut stmt = conn
        .prepare("SELECT id, timestamp, agent_id, agent_name, prompt, output, status, duration_ms 
                  FROM runs WHERE id = ?1")
        .map_err(|e| e.to_string())?;
    
    let run = stmt
        .query_row([&run_id], |row| {
            Ok(Run {
                id: row.get(0)?,
                timestamp: row.get(1)?,
                agent_id: row.get(2)?,
                agent_name: row.get(3)?,
                prompt: row.get(4)?,
                output: row.get(5)?,
                status: row.get(6)?,
                duration_ms: row.get(7)?,
            })
        })
        .optional()
        .map_err(|e| e.to_string())?;
    
    Ok(run)
}

#[tauri::command]
fn delete_run(state: State<DbState>, run_id: String) -> Result<(), String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    
    conn.execute(
        "DELETE FROM runs WHERE id = ?1",
        [&run_id],
    ).map_err(|e| e.to_string())?;
    
    Ok(())
}

// File watcher setup
fn setup_file_watcher(app_handle: AppHandle) -> Result<RecommendedWatcher, String> {
    let app_handle_clone = app_handle.clone();
    
    let watcher = RecommendedWatcher::new(
        move |res| {
            match res {
                Ok(event) => {
                    let _ = app_handle_clone.emit_all("file-change", format!("{:?}", event));
                }
                Err(e) => {
                    eprintln!("Watch error: {:?}", e);
                }
            }
        },
        Config::default(),
    ).map_err(|e| e.to_string())?;
    
    Ok(watcher)
}

#[tauri::command]
fn watch_agents_file(app_handle: AppHandle, file_path: String) -> Result<(), String> {
    let watcher = setup_file_watcher(app_handle)?;
    
    let mut watcher = watcher;
    watcher.watch(Path::new(&file_path), RecursiveMode::NonRecursive)
        .map_err(|e| e.to_string())?;
    
    // Store watcher in app state to keep it alive
    std::mem::forget(watcher);
    
    Ok(())
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn run_opencode_command(args: Vec<String>) -> Result<String, String> {
    let output = Command::new("opencode")
        .args(&args)
        .output()
        .map_err(|e| format!("Failed to execute opencode: {}", e))?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

#[tauri::command]
async fn check_opencode_installed() -> bool {
    tokio::process::Command::new("opencode")
        .arg("--version")
        .output()
        .await
        .map(|output| output.status.success())
        .unwrap_or(false)
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_process::init())
        .setup(|app| {
            // Initialize database
            let conn = init_database(&app.handle())?;
            app.manage(DbState {
                conn: Arc::new(Mutex::new(conn)),
            });
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            run_opencode_command,
            check_opencode_installed,
            add_run,
            get_runs,
            get_run_by_id,
            delete_run,
            watch_agents_file,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
