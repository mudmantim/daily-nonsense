# Project Journal — The Daily Nonsense

Running log of engineering/product sessions. Written so a reader can understand what happened and why without re-reading every commit. Newest session at the bottom.

---

## Session 1 — v0.1 through Product Checkpoint 1 (2026-07-16)

**Observed:** Repo already scaffolded (Next.js 16, Tailwind v4, framer-motion) from a prior session, fully working but never committed to git, and never reviewed by Chip (Tim's ChatGPT product/UX partner in a parallel three-way workflow).

**What happened:** Verified the existing build (typecheck, lint, manual browser test), made the first commit. Reached Chip via Claude-in-Chrome browser automation to catch him up. Chip's product vision used a "content format" model (Breaking News, Animal Statement, etc.) that conflicted with the "recurring institution" model already built; proposed merging them into two layers (Universe = publisher, Format = document type within it) rather than picking one — Chip agreed this was stronger than his own original pitch.

**Decisions made:**
- Two-layer content model (universe + format) adopted over either original proposal.
- Replaced all placeholder copy with Chip's real entries.
- Added canvas-rendered share-image export + a "Copy Image" button (Chip's request), `/random` and `/archive` routes.
- Added a recurring "masthead" letterhead line and small bureaucratic "metadata" detail per universe (Chip's worldbuilding note).
- Flipped the visual hierarchy so the institution name is the hero, the joke secondary (Chip's biggest note — "people share *today's Committee meeting*, not *the app*").
- Prepped the `DailyItem` schema with optional `season`/`tags`/`callbacks`/`relatedDocuments` fields, unused at the time, so future cross-referencing content wouldn't need a migration.

**Problems discovered:** ChatGPT's compose box submits on a bare Enter; sending multi-paragraph text with embedded `\n` via browser automation caused premature sends more than once. Fixed by typing as one flowing paragraph and submitting via a separate `Return` keypress instead of clicking a send-button coordinate (the button's position shifts as the box grows).

**Ideas deferred:** Per-universe seals/mascots (Chip: icons before mascots, and not yet). Annual cross-universe easter-egg event (Chip's "much later" idea).

**Stopping point:** Chip explicitly declared "Product Checkpoint 1 complete" — engineering container solid, content is now the limiting factor, not code.

---

## Session 2 — Product Checkpoints 2 & 3 (2026-07-16, continued)

**Context:** Tim overrode the "Tim + Chip write content together" plan Chip had proposed for Checkpoint 2, and directly assigned Claude the role of "Chief Archivist" — full autonomous worldbuilding, no per-step check-ins, come back with something substantial.

**Checkpoint 2 — the world bible.** Wrote `world/CONSTITUTION.md` (premise + three governing laws: nothing is fictional to the institutions, continuity over cleverness, nobody explains), `world/INSTITUTIONS.md` (full profile — purpose, personality, voice, taboos, relationships — for every institution), `world/TIMELINE.md` (13 shared historical events with slugs: the Goose Incident, the Tuesday Compromise, the Great Stapler Migration, the Missing Sock Inquiry, etc.), and `world/STYLE_GUIDE.md` (per-institution vocabulary substitutions, shared terminology, legendary objects, holiday calendar). Added two new institutions the brief explicitly suggested — the Bureau of Mild Emergencies and the Office of Public Clarifications (both founded 2009, neither will say why) — and renamed Lost & Found to The Lost & Found Authority for tonal consistency with the other seven. Replaced the 10-item placeholder content pool with 50 real Daily Items across all eight institutions, most tagged to a timeline event and cross-referencing at least one other item.

**Checkpoint 3 — supporting artifacts.** Brief: "expand horizontally, not vertically" — build the documents that make the bureaucracy feel inhabited, not more jokes. Built cross-institution infrastructure first (`world/artifacts/FILING_SYSTEM.md` reference-number formats per institution, `SEALS_AND_SIGNATURES.md`, `ORG_CHART.md` — deliberately headless), then deep dives for two flagship institutions (DEIR: employee handbook, procedural manual, rejected-proposals log, annual report; Committee: meeting agenda template, subcommittee directory, inter-institution correspondence), then one-or-two-artifact treatments for the remaining six so the whole world has *something* without runaway scope.

**Problems discovered and fixed mid-build:** Two internal-consistency slips, caught by manual review before committing — (1) the Museum catalog cited a DEIR finding reference number that collided with an unrelated rejected-proposal number in the same institution's log; (2) a Lost & Found intake example used a `YEAR-CODE` reference format that didn't match the plain 4-digit format `FILING_SYSTEM.md` itself specifies. Both fixed. This is the moment that motivated Session 3's actual task — catching this by re-reading docs by hand doesn't scale.

**Verification:** tsc clean, eslint clean, all four routes spot-checked live in the browser (archive listing, random rolls across old and new institutions, cross-references rendering correctly on-page).

**Stopping point:** Both checkpoints delivered and committed; reported back to Tim with a recommendation to either continue or pause for review.

---

## Session 3 — Autonomous ownership begins; content-consistency test suite (2026-07-16, continued)

**New mandate:** Tim granted standing authority — lead engineer and day-to-day product owner, act without waiting for approval when a decision is justified by the Constitution/World Bible, maintain this journal, keep commits small and justified, verify build/run/integration/continuity before every checkpoint, stop and ask only when a decision would materially change product direction.

**What I observed:** The product's entire value proposition rests on "absolute internal consistency" (Constitution, Second Law) — but the only thing enforcing that so far was a human (me) re-reading 50 Daily Items and a dozen markdown files by hand. Session 2 already produced two real consistency bugs that only surfaced through manual review. That doesn't scale as more content gets added, by Claude, Chip, or Tim. This was the clearest, most objectively justified weakness to address — not a feature, not polish, a missing safety net under the thing the whole product depends on.

**Alternatives considered:**
- *Do nothing, keep manually reviewing* — rejected; already demonstrably missed two bugs this session alone.
- *Full test framework (vitest/jest)* — rejected as heavier than needed (config, transform setup) for a repo that otherwise has zero test infrastructure and a deliberately minimal dependency list.
- *A plain ad-hoc verification script, no test framework* — considered; rejected in favor of Node's built-in test runner because it gives per-assertion pass/fail reporting and `npm test`/CI-hookability for free, at the same complexity cost as a script.
- *node:test + tsx* (chosen) — one new devDependency, zero config files, consistent with the project's existing minimalism.

**Decisions made:**
1. Refactored `getTodayItem`/`getYesterdayItem` in `src/lib/content.ts` to accept an optional, injectable `now: Date` parameter (defaulting to the real clock) instead of calling `new Date()` internally — makes date-boundary behavior testable without monkeypatching globals. Committed separately from the tests themselves since it's a distinct, complete idea.
2. Added `src/lib/timeline.ts` as the canonical list of `TIMELINE_SLUGS`, mirroring `world/TIMELINE.md`'s slug column by hand (no shared build step yet — premature at 13 entries).
3. Added `src/lib/content.test.ts` (8 tests via `node --import tsx --test`): id uniqueness, valid universe references, valid `relatedDocuments`/`callbacks` references, valid `tags` against `TIMELINE_SLUGS`, one-sided-reference detection, full-rotation coverage with no gaps, epoch-boundary behavior for "yesterday," and day-key formatting.
4. Added `npm test` script.

**Problems discovered:** My first draft of the epoch-boundary test monkeypatched the global `Date` constructor to freeze "now" — fragile, easy to get subtly wrong, hard to read. Replaced with the injectable-clock refactor above instead; much simpler test, and arguably better production code besides (dependency injection over global mutation).

**Verification performed:** `npm test` (8/8 pass), `npx tsc --noEmit` (clean), `npx eslint .` (clean), `npm run build` (first actual production build this session — succeeded, all four routes present with expected static/dynamic rendering), and a live dev-server check (`curl` 200 on all four routes).

**Also investigated:** `npm install` surfaced 2 moderate-severity npm audit findings. Traced them to a PostCSS XSS advisory nested inside Next.js's *own* bundled `postcss` dependency (a build-time CSS stringifier concern, not something exercised by user input in this app). npm's suggested fix would force-downgrade Next.js from 16.2.10 to a 2019-era `9.3.3` canary — a clearly worse trade than the advisory itself. No action taken; noting the investigation here so it isn't silently ignored.

**Ideas deferred:**
- Enforcing recurring `format` strings against a fixed list per institution — deferred; new formats should stay easy to introduce without touching a schema.
- Building `world/TIMELINE.md` and `src/lib/timeline.ts` from one shared source — deferred as unnecessary complexity at the current scale (13 events).
- Surfacing any of the world-bible material (institution profiles, artifacts) *in the app itself* for real visitors — this is a genuine option (an "About this institution" style page would be true to how a real bureaucracy presents itself) but touches the Constitution's "nobody explains, mystery is part of the charm" principle directly enough that it's a product-direction call, not an engineering one. Flagging for Tim rather than building it.

**Recommended next direction:** Three reasonable options, not mutually exclusive:
1. **Ship/soft-launch as-is** — the product is coherent, tested, and has real depth (50 items, 8 institutions, full world bible) for a v1. Diminishing returns start soon on more solo engineering work without real user reactions to learn from.
2. **A short Chip pass** — bring the finished world bible back to Chip for a Museum Test / voice-consistency review pass across all 50 items now that they exist as a set, before investing further.
3. **Decide the "surfacing the lore" question** — if there's appetite for a light in-app institution page, that's a real design decision worth making deliberately rather than defaulting either way.

My own recommendation, if asked to pick one: **option 1 or 2** — the code and world are in good shape; the highest-leverage next move is getting real reactions (from Chip, from Tim, or from actual visitors) rather than more unreviewed content or engineering.
