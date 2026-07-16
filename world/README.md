# The Daily Nonsense — World Bible

Internal reference material for writing new Daily Items and copy. None of this is shown in-app; it exists so the world stays internally consistent as more contributors (human or AI) add to it. Start here, then follow the links.

## Read in this order

1. **[CONSTITUTION.md](./CONSTITUTION.md)** — the premise, the three laws (nothing is fictional to the institutions, continuity over cleverness, nobody explains), and the test every new document should pass.
2. **[INSTITUTIONS.md](./INSTITUTIONS.md)** — full profile for each of the eight institutions: purpose, personality, voice, recurring formats, taboos, and relationships to the others.
3. **[TIMELINE.md](./TIMELINE.md)** — the shared historical events (the Goose Incident, the Tuesday Compromise, the Great Stapler Migration, etc). New Daily Items should reuse these via their `tags` field before inventing a new event.
4. **[STYLE_GUIDE.md](./STYLE_GUIDE.md)** — per-institution vocabulary substitutions ("never say X, always say Y"), shared terminology, legendary objects, and the holiday calendar.

## Supporting artifacts (Product Checkpoint 3)

Documents that make each institution feel like a real, dully-functioning workplace rather than a punchline generator. Written to be read on their own, not just mined for jokes.

**Cross-institution infrastructure:**
- **[artifacts/FILING_SYSTEM.md](./artifacts/FILING_SYSTEM.md)** — the reference-number format for every institution (e.g. `DEIR-RF-2214`, `MUH-EX-442`). Use these when a Daily Item or artifact needs to cite a document.
- **[artifacts/SEALS_AND_SIGNATURES.md](./artifacts/SEALS_AND_SIGNATURES.md)** — each institution's seal (described) and signature line.
- **[artifacts/ORG_CHART.md](./artifacts/ORG_CHART.md)** — the (deliberately headless) structure of the whole apparatus, and the informal points of contact between institutions.

**Department of Extremely Important Research** (deep dive):
- [artifacts/deir/EMPLOYEE_HANDBOOK.md](./artifacts/deir/EMPLOYEE_HANDBOOK.md)
- [artifacts/deir/PROCEDURAL_MANUAL.md](./artifacts/deir/PROCEDURAL_MANUAL.md)
- [artifacts/deir/REJECTED_PROPOSALS.md](./artifacts/deir/REJECTED_PROPOSALS.md)
- [artifacts/deir/ANNUAL_REPORT.md](./artifacts/deir/ANNUAL_REPORT.md)

**Committee for Poor Decisions** (deep dive):
- [artifacts/committee/MEETING_AGENDA_TEMPLATE.md](./artifacts/committee/MEETING_AGENDA_TEMPLATE.md)
- [artifacts/committee/SUBCOMMITTEES.md](./artifacts/committee/SUBCOMMITTEES.md)
- [artifacts/committee/INTERNAL_CORRESPONDENCE.md](./artifacts/committee/INTERNAL_CORRESPONDENCE.md)

**Everyone else** (one or two artifacts each — expand if a future checkpoint calls for it):
- [artifacts/museum/VISITOR_BROCHURE.md](./artifacts/museum/VISITOR_BROCHURE.md), [artifacts/museum/CATALOG_EXCERPT.md](./artifacts/museum/CATALOG_EXCERPT.md)
- [artifacts/notices/NOTICE_TEMPLATE.md](./artifacts/notices/NOTICE_TEMPLATE.md)
- [artifacts/wildlife/COMPLAINT_FORM.md](./artifacts/wildlife/COMPLAINT_FORM.md)
- [artifacts/lostfound/INTAKE_FORM.md](./artifacts/lostfound/INTAKE_FORM.md)
- [artifacts/bureau/CLASSIFICATION_MANUAL.md](./artifacts/bureau/CLASSIFICATION_MANUAL.md)
- [artifacts/clarifications/COMPLAINT_AND_RESPONSE.md](./artifacts/clarifications/COMPLAINT_AND_RESPONSE.md)

## Where the actual content lives

The 50 live Daily Items are in `src/lib/content.ts`, typed via `DailyItem` (universe, format, title, body, rarity, and the forward-looking `season`/`tags`/`callbacks`/`relatedDocuments` fields used to cross-reference the timeline and other items). Institution metadata (gradient, masthead, bureaucratic detail) lives in `src/lib/universes.ts`.

New Daily Items should be written *from* this world bible, not independently of it — pull a reference number from `FILING_SYSTEM.md`, a timeline event to nod to, or a rejected-proposal-style premise, rather than starting from a blank joke.
