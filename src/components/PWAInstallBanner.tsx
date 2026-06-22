interface PWAInstallBannerProps {
  onInstall: () => void;
  onDismiss: () => void;
}

export function PWAInstallBanner({ onInstall, onDismiss }: PWAInstallBannerProps) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm animate-slide-in">
      <div className="flex items-center gap-3 rounded-2xl border border-brand-200 dark:border-brand-800/60 bg-white dark:bg-slate-900 shadow-xl dark:shadow-2xl px-4 py-3">
        {/* Icon */}
        <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-brand-600 flex items-center justify-center text-xl shadow-md shadow-brand-500/30">
          🪄
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight truncate">
            Install PromptGen
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Add to home screen for quick access
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onInstall}
            className="rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold px-3 py-1.5 transition-colors shadow-sm"
          >
            Install
          </button>
          <button
            onClick={onDismiss}
            title="Dismiss"
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
