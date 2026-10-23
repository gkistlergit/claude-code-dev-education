---
title: The Idea-to-Deploy Flow
id: R01
area: process
level: 1
time: 7
tags: [process, flow]
verified: 2026-10-22
status: verified
sources:
  - https://code.claude.com/docs/en/best-practices
  - https://code.claude.com/docs/en/desktop#run-a-session-in-its-own-worktree
  - https://code.claude.com/docs/en/desktop#monitor-pull-request-status
related: [R02, R03, RC02, R06, R07]
---

Every change in this course follows one path: idea, grill, spec, tickets, branch, build with checks, pull request, merge, deploy, record. Each step guards against one kind of mistake, so you can skip a step when its mistake cannot happen.

## When to Use It

Use the whole path for a change you plan to keep and cannot describe in one sentence, or one that touches several files. The best-practices guide says to skip planning when you could describe the diff in one sentence, so a typo fix or a renamed variable can start at step 5.

Use the path as a map when you lose your place. Find the step you are on, then read the article for it.

## How It Works

The whole path is below. The outlined step is the gate: review and checks decide whether anything ships.

{{diagram:idea-to-deploy}}

The flow puts a person at the start, where you decide what to build, and a person at the end, where you decide what ships. Claude does much of the work in between, and the checks keep that work honest.

```text
idea -> grill -> spec -> tickets -> branch or worktree
                                          |
                                          v
record <- deploy <- merge <- PR + CI <- build + checks
```

| # | Step | What you do | What it guards against |
|---|------|-------------|------------------------|
| 1 | Idea | Write the change as one sentence and say who it is for | Building the wrong thing |
| 2 | Grill | Have Claude interview you until the decisions are explicit | Assumptions nobody said out loud |
| 3 | Spec | Save the decisions in a file a fresh session can read | Losing decisions between sessions |
| 4 | Tickets | Cut the spec into small pieces that say what blocks what | A change too big to review |
| 5 | Branch or worktree | Give each change its own branch in its own worktree | Parallel sessions overwriting each other |
| 6 | Build with checks | Write the failing check first, then make it pass | "Looks done" being the only evidence |
| 7 | Pull request and CI | Read your own diff, state what you verified, let CI repeat the checks | A result that works on one machine only |
| 8 | Merge | Merge the commit you verified | Merging something that changed after you looked |
| 9 | Deploy | Ship that exact commit and read the log | Shipping the working tree or a moving branch |
| 10 | Record | Write down the commit, the version, what was verified and what was not | Not knowing what is live |

Steps 2 to 4 are covered in [Grill, Spec, Tickets](grill-spec-tickets.md), step 5 in [One Branch per Change](one-branch-per-change.md), step 6 in [Definition of Done and Gates](definition-of-done-and-gates.md), and step 7 in [Pull Requests That Review Fast](pull-requests-that-review-fast.md). Step 8 is in [A Standing Go with a Stop List](a-standing-go-with-a-stop-list.md), step 9 in [CI That Gates the Deploy](ci-that-gates-the-deploy.md), and step 10 in [Handoff Ledgers and Retros](handoff-ledgers-and-retros.md).

### Where the steps happen in the app

- Steps 2 to 4 happen in chat. [Plan Mode: Think Before You Edit](../development/plan-mode-think-before-you-edit.md) is another way to think before editing. In the author's setup, planning happens by grilling and writing a spec, and plan mode was never used.
- For step 5, turn on **Worktree** in the row under the prompt box before you start the session.
- For step 6, run the checks in the **Terminal** pane or ask Claude to run them.
- For step 7, the **Changes** pane shows the diff. After you open a pull request, the **Changes** card shows the status of its CI checks, and its **⋮** menu offers **Auto-fix** and **Merge when ready**.
- Steps 8 to 10 happen on GitHub, with `gh`, and in your deploy workflow.

### Where a person decides

You answer the grill and read the diff. You also own every step that is hard to undo, and a standing go for ordinary merges does not change that.

## Worked Example

You want Trail Notes to support tags. Here is the path in one line per step.

1. Idea: "Let me filter my notes by tag."
2. Grill: Claude asks whether a note can have no tags, whether tag matching ignores case, and whether the filter takes one tag or several.
3. Spec: your answers go into `SPEC.md`.
4. Tickets: one for `addNote` accepting tags, one for `filterByTag(notes, tag)`, and one for the page, blocked by the first two.
5. Branch: a worktree named `tags`.
6. Build: a failing check for tags, then the change, then `node checks/run.mjs` passes.
7. Pull request: the body lists the command you ran and says you did not try the page on a phone.
8. Merge: after CI passes, you merge the commit you checked.
9. Deploy: the workflow ships that commit and its log names it.
10. Record: one entry in the ledger with the commit and the unverified items.

[Ship a Feature End to End](../recipes/ship-a-feature-end-to-end.md) walks through this with the exact prompts.

## Pitfalls

- Starting at the build because the idea feels clear. Decisions that were never written down get made again by the next session, often differently.
- Stopping at the merge. A merged pull request does not tell you what is live.
- Running every step for every change. A flow that costs more than the mistake it prevents gets abandoned, so skip steps deliberately.
- Handing the decision steps to Claude. It can interview you, draft the body and run the checks, and you still choose what to build and whether to ship.

## Checkpoint

Which two steps guard against shipping something different from what you verified?

<details><summary>Show the answer</summary>

Merge and deploy. At the merge you merge the commit you verified, and at the deploy you ship that exact commit rather than the working tree or a branch name that may have moved.

</details>
