# Content backlog and intake process

> Internal. How new Daily Items get from an idea to a scheduled date without changing anything already published. The world rules live in `world/` (start with `world/README.md`). This file covers the pipeline and the pending ideas.

## The one rule: published history is append-only

Every date that has been served is fixed: its permalink, its RSS guid and its calendar cell. So:

- **Never edit, reorder or delete a published item.** That covers v1 (the 50 items in `src/lib/content.ts`) and every issue item whose premiere date has passed. A correction ships as a *new* item in a later issue. `src/lib/history.test.ts` enforces this for v1 with a golden fixture of every date from 2026-01-01 through 2026-10-31, plus a content hash.
- **Never edit an issue manifest whose `startDayKey` has passed.** The one exception is appending a new issue to `ISSUES`.
- **To retire an item**, give a *new* issue a `retire: ["id"]` entry. The item stops recurring from that issue's start date. It stays in the pool, so its past dates still resolve to it, and it stays in the archive. Retirement never removes anything from history.

## How scheduling works (v1.1 onward)

`src/lib/rotation.ts` is a pure function of the date:

| Dates | What runs |
|---|---|
| before **2026-11-01** (the cutover) | the frozen v1 rotation: `seededShuffle(v1 pool, 20260101)[day mod 50]`, exactly as it shipped |
| from an issue's `startDayKey` | that issue's **premieres**: each new item once, one per day, in manifest order |
| after the premieres | the **long-term rotation** over the whole library: cycles in which every item runs once, each cycle reshuffled with a seed derived from (issue seed, cycle number); no item runs twice within **30 days**, including across cycle and issue boundaries |

Adding an issue whose start date is in the future changes no date before that start (tested in `rotation.test.ts`). The archive and `/random` show only items whose first date has arrived, so queued items aren't spoiled.

## Status flow

`idea` → `drafted` → `reviewed` → `scheduled` → (published, automatically, on its premiere date)

| Status | Meaning | Where it lives |
|---|---|---|
| idea | a one-line premise | the tables below |
| drafted | full copy written to the schema | a branch, in a new `src/lib/contentIssueN.ts` |
| reviewed | passed the checklist below and editorial sign-off (the owner, or the Editorial Desk if the owner delegates it) | same branch |
| scheduled | listed in a new `ISSUES` entry with a future `startDayKey` | merged to `master` |

When an idea is drafted, move its row to "Used" with the item id, so it isn't drafted twice.

## Editorial checklist (every item, every issue)

1. **Constitution.** Nothing is fictional to the institutions; nobody explains; nobody winks. No real people, brands, places that pin it to the real world, politics, or internet culture.
2. **Never-answer list** (`world/CONSTITUTION.md`): the item doesn't resolve the Filing Cabinet, Tuesday's extensions, the goose, the Office's policy, or the Bureau's founding.
3. **Voice** (`world/STYLE_GUIDE.md`, `world/INSTITUTIONS.md`): the institution's never-say/always-say columns, its formats, and vocabulary exclusivity ("quorum" is the Committee's, "accessioned" is the Museum's, and so on). `voice.test.ts` checks the mechanical part.
4. **The Museum Test** (`world/CONSTITUTION.md`, "The Test"; the bar used in Editorial Desk Volume 1, `PROJECT_JOURNAL.md` Session 7): printed, laminated and pinned to the corkboard of a real, dull office, would a visitor believe it for three seconds? It must also work for a first-time reader: callbacks reward, never gate (`world/TIMELINE.md`).
5. **Continuity.** Tags only from `world/TIMELINE.md` / `src/lib/timeline.ts`; a new event goes into both first. Reference numbers follow `world/artifacts/FILING_SYSTEM.md`, continuing the highest number on file. `relatedDocuments`/`callbacks` must resolve.
6. **No duplicates.** Run `npm run check:duplicates`. It fails on a repeated id, on bodies with a word-3-shingle Jaccard similarity of 0.30 or more, on a verbatim sentence of 5+ words shared with another item, on a shared run of more than 11 words, or on a repeated headline. It prints the closest pair. Also check by eye that the *premise* is new: the detector catches wording, not jokes.
7. **Run `npm run verify`** (lint, typecheck, all tests, build).

## Scheduling a new issue (step by step)

1. Create `src/lib/contentIssueN.ts` exporting `ISSUE_N_ITEMS` and `ISSUE_N_PREMIERES`. Use new ids continuing each institution's numbering (`deir-12`, …).
2. In `src/lib/content.ts`, append the items to `CONTENT_POOL` and append an entry to `ISSUES`:
   `{ id: "issue-N", startDayKey: "YYYY-MM-DD", seed: <YYYYMMDD of the start>, premieres: ISSUE_N_PREMIERES }`.
3. **Pick a `startDayKey` at least 7 days after the day you expect to deploy**, and no earlier than the previous issue's start plus its number of premieres (the scheduler refuses overlaps). If the deploy slips past the start date, move the start date later *before* deploying. Deploying an issue whose start date has already passed would change dates that readers already saw.
4. Order the premieres so no institution runs two days in a row (tested).
5. Preview the schedule: `npx tsx -e 'import {getItemForDate} from "./src/lib/content"; for (let i=0;i<40;i++){const d=new Date(Date.UTC(2027,0,1+i)); console.log(d.toISOString().slice(0,10), getItemForDate(d).id)}'`.
6. Update the affected `world/artifacts/*` (catalogue numbers, intake numbers, proposals), the journal, and the release notes.

