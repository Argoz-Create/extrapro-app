import React from "react";

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "className"> & {
  label?: string;
  error?: string;
  className?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, error, className = "", id, ...props }, ref) {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={[
            "w-full bg-input-bg border border-transparent rounded-[10px] px-3 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary",
            "outline-none transition-all duration-150",
            "focus:bg-white focus:border-primary focus:ring-[3px] focus:ring-primary/10",
            error ? "border-red-400 focus:border-red-400 focus:ring-red-400/10" : "",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);
