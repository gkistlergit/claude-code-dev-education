---
title: Delegating to Subagents
id: O04
area: optimization
level: 2
time: 8
tags: [subagents, context]
verified: 2026-10-23
status: verified
sources:
  - https://code.claude.com/docs/en/sub-agents
  - https://code.claude.com/docs/en/desktop#watch-background-tasks
  - https://code.claude.com/docs/en/context-window
  - https://code.claude.com/docs/en/best-practices
  - https://code.claude.com/docs/en/costs
  - https://code.claude.com/docs/en/checkpointing
related: [W06, A10, DG05, O03]
---

A subagent does a side task in its own context window and sends back only a summary, so the main thread stays lean. Delegate by a count, such as more than three files to read, so the choice does not depend on how you feel about the task.

## When to Use It

Use a subagent when a side task would flood your conversation with search results, logs or file contents you will not refer to again. Keep the work in the main conversation when it needs back-and-forth. To design your own reusable subagents, see [Subagents by Design](../workflow/subagents-by-design.md).

## Decision Table

Claude Code ships these built-in subagents, and Claude picks one when a task matches:

| Subagent | What it is for |
|---|---|
| Explore | A read-only agent for searching and analyzing a codebase. Claude sets a thoroughness level: quick, medium or very thorough |
| Plan | Codebase research during plan mode, with Write and Edit denied |
| General-purpose | Complex, multi-step tasks that need both exploring and acting |

Explore and Plan start without your CLAUDE.md files. Other subagents load them.

| Delegate to a subagent when | Keep it in the main conversation when |
|---|---|
| The task produces verbose output you will not need again, such as test runs, logs or fetched documentation | The task needs frequent back-and-forth or iterative refinement |
| The work is self-contained and can return a summary | Several phases share context, such as plan, implement and test |
| You want tool restrictions or separate permissions | It is a quick, targeted change |
| | Latency matters, because a subagent that is not a fork starts fresh and may need time to gather context |

The author keeps a rule that tells the main session when to delegate: more than three files to read, a map of an unfamiliar repo, an audit for one pattern, or triage of long logs. Pick your own number. A count is easier to apply than a feeling. In four weeks the author's sessions called general-purpose 1,194 times, a custom read-only agent named scout 120 times and Explore 65 times.

### Ask for One

Describe the job and the shape of the answer. Naming a subagent in your prompt usually makes Claude delegate to it. Typing @ and picking it from the list guarantees that one runs.

```prompt
Use a subagent to find every place the Trail Notes code builds the note list on screen. Return a short list of file and function names. Do not edit anything.
```

### Watch and Stop It

A subagent Claude starts from your main conversation runs in the background by default. Once the session has background work, open the Background tasks pane from the title bar's ⋮ menu. Click an entry to see its output in the subagent pane, or to stop it. If a background subagent needs permission, the prompt appears in your main session and names the subagent that asked.

## Worked Example

Before adding tags to Trail Notes, map the work without reading the files yourself:

```prompt
Use a subagent to read index.html, app.js, notes.js and every file in checks/. Report only which functions would change to support tags, which checks would need new cases, and anything surprising. Do not edit anything.
```

That is more than three files, so it meets the author's rule. Watch it in the Background tasks pane. Then open the Context card in the session details panel. The report arrives as a summary, and the file contents stay in the subagent's window. Look at whether the report names real file and function names, and ask a follow-up if it does not. Treat a summary you cannot trace to a file as a guess.

## Pitfalls

- Delegating small jobs. The docs say a fresh subagent may need time to gather context, so a one-file question is faster in the main thread.
- Spawning many subagents that each return long reports. The docs warn that results return to your conversation and each subagent spends tokens of its own, drawing on the same usage limits as your main conversation.
- Trusting a summary without a pointer. Ask for file names and line references.
- Counting on rewind. A subagent's edits are usually not captured in your checkpoints, so use git to revert them.
- Forgetting the model. A subagent that inherits your session's model follows a `/model` switch. [Model and Effort Trade-offs](model-and-effort-trade-offs.md) covers the switch.

## Checkpoint

1. A task needs a map of an unfamiliar repo. Main thread or subagent, and why?
2. Where do you see what a running subagent is doing?

<details><summary>Show the answer</summary>

1. A subagent. A repo map means reading many files, and only the conclusion needs to come back, so the file contents stay out of your main context.
2. The Background tasks pane, opened from the title bar's ⋮ menu once the session has background work. Click an entry to see its output or stop it.

</details>
