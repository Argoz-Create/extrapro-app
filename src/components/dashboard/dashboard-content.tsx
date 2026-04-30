"use client";

import { useTranslation } from "@/lib/i18n/context";
import type { EmployerStats, JobAdWithRelations } from "@/lib/types/database";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { AdList } from "@/components/dashboard/ad-list";
import { AdCard } from "@/components/dashboard/ad-card";
import { Button } from "@/components/ui/button";

type DashboardContentProps = {
  companyName: string;
  stats: EmployerStats;
  jobs: JobAdWithRelations[];
  newlyExpiredCount: number;
};

export function DashboardContent({ companyName, stats, jobs, newlyExpiredCount }: DashboardContentProps) {
  const { t } = useTranslation();

  const drafts = jobs.filter((j) => j.status === "draft");
  const nonDraftJobs = jobs.filter((j) => j.status !== "draft");

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h1 className="text-xl font-display font-700 text-text-primary">
          {t("dashboard.title")}
        </h1>
        <p className="text-sm text-text-secondary">{companyName}</p>
      </div>

      {/* Expired notice */}
      {newlyExpiredCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm p-3 rounded-xl">
          {t("ad.expiredNotice")}
        </div>
      )}

      {/* Stats */}
      <StatsGrid stats={stats} />

      {/* New ad button */}
      <Button href="/dashboard/new" fullWidth>
        {t("dashboard.newAd")}
      </Button>

      {/* Drafts section */}
      {drafts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
            {t("dashboard.drafts")}
            <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
              {drafts.length}
            </span>
          </h2>
          <div className="space-y-3">
            {drafts.map((job) => (
              <AdCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      )}

      {/* Job list */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-3">
          {t("dashboard.myAds")}
        </h2>
        <AdList jobs={nonDraftJobs} />
      </div>
    </div>
  );
}
