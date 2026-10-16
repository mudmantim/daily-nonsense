import { test } from "node:test";
import assert from "node:assert/strict";
import { createSchedule, repairBoundary, seededShuffle, ScheduleConfig, ScheduledIssue } from "./rotation";

// Engine-level properties of the scheduler, on synthetic ids so they hold
// regardless of what the real pool contains. The real schedule gets the
// same checks in schedule.test.ts.

const V1 = seededShuffle(
  Array.from({ length: 50 }, (_, i) => `v1-${i}`),
  20260101
);
const NEW_A = Array.from({ length: 24 }, (_, i) => `a-${i}`);
const ISSUE_A: ScheduledIssue = { id: "issue-a", startDay: 304, seed: 7, premieres: NEW_A };
const BASE: ScheduleConfig = { v1Rotation: V1, issues: [ISSUE_A], minRepeatGap: 30 };
const HORIZON = 304 + 365 * 15;

function run(config: ScheduleConfig, from: number, to: number): string[] {
  const s = createSchedule(config);
  const out: string[] = [];
  for (let d = from; d < to; d++) out.push(s.idForDay(d));
  return out;
}

function minGap(ids: string[]): { gap: number; id: string; at: number } {
  const last = new Map<string, number>();
  let worst = { gap: Infinity, id: "", at: -1 };
  ids.forEach((id, day) => {
    const prev = last.get(id);
    if (prev !== undefined && day - prev < worst.gap) worst = { gap: day - prev, id, at: day };
    last.set(id, day);
  });
  return worst;
}

test("before the first issue the schedule is exactly the v1 rotation", () => {
  const ids = run(BASE, -120, 304);
  ids.forEach((id, i) => {
    const day = i - 120;
    assert.equal(id, V1[((day % 50) + 50) % 50], `day ${day}`);
  });
});

test("an issue premieres each new item exactly once, in manifest order, before any repeat", () => {
  const ids = run(BASE, 304, 304 + NEW_A.length);
  assert.deepEqual(ids, NEW_A);
  const before = new Set(run(BASE, 0, 304));
  for (const id of NEW_A) assert.ok(!before.has(id), `${id} ran before its premiere`);
});

test("after the premieres, every rotation cycle is a permutation of the library", () => {
  const s = createSchedule(BASE);
  const lib = s.libraryOf(0);
  assert.equal(lib.length, 74);
  const start = 304 + NEW_A.length;
  for (let c = 0; c < 60; c++) {
    const cycle: string[] = [];
    for (let p = 0; p < lib.length; p++) cycle.push(s.idForDay(start + c * lib.length + p));
    assert.deepEqual([...cycle].sort(), [...lib].sort(), `cycle ${c}`);
  }
});

test("cycles are reshuffled, not repeated in a fixed order", () => {
  const s = createSchedule(BASE);
  const n = s.libraryOf(0).length;
  const start = 304 + NEW_A.length;
  const cycle = (c: number) => Array.from({ length: n }, (_, p) => s.idForDay(start + c * n + p)).join();
  assert.notEqual(cycle(0), cycle(1));
  assert.notEqual(cycle(1), cycle(2));
});

test("no id repeats within the minimum gap, across cycle and segment boundaries", () => {
  const ids = run(BASE, 0, HORIZON);
  const worst = minGap(ids);
  assert.ok(worst.gap >= 30, `"${worst.id}" repeated after ${worst.gap} days (day ${worst.at})`);
});

test("the schedule is deterministic and independent of evaluation order", () => {
  const a = createSchedule(BASE);
  const b = createSchedule(BASE);
  // b is asked about a far-future day first, forcing it to build every
  // intermediate cycle out of order relative to a.
  const far = HORIZON - 1;
  const farB = b.idForDay(far);
  const seqA = run(BASE, 0, HORIZON);
  assert.equal(seqA[far], farB);
  for (let d = 0; d < HORIZON; d += 37) assert.equal(a.idForDay(d), b.idForDay(d));
});

test("appending a future issue changes no date before its start", () => {
  const laterStart = 304 + 400;
  const NEW_B = Array.from({ length: 10 }, (_, i) => `b-${i}`);
  const extended: ScheduleConfig = {
    ...BASE,
    issues: [ISSUE_A, { id: "issue-b", startDay: laterStart, seed: 11, premieres: NEW_B }],
  };
  assert.deepEqual(run(extended, 0, laterStart), run(BASE, 0, laterStart));
  assert.deepEqual(run(extended, laterStart, laterStart + NEW_B.length), NEW_B);
  const worst = minGap(run(extended, 0, HORIZON));
  assert.ok(worst.gap >= 30, `"${worst.id}" repeated after ${worst.gap} days`);
});

test("retiring an id stops it recurring without touching its past dates", () => {
  const laterStart = 304 + 400;
  const retiree = V1[0];
  const extended: ScheduleConfig = {
    ...BASE,
    issues: [ISSUE_A, { id: "issue-b", startDay: laterStart, seed: 11, premieres: ["b-0"], retire: [retiree] }],
  };
  assert.deepEqual(run(extended, 0, laterStart), run(BASE, 0, laterStart));
  assert.ok(!run(extended, laterStart, HORIZON).includes(retiree), "retired id ran after retirement");
  assert.equal(createSchedule(extended).firstDayOf(retiree), 0, "its first day is unchanged");
});

test("firstDayOf reports v1 positions and premiere days", () => {
  const s = createSchedule(BASE);
  assert.equal(s.firstDayOf(V1[7]), 7);
  assert.equal(s.firstDayOf("a-0"), 304);
  assert.equal(s.firstDayOf("a-23"), 327);
  assert.equal(s.firstDayOf("nope"), null);
});

test("invalid manifests are refused at construction", () => {
  const mk = (issues: ScheduledIssue[], gap = 30) => () =>
    createSchedule({ v1Rotation: V1, issues, minRepeatGap: gap });
  assert.throws(mk([{ ...ISSUE_A, premieres: ["v1-3"] }]), /already scheduled/);
  assert.throws(mk([{ ...ISSUE_A, premieres: ["x", "x"] }]), /already scheduled/);
  assert.throws(mk([{ ...ISSUE_A, premieres: [] }]), /no premieres/);
  assert.throws(mk([{ ...ISSUE_A, startDay: 10 }]), /first full v1 cycle/);
  assert.throws(mk([{ ...ISSUE_A, retire: ["ghost"] }]), /cannot retire/);
  assert.throws(
    mk([ISSUE_A, { id: "issue-b", startDay: 310, seed: 1, premieres: ["b-0"] }]),
    /finished its premieres/
  );
  assert.throws(mk([ISSUE_A], 40), /too small/);
});

test("repairBoundary moves recently-run ids past the gap and keeps a permutation", () => {
  const order = ["x", "y", "z", "p", "q", "r", "s", "t"];
  const lastSeen = new Map([
    ["x", 1],
    ["y", 2],
  ]);
  const fixed = repairBoundary(order, lastSeen, 4);
  assert.deepEqual([...fixed].sort(), [...order].sort());
  fixed.forEach((id, pos) => {
    const back = lastSeen.get(id);
    if (back !== undefined) assert.ok(pos + back >= 4, `${id} at ${pos}`);
  });
});
