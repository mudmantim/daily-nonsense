# daily.mudmantimsapps.com cutover: checklist (READY; not executed)

Derived from `HOMEPAGE_INTEGRATION_PROPOSAL.md` § Migration plan, updated for the current code. Every step marked **[OWNER]** touches Vercel, DNS or the live site, and needs the owner's go.

**Preconditions:**
- [x] Git-linked deploys work (Session 9).
- [x] One canonical origin in code: `src/lib/site.ts` (`SITE_URL`), used by `metadataBase`, RSS and `/api/today`. Consolidated in closeout/v1.0, so the fallback lives in exactly one place.
- [ ] CI `verify` green on master (`.github/workflows/verify.yml`; it needs a push to start running).

**Steps:**
1. **[OWNER]** Vercel → project `daily-nonsense` → Settings → Domains → add `daily.mudmantimsapps.com`. Copy the exact DNS record Vercel shows, usually a `CNAME` to Vercel's target. Don't use a guessed value.
2. **[OWNER]** Add that record at the DNS host for `mudmantimsapps.com`. That's an external, public change. Find the host with `dig NS mudmantimsapps.com`; if needed the agent can check it read-only first.
3. Wait for Vercel to show the domain **Valid** and the certificate issued. Then `curl -sI https://daily.mudmantimsapps.com/` → 200.
4. **[OWNER]** Vercel → Settings → Environment Variables → `NEXT_PUBLIC_SITE_URL = https://daily.mudmantimsapps.com` (Production). Redeploy (any push to master, or Redeploy in the UI). The build bakes it into `metadataBase`, RSS and `/api/today`.
5. Agent, read-only checks:
   - `curl -s https://daily.mudmantimsapps.com/rss.xml | grep -c daily.mudmantimsapps.com` > 0;
   - `curl -s …/api/today` shows `url` on the new domain;
   - page source `og:image` on the new domain;
   - `https://daily-nonsense.vercel.app/` still 200, so the old URL stays alive and nothing breaks for existing links.
6. Update the forward-looking mentions only: the README Deploy section and the proposal's status line. The journal stays historical. Optionally change the `site.ts` fallback to the new domain in the same commit.
7. **Rollback:** remove the env var and redeploy, so the URLs revert to `.vercel.app`; remove the domain in Vercel and the DNS record. Readers on the old URL never notice.
