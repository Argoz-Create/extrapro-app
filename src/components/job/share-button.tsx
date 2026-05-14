"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { track } from "@/lib/analytics/events";

type ShareButtonProps = {
  jobAdId?: string;
};

export function ShareButton({ jobAdId }: ShareButtonProps = {}) {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (jobAdId) {
        track.shareListing(jobAdId, "clipboard");
      }
    } catch {
      // Fallback: do nothing if clipboard API unavailable
    }
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-gray-50 active:bg-gray-100"
    >
      {"\u{1F517}"} {copied ? t("job.shareCopied") : t("job.share")}
    </button>
  );
}
