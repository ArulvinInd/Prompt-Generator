interface TokenStatsProps {
  originalTokens: number;
  optimizedTokens: number;
  clarityScore: number;
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/40 px-4 py-3 text-center">
      <p className="text-xs text-slate-500 dark:text-slate-500 mb-1">{label}</p>
      <p className={`text-xl font-bold ${accent ?? "text-slate-100"}`}>{value}</p>
      {sub && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{sub}</p>}
    </div>
  );
}

export function TokenStats({ originalTokens, optimizedTokens, clarityScore }: TokenStatsProps) {
  const scoreColor =
    clarityScore >= 80
      ? "text-emerald-400"
      : clarityScore >= 60
      ? "text-amber-400"
      : "text-red-400";

  return (
    <div className="animate-fade-in">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
        Token Estimate
      </h2>
      <div className="flex gap-3 flex-wrap">
        <StatCard
          label="Before"
          value={`~${originalTokens}`}
          sub="tokens"
          accent="text-slate-300"
        />
        <div className="flex items-center text-slate-300 dark:text-slate-600">→</div>
        <StatCard
          label="After"
          value={`~${optimizedTokens}`}
          sub="tokens"
          accent={optimizedTokens <= originalTokens ? "text-emerald-400" : "text-amber-400"}
        />
        <StatCard
          label="Clarity Score"
          value={`${clarityScore}`}
          sub="/ 100"
          accent={scoreColor}
        />
      </div>
    </div>
  );
}
