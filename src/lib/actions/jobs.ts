"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAdSchema } from "@/lib/utils/validation";

type JobActionState = {
  error: string | null;
  fieldErrors?: Record<string, string>;
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
  const workEndDate = (formData.get("work_end_date") as string)?.trim();
  const raw = {
    profession_id: (formData.get("profession_id") as string) || "",
    city_id: (formData.get("city_id") as string) || "",
    new_city_name: (formData.get("new_city_name") as string)?.trim() || undefined,
    new_city_postal_code: (formData.get("new_city_postal_code") as string)?.trim() || undefined,
    work_date: (formData.get("work_date") as string) || "",
    work_end_date: workEndDate || undefined,
    start_time: (formData.get("start_time") as string) || "",
    end_time: (formData.get("end_time") as string) || "",
    salary: formData.get("salary") as string,
    salary_type: (formData.get("salary_type") as string) || "hourly",
    contact_phone: (formData.get("contact_phone") as string) || "",
    contact_name: (formData.get("contact_name") as string)?.trim() || undefined,
    contact_email: (formData.get("contact_email") as string)?.trim() || undefined,
    contact_whatsapp: (formData.get("contact_whatsapp") as string)?.trim() || undefined,
    required_skill: (formData.get("required_skill") as string)?.trim() || undefined,
    description: (formData.get("description") as string)?.trim() || undefined,
    is_urgent: formData.get("is_urgent") === "on",
  };

  // Validate
  const result = createAdSchema.safeParse(raw);

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0]?.toString();
      if (field && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    return { error: result.error.issues[0].message, fieldErrors };
  }

  const validated = result.data;

  // Handle "add new city" option
  let cityId = validated.city_id;
  if (cityId === "__new__" && validated.new_city_name) {
    // Check if city with this name already exists
    const { data: existingCity } = await supabase
      .from("cities")
      .select("id")
      .ilike("name", validated.new_city_name.trim())
      .maybeSingle();

    if (existingCity) {
      cityId = existingCity.id;
    } else {
      const { data: newCity, error: cityError } = await supabase
        .from("cities")
        .insert({
          name: validated.new_city_name.trim(),
          postal_code: validated.new_city_postal_code || "00000",
        })
        .select("id")
        .single();
      if (cityError || !newCity) {
        return { error: "Erreur lors de l'ajout de la nouvelle ville." };
      }
      cityId = newCity.id;
    }
  }

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
      .eq("id", cityId)
      .single(),
  ]);

  const title = `${profession?.name_fr ?? "Extra"} - ${city?.name ?? "Ville"}`;

  // Determine rate fields based on salary_type
  const hourly_rate = validated.salary_type === "hourly" ? validated.salary : null;
  const daily_rate = validated.salary_type === "daily" ? validated.salary : null;
  const flat_rate = validated.salary_type === "flat" ? validated.salary : null;

  // Insert job ad
  const { error } = await supabase.from("job_ads").insert({
    employer_id: employer.id,
    profession_id: validated.profession_id,
    city_id: cityId,
    title,
    description: validated.description || null,
    work_date: validated.work_date,
    work_end_date: validated.work_end_date || null,
    start_time: validated.start_time,
    end_time: validated.end_time,
    hourly_rate,
    daily_rate,
    flat_rate,
    contact_phone: validated.contact_phone,
    contact_name: validated.contact_name || null,
    contact_email: validated.contact_email || null,
    contact_whatsapp: validated.contact_whatsapp || null,
    required_skill: validated.required_skill || null,
    status: "active",
    is_urgent: validated.is_urgent,
    published_at: new Date().toISOString(),
  });

  if (error) {
    console.error("createJob insert error:", error);
    return { error: `Erreur: ${error.message}` };
  }

  revalidatePath("/dashboard", "layout");
  revalidatePath("/dashboard/new", "layout");
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function saveJobDraft(
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

  const { data: employer } = await supabase
    .from("employers")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (!employer) {
    return { error: "Profil employeur introuvable" };
  }

  const workEndDate = (formData.get("work_end_date") as string)?.trim();
  const salaryType = (formData.get("salary_type") as string) || "hourly";
  const salaryRaw = parseFloat((formData.get("salary") as string) || "0");
  const salary = isNaN(salaryRaw) || salaryRaw <= 0 ? null : salaryRaw;

  const hourly_rate = salaryType === "hourly" ? salary : null;
  const daily_rate = salaryType === "daily" ? salary : null;
  const flat_rate = salaryType === "flat" ? salary : null;

  let cityId = (formData.get("city_id") as string) || null;
  if (cityId === "__new__" || cityId === "") cityId = null;

  const professionId = (formData.get("profession_id") as string) || null;

  // Build a partial title
  let title = "Brouillon";
  if (professionId) {
    const { data: profession } = await supabase
      .from("professions")
      .select("name_fr")
      .eq("id", professionId)
      .single();
    if (profession) title = `${profession.name_fr} - Brouillon`;
  }

  const { error } = await supabase.from("job_ads").insert({
    employer_id: employer.id,
    profession_id: professionId,
    city_id: cityId,
    title,
    description: (formData.get("description") as string)?.trim() || null,
    work_date: (formData.get("work_date") as string) || null,
    work_end_date: workEndDate || null,
    start_time: (formData.get("start_time") as string) || null,
    end_time: (formData.get("end_time") as string) || null,
    hourly_rate,
    daily_rate,
    flat_rate,
    contact_phone: (formData.get("contact_phone") as string) || null,
    contact_name: (formData.get("contact_name") as string)?.trim() || null,
    contact_email: (formData.get("contact_email") as string)?.trim() || null,
    contact_whatsapp: (formData.get("contact_whatsapp") as string)?.trim() || null,
    required_skill: (formData.get("required_skill") as string)?.trim() || null,
    status: "draft",
    is_urgent: formData.get("is_urgent") === "on",
  });

  if (error) {
    console.error("saveJobDraft insert error:", error);
    return { error: `Erreur: ${error.message}` };
  }

  revalidatePath("/dashboard", "layout");
  redirect("/dashboard");
}

