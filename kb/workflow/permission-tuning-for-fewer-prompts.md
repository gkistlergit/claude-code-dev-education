---
title: Permission Tuning for Fewer Prompts
id: W05
area: workflow
level: 2
time: 8
tags: [permissions, allowlist]
verified: 2026-10-22
status: verified
sources:
  - https://code.claude.com/docs/en/permissions
  - https://code.claude.com/docs/en/permission-modes
  - https://code.claude.com/docs/en/desktop
  - https://code.claude.com/docs/en/commands
related: [A05, TS03, D09]
---

You can cut permission prompts in two ways: write narrow allow rules for the few commands you approve all day, or let Auto mode review actions for you. Each has a cost. This page gives a method for the first and states the trade-off for both.

## When to Use It

Use it when the same prompt appears several times a day for a command you would always approve, such as running the project's checks. If most prompts are different each time, rules will not help much, and a permission mode is the better lever (see [Permission Modes Explained](../app/permission-modes-explained.md) and [Permission Prompt Fatigue](../troubleshooting/permission-prompt-fatigue.md)).

The permissions docs define three rule types. Allow rules let Claude use a tool without asking. Ask rules prompt every time. Deny rules block the tool. Rules are checked in the order deny, then ask, then allow, and the first match decides. A narrow allow rule cannot carve an exception out of a broader deny rule.

## Steps

1. **List** the commands you approve over and over. Keep a short note for a few days. The bundled `/fewer-permission-prompts` skill scans your transcripts for common read-only Bash and MCP calls and adds a prioritized allowlist to the project's `.claude/settings.json`. Read what it adds before you keep it, because that file is shared.
2. **Cross out** anything that deletes, pushes, deploys, installs or writes outside the project. Claude Code already runs a built-in set of read-only commands (such as `ls`, `cat`, `grep` and read-only forms of `git`) without a prompt, and you cannot edit that set. Your list is for commands outside it.
3. **Write** the narrowest rule that covers each command. A rule with no `*` matches one exact command. A `*` matches any text, so put it after the subcommand: `Bash(git log *)` allows only `git log` commands, while `Bash(git *)` allows every git command.
4. **Choose** the file. Rules for every project go in `~/.claude/settings.json`. Rules for you in one project go in `.claude/settings.local.json`. Rules for the team go in `.claude/settings.json`, and the docs say a project file's allow rules apply only after each teammate trusts the folder.
5. **Add** a few deny rules for files Claude should never read, such as `Read(./.env)`. A deny rule in any file beats an allow rule in any other.
6. **Check** that the rules loaded. In the CLI, `/permissions` lists every rule and the file it came from. The desktop docs say commands without an argument form, such as `/permissions`, reply that they are not available in the Code tab, so edit the settings files directly there.

> **Terminal tip**
> Run `claude` in a terminal inside the project folder to start a CLI session. At a permission prompt in the CLI, "Yes, and don't ask again" saves the rule to `.claude/settings.local.json` at the root of the git repository. File-edit approvals last only until the session ends.

## Worked Example

In Trail Notes you approve `node checks/run.mjs` in every session. Create `.claude/settings.local.json` in the project with this content:

```json
{
  "permissions": {
    "allow": [
      "Bash(node checks/run.mjs)",
      "Bash(npm run check)"
    ]
  }
}
```

Settings files are strict JSON, so a comment or a trailing comma is an error. Claude Code reloads permission edits into a running session. Ask Claude to run the checks and confirm no prompt appears. Then ask it to run `node checks/search.check.mjs` on its own. That command is not in your list, so it still prompts.

### Allow Rules or Auto Mode

| | Narrow allow rules | Auto mode |
|---|---|---|
| Prompts removed | Only the commands you listed | Most routine prompts |
| Who decides | A rule you wrote | A classifier model that reviews actions |
| Upkeep | You edit the list | None |
| Cost | None | Classifier calls count toward token usage on some account types and add a round trip before shell commands and network operations |
| Risk | A rule that is too broad | The docs say Auto reduces prompts but does not guarantee safety |

The two combine. Entering Auto mode drops broad allow rules such as `Bash(*)`, wildcarded interpreters and package-manager run commands. Narrow rules such as `Bash(npm test)` stay in effect. Deny rules block in every mode, including Auto.

In the Code tab, **Auto** appears in the mode selector when auto mode is available. It needs a supported model, and an administrator can turn it off. A mode you pick is remembered per folder, except Plan, which applies to the current session only.

The author runs Auto mode (6,220 prompts, against 67 in Manual and 16 in Accept edits) and has no allow or deny list. The trade-off is plain. There are no rules to maintain and almost no prompts, and nothing stops a bad action except the classifier, the author's written rules and a hook that blocks destructive git commands (see [Hooks: Guardrails and Warnings](hooks-guardrails-and-warnings.md)). A few deny rules would add a floor that holds in every mode.

## Pitfalls

- A Bash rule matches the command text Claude writes. The docs say `Bash(git push *)` stops `git push origin main` but not `git -C . push origin main`. Treat a deny rule as a guard for the usual form of a command. It is no security boundary. For hard limits, see sandboxing or a hook.
- A rule with `*` before the subcommand, such as `Bash(git * main)`, matches far more than you meant. Claude Code warns about it at startup.
- `permissions.defaultMode` values `auto` and `bypassPermissions` do not take effect from project settings files. Set them in your user settings.
- Adding a folder with `--add-dir` or `/add-dir` grants file access, not configuration. In the Code tab, click **+** next to the prompt box and choose **Add folder**.
- In Auto mode, a boundary you state in chat ("don't push") is not stored as a rule and can be lost to compaction. Use a deny rule when you need a guarantee.

## Checkpoint

1. A deny rule for `Bash(git push *)` is in your user settings and an allow rule for `Bash(git *)` is in the project file. What happens on `git push origin main`?
2. Which rules survive when you enter Auto mode: `Bash(npm test)` or `Bash(*)`?

<details><summary>Show the answer</summary>

1. The deny rule blocks it. Deny rules are checked first, in every scope, and an allow rule cannot override one.
2. `Bash(npm test)` stays in effect. Claude Code drops blanket rules such as `Bash(*)` on entering Auto mode and restores them when you leave.

</details>
