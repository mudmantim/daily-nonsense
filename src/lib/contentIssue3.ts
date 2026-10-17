import type { DailyItem } from "./content";

// Issue 3 (v1.2): 28 new items. They premiere one per day from 2026-12-01,
// in the order ISSUE_3_PREMIERES lists them (see the issue-3 entry in
// content.ts's ISSUES), then join the long-term rotation. Written against
// /world/*.md and drafted from the premises in content/BACKLOG.md; checked
// by content.test.ts (universes, tags, cross-references), voice.test.ts and
// duplicates.test.ts (no near-duplicates of each other, of Issue 2 or of v1).
//
// Reference numbers continue the highest on file in
// world/artifacts/FILING_SYSTEM.md (MUH-EX-446..448, Proposal 0650,
// LFA-1816, OPN-4473, BME-SR-0419, OPC-NC-0216..0220); the artifacts
// record them.
//
// Once an item's premiere date has passed it is published history: do not
// edit it. Corrections ship as a new item in a later issue.
export const ISSUE_3_ITEMS: DailyItem[] = [
  // ---- The Department of Extremely Important Research ----
  {
    id: "deir-12",
    universe: "deir",
    format: "Research Finding",
    title: "Finding",
    body: "The Department has concluded a study of 340 questions introduced with the words “quick question.” Their mean duration was twenty-two minutes. The shortest, at four minutes, has been set aside as an outlier pending review. Funding for a brief follow-up has been requested.",
    rarity: "common",
  },
  {
    id: "deir-13",
    universe: "deir",
    format: "Scientific Paper",
    title: "On the Relative Speed of the Other Queue",
    body: "Across 1,200 observed visits to municipal service counters, the queue not joined advanced faster than the queue joined, in every replication. When researchers changed queues mid-study, the effect changed queues with them. The Department considers the result robust, and has requested funding for a third queue to serve as a control.",
    rarity: "rare",
  },
  {
    id: "deir-14",
    universe: "deir",
    format: "Rejected Proposal",
    title: "Proposal 0650",
    body: "Proposal 0650, a study of whether any bottle of ketchup has ever been finished, has been rejected. The study design required one finished bottle as a control, and none could be located in any municipal kitchen. Resubmission is encouraged on receipt of a finished bottle.",
    rarity: "common",
  },
  {
    id: "deir-15",
    universe: "deir",
    format: "Safety Bulletin",
    title: "Safety Bulletin",
    body: "The Department advises that a telephone is observed to ring within forty seconds of a person sitting down, at a frequency findings indicate is significant. The effect is strongest when the person is holding a hot drink. Pending further study, residents are advised to sit down with the telephone already in hand.",
    rarity: "common",
  },

  // ---- The Museum of Useless History ----
  {
    id: "museum-13",
    universe: "museum",
    format: "Newly Unearthed Artifact",
    title: "Artifact #446",
    body: "One ballpoint pen, blue. Its service record shows that it wrote on the second attempt only, at every signature of its working life, including its own accession form. Displayed uncapped, beside the small circular scribble that preceded each one.",
    rarity: "common",
  },
  {
    id: "museum-14",
    universe: "museum",
    format: "Historical Discovery",
    title: "The Earliest Sign",
    body: "Curatorial review has dated the Museum's OUT OF ORDER sign to 1931, the earliest of its kind on file. It remains attached to the vending machine it was issued for. The machine is tested once a year and has never failed. The sign has been left in place, out of respect for its tenure.",
    rarity: "rare",
  },
  {
    id: "museum-15",
    universe: "museum",
    format: "Curator's Notes",
    title: "Gift Shop Accession",
    body: "The gift shop's postcard of the Napkin Treaty, discontinued this year, has been accessioned as Exhibit 447 and is now displayed beside the Treaty itself. The Curator considers the postcard historically underappreciated already. Its placard, like the Treaty's, reads “context pending.”",
    rarity: "common",
    tags: ["napkin-war"],
    relatedDocuments: ["museum-5"],
  },
  {
    id: "museum-16",
    universe: "museum",
    format: "Newly Unearthed Artifact",
    title: "Artifact #448",
    body: "One jigsaw puzzle piece, sky-colored, from a puzzle the Museum does not hold. Accessioned as the only portion of that sky on file. Displayed face up, edges intact, with room on all four sides.",
    rarity: "common",
  },

  // ---- The Committee for Poor Decisions ----
  {
    id: "committee-11",
    universe: "committee",
    format: "Emergency Decision",
    title: "Emergency Decision",
    body: "To save time, the Committee has approved the minutes of next month's meeting in advance. The approved minutes record that the meeting began on time, reached quorum, and adjourned early. The Committee looks forward to holding it.",
    rarity: "rare",
  },
  {
    id: "committee-12",
    universe: "committee",
    format: "Approved Motion",
    title: "Approved Motion",
    body: "The Subcommittee on Office Supplies, which has met monthly since 1988, moved that it be issued a stapler of its own. The motion was approved on the condition that the Subcommittee wait and see whether one arrives. Its next report states that no further staplers have relocated, including toward it.",
    rarity: "common",
    tags: ["stapler-migration"],
    relatedDocuments: ["committee-5", "lostfound-3"],
  },
  {
    id: "committee-13",
    universe: "committee",
    format: "Meeting Minutes",
    title: "Meeting Minutes",
    body: "A motion to paint the records room green and a motion to paint it blue were each carried unanimously at the same meeting. The question of which applies was referred to the Subcommittee on Precedent, which cited the Duck Harbor Master Precedent of 1622 and recommended the color of the duck. Painting is scheduled for Tuesday.",
    rarity: "common",
    tags: ["duck-harbor-master", "tuesday-compromise"],
    relatedDocuments: ["committee-6", "museum-4"],
  },
  {
    id: "committee-14",
    universe: "committee",
    format: "Official Recommendation",
    title: "Any Other Business",
    body: "The Committee recommends that Any Other Business be moved to the start of the agenda, where it may receive the attention it has historically received at the end. The recommendation was raised under Any Other Business, at 6:58 p.m., and takes effect from the opening of the next meeting, which will begin with it.",
    rarity: "common",
  },

  // ---- Neighborhood Wildlife Reports ----
  {
    id: "wildlife-10",
    universe: "wildlife",
    format: "Incident Report",
    title: "Planter Activity",
    body: "A squirrel has been observed burying an acorn in the planter outside number 9 on forty separate occasions since September. A concerned neighbor initially recorded this as one acorn. It is now assessed with reasonable certainty that it is not the same acorn, and possible that it is not the same squirrel.",
    rarity: "rare",
  },
  {
    id: "wildlife-11",
    universe: "wildlife",
    format: "Citizen Complaint",
    title: "Doorstep Deliveries",
    body: "A crow has left one bottle cap on the doorstep of 22 Alder Lane every morning for nineteen days. The household has not reciprocated. A concerned neighbor reports that the caps are now arriving earlier, and has assessed the matter as one of etiquette.",
    rarity: "common",
  },
  {
    id: "wildlife-12",
    universe: "wildlife",
    format: "Incident Report",
    title: "Laundromat Sighting",
    body: "The raccoon of interest in the Missing Sock Inquiry was observed at 11:40 p.m. outside the laundromat on Fenwick Street, beneath the dryer vent. It was carrying nothing. A concerned neighbor notes, for the record, that no conclusions have been drawn, and that the dryer vent was warm.",
    rarity: "common",
    tags: ["sock-inquiry"],
    relatedDocuments: ["wildlife-4", "lostfound-1", "deir-4"],
  },

  // ---- The Lost & Found Authority ----
  {
    id: "lostfound-11",
    universe: "lostfound",
    format: "Item Recovered",
    title: "Found",
    body: "One bookmark, recovered from a bench without its book. It was marking page 41. Intake logged as LFA-1816, with the page number recorded on the form, so that whoever returns for it will not have to start again.",
    rarity: "rare",
  },
  {
    id: "lostfound-12",
    universe: "lostfound",
    format: "Item Recovered",
    title: "Found",
    body: "One adhesive name badge reading HELLO MY NAME IS, the space beneath left blank. Intake logged. Staff have not written a name in on its behalf. It is being patiently held until someone recognizes themselves in it.",
    rarity: "common",
  },
  {
    id: "lostfound-13",
    universe: "lostfound",
    format: "Custodial Note",
    title: "Custodial Note",
    body: "One alarm clock, intake logged at 4:50 p.m., still set for 6:15 a.m. Staff have not adjusted it, as it belongs to someone. It has rung every morning since, and each morning it has been logged as heard, in case that was what it needed.",
    rarity: "common",
  },
  {
    id: "lostfound-14",
    universe: "lostfound",
    format: "Claim Status",
    title: "Recognition Week",
    body: "Recognition Week has concluded for another year. The red string, the key ring with the plastic strawberry, and one left sock remain awaiting recognition, among others. None were reunited during the week. The Authority notes that this is consistent with every previous Recognition Week, and is no reason not to hold the next one.",
    rarity: "common",
    tags: ["red-string-donation", "sock-inquiry"],
    relatedDocuments: ["lostfound-2", "lostfound-9", "lostfound-1"],
  },

  // ---- Official Public Notices ----
  {
    id: "notices-10",
    universe: "notices",
    format: "Public Notice",
    title: "Public Notice",
    body: "Residents are reminded that the button at the pedestrian crossing on Market Row has been pressed a sufficient number of times. Further presses will be received in the spirit in which they are offered. The crossing will change in due course.",
    rarity: "common",
  },
  {
    id: "notices-11",
    universe: "notices",
    format: "Reminder",
    title: "Reminder",
    body: "Residents are reminded that when the clocks next go back one hour, the hour will be held at the town hall until it is needed again. Residents who preferred the previous hour may continue to observe it privately, provided it is not used for municipal business.",
    rarity: "common",
  },
  {
    id: "notices-12",
    universe: "notices",
    format: "Public Notice",
    title: "Public Notice",
    body: "Residents are reminded that the bench outside the public library faces the library. This notice should be read alongside OPN-4473.",
    rarity: "common",
    relatedDocuments: ["notices-11"],
  },

  // ---- The Bureau of Mild Emergencies ----
  {
    id: "bureau-10",
    universe: "bureau",
    format: "Situation Report",
    title: "Situation Report",
    body: "Fog over Whitcombe Park was reported at 6:10 a.m. as lower than usual, and opened as a situation of moderate note under BME-SR-0419. At 9:00 a.m. it was reassessed as roughly the usual height. It de-escalated to baseline at noon, when it left.",
    rarity: "rare",
  },
  {
    id: "bureau-11",
    universe: "bureau",
    format: "Advisory (Non-Urgent)",
    title: "Advisory",
    body: "Residents are advised that the lawn sprinklers on Cedar Row continue to activate during rain. The matter has been assessed as concerning, but not actionable. The lawns on Cedar Row are reported to be in excellent condition.",
    rarity: "common",
  },
  {
    id: "bureau-12",
    universe: "bureau",
    format: "Advisory (Non-Urgent)",
    title: "Static Cling Remembrance Day",
    body: "Static Cling Remembrance Day will be observed on Thursday. The Bureau will mark it, as in previous years, by logging nothing. Any static cling that occurs on the day will be opened as a situation of moderate note, held for four days out of respect, and de-escalated to baseline.",
    rarity: "common",
    tags: ["static-cling-anomaly"],
    relatedDocuments: ["bureau-1", "notices-7"],
  },

  // ---- The Office of Public Clarifications ----
  {
    id: "clarifications-10",
    universe: "clarifications",
    format: "Public Inquiry Log",
    title: "Public Inquiry Log",
    body: "A child at the public counter asked “why?” four times in succession. Each inquiry was received and logged separately, as OPC-NC-0216 through OPC-NC-0219, and each received the standard response. A fifth was logged as the child was leaving.",
    rarity: "rare",
  },
  {
    id: "clarifications-11",
    universe: "clarifications",
    format: "Clarification Request (Response)",
    title: "Response",
    body: "In response to a request to state the original mandate of the Committee for Poor Decisions: this office holds the request, the Committee's reply, and a copy of the 1987 seating chart. None of the three has been found to clarify the others.",
    rarity: "common",
    tags: ["committee-vote-1987"],
    relatedDocuments: ["committee-4", "museum-12"],
  },
  {
    id: "clarifications-12",
    universe: "clarifications",
    format: "Statement of Non-Clarification",
    title: "Statement of Non-Clarification",
    body: "Regarding the Wednesday of 2004, and whether Wednesday remains Wednesday: this office has reviewed the relevant notice in full and is unable to improve on it. The matter remains under continued non-clarification.",
    rarity: "common",
    tags: ["wednesday-that-wasnt"],
    relatedDocuments: ["notices-3", "committee-8"],
  },
];

// Premiere order: institutions interleaved so no two consecutive days come
// from the same one (2026-11-30, the day before, is a rotation day). The
// seven rare items lead, one per institution. Append-only once 2026-12-01
// has passed.
export const ISSUE_3_PREMIERES = [
  "committee-11",
  "lostfound-11",
  "deir-13",
  "museum-14",
  "wildlife-10",
  "clarifications-10",
  "bureau-10",
  "notices-10",
  "deir-12",
  "museum-13",
  "lostfound-12",
  "committee-12",
  "wildlife-11",
  "bureau-11",
  "museum-15",
  "clarifications-11",
  "deir-14",
  "notices-11",
  "lostfound-13",
  "committee-13",
  "museum-16",
  "wildlife-12",
  "bureau-12",
  "notices-12",
  "deir-15",
  "lostfound-14",
  "clarifications-12",
  "committee-14",
] as const;
