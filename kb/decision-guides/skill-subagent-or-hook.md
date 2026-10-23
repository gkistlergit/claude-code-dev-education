---
title: Skill, Subagent or Hook
id: DG05
area: decision-guides
level: 2
time: 5
tags: [decision, skills, subagents, hooks]
verified: 2026-10-22
status: verified
sources:
  - https://code.claude.com/docs/en/skills
  - https://code.claude.com/docs/en/sub-agents
  - https://code.claude.com/docs/en/hooks
  - https://code.claude.com/docs/en/hooks-guide
  - https://code.claude.com/docs/en/best-practices
related: [W04, W06, W07, W01]
---

Use a skill to teach Claude a procedure, a subagent to keep heavy work out of the main thread, a hook to enforce something every time, and a CLAUDE.md rule for a preference. Each tool answers a different question, so match the tool to the need.

## When to Use It

Use this guide when you keep pasting the same instructions, when a session fills with file contents you will not look at again, or when a rule keeps getting broken. The table gives the first guess, and the notes after it show how the options differ.

## Decision Table

| Need | Use | Example | Lives in |
|---|---|---|---|
| A preference or fact that applies to every session | A CLAUDE.md rule | Run `node checks/run.mjs` before saying a task is done | `CLAUDE.md` in the project |
| A multi-step procedure you keep pasting into chat | A skill | A pull request description writer, a release checklist | `.claude/skills/<name>/SKILL.md` |
| Heavy reading whose details you will not need again | A subagent | Audit one pattern across many files, triage a long log | `.claude/agents/` |
| Something that must happen every time, or never | A hook | Block edits to `.env`, run a formatter after each edit | A `hooks` block in a settings file |
| A hard cap on a tool or a path | A permission deny rule | `Read(./.env)` | `permissions.deny` in a settings file |

How they differ:

- CLAUDE.md loads every session, so keep it short. The best practices page says a bloated file gets ignored.
- A skill's body loads only when it is used, so long procedures cost almost nothing until needed. Add `disable-model-invocation: true` to a skill with side effects, such as a deploy, so only you start it.
- A subagent works in its own context window and returns a summary. It spends its own tokens, and it starts fresh, so it suits self-contained work and not back-and-forth.
- A hook is deterministic. The best practices page contrasts hooks with CLAUDE.md instructions, which are advisory.

In the author's setup, eight short global rules state the policy in words. Four hooks enforce the parts that must never be skipped, including one that blocks destructive git commands. A read-only scout subagent handles reading, and a rule says to delegate when the job needs more than three files read, a map of an unfamiliar repo, an audit for one pattern, or long logs. A handoff skill ran 86 times. The author's habit is to write the rule first and add a hook only when a rule alone has been broken.

See [Your First Skill](../workflow/your-first-skill.md), [Subagents by Design](../workflow/subagents-by-design.md), [Hooks: Guardrails and Warnings](../workflow/hooks-guardrails-and-warnings.md) and [A CLAUDE.md That Earns Its Keep](../workflow/a-claude-md-that-earns-its-keep.md). The [skill template](../../templates/skill.md), [subagent template](../../templates/subagent.md) and [hook template](../../templates/hook.md) give starting files.

## Pitfalls

- Putting a procedure in CLAUDE.md. It loads every session, and a skill would load it only when needed.
- Using a hook for a preference. Hooks suit rules that must hold, and a wrong hook blocks real work.
- Sending iterative work to a subagent. The main conversation fits tasks with frequent back-and-forth.
- Setting `context: fork` on a skill that holds only guidelines. The forked subagent gets no task and returns nothing useful.
- Letting subagent descriptions grow. Claude Code warns at startup when they pass a combined token limit.

## Checkpoint

Claude must never edit files in the `migrations/` folder. Which tool enforces that?

<details><summary>Show the answer</summary>
A hook or a permission deny rule such as <code>Edit(/migrations/**)</code>, because both are enforced every time. A CLAUDE.md line is advisory and the model can still ignore it.
</details>
