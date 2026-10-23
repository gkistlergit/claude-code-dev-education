---
title: Handoffs Between Sessions and Devices
id: W09
area: workflow
level: 3
time: 8
tags: [handoff, remote]
verified: 2026-10-23
status: verified
sources:
  - https://code.claude.com/docs/en/remote-control
  - https://code.claude.com/docs/en/commands
  - https://code.claude.com/docs/en/desktop
related: [O02, A11, R08]
---

There are two kinds of handoff. A handoff note carries your work into a fresh session with empty context. Remote Control keeps the same session and lets you steer it from another device. Pick by whether you want a clean context or the same conversation.

## When to Use It

Write a handoff note when a session has grown long, drifted, or is about to end, and the next session should start clean. The author ends long work this way and starts a fresh session, using a handoff skill 86 times in the audit period and `/compact` once. A hook warns at 70% and 90% of the context window and points to the skill (see [Hooks: Guardrails and Warnings](hooks-guardrails-and-warnings.md)). A rule says only the human starts the handoff. A note you wrote is easier to trust than an automatic summary.

Use Remote Control when you are mid-task on your own machine and want to continue from a phone or another browser.

## Decision Table

| You want to | Use | Notes from the docs |
|---|---|---|
| Start fresh with the work carried over | A handoff note, then `/clear` or **+ New** | `/clear` starts a new conversation with empty context. You can resume the old one later with `/resume` |
| Pick up a past session | The session in the sidebar, `/resume`, or `claude -r` in a terminal | `/resume` takes a session ID or name, or opens the picker. In the Code tab, `/resume` lists sessions you started from the CLI |
| Steer a running local session from a phone or browser | Remote Control: `/remote-control` or `/rc` | The session keeps running on your machine. Your computer must stay on and the `claude` process must keep running |
| Move a CLI session into the app | `/desktop` in the terminal | Needs macOS or x64 Windows and a Claude subscription |
| Continue as a cloud session | Session menu, **Open in**, **Cloud** | The conversation is carried over as a summary |
| Pull a cloud session into a terminal | `/teleport` | Needs a claude.ai subscription |
| Move work to another machine | A handoff note in a repository you can reach | Remote Control only helps while the first machine stays on |

### Writing the Note

The note holds the intent, the state, the decisions and the next steps, plus anything that was not verified. Ask for it in the session that has the context:

```prompt
Write a handoff note for a fresh session. Include the goal, the current state of the files and checks, decisions we made and why, what you did not verify, and the next steps in order. Save it to HANDOFF.md.
```

Read the note before you rely on it. Then start a new session and point it at the file. A fuller version is in the [handoff template](../../templates/handoff.md), and [Handoff Ledgers and Retros](../process/handoff-ledgers-and-retros.md) covers keeping a record over time.

### Using Remote Control

In a local Code tab session, type `/remote-control` or use the session's **Remote Control** switch. The session then appears in the session list at claude.ai/code and in the Claude app on devices signed in to your account. The docs require a Pro, Max, Team or Enterprise plan, and API keys are not supported. While it is connected, the session transcript is stored on Anthropic servers so the devices stay in sync. Execution stays on your machine.

Some commands are local-only. The docs say `/resume` and `/plugin` work only from the local CLI, while `/compact`, `/clear`, `/context` and `/model <name>` work from mobile and web.

## Worked Example

Halfway through the tags work on Trail Notes, the session is long and cluttered. You ask for the note and get something like this:

```md
# Handoff: tags for Trail Notes

Goal: addNote accepts tags, and filterByTag(notes, tag) returns the notes that carry a tag.

State: addNote stores tags as an array of strings. filterByTag is not written. node checks/run.mjs fails on checks/search.check.mjs. That is the known case-sensitive search bug and I did not touch it.

Decisions: tags stay out of searchNotes for now.

Not verified: app.js and index.html were not opened in a browser.

Next: 1. Write a check for filterByTag. 2. Implement it in notes.js. 3. Run the checks.
```

Start a new session in the same folder and prompt:

```prompt
Read HANDOFF.md and continue from the next steps. Run the checks first and tell me what you see before you change anything.
```

If the session uses a worktree, the note lives in that worktree unless you commit it. Save it somewhere both sessions can read.

For a second device, the author keeps a private repository of handoff notes to move work between machines. Do not put secrets, tokens or personal details in a note, and keep that repository private.

## Pitfalls

- A handoff note that says "continue" with no state tells the next session nothing. Name the files, the failing check and the next step.
- A conversation you resume in a second terminal does not take Remote Control away from the first terminal. Run `/remote-control` there if you want to move it.
- Remote Control is not available through some configurations, such as Amazon Bedrock or an LLM gateway, and organizations with Zero Data Retention cannot enable it.
- An automatic summary can drop details you care about. After `/compact`, the project-root CLAUDE.md is re-read, but chat-only decisions are not.
- Decide who starts a handoff and write it in a rule. The author's rule says only the human does.

## Checkpoint

1. Your laptop will be closed on the train, but you want to keep steering the session from your phone. Does Remote Control work?
2. What should a handoff note carry?

<details><summary>Show the answer</summary>

1. No. Remote Control runs the session on your machine, so the computer has to stay on and the `claude` process has to keep running. Write a handoff note or use a cloud session instead.
2. The intent, the state, the decisions and the next steps, plus what was not verified.

</details>
