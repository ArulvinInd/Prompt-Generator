import { useState, useEffect, useRef } from 'react';
import type { TemplateItem, TemplateCategory } from '../types';
import { TEMPLATES } from '../constants/templates';
import { Backdrop } from './Backdrop';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: TemplateItem) => void;
}

const CATEGORY_COLORS: Record<TemplateCategory, string> = {
  Writing:  'text-violet-400 bg-violet-900/30 dark:bg-violet-900/30 bg-violet-100',
  Coding:   'text-cyan-400 bg-cyan-900/30 dark:bg-cyan-900/30 bg-cyan-100',
  Data:     'text-amber-500 bg-amber-900/30 dark:bg-amber-900/30 bg-amber-100',
  Analysis: 'text-emerald-400 bg-emerald-900/30 dark:bg-emerald-900/30 bg-emerald-100',
  Image:    'text-pink-400 bg-pink-900/30 dark:bg-pink-900/30 bg-pink-100',
};

const ALL_CATEGORIES: TemplateCategory[] = ['Writing', 'Coding', 'Data', 'Analysis', 'Image'];

export function TemplateModal({ isOpen, onClose, onSelect }: TemplateModalProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | 'All'>('All');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchRef.current?.focus(), 50);
    } else {
      setSearch('');
      setActiveCategory('All');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const filtered = TEMPLATES.filter((t) => {
    const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
    const matchesSearch =
      !search ||
      t.label.toLowerCase().includes(search.toLowerCase()) ||
      t.prompt.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelect = (template: TemplateItem) => {
    onSelect(template);
    onClose();
  };

  return (
    <>
      <Backdrop isOpen={isOpen} onClick={onClose} bg="bg-black/60" duration={200} />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Template Browser"
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-[opacity,transform] duration-200 [will-change:opacity,transform] ${
          isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">Prompt Templates</h2>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">
                Pick a starting point — your prompt will be pre-filled
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search + Filter */}
          <div className="px-5 pt-4 pb-3 border-b border-slate-200 dark:border-slate-800 space-y-3">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
              </svg>
              <input
                ref={searchRef}
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search templates…"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 pl-9 pr-4 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(['All', ...ALL_CATEGORIES] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Template grid */}
          <div className="flex-1 overflow-y-auto p-5">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-slate-400 dark:text-slate-600 gap-2">
                <span className="text-2xl">🔍</span>
                <p className="text-sm">No templates match your search</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filtered.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleSelect(template)}
                    className="text-left rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/30 hover:border-brand-400 dark:hover:border-brand-600/60 hover:bg-brand-50 dark:hover:bg-slate-800/60 p-4 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-semibold rounded px-1.5 py-0.5 ${CATEGORY_COLORS[template.category]}`}>
                        {template.category}
                      </span>
                      <span className="text-xl group-hover:scale-110 transition-transform">
                        {template.icon}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors mb-1">
                      {template.label}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 line-clamp-2 leading-relaxed">
                      "{template.prompt}"
                    </p>
                    <div className="mt-2 flex gap-2">
                      <span className="text-[10px] text-slate-400 dark:text-slate-600 capitalize">
                        {template.promptType} · {template.tone}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
