"use client";

import Link from "next/link";
import { Briefcase, MapPin, Calendar, Clock } from "lucide-react";
import { ContactDetails } from "@/components/job/contact-details";
import { ShareButton } from "@/components/job/share-button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/lib/i18n/context";
import { formatDateRange, formatTimeRange, formatSalary, formatDateTime } from "@/lib/utils/format";
import type { JobAdWithRelations } from "@/lib/types/database";

type JobDetailJob = JobAdWithRelations & {
  employers?: { company_name: string };
};

type JobDetailContentProps = {
  job: JobDetailJob;
};

export function JobDetailContent({ job }: JobDetailContentProps) {
  const { t } = useTranslation();
  const salary = formatSalary(job.hourly_rate, job.daily_rate, job.flat_rate);

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
      <div className="rounded-2xl border border-border-light bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.06)]">
        {/* Publication info: ID + date */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-xs text-text-tertiary">
            <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">
              #{job.id.slice(0, 8).toUpperCase()}
            </span>
            {job.published_at && (
              <span>{formatDateTime(job.published_at)}</span>
            )}
          </div>
          {job.is_urgent && <Badge variant="urgent">{t("job.urgent")}</Badge>}
        </div>

        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 pt-1">
            <Briefcase className="h-6 w-6 text-text-secondary" strokeWidth={2} />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-display font-bold text-text-primary mb-1">
              {job.professions && job.professions.length > 0
                ? job.professions.map(p => p.name_fr).join(", ")
                : job.custom_profession || "Extra"}
            </h1>
            {job.employers?.company_name && (
              <p className="text-sm text-text-secondary">
                {job.employers.company_name}
              </p>
            )}
            {/* All professions as chips */}
            {job.professions && job.professions.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {job.professions.map((prof) => (
                  <span key={prof.id} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-soft text-primary rounded-full text-xs font-medium">
                    <span>{prof.name_fr}</span>
                  </span>
                ))}
                {job.custom_profession && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-text-tertiary/10 text-text-tertiary rounded-full text-xs font-medium italic">
                    {job.custom_profession}
                    <span className="text-text-tertiary/70">(suggéré)</span>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Meta */}
        <div className="mt-4 space-y-2 text-sm text-text-secondary">
          {job.cities?.name && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 flex-shrink-0" strokeWidth={2} />
              <span>{job.cities.name}</span>
            </div>
          )}
          {job.work_date && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 flex-shrink-0" strokeWidth={2} />
              <span>{formatDateRange(job.work_date, job.work_end_date)}</span>
            </div>
          )}
          {job.start_time && job.end_time && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 flex-shrink-0" strokeWidth={2} />
              <span>{formatTimeRange(job.start_time, job.end_time)}</span>
            </div>
          )}
        </div>

        {/* Salary */}
        {salary && (
          <p className="mt-4 text-2xl font-bold font-mono text-success">{salary}</p>
        )}

        {/* Required skill */}
        {job.required_skill && (
          <div className="mt-4">
            <h2 className="text-sm font-semibold text-text-primary mb-1">
              {t("job.requiredSkill")}
            </h2>
            <p className="text-sm text-text-secondary">{job.required_skill}</p>
          </div>
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

        {/* Share button */}
        <div className="mt-4">
          <ShareButton />
        </div>

        {/* Contact details */}
        <div className="mt-4">
          <ContactDetails
            phone={job.contact_phone ?? ""}
            jobAdId={job.id}
            contactName={job.contact_name}
            contactEmail={job.contact_email}
            contactWhatsapp={job.contact_whatsapp}
            companyName={job.employers?.company_name}
          />
        </div>
      </div>
    </main>
  );
}
