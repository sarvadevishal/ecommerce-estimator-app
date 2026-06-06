import dotenv from "dotenv";
dotenv.config({ override: true });
import express from "express";
import cors from "cors";
import { getEstimate as getAnthropicEstimate } from "./anthropic.js";
import { getEstimate as getOpenAIEstimate } from "./openai.js";
import { getMockEstimate } from "./mock.js";
import {
  listEstimates,
  getEstimate as getStoredEstimate,
  addEstimate,
  removeEstimate,
} from "./store.js";

// API_PORT (not PORT) so a frontend dev/preview tool that injects PORT for the
// Vite server can't accidentally rebind the backend onto the frontend's port.
const PORT = process.env.API_PORT || 8787;

const HAS_OPENAI = !!process.env.OPENAI_API_KEY;
const HAS_ANTHROPIC = !!process.env.ANTHROPIC_API_KEY;

// Which provider runs the estimate. Explicit PROVIDER wins; otherwise infer from
// the MODEL name, then from whichever key is present.
function resolveProvider() {
  const explicit = (process.env.PROVIDER || "").toLowerCase();
  if (explicit === "openai" || explicit === "anthropic") return explicit;
  const model = (process.env.MODEL || "").toLowerCase();
  if (/^(gpt|o\d|chatgpt)/.test(model)) return "openai";
  if (model.startsWith("claude")) return "anthropic";
  if (HAS_OPENAI) return "openai";
  if (HAS_ANTHROPIC) return "anthropic";
  return null;
}

const PROVIDER = resolveProvider();
const PROVIDER_HAS_KEY =
  PROVIDER === "openai"
    ? HAS_OPENAI
    : PROVIDER === "anthropic"
      ? HAS_ANTHROPIC
      : false;

// Fall back to canned output only when explicitly asked, or when the chosen
// provider has no key.
const USE_MOCK = process.env.USE_MOCK === "true" || !PROVIDER_HAS_KEY;
const MODEL = process.env.MODEL || (PROVIDER === "openai" ? "gpt-4o-mini" : "claude-opus-4-7");

const app = express();
app.use(cors());
app.use(express.json({ limit: "64kb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    mode: USE_MOCK ? "mock" : "live",
    provider: USE_MOCK ? null : PROVIDER,
    model: USE_MOCK ? null : MODEL,
  });
});

app.post("/api/estimate", async (req, res) => {
  const { project, requirement } = req.body ?? {};

  // Project gating — only TDM is active in this MVP.
  if (project !== "tdm") {
    return res.status(400).json({
      error: "Only the TDM project is supported in this MVP.",
    });
  }
  if (typeof requirement !== "string" || requirement.trim().length === 0) {
    return res.status(400).json({ error: "A requirement is required." });
  }

  try {
    let estimate;
    if (USE_MOCK) {
      estimate = getMockEstimate(requirement);
    } else if (PROVIDER === "openai") {
      estimate = await getOpenAIEstimate(requirement);
    } else {
      estimate = await getAnthropicEstimate(requirement);
    }
    return res.json(estimate);
  } catch (err) {
    const detail = err?.message || "unknown error";
    console.error("Estimate failed:", detail);
    return res.status(502).json({
      error: `Could not generate an estimate (${PROVIDER || "no provider"}/${MODEL}): ${detail}`,
    });
  }
});

// ---- Saved estimates (history) — shared JSON file store ----

app.get("/api/estimates", async (_req, res) => {
  try {
    return res.json(await listEstimates());
  } catch (err) {
    console.error("List estimates failed:", err?.message || err);
    return res.status(500).json({ error: "Could not load saved estimates." });
  }
});

app.get("/api/estimates/:id", async (req, res) => {
  try {
    const record = await getStoredEstimate(req.params.id);
    if (!record) return res.status(404).json({ error: "Estimate not found." });
    return res.json(record);
  } catch (err) {
    console.error("Get estimate failed:", err?.message || err);
    return res.status(500).json({ error: "Could not load the estimate." });
  }
});

app.post("/api/estimates", async (req, res) => {
  const { requirement, estimate, totals } = req.body ?? {};
  if (
    !estimate ||
    estimate.covered !== true ||
    !Array.isArray(estimate.tasks) ||
    estimate.tasks.length === 0
  ) {
    return res
      .status(400)
      .json({ error: "A covered estimate is required to save." });
  }
  if (typeof requirement !== "string" || requirement.trim().length === 0) {
    return res.status(400).json({ error: "A requirement is required." });
  }
  try {
    const saved = await addEstimate({
      project: "tdm",
      requirement: requirement.trim(),
      confidence: estimate.confidence ?? "medium",
      totals: totals ?? null,
      estimate,
    });
    return res.status(201).json(saved);
  } catch (err) {
    console.error("Save estimate failed:", err?.message || err);
    return res.status(500).json({ error: "Could not save the estimate." });
  }
});

app.delete("/api/estimates/:id", async (req, res) => {
  try {
    const ok = await removeEstimate(req.params.id);
    if (!ok) return res.status(404).json({ error: "Estimate not found." });
    return res.status(204).end();
  } catch (err) {
    console.error("Delete estimate failed:", err?.message || err);
    return res.status(500).json({ error: "Could not delete the estimate." });
  }
});

app.listen(PORT, () => {
  console.log(
    `Delivery Estimator API on http://localhost:${PORT} (mode: ${
      USE_MOCK ? "mock" : `live · ${PROVIDER} · ${MODEL}`
    })`
  );
});
