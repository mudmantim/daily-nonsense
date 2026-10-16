import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  getAllItems,
  getItemForDate,
  getItemByDayKey,
  getRecentDays,
  FIRST_DAY_KEY,
} from "./content";
import { V1_GOLDEN_SCHEDULE, V1_POOL_IDS, V1_POOL_SHA256 } from "./fixtures/v1Schedule.golden";

// Published history is append-only. Every date from the epoch up to the
// v1.1 cutover has already been (or will have been, by the time v1.1
// ships) served to readers, linked from RSS guids and permalinks, and
// shown in the calendar. These tests pin that history to a committed
// fixture generated from the unmodified v1 code, so no future change to
// the pool or the scheduler can silently rewrite a past day.

const GOLDEN_FIRST = "2026-01-01";
const GOLDEN_LAST = "2026-10-31"; // the day before the v1.1 cutover

function utc(dayKey: string): Date {
  return new Date(`${dayKey}T00:00:00.000Z`);
}

test("golden fixture covers every date from the epoch through the day before cutover", () => {
  assert.equal(V1_GOLDEN_SCHEDULE.length, 304);
  assert.equal(V1_GOLDEN_SCHEDULE[0][0], GOLDEN_FIRST);
  assert.equal(V1_GOLDEN_SCHEDULE[0][0], FIRST_DAY_KEY);
  assert.equal(V1_GOLDEN_SCHEDULE[V1_GOLDEN_SCHEDULE.length - 1][0], GOLDEN_LAST);
  for (let i = 1; i < V1_GOLDEN_SCHEDULE.length; i++) {
    const prev = utc(V1_GOLDEN_SCHEDULE[i - 1][0]).getTime();
    const cur = utc(V1_GOLDEN_SCHEDULE[i][0]).getTime();
    assert.equal(cur - prev, 86_400_000, `gap in fixture at ${V1_GOLDEN_SCHEDULE[i][0]}`);
  }
});

test("every pre-cutover date resolves to exactly the document v1 published", () => {
  const mismatches: string[] = [];
  for (const [dayKey, expectedId] of V1_GOLDEN_SCHEDULE) {
    const actual = getItemForDate(utc(dayKey)).id;
    if (actual !== expectedId) mismatches.push(`${dayKey}: expected ${expectedId}, got ${actual}`);
  }
  assert.deepEqual(mismatches, [], `published history changed:\n${mismatches.slice(0, 10).join("\n")}`);
});

test("pre-cutover permalinks and RSS entries resolve to the golden document", () => {
  const now = utc(GOLDEN_LAST);
  for (const [dayKey, expectedId] of V1_GOLDEN_SCHEDULE) {
    const resolved = getItemByDayKey(dayKey, now);
    assert.ok(resolved, `${dayKey} should be in range`);
    assert.equal(resolved.item.id, expectedId, `/day/${dayKey}`);
  }
  const golden = new Map(V1_GOLDEN_SCHEDULE.map(([k, id]) => [k, id]));
  for (const { dayKey, item } of getRecentDays(V1_GOLDEN_SCHEDULE.length, now)) {
    assert.equal(item.id, golden.get(dayKey), `RSS entry ${dayKey}`);
  }
});

test("the golden fixture agrees with an independent re-implementation of the v1 algorithm", () => {
  // Belt and braces: the v1 algorithm, copied here verbatim and run over
  // the frozen id list, so the fixture itself is checked against the
  // algorithm and not only against whatever content.ts does today.
  function mulberry32(seed: number) {
    return function random() {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const rand = mulberry32(20260101);
  const rotation = [...V1_POOL_IDS];
  for (let i = rotation.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [rotation[i], rotation[j]] = [rotation[j], rotation[i]];
  }
  V1_GOLDEN_SCHEDULE.forEach(([dayKey, id], day) => {
    assert.equal(rotation[day % 50], id, dayKey);
  });
});

test("the 50 v1 items are present, in their original order, and unedited", () => {
  const v1 = new Set(V1_POOL_IDS);
  const items = getAllItems().filter((item) => v1.has(item.id));
  assert.deepEqual(
    items.map((item) => item.id),
    [...V1_POOL_IDS],
    "v1 items must keep their original declaration order"
  );
  const hash = createHash("sha256").update(JSON.stringify(items)).digest("hex");
  assert.equal(hash, V1_POOL_SHA256, "a published v1 item was edited; v1 copy is frozen");
});
