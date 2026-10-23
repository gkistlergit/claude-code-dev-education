---
title: Hooks: Guardrails and Warnings
id: W07
area: workflow
level: 3
time: 10
tags: [hooks]
verified: 2026-10-23
status: verified
sources:
  - https://code.claude.com/docs/en/hooks
  - https://code.claude.com/docs/en/hooks-guide
  - https://code.claude.com/docs/en/permissions
related: [W06, D09, R04]
---

A hook is a shell command, or another handler type, that Claude Code runs at a fixed point in a session. Use one when a rule must hold every time, because hooks run whether or not Claude follows your instructions. This page covers the shape of a hook, what it receives and returns, and four hooks from the author's setup.

## When to Use It

The hooks guide says hooks give deterministic control: certain actions always happen instead of depending on the model to choose them. CLAUDE.md is context and Claude may not follow it every time (see [A CLAUDE.md That Earns Its Keep](a-claude-md-that-earns-its-keep.md)). The author's rule of thumb: write the rule in words first, and add a hook or a check only when the rule alone has been broken.

The reference says Claude Code fires the same hook events in the terminal, IDE extensions, the Desktop app and cloud sessions. Hooks run shell commands with your full user permissions, so read and test each one before you add it.

## How It Works

There are 33 hook events. Examples: `SessionStart`, `PreToolUse`, `PostToolUse`, `PostCompact`, `Stop`, `Notification` and `SessionEnd`. There are five handler types: `command`, `http`, `mcp_tool`, `prompt` and `agent`. The docs label agent hooks experimental.

Hooks live in JSON settings files with three levels: an event, a matcher group that filters when it fires, and one or more handlers. This one runs a script before every Bash call that starts a git command:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "if": "Bash(git *)",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/block-destructive-git.sh",
            "args": []
          }
        ]
      }
    ]
  }
}
```

Put it in `.claude/settings.json` to share it, or `.claude/settings.local.json` for you in one project. A hook in `~/.claude/settings.json` applies to all projects, so point its `command` at a script outside any one project. For tool events the matcher is the tool name. For `SessionStart` it is how the session began (`startup`, `resume`, `clear`, `compact`, `fork`). For `PostCompact` it is `manual` or `auto`. The `if` field takes permission-rule syntax and works only on tool events. On any other event, a hook with `if` set never runs. The docs call the filter best-effort.

A command hook gets the event as JSON on stdin, with fields such as `session_id`, `cwd`, `hook_event_name`, and for tool events `tool_name` and `tool_input`. It answers through its exit code:

| Exit code | What happens |
|---|---|
| 0 | Success. Claude Code reads any JSON you printed. On `PreToolUse`, exit 0 does not approve the call, so the normal permission flow still applies |
| 2 | A blocking error on events that can block. Your stderr is the reason. `PreToolUse` blocks the tool call. `PostToolUse` cannot block because the tool already ran, but Claude sees your stderr. `SessionStart` and `PostCompact` show stderr to you only |
| Any other | A non-blocking error. The action goes ahead and a hook error notice appears |

Exit 1 is the usual Unix failure code and it does not block. For a policy hook, use exit 2. Alternatively exit 0 and print one JSON object, for example `permissionDecision` set to `"deny"` inside `hookSpecificOutput`. Pick one style per hook. When several hooks match, they all run, and for `PreToolUse` the most restrictive decision wins: deny, then defer, then ask, then allow. A hook's deny holds in every permission mode.

## Worked Example

The author runs four hooks. Each is a short script wired to one event.

### Block Destructive Git Commands

The event is `PreToolUse` with matcher `Bash`, wired as in the settings example above. Save the script to `.claude/hooks/block-destructive-git.sh` and run `chmod +x` on it. It adapts the docs' `block-rm.sh` example and needs `jq`, which the hooks guide says to install with `brew install jq` on macOS if you lack it. The [hook template](../../templates/hook.md) has a Node version that needs no `jq`:

```text
#!/bin/bash
# .claude/hooks/block-destructive-git.sh
COMMAND=$(jq -r '.tool_input.command')

if echo "$COMMAND" | grep -Eq 'git (push( .*)? (--force|-f( |$))|reset --hard|clean -[a-z]*f)'; then
  echo "Blocked: destructive git command. Ask the user to run it." >&2
  exit 2
fi

exit 0
```

### Warn at Context Thresholds

The event is `PostToolUse` with no matcher. The script decides when to warn. The docs list no context-usage field in the input, and `transcript_path` may lag the current turn, so measuring is your job. To reach you, print a JSON object with `systemMessage`, which the docs describe as a warning shown to the user:

```json
{ "systemMessage": "Context is getting full. Consider a handoff." }
```

### Re-arm After Compaction

The event is `PostCompact`. It has no decision control and its `systemMessage` is discarded, so use it for side effects only, such as clearing the state that remembers which warnings already fired.

### Report Drift at Session Start

The event is `SessionStart` with matcher `startup`. The script compares your configuration folder with its source and prints the same `systemMessage` shape if they differ (see [Config as a Repo](config-as-a-repo.md)). It runs every session, so keep it fast.

### Putting Them Together

The author's warnings fire at 70% and 90% of the context window and point to a handoff skill. A written rule says only the human starts the handoff (see [Handoffs Between Sessions and Devices](handoffs-between-sessions-and-devices.md)). The docs say a `SessionStart` hook with the `compact` matcher can re-inject context after compaction, a different job from re-arming a warning.

To test the git guard, pipe sample input to the script and check the exit code:

```terminal
echo '{"tool_name":"Bash","tool_input":{"command":"git clean -fd"}}' | .claude/hooks/block-destructive-git.sh; echo $?
```

This feeds one fake tool call to the script and prints its exit code. The expected output is the `Blocked:` message followed by `2`. Then type `/hooks` to browse configured hooks; the docs call it a read-only browser. A hook template is in the [hook template](../../templates/hook.md).

## Pitfalls

- The `if` filter and Bash patterns are best-effort. The docs show that `git push` rules miss `git -C . push`. For a hard limit use [permission rules](permission-tuning-for-fewer-prompts.md) or the sandbox.
- A wrong script path is a non-blocking error, so a guard fails open. Watch for the hook error notice on first run. On v2.1.295 or later, `"onFailure": "block"` makes a failed or timed-out hook block the action.
- Stdout must hold only the JSON object. A line your shell profile prints first makes Claude Code read it as plain text.
- Fields at the wrong level are silently ignored. `permissionDecision` belongs inside `hookSpecificOutput`.
- The pattern in the git guard also matches `git push --force-with-lease`. Tighten it for your own use.
- The Code tab can treat panel commands differently. If `/hooks` shows nothing, check the transcript for the hook error notice and edit the settings file directly.

## Checkpoint

1. Your `PreToolUse` guard script ends with `exit 1` when it finds a bad command. Does it block the call?
2. Which exit code makes `PostToolUse` feedback reach Claude, and why can it not undo the tool?

<details><summary>Show the answer</summary>

1. No. Exit 1 is a non-blocking error and the call goes ahead. Use exit 2, or exit 0 with a `"deny"` decision in JSON.
2. Exit 2 shows your stderr to Claude. The tool has already run by the time `PostToolUse` fires, so the hook cannot undo it.

</details>
