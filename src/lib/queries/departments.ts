import { createClient } from "@/lib/supabase/server";
import type { Department } from "@/lib/types/database";

export async function getDepartments(regionId?: string): Promise<Department[]> {
  const supabase = await createClient();
  let query = supabase
    .from("departments")
    .select("*")
    .order("name", { ascending: true });

  if (regionId) {
    query = query.eq("region_id", regionId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Department[];
}
