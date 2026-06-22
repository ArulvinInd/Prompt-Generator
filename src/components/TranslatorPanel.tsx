import { useState } from 'react';
import { callCopilot } from '../utils/copilot';
import { TRANSLATE_LANGUAGES, LANGUAGE_GROUPS } from '../constants/languages';
import type { LanguageCode } from '../constants/languages';

const DEFAULT_LANG_KEY = 'default_translate_lang';

function getDefaultLang(): LanguageCode {
  const saved = localStorage.getItem(DEFAULT_LANG_KEY) as LanguageCode | null;
  return saved && TRANSLATE_LANGUAGES.some((l) => l.code === saved) ? saved : 'ta';
}

interface TranslatorPanelProps {
  sourceText: string;
}

const TRANSLATION_SYSTEM = `You are a professional translator. Translate the given text accurately into the requested language. Preserve the original meaning, tone, and formatting. Return only the translated text — no explanations, no preamble, no quotation marks wrapping the output.`;

export function TranslatorPanel({ sourceText }: TranslatorPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>(getDefaultLang);
  const [defaultLang, setDefaultLang] = useState<LanguageCode>(getDefaultLang);
  const [translated, setTranslated] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedTranslation, setCopiedTranslation] = useState(false);

  const selectedLang = TRANSLATE_LANGUAGES.find((l) => l.code === language);
  const selectedLabel = selectedLang?.label ?? language;
  const selectedLangName = selectedLang?.label.replace(/^\S+\s/, '') ?? language;
  const isDefault = language === defaultLang;

  const handleSetDefault = () => {
    localStorage.setItem(DEFAULT_LANG_KEY, language);
    setDefaultLang(language);
  };

  const handleTranslate = async () => {
    setError(null);
    setTranslated(null);
    setIsLoading(true);

    try {
      const userMessage = `Translate the following text into ${selectedLangName}:\n\n${sourceText}`;
      const result = await callCopilot(TRANSLATION_SYSTEM, userMessage, 'gpt-4o-mini', false);
      setTranslated(result.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!translated) return;
    try {
      await navigator.clipboard.writeText(translated);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = translated;
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopiedTranslation(true);
    setTimeout(() => setCopiedTranslation(false), 2000);
  };

  return (
    <div className="border-t border-slate-200 dark:border-slate-800 pt-5">
      {/* Toggle row */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-300 transition-colors group w-full"
      >
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span>🌐</span>
        <span>Translate this prompt</span>
        {translated && !isOpen && (
          <span className="ml-auto text-xs text-emerald-500 dark:text-emerald-400 font-normal">
            Translated to {selectedLangName}
          </span>
        )}
      </button>

      {/* Expanded panel */}
      {isOpen && (
        <div className="mt-4 space-y-4 animate-fade-in">
          {/* Language selector + default + Translate button */}
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[180px]">
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="translate-lang" className="block text-xs font-medium text-slate-500 dark:text-slate-400">
                  Target Language
                </label>
                <button
                  onClick={handleSetDefault}
                  disabled={isDefault}
                  title={isDefault ? 'This is your default language' : 'Set as default language'}
                  className={`group relative overflow-hidden flex items-center gap-1.5 rounded-full text-xs font-semibold transition-all duration-300 px-3 py-1 ${
                    isDefault
                      ? 'text-amber-800 dark:text-amber-200 cursor-default'
                      : 'border border-dashed border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-500 hover:border-amber-400 dark:hover:border-amber-500 hover:text-amber-500 dark:hover:text-amber-400 cursor-pointer'
                  }`}
                  style={isDefault ? {
                    background: 'radial-gradient(ellipse at center, rgba(251,191,36,0.28) 0%, rgba(245,158,11,0.13) 60%, transparent 100%)',
                    border: '1px solid rgba(245,158,11,0.45)',
                    boxShadow: '0 0 14px 2px rgba(245,158,11,0.22), inset 0 0 8px rgba(251,191,36,0.1)',
                  } : undefined}
                >
                  {/* Active state: pulsing orb shimmer */}
                  {isDefault && (
                    <span
                      className="absolute inset-0 animate-pulse rounded-full"
                      style={{
                        background: 'radial-gradient(circle at 30% 40%, rgba(251,191,36,0.32) 0%, transparent 65%)',
                        animationDuration: '2s',
                      }}
                    />
                  )}
                  {/* Inactive hover state: dot-grid pattern fades in */}
                  {!isDefault && (
                    <span
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full"
                      style={{
                        backgroundImage: 'radial-gradient(circle, rgba(245,158,11,0.18) 1px, transparent 1px)',
                        backgroundSize: '5px 5px',
                      }}
                    />
                  )}
                  {/* Content */}
                  <span className="relative z-10 flex items-center gap-1">
                    <svg
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${isDefault ? 'scale-110' : 'group-hover:scale-110'}`}
                      viewBox="0 0 24 24"
                      fill={isDefault ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      strokeWidth={2}
                      style={isDefault ? { filter: 'drop-shadow(0 0 3px rgba(251,191,36,0.9))' } : undefined}
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    {isDefault ? 'Default' : 'Set default'}
                  </span>
                </button>
              </div>
              <select
                id="translate-lang"
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value as LanguageCode);
                  setTranslated(null);
                  setError(null);
                }}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 cursor-pointer"
              >
                {LANGUAGE_GROUPS.map((group) => (
                  <optgroup key={group.group} label={group.group}>
                    {group.languages.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.label}{l.code === defaultLang ? ' ★' : ''}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <button
              onClick={handleTranslate}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-xl border border-brand-600/50 bg-brand-600/10 dark:bg-brand-900/30 px-5 py-2 text-sm font-semibold text-brand-600 dark:text-brand-300 hover:bg-brand-600/20 dark:hover:bg-brand-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Translating…
                </>
              ) : (
                <>🌐 Translate</>
              )}
            </button>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
          )}

          {/* Translated output */}
          {translated && (
            <div className="space-y-2 animate-fade-in">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {selectedLabel}
                </p>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                    copiedTranslation
                      ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700'
                      : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-300'
                  }`}
                >
                  {copiedTranslation ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <div className="rounded-xl border border-brand-200 dark:border-brand-700/40 bg-brand-50/50 dark:bg-slate-800/40 p-4">
                <p className="text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-wrap text-sm">
                  {translated}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
