---
title: Refactoring Safely
id: D06
area: development
level: 2
time: 8
tags: [refactoring]
verified: 2026-10-23
status: verified
sources:
  - https://code.claude.com/docs/en/common-workflows
  - https://code.claude.com/docs/en/skills#bundled-skills
  - https://code.claude.com/docs/en/commands
  - https://code.claude.com/docs/en/desktop
  - https://code.claude.com/docs/en/best-practices
related: [D07, R03, D03, D04]
---

A refactor changes structure and keeps behavior. Write down the behavior that must not change, get the checks green first, work in small steps on a branch or worktree, and review the diff after every step. The bundled `/simplify` skill reviews changed code for cleanup and applies the fixes.

## When to Use It

Refactor when code works but is hard to change: a file doing two jobs, duplicated logic, a function too big to test. Fix bugs and add features in separate changes. Mixing them hides which edit broke what.

## Steps

1. **Write** down the behavior that must not change, as a short list in your prompt or in a file. This list is the contract for the whole refactor.
2. **Run** the checks and confirm they pass. If they do not cover the code you are about to move, add a check or plan a manual check first. [Test-Driven Development with Claude](./test-driven-development-with-claude.md) shows how.
3. **Start** a branch or worktree. In the Code tab, turn on **Worktree** in the project folder control before you start the session. It needs a git repository.
4. **Prompt** for one small step and tell Claude to stop when it finishes so you can review.
5. **Review** the diff, run the checks, and commit. See [Reading and Reviewing Diffs](./reading-and-reviewing-diffs.md).
6. **Repeat** steps 4 and 5 for the next small step.
7. **Run** `/simplify` on the finished change. The commands reference says four review agents run in parallel, covering reuse of existing helpers, simplification, efficiency and whether the change sits at the right level of abstraction. It applies fixes and does not look for bugs, so use `/code-review` for those. Review its diff like any other, then rerun the checks.

> **Terminal tip**
> `claude --worktree refactor-storage` starts a session in a new git worktree, a separate checkout on its own branch, here `worktree-refactor-storage`. By default the branch starts from the repository's default branch on the remote, or from your current commit when there is no remote.
>
> ```terminal
> claude --worktree refactor-storage
> ```

## Worked Example

Extract storage from `app.js` in Trail Notes. `app.js` holds the DOM wiring and the `localStorage` code. Moving the storage code into its own file gives you a smaller `app.js` and one place to change how notes are saved.

Begin from a green suite. Use your copy after fixing the search bug, or copy the `capstone-1` folder from the [solutions](../../exercises/trail-notes-solutions/README.md). If the seeded failure is still there, you cannot tell whether a new failure came from the refactor or from the old bug.

First, ask what the existing checks cover:

```prompt
I'm about to move the localStorage code out of app.js. These behaviors must not change: notes saved before the change still load, and added or removed notes still persist across a page reload. Which of these do the checks in checks/ cover, and which do they miss? Don't edit anything.
```

For the gaps, plan a manual check. Ask Claude to preview the app so it opens in the **Browser** pane ([Preview, Ship and Maintain](../app-development/preview-ship-and-maintain.md) shows the setup; Trail Notes needs a local web server). Add a note, reload and confirm it is still there. Then do the first step:

```prompt
Move the code in app.js that reads notes from localStorage into a new file, storage.js, and have app.js use it. Don't touch notes.js or anything in checks/. Do only the reading half, run node checks/run.mjs, and stop so I can review.
```

Expect a diff with a new `storage.js`, a shorter `app.js` and no other file. Run the manual check, commit, and repeat for the writing half. When both halves are in, run `/simplify` and review what it changes.

## Pitfalls

- Adding a feature "while you are in there". It turns a behavior-preserving change into one you cannot verify.
- Trusting green checks that never exercise the code you moved. A passing suite proves only what it covers.
- Letting Claude edit a check to keep the suite green. In a refactor, check files should not change at all.
- Taking one big step. A broken big step gives you nothing to bisect, while a broken small step shows you the cause.
- Skipping the commit after each green step. Without it, undoing one bad step costs you the good ones. See [Undo and Recover](./undo-and-recover.md).
- Using `/simplify` as a bug finder. Its review leaves correctness to `/code-review`.

For the branch habit this builds on, see [One Branch per Change](../process/one-branch-per-change.md). The [refactor with guardrails prompt](../../prompts/refactor-with-guardrails.md) has ready wording.

## Checkpoint

Why start the Trail Notes refactor from a green suite?

<details><summary>Show the answer</summary>
With the seeded search failure still present, a new failure would be indistinguishable from the old one. A green start means any red check after a step was caused by that step.
</details>
