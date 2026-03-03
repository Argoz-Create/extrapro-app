"use client";

import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";
import { Footer } from "@/components/layout/footer";
import { useTranslation } from "@/lib/i18n/context";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar />

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-6xl font-bold text-primary mb-4">404</p>
          <h1 className="text-xl font-semibold text-text-primary mb-2">
            {t("notFound.title")}
          </h1>
          <p className="text-sm text-text-secondary mb-6">
            {t("notFound.message")}
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-[8px] bg-gradient-to-b from-primary to-primary-dark px-6 py-3 text-base font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.1),0_1px_3px_rgba(22,163,74,0.3)] transition-all duration-150 hover:shadow-[0_4px_12px_rgba(34,197,94,0.3)] active:scale-[0.98]"
          >
            {t("notFound.backHome")}
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
