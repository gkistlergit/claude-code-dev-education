---
title: Config as a Repo
id: W10
area: workflow
level: 3
time: 9
tags: [config, git]
verified: 2026-10-22
status: verified
sources:
  - https://code.claude.com/docs/en/settings
  - https://code.claude.com/docs/en/claude-directory
  - https://code.claude.com/docs/en/memory
  - https://code.claude.com/docs/en/skills
related: [W02, W07, R07]
---

Your personal Claude configuration, the rules, skills, agents, hooks and settings you wrote, can live in a private git repository, with the files in `~/.claude` as symlinks into it. You get history, a second copy and a way to set up a new machine. The risk is that the folder also holds data you must never commit.

## When to Use It

Use it when your configuration has grown past a couple of files, you use more than one machine, or you have lost a rule or skill once and do not want to again. The author keeps the user-level folder as a symlinked view of a repository. The repository has a manifest of pinned third-party packages, a hook that warns when the folder drifts from the repository, and backups. The author has 24 user-level skills, 9 written by hand and 15 vendored from others.

## Steps

1. **Sort** what is in `~/.claude` into authored files and application data. The docs say `~/.claude` holds personal configuration that applies across all projects, and also data Claude Code writes as you work.
2. **Create** a private repository for the authored files. Keep it private.
3. **Move** each authored file or folder into the repository and **link** it back. The docs use `ln -s` for the same idea in their examples.
4. **Check** that Claude Code still sees everything. Start a session and run `/context` to see the **Memory files** list. Run `/skills` to list skills.
5. **Pin** anything you vendor. Record where each third-party package came from and which version you copied, so a later diff shows what changed.
6. **Warn** on drift with a `SessionStart` hook (see [Hooks: Guardrails and Warnings](hooks-guardrails-and-warnings.md)).
7. **Back up** the repository to a private remote, and schedule the push if you forget (see [Scheduled Tasks and Loops](scheduled-tasks-and-loops.md)).

> **Terminal tip**
> This links one file from the repository into `~/.claude`. `ln -s` makes a symbolic link: the first path is the real file, the second is where the link appears. `ls -l` shows the arrow that proves a link. The `~/claude-config` folder name is a placeholder for your repository.
>
> ```terminal
> ln -s ~/claude-config/CLAUDE.md ~/.claude/CLAUDE.md
> ls -l ~/.claude/CLAUDE.md
> ```

### What Belongs in the Repository

| In the repository | Keep out |
|---|---|
| `CLAUDE.md` and `rules/*.md` | `.credentials.json` (your login credentials) |
| `settings.json`, after you scrub it | `~/.claude.json`, a separate file in your home folder (account details and personal MCP servers) |
| `skills/<name>/` that you wrote | `projects/` (plaintext transcripts and auto memory) and `agent-memory/` |
| `agents/*.md`, `commands/*.md`, `output-styles/*.md` | `history.jsonl`, `debug/`, `file-history/`, `paste-cache/`, `uploads/` |
| `keybindings.json` and `themes/*.json` | `plugins/`, which `claude plugin` manages |
| Your hook scripts, and the prompts in `scheduled-tasks/<name>/SKILL.md` after you read them | `skills/synced/` and `skills/.trash/` |

The docs say transcripts and history are plaintext. If a tool reads a `.env` file or a command prints a credential, the value lands in the transcript. Auto memory is machine-local and holds personal facts, so it stays out. Put a preference you want on every machine in `CLAUDE.md` or a rule instead.

## Worked Example

A drift check for a repository in `~/claude-config`. It uses the `SessionStart` shape from the hooks docs: print one JSON object with `systemMessage`, and exit 0. It reports uncommitted changes in the repository and skill folders in `~/.claude/skills` that are real folders and not links. It needs `jq`, as the hooks docs' scripts do.

```text
#!/bin/bash
REPO="$HOME/claude-config"
MSG=""

if [ -n "$(git -C "$REPO" status --porcelain)" ]; then
  MSG="claude-config has uncommitted changes."
fi

for d in "$HOME"/.claude/skills/*; do
  name=$(basename "$d")
  if [ ! -L "$d" ] && [ "$name" != "synced" ]; then
    MSG="$MSG Not a link: skills/$name."
  fi
done

if [ -n "$MSG" ]; then
  jq -n --arg msg "$MSG" '{systemMessage: $msg}'
fi
exit 0
```

Save it as `hooks/check-drift.sh` in the repository, run `chmod +x` on it, and register it in `~/.claude/settings.json`:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup",
        "hooks": [
          { "type": "command", "command": "~/claude-config/hooks/check-drift.sh" }
        ]
      }
    ]
  }
}
```

Start a new session. If you made a skill folder directly in `~/.claude/skills`, the warning names it, and you move it into the repository and link it. The script runs at every session start, so keep it fast.

A manifest can be as small as this. It is an illustration of the pattern, not a Claude Code feature, and the names are stand-ins:

```json
{
  "vendored": [
    { "name": "example-skill", "source": "https://example.com/owner/example-skill", "pinned": "commit-or-version-id" }
  ]
}
```

Before every commit, read the staged diff for anything personal: account names, email addresses, tokens, internal URLs and paths with your user name in them. A rules file that names an account, or a hook with a header token, belongs in the repository only after you replace the value with a variable the hook reads at run time.

## Pitfalls

- Never commit identifiers, tokens or personal data. Treat `settings.json` `env` blocks, hook headers, rules that name accounts, and memory files as suspect until you have read them.
- Do not put a file called `manifest.json` in `~/.claude/skills/`. The skills docs say that before v2.1.280 Claude Code moved the skill folders such a file listed into `~/.claude/skills/.trash/`. Keep the manifest at the repository root and give it another name.
- In Cowork sessions on your desktop, the memory docs say Claude Code skips a `~/.claude/CLAUDE.md` that is itself a symlink. Check `/context` in the session type you use.
- The memory docs say the Edit and Write tools refuse to write through a symlinked `CLAUDE.md` and direct Claude to edit the link's target instead. Expect the same care with other linked files.
- If `~/.claude/settings.json` is a link to a read-only copy, a setting you change inside Claude Code applies to that session and is lost in the next. Keep the target writable.
- On Windows, `~/.claude` is `%USERPROFILE%\.claude`, and creating symlinks needs Administrator privileges or Developer Mode.
- Cloud sessions do not read your `~/.claude`, so a skill or hook that lives only there is missing there.

## Checkpoint

1. Which two things in `~/.claude` hold your login and your conversation history, and do they go in the repository?
2. Why keep the vendored-package manifest at the repository root?

<details><summary>Show the answer</summary>

1. `.credentials.json` holds your login credentials and `projects/` holds plaintext transcripts. Neither goes in the repository.
2. A `manifest.json` inside `~/.claude/skills/` made older versions of Claude Code move the skill folders it listed into the trash folder.

</details>
