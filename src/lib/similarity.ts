// Near-duplicate detection for Daily Items. Used by duplicates.test.ts to
// stop a new item from quietly re-running an existing premise or copying
// another item's wording. Pure text functions, no dependencies.

// Lowercase, fold typographic quotes and dashes, turn every other
// punctuation mark into a space, collapse whitespace.
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[‘’‛']/g, "")
    .replace(/[“”"]/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function words(text: string): string[] {
  const n = normalizeText(text);
  return n ? n.split(" ") : [];
}

// Word k-shingles (contiguous k-word sequences). Texts shorter than k
// words yield a single shingle of the whole text.
export function shingles(text: string, k = 3): Set<string> {
  const w = words(text);
  const out = new Set<string>();
  if (w.length === 0) return out;
  if (w.length < k) {
    out.add(w.join(" "));
    return out;
  }
  for (let i = 0; i + k <= w.length; i++) out.add(w.slice(i, i + k).join(" "));
  return out;
}

export function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 0;
  let inter = 0;
  for (const s of a) if (b.has(s)) inter++;
  return inter / (a.size + b.size - inter);
}

// Sentences, normalized, keeping only those at least `minWords` long, so
// stock institutional phrases ("It declined.") don't count as copying.
export function longSentences(text: string, minWords: number): string[] {
  return text
    .split(/(?<=[.!?])\s+|:\s+/)
    .map(normalizeText)
    .filter((s) => s.split(" ").filter(Boolean).length >= minWords);
}

export interface SimilarPair {
  a: string;
  b: string;
  score: number;
}

// Every pair's body similarity, most similar first.
export function rankBodySimilarity(
  items: ReadonlyArray<{ id: string; body: string }>,
  k = 3
): SimilarPair[] {
  const sh = items.map((item) => shingles(item.body, k));
  const pairs: SimilarPair[] = [];
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      pairs.push({ a: items[i].id, b: items[j].id, score: jaccard(sh[i], sh[j]) });
    }
  }
  return pairs.sort((x, y) => y.score - x.score);
}

// Length (in words) of the longest word sequence two texts share verbatim,
// after normalization, and the sequence itself.
export function longestSharedRun(a: string, b: string): { length: number; run: string } {
  const wa = words(a);
  const wb = words(b);
  let best = 0;
  let end = 0;
  let prev = new Array<number>(wb.length + 1).fill(0);
  for (let i = 1; i <= wa.length; i++) {
    const cur = new Array<number>(wb.length + 1).fill(0);
    for (let j = 1; j <= wb.length; j++) {
      if (wa[i - 1] === wb[j - 1]) {
        cur[j] = prev[j - 1] + 1;
        if (cur[j] > best) {
          best = cur[j];
          end = i;
        }
      }
    }
    prev = cur;
  }
  return { length: best, run: wa.slice(end - best, end).join(" ") };
}
