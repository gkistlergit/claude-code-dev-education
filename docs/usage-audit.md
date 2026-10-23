# Usage Audit (Sanitized)

This course was built around one person's real use of Claude Code, so the examples are tested against daily practice and not only against the docs. This page records what the audit found, in aggregate. Names of apps, companies, customers and people are removed. Raw transcripts and configuration were read locally and are not in this repository.

Period: late September to late October 2026, about four weeks. Counts come from session transcripts and desktop app metadata. Where a count was a keyword heuristic, the line says so.

## How the author uses Claude Code

- **Interface.** Almost everything runs in the desktop app's Code tab. The terminal CLI accounts for 160 records out of thousands. This is why the course is app-first.
- **Volume.** 498 top-level sessions across 179 project folders, about 31, 56, 46, 209 and 138 sessions started per week (the last week partial). The median session has 178 records. 94 sessions exceed 500 records and 21 exceed 1,000.
- **Pull requests and worktrees.** Of 360 sessions with desktop metadata, 179 (50%) are bound to a pull request and 171 (48%) ran in a worktree. 97% are archived.
- **Permission mode.** Auto mode on 6,220 prompts, Manual on 67, Accept edits on 16.
- **Models and effort.** By turns: Opus about 155,000, Fable about 43,000, Sonnet about 28,000. Effort: xhigh about 120,000, high 65,000, max 26,000, medium 21,000. Fast mode was never used.
- **Planning.** Plan mode was never entered. Planning happens through the app's task list (2,256 calls) and through grilling and spec-writing skills.
- **Tools.** Bash 81,800 calls, Read 10,000, WebFetch 6,300, Edit 3,900, WebSearch 3,800, Write 2,900, Agent 1,700, Skill 881.
- **Subagents.** General-purpose 1,194 calls, a custom read-only scout agent 120, Explore 65.
- **Browser and computer tools.** The built-in browser about 5,700 calls, computer use about 2,100, Claude in Chrome about 1,100.
- **Session management.** 217 side sessions started from within sessions. 11 sessions came from Remote Control and 1 from the cloud. 5 scheduled tasks exist. 9 sessions are starred.
- **Slash commands and skills.** A handoff skill 86 times, a planning skill 32, a prompt-sharpening skill 27, `/clear` 24, `/model` 17, `/compact` once.
- **Context management.** Context is managed with handoffs and `/clear`. There were 7 compaction events in 5 sessions.
- **Memory.** 269 memory files across 15 projects, mostly incident lessons, tooling traps, design notes and workflow preferences.

## Friction signals

- 27 of 2,881 prompts (about 1%) begin with a negation word such as no, don't or stop (keyword heuristic).
- 51 interrupted turns.
- 194 permission-style denials (heuristic), 1,606 tool errors, 792 API errors.
- No strong sign of repeated re-explanation.

## Configuration shape

- 24 user-level skills (9 written by the author, 15 vendored), 2 custom agents, 1 custom command, 7 enabled plugins.
- 4 hooks: a guard that blocks destructive git commands, context-usage warnings at 70% and 90%, a reset of those warnings after compaction, and a drift warning at session start.
- 8 short global rules files, each covering one rule.
- The configuration lives in a repository with a manifest of pinned third-party packages, drift detection and backups.
- 8 scheduled tasks for recurring chores. No custom keybindings, no allow or deny lists, no status line.
- Project instruction files are short, 13 to 20 lines. Each project carries 38 to 43 skills copied from a shared set.

## The author's projects

Three internal apps and one newer project, all small teams' worth of work built by one person.

- **Stack.** Framework-free JavaScript progressive web apps on Cloudflare Pages with Functions, behind Cloudflare Access. Offline-first with a service worker and IndexedDB or a baked-in seed. Storage in KV, D1 and R2. One app adds web push, passkeys and a search index with no language model in the answer path.
- **Checks.** Zero-dependency Node scripts. One app runs about 255 check files through one runner plus a pre-push hook. Another keeps its gates local and runs CI only for deploys. One project has no CI.
- **Rhythm.** 357 to 524 commits per 30 days per app and 158 to 211 merged pull requests per 90 days on the busiest two.
- **Deploys.** Deploy the exact commit, packaged with `git archive` of a ref, never the working tree. Read the deploy log. Record the result in a handoff ledger.

## Gaps this course covers

- Never or rarely used: plan mode, fast mode, the terminal CLI, `/compact`, `/usage`, scheduled tasks beyond a handful, remote and cloud sessions, rewind, fork.
- Process gaps: gates that run only on one machine, one project without CI, no browser end-to-end tests, no linter, worktree sprawl (about 25 and 16 stale worktrees in two projects), very long ledger files.
- The practices that work well are written up in [Patterns from Practice](patterns-from-practice.md).
