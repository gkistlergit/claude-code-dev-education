---
title: Remote Control and Cloud Sessions
id: A11
area: app
level: 3
time: 8
tags: [remote-control, cloud]
verified: 2026-10-23
status: verified
sources:
  - https://code.claude.com/docs/en/remote-control
  - https://code.claude.com/docs/en/desktop#run-long-running-tasks-in-the-cloud
  - https://code.claude.com/docs/en/desktop#continue-in-another-surface
  - https://code.claude.com/docs/en/desktop#control-which-sessions-appear-on-your-other-devices
  - https://code.claude.com/docs/en/claude-code-on-the-web
  - https://code.claude.com/docs/en/permission-modes
related: [W09, W11, A04]
---

Remote Control lets you steer a session that runs on your computer from claude.ai or the Claude mobile app. A cloud session runs on cloud infrastructure and keeps going after you close the app. Both appear in the claude.ai/code interface, and they fit different situations.

## When to Use It

Use Remote Control when you are partway through local work and want to continue from another device. Use a cloud session when you want to start a task with no local setup, work on a repository you have not cloned, or run several tasks in parallel.

## Decision Table

| Question | Remote Control | Cloud session |
|---|---|---|
| Where does Claude run? | On your computer | On cloud infrastructure, Anthropic-managed by default |
| Does it need your computer on? | Yes. The local process must keep running | No. It continues if you close the app or shut down your computer |
| Local files, tools and MCP servers? | Yes, all stay available | No. It works on your repositories and a cloud environment |
| Needs a GitHub repository? | No | Cloning and pull requests require GitHub |
| Permission modes | The local session's modes. From claude.ai or the mobile app: Manual, Accept edits, Plan, Auto, with no way to select Bypass permissions | Accept edits, Plan, Auto. No Bypass permissions |
| Files pane | Editable in a local session | View-only |
| Plans | Pro, Max, Team, Enterprise. API keys are not supported | Pro, Max, Team, and some Enterprise seats |

### Turn On Remote Control

1. **Type** `/remote-control` (or `/rc`) in the prompt box of a local session, or use the session's Remote Control switch in the Environment card of the session details panel.
2. **Open** claude.ai/code or the Claude app and find the session in the list. A Remote Control session shows a computer icon with a green status dot when it is online.
3. **Disconnect** by running `/remote-control` again, or by turning off the switch.

To connect every new Desktop session automatically, turn on Connect new sessions to Remote Control in Settings > Claude Code. A connected session appears on all devices signed in to your account. To hide one, archive it in Desktop. To stop sessions connecting at all on this computer, including CLI sessions, set `disableRemoteControl` to `true` in your user settings.

Claude keeps running on your machine, so your files and tools stay there. The connection makes outbound HTTPS requests only. While it is connected, the session transcript is stored on Anthropic's servers to keep your devices in sync. Organizations with Zero Data Retention or the HIPAA configuration cannot enable Remote Control. From a phone or browser, terminal-only commands such as `/plugin` and `/resume` do not work. Run them on the machine itself.

Trusted Devices is a beta feature on top of Remote Control. When it is on, you need an enrolled device and a sign-in no more than 18 hours old to view or steer a Remote Control session. It is off by default. On Pro and Max, you turn on Require trusted devices yourself in your settings.

### Start a Cloud Session

1. **Choose** a Cloud environment in the environment selector, the first control in the row under the prompt box. Pick the repositories in the same row once you select a cloud environment. Cloud sessions need GitHub access to clone code and push branches.
2. **Send** your first message. In a cloud session, `@` lists files only after that first message.
3. **Check back** at claude.ai/code or in the mobile app. You can steer Claude in a different direction at any time.

Cloud sessions count toward your plan limits, with no separate compute charge. To move a running session to the cloud, open the session menu from the caret beside the title or the session's row in the sidebar, then select Open in and Cloud. Your conversation carries over as a summary, and the dialog tells you whether your files move and whether the original session is archived. You cannot move an SSH or WSL session this way.

> **Terminal tip**
> A cloud session can create branches that do not exist on your computer. Copy the branch name from the session, then run these two commands. `git fetch origin <branch-name>` downloads that branch from the remote called origin. `git checkout <branch-name>` switches to it.
>
> ```terminal
> git fetch origin <branch-name>
> git checkout <branch-name>
> ```

## Worked Example

Two situations with Trail Notes.

You start a session that fixes `searchNotes`, then need to leave. Type `/remote-control` before you go, and open claude.ai/code on your phone. You can read progress and reply. Your computer must stay on and the app must keep running. If you quit the app or stop the process, the session goes offline until you bring it back.

Later, you want Claude to add tags while your laptop is shut for the night. Your copy of Trail Notes exists only as a folder on your laptop, so a cloud session started from the app has nothing to clone. Push the project to a GitHub repository first. Then start a cloud session with that repository selected, send the task, and check in the morning. Claude works in the cloud environment, and your laptop can stay closed.

The author rarely used either feature. Over about four weeks, 11 sessions came from Remote Control and 1 from the cloud, out of 498 top-level sessions. The course covers both because they fill a gap in that setup. See [Handoffs Between Sessions and Devices](../workflow/handoffs-between-sessions-and-devices.md) and [Scheduled Tasks and Loops](../workflow/scheduled-tasks-and-loops.md) for recurring or unattended work.

## Pitfalls

- A Remote Control session goes offline when the app or process stops. Sleep and brief network loss are handled, since Claude Code reconnects when the machine is back online.
- Auto-connect makes every new session visible on your other devices. Switch it off if that is not what you want.
- A cloud session does not read your personal skills folder, and plugins installed from the desktop app are not available in it.
- Cloud sessions share rate limits with the rest of your Claude and Claude Code use, so several in parallel use more of your plan.
- Cloud sessions work from GitHub repositories. A project on another host or only on disk needs a different route.
- [Choosing a Project Folder](choosing-a-project-folder.md) covers the Local, Cloud and SSH choice at session start.

## Checkpoint

You need a long refactor to continue while your laptop is shut for the night. Remote Control or a cloud session?

<details><summary>Show the answer</summary>
A cloud session. A Remote Control session runs on your computer, so it stops when the local process stops. A cloud session continues if you close the app or shut down your computer, provided the repository is on GitHub.
</details>
