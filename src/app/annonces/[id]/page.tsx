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
    const professionNames = job.professions && job.professions.length > 0 
      ? job.professions.map(p => p.name_fr).join(", ")
      : "Extra";
    return {
      title: `${professionNames} a ${job.cities?.name ?? ""} — EXTRAPRO`,
      description: `${professionNames} a ${job.cities?.name ?? ""}${salary ? ` — ${salary}` : ""}. Trouvez sur EXTRAPRO.`,
    };
  } catch {
    return {
      title: "Annonce — EXTRAPRO",
    };
  }
}

// Build a Google-for-Jobs-compliant JobPosting JSON-LD payload from a job
// row. Returns null when required fields are missing so we never emit
// broken structured data (Google flags listings with malformed schema).
// Required by Google: title, datePosted, validThrough, hiringOrganization,
// jobLocation, description.
function buildJobPostingJsonLd(job: Awaited<ReturnType<typeof getJobById>>) {
  if (!job.published_at || !job.work_date) return null;

  const professionNames =
    job.professions && job.professions.length > 0
      ? job.professions.map((p) => p.name_fr).join(", ")
      : "Extra";
  const cityName = job.cities?.name ?? "";

  // validThrough = last day of the shift, end-of-day Paris time.
  const lastDay = job.work_end_date || job.work_date;
  const validThrough = `${lastDay}T23:59:00+02:00`;

  const hasSalary = job.hourly_rate != null || job.daily_rate != null;

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: `${professionNames}${cityName ? ` — ${cityName}` : ""}`,
    datePosted: job.published_at,
    validThrough,
    employmentType: "TEMPORARY",
    hiringOrganization: {
      "@type": "Organization",
      name: job.employers?.company_name || "EXTRAPRO",
      sameAs: "https://www.extra-pro.com",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: cityName,
        addressCountry: "FR",
      },
    },
    ...(hasSalary
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: "EUR",
            value: {
              "@type": "QuantitativeValue",
              value: job.hourly_rate ?? job.daily_rate,
              unitText: job.hourly_rate ? "HOUR" : "DAY",
            },
          },
        }
      : {}),
    description:
      job.description ||
      job.required_skill ||
      `${professionNames}${cityName ? ` à ${cityName}` : ""}`,
    directApply: false,
    applicantLocationRequirements: { "@type": "Country", name: "France" },
  };
}

export default async function JobDetail({ params }: JobDetailProps) {
  const { id } = await params;

  let job;
  try {
    job = await getJobById(id);
  } catch {
    notFound();
  }

  const jsonLd = buildJobPostingJsonLd(job);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />

      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <JobDetailContent job={job} />

      <Footer />

      {/* Track view (server-side counter + GA4 event) */}
      <ViewTracker
        jobAdId={job.id}
        profession={job.professions?.[0]?.name_fr ?? null}
        city={job.cities?.name ?? null}
        urgent={job.is_urgent ?? false}
      />
    </div>
  );
}
