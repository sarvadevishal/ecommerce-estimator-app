import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "../../lib/icons";

type Variant = "primary" | "accent" | "secondary" | "ghost";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  children: ReactNode;
}

const VARIANT: Record<Variant, string> = {
  primary: "btn-primary",
  accent: "btn-accent",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
};

export function PremiumButton({
  variant = "primary",
  loading = false,
  iconLeft,
  iconRight,
  children,
  className = "",
  disabled,
  ...rest
}: Props) {
  return (
    <button
      type="button"
      className={`btn ${VARIANT[variant]} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : iconLeft}
      {children}
      {!loading && iconRight}
    </button>
  );
}
