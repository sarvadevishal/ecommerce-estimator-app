import { Database, ChevronDown } from "../lib/icons";

interface Project {
  id: string;
  label: string;
  available: boolean;
}

export const PROJECTS: Project[] = [
  { id: "tdm", label: "TDM", available: true },
  { id: "titan", label: "Titan", available: false },
  { id: "tbe", label: "TBE", available: false },
  { id: "csp", label: "CSP", available: false },
  { id: "flp360", label: "FLP360", available: false },
];

export function labelFor(id: string): string {
  return PROJECTS.find((p) => p.id === id)?.label ?? id;
}

interface Props {
  value: string;
  onChange: (id: string) => void;
}

export function ProjectSelector({ value, onChange }: Props) {
  return (
    <div>
      <label htmlFor="project" className="kicker mb-2 block">
        Project
      </label>
      <div className="relative">
        <Database
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mute"
          strokeWidth={2}
        />
        <select
          id="project"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input cursor-pointer appearance-none pl-10 pr-11"
        >
          {PROJECTS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
              {p.available ? "" : " — Coming soon"}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mute"
          strokeWidth={2}
        />
      </div>
      <p className="mt-2 text-[12px] leading-relaxed text-mute">
        Only TDM is active in this MVP.
      </p>
    </div>
  );
}
