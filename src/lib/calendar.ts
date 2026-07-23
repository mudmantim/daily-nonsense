import { getItemForDate, getDayKey, FIRST_DAY_KEY } from "./content";
import { UniverseId } from "./universes";

export interface CalendarDay {
  dayKey: string; // "YYYY-MM-DD"
  day: number; // 1..31
  inRange: boolean; // within [epoch, today] — only these are browsable
  isToday: boolean;
  universe: UniverseId | null; // the day's institution (null when out of range)
}

export interface CalendarMonth {
  year: number;
  month: number; // 1..12
  label: string; // "July 2026"
  // Weeks of 7 cells, Sunday-first. `null` cells are padding from adjacent
  // months so the grid stays rectangular.
  weeks: Array<Array<CalendarDay | null>>;
  prev: { year: number; month: number } | null;
  next: { year: number; month: number } | null;
}

// Epoch month, derived from the archive's first day so it can't drift.
const [EPOCH_YEAR, EPOCH_MONTH] = FIRST_DAY_KEY.split("-").map(Number);

function monthIndex(year: number, month: number): number {
  return year * 12 + (month - 1);
}

// True when (year, month) names a real month at or after the epoch and no
// later than the month `now` falls in — the browsable window.
export function isMonthInRange(year: number, month: number, now: Date = new Date()): boolean {
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return false;
  }
  const idx = monthIndex(year, month);
  const nowIdx = monthIndex(now.getUTCFullYear(), now.getUTCMonth() + 1);
  return idx >= monthIndex(EPOCH_YEAR, EPOCH_MONTH) && idx <= nowIdx;
}

export function currentMonth(now: Date = new Date()): { year: number; month: number } {
  return { year: now.getUTCFullYear(), month: now.getUTCMonth() + 1 };
}

// Build the full grid for a month. Assumes (year, month) is already known
// in-range; callers validate with isMonthInRange first and 404 otherwise.
export function buildCalendarMonth(year: number, month: number, now: Date = new Date()): CalendarMonth {
  const todayKey = getDayKey(now);
  const firstOfMonth = new Date(Date.UTC(year, month - 1, 1));
  const startWeekday = firstOfMonth.getUTCDay(); // 0 = Sunday
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

  const cells: Array<CalendarDay | null> = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(Date.UTC(year, month - 1, day));
    const dayKey = getDayKey(date);
    // dayKeys are ISO, so lexicographic comparison is chronological.
    const inRange = dayKey >= FIRST_DAY_KEY && dayKey <= todayKey;
    cells.push({
      dayKey,
      day,
      inRange,
      isToday: dayKey === todayKey,
      universe: inRange ? getItemForDate(date).universe : null,
    });
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: Array<Array<CalendarDay | null>> = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  const label = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(firstOfMonth);

  const prevIdx = monthIndex(year, month) - 1;
  const nextIdx = monthIndex(year, month) + 1;
  const nowIdx = monthIndex(now.getUTCFullYear(), now.getUTCMonth() + 1);
  const epochIdx = monthIndex(EPOCH_YEAR, EPOCH_MONTH);

  return {
    year,
    month,
    label,
    weeks,
    prev: prevIdx >= epochIdx ? { year: Math.floor(prevIdx / 12), month: (prevIdx % 12) + 1 } : null,
    next: nextIdx <= nowIdx ? { year: Math.floor(nextIdx / 12), month: (nextIdx % 12) + 1 } : null,
  };
}
