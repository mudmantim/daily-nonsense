# The Daily Nonsense v1.2.0: release notes (DRAFT; owner editorial sign-off pending, not merged, not deployed)

**What v1.2.0 is:** Issue 3, the second content issue under the v1.1 scheduler. 28 new documents and nothing else: no code path changes, no edits to any published or queued item. Branch `content/issue-3`, built on `content/v1.1` (`e023af6`, which is what is live as of 2026-10-17).

## For readers
- **Issue 3: 28 new documents**, one per day from **Tuesday 2026-12-01** to 2026-12-28. All eight institutions: Department 4, Museum 4, Committee 4, Wildlife 3, Lost & Found 4, Notices 3, Bureau 3, Office 3. Seven are rare.
- From 2026-12-29 the 107-item library rotates in reshuffled cycles, still with no document repeating within 30 days.
- **Every earlier date is unchanged**, including all of Issue 2 (2026-11-01 to 2026-11-29) and the rotation day 2026-11-30.
- The archive and `/random` include each new document only once its day has come.

## Under the hood
- `src/lib/contentIssue3.ts`: the items and premiere order. `src/lib/content.ts`: the pool append and one new `ISSUES` entry (`issue-3`, start `2026-12-01`, seed `20261201`).
- `src/lib/issue3.test.ts` (8 tests): premieres in order from Dec 1, no institution on consecutive days, ids continuing each numbering, Nov 1–30 pinned to the live schedule, and, for every appended issue on the real manifest, the schedule rebuilt without it agreeing on every earlier date. Two `schedule.test.ts` checks that assumed Issue 2 was the last issue were generalized. Tests: **64 → 72**.
- `world/artifacts/*` record the new reference numbers (`MUH-EX-446`–`448`, Proposal 0650, `LFA-1816`–`1818`, `OPN-4472`–`4474`, `BME-SR-0419`–`0420`, `OPC-NC-0216`–`0220`); `FILING_SYSTEM.md` gains a "highest number on file" table. `content/BACKLOG.md`: used ideas moved to "Used", new ideas added.

## Owner steps to ship
1. **Editorial sign-off on the 28 items** (`src/lib/contentIssue3.ts`). Edits are free until each item's premiere date.
2. Merge `content/issue-3` and deploy **by 2026-11-24** (at least 7 days before 2026-12-01). If the deploy will be later than that, first move `startDayKey` and `seed` of the `issue-3` entry later (at least 7 days after the deploy) and update the dates in `src/lib/issue3.test.ts`. Never deploy it after 2026-12-01 with that start date: dates readers already saw would change.
3. Run `npm run verify` (including `next build`) on a normal checkout, confirm CI is green, then tag `v1.2.0`.