## Ideas (status: idea)

Premise one-liners. Not yet checked against the full checklist; some will not survive drafting.

### Department of Extremely Important Research
| # | Premise |
|---|---|
| D1 | Finding: the phrase "quick question" precedes a question of a mean duration of 22 minutes. |
| D2 | Safety Bulletin: the corner of the coffee table is observed to be nearer to shins after dark. |
| D3 | Scientific Paper: the telephone rings within 40 seconds of a person sitting down, at a frequency the Department considers significant. |
| D4 | Rejected Proposal 0650: a study of whether any bottle of ketchup has ever been finished. Rejected for lack of a completed sample. |
| D5 | Research Finding: in a queue, the line not chosen is observed to move faster, in every replication. |

### Museum of Useless History
| # | Premise |
|---|---|
| M1 | Exhibit #446: one pen that wrote only on the second attempt to sign a form. |
| M2 | Historical Discovery: the earliest known OUT OF ORDER sign, still attached to its machine, which is in working order. |
| M3 | Curator's Notes: the gift shop's postcard of the Napkin Treaty is now itself on display beside the Treaty. |
| M4 | Today in History: the first recorded use of "let's circle back," in a meeting that never circled back. |
| M5 | Newly Unearthed Artifact: a single puzzle piece, sky-coloured, from a puzzle not held by the Museum. |

### Committee for Poor Decisions
| # | Premise |
|---|---|
| C1 | Minutes: a motion to start meetings on time is carried over to the next meeting, which started late. |
| C2 | Official Recommendation: "Any Other Business" is moved to the start of the agenda, where it stays. |
| C3 | Emergency Decision: the minutes of next month's meeting are approved in advance, to save time. |
| C4 | Approved Motion: the Subcommittee on Office Supplies requests a stapler of its own, and is told to wait and see. |
| C5 | Meeting Minutes: a vote is tied, and the tie is referred to the Subcommittee on Precedent, which cites the duck. |

### Neighborhood Wildlife Reports
| # | Premise |
|---|---|
| W1 | Incident Report: a squirrel has buried an acorn in the same planter forty times; the neighbor now suspects it is not the same acorn. |
| W2 | Citizen Complaint: a crow leaves a bottle cap on the same doorstep each morning; the household has not reciprocated. |
| W3 | Wildlife Alert: a moth and the porch light at number 14 have been in a standoff since dusk. |
| W4 | Incident Report: the raccoon of interest (sock inquiry) is observed near the laundromat. No conclusions are drawn. |
| W5 | Animal Interview: a cat sits on the exact centre of the newspaper being read and declines to elaborate. |

### Lost & Found Authority
| # | Premise |
|---|---|
| L1 | Item Recovered: one folded napkin; the method of folding is disputed by two members of staff (napkin-war, without resolving it). |
| L2 | Custodial Note: one bookmark, recovered at page 41 of a book not on file. Staff have kept its place. |
| L3 | Item Recovered: one HELLO MY NAME IS sticker, blank. |
| L4 | Recognition Week reminder (seasonal): several items remain awaiting recognition; none were reunited this year either. |
| L5 | Claim Status: one child's left shoe, size 9; the Authority has kept the space beside it free. |

### Official Public Notices
| # | Premise |
|---|---|
| N1 | Residents are reminded that the pedestrian crossing button has been pressed a sufficient number of times. |
| N2 | Residents are reminded that the clocks change on Sunday; residents who prefer the previous hour may keep it privately. |
| N3 | Tuesday Compromise Observance (seasonal): residents are reminded it falls on a Tuesday. |
| N4 | Residents are reminded that the bench outside the library faces the library. |

### Bureau of Mild Emergencies
| # | Premise |
|---|---|
| B1 | Static Cling Remembrance Day (seasonal): the Bureau's quietest advisory of the year. |
| B2 | Situation Report: fog reported as "lower than usual" over the park; de-escalated to baseline by noon. |
| B3 | De-escalation Notice: a doorbell on Maple Court rang once with no one present. Classification of intent not made. |
| B4 | Advisory: lawn sprinklers on Cedar Row continue to activate during rain. Concerning, not actionable. |

### Office of Public Clarifications
| # | Premise |
|---|---|
| O1 | Response: a request for the Museum's opening time on Tuesday is declined (tuesday-compromise). |
| O2 | Response: a request for the Committee's 1987 mandate is forwarded to the Committee, which has no position. |
| O3 | Public Inquiry Log: a child asked "why?" four times in succession. All four were logged. |
| O4 | Statement of Non-Clarification: regarding the Wednesday of 2004 (wednesday-that-wasnt). |

## Used (drafted into an issue)

| Issue | Items |
|---|---|
| Issue 2 (v1.1, premieres from 2026-11-01) | `deir-8`–`deir-11`, `museum-8`–`museum-12`, `committee-7`–`committee-10`, `wildlife-7`–`wildlife-9`, `lostfound-7`–`lostfound-10`, `notices-7`–`notices-9`, `bureau-7`–`bureau-9`, `clarifications-7`–`clarifications-9` |
