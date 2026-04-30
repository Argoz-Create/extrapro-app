"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { useTranslation } from "@/lib/i18n/context";

export function DashboardHeader() {
  const router = useRouter();
  const { t } = useTranslation();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border-light">
      <div className="h-14 max-w-5xl mx-auto px-4 flex items-center justify-between">
        {/* Logo — links to public homepage. To return to the dashboard,
            employers use the "Home" / browser back / Pro Area CTA. */}
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
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            {t("nav.home")}
          </Link>
          <LanguageToggle />
          <button
            onClick={handleLogout}
            className="text-sm text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            {t("nav.logout")}
          </button>
        </div>
      </div>
    </header>
  );
}
