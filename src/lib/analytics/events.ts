// Typed wrappers around dataLayer.push so callers don't have to think
// about the GTM contract. Each event corresponds to a measurement
// surface in the Pilot Launch funnel:
//   view_item        - job-detail page mount
//   click_call       - the core conversion (worker calls employer)
//   share_listing    - share-button click
//   signup_start     - register page mount
//   signup_complete  - successful registration
//   ad_publish       - employer publishes a new ad
//   hire_confirm     - employer marks the position filled (north-star)
//
// Calls are no-ops when GTM hasn't loaded (consent denied / dataLayer
// undefined). No queueing — events lost before consent are acceptable
// for a pilot; tighten later if attribution suffers.

type EventName =
  | "view_item"
  | "click_call"
  | "share_listing"
  | "signup_start"
  | "signup_complete"
  | "ad_publish"
  | "hire_confirm";

type EventParams = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

function push(name: EventName, params: EventParams = {}): void {
  if (typeof window === "undefined") return;
  if (!Array.isArray(window.dataLayer)) return;
  window.dataLayer.push({ event: name, ...params });
}

export const track = {
  viewItem: (job_id: string, profession: string | null, city: string | null, urgent: boolean) =>
    push("view_item", { job_id, profession, city, urgent }),
  clickCall: (job_id: string, profession: string | null, city: string | null) =>
    push("click_call", { job_id, profession, city }),
  shareListing: (job_id: string, method: string) =>
    push("share_listing", { job_id, method }),
  signupStart: () => push("signup_start"),
  signupComplete: (employer_id: string) => push("signup_complete", { employer_id }),
  adPublish: (ad_id: string, urgent: boolean, profession_count: number, city: string | null) =>
    push("ad_publish", { ad_id, urgent, profession_count, city }),
  hireConfirm: (ad_id: string) => push("hire_confirm", { ad_id }),
};
