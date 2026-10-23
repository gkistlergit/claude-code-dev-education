---
title: Your First Skill
id: W04
area: workflow
level: 2
time: 9
tags: [skills]
verified: 2026-10-22
status: verified
sources:
  - https://code.claude.com/docs/en/skills
  - https://code.claude.com/docs/en/commands
  - https://code.claude.com/docs/en/desktop
related: [W06, O05, A09]
---

A skill is a folder with a `SKILL.md` file. Claude loads it when the request matches its description, or you run it by typing `/skill-name`. Build one when you keep pasting the same instructions into chat. This page builds a small skill for Trail Notes.

## When to Use It

The skills docs give two triggers: you keep pasting the same checklist or procedure into chat, or a section of CLAUDE.md has grown into a procedure instead of a fact. A skill's body loads only when it is used, so long material costs almost nothing until then. CLAUDE.md content loads every session.

Claude Code also ships bundled skills, such as `/batch`, `/debug`, `/code-review`, `/loop` and `/claude-api`. You invoke them the same way. Custom commands in `.claude/commands/` have been merged into skills and keep working.

## Steps

1. **Choose** where it lives. `~/.claude/skills/<skill-name>/SKILL.md` is personal and loads in all your projects on this machine. `.claude/skills/<skill-name>/SKILL.md` is a project skill, and you commit it so your team gets it too. Skills in `~/.claude/skills/` are not read in cloud sessions.
2. **Write** the frontmatter between `---` markers, then the instructions. All fields are optional and only `description` is recommended. The docs' main fields are below.
3. **Save** it and make Claude Code see it. Edits to an existing skills folder are picked up within the session. If the top-level skills folder did not exist when the session started, run `/reload-skills`.
4. **Run** it. Type `/` in the prompt box, or click the **+** button and select **Slash commands**, to browse skills, then pick yours. Or ask something that matches the description.
5. **Check** its cost. `/skill-doctor` (v2.1.252 or later) shows what each skill costs in context and how often it is used, and flags skills never invoked.

| Field | What the docs say it does |
|---|---|
| `name` | The command name. Defaults to the directory name |
| `description` | What the skill does and when to use it. Claude uses it to decide when to load the skill |
| `when_to_use` | Extra trigger phrases. Appended to `description` |
| `disable-model-invocation` | `true` stops Claude from loading it on its own. You can still run it |
| `user-invocable` | `false` hides it from the `/` menu so only Claude invokes it |
| `allowed-tools` | Tools Claude may use without asking during the turn that invokes the skill. It does not restrict other tools |
| `context` and `agent` | `context: fork` runs the skill in a subagent of the type named by `agent` |
| `paths` | Globs that limit when Claude loads the skill automatically |

Field names must match exactly, hyphens included. Claude Code ignores a field it does not recognize without an error.

## Worked Example

Trail Notes ships with a failing search check. Make a skill that runs the checks and explains failures. In the Trail Notes folder, prompt:

```prompt
Create a project skill at .claude/skills/check-notes/SKILL.md with the contents I paste next. Do not change anything else.
```

Then paste this as the next message:

```md
---
name: check-notes
description: Runs the Trail Notes checks and explains any failure. Use when the user asks to run the checks, verify a change to notes.js, or find out why a check fails.
allowed-tools: Bash(node checks/run.mjs)
---

Run `node checks/run.mjs` from the project root.

If every check passes, say so in one line.

If a check fails, name the check file, quote the assertion message, read the function it covers in notes.js, and propose the smallest fix. Do not edit files until the user agrees.
```

The `Bash(node checks/run.mjs)` entry follows the docs' pattern for pre-approving a command, such as `Bash(git status *)` in their commit skill. Run `/reload-skills`, then type `/check-notes`. You should see the search check fail and a proposed fix for `searchNotes`. Run `/skill-doctor` afterward and look for `check-notes` in the report.

A starting file is in the [skill template](../../templates/skill.md).

### Writing the Description

The docs' advice for a skill that does not trigger: include keywords users would naturally say, confirm it appears when you ask "What skills are available?", and invoke it directly with `/skill-name`. Put the key use case first, because the combined `description` and `when_to_use` text is cut at 1,536 characters in the skill listing. If it triggers too often, make the description more specific or add `disable-model-invocation: true`.

Use `disable-model-invocation: true` for anything with side effects, such as a deploy. The docs' reason: you do not want Claude deciding to deploy because the code looks ready.

The author has 24 user-level skills, 9 written by hand and 15 vendored, and each project carries 38 to 43 skills copied from a shared set. Every skill's description is listed in context each turn, which is why `/skill-doctor` matters at that size.

## Pitfalls

- Malformed YAML does not stop the skill from loading. It loads with no fields set, so `/skill-name` works but Claude cannot match your description. Run with `--debug` to see the parse error.
- `allowed-tools` grants permission for one turn. It is not a sandbox. Read the `allowed-tools` of any skill committed to a repository before you run Claude Code there.
- Once invoked, the skill text stays in the conversation and is not re-read. Write guidance that applies to the whole task, for example "Run the tests after every edit".
- After compaction, Claude Code keeps only the start of each invoked skill, so put the important lines first.
- A rule that must hold every time belongs in a hook, not a skill (see [Hooks: Guardrails and Warnings](hooks-guardrails-and-warnings.md)).
- The desktop docs say panel commands can behave differently in the Code tab. If `/skill-doctor` shows no report there, run it from the standalone CLI.

## Checkpoint

1. Your `deploy` skill must only run when you type it. Which field do you set?
2. You created `.claude/skills/` for the first time during a session and the skill does not appear. What do you run?

<details><summary>Show the answer</summary>

1. `disable-model-invocation: true`. Claude cannot load the skill on its own, and you can still run `/deploy`.
2. `/reload-skills`. Claude Code was not yet watching that folder.

</details>
