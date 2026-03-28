import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getEmployerProfile } from "@/lib/queries/employers";
import { getProfessions } from "@/lib/queries/professions";
import { getCities } from "@/lib/queries/cities";
import { getJobForEdit } from "@/lib/queries/jobs";
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

  const [job, professions, cities] = await Promise.all([
    getJobForEdit(id, employer.id),
    getProfessions(),
    getCities(),
  ]);

  if (!job) {
    redirect("/dashboard");
  }

  const professionOptions = professions.map((p) => ({
    value: p.id,
    label: `${p.icon} ${p.name_fr}`,
  }));

  const cityOptions = cities.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  return (
    <div className="space-y-6">
      <EditAdHeader />
      <EditAdForm professions={professionOptions} cities={cityOptions} job={job} />
    </div>
  );
}
