# Integration Proposal — mudmantimsapps.com

Design proposal only, per the brief — nothing here is implemented. I have no visibility into mudmantimsapps.com's actual codebase, design system, or component conventions, so this proposes an approach and a concrete shape, flagged everywhere it's an assumption that implementation would need to confirm against the real site.

**Status as of this revision (Session 9, 2026-07-16):** The Daily Nonsense is live at `https://daily-nonsense.vercel.app`. Per Tim's explicit instruction, that URL is **infrastructure, not branding** — nothing below should reference it as a permanent identity. The intended public identity is `daily.mudmantimsapps.com`, not yet configured (see Migration Plan below).

## Goal

A living preview on the homepage that changes every day, giving visitors a reason to check back each morning — not a link to the app, a taste of today's actual artifact.

## Homepage teaser layout

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

A single card/module, not a full-bleed section — sized to sit alongside or below whatever else is on the homepage (portfolio entries, other apps, etc.), not dominate it. Background uses that day's institution gradient at reduced intensity (or a subtle tint derived from it) so the module visually changes day to day even before reading the text, matching mudmantimsapps.com's own surrounding palette rather than fighting it. **Assumption to confirm:** whether the rest of the homepage is light or dark-themed — the gradient treatment assumes it can hold its own card-level background; if the homepage is a plain light background, the card should probably keep a contained dark panel (like the main app) rather than bleeding into the page.

## Daily preview behavior

