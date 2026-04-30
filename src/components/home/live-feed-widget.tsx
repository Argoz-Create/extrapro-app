"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { formatSalary } from "@/lib/utils/format";
import type { JobAdWithRelations } from "@/lib/types/database";

interface LiveFeedWidgetProps {
  jobs: JobAdWithRelations[];
  translations: Record<string, string>;
}

export function LiveFeedWidget({ jobs, translations }: LiveFeedWidgetProps) {
  const { language } = useLanguage();

  const formatTime = (dateStr: string | null, timeStr: string | null) => {
    if (!dateStr || !timeStr) return "—";
    
    const date = new Date(dateStr);
    const isToday = date.toDateString() === new Date().toDateString();
    
    if (isToday) {
      const parts = timeStr.split(":");
      if (language === "fr") {
        return `ce soir ${parts[0]}h`;
      } else {
        return `tonight ${parts[0]}pm`;
      }
    }
    
    return timeStr.substring(0, 5);
  };

  const formatDuration = (startTime: string | null, endTime: string | null) => {
    if (!startTime || !endTime) return "—";
    const start = parseInt(startTime.split(":")[0]);
    const end = parseInt(endTime.split(":")[0]);
    const duration = end - start;
    return `${duration}h`;
  };

  return (
    <div className="rounded-lg bg-[#09090B] p-5 text-white">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold uppercase text-gray-400">
            {translations["home.feed.label.heading"] || "Annonces actives · Paris"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-[#84CC16] animate-pulse"></span>
          <span className="font-mono text-xs font-bold uppercase text-[#84CC16]">
            {translations["home.feed.label.live"] || "EN LIVE"}
          </span>
        </div>
      </div>

      {/* Jobs list */}
      {jobs.length > 0 ? (
        <div className="space-y-3">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/annonces/${job.id}`}
              className="block rounded-lg border border-gray-700 bg-gray-900 p-3 transition-colors hover:border-gray-600 hover:bg-gray-800"
            >
              {/* Role and time */}
              <div className="flex items-baseline justify-between">
                <span className="font-medium text-white">
                  {job.professions[0]?.name_fr || "Position"}
                </span>
                <span className="ml-2 text-xs text-gray-400">
                  {formatTime(job.work_date, job.start_time)}
                </span>
              </div>

              {/* Location and duration */}
              <div className="mt-1 text-xs text-gray-400">
                {job.cities?.name || "—"} · {formatDuration(job.start_time, job.end_time)}
              </div>

              {/* Salary */}
              <div className="mt-2 flex items-baseline justify-between">
                <span
                  className="font-mono text-sm font-bold"
                  style={{
                    color: job.hourly_rate ? "#FF3B30" : "#84CC16",
                  }}
                >
                  {formatSalary(
                    job.hourly_rate,
                    job.daily_rate,
                    job.flat_rate
                  )}
                </span>
              </div>

              {/* Call button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                }}
                className="mt-3 w-full rounded-full bg-[#FF3B30] py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
              >
                {translations["home.feed.callBtn"] || "Appeler"}
              </button>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-lg bg-gray-900 px-4 py-6 text-center">
          <p className="text-sm text-gray-400">
            {translations["home.feed.empty"] ||
              "Aucune annonce active pour l'instant. Soyez le premier à publier."}
          </p>
        </div>
      )}
    </div>
  );
}
