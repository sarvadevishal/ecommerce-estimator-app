// Dependency-free chart primitives. Every bar is a proportion of `scale` days,
// so bars stay comparable across rows and animate as toggles change the totals.

interface StackBarProps {
  manualDays: number;
  aiDays: number;
  scale: number; // the track represents this many days (>= manualDays)
  className?: string; // height utility, e.g. "h-2.5"
}

// A single horizontal bar: the filled portion is the task's manual effort,
// split into the accent (effort that remains with AI) and cyan (effort saved).
export function StackBar({
  manualDays,
  aiDays,
  scale,
  className = "h-2.5",
}: StackBarProps) {
  const filledPct = scale > 0 ? Math.min(100, (manualDays / scale) * 100) : 0;
  const aiPct = manualDays > 0 ? (aiDays / manualDays) * 100 : 0;
  return (
    <div
      className={`w-full overflow-hidden rounded-full bg-surface-2 ${className}`}
    >
      <div
        className="flex h-full transition-[width] duration-500 ease-out"
        style={{ width: `${filledPct}%` }}
      >
        <div
          className="h-full bg-accent transition-[width] duration-500 ease-out"
          style={{ width: `${aiPct}%` }}
        />
        <div
          className="h-full bg-saved transition-[width] duration-500 ease-out"
          style={{ width: `${100 - aiPct}%` }}
        />
      </div>
    </div>
  );
}

interface ScopeBarProps {
  mvp: number;
  phase2: number;
  scale: number;
  className?: string;
}

// MVP vs Phase 2 split of the included work.
export function ScopeBar({
  mvp,
  phase2,
  scale,
  className = "h-2.5",
}: ScopeBarProps) {
  const mvpPct = scale > 0 ? (mvp / scale) * 100 : 0;
  const p2Pct = scale > 0 ? (phase2 / scale) * 100 : 0;
  return (
    <div
      className={`flex w-full overflow-hidden rounded-full bg-surface-2 ${className}`}
    >
      <div
        className="h-full bg-ink transition-[width] duration-500 ease-out"
        style={{ width: `${mvpPct}%` }}
      />
      <div
        className="h-full bg-mute transition-[width] duration-500 ease-out"
        style={{ width: `${p2Pct}%` }}
      />
    </div>
  );
}

export interface LegendItem {
  color: string; // a CSS color, e.g. "var(--color-accent)"
  label: string;
}

export function Legend({ items }: { items: LegendItem[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
      {items.map((it) => (
        <span
          key={it.label}
          className="flex items-center gap-1.5 text-[12px] text-mute"
        >
          <span className="dot" style={{ background: it.color }} />
          {it.label}
        </span>
      ))}
    </div>
  );
}
