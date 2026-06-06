import type { ReactNode } from "react";
import type { LucideIcon } from "../../lib/icons";

type Tone = "accent" | "saved";

export function InsightCard({
  icon: Icon,
  tone = "accent",
  children,
}: {
  icon?: LucideIcon;
  tone?: Tone;
  children: ReactNode;
}) {
  const ring =
    tone === "saved"
      ? "border-saved-soft bg-saved-soft/40"
      : "border-accent-soft bg-accent-soft/50";
  const iconWrap =
    tone === "saved"
      ? "bg-saved-soft text-saved-ink"
      : "bg-accent-soft text-accent-ink";
  return (
    <div className={`flex gap-3.5 rounded-2xl border ${ring} px-5 py-4`}>
      {Icon && (
        <span
          className={`mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-[10px] ${iconWrap}`}
        >
          <Icon className="h-4 w-4" strokeWidth={2} />
        </span>
      )}
      <div className="text-[13.5px] leading-relaxed text-slate">{children}</div>
    </div>
  );
}
