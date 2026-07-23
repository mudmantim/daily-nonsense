// Canonical public origin, no trailing slash. Mirrors the fallback used by
// layout.tsx's metadataBase: the env var wins when set (e.g. once the custom
// domain is live), the Vercel URL is the build-time fallback. Used by the RSS
// feed and the /api/today integration endpoint to build absolute links.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://daily-nonsense.vercel.app"
).replace(/\/$/, "");
