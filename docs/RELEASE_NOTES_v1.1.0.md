# The Daily Nonsense v1.1.0: release notes (DRAFT; pending owner editorial sign-off and merge)

**What v1.1.0 is:** decision C from `docs/CONTENT_ROTATION_MEMO.md`. It adds 29 new documents, a schedule that never rewrites history, duplicate detection, and a written intake process for future issues. Branch `content/v1.1`, built on `closeout/v1.0` (`c9cdd6c`).

## For readers
- **Issue 2: 29 new documents**, one per day from **Sunday 2026-11-01** to 2026-11-29. They cover all eight institutions: Department 4, Museum 5, Committee 4, Wildlife 3, Lost & Found 4, Notices 3, Bureau 3, Office 3.
- After that, the 79-item library rotates in reshuffled cycles. No document repeats within 30 days, and there's no fixed 50-day loop any more.
- **Every past date is unchanged.** Permalinks, the calendar and RSS show exactly what they showed before.
- The archive and `/random` include a new document only once its day has come.

## Under the hood
- `src/lib/rotation.ts`: a pure date-to-document scheduler. v1 is frozen before the cutover, then issue premieres, then the long-term rotation.
- `src/lib/contentIssue2.ts`: the new items. `content/BACKLOG.md`: 38 pending premises, a status flow, the editorial checklist and the scheduling rules.
- Tests went from **30 to 64**:
  - golden history: 304 dates, a v1 content hash and an independent algorithm check;
  - scheduler properties;
  - the real schedule;
  - duplicate detection;
  - voice checks.
- `npm run check:duplicates`.
- `/archive` is now rendered per request, like the other date-dependent routes.

## Owner steps to ship
1. **Editorial sign-off on the 29 new items** (`src/lib/contentIssue2.ts`). Edits are free until 2026-11-01. After that, each item is published history.
2. Merge `content/v1.1` into `master` **before about 2026-10-29**. A push deploys. If it's later than that, first move `CUTOVER_DAY_KEY` in `src/lib/content.ts` (Issue 2 starts on it) to a date at least 3 days after the deploy. Then extend the golden fixture through the new day before the cutover; the independent v1 re-implementation test validates the added rows. Finally, update the date assertions in `history.test.ts` and `schedule.test.ts`.
3. Confirm CI is green, then tag `v1.1.0`. (v1.0.0's own tag is still pending, per its notes.)
