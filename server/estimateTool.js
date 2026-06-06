// JSON schema for the forced "submit_estimate" tool.
//
// One tool covers both outcomes:
//   - covered: true  -> a full estimate (sections 1-4)
//   - covered: false -> the guardrail: "more information needed" + missingInfo
//
// We keep only `covered` strictly required and validate the rest server-side
// (see anthropic.js -> validateEstimate). This lets the model branch cleanly
// without fighting a conditional JSON schema.

export const ESTIMATE_TOOL = {
  name: "submit_estimate",
  description:
    "Return the TDM delivery estimate as structured data. If the requirement " +
    "maps to known TDM tasks, set covered=true and fill summary, confidence, " +
    "assumptions, tasks, automationSummary and scopeNote. If the requirement " +
    "is out of scope or too vague to map to known TDM tasks, set covered=false " +
    "and fill message and missingInfo instead — never invent tasks or numbers.",
  input_schema: {
    type: "object",
    properties: {
      project: {
        type: "string",
        description: "Always \"tdm\" for this MVP.",
      },
      covered: {
        type: "boolean",
        description:
          "true if the requirement can be estimated from TDM skill knowledge; " +
          "false to trigger the guardrail.",
      },

      // ---- covered: true branch ----
      summary: {
        type: "string",
        description: "One or two sentences describing what is being estimated.",
      },
      confidence: {
        type: "string",
        enum: ["high", "medium", "low"],
        description:
          "How well the requirement matches known TDM patterns. " +
          "high = clean match; low = mapped but with sizeable assumptions.",
      },
      assumptions: {
        type: "array",
        items: { type: "string" },
        description: "Assumptions made to produce the estimate.",
      },
      tasks: {
        type: "array",
        description:
          "The task breakdown. Use ONLY the effort numbers and AI-savings % " +
          "from the TDM skill catalogs. Do not invent tasks or numbers.",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "Stable id, e.g. \"t1\"." },
            name: { type: "string" },
            phase: {
              type: "string",
              enum: ["MVP", "Phase2"],
              description: "Which delivery phase this task belongs to.",
            },
            manualDays: {
              type: "number",
              description: "Effort in person-days WITHOUT AI, from the skill.",
            },
            aiSavingsPct: {
              type: "number",
              description:
                "Percent (0-100) the AI tooling reduces this task, from the skill.",
            },
            aiHelps: {
              type: "boolean",
              description: "true if AI meaningfully reduces this task.",
            },
            justification: {
              type: "string",
              description:
                "Why this effort and this AI-savings % — where AI helps vs. " +
                "where the work stays manual.",
            },
            automatable: {
              type: "string",
              enum: ["yes", "partial", "no"],
              description: "Can this task be automated so it isn't re-spent next time?",
            },
            automationNote: {
              type: "string",
              description: "How it could be automated (empty if automatable=no).",
            },
            includedByDefault: {
              type: "boolean",
              description: "Whether this task starts toggled-on in the UI.",
            },
          },
          required: [
            "id",
            "name",
            "phase",
            "manualDays",
            "aiSavingsPct",
            "aiHelps",
            "justification",
            "automatable",
            "includedByDefault",
          ],
        },
      },
      automationSummary: {
        type: "string",
        description:
          "Section 3 narrative: which tasks to automate once so the effort " +
          "isn't repeated on the next similar requirement.",
      },
      scopeNote: {
        type: "string",
        description:
          "Section 4 narrative: what could move out of MVP into Phase 2, and why.",
      },

      // ---- covered: false branch (guardrail) ----
      message: {
        type: "string",
        description: "Shown when covered=false. Use \"More information needed.\"",
      },
      missingInfo: {
        type: "array",
        items: { type: "string" },
        description:
          "Specific questions whose answers would let you produce an estimate.",
      },
    },
    required: ["project", "covered"],
  },
};
