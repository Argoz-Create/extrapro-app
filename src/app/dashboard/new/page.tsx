import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getEmployerProfile } from "@/lib/queries/employers";
import { getProfessions } from "@/lib/queries/professions";
import { getCities } from "@/lib/queries/cities";
import { CreateAdForm } from "@/components/dashboard/create-ad-form";
import { NewAdHeader } from "@/components/dashboard/new-ad-header";

export const metadata: Metadata = {
  title: "Nouvelle annonce — EXTRAPRO",
  description: "Publiez une nouvelle annonce d'extra en restauration.",
};

export default async function NewAdPage() {
  const employer = await getEmployerProfile();

  if (!employer) {
    redirect("/login");
  }

  const [professions, cities] = await Promise.all([
    getProfessions(),
    getCities(),
  ]);

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
      {/* Header */}
      <NewAdHeader />

      {/* Form */}
      <CreateAdForm professions={professionOptions} cities={cityOptions} />
    </div>
  );
}
