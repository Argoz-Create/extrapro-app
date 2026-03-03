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
        "bg-white rounded-[14px] border border-border-light shadow-[0_1px_2px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.06)]",
        "hover:shadow-[0_4px_12px_rgba(34,197,94,0.15)] transition-shadow duration-200",
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
