import { useMemo } from "react";
import type { CoveredEstimate } from "../lib/types";
import { computeTotals } from "../lib/compute";
import { StackBar, Legend } from "./Charts";
import { MetricCard } from "./ui/MetricCard";
import { SectionCard } from "./ui/SectionCard";
import { ConfidenceIndicator } from "./ui/Badge";
import { TaskTable } from "./TaskTable";
import { SectionAutomation } from "./SectionAutomation";
import { SectionScope } from "./SectionScope";
import {
  Clock,
  Zap,
  TrendingDown,
  Layers,
  Workflow,
  GitBranch,
} from "../lib/icons";

interface Props {
  estimate: CoveredEstimate;
  includedIds: Set<string>;
  onToggle: (id: string) => void;
}

export function EstimateResult({ estimate, includedIds, onToggle }: Props) {
  const totals = useMemo(
    () => computeTotals(estimate.tasks, includedIds),
    [estimate.tasks, includedIds]
  );

  // Scale for the hero bar: full manual effort with every task included, so the
  // fill visibly shrinks as tasks are deprioritised.
  const grandManual = useMemo(
    () => estimate.tasks.reduce((sum, t) => sum + t.manualDays, 0),
    [estimate.tasks]
  );

  return (
    <div className="space-y-6">
      {/* Executive hero */}
      <section className="glass-card reveal overflow-hidden">
        <div className="px-6 py-6 sm:px-8 sm:py-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="max-w-2xl">
              <div className="kicker mb-2 text-accent-ink">
                Executive summary
              </div>
              <h2 className="text-[1.4rem] font-semibold leading-snug tracking-tight text-ink">
                {estimate.summary}
              </h2>
            </div>
            <ConfidenceIndicator confidence={estimate.confidence} />
          </div>

          {/* KPI row */}
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <MetricCard
              icon={Clock}
              label="Effort without AI"
              value={totals.manualDays}
              unit="days"
              tone="ink"
            />
            <MetricCard
              icon={Zap}
              label="Effort with AI"
              value={totals.aiDays}
              unit="days"
              tone="accent"
            />
            <MetricCard
              icon={TrendingDown}
              label="Effort saved"
              value={totals.savedDays}
              unit="days"
              tone="success"
              badge={
                <span className="badge badge-success">
                  {totals.savedPct}% saved
                </span>
              }
            />
            <MetricCard
              icon={Layers}
              label="Tasks in scope"
              value={`${totals.includedCount}/${totals.totalCount}`}
              tone="ink"
              sub="included"
            />
          </div>

          {/* Hero comparison bar */}
          <div className="mt-6">
            <StackBar
              manualDays={totals.manualDays}
              aiDays={totals.aiDays}
              scale={Math.max(grandManual, totals.manualDays, 1)}
              className="h-3"
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <Legend
                items={[
                  { color: "var(--color-accent)", label: "Effort with AI" },
                  { color: "var(--color-saved)", label: "Saved by AI" },
                  { color: "var(--color-surface-2)", label: "Deprioritised" },
                ]}
              />
              <span className="text-[12px] text-mute">
                {totals.includedCount} of {totals.totalCount} tasks included
              </span>
            </div>
          </div>

          {estimate.assumptions.length > 0 && (
            <div className="mt-6 rounded-xl border border-line bg-surface px-5 py-4">
              <div className="kicker mb-2">Assumptions</div>
              <ul className="space-y-1.5">
                {estimate.assumptions.map((a, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-[13.5px] leading-relaxed text-slate"
                  >
                    <span className="select-none text-mute">·</span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Sections 1 & 2 — breakdown */}
      <SectionCard
        icon={Layers}
        index="01 — 02"
        title="Task breakdown — effort with vs. without AI"
        subtitle="Effort without AI, the AI (Copilot / Codex / Claude) saving, and the resulting effort — per task, with justification. Toggle a task off to deprioritise it and watch every total recompute."
        style={{ animationDelay: "60ms" }}
      >
        <TaskTable
          tasks={estimate.tasks}
          includedIds={includedIds}
          onToggle={onToggle}
        />
      </SectionCard>

      {/* Section 3 — automation */}
      <SectionCard
        icon={Workflow}
        index="03"
        title="Automation opportunities"
        subtitle="Work worth automating once so the effort isn't re-spent on the next requirement."
        style={{ animationDelay: "120ms" }}
      >
        <SectionAutomation
          summary={estimate.automationSummary}
          tasks={estimate.tasks}
        />
      </SectionCard>

      {/* Section 4 — phase & scope */}
      <SectionCard
        icon={GitBranch}
        index="04"
        title="Phase & scope — MVP vs Phase 2"
        subtitle="What ships first and what can follow later, with the effort each phase carries."
        style={{ animationDelay: "180ms" }}
      >
        <SectionScope scopeNote={estimate.scopeNote} totals={totals} />
      </SectionCard>
    </div>
  );
}
