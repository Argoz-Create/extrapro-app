"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { useTranslation } from "@/lib/i18n/context";

export function TopBar() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border-light">
      <div className="h-14 max-w-5xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center pulse-coral">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <span className="font-display font-extrabold text-text-primary tracking-tight">
            EXTRAPRO
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Button variant="outline" size="sm" href="/login">
            {t("nav.espacePro")}
          </Button>
        </div>
      </div>
    </header>
  );
}
