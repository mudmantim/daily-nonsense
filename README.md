# The Daily Nonsense

A Next.js app that reveals one absurd "document" per day from a fictional bureaucracy — see `world/README.md` for the full world bible (constitution, institution profiles, shared timeline, supporting artifacts) that every Daily Item is written against.

## Getting started

```bash
npm install
git config core.hooksPath .githooks   # one-time, per clone - see below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Development workflow

```bash
npm run verify:fast   # lint + typecheck + test (fast; runs automatically on commit)
npm run verify        # verify:fast + a full production build (run before a checkpoint/release)
npm test               # just the content-consistency + rotation-logic test suite
```

Committing runs `npm run verify:fast` automatically via a pre-commit hook. The hook lives in `.githooks/pre-commit` (tracked in git) rather than `.git/hooks/` (not tracked) so it travels with the repo — each clone needs to point git at it once with `git config core.hooksPath .githooks`, shown above.

See `PROJECT_JOURNAL.md` for a running log of engineering/product sessions, and `AUTONOMY.md` for what's automated in this workflow, what's deliberately still manual, and why.

## Project structure

- `src/app/` — routes: today (`/`), `/yesterday`, `/random`, `/archive`, `/day/[date]` (permalinks with previous/next), `/calendar/[[...ym]]` (month browsing), `/rss.xml` (RSS 2.0), `/api/today` (JSON for the mudmantimsapps.com teaser), `/opengraph-image`
- `src/lib/content.ts` — the Daily Item pool, date-rotation logic, `DailyItem` schema
- `src/lib/universes.ts` — institution metadata (gradient, masthead, bureaucratic detail)
- `src/lib/timeline.ts` — canonical shared-event slugs (mirrors `world/TIMELINE.md`)
- `world/` — the world bible: constitution, institution profiles, timeline, style guide, supporting artifacts

## Continuous integration

`.github/workflows/verify.yml` runs `npm run verify` (lint, typecheck, tests, production build) on every push to `master` and on every pull request. It deploys nothing; Vercel does that on push.

## Deploy

Live at **https://daily-nonsense.vercel.app** (Vercel project `daily-nonsense`, team `mudmantim-projects`, deployed 2026-07-16).

Deployed via the Vercel MCP `deploy_to_vercel` tool, which does a one-off file-tree snapshot deploy rather than a GitHub-linked import — the tool available in that session had no `gitRepository` parameter, even though Vercel's own REST API supports one. Two consequences worth knowing:

- **Git-linked as of Session 9.** Pushes to `master` deploy automatically — verified with a real push producing a real deployment (`source: "git"`, build completed, live-checked). Getting here took four rounds of troubleshooting because "connected" can mean three different, non-equivalent things (an account-level GitHub↔Vercel login, a GitHub App's repository-access scope, and the project's own Connect-Git-Repository action) — only the last one actually enables deploys. Full history in `PROJECT_JOURNAL.md` Session 9.
- `NEXT_PUBLIC_SITE_URL` is still a code fallback (`src/lib/site.ts`, used by `metadataBase`, the RSS feed and `/api/today`) rather than a real project env var. It must be set when the custom domain goes live (see `docs/DOMAIN_CUTOVER_CHECKLIST.md`).

`favicon.ico` — resolved as a side effect of git-linking: the Session 8 snapshot deploy deliberately left it out (binary file, not worth the payload for a one-off deploy), but git-linked deploys pull the full repo, so it's included automatically now.

No custom domain is configured yet. The current `.vercel.app` URL is infrastructure, not the product's permanent identity — the intended public domain is `daily.mudmantimsapps.com`. See `HOMEPAGE_INTEGRATION_PROPOSAL.md` for the full mudmantimsapps.com integration plan (still planning-only) and the domain migration checklist.
