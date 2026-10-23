---
title: Write a PR Body
kind: prompt
order: 6
verified: 2026-10-22
---

Use this when a branch is ready for review and you want a pull request description a reviewer can trust. It asks Claude to read the diff, report only what it actually ran, and say what was not checked. [Pull Requests That Review Fast](../kb/process/pull-requests-that-review-fast.md) explains why that last part matters.

## Prompt

```prompt
Write the pull request body for [branch] against [base branch]. Read the full diff and the commit messages first. Do not open the pull request. Show me the text.

Use these sections:
- What changed: two to four plain sentences.
- Why: the problem or request behind it, with a link if there is one.
- How I checked it: the exact commands you ran and what they printed. Do not write "tests pass" without naming the command.
- What I did not check: anything untested, manual steps still to do, and anything you are unsure about.
- Risks and rollback: what could go wrong and how to undo it.
- Questions for the reviewer: only real decisions.

Only claim what you ran or read in this session. Use plain words and do not praise the change.
```

## What a Good Result Looks Like

- The description matches the diff. Every file it mentions is in the change, and no change is missing from it.
- The checking section lists commands you can repeat and results that match what you see when you run them.
- "What I did not check" has real content. An empty section on a nontrivial change means something was skipped.
- It reads in a minute. A small change gets a short body.
- You edit it before posting. The text is a draft for you to confirm.

For the Trail Notes tags change, expect the body to name `node checks/run.mjs` with its summary line, to say the tag filter was or was not tried in a browser, and to flag that notes saved before tags existed load with an empty tag list.

## Variations

### A Tiny Change

```prompt
Write a two-sentence pull request body for [branch]: what changed and how I checked it. Name the command.
```

### A Visible Change

```prompt
Write the pull request body for [branch]. Include a section called How to see it: the steps to open the page and the exact thing to look for. List the screenshots I should attach, and do not describe a screenshot you have not seen.
```

### A Follow-up

```prompt
Write the pull request body for [branch], which follows [earlier pull request or commit]. Say what that change left undone and which parts of this one finish it.
```
