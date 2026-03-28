import { createClient } from "@/lib/supabase/server";
import type { Profession } from "@/lib/types/database";

export async function getProfessions(): Promise<Profession[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("professions")
    .select("*")
    .eq("is_active", true)
    .order("name_fr", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Profession[];
}
