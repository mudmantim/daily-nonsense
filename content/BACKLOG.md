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

Premise one-liners. Not yet checked against the full checklist; some will not survive drafting. Numbering continues; a drafted idea moves to "Used" below.

### Department of Extremely Important Research
| # | Premise |
|---|---|
| D2 | Safety Bulletin: the corner of the coffee table is observed to be nearer to shins after dark. (Check against `deir-9`, the stair which is not there: same household-in-the-dark territory.) |
| D6 | Research Finding: doors marked PULL are pushed first in 61% of observations; doors marked PUSH are pulled first in 58%. |
| D7 | Press Release: the Department acknowledges receipt of an unrequested peer review of its own findings, from the Committee. It has been peer-reviewed. |

### Museum of Useless History
| # | Premise |
|---|---|
| M4 | Today in History: the first recorded use of "let's circle back," in a meeting that never circled back. (Check: may read as office/internet culture.) |
| M6 | Curator's Notes: the Museum's visitor book, now full, has been accessioned; visitors are asked to sign the new one, which will be accessioned when full. |

### Committee for Poor Decisions
| # | Premise |
|---|---|
| C1 | Minutes: a motion to start meetings on time is carried over to the next meeting, which started late. (Too close to `committee-7`, the shorter-meeting motion; rework or drop.) |
| C6 | Approved Motion: a Subcommittee on Fewer Subcommittees is formed. It meets monthly. |

### Neighborhood Wildlife Reports
| # | Premise |
|---|---|
| W3 | Wildlife Alert: a moth and the porch light at number 14 have been in a standoff since dusk. |
| W5 | Animal Interview: a cat sits on the exact centre of the newspaper being read and declines to elaborate. |
| W6 | Wildlife Alert: a goose believed to be of the 1996 line is observed on the municipal building steps on budget day. It does not enter. (`goose-incident`; must not explain why the first one stayed.) |

### Lost & Found Authority
| # | Premise |
|---|---|
| L1 | Item Recovered: one folded napkin; the method of folding is disputed by two members of staff (napkin-war, without resolving it). (Held back from Issue 3 because `museum-15` already used the Napkin Treaty.) |
| L5 | Claim Status: one child's left shoe, size 9; the Authority has kept the space beside it free. (Check against `lostfound-8`, the two gloves, and `lostfound-1`.) |
| L6 | Item Recovered: one library card, for a library not on file, with no books out. |

### Official Public Notices
| # | Premise |
|---|---|
| N3 | Tuesday Compromise Observance (seasonal): residents are reminded it falls on a Tuesday. |
| N5 | Reminder: the queue for the municipal service counter begins at the sign reading QUEUE BEGINS HERE, wherever the sign has been moved to. |

### Bureau of Mild Emergencies
| # | Premise |
|---|---|
| B3 | De-escalation Notice: a doorbell on Maple Court rang once with no one present. Classification of intent not made. (Held back: `bureau-7` and `bureau-9` already cover devices acting alone.) |
| B5 | Situation Report: the wind chime on Poplar Way has been silent through three windy days. |

### Office of Public Clarifications
| # | Premise |
|---|---|
| O1 | Response: a request for the Museum's opening time on Tuesday is declined (tuesday-compromise). (Hard to write without the Office stating a fact; see `OPC-MEMO-0004`.) |
| O5 | Public Inquiry Log: a resident asked for directions to this office, from inside this office. |

## Used (drafted into an issue)

| Issue | Items |
|---|---|
| Issue 2 (v1.1, premieres from 2026-11-01) | `deir-8`–`deir-11`, `museum-8`–`museum-12`, `committee-7`–`committee-10`, `wildlife-7`–`wildlife-9`, `lostfound-7`–`lostfound-10`, `notices-7`–`notices-9`, `bureau-7`–`bureau-9`, `clarifications-7`–`clarifications-9` |
| Issue 3 (v1.2, premieres from 2026-12-01; draft) | `deir-12` (D1), `deir-13` (D5), `deir-14` (D4), `deir-15` (D3); `museum-13` (M1), `museum-14` (M2), `museum-15` (M3), `museum-16` (M5); `committee-11` (C3), `committee-12` (C4), `committee-13` (C5, adapted: both motions carry, since a tie would contradict the agenda template's "passes unanimously"), `committee-14` (C2); `wildlife-10` (W1), `wildlife-11` (W2), `wildlife-12` (W4); `lostfound-11` (L2), `lostfound-12` (L3), `lostfound-13` (new: the alarm clock), `lostfound-14` (L4); `notices-10` (N1), `notices-11` (N2), `notices-12` (N4); `bureau-10` (B2), `bureau-11` (B4), `bureau-12` (B1); `clarifications-10` (O3), `clarifications-11` (O2), `clarifications-12` (O4) |
