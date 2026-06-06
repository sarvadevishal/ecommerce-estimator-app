import type { Totals } from "../lib/compute";
import { ScopeBar, Legend } from "./Charts";

interface Props {
  scopeNote: string;
  totals: Totals;
}

export function SectionScope({ scopeNote, totals }: Props) {
  const totalManual = totals.mvpManual + totals.phase2Manual;

  return (
    <div>
      {scopeNote && (
        <p className="max-w-3xl text-sm leading-relaxed text-slate">
          {scopeNote}
        </p>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ScopeCard
          title="MVP"
          subtitle="Ships first"
          manual={totals.mvpManual}
          ai={totals.mvpAi}
          accent="ink"
        />
        <ScopeCard
          title="Phase 2"
          subtitle="Can follow later"
          manual={totals.phase2Manual}
          ai={totals.phase2Ai}
          accent="mute"
        />
      </div>

      <div className="mt-5">
        <ScopeBar
          mvp={totals.mvpManual}
          phase2={totals.phase2Manual}
          scale={Math.max(totalManual, 1)}
          className="h-3"
        />
        <div className="mt-3">
          <Legend
            items={[
              { color: "var(--color-ink)", label: "MVP" },
              { color: "var(--color-mute)", label: "Phase 2" },
            ]}
          />
        </div>
      </div>

      <p className="mt-4 text-[13px] text-mute">
        Toggle tasks in the breakdown above to move work in or out of scope —
        these totals update instantly, with no extra AI call.
      </p>
    </div>
  );
}

function ScopeCard({
  title,
  subtitle,
  manual,
  ai,
  accent,
}: {
  title: string;
  subtitle: string;
  manual: number;
  ai: number;
  accent: "ink" | "mute";
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface px-5 py-4">
      <div className="flex items-center gap-2">
        <span
          className="dot h-2.5 w-2.5"
          style={{
            background:
              accent === "ink" ? "var(--color-ink)" : "var(--color-mute)",
          }}
        />
        <span className="font-semibold text-ink">{title}</span>
        <span className="text-[12px] text-mute">· {subtitle}</span>
      </div>
      <div className="tnum mt-3 flex items-baseline gap-4">
        <div>
          <span className="display text-2xl text-ink">{manual}</span>
          <span className="ml-1 text-[12px] text-mute">d without AI</span>
        </div>
        <div className="text-mute">→</div>
        <div>
          <span className="display text-2xl text-accent-ink">{ai}</span>
          <span className="ml-1 text-[12px] text-mute">d with AI</span>
        </div>
      </div>
    </div>
  );
}
