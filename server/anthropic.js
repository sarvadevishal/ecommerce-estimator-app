// Anthropic (Claude) provider — feeds the requirement + the shared TDM skill to
// Claude and returns a structured estimate via a forced tool call. Instructions,
// skill and output validation are shared with the OpenAI provider (prompt.js +
// finalize.js) so both models produce the same shape and math.

import Anthropic from "@anthropic-ai/sdk";
import { ESTIMATE_TOOL } from "./estimateTool.js";
import { INSTRUCTIONS, loadSkill } from "./prompt.js";
import { finalizeEstimate } from "./finalize.js";

const DEFAULT_MODEL = "claude-opus-4-7";
const MAX_TOKENS = 4096;

let client = null;
function getClient() {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

export async function getEstimate(requirement, model) {
  const skill = await loadSkill();

  const response = await getClient().messages.create({
    // ANTHROPIC_MODEL (not MODEL) so an OpenAI MODEL value can't leak in here.
    model: model || process.env.ANTHROPIC_MODEL || DEFAULT_MODEL,
    max_tokens: MAX_TOKENS,
    // Forced tool use requires thinking off; we also want determinism here.
    thinking: { type: "disabled" },
    system: [
      { type: "text", text: INSTRUCTIONS },
      // The skill is the large, stable prefix — cache it.
      { type: "text", text: skill, cache_control: { type: "ephemeral" } },
    ],
    tools: [ESTIMATE_TOOL],
    tool_choice: { type: "tool", name: "submit_estimate" },
    messages: [
      {
        role: "user",
        content: `Project: TDM\n\nRequirement:\n${requirement}`,
      },
    ],
  });

  const toolUse = response.content.find(
    (block) => block.type === "tool_use" && block.name === "submit_estimate"
  );
  if (!toolUse) {
    throw new Error("Model did not return a submit_estimate tool call.");
  }

  return finalizeEstimate(toolUse.input);
}
