"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAdSchema } from "@/lib/utils/validation";

type JobActionState = {
  error: string | null;
  fieldErrors?: Record<string, string>;
};

// Helper to normalize custom profession text for deduplication
function normalizeCustomProfession(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

// Upsert a custom profession suggestion to the database
async function upsertProfessionSuggestion(
  supabase: any,
  displayText: string
): Promise<void> {
  const normalized = normalizeCustomProfession(displayText);
  
  try {
    // Try to find existing suggestion
    const { data: existing } = await supabase
      .from("profession_suggestions")
      .select("id, name_display, use_count")
      .eq("name_normalized", normalized)
      .maybeSingle();

    if (existing) {
      // Update existing: increment use_count, update last_seen_at and name_display if longer
      const longerDisplay =
        displayText.length > existing.name_display.length
          ? displayText
          : existing.name_display;
      await supabase
        .from("profession_suggestions")
        .update({
          use_count: existing.use_count + 1,
          last_seen_at: new Date().toISOString(),
          name_display: longerDisplay,
          updated_at: new Date().toISOString(),
        })
        .eq("name_normalized", normalized);
    } else {
      // Insert new
      await supabase.from("profession_suggestions").insert({
        name_normalized: normalized,
        name_display: displayText,
        use_count: 1,
      });
    }
  } catch (err) {
    // Best-effort — don't fail the ad creation if suggestion capture fails
    console.error("Error upserting profession suggestion:", err);
  }
}

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

  // Extract form data — profession_ids are sent as repeated form values
  const profession_ids = formData.getAll("profession_id") as string[];
  const customProfession = ((formData.get("custom_profession") as string) || "").trim();
  const workEndDate = (formData.get("work_end_date") as string)?.trim();
  
  const raw = {
    profession_ids: profession_ids.filter(Boolean),
    custom_profession: customProfession || undefined,
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

  // Get profession names for title generation (use first profession if multiple)
  let titleProfession = "Extra";
  if (validated.profession_ids.length > 0) {
    const { data: profession } = await supabase
      .from("professions")
      .select("name_fr")
      .eq("id", validated.profession_ids[0])
      .single();
    if (profession) titleProfession = profession.name_fr;
  } else if (validated.custom_profession) {
    titleProfession = validated.custom_profession;
  }

  const { data: city } = await supabase
    .from("cities")
    .select("name")
    .eq("id", cityId)
    .single();

  const title = `${titleProfession} - ${city?.name ?? "Ville"}`;

  // Determine rate fields based on salary_type
  const hourly_rate = validated.salary_type === "hourly" ? validated.salary : null;
  const daily_rate = validated.salary_type === "daily" ? validated.salary : null;
  const flat_rate = validated.salary_type === "flat" ? validated.salary : null;

  // Insert job ad
  const { data: jobAd, error: insertErr } = await supabase
    .from("job_ads")
    .insert({
      employer_id: employer.id,
      profession_id: validated.profession_ids[0] ?? null, // For legacy compat
      city_id: cityId,
      title,
      description: validated.description || null,
      custom_profession: validated.custom_profession || null,
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
    })
    .select("id")
    .single();

  if (insertErr || !jobAd) {
    console.error("createJob insert error:", insertErr);
    return { error: `Erreur: ${insertErr?.message || "Unknown error"}` };
  }

  // Insert junction table entries for all selected professions
  if (validated.profession_ids.length > 0) {
    const links = validated.profession_ids.map((profession_id) => ({
      job_ad_id: jobAd.id,
      profession_id,
    }));
    const { error: linkErr } = await supabase.from("job_ad_professions").insert(links);
    if (linkErr) {
      // Best-effort cleanup
      await supabase.from("job_ads").delete().eq("id", jobAd.id);
      console.error("createJob junction insert error:", linkErr);
      return { error: "Erreur liaison des métiers" };
    }
  }

  // Capture custom profession suggestion
  if (validated.custom_profession) {
    await upsertProfessionSuggestion(supabase, validated.custom_profession);
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

  const profession_ids = (formData.getAll("profession_id") as string[]).filter(Boolean);
  const customProfession = ((formData.get("custom_profession") as string) || "").trim();

  // Build a partial title
  let title = "Brouillon";
  if (profession_ids.length > 0) {
    const { data: profession } = await supabase
      .from("professions")
      .select("name_fr")
      .eq("id", profession_ids[0])
      .single();
    if (profession) title = `${profession.name_fr} - Brouillon`;
  } else if (customProfession) {
    title = `${customProfession} - Brouillon`;
  }

  const { data: newJob, error } = await supabase
    .from("job_ads")
    .insert({
      employer_id: employer.id,
      profession_id: profession_ids[0] ?? null,
      city_id: cityId,
      title,
      description: (formData.get("description") as string)?.trim() || null,
      custom_profession: customProfession || null,
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
    })
    .select("id")
    .single();

  if (error || !newJob) {
    console.error("saveJobDraft insert error:", error);
    return { error: `Erreur: ${error?.message || "Unknown error"}` };
  }

  // Insert junction entries for draft (even though drafts are incomplete, we capture what's there)
  if (profession_ids.length > 0) {
    const links = profession_ids.map((profession_id) => ({
      job_ad_id: newJob.id,
      profession_id,
    }));
    await supabase.from("job_ad_professions").insert(links);
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
  const profession_ids = (formData.getAll("profession_id") as string[]).filter(Boolean);
  const customProfession = ((formData.get("custom_profession") as string) || "").trim();
  const workEndDate = (formData.get("work_end_date") as string)?.trim();
  
  const raw = {
    profession_ids,
    custom_profession: customProfession || undefined,
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

  // Get profession names for title generation
  let titleProfession = "Extra";
  if (validated.profession_ids.length > 0) {
    const { data: profession } = await supabase
      .from("professions")
      .select("name_fr")
      .eq("id", validated.profession_ids[0])
      .single();
    if (profession) titleProfession = profession.name_fr;
  } else if (validated.custom_profession) {
    titleProfession = validated.custom_profession;
  }

  const { data: city } = await supabase
    .from("cities")
    .select("name")
    .eq("id", cityId)
    .single();

  const title = `${titleProfession} - ${city?.name ?? "Ville"}`;

  // Determine rate fields based on salary_type
  const hourly_rate = validated.salary_type === "hourly" ? validated.salary : null;
  const daily_rate = validated.salary_type === "daily" ? validated.salary : null;
  const flat_rate = validated.salary_type === "flat" ? validated.salary : null;

  // Update job ad
  const { error } = await supabase
    .from("job_ads")
    .update({
      profession_id: validated.profession_ids[0] ?? null,
      city_id: cityId,
      title,
      description: validated.description || null,
      custom_profession: validated.custom_profession || null,
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

  // Update junction table: delete old entries and insert new ones
  await supabase.from("job_ad_professions").delete().eq("job_ad_id", jobId);
  if (validated.profession_ids.length > 0) {
    const links = validated.profession_ids.map((profession_id) => ({
      job_ad_id: jobId,
      profession_id,
    }));
    await supabase.from("job_ad_professions").insert(links);
  }

  // Capture custom profession suggestion
  if (validated.custom_profession) {
    await upsertProfessionSuggestion(supabase, validated.custom_profession);
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

  const profession_ids = (formData.getAll("profession_id") as string[]).filter(Boolean);
  const customProfession = ((formData.get("custom_profession") as string) || "").trim();
  const workEndDate = (formData.get("work_end_date") as string)?.trim();
  
  const raw = {
    profession_ids,
    custom_profession: customProfession || undefined,
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

  let titleProfession = "Extra";
  if (validated.profession_ids.length > 0) {
    const { data: profession } = await supabase
      .from("professions")
      .select("name_fr")
      .eq("id", validated.profession_ids[0])
      .single();
    if (profession) titleProfession = profession.name_fr;
  } else if (validated.custom_profession) {
    titleProfession = validated.custom_profession;
  }

  const { data: city } = await supabase
    .from("cities")
    .select("name")
    .eq("id", cityId)
    .single();

  const title = `${titleProfession} - ${city?.name ?? "Ville"}`;

  const hourly_rate = validated.salary_type === "hourly" ? validated.salary : null;
  const daily_rate = validated.salary_type === "daily" ? validated.salary : null;
  const flat_rate = validated.salary_type === "flat" ? validated.salary : null;

  const { error } = await supabase
    .from("job_ads")
    .update({
      profession_id: validated.profession_ids[0] ?? null,
      city_id: cityId,
      title,
      description: validated.description || null,
      custom_profession: validated.custom_profession || null,
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

  // Update junction table
  await supabase.from("job_ad_professions").delete().eq("job_ad_id", jobId);
  if (validated.profession_ids.length > 0) {
    const links = validated.profession_ids.map((profession_id) => ({
      job_ad_id: jobId,
      profession_id,
    }));
    await supabase.from("job_ad_professions").insert(links);
  }

  // Capture custom profession suggestion
  if (validated.custom_profession) {
    await upsertProfessionSuggestion(supabase, validated.custom_profession);
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

  // Fetch the professions linked to this ad (for copying)
  const { data: linkedProfessions } = await supabase
    .from("job_ad_professions")
    .select("profession_id")
    .eq("job_ad_id", jobAdId);

  // Create a new draft copy with cleared dates and reset stats
  const { data: newJob, error } = await supabase
    .from("job_ads")
    .insert({
      employer_id: employer.id,
      profession_id: oldJob.profession_id,
      city_id: oldJob.city_id,
      title: oldJob.title,
      description: oldJob.description,
      custom_profession: oldJob.custom_profession,
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

  // Copy profession links from old ad to new draft
  if (linkedProfessions && linkedProfessions.length > 0) {
    const links = linkedProfessions.map((item) => ({
      job_ad_id: newJob.id,
      profession_id: item.profession_id,
    }));
    await supabase.from("job_ad_professions").insert(links);
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
