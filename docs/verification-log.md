# Verification Log

Checked on 2026-10-22 against the official docs at https://code.claude.com/docs/en (65 pages fetched as raw markdown) and the installed CLI, `claude --version` 2.1.304. The newest changelog entry at that time was 2.1.308, so the installed build was four patch releases behind the docs.

Rechecked on 2026-10-23: the article authors and an independent review pass re-fetched the pages they cite. The installed CLI then reported 2.1.309. Every flag the Terminal pages teach is in its help, and the flags that were documented but absent in 2.1.304 are still absent. The sample git guard script and the Trail Notes checks were run, and the results match what the pages say. The tables below are from 2026-10-22.

This log covers whether the docs describe a feature, what the docs call it, and any label printed on the page. It does not cover runtime behavior. Nobody opened the desktop app or ran a preview feature for the log itself. Articles describe behavior the way the docs do, and the build checked steps in the app where it could.

Every link below is relative to https://code.claude.com/docs/en/. No page shows a last-updated date. The changelog and the weekly digest are the dated sources.

Verdicts: **Documented** means an official page describes it. **Partial** means it is documented on another surface only. **Not found** means no fetched page mentions it.

## Labels as printed

- Research preview: agent view, computer use (CLI and Desktop), fast mode, cloud scheduled tasks, `/ultrareview`, `--channels`.
- Public beta: Projects (Pro and Max), the iOS Simulator pane, the Bash `bashEditDiff` changed-files list in hooks.
- Beta: Artifacts templates (Slides, Design, Docs), Remote Control Trusted Devices, OpenTelemetry traces, Desktop for Linux.
- Experimental: agent teams (off by default), agent-type hooks, plugin manifest keys under `experimental`.
- Removed: `/ultraplan` (use plan mode), `--enable-auto-mode` (removed in v2.1.111).
- Deprecated: the MCP SSE transport.
- No label: Claude in Chrome (generally available per the Week 27 digest), Auto permission mode on the desktop and permission-modes pages (the Week 13 digest called it a research preview).

## Desktop app, Code tab

