# Homepage Integration Proposal — mudmantimsapps.com

Design proposal only, per the brief — nothing here is implemented. I have no visibility into mudmantimsapps.com's actual codebase, design system, or component conventions, so this proposes an approach and a concrete shape, flagged everywhere it's an assumption that implementation would need to confirm against the real site.

## Goal

A living preview on the homepage that changes every day, giving visitors a reason to check back each morning — not a link to the app, a taste of today's actual artifact.

## Layout

```
┌─────────────────────────────────────┐
│  TODAY'S NONSENSE                    │  ← eyebrow, small caps, muted
│                                       │
│  THE OFFICE OF PUBLIC CLARIFICATIONS │  ← institution name, medium weight
│  Public Inquiry Log                  │  ← format, smaller, muted
│                                       │
│  "This office received 214 requests  │  ← today's body text, serif,
│   for clarification regarding the    │     the actual centerpiece
│   2018 static cling incident..."     │
│                                       │
│  Read today's document →             │  ← CTA, high contrast
└─────────────────────────────────────┘
```

A single card/module, not a full-bleed section — sized to sit alongside or below whatever else is on the homepage (portfolio entries, other apps, etc.), not dominate it. Background uses that day's institution gradient at reduced intensity (or a subtle tint derived from it) so the module visually changes day to day even before reading the text, matching mudmantimsapps.com's own surrounding palette rather than fighting it. **Assumption to confirm:** whether the rest of the homepage is light or dark-themed — the gradient treatment below assumes it can hold its own card-level background; if the homepage is a plain light background, the card should probably keep a contained dark panel (like the main app) rather than bleeding into the page.

## Copy

- Eyebrow: **"Today's Nonsense"** — matches the main app's internal name, sets expectation this updates daily.
- Institution name: pulled directly from `universe.name` — this is the "brand" layer, per the product's own hierarchy (institution first, joke second — same principle applies here).
- Format label: `item.format`, small and muted, same treatment as the main app.
- Body: `item.body` in full for most items (they're 1–3 sentences by design; the Museum Test explicitly selects for things that read fine on their own). No truncation logic needed for the current content — if a future item runs long, truncate at a sentence boundary, never mid-word.
- CTA: **"Read today's document →"** — deliberately not "Read more" or "Visit the app"; keeps the in-universe documentary framing instead of breaking into app-marketing language.

## Interaction

- The entire card is a single link/button (not just the CTA text) — larger tap target, standard pattern for a homepage teaser module.
- Hover: a subtle lift (small `translateY` + shadow) or brightness increase on the gradient, whichever matches mudmantimsapps.com's existing hover language elsewhere on the page. **Assumption to confirm:** what that existing language is; proposing the safer, more universal option (lift + shadow) since it's least likely to clash with an unknown design system.
- No loading spinner or reveal animation in this context — that's the main app's "moment," appropriate for a dedicated visit, not for a homepage teaser someone might glance at for two seconds. The card should render instantly with today's content already resolved server-side.
- Reaction buttons, share, copy-image — none of that here. This is a preview, not the experience; those interactions live in the app itself, reached via the CTA.

## Implementation approach

Three options considered:

1. **`<iframe>` embed** pointing at the deployed app. Simplest to wire up, fully decoupled — but iframes can't inherit the host page's hover/typography treatment, add an extra network round-trip, and are generally a worse fit for something meant to feel native to the homepage.
2. **Direct code sharing** (import the content module if both sites live in one deployment). Only viable if mudmantimsapps.com and this app end up in the same monorepo/build — currently unknown, and probably not worth restructuring either project just for this.
3. **Recommended: a small read-only JSON endpoint on this app, fetched server-side by mudmantimsapps.com.** E.g. `GET /api/today` returning:
   ```json
   {
     "universe": { "name": "...", "canvasStops": ["#...", "#...", "#..."], "masthead": "..." },
     "item": { "format": "...", "title": "...", "body": "...", "rarity": "common" }
   }
   ```
   mudmantimsapps.com fetches this at build/request time (with caching — see below) and renders it with its own markup and styling. Keeps both codebases independent, gives the homepage full control over presentation, and reuses the exact same `getTodayItem()` logic this app already has as the single source of truth for "what day is it" — no second rotation calendar to keep in sync.

   **Not built yet** — this would be a small, well-scoped addition to this repo (one new route, no new dependencies) once the integration is actually greenlit, not before.

## Caching / freshness

The endpoint should be revalidated on the same day boundary the main app already uses (UTC midnight, per `content.ts`'s existing `daysSinceEpoch` logic) — reuse that function rather than reimplementing a second date calculation. mudmantimsapps.com should cache the response for some reasonable window (e.g. 1 hour) rather than fetching on every homepage load, and fail gracefully — if the fetch fails, hide the module rather than showing an error or stale placeholder that looks broken.

## Mobile behavior

- Card goes full-width, stacks normally with whatever's above/below it on the homepage.
- Institution name may wrap to two lines on narrow screens (same as the main app already handles) — fine, no truncation needed there.
- Body text drops one step in size versus desktop, same mobile-first pattern already used throughout this app's own components.
- Entire-card-is-a-link interaction matters more on mobile, not less — no separate small CTA link to miss with a thumb.

## What I'd want confirmed before building this

1. Where on the homepage this lives (hero-level prominence, or a smaller module further down).
2. Light or dark surrounding design system, per the layout note above.
3. Whether mudmantimsapps.com already has a pattern for "preview cards" linking to other projects — this should match that pattern's structure even if the Daily Nonsense content itself stays distinct.
4. Confirmed production domain for the Daily Nonsense app itself (nothing is deployed yet — see `README.md`), since the CTA needs somewhere real to point.
