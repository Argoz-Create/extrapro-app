import { createClient } from "@/lib/supabase/server";
import type { City } from "@/lib/types/database";

export async function getCities(filters?: {
  region_id?: string;
  department_id?: string;
}): Promise<City[]> {
  const supabase = await createClient();
  let query = supabase
    .from("cities")
    .select("*")
    .order("name", { ascending: true });

  if (filters?.department_id) {
    query = query.eq("department_id", filters.department_id);
  } else if (filters?.region_id) {
    query = query.eq("region_id", filters.region_id);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as City[];
}
