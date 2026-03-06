import { useState } from "react";
import { SearchOptions, FILE_FILTERS } from "../types";

type Props = {
    onSearch: (options: SearchOptions) => void;
    isSearching: boolean;
    onCancel: () => void;
};

export function SearchForm({ onSearch, isSearching, onCancel }: Props) {
    const [folderPath, setFolderPath] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [fileFilter, setFileFilter] = useState("*.sql");
    const [searchSubFolders, setSearchSubFolders] = useState(false);
    const [allFileTypes, setAllFileTypes] = useState(false);

    const handleSearch = () => {
        onSearch({ folderPath, searchTerm, fileFilter, searchSubFolders, allFileTypes });
    };

    const handleSelectFolder = async () => {
        const { open } = await import("@tauri-apps/plugin-dialog");
        const selected = await open({ directory: true });
        if (selected) setFolderPath(selected as string);
    };

    return (
        <div className="search-form">

            {/* Pasta */}
            <div className="field">
                <label>Pasta de busca</label>
                <div className="field-row">
                    <input
                        type="text"
                        value={folderPath}
                        onChange={(e) => setFolderPath(e.target.value)}
                        placeholder="Selecione uma pasta..."
                    />
                    <button onClick={handleSelectFolder}>📂 Abrir</button>
                </div>
            </div>

            {/* Termo de busca */}
            <div className="field">
                <label>Palavra / frase a buscar</label>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Ex: SELECT * FROM clientes..."
                />
            </div>

            {/* Tipo de arquivo + Parâmetros na mesma linha */}
            <div className="filter-row">
                <div className="field filter-field">
                    <label>Tipo de arquivo</label>
                    <select
                        value={fileFilter}
                        onChange={(e) => setFileFilter(e.target.value)}
                        disabled={allFileTypes}
                    >
                        {FILE_FILTERS.map((f) => (
                            <option key={f} value={f}>{f}</option>
                        ))}
                    </select>
                </div>

                <div className="params">
                    <span className="params-label">[ Parâmetros ]</span>
                    <label className="checkbox-item">
                        <input
                            type="checkbox"
                            checked={searchSubFolders}
                            onChange={(e) => setSearchSubFolders(e.target.checked)}
                        />
                        Buscar em sub pastas
                    </label>
                    <label className="checkbox-item">
                        <input
                            type="checkbox"
                            checked={allFileTypes}
                            onChange={(e) => setAllFileTypes(e.target.checked)}
                        />
                        Todos os tipos de arquivos
                    </label>
                </div>
            </div>

            {/* Botões */}
            <div className="buttons">
                <button
                    className="btn-cancel"
                    onClick={onCancel}
                    disabled={!isSearching}
                >
                    ⊘ Cancelar
                </button>
                <button
                    className="btn-search"
                    onClick={handleSearch}
                    disabled={isSearching}
                >
                    🔍 Pesquisar
                </button>
            </div>

        </div>
    );
}