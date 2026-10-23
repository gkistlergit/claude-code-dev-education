---
title: Capstone 0: First Session
kind: capstone
level: 0
order: 1
time: 40
verified: 2026-10-23
sources:
  - https://code.claude.com/docs/en/desktop-quickstart
  - https://code.claude.com/docs/en/desktop
---

This capstone proves that your setup works and that you can read what Claude does on a project you did not write. Close the Level 0 page before you start and work from memory, using the knowledge base only when you are stuck.

## Goal

Run a first session on the Trail Notes starter, check what Claude tells you against the files themselves, steer it once, and manage a second session. Nothing in the project should change.

## Setup

- The Claude desktop app, signed in, with the Code tab available.
- Node.js and git, both reachable from Terminal.
- A `trail-notes` folder in your home folder, copied from [the starter](../exercises/trail-notes-starter/README.md). [Start Here](../learn/start-here.md) has the copy command.

## Tasks

1. Open Terminal and run `node --version` and `git --version`. Each should print a version number.
2. Open the Code tab and start a new session. Choose the top entry in the Local group of the environment selector, choose `trail-notes` as the project folder and set the permission mode to Manual.
3. Ask Claude for a one-paragraph summary of the app and a list of what each file does. Tell it not to change anything.
4. Click the path of two files Claude mentioned to open them. For each, decide whether Claude's description was accurate and write down what you found.
5. Ask Claude to run the project's checks and explain the failure in plain words. Then run `node checks/run.mjs` yourself in the Terminal pane (press Ctrl+`) and compare the output with what Claude reported.
6. Send a prompt that asks Claude to describe every file in detail. A few seconds into its work, press Esc to stop it. Then type a shorter request and send it.
7. Press Cmd+N to start a second session, rename it by clicking its title, then archive it from its menu in the sidebar. Find it again under "View all" on the Archived tab.
8. Decline any edit Claude proposes during this capstone. When you finish, open the Changes pane and confirm it shows no line counts.

## Success Criteria

- [ ] `node --version` and `git --version` each print a version number.
- [ ] A session ran on your `trail-notes` folder using the Local environment, in Manual mode.
- [ ] Claude's summary named the main files, and you opened at least two of them to check it.
- [ ] You ran the checks in Terminal and saw the same failing check that Claude reported.
- [ ] You stopped Claude with Esc at least once and sent a corrected request afterward.
- [ ] A renamed session is archived, and you found it again on the Archived tab.
- [ ] The Changes pane shows no line counts, so nothing in the folder changed.

## Time

40 minutes. The course sets this figure as a planning budget and has not measured it.

## Self-Review

- Which of Claude's claims about the files did you find to be wrong or incomplete? If none, how did you check?
- At which approval prompt did you most want to click through without reading? What did the prompt show?
- Could you explain to someone else what a session is and what the project folder controls?

Capstone 0 gives no rubric score. It confirms that your tools work, so that the evidence you collect in [Capstone 1](capstone-1-fix-and-review.md) counts. The [rubric](../assessment/rubric.md) explains how scores work. Continue with [Level 1](../learn/level-1-beginner.md).
