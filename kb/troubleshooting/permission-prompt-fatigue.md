---
title: Permission Prompt Fatigue
id: TS03
area: troubleshooting
level: 2
time: 6
tags: [troubleshooting, permissions]
verified: 2026-10-22
status: verified
sources:
  - https://code.claude.com/docs/en/permissions
  - https://code.claude.com/docs/en/permission-modes
  - https://code.claude.com/docs/en/desktop
  - https://code.claude.com/docs/en/best-practices
related: [W05, A05, O08, DG01]
---

Too many approval prompts wear down your attention, and the best-practices page notes that after the tenth approval you are clicking through rather than reviewing. Find the prompts that repeat, allow the safe ones, consider Auto, keep deny rules for the dangerous ones, and count prompts before and after.

## When to Use It

Use this page when you answer the same prompt several times in one session, or when you catch yourself approving without reading. [Permission Modes Explained](../app/permission-modes-explained.md) describes each mode, and [Permission Tuning for Fewer Prompts](../workflow/permission-tuning-for-fewer-prompts.md) goes deeper on rules.

## Symptoms and Fixes

| Symptom | Likely cause | Fix |
|---|---|---|
| The same command prompts every time | No allow rule covers it | Choose the option that stops asking for that command, or add the command to `permissions.allow` in a settings file. A command approved this way is saved per repository and command. File-edit approvals last only until the session ends |
| Commands you expect to be read-only still prompt | Only a built-in set is read-only | The set includes `ls`, `cat`, `echo`, `pwd`, `head`, `tail`, `grep`, `find`, `wc`, `diff` and read-only forms of `git`. Compound commands prompt unless every part qualifies on its own |
| A rule you added does not stop the prompt | The rule does not match the command | A rule with no `*` matches one exact command, so `Bash(npm run build)` does not cover `npm run build --watch`. Put the `*` after the subcommand, as in `Bash(npm run *)` |
| Every file edit prompts | Manual mode | Switch to Accept edits. It auto-accepts file edits and common filesystem commands such as `mkdir`, `touch` and `mv`, and still asks before other terminal commands |
| Almost everything prompts and you want fewer interruptions | Manual mode | Try Auto. A classifier reviews actions instead of you. The docs say it reduces prompts but does not guarantee safety |
| You want some prompts to stay | No ask or deny rule | Add `ask` or `deny` rules. Deny is checked first, then ask, then allow, and the first match wins |

In the app, choose a mode from the mode selector in the row under the prompt box, or press Cmd+Shift+M to open the permission mode menu. The Desktop page says `/permissions` replies "isn't available in this environment" in the Code tab and tells you to edit settings files directly, which the app reads like the CLI does. Auto appears only when it is available to you, and the docs list model and organization requirements. If the classifier blocks an action three times in a row or twenty times in total, Auto pauses and Claude Code goes back to prompting.

Bypass permissions is not a fix for fatigue. The docs say to use it only in sandboxed containers or virtual machines.

### Fix Order

1. Count the prompts in one ordinary session and list the commands that repeat.
2. Allow the safe, specific ones.
3. Consider Accept edits or Auto for the session.
4. Keep deny rules for anything dangerous.
5. Count again. [Measure a Workflow Before and After](../optimization/measure-a-workflow-before-and-after.md) has the worksheet.

## Worked Example

In Trail Notes under Manual mode, each `node checks/run.mjs` asks for approval. Count a session, then add an exact allow rule and a deny rule for pushes to your project settings:

```json
{
  "permissions": {
    "allow": ["Bash(node checks/run.mjs)"],
    "deny": ["Bash(git push *)"]
  }
}
```

Run the same task and count again. The check should run without a prompt, while a plain `git push` is refused. The docs warn that a push written another way, such as `git -C . push`, is not matched, so treat a Bash deny rule as a guardrail. It is no security boundary.

In the author's setup, 6,220 prompts ran in Auto, 67 in Manual and 16 in Accept edits. The audit found no allow or deny lists. Instead the author runs a hook that blocks destructive git commands. Both routes cut prompts. Count before and after to see which suits you.

## Pitfalls

- Writing a broad rule for convenience. A `*` matches any text, so `Bash(git *)` allows every git command and `Bash(node *)` allows any Node script.
- Forgetting that an approval saved from a prompt is stored in a settings file and applies to later sessions in that repository, including its worktrees.
- Relying on a deny rule alone for something dangerous. Pair it with a hook or the sandbox.
- Changing mode and rules together, so you cannot tell which helped.
- Assuming Auto is available. Check the mode selector.

## Checkpoint

1. Which commands run without any rule in every mode?
2. Two rules match one command, one allow and one deny. Which wins?

<details><summary>Show the answer</summary>

1. A built-in set of read-only commands such as `ls`, `cat`, `grep` and read-only `git`. The set cannot be configured, and some forms still prompt.
2. The deny rule. Rules are checked in the order deny, ask, allow, and the first match decides.

</details>
