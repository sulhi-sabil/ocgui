#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::path::Path;
use std::sync::{Arc, Mutex};
use notify::{Config, RecommendedWatcher, RecursiveMode, Watcher};
use rusqlite::{Connection, Result as SqlResult, params};
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager, State};
use std::process::Command;

const DB_VERSION: i32 = 2;

pub struct DbState {
    conn: Arc<Mutex<Connection>>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Run {
    pub id: String,
    pub session_id: String,
    pub timestamp: i64,
    pub agent: String,
    pub model: String,
    pub input: String,
    pub output: String,
    pub tools_used: String,
    pub exit_status: i32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct RunLog {
    pub id: i64,
    pub run_id: String,
    pub log_line: String,
    pub log_type: String,
    pub timestamp: i64,
}

fn get_db_version(conn: &Connection) -> SqlResult<i32> {
    let version: i32 = conn.query_row(
        "SELECT value FROM schema_version WHERE key = 'version'",
        [],
        |row| row.get(0),
    ).unwrap_or(0);
    Ok(version)
}

fn set_db_version(conn: &Connection, version: i32) -> SqlResult<()> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS schema_version (key TEXT PRIMARY KEY, value INTEGER)",
        [],
    )?;
    conn.execute(
        "INSERT OR REPLACE INTO schema_version (key, value) VALUES ('version', ?1)",
        [version],
    )?;
    Ok(())
}

fn migrate_v1_to_v2(conn: &Connection) -> SqlResult<()> {
    conn.execute_batch(
        "ALTER TABLE runs ADD COLUMN session_id TEXT DEFAULT '';
         ALTER TABLE runs ADD COLUMN model TEXT DEFAULT '';
         ALTER TABLE runs ADD COLUMN tools_used TEXT DEFAULT '[]';
         ALTER TABLE runs ADD COLUMN exit_status INTEGER DEFAULT 0;"
    )?;
    Ok(())
}

fn init_database(app_handle: &AppHandle) -> SqlResult<Connection> {
    let app_dir = app_handle
        .path()
        .app_data_dir()
        .expect("Failed to get app data directory");
    
    std::fs::create_dir_all(&app_dir).expect("Failed to create app data directory");
    
    let db_path = app_dir.join("ocgui.db");
    let conn = Connection::open(&db_path)?;
    
    let current_version = get_db_version(&conn)?;
    
    if current_version < 1 {
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
        
        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_runs_timestamp ON runs(timestamp DESC)",
            [],
        )?;
        
        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_runs_agent ON runs(agent_id)",
            [],
        )?;
        
        set_db_version(&conn, 1)?;
    }
    
    if current_version < 2 {
        conn.execute(
            "CREATE TABLE IF NOT EXISTS runs_v2 (
                id TEXT PRIMARY KEY,
                session_id TEXT NOT NULL,
                timestamp INTEGER NOT NULL,
                agent TEXT NOT NULL,
                model TEXT NOT NULL,
                input TEXT NOT NULL,
                output TEXT,
                tools_used TEXT DEFAULT '[]',
                exit_status INTEGER DEFAULT 0
            )",
            [],
        )?;
        
        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_runs_v2_timestamp ON runs_v2(timestamp DESC)",
            [],
        )?;
        
        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_runs_v2_session ON runs_v2(session_id)",
            [],
        )?;
        
        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_runs_v2_agent ON runs_v2(agent)",
            [],
        )?;
        
        conn.execute(
            "CREATE TABLE IF NOT EXISTS run_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                run_id TEXT NOT NULL,
                log_line TEXT NOT NULL,
                log_type TEXT NOT NULL DEFAULT 'info',
                timestamp INTEGER NOT NULL,
                FOREIGN KEY (run_id) REFERENCES runs_v2(id) ON DELETE CASCADE
            )",
            [],
        )?;
        
        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_run_logs_run_id ON run_logs(run_id)",
            [],
        )?;
        
        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_run_logs_timestamp ON run_logs(timestamp)",
            [],
        )?;
        
        set_db_version(&conn, 2)?;
    }
    
    Ok(conn)
}