- Eyebrow: **"Today's Nonsense"** — matches the main app's internal name, sets expectation this updates daily.
- Institution name: pulled directly from `universe.name` — this is the "brand" layer, per the product's own hierarchy (institution first, joke second — same principle applies here).
- Format label: `item.format`, small and muted, same treatment as the main app.
- Body: `item.body` in full for most items (they're 1–3 sentences by design; the Museum Test explicitly selects for things that read fine on their own). No truncation logic needed for the current content — if a future item runs long, truncate at a sentence boundary, never mid-word.
- CTA: **"Read today's document →"** — deliberately not "Read more" or "Visit the app"; keeps the in-universe documentary framing instead of breaking into app-marketing language.
- No loading spinner or reveal animation in this context — that's the main app's "moment," appropriate for a dedicated visit, not for a homepage teaser someone might glance at for two seconds. The card should render instantly with today's content already resolved server-side.
- Reaction buttons, share, copy-image — none of that here. This is a preview, not the experience; those interactions live in the app itself, reached via the CTA.

**Implementation approach** (three options considered; recommendation unchanged from the original proposal):

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

**Caching / freshness:** The endpoint should be revalidated on the same day boundary the main app already uses (UTC midnight, per `content.ts`'s existing `daysSinceEpoch` logic) — reuse that function rather than reimplementing a second date calculation. mudmantimsapps.com should cache the response for some reasonable window (e.g. 1 hour) rather than fetching on every homepage load, and fail gracefully — if the fetch fails, hide the module rather than showing an error or stale placeholder that looks broken.

## Navigation between sites

- The teaser card's CTA (`Read today's document →`) is the only link from mudmantimsapps.com into the Daily Nonsense app — no separate nav-bar entry is assumed necessary, since the card itself is the introduction. If mudmantimsapps.com has a persistent top-level nav listing all of Tim's apps, Daily Nonsense should get a normal entry there too, styled identically to whatever pattern the other apps already use (no special-casing).
- **Coming back the other direction:** the Daily Nonsense app itself currently has no link back to mudmantimsapps.com anywhere in its UI (`page.tsx`, `yesterday/page.tsx`, `random/page.tsx`, `archive/page.tsx` — none reference an external site). Recommend adding one small, quiet link — e.g. part of a footer or tucked near the existing nav row (Today / Yesterday / Random / Archive) — reading something like "Part of mudmantimsapps.com" or "More at mudmantimsapps.com," styled with the same low-emphasis treatment as the existing nav links (`text-white/50`, underline-on-hover). This should stay minimal: the Constitution's "nobody explains" principle governs the *content*, not necessarily the chrome, but the app's whole aesthetic is deliberately restrained, and a loud cross-promotion banner would fight that. **Not built yet** — small, low-risk addition, but touches shared chrome across all four routes, so flagging it here rather than just doing it, since it's the first UI element in this app that points outward.
- No deep-linking requirements identified (e.g., mudmantimsapps.com linking to a *specific* Daily Item) — the CTA should always point at the live "today" route, not a specific day, since the whole premise is "what's true today."

## Mobile behavior

- Card goes full-width, stacks normally with whatever's above/below it on the homepage.
- Institution name may wrap to two lines on narrow screens (same as the main app already handles) — fine, no truncation needed there.
- Body text drops one step in size versus desktop, same mobile-first pattern already used throughout this app's own components.
- Entire-card-is-a-link interaction matters more on mobile, not less — no separate small CTA link to miss with a thumb.
- The proposed "link back to mudmantimsapps.com" (Navigation section above) should sit in the same nav row as Today/Yesterday/Random/Archive on mobile, not as a separate floating element — that row already wraps gracefully at narrow widths (`flex flex-wrap`), so one more quiet link fits the existing pattern rather than needing new responsive handling.

## Branding consistency

- **The institution is still the brand, even inside someone else's homepage.** The teaser card's visual identity comes from that day's `universe.gradient`/`canvasStops` — not from a fixed "Daily Nonsense" logo or color. This is a deliberate extension of the app's own internal hierarchy (institution first, joke second) into the homepage context, not a new rule.
- **What mudmantimsapps.com's shell should contribute:** typography (the card should read as typeset by mudmantimsapps.com, using its fonts/sizing scale, not importing Geist/Fraunces wholesale into a page that isn't otherwise using them — unless mudmantimsapps.com already uses similar serif/sans pairing, worth confirming), and the light/dark theme decision noted in the Layout section.
- **What the Daily Nonsense app should keep owning regardless of where it's embedded:** the copy voice (institutional, sincere, un-winking — this doesn't change based on where it's displayed), the per-institution gradient identity, and the "Read today's document →" CTA phrasing (not "Try our app" or similar marketing language — breaks the fiction).
- **No shared logo/wordmark exists yet for either "The Daily Nonsense" as a product or for mudmantimsapps.com as a parent brand** — this proposal doesn't assume one. If Tim wants a consistent mark across both (e.g. a small icon before "The Daily Nonsense" text in the teaser eyebrow), that's a design decision to make deliberately, not a default to invent here.
- **Metadata parity:** the Daily Nonsense app's own Open Graph tags (added Session 6) already say "The Daily Nonsense" as `og:site_name`, independent of what domain serves it — this stays correct through the eventual domain migration with zero changes needed, since it's not domain-derived.

## Migration plan — Vercel URL → daily.mudmantimsapps.com

Not implemented yet, per Tim's explicit instruction — planning only, so this is ready to execute quickly once greenlit, without re-deriving the steps from scratch.

1. **Prerequisite:** the deployment pipeline should be git-linked first (in progress — see `PROJECT_JOURNAL.md` Session 9 / `AUTONOMY.md` item 10), so the domain cutover doesn't need to coincide with a manual redeploy.
2. **Add the custom domain in Vercel:** Project → Settings → Domains → add `daily.mudmantimsapps.com`. Vercel will issue the exact DNS record needed (typically a `CNAME` pointing at `cname.vercel-dns.com`, but Vercel's own UI gives the authoritative record at add-time — don't hardcode a guess here).
3. **DNS record:** added wherever `mudmantimsapps.com`'s DNS is currently managed (unknown to this repo — Tim's call, likely the same registrar/DNS host as the parent domain). This is the one step in this whole plan that's irreversible-ish in the sense of being externally visible (a public DNS change) — should be a deliberate action Tim takes or explicitly approves, not something done silently.
4. **Update `NEXT_PUBLIC_SITE_URL`:** once the custom domain resolves and Vercel confirms the SSL certificate is issued, set the project's `NEXT_PUBLIC_SITE_URL` environment variable to `https://daily.mudmantimsapps.com` (a real env var at that point, assuming project settings are manageable by then — see `AUTONOMY.md` item 10's env-var gap) and update the `metadataBase` fallback in `src/app/layout.tsx` to match, so Open Graph image URLs and canonical metadata resolve to the new domain even if the env var is ever unset. Redeploy (automatic, if git-linked by then) to bake the change into a fresh build.
5. **Keep the old `.vercel.app` URL alive, don't hard-redirect away immediately.** Vercel domains don't get reassigned to anyone else, so there's no urgency to kill it — but *do* verify the new custom domain serves identical content before treating the old URL as deprecated in any external-facing copy (this proposal, `README.md`, anywhere else the URL might be written down).
6. **Update every place the Vercel URL is currently written down as if it were permanent:** `README.md`'s Deploy section, `PROJECT_JOURNAL.md`'s Session 8 entry (leave as historical record, don't rewrite history — just make sure nothing *forward-looking* still points at the old URL), this proposal's own "Status" line at the top, and the mudmantimsapps.com teaser card's CTA target once that's built.
7. **No content or code changes needed beyond the URL swap** — the app itself has no domain-specific logic beyond `metadataBase`/`NEXT_PUBLIC_SITE_URL`, by design (Session 8 built it that way specifically because the domain wasn't final yet).

## What I'd want confirmed before building any of this

1. Where on the homepage the teaser card lives (hero-level prominence, or a smaller module further down).
2. Light or dark surrounding design system, per the Layout section.
3. Whether mudmantimsapps.com already has a pattern for "preview cards" linking to other projects — this should match that pattern's structure even if the Daily Nonsense content itself stays distinct.
4. Whether Tim wants a shared visual mark between mudmantimsapps.com and Daily Nonsense (Branding Consistency section) or intentional visual independence (institution-branding-only, no parent-brand mark) — both are reasonable, this is a product-identity call, not an engineering one.
5. Where mudmantimsapps.com's DNS is managed, when the domain migration is actually greenlit (Migration Plan, step 3).
