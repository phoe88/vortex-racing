import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

/**
 * Vercel Web Analytics (page views, referrers) and Speed Insights (Core Web Vitals).
 *
 * Both read the current URL on the client, so they sit in their own Suspense
 * boundary to keep every route prerenderable under Cache Components. They load
 * their scripts from `/_vercel/*`, which only exists on Vercel deployments; in
 * local development they run in debug mode and send nothing.
 */
export function VercelInsights() {
  return (
    <Suspense fallback={null}>
      <Analytics />
      <SpeedInsights />
    </Suspense>
  );
}
