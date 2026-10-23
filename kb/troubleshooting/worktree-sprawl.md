---
title: Worktree Sprawl
id: TS05
area: troubleshooting
level: 3
time: 6
tags: [troubleshooting, worktrees]
verified: 2026-10-23
status: verified
sources:
  - https://code.claude.com/docs/en/worktrees
  - https://code.claude.com/docs/en/desktop#run-a-session-in-its-own-worktree
  - https://code.claude.com/docs/en/desktop#archive-a-session
  - https://git-scm.com/docs/git-worktree
  - https://git-scm.com/docs/git-branch
related: [A07, R03, W08, TS03]
---

Running every change in its own worktree keeps sessions from colliding, and the price is leftovers. The author counted about 25 stale worktrees in one project and 16 in another. List them, remove the ones whose pull request merged, and make cleanup part of the merge step.

## When to Use It

Use this page when the `.claude/worktrees/` folder keeps growing, when you cannot tell which worktree holds unfinished work, or when old branches clutter your branch list. [Worktrees and Branches in the App](../app/worktrees-and-branches-in-the-app.md) explains how to start one, and [One Branch per Change](../process/one-branch-per-change.md) explains why.

## Symptoms and Fixes

| Symptom | Likely cause | Fix |
|---|---|---|
| Many folders under `.claude/worktrees/` | Each worktree session creates a folder, and a worktree that still holds changes stays on disk | List them with `git worktree list` and remove the finished ones |
| Many leftover branches | Each worktree comes with its own branch | After you remove the worktree, delete its branch if it is fully merged |
| Archived sessions leave folders behind | A worktree that holds changes stays on disk after you archive the session | Commit what you want to keep before archiving, then remove the folder by hand. The docs say the app removes a local session's worktree about 30 days after you archive or last open it, whichever is later |
| `git worktree list` marks an entry `prunable` | Someone deleted the folder without telling git | Preview with `git worktree prune -n`, then run `git worktree prune` |
| Git refuses to remove a worktree | It has uncommitted or untracked files, or Claude Code has it locked while an agent runs | Look at what is in it first. Use `--force` only for work you mean to discard. For locks, follow the worktrees page |

In the app, turn on Auto-archive after PR merge or close in Settings > Claude Code to archive a session when its pull request merges or closes. Running sessions and cloud sessions do not archive themselves.

> **Warning**
> Archiving can lose uncommitted work. The Desktop page says that if the only changes in a worktree are untracked files, the app can delete them without asking once a pull request Claude opened in the session merges. Commit what you want to keep first.

> **Terminal tip**
> Run these from your main project folder, not from inside the worktree you are removing. `git worktree list` prints each worktree with its branch, main first, and marks locked and prunable ones. `git branch --merged` lists branches whose tips are already in the branch you are on, so run it with your main branch checked out. `git worktree remove <path>` deletes a linked worktree and refuses if it has changes. `git branch -d <branch>` deletes a branch only if it is fully merged.
>
> ```terminal
> git worktree list
> git branch --merged
> git worktree remove .claude/worktrees/<name>
> git branch -d <branch>
> ```

### Make Cleanup Part of the Merge

The author's rule is to remove a worktree when its pull request merges. Add these lines to your merge checklist:

1. Confirm the pull request is merged on the main branch.
2. Check the worktree for uncommitted work.
3. Archive the session, then remove the worktree.
4. Delete the local branch.

## Worked Example

You ran three Trail Notes sessions, each in its own worktree: the search fix, tags, and the service worker. The search fix merged. From the main project folder, `git worktree list` shows four entries, laid out like this:

```text
<project folder>                            <commit> [main]
<project folder>/.claude/worktrees/<name>   <commit> [<branch>]
```

Run `git branch --merged` with the main branch checked out. If the pull request landed as a merge commit, the search branch appears in that list and the other two do not. Remove the search worktree, delete its branch with `git branch -d`, and archive the session in the app. Two worktrees remain, and both still hold unfinished work.

A squash merge writes new commits on main, so the original branch tip is not in main's history. In that case `--merged` omits the branch and `git branch -d` refuses. Confirm on the pull request page that it merged before you consider a force delete, and stop if it did not.

## Pitfalls

- Removing a worktree before the pull request merges. You may delete the only copy of unpushed work.
- Forcing removal on a worktree you have not looked at.
- Deleting the folder by hand. Git keeps a record of it until you run `git worktree prune`.
- Forgetting that Claude Code also creates temporary worktrees for subagents and background sessions. It sweeps those periodically, but leaves any that still hold work.
- Counting on the 30-day removal. The docs describe it for archived local sessions only.

## Checkpoint

1. Which command previews what `git worktree prune` would remove?
2. When should you remove a worktree?

<details><summary>Show the answer</summary>

1. `git worktree prune -n`, the dry-run form, which reports without removing anything.
2. When its pull request has merged and you have checked that nothing uncommitted remains. Do it as part of the merge step so it does not pile up.

</details>
