"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/context";

type HeroSectionProps = {
  jobCount: number;
};

export function HeroSection({ jobCount }: HeroSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="bg-gradient-to-b from-primary/5 to-background px-4 py-8">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
          {t("landing.headline")}
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          {t("landing.subheadline")}
        </p>

        {/* Job count badge */}
        {jobCount > 0 && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary-dark">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            {t("landing.activeListings", { count: String(jobCount) })}
          </div>
        )}

        {/* How it works - compact */}
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg">
              {"\u{1F50D}"}
            </div>
            <p className="mt-1 text-xs font-medium text-text-primary">
              {t("landing.step1")}
            </p>
          </div>
          <div>
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg">
              {"\u{1F4DE}"}
            </div>
            <p className="mt-1 text-xs font-medium text-text-primary">
              {t("landing.step2")}
            </p>
          </div>
          <div>
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg">
              {"\u2705"}
            </div>
            <p className="mt-1 text-xs font-medium text-text-primary">
              {t("landing.step3")}
            </p>
          </div>
        </div>

        {/* CTA for employers */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" href="/login">
            {t("landing.employerCta")}
          </Button>
        </div>

        <p className="mt-2 text-xs text-text-tertiary">
          {t("landing.noLoginRequired")}
        </p>
      </div>
    </section>
  );
}
