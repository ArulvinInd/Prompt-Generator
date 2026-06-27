const MAX_CHARS = 2000;
const WARN_THRESHOLD = 0.8; // show amber at 80%

interface PromptInputProps {
  prompt: string;
  isLoading: boolean;
  onPromptChange: (value: string) => void;
  onSubmit: () => void;
}

export function PromptInput({
  prompt,
  isLoading,
  onPromptChange,
  onSubmit,
}: PromptInputProps) {
  const wordCount = prompt.trim() ? prompt.trim().split(/\s+/).length : 0;
  const charCount = prompt.length;
  const charRatio = charCount / MAX_CHARS;
  const isOverLimit = charCount > MAX_CHARS;
  const isWarning = charRatio >= WARN_THRESHOLD && !isOverLimit;

  const progressColor = isOverLimit
    ? "bg-red-500"
    : isWarning
    ? "bg-amber-400"
    : "bg-brand-500";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading && !isOverLimit) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="prompt-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Your rough prompt
          </label>
          {prompt && (
            <button
              type="button"
              onClick={() => onPromptChange("")}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors flex items-center gap-1"
              aria-label="Clear prompt"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear
            </button>
          )}
        </div>
        <textarea
          id="prompt-input"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && !isLoading && !isOverLimit && prompt.trim()) {
              e.preventDefault();
              onSubmit();
            }
          }}
          placeholder="e.g. write something about dogs for my blog..."
          rows={5}
          className={`w-full rounded-xl border bg-white dark:bg-slate-800/60 px-4 py-3 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 resize-none outline-none transition-all focus:ring-2 focus:ring-brand-500 ${
            isOverLimit
              ? "border-red-500 focus:ring-red-500"
              : isWarning
              ? "border-amber-500/80 dark:border-amber-600/60"
              : "border-slate-300 dark:border-slate-700 focus:border-brand-500"
          }`}
        />

        {/* Progress bar */}
        <div className="mt-1.5 h-0.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${progressColor}`}
            style={{ width: `${Math.min(charRatio * 100, 100)}%` }}
          />
        </div>

        <div className={`mt-1 flex justify-between text-xs ${isOverLimit ? "text-red-500 dark:text-red-400" : isWarning ? "text-amber-500 dark:text-amber-400" : "text-slate-500 dark:text-slate-500"}`}>
          <span>{wordCount} {wordCount === 1 ? "word" : "words"}</span>
          <span className="flex items-center gap-3">
            <span className="text-slate-400 dark:text-slate-600 hidden sm:inline">Ctrl+Enter to generate</span>
            <span>{charCount} / {MAX_CHARS}</span>
          </span>
        </div>
      </div>

      {/* Full-width Generate button */}
      <button
        type="submit"
        disabled={isLoading || isOverLimit || !prompt.trim()}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-900/40 transition-all hover:from-brand-500 hover:to-violet-500 hover:shadow-brand-700/40 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
      >
        {isLoading ? (
          <>
            <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Optimizing your prompt…
          </>
        ) : (
          <>
            <span>✨</span>
            Generate Optimized Prompt
          </>
        )}
      </button>

      {isOverLimit && (
        <p className="text-sm text-red-400">
          Your prompt exceeds 2000 characters. Please shorten it.
        </p>
      )}
    </form>
  );
}

