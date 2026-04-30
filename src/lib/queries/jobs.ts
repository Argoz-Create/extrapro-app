import { createClient } from "@/lib/supabase/server";
import type { JobAdWithRelations } from "@/lib/types/database";

export type JobFilters = {
  profession_id?: string;
  city_id?: string;
  department_id?: string;
  region_id?: string;
};

// Helper to flatten the nested professions relation from the junction table.
// Exported so dashboard queries (employers.ts) can reuse the same shape.
export function flattenProfessions(rows: any[]): JobAdWithRelations[] {
  return rows.map((row) => {
    const professions = (row.professions || []).map((item: any) => item.profession);
    return {
      ...row,
      professions: professions.filter(Boolean),
    };
  });
}

export async function expireOldJobs(): Promise<void> {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  // Auto-expire active jobs where the LAST relevant day (end date, else start date)
  // has passed and no hire was confirmed. Single-day ads use work_date as the floor;
  // multi-day ads use work_end_date so they aren't expired mid-assignment.
  // Two passes since Supabase .or() + .update() doesn't compose cleanly.
  // 1) Multi-day ads: expire when work_end_date < today
  await supabase
    .from("job_ads")
    .update({ status: "expired" })
    .eq("status", "active")
    .eq("hire_confirmed", false)
    .not("work_end_date", "is", null)
    .lt("work_end_date", today);

  // 2) Single-day ads: expire when work_date < today AND work_end_date is null
  await supabase
    .from("job_ads")
    .update({ status: "expired" })
    .eq("status", "active")
    .eq("hire_confirmed", false)
    .is("work_end_date", null)
    .lt("work_date", today);
}

export async function getActiveJobs(
  filters?: JobFilters,
  cursor?: string,
  limit = 20
): Promise<JobAdWithRelations[]> {
  // Auto-expire old jobs before fetching (belt-and-braces alongside daily cron)
  await expireOldJobs();

  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];
  let query = supabase
    .from("job_ads")
    .select("*, professions:job_ad_professions(profession:professions(id, name_fr, icon, category)), cities(name, department_id, region_id), employers(company_name, contact_name)")
    .eq("status", "active")
    // Defensive filter in case cron lags: only show ads whose last relevant day
    // is today or later. Multi-day ads use end date; single-day use work_date.
    .or(`work_end_date.gte.${today},and(work_end_date.is.null,work_date.gte.${today})`)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (filters?.profession_id) {
    // Filter by profession via the junction table
    query = query.filter("job_ad_professions.profession_id", "eq", filters.profession_id);
  }
  if (filters?.city_id) query = query.eq("city_id", filters.city_id);
  if (cursor) query = query.lt("published_at", cursor);

  // For department/region filtering, we need to get matching city IDs first
  if (!filters?.city_id && (filters?.department_id || filters?.region_id)) {
    const cityQuery = supabase.from("cities").select("id");
    if (filters.department_id) {
      cityQuery.eq("department_id", filters.department_id);
    } else if (filters.region_id) {
      cityQuery.eq("region_id", filters.region_id);
    }
    const { data: cityData } = await cityQuery;
    if (cityData && cityData.length > 0) {
      const cityIds = cityData.map((c: { id: string }) => c.id);
      query = query.in("city_id", cityIds);
    } else {
      // No cities match — return empty
      return [];
    }
  }

  const { data, error } = await query;
  if (error) throw error;
  return flattenProfessions((data ?? []) as any[]);
}

export async function getActiveJobCount(): Promise<number> {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];
  const { count, error } = await supabase
    .from("job_ads")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")
    .or(`work_end_date.gte.${today},and(work_end_date.is.null,work_date.gte.${today})`);
  if (error) throw error;
  return count ?? 0;
}

export async function getJobForEdit(id: string, employerId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("job_ads")
    .select("*")
    .eq("id", id)
    .eq("employer_id", employerId)
    .single();
  if (error) return null;
  return data;
}

export async function getJobById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("job_ads")
    .select("*, professions:job_ad_professions(profession:professions(id, name_fr, icon, category)), cities(name), employers(company_name)")
    .eq("id", id)
    .single();
  if (error) throw error;
  const flattened = flattenProfessions([data as any])[0];
  return flattened as JobAdWithRelations & {
    employers: { company_name: string };
  };
}
