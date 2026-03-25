import { Suspense } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { Footer } from "@/components/layout/footer";
import { SolidarityBanner } from "@/components/layout/solidarity-banner";
import { JobFilters } from "@/components/job/job-filters";
import { JobFeed } from "@/components/job/job-feed";
import { getActiveJobs } from "@/lib/queries/jobs";
import { getProfessions } from "@/lib/queries/professions";
import { getCities } from "@/lib/queries/cities";
import { getRegions } from "@/lib/queries/regions";
import { getDepartments } from "@/lib/queries/departments";
import type { JobAdWithRelations, Profession, City, Region, Department } from "@/lib/types/database";

type HomeProps = {
  searchParams: Promise<{
    profession?: string;
    city?: string;
    region?: string;
    department?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

  const filters = {
    profession_id: params.profession || undefined,
    city_id: params.city || undefined,
    region_id: params.region || undefined,
    department_id: params.department || undefined,
  };

  let jobs: JobAdWithRelations[] = [];
  let professions: Profession[] = [];
  let cities: City[] = [];
  let regions: Region[] = [];
  let departments: Department[] = [];

  try {
    [jobs, professions, cities, regions, departments] = await Promise.all([
      getActiveJobs(filters),
      getProfessions(),
      getCities(),
      getRegions(),
      getDepartments(),
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
            regions={regions}
            departments={departments}
            currentFilters={{
              profession: params.profession,
              city: params.city,
              region: params.region,
              department: params.department,
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
