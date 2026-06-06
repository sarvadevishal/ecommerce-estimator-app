import type { ReactNode } from "react";
import type { LucideIcon } from "../../lib/icons";

type Tone = "ink" | "accent" | "saved" | "success";

const VALUE_COLOR: Record<Tone, string> = {
  ink: "text-ink",
  accent: "text-accent-ink",
  saved: "text-saved-ink",
  success: "text-success-ink",
};

const ICON_WRAP: Record<Tone, string> = {
  ink: "bg-surface-2 text-ink",
  accent: "bg-accent-soft text-accent-ink",
  saved: "bg-saved-soft text-saved-ink",
  success: "bg-success-soft text-success-ink",
};

interface Props {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  unit?: string;
  tone?: Tone;
  badge?: ReactNode;
  sub?: ReactNode;
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  unit,
  tone = "ink",
  badge,
  sub,
}: Props) {
  return (
    <div className="card lift p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="kicker">{label}</span>
        <span
          className={`flex h-8 w-8 flex-none items-center justify-center rounded-[10px] ${ICON_WRAP[tone]}`}
        >
          <Icon className="h-4 w-4" strokeWidth={2} />
        </span>
      </div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span
          className={`display tnum text-[2.05rem] leading-none ${VALUE_COLOR[tone]}`}
        >
          {value}
        </span>
        {unit && <span className="text-sm text-mute">{unit}</span>}
      </div>
      {(badge || sub) && (
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          {badge}
          {sub && <span className="text-[12px] text-mute">{sub}</span>}
        </div>
      )}
    </div>
  );
}
