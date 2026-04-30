import { createClient } from "@/lib/supabase/server";
import type { Employer, JobAdWithRelations, EmployerStats } from "@/lib/types/database";
import { flattenProfessions } from "./jobs";

export async function getEmployerProfile(): Promise<Employer | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("employers")
    .select("*")
    .eq("auth_user_id", user.id)
    .single();

  return data as Employer | null;
}

export async function getEmployerStats(
  employerId: string
): Promise<EmployerStats> {
  const supabase = await createClient();

  // Get employer's total_hires from the employer record
  const { data: employer } = await supabase
    .from("employers")
    .select("total_hires")
    .eq("id", employerId)
    .single();

  // Count active ads
  const { count: activeAds } = await supabase
    .from("job_ads")
    .select("*", { count: "exact", head: true })
    .eq("employer_id", employerId)
    .eq("status", "active");

  // Sum view counts
  const { data: viewData } = await supabase
    .from("job_ads")
    .select("view_count")
    .eq("employer_id", employerId);

  const totalViews =
    viewData?.reduce((sum, ad) => sum + (ad.view_count || 0), 0) ?? 0;

  return {
    total_hires: employer?.total_hires ?? 0,
    active_ads: activeAds ?? 0,
    total_views: totalViews,
  };
}

export async function getEmployerJobs(
  employerId: string
): Promise<{ jobs: JobAdWithRelations[]; newlyExpiredCount: number }> {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  // Auto-expire active jobs whose last relevant day has passed and no hire was
  // confirmed. Two passes — multi-day ads use work_end_date; single-day ads
  // (where work_end_date IS NULL) use work_date. This mirrors the public-feed
  // logic in expireOldJobs() and prevents prematurely expiring multi-day ads
  // mid-assignment.
  const { data: expiredMulti } = await supabase
    .from("job_ads")
    .update({ status: "expired" })
    .eq("employer_id", employerId)
    .eq("status", "active")
    .eq("hire_confirmed", false)
    .not("work_end_date", "is", null)
    .lt("work_end_date", today)
    .select("id");

  const { data: expiredSingle } = await supabase
    .from("job_ads")
    .update({ status: "expired" })
    .eq("employer_id", employerId)
    .eq("status", "active")
    .eq("hire_confirmed", false)
    .is("work_end_date", null)
    .lt("work_date", today)
    .select("id");

  const newlyExpiredCount =
    (expiredMulti?.length ?? 0) + (expiredSingle?.length ?? 0);

  // Fetch the employer's full job list. Use the junction table for professions
  // so the result matches the public feed shape (`professions: Profession[]`).
  // Embedding `professions(...)` directly is now AMBIGUOUS — there are two
  // valid paths: the legacy `job_ads.profession_id` FK and the new junction
  // table. Going through the junction is the correct shape going forward.
  const { data, error } = await supabase
    .from("job_ads")
    .select(
      "*, professions:job_ad_professions(profession:professions(id, name_fr, icon, category)), cities(name)"
    )
    .eq("employer_id", employerId)
    .order("created_at", { ascending: false });

  if (error) {
    // Surface the error in the server logs instead of silently returning [].
    // Previously this query silently failed on PostgREST's ambiguous-relationship
    // error and the dashboard list went blank — see fix branch
    // fix/dashboard-employer-jobs-junction.
    console.error("[getEmployerJobs] supabase error:", error);
    throw error;
  }

  return {
    jobs: flattenProfessions((data ?? []) as unknown as Record<string, unknown>[]),
    newlyExpiredCount,
  };
}

