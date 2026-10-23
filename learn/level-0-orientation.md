---
title: Level 0: Orientation
kind: learn
level: 0
order: 1
time: 65
verified: 2026-10-22
sources:
  - https://code.claude.com/docs/en/desktop-quickstart
  - https://code.claude.com/docs/en/desktop
  - https://code.claude.com/docs/en/setup
  - https://code.claude.com/docs/en/terminal-guide
---

Level 0 gets Claude Code installed and runs your first session on the Trail Notes starter. It has one module. When you finish it, do [Capstone 0: First Session](../capstones/capstone-0-first-session.md) to prove the setup works without help.

## Module M0.1: Get Set Up

### Objectives

By the end of this module you can:

- Open Terminal and move between folders with `pwd`, `ls` and `cd`.
- Install the desktop app, sign in and find the Code tab.
- Name the main areas of the Code tab.
- Start, rename and archive sessions.
- Choose a project folder and say what Claude can see from it.

### Time

Articles: 35 min. Exercise: 30 min. Total: 65 min. The exercise time is a planning budget.

### Read

1. [Install and Update](../kb/terminal/install-and-update.md) (8 min)
2. [Install, Sign In and Your First Session](../kb/app/install-sign-in-and-your-first-session.md) (8 min)
3. [Tour of the Code Tab](../kb/app/tour-of-the-code-tab.md) (6 min)
4. [Sessions and the Sidebar](../kb/app/sessions-and-the-sidebar.md) (7 min)
5. [Choosing a Project Folder](../kb/app/choosing-a-project-folder.md) (6 min)

### Exercise

You will run a first session on Trail Notes, ask Claude to explain it and run its checks, then manage a second session. Nothing in this exercise asks Claude to change a file.

1. **Copy** the Trail Notes starter to your home folder if you have not already. [Start Here](start-here.md) has the command. Use the folder named `trail-notes` for Levels 0 and 1.
2. **Open** Terminal (press Cmd+Space, type Terminal and press Enter) and look around the folder you just made. `pwd` prints the folder you are in. `ls` lists what is in it. `cd ~/trail-notes` moves you into the trail-notes folder in your home folder.

   ```terminal
   pwd
   ls
   cd ~/trail-notes
   ls
   ```

   The last `ls` should list `app.js`, `notes.js` and the `checks` folder among its names.
3. **Check** your tools. Run `node --version` and `git --version`. Each prints a version number. If you installed the command-line tool as the Install and Update article describes, `claude --version` prints one as well.
4. **Open** the Claude desktop app, sign in and click the Code tab. In the row under the prompt box, click the environment selector and choose the top entry in the Local group. Click the project folder control beside it, choose Open folder… and select your `trail-notes` folder.
5. **Choose** Manual in the permission mode selector in the same row, so that Claude asks before it edits or runs a command. Leave the model on its default.
6. **Prompt** Claude to explain the project:

   ```prompt
   Explain this project to me. List each file, say what it does, and tell me how to run its checks. Do not change anything.
   ```

7. **Prompt** Claude to run the checks and report:

   ```prompt
   Run the checks and tell me which one fails and why. Do not fix anything yet.
   ```

   Approve the command when Claude asks. Press Ctrl+O to cycle the transcript view and watch what changes: Verbose shows every tool call and file read.
8. **Press** Cmd+N to start a second session. Click its title in the title bar and rename it to `scratch`. Send the prompt below and, a few seconds into Claude's work, press Esc to stop it.

   ```prompt
   Describe every file in this folder in detail.
   ```

9. **Archive** the `scratch` session: hover over it in the sidebar, open its menu and select Archive. To find it again, hover over a heading in the session list, click the "Group and sort" icon, choose "View all" and open the Archived tab.

### Success Check

- `node --version` and `git --version` each print a version number.
- In Terminal, `cd ~/trail-notes` followed by `node checks/run.mjs` reports a failing check, and it is the search check. The last line ends in `2 failed`. The failure is the seeded bug, so it is the expected result. The [starter README](../exercises/trail-notes-starter/README.md) shows the full output.
- The first session's transcript shows Claude reading files and running the checks, and you approved the command yourself in Manual mode.
- The sidebar shows the first session. The `scratch` session appears under "View all", on the Archived tab.
- Nothing in `trail-notes` changed. Open the Changes pane and confirm it shows no line counts.

### Checkpoint

1. Where do you find Claude Code in the desktop app?

   <details><summary>Show the answer</summary>

   Click the Code tab at the top of the app's sidebar. If the tabs show only icons, hover over one to see its name.

   </details>

2. What is a session?

   <details><summary>Show the answer</summary>

   An independent conversation with its own chat history, project folder, context and changes. You can run several in parallel from the sidebar.

   </details>

3. What decides which files Claude can read and change in a local session?

   <details><summary>Show the answer</summary>

   The project folder you choose in the row under the prompt box. The permission mode then decides whether Claude asks before it edits files or runs commands.

   </details>

### Go Further

- Type `@notes.js` in the prompt box to pull one file into the conversation, then ask a question about it. The desktop quick start describes @mentions.
- Skim the [desktop quick start](https://code.claude.com/docs/en/desktop-quickstart) and the [desktop reference](https://code.claude.com/docs/en/desktop) to see what the later levels cover.
- Print the [desktop shortcuts cheatsheet](../cheatsheets/desktop-shortcuts.md) and keep it nearby.
- Look up unfamiliar words in the [glossary](../kb/glossary.md).
- Try the [Explore a Repo](../prompts/explore-a-repo.md) prompt on Trail Notes and compare its answer with your first one.
- Do [Capstone 0: First Session](../capstones/capstone-0-first-session.md), then continue to [Level 1: Beginner](level-1-beginner.md).
