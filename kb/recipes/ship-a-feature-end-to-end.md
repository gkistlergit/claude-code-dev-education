---
title: Ship a Feature End to End
id: RC02
area: recipes
level: 2
time: 10
tags: [recipe, feature]
verified: 2026-10-23
status: verified
sources:
  - https://code.claude.com/docs/en/desktop#monitor-pull-request-status
  - https://code.claude.com/docs/en/desktop#run-a-session-in-its-own-worktree
  - https://code.claude.com/docs/en/desktop#review-changes-with-diff-view
  - https://code.claude.com/docs/en/desktop#review-your-code
  - https://code.claude.com/docs/en/best-practices
  - https://cli.github.com/manual/gh_pr_create
  - https://cli.github.com/manual/gh_pr_merge
related: [R01, R05, A08, R02, R03]
---

This recipe adds tags to Trail Notes, from a spec to a merged pull request, using each step of [The Idea-to-Deploy Flow](../process/the-idea-to-deploy-flow.md) in the Code tab. It is the recipe behind [Capstone 2](../../capstones/capstone-2-ship-a-feature.md).

## When to Use It

Use it when you want to practice the whole loop on a small feature. You need the Trail Notes folder from [Start a New Project](start-a-new-project.md) with a GitHub remote, and a green baseline. The starter fails two checks on purpose, so fix them first with [Fix a Bug from a Report](fix-a-bug-from-a-report.md), or start from the `capstone-1` solution in [the solutions folder](../../exercises/trail-notes-solutions/README.md).

## Steps

1. **Run** `node checks/run.mjs` on `main` in the **Terminal** pane. Every check must pass before you begin. If one fails, stop and fix it, so you know later that any failure came from your change.
2. **Grill** the idea in a new session and write the spec and plan. This is the interview from [Grill, Spec, Tickets](../process/grill-spec-tickets.md).

    ```prompt
    I want to add tags to Trail Notes. Interview me using the AskUserQuestion tool about behavior, edge cases, data people already have, and what is out of scope. When the decisions are explicit, write SPEC.md, then split it into PLAN.md with tickets that say what blocks what. Tickets 1 and 2 are the notes.js changes: addNote accepts tags, and filterByTag(notes, tag). Ticket 3 wires tags into the page.
    ```

3. **Start** the build in its own worktree. Click **+ New** in the sidebar, click the project folder control in the row under the prompt box, and turn on **Worktree**. Use a fresh session so the interview does not crowd the build. See [One Branch per Change](../process/one-branch-per-change.md).
4. **Prompt** for the failing check first, and make Claude show it failing.

    ```prompt
    Read SPEC.md and PLAN.md. For tickets 1 and 2 only, add checks/tags.check.mjs in the same style as checks/search.check.mjs. Do not change notes.js yet. Run node checks/run.mjs and show me the output. The new checks should fail.
    ```

5. **Prompt** for the change to `notes.js`, and make Claude show the checks passing.

    ```prompt
    Now change notes.js so addNote accepts tags and add filterByTag(notes, tag) as SPEC.md describes. Change nothing else. Run node checks/run.mjs and show me the output, then commit with a message that names tickets 1 and 2.
    ```

6. **Prompt** for ticket 3, the page. Then try it yourself.

    ```prompt
    Now do ticket 3 from PLAN.md: add a tags field to the form and a filter control to the page, and make sure notes saved before tags existed still load. Touch only index.html, style.css and app.js. Run node checks/run.mjs, then commit with a message that names ticket 3.
    ```

    > **Terminal tip**
    > `python3 -m http.server 8000` serves the current folder at `http://localhost:8000` until you press Control+C. Open that address, add a note with a tag, and filter by it.
    >
    > ```terminal
    > python3 -m http.server 8000
    > ```

7. **Review** the diff. Click **Changes** in the title bar and read every file. Then ask for a second opinion in a fresh context, as the best-practices guide suggests.

    ```prompt
    Use a subagent to review this diff against PLAN.md. Check that every requirement in tickets 1 to 3 is implemented, that the edge cases in SPEC.md have checks, and that nothing outside the tickets changed. Report gaps that affect correctness or the spec, and skip style preferences.
    ```

    You can also run `/code-review` and use its **Code review** card. See [Reading and Reviewing Diffs](../development/reading-and-reviewing-diffs.md).

8. **Open** the pull request. Ask Claude to "create a pr", and have it write the body from the [pull request template](../../templates/pr-body.md), with "Verified" and "Not verified" kept apart.

    > **Terminal tip**
    > If you prefer to run it yourself, `git push -u origin` pushes the branch and sets its upstream, and `gh pr create` opens the pull request. Replace `tags` with your branch name, which carries your **Branch prefix** if you set one.
    >
    > ```terminal
    > git push -u origin tags
    > gh pr create --title "Add tags to notes" --body-file ../pr-body.md
    > ```

9. **Watch** CI. After the pull request opens, the **Changes** card shows the status of its checks. If you added the workflow from [CI That Gates the Deploy](../process/ci-that-gates-the-deploy.md), wait for it. If you did not, say in the body that the checks ran locally only.
10. **Merge** once the checks pass and you have read the diff. You can merge on GitHub, or pin the commit you checked.

    > **Terminal tip**
    > `gh pr view --json headRefOid` prints the commit at the head of the pull request. `gh pr merge --merge --match-head-commit` merges it only if the head is still that commit. Replace `12` and `<sha>` with your own values.
    >
    > ```terminal
    > gh pr view 12 --json headRefOid
    > gh pr merge 12 --merge --match-head-commit <sha>
    > ```

11. **Clean up** the same day: archive the session, then remove the worktree and branch as shown in [One Branch per Change](../process/one-branch-per-change.md).

## Worked Example

The pull request body for the whole feature might read:

```md
## What changed
`addNote` accepts an optional `tags` array that defaults to an empty array. New `filterByTag(notes, tag)` returns the notes that carry the tag, ignoring capitals and spaces in the tag you pass, and returns every note when the tag is empty. The page has a tags field on the form and a filter control. Notes saved before tags existed load with no tags.

## Verified
- `node checks/run.mjs`: the new checks in `tags.check.mjs` failed before the change and pass after it. All earlier checks still pass.
- I served the page, added a note tagged "trail", and filtered by "Trail". The note appeared.

## Not verified
- The page on a phone.
- A list with many notes.
- CI is not set up for this repository, so the checks ran on my machine only.

## For the reviewer
Tags are stored trimmed and lowercase, so the filter compares like with like. Should the page show them as typed?
```

Compare your result with the `capstone-2` solution in [the solutions folder](../../exercises/trail-notes-solutions/README.md). Details such as how tags are cleaned and how the filter control gets its list of tags may differ from yours, and the checks tell you whether yours works.

## Pitfalls

- Writing the check after the change. A check that never failed has not shown it can fail, so you cannot tell whether it checks anything.
- Letting the session edit files that no ticket names. The diff review exists to catch scope creep.
- Merging without CI and without saying so. Put it in "Not verified".
- Skipping the fresh session. The interview fills the context with discussion that the build does not need.
- Forgetting the old data. People who already use the app have notes without tags, and a change that breaks loading them loses their work.
- Forgetting the cleanup. A merged branch with a live worktree is how stale worktrees start.

## Checkpoint

Why does step 4 ask Claude to show the new checks failing?

<details><summary>Show the answer</summary>

A check you have seen fail is a check that can fail. If it passes before the change exists, it is not testing the change, and you want to learn that before you rely on it.

</details>
