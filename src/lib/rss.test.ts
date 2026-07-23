import { test } from "node:test";
import assert from "node:assert/strict";
import { renderRssFeed, RssEntry } from "./rss";
import { getRecentDays, getAllItems } from "./content";

const OPTS = { siteUrl: "https://example.test", buildDate: "Thu, 23 Jul 2026 12:00:00 GMT" };

function feedFor(now: Date, count = 30): string {
  return renderRssFeed(getRecentDays(count, now) as RssEntry[], OPTS);
}

test("feed is well-formed RSS 2.0 with the expected channel metadata", () => {
  const xml = feedFor(new Date(Date.UTC(2026, 6, 23)));
  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(xml, /<rss version="2\.0"/);
  assert.match(xml, /<title>The Daily Nonsense<\/title>/);
  assert.match(xml, /<atom:link href="https:\/\/example\.test\/rss\.xml" rel="self"/);
  assert.match(xml, /<lastBuildDate>Thu, 23 Jul 2026 12:00:00 GMT<\/lastBuildDate>/);
});

test("each entry links to its dated permalink with a matching guid and RFC-822 pubDate", () => {
  const xml = feedFor(new Date(Date.UTC(2026, 6, 23)));
  assert.match(xml, /<link>https:\/\/example\.test\/day\/2026-07-23<\/link>/);
  assert.match(xml, /<guid isPermaLink="true">https:\/\/example\.test\/day\/2026-07-23<\/guid>/);
  assert.match(xml, /<pubDate>Wed, 22 Jul 2026 00:00:00 GMT<\/pubDate>/); // the day before today
});

test("count is clamped to available days near the epoch", () => {
  // Two days in: only 2026-01-02 and 2026-01-01 exist.
  const xml = feedFor(new Date(Date.UTC(2026, 0, 2)), 30);
  const itemCount = (xml.match(/<item>/g) ?? []).length;
  assert.equal(itemCount, 2);
});

test("XML-special characters in element text are escaped outside CDATA", () => {
  // Build a deterministic entry from a Lost & Found item so the ampersand in
  // the institution name is guaranteed to land in <title>/<category>,
  // regardless of what the rotation happens to surface.
  const lostfound = getAllItems().find((i) => i.universe === "lostfound");
  assert.ok(lostfound, "expected a lostfound item in the pool");
  const xml = renderRssFeed([{ item: lostfound!, dayKey: "2026-07-23" }], OPTS);

  assert.ok(
    xml.includes("<category>The Lost &amp; Found Authority</category>"),
    "institution name ampersand must be escaped in <category>"
  );

  // No raw, unescaped ampersand anywhere in element text. CDATA sections are
  // exempt (their contents are literal by definition), so strip them first.
  const withoutCdata = xml.replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, "");
  const rawAmp = withoutCdata.match(/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[0-9a-fA-F]+;)/);
  assert.equal(rawAmp, null, "found an unescaped ampersand outside CDATA");
});

test("bodies are wrapped in CDATA", () => {
  const xml = feedFor(new Date(Date.UTC(2026, 6, 23)));
  assert.match(xml, /<description><!\[CDATA\[.*\]\]><\/description>/);
});

test("siteUrl trailing slash is normalized away", () => {
  const xml = renderRssFeed(getRecentDays(1, new Date(Date.UTC(2026, 6, 23))) as RssEntry[], {
    ...OPTS,
    siteUrl: "https://example.test/",
  });
  assert.ok(!xml.includes("example.test//"), "no double slash from a trailing-slash siteUrl");
});
