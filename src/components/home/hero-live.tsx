import Link from "next/link";
import { Zap, Heart, Sparkles } from "lucide-react";
import { getActiveJobs } from "@/lib/queries/jobs";
import { getLanguage } from "@/lib/i18n/get-language";
import { FeatureCard } from "./feature-card";
import { LiveFeedWidget } from "./live-feed-widget";

export async function HeroLive() {
  const [language, jobs] = await Promise.all([
    getLanguage(),
    getActiveJobs(undefined, undefined, 3),
  ]);

  // Build translations map for client component
  const translations: Record<string, string> = {
    "home.hero.statusPill": language === "fr" ? "EN DIRECT · EN URGENCE" : "LIVE · URGENT",
    "home.hero.headline.start": language === "fr" ? "Trouvez votre extra." : "Find your extra.",
    "home.hero.headline.accent": language === "fr" ? "Maintenant." : "Now.",
    "home.hero.subhead":
      language === "fr"
        ? "La première plateforme en live pour les extras de la restauration, hôtellerie et événementiel. Sans engagement. Sans abonnement. Une partie des bénéfices revient aux associations."
        : "The first live matching platform for temp workers in restaurants, hotels and events. No commitment. No subscription. A share of every booking goes to charity.",
    "home.hero.feature1.title": language === "fr" ? "10 secondes" : "10 seconds",
    "home.hero.feature1.text": language === "fr" ? "de la pub à l'appel" : "post to phone call",
    "home.hero.feature2.title": language === "fr" ? "Sans abonnement" : "No subscription",
    "home.hero.feature2.text": language === "fr" ? "payez à l'usage" : "pay per use",
    "home.hero.feature3.title": language === "fr" ? "11 associations" : "11 charities",
    "home.hero.feature3.text": language === "fr" ? "soutenues directement" : "funded directly",
    "home.hero.cta.primary": language === "fr" ? "Publier en urgence →" : "Post urgently →",
    "home.hero.cta.secondary": language === "fr" ? "Voir le feed live" : "See live feed",
    "home.feed.label.heading": language === "fr" ? "Annonces actives · Paris" : "Active ads · Paris",
    "home.feed.label.live": language === "fr" ? "EN LIVE" : "LIVE",
    "home.feed.empty":
      language === "fr"
        ? "Aucune annonce active pour l'instant. Soyez le premier à publier."
        : "No active ads right now. Be the first to post.",
    "home.feed.callBtn": language === "fr" ? "Appeler" : "Call",
  };

  return (
    <section className="border-b border-gray-200 bg-white py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        {/* Status pill */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#FF3B30]/20 bg-[#FF3B30]/5 px-4 py-2">
          <span className="inline-block h-2 w-2 rounded-full bg-[#FF3B30] animate-pulse"></span>
          <span className="font-mono text-xs font-bold uppercase text-[#FF3B30]">
            {translations["home.hero.statusPill"]}
          </span>
        </div>

        {/* Two-column layout */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left column: manifesto + features + CTAs */}
          <div>
            {/* Headline */}
            <h1 className="font-[Manrope,Inter,sans-serif] text-4xl font-bold leading-tight text-[#09090B] md:text-5xl">
              {translations["home.hero.headline.start"]}
              <br />
              <span className="italic text-[#FF3B30]">
                {translations["home.hero.headline.accent"]}
              </span>
            </h1>

            {/* Subhead */}
            <p className="mt-6 text-lg leading-relaxed text-gray-700">
              {translations["home.hero.subhead"]}
            </p>

            {/* Feature cards grid */}
            <div className="mt-8 grid grid-cols-3 gap-3">
              <FeatureCard
                icon={Zap}
                title={translations["home.hero.feature1.title"]}
                text={translations["home.hero.feature1.text"]}
              />
              <FeatureCard
                icon={Sparkles}
                title={translations["home.hero.feature2.title"]}
                text={translations["home.hero.feature2.text"]}
              />
              <FeatureCard
                icon={Heart}
                title={translations["home.hero.feature3.title"]}
                text={translations["home.hero.feature3.text"]}
              />
            </div>

            {/* CTAs */}
            <div className="mt-8 flex gap-4 md:flex-row">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full bg-[#FF3B30] px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
              >
                {translations["home.hero.cta.primary"]}
              </Link>
              <a
                href="#feed"
                className="inline-flex items-center justify-center rounded-full border-2 border-[#09090B] px-6 py-3 font-semibold text-[#09090B] transition-colors hover:bg-[#09090B]/5"
              >
                {translations["home.hero.cta.secondary"]}
              </a>
            </div>
          </div>

          {/* Right column: live feed widget */}
          <div className="flex items-center">
            <LiveFeedWidget jobs={jobs} translations={translations} />
          </div>
        </div>

        {/* Mobile-specific stacking note: grid-cols-1 at base, grid-cols-2 at lg */}
      </div>
    </section>
  );
}
