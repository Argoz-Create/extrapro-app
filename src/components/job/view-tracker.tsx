"use client";

import { useEffect } from "react";
import { logView } from "@/lib/actions/interactions";

type ViewTrackerProps = {
  jobAdId: string;
};

export function ViewTracker({ jobAdId }: ViewTrackerProps) {
  useEffect(() => {
    // Fire-and-forget: track the view
    logView(jobAdId);
  }, [jobAdId]);

  return null;
}
