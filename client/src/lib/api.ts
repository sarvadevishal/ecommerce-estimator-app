import type { Estimate } from "./types";

export async function fetchEstimate(
  project: string,
  requirement: string
): Promise<Estimate> {
  const res = await fetch("/api/estimate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ project, requirement }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request failed (${res.status}).`);
  }

  return res.json();
}
