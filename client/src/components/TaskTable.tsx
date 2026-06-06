import type { Task } from "../lib/types";
import { StackBar } from "./Charts";
import { Badge, AutomatableBadge } from "./ui/Badge";

interface Props {
  tasks: Task[];
  includedIds: Set<string>;
  onToggle: (id: string) => void;
}

export function TaskTable({ tasks, includedIds, onToggle }: Props) {
  const maxManual = Math.max(1, ...tasks.map((t) => t.manualDays));

  return (
    <div>
      {/* Column header — aligned to the same row grid as the tasks below. */}
      <div className="hidden grid-cols-[2.5rem_1fr_15rem] gap-4 border-b border-line pb-2.5 sm:grid">
        <span className="kicker">On</span>
        <span className="kicker">Task</span>
        <div className="grid grid-cols-3 gap-2 text-right">
          <span className="kicker">No AI</span>
          <span className="kicker">Save</span>
          <span className="kicker">With AI</span>
        </div>
      </div>

      <div className="divide-y divide-line">
        {tasks.map((t) => {
          const included = includedIds.has(t.id);
          return (
            <div
              key={t.id}
              className="-mx-3 flex flex-col gap-4 rounded-xl px-3 py-5 transition-colors hover:bg-surface/70 sm:grid sm:grid-cols-[2.5rem_1fr_15rem] sm:items-start"
            >
              {/* Toggle */}
              <div className="flex items-center gap-2 sm:block sm:pt-1">
                <button
                  type="button"
                  className="switch"
                  data-on={included}
                  onClick={() => onToggle(t.id)}
                  aria-pressed={included}
                  aria-label={`${included ? "Exclude" : "Include"} ${t.name}`}
                />
                <span className="text-[12px] text-mute sm:hidden">
                  {included ? "Included" : "Excluded"}
                </span>
              </div>

              {/* Task name, justification, badges */}
              <div className={included ? "" : "opacity-45 transition-opacity"}>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-semibold text-ink">{t.name}</span>
                  <span
                    className={`rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                      t.phase === "Phase2"
                        ? "border-line text-mute"
                        : "border-accent-soft bg-accent-soft text-accent-ink"
                    }`}
                  >
                    {t.phase === "Phase2" ? "Phase 2" : "MVP"}
                  </span>
                </div>
                <p className="mt-1 text-[13.5px] leading-relaxed text-slate">
                  {t.justification}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge
                    tone={t.aiHelps ? "ai" : "neutral"}
                    dot={
                      t.aiHelps
                        ? "var(--color-accent)"
                        : "var(--color-mute)"
                    }
                  >
                    {t.aiHelps ? "AI reduces this" : "Stays manual"}
                  </Badge>
                  <AutomatableBadge value={t.automatable} />
                </div>
              </div>

              {/* Numbers + comparison bar */}
              <div className={included ? "" : "opacity-45 transition-opacity"}>
                <div className="tnum grid grid-cols-3 gap-2 text-right">
                  <div className="text-[15px] font-semibold text-ink">
                    {t.manualDays}
                    <span className="ml-0.5 text-[11px] font-normal text-mute">
                      d
                    </span>
                  </div>
                  <div className="text-[13px] text-saved-ink">
                    {t.aiSavingsPct}%
                  </div>
                  <div className="text-[15px] font-semibold text-accent-ink">
                    {t.aiDays}
                    <span className="ml-0.5 text-[11px] font-normal text-mute">
                      d
                    </span>
                  </div>
                </div>
                <StackBar
                  manualDays={t.manualDays}
                  aiDays={t.aiDays}
                  scale={maxManual}
                  className="mt-2.5 h-2"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
