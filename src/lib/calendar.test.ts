import { test } from "node:test";
import assert from "node:assert/strict";
import { buildCalendarMonth, isMonthInRange, currentMonth } from "./calendar";
import { getItemForDate } from "./content";

const NOW = new Date(Date.UTC(2026, 6, 23)); // 2026-07-23

test("isMonthInRange bounds months to [epoch month, current month]", () => {
  assert.equal(isMonthInRange(2026, 1, NOW), true, "epoch month");
  assert.equal(isMonthInRange(2026, 7, NOW), true, "current month");
  assert.equal(isMonthInRange(2025, 12, NOW), false, "before epoch");
  assert.equal(isMonthInRange(2026, 8, NOW), false, "future month");
  assert.equal(isMonthInRange(2026, 0, NOW), false, "month 0 invalid");
  assert.equal(isMonthInRange(2026, 13, NOW), false, "month 13 invalid");
  assert.equal(isMonthInRange(2026, 3.5, NOW), false, "non-integer month");
});

test("currentMonth reflects the UTC month of now", () => {
  assert.deepEqual(currentMonth(NOW), { year: 2026, month: 7 });
});

test("buildCalendarMonth lays out July 2026 with correct padding and day count", () => {
  const cal = buildCalendarMonth(2026, 7, NOW);
  assert.equal(cal.label, "July 2026");
  // July 1 2026 is a Wednesday → 3 leading pad cells (Sun,Mon,Tue).
  assert.equal(cal.weeks[0][0], null);
  assert.equal(cal.weeks[0][2], null);
  assert.ok(cal.weeks[0][3], "Wednesday cell is July 1");
  assert.equal(cal.weeks[0][3]?.day, 1);
  // Every week is exactly 7 cells.
  for (const week of cal.weeks) assert.equal(week.length, 7);
  // 31 real day cells across the grid.
  const days = cal.weeks.flat().filter((c) => c !== null);
  assert.equal(days.length, 31);
});

test("buildCalendarMonth marks in-range, today, and future days correctly", () => {
  const cal = buildCalendarMonth(2026, 7, NOW);
  const byDay = new Map(cal.weeks.flat().filter(Boolean).map((c) => [c!.day, c!]));

  assert.equal(byDay.get(23)!.isToday, true);
  assert.equal(byDay.get(23)!.inRange, true);
  assert.equal(byDay.get(24)!.inRange, false, "tomorrow is out of range");
  assert.equal(byDay.get(24)!.universe, null, "out-of-range days carry no institution");

  // In-range days resolve to the same institution the rotation assigns.
  const d12 = byDay.get(12)!;
  assert.equal(d12.universe, getItemForDate(new Date(Date.UTC(2026, 6, 12))).universe);
});

test("month navigation clamps at the epoch and at the current month", () => {
  const epoch = buildCalendarMonth(2026, 1, NOW);
  assert.equal(epoch.prev, null, "no month before the epoch");
  assert.deepEqual(epoch.next, { year: 2026, month: 2 });

  const current = buildCalendarMonth(2026, 7, NOW);
  assert.deepEqual(current.prev, { year: 2026, month: 6 });
  assert.equal(current.next, null, "no month after the current one");
});

test("month navigation crosses year boundaries when in range", () => {
  const laterNow = new Date(Date.UTC(2027, 1, 10)); // Feb 2027
  const jan27 = buildCalendarMonth(2027, 1, laterNow);
  assert.deepEqual(jan27.prev, { year: 2026, month: 12 });
  assert.deepEqual(jan27.next, { year: 2027, month: 2 });
});
