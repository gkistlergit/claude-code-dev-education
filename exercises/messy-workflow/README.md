---
title: Optimize a Messy Workflow
kind: exercise
order: 3
verified: 2026-10-22
---

This worksheet turns "my setup feels slow" into a measured before and after. You run the same three tasks on Trail Notes with a deliberately bloated `CLAUDE.md`, record a few numbers you can collect by hand, change one thing, run again, and keep the change only if the numbers say it helped. You need a notepad and a stopwatch. No special tools are involved.

The method comes from [Measure a Workflow Before and After](../../kb/optimization/measure-a-workflow-before-and-after.md). The sample file to improve is [`CLAUDE.md`](CLAUDE.md) in this folder, and the tasks are in [`tasks.md`](tasks.md).

## What You Collect

Take the same five readings after every run.

| Reading | How to collect it | Better when |
|---|---|---|
| Approval prompts | Tally each time Claude stops and asks you to allow a command or an edit. If your permission mode never asks, the count is zero, so write the mode on the sheet. | Lower |
| Corrections | Count the messages you send after the task prompt that fix or redirect Claude, such as "no, use the existing helper" or "do not touch that file". An answer to a question Claude asked is not a correction; note it under Notes. | Lower |
| Context at the end | When the task is done, type `/context` and write down the usage figure it shows, exactly as printed. Use the same unit on every run. | Lower |
| Time to green | Start a stopwatch when you send the task prompt. Stop it at the first run where the last line of `node checks/run.mjs` ends in `0 failed`. Then run the checks yourself to confirm. | Lower |
| Quality gate | Yes or no, using the list in `tasks.md`. A fast run that fails the gate does not count as an improvement. | Always yes |

[How Context Works](../../kb/optimization/how-context-works.md) explains what `/context` is showing you.

## Set Up Two Starting Points

Task 1 needs the seeded search bug. Tasks 2 and 3 need a project where every check already passes, so a green result is reachable. That gives you two base folders.

> **Terminal tip**
> `cp` copies a file and `cp -R` copies a folder with everything in it. `~` is your home folder. Replace `path/to/claude-code-dev-education` with wherever you saved the course. The last two commands put the messy `CLAUDE.md` in each base folder.
>
> ```terminal
> cp -R path/to/claude-code-dev-education/exercises/trail-notes-starter ~/trail-notes-base-a
> cp -R path/to/claude-code-dev-education/exercises/trail-notes-solutions/capstone-1 ~/trail-notes-base-b
> cp path/to/claude-code-dev-education/exercises/messy-workflow/CLAUDE.md ~/trail-notes-base-a/CLAUDE.md
> cp path/to/claude-code-dev-education/exercises/messy-workflow/CLAUDE.md ~/trail-notes-base-b/CLAUDE.md
> ```

If you finished capstone 1 yourself, you can use your own fixed copy for base B. Never run Claude inside a base folder. Each run gets a fresh copy:

```terminal
cp -R ~/trail-notes-base-a ~/trail-notes-run-1
```

