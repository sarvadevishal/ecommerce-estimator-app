import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { PageHeader } from "../components/ui/PageHeader";
import { SectionCard } from "../components/ui/SectionCard";
import {
  WORK_TYPES,
  COMPLEXITY,
  RISK_BUFFERS,
  TECH_ADDONS,
  PHASES,
} from "../lib/framework";
import {
  Cpu,
  Gauge,
  Percent,
  SlidersVertical,
  Layers,
  BookOpen,
} from "../lib/icons";

interface Health {
  mode: string;
  provider?: string | null;
  model?: string | null;
}

const PROVIDER_LABEL: Record<string, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic (Claude)",
};

export function SettingsPage() {
  const [health, setHealth] = useState<Health | null>(null);

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then(setHealth)
      .catch(() => setHealth(null));
  }, []);

  const live = health?.mode === "live";
  const providerLabel =
    (health?.provider && PROVIDER_LABEL[health.provider]) ||
    health?.provider ||
    "—";

  return (
    <>
      <PageHeader
        kicker="Configuration"
        title="Settings"
        subtitle="The estimation framework every team shares, and the AI model currently powering estimates."
      />

      <div className="mt-7 space-y-6">
        {/* Active model */}
        <SectionCard icon={Cpu} title="Active model">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Mode">
              <span className={live ? "badge badge-success" : "badge"}>
                <span
                  className="dot"
                  style={{
                    background: live
                      ? "var(--color-success)"
                      : "var(--color-mute)",
                  }}
                />
                {live ? "Live AI" : "Demo data"}
              </span>
            </Field>
            <Field label="Provider">
              <span className="text-sm font-semibold text-ink">
                {live ? providerLabel : "—"}
              </span>
            </Field>
            <Field label="Model">
              <span className="text-sm font-semibold text-ink">
                {live ? health?.model ?? "—" : "—"}
              </span>
            </Field>
          </div>
          <p className="mt-4 text-[13px] leading-relaxed text-mute">
            Configured server-side in <code className="text-slate">server/.env</code>{" "}
            (<code className="text-slate">PROVIDER</code>,{" "}
            <code className="text-slate">MODEL</code>). API keys never reach the
            browser.
          </p>
        </SectionCard>

        {/* Complexity multipliers */}
        <SectionCard
          icon={Gauge}
          title="Complexity multipliers"
          subtitle="Applied to the base effort once the work is classified."
        >
          <RefTable
            rows={COMPLEXITY.map((c) => ({
              left: c.level,
              mid: c.when,
              right: c.multiplier,
            }))}
            rightTone="ink"
          />
        </SectionCard>

        {/* Risk buffers */}
        <SectionCard
          icon={Percent}
          title="Risk buffers"
          subtitle="Added on top of the subtotal based on delivery risk."
        >
          <RefTable
            rows={RISK_BUFFERS.map((r) => ({ left: r.level, right: r.buffer }))}
            rightTone="success"
          />
        </SectionCard>

        {/* Technology add-ons */}
        <SectionCard
          icon={SlidersVertical}
          title="Technology add-ons"
          subtitle="Extra effort when a technology is in scope (sizing guidance, in hours)."
        >
          <RefTable
            rows={TECH_ADDONS.map((t) => ({ left: t.tech, right: t.hours }))}
            rightTone="accent"
          />
        </SectionCard>

        {/* Phase split + work types */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SectionCard icon={Layers} title="Standard phase split">
            <RefTable
              rows={PHASES.map((p) => ({ left: p.phase, right: p.pct }))}
              rightTone="ink"
            />
          </SectionCard>

          <SectionCard icon={BookOpen} title="Work types">
            <div className="flex flex-wrap gap-2">
              {WORK_TYPES.map((w) => (
                <span
                  key={w}
                  className="rounded-full border border-line bg-surface px-3 py-1.5 text-[12.5px] font-medium text-slate"
                >
                  {w}
                </span>
              ))}
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-mute">
              Source of truth:{" "}
              <code className="text-slate">server/skills/tdm.md</code>. Edit the
              skill to change how estimates are produced.
            </p>
          </SectionCard>
        </div>
      </div>
    </>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-line bg-surface px-4 py-3">
      <div className="kicker mb-1.5">{label}</div>
      {children}
    </div>
  );
}

function RefTable({
  rows,
  rightTone = "ink",
}: {
  rows: { left: string; mid?: string; right: string }[];
  rightTone?: "ink" | "accent" | "success";
}) {
  const rightColor =
    rightTone === "accent"
      ? "text-accent-ink"
      : rightTone === "success"
        ? "text-success-ink"
        : "text-ink";
  return (
    <ul className="divide-y divide-line">
      {rows.map((r) => (
        <li
          key={r.left}
          className="flex items-center justify-between gap-4 py-3"
        >
          <div className="min-w-0">
            <div className="text-sm font-medium text-ink">{r.left}</div>
            {r.mid && (
              <div className="mt-0.5 text-[12.5px] leading-relaxed text-mute">
                {r.mid}
              </div>
            )}
          </div>
          <span className={`tnum flex-none text-sm font-semibold ${rightColor}`}>
            {r.right}
          </span>
        </li>
      ))}
    </ul>
  );
}
