# Delivery Estimator App

Turn a project requirement into a defensible effort estimate broken down
**without AI vs. with AI (Copilot / Codex / Claude)** — the savings, automation
opportunities, and MVP vs. Phase 2 scope — so every customer team works from the
same numbers.

Estimation knowledge lives in a **skill file** (`server/skills/tdm.md`) the app
feeds to the model. **MVP supports the TDM project only**; Titan, TBE, CSP and
FLP360 appear as "Coming soon".

## Features

- **Create** — free-text requirement → structured estimate (task breakdown with
  vs. without AI, automation opportunities, MVP / Phase 2 scope) with live
  include/exclude toggles that recompute totals instantly.
- **Dashboard** — total estimates, average effort, average savings and the
  confidence mix across everything saved.
- **History** — every estimate, searchable and filterable by confidence; open or
  delete any one.
- **Settings** — the estimation framework (complexity multipliers, risk buffers,
  technology add-ons, phase split) and the active AI model.
- **Guardrails** — non-TDM or out-of-scope inputs get a clear message, not a
  made-up estimate.

## Quick start

```bash
# 1. Install everything (root + server + client)
npm run install:all

# 2. Configure the backend
#    Copy server/.env.example -> server/.env and either:
#      - set an API key (OPENAI_API_KEY or ANTHROPIC_API_KEY) + PROVIDER + MODEL, or
#      - set USE_MOCK=true to demo without a key (canned TDM estimate)

# 3. Run frontend + backend together
npm run dev
```

- Frontend (Vite): http://localhost:5173
- Backend (Express): http://localhost:8787 (Vite proxies `/api/*` to it)

## AI providers

The backend is a thin proxy that holds your API key **server-side** and calls one
provider:

- **OpenAI** — `PROVIDER=openai`, `MODEL=gpt-5.5` (or `gpt-5-mini`, `gpt-4o-mini`…)
- **Anthropic (Claude)** — `PROVIDER=anthropic`, `MODEL=claude-opus-4-7`

Both use the same TDM skill, instructions and forced structured-output contract,
so the estimate stays consistent across models. With no key (or `USE_MOCK=true`)
the app runs in **mock** mode with a canned estimate. `aiDays` is always computed
server-side — never trusted from the model.

## Saved estimates (history)

Generated estimates are persisted to a small JSON file store
(`server/data/estimates.json`, git-ignored) and shared by everyone using that
backend. Endpoints: `GET`/`POST` `/api/estimates`, `GET`/`DELETE`
`/api/estimates/:id`.

## Editing the estimation knowledge

Edit `server/skills/tdm.md` — work types, complexity rules, technology add-ons,
risk buffers and task catalogs. The model uses these, so your edits change the
estimates directly. No code change needed.

## Project layout

```
package.json   root scripts (dev runs client + server)
server/        Express API; provider adapters (openai.js / anthropic.js);
               shared prompt.js + finalize.js; JSON store.js; skills/tdm.md
client/        React + Vite + Tailwind SPA, routed:
               Create / Dashboard / History / Settings
```
