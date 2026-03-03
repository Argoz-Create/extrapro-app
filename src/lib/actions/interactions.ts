"use server";

import { createClient } from "@/lib/supabase/server";

export async function logView(jobAdId: string) {
  const supabase = await createClient();
  await supabase.rpc("increment_ad_counter", {
    ad_id: jobAdId,
    counter_name: "view",
  });
}

export async function logCallClick(jobAdId: string) {
  const supabase = await createClient();
  await supabase.rpc("increment_ad_counter", {
    ad_id: jobAdId,
    counter_name: "call_click",
  });
}
