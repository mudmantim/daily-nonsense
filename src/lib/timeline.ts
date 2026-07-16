// Canonical list of shared historical event slugs from /world/TIMELINE.md.
// Every DailyItem `tags` entry must appear here - this is what lets an
// automated check catch a typo'd or invented-on-the-spot tag before it
// ships, instead of silently breaking the "find every X that later
// appeared in Y" cross-referencing the schema exists to support.
//
// Keep in sync with the slug column of /world/TIMELINE.md by hand; there
// are few enough entries that a shared build step isn't worth the
// complexity yet.
export const TIMELINE_SLUGS = [
  "committee-vote-1987",
  "stapler-migration",
  "filing-cabinet-1974",
  "duck-harbor-master",
  "goose-incident",
  "tuesday-compromise",
  "wednesday-that-wasnt",
  "sock-inquiry",
  "red-string-donation",
  "reorg-2009",
  "static-cling-anomaly",
  "napkin-war",
  "emotionally-haunted-ruling",
] as const;

export type TimelineSlug = (typeof TIMELINE_SLUGS)[number];
