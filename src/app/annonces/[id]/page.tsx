import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TopBar } from "@/components/layout/top-bar";
import { Footer } from "@/components/layout/footer";
import { ViewTracker } from "@/components/job/view-tracker";
import { JobDetailContent } from "@/components/job/job-detail-content";
import { getJobById } from "@/lib/queries/jobs";
import { formatSalary } from "@/lib/utils/format";

type JobDetailProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: JobDetailProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const job = await getJobById(id);
    const salary = formatSalary(job.hourly_rate, job.daily_rate);
    return {
      title: `${job.professions?.name_fr ?? "Extra"} a ${job.cities?.name ?? ""} — EXTRAPRO`,
      description: `${job.professions?.name_fr ?? "Extra"} a ${job.cities?.name ?? ""}${salary ? ` — ${salary}` : ""}. Trouvez sur EXTRAPRO.`,
    };
  } catch {
    return {
      title: "Annonce — EXTRAPRO",
    };
  }
}

export default async function JobDetail({ params }: JobDetailProps) {
  const { id } = await params;

  let job;
  try {
    job = await getJobById(id);
  } catch {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />

      <JobDetailContent job={job} />

      <Footer />

      {/* Track view */}
      <ViewTracker jobAdId={job.id} />
    </div>
  );
}
