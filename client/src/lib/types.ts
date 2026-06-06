export type Phase = "MVP" | "Phase2";
export type Automatable = "yes" | "partial" | "no";
export type Confidence = "high" | "medium" | "low";

export interface Task {
  id: string;
  name: string;
  phase: Phase;
  manualDays: number;
  aiSavingsPct: number;
  aiDays: number;
  aiHelps: boolean;
  justification: string;
  automatable: Automatable;
  automationNote: string;
  includedByDefault: boolean;
}

export interface CoveredEstimate {
  project: string;
  covered: true;
  summary: string;
  confidence: Confidence;
  assumptions: string[];
  tasks: Task[];
  automationSummary: string;
  scopeNote: string;
}

export interface GuardrailEstimate {
  project: string;
  covered: false;
  message: string;
  missingInfo: string[];
}

export type Estimate = CoveredEstimate | GuardrailEstimate;
