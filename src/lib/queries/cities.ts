import { createClient } from "@/lib/supabase/server";
import type { City } from "@/lib/types/database";

export async function getCities(): Promise<City[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cities")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as City[];
}
