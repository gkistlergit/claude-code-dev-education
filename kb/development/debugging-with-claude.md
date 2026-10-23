---
title: Debugging with Claude
id: D05
area: development
level: 2
time: 8
tags: [debugging]
verified: 2026-10-22
status: verified
sources:
  - https://code.claude.com/docs/en/common-workflows
  - https://code.claude.com/docs/en/skills#bundled-skills
  - https://code.claude.com/docs/en/commands
  - https://code.claude.com/docs/en/best-practices
  - https://code.claude.com/docs/en/desktop
  - https://code.claude.com/docs/en/checkpointing
related: [D07, P06, TS04, D03]
---

Debug in a fixed order: reproduce the failure, give Claude the exact error and how to trigger it, ask for ranked hypotheses before any edit, make the smallest fix, and leave a regression test behind. The bundled `/debug` skill is a different tool, and the first section below explains what it does.

## When to Use It

Use this routine for an error message, a failing check, or behavior that differs from what you expected. It also applies when the failure comes and goes. The common workflows page says to tell Claude whether the error is consistent or intermittent, and what steps trigger it.

## Steps

1. **Reproduce** the failure yourself and write down the exact command or clicks. If you cannot trigger it, neither you nor Claude can confirm a fix.
2. **Prompt** with the symptom: the exact error text, how to trigger it, what you expected, and whether it is consistent. Paste the error or attach a screenshot instead of paraphrasing.
3. **Ask** for hypotheses ranked by likelihood, each with the evidence that would confirm or rule it out. Tell Claude not to change any files yet.
4. **Choose** the most likely hypothesis and ask Claude to confirm it with evidence first. That means reading the code path, running the command, or adding a temporary log.
5. **Prompt** for the smallest fix that addresses the root cause. The best practices page says to fix the cause and not suppress the error.
6. **Run** the check that failed, then the whole suite.
7. **Add** a regression test, which is a check that fails without the fix and passes with it. Prove that by reverting the fix for one run.
8. **Review** the diff as described in [Reading and Reviewing Diffs](./reading-and-reviewing-diffs.md), then commit.

The bundled `/debug` skill turns on debug logging for the current Claude Code session and reads the session debug log. You can add a description to focus the analysis. It targets problems with Claude Code itself. The checkpointing page, for example, points to it when a rewind skips files. It does not hunt for bugs in your own code. Logging is off by default, so `/debug` run mid-session captures from that point on. To see why Claude took a particular action, switch the transcript to Verbose with **Ctrl+O**.

> **Terminal tip**
> `claude --debug` starts a session with debug logging already on, so `/debug` does not miss the early events.
>
> ```terminal
> claude --debug
> ```

## Worked Example

Use the seeded bug in Trail Notes (see the [starter](../../exercises/trail-notes-starter/README.md)). Open the **Terminal** pane and run the checks:

```terminal
node checks/run.mjs
```

`node` runs a JavaScript file, and `checks/run.mjs` is the runner that executes every check. The output should point at `checks/search.check.mjs` as the failing check. That is your reproduction. Now ask for hypotheses:

```prompt
node checks/run.mjs fails in checks/search.check.mjs. I expect searchNotes to match a note's title and body without regard to case. Read the check and notes.js, then give me hypotheses ranked by likelihood, each with the evidence that would confirm it. Don't edit anything yet.
```

Look for a top hypothesis that names a comparison inside `searchNotes` treating upper and lower case as different, backed by the assertion that fails. If Claude ranks a guess about sorting or ids first, ask what evidence rules it out. Then confirm and fix in one prompt:

```prompt
Go with the first hypothesis. Show me the line in searchNotes that makes the comparison and the assertion in search.check.mjs that fails because of it. Then make the smallest change in notes.js so title and body match without regard to case. Don't edit anything in checks/. Run node checks/run.mjs.
```

The seeded check is already your regression test. Prove it works:

```prompt
Temporarily revert your change to notes.js and run node checks/run.mjs so I can see search.check.mjs fail again. Then restore the fix and run the checks once more.
```

The final diff should touch `notes.js` only. The [capstone 1 solution](../../exercises/trail-notes-solutions/README.md) has the bug fixed if you want to compare.

## Pitfalls

- Letting Claude fix a bug it has not reproduced. A fix with no failing run to compare against is a guess.
- Accepting a change that hides the symptom, such as a try/catch that swallows the error.
- Taking a large rewrite as the fix. Ask for the smallest change that works.
- Skipping the regression test. The bug returns the next time someone touches the code.
- Letting Claude edit the failing check to make it pass. See [Test-Driven Development with Claude](./test-driven-development-with-claude.md).
- Correcting the same fix three times in one session. After two misses, `/clear` and write a better first prompt, as [Prompting for Results](./prompting-for-results.md) describes.

If the failure is an API or retry error from Claude Code itself, see [Errors and Retries](../troubleshooting/errors-and-retries.md). For writing checks without a framework, see [Testing Without a Framework](../app-development/testing-without-a-framework.md).

## Checkpoint

Why ask for ranked hypotheses before Claude edits anything?

<details><summary>Show the answer</summary>
Claude's first guess can be wrong. A ranked list with evidence lets you test the guess before a fix hides the real cause, and it keeps the eventual change small.
</details>
