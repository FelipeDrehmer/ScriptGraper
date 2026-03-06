// Opções de busca (equivalente aos campos do formulário)
export type SearchOptions = {
  folderPath: string;        // FCaminhoPasta
  searchTerm: string;        // FConteudo
  fileFilter: string;        // FFiltro (*.sql, *.pdf, *.*)
  searchSubFolders: boolean; // cbBuscarSubPastas
  allFileTypes: boolean;     // cbTodosTipos
}

// Um resultado encontrado (equivalente ao FResultadosCaminhos + LResultados)
export type SearchResult = {
  fileName: string;   // ExtractFileName(LArquivo)
  filePath: string;   // LArquivo (caminho completo, para abrir ao clicar)
  matchCount: number; // LQuantidadeEncontrada
}

// Estado geral da busca (equivalente aos controles de UI)
export type SearchState = {
  isSearching: boolean;    // btnPesquisar.Enabled = False
  isCancelled: boolean;    // FCancelar
  progress: number;        // pbArquivos.Position
  totalFiles: number;      // Length(FArquivos)
  results: SearchResult[]; // FResultadosCaminhos
  logs: string[];          // mmoLog.Lines
}

// Extensões suportadas (equivalente ao EhArquivoTexto)
export const SUPPORTED_EXTENSIONS = [
    '.txt', '.sql', '.log', '.json', '.xml', '.ini',
    '.pas', '.cs', '.java', '.html', '.css', '.dfm',
    '.js', '.yml', '.yaml', '.md', '.pdf'
] as const;

// Filtros do ComboBox
export const FILE_FILTERS = [
    '*.txt',
    '*.sql',
    '*.log',
    '*.json',
    '*.xml',
    '*.ini',
    '*.pas',
    '*.cs',
    '*.java',
    '*.html',
    '*.css',
    '*.dfm',
    '*.js',
    '*.yml',
    '*.yaml',
    '*.md',
    '*.pdf',
    '*.*',
] as const;