---
title: Subagents by Design
id: W06
area: workflow
level: 3
time: 9
tags: [subagents]
verified: 2026-10-22
status: verified
sources:
  - https://code.claude.com/docs/en/sub-agents
  - https://code.claude.com/docs/en/agent-teams
  - https://code.claude.com/docs/en/desktop
related: [O04, DG05, W07]
---

A custom subagent is a markdown file that defines one kind of worker: its job, its tools and what it hands back. Design each one around a single purpose and a fixed return format, and give it only the tools that purpose needs. This page covers the file format and two read-only shapes from the author's setup.

## When to Use It

The subagent docs say to use one when a side task would flood your main conversation with search results, logs or file contents you will not reference again. The subagent works in its own context window and returns a summary. Define a custom one when you keep spawning the same kind of worker with the same instructions.

If you need reusable instructions that run inside the main conversation, a skill is the better fit (see [Your First Skill](your-first-skill.md)). For the broader choice, see [Skill, Subagent or Hook](../decision-guides/skill-subagent-or-hook.md) and [Delegating to Subagents](../optimization/delegating-to-subagents.md).

## Steps

1. **Pick** one purpose. A subagent that reviews, plans and edits will do none of them well. Name it for the job.
2. **Choose** a location. `.claude/agents/<name>.md` is for the current project, and you can commit it. `~/.claude/agents/<name>.md` is for all your projects. When two share a name, the higher-priority location wins: managed settings, then `--agents`, then project, then user, then plugin.
3. **Write** the frontmatter. Only `name` and `description` are required. Field names are camelCase and must match exactly, because Claude Code ignores a field it does not recognize.
4. **Limit** the tools. `tools` is an allowlist and `disallowedTools` is a denylist. If you omit `tools`, the subagent inherits every tool available to subagents.
5. **Define** the return format in the body. The body is the system prompt, and the subagent does not see your conversation history. Tell it what to return.
6. **Add** `isolation: worktree` for risky work. The subagent then runs in a temporary git worktree, an isolated copy of the repository, and the docs say the worktree is cleaned up automatically if it makes no changes.
7. **Try** it. Name the subagent in a prompt, or type `@` and pick it from the typeahead to make sure it runs.

Ask Claude to write the first draft, then open the file and check the frontmatter. The commands reference says `/agents` prints a reminder to ask Claude or edit the `agents` folders directly. If the `agents` folder did not exist when the session started, restart Claude Code so it is watched.

Other fields the docs list include `model`, `permissionMode`, `skills`, `hooks`, `memory`, `background` and `effort`. If the main conversation is in Auto, Accept edits or Bypass permissions mode, the subagent runs in that mode and ignores its own `permissionMode`.

## Worked Example

The author keeps two custom agents, both read-only. A scout does heavy reading: more than three files, a map of an unfamiliar repo, an audit for one pattern, or long logs. A memory auditor reads a memory folder and proposes edits without applying any. Sketches of both:

```md
---
name: scout
description: Read-only explorer for heavy reading. Use when a question needs more than three files read, a map of an unfamiliar repo, an audit for one pattern, or triage of long logs. Returns the conclusion, not the files.
tools: Read, Grep, Glob
---

You are a read-only scout. Do not edit or write anything.

Return the conclusion first, then the file paths and line numbers that support it. Say what you did not check. Do not paste file contents back.
```

```md
---
name: memory-auditor
description: Audits a memory folder and proposes edits. Use when the user asks for a memory cleanup or suspects stale memory.
tools: Read, Grep, Glob
---

You are given the path of a memory folder. Read the index and each topic file.

List entries that are stale, duplicated or contradicted by another entry. For each, quote the line and propose one edit. Change no file.
```

A global rule in the main session tells it when to hand off (see [Rules and Global Settings](rules-and-global-settings.md)). The rule sets a count, such as more than three files, so the main session has a clear trigger to delegate. In the audit period the author's sessions made 1,194 general-purpose subagent calls, 120 scout calls and 65 Explore calls.

Try the scout on Trail Notes. Save the first file to `.claude/agents/scout.md`, then prompt:

```prompt
Use the scout subagent to map this folder: which files hold pure functions, which touch the DOM or localStorage, and where the checks live.
```

You should get a short answer with file paths and no pasted file bodies. The template for your own is in the [subagent template](../../templates/subagent.md).

> **Pro tip**
> To stop a subagent spawning its own, leave `Agent` out of its `tools` list. Nesting is allowed by default, up to three layers below the main conversation.

## Pitfalls

- Long descriptions cost context in every session. Claude Code warns at startup when the combined descriptions of your non-built-in subagents pass 15,000 tokens. Keep the description short and put detail in the body.
- Bash can run commands that change files. Add it to `tools` only if the agent must run commands, and leave it out for a strictly read-only agent.
- A subagent starts fresh and gets a task message Claude writes. If a rule must reach it, such as "ignore the `vendor/` folder", restate it when you delegate.
- Subagents Claude spawns start in the background by default, with a smaller built-in tool set. Open **Background tasks** in the title bar's **⋮** menu to see running ones.
- Many subagents returning detailed results can still fill your main context, and each spends tokens of its own.
- Agent teams are experimental and off by default. They need `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`, use more tokens than one session, and the desktop docs list them as available in the CLI and not in Desktop.

## Checkpoint

1. Which two frontmatter fields does a subagent file require?
2. You want an agent that reads a folder and proposes edits but cannot change anything. Which `tools` line fits?

<details><summary>Show the answer</summary>

1. `name` and `description`.
2. `tools: Read, Grep, Glob`. It has no Edit, Write or Bash tool, so it can read and search but not change files.

</details>
