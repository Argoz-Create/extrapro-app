// Next.js 13+ instrumentation hook. Sentry's server + edge configs are
// imported here so they initialize before any route handler runs.
// `onRequestError` is forwarded to Sentry so unhandled errors in route
// handlers / RSCs land in the dashboard.
import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
