---
title: Worktrees and Branches in the App
id: A07
area: app
level: 2
time: 8
tags: [worktrees, branches]
verified: 2026-10-22
status: verified
sources:
  - https://code.claude.com/docs/en/desktop#run-a-session-in-its-own-worktree
  - https://code.claude.com/docs/en/desktop#archive-a-session
  - https://code.claude.com/docs/en/worktrees
related: [R03, W08, TS05]
---

A worktree is a separate working directory with its own files and branch that shares the repository's history and remote. In the desktop app, one toggle runs a session in its own worktree, so two sessions can edit the same project without colliding.

## When to Use It

Turn on a worktree when two or more sessions will edit files in the same repository at the same time, or when you want a session's changes on their own branch from the start. Skip it for read-only work such as explaining code, where nothing needs isolating.

## Steps

1. **Check** that the project is a Git repository and that Git is installed. Session isolation requires Git. Running `git --version` in Terminal prints a version number if it is.
2. **Click** the project folder control in the row under the prompt box and turn on Worktree. It is off by default, and you set it before the session starts. With a saved environment, set Worktree when you create or edit the environment. In the earlier layout, select the worktree checkbox beside the branch name above the prompt box.
3. **Type** your task and press Enter. The session works in its own worktree, stored in `<project-root>/.claude/worktrees/` by default.
4. **Open** Settings > Claude Code if you want to change where worktrees go (Worktree location) or to add a Branch prefix. Desktop prepends the prefix to every worktree branch name, which keeps Claude-created branches easy to find.
5. **Add** a `.worktreeinclude` file at the project root if the work needs gitignored files such as `.env`. It uses `.gitignore` syntax. Only files that match a pattern and are also gitignored are copied, so tracked files are never duplicated:

   ```text
   .env
   .env.local
   ```

6. **Review** the changes, open the pull request and merge. See [Pull Requests and Auto-fix](pull-requests-and-auto-fix.md).
7. **Clean up** when the work merges. Commit anything you want to keep, then archive the session, as described below.

> **Terminal tip**
> `git worktree list` prints the main checkout and every worktree with its branch. `git worktree remove <path>` deletes one worktree directory. Add `--force` if it has uncommitted changes or untracked files. The docs also suggest adding `.claude/worktrees/` to `.gitignore` so worktree contents do not show up as untracked files in your main checkout.

### What a Worktree Shares

A worktree has its own files and branch. It shares the repository's `.git` directory, so `git commit` works inside it. In a worktree session started from the desktop app, Claude reads project configuration such as settings, hooks, skills, agents, commands and `.mcp.json` from the main checkout's root. Hook commands run in that root, and `${CLAUDE_PROJECT_DIR}` points at it. A hook that needs the worktree's path reads the `cwd` field of its input. `CLAUDE.md` and `.claude/rules/` still load from the worktree.

Choosing "Yes, and don't ask again" on a Bash command in a worktree saves the rule to the main checkout's `.claude/settings.local.json`, so it applies in the main checkout and every other worktree.

While a session is isolated, Claude Code blocks edits that target a path in the main checkout, and blocks commands whose working directory resolves to it. A command that writes there without running git, such as `cp`, is not refused by those checks.

New worktrees branch from the repository's default branch. The worktrees page describes a `worktree.baseRef` setting that makes them branch from your current `HEAD` instead. It documents that setting for Claude Code in general, and the desktop page does not repeat it.

### Archiving and Cleanup

Archiving a session can lose uncommitted changes in its worktree. If Desktop asks, Archive anyway discards them. If the only changes are untracked files, commit the ones you want before a pull request that Claude opened in the session merges, because Desktop can then delete them without asking. In other cases the worktree stays on disk with its changes, and for a local session Desktop removes the worktree and its changes about 30 days after the session is archived or you last open it, whichever is later. To keep them, open the session from the Archived tab and select Unarchive. Turn on Auto-archive after PR merge or close in Settings > Claude Code to archive when the pull request merges or closes.

## Worked Example

You want to fix the case-sensitive search in Trail Notes and add tags at the same time. First give your copy a Git history if it has none:

```terminal
git init
git add .
git commit -m "Start from Trail Notes starter"
```

`git init` turns the folder into a Git repository, `git add .` stages every file, and `git commit -m` records them with a message. If Git asks who you are, follow its message.

Start one session with Worktree on and ask it to fix `searchNotes`. Start a second with Worktree on and ask it to let `addNote` accept tags. Each session edits its own copy of `notes.js`. Neither sees the other's half-finished change. Open each session's Changes pane, merge one pull request, then the other, and resolve any conflict in `notes.js` once, at merge time.

In the author's setup, 171 of 360 sessions with desktop metadata (48%) ran in worktrees. The cost was sprawl: about 25 stale worktrees in one project and 16 in another. Remove a worktree when its pull request merges. See [Worktree Sprawl](../troubleshooting/worktree-sprawl.md) for the cleanup routine, and [One Branch per Change](../process/one-branch-per-change.md) for why each change gets its own branch.

## Pitfalls

- Turn Worktree on before you start the session. The docs describe the toggle as a setting for a session you are about to start.
- A fresh worktree has none of your gitignored files. Without `.worktreeinclude`, a missing `.env` can look like a broken app.
- A worktree is a fresh checkout, so install dependencies there. Trail Notes has none.
- Archive anyway discards uncommitted work. Commit first.
- An error reading "Git is required" means Git is missing. Install it and retry.
- Worktrees isolate file edits. For other ways to split work across sessions, see [Parallel Sessions Without Collisions](../workflow/parallel-sessions-without-collisions.md).

## Checkpoint

Where do desktop worktrees live by default, and how do you get a gitignored `.env` into each new one?

<details><summary>Show the answer</summary>
Under `<project-root>/.claude/worktrees/`. Create a `.worktreeinclude` file at the project root listing the ignored files to copy, in `.gitignore` syntax. Only files that match and are also gitignored are copied.
</details>
