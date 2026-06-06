import type { ReactNode } from "react";
import type { Confidence, Automatable } from "../../lib/types";

export type BadgeTone =
  | "neutral"
  | "ai"
  | "saved"
  | "success"
  | "amber"
  | "danger";

const TONE: Record<BadgeTone, string> = {
  neutral: "badge",
  ai: "badge badge-ai",
  saved: "badge badge-saved",
  success: "badge badge-success",
  amber: "badge badge-amber",
  danger: "badge badge-danger",
};

export function Badge({
  tone = "neutral",
  dot,
  children,
}: {
  tone?: BadgeTone;
  dot?: string;
  children: ReactNode;
}) {
  return (
    <span className={TONE[tone]}>
      {dot && <span className="dot" style={{ background: dot }} />}
      {children}
    </span>
  );
}

const CONFIDENCE: Record<
  Confidence,
  { tone: BadgeTone; label: string; dot: string }
> = {
  high: { tone: "success", label: "High confidence", dot: "var(--color-success)" },
  medium: { tone: "amber", label: "Medium confidence", dot: "var(--color-amber)" },
  low: { tone: "neutral", label: "Low confidence", dot: "var(--color-mute)" },
};

export function ConfidenceIndicator({
  confidence,
}: {
  confidence: Confidence;
}) {
  const c = CONFIDENCE[confidence];
  return (
    <Badge tone={c.tone} dot={c.dot}>
      {c.label}
    </Badge>
  );
}

const AUTOMATABLE: Record<Automatable, { tone: BadgeTone; label: string }> = {
  yes: { tone: "saved", label: "Automatable" },
  partial: { tone: "amber", label: "Partly automatable" },
  no: { tone: "neutral", label: "Manual" },
};

export function AutomatableBadge({ value }: { value: Automatable }) {
  const a = AUTOMATABLE[value];
  return <Badge tone={a.tone}>{a.label}</Badge>;
}
