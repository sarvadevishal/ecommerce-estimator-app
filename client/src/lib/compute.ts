import type { Task } from "./types";

export interface Totals {
  manualDays: number;
  aiDays: number;
  savedDays: number;
  savedPct: number;
  mvpManual: number;
  mvpAi: number;
  phase2Manual: number;
  phase2Ai: number;
  includedCount: number;
  totalCount: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

// Pure, deterministic recompute. Toggling a task in/out only changes which ids
// are summed — no extra AI call is ever made.
export function computeTotals(tasks: Task[], includedIds: Set<string>): Totals {
  let manualDays = 0;
  let aiDays = 0;
  let mvpManual = 0;
  let mvpAi = 0;
  let phase2Manual = 0;
  let phase2Ai = 0;
  let includedCount = 0;

  for (const t of tasks) {
    if (!includedIds.has(t.id)) continue;
    includedCount++;
    manualDays += t.manualDays;
    aiDays += t.aiDays;
    if (t.phase === "MVP") {
      mvpManual += t.manualDays;
      mvpAi += t.aiDays;
    } else {
      phase2Manual += t.manualDays;
      phase2Ai += t.aiDays;
    }
  }

  const savedDays = manualDays - aiDays;
  const savedPct = manualDays > 0 ? (savedDays / manualDays) * 100 : 0;

  return {
    manualDays: round2(manualDays),
    aiDays: round2(aiDays),
    savedDays: round2(savedDays),
    savedPct: Math.round(savedPct),
    mvpManual: round2(mvpManual),
    mvpAi: round2(mvpAi),
    phase2Manual: round2(phase2Manual),
    phase2Ai: round2(phase2Ai),
    includedCount,
    totalCount: tasks.length,
  };
}
