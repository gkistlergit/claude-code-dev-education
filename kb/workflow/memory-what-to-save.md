---
title: Memory: What to Save
id: W03
area: workflow
level: 2
time: 7
tags: [memory]
verified: 2026-10-23
status: verified
sources:
  - https://code.claude.com/docs/en/memory
related: [W01, W02, TS02]
---

Auto memory is the set of notes Claude writes for itself between sessions. It stays useful when it holds corrections, decisions and pointers, and it gets noisy when it holds things the code already shows. You decide what stays by reading the folder now and then.

## When to Use It

Use this page when Claude seems to forget a preference you gave it last week, or when you wonder what it has been saving. Auto memory is on by default in local sessions. In a background session, or a session that another Claude Code session started, the `/memory` toggle can turn it off but not back on.

CLAUDE.md and auto memory are separate. You write CLAUDE.md. Claude writes auto memory. The docs say both are loaded at the start of every conversation, and both are context rather than enforced rules. See [A CLAUDE.md That Earns Its Keep](a-claude-md-that-earns-its-keep.md) for the file you write.

## Decision Table

The docs say Claude saves four kinds of notes, recorded as a `type` field in each file's frontmatter: `user`, `feedback`, `project` and `reference`. Claude skips anything it can derive from the codebase, such as architecture, file paths or debugging fixes, and anything your CLAUDE.md files already say.

| What you have | Where it belongs | Why |
|---|---|---|
| A correction you gave Claude, such as "always use pnpm, not npm" | Auto memory (`feedback`) | The docs list corrections and confirmed approaches as the feedback type |
| Your role and working preferences | Auto memory (`user`) | It describes you, so it is the same in every task |
| A project decision or deadline that no file shows | Auto memory (`project`) | Claude cannot derive it from code or git history |
| Where to find something outside the repo, such as a tracker or dashboard | Auto memory (`reference`) | It is a pointer, and the code does not contain it |
| Build and test commands, conventions, "always do X" | CLAUDE.md | You want it in every session on purpose |
| File layout, architecture, how a function works | Neither | The code already shows it |
| A bug and its fix | The commit message or pull request | Claude skips debugging fixes |
| A password, token or personal detail | Nowhere | Memory files are plain markdown on disk |

To save something, say so in chat: "remember that the API tests require a local Redis instance". To put it in CLAUDE.md instead, say "add this to CLAUDE.md".

### How Memory Is Stored

Each project gets a folder at `~/.claude/projects/<project>/memory/`. It holds a `MEMORY.md` index and one topic file per memory. The first 200 lines of `MEMORY.md`, or the first 25KB, whichever comes first, load at the start of every conversation. Topic files do not load at startup. Claude reads them on demand.

The folder belongs to the git repository, so all worktrees of one repo share it. It is machine-local, so it is not shared across machines or cloud environments. Claude Code's cleanup of old transcripts skips the memory folder, so nothing in it expires until you or Claude edits or deletes it.

## Worked Example

You are working on Trail Notes and correct Claude twice about the same thing. Make it stick:

```prompt
Remember that I want a check file in checks/ for every new function I add to notes.js.
```

The docs say messages such as "Saved 2 memories" appear when Claude updates its memory. Now look at what was written.

1. **Run** `/memory` in the session.
2. **Choose** the option that opens the auto memory folder. The docs say `/memory` provides one. The desktop docs say panel commands can behave differently in the Code tab. If it does not open, ask Claude to show you the files in the memory folder.
3. **Open** the new file. It is plain markdown, and its frontmatter should show a `type` such as `feedback`.
4. **Edit** or delete anything wrong. Nothing changes except what you change.

Do a pass like this every few weeks. The author's folders hold 269 memory files across 15 projects, mostly incident lessons, tooling traps, design notes and workflow preferences. At that size a manual read is slow, so the author also runs a read-only agent that audits the folder and proposes edits. It never applies them. That pattern is covered in [Subagents by Design](subagents-by-design.md).

> **Pro tip**
> When `MEMORY.md` nears its limits, Claude Code reminds Claude to keep one line per entry, move detail into topic files, and merge or drop stale entries. Auto memory files are plain markdown you can edit or delete at any time.

## Pitfalls

- Memory records what was true when it was written. The docs add a `modified` timestamp to files that start with frontmatter, so use it to judge how current a note is.
- Do not store a rule you need enforced. For a rule that must run every time, use a hook (see [Hooks: Guardrails and Warnings](hooks-guardrails-and-warnings.md)).
- A memory that contradicts your CLAUDE.md invites an arbitrary choice. Fix one of them.
- Subagents do not load the main conversation's auto memory. A subagent with its own `memory` field gets a separate directory.
- To turn auto memory off, use `/memory`, set `autoMemoryEnabled` to `false` in a project's settings, or set the environment variable `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1`.

## Checkpoint

1. You fixed a bug in `notes.js` this morning. Should you ask Claude to remember the fix?
2. A note in memory is from months ago. What tells you how current it is?

<details><summary>Show the answer</summary>

1. No. The docs say Claude skips debugging fixes it can derive from the codebase. The fix belongs in the commit message or the pull request.
2. The `modified` frontmatter field, which Claude Code adds when Claude writes a memory file that begins with frontmatter.

</details>
