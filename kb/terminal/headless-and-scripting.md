---
title: Headless and Scripting
id: T05
area: terminal
level: 3
time: 9
tags: [terminal, headless, automation]
verified: 2026-10-23
status: verified
sources:
  - https://code.claude.com/docs/en/headless
  - https://code.claude.com/docs/en/cli-reference
  - https://code.claude.com/docs/en/permission-modes
  - https://code.claude.com/docs/en/agent-sdk/overview
  - https://code.claude.com/docs/en/github-actions
related: [R06, W11, T02]
---

`claude -p` runs one prompt without an interactive session, prints the answer and exits, so a script can use Claude like any other command. The docs now call this non-interactive mode and keep the older name, headless, in the page address.

## When to Use It

Use it when a script, a build step, a pre-commit hook or a CI job needs Claude's answer with nobody at a prompt. Stay in the desktop app for interactive work: the app has no equivalent of `--print` or `--output-format`. Every run is a real session, so read [Reading Your Usage, Context and Skills](../optimization/reading-your-usage-context-and-skills.md) before you put one in a loop.

## How It Works

### Ask Once

`-p` (or `--print`) takes the prompt, prints the reply and exits. It exits with code 0 on success and a non-zero code when the run fails, so a script can branch on the result.

```terminal
claude -p "What does notes.js export?"
```

### Pipe Data In

Non-interactive mode reads standard input, so you can feed it a file or another command's output. The docs cap piped input at 10MB.

```terminal
cat checks/search.check.mjs | claude -p "Summarize what these checks verify"
```

### Choose an Output Format

`--output-format` accepts `text` (the default), `json` and `stream-json`. `json` returns one object that holds the answer in a `result` field, plus the session ID and metadata. `stream-json` sends newline-delimited events as they happen.

```terminal
claude -p "Summarize this project" --output-format json
```

### Force a Shape

`--json-schema` takes a JSON Schema and makes Claude return data that matches it, in a `structured_output` field. Use it together with `--output-format json`. If a run ends without valid structured output, that field is missing, so check that it exists before your script reads it. The backslash at the end of a line tells the shell the command continues, and the single quotes keep the schema as one argument.

```terminal
claude -p "List the exported function names in notes.js" \
  --output-format json \
  --json-schema '{"type":"object","properties":{"functions":{"type":"array","items":{"type":"string"}}},"required":["functions"]}'
```

### Pre-Approve Tools

With no permission mode set, a `-p` run starts in Manual mode on Claude Code 2.1.302 or later, and any call that needs approval is denied because nobody can answer. `--allowedTools` lists what may run without asking. The trailing space and `*` in a pattern mean "starts with", so `Bash(git diff *)` allows any command beginning `git diff`.

```terminal
claude -p "Look at my staged changes and suggest a commit message" --allowedTools "Bash(git diff *)" "Bash(git status *)"
```

### Cap the Spend

`--max-budget-usd` stops the run once estimated spend reaches the amount you give. The docs call it a client-side estimate that can differ from your bill, and spend can pass the cap, so leave headroom. Replace `<amount>` with a number you choose.

```terminal
claude -p "Review the checks folder" --max-budget-usd <amount>
```

### Continue a Conversation

`--continue` adds a follow-up to the most recent conversation, so a script can run several prompts that share context.

```terminal
claude -p "Review this codebase for performance issues"
claude -p "Now focus on the database queries" --continue
```

> **Warning**
> `-p` skips the workspace trust dialog, and without `--bare` it still runs the hooks in a project's `.claude/settings.json` and connects the servers in its `.mcp.json`. Run it only in folders you trust. `--bare` skips that loading, but it ignores your subscription login and needs an API key, so this page does not use it.

### Where to Go Next

The Agent SDK gives you Claude Code's tools and agent loop as Python and TypeScript packages, for programs that need callbacks and message objects. Start at the [Agent SDK overview](https://code.claude.com/docs/en/agent-sdk/overview). For GitHub, the Claude Code GitHub Action runs Claude in your workflows; running `/install-github-app` in a session sets it up ([GitHub Actions](https://code.claude.com/docs/en/github-actions)). [CI That Gates the Deploy](../process/ci-that-gates-the-deploy.md) and [Scheduled Tasks and Loops](../workflow/scheduled-tasks-and-loops.md) show where these runs fit.

## Worked Example

Trail Notes fails two search checks. Feed the runner's output to Claude and ask for the failing check names as data:

```terminal
cd ~/trail-notes
node checks/run.mjs | claude -p "List the names of the failing checks" --output-format json --json-schema '{"type":"object","properties":{"failing":{"type":"array","items":{"type":"string"}}},"required":["failing"]}'
```

The pipe sends the runner's printed lines to Claude as input, so Claude needs no permission to run anything. Expect a JSON object whose `structured_output.failing` array names the two search checks that print `FAIL`. A script could read that array and open an issue, or stop a release.

## Pitfalls

- Piping a diff or log in is safer than letting Claude run `git` itself, because piped input needs no Bash permission.
- A bare `Bash` in `--allowedTools` allows every shell command. Prefer narrow patterns such as `Bash(git diff *)`.
- Some docs pages, including the GitHub Actions page, show a `--max-turns` option. It is not in `claude --help` on the build checked for this course, so this page does not use it. Use `--max-budget-usd` as the cap.
- `jq`, a separate tool, pulls fields out of JSON (`| jq -r '.result'`). Install it before you copy examples that use it.
- In CI, keep tokens in the CI system's secret store. `claude setup-token` prints a long-lived token and does not save it anywhere.
- Sessions made with `-p` stay out of the `claude -r` picker. Resume one by ID.

## Checkpoint

1. A `claude -p` run in your script should be able to run `git diff` without a person approving it. How do you allow that, and what is the narrowest way to write it?
2. Which two flags together make a run return validated data you can parse?

<details><summary>Show the answer</summary>

1. Pass `--allowedTools "Bash(git diff *)"`. The pattern allows only commands that start with `git diff`, where a bare `Bash` would allow every shell command.
2. `--output-format json` and `--json-schema`. The validated data arrives in the `structured_output` field.

</details>
