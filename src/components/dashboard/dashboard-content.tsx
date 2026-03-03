"use client";

import { useTranslation } from "@/lib/i18n/context";
import type { EmployerStats, JobAdWithRelations } from "@/lib/types/database";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { AdList } from "@/components/dashboard/ad-list";
import { Button } from "@/components/ui/button";

type DashboardContentProps = {
  companyName: string;
  stats: EmployerStats;
  jobs: JobAdWithRelations[];
};

export function DashboardContent({ companyName, stats, jobs }: DashboardContentProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h1 className="text-xl font-bold text-text-primary">
          {t("dashboard.title")}
        </h1>
        <p className="text-sm text-text-secondary">{companyName}</p>
      </div>

      {/* Stats */}
      <StatsGrid stats={stats} />

      {/* New ad button */}
      <Button href="/dashboard/new" fullWidth>
        {t("dashboard.newAd")}
      </Button>

      {/* Job list */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-3">
          {t("dashboard.myAds")}
        </h2>
        <AdList jobs={jobs} />
      </div>
    </div>
  );
}
