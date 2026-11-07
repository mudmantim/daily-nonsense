# Operations: daily publishing

## How the website publishes each day
- **Nothing has to run.** Each request computes the date and looks up that day's document from the schedule in code (`getItemForDate` in `src/lib/content.ts`, `src/lib/rotation.ts`).
- There is no cron and no scheduled job. Nothing depends on a laptop, a terminal or a Claude session. Vercel serves it on demand.
- **Rollover: 00:00 UTC.** `getDayKey` uses the UTC date.

| Season | 00:00 UTC in Eastern time | Effect |
|---|---|---|
| EST (early Nov – mid Mar) | **7:00 PM** the previous evening | US readers see "tomorrow's" edition from 7 PM |
| EDT (mid Mar – early Nov) | **8:00 PM** the previous evening | same, from 8 PM |

- **Caching:**
  - `/` and `/day/<date>` are uncached, so they switch exactly at 00:00 UTC.
  - `/api/today` and `/rss.xml` send `s-maxage=3600, stale-while-revalidate=86400`, so they can show the previous edition for up to about an hour after the rollover.
- **Release gate:**
  - `/day/<future date>` returns 404, so nothing is public before its date.
  - Social posts must never go out before the matching website edition. They are published at **12:00 PM Eastern**, which is always after that date's rollover (17:00 UTC in EST, 16:00 UTC in EDT).
- **Supply:**
  - Every date resolves to a document indefinitely: premieres first, then the long-term rotation of the whole library, with no repeat within 30 days.
  - New premieres currently end on 2026-12-28 (Issue 3). New issues are added through `content/BACKLOG.md`.

## Monitoring
- **What runs:** `.github/workflows/live-site-check.yml`, daily at **01:20 UTC**, which is after the API/RSS cache window. It runs `scripts/ops/live-check.mjs`.
- **What it checks:**
  - The homepage returns 200 and shows today's UTC edition.
  - `/day/<today>` returns 200 with the same document.
  - `/api/today` (cache-busted) reports today with a body.
  - `/day/<tomorrow>` returns 404.
- **Retries:** each check is retried 3 times, 60 seconds apart, before it reports a failure.
- **Alerts:**
  - The run fails, which sends GitHub's failed-workflow notification to the account that owns the schedule.
  - It also opens an issue labelled `live-site-alert`, or comments on the open one.
- **Test the alert path:** Actions → live-site-check → Run workflow → tick "simulate failure". This only fails on purpose; it doesn't touch the site.
- **When an alert fires:**
  1. Open the run log.
  2. Load the site.
  3. Check Vercel's deployment status and runtime errors.
  4. Close the issue once the check passes again.
- **Cost:** free (GitHub Actions on a public repo). It sends read-only GET requests and deploys nothing.
