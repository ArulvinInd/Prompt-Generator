import type { TemplateItem, TemplateCategory } from '../types';
import { TEMPLATES } from '../constants/templates';

interface TemplateGridProps {
  onSelect: (template: TemplateItem) => void;
}

const CATEGORY_COLORS: Record<TemplateCategory, string> = {
  Writing: "text-violet-400 bg-violet-900/30",
  Coding: "text-cyan-400 bg-cyan-900/30",
  Data: "text-amber-400 bg-amber-900/30",
  Analysis: "text-emerald-400 bg-emerald-900/30",
  Image: "text-pink-400 bg-pink-900/30",
};

export function TemplateGrid({ onSelect }: TemplateGridProps) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500 mb-3 uppercase tracking-wider">
        Start with a template
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template)}
            className="rounded-xl border border-slate-700/50 bg-slate-800/30 px-3 py-3 text-left hover:border-brand-600/50 hover:bg-slate-800/60 hover:shadow-md hover:shadow-brand-900/20 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-[10px] font-semibold rounded px-1.5 py-0.5 ${CATEGORY_COLORS[template.category]}`}
              >
                {template.category}
              </span>
              <span className="text-base leading-none group-hover:scale-110 transition-transform">
                {template.icon}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors leading-snug">
              {template.label}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
