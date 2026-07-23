import { DailyItem } from "./content";
import { UNIVERSES } from "./universes";

export interface RssEntry {
  item: DailyItem;
  dayKey: string;
}

export interface RssOptions {
  siteUrl: string; // no trailing slash
  buildDate: string; // RFC-822, e.g. new Date().toUTCString()
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Wrap free text in CDATA; the replace guards against a literal "]]>"
// inside the body prematurely closing the section.
function cdata(value: string): string {
  return `<![CDATA[${value.replace(/\]\]>/g, "]]]]><![CDATA[>")}]]>`;
}

function rfc822(dayKey: string): string {
  return new Date(`${dayKey}T00:00:00.000Z`).toUTCString();
}

// Render a valid RSS 2.0 document. Kept pure (no clock, no env) so it can be
// snapshot-tested deterministically — the route supplies siteUrl/buildDate.
export function renderRssFeed(entries: RssEntry[], opts: RssOptions): string {
  const site = opts.siteUrl.replace(/\/$/, "");
  const selfHref = `${site}/rss.xml`;

  const items = entries
    .map(({ item, dayKey }) => {
      const universe = UNIVERSES[item.universe];
      const permalink = `${site}/day/${dayKey}`;
      const title = `${universe.name} — ${item.format}`;
      return [
        "    <item>",
        `      <title>${escapeXml(title)}</title>`,
        `      <link>${escapeXml(permalink)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(permalink)}</guid>`,
        `      <pubDate>${rfc822(dayKey)}</pubDate>`,
        `      <category>${escapeXml(universe.name)}</category>`,
        `      <description>${cdata(item.body)}</description>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>The Daily Nonsense</title>
    <link>${escapeXml(site)}</link>
    <atom:link href="${escapeXml(selfHref)}" rel="self" type="application/rss+xml" />
    <description>Your daily permission to waste 60 seconds.</description>
    <language>en-us</language>
    <lastBuildDate>${escapeXml(opts.buildDate)}</lastBuildDate>
    <ttl>60</ttl>
${items}
  </channel>
</rss>
`;
}