| Feature | What the docs say | Label | Verdict | Page |
|---|---|---|---|---|
| Session | An independent conversation with its own history, project folder, context and changes | none | Documented | `desktop#manage-sessions` |
| Sidebar and New | Lists sessions. **+ New** or Cmd+N. Ctrl+Tab and Ctrl+Shift+Tab cycle sessions | none | Documented | `desktop#work-in-parallel-with-sessions` |
| Group and sort | "Group and sort" icon on the list heading (current layout) or a Filter icon (earlier layout). A Scheduled group can be shown | none | Documented | `desktop#organize-and-find-sessions` |
| Archive | From the session menu. Archived sessions are under View all, then Archived. Optional auto-archive after a PR is merged or closed | none | Documented | `desktop#archive-a-session` |
| Rename | Click the session title in the title bar | none | Documented | `desktop#organize-and-find-sessions` |
| Pin sessions | Not on the desktop page. Pinning is documented only for CLI agent view (Ctrl+T) | agent view: research preview | **Not found for Desktop** | `agent-view` |
| Search sessions | Not on the desktop page. Desktop `/resume` searches by title, folder or branch. Agent view has Ctrl+F | none | **Partial** | `desktop#check-which-layout-you-have` |
| Project folder | The folder Claude works in, chosen in the row under the prompt box. Cloud sessions pick repositories instead | none | Documented | `desktop#start-a-session` |
| Scratch or temporary workspaces | Not mentioned on any fetched page | n/a | **Not found** | n/a |
| Environment selector | Chooses where Claude runs: local, cloud, SSH. WSL has its own page | none | Documented | `desktop#environment-configuration`, `desktop-wsl` |
| Permission modes | Manual (`default`), Accept edits (`acceptEdits`), Plan (`plan`), Auto (`auto`), Bypass permissions (`bypassPermissions`). `dontAsk` is CLI-only. Auto needs Opus 4.6 or later, Sonnet 4.6 or later, Haiku 5.5, or a Fable model. Admins can turn it off with `disableAutoMode` | none | Documented | `desktop#choose-a-permission-mode`, `permission-modes` |
| Model picker | Pick a model at the start or mid-session. Cmd+Shift+I opens the model menu | none | Documented | `desktop#keyboard-shortcuts`, `model-config` |
| Effort | Cmd+Shift+E opens the effort menu. Levels `low`, `medium`, `high`, `xhigh`, `max`. Supported levels vary by model | none | Documented | `desktop#keyboard-shortcuts`, `model-config#adjust-effort-level` |
| Fast mode | `/fast` toggles a faster configuration for Claude Opus at higher per-token cost. The page covers the CLI and cloud sessions, not the Desktop page | research preview | **Partial** | `fast-mode` |
| Panes | Chat, Changes (diff), Browser, Terminal, Files, Plan, Background tasks, Subagent. iOS Simulator on macOS. Drag to rearrange. Pop a pane out into its own window and dock it back | none | Documented | `desktop#arrange-your-workspace` |
| Changes pane | Review changes file by file. Click a line to comment | none | Documented | `desktop#review-changes-with-diff-view` |
| File pane | Edit files in local sessions. View-only in cloud, SSH and WSL | none | Documented | `desktop#open-and-edit-files` |
| Terminal pane | A shell in the session's working directory | none | Documented | `desktop#run-commands-in-the-terminal` |
| Background tasks pane | Shows subagents, background shell commands and dynamic workflows | none | Documented | `desktop#watch-background-tasks` |
| Plan pane | Listed once the session has something to show. The page does not describe its contents | none | Documented (thin) | `desktop#arrange-your-workspace` |
| Split view | Option or Alt-click a session, or right-click then Open in then Split view. Cmd+Ctrl+W takes the focused session out | none | Documented | `desktop#work-in-parallel-with-sessions` |
| Worktrees and branches | Worktree toggle (off by default). Worktrees live in `<project>/.claude/worktrees/`. A branch prefix setting. `.worktreeinclude` | none | Documented | `desktop#run-a-session-in-its-own-worktree`, `worktrees` |
| PR status | CI check status in the Changes card | none | Documented | `desktop#monitor-pull-request-status` |
| Auto-fix | Claude fixes failing checks and addresses review comments from owners, members, collaborators or GitHub Apps (local sessions). CLI counterpart `/autofix-pr` spawns a cloud session | none | Documented | `desktop#monitor-pull-request-status`, `commands` |
| Merge when ready | Turns on GitHub auto-merge (squash by default unless a merge queue is used). Disabled in SSH and WSL | none | Documented | `desktop#monitor-pull-request-status` |
| Customize | Sidebar area for connectors, skills and plugins. **+ > Add plugins** and **+ > Add connectors** | none | Documented | `desktop#extend-claude-code` |
| Skills (desktop) | Load automatically or invoke with `/`. Personal, project, plugin and claude.ai-synced skills | none | Documented | `desktop#use-skills` |
| Plugins (desktop) | Installed from **+ > Add plugins**. Scopes user, project, local. Not in cloud or WSL sessions | none | Documented | `desktop#install-plugins` |
| Connectors | MCP servers with guided setup, from **+ > Add connectors** | none | Documented | `desktop#connect-external-tools` |
| Scheduled tasks, local | Run on your machine on a schedule, only while the app is open and the computer is awake. A new session per run | none | Documented | `desktop-scheduled-tasks` |
| Scheduled tasks, cloud | Formerly called routines. Run on a schedule, an API call or GitHub events | research preview | Documented | `routines` |
| Remote Control | Connects a local session to claude.ai/code and your other devices. Set per session or with `/remote-control` | Trusted Devices: beta | Documented | `remote-control`, `desktop#control-which-sessions-appear-on-your-other-devices` |
| Cloud sessions | Run on Anthropic-managed infrastructure and continue after you close the app. Monitor at claude.ai/code. Modes Accept edits, Plan, Auto | none | Documented | `desktop#run-long-running-tasks-in-the-cloud`, `claude-code-on-the-web` |
| Projects | A sidebar item for starting and tracking many cloud sessions from one conversation. Pro and Max only, rolling out gradually | public beta | Documented | `claude-projects` |
| Dispatch | A persistent Cowork conversation that can start Code sessions. Pro or Max only, not Team or Enterprise. Setup is in a support article | none | Documented (setup external) | `desktop#sessions-from-dispatch` |
| Artifacts | Live, interactive pages published to claude.ai and shareable. Templates (Slides, Design, Docs) are labelled beta | templates: beta | Documented | `artifacts` |
| Computer use | Claude opens apps and controls the screen. Off by default. Pro or Max only. App tiers: view only (browsers), click only (terminals and IDEs), full (others) | research preview | Documented | `desktop#let-claude-use-your-computer`, `computer-use` |
| Browser pane | Shows your running app. Cmd+Shift+B toggles it. Dev servers menu. `launch.json` configures preview servers. `autoVerify` setting. Browse external sites with a clean profile and per-site approval | none | Documented | `desktop#preview-your-app`, `desktop#browse-external-sites` |
| iOS Simulator pane | Shows the app running in iOS Simulator next to the conversation. macOS only, local sessions only | public beta | Documented | `desktop-ios-simulator` |
| Side chat | Cmd+; or `/btw` asks a side question without adding to the main thread. Not saved after you close the app | none | Documented | `desktop#ask-a-side-question-without-derailing-the-session` |
| Suggested tasks | Claude proposes tasks with **Start**, **Do it here**, **Options** and **Start all** | none | Documented | `desktop#start-a-task-that-claude-suggests` |
| Work across sessions | Claude can list, read, message, rename and archive your other desktop sessions | none | Documented | `desktop#work-across-sessions` |
| Claude in Chrome | Browser extension integration, `--chrome` flag and `/chrome` | none | Documented | `chrome` |
| Agent view | `claude agents`: one screen of background sessions by state, with pin, groups and filters | research preview | Documented | `agent-view` |
| `/loop` and `/schedule` | `/loop` runs a prompt on an interval while the session stays open. `/schedule` manages cloud scheduled tasks | none | Documented | `scheduled-tasks` |

