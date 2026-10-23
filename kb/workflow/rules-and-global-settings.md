---
title: Rules and Global Settings
id: W02
area: workflow
level: 2
time: 8
tags: [rules, settings]
verified: 2026-10-23
status: verified
sources:
  - https://code.claude.com/docs/en/settings
  - https://code.claude.com/docs/en/settings-reference
  - https://code.claude.com/docs/en/memory
  - https://code.claude.com/docs/en/desktop
related: [W01, R07, W05]
---

Some preferences hold in every project: which account to use, when to hand work to a subagent, when to stop and ask. Put those in user-level rules files and user-level settings so you write them once. This page covers where each kind of file lives and which one wins when two disagree.

## When to Use It

Use user-level files for anything you would otherwise copy into each new project. Use project files for anything a teammate or a future you in that repository needs. The settings docs describe four scopes (user, shared project, project local and managed), and the memory docs add user rules in `~/.claude/rules/`.

Instructions and settings do different jobs. The memory docs say CLAUDE.md content shapes Claude's behavior but is not a hard enforcement layer, while settings rules such as `permissions.deny` are enforced by the client regardless of what Claude decides to do.

## How It Works

### Instruction files

| File | Applies to |
|---|---|
| `~/.claude/CLAUDE.md` | You, in every project |
| `~/.claude/rules/*.md` | You, in every project |
| `./CLAUDE.md` or `./.claude/CLAUDE.md` | Everyone working in the project |
| `./.claude/rules/*.md` | Everyone working in the project |
| `./CLAUDE.local.md` | You, in one project (add it to `.gitignore`) |

Each rules file should cover one topic. Rules files without a `paths` field load unconditionally. `paths` is the only frontmatter field Claude Code reads from a rule. User-level rules load before project rules. Neither overrides the other, so if a user rule and a project rule conflict, Claude may follow either. Keep them consistent.

### Settings files

| Scope | File | Who it affects |
|---|---|---|
| User | `~/.claude/settings.json` | You, in every project on this machine |
| Shared project | `.claude/settings.json` | Everyone in the folder; commit it so teammates get it |
| Project local | `.claude/settings.local.json` | You, in this one project |
| Managed | `managed-settings.json` and other managed sources | Everyone your organization deploys it to |

The desktop app and the CLI read the same files, so permission rules and other keys in `~/.claude/settings.json` apply to Code tab sessions too.

### Precedence

When the same key appears in more than one place, Claude Code uses the highest level that sets it. From highest to lowest:

1. Managed settings.
2. Command line: JSON passed with `--settings`, for that session only.
3. Project local settings (`.claude/settings.local.json`).
4. Shared project settings (`.claude/settings.json`).
5. User settings (`~/.claude/settings.json`).

List keys such as `permissions.allow` merge across files instead of overriding. Environment variables are not a level in this stack. Which one wins is decided per setting, and each key's entry in the settings reference says how.

Settings files are strict JSON. A `//` comment or a trailing comma is a syntax error. Claude Code watches the files and applies most edits, including `permissions` and `hooks`, to the running session without a restart. To see which files loaded, run `/status` and read the `Setting sources` line.

## Worked Example

The author keeps eight global rules files, each holding one rule. Two of them, rewritten with stand-in names:

```md
My personal projects use the GitHub account <account-a>.

- Run `gh auth switch --user <account-a>` when `gh` is logged in as another account.
- Do not use <account-b> for these projects.
```

```md
Hand a question to the scout agent when it needs more than three files read, a map of an unfamiliar repo, an audit for one pattern, or triage of long logs. Keep its conclusion, not the file contents.
```

The first states the account to use, the account to avoid and the command to switch. `gh auth switch` is documented in the GitHub CLI manual: it switches the active account for a GitHub host, and `--user` names the account. The second delegates by a count, so there is no judgment call about whether a job is big.

For settings, a small user file can hold a guard that applies everywhere. This one uses the docs' own example to stop Claude reading `.env` files:

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)"
    ]
  }
}
```

Add it to `~/.claude/settings.json`, merging it with anything already there, then start a session in Trail Notes and run `/status`. The `Setting sources` line should list `User settings`. The author's rule is to write the policy in words first. A hook or a check is added only when the rule alone has been broken (see [Hooks: Guardrails and Warnings](hooks-guardrails-and-warnings.md)).

Starting points are in the [rules-file template](../../templates/rules-file.md). For a standing permission with an explicit stop list, see [A Standing Go with a Stop List](../process/a-standing-go-with-a-stop-list.md).

## Pitfalls

- A user rule and a project rule that disagree leave Claude free to follow either. Read both when behavior surprises you.
- Rules longer than one topic grow into the files you were trying to avoid. Split them.
- A committed `.claude/settings.json` reaches teammates, so keep personal exceptions in `.claude/settings.local.json`.
- Some keys never take effect from a project file. For example, `permissions.defaultMode` values `auto` and `bypassPermissions` do not apply from project or local settings. Set them in user or managed settings.
- Cloud sessions do not read your user settings or your local project file.
- The desktop docs say panel commands can behave differently in the Code tab. If `/status` does not show the `Setting sources` line there, run it from the standalone CLI.
- A rules file with an account name or a path in it is personal data. Do not publish it. See [Config as a Repo](config-as-a-repo.md).

## Checkpoint

1. The same key is set in `~/.claude/settings.json` and in the committed `.claude/settings.json`. Which value applies?
2. How do you change a setting for yourself in one project without affecting teammates?

<details><summary>Show the answer</summary>

1. The committed project file wins, because shared project settings sit above user settings. Managed settings and `--settings` sit above both.
2. Put it in `.claude/settings.local.json` in that project. It sits above the shared project file and stays out of your commits.

</details>
