// OpenAI provider — mirrors anthropic.js. Same instructions + TDM skill + the
// same submit_estimate schema, via forced function calling at temperature 0, so
// the estimate stays structured and consistent across models.

import OpenAI from "openai";
import { ESTIMATE_TOOL } from "./estimateTool.js";
import { INSTRUCTIONS, loadSkill } from "./prompt.js";
import { finalizeEstimate } from "./finalize.js";

const DEFAULT_MODEL = "gpt-4o-mini";

let client = null;
function getClient() {
  if (!client) client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return client;
}

// OpenAI function-calling shape derived from the shared tool schema (Anthropic
// calls it `input_schema`; OpenAI calls it `parameters`).
const OPENAI_TOOL = {
  type: "function",
  function: {
    name: ESTIMATE_TOOL.name,
    description: ESTIMATE_TOOL.description,
    parameters: ESTIMATE_TOOL.input_schema,
  },
};

// Some newer reasoning models reject a non-default `temperature`. Retry without
// it rather than failing the whole estimate.
async function createCompletion(params) {
  try {
    return await getClient().chat.completions.create(params);
  } catch (err) {
    const msg = String(err?.message || "");
    if (/temperature/i.test(msg) && "temperature" in params) {
      const { temperature, ...rest } = params;
      return await getClient().chat.completions.create(rest);
    }
    throw err;
  }
}

export async function getEstimate(requirement, model) {
  const skill = await loadSkill();
  const useModel =
    model || process.env.OPENAI_MODEL || process.env.MODEL || DEFAULT_MODEL;

  const response = await createCompletion({
    model: useModel,
    temperature: 0,
    messages: [
      { role: "system", content: `${INSTRUCTIONS}\n\n${skill}` },
      {
        role: "user",
        content: `Project: TDM\n\nRequirement:\n${requirement}`,
      },
    ],
    tools: [OPENAI_TOOL],
    tool_choice: { type: "function", function: { name: "submit_estimate" } },
  });

  const message = response.choices?.[0]?.message;
  const call = message?.tool_calls?.find(
    (c) => c.function?.name === "submit_estimate"
  );
  if (!call) {
    throw new Error("Model did not return a submit_estimate function call.");
  }

  let args;
  try {
    args = JSON.parse(call.function.arguments);
  } catch {
    throw new Error("submit_estimate arguments were not valid JSON.");
  }
  return finalizeEstimate(args);
}
