"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";

export function NewAdHeader() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/dashboard"
        className="text-text-secondary hover:text-text-primary transition-colors"
        aria-label={t("createAd.backToDashboard")}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </Link>
      <h1 className="text-xl font-bold text-text-primary">
        {t("createAd.title")}
      </h1>
    </div>
  );
}
