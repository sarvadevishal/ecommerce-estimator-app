// Vercel serverless function handler for Express app
import dotenv from "dotenv";
dotenv.config({ override: true });
import express from "express";
import cors from "cors";
import { getEstimate as getAnthropicEstimate } from "../server/anthropic.js";
import { getEstimate as getOpenAIEstimate } from "../server/openai.js";
import { getMockEstimate } from "../server/mock.js";
import {
  listEstimates,
  getEstimate as getStoredEstimate,
  addEstimate,
  removeEstimate,
} from "../server/store.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "64kb" }));

const HAS_OPENAI = !!process.env.OPENAI_API_KEY;
const HAS_ANTHROPIC = !!process.env.ANTHROPIC_API_KEY;

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

const USE_MOCK = process.env.USE_MOCK === "true" || !PROVIDER_HAS_KEY;
const MODEL = process.env.MODEL || (PROVIDER === "openai" ? "gpt-4o-mini" : "claude-opus-4-7");

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    mode: USE_MOCK ? "mock" : "live",
    provider: PROVIDER || "none",
    model: MODEL,
  });
});

app.post("/api/estimate", async (req, res) => {
  const { project, requirement } = req.body;

  if (!project || !requirement) {
    return res.status(400).json({
      error: "Missing project or requirement.",
    });
  }

  if (project !== "tdm") {
    return res.status(400).json({
      project,
      covered: false,
      message: `Project "${project}" is not yet supported. Currently, only TDM is available.`,
    });
  }

  try {
    let estimate;
    if (USE_MOCK) {
      estimate = getMockEstimate(requirement);
    } else if (PROVIDER === "anthropic") {
      estimate = await getAnthropicEstimate(requirement, MODEL);
    } else if (PROVIDER === "openai") {
      estimate = await getOpenAIEstimate(requirement, MODEL);
    } else {
      return res.status(500).json({
        error: "No valid provider configured.",
      });
    }

    return res.json(estimate);
  } catch (err) {
    console.error("Error generating estimate:", err);
    return res.status(500).json({
      error: err.message || "Could not generate estimate.",
    });
  }
});

app.get("/api/estimates", async (req, res) => {
  try {
    const estimates = await listEstimates();
    res.json(estimates);
  } catch (err) {
    console.error("Error listing estimates:", err);
    res.status(500).json({ error: "Could not list estimates." });
  }
});

app.get("/api/estimates/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const estimate = await getStoredEstimate(id);
    res.json(estimate);
  } catch (err) {
    console.error("Error getting estimate:", err);
    res.status(404).json({ error: "Estimate not found." });
  }
});

app.post("/api/estimates", async (req, res) => {
  const { requirement, project, estimate, totals } = req.body;

  if (!requirement || !project || !estimate || !totals) {
    return res.status(400).json({
      error: "Missing required fields.",
    });
  }

  if (!estimate.covered) {
    return res.status(400).json({
      error: "Only covered estimates can be saved.",
    });
  }

  try {
    const saved = await addEstimate({
      project,
      requirement,
      estimate,
      totals,
    });
    res.json(saved);
  } catch (err) {
    console.error("Error saving estimate:", err);
    res.status(500).json({ error: "Could not save estimate." });
  }
});

app.delete("/api/estimates/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await removeEstimate(id);
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting estimate:", err);
    res.status(404).json({ error: "Estimate not found." });
  }
});

export default app;
