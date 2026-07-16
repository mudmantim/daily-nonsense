# Autonomy Analysis — Where This Workflow Still Needs a Human, and Why

Written in response to a direct brief: reduce unnecessary human involvement in this project's workflow, without weakening security or bypassing authentication. This document is honest about a distinction that matters more than it might first appear: **some "manual steps" are pure friction, and some are the actual feature.** I've automated the former aggressively. I've deliberately left the latter alone, and explained why below rather than quietly working around them.

## Current workflow, as it stands today

1. Tim (or Claude autonomously, per the standing lead-engineer mandate) opens a session against this repo.
2. Claude reads/writes files, runs shell commands, and calls browser-automation tools — each gated by Claude Code's permission system depending on mode. Historically this meant re-approving the same handful of safe commands (`npx tsc`, `npx eslint`, `npm test`, `curl localhost`) dozens of times per session.
3. For product/UX questions, Claude reaches "Chip" (Tim's ChatGPT account) via Claude-in-Chrome browser automation: navigate to the existing thread, type a message, submit, screenshot/read the reply, act on it. Tim is not actually in this loop today — Claude already does this autonomously.
4. Before this session, verification meant four separate manual commands (`npx tsc --noEmit`, `npx eslint .`, and, as of a few sessions ago, `npm test`) plus, until today, `npm run build` had *never actually been run* — only `next dev` had been checked.
5. Commits happened inside the interactive session, one at a time, with no automatic pre-flight check.
6. Nothing runs unless a session is open on Tim's machine. Closing the laptop stops all work.
7. There is no deployment pipeline — no git remote, no hosting configured.

## Manual steps inventory

| # | Manual step | Why it exists | Technically removable? | Risk if removed | Recommended solution | Priority |
|---|---|---|---|---|---|---|
| 1 | Re-approving the same safe, read-only commands every session (`npx tsc`, `npx eslint`, `npm test`, browser page-reads) | Claude Code's default-deny sandbox — every tool call is a potential arbitrary action until allowlisted | **Yes, for genuinely read-only commands** | Low, if scoped precisely (see below) | Allowlist a narrow, audited set in `.claude/settings.json` | **Done this session** |
| 2 | Re-approving mutating commands (`git commit`, `npm install`, file writes) | Real safety boundary — these change repo/system state | **No** (by design) | High if blanket-allowed — this is the actual sandbox | Keep gated. Already fairly fast in practice since Tim has granted standing commit authority for this repo specifically | Keep as-is |
| 3 | Running lint, typecheck, test, and build as four separate commands | Nobody had wired them together yet — pure oversight, not a safety boundary | Yes, fully | None | `npm run verify` / `npm run verify:fast` | **Done this session** |
| 4 | Remembering to verify before committing | Same as above — relies on human/AI memory, no enforcement | Yes, fully | None (fails safe — blocks the commit rather than skipping the check) | Git pre-commit hook running `verify:fast` automatically | **Done this session** |
| 5 | Browser-automation friction reaching Chip (screenshot → wait → read → type → confirm-sent, repeated, sometimes 2-3 tries when a click missed) | Implementation fragility (ChatGPT's compose box submits on bare Enter; the send-button coordinate shifts as the box grows) — not a human-approval step at all, since Tim isn't in this loop today | Partially | Low — wasted tool calls, not a safety issue | Type as one paragraph (no embedded `\n`), submit via a `Return` keypress rather than a clicked coordinate. Already adopted as practice; could be hardened further with a small helper script if this becomes a bottleneck | Low (nuisance, not a blocker) |
| 6 | Claude-in-Chrome actions like `computer` (click/type/key), `browser_batch`, `javascript_tool`, `navigate` are not on the safe-allowlist | These bundle read actions with actions that submit forms, click buttons, or run arbitrary page JS — the tool name alone doesn't tell you which | **No** — deliberately | High if allowlisted broadly: could silently confirm a payment, submit a form on an untrusted page reached via a link in observed content, or run injected JS | Leave gated. This is exactly the category Tim's brief said not to touch ("do not weaken security") | Keep as-is |
| 7 | Tim's ChatGPT session/authentication has to exist for Chip interactions to work | It's literally his personal account; browser automation rides on his existing login, by design | No, not without a different integration | N/A — this is authentication, not friction | If Chip's involvement becomes a bottleneck, the alternative is an OpenAI API integration with a key Tim provisions himself — a materially different design (a bot, not "Tim's ChatGPT persona") | Tim's call, not implemented |
| 8 | Nothing runs while the laptop is closed/off | Claude Code sessions today are tied to an open terminal on Tim's machine | Yes, via scheduled/background cloud execution (the platform's `ScheduleWakeup`/`CronCreate`/remote-isolation agent features) | **Medium-high** — an unattended job with repo write access and/or browser automation access, running with nobody watching, is a materially different risk profile than an interactive session Tim can see and interrupt live | See "Proposed, not implemented" below — a specific, bounded design, pending Tim's explicit go-ahead | Medium — valuable, but a real decision, not a default |
| 9 | Tim reads Claude's summaries and decides whether to continue, redirect, or accept a checkpoint | This is product ownership, not incidental friction — it's the actual point of having a human in the loop | **Deliberately not removed** | High if removed: Claude would be setting its own product direction unsupervised, with nobody able to say "wait, that's not what I wanted" until much later | Keep, but make it cheap: `PROJECT_JOURNAL.md` lets Tim skim one file instead of re-reading a whole transcript to know what happened | **Keep — this is a feature, not a bug** |
| 10 | Deployment / going live | No hosting configured; this is a business decision (money, public exposure), not an engineering one | N/A | N/A | Wire up Vercel when Tim explicitly decides to ship (see `README.md`) | Not started; not urgent per current recommendation |

## What I implemented this session

- `npm run verify` / `npm run verify:fast` — one command instead of four, every time (item 3)
- `.githooks/pre-commit` (tracked, enabled via `git config core.hooksPath .githooks`) — `verify:fast` now runs automatically before every commit; a broken commit is physically blocked rather than relying on anyone remembering to check first (item 4). Tested live this session — it fired correctly on the commit that introduced it.
- `.claude/settings.json` — allowlisted 11 patterns, chosen narrowly (item 1). Full list and reasoning in the next section.
- `README.md` rewritten from create-next-app boilerplate into something that actually explains the project and this workflow, so the setup steps above (`git config core.hooksPath`) aren't tribal knowledge.

### The permission allowlist, specifically

Scanned this project's own session transcripts (the two `.jsonl` files under `~/.claude/projects/-home-mudmantim-Projects-daily-nonsense/`) for actual Bash/MCP tool-call patterns, filtered to genuinely read-only, non-mutating, precisely-scoped commands only:

| Pattern | Why it's safe to auto-allow |
|---|---|
| `Bash(npx tsc --noEmit *)` | `--noEmit` anchored in the pattern itself — can't silently drop it and start writing `.js` output into the repo |
| `Bash(npx eslint .)` | Exact form, no wildcard — excludes `--fix`, which would mutate source files |
| `Bash(npm run build)` | Fixed script; writes only to `.next/` build output, never source |
| `Bash(npm run lint)` / `Bash(npm run typecheck)` / `Bash(npm run verify)` / `Bash(npm run verify:fast)` | Fixed script names defined in this repo's own `package.json` — not a `npm run *` wildcard, which the skill guidance this was built from explicitly flags as equivalent to arbitrary-script execution |
| `Bash(npm test)` | Exercises the app, doesn't mutate it |
| `mcp__claude-in-chrome__get_page_text` | Pure text extraction, no side effects |
| `mcp__claude-in-chrome__tabs_context_mcp` | Pure tab listing, no side effects |
| `mcp__claude-in-chrome__read_console_messages` | Pure console read, no side effects |

**Deliberately excluded**, despite frequent use this session, and why:
- `git add`, `git commit` — mutating. (Already separately approved in `.claude/settings.local.json` from earlier interactive sessions; not duplicated here since this file is meant to be the audited, narrow, "obviously safe" set.)
- `node -e "..."` / any interpreter with a wildcard — arbitrary code execution. A blanket allow here would mean any future command starting with `node` runs unreviewed.
- `mcp__claude-in-chrome__computer`, `browser_batch`, `javascript_tool`, `navigate` — despite being the most-used tools this session (82, 43, 7, and 5 calls respectively), these are **not** intrinsically read-only. `computer` alone covers everything from a harmless screenshot to clicking "Submit" on a form; the tool name can't distinguish those cases, and the permission system allows/denies at the tool-name level. Allowlisting these broadly would mean any future browser action — including ones triggered by something Claude reads on a page it didn't expect — runs without confirmation. This is precisely the category Tim's brief said not to touch.

## Proposed, not implemented — needs an explicit decision, not a default

These are real options I considered and did **not** wire up unilaterally, because each one changes the nature of who's watching the work happen, not just how many clicks it takes.

### A. Scheduled/unattended runs (resumability after sleep/power loss)

**What it would look like:** a recurring cloud-scheduled session (via this platform's scheduling features) that wakes up, pulls the latest state from `PROJECT_JOURNAL.md` and the world bible, does one bounded unit of work, runs `npm run verify`, and either commits directly or opens something for review — all without a human present at execution time.

**Why I didn't just build it:** this is qualitatively different from everything else in this document. Every other automation here removes *mechanical* friction (re-clicking, re-running commands) while leaving a human able to watch, in real time, everything that happens. An unattended scheduled job removes that entirely — nobody is watching when it runs, which means a mistake (a bad commit, a bad message sent somewhere, a subtle content-consistency regression the test suite doesn't happen to cover) could compound for hours before anyone notices. Setting up standing, persistent automation like this is also exactly the category my own operating guidelines flag as needing explicit confirmation rather than being bundled into a broader request, for the same reason: it's the kind of decision that's hard to reverse cleanly (by the time you notice a problem, several unattended cycles may already have run).

**Recommended shape, if Tim wants this:** start narrow and reversible —
1. A scheduled run that only executes `npm run verify` and appends a status line to `PROJECT_JOURNAL.md` (read-only w.r.t. actual product content). Zero risk, immediately useful as a canary.
2. If that's stable, expand to: scheduled run drafts content/code changes and opens a diff (as a branch or a patch file) rather than committing to `master` directly, so a human reviews before it lands.
3. Only after both of those have run cleanly for a while would fully unattended commit-to-master make sense — and even then, I'd recommend it never includes autonomous Chip interaction (see B) in the same unattended cycle, so a product-voice mistake can't multiply unreviewed.

**Priority:** medium value, but this is Tim's call specifically, not mine.

### B. Fully autonomous Chip loop ("automatic product reviews")

**What it would look like:** Claude writes something, autonomously posts it to Chip, reads the response, revises, and repeats — indefinitely, without a checkpoint ever reaching Tim.

**Why I didn't build it:** this is the one item in the whole brief that I think would make the product *worse*, not just faster, if fully automated. The entire premise of the Claude+Chip+Tim workflow — confirmed explicitly by Chip himself, and by how well the last several checkpoints went — is that Tim is the one who "recognizes when something has a soul." Removing him from every checkpoint doesn't just save him clicks; it removes the only mechanism that catches the workflow drifting somewhere he wouldn't have chosen. Tim's own instruction two messages ago was "only ask me questions when the answer would materially change the product's direction" — which presupposes those moments still reach him. Fully automating this away would be answering that kind of question by *default-erasing it*, which isn't the same thing as making a good default.

**Recommended alternative:** keep individual Claude↔Chip exchanges autonomous (already true), but keep checkpoint *boundaries* — "this chunk is done, here's what changed, here's what I recommend next" — as explicit moments in `PROJECT_JOURNAL.md` that surface to Tim, even if he doesn't have to act on most of them. Cheap for him to skim, expensive to silently skip.

**Priority:** not recommended as stated; the journal-checkpoint pattern already in place is the right amount of automation here.

### C. Chip via API instead of browser automation

**What it would look like:** an OpenAI API integration (Tim's own key) instead of driving his ChatGPT tab.

**Why I didn't build it:** this isn't a security question, it's a product-identity one — "Chip" specifically refers to Tim's own ChatGPT conversation and persona, not a generic model endpoint. Switching would need Tim to decide he's okay with that distinction disappearing, and to provision the credential himself (not something I can do on his behalf).

**Priority:** low; only worth it if browser-automation friction (item 5 above) becomes a real bottleneck rather than a minor nuisance.

## Bottom line

Of the ten manual steps identified: three were pure oversight and are now fixed (verify script, pre-commit hook, permission allowlist), one is an authentication boundary that isn't going anywhere, one is a business decision (deployment) that isn't ready yet, one is a minor implementation nuisance already mitigated in practice, two are deliberate security boundaries that should stay exactly as gated as they are, and two — unattended scheduled execution and a fully autonomous Chip loop — are real options I'm surfacing rather than deciding unilaterally, because both trade away the thing that's actually been working about this collaboration so far: someone watching it happen.
