import React from "react";

type BadgeVariant = "urgent" | "active" | "inactive" | "filled" | "draft";

type BadgeProps = {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
};

const variantStyles: Record<BadgeVariant, string> = {
  urgent: "bg-accent-light text-accent-dark font-bold text-[10px] uppercase",
  active: "bg-green-100 text-green-800 text-xs",
  inactive: "bg-gray-100 text-gray-600 text-xs",
  filled: "bg-blue-100 text-blue-800 text-xs",
  draft: "bg-amber-100 text-amber-800 text-xs",
};

export function Badge({ variant = "active", className = "", children }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center px-2 py-0.5 rounded-full font-medium leading-none whitespace-nowrap",
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