export async function updateJob(
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

  const jobId = formData.get("job_id") as string;
  if (!jobId) {
    return { error: "Annonce introuvable" };
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

  // Verify ownership
  const { data: existingJob } = await supabase
    .from("job_ads")
    .select("id, employer_id")
    .eq("id", jobId)
    .eq("employer_id", employer.id)
    .single();

  if (!existingJob) {
    return { error: "Annonce introuvable ou acces non autorise" };
  }

  // Extract form data
  const workEndDate = (formData.get("work_end_date") as string)?.trim();
  const raw = {
    profession_id: (formData.get("profession_id") as string) || "",
    city_id: (formData.get("city_id") as string) || "",
    new_city_name: (formData.get("new_city_name") as string)?.trim() || undefined,
    new_city_postal_code: (formData.get("new_city_postal_code") as string)?.trim() || undefined,
    work_date: (formData.get("work_date") as string) || "",
    work_end_date: workEndDate || undefined,
    start_time: (formData.get("start_time") as string) || "",
    end_time: (formData.get("end_time") as string) || "",
    salary: formData.get("salary") as string,
    salary_type: (formData.get("salary_type") as string) || "hourly",
    contact_phone: (formData.get("contact_phone") as string) || "",
    contact_name: (formData.get("contact_name") as string)?.trim() || undefined,
    contact_email: (formData.get("contact_email") as string)?.trim() || undefined,
    contact_whatsapp: (formData.get("contact_whatsapp") as string)?.trim() || undefined,
    required_skill: (formData.get("required_skill") as string)?.trim() || undefined,
    description: (formData.get("description") as string)?.trim() || undefined,
    is_urgent: formData.get("is_urgent") === "on",
  };

  // Validate
  const result = createAdSchema.safeParse(raw);

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0]?.toString();
      if (field && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    return { error: result.error.issues[0].message, fieldErrors };
  }

  const validated = result.data;

  // Handle "add new city" option
  let cityId = validated.city_id;
  if (cityId === "__new__" && validated.new_city_name) {
    // Check if city with this name already exists
    const { data: existingCity } = await supabase
      .from("cities")
      .select("id")
      .ilike("name", validated.new_city_name.trim())
      .maybeSingle();

    if (existingCity) {
      cityId = existingCity.id;
    } else {
      const { data: newCity, error: cityError } = await supabase
        .from("cities")
        .insert({
          name: validated.new_city_name.trim(),
          postal_code: validated.new_city_postal_code || "00000",
        })
        .select("id")
        .single();
      if (cityError || !newCity) {
        return { error: "Erreur lors de l'ajout de la nouvelle ville." };
      }
      cityId = newCity.id;
    }
  }

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
      .eq("id", cityId)
      .single(),
  ]);

  const title = `${profession?.name_fr ?? "Extra"} - ${city?.name ?? "Ville"}`;

  // Determine rate fields based on salary_type
  const hourly_rate = validated.salary_type === "hourly" ? validated.salary : null;
  const daily_rate = validated.salary_type === "daily" ? validated.salary : null;
  const flat_rate = validated.salary_type === "flat" ? validated.salary : null;

  // Update job ad
  const { error } = await supabase
    .from("job_ads")
    .update({
      profession_id: validated.profession_id,
      city_id: cityId,
      title,
      description: validated.description || null,
      work_date: validated.work_date,
      work_end_date: validated.work_end_date || null,
      start_time: validated.start_time,
      end_time: validated.end_time,
      hourly_rate,
      daily_rate,
      flat_rate,
      contact_phone: validated.contact_phone,
      contact_name: validated.contact_name || null,
      contact_email: validated.contact_email || null,
      contact_whatsapp: validated.contact_whatsapp || null,
      required_skill: validated.required_skill || null,
      is_urgent: validated.is_urgent,
    })
    .eq("id", jobId);

  if (error) {
    console.error("updateJob error:", error);
    return { error: `Erreur: ${error.message}` };
  }

  revalidatePath("/dashboard", "layout");
  revalidatePath("/dashboard/new", "layout");
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

