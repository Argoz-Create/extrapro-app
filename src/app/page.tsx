import { Suspense } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { Footer } from "@/components/layout/footer";
import { SolidarityBanner } from "@/components/layout/solidarity-banner";
import { JobFilters } from "@/components/job/job-filters";
import { JobFeed } from "@/components/job/job-feed";
import { getActiveJobs } from "@/lib/queries/jobs";
import { getProfessions } from "@/lib/queries/professions";
import { getCities } from "@/lib/queries/cities";
import type { JobAdWithRelations, Profession, City } from "@/lib/types/database";

type HomeProps = {
  searchParams: Promise<{ profession?: string; city?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

  const filters = {
    profession_id: params.profession || undefined,
    city_id: params.city || undefined,
  };

  let jobs: JobAdWithRelations[] = [];
  let professions: Profession[] = [];
  let cities: City[] = [];

  try {
    [jobs, professions, cities] = await Promise.all([
      getActiveJobs(filters),
      getProfessions(),
      getCities(),
    ]);
  } catch {
    // Supabase not configured or unreachable — render with empty data
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <SolidarityBanner />

      <main className="mx-auto max-w-lg px-4 py-4">
        {/* Filters */}
        <Suspense fallback={null}>
          <JobFilters
            professions={professions}
            cities={cities}
            currentFilters={{
              profession: params.profession,
              city: params.city,
            }}
          />
        </Suspense>

        {/* Job feed */}
        <div className="mt-4">
          <JobFeed initialJobs={jobs} filters={filters} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
