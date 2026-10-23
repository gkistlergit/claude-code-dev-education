---
title: Hook Template
kind: template
order: 5
verified: 2026-10-23
sources:
  - https://code.claude.com/docs/en/hooks
  - https://code.claude.com/docs/en/hooks-guide
---

A hook runs your own command at a fixed point in Claude Code's lifecycle, every time, whatever Claude decides. This template is a `PreToolUse` hook that blocks risky git commands. It has two parts: a snippet for a settings file and a small script. Put the snippet in `.claude/settings.json` to share it with a project, `.claude/settings.local.json` to keep it to yourself in one project, or `~/.claude/settings.json` for all your projects. Save the script as `.claude/hooks/block-destructive-git.mjs`.

## Template

### The settings.json snippet

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
            "command": "node",
            "args": ["${CLAUDE_PROJECT_DIR}/.claude/hooks/block-destructive-git.mjs"]
          }
        ]
      }
    ]
  }
}
```

### The script

```js
// .claude/hooks/block-destructive-git.mjs
// Claude Code sends the event as JSON on standard input.
import { readFileSync } from 'node:fs';

const input = JSON.parse(readFileSync(0, 'utf8'));
const command = input.tool_input?.command ?? '';

// Replace these patterns with the commands you want to stop.
const blocked = [
  /git\s+reset\s+--hard/,
  /git\s+push\b.*--force/,
  /git\s+push\b.*\s-f(\s|$)/,
  /git\s+clean\s+-\w*f/,
];

if (blocked.some((pattern) => pattern.test(command))) {
  // Exit code 2 blocks the tool call. Claude receives this stderr text as the reason.
  console.error('Blocked: this git command can destroy work. Ask the user to run it.');
  process.exit(2);
}

// Exit code 0 with no output means no decision: the normal permission flow applies.
process.exit(0);
```

## How to Adapt It

A hook has three levels. The event (`PreToolUse`) is the lifecycle point. The matcher (`Bash`) narrows it to one tool. The handler (`type: "command"`) is what runs. Swap in another event from the [hooks reference](https://code.claude.com/docs/en/hooks) to react to something else, such as `PostToolUse` after an edit or `Stop` when Claude finishes.

- `if` is optional and holds exactly one permission rule, such as `Bash(git *)`. It only saves starting the script for unrelated commands. The script still does the real check, and when Claude Code cannot tell which commands a Bash call runs, it runs the hook anyway.
- `command` with `args` is the exec form: Claude Code starts `node` directly with the script path as one argument, with no shell and no quoting. `${CLAUDE_PROJECT_DIR}` is the project root, so the path works from any folder.
- In `~/.claude/settings.json`, `${CLAUDE_PROJECT_DIR}` still points at whichever project the session started in. For a hook that applies to every project, give `args` the full path to a script kept outside any one project.
- Claude Code passes the event as JSON on standard input. For a Bash call, `tool_input.command` is the command text.
- Exit code 0 means success. With no output, there is no decision and the normal permission flow applies. Staying silent does not approve the call.
- Exit code 2 is a blocking error. The tool call does not run and your standard error text goes to Claude as the reason.
- Any other exit code, including 1, is a non-blocking error. A notice appears and the action goes ahead. Use 2 when the hook enforces a policy.
- To block a call when the hook itself fails to start or crashes, add `"onFailure": "block"` to the handler. It needs Claude Code 2.1.295 or later.
- You can instead print a JSON decision and exit 0. The hooks page shows `permissionDecision: "deny"` with a reason for this.

Test the script before you rely on it. Create a fake event, send it to the script, and print the exit code:

```terminal
echo '{"tool_input":{"command":"git reset --hard HEAD~1"}}' | node .claude/hooks/block-destructive-git.mjs
echo $?
```

`echo` prints the fake event, the pipe `|` hands it to the script as input, and `echo $?` prints the exit code of the command before it. Expect the message and the number 2:

```text
Blocked: this git command can destroy work. Ask the user to run it.
2
```

In a real session on CLI 2.1.309, asking Claude to run `git reset --hard HEAD~1` with this hook installed did not run the command. Claude's reply quoted a notice of this shape, and `git log --oneline` still listed both commits:

```text
PreToolUse:Bash hook error: [node ${CLAUDE_PROJECT_DIR}/.claude/hooks/block-destructive-git.mjs]: Blocked: this git command can destroy work. Ask the user to run it.
```

Repeat with `git status` in the command. It should print only `0`. In a session, type `/hooks` to open a read-only list of your configured hooks and see where each one is defined. The author's setup has a guard hook like this that blocks destructive git commands. Write the rule in words first and add a hook only when a rule alone has been broken.

## Common Mistakes

- Using `exit 1` to block. It is a non-blocking error, so the command still runs. Use `exit 2`.
- A mistyped script path. The hook then never runs, and the only sign is a hook error notice on the first run. Test the path with a command that should be blocked.
- Relying on a hook that times out. A timed-out `PreToolUse` hook does not block the call unless `onFailure` is `"block"`.
- Using a hook for a hard permission boundary. The `if` filter is best effort, so use permission rules for hard allow and deny lists.
- Matching too much. Without a matcher, the hook fires on every use of the event. Narrow it with `matcher` and `if`.
- Forgetting that a hook runs commands on your machine. Read any hook in a repository you did not write.

See [Hooks: Guardrails and Warnings](../kb/workflow/hooks-guardrails-and-warnings.md) for when a hook is the right tool, and [Skill, Subagent or Hook](../kb/decision-guides/skill-subagent-or-hook.md) for choosing between them.
