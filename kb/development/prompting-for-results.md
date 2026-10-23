---
title: Prompting for Results
id: D01
area: development
level: 1
time: 8
tags: [prompting]
verified: 2026-10-23
status: verified
sources:
  - https://code.claude.com/docs/en/best-practices
  - https://code.claude.com/docs/en/common-workflows
  - https://code.claude.com/docs/en/desktop
related: [D02, P01, TS02, D07]
---

A good prompt states the goal, the constraints and how you will know it worked. Attach the files and screenshots Claude needs, ask for a plan before a big change, and correct early in small steps.

## When to Use It

Use this routine for any task that will change files, and again whenever Claude's first answer misses. A vague prompt is fine while you are exploring and can afford to steer. Once you know what you want, a specific prompt saves rounds of correction.

## Steps

1. **Type** the goal as an outcome and say where it applies. "Searching in Trail Notes misses notes whose case differs from the query" gives Claude more to work with than "fix search".
2. **Add** constraints: files that must not change, libraries to avoid, an existing file whose pattern to copy. The best practices page lists pointing to existing patterns as one way to scope a prompt.
3. **Say** how you will know it worked. Name a check Claude can run, such as `node checks/run.mjs`, and ask it to show the output. A check Claude can read closes the loop without you.
4. **Attach** context instead of describing it. Type `@` followed by a filename to add that file. Click the **+** button next to the prompt box to attach images, PDFs and other files, or drag them into the prompt. Right-click a file path in the chat, the diff viewer or the file pane and choose **Attach as context** to add it to your next prompt.
5. **Ask** for a plan first when the change touches several files or the approach is open. The best practices page suggests skipping the plan if you could describe the diff in one sentence. [Plan Mode: Think Before You Edit](./plan-mode-think-before-you-edit.md) covers the tool for this.
6. **Correct** early. Click the stop button to interrupt at once, or type a correction and press **Enter**. Claude reads the correction when its current action finishes and adjusts before its next step. Fix one thing per message.
7. **Run** `/clear` after two failed corrections on the same problem. The docs say a clean session with a better first prompt usually beats a long session full of failed attempts. Put what you learned into the new prompt.

## Worked Example

Open your copy of Trail Notes in the Code tab ([starter](../../exercises/trail-notes-starter/README.md)). The weak prompt is short:

```prompt
search is broken
```

Claude has to guess what is broken, where to look and what counts as fixed. The stronger version covers all of that:

```prompt
In Trail Notes, searchNotes in notes.js matches case-sensitively, so a search for "trail" misses a note titled "Trail Notes". Fix it so title and body match without regard to case. Change only searchNotes. Don't edit anything in checks/. Run node checks/run.mjs afterward and show me the output.
```

Watch the first reply. Claude should read `notes.js` and `checks/search.check.mjs`, change only `searchNotes`, and run the checks. If it edits `sortNotes` or touches a check file, interrupt and name the constraint it broke.

> **Pro tip**
> When your next message starts with "no, don't...", ask what the first prompt left out. In the author's transcripts, 27 of 2,881 prompts (about 1%) began with a word such as no, don't or stop, by a keyword count. The count is rough and says nothing about prompt quality, but a low rate suggests the constraints were usually in the first message.

## Pitfalls

- Pasting a long log into the prompt when an `@` reference to the file would do.
- Asking Claude to "investigate" with no scope. The docs warn that it may read hundreds of files and fill the context. Scope the question or hand it to a subagent.
- Correcting the same issue again and again. Each failed attempt stays in the context.
- Accepting "done" without output from a check Claude ran.
- Attaching a screenshot or pasting a log that contains a key or a token. See [Security Review Habits](./security-review-habits.md).

If Claude keeps ignoring a stated limit, see [Claude Ignores My Instructions](../troubleshooting/claude-ignores-my-instructions.md). To scope a whole app before prompting, see [Scoping an App Before You Build](../app-development/scoping-an-app-before-you-build.md). A check that Claude can run is the subject of [Test-Driven Development with Claude](./test-driven-development-with-claude.md). Ready-made wording lives in the [plan a change prompt](../../prompts/plan-a-change.md) and the [debug from an error prompt](../../prompts/debug-from-an-error.md).

## Checkpoint

You typed "make search better" and Claude rewrote three functions. What did the prompt lack?

<details><summary>Show the answer</summary>
It had no defined goal, so Claude chose its own meaning of "better", and it set no constraint on scope. Name the behavior you want, list what must not change, and add a check Claude can run so it can confirm the result itself.
</details>
