# The Daily Nonsense v1.0.0: release notes (PROPOSED; tag pending owner sign-off)

**What v1.0.0 is:** the app live at daily-nonsense.vercel.app since 2026-07-23 (`d7dece7`), plus the closeout branch `closeout/v1.0`: CI, documentation accuracy, a one-line-cutover refactor. **No content and no user-visible behaviour change** in the closeout.

## In v1.0
- **A daily institutional document:** 50 items across the world bible's institutions. A deterministic rotation from 2026-01-01 (see `docs/CONTENT_ROTATION_MEMO.md`).
- **Routes:**
  - today `/`, `/yesterday`, `/random`, `/archive`;
  - dated permalinks `/day/YYYY-MM-DD` with previous/next;
  - month calendar `/calendar`;
  - RSS 2.0 `/rss.xml`;
  - the JSON `/api/today` for the mudmantimsapps.com teaser;
  - Open Graph images.
- **Deploys:** git-linked Vercel; pushes to `master` deploy automatically (verified in Session 9).
- **Quality gate:**
  - `npm run verify` (lint, typecheck, 30 unit tests, production build);
  - a pre-commit hook running `verify:fast`;
  - **new: GitHub Actions `verify` on pushes and pull requests**.

## Closeout changes (`closeout/v1.0`)
- `.github/workflows/verify.yml`: CI. It deploys nothing.
- `src/app/layout.tsx` uses `SITE_URL` from `src/lib/site.ts`. One canonical origin for metadata, RSS and the API. The rendered URLs are verified unchanged.
- README (complete route list, CI, accurate env-var note), `AUTONOMY.md` item 7 (it was stale since Session 9), the journal's Session 10.
- `docs/CONTENT_ROTATION_MEMO.md`, `docs/DOMAIN_CUTOVER_CHECKLIST.md`, these notes.

## Verification (2026-10-15, isolated clone)
- lint ✓, typecheck ✓, **30/30 tests**, network-isolated;
- `next build` ✓ (10 routes; it needs network only for `next/font` Google Fonts).

## Known and deferred
- **Content repeats every 50 days** (5 complete cycles so far). Decision memo: option A for v1.0, then B or C.
- No custom domain yet; the checklist is ready.
- `NEXT_PUBLIC_SITE_URL` isn't set as a Vercel env var; the code fallback is correct for the current domain.
- `~/Projects/daily-nonsense` is a stale duplicate marked DO-NOT-USE. Archiving it is an owner decision.

## Owner steps to ship
1. Review, then merge `closeout/v1.0` into `master`. **A push deploys** (docs, CI and a no-behaviour-change refactor only).
2. Confirm the first CI run is green on GitHub.
3. Tag `v1.0.0` on that commit.
