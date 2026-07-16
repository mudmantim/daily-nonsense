import { UniverseId } from "./universes";

export interface DailyItem {
  id: string;
  universe: UniverseId;
  // The in-universe document type this item is styled as (Chip's "Layer 2":
  // Research Finding, Meeting Minutes, Wildlife Alert, etc). Shown as a small
  // label above the headline.
  format: string;
  title: string;
  body: string;
  rarity: "common" | "rare";
  // Forward-looking fields per Chip's schema-prep request: no current entry
  // sets these, and nothing renders them yet. They exist so that when real
  // cross-universe worldbuilding content gets written, items can already
  // reference each other ("every Committee decision that later appeared in
  // Wildlife Reports") without another migration.
  season?: string;
  tags?: string[];
  callbacks?: string[]; // ids of earlier DailyItems this one nods to
  relatedDocuments?: string[]; // ids of DailyItems thematically linked to this one
}

export function shareTextFor(item: DailyItem): string {
  return `${item.body}\n\n— The Daily Nonsense`;
}

// The archive. Rotates in a fixed, deterministic order so every visitor
// sees the same item on the same day without needing a backend.
// Copy authored by Chip (product/humor direction); Claude owns the
// universe/format data model these entries are stored in.
const CONTENT_POOL: DailyItem[] = [
  {
    id: "deir-1",
    universe: "deir",
    format: "Research Finding",
    title: "New Study Finds",
    body: "People who say “I'll just rest my eyes” are asleep within four minutes. Researchers were unavailable for comment. They were resting their eyes.",
    rarity: "common",
  },
  {
    id: "deir-2",
    universe: "deir",
    format: "Research Finding",
    title: "Finding",
    body: "Scientists confirm that soup tastes approximately 12% better when someone else makes it. Further funding has been requested.",
    rarity: "rare",
  },
  {
    id: "wildlife-1",
    universe: "wildlife",
    format: "Wildlife Alert",
    title: "Squirrel Activity Update",
    body: "A squirrel spent twenty-three uninterrupted minutes pretending not to notice a human. Experts describe the performance as “convincing.”",
    rarity: "rare",
  },
  {
    id: "wildlife-2",
    universe: "wildlife",
    format: "Incident Report",
    title: "Incident Report",
    body: "A crow has once again been observed acting like it owns the parking lot. No evidence has been found suggesting otherwise.",
    rarity: "common",
  },
  {
    id: "committee-1",
    universe: "committee",
    format: "Meeting Minutes",
    title: "Meeting Minutes",
    body: "Motion: “Maybe it'll fix itself.” Passed unanimously.",
    rarity: "common",
  },
  {
    id: "committee-2",
    universe: "committee",
    format: "Official Recommendation",
    title: "Reminder",
    body: "Just because it's technically a shortcut does not make it a good idea.",
    rarity: "common",
  },
  {
    id: "museum-1",
    universe: "museum",
    format: "Newly Unearthed Artifact",
    title: "Artifact #442",
    body: "Wooden Spoon. Estimated age: Tuesday.",
    rarity: "rare",
  },
  {
    id: "museum-2",
    universe: "museum",
    format: "Curator's Notes",
    title: "Today's Exhibit",
    body: "An unopened instruction manual. Believed to have belonged to someone extremely optimistic.",
    rarity: "common",
  },
  {
    id: "notices-1",
    universe: "notices",
    format: "Public Notice",
    title: "Public Notice",
    body: "Residents are reminded that talking to houseplants is encouraged. Arguments, however, should remain under five minutes.",
    rarity: "common",
  },
  {
    id: "lostfound-1",
    universe: "lostfound",
    format: "Item Recovered",
    title: "Found",
    body: "One left sock. Condition: Emotionally prepared.",
    rarity: "common",
  },
];

function mulberry32(seed: number) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const rand = mulberry32(seed);
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Fixed seed so the rotation order is stable across builds and servers.
const ROTATION = seededShuffle(CONTENT_POOL, 20260101);

const EPOCH_UTC = Date.UTC(2026, 0, 1);
const DAY_MS = 86_400_000;

function daysSinceEpoch(date: Date): number {
  const utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.floor((utc - EPOCH_UTC) / DAY_MS);
}

export function getItemForDate(date: Date): DailyItem {
  const dayIndex = daysSinceEpoch(date);
  const idx = ((dayIndex % ROTATION.length) + ROTATION.length) % ROTATION.length;
  return ROTATION[idx];
}

export function getDayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function getTodayItem(): { item: DailyItem; dayKey: string } {
  const today = new Date();
  return { item: getItemForDate(today), dayKey: getDayKey(today) };
}

export function getYesterdayItem(): { item: DailyItem; dayKey: string } | null {
  const today = new Date();
  if (daysSinceEpoch(today) <= 0) return null;
  const yesterday = new Date(today);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  return { item: getItemForDate(yesterday), dayKey: getDayKey(yesterday) };
}

// Genuinely random (not date-seeded) — a fresh roll each time the page loads.
export function getRandomItem(): DailyItem {
  return CONTENT_POOL[Math.floor(Math.random() * CONTENT_POOL.length)];
}

export function getAllItems(): DailyItem[] {
  return CONTENT_POOL;
}
