import React from "react";
import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "dark";
type ButtonSize = "sm" | "default" | "lg";

type ButtonBaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  className?: string;
};

type ButtonAsButton = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    href?: undefined;
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-dark active:scale-[0.98] rounded-full",
  secondary:
    "bg-transparent border border-border text-text-primary hover:border-text-primary rounded-full",
  outline:
    "bg-transparent border border-border text-text-primary hover:border-text-primary rounded-full",
  ghost:
    "bg-transparent text-text-primary hover:bg-gray-100 active:bg-gray-200 rounded-full",
  dark:
    "bg-white text-ink hover:bg-gray-100 rounded-full",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  default: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

function Spinner() {
  return (
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(props, ref) {
  const {
    variant = "primary",
    size = "default",
    fullWidth = false,
    loading = false,
    className = "",
    ...rest
  } = props;

  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-all duration-200 ease-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  const classes = [
    baseClasses,
    variantStyles[variant],
    sizeStyles[size],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...linkRest } = rest as ButtonAsLink;
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={classes}
        {...linkRest}
      >
        {loading && <Spinner />}
        {linkRest.children}
      </Link>
    );
  }

  const buttonRest = rest as Omit<ButtonAsButton, "href">;
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={classes}
      disabled={buttonRest.disabled || loading}
      {...buttonRest}
    >
      {loading && <Spinner />}
      {buttonRest.children}
    </button>
  );
});
