import React from "react";

type CardProps = {
  clickable?: boolean;
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export function Card({ clickable, className = "", children, ...props }: CardProps) {
  return (
    <div
      className={[
        "bg-surface rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow duration-200",
        clickable ? "cursor-pointer" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
