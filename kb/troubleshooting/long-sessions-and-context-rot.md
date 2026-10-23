---
title: Long Sessions and Context Rot
id: TS01
area: troubleshooting
level: 1
time: 6
tags: [troubleshooting, context]
verified: 2026-10-23
status: verified
sources:
  - https://code.claude.com/docs/en/context-window
  - https://code.claude.com/docs/en/best-practices
  - https://code.claude.com/docs/en/how-claude-code-works
  - https://code.claude.com/docs/en/troubleshooting
  - https://code.claude.com/docs/en/errors
  - https://code.claude.com/docs/en/costs
related: [O01, O02, DG03, O04]
---

When a long session forgets instructions, repeats mistakes or slows down, the context window is the first suspect. "Context rot" is this course's informal name for the pattern. The docs describe the effect without using that term.

## When to Use It

Use this page when Claude starts ignoring something it handled earlier, circles the same fix, or the session just feels heavy. Look at the context before you blame the prompt or the model.

## Symptoms and Fixes

Try the fixes in this order: look, then clear or hand off, then delegate heavy reading.

| Symptom | Likely cause | Fix |
|---|---|---|
| Forgets an instruction from earlier | Detail from early in the conversation was summarized away or crowded out | Look at the context. Put the rule in CLAUDE.md. If the session is already long, hand off to a fresh one |
| Repeats a mistake you already corrected | Failed attempts pile up in the context | The best-practices page says that after more than two corrections on one issue you should `/clear` and write a better first prompt |
| Answers drift after you change topics | Unrelated tasks share one window | Start a new session, or `/clear`, between tasks |
| "Context limit reached · /compact or /clear to continue" | The conversation plus files exceeds the window | Run `/compact` with a focus, or `/clear` |
| "Autocompact is thrashing" | A file or tool output refills the window right after each summary | Have Claude read the file in smaller chunks, compact with a focus that drops the big output, move the work to a subagent, or `/clear` |
| Usage climbs faster than the work seems to justify | Every request carries the whole conversation | Clear or hand off sooner |

### 1. Look

Open the Context card in the session details panel, or type `/context` in the prompt box. Compare the Messages row with the others. The troubleshooting page reads them this way: if Messages is the largest, something in the conversation is filling the window, so read big files in pieces or delegate them. If the other rows together are larger, what loads at startup leaves too little room for work, so trim that first.

### 2. Clear or Hand Off

If the topic changed, `/clear` or click + New. If you must keep the thread, write a handoff note first, then start a fresh session with it. [Clear, Compact and Hand Off](../optimization/clear-compact-and-hand-off.md) compares the options, and [New Session or Continue](../decision-guides/new-session-or-continue.md) gives a quick rule.

### 3. Delegate Heavy Reading

Send file-heavy research to a subagent so the contents stay in its window. [Delegating to Subagents](../optimization/delegating-to-subagents.md) covers when.

## Worked Example

In one Trail Notes session you fixed the search bug, then asked about the manifest, then asked for a style tweak, then returned to search. Claude now re-edits `notes.js` and undoes part of the fix, and `node checks/run.mjs` fails again.

1. Type `/context`. In this scenario, Messages is the largest row.
2. Ask Claude for a handoff note: the fix is in, which check passes, what remains. Read it.
3. Click + New, tell the new session to read the note and run `node checks/run.mjs` before changing anything.

The new session starts from the note and leaves the tangle behind. If the check passes there, the old context is a likely cause.

## Pitfalls

- Waiting for automatic compaction to fix it. Compaction keeps what it judges important, and detailed early instructions may be lost.
- Compacting again and again. Compaction is itself a large request, and the costs page says `/clear` costs nothing.
- Starting fresh without saving state. Say what is done, what passes and what comes next before you leave.
- Putting persistent rules only in chat. They belong in CLAUDE.md, as [Claude Ignores My Instructions](claude-ignores-my-instructions.md) explains.
- Ignoring startup bulk. A long CLAUDE.md or many skills shrink the room you have from the first message.

## Checkpoint

A session is long and Claude keeps repeating a fix you already rejected twice. What do you do first, and what do you do next?

<details><summary>Show the answer</summary>

Look at the Context card or `/context` to see what is filling the window. Then start fresh: `/clear` or a new session, with a better first prompt that includes what you learned. If the work must continue, write a handoff note before leaving the old session.

</details>
