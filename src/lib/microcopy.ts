export const LOADING_PHRASES = [
  "Teaching pigeons quantum mechanics…",
  "Consulting the Council of Ducks…",
  "Calibrating the Nonsense Generator…",
  "Polling three geese and a raccoon…",
  "Filing today's absurdity in triplicate…",
  "Waking the Committee for Poor Decisions…",
  "Peer-reviewing nothing, as usual…",
  "Locating today's nonsense in the archive of nonsense…",
];

export type ReactionKind = "amazing" | "terrible" | "both";

export const REACTION_RESPONSES: Record<ReactionKind, string[]> = {
  amazing: ["Correct.", "The Committee agrees.", "Filed under Objectively Right."],
  terrible: ["Also correct.", "Duly noted and ignored.", "The geese have been informed."],
  both: ["The only honest answer.", "Wisdom.", "This is the way."],
};

export const SHARE_CONFIRMATIONS = [
  "Copied. Go forth and confuse someone.",
  "Nonsense secured. Deploy responsibly.",
  "Copied to clipboard. Handle with no care whatsoever.",
];

export const EXPIRED_COPY = "That nonsense expired. Here's what it was.";

export function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

// Deterministic pick from a string key, so server and client render the
// same value on first paint (avoids hydration mismatches from Math.random()).
export function pickForKey<T>(items: readonly T[], key: string): T {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0;
  }
  return items[Math.abs(hash) % items.length];
}
