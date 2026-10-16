import { test } from "node:test";
import assert from "node:assert/strict";
import { getAllItems } from "./content";
import { UniverseId } from "./universes";
import { V1_POOL_IDS } from "./fixtures/v1Schedule.golden";

// Mechanical half of the voice check in world/STYLE_GUIDE.md: the "never
// says" column, plus the vocabulary-exclusivity rule from Editorial Desk
// Vol. 1 Session D (some words belong to exactly one institution). It
// applies to items added after v1; the 50 v1 items passed editorial review
// as published and are frozen, legacy wording included. Tone, premise and
// the Museum Test remain a human (editorial) judgment.

const NEVER_SAYS: Record<UniverseId, string[]> = {
  deir: ["discovered", "found", "confirm", "confirms", "confirmed"],
  committee: ["mistake", "bad idea"],
  museum: ["old", "ancient"],
  notices: ["don't", "do not", "stop"],
  wildlife: ["attacked", "aggressive", "guess", "confirmed"],
  lostfound: ["lost", "unclaimed", "missing"],
  bureau: ["emergency", "crisis", "resolved", "probably", "likely"],
  clarifications: [],
};

// Phrases that belong to one institution only.
const EXCLUSIVE: Array<[string, UniverseId]> = [
  ["quorum", "committee"],
  ["accessioned", "museum"],
  ["context pending", "museum"],
  ["awaiting recognition", "lostfound"],
  ["patiently held", "lostfound"],
  ["situation of moderate note", "bureau"],
  ["de-escalated to baseline", "bureau"],
  ["residents are reminded", "notices"],
  ["findings indicate", "deir"],
];

function text(body: string): string {
  // Institution names are proper nouns, not vocabulary.
  const stripped = body
    .replace(/Lost & Found Authority/g, "")
    .replace(/Bureau of Mild Emergencies/g, "")
    .toLowerCase()
    .replace(/[‘’]/g, "'");
  return ` ${stripped.replace(/[^a-z' -]+/g, " ").replace(/\s+/g, " ")} `;
}

const v1 = new Set(V1_POOL_IDS);
const newItems = getAllItems().filter((item) => !v1.has(item.id));

test("post-v1 items avoid their institution's never-say words", () => {
  const problems: string[] = [];
  for (const item of newItems) {
    const t = text(item.body);
    for (const word of NEVER_SAYS[item.universe]) {
      if (t.includes(` ${word} `)) problems.push(`${item.id} (${item.universe}) says "${word}"`);
    }
  }
  assert.deepEqual(problems, [], problems.join("\n"));
});

test("post-v1 items don't borrow another institution's exclusive vocabulary", () => {
  const problems: string[] = [];
  for (const item of newItems) {
    const t = text(item.body);
    for (const [phrase, owner] of EXCLUSIVE) {
      if (item.universe !== owner && t.includes(` ${phrase}`)) {
        problems.push(`${item.id} (${item.universe}) uses "${phrase}", which belongs to ${owner}`);
      }
    }
  }
  assert.deepEqual(problems, [], problems.join("\n"));
});
