---
title: Retro Template
kind: template
order: 10
verified: 2026-10-22
sources:
  - https://code.claude.com/docs/en/commands
---

A retro looks back at one piece of work and turns what you learned into changes to your setup. Save it as `docs/retros/[date]-[topic].md`, or as a section at the end of your handoff ledger. Hold it within a few days of finishing, while the details are fresh.

## Template

```md
# Retro: [piece of work], [date range]

## What We Set Out to Do
[The goal and the definition of done.]

## What Happened
[A short timeline: planned against actual. Include the surprises.]

## Measurements
| Measure | Before | After |
| :- | :- | :- |
| [Something you can count, such as prompts, retries or failed checks] | [value] | [value] |

## What Worked
- [A practice to keep, and the evidence for it.]

## What Did Not
- [A problem, and what it cost.]

## Changes to Make
| Change | Where it goes | By when |
| :- | :- | :- |
| [A rule, skill, hook, CLAUDE.md line or check to add] | [file or folder] | [date] |
```

## How to Adapt It

- Count before you judge. Pick one or two things you can measure for the same kind of task, such as how many prompts a fix took or how many times a check failed. `/usage` shows session cost, plan usage limits and activity stats, and [Reading Your Usage, Context and Skills](../kb/optimization/reading-your-usage-context-and-skills.md) explains the numbers.
- Compare like with like. A Before and After from two different tasks proves nothing. Re-run the same task, or note that the tasks differ.
- Fill only the measurements you really have. An empty cell is better than an estimate, and it shows what to start recording.
- Turn every lesson into a change to a file. A mistake that Claude repeats belongs in CLAUDE.md or a rule, a procedure that repeats belongs in a skill, and a rule that was broken belongs in a hook or a check. Without a changed file, the lesson fades.
- Keep What Did Not factual. Name the step and its cost, not the person.
- File the retro where the next session will find it, and link it from the handoff ledger.
- To have Claude draft it, give it the handoff notes, the commit list and your measurements, and use the [Retro prompt](../prompts/retro.md). Edit the result, because the lessons should be yours.

## Common Mistakes

- No numbers at all. "It felt faster" cannot be checked next time.
- Invented numbers. Record what you saw, or leave the cell empty.
- A long list of lessons and no changes. Limit the table to the few changes you will make this week.
- Holding the retro weeks later. The reasons behind each decision are gone by then.
- Skipping What Worked. Good practices need writing down, or they get dropped the next time you change your setup.

See [Measure a Workflow Before and After](../kb/optimization/measure-a-workflow-before-and-after.md) and [Handoff Ledgers and Retros](../kb/process/handoff-ledgers-and-retros.md).
