// Tiny JSON-file persistence for saved estimates. The server is single-process,
// so all mutations run through one serialized promise chain — concurrent saves
// or deletes can't clobber the file mid read-modify-write.

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");
const FILE = path.join(DATA_DIR, "estimates.json");

async function readRaw() {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

async function writeRaw(records) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(records, null, 2), "utf8");
}

// Serialize mutations: each enqueued task waits for the previous to settle.
let chain = Promise.resolve();
function enqueue(fn) {
  const run = chain.then(fn, fn);
  chain = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

const byNewest = (a, b) =>
  a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0;

export async function listEstimates() {
  const all = await readRaw();
  return [...all].sort(byNewest);
}

export async function getEstimate(id) {
  const all = await readRaw();
  return all.find((r) => r.id === id) || null;
}

export function addEstimate(record) {
  return enqueue(async () => {
    const all = await readRaw();
    // Server owns id + createdAt — ignore any the client may have sent.
    const saved = {
      ...record,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };
    all.push(saved);
    await writeRaw(all);
    return saved;
  });
}

export function removeEstimate(id) {
  return enqueue(async () => {
    const all = await readRaw();
    const next = all.filter((r) => r.id !== id);
    if (next.length === all.length) return false;
    await writeRaw(next);
    return true;
  });
}
