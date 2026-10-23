---
title: Track: Process
kind: track
order: 2
time: 88
verified: 2026-10-23
sources:
  - https://code.claude.com/docs/en/best-practices
  - https://code.claude.com/docs/en/worktrees
  - https://code.claude.com/docs/en/desktop
  - https://code.claude.com/docs/en/permissions
---

This track is a reading order for the path from idea to deploy with gates, branches, pull requests, a standing go and handoffs. It reorders articles that also appear in the levels, and the reading time is 88 minutes.

## Who This Track Is For

Take this track if you already write code with Claude and want a repeatable way to get changes reviewed, checked and shipped. It starts with the whole path on one page and then fills in each step. You can read it alongside Level 2 and Level 3.

## Reading Order

1. [The Idea-to-Deploy Flow](../kb/process/the-idea-to-deploy-flow.md) (7 min). See the whole path on one page first, so each later article has a place to sit.
2. [Grill, Spec, Tickets](../kb/process/grill-spec-tickets.md) (8 min). The path starts with a grilling session, a spec and tickets that declare what blocks what.
3. [One Branch per Change](../kb/process/one-branch-per-change.md) (7 min). Each ticket becomes one branch or worktree, which keeps changes small and separate.
4. [Definition of Done and Gates](../kb/process/definition-of-done-and-gates.md) (8 min). Write down what done means and enforce it with checks that fail loudly.
5. [Pull Requests That Review Fast](../kb/process/pull-requests-that-review-fast.md) (7 min). A change reaches review as a small pull request whose body says what was verified and what was not.
6. [Ship a Feature End to End](../kb/recipes/ship-a-feature-end-to-end.md) (10 min). Run the whole path once on a real feature before you automate any part of it.
7. [CI That Gates the Deploy](../kb/process/ci-that-gates-the-deploy.md) (9 min). Move the gates onto GitHub Actions so nothing depends on one machine, and deploy the exact commit that passed.
8. [A Standing Go with a Stop List](../kb/process/a-standing-go-with-a-stop-list.md) (8 min). With reliable gates you can write a rule that lets Claude merge and deploy when work is ready, plus a stop list that hands the decision back to you.
9. [Handoff Ledgers and Retros](../kb/process/handoff-ledgers-and-retros.md) (8 min). Record each deploy with its commit and what was verified, and learn from incidents with a short retro.
10. [Parallel Sessions Without Collisions](../kb/workflow/parallel-sessions-without-collisions.md) (8 min). Run several changes at once with one worktree per session and one writer per set of files.
11. [Handoffs Between Sessions and Devices](../kb/workflow/handoffs-between-sessions-and-devices.md) (8 min). End with carrying work between sessions and devices using a handoff note.

## Pair It with the Course

The track's articles appear in these modules, and each module's exercise gives you hands-on practice with the same ideas.

- [Level 1, Module M1.3](level-1-beginner.md): The Idea-to-Deploy Flow.
- [Level 2, Module M2.1](level-2-intermediate.md): Grill, Spec, Tickets.
- [Level 2, Module M2.2](level-2-intermediate.md): One Branch per Change, Definition of Done and Gates, and Pull Requests That Review Fast.
- [Level 2, Module M2.5](level-2-intermediate.md): Ship a Feature End to End.
- [Level 3, Module M3.1](level-3-advanced.md): CI That Gates the Deploy.
- [Level 3, Module M3.2](level-3-advanced.md): Parallel Sessions and Handoffs Between Sessions and Devices.
- [Level 3, Module M3.4](level-3-advanced.md): A Standing Go with a Stop List, and Handoff Ledgers and Retros.

Finish with [Capstone 2: Ship a Feature](../capstones/capstone-2-ship-a-feature.md). The [rubric](../assessment/rubric.md) shows what the Process area expects at each level.
