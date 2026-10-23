---
title: Sessions and the Sidebar
id: A03
area: app
level: 0
time: 7
tags: [sessions, sidebar]
verified: 2026-10-23
status: partial
sources:
  - https://code.claude.com/docs/en/desktop#manage-sessions
  - https://code.claude.com/docs/en/desktop#work-in-parallel-with-sessions
  - https://code.claude.com/docs/en/desktop#organize-and-find-sessions
  - https://code.claude.com/docs/en/desktop#archive-a-session
  - https://code.claude.com/docs/en/desktop#keyboard-shortcuts
  - https://code.claude.com/docs/en/agent-view
related: [A01, A04, DG03]
---

A session is one independent conversation with its own history, project folder, context and changes. The sidebar is where you start, switch, group, rename and archive sessions. Pinning and searching the sidebar exist in the app but are not in the docs, so they appear below as observations.

## When to Use It

Use this page when you run more than one piece of work at a time, or when the session list gets long enough that you lose track. If you are deciding whether a follow-up belongs in the current session or a new one, read [New Session or Continue](../decision-guides/new-session-or-continue.md) after this page.

## How It Works

A session moves through the stages below. At the outlined stage, the permission mode decides how often Claude stops to ask you.

{{diagram:session-lifecycle}}

Every session tracks its own context and changes independently. That is what makes parallel work possible, and it is also why a long-lived session can drift from what you now want. Two sessions that work in the same folder still edit the same files on disk, which is the problem worktrees solve.

| Task | How |
|---|---|
| Start a session | Click + New in the sidebar, or press `Cmd+N` |
| Move between sessions | Click one, or press `Ctrl+Tab` and `Ctrl+Shift+Tab` to cycle. `Cmd+Shift+]` and `Cmd+Shift+[` also move to the next and previous session |
| Close a session | `Cmd+W` |
| Rename a session | Open it and click the session title in the title bar |
| Group and sort | Hover over a heading in the session list and click the Group and sort icon |
| Archive a session | Hover over it in the sidebar, open its menu and select Archive |
| Find archived sessions | In the Group and sort menu, select View all, the last row, then open the Archived tab |
| Bring one back | Open it from the Archived tab and select Unarchive |
| Archive automatically | Turn on Auto-archive after PR merge or close in Settings > Claude Code |

In the earlier layout, the Filter icon shows without hovering. Click it to arrange the list with Group by or Sort by. To show archived sessions there, select Status, then Archived. [The tour](tour-of-the-code-tab.md) explains how to tell which layout you have.

Auto-archive does not touch cloud sessions or sessions that are still running. The desktop app also sends an operating system notification when a session finishes a task while you are not viewing it.

A session started from the CLI is not in the sidebar. To continue one in the app, type `/resume` in a local session. Desktop lists the sessions you started from the CLI on this computer, lets you search them by title, folder or branch, and continues the same session rather than a copy.

> **Observed in the app**
> The sidebar also lets you pin sessions and search the session list. The docs do not describe either feature for the Code tab, so this page gives no control names or positions, and both may change. The only pinning the docs describe is in agent view, a CLI screen opened with `claude agents` that is a research preview. Pin and unpin there is `Ctrl+T`. That key belongs to agent view, and the docs give no key for the desktop sidebar. Look in the sidebar and in a session's menu to find the desktop controls.

## Worked Example

You are working on Trail Notes and have three jobs: understand the code, fix the case-sensitive search, and later add tags.

1. Start a session for each job with + New, and give each a short name by clicking the title: `explain`, `search-fix` and `tags`.
2. Note which folder each session uses. `explain` can share a folder with the others because it only reads. `search-fix` and `tags` both edit files, so give them separate copies or worktrees. [Worktrees and Branches in the App](worktrees-and-branches-in-the-app.md) and [Parallel Sessions Without Collisions](../workflow/parallel-sessions-without-collisions.md) explain how.
3. Use `Ctrl+Tab` to hop between them while Claude works in the background.
4. When the search fix is merged, archive `search-fix` from its menu. Check first that nothing uncommitted is left in it.

Short names are what you scan later, so rename a session early.

## Pitfalls

- Archiving a session whose worktree has uncommitted changes can lose them. If Desktop asks, Archive anyway discards the changes. Commit what you want to keep first. In a worktree session, untracked files can be deleted without a question when a pull request Claude opened in the session merges.
- If the worktree stays on disk, Desktop removes the worktree and its changes about 30 days after the session is archived or you last open it, whichever is later. To keep the work, open the session from the Archived tab and select Unarchive.
- Long sessions fill their context window. Check the Context card in the session details panel, and start a fresh session instead of stretching one past its useful life.
- When you ask Claude about your other sessions, it sees only the sessions the desktop app runs itself: local, SSH and WSL sessions in the Code tab. It does not see cloud sessions or sessions started from the terminal. [Split View, Side Chat and Side Sessions](split-view-side-chat-and-side-sessions.md) covers this.
- Mixed-up sessions are a naming problem more often than a tool problem. Rename early.

## Checkpoint

Which two shortcuts start a session and cycle through sessions, and where do you find a session you archived last week?

<details><summary>Show the answer</summary>
`Cmd+N` starts a session and `Ctrl+Tab` (with `Ctrl+Shift+Tab` for the reverse) cycles through them. Archived sessions are under View all in the Group and sort menu, then the Archived tab. From there you can open one and select Unarchive.
</details>
