---
title: Rubric: What Advanced Means
kind: rubric
order: 1
verified: 2026-10-22
sources:
  - https://code.claude.com/docs/en/best-practices
  - https://code.claude.com/docs/en/hooks-guide
  - https://code.claude.com/docs/en/sub-agents
  - https://code.claude.com/docs/en/worktrees
  - https://code.claude.com/docs/en/permissions
  - https://code.claude.com/docs/en/context-window
---

This rubric defines "Advanced" for the course. You score yourself in five areas on a scale from 0 to 3, using evidence you can show, and you reach Advanced when you meet a pass line stated as a rule. It is a self-assessment tool, not a certification, and it is unofficial.

## What Advanced Means

You are Advanced when both of these are true:

- Your score is at least 2 in every one of the five areas.
- Your score is 3 in at least two of the five areas.

A score counts only when you have evidence for it. A claim you cannot show does not count. The five areas are Development, App Development, Process, Optimization and Workflow.

## The Four Performance Levels

Each level is described in observable terms: something you can run, open or point to.

- Level 0, Not yet. You have not met every Level 1 item for the area, or you have no evidence for them.
- Level 1, Foundations. You can operate the tools and read their results. Your evidence may come from guided course steps, and you can explain why each result is what it is.
- Level 2, Working. You carry a change from request to merge, or a configuration from idea to use, and you make the decisions yourself. You leave a record of those decisions: a verdict per review finding, a pull request body that states its limits, counts before and after.
- Level 3, Advanced. You designed a safeguard, a measurement or an automation, tested that it works, and used the result to make a decision.

Your score in an area is the highest level for which you meet every item at that level and at every level below it.

## The Criteria

This table summarizes the five areas. The sections after it list the items you need to meet and the evidence that proves each.

| Area | Level 0 | Level 1 | Level 2 | Level 3 |
|---|---|---|---|---|
| Development | Cannot yet review or undo a change unaided | Prompts with a check, reads a diff, undoes a change | Fixes a bug test-first, refactors in small steps, reviews two ways | Runs a security pass, turns a risk into a guardrail, migrates a dependency with a rollback |
| App Development | Cannot yet say what the app does or where its logic lives | Writes a one-page brief, reaches a first commit | Ships a spec-driven feature with a visual check | Delivers offline support with a version gate and records backend decisions |
| Process | Works with no history or review | Commits before big changes, names the flow | One branch per change, pull request, CI, cleanup | Gates a package job on CI, rehearses a standing go, keeps a ledger and a retro |
| Optimization | Cannot yet say what fills context | Reads `/context`, resets with `/clear` or a handoff | Delegates reading, compares effort levels, reads usage | Measures a workflow before and after and profiles code, deciding from numbers |
| Workflow | Has no persistent instructions | A CLAUDE.md that loads | Rules, memory, a skill and an allow rule | A read-only subagent, a tested hook, parallel worktrees, config in a repository |

### Development

Level 1 items:

- A prompt in a transcript states a goal, a constraint and a check, and Claude's result passed the check.
- You can name the permission mode you used for a task and give one sentence of reasoning.
- You read a diff in the Changes pane, left a line comment and received a revised diff.
- You undid a change with `/rewind` and again with git, and `git status` was clean afterward.

Level 2 items:

- For a bug report, you have a reproduction and a check that failed for the right reason before the fix, and the fix modified no existing check.
- A refactor shows small steps, a written list of behavior that must not change, and passing checks after each step.
- One change was reviewed with `/code-review` and with a fresh subagent, with a decision and a reason recorded for every finding.

Level 3 items:

- A security pass lists findings marked confirmed or guess, and you verified at least one by reading the code and wrote down the line and your verdict.
- A deny rule or hook that blocks an action you found risky exists, and you have the output showing it blocked the action.
- A dependency migration has a recorded baseline of passing checks, one file or step at a time, and a rollback you used or demonstrated.

### App Development

Level 1 items:

- A brief of about one page names who the app is for, the one job it does and what it will not do.
- A project reached a first commit with a CLAUDE.md and a check script.
- You can state what each Trail Notes file is for and where its logic lives.

Level 2 items:

- A spec, a glossary and tickets exist, and the tickets name what blocks what.
- A feature shipped with its check shown failing first, with the logic in pure functions and the page code kept separate.
- The running app was previewed in the Browser pane, and a keyboard-focus and contrast check against a named checklist is recorded.

Level 3 items:

- A service worker caches the app shell under a version, and a gate failed when the cached list changed without a version bump. You have the failing and passing output.
- The app loads with notes visible after you stopped the server, as your offline test note records.
- Decision records for storage and sign-in choices state a reason, a reversal condition and the claims to verify with the provider.
- A fixed benchmark in the checks fails when search returns the wrong set of notes.

### Process

Level 1 items:

- The history shows a commit made before a larger change, and its message says what and why.
- You can list the steps of the idea-to-deploy flow in your own words and mark the ones you have done.

Level 2 items:

