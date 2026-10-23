---
title: Errors and Retries
id: TS04
area: troubleshooting
level: 2
time: 6
tags: [troubleshooting, errors]
verified: 2026-10-22
status: verified
sources:
  - https://code.claude.com/docs/en/setup
  - https://code.claude.com/docs/en/commands
  - https://code.claude.com/docs/en/errors
  - https://code.claude.com/docs/en/troubleshooting
  - https://code.claude.com/docs/en/desktop
related: [D05, T01, O02, TS01]
---

Two kinds of error show up in a session. A tool error means a command or edit Claude ran failed, and it is part of normal work. An API error means the model service did not answer, and Claude Code has already retried before you see it. The author's audit counted 1,606 tool errors and 792 API errors over four weeks of heavy use, so seeing some of each is normal.

## When to Use It

Use this page when an error appears in the chat and you need to decide whether to fix a command, wait, or change something on your machine.

## Symptoms and Fixes

Claude Code retries transient failures up to 10 times with exponential backoff before it shows an error, and the spinner shows a `Retrying in Ns · attempt x/y` countdown while it does. So an error on screen means Claude Code has already made the retries that apply to it.

| What you see | What it means | First move |
|---|---|---|
| A command or check fails in the transcript | A tool error. The cause is your code or the command | Read the output. Claude normally reads it too and adjusts. If it loops, paste the failing output and the goal, as in [Debugging with Claude](../development/debugging-with-claude.md) |
| `API Error: 500 Internal server error` | A server-side problem, usually temporary, and not caused by your prompt, settings or account | Check status.claude.com, wait a minute, then type `try again`. Your original message is still in the conversation |
| `API Error: Repeated 529 Overloaded errors` | The API is at capacity. The docs say this is not your usage limit and does not count against your quota | Try again in a few minutes, or switch models, since capacity is tracked per model. In the app the message can read "Opus is experiencing high load. Switch to Sonnet." and you switch with the model picker |
| `Request timed out` | The API did not answer before the deadline | Retry. If it keeps happening on a healthy network, see the network section of the error reference |
| `You've hit your session limit` (also weekly, Opus or Sonnet limit) | Your plan allowance is used up | Wait for the reset time in the message. `/usage` shows limits and resets, and the usage ring in the app shows remaining allowance |
| `Server is temporarily limiting requests` | A short throttle unrelated to your plan quota | Wait briefly and try again |
| `Prompt is too long` or "Context limit reached" | The conversation fills the window | See [Long Sessions and Context Rot](long-sessions-and-context-rot.md) |

The error reference lists many more messages, with what each means.

### What to Try First

1. Read the message. It usually names the cause.
2. Retry once with `try again`, and check the status page for a posted incident.
3. Run `claude doctor` in a shell. If you do not have the command yet, [Install and Update](../terminal/install-and-update.md) covers it. The Terminal pane in the Code tab opens a shell in the session's folder.
4. Update. In the app, use Claude > Check for Updates… on macOS. In a shell, use `claude update`.
5. Resume. Restarting does not lose the conversation. Your session stays in the sidebar, and in a shell `claude --resume` picks it back up.

> **Terminal tip**
> `claude doctor` prints read-only diagnostics about your installation and settings without starting a session. It covers install health, settings validation errors and warnings with suggested fixes. `claude update` installs the newest version now and reports either the update or that you are current.
>
> ```terminal
> claude doctor
> claude update
> ```

As a rule of thumb, a bad command fails the same way every time, with the same output, and the fix is in the command or the code. A service problem is intermittent, carries an `API Error:` prefix, and often matches a posted incident. A retry costs little, so try it before you rewrite a prompt that worked.

## Worked Example

In Trail Notes, `node checks/run.mjs` fails after Claude's change. That is a tool error and useful information:

```prompt
node checks/run.mjs fails with the output above. Fix the cause in the code. Do not change the check. Run it again and show me the result.
```

Later in the session the chat shows `API Error: Repeated 529 Overloaded errors`. Your code is not at fault. Wait a few minutes and type `try again`, or pick another model from the model picker. Expect the next request to reread the whole history without cache hits, because each model has its own cache.

## Pitfalls

- Rewriting a good prompt after an API error. The docs say a 5xx is not caused by your prompt.
- Retrying in a rapid loop. Claude Code has already retried with backoff.
- Weakening a check so a tool error disappears. Fix the cause.
- Ignoring warnings from `claude doctor`. They often name the fix.
- Treating a 529 as a quota problem. The docs say it does not count against your quota.

## Checkpoint

You see `API Error: Repeated 529 Overloaded errors`. Is it your usage limit, and what do you do?

<details><summary>Show the answer</summary>

No. It means the API is at capacity, and it does not count against your quota. Check the status page, try again in a few minutes, or switch to a different model, because capacity is tracked per model.

</details>
