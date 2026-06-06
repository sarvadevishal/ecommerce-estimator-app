import type { CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "../../lib/icons";

interface Props {
  icon?: LucideIcon;
  index?: string;
  title?: string;
  subtitle?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  glass?: boolean;
  style?: CSSProperties;
}

export function SectionCard({
  icon: Icon,
  index,
  title,
  subtitle,
  action,
  children,
  className = "",
  bodyClassName = "px-6 py-6 sm:px-7",
  glass = false,
  style,
}: Props) {
  const hasHeader = Boolean(title || Icon || index);
  return (
    <section
      className={`${glass ? "glass-card" : "card"} reveal overflow-hidden ${className}`}
      style={style}
    >
      {hasHeader && (
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5 sm:px-7">
          <div className="flex items-start gap-3.5">
            {Icon && (
              <span className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-ink text-canvas">
                <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
              </span>
            )}
            <div>
              {index && (
                <div className="kicker text-accent-ink">Section {index}</div>
              )}
              {title && (
                <h3 className="mt-0.5 text-lg font-semibold tracking-tight text-ink">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="mt-1 max-w-2xl text-[13.5px] leading-relaxed text-slate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {action && <div className="flex-none">{action}</div>}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}
