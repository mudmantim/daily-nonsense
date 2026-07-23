import { buildTodayPayload } from "@/lib/todayPayload";
import { SITE_URL } from "@/lib/site";

// Reflects the current UTC day, so it's computed per request. The
// Cache-Control header lets a CDN and the consuming homepage cache it for an
// hour (well within a day boundary), keeping origin traffic low.
export const dynamic = "force-dynamic";

// Read-only, non-sensitive public data — safe to expose to any origin so
// mudmantimsapps.com (a different origin) can fetch it client-side.
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

export async function GET() {
  const payload = buildTodayPayload(SITE_URL);
  return Response.json(payload, {
    headers: {
      ...CORS_HEADERS,
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
