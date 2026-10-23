---
title: Fix a Bug from a Report
id: RC03
area: recipes
level: 2
time: 8
tags: [recipe, bugs]
verified: 2026-10-22
status: verified
sources:
  - https://code.claude.com/docs/en/common-workflows
  - https://code.claude.com/docs/en/best-practices
  - https://code.claude.com/docs/en/desktop#run-a-session-in-its-own-worktree
  - https://code.claude.com/docs/en/desktop#review-changes-with-diff-view
  - https://docs.python.org/3/library/http.server.html
related: [D05, D07, R05, R04]
---

A bug report describes a symptom and rarely a cause. This recipe turns a vague report into a reproduction, a failing check, a minimal fix and a pull request that says what was and was not verified. It uses the seeded bug in the Trail Notes starter.

## When to Use It

Use it whenever someone says "this doesn't work" and you have to find out why. It is also the fix you make in [Capstone 1](../../capstones/capstone-1-fix-and-review.md). You need the Trail Notes folder from [Start a New Project](start-a-new-project.md).

## Steps

1. **Write** the report in three parts: what the person did, what they expected, and what happened instead. Notice what is missing. The best-practices guide asks for the symptom, the likely location and what "fixed" looks like, and a report rarely has all three.
2. **Start** a session in its own worktree. Click **+ New**, click the project folder control in the row under the prompt box and turn on **Worktree**, so the fix lives on its own branch ([One Branch per Change](../process/one-branch-per-change.md)).
3. **Reproduce** the problem before you change anything. The docs advise giving Claude the command that reproduces the issue. If a check already fails, that check is your reproduction. If none does, ask Claude to write one first.

    ```prompt
    Here is a bug report: "I searched for a word that is definitely in my note and got no results. I typed it in lowercase." Run node checks/run.mjs and show me the output. If no check reproduces the report, write a failing one first. Do not fix anything yet.
    ```

4. **Find** the cause. Ask for an explanation and no edit. For a change with real uncertainty you can choose **Plan** in the mode selector under the prompt box, which lets Claude read and propose without editing your source.

    ```prompt
    Read searchNotes in notes.js and the failing checks. Explain the root cause in two or three sentences and name the line. Do not edit anything.
    ```

5. **Fix** the root cause with a small change. The guide's advice is to address the root cause and to avoid suppressing the error.

    ```prompt
    Fix searchNotes in notes.js so it matches title and body ignoring case. Change only what the fix needs, fix the cause and do not special-case the check's inputs, and do not edit any check. Then run node checks/run.mjs and show me the whole output.
    ```

6. **Verify** with evidence, and read the whole run, including the checks you were not chasing. A shortcut can turn a passing check red, and only the full run shows it. Then repeat the report's own steps in the page. The starter's README explains how to serve the folder, because browsers often refuse to load modules from a double-clicked file.

    > **Terminal tip**
    > `python3 -m http.server 8000` serves the current folder at `http://localhost:8000` until you press Control+C. Open that address, add a note, and search for it using different capitals. Python's documentation covers the `http.server` module.
    >
    > ```terminal
    > python3 -m http.server 8000
    > ```

7. **Review** the diff in the **Changes** pane. Confirm that the change is small and that the check files are untouched. If a check changed, find out why.
8. **Open** a pull request. Ask Claude to commit with a descriptive message and open it, and use the [pull request template](../../templates/pr-body.md) so the body separates what was verified from what was not. The commands are in [Pull Requests That Review Fast](../process/pull-requests-that-review-fast.md).

    ```prompt
    Commit this with a descriptive message and open a pull request. In the body, list under "Verified" only commands you ran and what they printed, and under "Not verified" what I should still check myself.
    ```

## Worked Example

The starter has a seeded bug: `searchNotes` matches case-sensitively, so two checks in `checks/search.check.mjs` fail until it matches title and body ignoring case.

1. Report, in three parts. Did: typed a lowercase word that appears in a note. Expected: the note in the results. Got: no results.
2. Reproduction: `node checks/run.mjs` fails before you touch any code. The output includes lines like these, and the last line reads `10 passed, 2 failed`:

    ```text
    FAIL  search > finds a title typed in a different case: lowercase query (got [], expected ["Trail map"])
    FAIL  search > finds text in the body in any case: body, mixed case (got [], expected ["Trail map"])
    ```

3. Cause: the function compares the query with the title and body as typed, so capitals decide the result.
4. Fix: compare in one case, in `searchNotes`. Claude changes the function, and you read the full run to see that no other check turned red.
5. Verification: the run ends with `12 passed, 0 failed`. You also served the page and searched with mixed capitals.
6. Pull request: the body says the two checks failed before and passed after, that you tried the page in one browser, and that accented letters were not tested.

Compare your change with the `capstone-1` solution in [the solutions folder](../../exercises/trail-notes-solutions/README.md). Yours does not need to match line for line, and the checks tell you whether it works.

## Pitfalls

- Trusting the report's diagnosis. "Search is broken" says where the person looked, and the cause can be elsewhere.
- Making a check pass by editing the check or by special-casing its inputs. The check is the evidence, so changing it removes the evidence.
- Reading only the check you were chasing. Run the whole suite every time.
- Bundling a refactor with the fix. Reviewers cannot approve half a pull request, and a revert takes both.
- Reporting done after reading the diff and never running the checks. Ask for the command and its output.
- Writing "tested" in the pull request when you only ran the checks. Say which.

## Checkpoint

The failing checks pass after your fix. Is the report resolved?

<details><summary>Show the answer</summary>

The checks show that the cases they cover work. The report came from someone using the page, so repeat the steps from the report in the page as well, and say in the pull request body whether you did.

</details>
