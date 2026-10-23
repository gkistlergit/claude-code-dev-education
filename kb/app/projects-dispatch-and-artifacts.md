---
title: Projects, Dispatch and Artifacts
id: A12
area: app
level: 3
time: 8
tags: [projects, dispatch, artifacts, beta]
verified: 2026-10-23
status: verified
sources:
  - https://code.claude.com/docs/en/claude-projects
  - https://code.claude.com/docs/en/desktop#sessions-from-dispatch
  - https://code.claude.com/docs/en/artifacts
related: [A11, W11, A09]
---

Projects, Dispatch and Artifacts are three features that connect to the Code tab. Projects track many cloud sessions from one conversation. Dispatch starts Code sessions from a persistent conversation you message from your phone. Artifacts turn session output into live pages on claude.ai. Each has a different label and a different set of plans that can use it.

## When to Use It

Use a project when one goal produces a stream of related tasks. Use Dispatch when you want to hand off development work while away from your computer. Use an artifact when terminal text is the wrong medium for what Claude produced, such as an annotated diff or a dashboard. None of the three was run while writing this course, so this page reports what the docs say.

## Decision Table

| Feature | Label in the docs | Who can use it | What it does |
|---|---|---|---|
| Projects | Public beta, rolling out gradually | Pro and Max. Not offered on Team or Enterprise yet | One coordinating conversation that starts and tracks cloud sessions |
| Dispatch | No label | Pro or Max only. Not Team or Enterprise | A persistent conversation in Cowork that can start Code sessions |
| Artifacts | No label | Pro, Max, Team and Enterprise | Live pages published from a session to claude.ai |
| Artifact templates (Slides, Design, Docs) | Beta | On by default on Pro, Max and Team. On Enterprise an Owner turns each on | Decks, designs and documents that open in their own editor |

### Projects

A project is one ongoing conversation where Claude acts as coordinator. It starts a thread for each task. Each thread is usually a cloud session, and you can ask Claude to run one on your own computer through Remote Control. In the Code tab, select Projects in the sidebar, or look under More. If it is missing there too, the rollout has not reached your account, and the docs link a waitlist.

To create one, select New project, enter a Name (the only required field), optionally a Goal and some Context such as GitHub repositories and files, then click Create project. Code projects need the work on github.com, push access for your connected GitHub account, and the Claude GitHub App installed.

The Overview pane beside the conversation groups threads as Ready for review, Waiting on you, Working, Landing, Idle and Resolved. Its other tabs are Library, Pull requests and Scheduled tasks. A new project runs every thread on Opus at high effort, so check Thread model and Thread effort in Project settings > General first. Projects use your plan faster than one session does, and the docs state an enforced limit of 200 new threads per day across your projects. Usage in Project settings shows token use by thread.

Projects are not available in the terminal CLI, the VS Code extension or the JetBrains plugin. You cannot add a session you started yourself on your machine to a project, and a project belongs to one user.

### Dispatch

[Dispatch](https://support.claude.com/en/articles/13947068) is a persistent conversation with Claude that lives in Cowork. You message it a task and it decides how to handle it. A task becomes a Code session when you ask for one, such as "open a Claude Code session and fix the login bug", or when Dispatch decides it is development work. Fixing bugs, updating dependencies, running tests and opening pull requests usually route to Code. Research, document editing and spreadsheet work stay in Cowork.

The session appears in the Code tab's sidebar with your others. With default grouping, look for the newest session in the group for the folder it runs in. You get a push notification on your phone when it finishes or needs your approval. Setup and pairing are in the Dispatch help article, not in the Claude Code docs.

### Artifacts

An artifact is a live page that Claude publishes from your session to a private URL on claude.ai. It stays private to you until you share it from the Share control in the page header. Ask in plain language, for example "Make an artifact that walks through this PR with the diff annotated inline", then ask for changes and Claude republishes to the same URL.

A page is one self-contained file with no backend, so it cannot serve several routes. It needs a session signed in with `/login`, the Anthropic API as the model provider, and, if you use the desktop app, version 1.13576.0 or later. `/artifacts` lists the artifacts you own. For a deck or a design, `/slides` and `/design` start the beta templates. Both need Claude Code v2.1.265 or later. Claude Docs reaches Claude Code as a connector and is also beta.

> **Pro tip**
> Publishing sends the page to claude.ai. If you only need a page on your own computer, ask Claude for a local HTML file and tell it not to publish.

## Worked Example

Assume your Trail Notes copy is on GitHub and you have a Pro or Max plan with Projects available.

1. Create a project named Trail Notes with the goal "Keep the notes app small and checked", and add the repository.
2. Write project instructions that name the checks: run `node checks/run.mjs` before opening a pull request.
3. Send two tasks in the conversation: fix the case-insensitive search, and let `addNote` accept tags. Claude starts a thread for each. Watch them in Overview until both reach Ready for review.
4. In a session, ask for an artifact:

   ```prompt
   Make an artifact that shows both pull requests side by side, with the changed lines of notes.js annotated.
   ```

5. Open the link, check it, and share it only if you want others to see it.

Dispatch works from your phone. A message such as "open a Claude Code session and run the Trail Notes checks" starts a session you can find in the sidebar afterward. A recurring chore is a better fit for [Scheduled Tasks and Loops](../workflow/scheduled-tasks-and-loops.md), and [Remote Control and Cloud Sessions](remote-control-and-cloud-sessions.md) covers the single-session case.

## Pitfalls

- A beta feature can change or be missing. Projects may not appear in your sidebar yet.
- Cloud threads in a project do not pick up your machine's setup. Skills from your personal folder, a repository's skills, `.claude/settings.json` and `.mcp.json` are not loaded. Connectors on your claude.ai account are. See [Customize: Skills, Plugins and Connectors](customize-skills-plugins-and-connectors.md).
- A thread's sandbox pauses between turns. Uncommitted changes can be lost if it cannot resume, so ask Claude to commit and push work in progress.
- Computer use approvals in Dispatch-spawned sessions expire after 30 minutes and ask again.
- A public artifact opens for anyone with the link. A viewer outside your organization sees the label "Content is user-generated and unverified." On Team and Enterprise, public sharing stays off until an Owner enables it.

## Checkpoint

Which of these three features are limited to Pro or Max plans, and which one has beta templates?

<details><summary>Show the answer</summary>
Projects (public beta, rolling out gradually) and Dispatch are limited to Pro or Max. Projects are not offered on Team or Enterprise yet, and Dispatch is not available there. Artifacts work on Pro, Max, Team and Enterprise, and their Slides, Design and Docs templates are beta.
</details>
