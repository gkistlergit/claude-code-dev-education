---
title: Claude Ignores My Instructions
id: TS02
area: troubleshooting
level: 2
time: 6
tags: [troubleshooting, instructions]
verified: 2026-10-22
status: verified
sources:
  - https://code.claude.com/docs/en/memory
  - https://code.claude.com/docs/en/best-practices
  - https://code.claude.com/docs/en/prompt-caching
  - https://code.claude.com/docs/en/context-window
  - https://code.claude.com/docs/en/desktop
related: [W01, W03, D01, W07]
---

When Claude skips a rule you wrote, the usual causes are that the file never loaded, it is too long or vague, it conflicts with another instruction, or the rule only lived in the chat. The memory docs add one more fact: CLAUDE.md is context, not enforced configuration. Anything that must always happen belongs in a hook.

## When to Use It

Use this page when Claude does something your CLAUDE.md or rules file says not to do, or skips a step it says to take. Work down the table before you rewrite the file.

## Symptoms and Fixes

| Symptom | Likely cause | What to check or do |
|---|---|---|
| Claude acts as if the file does not exist | It did not load | Type `/context` and read the Memory files list. If the file is missing, Claude cannot see it. Check where the file sits relative to your working directory |
| Instructions in a subfolder are missing | Subdirectory files load on demand | A CLAUDE.md in a subfolder loads once Claude reads, writes or edits a file there, so it does not appear in the list at launch |
| An AGENTS.md is ignored | A CLAUDE.md exists on the path | By default Claude reads AGENTS.md only when no CLAUDE.md or CLAUDE.local.md is in your working directory or above it |
| It follows the top of a long file and misses the rest | The file is too long | Aim for under 200 lines. Move rules for part of the codebase into path-scoped rules. A subfolder file over its size limit gets only its start; the memory page lists the limits |
| It follows a rule sometimes | The wording is vague, or two files disagree | Write something you can verify: "Use 2-space indentation" instead of "Format code properly". Remove conflicts, since Claude may pick one arbitrarily |
| A rule from chat vanished | It was given only in conversation | Add it to CLAUDE.md. The project-root file is re-read from disk after compaction |
| You edited CLAUDE.md and nothing changed | It loads at session start | The new text applies after the next `/clear`, `/compact` or restart |
| Commit or pull request rules are ignored | They compete with built-in guidance | The settings `includeGitInstructions` and `attribution` control the built-in text |
| A step must happen every time | Claude treats your instructions as context | Use a hook. It runs as a shell command at a fixed point whatever Claude decides |

Two tools help. `/doctor` proposes trims for a checked-in CLAUDE.md, and `/doctor prompt-audit` (Claude Code v2.1.283 or later) reports outdated or conflicting instructions and proposes edits without changing anything until you say so. To open the files, the memory page describes `/memory` for the terminal. The Desktop page warns that dialog-style commands behave differently in the Code tab, so if `/memory` does not help in your build, open the file from the Files pane.

If Claude keeps skipping one line, the best-practices page suggests adding emphasis such as "IMPORTANT" to that line alone. Emphasize many lines and none stands out.

## Worked Example

Your Trail Notes CLAUDE.md says "Run the checks before you finish". Claude reports a change as done without running them.

1. Type `/context`. If CLAUDE.md is in the Memory files list, the file loaded and the cause is elsewhere.
2. Make the line concrete: "After any edit to `notes.js` or `app.js`, run `node checks/run.mjs` and paste the result in your reply."
3. If Claude still skips it sometimes, enforce it. The best-practices page describes a Stop hook that runs your check as a script and blocks the turn from ending until it passes. [Hooks: Guardrails and Warnings](../workflow/hooks-guardrails-and-warnings.md) shows how to build one.

In the author's setup, project instruction files stay between 13 and 20 lines, and the global rules are eight short files that each state one rule. The author also keeps a hook that blocks destructive git commands. The pattern is to write the rule in words first and add a hook or a CI check only after the rule alone has been broken.

## Pitfalls

- Adding a new line after each mishap until the file is long enough to hide its own rules. [A CLAUDE.md That Earns Its Keep](../workflow/a-claude-md-that-earns-its-keep.md) covers pruning.
- Emphasizing everything.
- Leaving two files that disagree, such as a nested CLAUDE.md and a rules file.
- Testing a change without watching behavior. The docs advise treating the file like code and checking whether Claude's behavior shifts.
- Expecting CLAUDE.md to block an action. Permission rules and hooks do that.

## Checkpoint

You edited CLAUDE.md in the middle of a session and Claude behaves as before. Why, and what makes the edit apply?

<details><summary>Show the answer</summary>

Project and user CLAUDE.md files are read once at session start. A mid-session edit does not reach the running session. The new text loads after the next `/clear`, `/compact` or restart, so start a new session to test it.

</details>
