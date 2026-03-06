# 🔍 Script Graper

A desktop tool to search text content across multiple file types — including TXT, SQL, PDF, and more — with support for subdirectory scanning.

Built with **Tauri 2** + **React** + **TypeScript** + **Rust**.

---

## ✨ Features

- 🔎 Search for words or phrases inside files
- 📄 Supports multiple file types: `.txt`, `.sql`, `.log`, `.json`, `.xml`, `.ini`, `.pas`, `.cs`, `.java`, `.html`, `.css`, `.dfm`, `.js`, `.yml`, `.yaml`, `.md`, `.pdf`
- 📁 Optional subdirectory scanning
- 📑 PDF reading via `pdftotext`
- 🖱️ Double-click results to open the file directly
- ⚡ Fast search powered by Rust backend
- 🎨 Modern dark UI

---


## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Rust](https://rustup.rs/)
- [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) with **Desktop development with C++**

### Install dependencies

```bash
npm install
```

### Run in development

```powershell
$env:PATH += ";$env:USERPROFILE\.cargo\bin"
npm run tauri dev
```

### Build for production

```bash
npm run tauri build
```

The installer will be generated at:
```
src-tauri/target/release/bundle/nsis/scriptgraper-app_x.x.x_x64-setup.exe
```

---

## 📦 PDF Support

PDF reading requires `pdftotext.exe` from [Poppler for Windows](https://github.com/oschwartz10612/poppler-windows/releases).

Place `pdftotext.exe` and all DLLs inside:
```
public/bins/
```

They will be bundled automatically in the installer.

---

## 🗂️ Project Structure

```
scriptgraper/
├── src/                        # React frontend
│   ├── components/             # UI components
│   │   ├── SearchForm.tsx
│   │   ├── ResultLog.tsx
│   │   └── ProgressBar.tsx
│   ├── hooks/
│   │   └── useSearch.ts        # Search state & logic
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   └── App.tsx
│
├── src-tauri/                  # Rust backend
│   └── src/
│       ├── commands/
│       │   └── search.rs       # File search logic
│       └── lib.rs
│
└── public/
    └── bins/                   # pdftotext.exe + DLLs
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript |
| Backend | Rust |
| Desktop | Tauri 2 |
| PDF | Poppler (pdftotext) |
| Bundler | Vite |

---

## 📄 License

MIT
