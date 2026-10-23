---
title: Scheduled Tasks and Loops
id: W11
area: workflow
level: 3
time: 9
tags: [scheduled-tasks, loop]
verified: 2026-10-22
status: verified
sources:
  - https://code.claude.com/docs/en/desktop-scheduled-tasks
  - https://code.claude.com/docs/en/routines
  - https://code.claude.com/docs/en/scheduled-tasks
  - https://code.claude.com/docs/en/skills
related: [A11, A12, W09]
---

Claude Code can run a prompt on a schedule in three places: in your open session with `/loop`, on your machine as a Desktop scheduled task, or in the cloud as a cloud scheduled task. Choose by where the work has to run and whether your computer will be on.

## When to Use It

Use a schedule for work that repeats, has a clear outcome and needs no decision from you while it runs: a daily check, a weekly refresh, a backup. The author has eight scheduled tasks for recurring chores, such as a daily inbox triage, refresh queues for reference material and a settings backup.

The docs label cloud scheduled tasks, formerly called routines, a research preview whose behavior, limits and API may change. They are available on Pro, Max, Team and Enterprise plans.

## Decision Table

This table follows the docs' comparison of the three options.

| | `/loop` | Desktop task | Cloud task |
|---|---|---|---|
| Runs on | Your machine | Your machine | Anthropic-managed cloud by default |
| Needs your computer on | Yes | Yes | No |
| Needs an open session | Yes | No | No |
| Local files | Yes | Yes | No, a fresh clone |
| Minimum interval | 1 minute | 1 minute when Claude sets it, 1 hour in the forms | 1 hour |
| Permission prompts | Inherits from the session | Set per task | Auto mode by default |
| Create with | `/loop` | **Scheduled** in the Code tab sidebar | `/schedule` or claude.ai/code/routines |

Desktop tasks run only while the app is open and your computer is awake, and each run is a new session. If the computer sleeps through a scheduled time, the run is skipped. When the app starts or the computer wakes, Desktop starts one catch-up run for the most recent missed time within the last seven days. A task set for 9am can therefore run late, so write the prompt to cope with that. **Keep computer awake** in **Settings > This computer > System** prevents idle sleep.

### Create a Desktop Task

1. **Click** **Scheduled** in the Code tab sidebar, then **New task**. If a menu opens with **Create with Claude** and **Set up manually**, select **Set up manually**.
2. **Enter** a **Name**. Desktop turns it into lowercase kebab-case and uses it as the task's folder name.
3. **Write** the instructions. The run is a new session with no memory of this chat, so make the prompt self-contained.
4. **Turn on** **Only on this computer** under **Advanced settings**, then pick the **Local folder**. The docs describe a second dialog layout with that switch at the top. Follow their steps for that layout if you see it.
5. **Choose** a schedule in the **Trigger** card: Hourly, Daily, Weekdays or Weekly. **Manual** and **Custom** (a cron expression in local time) are in the **Edit** form.
6. **Pick** a permission mode and model in the instructions box, then click **Create**.
7. **Click** **Run now** and watch the first run. In Manual mode a run stalls on any tool it lacks permission for until you answer in that run's session.

Allow rules from `~/.claude/settings.json` apply to task sessions. To give each run its own git worktree, select **Worktree** in the **Edit** form (see [Parallel Sessions Without Collisions](parallel-sessions-without-collisions.md)). Desktop keeps each task's prompt in `~/.claude/scheduled-tasks/<task-name>/SKILL.md`. The schedule, folder and model are not in that file.

## Worked Example

While you fix the Trail Notes search bug, watch the checks with a loop in the session:

```prompt
/loop 5m run node checks/run.mjs and tell me only if the result changed since the last run
```

A fixed interval like `5m` is converted to a cron schedule. To stop it, ask Claude to cancel the loop, because `Esc` and `Ctrl+C` do not stop a fixed-interval loop. A loop also ends on its own after seven days. Without an interval, `/loop check the checks` lets Claude pick a delay between one minute and one hour each time. A bare `/loop` runs a built-in maintenance prompt, or your `loop.md` if one exists.

For a chore that outlives the session, make a Desktop task on the Trail Notes folder, schedule it for Weekdays, and use this as the instructions:

```prompt
Run node checks/run.mjs in this folder. If every check passes, say so in one line. If a check fails, name the check file and the first failing assertion. Do not edit any file.
```

The prompt names a command and an outcome and forbids edits, so a late run does no harm. The author's rule is to schedule the chore and keep the thinking for yourself. Desktop tasks suit chores that tolerate a late run.

For a cloud task, run `/schedule` and describe the chore, for example `/schedule daily PR review at 9am`. Claude asks follow-up questions and saves it to your account. `/schedule list`, `/schedule update` and `/schedule run` manage existing tasks. A cloud run starts a fresh cloud session. Skills that exist only in `~/.claude/skills/` on your machine are not found there, but Desktop tasks do load them.

## Pitfalls

- `/loop` tasks fire only while Claude Code is running and idle. Closing the session stops them.
- A recurring `/loop` task expires seven days after you create it. For anything longer, use a Desktop or cloud task.
- The `/loop` scheduler adds jitter. A recurring task can start up to half the gap to its next run late, by at most 30 minutes, except a five-minute loop, which is not delayed and starts 4 minutes 45 seconds after the previous run.
- A green status on a cloud run means the session started and exited without an infrastructure error. It does not mean the work succeeded. Open the run and read it.
- Cloud tasks belong to your account. Commits, pull requests and connector actions appear as you.
- If your GitHub connection lapses, cloud runs are skipped for up to 72 hours, then the task turns off.
- `/schedule` is unavailable when you sign in with an API key or a cloud provider login. Use claude.ai/code/routines instead.
- A task prompt is plain text on disk. Do not put secrets in it, and read [Config as a Repo](config-as-a-repo.md) before you commit the folder.

## Checkpoint

1. You want a check to run at 6am whether or not your Mac is on. Which option do you use?
2. You started `/loop 5m` and pressed `Esc`, but it keeps firing. Why?

<details><summary>Show the answer</summary>

1. A cloud scheduled task, which runs on Anthropic-managed infrastructure. It starts from a fresh clone, so it cannot use files that exist only on your machine.
2. `Esc` stops a self-paced loop that is waiting. A fixed-interval loop such as `/loop 5m` stops only when you ask Claude to cancel it, or after seven days.

</details>
