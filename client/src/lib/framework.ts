// A read-only mirror of the estimation framework defined in
// server/skills/tdm.md (the source of truth). Surfaced on the Settings page so
// teams can see the rules that drive every estimate. Editing the skill file is
// what actually changes behaviour — these tables are for reference.

export const WORK_TYPES: string[] = [
  "Data Fix / One-Time Update",
  "Bug Fix",
  "Stored Procedure Enhancement",
  "New Stored Procedure",
  "Informatica Enhancement",
  "New Informatica Pipeline",
  "ETL Works Enhancement",
  "New ETL Works Pipeline",
  "Redshift Performance Tuning",
  "S3 File Ingestion",
  "Lambda Automation",
  "Zero ETL Validation / Integration",
  "Full TDM Feature",
];

export const COMPLEXITY: {
  level: string;
  multiplier: string;
  when: string;
}[] = [
  { level: "Low", multiplier: "1.0×", when: "One table or proc, stable structures, no downstream validation." },
  { level: "Medium", multiplier: "1.5×", when: "Multiple tables, UAT + PROD validation, some downstream checks." },
  { level: "High", multiplier: "2.5×", when: "Multiple technologies/clusters, full + incremental logic, BI/app validation." },
  { level: "Critical", multiplier: "3.0×", when: "Month-end/financial impact, customer-facing output, difficult rollback." },
];

export const RISK_BUFFERS: { level: string; buffer: string }[] = [
  { level: "Low", buffer: "+10%" },
  { level: "Medium", buffer: "+20%" },
  { level: "High", buffer: "+30%" },
  { level: "Critical", buffer: "+40%" },
];

export const TECH_ADDONS: { tech: string; hours: string }[] = [
  { tech: "Informatica mapping / taskflow change", hours: "+8 to +40h" },
  { tech: "New Informatica pipeline", hours: "+24 to +80h" },
  { tech: "ETL Works flow change", hours: "+6 to +32h" },
  { tech: "Redshift stored procedure change", hours: "+8 to +60h" },
  { tech: "Redshift performance tuning", hours: "+8 to +40h" },
  { tech: "PROD2 BI / reporting validation", hours: "+8 to +32h" },
  { tech: "PROD3 application validation", hours: "+8 to +32h" },
  { tech: "UAT validation", hours: "+8 to +32h" },
  { tech: "S3 new file / load pattern", hours: "+8 to +40h" },
  { tech: "Lambda change / new automation", hours: "+8 to +40h" },
  { tech: "Zero ETL validation / change", hours: "+16 to +80h" },
  { tech: "Production deployment & rollback", hours: "+8 to +24h" },
];

export const PHASES: { phase: string; pct: string }[] = [
  { phase: "Requirement Analysis", pct: "10%" },
  { phase: "Technical Design", pct: "10%" },
  { phase: "Development", pct: "35%" },
  { phase: "Unit Testing", pct: "15%" },
  { phase: "Data Validation", pct: "15%" },
  { phase: "Performance Testing", pct: "5%" },
  { phase: "Deployment", pct: "5%" },
  { phase: "Post-Deployment Support", pct: "5%" },
];
