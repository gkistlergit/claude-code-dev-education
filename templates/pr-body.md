---
title: Pull Request Body Template
kind: template
order: 8
verified: 2026-10-22
sources:
  - https://code.claude.com/docs/en/common-workflows
  - https://code.claude.com/docs/en/desktop
  - https://cli.github.com/manual/gh_pr_create
---

A pull request body tells a reviewer what changed, why, and how you know it works. Paste this into the description box on GitHub, or save it as a file and pass it with `gh pr create --body-file pr-body.md`. If you ask Claude to create the pull request, give it this template and the facts to fill in.

## Template

```md
## Summary
[One or two sentences: what changed and why.]

## Changes
- [A change, with the file or area it touches.]
- [Another change.]

## How I Verified
- Ran `[command]`: [result].
- Not verified: [what you did not check, and why].

## Risk and Rollback
[What could break, who would notice, and how to undo the change.]

## Questions for Reviewers
- [A decision you want input on. Delete this section if there is none.]

Fixes #[issue number]
```

## How to Adapt It

- Write the Summary last, in plain words. A reviewer who reads only that line should know what to expect in the diff.
- List commands you actually ran, with the result. If the project has checks, name them and say they passed. In Trail Notes, that is `node checks/run.mjs`.
- Keep Not verified even when it is short. "Not tried in a real browser" tells the reviewer where to look.
- `Fixes #123` on its own line closes issue 123 when the pull request merges. Delete the line when there is no issue.
- Keep one purpose per pull request. If the Changes list has two unrelated groups, split them, because small pull requests review faster.
- To have Claude draft the body, give it the diff, the commands you ran and their results, and this template. The docs advise reviewing the pull request Claude generates before you submit it, and asking Claude to point out risks. The [Write a PR Body prompt](../prompts/write-a-pr-body.md) has a ready wording.
- In the desktop app, the Changes card shows the pull request's check status after you open it. **Auto-fix** and **Merge when ready** sit in the same card's menu. See [Pull Requests and Auto-fix](../kb/app/pull-requests-and-auto-fix.md).

## Common Mistakes

- Claiming checks passed that were not run. Write what you ran, or write Not verified.
- A Summary that repeats the diff line by line. The reviewer can already read the diff, so give the reason for it.
- Leaving placeholders in square brackets. Search the text for `[` before you submit.
- Hiding the risky part. Name it under Risk and Rollback so the reviewer looks there first.
- Mixing in questions that need a decision. Put them under Questions for Reviewers, and mark the pull request as a draft if you cannot merge until they are answered.
- Pasting a long log. Link to it or quote the one failing line.

See [Pull Requests That Review Fast](../kb/process/pull-requests-that-review-fast.md).
