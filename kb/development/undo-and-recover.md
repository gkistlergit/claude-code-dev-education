---
title: Undo and Recover
id: D04
area: development
level: 1
time: 7
tags: [rewind, git, checkpoints]
verified: 2026-10-23
status: partial
sources:
  - https://code.claude.com/docs/en/checkpointing
  - https://code.claude.com/docs/en/commands
  - https://code.claude.com/docs/en/desktop
  - https://code.claude.com/docs/en/common-workflows
  - https://git-scm.com/docs/git-restore
  - https://git-scm.com/docs/git-revert
related: [D03, T04, O02, D06]
---

Two layers undo Claude's work. Checkpoints rewind Claude's own file edits and the conversation, and git covers everything else. Commit before a big change, learn four git commands, and use a worktree when you want to try something you may throw away.

## When to Use It

Use this page twice: before a risky change, to set up a way back, and after a change goes wrong, to pick the right undo. Git is the real safety net. Checkpoints are the quick one.

## How It Works

### Checkpoints

Every prompt you send that starts a turn creates a checkpoint, and Claude snapshots files before it edits them. Run `/rewind` to open a menu of your prompts. Pick one, then choose **Restore code and conversation**, **Restore conversation**, **Restore code**, **Summarize from here**, **Summarize up to here** or **Never mind**. The two code options appear only when that point has tracked file changes.

The checkpointing page keeps snapshots for the 100 most recent checkpoints and deletes a session's snapshots by default about 30 days after it last saved one. It also lists what checkpoints do not track: files that only Bash commands changed, edits made by most subagents, edits you make outside the session, and symlinked files. The page says checkpoints are not a replacement for version control. Read it once before you rely on `/rewind`.

The desktop page does not describe the rewind menu, and it says built-in commands that open an interactive panel behave differently in the Code tab. Type `/rewind` in the prompt box and see what the Code tab does. If it is unavailable, use git.

### Git

Ask Claude to commit before any big change, for example "commit the current state with a clear message". Four commands cover most recoveries:

| Command | What it does |
|---|---|
| `git status` | Lists changed files, including new ones git does not track yet |
| `git diff` | Shows unstaged changes in tracked files |
| `git restore <file>` | Puts one file back to its last staged or committed content |
| `git revert <commit>` | Records a new commit that undoes an earlier one; needs a clean working tree |

### Worktrees

In a project that is a git repository, turn on **Worktree** in the project folder control before you start a session. Claude then works in an isolated copy under `<project-root>/.claude/worktrees/`, so your main folder stays as it was. To throw the work away, do not merge it.

One caution: archiving a session can discard uncommitted changes in its worktree. If Desktop asks, **Archive anyway** discards them. Commit what you want to keep first.

> **Terminal tip**
> `claude --worktree try-tags` starts a session in a new git worktree: a separate checkout on its own branch, here `worktree-try-tags`, under `.claude/worktrees/try-tags/`. By default it branches from the repository's default branch on the remote, or from your current commit when there is no remote.
>
> ```terminal
> claude --worktree try-tags
> ```

## Worked Example

Set up a way back, run an experiment, and undo it in Trail Notes.

1. Prompt Claude to set up the safety net:

   ```prompt
   If this folder isn't a git repository yet, run git init. Then commit everything with the message "Trail Notes starter".
   ```

2. Start the experiment:

   ```prompt
   Try rewriting searchNotes in notes.js so it builds a regular expression from the query. Run node checks/run.mjs afterward.
   ```

3. Decide. If you want the conversation and code back as they were, try `/rewind`, choose the prompt before the experiment, and pick **Restore code and conversation**. For the code alone, use git in the Terminal pane:

   ```terminal
   git status
   git diff
   git restore notes.js
   ```

`git status` confirms which files changed, `git diff` shows how, and `git restore notes.js` resets that one file.

> **Warning**
> `git restore` throws away uncommitted changes in the file and git cannot bring them back. Run `git diff` first, and commit anything you might want.

## Pitfalls

- Expecting `/rewind` to bring back a file that only a Bash command created or deleted.
- Choosing **Restore conversation** when you meant to restore code. It keeps your current code, so the conversation and the files can disagree.
- Archiving a worktree session before committing the work in it.
- Leaving it too long. Snapshots are deleted after the retention window, so rewinding an old session can fail.
- Running `git revert` with uncommitted changes in the way. Commit or restore them first.

For the full git toolkit see [git and gh Essentials](../terminal/git-and-gh-essentials.md). Checking what changed before you undo is covered in [Reading and Reviewing Diffs](./reading-and-reviewing-diffs.md), and keeping long sessions healthy in [Clear, Compact and Hand Off](../optimization/clear-compact-and-hand-off.md).

## Checkpoint

Claude ran a shell command that deleted a generated file you never asked it to edit. Will `/rewind` restore it?

<details><summary>Show the answer</summary>
Not reliably. Checkpoints track edits made through Claude's file editing tools, and a file that only Bash commands changed is not tracked. If the file was committed, <code>git restore</code> brings it back.
</details>
