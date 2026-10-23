---
title: Commands Cheatsheet
kind: cheatsheet
order: 2
verified: 2026-10-23
sources:
  - https://code.claude.com/docs/en/commands
  - https://code.claude.com/docs/en/desktop
  - https://code.claude.com/docs/en/desktop-quickstart
  - https://code.claude.com/docs/en/skills
  - https://code.claude.com/docs/en/fast-mode
---

The commands a developer reaches for most, grouped by job. Type `/` at the start of a message to see the commands available to you, or `/` plus a few letters to filter. In the desktop app you can also click **+** next to the prompt box and choose **Slash commands**. The docs page is titled Commands; this page's file name keeps the older word "slash". Text after the command name becomes its arguments. In the tables, `[arg]` is optional.

Not every command appears for every user, because availability depends on platform, plan and environment. Entries marked "bundled skill" are prompts Claude follows rather than fixed program logic. In the Code tab, commands that open an interactive panel in the terminal behave differently. The desktop page says a command with no argument form, such as `/permissions`, replies `isn't available in this environment`, and `/config` opens **Settings > Claude Code**. To use those, edit the settings files or run the command in the standalone CLI.

## Set Up a Project

| Command | What it does | More |
| :- | :- | :- |
| `/init` | Generates a starter `CLAUDE.md` for the project | [A CLAUDE.md That Earns Its Keep](../kb/workflow/a-claude-md-that-earns-its-keep.md) |
| `/memory` | Edits `CLAUDE.md` files, turns auto memory on or off and shows its entries | [Memory: What to Save](../kb/workflow/memory-what-to-save.md) |
| `/permissions` | Manages allow, ask and deny rules for tools | [Permission Tuning for Fewer Prompts](../kb/workflow/permission-tuning-for-fewer-prompts.md) |
| `/mcp` | Manages MCP server connections and their sign-ins | [Customize: Skills, Plugins and Connectors](../kb/app/customize-skills-plugins-and-connectors.md) |

## Steer the Session

| Command | What it does | More |
| :- | :- | :- |
| `/plan [description]` | Enters plan mode from the prompt, optionally starting on a task | [Plan Mode](../kb/development/plan-mode-think-before-you-edit.md) |
| `/model [model]` | Switches the model and saves it as your default for new sessions. With no argument it opens a picker. | [Model and Effort Trade-offs](../kb/optimization/model-and-effort-trade-offs.md) |
| `/effort [level]` | Sets the effort level: `low` up to `xhigh`, `max`, or `auto`. `status` prints the current level. | [Model and Effort Trade-offs](../kb/optimization/model-and-effort-trade-offs.md) |
| `/fast [on\|off]` | Toggles fast mode, a faster Opus configuration at a higher cost per token. On subscription plans it is available through usage credits only. Research preview. | [Fast Mode: When It Pays](../kb/optimization/fast-mode-when-it-pays.md) |
| `/btw [question]` | Asks a side question without adding it to the conversation | [Split View, Side Chat and Side Sessions](../kb/app/split-view-side-chat-and-side-sessions.md) |

## Manage Context

| Command | What it does | More |
| :- | :- | :- |
| `/context` | Shows what is using the context window as a colored grid, with suggestions | [How Context Works](../kb/optimization/how-context-works.md) |
| `/compact [instructions]` | Summarizes the conversation to free space. The instructions tell the summary what to keep. | [Clear, Compact and Hand Off](../kb/optimization/clear-compact-and-hand-off.md) |
| `/clear [name]` | Starts a new conversation with empty context. The old one stays available through `/resume`. Aliases: `/reset`, `/new`. | [Clear, Compact and Hand Off](../kb/optimization/clear-compact-and-hand-off.md) |

## Resume, Branch and Undo

