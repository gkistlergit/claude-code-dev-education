---
title: Glossary
kind: glossary
order: 1
verified: 2026-10-22
sources:
  - https://code.claude.com/docs/en/glossary
  - https://code.claude.com/docs/en/desktop
  - https://code.claude.com/docs/en/commands
  - https://code.claude.com/docs/en/permission-modes
  - https://code.claude.com/docs/en/memory
  - https://code.claude.com/docs/en/skills
  - https://code.claude.com/docs/en/sub-agents
  - https://code.claude.com/docs/en/hooks
  - https://code.claude.com/docs/en/plugins/overview
  - https://code.claude.com/docs/en/worktrees
  - https://code.claude.com/docs/en/checkpointing
  - https://code.claude.com/docs/en/context-window
  - https://code.claude.com/docs/en/fast-mode
  - https://code.claude.com/docs/en/desktop-scheduled-tasks
---

Short definitions of the terms this knowledge base uses, in alphabetical order. Names match the official docs and the labels the desktop app prints. Each entry points to the article that covers the idea in depth. A list of vague or outdated words and the terms to use instead closes the page.

## A

**Accept edits**: A permission mode (`acceptEdits`). Claude approves file edits and common filesystem commands such as `mkdir`, `touch` and `mv` on its own, and still asks before other terminal commands. Earlier versions of the Code tab called it Auto accept edits. See [Permission Modes Explained](app/permission-modes-explained.md).

**Agent teams**: Several Claude Code sessions coordinated by a team lead, with a shared task list. Unlike subagents, each teammate has its own context window. Experimental and off by default. See [Subagents by Design](workflow/subagents-by-design.md).

**Auto-fix**: A control on a pull request in the Changes card. Claude fixes failing checks and, in local sessions, addresses new review comments from the repository owner, an organization member, a collaborator or a GitHub App. See [Pull Requests and Auto-fix](app/pull-requests-and-auto-fix.md).

**Auto memory**: Notes Claude writes for itself from your corrections and preferences, kept per repository and loaded at the start of each session. It is on by default in local sessions, and `/memory` turns it on or off. See [Memory: What to Save](workflow/memory-what-to-save.md).

**Auto mode**: A permission mode (`auto`) in which a separate classifier model reviews actions instead of you, so Claude runs without routine prompts. It needs a supported model, and administrators can turn it off. See [Permission Modes Explained](app/permission-modes-explained.md).

## B

**Bypass permissions**: A permission mode (`bypassPermissions`) that runs without permission prompts, apart from the few actions no mode auto-approves. It is equivalent to `--dangerously-skip-permissions` and belongs in a sandbox, container or virtual machine. See [Which Permission Mode](decision-guides/which-permission-mode.md).

## C

**CACHE_VERSION**: A constant in the `sw.js` that the capstone 3a solution adds to Trail Notes. A check fails when the list of cached files changes without a new version. See [Offline-First with Service Workers](app-development/offline-first-with-service-workers.md).

**Checkpoint**: A restore point Claude Code creates at each prompt that starts a turn. `/rewind` restores code, conversation or both. Checkpoints do not replace version control. See [Undo and Recover](development/undo-and-recover.md).

**Checks**: In Trail Notes, plain Node scripts in the `checks/` folder that use only the standard library. `node checks/run.mjs` runs all of them. See [Testing Without a Framework](app-development/testing-without-a-framework.md).

**CLAUDE.md**: A file of instructions you write for Claude, loaded at the start of every session. A project file lives at `./CLAUDE.md` or `./.claude/CLAUDE.md`, and a personal one at `~/.claude/CLAUDE.md`. The docs target under 200 lines. See [A CLAUDE.md That Earns Its Keep](workflow/a-claude-md-that-earns-its-keep.md) and the [template](../templates/claude-md.md).

**Cloud session**: A session that runs on Anthropic-managed infrastructure and keeps going after you close the app. See [Remote Control and Cloud Sessions](app/remote-control-and-cloud-sessions.md).

**Code tab**: The tab in the desktop app where Claude Code sessions run. See [Tour of the Code Tab](app/tour-of-the-code-tab.md).

**Command**: A reusable instruction you run by typing `/name` at the start of a message, such as `/clear` or `/compact`. Skills and plugins can add more. See the [Commands Cheatsheet](../cheatsheets/slash-commands.md).

**Compaction**: Summarizing the conversation to free space in the context window. It happens automatically near the limit, or on demand with `/compact`. See [Clear, Compact and Hand Off](optimization/clear-compact-and-hand-off.md).

**Connector**: An MCP server with guided setup. In the desktop app you add one from **+ > Add connectors**. See [Customize: Skills, Plugins and Connectors](app/customize-skills-plugins-and-connectors.md).

