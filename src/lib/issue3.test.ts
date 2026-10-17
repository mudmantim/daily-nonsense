import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getAllItems,
  getItemForDate,
  getPublishedItems,
  ISSUES,
  MIN_REPEAT_GAP_DAYS,
} from "./content";
import { createSchedule, seededShuffle } from "./rotation";
import { V1_POOL_IDS } from "./fixtures/v1Schedule.golden";

// Issue 3 (v1.2) on the real manifest: it premieres from 2026-12-01 and,
// like every appended issue, must leave every earlier date exactly as it
// was. Engine-level properties are in rotation.test.ts; Issue 2 and the
// general real-schedule checks are in schedule.test.ts.

const DAY = 86_400_000;
const EPOCH = Date.UTC(2026, 0, 1);
const utc = (dayKey: string) => new Date(`${dayKey}T00:00:00.000Z`);
const dayIndex = (dayKey: string) => Math.round((utc(dayKey).getTime() - EPOCH) / DAY);
const dayKeyOf = (day: number) => new Date(EPOCH + day * DAY).toISOString().slice(0, 10);

const ISSUE_3 = ISSUES.find((issue) => issue.id === "issue-3")!;
const START = utc("2026-12-01");
const at = (offset: number) => new Date(START.getTime() + offset * DAY);

test("issue 3 is the last manifest entry, starts 2026-12-01, and follows issue 2 without overlap", () => {
  assert.ok(ISSUE_3, "issue-3 is in ISSUES");
  assert.equal(ISSUES[ISSUES.length - 1].id, "issue-3");
  assert.equal(ISSUE_3.startDayKey, "2026-12-01");
  assert.equal(ISSUE_3.seed, 20261201);
  const issue2 = ISSUES[ISSUES.length - 2];
  assert.equal(issue2.id, "issue-2");
  assert.ok(
    dayIndex(ISSUE_3.startDayKey) >= dayIndex(issue2.startDayKey) + issue2.premieres.length,
    "issue 3 must not start before issue 2 has finished its premieres"
  );
  assert.ok(ISSUE_3.premieres.length >= 24 && ISSUE_3.premieres.length <= 32);
});

test("issue 3 premieres each new item exactly once, in manifest order, from 2026-12-01", () => {
  const firstDays = ISSUE_3.premieres.map((_, i) => getItemForDate(at(i)).id);
  assert.deepEqual(firstDays, [...ISSUE_3.premieres]);
  const earlier = new Set([...V1_POOL_IDS, ...ISSUES.filter((i) => i !== ISSUE_3).flatMap((i) => i.premieres)]);
  for (const id of ISSUE_3.premieres) assert.ok(!earlier.has(id), `${id} is not new`);
  // None of them runs on any day before its premiere.
  const premiereDay = new Map(ISSUE_3.premieres.map((id, i) => [id, dayIndex("2026-12-01") + i]));
  for (let day = 0; day < dayIndex("2026-12-01") + ISSUE_3.premieres.length; day++) {
    const id = getItemForDate(new Date(EPOCH + day * DAY)).id;
    const first = premiereDay.get(id);
    if (first !== undefined) assert.equal(day, first, `${id} ran on ${dayKeyOf(day)}, before its premiere`);
  }
});

test("issue 3 covers all eight institutions, 3-4 items each, ids continuing each numbering", () => {
  const byId = new Map(getAllItems().map((item) => [item.id, item]));
  const counts = new Map<string, number>();
  for (const id of ISSUE_3.premieres) {
    const u = byId.get(id)!.universe;
    counts.set(u, (counts.get(u) ?? 0) + 1);
  }
  assert.equal(counts.size, 8, "every institution is represented");
  for (const [u, n] of counts) assert.ok(n >= 3 && n <= 4, `${u} has ${n} items`);
  // Each institution's new ids continue straight on from its highest
  // earlier id, with no gaps or reuse.
  const earlierMax = new Map<string, number>();
  for (const item of getAllItems()) {
    if (ISSUE_3.premieres.includes(item.id)) continue;
    const n = Number(item.id.split("-").pop());
    earlierMax.set(item.universe, Math.max(earlierMax.get(item.universe) ?? 0, n));
  }
  for (const [u, count] of counts) {
    const nums = ISSUE_3.premieres
      .filter((id) => byId.get(id)!.universe === u)
      .map((id) => Number(id.split("-").pop()))
      .sort((a, b) => a - b);
    const first = earlierMax.get(u)! + 1;
    assert.deepEqual(nums, Array.from({ length: count }, (_, i) => first + i), `${u} ids`);
  }
});

