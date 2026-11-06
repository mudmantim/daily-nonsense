# Issue 3: Editorial Review (2026-11-06)

> **Chip's round 2 decisions (2026-11-06), final:**
> - `notices-12`: **keep the original.** Investigation shows the reference is *intentional*, not broken (see below).
> - `committee-14`: **keep the original.** Chip: "the historical lack of attention is the joke." My proposed cut is withdrawn.
> - `deir-15`: **keep the correction.** Verified: all four other uses of "advised" in the corpus are Bureau items.
>
> **Net editorial diff for Issue 3: one item, `deir-15`.** The sections below are kept as the record of the review.

**Reviewer:** Claude, at Chip's request (relayed by Tim, 2026-11-06). **Chip's own read: pending** until the browser link is back. The two open calls below are for Chip to argue, not Tim.
**Scope:** all 28 items in `src/lib/contentIssue3.ts`, premiering 2026-12-01 → 12-28. Each was checked against `world/INSTITUTIONS.md`, `STYLE_GUIDE.md` (never-say lists *and* each institution's register), `TIMELINE.md` and the world artifacts. The test suite (voice, duplicates, schedule) already passes. This review covers what tests can't: whether each item is funny, clear and in register.

## Verdict

| Result | Count | Items |
|---|---|---|
| Approve as written | 25 | everything not listed below |
| **Fixed in this pass** | 1 | `deir-15` |
| **Rework recommended (open for Chip)** | 2 | `notices-12`, `committee-14` |

No item contradicts canon or answers a never-answer question, and none needs a date-sensitive rewrite.

## Fixed: `deir-15` (Safety Bulletin, the telephone that rings when you sit down)
**Defect:** register bleed. "The Department advises…" and "residents are advised" belong to the Bureau, whose three advisories all use them. The Department never does; it determines, concludes, and says what findings indicate. A single word choice like this counts as voice bleed (STYLE_GUIDE, from Chip's Checkpoint 1 review). The opening sentence was also clumsy ("at a frequency findings indicate is significant").
**Now:** "Findings indicate that a telephone rings within forty seconds of a person sitting down, at a frequency the Department has determined to be significant. The effect is strongest when the person is holding a hot drink. Pending further study, the Department's interim guidance is to sit down with the telephone already in hand."
The joke and its order are unchanged. `verify:fast` passes (72/72).

## Open for Chip

### `notices-12`: the bench that faces the library (premieres Dec 24)
> Residents are reminded that the bench outside the public library faces the library. This notice should be read alongside OPN-4473.

**My position: it's weak as written, and it's filler.** The joke depends on a cross-reference that no reader can follow. Notice numbers like OPN-4473 exist only in `world/artifacts/notices/NOTICE_TEMPLATE.md`, and `notices-11` (which *is* OPN-4473) never shows its number on the site. On the page, all the reader gets is a bench facing a library.
**Options:**
- (a) **Rework in place**, keeping the id and slot so the schedule doesn't change. My draft: *"Residents are reminded that the bench outside the public library faces the library. Residents seated there are reminded that the library is open, and has chairs."* This needs `NOTICE_TEMPLATE.md`'s OPN-4474 line updated to match.
- (b) **Cut it.** That's allowed before premiere, but it shifts Dec 24–28 and the rotation after it, which means regenerating the Issue 3 schedule expectations.
- (c) Keep it as written, if Chip thinks the opacity is the joke. I don't: Notices are blank-faced, not cryptic.

**Resolved: keep the original.** At Chip's request I traced whether OPN-4473 is intentionally untraceable or an accidental broken reference. **It's intentional.** `world/artifacts/notices/NOTICE_TEMPLATE.md` has a Standing Rule, "A notice may reference a prior notice by reference number but must never explain why the prior notice is relevant." That rule was added in `834054e` (Product Checkpoint 3, 2026-07-16), three months before Issue 3. OPN-4473 is a real filed notice (`notices-11`, premiering Dec 18, six days earlier), and the OPN-4474 record says "for reasons the notice does not give". So the unexplained cross-reference is the Notices voice working as designed: legitimacy assumed, never established. No new canon was needed. *(Withdrawn: my original recommendation was (a).)* I haven't applied it, because it's new copy rather than a rule fix, and Chip should get the chance to reject it.

### `committee-14`: Any Other Business (premieres Dec 28)
> …be moved to the start of the agenda, **where it may receive the attention it has historically received at the end.**

The bolded clause reads two ways. One is "the same (no) attention", which is a joke. The other is a slip. The rest of the item (raised under AOB at 6:58 p.m.; the next meeting opens with it) is strong.
**My proposal:** delete the clause, so the sentence ends "…moved to the start of the agenda." The structural joke carries it. **Not applied**, pending Chip.

## The five judgment calls flagged in Session 12
| Item | Question | Ruling |
|---|---|---|
| `committee-13` | Tie vote adapted to two unanimous, contradictory motions | **Approve.** This keeps "passes unanimously" intact and is funnier than a tie |
| `clarifications-11` | Touches the 1987 mandate | **Approve.** It answers nothing, and the seating chart calls back `museum-12` (Nov 29) |
| `notices-12` | Cites OPN-4473 without saying why | **Rework**, see above |
| `deir-14` | Ketchup as a generic noun | **Approve** |
| `notices-11` | Real-world clock change | **Approve** as already reworded (no date, reruns safely) |

## Minor notes (no action)
- `bureau-12`: "logging nothing" followed by "will be opened as a situation of moderate note" is a conditional, not a contradiction. It reads correctly. The four-day hold matches the 2018 Anomaly (`content.ts`).
- Five of the 28 depend on canon (`museum-15`, `committee-12`, `wildlife-12`, `lostfound-14`, `clarifications-12`). That's fine on the site, where the archive builds that context. It matters only for social selection.

## Release state (checked 2026-11-06)
- **Issue 3 is in production. Verified against Vercel:** production deployment `dpl_6eAJfX2Cf7qnPR7crfFuFsTLrVUo` (READY, 2026-10-17 18:20 UTC) runs commit `de4def5`, which is `origin/master`. It premieres 2026-12-01.
- So the Nov 24 target really means **landing the review edits before each premiere**: `notices-12` on Dec 24, `deir-15` on Dec 25 and `committee-14` on Dec 28. The schedule itself needs no change.
- The `deir-15` fix is committed **locally only**, on its own branch `release/issue-3-deir-15` and kept apart from the social work. Pushing it to master deploys it; that waits for full verification and the owner's go-ahead.
- Technical verification: `verify:fast` passes (72/72). A fresh `next build` is on hold while another session recovers disk space on the shared filesystem. The last build passed earlier today, before the deir-15 edit, which is copy-only.

## Still needed
- Chip's read of `notices-12` and `committee-14`, then apply or decline.
- **Owner:** commit and push the review edits, any time before Dec 24.
