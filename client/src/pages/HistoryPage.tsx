import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader } from "../components/ui/PageHeader";
import { EmptyState } from "../components/ui/EmptyState";
import { PremiumButton } from "../components/ui/PremiumButton";
import { ConfidenceIndicator } from "../components/ui/Badge";
import { useEstimates } from "../lib/estimatesContext";
import { firstLine, truncate, formatDateTime } from "../lib/format";
import type { Confidence } from "../lib/types";
import {
  History,
  Search,
  Trash2,
  ArrowRight,
  AlertTriangle,
} from "../lib/icons";

type Filter = "all" | Confidence;
const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "high", label: "High" },
  { key: "medium", label: "Medium" },
  { key: "low", label: "Low" },
];

export function HistoryPage() {
  const { records, loading, error, remove, refresh } = useEstimates();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return records.filter((r) => {
      if (filter !== "all" && r.confidence !== filter) return false;
      if (q && !r.requirement.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [records, query, filter]);

  const header = (
    <PageHeader
      kicker="Saved estimates"
      title="History"
      subtitle="Every generated estimate, searchable and shareable across the team."
      action={
        <PremiumButton
          variant="accent"
          onClick={() => navigate("/")}
          iconRight={<ArrowRight className="h-4 w-4" />}
        >
          New estimate
        </PremiumButton>
      }
    />
  );

  if (loading) {
    return (
      <>
        {header}
        <div className="card mt-7 divide-y divide-line p-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-3 py-4">
              <div className="flex-1 space-y-2">
                <div className="skeleton h-3 w-1/2" />
                <div className="skeleton h-2.5 w-24" />
              </div>
              <div className="skeleton h-6 w-24 rounded-full" />
            </div>
          ))}
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        {header}
        <div className="mt-7 flex flex-col items-center gap-3 rounded-2xl border border-danger-soft bg-danger-soft/40 px-6 py-10 text-center">
          <AlertTriangle className="h-6 w-6 text-danger-ink" strokeWidth={2} />
          <p className="text-sm text-danger-ink">{error}</p>
          <PremiumButton variant="secondary" onClick={refresh}>
            Retry
          </PremiumButton>
        </div>
      </>
    );
  }

  if (records.length === 0) {
    return (
      <>
        {header}
        <div className="mt-7">
          <EmptyState
            icon={History}
            title="No saved estimates yet"
            description="Generate an estimate and it'll be saved here automatically."
            action={
              <PremiumButton variant="primary" onClick={() => navigate("/")}>
                Create an estimate
              </PremiumButton>
            }
          />
        </div>
      </>
    );
  }

  return (
    <>
      {header}

      {/* Controls */}
      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mute"
            strokeWidth={2}
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search requirements…"
            className="input pl-10"
            aria-label="Search saved estimates"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                filter === f.key
                  ? "border-ink bg-ink text-canvas"
                  : "border-line bg-canvas text-slate hover:border-mute"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <p className="mt-8 text-center text-sm text-mute">
          No estimates match your search.
        </p>
      ) : (
        <div className="card mt-4 overflow-hidden">
          <ul className="divide-y divide-line">
            {filtered.map((r) => (
              <li
                key={r.id}
                className="flex items-center gap-3 px-4 py-4 transition-colors hover:bg-surface/60 sm:px-5"
              >
                <Link to={`/estimate/${r.id}`} className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-ink">
                    {truncate(firstLine(r.requirement), 80)}
                  </div>
                  <div className="mt-0.5 text-[12px] text-mute">
                    {formatDateTime(r.createdAt)}
                  </div>
                </Link>

                <div className="hidden text-right sm:block">
                  <div className="tnum text-sm font-semibold text-ink">
                    {r.totals?.manualDays ?? "—"}
                    <span className="mx-1 text-mute">→</span>
                    <span className="text-accent-ink">
                      {r.totals?.aiDays ?? "—"}
                    </span>
                    <span className="ml-0.5 text-[11px] font-normal text-mute">
                      d
                    </span>
                  </div>
                  <div className="text-[11px] text-saved-ink">
                    {r.totals?.savedPct ?? 0}% saved
                  </div>
                </div>

                <ConfidenceIndicator confidence={r.confidence} />

                <button
                  type="button"
                  onClick={() => remove(r.id)}
                  className="flex h-8 w-8 flex-none items-center justify-center rounded-lg text-mute transition-colors hover:bg-danger-soft hover:text-danger-ink"
                  aria-label="Delete estimate"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={2} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
