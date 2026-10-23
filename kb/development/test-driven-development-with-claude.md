---
title: Test-Driven Development with Claude
id: D07
area: development
level: 2
time: 9
tags: [tdd, testing]
verified: 2026-10-22
status: verified
sources:
  - https://code.claude.com/docs/en/common-workflows
  - https://code.claude.com/docs/en/best-practices
  - https://code.claude.com/docs/en/permissions
  - https://code.claude.com/docs/en/desktop
  - https://nodejs.org/api/assert.html
  - https://nodejs.org/api/test.html
related: [D05, P06, R04, D03]
---

Red, green, refactor works with Claude when you ask for one failing test first, run it to see it fail for the right reason, then ask for the smallest code that passes, then for a cleanup. Keep the tests in plain `node:assert` scripts, and tell Claude the tests are off limits while it makes them pass.

## When to Use It

Use test-first for new behavior and bug fixes where you can state the expected result as an assertion. The best practices page says a check Claude can run is the difference between a session you watch and one you walk away from. For a rough layout experiment, write the tests after the shape settles.

## Steps

1. **Prompt** for one failing test and no implementation. One test keeps the loop short.
2. **Run** it and read the failure. Confirm it fails for the right reason: the assertion about the new behavior, not a typo, a missing import or a wrong file name. This is the red step.
3. **Prompt** for the smallest change that makes the test pass. State that the test files are read-only for this step.
4. **Run** the whole suite. Green means this test and every older one pass.
5. **Review** the diff. In the green step, only source files should change. See [Reading and Reviewing Diffs](./reading-and-reviewing-diffs.md).
6. **Prompt** for a refactor with the suite as the guard, then run it again.
7. **Commit**, then start the next test.

To stop Claude from editing tests to make them pass, use these in order of strength:

- Say so in the prompt, every green step.
- Check the diff. Changes to `checks/` during a green step are a red flag.
- Split the roles. The best practices page describes one Claude writing tests and another writing code to pass them, in separate sessions.
- Add a deny rule. `Edit` rules cover all of Claude's built-in editing tools. In the Code tab the file pane shows `.claude/settings.json` as view-only, so right-click its path and choose **Open in** to edit it elsewhere.

```json
{
  "permissions": {
    "deny": ["Edit(/checks/**)"]
  }
}
```

The `/checks/**` pattern anchors at the project folder. The permissions page warns that deny rules do not cover arbitrary subprocesses that write files, so the diff review stays your real check. Remove the rule when you want Claude to write a new check.

Node ships the [assert module](https://nodejs.org/api/assert.html) and a built-in [test runner](https://nodejs.org/api/test.html). Trail Notes uses plain scripts with `node:assert` and its own runner, `checks/run.mjs`, so nothing needs installing.

## Worked Example

The Trail Notes starter already has a red check: the seeded case-sensitive search bug makes `checks/search.check.mjs` fail. Your first job is to confirm it fails for the right reason.

```prompt
Run node checks/run.mjs. Tell me which check fails and what its failing assertion expects, in one short paragraph. Don't edit anything.
```

The answer should say that a query in a different case than the note's text finds nothing. A syntax error or a missing file would be the wrong reason. Next, check coverage:

```prompt
Does search.check.mjs cover both a title match and a body match where the query's case differs from the note? If it covers only one, add a failing test for the other. Edit only search.check.mjs, run the checks, and show me the new test failing.
```

Now go green:

```prompt
Make the smallest change in notes.js so searchNotes matches title and body without regard to case. Don't edit anything in checks/. Run node checks/run.mjs.
```

Open the Changes pane. Only `notes.js` should differ in this step. Then refactor:

```prompt
If searchNotes can be made clearer without changing behavior, do that. Run the checks again.
```

Capstone 2 repeats the loop for tags. See [Capstone 2: Ship a Feature](../../capstones/capstone-2-ship-a-feature.md).

## Pitfalls

- A test that passes on its first run. It does not exercise the missing behavior, so fix the test before writing code.
- Asking for the test and the code in one prompt. Claude then shapes the test around code it has already imagined.
- Tests that check how the code works inside instead of what it returns.
- Many new tests at once. You lose the ability to see which one drives which change.
- Skipping the refactor step, so each green change leaves a little more mess.
- Believing the deny rule is airtight. It narrows the risk and does not remove the need to read the diff.

For choosing checks in a small app, see [Testing Without a Framework](../app-development/testing-without-a-framework.md). The [tests-first prompt](../../prompts/tests-first.md) has ready wording, and [Definition of Done and Gates](../process/definition-of-done-and-gates.md) shows how checks become gates.

## Checkpoint

You asked for a new test and it passed the first time you ran it, before any code change. What does that tell you?

<details><summary>Show the answer</summary>
The test does not exercise the behavior you want, or the behavior already exists. Rewrite or tighten the test until it fails for the right reason, because a test that cannot fail proves nothing.
</details>
