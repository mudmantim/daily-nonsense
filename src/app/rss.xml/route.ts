import { getRecentDays } from "@/lib/content";
import { renderRssFeed } from "@/lib/rss";
import { SITE_URL } from "@/lib/site";

// The feed's contents (and lastBuildDate) depend on the current day, so it's
// recomputed per request. The Cache-Control header still lets a CDN hold it
// for an hour and serve stale-while-revalidate, so readers/aggregators aren't
// hitting origin on every poll.
export const dynamic = "force-dynamic";

const FEED_DAYS = 30;

export async function GET() {
  const entries = getRecentDays(FEED_DAYS);
  const xml = renderRssFeed(entries, {
    siteUrl: SITE_URL,
    buildDate: new Date().toUTCString(),
  });

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
