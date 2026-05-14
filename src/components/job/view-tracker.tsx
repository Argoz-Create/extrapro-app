"use client";

import { useEffect } from "react";
import { logView } from "@/lib/actions/interactions";
import { track } from "@/lib/analytics/events";

type ViewTrackerProps = {
  jobAdId: string;
  profession?: string | null;
  city?: string | null;
  urgent?: boolean;
};

export function ViewTracker({ jobAdId, profession, city, urgent }: ViewTrackerProps) {
  useEffect(() => {
    // Server-side view counter (always — internal analytics).
    logView(jobAdId);
    // GA4 view_item event (gated on consent inside track.*).
    track.viewItem(jobAdId, profession ?? null, city ?? null, urgent ?? false);
  }, [jobAdId, profession, city, urgent]);

  return null;
}
