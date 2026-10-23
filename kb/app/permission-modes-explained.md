---
title: Permission Modes Explained
id: A05
area: app
level: 1
time: 8
tags: [permissions, auto-mode]
verified: 2026-10-22
status: verified
sources:
  - https://code.claude.com/docs/en/desktop#choose-a-permission-mode
  - https://code.claude.com/docs/en/permission-modes
related: [DG01, D02, W05]
---

A permission mode sets what Claude can do in a session without asking you first. The desktop app offers five: Manual, Accept edits, Plan, Auto and Bypass permissions. You switch with the mode selector in the row under the prompt box, at any point in a session.

## When to Use It

Read this page before your first real task, when prompts interrupt you too often, or when you want Claude to work longer without you. For a quick choice between modes, use [Which Permission Mode](../decision-guides/which-permission-mode.md).

## How It Works

The mode selector sits in the row under the prompt box, in the same row as the model picker. `Cmd+Shift+M` opens the permission mode menu. A mode you pick is remembered per folder and takes precedence over any default for that folder. Plan is the exception: it applies to the current session only. To set a default for new local sessions, add `permissions.defaultMode` to a settings file, because the app reads the same settings files as the CLI.

| Mode | Settings key | What runs without asking | Fits |
|---|---|---|---|
| Manual | `default` | Reads only. Claude shows a diff and you accept or reject each change | Sensitive work, unfamiliar code |
| Accept edits | `acceptEdits` | Reads, file edits and common filesystem commands such as `mkdir`, `touch` and `mv`. Other terminal commands still ask | Code you will review in the diff afterward |
| Plan | `plan` | Reads and exploring commands. Claude proposes a plan without editing your source | Complex tasks where you want to approve the approach first |
| Auto | `auto` | Everything, with a background classifier checking actions such as shell commands and network requests | Long tasks, fewer interruptions |
| Bypass permissions | `bypassPermissions` | Everything except the actions no mode auto-approves | Sandboxed containers or VMs only |

Earlier versions of the Code tab labeled the first three Ask permissions, Auto accept edits and Plan mode. A sixth mode, `dontAsk`, exists only in the CLI.

### Auto Mode

In Auto, a separate classifier model reviews actions before they run. It blocks anything that goes beyond your request, targets infrastructure it does not recognize, or looks driven by hostile content Claude read. Examples blocked by default include downloading and running code with `curl | bash`, force pushes, production deploys and migrations, and `git reset --hard`. If the classifier blocks an action 3 times in a row or 20 times in total, Auto pauses and prompts you again.

Auto appears in the selector only when it is available. It needs Opus 4.6 or later, Sonnet 4.6 or later, Haiku 5.5, or a Fable model. An organization administrator can turn it off with the `disableAutoMode` key in managed settings. The Settings screen has no separate toggle for it.

If you tell Claude in the conversation "don't push" or "wait until I review", the classifier treats that as a block signal. The classifier re-reads the transcript each time, so compaction can remove the message. For a hard guarantee, add a deny rule instead.

### Bypass Permissions

This mode appears in the selector only after you enable it. On Pro and Max plans, turn on "Allow bypass permissions mode" in Settings > Claude Code. On Team and Enterprise plans there is no toggle, and organization policy decides. It equals `--dangerously-skip-permissions` in the CLI. Some actions still prompt, such as those the permission-modes page lists under "actions no mode auto-approves".

### Other Rules That Still Apply

Cloud sessions offer Accept edits, Plan and Auto. Permission rules in your settings files apply to desktop sessions, and deny rules block in every mode, including Bypass permissions. Writes to protected paths such as `.git` and `.claude` prompt in Manual and Accept edits, and go to the classifier in Auto.

> **Terminal tip**
> In the CLI, `claude` starts a session in the folder you are in, and `--permission-mode` picks the starting mode. This command starts in Plan: `claude --permission-mode plan`. In the terminal, Shift+Tab cycles modes. In the desktop app it does not, so use the selector.

## Worked Example

Fix Trail Notes' case-sensitive search in three modes.

1. Choose Plan in the selector and send:

   ```prompt
   searchNotes in notes.js matches case-sensitively, so checks/search.check.mjs fails. Propose a fix as a plan. Do not edit any files.
   ```

2. Read the plan. Ask for changes if it touches more than `notes.js`. When you approve it, switch to Accept edits.
3. Tell Claude to carry out the plan. It edits `notes.js` without asking. Open the Changes pane to review the diff.
4. Ask Claude to run `node checks/run.mjs`. In Accept edits this still prompts, because it is a terminal command. In Auto, the classifier would review it instead.

In the author's four weeks of use, prompts ran in Auto 6,220 times, in Manual 67 times and in Accept edits 16 times. Plan was never entered. The author pairs Auto with other layers: a hook that blocks destructive git commands, short rules files, and CI that repeats the checks. See [Hooks: Guardrails and Warnings](../workflow/hooks-guardrails-and-warnings.md). If you have none of those yet, start in Manual or Accept edits and tune prompts with [Permission Tuning for Fewer Prompts](../workflow/permission-tuning-for-fewer-prompts.md).

## Pitfalls

- Auto reduces prompts. It does not guarantee safety, so use it for work whose direction you trust. [Plan Mode: Think Before You Edit](../development/plan-mode-think-before-you-edit.md) is the cheaper way to check direction first.
- Bypass permissions removes the checks. The docs say to use it only in sandboxed containers or VMs, and it gives no protection against prompt injection.
- Auto missing from the selector means auto mode is not available to you. Check the model against the list above, then ask your administrator.
- Plan does not stay selected for the next session.
- A spoken boundary is not a rule. Put limits you cannot lose in a deny rule.

## Checkpoint

1. Which mode edits files without asking but still asks before most terminal commands?
2. You told Claude in Auto mode "do not push until I say so". Why is a deny rule safer?

<details><summary>Show the answer</summary>
1. Accept edits.
2. The classifier reads your boundary from the transcript each time. If compaction removes the message, the boundary is gone. A deny rule lives in settings, not in the conversation, so it holds whatever the conversation still contains.
</details>
