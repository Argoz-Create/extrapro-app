import { Suspense } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/layout/hero-section";
import { JobFilters } from "@/components/job/job-filters";
import { JobFeed } from "@/components/job/job-feed";
import { ListingsHeader } from "@/components/job/listings-header";
import { OurMission } from "@/components/layout/our-mission";
import { getActiveJobs, getActiveJobCount } from "@/lib/queries/jobs";
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
  let totalCount = 0;

  try {
    [jobs, professions, cities, regions, departments, totalCount] = await Promise.all([
      getActiveJobs(filters),
      getProfessions(),
      getCities(),
      getRegions(),
      getDepartments(),
      getActiveJobCount(),
    ]);
  } catch {
    // Supabase not configured or unreachable — render with empty data
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <HeroSection jobCount={totalCount} />
      <OurMission />

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

        {/* Listings header */}
        <ListingsHeader count={jobs.length} />

        {/* Job feed */}
        <div className="mt-2">
          <JobFeed initialJobs={jobs} filters={filters} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
