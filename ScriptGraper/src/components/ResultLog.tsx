import { SearchResult } from "../types";
import { invoke } from "@tauri-apps/api/core";

type Props = {
    logs: string[];
    results: SearchResult[];
};

export function ResultLog({ logs, results }: Props) {
    const handleOpenFile = async (filePath: string) => {
        await invoke("abrir_arquivo", { caminho: filePath });
    };

    // separa o "Finalizado análise" dos outros logs
    const logsNormais = logs.filter(l => !l.includes("Finalizado"));
    const logFinal = logs.find(l => l.includes("Finalizado"));

    return (
        <div className="log-wrap">
            <div className="log-header">
                <span className="log-title">Output</span>
                {results.length > 0 && (
                    <span className="log-badge">{results.length} resultados</span>
                )}
            </div>
            <div className="log-box">
                {logsNormais.map((log, i) => (
                    <div key={i} className="log-info">&gt; {log}</div>
                ))}
                {results.map((result, i) => (
                    <div
                        key={i}
                        className="log-match"
                        onClick={() => handleOpenFile(result.filePath)}
                        title={result.filePath}
                    >
                        <span>[{result.matchCount}x]</span> — {result.fileName}
                    </div>
                ))}
                {logFinal && (
                    <div className="log-info">&gt; {logFinal}</div>
                )}
            </div>
        </div>
    );
}