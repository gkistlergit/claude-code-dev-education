---
title: Which Permission Mode
id: DG01
area: decision-guides
level: 1
time: 5
tags: [decision, permissions]
verified: 2026-10-23
status: verified
sources:
  - https://code.claude.com/docs/en/permission-modes
  - https://code.claude.com/docs/en/desktop#choose-a-permission-mode
related: [A05, DG02, W05]
---

Pick a permission mode by how risky the task is and how much you trust the checks around you: tests, hooks, a clean git state and a diff you will read. Manual asks about everything, Bypass permissions asks about almost nothing, and the modes between them trade prompts for oversight.

## When to Use It

Choose a mode at the start of a session and again whenever the task changes risk. In the Code tab, use the mode selector in the row under the prompt box, or press **Cmd+Shift+M** to open the permission mode menu. A mode you pick is remembered per folder, except Plan, which applies to the current session only. [Permission Modes Explained](../app/permission-modes-explained.md) describes each mode in depth, and [Security Review Habits](../development/security-review-habits.md) covers the line-by-line read for sensitive code.

## Decision Table

| Situation | Mode | What runs without asking | Have this in place |
|---|---|---|---|
| Sign-in, payments, deleting data, code you do not know | Manual | Reads only | You read every action and every diff |
| Iterating on code you will review afterward | Accept edits | File edits and common filesystem commands | Committed work and a diff review |
| You do not know the approach yet | Plan | Reads; edits stay blocked until you approve a plan | You read the plan, see [Plan Mode or Not](./plan-mode-or-not.md) |
| A long task with a clear goal and checks Claude can run | Auto | Routine actions, with a background classifier checking shell commands and network requests first | Tests, a guard hook and committed work |
| A throwaway container or VM | Bypass permissions | Everything except actions no mode auto-approves | Isolation, because the docs say to use it only in sandboxed containers or VMs |

Availability differs by mode:

- Auto appears in the selector only when it is available to your session. It needs a supported model, and an administrator can turn it off.
- Bypass permissions needs the **Allow bypass permissions mode** toggle in Settings on Pro and Max plans. On Team and Enterprise plans, organization policy controls it.
- `dontAsk` mode exists only in the CLI.
- Deny rules block in every mode, including Bypass permissions.

In the author's setup, Auto mode covered 6,220 prompts over about four weeks, against 67 in Manual and 16 in Accept edits. That choice works because other layers carry the risk: a hook blocks destructive git commands, checks run before a merge, and CI repeats them. The mode is one layer of several.

## Pitfalls

- Using Auto as a substitute for review on sensitive operations. The permission modes page warns that Auto reduces prompts and does not guarantee safety.
- Staying in Bypass permissions because it is convenient. Outside an isolated container or VM, one bad command has nothing to stop it.
- Treating Accept edits as edits only. It also auto-approves commands such as `rm`, `mv`, `cp` and `sed` inside your working directory, so commit first.
- Expecting a mode to override a deny rule. It will not.
- Forgetting that Plan resets. The next session starts in whatever mode the folder remembers.

## Checkpoint

You are changing the sign-in code. Which mode do you pick, and what else do you do?

<details><summary>Show the answer</summary>
Manual, the mode for sensitive work, where you see each action and diff before it lands. Then read the sign-in code yourself line by line, which the Security Review Habits article covers.
</details>
