import { useEffect, useState, useRef } from 'react';
import type { PromptType, ToneType, HistoryItem, TemplateItem, CopilotModel, BgAnimation } from './types';
import { DEFAULT_MODEL } from './utils/copilot';
import { usePromptOptimizer } from './hooks/usePromptOptimizer';
import { usePromptHistory } from './hooks/usePromptHistory';
import { useTheme } from './hooks/useTheme';
import { usePWAInstall } from './hooks/usePWAInstall';
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
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { PROMPT_TYPE_LABELS, TONE_LABELS, MODEL_LABELS } from './constants/labels';

const PROMPT_TYPE_VALUES = Object.keys(PROMPT_TYPE_LABELS) as PromptType[];
const TONE_VALUES = Object.keys(TONE_LABELS) as ToneType[];
const MODEL_VALUES = Object.keys(MODEL_LABELS) as CopilotModel[];

function isAllowedValue<T extends string>(value: string, allowedValues: readonly T[]): value is T {
  return (allowedValues as readonly string[]).includes(value);
}

function getStoredValue<T extends string>(key: string, allowedValues: readonly T[], fallback: T): T {
  const value = localStorage.getItem(key);
  if (!value) return fallback;
  return isAllowedValue(value, allowedValues) ? value : fallback;
}

export default function App() {
  // Input state (lifted so templates can pre-fill)
  const [prompt, setPrompt] = useState("");
  const [promptType, setPromptType] = useState<PromptType>(() => {
    return getStoredValue('prompt_type', PROMPT_TYPE_VALUES, "general");
  });
  const [tone, setTone] = useState<ToneType>(() => {
    return getStoredValue('tone', TONE_VALUES, "auto");
  });
  const [model, setModel] = useState<CopilotModel>(() => {
    return getStoredValue('model', MODEL_VALUES, DEFAULT_MODEL as CopilotModel);
  });
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [bgAnimation, setBgAnimation] = useState<BgAnimation>(() => {
    return (localStorage.getItem('bg_animation') as BgAnimation | null) ?? 'orbs';
  });
  const resultsRef = useRef<HTMLDivElement>(null);
  const settingsDialogRef = useRef<HTMLDivElement>(null);

  const { isInstallable, install, dismiss } = usePWAInstall();

  const { result, isLoading, error, optimize } = usePromptOptimizer();
  const { history, addItem, deleteItem, clearAll } = usePromptHistory();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    localStorage.setItem('prompt_type', promptType);
  }, [promptType]);

  useEffect(() => {
    localStorage.setItem('tone', tone);
  }, [tone]);

  useEffect(() => {
    localStorage.setItem('model', model);
  }, [model]);

  useEffect(() => {
    if (isSettingsOpen) {
      settingsDialogRef.current?.focus();
    }
  }, [isSettingsOpen]);

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
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <BackgroundScene animation={bgAnimation} />

      {/* Header */}
      <header className="relative z-40 border-b border-slate-200/80 dark:border-slate-800/50 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md [backface-visibility:hidden]">
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center gap-3">
          {/* Brand */}
          <div className="flex items-center gap-2 mr-auto">
            <span className="text-2xl">🪄</span>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-none">Prompt Generator</h1>
              <p className="text-xs text-slate-400 dark:text-slate-500">Powered by GitHub Copilot</p>
            </div>
          </div>

          {/* Settings */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-300 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-300 transition-[color,border-color,background-color]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.572c1.756.427 1.756 2.925 0 3.352a1.724 1.724 0 00-1.066 2.572c.94 1.543-.827 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.572-1.066c-1.543.94-3.31-.827-2.37-2.37a1.724 1.724 0 00-1.066-2.572c-1.756-.427-1.756-2.925 0-3.352a1.724 1.724 0 001.066-2.572c-.94-1.543.827-3.31 2.37-2.37.996.608 2.296.07 2.572-1.066z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="hidden sm:inline">Settings</span>
          </button>

          {/* Templates button */}
          <button
            onClick={() => setIsTemplateModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-300 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-300 transition-[color,border-color,background-color]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <span className="hidden sm:inline">Templates</span>
          </button>

          {/* History button */}
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-300 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-300 transition-[color,border-color,background-color]"
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
            isLoading={isLoading}
            onPromptChange={setPrompt}
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
            <section className="rounded-2xl border border-slate-200/80 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm p-6 shadow-lg dark:shadow-xl [content-visibility:auto] [contain-intrinsic-size:auto_160px]">
              <TokenStats
                originalTokens={result.originalTokens}
                optimizedTokens={result.optimizedTokens}
                clarityScore={result.clarityScore}
              />
            </section>

            {/* Optimized prompt + Improvements + Translator */}
            <section className="rounded-2xl border border-slate-200/80 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm p-6 shadow-lg dark:shadow-xl space-y-6 [content-visibility:auto] [contain-intrinsic-size:auto_500px]">
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
          <section ref={resultsRef} className="rounded-2xl border border-slate-200/80 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm p-6 shadow-lg dark:shadow-xl [content-visibility:auto] [contain-intrinsic-size:auto_200px]">
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

      {isSettingsOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm"
          onClick={() => setIsSettingsOpen(false)}
          onKeyDown={(e) => {
            if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              setIsSettingsOpen(false);
            }
          }}
          tabIndex={0}
          aria-label="Close settings"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
            ref={settingsDialogRef}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsSettingsOpen(false);
                return;
              }
              if (e.key === 'Tab') {
                const focusable = settingsDialogRef.current?.querySelectorAll<HTMLElement>(
                  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                if (!focusable || focusable.length === 0) return;
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                  e.preventDefault();
                  last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                  e.preventDefault();
                  first.focus();
                }
              }
            }}
            onClick={(e) => e.stopPropagation()}
            className="h-full w-full bg-white dark:bg-slate-950 md:mx-auto md:mt-10 md:h-auto md:max-h-[85vh] md:max-w-2xl md:rounded-2xl md:border md:border-slate-200 md:dark:border-slate-800 md:shadow-2xl overflow-y-auto"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 px-4 py-3 backdrop-blur-sm">
              <div>
                <h2 id="settings-title" className="text-base font-semibold text-slate-900 dark:text-slate-100">Settings</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Saved automatically for your next session</p>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                aria-label="Close settings"
                className="rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-300"
              >
                Close
              </button>
            </div>

            <div className="space-y-6 p-4 md:p-6">
              <section className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-4">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Prompt Defaults</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="settings-prompt-type" className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Prompt Type</label>
                    <div className="relative">
                      <select
                        id="settings-prompt-type"
                        value={promptType}
                        onChange={(e) => setPromptType(e.target.value as PromptType)}
                        className="w-full appearance-none rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 pr-10 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                      >
                        {Object.entries(PROMPT_TYPE_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500 dark:text-slate-400">
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                          <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="settings-tone" className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Tone</label>
                    <div className="relative">
                      <select
                        id="settings-tone"
                        value={tone}
                        onChange={(e) => setTone(e.target.value as ToneType)}
                        className="w-full appearance-none rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 pr-10 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                      >
                        {Object.entries(TONE_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500 dark:text-slate-400">
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                          <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">AI Model</h3>
                <div>
                  <label htmlFor="settings-model" className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Model</label>
                  <div className="relative">
                    <select
                      id="settings-model"
                      value={model}
                      onChange={(e) => setModel(e.target.value as CopilotModel)}
                      className="w-full appearance-none rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 pr-10 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    >
                      {Object.entries(MODEL_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500 dark:text-slate-400">
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </div>
              </section>

              <section className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-4">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Appearance</h3>
                <div>
                  <p className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Theme</p>
                  <ThemeToggle theme={theme} onChange={setTheme} />
                </div>

                <details className="group rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-3">
                  <summary className="cursor-pointer list-none text-sm font-medium text-slate-700 dark:text-slate-200">
                    <span className="inline-flex items-center gap-2">
                      Advanced
                      <svg className="h-3.5 w-3.5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <div className="mt-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Background Animation</p>
                    <BgAnimationPicker value={bgAnimation} onChange={handleBgChange} />
                  </div>
                </details>
              </section>
            </div>
          </div>
        </div>
      )}

      {isInstallable && (
        <PWAInstallBanner onInstall={install} onDismiss={dismiss} />
      )}
    </div>
  );
}
