---
title: Split View, Side Chat and Side Sessions
id: A10
area: app
level: 3
time: 8
tags: [split-view, side-chat, parallel]
verified: 2026-10-22
status: verified
sources:
  - https://code.claude.com/docs/en/desktop#work-in-parallel-with-sessions
  - https://code.claude.com/docs/en/desktop#ask-a-side-question-without-derailing-the-session
  - https://code.claude.com/docs/en/desktop#start-a-task-that-claude-suggests
  - https://code.claude.com/docs/en/desktop#work-across-sessions
  - https://code.claude.com/docs/en/desktop#keyboard-shortcuts
related: [W08, W09, O04]
---

The desktop app has four ways to handle more than one thing at once: show two sessions side by side, ask a side chat that leaves the main thread alone, start a task Claude suggests in its own session, and ask Claude to look after your other sessions. This page covers when each one fits and what each one does not save or see.

## When to Use It

Use split view when you need to watch or compare two sessions. Use a side chat for a quick question that should not steer the main session. Use a suggested task when Claude spots work outside your current task. Ask Claude to work across sessions when you have enough of them that you want help finding or tidying them.

## How It Works

| You want to | Use | Open it with |
|---|---|---|
| See two sessions together | Split view | Hold `Option` and click a session in the sidebar, or right-click it and choose Open in, then Split view |
| Give one session its own window | New window | Hold `Cmd` and click a session, or right-click it and choose Open in, then New window |
| Ask without touching the main thread | Side chat | `Cmd+;` or `/btw` |
| Hand off work Claude spotted | Suggested task | The buttons on the suggestion card |
| Check on or tidy other sessions | Work across sessions | Ask Claude in plain language |

On Windows, use Alt for Option, Ctrl for Cmd, and `Ctrl+;` for the side chat.

### Split View

In a split view, the pane you opened or clicked last has focus and the other pane is dimmed. To change which session a pane shows, click in that pane to give it focus, then click a session in the sidebar. Press `Cmd+Ctrl+W` to take the focused session out of the split view.

### Side Chat

A side chat asks Claude a question that uses your session's context but adds nothing back to the main conversation. It can read everything in the main thread up to that point. Close it when you are done and carry on in the main session. Side chats are available in local, SSH and WSL sessions. The desktop app does not save them to disk, so you cannot return to one after you close the app.

### Suggested Tasks

When Claude notices something worth fixing outside your current task, it can suggest it as a task. In local and SSH sessions on the current layout, the suggestion is a card in the chat with these buttons:

- Start runs the task in another session. By default it uses the current session's environment. The card then shows the started session's state, and the sidebar lists that session under the current one.
- Do it here sends the task to the current session as a message.
- Options lets you review or change the environment, model, worktree and permissions before you click Start.
- Start all appears when the card lists several tasks, and starts each in its own session without waiting for the previous one.

In cloud sessions, and in local and SSH sessions on the earlier layout, the suggestion is a Suggested task card instead. Its main button names the action, such as Send to cloud or Start with worktree. The caret beside it offers other ways to start, including Do it here.

### Working Across Sessions

Claude can list your other Code tab sessions, read what each has been doing, and send messages between them. You can also ask it to rename or archive a session. Ask in plain language:

```prompt
Which of my other sessions has touched notes.js, and what did it conclude?
```

Claude sees only sessions that the desktop app itself runs: local, SSH and WSL sessions in the Code tab. It does not see cloud sessions, or sessions started from the terminal CLI or the VS Code extension. By default it sees the 20 most recently active sessions, skips archived ones unless you ask, and never lists the session you are asking from.

A message from another session arrives as a card labeled with the sender's title and a link back. If the receiving session is mid-task, the message is held until the current work finishes. Claude cannot deliver to an archived session and tells you when a message fails.

## Worked Example

In the Trail Notes `search-fix` session, Claude notices that `removeNote` is missing a check.

1. A suggestion card appears. Click Options, turn on Worktree, then click Start. The new session works in its own worktree, and the sidebar lists it under `search-fix`.
2. In `search-fix`, press `Cmd+;` and ask:

   ```prompt
   In one sentence, what does sortNotes do?
   ```

   The answer comes from the project, and the main conversation gains nothing. Close the side chat.
3. Later, ask in any session: "Archive the sessions whose pull requests have merged." In Manual mode Claude shows an approval card first.

The author started 217 side sessions from within other sessions in about four weeks. Side sessions that edit the same project need isolation, so see [Worktrees and Branches in the App](worktrees-and-branches-in-the-app.md) and [Parallel Sessions Without Collisions](../workflow/parallel-sessions-without-collisions.md). In the author's setup, heavy reading goes to a custom read-only subagent instead of a side session. See [Delegating to Subagents](../optimization/delegating-to-subagents.md).

## Pitfalls

- A side chat is gone when the app closes. Copy any answer you need into the main session first.
- Start uses the current session's environment by default. If both sessions edit the same files, use Options to turn on a worktree.
- Claude does not see cloud sessions or terminal sessions. Do not ask it to summarize them.
- In Auto and Bypass permissions modes, Claude can archive a session without an approval card. To be asked, switch to Manual.
- In a split view, the session you click in the sidebar goes into the focused pane. Click the pane you want to change first.
- For handing a long piece of work to a fresh session, see [Handoffs Between Sessions and Devices](../workflow/handoffs-between-sessions-and-devices.md).

## Checkpoint

1. Which shortcut takes the focused session out of a split view?
2. A side chat answered your question and you closed the app. Can you reopen it?

<details><summary>Show the answer</summary>
1. `Cmd+Ctrl+W` on macOS (`Ctrl+Alt+W` on Windows).
2. No. The desktop app does not save side chats to disk, so you cannot return to one after you close the app.
</details>
