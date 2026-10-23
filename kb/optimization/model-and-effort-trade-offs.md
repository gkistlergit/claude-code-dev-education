---
title: Model and Effort Trade-offs
id: O03
area: optimization
level: 2
time: 8
tags: [models, effort]
verified: 2026-10-23
status: verified
sources:
  - https://code.claude.com/docs/en/model-config
  - https://code.claude.com/docs/en/desktop#keyboard-shortcuts
  - https://code.claude.com/docs/en/prompt-caching
  - https://code.claude.com/docs/en/costs
related: [DG04, O05, O06, O04]
---

Pick a model with Cmd+Shift+I and a reasoning effort with Cmd+Shift+E. Start low, raise the effort when the work comes back shallow, and check your usage afterward. This page gives the method and states no prices or speeds, since those change. The docs and your plan page carry them.

## When to Use It

Use it at the start of a task, when answers feel thin on a hard problem, and when your usage climbs faster than the work seems to justify. For a short yes-or-no version, see [Which Model and Effort](../decision-guides/which-model-and-effort.md).

## Decision Table

### Effort Levels

In the app, Cmd+Shift+E opens the effort menu and Cmd+Shift+I opens the model menu. The model picker also sits in the row under the prompt box. The levels are low, medium, high, xhigh and max. The docs suggest these uses:

| Level | When the docs suggest it |
|---|---|
| low | Quick exchanges where you review each result, such as brainstorming, a first sketch, or a small rename |
| medium | Day-to-day work with a clear scope, or cost-sensitive work that can trade a little depth for lower token use |
| high | Work where verification matters or edge cases are likely, such as fixing a bug in an existing codebase |
| xhigh | Deeper reasoning at higher token spend |
| max | Hard problems you want Claude to work through without you. The docs warn of diminishing returns and overthinking, and say to test before adopting it broadly |

Supported levels vary by model, and so does the default. If you pick a level the model does not support, Claude Code falls back to the highest supported level at or below it. The docs add that the same level name does not mean the same underlying value on every model. Claude Code applies `max` to the current session only, unless you set it through an environment variable. Putting `ultrathink` anywhere in a prompt asks for deeper reasoning on that one turn.

### Model Choices

| Choice | What the docs say |
|---|---|
| `sonnet` | The latest Sonnet, for daily coding tasks |
| `opus` | The latest Opus, for complex reasoning |
| `haiku` | The fast, efficient Haiku, for simple tasks |
| `opusplan` | Opus in plan mode, then Sonnet for execution |

Aliases update over time. To stay on one version, use the full model name. The costs page says Sonnet handles most coding tasks and costs less than Opus.

### A Method for Choosing

1. Start at the lowest level in the table that fits the task, with a prompt that names the check that must pass.
2. If the result is shallow, raise the effort one level and rerun the same prompt in a fresh session so the comparison is fair. Shallow means the change passes the check you named but skips cases a second reader would raise.
3. Check usage. In a terminal session `/usage` shows the Session block with usage by model. In the app, click the usage ring beside the model picker.
4. Write down what worked. [Measure a Workflow Before and After](measure-a-workflow-before-and-after.md) has a worksheet.

Switching has a cost. Each model has its own cache, so a mid-session switch means the next request rereads the whole history without cache hits. On most models a mid-session effort change does the same, and the prompt-caching page lists the models that keep the cache. Set both at the start when you can. A model switch also reaches subagents that inherit your session's model, which matters for [Delegating to Subagents](delegating-to-subagents.md).

> **Terminal tip**
> `claude --model opus --effort high` starts a session on the chosen model at the chosen level. `--model` takes an alias or a full name, and `--effort` takes one of the five level names.
>
> ```terminal
> claude --model opus --effort high
> ```

In the author's setup, counted by turns, Opus ran about 155,000, Fable about 43,000 and Sonnet about 28,000. Effort ran xhigh about 120,000, high 65,000, max 26,000 and medium 21,000. The author mostly runs xhigh. The audit counts turns and does not compare outcomes, so read it as one person's habit.

## Worked Example

In Trail Notes, the search fix is small and `checks/search.check.mjs` already fails, so start at low or medium. Adding tags is larger. Start it at high:

```prompt
Add tags to Trail Notes. addNote should accept an optional tags array, and filterByTag(notes, tag) should return the notes that carry that tag. Write the checks first in checks/, run node checks/run.mjs and show me the failures, then implement until it passes.
```

Read the new check. A shallow result tests only a note with one tag. A fuller one also covers a note with no tags and tags that differ in capitalization. If the checks stop at the happy path, open a fresh session, raise the effort one level, send the same prompt and compare.

## Pitfalls

- Raising effort to rescue a vague prompt. A specific prompt with a named check often helps more.
- Switching model or effort mid-session without noticing the cache miss.
- Expecting `max` to stay on. It resets with the session unless an environment variable sets it.
- Treating an alias as fixed. `opus` and `sonnet` move to newer versions.
- Forgetting that a model switch carries into subagents that inherit it.

## Checkpoint

A change passes the one check you named but ignores obvious edge cases. What do you change, and what do you hold constant?

<details><summary>Show the answer</summary>

Raise the effort one level and rerun the same prompt in a fresh session. Keep the model, the prompt and the check constant so any difference comes from the effort level. Check usage afterward to see what the higher level cost.

</details>
