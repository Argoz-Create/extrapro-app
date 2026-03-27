"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CallButton } from "@/components/job/call-button";
import { formatDateRange, formatTimeRange, formatSalary } from "@/lib/utils/format";
import { useTranslation } from "@/lib/i18n/context";
import type { JobAdWithRelations } from "@/lib/types/database";

type JobCardProps = {
  job: JobAdWithRelations;
};

export function JobCard({ job }: JobCardProps) {
  const { t } = useTranslation();
  const salary = formatSalary(job.hourly_rate, job.daily_rate, job.flat_rate);
  const shortId = job.id.slice(0, 8).toUpperCase();

  return (
    <Card clickable className="overflow-hidden">
      <Link href={`/annonces/${job.id}`} className="block p-4 pb-2">
        {/* Header: listing ID + urgent badge */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-mono bg-gray-100 text-text-tertiary px-2 py-0.5 rounded">
              #{shortId}
            </span>
            {job.is_urgent && <Badge variant="urgent">{t("job.urgent")}</Badge>}
          </div>
        </div>

        <div className="mt-3 space-y-1.5">
          {/* 1. Ville / City */}
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <span className="flex-shrink-0">{"\u{1F4CD}"}</span>
            <span className="font-medium text-text-tertiary">{t("job.location")}:</span>
            <span>{job.cities.name}</span>
          </div>

          {/* 2. Poste / Position */}
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <span className="flex-shrink-0">{job.professions.icon}</span>
            <span className="font-medium text-text-tertiary">{t("job.position")}:</span>
            <span>{job.professions.name_fr}</span>
          </div>

          {/* 3. Competence requise / Required skill */}
          {job.required_skill && (
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <span className="flex-shrink-0">{"\u{1F3AF}"}</span>
              <span className="font-medium text-text-tertiary">{t("job.requiredSkill")}:</span>
              <span>{job.required_skill}</span>
            </div>
          )}

          {/* 4. Date, Heure et Emplacement */}
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <span className="flex-shrink-0">{"\u{1F4C5}"}</span>
            <span>
              {formatDateRange(job.work_date, job.work_end_date)} {"\u00B7"} {formatTimeRange(job.start_time, job.end_time)} {"\u00B7"} {job.cities.name}
            </span>
          </div>

          {/* 5. Salaire */}
          {salary && (
            <div className="flex items-center gap-2">
              <span className="flex-shrink-0">{"\u{1F4B0}"}</span>
              <span className="text-lg font-bold text-primary">{salary}</span>
            </div>
          )}
        </div>
      </Link>

      {/* 6. CTA: phone number + employer/recruiter name */}
      <div className="px-4 pb-4 pt-2">
        <CallButton
          phone={job.contact_phone}
          jobAdId={job.id}
          contactName={job.contact_name}
          companyName={job.employers?.company_name}
        />
      </div>
    </Card>
  );
}
