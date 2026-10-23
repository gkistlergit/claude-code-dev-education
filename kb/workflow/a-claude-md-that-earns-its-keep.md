---
title: A CLAUDE.md That Earns Its Keep
id: W01
area: workflow
level: 2
time: 8
tags: [claude-md, memory]
verified: 2026-10-22
status: verified
sources:
  - https://code.claude.com/docs/en/memory
  - https://code.claude.com/docs/en/desktop
related: [W02, W03, TS02]
---

A CLAUDE.md file holds the instructions you would otherwise retype at the start of every session. Claude reads it at session start, so every line costs context in every conversation. Short, checkable lines earn their place. Long, vague ones do not.

## When to Use It

Write or trim a CLAUDE.md when you catch yourself typing the same correction two sessions in a row. The memory docs name four triggers: Claude makes the same mistake a second time, a code review catches something Claude should have known about the codebase, you type the same clarification you typed last session, or a new teammate would need the same context.

CLAUDE.md is context, not enforcement. The docs say Claude tries to follow it but strict compliance is not guaranteed. If something must happen every time, use a hook instead (see [Hooks: Guardrails and Warnings](hooks-guardrails-and-warnings.md)).

## Steps

1. **Pick** the file's scope. A project file lives at `./CLAUDE.md` or `./.claude/CLAUDE.md` and is shared through version control. A personal file for all projects lives at `~/.claude/CLAUDE.md`. A personal file for one project is `./CLAUDE.local.md`, which the docs say to add to `.gitignore`.
2. **Run** `/init` in a session on the project. Claude reads the codebase and writes a first draft with build commands, test instructions and conventions. If a CLAUDE.md already exists, `/init` suggests improvements and does not overwrite it.
3. **Cut** the draft down to facts Claude should hold in every session: build and test commands, conventions, project layout and "always do X" rules. The docs target under 200 lines per file. The author's project files run 13 to 20 lines.
4. **Rewrite** each line so you could check it. The docs give the pattern: "Use 2-space indentation" instead of "Format code properly", and "Run `npm test` before committing" instead of "Test your changes".
5. **Move** bulky or situational material out. A multi-step procedure belongs in a skill (see [Your First Skill](your-first-skill.md)). A rule that matters for only part of the codebase belongs in a file under `.claude/rules/` with a `paths` list. Note that `@path` imports help you organize a long file but do not reduce context, because imported files load with the file that imports them.
6. **Check** that it loaded. Run `/context` and look under **Memory files**. Run `/memory` to open the files.
7. **Review** it from time to time. `/doctor prompt-audit` (v2.1.283 or later) reports outdated or conflicting instructions and proposes edits, and it changes nothing until you ask.

> **Terminal tip**
> The desktop docs say built-in commands that open an interactive panel in the terminal can behave differently in the Code tab. If `/memory` or another panel command does not open the way you expect, edit the file directly in the Files pane, or run the command from the standalone CLI by typing `claude` in a terminal in the project folder.

## Worked Example

Trail Notes has no CLAUDE.md yet. After `/init`, you trim the draft to this:

```md
# Trail Notes

A small notes app with no framework and no build step.

- Run `node checks/run.mjs` after every change to notes.js.
- Keep notes.js free of DOM and localStorage code. That belongs in app.js.
- Add a check file in checks/ for every new function in notes.js.
- Add no dependencies. package.json has none.
```

Each line says something you can verify by looking at a diff. The first line gives the exact test command. The second records a boundary between two files that the file names alone do not show.

To confirm it works, start a new session, run `/context`, and find the file under **Memory files**. Then ask for a small change to `notes.js` and watch whether Claude runs the checks without being told.

A block-level HTML comment in the file is stripped before the content reaches Claude, so you can leave notes for yourself there without spending context.

The author's global rules are written the same way. Each is a short file holding one rule, and the project files stay at 13 to 20 lines (see [Rules and Global Settings](rules-and-global-settings.md)). A starting point is in the [CLAUDE.md template](../../templates/claude-md.md).

## Pitfalls

- Vague lines such as "write clean code" give Claude nothing to check against.
- Two files that disagree make Claude pick one arbitrarily. Look for conflicts between your user file, the project file and any files in `.claude/rules/`.
- A CLAUDE.md in a subdirectory loads when Claude works on a file in that subdirectory, so it does not show under **Memory files** at launch.
- Instructions given only in chat are lost at the next session. After `/compact`, the project-root CLAUDE.md is read again from disk, but a chat-only instruction is not.
- Do not paste secrets, tokens or personal details into a CLAUDE.md that you commit.

## Checkpoint

1. A line in your CLAUDE.md says "Test your changes." What would you write instead for Trail Notes?
2. Where do you look to confirm that a project-root CLAUDE.md loaded?

<details><summary>Show the answer</summary>

1. Name the command and when to run it, for example "Run `node checks/run.mjs` after every change to notes.js."
2. Run `/context` and check the list under **Memory files**.

</details>
