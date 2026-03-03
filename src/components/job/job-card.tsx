"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CallButton } from "@/components/job/call-button";
import { formatDate, formatTimeRange, formatSalary } from "@/lib/utils/format";
import { useTranslation } from "@/lib/i18n/context";
import type { JobAdWithRelations } from "@/lib/types/database";

type JobCardProps = {
  job: JobAdWithRelations;
};

export function JobCard({ job }: JobCardProps) {
  const { t } = useTranslation();
  const salary = formatSalary(job.hourly_rate, job.daily_rate);

  return (
    <Card clickable className="overflow-hidden">
      <Link href={`/annonces/${job.id}`} className="block p-4 pb-2">
        {/* Header: profession + urgent badge */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xl flex-shrink-0">{job.professions.icon}</span>
            <h3 className="font-semibold text-text-primary truncate">
              {job.professions.name_fr}
            </h3>
          </div>
          {job.is_urgent && <Badge variant="urgent">{t("job.urgent")}</Badge>}
        </div>

        {/* Meta info */}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-secondary">
          <span>{"\u{1F4CD}"} {job.cities.name}</span>
          <span>{"\u{1F4C5}"} {formatDate(job.work_date)}</span>
          <span>{"\u23F0"} {formatTimeRange(job.start_time, job.end_time)}</span>
        </div>

        {/* Salary */}
        {salary && (
          <p className="mt-2 text-xl font-bold text-primary">{salary}</p>
        )}

        {/* Solidarity message */}
        <p className="mt-2 text-xs text-primary">
          {t("solidarity.message")}
        </p>
      </Link>

      {/* Call button - outside the Link to prevent navigation */}
      <div className="px-4 pb-4 pt-2">
        <CallButton phone={job.contact_phone} jobAdId={job.id} />
      </div>
    </Card>
  );
}