| Command | What it does | More |
| :- | :- | :- |
| `/resume [session]` | Resumes a conversation by ID or name, or opens the session picker. Alias: `/continue`. | [Resume and Continue](../kb/terminal/resume-and-continue.md) |
| `/branch [name]` | Copies the conversation at this point and switches you into the copy, keeping the original | [Resume and Continue](../kb/terminal/resume-and-continue.md) |
| `/rewind` | Rolls code and conversation back to a checkpoint, or summarizes from a chosen message. Aliases: `/checkpoint`, `/undo`. | [Undo and Recover](../kb/development/undo-and-recover.md) |

## Review and Ship

| Command | What it does | More |
| :- | :- | :- |
| `/diff` | Shows the changes in your working tree, including Claude's edits | [Reading and Reviewing Diffs](../kb/development/reading-and-reviewing-diffs.md) |
| `/code-review [level] [--fix] [target]` | Reviews the current diff, or a pull request number, branch or path, for correctness bugs. `--fix` applies the findings. Alias: `/review`. Bundled skill. | [Code Review, Yours and Claude's](../kb/development/code-review-yours-and-claudes.md) |
| `/security-review` | Analyzes the changes on your branch for security vulnerabilities. Needs an `origin` remote. | [Security Review Habits](../kb/development/security-review-habits.md) |
| `/autofix-pr [prompt]` | Starts a cloud session that watches the branch's pull request and pushes fixes for failing checks and review comments. Needs the `gh` tool and cloud sessions. | [Pull Requests and Auto-fix](../kb/app/pull-requests-and-auto-fix.md) |

## Check Health and Cost

| Command | What it does | More |
| :- | :- | :- |
| `/usage` | Shows session cost, plan usage limits and activity stats. Aliases: `/cost`, `/stats`. | [Reading Your Usage, Context and Skills](../kb/optimization/reading-your-usage-context-and-skills.md) |
| `/doctor` | Runs a setup checkup on installation, settings, extensions and `CLAUDE.md`, and applies fixes after you confirm. Bundled skill. | [Errors and Retries](../kb/troubleshooting/errors-and-retries.md) |
| `/skill-doctor` | Shows what each skill costs in context and how often it is used. Needs Claude Code 2.1.252 or later. | [Reading Your Usage, Context and Skills](../kb/optimization/reading-your-usage-context-and-skills.md) |

## Extend and Automate

| Command | What it does | More |
| :- | :- | :- |
| `/plugin [subcommand]` | Opens the plugin menu, or runs `list`, `install`, `enable` or `disable` directly | [Customize: Skills, Plugins and Connectors](../kb/app/customize-skills-plugins-and-connectors.md) |
| `/hooks` | Opens a read-only browser of your configured hooks | [Hooks: Guardrails and Warnings](../kb/workflow/hooks-guardrails-and-warnings.md) |
| `/loop [interval] [prompt]` | Runs a prompt repeatedly while the session stays open. Bundled skill. | [Scheduled Tasks and Loops](../kb/workflow/scheduled-tasks-and-loops.md) |
| `/schedule [description]` | Creates, updates, lists or runs cloud scheduled tasks, formerly routines. Research preview. | [Scheduled Tasks and Loops](../kb/workflow/scheduled-tasks-and-loops.md) |
| `/remote-control` | Makes this session available from claude.ai and your other devices. Alias: `/rc`. | [Remote Control and Cloud Sessions](../kb/app/remote-control-and-cloud-sessions.md) |

## Removed or Changed

| Command | Status |
| :- | :- |
| `/ultraplan` | Removed. Use plan mode. |
| `/pr-comments` | Removed in 2.1.91. Ask Claude to view pull request comments. |
| `/vim` | Removed in 2.1.92. Use `/config` and the editor mode setting. |
| `/agents` | Prints a reminder to ask Claude to create or manage subagents, or to edit `.claude/agents/` yourself. Versions 2.1.197 and earlier open an interface. |
| `/review` | Now an alias of `/code-review`. |

Skills you write yourself appear in the same menu as commands. See [Your First Skill](../kb/workflow/your-first-skill.md).
