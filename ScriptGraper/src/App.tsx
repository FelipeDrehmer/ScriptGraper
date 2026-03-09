import { useSearch } from "./hooks/useSearch";
import { SearchForm } from "./components/searchForm";
import { ProgressBar } from "./components/ProgressBar";
import { ResultLog } from "./components/ResultLog";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useCallback } from "react";
import logo from "./assets/logo.svg";
import "./App.css";

function App() {
  const { state, startSearch, cancelSearch } = useSearch();

  const handleSearch = async (options: any) => {
    try {
      await startSearch(options);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleMinimize = useCallback(async () => {
    await getCurrentWindow().minimize();
  }, []);

  const handleMaximize = useCallback(async () => {
    const win = getCurrentWindow();
    if (await win.isMaximized()) {
      await win.unmaximize();
    } else {
      await win.maximize();
    }
  }, []);

  const handleClose = useCallback(async () => {
    await getCurrentWindow().close();
  }, []);

  return (
    <main className="app">
      <div className="titlebar">
        <span className="titlebar-title">Script Graper</span>
        <div className="titlebar-buttons">
          <button onClick={handleMinimize}>─</button>
          <button onClick={handleMaximize}>□</button>
          <button className="btn-close" onClick={handleClose}>✕</button>
        </div>
      </div>
      <div className="header">
        <div className="logo-icon"><img src={logo} className="logo-icon" width={42} height={42} /></div>
        <div className="title-block">
          <h1>Script Graper</h1>
          <p>busca de conteúdo em arquivos</p>
        </div>
      </div>
      <div className="body">
        <SearchForm
          onSearch={handleSearch}
          isSearching={state.isSearching}
          onCancel={cancelSearch}
        />
        <ProgressBar
          progress={state.progress}
          totalFiles={state.totalFiles}
          isCancelled={state.isCancelled}
        />
        <ResultLog
          logs={state.logs}
          results={state.results}
        />
      </div>
    </main>
  );
}

export default App;