import { useState, useRef, useEffect } from 'react';
import type { HistoryItem } from '../types';
import { PROMPT_TYPE_LABELS } from '../constants/labels';

interface HistoryDrawerProps {
  isOpen: boolean;
  history: HistoryItem[];
  onClose: () => void;
  onLoad: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function HistoryDrawer({
  isOpen,
  history,
  onClose,
  onLoad,
  onDelete,
  onClearAll,
}: HistoryDrawerProps) {
  const [confirmClear, setConfirmClear] = useState(false);
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    };
  }, []);

  const handleClearAll = () => {
    if (confirmClear) {
      onClearAll();
      setConfirmClear(false);
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    } else {
      setConfirmClear(true);
      clearTimerRef.current = setTimeout(() => setConfirmClear(false), 3000);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none invisible"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        aria-label="Prompt History"
        aria-hidden={!isOpen}
        className={`fixed top-0 right-0 h-full w-80 max-w-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 z-50 flex flex-col shadow-2xl transition-transform duration-300 [will-change:transform] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200">Prompt History</h2>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={handleClearAll}
                className={`text-xs transition-colors ${
                  confirmClear
                    ? "text-red-300 font-semibold animate-pulse"
                    : "text-red-500 hover:text-red-400"
                }`}
              >
                {confirmClear ? "Confirm clear?" : "Clear all"}
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2 px-4 text-center">
              <span className="text-3xl">📭</span>
              <p className="text-sm">No history yet. Generate some prompts to see them here.</p>
            </div>
          ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {history.map((item) => (
                  <li key={item.id} className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs text-slate-400 dark:text-slate-500">{formatDate(item.createdAt)}</span>
                    <span className="text-xs text-brand-400 bg-brand-900/30 rounded px-1.5 py-0.5 shrink-0">
                      {PROMPT_TYPE_LABELS[item.result.promptType] ?? item.result.promptType}
                    </span>
                  </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-2">
                    {item.result.optimizedPrompt}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onLoad(item)}
                      className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
                    >
                      Load
                    </button>
                      <span className="text-slate-300 dark:text-slate-700">·</span>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="text-xs text-red-500 hover:text-red-400 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}
