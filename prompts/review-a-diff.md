---
title: Review a Diff
kind: prompt
order: 5
verified: 2026-10-23
---

Use this after a change is written and before it merges, whether you or Claude wrote it. It works best in a fresh session or a subagent, so the reviewer has not seen the reasoning that produced the change. [Code Review, Yours and Claude's](../kb/development/code-review-yours-and-claudes.md) covers the options.

## Prompt

```prompt
Review the changes in [branch, commit range or pull request] as a skeptical reviewer who did not write them. The intent of the change is: [one sentence]. Do not edit any file.

Look for:
- Anything the change does that the intent does not call for.
- Deleted, skipped or weakened checks.
- New dependencies, or new files that nothing needs.
- Missing handling for empty, very large or malformed input.
- Behavior that changed without a check covering it.
- Names, comments or docs that now say something false.

Report a list sorted by severity. For each finding give the file and line, what is wrong, why it matters and a suggested fix. Separate what you confirmed by running something from what you concluded by reading. If a category has no findings, say so in one line.
```

## What a Good Result Looks Like

- Each finding points at a line you can open, and the line says what the finding claims.
- Findings are sorted, and the serious ones come first. A long list of style notes with nothing serious is a weak review.
- It says which findings it confirmed by running code.
- No file changed. A reviewer that edits is no longer reviewing.
- You verify each finding yourself. A finding is a lead, and Claude can be wrong.

Imagine a Trail Notes change that fixes search by lowercasing inside the shared `normalize` helper. A good review catches that `addNote` now stores every title in lowercase and that several checks in `notes.check.mjs` fail.

The bundled `/code-review` skill gives a second opinion. Compare its findings with this list and look hardest at the differences.

## Variations

### Security Pass

```prompt
Review [diff] only for security problems: unsanitized input reaching the page, secrets in code or logs, unsafe shell commands, and new network calls. For each, say how it could be triggered.
```

### Review Against a Spec

```prompt
Read [spec file], then review [diff] against it. List each requirement as met, partly met or missing, with the file and line that shows it.
```

### Review Only the Checks

```prompt
Review only the check files in [diff]. Would each one fail without the change it covers? Does it test behavior or just mirror the implementation? List any that cannot fail.
```