/**
 * Publish a draft listing: runs the same validation as createJob/updateJob,
 * writes all fields, and flips status from 'draft' to 'active'. The
 * `set_published_at_on_activate` trigger fills `published_at` automatically.
 */
export async function publishJobDraft(
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

  const jobId = formData.get("job_id") as string;
  if (!jobId) {
    return { error: "Annonce introuvable" };
  }

  const { data: employer } = await supabase
    .from("employers")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (!employer) {
    return { error: "Profil employeur introuvable" };
  }

  const { data: existingJob } = await supabase
    .from("job_ads")
    .select("id, employer_id, status")
    .eq("id", jobId)
    .eq("employer_id", employer.id)
    .single();

  if (!existingJob) {
    return { error: "Annonce introuvable ou acces non autorise" };
  }

  // Only drafts can be published via this action.
  if (existingJob.status !== "draft") {
    return { error: "Seuls les brouillons peuvent etre publies" };
  }

  const workEndDate = (formData.get("work_end_date") as string)?.trim();
  const raw = {
    profession_id: (formData.get("profession_id") as string) || "",
    city_id: (formData.get("city_id") as string) || "",
    new_city_name: (formData.get("new_city_name") as string)?.trim() || undefined,
    new_city_postal_code: (formData.get("new_city_postal_code") as string)?.trim() || undefined,
    work_date: (formData.get("work_date") as string) || "",
    work_end_date: workEndDate || undefined,
    start_time: (formData.get("start_time") as string) || "",
    end_time: (formData.get("end_time") as string) || "",
    salary: formData.get("salary") as string,
    salary_type: (formData.get("salary_type") as string) || "hourly",
    contact_phone: (formData.get("contact_phone") as string) || "",
    contact_name: (formData.get("contact_name") as string)?.trim() || undefined,
    contact_email: (formData.get("contact_email") as string)?.trim() || undefined,
    contact_whatsapp: (formData.get("contact_whatsapp") as string)?.trim() || undefined,
    required_skill: (formData.get("required_skill") as string)?.trim() || undefined,
    description: (formData.get("description") as string)?.trim() || undefined,
    is_urgent: formData.get("is_urgent") === "on",
  };

  const result = createAdSchema.safeParse(raw);
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0]?.toString();
      if (field && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    return { error: result.error.issues[0].message, fieldErrors };
  }

  const validated = result.data;

  // Handle "add new city" option (same flow as createJob)
  let cityId = validated.city_id;
  if (cityId === "__new__" && validated.new_city_name) {
    const { data: existingCity } = await supabase
      .from("cities")
      .select("id")
      .ilike("name", validated.new_city_name.trim())
      .maybeSingle();

    if (existingCity) {
      cityId = existingCity.id;
    } else {
      const { data: newCity, error: cityError } = await supabase
        .from("cities")
        .insert({
          name: validated.new_city_name.trim(),
          postal_code: validated.new_city_postal_code || "00000",
        })
        .select("id")
        .single();
      if (cityError || !newCity) {
        return { error: "Erreur lors de l'ajout de la nouvelle ville." };
      }
      cityId = newCity.id;
    }
  }

  const [{ data: profession }, { data: city }] = await Promise.all([
    supabase
      .from("professions")
      .select("name_fr")
      .eq("id", validated.profession_id)
      .single(),
    supabase
      .from("cities")
      .select("name")
      .eq("id", cityId)
      .single(),
  ]);

  const title = `${profession?.name_fr ?? "Extra"} - ${city?.name ?? "Ville"}`;

  const hourly_rate = validated.salary_type === "hourly" ? validated.salary : null;
  const daily_rate = validated.salary_type === "daily" ? validated.salary : null;
  const flat_rate = validated.salary_type === "flat" ? validated.salary : null;

  const { error } = await supabase
    .from("job_ads")
    .update({
      profession_id: validated.profession_id,
      city_id: cityId,
      title,
      description: validated.description || null,
      work_date: validated.work_date,
      work_end_date: validated.work_end_date || null,
      start_time: validated.start_time,
      end_time: validated.end_time,
      hourly_rate,
      daily_rate,
      flat_rate,
      contact_phone: validated.contact_phone,
      contact_name: validated.contact_name || null,
      contact_email: validated.contact_email || null,
      contact_whatsapp: validated.contact_whatsapp || null,
      required_skill: validated.required_skill || null,
      is_urgent: validated.is_urgent,
      status: "active",
    })
    .eq("id", jobId);

  if (error) {
    console.error("publishJobDraft error:", error);
    return { error: `Erreur: ${error.message}` };
  }

  revalidatePath("/dashboard", "layout");
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function toggleJobStatus(
  jobAdId: string,
  newStatus: "active" | "inactive"
) {
  const supabase = await createClient();

  const updateData: Record<string, unknown> = { status: newStatus };
  // Set published_at when activating for the first time
  if (newStatus === "active") {
    const { data: job } = await supabase
      .from("job_ads")
      .select("published_at")
      .eq("id", jobAdId)
      .single();
    if (job && !job.published_at) {
      updateData.published_at = new Date().toISOString();
    }
  }

  const { error } = await supabase
    .from("job_ads")
    .update(updateData)
    .eq("id", jobAdId);

  if (error) throw error;

  revalidatePath("/dashboard", "layout");
  revalidatePath("/", "layout");
}

