import type { Task } from "../lib/types";
import { InsightCard } from "./ui/InsightCard";
import { AutomatableBadge } from "./ui/Badge";
import { Lightbulb, Bot } from "../lib/icons";

interface Props {
  summary: string;
  tasks: Task[];
}

export function SectionAutomation({ summary, tasks }: Props) {
  const automatable = tasks.filter((t) => t.automatable !== "no");

  return (
    <div className="space-y-4">
      {summary && (
        <InsightCard icon={Lightbulb} tone="saved">
          {summary}
        </InsightCard>
      )}

      {automatable.length > 0 ? (
        <ul className="divide-y divide-line">
          {automatable.map((t) => (
            <li key={t.id} className="flex items-start gap-3.5 py-3.5">
              <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-[10px] bg-saved-soft text-saved-ink">
                <Bot className="h-4 w-4" strokeWidth={2} />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-ink">
                    {t.name}
                  </span>
                  <AutomatableBadge value={t.automatable} />
                </div>
                {t.automationNote && (
                  <div className="mt-0.5 text-[13px] leading-relaxed text-slate">
                    {t.automationNote}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-mute">
          No clearly automatable tasks in this estimate.
        </p>
      )}
    </div>
  );
}
