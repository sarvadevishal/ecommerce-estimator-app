import { useState } from "react";
import { PageHeader } from "../components/ui/PageHeader";
import { CreateEstimate } from "../components/CreateEstimate";
import { EstimateResult } from "../components/EstimateResult";
import { NeedMoreInfo } from "../components/NeedMoreInfo";
import { EmptyState } from "../components/ui/EmptyState";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import { PremiumButton } from "../components/ui/PremiumButton";
import { ProjectSelector, labelFor } from "../components/ProjectSelector";
import { fetchEstimate } from "../lib/api";
import { computeTotals } from "../lib/compute";
import { useEstimates } from "../lib/estimatesContext";
import type { Estimate } from "../lib/types";
import { RefreshCw, AlertTriangle, PanelsTopLeft, Check } from "../lib/icons";

export function CreatePage() {
  const { add } = useEstimates();
  const [project, setProject] = useState("tdm");
  const [requirement, setRequirement] = useState("");
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [includedIds, setIncludedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const isTdm = project === "tdm";
  const hasResult = estimate !== null;

  function handleProjectChange(next: string) {
    setProject(next);
    setEstimate(null);
    setError(null);
    setSaved(false);
  }

  async function handleSubmit(finalRequirement?: string) {
    const req = (finalRequirement ?? requirement).trim();
    if (!req) return;
    setLoading(true);
    setError(null);
    setEstimate(null);
    setSaved(false);
    try {
      const result = await fetchEstimate(project, req);
      setEstimate(result);
      if (result.covered) {
        const ids = new Set(
          result.tasks.filter((t) => t.includedByDefault).map((t) => t.id)
        );
        setIncludedIds(ids);
        // Auto-save the as-generated estimate to the shared history.
        const totals = computeTotals(result.tasks, ids);
        const record = await add({ requirement: req, project, estimate: result, totals });
        if (record) setSaved(true);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function toggleTask(id: string) {
    setIncludedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function resetToCreate() {
    setEstimate(null);
    setError(null);
    setSaved(false);
  }

  const showCreate = !hasResult && !loading;

  return (
    <>
      <PageHeader
        kicker="TDM delivery estimation"
        title={hasResult ? "Estimate result" : "Create an estimate"}
        subtitle={
          hasResult
            ? "Effort with vs. without AI, the savings, and the justification behind every number."
            : "Turn a requirement into a defensible estimate — the same numbers for every team, no guessing that “AI solves 80–90%.”"
        }
        action={
          hasResult ? (
            <div className="flex items-center gap-3">
              {saved && (
                <span className="badge badge-success">
                  <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  Saved to history
                </span>
              )}
              <PremiumButton
                variant="secondary"
                onClick={resetToCreate}
                iconLeft={<RefreshCw className="h-4 w-4" />}
              >
                New estimate
              </PremiumButton>
            </div>
          ) : undefined
        }
      />

      <div className="mt-7 space-y-6">
        {showCreate && (
          <section className="card p-6 sm:p-7">
            {isTdm ? (
              <CreateEstimate
                project={project}
                onProjectChange={handleProjectChange}
                requirement={requirement}
                onRequirementChange={setRequirement}
                onSubmit={handleSubmit}
                loading={loading}
              />
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr]">
                <ProjectSelector value={project} onChange={handleProjectChange} />
                <EmptyState
                  icon={PanelsTopLeft}
                  title={`${labelFor(project)} is coming soon`}
                  description="Only the TDM project is available in this MVP. Select TDM to estimate a requirement."
                />
              </div>
            )}
          </section>
        )}

        {loading && <LoadingSkeleton />}

        {error && (
          <div className="reveal flex items-start gap-3 rounded-2xl border border-danger-soft bg-danger-soft/50 px-5 py-4">
            <AlertTriangle
              className="mt-0.5 h-5 w-5 flex-none text-danger-ink"
              strokeWidth={2}
            />
            <div className="text-sm leading-relaxed text-danger-ink">{error}</div>
          </div>
        )}

        {estimate && estimate.covered && (
          <EstimateResult
            estimate={estimate}
            includedIds={includedIds}
            onToggle={toggleTask}
          />
        )}
        {estimate && !estimate.covered && <NeedMoreInfo estimate={estimate} />}
      </div>
    </>
  );
}
