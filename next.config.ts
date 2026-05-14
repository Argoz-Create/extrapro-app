import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
};

// Sentry build-time wrapping. Source-map upload runs only when SENTRY_ORG +
// SENTRY_PROJECT + SENTRY_AUTH_TOKEN are set (typically only in CI). Local
// dev + preview deploys without these env vars build normally — Sentry
// just skips the upload step.
//
// Minimal viable config. Avoided the deprecated options
// (hideSourceMaps removed in current SDK, disableLogger /
// reactComponentAnnotation / automaticVercelMonitors all moved under
// `webpack` in the new SDK and not supported under Turbopack anyway).
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
});
