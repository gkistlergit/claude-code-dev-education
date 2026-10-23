---
title: Handoff Note
kind: prompt
order: 9
verified: 2026-10-23
---

Use this when a session has grown long, or when you will pick the work up in a new session, on another machine or on another day. It asks for a note that carries intent, state, decisions and next steps, so you can start clean with `/clear` or a new session and check the note for anything missing. [Clear, Compact and Hand Off](../kb/optimization/clear-compact-and-hand-off.md) compares the options, and [Handoffs Between Sessions and Devices](../kb/workflow/handoffs-between-sessions-and-devices.md) covers the rest.

## Prompt

```prompt
Write a handoff note so a new session with no memory of this one can continue [the work]. Save it to [path, such as HANDOFF.md], then show it to me.

Include:
- Goal: one paragraph on what we are trying to do and why.
- State: what is finished, what is half done, the branch, any uncommitted changes, and the last result of [check command].
- Decisions: what we chose and the reason, so the next session does not reopen them.
- Dead ends: what we tried that failed.
- Next steps: in order, with the first one specific enough to start without asking me.
- Read first: the files the next session should open before anything else.
- Open questions for me.

Use exact commands and file names. Mark anything you did not verify as unverified. Keep it under [length].
```

## What a Good Result Looks Like

- A stranger could continue from the note alone. Test it: start a new session, paste the note as the first message, and see whether Claude needs to ask what you meant.
- Decisions come with reasons, and dead ends are listed, so nobody repeats them.
- Commands run as written, and file names exist.
- Guesses are marked unverified and never written as fact.
- It describes the work and the state of the repo. It does not retell the conversation.

You decide when to hand off. Read the note before you clear anything, because a wrong sentence in it becomes a wrong assumption in the next session.

## Variations

### End of Day on the Same Machine

```prompt
Write a short handoff note for tomorrow: where I stopped, the one command that shows the current state, and the first thing to do. Five lines at most.
```

### For Another Person

```prompt
Write a handoff note for a teammate who has not seen this project. Define each term the way we use it, list the commands to run it and check it, and say who to ask about [open question].
```

### For a Cloud Session

A cloud session works from a repository, so the note can only point at what that repository holds.

```prompt
Write a handoff note for a session that starts from the repository alone. Name the branch that holds the work, tell me what to push first, and include any setup commands the new session needs.
```