**Context window**: The working memory of a session. It holds your messages, file contents, command output, CLAUDE.md, loaded skills and system instructions, and `/context` shows what fills it. See [How Context Works](optimization/how-context-works.md).

## D

**Dispatch**: A persistent conversation in Cowork that can start Code sessions, for example from your phone. It needs a Pro or Max plan. See [Projects, Dispatch and Artifacts](app/projects-dispatch-and-artifacts.md).

## E

**Effort level**: A setting for how much the model reasons: `low`, `medium`, `high`, `xhigh` or `max`. Supported levels vary by model. Cmd+Shift+E opens the effort menu. See [Model and Effort Trade-offs](optimization/model-and-effort-trade-offs.md).

## F

**Fast mode**: A research preview. A faster configuration of Claude Opus at a higher cost per token, toggled with `/fast`. See [Fast Mode: When It Pays](optimization/fast-mode-when-it-pays.md).

**Frontmatter**: A block of YAML between two `---` lines at the top of a Markdown file. Skills, subagents and rules read their settings from it. See [Your First Skill](workflow/your-first-skill.md).

## G

**Gate**: A script that fails loudly when a rule is broken, such as a check that the cache version changed when the cached file list did. A gate worth keeping is one that has caught you at least once. See [Definition of Done and Gates](process/definition-of-done-and-gates.md).

**Grill**: A long question-and-answer session in which Claude questions you about a plan until the decisions are explicit, before anyone writes the spec. See [Grill, Spec, Tickets](process/grill-spec-tickets.md).

## H

**Handoff**: A note you write at the end of a long session so a fresh session can carry on. The author's setup uses handoffs far more than compaction, because a note you wrote is easier to trust than an automatic summary. See [Handoffs Between Sessions and Devices](workflow/handoffs-between-sessions-and-devices.md) and the [template](../templates/handoff.md).

**Hook**: A handler that runs automatically at a fixed point in Claude Code's lifecycle, such as before a tool runs. A hook has an event, a matcher and a handler. Exit code 2 from a command hook blocks the action. See [Hooks: Guardrails and Warnings](workflow/hooks-guardrails-and-warnings.md) and the [template](../templates/hook.md).

## L

**Ledger**: A file that records each deploy: the commit, the version, what was verified and what was not. Rotate it before it becomes unreadable. See [Handoff Ledgers and Retros](process/handoff-ledgers-and-retros.md).

## M

**Manual**: The permission mode the app and `claude --help` label Manual, with config value `default`. Claude asks before it edits files or runs commands. See [Permission Modes Explained](app/permission-modes-explained.md).

**MCP (Model Context Protocol)**: An open standard for connecting Claude to outside tools and data. An MCP server gives Claude new tools. See [Customize: Skills, Plugins and Connectors](app/customize-skills-plugins-and-connectors.md).

**Memory**: What carries across sessions. Each session starts with a fresh context window, and two things persist: CLAUDE.md files you write and auto memory Claude writes. See [Memory: What to Save](workflow/memory-what-to-save.md).

## N

**Non-interactive mode**: Running `claude -p` with one prompt, which prints the answer and exits. The docs formerly called it headless mode. See [Headless and Scripting](terminal/headless-and-scripting.md).

## P

**Pane**: A section of the Code tab workspace: chat, Changes, Browser, Terminal, Files, Plan, Background tasks or Subagent, plus the iOS Simulator on macOS. You drag panes to rearrange them. The ones used most are Changes, the diff view (Cmd+Shift+D), Browser (Cmd+Shift+B) and Terminal (Ctrl+Backtick). See [The Panes](app/the-panes.md).

**Permission mode**: The baseline for how much Claude asks before acting. The app offers Manual, Accept edits, Plan, Auto and Bypass permissions, and the terminal adds `dontAsk`. See [Permission Modes Explained](app/permission-modes-explained.md).

**Permission rule**: An allow, ask or deny entry for a tool, such as `Bash(npm test)`. Rules are finer than a permission mode. See [Permission Tuning for Fewer Prompts](workflow/permission-tuning-for-fewer-prompts.md).

**Plan mode**: A permission mode in which Claude researches and proposes changes without editing your source until you approve the plan. See [Plan Mode: Think Before You Edit](development/plan-mode-think-before-you-edit.md).

**Plugin**: A bundle of skills, subagents, hooks and MCP servers installed as one unit. In the app you add one from **+ > Add plugins**. See [Customize: Skills, Plugins and Connectors](app/customize-skills-plugins-and-connectors.md).

**Project folder**: The folder Claude works in, chosen in the row under the prompt box. Cloud sessions pick repositories instead. See [Choosing a Project Folder](app/choosing-a-project-folder.md).

