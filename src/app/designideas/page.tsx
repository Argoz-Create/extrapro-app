import { Suspense } from "react";
import type { Metadata } from "next";
import { TopBar } from "@/components/layout/top-bar";
import { Footer } from "@/components/layout/footer";
import { JobFilters } from "@/components/job/job-filters";
import { JobFeed } from "@/components/job/job-feed";
import { ListingsHeader } from "@/components/job/listings-header";
import { HeroLive } from "@/components/home/hero-live";
import { PricingStrip } from "@/components/home/pricing-strip";
import { HowItWorks } from "@/components/home/how-it-works";
import { AssociationsBand } from "@/components/home/associations-band";
import { getActiveJobs } from "@/lib/queries/jobs";
import { getProfessions } from "@/lib/queries/professions";
import { getCities } from "@/lib/queries/cities";
import { getRegions } from "@/lib/queries/regions";
import { getDepartments } from "@/lib/queries/departments";
import type { JobAdWithRelations, Profession, City, Region, Department } from "@/lib/types/database";

// Design preview / showcase route. Renders the alternative Direction B
// homepage (coral palette, Live hero, pricing strip, how-it-works,
// associations band) kept for reference. Not the live production design —
// the main route at `/` is the original green/simple design.
export const metadata: Metadata = {
  title: "Design preview — EXTRAPRO",
  description: "Alternative homepage design preview.",
  robots: { index: false, follow: false },
};

type DesignIdeasProps = {
  searchParams: Promise<{
    profession?: string;
    city?: string;
    region?: string;
    department?: string;
  }>;
};

export default async function DesignIdeas({ searchParams }: DesignIdeasProps) {
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
    <div className="min-h-screen bg-bg">
      <TopBar />
      <HeroLive />
      <PricingStrip />
      <HowItWorks />
      <AssociationsBand />

      <main className="mx-auto max-w-lg px-4 py-4">
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

        <div id="feed">
          <ListingsHeader count={jobs.length} />
        </div>

        <div className="mt-2">
          <JobFeed initialJobs={jobs} filters={filters} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
