---
title: Plan Mode or Not
id: DG02
area: decision-guides
level: 1
time: 5
tags: [decision, plan-mode]
verified: 2026-10-23
status: verified
sources:
  - https://code.claude.com/docs/en/permission-modes#analyze-before-you-edit-with-plan-mode
  - https://code.claude.com/docs/en/best-practices
  - https://code.claude.com/docs/en/interactive-mode
related: [D02, DG01, R02]
---

Use plan mode when the approach is uncertain or the change spans several files. Skip planning when you could describe the diff in one sentence. Use a task list or a written spec when the plan should outlive the session or when you want to work without plan mode's approval step.

## When to Use It

Decide before any task bigger than a typo. The question is what being wrong about the approach would cost. The author never enters plan mode and plans with Claude's task list (2,256 calls over about four weeks) and with grilling and spec-writing skills, and the docs recommend plan mode for the same job. Both routes work. They differ in what they enforce, as the notes below the table show.

## Decision Table

| Situation | Choose | Why |
|---|---|---|
| A one-sentence diff: a typo, a log line, a rename | No planning | Plan mode adds overhead, and the best practices page says to skip it for small, clear fixes |
| Unfamiliar code, or an approach you cannot judge yet | Plan mode | Claude explores and proposes, and edits stay blocked until you approve |
| Several files and the steps are already clear | Task list | Claude tracks pending, in-progress and complete items where you can watch |
| A feature with open decisions | Written spec, built in a fresh session | The decisions live in a file, and the new session starts with clean context |
| A risky change where you want a gate | Plan mode, then **Yes, manually approve edits** | You read the plan, then review each edit |
| Exploring on purpose | No planning | A vague prompt is useful when you can afford to steer |

Plan mode is a gate. Edits are blocked until you approve a plan, and the plan Claude wrote is re-injected from disk after compaction. A task list and a spec guide Claude but do not block anything, so pair them with Manual mode if you want a gate. The task list also depends on the model: Claude Code provides its tools by default on older models and leaves them out on newer ones unless you opt in, which [Plan Mode: Think Before You Edit](../development/plan-mode-think-before-you-edit.md) explains.

For the spec route, [Grill, Spec, Tickets](../process/grill-spec-tickets.md) and the [spec template](../../templates/spec.md) show the shape.

## Pitfalls

- Planning a small change. The ceremony costs more than it saves.
- Reading a task list as approval. It shows progress and stops nothing.
- Approving a plan you did not read.
- Writing a spec that names no checks. A spec with no end-to-end check proves nothing when the work is done.
- Choosing plan mode because it sounds careful. Pick it for uncertainty, not for comfort.

## Checkpoint

Today you will fix a typo in a heading and add tags to Trail Notes. Which one gets a plan?

<details><summary>Show the answer</summary>
Tags. They touch more than one file and involve decisions about entry and filtering. The typo is a one-sentence diff, so skip planning there.
</details>
