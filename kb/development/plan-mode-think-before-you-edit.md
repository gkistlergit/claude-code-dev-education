---
title: Plan Mode: Think Before You Edit
id: D02
area: development
level: 1
time: 6
tags: [plan-mode, permissions]
verified: 2026-10-22
status: verified
sources:
  - https://code.claude.com/docs/en/permission-modes#analyze-before-you-edit-with-plan-mode
  - https://code.claude.com/docs/en/commands
  - https://code.claude.com/docs/en/desktop
  - https://code.claude.com/docs/en/best-practices
  - https://code.claude.com/docs/en/model-config
  - https://code.claude.com/docs/en/interactive-mode
  - https://code.claude.com/docs/en/context-window
related: [A05, DG02, D03, R02, DG01]
---

Plan mode makes Claude read your project and propose a plan before it edits anything. In the Code tab you choose Plan in the mode selector under the prompt box. The author never uses it and plans with Claude's task list and written specs instead, so this page shows both routes and when each fits.

## When to Use It

Plan mode pays off when you are unsure of the approach, when the change touches several files, or when the code is unfamiliar. The best practices page says to skip planning when you could describe the diff in one sentence. [Plan Mode or Not](../decision-guides/plan-mode-or-not.md) has the full comparison.

## Steps

1. **Click** the mode selector in the row under the prompt box and choose **Plan**. Press **Cmd+Shift+M** to open the permission mode menu from the keyboard. In the desktop app, **Shift+Tab** does not cycle modes. A mode you pick is remembered per folder, except Plan, which applies to the current session only.
2. **Prompt** with the goal and ask for a plan, not an edit:

   ```prompt
   I want to add tags to Trail Notes: addNote should accept tags, and a new filterByTag(notes, tag) should return the matching notes. Read the project and propose a plan. List the files that change, the order of the steps and the check that proves each step. Don't edit anything yet.
   ```

3. **Read** the plan. In plan mode Claude reads files and can run shell commands to explore, but it does not edit your source. Which commands need your approval depends on the session; the permission modes page explains the cases.
4. **Choose** how to proceed. The permission modes page prints these options: **Yes, and use auto mode**, **Yes, manually approve edits** and **No, keep planning**. If auto mode is unavailable, the first reads **Yes, auto-accept edits**. Approving ends plan mode and switches to the mode the option names. The labels come from the permission modes page, which does not single out the desktop app, so the prompt there may look different.
5. **Open** the Changes pane when Claude finishes and review the result, as in [Reading and Reviewing Diffs](./reading-and-reviewing-diffs.md).

> **Terminal tip**
> `claude --permission-mode plan` starts a session in plan mode. Inside a session, `/plan` followed by a description enters plan mode and starts on that task, and **Shift+Tab** cycles modes. Press **Ctrl+G** to open the proposed plan in your text editor before Claude proceeds. The model alias `opusplan` uses Opus while planning and Sonnet while executing.
>
> ```terminal
> claude --permission-mode plan
> ```

## Worked Example

The tags change is a good candidate for planning because it touches more than one file. Two routes reach the same place.

Route A is plan mode, as in Steps. Claude's plan stays in the session. According to the context window page, the plan Claude wrote in plan mode is re-injected from disk after compaction.

Route B is the author's setup, which never enters plan mode. The audit shows planning through the app's task list and through grilling and spec-writing skills. You can copy the idea without those skills. Start with an interview:

```prompt
I want to add tags to Trail Notes. Interview me about the hard parts first: how tags are entered, how filtering should behave and what happens to notes that already exist. Ask one question at a time. When the decisions are settled, write them to SPEC.md.
```

Then ask Claude to keep a task list while it works, and run the build in a fresh session that starts from `SPEC.md`. The [spec template](../../templates/spec.md) shows a shape for the file, and [Grill, Spec, Tickets](../process/grill-spec-tickets.md) covers the habit in full.

| | Plan mode | Task list and spec |
|---|---|---|
| Edits blocked until you approve | Yes | No |
| Where the plan lives | In the session | In a file you can reuse |
| Best for | An open approach in one sitting | Decisions that outlive the session |

The task list is Claude's own checklist of pending, in-progress and complete items. It fills only when the session has the task-tracking tools. Claude Code provides them by default on older models and leaves them out on newer ones unless you opt in, as the [tools reference](https://code.claude.com/docs/en/tools-reference#task-tool-availability) explains.

## Pitfalls

- Approving a plan without reading it. Plan mode only protects you if you read what it proposes.
- Planning a one-sentence change. The overhead costs more than the plan saves.
- Treating a task list or spec as a gate. Only plan mode blocks edits until approval; with the other route, pair it with Manual mode if you want that gate.
- Accepting a plan that names no checks. Ask for the check that proves each step.
- Expecting Plan to stick. It applies to the current session only.

## Checkpoint

You want a proposal first and you also want edits blocked until you approve. Which route gives you that?

<details><summary>Show the answer</summary>
Plan mode. A task list and a written spec guide Claude but do not stop it from editing. Cmd+Shift+M opens the permission mode menu in the Code tab.
</details>