export async function relistJob(jobAdId: string): Promise<{ error: string | null; newJobId?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Non authentifie" };
  }

  const { data: employer } = await supabase
    .from("employers")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (!employer) {
    return { error: "Profil employeur introuvable" };
  }

  // Fetch the expired job
  const { data: oldJob } = await supabase
    .from("job_ads")
    .select("*")
    .eq("id", jobAdId)
    .eq("employer_id", employer.id)
    .single();

  if (!oldJob) {
    return { error: "Annonce introuvable ou acces non autorise" };
  }

  // Create a new draft copy with cleared dates and reset stats
  const { data: newJob, error } = await supabase
    .from("job_ads")
    .insert({
      employer_id: employer.id,
      profession_id: oldJob.profession_id,
      city_id: oldJob.city_id,
      title: oldJob.title,
      description: oldJob.description,
      work_date: null,
      work_end_date: null,
      start_time: oldJob.start_time,
      end_time: oldJob.end_time,
      hourly_rate: oldJob.hourly_rate,
      daily_rate: oldJob.daily_rate,
      flat_rate: oldJob.flat_rate,
      contact_phone: oldJob.contact_phone,
      contact_name: oldJob.contact_name,
      contact_email: oldJob.contact_email,
      contact_whatsapp: oldJob.contact_whatsapp,
      required_skill: oldJob.required_skill,
      is_urgent: oldJob.is_urgent,
      status: "draft",
      view_count: 0,
      call_click_count: 0,
      hire_confirmed: false,
      donation_generated: false,
    })
    .select("id")
    .single();

  if (error || !newJob) {
    console.error("relistJob error:", error);
    return { error: "Erreur lors de la re-publication." };
  }

  revalidatePath("/dashboard", "layout");
  redirect(`/dashboard/edit/${newJob.id}`);
}

export async function confirmHire(jobAdId: string): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("job_ads")
    .update({ hire_confirmed: true, status: "filled" })
    .eq("id", jobAdId);

  if (error) {
    return { error: "Erreur lors de la confirmation. Veuillez reessayer." };
  }

  revalidatePath("/dashboard", "layout");
  revalidatePath("/", "layout");
  return { error: null };
}
