import type { ReactNode } from "react";

export function PageHeader({
  kicker,
  title,
  subtitle,
  action,
}: {
  kicker?: string;
  title: string;
  subtitle?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {kicker && <div className="kicker mb-2">{kicker}</div>}
        <h1 className="text-[1.7rem] font-semibold leading-tight tracking-tight text-ink sm:text-[2rem]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex-none">{action}</div>}
    </div>
  );
}
