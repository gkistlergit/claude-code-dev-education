---
title: CLAUDE.md Template
kind: template
order: 1
verified: 2026-10-23
sources:
  - https://code.claude.com/docs/en/memory
  - https://code.claude.com/docs/en/best-practices
---

A starter for the instructions file Claude reads at the start of every session. Save it as `CLAUDE.md` in the project root, or as `.claude/CLAUDE.md`, and commit it so everyone who works on the project gets the same instructions. A personal version for all your projects goes in `~/.claude/CLAUDE.md`.

## Template

```md
# [Project name]

[One sentence: what the project is and who uses it.]

## Commands
- Run the checks: `[command]`
- Start locally: `[command]`

## Conventions
- [A rule you can verify, such as "2-space indentation".]
- [Where things live, such as "API handlers are in src/api/".]

## Rules
- [Always or never rule, with the reason in a few words.]
- Ask before [a hard-to-undo action, such as deleting data].
```

## How to Adapt It

- Run `/init` in a session first. Claude reads the codebase and drafts a file with the build commands and conventions it finds. Then cut the draft down to what this template shows and add what Claude could not discover.
- Write every line so you could check it. "Run `npm test` before committing" is checkable. "Test your changes" is not.
- Keep the file short. The docs target under 200 lines, and the author's setup keeps project files to 13 to 20 lines. A long file uses context on every session and lowers how well Claude follows it.
- Move anything that applies to one part of the codebase into a path-scoped [rules file](rules-file.md). Move multi-step procedures into a [skill](skill.md).
- Put private preferences in `CLAUDE.local.md` at the project root and add it to `.gitignore`.
- Pull in another file with `@path/to/file` anywhere in the text. The imported file loads with this one, so imports help you organize and do not reduce context cost.
- Leave notes for maintainers in an HTML comment such as `<!-- note -->`. Claude Code strips block-level comments before the file reaches Claude.

## Common Mistakes

- Vague instructions such as "write clean code". Claude cannot tell when it has followed them.
- Two instructions that contradict each other. Claude may pick either one, so review the file when you add a line.
- Treating CLAUDE.md as enforcement. Claude reads it as context. To block an action every time, use a [hook](hook.md).
- Pasting a whole style guide or README. Import the file or link to it instead.
- Committing identifiers, tokens or personal data. The file is shared through version control.
- Letting it grow after every mistake. Add a line when Claude makes the same mistake twice, and delete lines that no longer apply.

See [A CLAUDE.md That Earns Its Keep](../kb/workflow/a-claude-md-that-earns-its-keep.md) for the reasoning behind each choice.
