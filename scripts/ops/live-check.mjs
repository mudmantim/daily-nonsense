// Daily live-site check for The Daily Nonsense. Read-only: it only sends GET
// requests. Run by .github/workflows/live-site-check.yml (see docs/OPERATIONS.md).
//
//   node scripts/ops/live-check.mjs            # check https://daily-nonsense.vercel.app
//   BASE_URL=http://localhost:3000 node scripts/ops/live-check.mjs
//   SIMULATE_FAILURE=1 node scripts/ops/live-check.mjs   # exercise the alert path
//
// The site rolls over at 00:00 UTC. The homepage and /day/<date> are uncached,
// but /api/today and /rss.xml may be CDN-cached for up to an hour, so the
// scheduled run is at 01:20 UTC and /api/today gets a cache-busting query.
// Each check is retried before a failure is reported, so a single transient
// error doesn't raise an alarm.

const BASE = (process.env.BASE_URL ?? "https://daily-nonsense.vercel.app").replace(/\/$/, "");
const ATTEMPTS = Number(process.env.ATTEMPTS ?? 3);
const WAIT_MS = Number(process.env.WAIT_MS ?? 60_000);
const now = process.env.CHECK_DATE ? new Date(`${process.env.CHECK_DATE}T12:00:00Z`) : new Date();
const dayKey = (d) => d.toISOString().slice(0, 10);
const today = dayKey(now);
const tomorrow = dayKey(new Date(now.getTime() + 86_400_000));

// Values embedded in the server-rendered page payload, where quotes may be
// backslash-escaped inside a script string.
function itemId(html) {
  const m = html.match(/item\\?":\{\\?"id\\?":\\?"([a-z0-9-]+)/);
  return m ? m[1] : null;
}
function field(html, name) {
  const m = html.match(new RegExp(`${name}\\\\?":\\\\?"([^"\\\\]+)`));
  return m ? m[1] : null;
}

async function get(path) {
  const res = await fetch(BASE + path, { redirect: "manual", headers: { "user-agent": "daily-nonsense-live-check" } });
  return { status: res.status, text: await res.text() };
}

async function checkOnce() {
  const problems = [];
  const home = await get("/");
  const homeDay = field(home.text, "dayKey");
  const homeId = itemId(home.text);
  const homeTitle = field(home.text, "title");
  if (home.status !== 200) problems.push(`homepage returned HTTP ${home.status}`);
  else if (homeDay !== today) problems.push(`homepage shows edition ${homeDay ?? "(none found)"}, expected ${today}`);

  const day = await get(`/day/${today}`);
  if (day.status !== 200) problems.push(`/day/${today} returned HTTP ${day.status}`);
  else if (field(day.text, "dayKey") !== today) problems.push(`/day/${today} shows edition ${field(day.text, "dayKey")}`);
  else if (homeId && itemId(day.text) !== homeId) problems.push(`/day/${today} and the homepage show different documents`);

  const api = await get(`/api/today?monitor=${Date.now()}`);
  let apiTitle = null;
  if (api.status !== 200) problems.push(`/api/today returned HTTP ${api.status}`);
  else {
    try {
      const j = JSON.parse(api.text);
      apiTitle = j?.item?.title ?? null;
      if (j.dayKey !== today) problems.push(`/api/today reports ${j.dayKey}, expected ${today}`);
      if (!j?.item?.body) problems.push("/api/today has no document body");
    } catch { problems.push("/api/today did not return JSON"); }
  }
  if (homeTitle && apiTitle && homeTitle !== apiTitle) problems.push(`/api/today title "${apiTitle}" differs from the homepage "${homeTitle}"`);

  // Release gate: tomorrow's edition must not be public yet.
  const next = await get(`/day/${tomorrow}`);
  if (next.status !== 404) problems.push(`/day/${tomorrow} returned HTTP ${next.status}; future editions must 404`);

  return { problems, summary: `edition ${homeDay} (${homeId ?? "?"}: ${homeTitle ?? "?"})` };
}

async function main() {
  if (process.env.SIMULATE_FAILURE === "1") {
    console.error("SIMULATED FAILURE: alert-path test requested via workflow_dispatch. The live site was not checked.");
    process.exit(1);
  }
  let last;
  for (let i = 1; i <= ATTEMPTS; i++) {
    try { last = await checkOnce(); } catch (e) { last = { problems: [`request failed: ${e.message}`], summary: "" }; }
    if (last.problems.length === 0) {
      console.log(`OK ${today}: ${last.summary}; tomorrow (${tomorrow}) is correctly not public.`);
      return;
    }
    console.warn(`attempt ${i}/${ATTEMPTS} failed: ${last.problems.join("; ")}`);
    if (i < ATTEMPTS) await new Promise((r) => setTimeout(r, WAIT_MS));
  }
  console.error(`LIVE SITE CHECK FAILED for ${today} at ${BASE}:\n- ${last.problems.join("\n- ")}`);
  process.exit(1);
}

main();
