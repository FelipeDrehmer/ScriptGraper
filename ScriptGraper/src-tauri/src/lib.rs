mod commands;

use commands::search::CancelFlag;
use std::sync::Arc;
use std::sync::atomic::AtomicBool;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(CancelFlag(Arc::new(AtomicBool::new(false))))
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            commands::search::realizar_busca,
            commands::search::abrir_arquivo,
            commands::search::cancelar_busca,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}