import { UniverseId } from "./universes";

export interface DailyItem {
  id: string;
  universe: UniverseId;
  title: string;
  body: string;
  rarity: "common" | "rare";
}

export function shareTextFor(item: DailyItem): string {
  return `${item.body}\n\n— The Daily Nonsense`;
}

// The archive. Rotates in a fixed, deterministic order so every visitor
// sees the same item on the same day without needing a backend.
const CONTENT_POOL: DailyItem[] = [
  // The Department of Extremely Important Research
  { id: "deir-1", universe: "deir", title: "Finding No. 014", body: "A goose can hold a grudge for approximately three municipal elections.", rarity: "common" },
  { id: "deir-2", universe: "deir", title: "Finding No. 227", body: "Researchers confirm that the average houseplant judges you, but only on Tuesdays.", rarity: "common" },
  { id: "deir-3", universe: "deir", title: "Finding No. 118", body: "Under laboratory conditions, four out of five pigeons preferred the second-nicest breadcrumb, out of spite.", rarity: "common" },
  { id: "deir-4", universe: "deir", title: "Finding No. 1,204", body: "New data suggests that socks do not go missing. They are simply promoted.", rarity: "common" },
  { id: "deir-5", universe: "deir", title: "Finding No. 059", body: "A study of 12,000 doorknobs found that none of them wanted to talk about it.", rarity: "common" },
  { id: "deir-6", universe: "deir", title: "Finding No. 300", body: "It has been mathematically proven that the last slice of pizza gains 40% more emotional weight per minute it remains uneaten.", rarity: "rare" },

  // The Museum of Useless History
  { id: "museum-1", universe: "museum", title: "Exhibit 12", body: "In 1622, a Dutch village briefly elected a very confident duck as harbor master. Records indicate the duck served two full terms.", rarity: "common" },
  { id: "museum-2", universe: "museum", title: "Exhibit 88", body: "The Great Umbrella Standoff of 1889 lasted four days and ended in a draw, as agreed upon by everyone involved and several bystanders.", rarity: "common" },
  { id: "museum-3", universe: "museum", title: "Exhibit 41", body: "Historians believe the world's first traffic jam was two people arguing about who invented the wheel first.", rarity: "common" },
  { id: "museum-4", universe: "museum", title: "Exhibit 156", body: "A minor 14th-century kingdom once went to war over the correct way to fold a napkin. The napkin has never been recovered.", rarity: "common" },
  { id: "museum-5", universe: "museum", title: "Exhibit 7", body: "In 1975, a man in Ohio was legally declared 'mildly haunted' by a local court. The ruling was never appealed.", rarity: "common" },
  { id: "museum-6", universe: "museum", title: "Exhibit 203", body: "The Treaty of Overly Specific Terms (1801) is nine pages long and concerns only the ownership of one particular goat.", rarity: "rare" },

  // The Committee for Poor Decisions
  { id: "committee-1", universe: "committee", title: "Official Advisory No. 3", body: "If a decision feels 60% good, that's basically 100% good. Round up. Always round up.", rarity: "common" },
  { id: "committee-2", universe: "committee", title: "Official Advisory No. 41", body: "When in doubt, reply-all. Let everyone share in the doubt.", rarity: "common" },
  { id: "committee-3", universe: "committee", title: "Official Advisory No. 12", body: "There is no wrong time to bring up your fantasy football team.", rarity: "common" },
  { id: "committee-4", universe: "committee", title: "Official Advisory No. 27", body: "Texting 'we should catch up sometime' legally counts as catching up. This has been reviewed by nobody.", rarity: "common" },
  { id: "committee-5", universe: "committee", title: "Official Advisory No. 9", body: "The best time to start a new diet is directly after ordering dessert.", rarity: "common" },
  { id: "committee-6", universe: "committee", title: "Official Advisory No. 68", body: "If you forget someone's name, commit to calling them 'chief' for the rest of your relationship.", rarity: "rare" },

  // Neighborhood Wildlife Reports
  { id: "wildlife-1", universe: "wildlife", title: "Bulletin 44", body: "The raccoon behind the Petersons' shed has unionized. Demands include: more trash, less judgment.", rarity: "common" },
  { id: "wildlife-2", universe: "wildlife", title: "Bulletin 19", body: "Three geese have been loitering outside the coffee shop since Tuesday. Their intentions remain unclear and deeply suspicious.", rarity: "common" },
  { id: "wildlife-3", universe: "wildlife", title: "Bulletin 63", body: "A squirrel was seen making direct eye contact with a jogger for eleven full seconds. Neither party has commented.", rarity: "common" },
  { id: "wildlife-4", universe: "wildlife", title: "Bulletin 8", body: "The neighborhood cats have resumed their nightly council meetings. Agenda items are, as always, classified.", rarity: "common" },
  { id: "wildlife-5", universe: "wildlife", title: "Bulletin 91", body: "Local pigeons have begun walking in a suspiciously coordinated formation near the bank. Authorities are 'monitoring the situation, sort of.'", rarity: "common" },
  { id: "wildlife-6", universe: "wildlife", title: "Bulletin 27", body: "A possum has claimed the recycling bin as a sovereign nation. It is not accepting visitors at this time.", rarity: "rare" },

  // Lost & Found
  { id: "lostfound-1", universe: "lostfound", title: "Item Recovered #205", body: "One (1) emotionally unavailable scarecrow. Straw-stuffed. Commitment issues included.", rarity: "common" },
  { id: "lostfound-2", universe: "lostfound", title: "Item Recovered #118", body: "A single left shoe, extremely confident about its chances of being reunited with its pair.", rarity: "common" },
  { id: "lostfound-3", universe: "lostfound", title: "Item Recovered #77", body: "One slightly damp motivational poster reading 'YOU CAN DO IT,' found face-down in the parking lot.", rarity: "common" },
  { id: "lostfound-4", universe: "lostfound", title: "Item Recovered #310", body: "A jar labeled 'DO NOT OPEN — SERIOUSLY.' Contents unknown. Curiosity levels rising.", rarity: "common" },
  { id: "lostfound-5", universe: "lostfound", title: "Item Recovered #142", body: "One garden gnome, found several yards from where it was originally placed, with a suspicious amount of dirt on its shoes.", rarity: "common" },
  { id: "lostfound-6", universe: "lostfound", title: "Item Recovered #56", body: "A to-do list with only one item: 'figure out what happened to the other to-do lists.'", rarity: "rare" },

  // Official Public Notices
  { id: "notices-1", universe: "notices", title: "Public Notice #4471", body: "Effective immediately, all sighs during Monday meetings must be pre-approved by Facilities.", rarity: "common" },
  { id: "notices-2", universe: "notices", title: "Public Notice #1102", body: "Residents are reminded that the streetlight on Elm has feelings, and it heard what you said about it.", rarity: "common" },
  { id: "notices-3", universe: "notices", title: "Public Notice #290", body: "Due to unforeseen circumstances, Tuesday has been rescheduled. Please proceed directly to Wednesday.", rarity: "common" },
  { id: "notices-4", universe: "notices", title: "Public Notice #8", body: "This is a reminder that the office plant in the break room is now the senior-most employee, having outlasted seven managers.", rarity: "common" },
  { id: "notices-5", universe: "notices", title: "Public Notice #3305", body: "All complaints regarding the weather should be submitted in triplicate to nobody in particular.", rarity: "common" },
  { id: "notices-6", universe: "notices", title: "Public Notice #612", body: "By order of nobody official, the word 'moist' remains banned from all internal communications until further notice.", rarity: "rare" },
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
