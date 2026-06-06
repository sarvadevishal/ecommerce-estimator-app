import type { ReactNode } from "react";
import type { GuardrailEstimate } from "../lib/types";
import { Info, AlertTriangle } from "../lib/icons";

interface Props {
  estimate: GuardrailEstimate;
}

export function NeedMoreInfo({ estimate }: Props) {
  // Two distinct "can't estimate" cases:
  //  • No questions  → the request is outside the TDM estimator's scope. Show a
  //    single calm, meaningful message — not a list of irrelevant TDM questions.
  //  • Has questions → the request is plausibly TDM but too vague. Keep the
  //    clarifying questions so the user can refine and retry.
  if (estimate.missingInfo.length === 0) {
    return <OutsideScope message={estimate.message} />;
  }
  return <NeedsDetail estimate={estimate} />;
}

function OutsideScope({ message }: { message: string }) {
  const headline =
    message && message.trim() && message !== "More information needed."
      ? message
      : "That's outside what this estimator covers.";
  return (
    <section className="card reveal overflow-hidden">
      <div className="flex flex-col items-center gap-4 px-6 py-12 text-center sm:px-10">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent-ink">
          <Info className="h-6 w-6" strokeWidth={2} />
        </span>
        <div className="max-w-lg">
          <h2 className="text-lg font-semibold leading-snug tracking-tight text-ink">
            {headline}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate">
            The TDM estimator covers data-engineering work — adding tables or
            columns, Informatica / ETL pipelines, stored procedures, and the
            related validation and deployment. Try describing one of those.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Example>Add a column ORDER_PRIORITY to FACT_ORDERS</Example>
          <Example>New table CUSTOMER_ORDERS sourced from AS400</Example>
        </div>
      </div>
    </section>
  );
}

function Example({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-line bg-surface px-3 py-1.5 text-[12px] text-slate">
      “{children}”
    </span>
  );
}

function NeedsDetail({ estimate }: { estimate: GuardrailEstimate }) {
  return (
    <section className="card reveal overflow-hidden">
      <div className="flex items-start gap-3.5 border-b border-line bg-amber-soft/40 px-6 py-5 sm:px-7">
        <span className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-amber-soft text-amber">
          <AlertTriangle className="h-[18px] w-[18px]" strokeWidth={2} />
        </span>
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-ink">
            {estimate.message || "More information needed."}
          </h2>
          <p className="mt-1 max-w-2xl text-[13.5px] leading-relaxed text-slate">
            This looks like TDM work, but a few details are missing. Answer these
            and try again.
          </p>
        </div>
      </div>

      <ul className="divide-y divide-line px-6 sm:px-7">
        {estimate.missingInfo.map((q, i) => (
          <li key={i} className="flex items-start gap-3 py-3.5">
            <span className="tnum mt-px flex h-5 w-5 flex-none items-center justify-center rounded-md bg-surface-2 text-[11px] font-semibold text-mute">
              {i + 1}
            </span>
            <span className="text-sm leading-relaxed text-slate">{q}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
