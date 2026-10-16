// The publication scheduler: which document id runs on which day.
//
// Pure functions of (config, day index) only. No clock, no randomness
// beyond fixed seeds, no I/O, so every server and every build agrees on
// every date. Content lives in content.ts; this file only knows ids.
//
// The schedule is a sequence of segments, and history is append-only:
//
//   1. v1 (days before the first issue starts): the original 50-item
//      rotation, ROTATION[day mod 50], frozen exactly as it shipped.
//   2. Each later "issue" starts on a fixed date. It first PREMIERES its new
//      items, one per day, in the order its manifest lists them. Then it
//      runs a long-term rotation over the whole library as of that issue:
//      cycles of exactly one appearance per item, each cycle reshuffled
//      with a seed derived from (issue seed, cycle number), with a
//      deterministic repair so no item ever runs twice within
//      `minRepeatGap` days, including across cycle and segment boundaries.
//
// Adding an issue whose start date is in the future therefore changes no
// date before that start. That is the whole contract: past dates never move.

export const DAY_MS = 86_400_000;

export function mulberry32(seed: number) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededShuffle<T>(arr: readonly T[], seed: number): T[] {
  const rand = mulberry32(seed);
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Mixes an issue seed and a cycle number into a per-cycle shuffle seed.
// Any fixed integer mix works; what matters is that it never changes.
export function deriveCycleSeed(issueSeed: number, cycle: number): number {
  return (Math.imul(issueSeed, 0x01000193) ^ Math.imul(cycle + 1, 0x9e3779b1)) | 0;
}

export interface ScheduledIssue {
  id: string;
  // Days since the epoch on which this issue's first premiere runs.
  startDay: number;
  seed: number;
  // New item ids, in the order they premiere (one per day from startDay).
  premieres: readonly string[];
  // Ids leaving the long-term rotation from startDay on. They stay in the
  // pool (their past dates still resolve to them); they just stop recurring.
  retire?: readonly string[];
}

export interface ScheduleConfig {
  // The frozen v1 rotation order (already shuffled), used before the first
  // issue's start day.
  v1Rotation: readonly string[];
  issues: readonly ScheduledIssue[];
  // No id may run twice within this many days once issues begin.
  minRepeatGap: number;
}

export interface Schedule {
  idForDay(day: number): string;
  // The first day an id runs, or null if it is never scheduled.
  firstDayOf(id: string): number | null;
  // The rotation library (ids in canonical order) in force for an issue.
  libraryOf(issueIndex: number): readonly string[];
}

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

export function createSchedule(config: ScheduleConfig): Schedule {
  const { v1Rotation, issues, minRepeatGap } = config;
  if (v1Rotation.length === 0) throw new Error("v1 rotation is empty");

  // ---- Validate the manifest and build each issue's library up front, so
  // a bad manifest fails at module load (and in tests), never at request time.
  const libraries: string[][] = [];
  const firstDay = new Map<string, number>();
  v1Rotation.forEach((id, day) => {
    if (firstDay.has(id)) throw new Error(`v1 rotation lists "${id}" twice`);
    firstDay.set(id, day);
  });
  let library: string[] = [...v1Rotation];
  issues.forEach((issue, k) => {
    if (!Number.isInteger(issue.startDay)) throw new Error(`${issue.id}: startDay must be an integer`);
    if (issue.startDay < v1Rotation.length) {
      throw new Error(`${issue.id}: must start after the first full v1 cycle`);
    }
    if (issue.premieres.length === 0) throw new Error(`${issue.id}: has no premieres`);
    if (k > 0) {
      const prev = issues[k - 1];
      if (issue.startDay < prev.startDay + prev.premieres.length) {
        throw new Error(`${issue.id}: starts before ${prev.id} has finished its premieres`);
      }
    }
    for (const id of issue.retire ?? []) {
      if (!library.includes(id)) throw new Error(`${issue.id}: cannot retire "${id}", not in rotation`);
    }
    const retired = new Set(issue.retire ?? []);
    issue.premieres.forEach((id, i) => {
      if (firstDay.has(id)) throw new Error(`${issue.id}: "${id}" was already scheduled`);
      firstDay.set(id, issue.startDay + i);
    });
    library = [...library.filter((id) => !retired.has(id)), ...issue.premieres];
    if (library.length < 2 * minRepeatGap) {
      // With at least 2 * gap items the boundary repair below always finds
      // a safe swap; below that it may not, so refuse the manifest.
      throw new Error(`${issue.id}: library of ${library.length} is too small for a ${minRepeatGap}-day repeat gap`);
    }
    libraries.push(library);
  });

  // ---- Long-term rotation, memoized per (issue, cycle). Cycle c depends on
  // the last `minRepeatGap` days before it, so cycles are built in order.
  const cycles: string[][][] = issues.map(() => []);

  function rotationStart(k: number): number {
    return issues[k].startDay + issues[k].premieres.length;
  }

  function cycleOrder(k: number, cycle: number): string[] {
    const built = cycles[k];
    for (let c = built.length; c <= cycle; c++) {
      const lib = libraries[k];
      const cycleStart = rotationStart(k) + c * lib.length;
      const lastSeen = new Map<string, number>(); // id -> days before cycleStart
      for (let back = minRepeatGap; back >= 1; back--) {
        lastSeen.set(idForDay(cycleStart - back), back);
      }
      built.push(repairBoundary(seededShuffle(lib, deriveCycleSeed(issues[k].seed, c)), lastSeen, minRepeatGap));
    }
    return built[cycle];
  }

  function idForDay(day: number): string {
    let k = -1;
    for (let i = issues.length - 1; i >= 0; i--) {
      if (day >= issues[i].startDay) {
        k = i;
        break;
      }
    }
    if (k === -1) return v1Rotation[mod(day, v1Rotation.length)];
    const offset = day - issues[k].startDay;
    if (offset < issues[k].premieres.length) return issues[k].premieres[offset];
    const r = day - rotationStart(k);
    const n = libraries[k].length;
    return cycleOrder(k, Math.floor(r / n))[r % n];
  }

  return {
    idForDay,
    firstDayOf: (id) => firstDay.get(id) ?? null,
    libraryOf: (k) => libraries[k],
  };
}

// Reorders the start of a freshly shuffled cycle so that no id lands
// within `gap` days of its previous appearance. `lastSeen` maps an id to
// how many days before the cycle start it last ran (1 = the day before).
// Deterministic: always swaps with the latest safe position.
export function repairBoundary(order: string[], lastSeen: Map<string, number>, gap: number): string[] {
  const result = [...order];
  const safeAt = (id: string, pos: number) => {
    const back = lastSeen.get(id);
    return back === undefined || pos + back >= gap;
  };
  for (let i = 0; i < Math.min(gap, result.length); i++) {
    if (safeAt(result[i], i)) continue;
    let swapped = false;
    for (let j = result.length - 1; j > i; j--) {
      if (safeAt(result[j], i) && safeAt(result[i], j)) {
        [result[i], result[j]] = [result[j], result[i]];
        swapped = true;
        break;
      }
    }
    if (!swapped) throw new Error(`cannot place "${result[i]}" at least ${gap} days from its last run`);
  }
  return result;
}
