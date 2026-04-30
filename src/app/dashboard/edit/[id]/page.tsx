import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getEmployerProfile } from "@/lib/queries/employers";
import { getProfessions } from "@/lib/queries/professions";
import { getCities } from "@/lib/queries/cities";
import { getJobForEdit, getJobById } from "@/lib/queries/jobs";
import { EditAdForm } from "@/components/dashboard/edit-ad-form";
import { EditAdHeader } from "@/components/dashboard/edit-ad-header";

export const metadata: Metadata = {
  title: "Modifier l'annonce — EXTRAPRO",
  description: "Modifiez votre annonce d'extra.",
};

type EditAdPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditAdPage({ params }: EditAdPageProps) {
  const { id } = await params;
  const employer = await getEmployerProfile();

  if (!employer) {
    redirect("/login");
  }

  const [job, professions, cities, jobWithRelations] = await Promise.all([
    getJobForEdit(id, employer.id),
    getProfessions(),
    getCities(),
    getJobById(id).catch(() => null),
  ]);

  if (!job) {
    redirect("/dashboard");
  }

  const cityOptions = cities.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  // Resolve city name for autocomplete display
  const cityName = job.city_id
    ? cities.find((c) => c.id === job.city_id)?.name ?? null
    : null;
  const jobWithCityName = {
    ...job,
    status: job.status as string,
    city_name: cityName,
  };

  // Get professions linked to this job
  const jobProfessions = jobWithRelations?.professions || [];

  return (
    <div className="space-y-6">
      <EditAdHeader />
      <EditAdForm
        professions={professions}
        cities={cityOptions}
        job={jobWithCityName}
        jobProfessions={jobProfessions}
      />
    </div>
  );
}
