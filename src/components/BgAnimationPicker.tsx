import type { BgAnimation } from '../types';

interface BgAnimationPickerProps {
  value: BgAnimation;
  onChange: (v: BgAnimation) => void;
}

const OPTIONS: { value: BgAnimation; label: string; icon: string }[] = [
  { value: 'none',      label: 'None',      icon: '✕' },
  { value: 'orbs',      label: 'Orbs',      icon: '◉' },
  { value: 'particles', label: 'Particles', icon: '·:·' },
  { value: 'grid',      label: 'Grid',      icon: '⊞' },
];

export function BgAnimationPicker({ value, onChange }: BgAnimationPickerProps) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          title={opt.label}
          className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${
            value === opt.value
              ? 'border-brand-500 bg-brand-500/20 text-brand-300 dark:text-brand-300'
              : 'border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <span className="font-mono leading-none">{opt.icon}</span>
          {opt.label}
        </button>
      ))}
    </div>
  );
}
