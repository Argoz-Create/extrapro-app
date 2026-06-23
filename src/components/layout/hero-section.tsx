"use client";

import { ArrowDown } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/context";

type HeroSectionProps = {
  jobCount: number;
};

export function HeroSection({ jobCount }: HeroSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="bg-gradient-to-b from-primary/10 via-primary/5 to-background px-4 pt-10 pb-12">
      <div className="mx-auto max-w-2xl text-center">
        {/* Brand mark */}
        <div className="inline-flex items-center gap-2 text-sm font-bold tracking-wide text-primary-dark">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
          </span>
          URJAYA
        </div>

        {/* Headline */}
        <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-text-primary sm:text-4xl">
          {t("landing.headline")}
        </h1>

        {/* Subheadline — the solidarity hook */}
        <p className="mx-auto mt-3 max-w-xl text-base text-text-secondary">
          {t("landing.subheadline")}
        </p>

        {/* Pain points */}
        <p className="mt-5 text-sm font-medium text-text-primary">
          {t("landing.painline")}
        </p>
        <p className="mx-auto mt-1 max-w-xl text-sm text-text-secondary">
          {t("landing.reassure")}
        </p>

        {/* Live listings badge */}
        {jobCount > 0 && (
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary-dark">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            {t("landing.activeListings", { count: String(jobCount) })}
          </div>
        )}

        {/* Big primary CTA → the listings feed */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <Button
            variant="primary"
            size="lg"
            href="#annonces"
            fullWidth
            className="max-w-sm gap-2 text-base shadow-lg shadow-primary/20"
          >
            {t("landing.viewListingsCta")}
            <ArrowDown size={20} weight="bold" />
          </Button>

          <Button variant="ghost" size="sm" href="/login">
            {t("landing.employerCta")}
          </Button>
        </div>

        {/* Trust line */}
        <p className="mt-4 text-xs font-medium text-text-tertiary">
          {t("landing.trustline")}
        </p>
      </div>
    </section>
  );
}
