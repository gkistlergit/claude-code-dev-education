---
title: Core Flags and Modes
id: T02
area: terminal
level: 1
time: 7
tags: [terminal, flags]
verified: 2026-10-23
status: verified
sources:
  - https://code.claude.com/docs/en/cli-reference
  - https://code.claude.com/docs/en/permission-modes
  - https://code.claude.com/docs/en/desktop
  - https://code.claude.com/docs/en/worktrees
related: [T03, D02, A05]
---

A flag is an option you add after `claude` to change how that one session starts. This page covers eight that matter most, all printed by `claude --help` on the build checked for this course, and shows the matching control in the desktop app.

## When to Use It

Use flags when you start Claude Code from Terminal and want a session to begin with a particular model, effort level, permission mode, name, folder set or worktree. In the desktop app you pick the same things with controls under the prompt box, so you only need flags if you work in Terminal.

## How It Works

Type `claude`, then any flags, then optionally a prompt in quotes. The flags apply to that session only.

| Flag | What it does | Example | In the desktop app |
| :- | :- | :- | :- |
| `--model <name>` | Sets the model for this session. Takes an alias such as `sonnet` or `opus`, or a model's full name. | `claude --model sonnet` | Model picker, or Cmd+Shift+I |
| `--effort <level>` | Sets reasoning effort: `low`, `medium`, `high`, `xhigh` or `max`. Available levels depend on the model. It does not persist. | `claude --effort high` | Effort menu, or Cmd+Shift+E |
| `--permission-mode <mode>` | Starts in a permission mode: `manual`, `acceptEdits`, `plan`, `auto`, `dontAsk` or `bypassPermissions`. | `claude --permission-mode plan` | Mode selector under the prompt box, or Cmd+Shift+M |
| `--name <name>` or `-n` | Names the session. The name shows in the prompt box, the `/resume` picker and the terminal title. | `claude -n fix-search` | Click the session title in the title bar |
| `-c` or `--continue` | Continues the most recent conversation in the current folder. | `claude -c` | Click a session in the sidebar |
| `-r` or `--resume` | Resumes a session by ID or name, or opens a picker. | `claude -r fix-search` | Click a session in the sidebar |
| `-w` or `--worktree [name]` | Starts the session in a new git worktree under `.claude/worktrees/<name>`. | `claude -w try-tags` | The **Worktree** toggle |
| `--add-dir <folders>` | Lets Claude read and edit files in extra folders. | `claude --add-dir ../shared` | **+** next to the prompt box, then **Add folder** |

`-c` and `-r` get their own article: [Resume and Continue](resume-and-continue.md).

Flags combine. This command starts a named session in plan mode on a chosen model:

```terminal
claude --model opus --permission-mode plan -n parser-rewrite
```

Each part is one flag with its value. `claude` itself starts the session in the folder you are in, so run `cd` into the project first ([Install and Update](install-and-update.md) explains `cd`).

### The permission modes

The mode names match the desktop app's selector. `manual` is the mode the app labels Manual, where Claude asks before it edits files or runs commands. `acceptEdits` approves file edits and common filesystem commands. `plan` lets Claude read and propose without editing your source. `auto` has a separate classifier review actions instead of you. `dontAsk` is a terminal-only mode that denies anything that would prompt unless you pre-approved it. `bypassPermissions` skips prompts and belongs in an isolated container or virtual machine only. [Permission Modes Explained](../app/permission-modes-explained.md) compares them.

> **Terminal tip**
> Inside a running terminal session, Shift+Tab cycles through permission modes, and the status bar shows `⏸ plan mode on` while plan mode is active. The desktop app does not use Shift+Tab for this; use its mode selector or Cmd+Shift+M.
>
> ```terminal
> claude --help
> ```
>
> `claude --help` prints the options and commands your installed build lists. This course teaches only flags that appear there, even though the CLI reference documents a few more.

## Worked Example

Trail Notes ships with one seeded bug: `searchNotes` matches case-sensitively, so `checks/search.check.mjs` fails. Ask Claude to diagnose it without touching any file:

```terminal
cd ~/trail-notes
claude --permission-mode plan --model sonnet -n fix-search
```

```prompt
Why does checks/search.check.mjs fail? Read notes.js and propose a fix. Do not edit anything yet.
```

Claude should point at `searchNotes` in `notes.js` and propose matching the title and body without regard to case. In plan mode it presents a plan and asks how to proceed before it edits anything. Reading the plan first is the point of the mode.

## Pitfalls

- The built-in starting mode for a new terminal session is `auto` on Claude Code 2.1.283 or later, when auto mode is available to your account and model. A session with no flag may therefore ask less than you expect. Pass `--permission-mode manual` to review every action.
- `bypassPermissions`, and the matching `--dangerously-skip-permissions` flag, skip the safety prompts. The docs advise using them only in sandboxes with no internet access.
- `-w` works in a git repository. Make a first commit before you use it, because the worktree needs a branch to start from. A fresh `git init` has no commits. The docs do not say what `-w` does in a repository with none, and this was not tested.
- `--add-dir` grants file access to the folders. The docs say it does not load most `.claude/` configuration from them.
- Flags last for one session. Anything you want every time belongs in a settings file or a [CLAUDE.md](../workflow/a-claude-md-that-earns-its-keep.md).
- The CLI reference documents some flags that `claude --help` does not print on this build. This page teaches only the ones that are printed.

## Checkpoint

1. Which command starts Claude in plan mode, and what does plan mode hold back until you approve?
2. You want a second session on the same repository that cannot collide with the first one's edits. Which flag do you add?

<details><summary>Show the answer</summary>

1. `claude --permission-mode plan`. Claude reads files and proposes a plan, and it makes no edits to your source until you approve the plan.
2. `-w` (or `--worktree`) with an optional name. It starts the session in its own git worktree on a new branch, so its edits stay separate.

</details>
