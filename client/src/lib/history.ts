import type { CoveredEstimate, Confidence } from "./types";
import type { Totals } from "./compute";

// A saved estimate as returned by the backend file store.
export interface EstimateRecord {
  id: string;
  createdAt: string;
  project: string;
  requirement: string;
  confidence: Confidence;
  totals: Totals | null;
  estimate: CoveredEstimate;
}

export interface SaveInput {
  requirement: string;
  project: string;
  estimate: CoveredEstimate;
  totals: Totals;
}

export async function listEstimates(): Promise<EstimateRecord[]> {
  const res = await fetch("/api/estimates");
  if (!res.ok) throw new Error("Could not load saved estimates.");
  return res.json();
}

export async function getEstimate(id: string): Promise<EstimateRecord> {
  const res = await fetch(`/api/estimates/${id}`);
  if (!res.ok) throw new Error("Estimate not found.");
  return res.json();
}

export async function saveEstimate(input: SaveInput): Promise<EstimateRecord> {
  const res = await fetch("/api/estimates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Could not save the estimate.");
  }
  return res.json();
}

export async function deleteEstimate(id: string): Promise<void> {
  const res = await fetch(`/api/estimates/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) {
    throw new Error("Could not delete the estimate.");
  }
}
