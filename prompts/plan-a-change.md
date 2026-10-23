---
title: Plan a Change
kind: prompt
order: 2
verified: 2026-10-23
---

Use this before a change that touches several files or is hard to undo. It asks Claude for a plan you can approve or correct before anything is edited. You can send it in any permission mode, and choosing Plan in the permission mode control adds a second guard. [Plan Mode: Think Before You Edit](../kb/development/plan-mode-think-before-you-edit.md) covers both.

## Prompt

```prompt
I want to [goal, in one sentence]. Do not edit any file yet.

Read what you need, then give me a plan with:
1. The files you would change, and why each one.
2. The steps in order, each small enough that I can check it on its own.
3. For each step, how we will know it worked: the command to run and the result I should see.
4. What could break, and what you will not touch.
5. Questions for me, only where a decision is mine to make.

Wait for my go before you start.
```

## What a Good Result Looks Like

- The files it names exist, and the reasons tie to your goal.
- Steps are small and ordered, and each has a check you can run. A step that says "update the logic" with no check is too big.
- It states what it will leave alone. A plan that edits existing checks so they pass is a red flag.
- The questions are real decisions, such as "should tags be case sensitive?" and not filler.
- No file has changed when you look at the Changes pane.

On Trail Notes, a plan for adding tags should reach `notes.js`, `app.js` and `index.html`, put a new check file ahead of the code, and keep `notes.check.mjs` and `search.check.mjs` untouched.

## Variations

### Two Approaches

```prompt
Give me two ways to [goal], with the trade-offs of each and which one you would pick. Do not edit any file.
```

### Plan as Tickets

Use this when parts of the work can run in separate sessions.

```prompt
Turn the plan into tickets. For each ticket give the goal, the files, the check that proves it done, and which tickets must finish before it can start.
```

### Plan from a Spec

```prompt
Read [spec file] and plan only what it asks for. List anything in the spec that is unclear or contradicts the code, and do not guess at it.
```
