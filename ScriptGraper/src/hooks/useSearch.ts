import { useState, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { SearchOptions, SearchResult, SearchState } from "../types";

const initialState: SearchState = {
    isSearching: false,
    isCancelled: false,
    progress: 0,
    totalFiles: 0,
    results: [],
    logs: [],
};

export function useSearch() {
    const [state, setState] = useState<SearchState>(initialState);

    const startSearch = useCallback(async (options: SearchOptions) => {
        if (!options.folderPath) throw new Error("Selecione uma pasta.");
        if (!options.searchTerm) throw new Error("Informe o termo de busca.");

        setState({ ...initialState, isSearching: true });

        const unlisten = await listen<any>("search_progress", (event) => {
            const data = event.payload;

            setState((prev) => {
                const newResults = data.result
                    ? [...prev.results, data.result as SearchResult]
                    : prev.results;

                // log do "Finalizado" entra depois dos resultados
                const newLogs = data.log && !data.finished
                    ? [...prev.logs, data.log]
                    : prev.logs;

                const finalLogs = data.finished && data.log
                    ? [...newLogs, data.log]
                    : newLogs;

                return {
                    ...prev,
                    progress: data.total > 0 ? (data.current / data.total) * 100 : 0,
                    totalFiles: data.total,
                    logs: finalLogs,
                    results: newResults,
                    isSearching: !data.finished && !data.cancelled,
                    isCancelled: data.cancelled,
                };
            });

            if (data.finished || data.cancelled) {
                unlisten();
            }
        });

        await invoke("realizar_busca", {
            folderPath: options.folderPath,
            searchTerm: options.searchTerm,
            fileFilter: options.allFileTypes ? "*.*" : options.fileFilter,
            searchSubFolders: options.searchSubFolders,
        });
    }, []);

    const cancelSearch = useCallback(async () => {
        await invoke("cancelar_busca");
        setState((prev) => ({ 
            ...prev, 
            isCancelled: true, 
            isSearching: false,
            progress: 0,
            totalFiles: 0,
        }));
    }, []);

    return { state, startSearch, cancelSearch };
}