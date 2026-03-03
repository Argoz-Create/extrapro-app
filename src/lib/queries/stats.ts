import { createClient } from "@/lib/supabase/server";
import type { PlatformStats } from "@/lib/types/database";

export async function getPlatformStats(): Promise<PlatformStats | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("platform_stats")
    .select("*")
    .limit(1)
    .single();
  if (error) throw error;
  return data as PlatformStats | null;
}
