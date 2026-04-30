"use client";

import Link from "next/link";
import { MapPin, Target, Calendar, Banknote, Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContactDetails } from "@/components/job/contact-details";
import { formatDateRange, formatTimeRange, formatSalary, formatDateTime } from "@/lib/utils/format";
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
        {/* Header: listing ID + publication date + urgent badge */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-mono bg-gray-100 text-text-tertiary px-2 py-0.5 rounded">
              #{shortId}
            </span>
            {job.published_at && (
              <span className="text-xs text-text-tertiary">
                {formatDateTime(job.published_at)}
              </span>
            )}
          </div>
          {job.is_urgent && <Badge variant="urgent">• {t("job.urgent")}</Badge>}
        </div>

        <div className="mt-3 space-y-1.5">
          {/* 1. Ville / City */}
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <MapPin className="h-4 w-4 flex-shrink-0" strokeWidth={2} />
            <span className="font-medium text-text-tertiary">{t("job.location")}:</span>
            <span>{job.cities?.name}</span>
          </div>

          {/* 2. Poste / Position */}
          <div className="text-sm text-text-secondary">
            <span className="font-medium text-text-tertiary block mb-1.5">{t("job.position")}:</span>
            <div className="flex flex-wrap gap-1.5">
              {job.professions && job.professions.length > 0 ? (
                <>
                  {job.professions.slice(0, 3).map((prof) => (
                    <span key={prof.id} className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-soft text-primary rounded-full text-xs font-medium">
                      <span>{prof.name_fr}</span>
                    </span>
                  ))}
                  {job.professions.length > 3 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-text-tertiary/10 text-text-tertiary rounded-full text-xs font-medium">
                      +{job.professions.length - 3}
                    </span>
                  )}
                </>
              ) : null}
              {job.custom_profession && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-soft text-primary rounded-full text-xs font-medium italic">
                  {job.custom_profession}
                  <span className="text-primary/70">(suggéré)</span>
                </span>
              )}
            </div>
          </div>

          {/* 3. Competence requise / Required skill */}
          {job.required_skill && (
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Target className="h-4 w-4 flex-shrink-0" strokeWidth={2} />
              <span className="font-medium text-text-tertiary">{t("job.requiredSkill")}:</span>
              <span>{job.required_skill}</span>
            </div>
          )}

          {/* 4. Date, Heure et Emplacement */}
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Calendar className="h-4 w-4 flex-shrink-0" strokeWidth={2} />
            <span>
              {job.work_date && formatDateRange(job.work_date, job.work_end_date)} {"·"} {job.start_time && job.end_time && formatTimeRange(job.start_time, job.end_time)} {"·"} {job.cities?.name}
            </span>
          </div>

          {/* 5. Salaire */}
          {salary && (
            <div className="flex items-center gap-2">
              <Banknote className="h-4 w-4 flex-shrink-0" strokeWidth={2} />
              <span className="text-lg font-bold font-mono text-success">{salary}</span>
            </div>
          )}
        </div>
      </Link>

      {/* 6. Contact details */}
      <div className="px-4 pb-4 pt-2">
        <ContactDetails
          phone={job.contact_phone ?? ""}
          jobAdId={job.id}
          contactName={job.contact_name}
          contactEmail={job.contact_email}
          contactWhatsapp={job.contact_whatsapp}
          companyName={job.employers?.company_name}
        />
      </div>
    </Card>
  );
}
