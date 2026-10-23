---
title: Code Review, Yours and Claude's
id: D08
area: development
level: 2
time: 8
tags: [code-review]
verified: 2026-10-23
status: verified
sources:
  - https://code.claude.com/docs/en/skills#bundled-skills
  - https://code.claude.com/docs/en/ultrareview
  - https://code.claude.com/docs/en/sub-agents
  - https://code.claude.com/docs/en/code-review-local
  - https://code.claude.com/docs/en/desktop
  - https://code.claude.com/docs/en/best-practices
related: [D03, R05, D09]
---

Review a change in layers: read your own diff in the Changes pane, run the bundled `/code-review` skill, and for a larger change ask a fresh subagent that has not seen your reasoning for an adversarial read. Treat every finding as a lead to verify, not a verdict.

## When to Use It

Review before you commit or open a pull request, especially when Claude wrote most of the change. The best practices page notes that the longer Claude works unattended, the more an independent check matters. For a small change, your own read plus `/code-review` is enough. Save the subagent read for changes that are large or risky.

## Steps

1. **Read** the diff yourself first, as described in [Reading and Reviewing Diffs](./reading-and-reviewing-diffs.md). You know the intent, and the reviewers see only the code.
2. **Type** `/code-review` in the prompt box. With no target it reviews your branch's commits ahead of its upstream plus your uncommitted changes. You can add a pull request number, a branch name or a path instead. `/review` is an alias. The review runs as a background subagent with its own context window, so you can keep working while the findings arrive in the conversation.
3. **Click** **Walk through in diff** on the **Code review** card to step through findings one at a time. A finding in the current diff appears at its line, where you can click **Fix this one** or dismiss it. Click **Apply fixes** to ask Claude to fix the findings that are still open.
4. **Verify** each finding before you act on it. Ask Claude for an input or a failing check that shows the problem.
5. **Prompt** a fresh subagent for an adversarial read when the change is substantial. The best practices page says a reviewer in a fresh subagent context sees only the diff and the criteria you give it, not the reasoning that produced the change, so it judges the result on its own terms.
6. **Run** the checks again after any fix, and look at the new diff.

You can pass an effort level, such as `/code-review low`. At `low` the review reports the findings it is most confident in, so you see fewer false positives. From `medium` through `max` it broadens coverage.

Ultrareview is the deeper cloud review. It is a research preview, so the feature, pricing and availability may change. The ultrareview page says the command is `/code-review ultra`, with `/ultrareview` as an alias where your account has it. It needs a claude.ai sign-in and typically takes 15 to 25 minutes. A launch dialog shows the scope and estimated cost first. The page lists 3 free runs on Pro and Max as a one-time allotment, then bills usage credits. Nothing in this course depends on it.

## Worked Example

After the case-insensitive search fix in Trail Notes, run the subagent read:

```prompt
Use a subagent to review the current diff in this folder. Tell it only this: searchNotes must match a note's title and body without regard to case, and nothing else should change. Ask it to report only gaps that affect correctness or that requirement, and to quote the line for each finding.
```

Limiting the criteria matters. The best practices page warns that a reviewer asked to find gaps will usually report some, even when the work is sound, and chasing every one leads to extra layers and defensive code.

Now treat each finding as a claim. Suppose the subagent says an input could make `searchNotes` throw. Do not fix it on its word:

```prompt
Write a check that makes searchNotes throw on that input. Run node checks/run.mjs and show me the failure.
```

If Claude cannot produce a failing check, mark the finding as not reproduced and move on. If it can, you have a real gap. Keep the failing check, then ask for the smallest fix, as in [Test-Driven Development with Claude](./test-driven-development-with-claude.md).

A second session works too. The best practices page describes a Writer and Reviewer pair, where the reviewing session has fresh context and no loyalty to code it just wrote.

## Pitfalls

- Acting on findings you have not reproduced, or ignoring all of them because some are wrong.
- Asking the session that wrote the code to grade it. It remembers why it chose each line.
- Unscoped reviewer prompts. Without a bar such as correctness and the stated requirement, you get a long list of style notes.
- Using `--fix` without reading the result. A background review applies its fixes outside your session's checkpoints, so `/rewind` restores only files Claude had already edited. Use git to revert the rest.
- Paying for an ultrareview by reflex. Read the cost in the launch dialog before you confirm.
- Expecting review to replace tests or, for sign-in, payment and deletion code, your own line-by-line read. See [Security Review Habits](./security-review-habits.md).

[Pull Requests That Review Fast](../process/pull-requests-that-review-fast.md) covers what to give a human reviewer. The [review a diff prompt](../../prompts/review-a-diff.md) has ready wording.

## Checkpoint

A review finding says a function can fail on an unusual input. What do you do before accepting it?

<details><summary>Show the answer</summary>
Reproduce it. Ask Claude for a failing check or a concrete input that shows the problem. If it cannot produce one, treat the finding as unconfirmed. If it can, keep the failing check and fix against it.
</details>
