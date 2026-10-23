---
title: Which Model and Effort
id: DG04
area: decision-guides
level: 2
time: 5
tags: [decision, models]
verified: 2026-10-23
status: verified
sources:
  - https://code.claude.com/docs/en/model-config
  - https://code.claude.com/docs/en/fast-mode
  - https://code.claude.com/docs/en/desktop
related: [O03, O06, O05]
---

Start with a low or middle effort level for scoped work, raise it one step when the answer comes back shallow, and change the model only when more effort does not help. Fast mode is a separate question about speed, and it draws on usage credits.

## When to Use It

Use this when a result misses edge cases, skips verification, or took more thinking than the task needed. Change one setting at a time to see which change helped. The levels are `low`, `medium`, `high`, `xhigh` and `max`, and each model supports a different set.

## Decision Table

| What you see | Change | Notes |
|---|---|---|
| A small, clear change you will review at once | Effort `low` | Suited to quick exchanges where you review each result |
| A scoped feature with clear requirements | Effort `medium` | Fits day-to-day work with a clear scope |
| A bug fix in existing code, edge cases likely | Effort `high` | For work where verification matters |
| The answer is shallow at this level | Raise effort one step, up to `xhigh` | Deeper reasoning at higher token spend |
| A hard problem you want worked through without you | Effort `max` | The docs warn of diminishing returns and overthinking, so test it first |
| Still shallow at the top of the range | Change model, such as `opus` or `fable` | The docs describe `fable` as for your hardest and longest tasks |
| Simple, repetitive edits | `haiku` | Described as fast and efficient for simple tasks |
| One hard question in an easy session | Add `ultrathink` to that prompt | It applies to that turn only |
| Plan with one model, build with another | `opusplan` | Uses `opus` in plan mode, then `sonnet` |

In the Code tab, the model picker sits in the row under the prompt box. Press **Cmd+Shift+I** for the model menu and **Cmd+Shift+E** for the effort menu. Default levels differ by model, and an unsupported level falls back to the highest supported one at or below it. The model configuration page lists the defaults.

> **Observed in the app**
> On 2026-10-23 the picker button read "Sonnet 5.5 Extra", the model name followed by the current effort. Its menu listed Opus 5.5, Fable 5.1, Sonnet 5.5 and Haiku 5.5 with a number from 1 to 4 beside each, then "Effort", which showed the current level and opens a submenu, and "More models". The effort submenu was not opened, so how its labels map to low, medium, high, xhigh and max is not confirmed. The docs describe the picker more briefly, and the wording may change.

Depending on your plan, Fable usage can bill to usage credits instead of your plan's included limits. The `/model` picker shows "Requires usage credits" on that row, so read it before you choose.

Fast mode is a research preview and a separate question. It runs Claude Opus in a configuration tuned for response speed, at a higher cost per token. On subscription plans the docs say it is available through usage credits only, outside your plan's included limits, so this course does not recommend it. [Fast Mode: When It Pays](../optimization/fast-mode-when-it-pays.md) explains how to decide.

> **Observed in the app**
> Fast mode also appears on the desktop Code tab. The fast mode page covers the CLI, the VS Code extension and cloud sessions but not the desktop app, so how it behaves there may change.

In the author's setup, most turns ran on Opus, most ran at `xhigh` or `high`, and fast mode was never used. The audit counts turns and does not show whether lower levels would have done as well. [Model and Effort Trade-offs](../optimization/model-and-effort-trade-offs.md) covers testing that yourself.

## Pitfalls

- Raising effort and model together, which hides what worked.
- Defaulting to `max`. The docs say to test it before broad use.
- Carrying an effort level from one model to another. The scale is calibrated per model.
- Treating speed and thinking as one setting. Fast mode changes latency and cost. Effort changes how much Claude thinks.

## Checkpoint

A medium-effort answer misses two edge cases. What do you change first?

<details><summary>Show the answer</summary>
Raise the effort one step and run the same prompt again. If the answer is still shallow near the top of the range, change the model next.
</details>
