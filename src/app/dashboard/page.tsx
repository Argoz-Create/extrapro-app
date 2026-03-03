import { redirect } from "next/navigation";
import type { Metadata } from "next";
import {
  getEmployerProfile,
  getEmployerStats,
  getEmployerJobs,
} from "@/lib/queries/employers";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export const metadata: Metadata = {
  title: "Tableau de bord — EXTRAPRO",
  description: "Gerez vos annonces et suivez vos recrutements solidaires.",
};

export default async function DashboardPage() {
  const employer = await getEmployerProfile();

  if (!employer) {
    redirect("/login");
  }

  const [stats, jobs] = await Promise.all([
    getEmployerStats(employer.id),
    getEmployerJobs(employer.id),
  ]);

  return (
    <DashboardContent
      companyName={employer.company_name}
      stats={stats}
      jobs={jobs}
    />
  );
}
