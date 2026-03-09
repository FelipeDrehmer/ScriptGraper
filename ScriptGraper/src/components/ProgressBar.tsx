type Props = {
    progress: number;
    totalFiles: number;
    isCancelled: boolean;
};

export function ProgressBar({ progress, totalFiles, isCancelled }: Props) {
    if (isCancelled || totalFiles === 0) return <div className="progress-wrap" />;

    return (
        <div className="progress-wrap">
            <div className="progress-bar-bg">
                <div
                    className="progress-bar-fill"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className="progress-meta">
                <span>{totalFiles > 0 ? "Analisando arquivos..." : ""}</span>
                <span>{totalFiles > 0 ? `${Math.round(progress)}%` : ""}</span>
            </div>
        </div>
    );
}