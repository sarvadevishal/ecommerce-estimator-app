import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { EstimateResult } from "../components/EstimateResult";
import { EmptyState } from "../components/ui/EmptyState";
import { PremiumButton } from "../components/ui/PremiumButton";
import { useEstimates } from "../lib/estimatesContext";
import { getEstimate, type EstimateRecord } from "../lib/history";
import { formatDateTime } from "../lib/format";
import { ArrowLeft, History as HistoryIcon } from "../lib/icons";

function defaultIncluded(record: EstimateRecord | null): Set<string> {
  if (!record?.estimate?.covered) return new Set();
  return new Set(
    record.estimate.tasks.filter((t) => t.includedByDefault).map((t) => t.id)
  );
}

export function SavedEstimatePage() {
  const { id } = useParams();
  const { records } = useEstimates();
  const fromContext = records.find((r) => r.id === id) || null;

  const [record, setRecord] = useState<EstimateRecord | null>(fromContext);
  const [loading, setLoading] = useState(!fromContext);
  const [notFound, setNotFound] = useState(false);
  const [includedIds, setIncludedIds] = useState<Set<string>>(() =>
    defaultIncluded(fromContext)
  );

  useEffect(() => {
    let alive = true;
    if (fromContext) {
      setRecord(fromContext);
      setIncludedIds(defaultIncluded(fromContext));
      setLoading(false);
      setNotFound(false);
      return;
    }
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    getEstimate(id)
      .then((r) => {
        if (!alive) return;
        setRecord(r);
        setIncludedIds(defaultIncluded(r));
        setLoading(false);
      })
      .catch(() => {
        if (!alive) return;
        setNotFound(true);
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [id, fromContext]);

  function toggleTask(taskId: string) {
    setIncludedIds((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return next;
    });
  }

  const back = (
    <Link
      to="/history"
      className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate transition-colors hover:text-ink"
    >
      <ArrowLeft className="h-4 w-4" strokeWidth={2} />
      Back to history
    </Link>
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-4 w-32" />
        <div className="skeleton h-44 w-full rounded-2xl" />
        <div className="skeleton h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (notFound || !record || !record.estimate?.covered) {
    return (
      <div>
        {back}
        <div className="mt-6">
          <EmptyState
            icon={HistoryIcon}
            title="Estimate not found"
            description="This estimate may have been deleted, or the link is no longer valid."
            action={
              <Link to="/history">
                <PremiumButton variant="primary">Back to history</PremiumButton>
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        {back}
        <span className="text-[12px] text-mute">
          Saved {formatDateTime(record.createdAt)}
        </span>
      </div>

      <div className="mb-5">
        <div className="kicker mb-1">Requirement</div>
        <p className="max-w-3xl whitespace-pre-line text-sm leading-relaxed text-slate">
          {record.requirement}
        </p>
      </div>

      <EstimateResult
        estimate={record.estimate}
        includedIds={includedIds}
        onToggle={toggleTask}
      />
    </div>
  );
}
