"use client";

import { useTransition, useState, useOptimistic } from "react";
import { Calendar, Clock, Banknote, Eye, Phone } from "lucide-react";
import type { JobAdWithRelations, JobStatus } from "@/lib/types/database";
import { formatDateRange, formatTimeRange, formatSalary, formatDateTime } from "@/lib/utils/format";
import { toggleJobStatus, relistJob } from "@/lib/actions/jobs";
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
  const [isRelistPending, startRelistTransition] = useTransition();
  const [showHireModal, setShowHireModal] = useState(false);
  const { t } = useTranslation();
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(job.status);

  function handleRelist() {
    startRelistTransition(async () => {
      try {
        await relistJob(job.id);
      } catch {
        // redirect() throws on success
      }
    });
  }

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
    draft: t("status.draft"),
  };
  const salary = formatSalary(job.hourly_rate, job.daily_rate, job.flat_rate);
  const shortId = job.id.slice(0, 8).toUpperCase();

  return (
    <>
      <Card className="p-4">
        {/* Header: publication number + date + status */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 text-xs text-text-tertiary">
            <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">#{shortId}</span>
            {job.published_at && (
              <span>{formatDateTime(job.published_at)}</span>
            )}
          </div>
          <Badge variant={optimisticStatus as "active" | "inactive" | "filled" | "draft"}>
            {statusLabelMap[optimisticStatus] || optimisticStatus}
          </Badge>
        </div>

        {/* Profession + city */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="text-text-secondary flex-shrink-0">
            (no icon for draft jobs)
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm font-display text-text-primary truncate">
              {Array.isArray(job.professions) && job.professions.length > 0
                ? job.professions[0]?.name_fr
                : t("status.draft")}
            </p>
            <p className="text-xs text-text-secondary">{job.cities?.name ?? ""}</p>
          </div>
        </div>

        {/* Details */}
        <div className="mt-3 flex items-center gap-3 text-xs text-text-secondary flex-wrap">
          {job.work_date && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" strokeWidth={2} />
              <span>{formatDateRange(job.work_date, job.work_end_date)}</span>
            </div>
          )}
          {job.start_time && job.end_time && (
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" strokeWidth={2} />
              <span>{formatTimeRange(job.start_time, job.end_time)}</span>
            </div>
          )}
          {salary && (
            <div className="flex items-center gap-1">
              <Banknote className="h-3.5 w-3.5" strokeWidth={2} />
              <span>{salary}</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-2 flex items-center gap-4 text-xs text-text-tertiary flex-wrap">
          <div className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" strokeWidth={2} />
            <span>{job.view_count} {t("dashboard.viewsCount")}</span>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="h-3.5 w-3.5" strokeWidth={2} />
            <span>{job.call_click_count} {t("dashboard.calls")}</span>
          </div>
        </div>

        {/* Actions */}
        {optimisticStatus === "draft" && (
          <div className="mt-3 flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              href={`/dashboard/edit/${job.id}`}
            >
              {t("ad.continueDraft")}
            </Button>
          </div>
        )}
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
        {(optimisticStatus === "filled" || optimisticStatus === "expired") && (
          <div className="mt-3 flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              href={`/annonces/${job.id}`}
            >
              {t("ad.view")}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleRelist}
              loading={isRelistPending}
            >
              {t("ad.relist")}
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
