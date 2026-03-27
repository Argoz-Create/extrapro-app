import { createClient } from "@/lib/supabase/server";
import type { JobAdWithRelations } from "@/lib/types/database";

export type JobFilters = {
  profession_id?: string;
  city_id?: string;
  department_id?: string;
  region_id?: string;
};

export async function getActiveJobs(
  filters?: JobFilters,
  cursor?: string,
  limit = 20
): Promise<JobAdWithRelations[]> {
  const supabase = await createClient();
  let query = supabase
    .from("job_ads")
    .select("*, professions(name_fr, icon), cities(name, department_id, region_id)")
    .eq("status", "active")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (filters?.profession_id) query = query.eq("profession_id", filters.profession_id);
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
  return (data ?? []) as unknown as JobAdWithRelations[];
}

export async function getActiveJobCount(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("job_ads")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");
  if (error) throw error;
  return count ?? 0;
}

export async function getJobById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("job_ads")
    .select("*, professions(name_fr, icon), cities(name), employers(company_name)")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as unknown as JobAdWithRelations & {
    employers: { company_name: string };
  };
}
