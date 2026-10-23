---
title: Tour of the Code Tab
id: A01
area: app
level: 0
time: 6
tags: [desktop, orientation]
verified: 2026-10-23
status: verified
sources:
  - https://code.claude.com/docs/en/desktop#start-a-session
  - https://code.claude.com/docs/en/desktop#arrange-your-workspace
  - https://code.claude.com/docs/en/desktop#keyboard-shortcuts
  - https://code.claude.com/docs/en/desktop-quickstart
related: [A02, A03, A06]
---

The Code tab is the part of the Claude desktop app where Claude Code runs. This tour names each area of a session screen, says what it does, and points to the article that covers it in depth.

## When to Use It

Read this page the first time you open the Code tab, or when a later article names a control and you cannot find it. It sets up nothing. Installing and signing in are in [Install, Sign In and Your First Session](install-sign-in-and-your-first-session.md).

## How It Works

Each conversation in the Code tab is a session. A session has its own chat history and project folder, independent of every other session. A session screen has five areas.

### The Sidebar

The Code tab sits at the top of the app's sidebar. Below it, the sidebar lists your sessions and lets you run several in parallel. The + New button, or `Cmd+N`, starts another session. `Ctrl+Tab` and `Ctrl+Shift+Tab` move through the list. Two more sidebar items matter later: Customize, where connectors, skills and plugins live, and Projects, which can sit under More.

### The Conversation and the Prompt Box

The conversation shows Claude's replies, its tool calls and the changes it makes. Type in the prompt box and press Enter to send. Click the stop button to interrupt, or type a correction and press Enter to send it without stopping the running action. The + button next to the prompt box adds file attachments, skills, connectors and plugins. Type `@` followed by a filename to add a file to the context.

### The Row Under the Prompt Box

This row holds the controls you set before and during a session, from left to right:

- The environment selector is the first control. It picks where Claude runs.
- The project folder control sits next to it and picks the folder Claude works in.
- The permission mode selector sets how much Claude can do without asking.
- The model picker sits toward the right end. `Cmd+Shift+E` opens the effort menu. The usage ring beside the picker shows your plan usage.

### The Title Bar

The session title is in the title bar. Click it to rename the session. The caret beside the title opens the session menu, which has Transcript view and Open in. Icon buttons open panes. Hover over a button to see its name, such as Terminal, Changes, Browser or Files. Buttons that do not fit move into the ⋮ menu.

### The Session Details Panel

Once a session starts, a set of cards appears beside the chat when the window is wide enough. They show where the session runs, what it changed, what it is running and how full its context is. The Changes card shows line counts such as `+12 -1`. Click Hide session rail or Show session rail in the title bar to hide or show the panel.

### Where Each Topic Lives

| Area | What it does | Article |
|---|---|---|
| Sidebar | Lists, groups and archives sessions | [Sessions and the Sidebar](sessions-and-the-sidebar.md) |
| Project folder and environment | Sets what Claude can read and where it runs | [Choosing a Project Folder](choosing-a-project-folder.md) |
| Permission mode | Sets what runs without asking | [Permission Modes Explained](permission-modes-explained.md) |
| Panes | Changes, Files, Terminal, Browser, Tasks | [The Panes](the-panes.md) |
| Worktree toggle | Gives a session its own copy of the project | [Worktrees and Branches in the App](worktrees-and-branches-in-the-app.md) |
| Pull request status | Shows CI results and Auto-fix | [Pull Requests and Auto-fix](pull-requests-and-auto-fix.md) |
| Customize | Skills, plugins, connectors | [Customize: Skills, Plugins and Connectors](customize-skills-plugins-and-connectors.md) |

For keys, see the [desktop shortcuts cheatsheet](../../cheatsheets/desktop-shortcuts.md). `Cmd+/` shows all shortcuts inside the Code tab.

## Worked Example

Open a copy of the Trail Notes starter in the Code tab (the [first-session article](install-sign-in-and-your-first-session.md) shows how). Before you send anything, find these seven things:

1. The + New button in the sidebar.
2. The environment selector and the project folder control in the row under the prompt box.
3. The permission mode selector and the model picker in the same row.
4. The session title in the title bar.
5. The Terminal and Changes buttons in the title bar.
6. The ⋮ menu beside those buttons.
7. The usage ring beside the model picker.

Then type this in the prompt box and press Enter:

```prompt
/context
```

The command prints a per-category breakdown of the session's context window in the chat. Nothing in the project changes.

## Pitfalls

- No environment selector under the prompt box means you have the earlier layout. In that layout the environment and folder are above the prompt box. Select Claude > Check for Updates… in the menu bar to get the current layout.
- Some panes have no title bar button. Background tasks and Plan appear in the ⋮ menu only once the session has something to show in them.
- The session details panel does not appear when the chat is too narrow. Widen the window.
- Shift+Tab does not cycle permission modes in the Code tab as it does in the terminal. Use the mode selector or `Cmd+Shift+M`.
- The layout, terminal and file editor described here need a recent app version. The docs name Claude Desktop v1.2581.0 or later for the pane layout.

## Checkpoint

Where do you change the model and the permission mode for a running session?

<details><summary>Show the answer</summary>
Both are in the row under the prompt box. The model picker is toward the right end, and the permission mode selector is in the same row. You can change either one mid-session. `Cmd+Shift+I` opens the model menu and `Cmd+Shift+M` opens the permission mode menu.
</details>