Keep the runs outside the course repository. Claude Code loads a `CLAUDE.md` from a subfolder once Claude reads or edits a file there (see the [memory page](https://code.claude.com/docs/en/memory)), so the sample file could otherwise leak into unrelated sessions.

## Run the Baseline

1. **Copy** the right base folder to a fresh run folder, as above.
2. **Open** the copy as the project folder in the Code tab and start a new session.
3. **Write down** the model, effort level and permission mode before you send anything. They stay the same for every run unless one of them is the thing you are testing.
4. **Paste** the task prompt from `tasks.md` exactly, and start the stopwatch.
5. **Tally** approval prompts and corrections as they happen. If you give an extra hint, count it as a correction.
6. **Stop** the stopwatch at the first run whose last line ends in `0 failed`, then run `node checks/run.mjs` yourself to confirm.
7. **Type** `/context` and write down the figure.
8. **Score** the quality gate and fill in one row of the results sheet.

Do this for all three tasks, each in its own session and its own fresh copy. Then do the whole baseline a second time. Claude's work varies from run to run, so two identical setups rarely give identical numbers. The gap between your two baseline runs is your noise. A difference smaller than that gap tells you nothing.

## Change One Thing

Pick one change for the round, and leave everything else alone. Candidates:

- Trim the `CLAUDE.md`. Remove rules that are false for this project, contradict another rule, repeat another rule, or are too vague to act on, and keep the few that are true and change what Claude does. Claude can help you find them, but you decide what goes.

  ```prompt
  Read CLAUDE.md and the project files. List every rule that is false for this project, contradicts another rule, repeats another rule, or is too vague to act on. Quote each rule and name its problem. Do not edit anything.
  ```

  The memory page suggests keeping each `CLAUDE.md` under 200 lines and warns that Claude may pick one of two contradictory instructions arbitrarily. This sample is under that limit, so its problems are contradictions and out-of-date rules. [A CLAUDE.md That Earns Its Keep](../../kb/workflow/a-claude-md-that-earns-its-keep.md) shows what to keep.
- Allow the safe commands. Look at which prompts you approved repeatedly, and add allow rules for the read-only and check commands only. For this project that could be `Bash(node checks/run.mjs)` and `Bash(npm run check)` in the project's `.claude/settings.json`. The `/permissions` command lists every rule and where it came from. Claude Code applies a project's allow rules only after you accept the workspace trust dialog for that folder. [Permission Tuning for Fewer Prompts](../../kb/workflow/permission-tuning-for-fewer-prompts.md) covers the method and the trade-off.
- Change the permission mode. [Permission Modes Explained](../../kb/app/permission-modes-explained.md) lists what each mode allows without asking. A mode that asks less can lower the prompt count and raise the cost of a mistake, so lean on the quality gate.
- Your own idea. One idea only.

If you want to try a second change, finish the decision on the first one.

## Keep or Revert

Write the rule before you look at the numbers, so the numbers cannot talk you into it. This is a reasonable rule:

1. Keep the change only if the quality gate is yes for all three tasks.
2. Keep it only if at least one reading improves by more than your noise gap.
3. Revert it if any reading gets worse by more than your noise gap.
4. When the results are a tie, keep whichever setup is simpler.

To revert, put the previous `CLAUDE.md` or settings back and say so in the decision table.

## Results Sheet

Copy this into your own notes. Leave the cells blank until you have a reading.

Settings for the whole exercise:

| Model | Effort level | Permission mode | Date |
|---|---|---|---|
| | | | |

Readings:

| Round | Change | Task | Approval prompts | Corrections | Context at the end | Time to green | Quality gate | Notes |
|---|---|---|---|---|---|---|---|---|
| Baseline 1 | none | 1 | | | | | | |
| Baseline 1 | none | 2 | | | | | | |
| Baseline 1 | none | 3 | | | | | | |
| Baseline 2 | none | 1 | | | | | | |
| Baseline 2 | none | 2 | | | | | | |
| Baseline 2 | none | 3 | | | | | | |
| Round 1 | | 1 | | | | | | |
| Round 1 | | 2 | | | | | | |
| Round 1 | | 3 | | | | | | |
| Round 2 | | 1 | | | | | | |
| Round 2 | | 2 | | | | | | |
| Round 2 | | 3 | | | | | | |

Noise gap for each reading (the difference between Baseline 1 and Baseline 2):

| Approval prompts | Corrections | Context at the end | Time to green |
|---|---|---|---|
| | | | |

Decisions:

| Round | What I changed | Better, same or worse | Keep or revert | Why |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |

## Pitfalls

- Changing two things at once leaves you unable to say which one helped.
- A hint you forgot to count makes one setup look better than it was.
- Runs that start from different folders are not comparable. Always copy a fresh base.
- One run per setup proves nothing. Do the baseline twice at least.
- Trimming the `CLAUDE.md` to nothing throws away rules that stop real mistakes. A line that has prevented an error is worth keeping.
- A faster run with a failed quality gate is a loss.

## Where to Go Next

Read [Permission Prompt Fatigue](../../kb/troubleshooting/permission-prompt-fatigue.md) if prompts were your biggest cost, and [Clear, Compact and Hand Off](../../kb/optimization/clear-compact-and-hand-off.md) if the context figure grew faster than you expected. When you have a setup you trust, write down what you measured so you can repeat the exercise after the next change.
