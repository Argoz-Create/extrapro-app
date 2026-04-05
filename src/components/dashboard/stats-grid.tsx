"use client";

import type { EmployerStats } from "@/lib/types/database";
import { formatNumber } from "@/lib/utils/format";
import { StatCard } from "./stat-card";
import { useTranslation } from "@/lib/i18n/context";

type StatsGridProps = {
  stats: EmployerStats;
};

export function StatsGrid({ stats }: StatsGridProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-3 gap-3">
      <StatCard
        icon={"\u{1F4DE}"}
        value={String(stats.total_hires)}
        label={t("dashboard.hires")}
      />
      <StatCard
        icon={"\u{1F4CB}"}
        value={String(stats.active_ads)}
        label={t("dashboard.activeAds")}
      />
      <StatCard
        icon={"\u{1F441}"}
        value={formatNumber(stats.total_views)}
        label={t("dashboard.views")}
      />
    </div>
  );
}
