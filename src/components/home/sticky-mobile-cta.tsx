"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/lib/i18n/context";

export function StickyMobileCTA() {
  const pathname = usePathname();
  const { t } = useTranslation();

  // Sticky CTA belongs to the Direction B design showcase only.
  // The production homepage at `/` is the original green/simple design
  // and intentionally does not surface this widget.
  if (pathname !== "/designideas") {
    return null;
  }

  return (
    <Link
      href="/dashboard/new"
      className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-display font-bold text-sm text-white shadow-lg transition-all duration-200 hover:bg-primary-dark active:scale-95 md:hidden"
      style={{ boxShadow: "0 10px 25px rgba(255, 59, 48, 0.3)" }}
    >
      <Zap className="h-4 w-4" strokeWidth={2} />
      <span>{t("home.stickyCta")}</span>
    </Link>
  );
}
