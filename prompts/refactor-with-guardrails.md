---
title: Refactor with Guardrails
kind: prompt
order: 7
verified: 2026-10-23
---

Use this when you want to restructure working code without changing what it does. It asks Claude to write down the behavior to preserve, prove the checks pass first, and move in steps you can undo. [Refactoring Safely](../kb/development/refactoring-safely.md) covers the method, and a branch or worktree keeps the experiment separate; see [Worktrees and Branches in the App](../kb/app/worktrees-and-branches-in-the-app.md).

## Prompt

```prompt
Refactor [target] to [goal, for example: move the storage code out of app.js into its own module]. The behavior must not change.

Before you edit anything:
1. List the behavior that must stay the same, as it works today.
2. Run [check command] and show me that it passes.
3. Name any behavior on that list that no check covers.

Then work in steps. Each step is one move. After each step, run [check command] and show me the result. Stop and tell me if any check fails.

Rules: do not change existing checks, do not add dependencies, and do not fix unrelated problems you notice. List those at the end instead. When you finish, summarize the diff and say what the checks do not cover.
```

## What a Good Result Looks Like

- The behavior list is concrete, with the inputs and outputs for each item.
- A passing baseline run appears before the first edit.
- Claude names the gaps. In Trail Notes, `loadNotes` and `saveNotes` live in `app.js`, which Node cannot import, so no check covers them.
- Each step is small and followed by a run. A single large step followed by one run ignores the instruction.
- The diff touches the target and the files that import it, and nothing else. Unrelated findings arrive as a list.

## Variations

### Cover the Gaps First

```prompt
Before refactoring [target], write a check for each behavior you named as uncovered, run it against the current code, and show me it passes. Then start the refactor.
```

### One Function Only

```prompt
Refactor only [function name]: keep its inputs and outputs identical, change its internals to [goal], and show me the checks before and after.
```

### Simplify Pass

```prompt
Run the bundled /simplify skill on [files], then show me each change it made and run [check command] after it.
```
