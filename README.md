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

- **Not git-linked.** Pushes to `master` do not auto-deploy. To get continuous deployment, connect the existing GitHub repo (`mudmantim/daily-nonsense`) to the Vercel project from the dashboard (Project → Settings → Git → Connect), or redeploy manually the same way this deploy was done.
- **No project env vars were set** (the deploy tool doesn't expose that either). `NEXT_PUBLIC_SITE_URL` is hardcoded as a fallback default in `src/app/layout.tsx`'s `metadataBase` instead, pointing at the real production URL above. If a custom domain is ever added, update that fallback (or, better, set `NEXT_PUBLIC_SITE_URL` as a real project env var once the project is git-linked and dashboard access is easy).

`favicon.ico` was intentionally left out of that snapshot deploy (binary file, not worth the payload size for a one-off deploy) — `/favicon.ico` 404s, but the actual app icon (`/icon.svg`, referenced via `<link rel="icon">` and the manifest) works normally. Low-priority cleanup: include it next time the project is redeployed or git-linked.

No custom domain is configured yet. Preferred future domain: `daily.mudmantimsapps.com`.
