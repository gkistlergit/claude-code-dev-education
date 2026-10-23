---
title: Resume and Continue
id: T03
area: terminal
level: 1
time: 6
tags: [terminal, resume]
verified: 2026-10-22
status: verified
sources:
  - https://code.claude.com/docs/en/cli-reference
  - https://code.claude.com/docs/en/commands
  - https://code.claude.com/docs/en/sessions
  - https://code.claude.com/docs/en/desktop
related: [T02, W09, A03]
---

Claude Code saves every conversation locally, so you can close Terminal and pick the work up later. `claude -c` reopens the latest session, `claude -r` picks one, `/resume` switches inside a session, and `--fork-session` branches a copy.

## When to Use It

Use these when a task spans more than one sitting, when you ran `/clear` and want the earlier conversation back, or when you want to try a second approach without losing the first. In the desktop app you click a session in the sidebar instead. See [Sessions and the Sidebar](../app/sessions-and-the-sidebar.md).

## Decision Table

| You want to | Run | Notes |
| :- | :- | :- |
| Reopen the latest conversation in this folder | `claude -c` | Also written `--continue`. If the folder has no session, it prints `No conversation found to continue` and exits. |
| Choose from a list | `claude -r` | Also written `--resume`. Opens the session picker. |
| Open a named session | `claude -r fix-search` | Resumes directly when the name matches one session. A name that matches several opens the picker with the name pre-filled. |
| Open a session by its ID | `claude --resume <session-id>` | Works from any folder. Claude Code searches the current project and its worktrees first, then every other project on the machine. |
| Find the session behind a pull request | `claude --from-pr 123` | Opens the picker filtered to sessions linked to that pull request number. |
| Switch sessions from inside a session | `/resume` or `/resume <name>` | `/resume` alone opens the picker. |
| Try a different direction and keep the original | `claude --continue --fork-session`, or `/branch` inside a session | The copy gets its own session ID. The original stays in the picker. |
| Name a session so you can find it | `claude -n fix-search`, or `/rename fix-search` | Unnamed sessions get a generated title that also works as a resume handle. |

Replace `fix-search` with your own session name and `123` with your own pull request number.

### The session picker

`claude -r` and `/resume` open the same picker. Each row shows the name or generated title, time since last activity, git branch and file size.

| Key | Action |
| :- | :- |
| Enter | Resume the highlighted session |
| Space | Preview the session |
| `/` | Start a search |
| Ctrl+R | Rename the highlighted session |
| Ctrl+W | Widen to all worktrees of this repository |
| Ctrl+A | Widen to every project on this machine |
| Ctrl+B | Show only sessions from the current git branch |
| Esc | Leave the picker |

### What comes back

A resumed session restores the conversation, the model it was using and, in a terminal resume without `-p`, the permission mode it was in, with exceptions the sessions page lists. It does not restore every launch flag. Pass `--mcp-config`, `--settings`, `--plugin-dir`, `--fallback-model` and `--add-dir` again when you resume.

> **Terminal tip**
> `/branch` and `/fork` sound alike. `/branch` copies the conversation and switches you into the copy. `/fork` copies it into a new background session and leaves you where you are.

### In the desktop app

Type `/resume` in the prompt box of a local session. The app lists sessions you started from the CLI on this computer, and you can search by title, folder or branch. The app continues the same session rather than a copy, so `claude --resume` in Terminal still finds it. SSH, WSL and cloud sessions do not offer this.

## Worked Example

You are fixing the Trail Notes search bug. Start a named session, work, then leave with `/exit`:

```terminal
cd ~/trail-notes
claude -n fix-search
```

The next morning, `cd` back into the folder and resume by name:

```terminal
cd ~/trail-notes
claude --resume fix-search
```

The earlier conversation reopens and you continue it. Say the first approach, a quick case-folding patch, feels shaky. Resume a copy and try a different one while the original stays intact:

```terminal
claude --resume fix-search --fork-session
```

If you forget the name later, open the picker, or reopen whatever you used last in this folder:

```terminal
claude -r
claude -c
```

`claude -r` lists both rows, so you can compare the two approaches and go back to either. `claude -c` skips the list and reopens the latest session.

## Pitfalls

- `claude -c` looks only at the folder you are in. Run `pwd` first if it opens nothing.
- Sessions created with `claude -p` or the Agent SDK stay out of the picker and out of `claude -c`. Resume one by passing its ID to `claude --resume`.
- The default display name for an unnamed session, a folder name plus two characters, is not a resume handle. The generated title and any name you set are.
- Resuming the same session in two terminals without forking interleaves both into one transcript.
- After a long break, Claude Code may show a "Resume this conversation?" dialog with an estimate of how much of your 5-hour usage limit the saved conversation would use. Choose Resume to keep the history, or start a new conversation when the next task does not need it.
- `/clear` does not delete anything. The previous session stays stored and `/resume` brings it back.

## Checkpoint

1. You closed Terminal yesterday. Which command reopens the latest session in the current folder, and which reopens one you named `fix-search`?
2. What does `--fork-session` change when you resume?

<details><summary>Show the answer</summary>

1. `claude -c` (or `--continue`) reopens the latest session in the current folder. `claude -r fix-search` (or `--resume fix-search`) reopens the named one.
2. It creates a new session ID instead of reusing the original, so the resumed copy can diverge while the original stays unchanged in the picker.

</details>
