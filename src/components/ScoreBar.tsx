export function ScoreBar({ score }: { score: number }) {
  const pct = Math.min(100, Math.max(0, (score / 10) * 100))
  const color =
    score >= 8
      ? 'from-accent-cyan to-accent-green'
      : score >= 6
        ? 'from-accent-amber to-accent-amber'
        : 'from-danger to-danger'

  return (
    <div className="flex items-center gap-2" role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={10} aria-label={`评分 ${score.toFixed(1)} 分`}>
      <div className="flex-1 h-1.5 rounded-full bg-bg-primary overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-mono tabular-nums text-text-secondary min-w-[2.5rem] text-right">
        {score.toFixed(1)}
      </span>
    </div>
  )
}
