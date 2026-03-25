import { createClient } from "@/lib/supabase/server";
import type { Region } from "@/lib/types/database";

export async function getRegions(): Promise<Region[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("regions")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Region[];
}
