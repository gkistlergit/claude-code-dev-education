---
title: Subagent Template
kind: template
order: 4
verified: 2026-10-22
sources:
  - https://code.claude.com/docs/en/sub-agents
---

A subagent is an assistant that works in its own context window with its own prompt and tools, then reports back to your session. Save this as `.claude/agents/[agent-name].md` to share it with a project, or as `~/.claude/agents/[agent-name].md` to use it in all your projects. The template is a read-only reader that returns its conclusion instead of the files it read.

## Template

```md
---
name: [agent-name]
description: [When Claude should delegate to this agent. Name the trigger and the job.]
tools: Read, Grep, Glob
model: sonnet
color: cyan
---

You are a [role]. When you are invoked:

1. [First step, written as an action.]
2. [Second step.]

Report [what to return, such as findings with file paths, or a yes or no verdict]. Do not [what this agent must never do]. Do not paste whole files; return the conclusion.
```

## How to Adapt It

- Only `name` and `description` are required. The description is how Claude decides to delegate, so say when to use the agent, for example "Use after any change that touches more than three files".
- `name` is a unique identifier of at most 256 characters. It cannot start with `-` or contain `:`. The file name does not have to match.
- Omit `tools` and the agent inherits every tool available to subagents. List tools, as the template does, to make the agent read-only. `disallowedTools` removes tools from the inherited set instead.
- `model` accepts `sonnet`, `opus`, `haiku`, `fable`, a full model ID or `inherit`. Leave it out and Claude Code picks one by the order the docs describe.
- Other fields the docs list include `permissionMode`, `skills` (preloads skills into the agent), `mcpServers`, `hooks`, `memory`, `background`, `effort`, `isolation` (`worktree` gives the agent its own copy of the repository), `initialPrompt` and `color`. Multi-word names are camelCase and must match exactly, or Claude Code ignores them without an error.
- The Markdown body is the system prompt. A subagent receives only that prompt and basic environment details such as the working directory, not the full Claude Code system prompt.
- Claude Code watches both agents folders and picks up edits within a few seconds. Restart the session after creating the first agent file in a folder that did not exist when the session began.
- `/agents` prints a reminder to ask Claude to create the agent or to edit the files yourself. You can also ask Claude to write the file from this template.
- Delegate by a count, not by feeling. The author's setup has a read-only agent named scout and a rule that sends reading jobs to it when they exceed three files, map an unfamiliar repository, audit for one pattern or triage long logs.

## Common Mistakes

- Leaving out `description`. Claude Code skips a file with a `name` and no `description`, and writes the reason only to the debug log. Run `claude --debug` to see it.
- Starting the file with anything before the opening `---`. The file is then read as documentation.
- Listing `Skill` in `tools` to load skills. Use the `skills` field.
- Giving a plugin's subagent `hooks`, `mcpServers` or `permissionMode`. Plugin subagents ignore those fields. Copy the file into `.claude/agents/` if you need them.
- Expecting `/rewind` to undo a subagent's edits. Checkpoints usually do not capture them, so use git.
- A prompt that asks for everything the agent found. The point of a subagent is a short answer, so say what to return.

See [Subagents by Design](../kb/workflow/subagents-by-design.md) and [Delegating to Subagents](../kb/optimization/delegating-to-subagents.md).
