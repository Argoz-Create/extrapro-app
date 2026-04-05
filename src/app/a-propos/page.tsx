import type { Metadata } from "next";
import { TopBar } from "@/components/layout/top-bar";
import { Footer } from "@/components/layout/footer";
import { AboutContent } from "@/components/about-content";
import { getPlatformStats } from "@/lib/queries/stats";
import type { PlatformStats } from "@/lib/types/database";

export const metadata: Metadata = {
  title: "A propos — EXTRAPRO",
  description:
    "EXTRAPRO est la plateforme de recrutement en restauration et hotellerie.",
};

export default async function AboutPage() {
  let stats: PlatformStats | null = null;
  try {
    stats = await getPlatformStats();
  } catch {
    // Supabase not configured — render without live stats
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <AboutContent stats={stats} />
      <Footer />
    </div>
  );
}
