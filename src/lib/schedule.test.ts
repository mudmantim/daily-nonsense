import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getAllItems,
  getItemForDate,
  getItemByDayKey,
  getPublishedItems,
  getRandomItem,
  getRecentDays,
  CUTOVER_DAY_KEY,
  ISSUES,
  MIN_REPEAT_GAP_DAYS,
} from "./content";
import { V1_POOL_IDS } from "./fixtures/v1Schedule.golden";

// The real v1.1 schedule (the engine's general properties are in
// rotation.test.ts; frozen pre-cutover history is in history.test.ts).

const DAY = 86_400_000;
const utc = (dayKey: string) => new Date(`${dayKey}T00:00:00.000Z`);
const CUTOVER = utc(CUTOVER_DAY_KEY);
const at = (offset: number) => new Date(CUTOVER.getTime() + offset * DAY);
const idAt = (offset: number) => getItemForDate(at(offset)).id;
const PREMIERES = ISSUES[0].premieres;

test("the cutover is 2026-11-01, after the v1.1 build date, and issue 2 starts on it", () => {
  assert.equal(CUTOVER_DAY_KEY, "2026-11-01");
  assert.ok(CUTOVER.getTime() > utc("2026-10-15").getTime(), "cutover must be after the build date");
  assert.equal(ISSUES[0].startDayKey, CUTOVER_DAY_KEY);
});

test("the pool is exactly the v1 items plus every issue's premieres, nothing orphaned", () => {
  const scheduled = [...V1_POOL_IDS, ...ISSUES.flatMap((issue) => issue.premieres)];
  assert.equal(new Set(scheduled).size, scheduled.length, "an id is premiered twice");
  assert.deepEqual(
    getAllItems().map((item) => item.id).sort(),
    [...scheduled].sort(),
    "every item must be v1 or premiered by exactly one issue"
  );
});

test("from the cutover, each new item runs exactly once, in manifest order, before any repeat", () => {
  const firstDays = Array.from({ length: PREMIERES.length }, (_, i) => idAt(i));
  assert.deepEqual(firstDays, [...PREMIERES]);
  const v1 = new Set(V1_POOL_IDS);
  for (const id of PREMIERES) assert.ok(!v1.has(id), `${id} is not new`);
});

test("premieres never put the same institution on consecutive days", () => {
  const universe = new Map(getAllItems().map((item) => [item.id, item.universe]));
  for (let i = 1; i < PREMIERES.length; i++) {
    assert.notEqual(universe.get(PREMIERES[i]), universe.get(PREMIERES[i - 1]), `${PREMIERES[i - 1]} -> ${PREMIERES[i]}`);
  }
});

test("after the premieres, each rotation cycle is a permutation of the full library", () => {
  const n = getAllItems().length;
  const all = getAllItems().map((item) => item.id).sort();
  for (let c = 0; c < 25; c++) {
    const cycle = Array.from({ length: n }, (_, p) => idAt(PREMIERES.length + c * n + p));
    assert.deepEqual([...cycle].sort(), all, `cycle ${c}`);
  }
});

test(`no document repeats within ${MIN_REPEAT_GAP_DAYS} days, from the epoch through 2046`, () => {
  const last = new Map<string, number>();
  const end = Date.UTC(2047, 0, 1);
  for (let t = Date.UTC(2026, 0, 1), day = 0; t < end; t += DAY, day++) {
    const id = getItemForDate(new Date(t)).id;
    const prev = last.get(id);
    if (prev !== undefined) {
      assert.ok(
        day - prev >= MIN_REPEAT_GAP_DAYS,
        `${id} repeated after ${day - prev} days on ${new Date(t).toISOString().slice(0, 10)}`
      );
    }
    last.set(id, day);
  }
});

test("dates between the build date and the cutover keep v1 behaviour", () => {
  // 2026-10-15 .. 2026-10-31 continue the 50-day v1 cycle unchanged.
  for (let t = utc("2026-10-15").getTime(); t < CUTOVER.getTime(); t += DAY) {
    const d = new Date(t);
    const fiftyEarlier = new Date(t - 50 * DAY);
    assert.equal(getItemForDate(d).id, getItemForDate(fiftyEarlier).id, d.toISOString());
  }
});

test("the schedule is a pure function of the date", () => {
  const d = at(400);
  assert.equal(getItemForDate(d).id, getItemForDate(new Date(d.getTime() + 13 * 3_600_000)).id, "time of day is ignored");
  assert.equal(getItemForDate(d).id, getItemForDate(new Date(d.getTime())).id);
});

test("permalinks, RSS and bounds work across the cutover", () => {
  const now = at(10);
  assert.equal(getItemByDayKey("2026-10-31", now)?.item.id, getItemForDate(utc("2026-10-31")).id);
  assert.equal(getItemByDayKey(CUTOVER_DAY_KEY, now)?.item.id, PREMIERES[0]);
  assert.equal(getItemByDayKey("2026-11-12", now), null, "the future stays closed");
  assert.equal(getItemByDayKey("2025-12-31", now), null, "nothing before the epoch");
  const recent = getRecentDays(15, now);
  assert.equal(recent[0].dayKey, "2026-11-11");
  assert.equal(recent[0].item.id, PREMIERES[10]);
  assert.equal(recent[14].dayKey, "2026-10-28");
});

test("only published items reach the archive and /random", () => {
  const before = getPublishedItems(utc("2026-10-15"));
  assert.deepEqual(before.map((i) => i.id), [...V1_POOL_IDS], "nothing new is visible before the cutover");
  assert.equal(getPublishedItems(at(0)).length, 51);
  assert.ok(getPublishedItems(at(0)).some((i) => i.id === PREMIERES[0]));
  assert.ok(!getPublishedItems(at(0)).some((i) => i.id === PREMIERES[1]), "tomorrow's premiere stays hidden");
  assert.equal(getPublishedItems(at(PREMIERES.length - 1)).length, getAllItems().length);
  for (let i = 0; i < 200; i++) {
    const id = getRandomItem(utc("2026-10-15")).id;
    assert.ok(V1_POOL_IDS.includes(id), `/random served unpublished ${id}`);
  }
});
