---
title: New Session or Continue
id: DG03
area: decision-guides
level: 1
time: 5
tags: [decision, sessions]
verified: 2026-10-23
status: verified
sources:
  - https://code.claude.com/docs/en/context-window
  - https://code.claude.com/docs/en/desktop#manage-sessions
  - https://code.claude.com/docs/en/best-practices
  - https://code.claude.com/docs/en/model-config
  - https://code.claude.com/docs/en/commands
related: [O02, A03, TS01]
---

Continue when the next step builds on the same task and the context has room. Clear or start a new session when the next task is unrelated, and write a handoff note when the work will span sittings.

## When to Use It

Decide each time you finish a unit of work, and whenever Claude starts forgetting earlier instructions or repeating mistakes. To see how full the context is, read the percentage on the **Context** card in the session details panel, or type `/context` in the prompt box for a breakdown by category.

## Decision Table

| Situation | Do this | Why |
|---|---|---|
| The next step builds on the same task and context has room | Continue | The history is still useful |
| A quick question about the work | Side chat with **Cmd+;** or `/btw` | The answer never enters the main thread, and the app does not save side chats |
| The same task, but the context is crowded with old detail | `/compact` with focus instructions | The summary keeps what you name instead of what Claude guesses |
| The next task is unrelated | `/clear`, or **+ New** for a new session | Old conversation crowds out the files you need next |
| You corrected Claude twice on the same point | `/clear` and a better first prompt | Failed attempts stay in the context |
| The work spans days, or someone else continues it | A handoff note, then a new session | A note you wrote is easier to trust than an automatic summary |
| You want to try a different direction | `/branch` | The original conversation stays intact. `/rewind` instead goes back to an earlier point in the same conversation |

`/clear` starts a new conversation with empty context, and `/resume` brings the old one back. Claude also compacts automatically as the window fills, so a full context never ends the session. Compacting yourself, with instructions, gives you control over what survives.

In the author's setup, a handoff skill ran 86 times against 24 uses of `/clear` and one `/compact`. A hook warns at 70% and 90% of the context window and points to the handoff skill. A rule says only the human triggers a handoff. The model configuration page says when automatic compaction runs for each model but gives no figure for when to hand off, so pick your own warning point. The [handoff template](../../templates/handoff.md) and the [handoff note prompt](../../prompts/handoff-note.md) give you a starting shape. [Clear, Compact and Hand Off](../optimization/clear-compact-and-hand-off.md) goes deeper.

## Pitfalls

- The kitchen-sink session, where unrelated tasks pile into one conversation.
- Reaching for `/compact` by reflex when `/clear` would give a cleaner start.
- Handoff notes that skip the state of verification. Say what was checked and what was not.
- Clearing with uncommitted work you meant to keep. `/clear` resets the conversation, not your files, but commit before you move on so the next session starts from a known state.
- Starting a new session for a one-line question. Use a side chat.

If sessions already feel muddy, [Long Sessions and Context Rot](../troubleshooting/long-sessions-and-context-rot.md) lists the symptoms. [Sessions and the Sidebar](../app/sessions-and-the-sidebar.md) shows how to manage several at once.

## Checkpoint

You just fixed a bug and now want to add an unrelated feature in the same project. Do you continue?

<details><summary>Show the answer</summary>
No. Commit the fix, then use <code>/clear</code> or start a new session. The bug's history would crowd out what the feature needs, and a clean start is cheaper than carrying it along.
</details>
