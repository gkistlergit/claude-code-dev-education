---
title: Pull Requests That Review Fast
id: R05
area: process
level: 2
time: 7
tags: [pull-requests]
verified: 2026-10-23
status: verified
sources:
  - https://code.claude.com/docs/en/desktop#monitor-pull-request-status
  - https://code.claude.com/docs/en/desktop#review-changes-with-diff-view
  - https://code.claude.com/docs/en/desktop#review-your-code
  - https://code.claude.com/docs/en/best-practices
  - https://code.claude.com/docs/en/common-workflows
  - https://cli.github.com/manual/gh_pr_create
  - https://cli.github.com/manual/gh_pr_checks
related: [A08, D08, R06, R04]
---

A pull request reviews fast when the diff is small, the body says what changed and what was checked, and you have already read the diff yourself. Claude can draft the body and run a review pass. You still read the Changes pane before anyone else does.

## When to Use It

Use this for every pull request, including ones you will merge yourself. The reviewer might be a teammate, a future you, or a `/code-review` pass, and each of them reads faster when the pull request answers their questions up front.

## Steps

1. **Check** the size of the change. If the diff carries two ideas, split it into two branches (see [One Branch per Change](one-branch-per-change.md)).

    > **Terminal tip**
    > `git diff --stat main...HEAD` lists the files your branch changed and how many lines moved. Three dots compare your branch with the point where it left main.
    >
    > ```terminal
    > git diff --stat main...HEAD
    > ```

2. **Open** the diff by clicking **Changes** in the session's title bar, and read every file. Click a line, type your comment and press **Enter** to add it. After you have commented on several lines, press **Cmd+Enter** to submit them all at once. Claude reads them and makes the changes, which appear as a new diff. See [Reading and Reviewing Diffs](../development/reading-and-reviewing-diffs.md).
3. **Run** `/code-review` in the prompt box. In a local session the findings arrive as a **Code review** card grouped by file. Click **Walk through in diff** to step through them, use **Fix this one** on a finding you agree with, or click **Apply fixes** to fix the open ones. The best-practices guide notes that a reviewer asked to find gaps will usually report some, so fix findings that affect correctness and leave style opinions alone.
4. **Prompt** Claude to write the body from the [pull request template](../../templates/pr-body.md). Tell it to separate what it ran from what it did not.

    ```prompt
    Write the pull request body for this branch using templates/pr-body.md. Under "Verified" list only commands you ran in this session and what they printed. Under "Not verified" list everything I should still check myself.
    ```

5. **Create** the pull request. You can ask Claude to "create a pr", or run it yourself.

    > **Terminal tip**
    > `gh pr create` opens a pull request from your current branch. `--title` and `--body-file` fill in the text without prompts. If the branch is not pushed, `gh` asks where to push it. Keep the body file outside the repository, or delete it afterward.
    >
    > ```terminal
    > gh pr create --title "Fix case-sensitive search" --body-file ../pr-body.md
    > ```

6. **Watch** the checks. After you open a pull request, the **Changes** card shows the status of its CI checks. Open the **⋮** menu beside its title to turn on **Auto-fix**, which has Claude fix failing checks, or **Merge when ready**, which turns on GitHub's auto-merge. PR monitoring needs the GitHub CLI (`gh`) installed and signed in on your machine.

    > **Terminal tip**
    > `gh pr checks --watch` prints the status of the current branch's checks and keeps refreshing until they finish.
    >
    > ```terminal
    > gh pr checks --watch
    > ```

7. **Reply** to review comments on the pull request itself, and push fixes as new commits so the reviewer can see what changed since their last look. For more on the app's side of this, see [Pull Requests and Auto-fix](../app/pull-requests-and-auto-fix.md).

## Worked Example

You fixed the case-sensitive search in Trail Notes. The body Claude drafts, after you remove what you cannot stand behind:

```md
## What changed
`searchNotes` in `notes.js` now matches the query against title and body ignoring case. No other function changed.

## Why
A search typed in a different case than the note did not match it. `checks/search.check.mjs` was failing for that reason.

## Verified
- `node checks/run.mjs` before the change: `search.check.mjs` failed.
- `node checks/run.mjs` after the change: all checks passed.

## Not verified
- I did not open the page in a browser or on a phone.
- I only tried plain English letters.

## For the reviewer
Does lowercasing both sides behave the way you expect for accented letters? I did not test them.
```

Notice that "Not verified" is specific, and that the last section hands the reviewer one decision. A body like this lets a reviewer approve in minutes because the diff, the evidence and the open question are all on the page.

## Pitfalls

- A body that repeats the diff in words. The reviewer can read the diff, so give them the reason for it and the evidence.
- A "Verified" list that includes things nobody ran. Claude will write plausible lines unless you tell it to list only commands it ran.
- Reviewing in the same session that wrote the change. A fresh context reviews better because it is not biased toward code it just wrote, and `/code-review` runs the review in a fresh subagent.
- Letting **Auto-fix** push changes you never read. Check the **Changes** card after it acts.
- One pull request that mixes a bug fix and a refactor. Reviewers cannot approve half of it.

## Checkpoint

What two lists should every pull request body keep apart, and why?

<details><summary>Show the answer</summary>

What was verified and what was not. Keeping them apart tells the reviewer where to spend attention, and it stops "I assume this works" from reading as "I ran this."

</details>
