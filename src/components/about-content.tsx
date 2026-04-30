"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";
import { formatNumber } from "@/lib/utils/format";
import type { PlatformStats } from "@/lib/types/database";

type AboutContentProps = {
  stats: PlatformStats | null;
};

export function AboutContent({ stats }: AboutContentProps) {
  const { t } = useTranslation();

  return (
    <main className="mx-auto max-w-lg px-4 py-6">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors mb-6"
      >
        {"<"} {t("about.back")}
      </Link>

      {/* Notre Mission */}
      <section className="mb-8">
        <h1 className="text-2xl font-display font-bold text-text-primary mb-3">
          {t("about.missionTitle")}
        </h1>
        <p className="text-sm text-text-secondary leading-relaxed">
          {t("about.missionText")}
        </p>
      </section>

      {/* Comment ca marche */}
      <section className="mb-8">
        <h2 className="text-xl font-display font-bold text-text-primary mb-4">
          {t("about.howTitle")}
        </h2>
        <div className="space-y-4">
          <Step
            number="1"
            title={t("about.step1Title")}
            description={t("about.step1Text")}
          />
          <Step
            number="2"
            title={t("about.step2Title")}
            description={t("about.step2Text")}
          />
          <Step
            number="3"
            title={t("about.step3Title")}
            description={t("about.step3Text")}
          />
        </div>
      </section>

      {/* Impact */}
      <section className="mb-8">
        <h2 className="text-xl font-display font-bold text-text-primary mb-4">
          {t("about.impactTitle")}
        </h2>
        <div className="rounded-2xl border border-border-light bg-white p-5 shadow-sm">
          {stats ? (
            <div className="grid grid-cols-3 gap-4 text-center">
              <StatBlock
                value={formatNumber(stats.total_hires)}
                label={t("about.totalHires")}
              />
              <StatBlock
                value={formatNumber(stats.total_employers)}
                label={t("about.totalEmployers")}
              />
              <StatBlock
                value={formatNumber(stats.total_ads_posted)}
                label={t("about.totalAds")}
              />
            </div>
          ) : (
            <p className="text-sm text-text-secondary text-center">
              {t("about.statsUnavailable")}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">
        {number}
      </div>
      <div>
        <h3 className="font-semibold text-text-primary">{title}</h3>
        <p className="text-sm text-text-secondary mt-0.5">{description}</p>
      </div>
    </div>
  );
}

function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-display font-bold font-mono text-success">{value}</p>
      <p className="text-xs text-text-secondary mt-0.5">{label}</p>
    </div>
  );
}
