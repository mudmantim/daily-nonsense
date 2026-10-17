# The Filing & Reference System

> Internal reference. Every institution numbers its documents. The formats below are canon — use them any time a Daily Item or artifact needs a reference number, so numbers stay consistent across the archive instead of being invented ad hoc.

## Format by institution

| Institution | Pattern | Example | Notes |
|---|---|---|---|
| Department of Extremely Important Research | `DEIR-[code]-[4 digits]` | `DEIR-RF-2214` | Codes: NF (New Study Finds), RF (Research Finding), SP (Scientific Paper), PR (Press Release), SB (Safety Bulletin) |
| Museum of Useless History | `MUH-[code]-[3 digits]` | `MUH-EX-442` | Codes: EX (Exhibit / Newly Unearthed Artifact), HD (Historical Discovery), TH (Today in History), CN (Curator's Notes). Exhibit numbers are never reused, even for objects later deaccessioned. |
| Committee for Poor Decisions | `CPD-[code]-[year]-[3 digits]` | `CPD-MM-2024-118` | Codes: MM (Meeting Minutes), OR (Official Recommendation), AM (Approved Motion), ED (Emergency Decision) |
| Neighborhood Wildlife Reports | `NWR-[code]-[4 digits]` | `NWR-IR-0091` | Codes: WA (Wildlife Alert), IR (Incident Report), CC (Citizen Complaint), AI (Animal Interview) |
| Lost & Found Authority | `LFA-[4 digits]` | `LFA-0205` | Sequential intake number, no code. Assigned at the moment an item is logged as awaiting recognition, never reassigned even if later reclaimed (it never is). |
| Official Public Notices | `OPN-[4 digits]` | `OPN-4471` | Sequential, citywide. Numbers are issued in order of filing, not of urgency, since urgency is not a category Notices recognizes. |
| Bureau of Mild Emergencies | `BME-SR-[4 digits]` | `BME-SR-0418` | All Bureau documents are Situation Reports at intake, regardless of eventual format (Advisory, De-escalation Notice). The SR number never changes. |
| Office of Public Clarifications | `OPC-NC-[4 digits]` | `OPC-NC-0214` | NC = Non-Clarification, the office's only document type, regardless of how the inquiry was originally phrased. |

## Highest number on file (as of Issue 3)

New documents continue from these. Update this table whenever an issue issues a new number.

| Institution | Highest on file | Where |
|---|---|---|
| DEIR | `DEIR-RF-2214`; Rejected Proposal 0650 | this file; `deir/REJECTED_PROPOSALS.md` |
| Museum | `MUH-EX-448` | `museum/CATALOG_EXCERPT.md` |
| Committee | `CPD-MM-2024-118` | this file |
| Wildlife | `NWR-IR-0091` | this file |
| Lost & Found | `LFA-1818` | `lostfound/INTAKE_FORM.md` |
| Notices | `OPN-4474` | `notices/NOTICE_TEMPLATE.md` |
| Bureau | `BME-SR-0420` | `bureau/CLASSIFICATION_MANUAL.md` |
| Office | `OPC-NC-0220` | `clarifications/COMPLAINT_AND_RESPONSE.md` |

## Cross-referencing

When a document from one institution refers to an event or object also on file elsewhere (see `/world/TIMELINE.md`), it cites the other institution's reference number rather than re-describing the event. This is how a reader who cross-references two Daily Items months apart can confirm they're the same incident.

Example: a Lost & Found custodial note about the Great Stapler Migration can read "believed connected to `CPD-ED-1988-004`" without re-explaining the Migration.

## What never gets a reference number

Rumors, unconfirmed sightings, and anything the Office of Public Clarifications has declined to clarify. If it isn't filed, it isn't real — even if everyone agrees it happened.
