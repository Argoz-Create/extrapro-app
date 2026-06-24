import type { MetadataRoute } from "next";
import { getActiveJobsForSitemap } from "@/lib/queries/jobs";

// Canonical domain. www.urjaya.fr is live; extra-pro.com 301-redirects
// here (see middleware.ts) so Google consolidates on this host.
const BASE_URL = "https://www.urjaya.fr";

// Regenerate at most once per hour. Aligns with the change frequency
// we declare for the homepage and avoids spamming the build with every
// ad publish/expire.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let jobs: Array<{
    id: string;
    published_at: string | null;
    updated_at: string | null;
  }> = [];

  try {
    jobs = await getActiveJobsForSitemap();
  } catch {
    // Supabase unreachable — return the static surface so the sitemap
    // is still generated (and Search Console doesn't 5xx).
  }

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "hourly", priority: 1.0 },
    { url: `${BASE_URL}/a-propos`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/login`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/register`, changeFrequency: "yearly", priority: 0.4 },
    ...jobs.map((j) => ({
      url: `${BASE_URL}/annonces/${j.id}`,
      lastModified: j.updated_at
        ? new Date(j.updated_at)
        : j.published_at
        ? new Date(j.published_at)
        : new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];
}
