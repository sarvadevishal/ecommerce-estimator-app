import { Link, useNavigate } from "react-router-dom";
import { PageHeader } from "../components/ui/PageHeader";
import { MetricCard } from "../components/ui/MetricCard";
import { SectionCard } from "../components/ui/SectionCard";
import { EmptyState } from "../components/ui/EmptyState";
import { PremiumButton } from "../components/ui/PremiumButton";
import { ConfidenceIndicator } from "../components/ui/Badge";
import { useEstimates } from "../lib/estimatesContext";
import { firstLine, truncate, formatDate } from "../lib/format";
import type { EstimateRecord } from "../lib/history";
import type { Confidence } from "../lib/types";
import {
  FileBarChart,
  Zap,
  TrendingDown,
  ShieldCheck,
  LayoutDashboard,
  ArrowRight,
  AlertTriangle,
} from "../lib/icons";

const round1 = (n: number) => Math.round(n * 10) / 10;
const avg = (nums: number[]) =>
  nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;

export function DashboardPage() {
  const { records, loading, error, refresh } = useEstimates();
  const navigate = useNavigate();

  const header = (
    <PageHeader
      kicker="Overview"
      title="Dashboard"
      subtitle="Saved estimates at a glance — volume, effort, savings and confidence across the team."
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
        <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-5">
              <div className="skeleton h-3 w-20" />
              <div className="skeleton mt-4 h-8 w-24" />
              <div className="skeleton mt-3 h-3 w-16" />
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
        <ErrorPanel message={error} onRetry={refresh} />
      </>
    );
  }

  if (records.length === 0) {
    return (
      <>
        {header}
        <div className="mt-7">
          <EmptyState
            icon={LayoutDashboard}
            title="No estimates yet"
            description="Generate your first estimate and it'll show up here with effort, savings and confidence trends."
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

  const aiDays = records.map((r) => r.totals?.aiDays ?? 0);
  const manualDays = records.map((r) => r.totals?.manualDays ?? 0);
  const savedPct = records.map((r) => r.totals?.savedPct ?? 0);
  const counts: Record<Confidence, number> = {
    high: records.filter((r) => r.confidence === "high").length,
    medium: records.filter((r) => r.confidence === "medium").length,
    low: records.filter((r) => r.confidence === "low").length,
  };
  const recent = records.slice(0, 5);

  return (
    <>
      {header}

      <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard
          icon={FileBarChart}
          label="Total estimates"
          value={records.length}
          tone="ink"
          sub="saved"
        />
        <MetricCard
          icon={Zap}
          label="Avg effort with AI"
          value={round1(avg(aiDays))}
          unit="days"
          tone="accent"
          sub={`from ${round1(avg(manualDays))}d without`}
        />
        <MetricCard
          icon={TrendingDown}
          label="Avg savings"
          value={`${Math.round(avg(savedPct))}%`}
          tone="success"
        />
        <MetricCard
          icon={ShieldCheck}
          label="High-risk"
          value={counts.low}
          tone="ink"
          sub="low confidence"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.4fr]">
        <SectionCard icon={ShieldCheck} title="Confidence mix">
          <ConfidenceMix counts={counts} total={records.length} />
        </SectionCard>

        <SectionCard
          icon={FileBarChart}
          title="Recent estimates"
          action={
            <Link
              to="/history"
              className="text-[13px] font-semibold text-accent-ink hover:underline"
            >
              View all
            </Link>
          }
          bodyClassName="px-2 py-2 sm:px-3"
        >
          <ul className="divide-y divide-line">
            {recent.map((r) => (
              <RecentRow key={r.id} record={r} />
            ))}
          </ul>
        </SectionCard>
      </div>
    </>
  );
}

function ConfidenceMix({
  counts,
  total,
}: {
  counts: Record<Confidence, number>;
  total: number;
}) {
  const pct = (n: number) => (total > 0 ? (n / total) * 100 : 0);
  const segs = [
    { key: "high", color: "var(--color-success)", label: "High", n: counts.high },
    { key: "medium", color: "var(--color-amber)", label: "Medium", n: counts.medium },
    { key: "low", color: "var(--color-mute)", label: "Low", n: counts.low },
  ];
  return (
    <div>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-surface-2">
        {segs.map((s) => (
          <div
            key={s.key}
            className="h-full transition-[width] duration-500"
            style={{ width: `${pct(s.n)}%`, background: s.color }}
          />
        ))}
      </div>
      <ul className="mt-4 space-y-2.5">
        {segs.map((s) => (
          <li key={s.key} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-slate">
              <span className="dot" style={{ background: s.color }} />
              {s.label} confidence
            </span>
            <span className="tnum font-semibold text-ink">{s.n}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RecentRow({ record }: { record: EstimateRecord }) {
  return (
    <li>
      <Link
        to={`/estimate/${record.id}`}
        className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-surface/70"
      >
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-ink">
            {truncate(firstLine(record.requirement), 64)}
          </div>
          <div className="mt-0.5 text-[12px] text-mute">
            {formatDate(record.createdAt)}
          </div>
        </div>
        <div className="hidden text-right sm:block">
          <div className="tnum text-sm font-semibold text-ink">
            {record.totals?.aiDays ?? "—"}
            <span className="ml-0.5 text-[11px] font-normal text-mute">d</span>
          </div>
          <div className="text-[11px] text-saved-ink">
            {record.totals?.savedPct ?? 0}% saved
          </div>
        </div>
        <ConfidenceIndicator confidence={record.confidence} />
        <ArrowRight className="h-4 w-4 flex-none text-mute" strokeWidth={2} />
      </Link>
    </li>
  );
}

function ErrorPanel({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="mt-7 flex flex-col items-center gap-3 rounded-2xl border border-danger-soft bg-danger-soft/40 px-6 py-10 text-center">
      <AlertTriangle className="h-6 w-6 text-danger-ink" strokeWidth={2} />
      <p className="text-sm text-danger-ink">{message}</p>
      <PremiumButton variant="secondary" onClick={onRetry}>
        Retry
      </PremiumButton>
    </div>
  );
}
