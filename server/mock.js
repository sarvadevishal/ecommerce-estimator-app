// Canned TDM estimate used when USE_MOCK=true or no API key is set, so the
// demo never hard-fails. Mirrors Catalog A ("add a new table from AS400") from
// server/skills/tdm.md. aiDays = manualDays * (1 - aiSavingsPct/100).

export function getMockEstimate(requirement) {
  const text = (requirement || "").toLowerCase();

  // Rough intent sniff so the mock can also demo the guardrail and the
  // "add a column" nuance without an API call.
  //
  // Two distinct guardrail cases:
  //  1. Out of scope  -> a single, meaningful message, no questions.
  //  2. Too vague     -> "More information needed." + clarifying questions.
  const looksOutOfScope =
    /mobile app|mobile|android|ios|website|web app|web page|frontend|game|chatbot|machine learning|ml model|dashboard from scratch|kubernetes|docker|infrastructure|\blogin\b|authentication|payment/.test(
      text
    );
  if (looksOutOfScope) {
    return {
      project: "tdm",
      covered: false,
      message:
        "This looks outside what the TDM estimator covers — it estimates TDM data-engineering work (tables, columns, ETL / Informatica, stored procedures, validation), not application, web, or ML builds.",
      missingInfo: [],
    };
  }
  if (text.trim().length < 8) {
    return {
      project: "tdm",
      covered: false,
      message: "More information needed.",
      missingInfo: [
        "Which TDM workflow is this — adding a table, adding a column, or something else?",
        "Is AS400 the data source (does it need an Informatica Cloud job)?",
        "Which clusters are in scope (Prod1 / Prod2 / Prod3 / UAT)?",
      ],
    };
  }

  const isColumn = /\bcolumn\b|\badd a field\b|\bnew field\b/.test(text);

  if (isColumn) {
    return {
      project: "tdm",
      covered: true,
      summary:
        "Add a column to an existing Prod1 table. The column auto-propagates to Prod2/Prod3/UAT via datashare, so no datashare task is needed, but each cluster's view must be updated to expose it.",
      confidence: "medium",
      assumptions: [
        "The target table already exists in Prod1 and is already in the datashare.",
        "The new column is sourced from AS400 via the existing Informatica mapping.",
      ],
      tasks: [
        {
          id: "t1",
          name: "Alter / recreate table in Prod1",
          phase: "MVP",
          manualDays: 0.5,
          aiSavingsPct: 40,
          aiDays: 0.3,
          aiHelps: true,
          justification:
            "AI drafts the ALTER/recreate DDL; review and DISTKEY/SORTKEY impact still need a human.",
          automatable: "partial",
          automationNote: "DDL generation can be templated from a column spec.",
          includedByDefault: true,
        },
        {
          id: "t2",
          name: "Update Informatica mapping",
          phase: "MVP",
          manualDays: 0.75,
          aiSavingsPct: 30,
          aiDays: 0.53,
          aiHelps: true,
          justification:
            "AI scaffolds the mapping/SQL change; connection config and testing stay manual.",
          automatable: "partial",
          automationNote: "Mapping edits are repetitive but tool-driven.",
          includedByDefault: true,
        },
        {
          id: "t3",
          name: "Update views in Prod2/Prod3/UAT to expose column",
          phase: "MVP",
          manualDays: 0.5,
          aiSavingsPct: 50,
          aiDays: 0.25,
          aiHelps: true,
          justification:
            "The view DDL is near-identical across the 3 clusters — AI templates it once and applies everywhere.",
          automatable: "yes",
          automationNote:
            "Generate the three CREATE OR REPLACE VIEW statements from one template.",
          includedByDefault: true,
        },
        {
          id: "t4",
          name: "Validate across clusters",
          phase: "MVP",
          manualDays: 0.75,
          aiSavingsPct: 35,
          aiDays: 0.49,
          aiHelps: true,
          justification:
            "AI generates reconciliation queries; sign-off and investigation of mismatches stay manual.",
          automatable: "partial",
          automationNote: "Reconciliation queries can be saved and reused.",
          includedByDefault: true,
        },
      ],
      automationSummary:
        "Updating the three cluster views is the most repeatable step — templating the CREATE OR REPLACE VIEW statements means the next column change costs almost nothing. Reconciliation queries should be saved as a reusable validation pack.",
      scopeNote:
        "All four tasks are core to exposing the column correctly, so there is little to defer. If the column isn't immediately needed in FLP360 (Prod3), updating that view could move to Phase 2.",
    };
  }

  // Default: Catalog A — add a new table sourced from AS400 into Prod1.
  return {
    project: "tdm",
    covered: true,
    summary:
      "Add a new table to Prod1 sourced from AS400, make it available to Prod2/Prod3/UAT via datashare, and validate end-to-end.",
    confidence: "high",
    assumptions: [
      "Source data comes from AS400, so an Informatica Cloud ELTL job is required.",
      "The table must be queryable in Prod2, Prod3 and UAT, so a view is created in each.",
      "Informatica connectivity to AS400 already exists (jobs are up and running).",
    ],
    tasks: [
      {
        id: "t1",
        name: "Table creation in Prod1 (DDL, DISTKEY/SORTKEY)",
        phase: "MVP",
        manualDays: 0.5,
        aiSavingsPct: 50,
        aiDays: 0.25,
        aiHelps: true,
        justification:
          "AI drafts the DDL and suggests DISTKEY/SORTKEY from the column profile; a human confirms the distribution choice.",
        automatable: "partial",
        automationNote: "DDL can be generated from a table spec template.",
        includedByDefault: true,
      },
      {
        id: "t2",
        name: "Informatica Cloud job (ELTL from AS400)",
        phase: "MVP",
        manualDays: 2.0,
        aiSavingsPct: 30,
        aiDays: 1.4,
        aiHelps: true,
        justification:
          "AI scaffolds mappings and transformation SQL, but source connection, config and end-to-end testing remain manual.",
        automatable: "partial",
        automationNote:
          "Mapping templates per source pattern reduce repeat build time.",
        includedByDefault: true,
      },
      {
        id: "t3",
        name: "Add table to datashare (Prod2/Prod3/UAT)",
        phase: "MVP",
        manualDays: 0.5,
        aiSavingsPct: 15,
        aiDays: 0.43,
        aiHelps: false,
        justification:
          "Mostly a console/config step; little for AI to do beyond generating the GRANT/ALTER DATASHARE statements.",
        automatable: "yes",
        automationNote: "Datashare add can be scripted and parameterised.",
        includedByDefault: true,
      },
      {
        id: "t4",
        name: "Create views in Prod2/Prod3/UAT",
        phase: "MVP",
        manualDays: 0.75,
        aiSavingsPct: 50,
        aiDays: 0.38,
        aiHelps: true,
        justification:
          "The view DDL is near-identical across 3 clusters — AI templates it once and applies everywhere, the biggest repeatable saving.",
        automatable: "yes",
        automationNote:
          "Generate the three CREATE OR REPLACE VIEW statements from one template.",
        includedByDefault: true,
      },
      {
        id: "t5",
        name: "Schedule the job",
        phase: "MVP",
        manualDays: 0.25,
        aiSavingsPct: 10,
        aiDays: 0.23,
        aiHelps: false,
        justification:
          "A console/config action with little room for AI assistance.",
        automatable: "partial",
        automationNote: "Schedules can be defined as code where supported.",
        includedByDefault: true,
      },
      {
        id: "t6",
        name: "Validate data across all clusters",
        phase: "MVP",
        manualDays: 1.5,
        aiSavingsPct: 35,
        aiDays: 0.98,
        aiHelps: true,
        justification:
          "AI generates row-count and reconciliation queries; investigating mismatches and sign-off stay manual.",
        automatable: "partial",
        automationNote:
          "Reconciliation queries become a reusable validation pack.",
        includedByDefault: true,
      },
      {
        id: "t7",
        name: "Documentation & handover",
        phase: "Phase2",
        manualDays: 0.5,
        aiSavingsPct: 60,
        aiDays: 0.2,
        aiHelps: true,
        justification:
          "AI drafts the data dictionary and runbook from the DDL and job config; a human reviews.",
        automatable: "yes",
        automationNote: "Docs can be generated from the table + job metadata.",
        includedByDefault: true,
      },
    ],
    automationSummary:
      "The view creation across Prod2/Prod3/UAT and the validation queries are the most repeatable steps. Templating the view DDL and saving a reconciliation query pack means the next table costs materially less. Datashare adds and documentation can also be scripted.",
    scopeNote:
      "Table creation, the Informatica job, datashare, views and validation are all core MVP. Documentation & handover can move to Phase 2 if the team needs the data flowing first. If a cluster (e.g. FLP360/Prod3) doesn't need the table immediately, its view + validation could defer to Phase 2.",
  };
}
