"use client";

import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";
import { Footer } from "@/components/layout/footer";
import { useTranslation } from "@/lib/i18n/context";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <TopBar />

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-6xl font-display font-extrabold text-primary mb-4">404</p>
          <h1 className="text-xl font-display font-bold text-text-primary mb-2">
            {t("notFound.title")}
          </h1>
          <p className="text-sm text-text-secondary mb-6">
            {t("notFound.message")}
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-base font-medium text-white transition-all duration-200 ease-out hover:bg-primary-dark active:scale-[0.98]"
          >
            {t("notFound.backHome")}
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
