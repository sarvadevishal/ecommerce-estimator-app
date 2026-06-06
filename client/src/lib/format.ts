export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const truncate = (s: string, n = 90) =>
  s.length > n ? `${s.slice(0, n).trimEnd()}…` : s;

// The requirement is stored with optional "Known details" appended on its own
// line — show just the first line in compact list/table views.
export const firstLine = (s: string) => s.split("\n")[0];
