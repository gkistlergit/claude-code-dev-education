---
title: The Panes: Changes, Files, Terminal, Browser, Tasks
id: A06
area: app
level: 1
time: 8
tags: [panes, browser, terminal, diff]
verified: 2026-10-23
status: verified
sources:
  - https://code.claude.com/docs/en/desktop#arrange-your-workspace
  - https://code.claude.com/docs/en/desktop#review-changes-with-diff-view
  - https://code.claude.com/docs/en/desktop#open-and-edit-files
  - https://code.claude.com/docs/en/desktop#run-commands-in-the-terminal
  - https://code.claude.com/docs/en/desktop#watch-background-tasks
  - https://code.claude.com/docs/en/desktop#preview-your-app
  - https://code.claude.com/docs/en/desktop#keyboard-shortcuts
  - https://code.claude.com/docs/en/desktop-ios-simulator
  - https://code.claude.com/docs/en/computer-use
related: [D03, P07, A01]
---

The Code tab is built from panes you can arrange in any layout: chat, diff, browser, terminal, file, plan, tasks and subagent, plus an iOS Simulator pane on macOS. This page says what each pane is for, how to open it, and where its limits are.

## When to Use It

Use this page when you want to review a change, run a command, watch your app or follow background work without leaving the session. The panes keep those next to the conversation, so Claude and you look at the same files.

## How It Works

To open a pane, click its icon button in the session's title bar. Hover over a button to see its name. Buttons that do not fit, and panes with no button, are in the ⋮ menu beside them. Drag a pane by its header to move it, or drag an edge to resize it. `Cmd+\` closes the focused pane. You can pop a pane such as the diff or terminal out into its own window and dock it back later, and Claude keeps working in the main window. The docs do not name the control that pops a pane out. This layout needs Claude Desktop v1.2581.0 or later.

| Pane | How to open it | What it does |
|---|---|---|
| Changes | Changes button, the line counts such as `+12 -1` in the Changes card, or `Cmd+Shift+D` | Shows the diff file by file |
| Files | Files button, or click a file path in the chat | Opens and edits files |
| Terminal | Terminal button, or `` Ctrl+` `` | A shell in the session's working directory |
| Browser | Browser button, or `Cmd+Shift+B` | Shows your running app and other sites |
| Background tasks | ⋮ menu, once the session has background work | Lists subagents, background shell commands and dynamic workflows |
| Subagent | Click an entry in Background tasks | Shows that entry's output, with a way to stop it |
| Plan | ⋮ menu, once the session has something to show | See the callout below |
| iOS Simulator | The iOS Simulator button, or it opens by itself | Shows your app in Apple's simulator |

### Changes

Click any line in the diff to open a comment box, type your feedback and press Enter. After commenting on several lines, press `Cmd+Enter` to submit them all. Claude reads the comments and makes the changes, which appear as a new diff. If you run `/code-review`, the findings arrive as a Code review card. Walk through in diff steps through them one at a time, where each finding offers Fix this one or can be dismissed, and Apply fixes asks Claude to fix the open ones. See [Reading and Reviewing Diffs](../development/reading-and-reviewing-diffs.md).

### Files and Terminal

In a local session you can edit files inside the working directory, except some view-only ones such as `.mcp.json` and `.claude/settings.json`. In cloud, SSH and WSL sessions the Files pane is view-only. Edits save on their own unless you uncheck Auto save in the pane's ⋮ menu, after which you click Save or Cancel.

The terminal shares Claude's environment, so `npm test` or `git status` there sees the same files Claude edits. Click + in the terminal header for a second tab, or right-click a folder in the chat and choose Open in terminal. It is available in local and SSH sessions.

### Browser

Claude can start a dev server and open the result in the Browser pane to check its own changes. In a local session, click an HTML, PDF or video path in the chat to open it there. The Dev servers menu in the pane header starts and stops servers. The Browser is also tabbed, so you can open external sites. It uses a clean profile with none of your saved logins. The first time Claude acts on an external site, a card asks you to choose Allow once, Always allow or Deny. `Cmd+Shift+S` selects an element in the Browser. Server setup is stored in `.claude/launch.json`. See [Preview, Ship and Maintain](../app-development/preview-ship-and-maintain.md).

### iOS Simulator and Computer Use

The iOS Simulator pane is in public beta, runs on macOS in local sessions only, and needs Xcode with the iOS platform installed. It opens when Claude builds or runs your app in a simulator. The first time Claude uses a device, the app asks you to allow it. Each device belongs to the session that launched it.

Computer use is a separate feature, labeled research preview. It lets Claude control apps on your screen, is off by default, needs a Pro or Max plan, and is enabled under Settings > This computer > System. The simulator pane does not need it. Claude tries more precise tools first: a connector, then Bash, then Claude in Chrome, and uses screen control last.

> **Observed in the app**
> The docs list a Plan pane and say it appears once the session has something to show. They do not describe it further. On 2026-10-23 a session with no plan showed the title Plan, "No plan yet" and "Claude writes the plan here as it explores. Keep chatting." After a Plan-mode run wrote its plan, the pane showed that file as formatted text, with copy buttons on code blocks and a line at the top: "You can comment on the plan in plan mode, or when Claude asks you to approve it." This may change between releases.

## Worked Example

Using Trail Notes:

1. Ask Claude to preview Trail Notes in the Browser pane, using the server setup from [Preview, Ship and Maintain](../app-development/preview-ship-and-maintain.md). Opening `index.html` straight from disk can show an empty page, because the app loads JavaScript modules and the starter README warns about that.
2. Open the Terminal pane and run `node checks/run.mjs`. Two checks in `search.check.mjs` fail.
3. Ask Claude to fix `searchNotes` so it matches title and body case-insensitively.
4. Open the Changes pane. Click a line in the `notes.js` diff, add a comment such as "keep this a pure function", and press `Cmd+Enter`.
5. Run the checks again in the Terminal pane.

> **Terminal tip**
> `node checks/run.mjs` starts Node, which runs the file `checks/run.mjs`. That runner runs the check files in the `checks/` folder.

## Pitfalls

- In an SSH session Claude cannot open your app in the Browser pane. Forward the port to your computer to look at it yourself.
- If the file changed on disk while you edited, the Files pane offers Override or Discard.
- With Auto save off, nothing is written until you click Save.
- Panes for Background tasks and Plan are missing from the ⋮ menu until the session has something to show in them.
- Some files are view-only in the Files pane even in a local session, such as `.mcp.json` and `.claude/settings.json`. Right-click the path and choose Open in to use an installed editor.

## Checkpoint

Which pane would you open to see what a background subagent printed, and how do you reach it?

<details><summary>Show the answer</summary>
Background tasks, from the ⋮ menu in the title bar once the session has background work. Click an entry to see its output in the subagent pane, where you can also stop it.
</details>
