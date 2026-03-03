"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAdSchema } from "@/lib/utils/validation";

type JobActionState = {
  error: string | null;
};

export async function createJob(
  prevState: JobActionState,
  formData: FormData
): Promise<JobActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Non authentifie" };
  }

  // Get employer
  const { data: employer } = await supabase
    .from("employers")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (!employer) {
    return { error: "Profil employeur introuvable" };
  }

  // Extract form data
  const raw = {
    profession_id: formData.get("profession_id") as string,
    city_id: formData.get("city_id") as string,
    work_date: formData.get("work_date") as string,
    start_time: formData.get("start_time") as string,
    end_time: formData.get("end_time") as string,
    salary: formData.get("salary") as string,
    salary_type: formData.get("salary_type") as string,
    contact_phone: formData.get("contact_phone") as string,
    contact_name: (formData.get("contact_name") as string) || undefined,
    description: (formData.get("description") as string) || undefined,
    is_urgent: formData.get("is_urgent") === "on",
  };

  // Validate
  const result = createAdSchema.safeParse(raw);

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const validated = result.data;

  // Get profession name and city name for auto-generated title
  const [{ data: profession }, { data: city }] = await Promise.all([
    supabase
      .from("professions")
      .select("name_fr")
      .eq("id", validated.profession_id)
      .single(),
    supabase
      .from("cities")
      .select("name")
      .eq("id", validated.city_id)
      .single(),
  ]);

  const title = `${profession?.name_fr ?? "Extra"} - ${city?.name ?? "Ville"}`;

  // Determine rate fields based on salary_type
  const hourly_rate = validated.salary_type === "hourly" ? validated.salary : null;
  const daily_rate = validated.salary_type === "daily" ? validated.salary : null;

  // Insert job ad
  const { error } = await supabase.from("job_ads").insert({
    employer_id: employer.id,
    profession_id: validated.profession_id,
    city_id: validated.city_id,
    title,
    description: validated.description || null,
    work_date: validated.work_date,
    start_time: validated.start_time,
    end_time: validated.end_time,
    hourly_rate,
    daily_rate,
    contact_phone: validated.contact_phone,
    contact_name: validated.contact_name || null,
    status: "active",
    is_urgent: validated.is_urgent,
  });

  if (error) {
    return { error: "Erreur lors de la publication. Veuillez reessayer." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/");
  redirect("/dashboard");
}

export async function toggleJobStatus(
  jobAdId: string,
  newStatus: "active" | "inactive"
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("job_ads")
    .update({ status: newStatus })
    .eq("id", jobAdId);

  if (error) throw error;

  revalidatePath("/dashboard");
  revalidatePath("/");
}

export async function confirmHire(jobAdId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("job_ads")
    .update({ hire_confirmed: true, status: "filled" })
    .eq("id", jobAdId);

  if (error) throw error;

  // The DB trigger generate_donation_on_hire handles donation creation
  revalidatePath("/dashboard");
  revalidatePath("/");
}
