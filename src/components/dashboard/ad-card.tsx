"use client";

import { useTransition, useState, useOptimistic } from "react";
import type { JobAdWithRelations, JobStatus } from "@/lib/types/database";
import { formatDate, formatTimeRange, formatSalary } from "@/lib/utils/format";
import { toggleJobStatus } from "@/lib/actions/jobs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/context";
import { HireConfirmationModal } from "./hire-confirmation-modal";

type AdCardProps = {
  job: JobAdWithRelations;
};

export function AdCard({ job }: AdCardProps) {
  const [isPending, startTransition] = useTransition();
  const [showHireModal, setShowHireModal] = useState(false);
  const { t } = useTranslation();
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(job.status);

  function handleToggleStatus() {
    const newStatus: JobStatus = optimisticStatus === "active" ? "inactive" : "active";
    startTransition(async () => {
      setOptimisticStatus(newStatus);
      await toggleJobStatus(job.id, newStatus);
    });
  }

  const statusLabelMap: Record<string, string> = {
    active: t("status.active"),
    inactive: t("status.inactive"),
    filled: t("status.filled"),
    expired: t("status.expired"),
  };
  const salary = formatSalary(job.hourly_rate, job.daily_rate);

  return (
    <>
      <Card className="p-4">
        {/* Header: profession + status */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xl flex-shrink-0">{job.professions.icon}</span>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-text-primary truncate">
                {job.professions.name_fr}
              </p>
              <p className="text-xs text-text-secondary">{job.cities.name}</p>
            </div>
          </div>
          <Badge variant={optimisticStatus as "active" | "inactive" | "filled"}>
            {statusLabelMap[optimisticStatus] || optimisticStatus}
          </Badge>
        </div>

        {/* Details */}
        <div className="mt-3 flex items-center gap-3 text-xs text-text-secondary">
          <span>{"\u{1F4C5}"} {formatDate(job.work_date)}</span>
          <span>{"\u{1F550}"} {formatTimeRange(job.start_time, job.end_time)}</span>
          {salary && <span>{"\u{1F4B6}"} {salary}</span>}
        </div>

        {/* Stats */}
        <div className="mt-2 flex items-center gap-4 text-xs text-text-tertiary">
          <span>{"\u{1F441}"} {job.view_count} {t("dashboard.viewsCount")}</span>
          <span>{"\u{1F4DE}"} {job.call_click_count} {t("dashboard.calls")}</span>
        </div>

        {/* Actions */}
        {(optimisticStatus === "active" || optimisticStatus === "inactive") && (
          <div className="mt-3 flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              href={`/dashboard/edit/${job.id}`}
            >
              {t("ad.edit")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleStatus}
              loading={isPending}
            >
              {optimisticStatus === "active" ? t("ad.deactivate") : t("ad.activate")}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowHireModal(true)}
            >
              {t("ad.markFilled")}
            </Button>
          </div>
        )}
      </Card>

      <HireConfirmationModal
        open={showHireModal}
        onClose={() => setShowHireModal(false)}
        job={job}
      />
    </>
  );
}
