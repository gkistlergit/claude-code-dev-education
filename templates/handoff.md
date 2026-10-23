---
title: Handoff Template
kind: template
order: 9
verified: 2026-10-23
sources:
  - https://code.claude.com/docs/en/context-window
  - https://code.claude.com/docs/en/checkpointing
  - https://code.claude.com/docs/en/commands
  - https://code.claude.com/docs/en/sessions
---

A handoff note carries the state of unfinished work from one session to the next. Save it as `HANDOFF.md` at the project root, or anywhere you can point a new session at. Write it when the context window fills up or the work drifts, then start a fresh session and ask it to read the note.

## Template

```md
# Handoff: [task name], [date]

## Goal
[What you are trying to achieve, in one or two sentences.]

## State
- Done and verified: [what is finished, and how you know].
- In progress: [what is half done, and exactly where].
- Not started: [what remains].

## Decisions and Reasons
- [Decision]: [reason, so the next session does not reopen it].

## Files and Commands
- Branch: [branch name]. Last commit: [short hash].
- Key files: [paths].
- Check with `[command]`. Last result: [pass or fail, with counts].

## Do Not
- [Something the next session must not do, such as "merge before the checks pass"].

## Open Questions
- [A question, and who can answer it].

## Next Step
[The single first action for the next session.]
```

## How to Adapt It

- Write state, not a diary. The next session needs to know where things stand, which decisions are closed and what to do first. It does not need the story of how you got there.
- Separate verified from unverified. "Done and verified" means you ran a check. If you did not run one, list the work under In progress.
- Put the exact check command and its last result in the note, so the next session can confirm the starting point before it edits anything.
- Start the new session with a short prompt, for example: "Read HANDOFF.md, run the check command it lists, and continue from Next Step." The [Handoff Note prompt](../prompts/handoff-note.md) can draft the note from the current conversation.
- Keep it to about a page. A longer note costs context in the new session and buries the next step.
- For deploys, add a record after each one: the exact commit, the version that went live, what was verified and what was not. The author's setup keeps such a ledger per project. Rotate old entries into an archive file before the ledger becomes unreadable.
- Prefer a note you wrote to an automatic summary. The author's setup ends long work with a handoff and a fresh session, and it used `/compact` once against 86 handoffs in about four weeks of use.

## Common Mistakes

- A Next Step that is stale or vague, such as "keep going". Name one action.
- Leaving out what you did not verify. The next session then trusts work nobody checked.
- Recording a decision without its reason. The next session reopens it.
- Putting secrets, tokens or personal data in the note. It sits in the project folder and may be committed.
- Writing the note too late. Write it while the reasons for each choice are still in the conversation.
- Relying on `/clear` alone. The new conversation starts with empty context, so write down what matters before you clear. The old session stays resumable with `/resume`.

See [Clear, Compact and Hand Off](../kb/optimization/clear-compact-and-hand-off.md), [Handoffs Between Sessions and Devices](../kb/workflow/handoffs-between-sessions-and-devices.md) and [Handoff Ledgers and Retros](../kb/process/handoff-ledgers-and-retros.md).
