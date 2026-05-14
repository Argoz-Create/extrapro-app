"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";
import { readConsentClient, setConsent } from "@/lib/analytics/consent";

// Minimal GDPR-compliant consent banner. Two buttons (Accept / Refuse).
// Linked details page (/confidentialite) is owed but optional pre-launch;
// the banner gracefully renders even without the page (link 404 is a P2).
// First-paint behavior: renders nothing until the consent state is read
// from the client (avoids hydration mismatch and a banner flash for users
// who've already decided).
export function CookieConsent() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Wait-for-hydration pattern: we can't read the consent cookie /
    // localStorage during SSR, so the banner starts hidden and reveals
    // itself only after we know the client state. The "cascading render"
    // is intentional and necessary here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (readConsentClient() === "pending") setVisible(true);
  }, []);

  if (!visible) return null;

  const handleAccept = () => {
    setConsent("granted");
    setVisible(false);
  };
  const handleRefuse = () => {
    setConsent("denied");
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t("consent.banner.aria")}
      className="fixed bottom-0 left-0 right-0 z-[60] border-t border-border bg-surface px-4 py-4 shadow-lg"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-text-secondary">
          {t("consent.banner.text")}{" "}
          <Link href="/confidentialite" className="underline hover:text-text-primary">
            {t("consent.details")}
          </Link>
        </p>
        <div className="flex gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleRefuse}
            className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary hover:border-text-primary"
          >
            {t("consent.refuse")}
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            {t("consent.accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