test("issue 3 never puts the same institution on consecutive days, including the day before it starts", () => {
  const universe = (d: Date) => getItemForDate(d).universe;
  for (let i = 0; i < ISSUE_3.premieres.length; i++) {
    assert.notEqual(universe(at(i)), universe(at(i - 1)), `${getItemForDate(at(i - 1)).id} -> ${getItemForDate(at(i)).id}`);
  }
});

test("2026-11-01 .. 2026-11-30 are exactly what content/v1.1 (live) schedules", () => {
  // Pinned from the unmodified content/v1.1 schedule (e023af6), generated
  // before issue 3 was added: Issue 2's 29 premieres, then one rotation day.
  const expected = [
    "committee-7", "lostfound-8", "deir-8", "museum-8", "wildlife-7", "clarifications-7", "bureau-7",
    "notices-9", "deir-9", "museum-10", "lostfound-7", "committee-10", "wildlife-9", "bureau-8",
    "museum-9", "clarifications-9", "deir-10", "notices-7", "lostfound-9", "committee-8", "museum-11",
    "wildlife-8", "bureau-9", "notices-8", "deir-11", "lostfound-10", "clarifications-8", "committee-9",
    "museum-12", "notices-3",
  ];
  const actual = expected.map((_, i) => getItemForDate(new Date(utc("2026-11-01").getTime() + i * DAY)).id);
  assert.deepEqual(actual, expected);
});

test("appending each issue changes no date before its start (real manifest)", () => {
  // Rebuild the schedule from the real manifest truncated before issue k
  // and compare every date from the epoch up to issue k's start. For
  // issue 3, that is every date through 2026-11-30.
  const v1Rotation = seededShuffle(V1_POOL_IDS, 20260101);
  const scheduled = ISSUES.map((issue) => ({ ...issue, startDay: dayIndex(issue.startDayKey) }));
  for (let k = 1; k < ISSUES.length; k++) {
    const without = createSchedule({ v1Rotation, issues: scheduled.slice(0, k), minRepeatGap: MIN_REPEAT_GAP_DAYS });
    const mismatches: string[] = [];
    for (let day = 0; day < scheduled[k].startDay; day++) {
      const live = getItemForDate(new Date(EPOCH + day * DAY)).id;
      if (live !== without.idForDay(day)) mismatches.push(`${dayKeyOf(day)}: ${without.idForDay(day)} -> ${live}`);
    }
    assert.deepEqual(mismatches, [], `${ISSUES[k].id} changed earlier dates:\n${mismatches.slice(0, 10).join("\n")}`);
  }
});

test("after issue 3's premieres, nothing repeats within the minimum gap across the boundary", () => {
  const last = new Map<string, number>();
  const from = dayIndex("2026-11-01");
  const to = dayIndex("2027-12-31");
  for (let day = from - MIN_REPEAT_GAP_DAYS; day <= to; day++) {
    const id = getItemForDate(new Date(EPOCH + day * DAY)).id;
    const prev = last.get(id);
    if (prev !== undefined) assert.ok(day - prev >= MIN_REPEAT_GAP_DAYS, `${id} repeated on ${dayKeyOf(day)}`);
    last.set(id, day);
  }
});

test("issue 3 items stay out of the archive and /random until their premiere", () => {
  const before = getPublishedItems(utc("2026-11-30"));
  assert.equal(before.length, getAllItems().length - ISSUE_3.premieres.length);
  assert.ok(!before.some((i) => ISSUE_3.premieres.includes(i.id)));
  const firstDay = getPublishedItems(at(0));
  assert.ok(firstDay.some((i) => i.id === ISSUE_3.premieres[0]));
  assert.ok(!firstDay.some((i) => i.id === ISSUE_3.premieres[1]), "tomorrow's premiere stays hidden");
  assert.equal(getPublishedItems(at(ISSUE_3.premieres.length - 1)).length, getAllItems().length);
});
