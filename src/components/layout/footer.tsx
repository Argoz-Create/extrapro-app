"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-white border-t border-border py-4 px-4">
      <div className="max-w-5xl mx-auto space-y-3">
        {/* Links */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/a-propos"
            className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
          >
            {t("footer.about")}
          </Link>
          <Link
            href="/conditions"
            className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
          >
            {t("footer.terms")}
          </Link>
          <Link
            href="/confidentialite"
            className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
          >
            {t("footer.privacy")}
          </Link>
          <Link
            href="/mentions-legales"
            className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
          >
            {t("footer.legal")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
