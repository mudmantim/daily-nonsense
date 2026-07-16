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
// Copy and worldbuilding per /world/*.md (constitution, institution
// profiles, shared timeline, style guide) - see TIMELINE.md for the `tags`
// slugs referenced below. Claude owns the universe/format/schema these
// entries are stored in.
const CONTENT_POOL: DailyItem[] = [
  // ---- The Department of Extremely Important Research ----
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
    id: "deir-3",
    universe: "deir",
    format: "Scientific Paper",
    title: "A Methodological Review of Non-Objecting Waterfowl",
    body: "The Department has concluded its review of the Goose Budget Session of 1996. The goose's decision-making process was found methodologically sound. It did not object.",
    rarity: "common",
    tags: ["goose-incident"],
    relatedDocuments: ["committee-3", "wildlife-3"],
  },
  {
    id: "deir-4",
    universe: "deir",
    format: "Safety Bulletin",
    title: "Findings Indicate",
    body: "New data suggest socks are not lost, but promoted. The Department notes that this finding remains unconfirmed by the Lost & Found Authority. The Authority was not consulted. The Department would like that noted.",
    rarity: "common",
    tags: ["sock-inquiry"],
    relatedDocuments: ["lostfound-1", "wildlife-4"],
  },
  {
    id: "deir-5",
    universe: "deir",
    format: "Press Release",
    title: "Press Release",
    body: "The Department reaffirms that its half of the Jointly-Held Filing Cabinet, in continuous joint custody since 1974, remains unopened, as agreed.",
    rarity: "common",
    tags: ["filing-cabinet-1974"],
    relatedDocuments: ["museum-3"],
  },
  {
    id: "deir-6",
    universe: "deir",
    format: "Research Finding",
    title: "Finding",
    body: "Following an extensive survey, the Department has concluded that doorknobs, as a class, decline further comment.",
    rarity: "common",
  },
  {
    id: "deir-7",
    universe: "deir",
    format: "Press Release",
    title: "Press Release",
    body: "The Department confirms its 1957 founding motto, “Probably,” remains under continuous peer review. Findings, thus far, are consistent.",
    rarity: "common",
  },

  // ---- The Museum of Useless History ----
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
    id: "museum-3",
    universe: "museum",
    format: "Historical Discovery",
    title: "Curator's Notes",
    body: "Curators confirm the Museum's half of the Jointly-Held Filing Cabinet, jointly accessioned in 1974, remains, as ever, unopened.",
    rarity: "common",
    tags: ["filing-cabinet-1974"],
    relatedDocuments: ["deir-5"],
  },
  {
    id: "museum-4",
    universe: "museum",
    format: "Today in History",
    title: "Today in History",
    body: "On this day in 1622, a Dutch village re-elected its harbor master to a second term. He was, and remains, a duck.",
    rarity: "common",
    tags: ["duck-harbor-master"],
    relatedDocuments: ["committee-6"],
  },
  {
    id: "museum-5",
    universe: "museum",
    format: "Newly Unearthed Artifact",
    title: "Exhibit: The Napkin Treaty",
    body: "The Treaty of Overly Specific Terms (1801). Nine pages. Concerns the ownership of one goat. Context pending.",
    rarity: "common",
    tags: ["napkin-war"],
  },
  {
    id: "museum-6",
    universe: "museum",
    format: "Curator's Notes",
    title: "Curator's Notes",
    body: "The Curator wishes it noted that the 1975 ruling declaring a man in Ohio “mildly haunted” remains unappealed and historically underappreciated.",
    rarity: "common",
    tags: ["emotionally-haunted-ruling"],
    relatedDocuments: ["bureau-3"],
  },
  {
    id: "museum-7",
    universe: "museum",
    format: "Historical Discovery",
    title: "Historical Discovery",
    body: "Archive records indicate the earliest known complaint about traffic was filed before the road was completed. The complaint was preserved. The road was not.",
    rarity: "common",
  },

  // ---- The Committee for Poor Decisions ----
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
    title: "Official Recommendation",
    body: "The Committee recommends confirming where a shortcut ends before formally approving where it begins. This recommendation follows the footpath review and is not retroactive.",
    rarity: "common",
  },
  {
    id: "committee-3",
    universe: "committee",
    format: "Meeting Minutes",
    title: "Meeting Minutes",
    body: "Minutes reflect one (1) goose entered through the north window at 2:14 PM and remained until the vote concluded. The goose did not object. The motion passed.",
    rarity: "rare",
    tags: ["goose-incident"],
    relatedDocuments: ["deir-3", "wildlife-3"],
  },
  {
    id: "committee-4",
    universe: "committee",
    format: "Approved Motion",
    title: "Approved Motion",
    body: "Motion to dissolve the temporary committee formed in 1987 failed to reach quorum for the fourteenth consecutive year. The Committee remains temporary, and permanent.",
    rarity: "common",
    tags: ["committee-vote-1987"],
  },
  {
    id: "committee-5",
    universe: "committee",
    format: "Emergency Decision",
    title: "Emergency Decision",
    body: "The Subcommittee on Office Supplies, convened in 1988, has elected to continue meeting indefinitely. No further staplers have relocated. The Subcommittee remains vigilant.",
    rarity: "common",
    tags: ["stapler-migration"],
    relatedDocuments: ["lostfound-3"],
  },
  {
    id: "committee-6",
    universe: "committee",
    format: "Official Recommendation",
    title: "Official Recommendation",
    body: "The Committee recommends continued reliance on the Duck Harbor Master Precedent (1622) in all matters where participation is evident and objection is not. No further review is planned.",
    rarity: "common",
    tags: ["duck-harbor-master"],
    relatedDocuments: ["museum-4"],
  },

  // ---- Neighborhood Wildlife Reports ----
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
    id: "wildlife-3",
    universe: "wildlife",
    format: "Incident Report",
    title: "Incident Report",
    body: "A goose believed to be a direct descendant of the goose present at the 1996 Committee vote was seen loitering outside the municipal building. It did not object to being photographed.",
    rarity: "common",
    tags: ["goose-incident"],
    relatedDocuments: ["deir-3", "committee-3"],
  },
  {
    id: "wildlife-4",
    universe: "wildlife",
    format: "Citizen Complaint",
    title: "Citizen Complaint",
    body: "A concerned neighbor reports the raccoon behind the Petersons' shed has once again been seen near a sock. This is the fourth such sighting this year. No socks have been recovered.",
    rarity: "common",
    tags: ["sock-inquiry"],
    relatedDocuments: ["lostfound-1", "deir-4"],
  },
  {
    id: "wildlife-5",
    universe: "wildlife",
    format: "Animal Interview",
    title: "Animal Interview",
    body: "Three pigeons were observed standing in a triangle formation outside the bank for the second consecutive morning. When approached, they did not disperse. A concerned neighbor describes their posture as “organized.”",
    rarity: "common",
  },
  {
    id: "wildlife-6",
    universe: "wildlife",
    format: "Wildlife Alert",
    title: "Rooftop Assembly",
    body: "The neighborhood cats have resumed their nightly rooftop assembly. No vocalizations or visible agenda were recorded. The gathering adjourned at 3:11 a.m. when a porch light came on.",
    rarity: "common",
  },

  // ---- The Lost & Found Authority ----
  {
    id: "lostfound-1",
    universe: "lostfound",
    format: "Item Recovered",
    title: "Found",
    body: "One left sock. Condition: Emotionally prepared.",
    rarity: "common",
    tags: ["sock-inquiry"],
    relatedDocuments: ["deir-4", "wildlife-4"],
  },
  {
    id: "lostfound-2",
    universe: "lostfound",
    format: "Custodial Note",
    title: "Custodial Note",
    body: "Item: one length of red string. Origin: unknown. Status: awaiting recognition since 2015. The Office of Public Clarifications was asked to clarify. It declined.",
    rarity: "rare",
    tags: ["red-string-donation"],
    relatedDocuments: ["clarifications-1"],
  },
  {
    id: "lostfound-3",
    universe: "lostfound",
    format: "Claim Status",
    title: "Claim Status",
    body: "Item: assorted staplers, quantity unconfirmed, origin unclear. Believed connected to the events of 1988. Patiently held.",
    rarity: "common",
    tags: ["stapler-migration"],
    relatedDocuments: ["committee-5"],
  },
  {
    id: "lostfound-4",
    universe: "lostfound",
    format: "Item Recovered",
    title: "Found",
    body: "One garden gnome, recovered several yards from its original post, soil present on its shoes in a pattern the Authority declines to interpret.",
    rarity: "common",
  },
  {
    id: "lostfound-5",
    universe: "lostfound",
    format: "Item Recovered",
    title: "Found",
    body: "One motivational poster reading YOU CAN DO IT, recovered face-down. Condition: remaining optimistic.",
    rarity: "common",
  },
  {
    id: "lostfound-6",
    universe: "lostfound",
    format: "Custodial Note",
    title: "Custodial Note",
    body: "A jar labeled DO NOT OPEN — SERIOUSLY has been awaiting recognition for six years. Staff confirm it remains unopened. Interest in the item has not diminished.",
    rarity: "common",
  },

  // ---- Official Public Notices ----
  {
    id: "notices-1",
    universe: "notices",
    format: "Public Notice",
    title: "Public Notice",
    body: "Residents are reminded that talking to houseplants is encouraged. Arguments, however, should remain under five minutes.",
    rarity: "common",
  },
  {
    id: "notices-2",
    universe: "notices",
    format: "Reminder",
    title: "Reminder",
    body: "Residents are reminded that, per the Compromise of 2003, the matter of Museum operating hours takes effect on Tuesday. It has been Tuesday, procedurally, for some time.",
    rarity: "rare",
    tags: ["tuesday-compromise"],
    relatedDocuments: ["clarifications-6"],
  },
  {
    id: "notices-3",
    universe: "notices",
    format: "Distribution Memo",
    title: "Distribution Memo",
    body: "Wednesday remains Wednesday, for now.",
    rarity: "common",
    tags: ["wednesday-that-wasnt"],
  },
  {
    id: "notices-4",
    universe: "notices",
    format: "Public Notice",
    title: "Public Notice",
    body: "Residents are reminded that the streetlight on Elm Street has been made aware of recent remarks concerning it.",
    rarity: "common",
  },
  {
    id: "notices-5",
    universe: "notices",
    format: "Reminder",
    title: "Tuesday Extension Notice",
    body: "Residents are reminded that Tuesday, having already been extended twice, will conclude at the earliest administratively convenient opportunity. No further extensions are presently authorized.",
    rarity: "common",
    tags: ["tuesday-compromise"],
  },
  {
    id: "notices-6",
    universe: "notices",
    format: "Public Notice",
    title: "Public Notice",
    body: "Residents wishing to submit complaints regarding the weather may do so in triplicate. No receiving office has been designated.",
    rarity: "common",
  },

  // ---- The Bureau of Mild Emergencies ----
  {
    id: "bureau-1",
    universe: "bureau",
    format: "Situation Report",
    title: "Situation Report",
    body: "A situation of moderate note involving persistent static cling across three municipal buildings has been de-escalated to baseline after four days. The Office of Public Clarifications received over 200 requests for comment. None were fulfilled.",
    rarity: "rare",
    tags: ["static-cling-anomaly"],
    relatedDocuments: ["clarifications-2"],
  },
  {
    id: "bureau-2",
    universe: "bureau",
    format: "De-escalation Notice",
    title: "De-escalation Notice",
    body: "The Bureau confirms it was established in 2009, the same year as the Office of Public Clarifications. The coincidence has been reviewed and classified as a situation of moderate note.",
    rarity: "common",
    tags: ["reorg-2009"],
    relatedDocuments: ["clarifications-3"],
  },
  {
    id: "bureau-3",
    universe: "bureau",
    format: "Advisory (Non-Urgent)",
    title: "Advisory",
    body: "Per the precedent established in 1975, reports of mild haunting remain concerning, but not actionable. Residents are advised to continue documenting any additional haunting, should it remain mild.",
    rarity: "common",
    tags: ["emotionally-haunted-ruling"],
    relatedDocuments: ["museum-6"],
  },
  {
    id: "bureau-4",
    universe: "bureau",
    format: "Situation Report",
    title: "Situation Report",
    body: "A single balloon was reported drifting at low altitude near the reservoir for six consecutive hours. Status: de-escalated to baseline once it landed in a tree.",
    rarity: "common",
  },
  {
    id: "bureau-5",
    universe: "bureau",
    format: "Advisory (Non-Urgent)",
    title: "Advisory",
    body: "Residents reporting an unusual hum near the water tower are advised the hum has been assessed and classified as a situation of moderate note. It will not be investigated further at this time.",
    rarity: "common",
  },
  {
    id: "bureau-6",
    universe: "bureau",
    format: "De-escalation Notice",
    title: "De-escalation Notice",
    body: "The situation involving seventeen shopping carts gathered at the edge of the parking lot has been de-escalated to baseline. No classification of intent has been made.",
    rarity: "common",
  },

  // ---- The Office of Public Clarifications ----
  {
    id: "clarifications-1",
    universe: "clarifications",
    format: "Statement of Non-Clarification",
    title: "Statement of Non-Clarification",
    body: "Regarding the red string submitted to the Lost & Found Authority in 2015: further clarification is not available at this time.",
    rarity: "rare",
    tags: ["red-string-donation"],
    relatedDocuments: ["lostfound-2"],
  },
  {
    id: "clarifications-2",
    universe: "clarifications",
    format: "Public Inquiry Log",
    title: "Public Inquiry Log",
    body: "This office received 214 requests for clarification regarding the 2018 static cling incident. All 214 have been logged. None have been answered.",
    rarity: "common",
    tags: ["static-cling-anomaly"],
    relatedDocuments: ["bureau-1"],
  },
  {
    id: "clarifications-3",
    universe: "clarifications",
    format: "Clarification Request (Response)",
    title: "Response",
    body: "In response to a request to clarify the circumstances of this office's 2009 founding: the matter remains, by design, unclarified.",
    rarity: "common",
    tags: ["reorg-2009"],
    relatedDocuments: ["bureau-2"],
  },
  {
    id: "clarifications-4",
    universe: "clarifications",
    format: "Statement of Non-Clarification",
    title: "Statement of Non-Clarification",
    body: "Regarding the streetlight on Elm Street: this office is aware of the notice. No further comment will be issued.",
    rarity: "common",
    relatedDocuments: ["notices-4"],
  },
  {
    id: "clarifications-5",
    universe: "clarifications",
    format: "Public Inquiry Log",
    title: "Public Inquiry Log",
    body: "A resident asked, in writing, what this office actually does. The inquiry has been logged. It has not been clarified.",
    rarity: "common",
  },
  {
    id: "clarifications-6",
    universe: "clarifications",
    format: "Clarification Request (Response)",
    title: "Response",
    body: "In response to a request to confirm whether Tuesday is, in fact, still Tuesday: the Office defers to Official Public Notices and declines to clarify further.",
    rarity: "common",
    tags: ["tuesday-compromise"],
    relatedDocuments: ["notices-2"],
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

// `now` is injectable (defaults to the real clock) so tests can pin a
// date without monkeypatching the global Date object.
export function getTodayItem(now: Date = new Date()): { item: DailyItem; dayKey: string } {
  return { item: getItemForDate(now), dayKey: getDayKey(now) };
}

export function getYesterdayItem(now: Date = new Date()): { item: DailyItem; dayKey: string } | null {
  if (daysSinceEpoch(now) <= 0) return null;
  const yesterday = new Date(now);
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
