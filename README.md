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

Not yet deployed anywhere (no git remote configured). The usual path for a Next.js app like this is [Vercel](https://vercel.com/new) — see [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) when that decision gets made.
