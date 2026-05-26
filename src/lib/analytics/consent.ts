// Consent state for analytics + tracking. GDPR-required: GA4 / GTM / any
// non-essential cookie must wait until the user grants consent. Sentry is
// loaded regardless (error tracking is considered legitimate interest
// when no PII is sent — we don't attach user identifiers).
//
// Storage: `urjaya-consent` cookie (1 year, same-site lax) AND
// localStorage mirror so the banner doesn't re-show on the next visit.
// Server can read the cookie via `getConsent()` for SSR-conditional
// rendering. Client reads localStorage first, falls back to cookie.

export type ConsentState = "granted" | "denied" | "pending";

const COOKIE_NAME = "urjaya-consent";
const STORAGE_KEY = "urjaya-consent";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export const CONSENT_CHANGED_EVENT = "urjaya:consent-changed";

export function readConsentClient(): ConsentState {
  if (typeof window === "undefined") return "pending";
  try {
    const fromStorage = window.localStorage.getItem(STORAGE_KEY);
    if (fromStorage === "granted" || fromStorage === "denied") return fromStorage;
  } catch {
    // localStorage blocked (private mode, etc.) — fall through to cookie
  }
  const match = document.cookie.match(/(?:^|; )urjaya-consent=([^;]+)/);
  if (match) {
    const v = decodeURIComponent(match[1]);
    if (v === "granted" || v === "denied") return v;
  }
  return "pending";
}

export function setConsent(state: "granted" | "denied"): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, state);
  } catch {
    // Ignore — cookie alone is sufficient
  }
  document.cookie = `${COOKIE_NAME}=${state}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: state }));
}
