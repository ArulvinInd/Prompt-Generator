interface ImprovementsPanelProps {
  improvements: string[];
}

export function ImprovementsPanel({ improvements }: ImprovementsPanelProps) {
  if (!improvements.length) return null;

  return (
    <div className="animate-fade-in">
      <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
        What was improved
      </h2>
      <ul className="space-y-2">
        {improvements.map((item, index) => (
          <li key={`improvement-${index}-${item.slice(0, 20)}`} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
            <span className="mt-0.5 flex-shrink-0 text-emerald-400">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
