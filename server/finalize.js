// Shared validation + normalisation of the model's tool output. aiDays is
// always computed here — never trust the model's arithmetic — so every provider
// (Claude, OpenAI, mock) yields identical math and the same response shape.

const round2 = (n) => Math.round(n * 100) / 100;

export function finalizeEstimate(raw) {
  if (!raw || typeof raw !== "object" || typeof raw.covered !== "boolean") {
    throw new Error("Model output missing a valid `covered` flag.");
  }

  if (!raw.covered) {
    return {
      project: "tdm",
      covered: false,
      message:
        typeof raw.message === "string" && raw.message.trim()
          ? raw.message
          : "More information needed.",
      missingInfo: Array.isArray(raw.missingInfo) ? raw.missingInfo : [],
    };
  }

  if (!Array.isArray(raw.tasks) || raw.tasks.length === 0) {
    throw new Error("Covered estimate returned no tasks.");
  }

  const tasks = raw.tasks.map((t, i) => {
    const manualDays = Number(t.manualDays);
    const aiSavingsPct = Number(t.aiSavingsPct);
    if (!Number.isFinite(manualDays) || !Number.isFinite(aiSavingsPct)) {
      throw new Error(`Task ${i + 1} ("${t?.name}") has non-numeric effort.`);
    }
    const pct = Math.min(100, Math.max(0, aiSavingsPct));
    return {
      id: typeof t.id === "string" && t.id ? t.id : `t${i + 1}`,
      name: String(t.name ?? `Task ${i + 1}`),
      phase: t.phase === "Phase2" ? "Phase2" : "MVP",
      manualDays,
      aiSavingsPct: pct,
      // Computed server-side — never trust the model's arithmetic.
      aiDays: round2(manualDays * (1 - pct / 100)),
      aiHelps: typeof t.aiHelps === "boolean" ? t.aiHelps : pct >= 20,
      justification: String(t.justification ?? ""),
      automatable: ["yes", "partial", "no"].includes(t.automatable)
        ? t.automatable
        : "no",
      automationNote: String(t.automationNote ?? ""),
      includedByDefault:
        typeof t.includedByDefault === "boolean" ? t.includedByDefault : true,
    };
  });

  return {
    project: "tdm",
    covered: true,
    summary: String(raw.summary ?? ""),
    confidence: ["high", "medium", "low"].includes(raw.confidence)
      ? raw.confidence
      : "medium",
    assumptions: Array.isArray(raw.assumptions) ? raw.assumptions : [],
    tasks,
    automationSummary: String(raw.automationSummary ?? ""),
    scopeNote: String(raw.scopeNote ?? ""),
  };
}