#[tauri::command]
fn add_run(state: State<DbState>, run: Run) -> Result<(), String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    
    conn.execute(
        "INSERT INTO runs_v2 (id, session_id, timestamp, agent, model, input, output, tools_used, exit_status)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)",
        params![
            &run.id,
            &run.session_id,
            &run.timestamp,
            &run.agent,
            &run.model,
            &run.input,
            &run.output,
            &run.tools_used,
            &run.exit_status
        ],
    ).map_err(|e| e.to_string())?;
    
    Ok(())
}

#[tauri::command]
fn get_runs(state: State<DbState>, limit: i64) -> Result<Vec<Run>, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    
    let mut stmt = conn
        .prepare("SELECT id, session_id, timestamp, agent, model, input, output, tools_used, exit_status 
                  FROM runs_v2 ORDER BY timestamp DESC LIMIT ?1")
        .map_err(|e| e.to_string())?;
    
    let runs = stmt
        .query_map([limit], |row| {
            Ok(Run {
                id: row.get(0)?,
                session_id: row.get(1)?,
                timestamp: row.get(2)?,
                agent: row.get(3)?,
                model: row.get(4)?,
                input: row.get(5)?,
                output: row.get(6)?,
                tools_used: row.get(7)?,
                exit_status: row.get(8)?,
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
        .prepare("SELECT id, session_id, timestamp, agent, model, input, output, tools_used, exit_status 
                  FROM runs_v2 WHERE id = ?1")
        .map_err(|e| e.to_string())?;
    
    let run = stmt
        .query_row([&run_id], |row| {
            Ok(Run {
                id: row.get(0)?,
                session_id: row.get(1)?,
                timestamp: row.get(2)?,
                agent: row.get(3)?,
                model: row.get(4)?,
                input: row.get(5)?,
                output: row.get(6)?,
                tools_used: row.get(7)?,
                exit_status: row.get(8)?,
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
        "DELETE FROM runs_v2 WHERE id = ?1",
        [&run_id],
    ).map_err(|e| e.to_string())?;
    
    conn.execute(
        "DELETE FROM run_logs WHERE run_id = ?1",
        [&run_id],
    ).map_err(|e| e.to_string())?;
    
    Ok(())
}

#[tauri::command]
fn get_runs_by_session(state: State<DbState>, session_id: String) -> Result<Vec<Run>, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    
    let mut stmt = conn
        .prepare("SELECT id, session_id, timestamp, agent, model, input, output, tools_used, exit_status 
                  FROM runs_v2 WHERE session_id = ?1 ORDER BY timestamp ASC")
        .map_err(|e| e.to_string())?;
    
    let runs = stmt
        .query_map([&session_id], |row| {
            Ok(Run {
                id: row.get(0)?,
                session_id: row.get(1)?,
                timestamp: row.get(2)?,
                agent: row.get(3)?,
                model: row.get(4)?,
                input: row.get(5)?,
                output: row.get(6)?,
                tools_used: row.get(7)?,
                exit_status: row.get(8)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<SqlResult<Vec<Run>>>()
        .map_err(|e| e.to_string())?;
    
    Ok(runs)
}

#[tauri::command]
fn add_run_log(state: State<DbState>, log: RunLog) -> Result<i64, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    
    conn.execute(
        "INSERT INTO run_logs (run_id, log_line, log_type, timestamp)
         VALUES (?1, ?2, ?3, ?4)",
        params![&log.run_id, &log.log_line, &log.log_type, &log.timestamp],
    ).map_err(|e| e.to_string())?;
    
    Ok(conn.last_insert_rowid())
}

#[tauri::command]
fn get_run_logs(state: State<DbState>, run_id: String) -> Result<Vec<RunLog>, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    
    let mut stmt = conn
        .prepare("SELECT id, run_id, log_line, log_type, timestamp 
                  FROM run_logs WHERE run_id = ?1 ORDER BY timestamp ASC")
        .map_err(|e| e.to_string())?;
    
    let logs = stmt
        .query_map([&run_id], |row| {
            Ok(RunLog {
                id: row.get(0)?,
                run_id: row.get(1)?,
                log_line: row.get(2)?,
                log_type: row.get(3)?,
                timestamp: row.get(4)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<SqlResult<Vec<RunLog>>>()
        .map_err(|e| e.to_string())?;
    
    Ok(logs)
}

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
            get_runs_by_session,
            add_run_log,
            get_run_logs,
            watch_agents_file,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
