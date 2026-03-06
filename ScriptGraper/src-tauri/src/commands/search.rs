use std::fs;
use std::path::Path;
use std::process::Command;
use tauri::Emitter;
use walkdir::WalkDir;

// Extensões suportadas
fn eh_arquivo_suportado(ext: &str) -> bool {
    matches!(ext,
        "txt" | "sql" | "log" | "json" | "xml" | "ini" |
        "pas" | "cs" | "java" | "html" | "css" | "dfm" |
        "js" | "yml" | "yaml" | "md" | "pdf"
    )
}

// Lê conteúdo de PDF usando pdftotext.exe
fn ler_pdf(caminho: &str, exe_dir: &str) -> String {
    let pdftotext = format!("{}\\bins\\pdftotext.exe", exe_dir);

    if !Path::new(&pdftotext).exists() {
        return String::new();
    }

    let temp = format!("{}\\pdftemp_{}.txt",
        std::env::temp_dir().to_str().unwrap_or("C:\\Temp"),
        std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap_or_default()
            .as_millis()
    );

    let _ = Command::new(&pdftotext)
        .args([caminho, &temp])
        .creation_flags(0x08000000) // CREATE_NO_WINDOW
        .output();

    let conteudo = fs::read_to_string(&temp).unwrap_or_default();
    let _ = fs::remove_file(&temp);
    conteudo
}

#[derive(serde::Serialize, Clone)]
pub struct SearchResult {
    pub file_name: String,
    pub file_path: String,
    pub match_count: usize,
}

#[derive(serde::Serialize, Clone)]
pub struct SearchProgress {
    pub current: usize,
    pub total: usize,
    pub log: Option<String>,
    pub result: Option<SearchResult>,
    pub finished: bool,
    pub cancelled: bool,
}

#[tauri::command]
pub async fn realizar_busca(
    window: tauri::Window,
    folder_path: String,
    search_term: String,
    file_filter: String,
    search_sub_folders: bool,
) -> Result<(), String> {

    let termo = search_term.to_uppercase();
    let exe_dir = std::env::current_exe()
        .ok()
        .and_then(|p| p.parent().map(|p| p.to_string_lossy().to_string()))
        .unwrap_or_default();

    // Coleta arquivos
    let arquivos: Vec<String> = if search_sub_folders {
        WalkDir::new(&folder_path)
            .into_iter()
            .filter_map(|e| e.ok())
            .filter(|e| e.file_type().is_file())
            .map(|e| e.path().to_string_lossy().to_string())
            .collect()
    } else {
        fs::read_dir(&folder_path)
            .map_err(|e| e.to_string())?
            .filter_map(|e| e.ok())
            .filter(|e| e.file_type().map(|t| t.is_file()).unwrap_or(false))
            .map(|e| e.path().to_string_lossy().to_string())
            .collect()
    };

    // Filtra por extensão
    let arquivos: Vec<String> = if file_filter == "*.*" {
        arquivos.into_iter()
            .filter(|f| {
                Path::new(f).extension()
                    .and_then(|e| e.to_str())
                    .map(|e| eh_arquivo_suportado(e))
                    .unwrap_or(false)
            })
            .collect()
    } else {
        let ext_filtro = file_filter.trim_start_matches("*.");
        arquivos.into_iter()
            .filter(|f| {
                Path::new(f).extension()
                    .and_then(|e| e.to_str())
                    .map(|e| e == ext_filtro)
                    .unwrap_or(false)
            })
            .collect()
    };

    let total = arquivos.len();

    let _ = window.emit("search_progress", SearchProgress {
        current: 0, total,
        log: Some(format!("Iniciando leitura da pasta: {}", folder_path)),
        result: None, finished: false, cancelled: false,
    });

    let _ = window.emit("search_progress", SearchProgress {
        current: 0, total,
        log: Some(format!("{} arquivos detectados...", total)),
        result: None, finished: false, cancelled: false,
    });

    for (i, arquivo) in arquivos.iter().enumerate() {
        let ext = Path::new(arquivo)
            .extension()
            .and_then(|e| e.to_str())
            .unwrap_or("")
            .to_lowercase();

        let conteudo = if ext == "pdf" {
            ler_pdf(arquivo, &exe_dir).to_uppercase()
        } else {
            fs::read_to_string(arquivo).unwrap_or_default().to_uppercase()
        };

        if conteudo.is_empty() {
            continue;
        }

        // Conta ocorrências
        let match_count = conteudo.matches(&termo.as_str()).count();

        if i % 50 == 0 {
            let _ = window.emit("search_progress", SearchProgress {
                current: i + 1, total,
                log: None, result: None,
                finished: false, cancelled: false,
            });
        }

        if match_count > 0 {
            let file_name = Path::new(arquivo)
                .file_name()
                .and_then(|n| n.to_str())
                .unwrap_or("")
                .to_string();

            let _ = window.emit("search_progress", SearchProgress {
                current: i + 1, total, log: None,
                result: Some(SearchResult {
                    file_name,
                    file_path: arquivo.clone(),
                    match_count,
                }),
                finished: false, cancelled: false,
            });
        }
    }

    let _ = window.emit("search_progress", SearchProgress {
        current: total, total,
        log: Some("Finalizado análise.".to_string()),
        result: None, finished: true, cancelled: false,
    });

    Ok(())
}