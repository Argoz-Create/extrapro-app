import { createClient } from "@/lib/supabase/server";
import type { JobAdWithRelations } from "@/lib/types/database";

export async function getActiveJobs(
  filters?: { profession_id?: string; city_id?: string },
  cursor?: string,
  limit = 20
): Promise<JobAdWithRelations[]> {
  const supabase = await createClient();
  let query = supabase
    .from("job_ads")
    .select("*, professions(name_fr, icon), cities(name)")
    .eq("status", "active")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (filters?.profession_id) query = query.eq("profession_id", filters.profession_id);
  if (filters?.city_id) query = query.eq("city_id", filters.city_id);
  if (cursor) query = query.lt("published_at", cursor);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as JobAdWithRelations[];
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