**Projects**: A sidebar item for starting and tracking many cloud sessions from one conversation. It is a public beta for Pro and Max plans. Not the same as a project folder. See [Projects, Dispatch and Artifacts](app/projects-dispatch-and-artifacts.md).

## R

**Remote Control**: A way to continue a local session from claude.ai or your other devices. The code still runs on your machine. See [Remote Control and Cloud Sessions](app/remote-control-and-cloud-sessions.md).

**Rules file**: A Markdown file in `.claude/rules/` that loads alongside CLAUDE.md. An optional `paths` frontmatter field limits it to matching files. See [Rules and Global Settings](workflow/rules-and-global-settings.md) and the [template](../templates/rules-file.md).

## S

**Scheduled task**: Work that starts a new session at a time you choose. Local tasks run only while the app is open and the computer is awake. Cloud scheduled tasks, formerly routines, are a research preview. See [Scheduled Tasks and Loops](workflow/scheduled-tasks-and-loops.md).

**Seeded bug**: The one deliberate defect in the Trail Notes starter. `searchNotes` matches case-sensitively, so `checks/search.check.mjs` fails until you make it match titles and bodies without regard to case. See the [starter](../exercises/trail-notes-starter/README.md).

**Service worker**: A script the browser runs in the background. Trail Notes adds one in capstone 3a to cache the app shell so the app opens offline. Read the [MDN overview](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) and [Offline-First with Service Workers](app-development/offline-first-with-service-workers.md).

**Session**: An independent conversation with its own history, project folder, context and changes. See [Sessions and the Sidebar](app/sessions-and-the-sidebar.md).

**Side chat**: A question you ask with Cmd+; or `/btw` that uses the session's context without adding to the main thread. The app does not save side chats. See [Split View, Side Chat and Side Sessions](app/split-view-side-chat-and-side-sessions.md).

**Skill**: A folder with a `SKILL.md` file of instructions that Claude loads when relevant or that you run as `/skill-name`. See [Your First Skill](workflow/your-first-skill.md) and the [template](../templates/skill.md).

**Standing go**: A permission you give once to do a defined step, such as merge and deploy, whenever stated conditions hold, paired with a short stop list of cases that always need you. See [A Standing Go with a Stop List](process/a-standing-go-with-a-stop-list.md).

**Subagent**: An assistant that works in its own context window with its own prompt and tools, then returns a summary to your session. Built in: Explore, Plan and General-purpose. See [Delegating to Subagents](optimization/delegating-to-subagents.md) and the [template](../templates/subagent.md).

## T

**Trail Notes**: The small framework-free notes app used in every hands-on step. Its files are `index.html`, `style.css`, `app.js`, `notes.js` and `manifest.webmanifest`, with checks in `checks/`. See the [starter](../exercises/trail-notes-starter/README.md) and the [solutions](../exercises/trail-notes-solutions/README.md).

## W

**Worktree**: A separate working directory with its own files and branch that shares the repository's history. The app's **Worktree** toggle runs a session in one under `.claude/worktrees/`. See [Worktrees and Branches in the App](app/worktrees-and-branches-in-the-app.md).

## Terms to Avoid

| Avoid | Use instead | Why |
| :- | :- | :- |
| Slash command, as a general term | Command | The docs dropped the word "slash". Keep the exact label **Slash commands** only when you name that menu entry in the app. |
| Custom command | Skill | Files in `.claude/commands/` still work, but skills are the recommended form and can hold supporting files. |
| Headless mode | Non-interactive mode | The docs renamed it. It is the same `-p` flag. |
| Web session, or Claude Code on the web for any cloud run | Cloud session | The web name now covers only the browser surface at claude.ai/code. |
| Routines | Cloud scheduled tasks | Renamed. The docs say "formerly routines". |
| Ask permissions, Auto accept edits | Manual, Accept edits | Earlier labels of the Code tab's permission modes. |
| Skip permissions, YOLO mode | Bypass permissions | One mode, with a documented name and documented limits. |
| Chat, for a session | Session for the whole unit, conversation for its messages | A session also carries a folder, context and changes. Use side chat only for Cmd+;. |
| Memory, for the context window | Context window | The context window empties between sessions. Memory means CLAUDE.md and auto memory, which persist. |
| Reset or restart a session | `/clear`, `/compact` or `/rewind` | The three commands do different things: new conversation, summary, or go back to a checkpoint. |
| Agent, unqualified | Subagent, teammate or background session | Say which one. Each has its own context and its own controls. |
| Terminal, unqualified | The Terminal pane, the Terminal app or the `claude` command | The word covers three different things in this course. |
| Config, for CLAUDE.md | Instructions file, or settings file for `settings.json` | Instructions guide Claude. Settings control the program. |
