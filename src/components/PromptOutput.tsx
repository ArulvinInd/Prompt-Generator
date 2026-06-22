import { useState } from 'react';

interface PromptOutputProps {
  optimizedPrompt: string;
}

export function PromptOutput({ optimizedPrompt }: PromptOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(optimizedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = optimizedPrompt;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2">
          <span className="text-brand-400">✨</span>
          Optimized Prompt
        </h2>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
            copied
              ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 border border-emerald-400 dark:border-emerald-700"
              : "bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-300"
          }`}
        >
          {copied ? (
            <>
              <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <div className="rounded-xl border border-brand-200 dark:border-brand-700/40 bg-brand-50/40 dark:bg-slate-800/40 p-4">
        <p className="text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-wrap text-sm">
          {optimizedPrompt}
        </p>
      </div>
    </div>
  );
}
