---
title: Capstone 3b: Optimize a Workflow
kind: capstone
level: 3
order: 5
time: 180
verified: 2026-10-22
sources:
  - https://code.claude.com/docs/en/commands
  - https://code.claude.com/docs/en/context-window
  - https://code.claude.com/docs/en/memory
  - https://code.claude.com/docs/en/permissions
---

This capstone improves a messy workflow with a measured before and after. You run three standard tasks on Trail Notes with a deliberately bloated CLAUDE.md, collect the same readings after every run, change one thing, run again and decide from the numbers. The method comes from [Measure a Workflow Before and After](../kb/optimization/measure-a-workflow-before-and-after.md), and the procedure is the [messy workflow worksheet](../exercises/messy-workflow/README.md). The evidence you save counts toward the Optimization and Workflow scores in the [rubric](../assessment/rubric.md).

## Goal

Show that one change to a workflow moved a reading by more than your own run-to-run noise, or show that it did not and revert it. Either result is a pass if the measurement is sound.

## Setup

- Read the whole [worksheet](../exercises/messy-workflow/README.md) and the task list it links to before you begin. The worksheet defines the readings, the counting rules and the base folders, and it wins wherever this page is less specific.
- Build the two base folders with the worksheet's Terminal tip: one from the starter and one from the `capstone-1/` solution, each with the sample CLAUDE.md copied in. Never run Claude inside a base folder, and keep every run folder outside the course repository.
- A stopwatch, and a file named `CAPSTONE-3B.md` in a repository of your choice where you paste the worksheet's results sheet.
- Your `WORKFLOW-LOG.md` from Module M3.5. It shows how you already counted prompts, corrections, context and time to green.
- There is no solution folder for this capstone, because the right answer depends on what you measure.

## Tasks

1. Read the worksheet and write three sentences in `CAPSTONE-3B.md`: what the workflow is, where you expect the friction, and what a good outcome would look like.
2. Fill in the settings table: model, effort level, permission mode and date. Keep all three settings fixed for every run.
3. Run baseline round 1. For each of the three tasks, copy the right base folder to a fresh run folder, open it in the Code tab, start a new session and paste the task prompt exactly. Take the five readings: approval prompts, corrections, context at the end, time to green and the quality gate.
4. Run baseline round 2 the same way. For each reading, compute the gap between the two baseline rounds. That gap is your noise, and a later difference smaller than it tells you nothing.
5. Read your numbers and the sample CLAUDE.md. Choose exactly one change from the worksheet's candidates, or one idea of your own, and write a hypothesis in the form "reading X should move from A toward B because Y."
6. Before you take any after-change readings, write your keep-or-revert rule in `CAPSTONE-3B.md`. The worksheet gives an example rule you may adopt or adjust.
7. Apply the change to the base folders. Keep a copy of the previous version so that you can revert.
8. Run round 1 with the change: all three tasks, fresh run folders, the same readings.
9. Decide with your rule. Keep the change only if it earns it. If the rule says revert, restore the previous version and note that in the decisions table.
10. Finish `CAPSTONE-3B.md` with the filled results sheet, the noise gaps, the decision with the numbers that support it, a list of what you did not measure, and the next change you would try.

## Success Criteria

- [ ] Model, effort level and permission mode are recorded and did not change between runs.
- [ ] The same five readings were taken after every run, counted by the worksheet's rules.
- [ ] The baseline was run twice, and the noise gap is computed for each reading.
- [ ] Exactly one change separates the baseline from the after-change round, and the previous version is kept so a revert is possible.
- [ ] The keep-or-revert rule was written before you looked at the after-change numbers.
- [ ] The decision cites raw numbers and compares them with the noise gap. A change is kept only if the quality gate was yes for all three tasks.
- [ ] A list states what you did not measure and where the measurement could mislead.
- [ ] A reader who has not seen your sessions could repeat your measurement from your notes.

## Time

180 minutes. The course sets this figure as a planning budget and has not measured it. The capstone has nine task runs, so a slow task can stretch it.

## Self-Review

- Which reading was hardest to count the same way twice, and how did you handle it?
- What else changed between the baseline and the after-change round besides your one change?
- Was your noise gap larger than the difference you saw? What would you do to shrink the noise?
- Would you expect the result to hold for a different task or a different week? What would you measure to find out?
- Which change on your list would you try next, and what number would make you keep it?

Save as evidence: `CAPSTONE-3B.md`, the commits or saved copies for the change and any revert, and the raw numbers. They support Optimization level 3 and Workflow level 2 or 3 in the [rubric](../assessment/rubric.md). Score yourself with the rubric when you finish.
