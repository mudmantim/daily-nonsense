import { test } from "node:test";
import assert from "node:assert/strict";
import { getAllItems } from "./content";
import { longSentences, longestSharedRun, normalizeText, rankBodySimilarity } from "./similarity";

// Duplicate detection across the whole pool (published and queued).
// Run alone with: npm run check:duplicates
//
// Calibration (2026-10-15, against the 50 v1 items, which all passed
// editorial review and are by definition not duplicates of each other):
//   - word-3-shingle Jaccard: closest v1 pair is deir-5 / museum-3 at 0.156
//     (the deliberate twin press releases about the Filing Cabinet);
//   - shared verbatim sentences of 5+ words: none;
//   - longest shared word run: 8 words (bureau-2 / bureau-5, "and
//     classified as a situation of moderate note" - house style).
// Thresholds sit at roughly double the closest legitimate pair, so stock
// institutional phrasing passes and a reworded copy of a premise fails.

const BODY_JACCARD_THRESHOLD = 0.3;
const SHINGLE_SIZE = 3;
const MIN_COPIED_SENTENCE_WORDS = 5;
const MAX_SHARED_RUN_WORDS = 11;

// Titles that are stock labels, not headlines: every format name plus the
// short labels v1 uses as running heads. Any other title is a headline and
// must be unique.
const STOCK_TITLES = new Set(
  ["Finding", "Findings Indicate", "New Study Finds", "Found", "Response", "Advisory", "Today's Exhibit", "Curator's Notes"].map(
    normalizeText
  )
);

const items = getAllItems();

test("ids are unique", () => {
  const seen = new Map<string, number>();
  for (const item of items) seen.set(item.id, (seen.get(item.id) ?? 0) + 1);
  const dupes = [...seen].filter(([, n]) => n > 1).map(([id]) => id);
  assert.deepEqual(dupes, [], `duplicate ids: ${dupes.join(", ")}`);
});

test(`no two bodies are near-duplicates (word-${SHINGLE_SIZE}-shingle Jaccard < ${BODY_JACCARD_THRESHOLD})`, () => {
  const ranked = rankBodySimilarity(items, SHINGLE_SIZE);
  const top = ranked[0];
  const bodyOf = (id: string) => items.find((i) => i.id === id)!.body;
  assert.ok(
    top.score < BODY_JACCARD_THRESHOLD,
    `near-duplicate bodies: ${top.a} / ${top.b} (Jaccard ${top.score.toFixed(3)})\n  ${top.a}: ${bodyOf(top.a)}\n  ${top.b}: ${bodyOf(top.b)}`
  );
  // Always surface the closest pair in the test log, pass or fail, so the
  // margin is visible when new items are added.
  console.log(`closest bodies: ${top.a} / ${top.b} at ${top.score.toFixed(3)} (threshold ${BODY_JACCARD_THRESHOLD})`);
});

test(`no item copies a sentence (${MIN_COPIED_SENTENCE_WORDS}+ words) verbatim from another`, () => {
  const owner = new Map<string, string>();
  const copies: string[] = [];
  for (const item of items) {
    for (const sentence of new Set(longSentences(item.body, MIN_COPIED_SENTENCE_WORDS))) {
      const first = owner.get(sentence);
      if (first && first !== item.id) copies.push(`${item.id} repeats ${first}: "${sentence}"`);
      else owner.set(sentence, item.id);
    }
  }
  assert.deepEqual(copies, [], copies.join("\n"));
});

test(`no two bodies share a verbatim run longer than ${MAX_SHARED_RUN_WORDS} words`, () => {
  let worst = { a: "", b: "", length: 0, run: "" };
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const r = longestSharedRun(items[i].body, items[j].body);
      if (r.length > worst.length) worst = { a: items[i].id, b: items[j].id, ...r };
    }
  }
  assert.ok(
    worst.length <= MAX_SHARED_RUN_WORDS,
    `${worst.a} / ${worst.b} share ${worst.length} words verbatim: "${worst.run}"`
  );
  console.log(`longest shared run: ${worst.a} / ${worst.b}, ${worst.length} words ("${worst.run}")`);
});

test("headlines (titles that aren't stock labels) are unique", () => {
  const formats = new Set(items.map((i) => normalizeText(i.format)));
  const seen = new Map<string, string>();
  const dupes: string[] = [];
  for (const item of items) {
    const t = normalizeText(item.title);
    if (formats.has(t) || STOCK_TITLES.has(t)) continue;
    const first = seen.get(t);
    if (first) dupes.push(`${item.id} reuses the headline of ${first}: "${item.title}"`);
    else seen.set(t, item.id);
  }
  assert.deepEqual(dupes, [], dupes.join("\n"));
});

test("the detector itself catches a reworded copy and a lifted sentence", () => {
  // Guards against the checks above silently passing everything.
  const original = items.find((i) => i.id === "wildlife-5")!;
  const reworded = {
    id: "probe",
    body: original.body.replace("Three pigeons", "Four pigeons").replace("bank", "library"),
  };
  const [top] = rankBodySimilarity([original, reworded], SHINGLE_SIZE);
  assert.ok(top.score >= BODY_JACCARD_THRESHOLD, `reworded copy scored only ${top.score.toFixed(3)}`);

  const lifted = `A new sentence opens this one. ${items.find((i) => i.id === "museum-7")!.body.split(". ")[0]}.`;
  const shared = longSentences(lifted, MIN_COPIED_SENTENCE_WORDS).filter((s) =>
    longSentences(items.find((i) => i.id === "museum-7")!.body, MIN_COPIED_SENTENCE_WORDS).includes(s)
  );
  assert.ok(shared.length > 0, "lifted sentence not detected");
});
