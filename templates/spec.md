---
title: Spec Template
kind: template
order: 6
verified: 2026-10-22
sources:
  - https://code.claude.com/docs/en/best-practices
---

A spec records what you are building and the decisions behind it, before any code exists. Save it as `docs/specs/[feature-name].md`, or as `SPEC.md` at the project root for a small project, and commit it. Start by having Claude question you about the idea until the answers are explicit, then fill in the sections from those answers.

## Template

```md
# [Feature name]

Status: [draft | agreed | built]. Date: [date].

## Problem
[Who has the problem, what they do today, and why it hurts. Two or three sentences.]

## Goal
[The outcome, in one sentence a user would recognize.]

## Out of Scope
- [Something a reader might assume is included and is not.]

## Terms
- [Term]: [Meaning in this project.] Avoid: [a word that means something else here].

## Decisions
| Question | Decision | Why |
| :- | :- | :- |
| [A question settled in the Q&A] | [The answer] | [The reason, in a sentence] |

## Requirements
1. [A behavior, stated so a check can verify it.]
2. [Another behavior.]

## Acceptance Checks
- [ ] [A command or test that must pass, and the result you expect.]
- [ ] [A manual check, with the exact steps.]

## Open Questions
- [A question nobody has answered yet, and who can answer it.]

## Tickets
| Ticket | Blocked by |
| :- | :- |
| [Ticket title] | [none, or the ticket that must finish first] |
```

## How to Adapt It

- Fill the spec from the question-and-answer session, not from a blank page. Each answered question becomes a row in Decisions. [Spec First: Grilling and a Glossary](../kb/app-development/spec-first-grilling-and-a-glossary.md) shows the session, and the [Grill a Spec prompt](../prompts/grill-a-spec.md) starts one.
- Write requirements as behaviors, then give each an acceptance check you can run. In Trail Notes, a tags feature could read "`addNote` accepts tags" and "`filterByTag(notes, tag)` returns only the notes with that tag", with `node checks/run.mjs` passing as the check.
- Keep a Terms list. Naming the words to avoid prevents the same argument twice, and the author's setup keeps a glossary file for this reason. Move it to its own file once it grows.
- Record a hard-to-reverse choice as a short decision record of its own, and link it from the Decisions table.
- Split the work into tickets that declare what blocks what, so independent tickets can run in separate sessions or worktrees. [Grill, Spec, Tickets](../kb/process/grill-spec-tickets.md) covers the flow.
- Delete sections that stay empty after the Q&A. A one-page spec that is read beats a long one that is not.

## Common Mistakes

- Describing the solution, such as files and functions, instead of the behavior a user sees. Leave the design to the plan.
- No acceptance checks. Without a check Claude can run, nothing tells it the work is done, and "done" becomes an opinion.
- Open questions left unanswered while building starts. Answer them or mark the work that depends on them as blocked.
- No Out of Scope list. Without one, the scope tends to grow during the build.
- Letting the spec go stale. When a decision changes, update the table in the same change.

Next, turn the spec into a [plan](plan.md).
