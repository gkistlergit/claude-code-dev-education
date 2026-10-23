---
title: Plan Template
kind: template
order: 7
verified: 2026-10-23
sources:
  - https://code.claude.com/docs/en/permission-modes
  - https://code.claude.com/docs/en/best-practices
---

A plan lists the steps for one change, with a check after each step, before any file is edited. Save it as `docs/plans/[change-name].md` or `PLAN.md` at the project root, so it survives `/clear` and a new session can read it. Plan mode is the natural place to draft one, because Claude researches and proposes without editing your source.

## Template

```md
# Plan: [change name]

## Goal
[One sentence: what is true when this is done.]

## Approach
[Two to four sentences: how you will do it, and why not the obvious alternative.]

## Steps
1. [Step.] Files: [paths]. Check: [command that proves the step worked].
2. [Step.] Files: [paths]. Check: [command].
3. [Step.] Files: [paths]. Check: [command].

## Risks
- [What could go wrong]. Notice it by [signal]. Undo it by [action].

## Verification
- Before the pull request, run `[command]` and expect [result].
- Not verified: [what you cannot check here].

## Rollback
[How to undo the whole change: revert the commit, switch a flag, run a script.]
```

## How to Adapt It

- In the desktop app, choose the Plan permission mode before you send the task. Claude proposes a plan without editing your source. Read it, correct it and approve it, then switch to Accept edits or Manual to carry it out. Once the plan is approved, ask Claude to save it to the file above. In a terminal session, Ctrl+G opens the proposed plan in your text editor.
- Make each step small enough for one commit, and give it one check. A check is a command with an expected result, such as `node checks/run.mjs` passing.
- For a bug, start the plan with the check that fails now. In Trail Notes, that is the `search` check, which should fail before the fix and pass after it. [Test-Driven Development with Claude](../kb/development/test-driven-development-with-claude.md) covers the order.
- Name the files each step touches. A step that cannot name its files is not yet understood.
- Write Not verified honestly. It tells the reviewer where to look hardest.
- Tick off steps as you go and note any step you changed, so the plan stays true to what happened.
- Skip the plan for a one-line change. [Plan Mode or Not](../kb/decision-guides/plan-mode-or-not.md) helps you decide.

## Common Mistakes

- Steps with no check. The plan then cannot tell you whether a step worked.
- One giant step such as "implement the feature". Split it until each step has a clear stop.
- Leaving the plan only in the conversation. `/clear` starts a new conversation with empty context, so save the file first.
- Skipping Rollback because the change feels small. Write one line, even if it is "revert the commit".
- Treating the plan as fixed. When you learn something that changes the approach, update the plan before you keep editing.

See [Plan Mode: Think Before You Edit](../kb/development/plan-mode-think-before-you-edit.md) and the [Plan a Change prompt](../prompts/plan-a-change.md).
