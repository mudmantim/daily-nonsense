# Content rotation: decision memo (measured 2026-10-15; no change made)

## What the code does (`src/lib/content.ts`)
- `ROTATION = seededShuffle(CONTENT_POOL, 20260101)`: one fixed order, the same on every build and server.
- `getItemForDate(date)` = `ROTATION[daysSinceEpoch(date) mod ROTATION.length]`, with an epoch of 2026-01-01 UTC.

## Measured (offline, by evaluating the shipped module for 400 consecutive days)
- **50 unique items, repeating exactly every 50 days.**
- 2026-10-15 is day 287 after the epoch, so **5 full cycles are complete**. Daily readers are on their 6th pass through the same 50 documents, **in the same order** every time.
- The archive, calendar, permalinks and RSS faithfully show that repetition. A reader browsing the calendar sees the same document on dates 50 days apart.

## Options (a product decision for the owner; none implemented)
| | Option | Archive and permalinks | Effort | Notes |
|---|---|---|---|---|
| A | **Accept it as is:** document it in the README and the about text | unchanged | none | Honest, zero risk. The joke doesn't depend on novelty for long-time readers |
| B | **Re-shuffle each cycle:** `seededShuffle(CONTENT_POOL, 20260101 + cycleNumber)` | **every date stays stable** (a function of the date alone) | small: one function plus tests for stability and the each-item-once-per-cycle property | Same content, but no fixed sequence, so repeats feel less mechanical. **Changes which item appears on future dates** (and on past dates within the current cycle, unless cycle 0–5 keep the old seed). Needs a decision on whether past dates may change: recommended **no**, by keeping the old order for days before the switch date |
| C | **New issues** (more items, through the Editorial Desk process) | extends the pool; dates after the change shift unless items are appended in a new block | content work, not code | The project's own Session 9 stance is "no new content until Tim says so". Chip's standing recommendation (Session 7) was the next issue |

**Recommendation:** A now (document it, in v1.0.0), then decide between B and C as v1.1. B, with past dates frozen, is the cheapest real improvement. C is the real product growth.
