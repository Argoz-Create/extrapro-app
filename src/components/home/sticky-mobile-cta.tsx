"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/lib/i18n/context";

export function StickyMobileCTA() {
  const pathname = usePathname();
  const { t } = useTranslation();

  // Determine if this route should show the sticky CTA
  const isVisible =
    pathname === "/" ||
    pathname.startsWith("/annonces/");

  // Hide on protected/off-flow routes
  const isHidden =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/maintenance") ||
    pathname.startsWith("/a-propos");

  if (isHidden || !isVisible) {
    return null;
  }

  return (
    <Link
      href="/dashboard/new"
      className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-display font-bold text-sm text-white shadow-lg transition-all duration-200 hover:bg-primary-dark active:scale-95 md:hidden"
      style={{ boxShadow: "0 10px 25px rgba(255, 59, 48, 0.3)" }}
    >
      <span aria-hidden>⚡</span>
      <span>{t("home.stickyCta")}</span>
    </Link>
  );
}
