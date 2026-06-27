import { useEffect, useId, useRef, useState } from 'react';
import type { ThemeMode } from '../types';

interface ThemeToggleProps {
  theme: ThemeMode;
  onChange: (mode: ThemeMode) => void;
}

const options: { mode: ThemeMode; label: string }[] = [
  {
    mode: 'light',
    label: 'Light',
  },
  {
    mode: 'dark',
    label: 'Dark',
  },
  {
    mode: 'system',
    label: 'System',
  },
];

export function ThemeToggle({ theme, onChange }: ThemeToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(() =>
    options.findIndex((option) => option.mode === theme)
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const selectedLabel = options.find((option) => option.mode === theme)?.label ?? 'Theme';
  const selectedIndex = options.findIndex((option) => option.mode === theme);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }, [selectedIndex]);

  useEffect(() => {
    if (isOpen) {
      listboxRef.current?.focus();
    }
  }, [isOpen]);

  const openWithIndex = (index: number) => {
    setIsOpen(true);
    setHighlightedIndex(index);
  };

  const selectIndex = (index: number) => {
    const option = options[index];
    if (!option) return;
    onChange(option.mode);
    setIsOpen(false);
    requestAnimationFrame(() => toggleButtonRef.current?.focus());
  };

  const handleToggleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      openWithIndex(selectedIndex >= 0 ? selectedIndex : 0);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      openWithIndex(selectedIndex >= 0 ? selectedIndex : options.length - 1);
      return;
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleListboxKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((idx) => (idx + 1) % options.length);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((idx) => (idx - 1 + options.length) % options.length);
      return;
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectIndex(highlightedIndex);
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      requestAnimationFrame(() => toggleButtonRef.current?.focus());
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={toggleButtonRef}
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        onKeyDown={handleToggleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        className="flex w-full items-center justify-between rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-200"
      >
        <span>{selectedLabel}</span>
        <svg className="h-4 w-4 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div
          ref={listboxRef}
          id={listboxId}
          role="listbox"
          tabIndex={0}
          onKeyDown={handleListboxKeyDown}
          aria-label="Theme options"
          className="absolute left-0 right-0 top-full z-50 mt-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg overflow-hidden"
        >
          {options.map(({ mode, label }, index) => (
            <button
              key={mode}
              type="button"
              onClick={() => {
                selectIndex(index);
              }}
              tabIndex={-1}
              role="option"
              aria-selected={theme === mode}
              className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                highlightedIndex === index
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100'
                  : theme === mode
                  ? 'bg-brand-500/10 text-brand-700 dark:text-brand-300'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
