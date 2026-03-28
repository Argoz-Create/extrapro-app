"use client";

import { useState } from "react";
import type { JobAdWithRelations } from "@/lib/types/database";
import { Tabs } from "@/components/ui/tabs";
import { useTranslation } from "@/lib/i18n/context";
import { AdCard } from "./ad-card";

type AdListProps = {
  jobs: JobAdWithRelations[];
};

export function AdList({ jobs }: AdListProps) {
  const [activeTab, setActiveTab] = useState("all");
  const { t } = useTranslation();

  const tabs = [
    { value: "all", label: t("tabs.all") },
    { value: "active", label: t("tabs.active") },
    { value: "inactive", label: t("tabs.inactive") },
    { value: "filled", label: t("tabs.filled") },
  ];

  const filteredJobs =
    activeTab === "all"
      ? jobs
      : jobs.filter((job) => job.status === activeTab);

  return (
    <div>
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="mt-4 space-y-3">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => <AdCard key={job.id} job={job} />)
        ) : (
          <p className="text-center text-sm text-text-tertiary py-8">
            {t("ad.noAds")}
          </p>
        )}
      </div>
    </div>
  );
}
