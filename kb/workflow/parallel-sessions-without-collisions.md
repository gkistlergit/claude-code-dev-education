---
title: Parallel Sessions Without Collisions
id: W08
area: workflow
level: 3
time: 8
tags: [parallel, worktrees]
verified: 2026-10-23
status: verified
sources:
  - https://code.claude.com/docs/en/worktrees
  - https://code.claude.com/docs/en/desktop
  - https://code.claude.com/docs/en/agent-teams
related: [A07, A10, TS05]
---

You can run several sessions at once if each one has its own copy of the files and its own set of files to change. Give every session a worktree, keep one writer per set of files, and clean up when a pull request merges. This page covers that routine for the Code tab.

## When to Use It

Use parallel sessions when two jobs are independent: a bug fix and a style change, or a feature and the docs for it. Stay in one session when the jobs touch the same functions, because merging two edits to the same lines is work you create for yourself.

A git worktree, per the docs, is a separate working directory with its own files and branch that shares the repository history and remote with your main checkout. Each session in its own worktree edits a separate copy, so one builds a feature while another fixes a bug. Worktrees isolate file edits. Splitting the job across files is your part. The agent teams page gives the same advice for teammates: break the work so each one owns a different set of files.

## Steps

1. **Click** **+ New** in the sidebar, or press **Cmd+N**, to start a session. Pick the project folder in the row under the prompt box.
2. **Turn on** **Worktree** before you send the first message. Click the project folder control and switch it on. It is off by default, and the project must be a git repository (see [git and gh Essentials](../terminal/git-and-gh-essentials.md)). Worktrees are stored in `<project-root>/.claude/worktrees/` unless you change **Worktree location** in **Settings > Claude Code**.
3. **Name** the files each session owns in its first prompt, and what it must leave alone.
4. **Start** the second session the same way.
5. **Open** a split view to watch both. Hold **Option** and click a session in the sidebar, or right-click it and choose **Open in**, then **Split view**. Click a pane to give it focus. Press **Cmd+Ctrl+W** to take the focused session out of the split.
6. **Check** background work. **Background tasks** in the title bar's **⋮** menu lists subagents, background shell commands and dynamic workflows. The app also sends an OS notification when a session finishes a task and you are not viewing it.
7. **Review** each session in its **Changes** pane and merge one pull request at a time.

The desktop page states no limit on open sessions. Split view shows two, and the rest wait in the sidebar, so your real limit is how many you can review. The author started 209 sessions in the busiest week of a four-week audit, but 97% of sessions were later archived, so that counts sessions started and not sessions open at once. About half (171 of 360 with app metadata) ran in a worktree.

## Worked Example

You have a Trail Notes copy in a git repository. Session A owns the search bug, session B owns the look of the page.

```prompt
Fix searchNotes so it matches title and body case-insensitively. You own notes.js and checks/search.check.mjs. Do not touch index.html, style.css or app.js.
```

```prompt
Give the empty state in index.html and style.css a friendlier message and more spacing. You own index.html and style.css. Do not touch notes.js or the checks.
```

Run `node checks/run.mjs` in session A's worktree and watch the search check go from failing to passing. Session B's copy still has the old `notes.js`, which is expected. Each session ends with its own branch and its own diff, and the two diffs share no files, so they merge without conflicts.

Permission approvals work across worktrees. Choosing "Yes, and don't ask again" for a Bash command in a worktree session saves the rule to the main checkout's `.claude/settings.local.json`, so it applies in every worktree of the repository. In a worktree session started from the desktop app, Claude Code reads settings, hooks, skills and agents from the main checkout's root. `CLAUDE.md` files and `.claude/rules/` load from the worktree.

For subagents, `isolation: worktree` in a custom agent's frontmatter gives that agent its own worktree (see [Subagents by Design](subagents-by-design.md)).

## Pitfalls

- Worktrees pile up. The author counted about 25 stale ones in one project and 16 in another. Remove a worktree when its pull request merges.
- Archiving can lose work. Before you archive a session whose worktree has uncommitted changes, commit what you want to keep. Desktop asks first when it can, and **Archive anyway** discards the changes.
- When an archived session's worktree stays on disk with its changes, the docs say Desktop removes both about 30 days after you archive the session or last open it, whichever is later. To keep the changes, open the session from the **Archived** tab and select **Unarchive**.
- **Auto-archive after PR merge or close** in **Settings > Claude Code** archives sessions for you when their pull request merges or closes. Cloud sessions and sessions still running do not archive themselves.
- A worktree is a fresh checkout, so gitignored files such as `.env` are missing. A `.worktreeinclude` file in the project root lists files to copy in.
- Add `.claude/worktrees/` to `.gitignore` so worktree contents do not show up as untracked files.
- Two sessions that edit the same file will conflict at merge time, even in separate worktrees.

> **Terminal tip**
> These commands manage worktrees. The first prints every worktree of the repository. The second deletes one, and you add `--force` only if you accept losing its uncommitted changes.
>
> ```terminal
> git worktree list
> git worktree remove <path>
> ```

If git refuses to remove a worktree because it is locked, release the lock with this command and run the removal again:

```terminal
git worktree unlock <path>
```

See [Worktree Sprawl](../troubleshooting/worktree-sprawl.md) for a fuller cleanup routine.

## Checkpoint

1. Two sessions both need to change `notes.js`. What do you do?
2. Where does Desktop store worktrees by default?

<details><summary>Show the answer</summary>

1. Run them one after the other, or split the work so each owns different files. Separate worktrees stop edits from overwriting each other but not from conflicting at merge.
2. In `<project-root>/.claude/worktrees/`.

</details>
