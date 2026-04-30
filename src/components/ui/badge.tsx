import React from "react";

type BadgeVariant = "urgent" | "live" | "status-active" | "status-inactive" | "filled" | "draft" | "active" | "inactive";

type BadgeProps = {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
};

const variantStyles: Record<BadgeVariant, string> = {
  urgent: "bg-primary-soft text-primary font-semibold text-xs px-3 py-1 rounded-full",
  live: "bg-success-soft text-success-dark font-semibold text-xs",
  "status-active": "bg-success-soft text-success-dark text-xs",
  "status-inactive": "bg-gray-100 text-text-tertiary text-xs",
  filled: "bg-primary text-white text-xs",
  draft: "bg-gray-100 text-text-secondary text-xs",
  active: "bg-success-soft text-success-dark text-xs",
  inactive: "bg-gray-100 text-text-tertiary text-xs",
};

export function Badge({ variant = "status-active", className = "", children }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center font-medium leading-none whitespace-nowrap rounded-full",
        variant === "urgent" || variant === "live" ? "" : "px-2 py-0.5",
        variantStyles[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