- A change was built on its own branch or worktree and arrived as a pull request whose body says what was verified and what was not.
- A CI workflow runs the checks on every push and pull request, and every pull request you merged had passing checks first.
- The branch and worktree were removed after the merge, and `git worktree list` shows only your main folder.

Level 3 items:

- A package or deploy job depends on the checks, and its log shows the exact commit it built, matching the commit on your default branch.
- A written standing-go rule has conditions for ready, a stop list and a typed-phrase guard, and a rehearsal shows Claude stopping on a failing check.
- A ledger row records an exact commit with what was and was not verified, and a short retro records one change to a rule.

### Optimization

Level 1 items:

- You ran `/context`, named what fills the window, and can point to the Context card percentage in a session.
- You used `/clear` or a handoff note and show a fresh session that continued from it.

Level 2 items:

- You delegated heavy reading to a subagent and recorded the Context card percentage before and after.
- You ran the same prompt at two effort levels and recorded what differed.
- You read `/usage` and named one change you would make from it.

Level 3 items:

- A workflow measurement has readings with counting rules written first, a baseline repeated at least twice so you know your noise, exactly one change, a keep-or-revert rule written before you looked at the after numbers, and a decision that cites them.
- A profiling loop shows a benchmark, one hypothesis, one change, a second measurement and a keep or revert decision.
- A written rule says when you would try fast mode and how you would measure whether it helped, without enabling it unless you chose to.

### Workflow

Level 1 items:

- A CLAUDE.md exists, and `/context` in a new session lists it under the memory files.

Level 2 items:

- A rules file loads in a new session, and a remembered preference appears in the auto memory folder.
- A project skill appears when you type `/` and ran at least once.
- An allow rule for one safe command removed a repeated prompt, and your counts before and after are written down. A command outside the rule still asked.
- You can explain, by checking what loaded, why an instruction Claude ignored did not apply.

Level 3 items:

- A custom subagent has a tool allowlist, a defined return format and a description that tells Claude when to delegate, and the transcript shows a delegation to it.
- A hook blocks an action with exit code 2, `/hooks` lists it, and you have a transcript of the block.
- Two sessions worked in separate worktrees on separate files and merged without conflicts.
- A practice repository holds sample configuration with a manifest and a drift check that names a changed file.

## How to Self-Assess

1. **Collect** evidence as you go. Keep one running note with a line for each piece: a file name, a commit SHA, a pull request link, or a copied command output. The capstones tell you what to save.
2. **Score** each area from the top. For each area, read the Level 3 items first. If you meet every one and every Level 2 and Level 1 item, the score is 3. If not, check Level 2, then Level 1. If you meet no full level, the score is 0.
3. **Record** your scores in a table like the one below, and write the evidence beside each.
4. **Apply** the pass line. Count the areas at 2 or higher, and count the areas at 3.
5. **Ask** someone to check one claim. Give them an evidence line and have them run the command or open the file without your help.
6. **Date** the table. Rescore after new work, because an old table says nothing about today.

```md
| Area | Score | Evidence | Date |
|---|---|---|---|
| Development | 2 | Capstone 2 pull request, CAPSTONE-1.md, review decisions | |
| App Development | 2 | SPEC.md, TICKETS.md, Capstone 2 merge commit | |
| Process | 2 | pull request body, CI run, git worktree list output | |
| Optimization | 1 | Context card before and after, /usage note | |
| Workflow | 2 | /context listing, skill, allow rule counts | |
```

## Where the Evidence Comes From

[Capstone 0](../capstones/capstone-0-first-session.md) gives no score. It confirms that your tools work. The other items map to modules and capstones as follows.

| Area | Level 1 evidence | Level 2 evidence | Level 3 evidence |
|---|---|---|---|
| Development | [Capstone 1](../capstones/capstone-1-fix-and-review.md), Level 1 modules | [Capstone 2](../capstones/capstone-2-ship-a-feature.md), Module M2.3 | Modules M3.1 and M3.3 |
| App Development | Module M1.3 | Module M2.1, Capstone 2 | [Capstone 3a](../capstones/capstone-3a-offline-first-app.md), Module M3.3 |
| Process | Capstone 1, Module M1.2 | Module M2.2, Capstone 2 | Modules M3.1 and M3.4, Capstone 3a |
| Optimization | Module M1.3 | Module M2.5 | [Capstone 3b](../capstones/capstone-3b-optimize-a-workflow.md), Module M3.5 |
| Workflow | Module M1.3 | Module M2.4 | Modules M3.1, M3.2 and M3.4, Capstone 3b |

You may use equivalent evidence from your own project when it meets the same item. A different small app counts if it shows the same thing: a check that failed first, a pull request with a body that states its limits, a measurement with raw numbers.

## What the Rubric Does Not Measure

The rubric does not measure how fast you finished, how many sessions you ran, which model you chose or how much you used Claude. It describes what you can show about your work. Work beyond Trail Notes may call for items this version does not list.
