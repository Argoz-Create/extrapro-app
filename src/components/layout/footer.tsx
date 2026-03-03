"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-white border-t border-border py-4 px-4">
      <div className="max-w-5xl mx-auto space-y-3">
        {/* Impact counter */}
        <p className="text-sm text-text-secondary text-center">
          {"\u{1F91D}"} 2,847 {t("footer.impact")}
        </p>

        {/* Links */}
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/a-propos"
            className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
          >
            {t("footer.about")}
          </Link>
          <Link
            href="#"
            className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
          >
            {t("footer.terms")}
          </Link>
          <Link
            href="#"
            className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
          >
            {t("footer.privacy")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
