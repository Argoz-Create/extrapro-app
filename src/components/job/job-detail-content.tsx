"use client";

import Link from "next/link";
import { CallButton } from "@/components/job/call-button";
import { ShareButton } from "@/components/job/share-button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/lib/i18n/context";
import { formatDate, formatTimeRange, formatSalary } from "@/lib/utils/format";
import type { JobAdWithRelations } from "@/lib/types/database";

type JobDetailJob = JobAdWithRelations & {
  employers?: { company_name: string };
};

type JobDetailContentProps = {
  job: JobDetailJob;
};

export function JobDetailContent({ job }: JobDetailContentProps) {
  const { t } = useTranslation();
  const salary = formatSalary(job.hourly_rate, job.daily_rate);

  return (
    <main className="mx-auto max-w-lg px-4 py-4">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4"
      >
        {"<"} {t("job.backToListings")}
      </Link>

      {/* Card */}
      <div className="rounded-[14px] border border-border-light bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.06)]">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{job.professions.icon}</span>
            <div>
              <h1 className="text-xl font-bold text-text-primary">
                {job.professions.name_fr}
              </h1>
              {job.employers?.company_name && (
                <p className="text-sm text-text-secondary">
                  {job.employers.company_name}
                </p>
              )}
            </div>
          </div>
          {job.is_urgent && <Badge variant="urgent">{t("job.urgent")}</Badge>}
        </div>

        {/* Meta */}
        <div className="mt-4 space-y-2 text-sm text-text-secondary">
          <p>{"\u{1F4CD}"} {job.cities.name}</p>
          <p>{"\u{1F4C5}"} {formatDate(job.work_date)}</p>
          <p>{"\u23F0"} {formatTimeRange(job.start_time, job.end_time)}</p>
        </div>

        {/* Salary */}
        {salary && (
          <p className="mt-4 text-2xl font-bold text-primary">{salary}</p>
        )}

        {/* Description */}
        {job.description && (
          <div className="mt-4">
            <h2 className="text-sm font-semibold text-text-primary mb-1">
              {t("job.description")}
            </h2>
            <p className="text-sm text-text-secondary whitespace-pre-line">
              {job.description}
            </p>
          </div>
        )}

        {/* Contact info */}
        <div className="mt-4 border-t border-border-light pt-4">
          <h2 className="text-sm font-semibold text-text-primary mb-2">
            {t("job.contact")}
          </h2>
          {job.contact_name && (
            <p className="text-sm text-text-secondary">{job.contact_name}</p>
          )}
          <p className="text-sm text-text-secondary">{job.contact_phone}</p>
        </div>

        {/* Share button */}
        <div className="mt-4">
          <ShareButton />
        </div>

        {/* Call button */}
        <div className="mt-4">
          <CallButton phone={job.contact_phone} jobAdId={job.id} />
        </div>
      </div>

      {/* Solidarity banner inline */}
      <div className="mt-4 rounded-[14px] overflow-hidden bg-gradient-to-r from-primary to-primary-dark py-2 px-4">
        <p className="text-white text-sm text-center">
          {t("solidarity.banner")}
        </p>
      </div>
    </main>
  );
}
