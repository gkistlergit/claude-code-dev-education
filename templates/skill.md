---
title: Skill Template
kind: template
order: 3
verified: 2026-10-22
sources:
  - https://code.claude.com/docs/en/skills
---

A skill is a folder with a `SKILL.md` file of instructions that Claude loads when it fits the task, or that you run by typing `/skill-name`. Save this as `.claude/skills/[skill-name]/SKILL.md` to share it with a project, or as `~/.claude/skills/[skill-name]/SKILL.md` to use it in all your projects on this machine.

## Template

```md
---
name: [skill-name]
description: [What the skill does and when to use it. Put the main use first.]
when_to_use: [Extra trigger phrases or example requests.]
argument-hint: [issue-number]
disable-model-invocation: true
allowed-tools: Bash([command] *) Read
---

## Context

!`[command that prints live context, such as git diff HEAD]`

## Instructions

1. [First step, written as an action.]
2. [Second step.]
3. [What done looks like, and what to report back.]

Arguments passed to the skill: $ARGUMENTS
```

## How to Adapt It

- Every frontmatter field is optional. `description` is the one the docs recommend, because Claude uses it to decide when to load the skill. Delete any line you do not need.
- Spell field names exactly. They use lowercase words joined by hyphens, except `when_to_use`, which uses an underscore. Claude Code ignores a field it does not recognize and reports no error.
- `name` sets the command you type. Without it, the folder name does.
- Keep `disable-model-invocation: true` for steps with side effects, such as a commit or a deploy, so only you start them with `/skill-name`. For background knowledge that is not a command, use `user-invocable: false` instead.
- `allowed-tools` lets the listed tools run without a prompt for the turn in which the skill is invoked. A trailing space and `*` means "starts with", so `Bash(git add *)` covers any `git add` command. List several rules separated by spaces.
- `$ARGUMENTS` holds whatever follows the skill name, so `/[skill-name] 42` puts `42` there. `argument-hint` only shows a reminder while you type.
- The `` !`command` `` line runs the command first and puts its output into the skill before Claude reads it. Remove the Context section if the skill needs no live data.
- Move long reference material into a second file in the same folder and link it from `SKILL.md`. The docs suggest keeping `SKILL.md` under 500 lines.
- Put the most important instructions near the top. The docs say large skills are truncated after compaction, and truncation keeps the start of the file.
- Test it twice: ask something that matches the description, then run it by name.

## Common Mistakes

- A vague `description`. If it does not say when the skill applies, Claude rarely loads it. The combined `description` and `when_to_use` text is cut at 1,536 characters in the skill list, so lead with the key use.
- Frontmatter that does not start on the first line of the file. Claude Code then treats the whole file, markers included, as skill content.
- Expecting `allowed-tools` to restrict anything. It only pre-approves tools for one turn. Your permission settings still govern everything else.
- A long body. Once a skill loads, its text stays in the conversation, so every line is a recurring cost. State what to do, not the history behind it.
- A skill that does what a [hook](hook.md) should. A skill is advice Claude follows. A hook runs every time.
- Skipping a name check. A folder name with an odd character, such as a zero-width space or `<`, stops the skill from loading.

See [Your First Skill](../kb/workflow/your-first-skill.md) for a worked build, and [Skill, Subagent or Hook](../kb/decision-guides/skill-subagent-or-hook.md) for choosing between them.
