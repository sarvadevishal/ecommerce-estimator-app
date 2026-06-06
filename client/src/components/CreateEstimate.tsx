import { useState } from "react";
import type { ReactNode } from "react";
import { ProjectSelector } from "./ProjectSelector";
import { RequirementForm } from "./RequirementForm";
import { SlidersHorizontal, ChevronDown } from "../lib/icons";

interface Details {
  source: string;
  clusters: string;
  risk: string;
}

const EMPTY: Details = { source: "", clusters: "", risk: "" };

const SOURCES = ["", "AS400", "Titan", "TBE", "S3 file", "API", "Zero ETL"];
const CLUSTERS = [
  "",
  "PROD1 only",
  "PROD1 + UAT",
  "PROD1 + PROD2 (Looker)",
  "PROD1 + PROD3 (FLP360)",
  "All clusters",
];
const RISKS = ["", "Low", "Medium", "High", "Critical"];

// Fold the optional structured hints into the free-text requirement so the
// model gets richer context — with zero backend/schema change.
export function composeRequirement(requirement: string, d: Details): string {
  const hints: string[] = [];
  if (d.source) hints.push(`Source system: ${d.source}`);
  if (d.clusters) hints.push(`Clusters impacted: ${d.clusters}`);
  if (d.risk) hints.push(`Risk level: ${d.risk}`);
  if (hints.length === 0) return requirement;
  return `${requirement}\n\nKnown details:\n- ${hints.join("\n- ")}`;
}

interface Props {
  project: string;
  onProjectChange: (v: string) => void;
  requirement: string;
  onRequirementChange: (v: string) => void;
  onSubmit: (finalRequirement: string) => void;
  loading: boolean;
}

export function CreateEstimate({
  project,
  onProjectChange,
  requirement,
  onRequirementChange,
  onSubmit,
  loading,
}: Props) {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState<Details>(EMPTY);

  function submit() {
    onSubmit(composeRequirement(requirement, details));
  }

  const set =
    (k: keyof Details) => (e: React.ChangeEvent<HTMLSelectElement>) =>
      setDetails((d) => ({ ...d, [k]: e.target.value }));

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr]">
      <ProjectSelector value={project} onChange={onProjectChange} />

      <div>
        <RequirementForm
          requirement={requirement}
          onChange={onRequirementChange}
          onSubmit={submit}
          loading={loading}
        />

        <div className="mt-4 overflow-hidden rounded-xl border border-line bg-surface/60">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-surface-2/60"
            aria-expanded={open}
          >
            <span className="flex items-center gap-2 text-[13px] font-medium text-ink">
              <SlidersHorizontal className="h-4 w-4 text-mute" strokeWidth={2} />
              Add known details
              <span className="font-normal text-mute">(optional)</span>
            </span>
            <ChevronDown
              className={`h-4 w-4 text-mute transition-transform ${open ? "rotate-180" : ""}`}
              strokeWidth={2}
            />
          </button>

          {open && (
            <div className="grid grid-cols-1 gap-4 border-t border-line px-4 py-4 sm:grid-cols-3">
              <Field label="Source system">
                <SelectInput value={details.source} onChange={set("source")} options={SOURCES} />
              </Field>
              <Field label="Clusters impacted">
                <SelectInput value={details.clusters} onChange={set("clusters")} options={CLUSTERS} />
              </Field>
              <Field label="Risk level">
                <SelectInput value={details.risk} onChange={set("risk")} options={RISKS} />
              </Field>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="kicker mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}

function SelectInput({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="input cursor-pointer appearance-none pr-9 text-[13.5px]"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o || "— Not specified"}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute"
        strokeWidth={2}
      />
    </div>
  );
}
