// Sentry client-side init. Loaded automatically by @sentry/nextjs.
// The DSN is intentionally public (Sentry SDKs treat it as such).
// If NEXT_PUBLIC_SENTRY_DSN is unset, Sentry no-ops silently.
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    // 10% trace sampling — adjust once we see real volume.
    tracesSampleRate: 0.1,
    // No session replays pre-launch — privacy concerns + cost.
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    // Don't ship debug logging to prod console.
    debug: false,
    // Strip URL query params from breadcrumbs (might contain PII).
    sendDefaultPii: false,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV || "development",
  });
}
