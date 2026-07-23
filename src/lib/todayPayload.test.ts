import { test } from "node:test";
import assert from "node:assert/strict";
import { buildTodayPayload } from "./todayPayload";
import { getTodayItem } from "./content";
import { UNIVERSES } from "./universes";

const NOW = new Date(Date.UTC(2026, 6, 23));

test("buildTodayPayload matches today's rotation item and universe", () => {
  const { item, dayKey } = getTodayItem(NOW);
  const universe = UNIVERSES[item.universe];
  const payload = buildTodayPayload("https://example.test", NOW);

  assert.equal(payload.dayKey, dayKey);
  assert.equal(payload.permalink, `https://example.test/day/${dayKey}`);
  assert.equal(payload.universe.name, universe.name);
  assert.deepEqual(payload.universe.canvasStops, universe.canvasStops);
  assert.equal(payload.item.body, item.body);
  assert.equal(payload.item.rarity, item.rarity);
});

test("buildTodayPayload exposes the full documented contract shape", () => {
  const payload = buildTodayPayload("https://example.test", NOW);
  assert.deepEqual(Object.keys(payload).sort(), ["dayKey", "item", "permalink", "universe"]);
  assert.deepEqual(
    Object.keys(payload.universe).sort(),
    ["canvasStops", "id", "masthead", "metadata", "name", "tagline"]
  );
  assert.deepEqual(Object.keys(payload.item).sort(), ["body", "format", "rarity", "title"]);
});

test("buildTodayPayload normalizes a trailing slash in siteUrl", () => {
  const payload = buildTodayPayload("https://example.test/", NOW);
  assert.ok(!payload.permalink.includes("test//day"), "no double slash in the permalink");
});

test("optional universe fields serialize as null, never undefined", () => {
  // JSON.stringify drops undefined keys, which would silently change the
  // contract shape for the consumer — they must be explicit null instead.
  const payload = buildTodayPayload("https://example.test", NOW);
  const roundTripped = JSON.parse(JSON.stringify(payload));
  assert.ok("masthead" in roundTripped.universe);
  assert.ok("metadata" in roundTripped.universe);
});
