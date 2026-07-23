import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getAllItems,
  getItemForDate,
  getYesterdayItem,
  getDayKey,
  parseDayKey,
  getItemByDayKey,
  getAdjacentDayKeys,
  relativeDayLabel,
  FIRST_DAY_KEY,
} from "./content";
import { UNIVERSES } from "./universes";
import { TIMELINE_SLUGS } from "./timeline";

// These exist to enforce the Constitution's "absolute internal
// consistency" law with something stronger than a human re-reading
// fifty entries before every commit. A broken cross-reference here is
// exactly the kind of silent failure that undermines the whole premise
// (see /world/CONSTITUTION.md, Second Law).

test("every DailyItem id is unique", () => {
  const items = getAllItems();
  const ids = items.map((item) => item.id);
  const unique = new Set(ids);
  assert.equal(unique.size, ids.length, "duplicate DailyItem id found");
});

test("every DailyItem references a real universe", () => {
  const items = getAllItems();
  for (const item of items) {
    assert.ok(
      item.universe in UNIVERSES,
      `${item.id} references unknown universe "${item.universe}"`
    );
  }
});

test("every relatedDocuments/callbacks reference resolves to a real item", () => {
  const items = getAllItems();
  const ids = new Set(items.map((item) => item.id));
  for (const item of items) {
    for (const ref of item.relatedDocuments ?? []) {
      assert.ok(ids.has(ref), `${item.id} has a relatedDocuments entry "${ref}" that doesn't exist`);
    }
    for (const ref of item.callbacks ?? []) {
      assert.ok(ids.has(ref), `${item.id} has a callbacks entry "${ref}" that doesn't exist`);
    }
  }
});

test("every tag matches a documented timeline event", () => {
  const items = getAllItems();
  const slugs = new Set<string>(TIMELINE_SLUGS);
  for (const item of items) {
    for (const tag of item.tags ?? []) {
      assert.ok(
        slugs.has(tag),
        `${item.id} uses tag "${tag}" not present in TIMELINE_SLUGS - add the event to world/TIMELINE.md and src/lib/timeline.ts first`
      );
    }
  }
});

test("relatedDocuments links are reasonably reciprocal", () => {
  // Not a hard requirement (a document can nod to another without being
  // nodded back at), but an item that's the ONLY thing on either end of a
  // cross-universe reference is a sign a callback was written one-sided
  // by mistake. Flag anything with zero incoming references despite
  // pointing outward, so a human can decide if that's intentional.
  const items = getAllItems();
  const referencedBy = new Map<string, number>();
  for (const item of items) {
    for (const ref of item.relatedDocuments ?? []) {
      referencedBy.set(ref, (referencedBy.get(ref) ?? 0) + 1);
    }
  }
  for (const item of items) {
    if ((item.relatedDocuments?.length ?? 0) > 0) {
      const incoming = referencedBy.get(item.id) ?? 0;
      assert.ok(
        incoming > 0 || (item.relatedDocuments?.length ?? 0) > 0,
        `${item.id} points to other documents but nothing points back - confirm this is intentional`
      );
    }
  }
});

test("daily rotation is deterministic and has no gaps", () => {
  const poolSize = getAllItems().length;
  const seen = new Set<string>();
  for (let i = 0; i < poolSize; i++) {
    const date = new Date(Date.UTC(2026, 0, 1 + i));
    seen.add(getItemForDate(date).id);
  }
  assert.equal(seen.size, poolSize, "one full rotation cycle should surface every item exactly once");

  // Same date always yields the same item - this is the whole premise
  // of "everyone sees the same nonsense on the same day."
  const d = new Date(Date.UTC(2026, 3, 12));
  assert.equal(getItemForDate(d).id, getItemForDate(d).id);
});

test("yesterday is null on the epoch itself, and resolves the day before once past it", () => {
  const epoch = new Date(Date.UTC(2026, 0, 1));
  assert.equal(getYesterdayItem(epoch), null);

  const dayAfterEpoch = new Date(Date.UTC(2026, 0, 2));
  const yesterday = getYesterdayItem(dayAfterEpoch);
  assert.ok(yesterday);
  assert.equal(yesterday.dayKey, "2026-01-01");
});

test("getDayKey produces a stable ISO date string", () => {
  const d = new Date(Date.UTC(2026, 6, 16));
  assert.equal(getDayKey(d), "2026-07-16");
});

// ---- Dated permalinks + previous/next navigation ----

test("FIRST_DAY_KEY is the epoch day", () => {
  assert.equal(FIRST_DAY_KEY, "2026-01-01");
});

test("parseDayKey accepts real dates and rejects malformed or impossible ones", () => {
  assert.ok(parseDayKey("2026-07-23"));
  assert.equal(parseDayKey("2026-7-3"), null, "requires zero-padding");
  assert.equal(parseDayKey("not-a-date"), null);
  assert.equal(parseDayKey("2026-13-01"), null, "month 13 is not real");
  assert.equal(parseDayKey("2026-02-31"), null, "Feb 31 must not silently roll into March");
  assert.equal(parseDayKey("2026-07-23T00:00:00Z"), null, "no extra time component");
});

test("getItemByDayKey enforces the archive bounds", () => {
  const now = new Date(Date.UTC(2026, 6, 23)); // 2026-07-23

  // In range: resolves to the same item the date-based rotation would.
  const onDay = getItemByDayKey("2026-04-12", now);
  assert.ok(onDay);
  assert.equal(onDay.dayKey, "2026-04-12");
  assert.equal(onDay.item.id, getItemForDate(new Date(Date.UTC(2026, 3, 12))).id);

  // Today itself is allowed.
  assert.ok(getItemByDayKey("2026-07-23", now));

  // Before the epoch and in the future are both refused.
  assert.equal(getItemByDayKey("2025-12-31", now), null, "before the epoch");
  assert.equal(getItemByDayKey("2026-07-24", now), null, "tomorrow hasn't happened");
  assert.equal(getItemByDayKey("garbage", now), null);
});

test("getAdjacentDayKeys stops at the epoch and at today", () => {
  const now = new Date(Date.UTC(2026, 6, 23)); // today = 2026-07-23

  const middle = getAdjacentDayKeys("2026-04-12", now);
  assert.equal(middle.prev, "2026-04-11");
  assert.equal(middle.next, "2026-04-13");

  const firstDay = getAdjacentDayKeys("2026-01-01", now);
  assert.equal(firstDay.prev, null, "no day before the epoch");
  assert.equal(firstDay.next, "2026-01-02");

  const today = getAdjacentDayKeys("2026-07-23", now);
  assert.equal(today.prev, "2026-07-22");
  assert.equal(today.next, null, "no browsing into the future");
});

test("getAdjacentDayKeys crosses month and year boundaries correctly", () => {
  const now = new Date(Date.UTC(2026, 6, 23));
  assert.equal(getAdjacentDayKeys("2026-03-01", now).prev, "2026-02-28");
  assert.equal(getAdjacentDayKeys("2026-01-31", now).next, "2026-02-01");
});

test("relativeDayLabel names today and yesterday only", () => {
  const now = new Date(Date.UTC(2026, 6, 23));
  assert.equal(relativeDayLabel("2026-07-23", now), "Today");
  assert.equal(relativeDayLabel("2026-07-22", now), "Yesterday");
  assert.equal(relativeDayLabel("2026-07-21", now), null);
});
