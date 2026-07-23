import { getTodayItem } from "./content";
import { UNIVERSES } from "./universes";

// The public contract consumed by mudmantimsapps.com's "Today's Nonsense"
// homepage module. Intentionally flat and presentation-agnostic: the host
// page renders it with its own markup. Adding fields is safe; renaming or
// removing them is a breaking change for that consumer.
export interface TodayPayload {
  dayKey: string;
  permalink: string;
  universe: {
    id: string;
    name: string;
    tagline: string;
    masthead: string | null;
    metadata: { label: string; value: string } | null;
    canvasStops: [string, string, string];
  };
  item: {
    format: string;
    title: string;
    body: string;
    rarity: "common" | "rare";
  };
}

export function buildTodayPayload(siteUrl: string, now: Date = new Date()): TodayPayload {
  const { item, dayKey } = getTodayItem(now);
  const universe = UNIVERSES[item.universe];
  return {
    dayKey,
    permalink: `${siteUrl.replace(/\/$/, "")}/day/${dayKey}`,
    universe: {
      id: universe.id,
      name: universe.name,
      tagline: universe.tagline,
      masthead: universe.masthead ?? null,
      metadata: universe.metadata ?? null,
      canvasStops: universe.canvasStops,
    },
    item: {
      format: item.format,
      title: item.title,
      body: item.body,
      rarity: item.rarity,
    },
  };
}
