---
title: Measure a Workflow Before and After
id: O08
area: optimization
level: 3
time: 10
tags: [measurement, workflow]
verified: 2026-10-22
status: verified
sources:
  - https://code.claude.com/docs/en/costs
  - https://code.claude.com/docs/en/permissions
  - https://code.claude.com/docs/en/permission-modes
  - https://code.claude.com/docs/en/monitoring-usage
  - https://code.claude.com/docs/en/desktop
related: [O05, W05, TS03, O07]
---

Pick one workflow, pick readings you can collect by hand, change one thing, measure again, and keep or revert the change. This page gives a worksheet and the author's four-week aggregates as an example of what a baseline looks like. The [Optimize a Messy Workflow exercise](../../exercises/messy-workflow/README.md) applies the method to a deliberately bloated setup.

## When to Use It

Use it before you change anything meant to help: a permission rule, a CLAUDE.md edit, a new skill, a different model. If you cannot name the number a change should move, you cannot say afterward that it helped. [Permission Tuning for Fewer Prompts](../workflow/permission-tuning-for-fewer-prompts.md) and [Permission Prompt Fatigue](../troubleshooting/permission-prompt-fatigue.md) both end with a measurement, and this page is how to take it.

## Measure It

### Readings You Can Collect

| Reading | How to collect it |
|---|---|
| Approval prompts per session | Tally each time Claude stops and asks you to allow something. Write down the permission mode, because a mode that never asks scores zero |
| Corrections per session | Count the messages you send that fix or redirect Claude, and the times you stop it with Esc |
| Context at the end | Read the Context card, or type `/context`, when the task is done. Use the same unit every run |
| Minutes to green | Time from sending the prompt until `node checks/run.mjs` ends with `0 failed` |
| Quality gate | Yes or no against a short list you wrote before you started. A fast run that fails the gate is not an improvement |

For usage, `/usage` attribution and recommendations are covered in [Reading Your Usage, Context and Skills](reading-your-usage-context-and-skills.md). Teams that export OpenTelemetry data can count code edit accept and reject decisions with the `claude_code.code_edit_tool.decision` metric. By hand is enough for one person.

### The Author's Baseline

Over about four weeks and 498 sessions, the audit recorded these:

| Signal | Count |
|---|---|
| Prompts that begin with a negation word | 27 of 2,881 (about 1%, a keyword heuristic) |
| Interrupted turns | 51 |
| Permission-style denials | 194 (a heuristic) |
| Tool errors | 1,606 |
| API errors | 792 |
| Prompts by permission mode | Auto 6,220, Manual 67, Accept edits 16 |

Dividing by 498 gives rough per-session rates of about 0.1 interrupted turns, 0.4 denials, 3.2 tool errors and 1.6 API errors. Treat these as the shape of a baseline. Short and very long sessions are mixed together, two of the counts are heuristics, and they are one person's numbers, so they are no target for you.

### Worksheet

Copy this into your notes. Run the baseline twice. The gap between the two baseline runs is your noise gap, and a change smaller than that gap tells you nothing.

| Reading | Baseline 1 | Baseline 2 | Noise gap | After the change |
|---|---|---|---|---|
| Approval prompts | | | | |
| Corrections | | | | |
| Context at the end | | | | |
| Minutes to green | | | | |
| Quality gate (yes or no) | | | not applicable | |

Under the table, write three lines: the workflow you measured, the one change you made, and your decision with the reason.

### Run It

1. Pick a workflow you repeat, with an ending you can check, and write the quality gate.
2. Run the baseline twice, each time from a fresh copy of the same starting point, and fill in the first columns.
3. Make one change.
4. Run the workflow again on a task of similar size.
5. Keep the change if one reading improved by more than the noise gap, no reading got worse by more than the gap, and the quality gate stayed yes. Otherwise revert. Decide the rule before you read the numbers.

## Worked Example

Workflow: fix the failing search check in a fresh copy of the Trail Notes starter, in Manual mode. Each run of `node checks/run.mjs` normally asks for approval. The quality gate is that every check passes and no check file was edited.

Baseline: do the fix twice, each in a fresh copy, and tally the prompts in each session. Change: add an allow rule for the check command to the project's `.claude/settings.json`.

```json
{
  "permissions": {
    "allow": ["Bash(node checks/run.mjs)"]
  }
}
```

The docs say a rule with no `*` matches one exact command, so this covers that command and nothing else. After: do the same fix in a third fresh copy, in Manual mode again, and tally. Compare the prompt count with the noise gap. Check that corrections did not rise and the gate stayed yes, and record both. If prompts fell by more than the gap and nothing else got worse, keep the rule.

## Pitfalls

- Changing two things at once, such as a new rule and a different permission mode. You then cannot say which one moved the number.
- Comparing different tasks. A larger task produces more prompts for reasons unrelated to your change.
- Measuring a single run before and after. Without a noise gap you cannot tell a change from variation.
- Chasing the easy number. Fewer prompts with more corrections can be a loss, which is why the sheet carries several readings.
- Keeping a change because it feels better.

## Checkpoint

You added an allow rule and switched models in the same week, and prompts per session fell. What can you conclude?

<details><summary>Show the answer</summary>

Very little about the rule. Two things changed, so either could account for the drop. Revert one, measure again, and compare against your noise gap. Next time, change one thing per measurement round.

</details>
