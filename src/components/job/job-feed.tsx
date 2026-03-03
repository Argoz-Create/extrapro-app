"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { JobCard } from "@/components/job/job-card";
import { useTranslation } from "@/lib/i18n/context";
import type { JobAdWithRelations } from "@/lib/types/database";

type JobFeedProps = {
  initialJobs: JobAdWithRelations[];
  filters: { profession_id?: string; city_id?: string };
};

export function JobFeed({ initialJobs, filters }: JobFeedProps) {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState(initialJobs);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialJobs.length >= 20);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Reset when initialJobs change (i.e. filters changed via server)
  useEffect(() => {
    setJobs(initialJobs);
    setHasMore(initialJobs.length >= 20);
  }, [initialJobs]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore || jobs.length === 0) return;
    setLoading(true);

    try {
      const lastJob = jobs[jobs.length - 1];
      const supabase = createClient();
      let query = supabase
        .from("job_ads")
        .select("*, professions(name_fr, icon), cities(name)")
        .eq("status", "active")
        .order("published_at", { ascending: false })
        .lt("published_at", lastJob.published_at)
        .limit(20);

      if (filters.profession_id) query = query.eq("profession_id", filters.profession_id);
      if (filters.city_id) query = query.eq("city_id", filters.city_id);

      const { data, error } = await query;
      if (error) throw error;

      const newJobs = (data ?? []) as unknown as JobAdWithRelations[];
      if (newJobs.length < 20) setHasMore(false);
      setJobs((prev) => [...prev, ...newJobs]);
    } catch {
      // Silently fail on load-more errors
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, jobs, filters]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  if (jobs.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg text-text-secondary">{t("job.noJobs")}</p>
        <p className="mt-1 text-sm text-text-tertiary">
          {t("job.noJobsSub")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}

      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} className="h-1" />

      {loading && (
        <div className="flex justify-center py-4">
          <svg
            className="h-6 w-6 animate-spin text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
