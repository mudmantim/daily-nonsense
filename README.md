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

- `src/app/` — routes (today, `/yesterday`, `/random`, `/archive`)
- `src/lib/content.ts` — the Daily Item pool, date-rotation logic, `DailyItem` schema
- `src/lib/universes.ts` — institution metadata (gradient, masthead, bureaucratic detail)
- `src/lib/timeline.ts` — canonical shared-event slugs (mirrors `world/TIMELINE.md`)
- `world/` — the world bible: constitution, institution profiles, timeline, style guide, supporting artifacts

## Deploy

Live at **https://daily-nonsense.vercel.app** (Vercel project `daily-nonsense`, team `mudmantim-projects`, deployed 2026-07-16).

Deployed via the Vercel MCP `deploy_to_vercel` tool, which does a one-off file-tree snapshot deploy rather than a GitHub-linked import — the tool available in that session had no `gitRepository` parameter, even though Vercel's own REST API supports one. Two consequences worth knowing:

- **Not git-linked yet.** Pushes to `master` do not auto-deploy. Connecting a GitHub repo to a Vercel project requires authorizing Vercel's GitHub App for that repo — an authentication/access grant, not a config value, and no tool available to Claude can do it. **Action needed from Tim:** `daily-nonsense` project on vercel.com → Settings → Git → Connect Git Repository → select `mudmantim/daily-nonsense` → confirm production branch `master`. Under a minute; see `AUTONOMY.md` item 10 for the full reasoning.
- **No project env vars were set** (same tooling gap). `NEXT_PUBLIC_SITE_URL` is hardcoded as a fallback default in `src/app/layout.tsx`'s `metadataBase` instead, pointing at the real production URL above. Once the project is git-linked and dashboard access is routine, move this to a real project env var instead.

`favicon.ico` was intentionally left out of that snapshot deploy (binary file, not worth the payload size for a one-off deploy) — `/favicon.ico` 404s, but the actual app icon (`/icon.svg`, referenced via `<link rel="icon">` and the manifest) works normally. Low-priority cleanup: include it next time the project is redeployed or git-linked.

No custom domain is configured yet. The current `.vercel.app` URL is infrastructure, not the product's permanent identity — the intended public domain is `daily.mudmantimsapps.com`. See `HOMEPAGE_INTEGRATION_PROPOSAL.md` for the full mudmantimsapps.com integration plan (still planning-only) and the domain migration checklist.
