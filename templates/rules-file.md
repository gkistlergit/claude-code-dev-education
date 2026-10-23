---
title: Rules File Template
kind: template
order: 2
verified: 2026-10-22
sources:
  - https://code.claude.com/docs/en/memory
  - https://code.claude.com/docs/en/context-window
---

A rules file holds one topic of instructions in its own Markdown file. Save it as `.claude/rules/[topic].md` in a project to share it through version control, or as `~/.claude/rules/[topic].md` to apply it to every project on your machine. Claude Code finds all `.md` files in `.claude/rules/`, including those in subfolders.

## Template

```md
---
paths:
  - "[glob, such as src/api/**/*.ts]"
---

# [Topic] rules

- [One rule per line, concrete enough to check.]
- [A reason in a few words, so Claude can judge edge cases.]
- [What to do when the rule does not fit.]
```

## How to Adapt It

- Name the file after its topic: `testing.md`, `api-design.md`, `accounts.md`. One topic per file keeps each rule easy to find and delete.
- Delete the whole `---` block to make the rule load at the start of every session. A rule with no `paths` field applies to all files and loads with the same priority as `.claude/CLAUDE.md`.
- Keep `paths` to scope the rule to matching files. It loads when Claude reads, writes or edits a file that matches. `paths` is the only frontmatter field Claude Code reads from a rule. Other fields are ignored without an error.
- Write patterns relative to the folder that contains the `.claude` folder. `**/*.ts` matches TypeScript files anywhere, and `src/**/*` matches everything under `src/`. List several patterns on separate lines.
- Use `~/.claude/rules/` for personal habits. User-level rules load before project rules, and neither set overrides the other, so keep the two consistent.
- Write the rule in words first. Add a [hook](hook.md) or a check only when a rule alone has been broken. The author's setup keeps eight short global rules files, each covering one rule.
- Share a rule set across projects by symlinking a folder into `.claude/rules/`. The docs note that a link pointing outside the project asks for approval once per project.

## Common Mistakes

- Putting several topics in one file. Split it, so a path-scoped topic does not load with an unrelated one.
- Relying on a path-scoped rule to survive compaction. Rules with `paths` reload on demand, and the docs say a rule that must always persist should drop `paths` or move into the project-root CLAUDE.md.
- Expecting a rule to enforce itself. Claude treats rules as context. A [hook](hook.md) blocks an action every time.
- Repeating the same line in CLAUDE.md and a rules file. Duplicates drift apart and then contradict each other.
- Writing a long procedure as a rule. Rules load every session or whenever a matching file opens. A [skill](skill.md) loads only when needed.
- Mistyping the frontmatter. If the YAML does not parse, Claude Code ignores it and loads the rule as if it had no `paths`. Run `claude --debug` to see the error.

See [Rules and Global Settings](../kb/workflow/rules-and-global-settings.md) for how rules fit with settings files, and the [CLAUDE.md template](claude-md.md) for the main instructions file.
