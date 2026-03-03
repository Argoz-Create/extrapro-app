"use client";

import { useTranslation } from "@/lib/i18n/context";

export function LanguageToggle() {
  const { language, setLanguage } = useTranslation();

  return (
    <div className="inline-flex items-center gap-1 text-sm">
      <button
        onClick={() => setLanguage("fr")}
        className={`cursor-pointer px-1.5 py-0.5 rounded transition-colors ${
          language === "fr"
            ? "font-bold text-primary"
            : "text-text-tertiary hover:text-text-secondary"
        }`}
      >
        {"\u{1F1EB}\u{1F1F7}"} FR
      </button>
      <span className="text-text-tertiary">|</span>
      <button
        onClick={() => setLanguage("en")}
        className={`cursor-pointer px-1.5 py-0.5 rounded transition-colors ${
          language === "en"
            ? "font-bold text-primary"
            : "text-text-tertiary hover:text-text-secondary"
        }`}
      >
        {"\u{1F1EC}\u{1F1E7}"} EN
      </button>
    </div>
  );
}
