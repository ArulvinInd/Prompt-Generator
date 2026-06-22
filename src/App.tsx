import { useState, useRef } from 'react';
import type { PromptType, ToneType, HistoryItem, TemplateItem, CopilotModel, BgAnimation } from './types';
import { DEFAULT_MODEL } from './utils/copilot';
import { usePromptOptimizer } from './hooks/usePromptOptimizer';
import { usePromptHistory } from './hooks/usePromptHistory';
import { useTheme } from './hooks/useTheme';
import { PromptInput } from './components/PromptInput';
import { PromptOutput } from './components/PromptOutput';
import { ImprovementsPanel } from './components/ImprovementsPanel';
import { TokenStats } from './components/TokenStats';
import { HistoryDrawer } from './components/HistoryDrawer';
import { TemplateModal } from './components/TemplateModal';
import { ThemeToggle } from './components/ThemeToggle';
import { BackgroundScene } from './components/BackgroundScene';
import { BgAnimationPicker } from './components/BgAnimationPicker';
import { TranslatorPanel } from './components/TranslatorPanel';

export default function App() {
  // Input state (lifted so templates can pre-fill)
  const [prompt, setPrompt] = useState("");
  const [promptType, setPromptType] = useState<PromptType>("general");
  const [tone, setTone] = useState<ToneType>("auto");
  const [model, setModel] = useState<CopilotModel>(DEFAULT_MODEL as CopilotModel);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [bgAnimation, setBgAnimation] = useState<BgAnimation>(() => {
    return (localStorage.getItem('bg_animation') as BgAnimation | null) ?? 'orbs';
  });
  const resultsRef = useRef<HTMLDivElement>(null);

  const { result, isLoading, error, optimize } = usePromptOptimizer();
  const { history, addItem, deleteItem, clearAll } = usePromptHistory();
  const { theme, setTheme } = useTheme();

  const handleOptimizeWithHistory = async () => {
    const r = await optimize(prompt, promptType, tone, model);
    if (r) {
      const item: HistoryItem = {
        id: crypto.randomUUID(),
        originalPrompt: prompt,
        result: r,
        createdAt: new Date().toISOString(),
      };
      addItem(item);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  const handleLoadHistory = (item: HistoryItem) => {
    setPrompt(item.originalPrompt);
    setPromptType(item.result.promptType);
    setTone(item.result.tone);
    setIsHistoryOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectTemplate = (template: TemplateItem) => {
    setPrompt(template.prompt);
    setPromptType(template.promptType);
    setTone(template.tone);
  };

  const handleBgChange = (v: BgAnimation) => {
    setBgAnimation(v);
    localStorage.setItem('bg_animation', v);
    setIsSettingsOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <BackgroundScene animation={bgAnimation} />

      {/* Header */}
      <header className="relative z-40 border-b border-slate-200/80 dark:border-slate-800/50 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md">
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center gap-3">
          {/* Brand */}
          <div className="flex items-center gap-2 mr-auto">
            <span className="text-2xl">🪄</span>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-none">Prompt Generator</h1>
              <p className="text-xs text-slate-400 dark:text-slate-500">Powered by GitHub Copilot</p>
            </div>
          </div>

          {/* Theme toggle */}
          <ThemeToggle theme={theme} onChange={setTheme} />

          {/* Settings (bg animation) */}
          <div className="relative">
            <button
              onClick={() => setIsSettingsOpen((v) => !v)}
              title="Background options"
              className={`rounded-lg border px-2.5 py-1.5 transition-all ${
                isSettingsOpen
                  ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-300'
                  : 'border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 hover:border-brand-400 dark:hover:border-brand-600 hover:text-brand-600 dark:hover:text-brand-300'
              }`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            {isSettingsOpen && (
              <div className="absolute right-0 top-full mt-2 z-50 w-80 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl p-4 animate-fade-in">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Background Animation</p>
                <BgAnimationPicker value={bgAnimation} onChange={handleBgChange} />
              </div>
            )}
          </div>

          {/* Templates button */}
          <button
            onClick={() => setIsTemplateModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-300 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-300 transition-all"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <span className="hidden sm:inline">Templates</span>
          </button>

          {/* History button */}
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-300 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-300 transition-all"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden sm:inline">History</span>
            {history.length > 0 && (
              <span className="rounded-full bg-brand-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {history.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="relative mx-auto max-w-3xl px-4 py-8 space-y-6">

        {/* Input card */}
        <section className="rounded-2xl border border-slate-200/80 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm p-6 shadow-lg dark:shadow-xl">
          <PromptInput
            prompt={prompt}
            promptType={promptType}
            tone={tone}
            model={model}
            isLoading={isLoading}
            onPromptChange={setPrompt}
            onPromptTypeChange={setPromptType}
            onToneChange={setTone}
            onModelChange={setModel}
            onSubmit={handleOptimizeWithHistory}
          />

          {/* Error message */}
          {error && (
            <div className="mt-4 rounded-lg border border-red-300 dark:border-red-800/60 bg-red-50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-600 dark:text-red-400 flex items-center justify-between gap-3">
              <span>{error}</span>
              <button
                onClick={handleOptimizeWithHistory}
                disabled={isLoading || !prompt.trim()}
                className="shrink-0 rounded-lg border border-red-400 dark:border-red-700/60 px-3 py-1 text-xs font-medium text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Retry
              </button>
            </div>
          )}
        </section>

        {/* Empty state */}
        {!result && !isLoading && !error && (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8 text-center">
            <div className="text-4xl mb-3">✨</div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-500">Your optimized prompt will appear here</p>
            <p className="text-xs mt-1 text-slate-400 dark:text-slate-600">
              Open{' '}
              <button
                onClick={() => setIsTemplateModalOpen(true)}
                className="underline text-brand-500 hover:text-brand-600 dark:hover:text-brand-300 transition-colors"
              >
                Templates
              </button>{' '}
              or type your own prompt to get started
            </p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div ref={resultsRef} className="space-y-6 animate-fade-in">
            {/* Token stats */}
            <section className="rounded-2xl border border-slate-200/80 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm p-6 shadow-lg dark:shadow-xl">
              <TokenStats
                originalTokens={result.originalTokens}
                optimizedTokens={result.optimizedTokens}
                clarityScore={result.clarityScore}
              />
            </section>

            {/* Optimized prompt + Improvements + Translator */}
            <section className="rounded-2xl border border-slate-200/80 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm p-6 shadow-lg dark:shadow-xl space-y-6">
              <PromptOutput optimizedPrompt={result.optimizedPrompt} />
              <div className="border-t border-slate-200 dark:border-slate-800 pt-5">
                <ImprovementsPanel improvements={result.improvements} />
              </div>
              <TranslatorPanel sourceText={result.optimizedPrompt} />
            </section>
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <section ref={resultsRef} className="rounded-2xl border border-slate-200/80 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm p-6 shadow-lg dark:shadow-xl">
            <div className="animate-pulse space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-3 w-3 rounded-full bg-brand-400 dark:bg-brand-700 animate-bounce [animation-delay:0ms]" />
                <div className="h-3 w-3 rounded-full bg-brand-400 dark:bg-brand-700 animate-bounce [animation-delay:150ms]" />
                <div className="h-3 w-3 rounded-full bg-brand-400 dark:bg-brand-700 animate-bounce [animation-delay:300ms]" />
                <span className="text-sm text-slate-400 dark:text-slate-500 ml-1">Analyzing and optimizing your prompt…</span>
              </div>
              <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 w-5/6 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 w-4/6 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          </section>
        )}
      </main>

      {/* Modals & Drawers */}
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelect={handleSelectTemplate}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        history={history}
        onClose={() => setIsHistoryOpen(false)}
        onLoad={handleLoadHistory}
        onDelete={deleteItem}
        onClearAll={clearAll}
      />
    </div>
  );
}
