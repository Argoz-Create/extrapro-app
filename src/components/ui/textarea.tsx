"use client";

import React, { useState } from "react";

type TextareaProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> & {
  label?: string;
  error?: string;
  className?: string;
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ label, error, className = "", id, rows = 3, maxLength, onChange, ...props }, ref) {
    const [charCount, setCharCount] = useState(0);
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
      setCharCount(e.target.value.length);
      onChange?.(e);
    }

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          maxLength={maxLength}
          onChange={handleChange}
          className={[
            "w-full bg-input-bg border border-transparent rounded-[10px] px-3 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary resize-y",
            "outline-none transition-all duration-150",
            "focus:bg-white focus:border-primary focus:ring-[3px] focus:ring-primary/10",
            error ? "border-red-400 focus:border-red-400 focus:ring-red-400/10" : "",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
        <div className="flex justify-between mt-1">
          {error ? (
            <p className="text-xs text-red-500">{error}</p>
          ) : (
            <span />
          )}
          {maxLength !== undefined && (
            <p className="text-xs text-text-tertiary">
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);
