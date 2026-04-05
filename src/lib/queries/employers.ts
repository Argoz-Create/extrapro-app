import { createClient } from "@/lib/supabase/server";
import type { Employer, JobAdWithRelations, EmployerStats } from "@/lib/types/database";

export async function getEmployerProfile(): Promise<Employer | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("employers")
    .select("*")
    .eq("auth_user_id", user.id)
    .single();

  return data as Employer | null;
}

export async function getEmployerStats(
  employerId: string
): Promise<EmployerStats> {
  const supabase = await createClient();

  // Get employer's total_hires and total_donations from the employer record
  const { data: employer } = await supabase
    .from("employers")
    .select("total_hires, total_donations")
    .eq("id", employerId)
    .single();

  // Count active ads
  const { count: activeAds } = await supabase
    .from("job_ads")
    .select("*", { count: "exact", head: true })
    .eq("employer_id", employerId)
    .eq("status", "active");

  // Sum view counts
  const { data: viewData } = await supabase
    .from("job_ads")
    .select("view_count")
    .eq("employer_id", employerId);

  const totalViews =
    viewData?.reduce((sum, ad) => sum + (ad.view_count || 0), 0) ?? 0;

  return {
    total_hires: employer?.total_hires ?? 0,
    total_donations: employer?.total_donations ?? 0,
    active_ads: activeAds ?? 0,
    total_views: totalViews,
  };
}

export async function getEmployerJobs(
  employerId: string
): Promise<{ jobs: JobAdWithRelations[]; newlyExpiredCount: number }> {
  const supabase = await createClient();

  // Auto-expire active jobs where work_date has passed and no hire was confirmed
  const today = new Date().toISOString().split("T")[0];
  const { data: expiredRows } = await supabase
    .from("job_ads")
    .update({ status: "expired" })
    .eq("employer_id", employerId)
    .eq("status", "active")
    .eq("hire_confirmed", false)
    .lt("work_date", today)
    .select("id");

  const newlyExpiredCount = expiredRows?.length ?? 0;

  const { data } = await supabase
    .from("job_ads")
    .select("*, professions(name_fr, icon), cities(name)")
    .eq("employer_id", employerId)
    .order("created_at", { ascending: false });

  return {
    jobs: (data ?? []) as unknown as JobAdWithRelations[],
    newlyExpiredCount,
  };
}

export async function getEmployerDonations(employerId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("donations")
    .select("*, job_ads(title)")
    .eq("employer_id", employerId)
    .order("created_at", { ascending: false })
    .limit(10);

  return data ?? [];
}