## Core features

| Feature | What the docs say | Label | Page |
|---|---|---|---|
| Install and update | Native installers (`curl -fsSL https://claude.ai/install.sh`, PowerShell `irm https://claude.ai/install.ps1`, `brew install --cask`). Also `claude update`, `claude doctor`, uninstall | none | `setup` |
| Authentication | `/login` with a claude.ai subscription, a Console API key, or cloud providers. `claude setup-token` makes a long-lived token | none | `authentication` |
| CLAUDE.md | Project and user instruction files loaded at session start | none | `memory` |
| Auto memory | Claude saves notes for itself across sessions. On by default in local sessions. Toggle with `/memory` (`autoMemoryEnabled`) | none | `memory#auto-memory` |
| Slash commands | 119 command names, including `/clear`, `/compact`, `/context`, `/cost`, `/usage`, `/plan`, `/fast`, `/effort`, `/loop`, `/schedule`, `/skill-doctor`, `/plugin`, `/remote-control`, `/rewind`, `/resume`, `/branch` | varies | `commands` |
| Skills | `SKILL.md` folders invoked as `/skill-name` or loaded automatically | none | `skills` |
| Bundled skills | Examples: `/batch`, `/claude-api`, `/code-review`, `/debug`, `/doctor`, `/loop`, `/run`, `/simplify`, `/usage`, `/verify` | none | `skills#bundled-skills` |
| `/skill-doctor` | Shows each skill's context cost and usage and flags never-invoked skills. Needs v2.1.252 or later | none | `skills#find-unused-skills` |
| Subagents | Custom agents in `.claude/agents/` and `/agents`. Built-ins: Explore, Plan, General-purpose, plus `claude`, `statusline-setup`, `claude-code-guide`. Frontmatter includes `isolation: worktree` | none | `sub-agents` |
| Agent teams | Coordinated sessions with a shared task list. Off by default (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`) | experimental | `agent-teams` |
| Hook events | 33 events: SessionStart, Setup, InstructionsLoaded, UserPromptSubmit, UserPromptExpansion, MessageDisplay, PreToolUse, PermissionRequest, PostToolUse, PostToolUseFailure, PostToolBatch, PermissionDenied, Notification, SubagentStart, SubagentStop, TaskCreated, TaskCompleted, Stop, StopFailure, TeammateIdle, ConfigChange, CwdChanged, DirectoryAdded, FileChanged, WorktreeCreate, WorktreeRemove, PreCompact, PostCompact, PreModelSwitch, PostModelSwitch, SessionEnd, Elicitation, ElicitationResult | agent hooks: experimental | `hooks`, `hooks-guide` |
| Hook handlers | `command`, `http`, `mcp_tool`, `prompt`, `agent` | agent: experimental | `hooks` |
| MCP | `claude mcp add`. Scopes `local`, `project` (`.mcp.json`), `user`. Transports HTTP (recommended), stdio, SSE (deprecated) | SSE: deprecated | `mcp` |
| Plugins | Bundles of skills, agents, hooks and MCP servers. `/plugin` menu. Install scopes user, project, local | `experimental.*` keys | `plugins/overview`, `plugins/install` |
| Marketplaces | `/plugin marketplace add`, `update`, `remove`, `list` | none | `plugins/create-marketplace`, `plugins/anthropic-marketplaces` |
| Plugin evals | `claude plugin eval` runs a plugin's eval cases with and without the plugin and scores them. Needs v2.1.269 or later | none | `plugin-evals` |
| Settings precedence | Highest to lowest: managed settings, `--settings`, `.claude/settings.local.json`, `.claude/settings.json`, `~/.claude/settings.json` | none | `settings`, `settings-reference` |
| Permissions | Allow, ask and deny rules such as `Bash(npm test)`. Working directories. Managed settings. Sandboxing | none | `permissions` |
| Plan mode | Explore and propose before editing. `/plan`, Shift+Tab cycles modes, `--permission-mode plan`, the `opusplan` model alias | none | `permission-modes#analyze-before-you-edit-with-plan-mode` |
| Context management | `/clear` starts a new conversation with empty context. `/compact [instructions]` summarizes. `/context` shows a usage grid. Auto-compaction with `--autocompact` | none | `context-window`, `model-config#context-window-and-auto-compaction` |
| Checkpointing | `/rewind` restores the conversation and/or code to an earlier point | none | `checkpointing` |
| Headless mode | `claude -p` or `--print`. `--output-format text`, `json` or `stream-json`. `--json-schema`, `--max-budget-usd`, `--allowedTools`, `--continue`, `--resume` | none | `headless` |
| Agent SDK | Claude Code as a library. Python `pip install claude-agent-sdk`. TypeScript `npm install @anthropic-ai/claude-agent-sdk` | none | `agent-sdk/overview` |
| GitHub Actions | `anthropics/claude-code-action@v1` | none | `github-actions` |
| Worktrees | `claude --worktree` or `-w` creates `.claude/worktrees/<name>/` on a new branch. `.worktreeinclude`, `worktree.baseRef`, `isolation: worktree` for subagents | none | `worktrees` |
| Usage and cost | `/usage` (aliases `/cost` and `/stats`), `/usage-credits`, the costs page. OpenTelemetry metrics on the monitoring page | traces: beta | `costs`, `monitoring-usage` |
| `/loop` | Runs a prompt on an interval while the session stays open | none | `scheduled-tasks` |

## Installed CLI 2.1.304

- Top-level commands in help: `agents`, `attach`, `logs`, `stop` (`kill`), `rm`, `respawn`, `auth`, `auto-mode`, `doctor`, `gateway`, `import`, `install`, `purge`, `update` (`upgrade`), `mcp`, `plugin` (`plugins`), `setup-token`, `ultrareview`. `remote-control`, `daemon` and `self-hosted-runner` work but are not in the top-level help.
- Notable flags in help: `--model`, `--effort <low|medium|high|xhigh|max>`, `--fallback-model`, `--name/-n`, `--session-id`, `--fork-session`, `--from-pr`, `-c/--continue`, `-r/--resume`, `--permission-mode <acceptEdits|auto|bypassPermissions|manual|dontAsk|plan>`, `--dangerously-skip-permissions`, `--allowedTools`, `--disallowedTools`, `-p/--print`, `--output-format`, `--input-format`, `--json-schema`, `--max-budget-usd`, `-w/--worktree [name]`, `--add-dir`, `--bg/--background`, `--cloud`, `--remote-control [name]`, `--chrome`, `--settings`, `--mcp-config`, `--plugin-dir`, `--agents`, `--agent`, `--system-prompt`, `--append-system-prompt`, `--verbose`, `--debug`, `--autocompact`.
- Documented in the CLI reference but absent from this build's help, so not taught as working: `--advisor`, `--append-subagent-system-prompt`, `--append-subagent-system-prompt-file`, `--append-system-prompt-file`, `--channels` (research preview), `--dangerously-load-development-channels`, `--exec`, `--init`, `--init-only`, `--maintenance`, `--max-turns`, `--ref`, `--system-prompt-file`, `--teammate-mode`. The docs state no minimum version for them.

## Seen in the app, not in the docs

These are flagged "Observed in the app" wherever an article mentions them.

- Scratch or temporary workspaces on the desktop.
- Pinning and searching sessions in the desktop sidebar.
- Fast mode on the Desktop Code tab.
- The contents of the Plan pane. Its empty state was seen on 2026-10-23: the title Plan, "No plan yet", and "Claude writes the plan here as it explores. Keep chatting." A pane holding a plan has not been seen.

## Tested by hand

- 2026-10-23, desktop app screenshots sent by the owner, Code tab: the permission mode menu (titled Mode, five entries in the order Auto, Manual, Accept edits, Plan, Bypass permissions, each with a number and a description), the model picker menu (Opus 5.5, Fable 5.1, Sonnet 5.5, Haiku 5.5, an Effort submenu, More models) and the Plan pane's empty state. The three Observed callouts on Permission Modes Explained, Which Model and Effort, and The Panes say what was seen. The Effort submenu and the keyboard shortcuts were not tried.

- 2026-10-23, Browser pane (desktop app 3.6556.2, reports Chrome 152): `navigator.serviceWorker.register('./sw.js')` for a page on `http://localhost:8765/` fails with "An unknown error occurred when fetching the script", while a plain `fetch('./sw.js')` returns 200 as `text/javascript`. `isSecureContext` is true and the Cache API exists. Offline reload therefore cannot be tested in the pane.
- 2026-10-23, Google Chrome 156 (headless, throwaway profile, driven over the debugging port), `exercises/trail-notes-solutions/capstone-3a`: the worker installed and cached the six shell files in `trail-notes-v1`. The first load was not controlled (`navigator.serviceWorker.controller` was null) and the reload was. With the server stopped, a reload still showed Trail Notes and ran `app.js`, and a file outside the cache failed with a network error. The Application panel's Offline checkbox and Update on reload were not used.
- 2026-10-23, built site in Google Chrome 156 (headless, driven over the debugging port): `light-dark()`, container queries and `backdrop-filter` are supported. Tabbing through four pages gave a sensible order, a visible ring on each stop, and a skip link that appears at the top left and moves focus to the main content. With forced colors emulated, and at 375 px wide, in light, dark and forced-colors, none of four pages scrolled sideways and none logged a console error. Chrome's forced-colors emulation is not Windows High Contrast. Safari, Firefox, VoiceOver and a real Windows high-contrast theme are still open.
- 2026-10-23, built site in Safari (macOS, light mode, 959 px wide window, screenshot only): the Level 1 page showed the header with search and theme buttons, the sidebar groups, chips and body text with no visible layout fault. Dark mode, narrow widths and other pages were not checked in Safari.
- 2026-10-23, Capstone 1 prompts, run with `claude -p` (CLI 2.1.309, project settings only) in a scratch copy of the Trail Notes starter: the setup claims hold (clean tree, last line `10 passed, 2 failed`). The Plan-mode diagnosis prompt returned three ranked hypotheses and edited no project file. It did write its plan to a file under `~/.claude/plans/`. The fix prompt changed only `notes.js` and ended at `12 passed, 0 failed`. Claude's own run time was about 38 s and 24 s. A learner's time was not measured, so the time budgets on the pages stay planning figures.
- 2026-10-23, Capstone 2 prompts, same method, in a copy of `capstone-1/` with a hand-written `SPEC.md` (the interactive grilling in Module M2.1 was not run): the first prompt wrote `checks/tags.check.mjs` with 8 checks failing for the stated reason and left `notes.js` alone. The second changed only `notes.js` and reached `21 passed, 0 failed`. The third wired `app.js`, `index.html`, `notes.js` and `style.css` and reached `23 passed, 0 failed`. A `-p` session has no Browser pane, so Claude could not take the screenshot the prompt asks for. In Chrome 156, driven over the debugging port, the result added three tagged notes (tags were trimmed, lowercased and de-duplicated), a blank title added nothing, filtering by one tag showed only its notes, the filter combined with search, and notes and tags survived a reload.
- 2026-10-23, Capstone 3a prompts, same method, in a copy of `capstone-2/` with a hand-written `OFFLINE.md` listing the five shell files: the gate prompt wrote `checks/cache-version.check.mjs` and ended at `22 passed, 2 failed` with sw.js missing (Claude chose a committed history file to remember the previous list, and tried to run a scenario script that a `-p` run could not get approved). The service worker prompt wrote `sw.js` and a short registration in `app.js` and ended at `24 passed, 0 failed`. That `sw.js` installed in Chrome 156, controlled the page after a reload, and loaded Trail Notes with the server stopped. Adding a file to `APP_SHELL` without raising `CACHE_VERSION` failed the gate with a message that says to raise it, and raising it passed. Claude's run time was 94 s and 42 s.
- 2026-10-23, `templates/hook.md`: the extracted script blocks `git reset --hard` with exit code 2 and the stderr text, and exits 0 for `git status`, when fed fake events. Run in a real CLI 2.1.309 session (`claude -p`, project settings only), a request to reset the repository was blocked: Claude's reply quoted `PreToolUse:Bash hook error: [node ${CLAUDE_PROJECT_DIR}/.claude/hooks/block-destructive-git.mjs]: Blocked: this git command can destroy work. Ask the user to run it.` and both commits survived. The same test in a Code tab session is still open.

## Notes

- `claude plugin eval` has a public page at `plugin-evals`. The `plugins/plugin-evals` path in the docs map returns 404.
- `/skill-doctor` is documented on the commands and skills pages (v2.1.252 or later) and is unavailable in sessions that skip feature-flag fetching.
