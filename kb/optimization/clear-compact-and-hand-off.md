---
title: Clear, Compact and Hand Off
id: O02
area: optimization
level: 1
time: 7
tags: [context, handoff]
verified: 2026-10-23
status: verified
sources:
  - https://code.claude.com/docs/en/context-window
  - https://code.claude.com/docs/en/commands
  - https://code.claude.com/docs/en/checkpointing
  - https://code.claude.com/docs/en/costs
  - https://code.claude.com/docs/en/prompt-caching
  - https://code.claude.com/docs/en/best-practices
  - https://code.claude.com/docs/en/desktop
related: [O01, R08, W09, TS01]
---

Four moves reset or shrink a session. `/clear` starts clean, `/compact` summarizes in place, a handoff note you write carries what matters into a fresh session, and `/rewind` returns to an earlier point. The author mostly hands off and clears, and ran `/compact` once in four weeks.

## When to Use It

Reach for one of these when you switch to unrelated work, when a session you want to keep is getting heavy, when work will span days or devices, or when Claude has gone down a wrong path. [How Context Works](how-context-works.md) explains what is filling the window.

## Decision Table

| Option | What it does | Reach for it when | Watch for |
|---|---|---|---|
| `/clear [name]` | Starts a new conversation with empty context. A name labels the old conversation in the `/resume` picker | The next task is unrelated | Everything said only in chat is gone from the new context. `/resume` brings the old conversation back |
| `/compact [instructions]` | Summarizes the conversation so far. Instructions set the focus, such as `/compact focus on the auth bug fix` | You must continue the same thread and want to choose what the summary keeps | Compaction is itself a large request. The docs say it costs the most when you resume an old session |
| Handoff note and a new session | You write down the state, start a fresh session and point it at the note | Work spans sittings or devices, or you want to see exactly what carries over | The note is only as good as what you put in it |
| `/rewind` | Opens a menu of your earlier prompts with restore and summarize actions | A path went wrong, or you want to compress only part of the conversation | It does not track files changed only by Bash commands or by subagents, and it does not replace git |

The rewind menu offers Restore code and conversation, Restore conversation, Restore code, Summarize from here, and Summarize up to here. The summarize options work like a targeted `/compact`.

In the app, the Desktop page names `/compact` and `/context`. It does not mention `/clear` or `/rewind`, and its shortcut table has Esc stop Claude's response, so the checkpointing page's Esc-twice route to the rewind menu may not apply. The commands page lists `/clear` and `/rewind` with no per-surface note, so type them and see what your build offers. Clicking + New (or pressing Cmd+N) starts a separate session with its own context.

### Write a Handoff Note

A note for a reader who knows nothing should say:

- the goal in one sentence
- what changed, by file
- which checks ran and passed, and which did not run
- decisions you made only in chat
- the next step and the first command to run

The [handoff template](../../templates/handoff.md) has the layout and the [handoff note prompt](../../prompts/handoff-note.md) asks Claude to draft it. In the author's setup a handoff skill ran 86 times, `/clear` 24 times and `/compact` once. A rule says only the human starts the handoff, and a hook warns at 70% and 90% of the window; [Hooks: Guardrails and Warnings](../workflow/hooks-guardrails-and-warnings.md) shows how hooks work. The author's reasoning is that a note you wrote is easier to trust than an automatic summary. [Handoffs Between Sessions and Devices](../workflow/handoffs-between-sessions-and-devices.md) covers the cross-device case.

## Worked Example

You fixed the case-sensitive search bug in Trail Notes and want to add tags next. In the old session:

```prompt
Write a handoff note for a fresh session and save it as HANDOFF.md in the project folder. Cover the goal, the files changed, the checks you ran and their results, the checks you did not run, decisions we made in chat, and the next step.
```

Read the note and correct it. Then click + New and start the next session:

```prompt
Read HANDOFF.md. Run node checks/run.mjs and tell me the current state before you change anything. Then plan the tags work.
```

Look for two things: the first reply should report the check result, and the plan should refer to files named in the note without rereading everything.

## Pitfalls

- A note that states unverified work as done. Mark what you did not run.
- Clearing before you save the next step. `/resume` can bring the old conversation back, but finding it costs time that a note saves.
- Running `/compact` after a long break. The summarization request reprocesses the history without the cache, so compact at a natural break between tasks.
- Letting one note grow into a ledger nobody reads. [Handoff Ledgers and Retros](../process/handoff-ledgers-and-retros.md) covers rotating it.
- Assuming rewind undoes everything. Subagent edits and files changed only by commands need git.

## Checkpoint

1. You finished the search fix and the next task is unrelated. Which option fits, and what do you do before using it?
2. Why is a command-changed file a problem for `/rewind`?

<details><summary>Show the answer</summary>

1. Start clean with `/clear` or a new session. Before that, write a short handoff note with the state, the checks that passed and the next step, so nothing said only in chat is lost.
2. Rewind restores files that Claude's editing tools changed. A file touched only by a shell command is not tracked, so you revert it with git.

</details>
