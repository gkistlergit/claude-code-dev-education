---
title: Level 1: Beginner
kind: learn
level: 1
order: 2
time: 223
verified: 2026-10-23
sources:
  - https://code.claude.com/docs/en/desktop
  - https://code.claude.com/docs/en/permission-modes
  - https://code.claude.com/docs/en/checkpointing
  - https://code.claude.com/docs/en/context-window
  - https://code.claude.com/docs/en/commands
  - https://code.claude.com/docs/en/memory
  - https://code.claude.com/docs/en/best-practices
---

Level 1 teaches you to ask for what you want, control what Claude may do, read what it changed, undo it, and keep a session healthy. It has three modules and ends with [Capstone 1: Fix and Review](../capstones/capstone-1-fix-and-review.md). Work in your `trail-notes` folder from Level 0 and leave the seeded search bug in place, because the capstone fixes it.

## Module M1.1: Prompts and Permissions

### Objectives

By the end of this module you can:

- Write a prompt that states the goal, the constraints and how you will know it worked.
- Name the five permission modes in the desktop app and say what each allows without asking.
- Pick a mode for a task by its risk and by how much you trust the checks around it.
- Use Plan mode to get an approach before any edit, and say when you would skip it.

### Time

Articles: 32 min. Exercise: 25 min. Total: 57 min. The exercise time is a planning budget.

### Read

1. [Prompting for Results](../kb/development/prompting-for-results.md) (8 min)
2. [Permission Modes Explained](../kb/app/permission-modes-explained.md) (8 min)
3. [Which Permission Mode](../kb/decision-guides/which-permission-mode.md) (5 min)
4. [Plan Mode: Think Before You Edit](../kb/development/plan-mode-think-before-you-edit.md) (6 min)
5. [Plan Mode or Not](../kb/decision-guides/plan-mode-or-not.md) (5 min)

### Exercise

You will give Claude the same kind of request under three modes and watch how its behavior changes. All three requests are safe to run on Trail Notes.

1. **Start** a new session on `trail-notes` and set the permission mode to Manual with the mode selector under the prompt box. Pressing Cmd+Shift+M opens the permission mode menu.
2. **Prompt** Claude with a request that states the goal, the constraint and the check:

   ```prompt
   Add a one-line comment at the top of each file in checks/ that says what the file checks. Change nothing else. Run node checks/run.mjs before you start and again when you finish, and tell me whether the result is the same.
   ```

   In Manual mode Claude shows a diff and buttons to approve or decline each change. Approve them one at a time and read each diff before you do.
3. **Switch** to Plan. Send this prompt and read the answer. Claude reads files and runs commands to explore, then proposes a plan without editing your source:

   ```prompt
   Plan how you would make searchNotes in notes.js match both title and body without regard to letter case. Do not edit anything. List the files you would touch, the steps in order, and the check that would prove it works.
   ```

   Do not carry out the plan. Leave the bug for Capstone 1.
4. **Switch** to Accept edits and send this prompt. Claude auto-accepts file edits in this mode, so the file appears without an approval step:

   ```prompt
   Create OVERVIEW.md with five short lines: what Trail Notes is, and what each of the four main files does. Do not touch any other file.
   ```

5. **Decide** which mode you would choose for each of these four tasks, and write one sentence for each: renaming a variable in one file; a change that touches many files; a first look at a repository you did not write; a long task with strong checks. Compare your answers with the Which Permission Mode table afterward.

### Success Check

- In Manual mode, every edit in step 2 appeared with approve and decline buttons before it was applied, and Claude ran the checks before and after the edit and reported the same result both times (`2 failed`, both from the search check).
- The Changes pane for step 2 shows only added comment lines in files under `checks/`.
- After step 3, the Changes pane shows nothing new, so the plan edited no file.
- After step 4, `OVERVIEW.md` exists and an indicator such as `+5` appears in the Changes card without an approval prompt.
- You wrote four sentences in step 5 and can defend each one.

### Checkpoint

1. What three things should a good prompt state?

   <details><summary>Show the answer</summary>

   The goal, the constraints, and how you will know it worked. Adding the check to run, as in step 2, lets Claude verify its own work.

   </details>

2. What does Plan mode do in the desktop app?

   <details><summary>Show the answer</summary>

   Claude reads files and runs commands to explore, then proposes a plan without editing your source code. It suits complex tasks where you want to review the approach first.

   </details>

3. What does Accept edits still ask about?

   <details><summary>Show the answer</summary>

   Other terminal commands. It auto-accepts file edits and common filesystem commands such as `mkdir`, `touch` and `mv`, but still asks before running other commands.

   </details>

### Go Further

- Read the official [permission modes page](https://code.claude.com/docs/en/permission-modes) to see what each mode allows and which actions no mode approves automatically.
- Reuse the [Plan a Change](../prompts/plan-a-change.md) prompt on a change of your own.
- Notice that `dontAsk` is a command-line mode only. The Permission Modes Explained article says why.
- Repeat step 2 in a fresh session with a vague prompt ("tidy the checks") and compare the diffs.

## Module M1.2: Review and Recover

### Objectives

By the end of this module you can:

- Name the panes in the Code tab and open the Changes pane.
- Review an AI-written diff in a sensible order and leave a comment on a line.
- Undo Claude's work with `/rewind` and with git, and say when each fits.
- Run the few git commands that matter and explain what each does.
- Use `claude -c`, `claude -r` and the core flags from a terminal.

### Time

Articles: 43 min. Exercise: 35 min. Total: 78 min. The exercise time is a planning budget.

### Read

1. [The Panes: Changes, Files, Terminal, Browser, Tasks](../kb/app/the-panes.md) (8 min)
2. [Reading and Reviewing Diffs](../kb/development/reading-and-reviewing-diffs.md) (6 min)
3. [Undo and Recover](../kb/development/undo-and-recover.md) (7 min)
4. [git and gh Essentials](../kb/terminal/git-and-gh-essentials.md) (9 min)
5. [Core Flags and Modes](../kb/terminal/core-flags-and-modes.md) (7 min)
6. [Resume and Continue](../kb/terminal/resume-and-continue.md) (6 min)

### Exercise

You will put Trail Notes under git, make a change you can review, and undo it two ways.

> **Terminal tip**
> These commands create a git repository in your folder and record a first snapshot. `cd ~/trail-notes` moves into the folder. `git init` creates the repository. `git add .` stages every file in the folder. `git commit -m "Starter copy"` saves the staged files as a commit with that message. If git says it needs your name and email, follow the instructions it prints, then run the commit again.
>
> ```terminal
> cd ~/trail-notes
> git init
> git add .
> git commit -m "Starter copy"
> ```

1. **Run** the commands in the tip above, in Terminal or in the Terminal pane of the Code tab (press Ctrl+`, which opens in the session's working directory). Your Module M1.1 edits come along in this first commit.
2. **Start** a new session on `trail-notes` in Manual mode and send:

   ```prompt
   Add a short comment above each exported function in notes.js that says what it takes and what it returns. Change nothing else.
   ```

3. **Open** the Changes pane by clicking the line counts in the Changes card or by pressing Cmd+Shift+D. Read the diff in this order: tests first, then the smallest files, then the logic. Look for changes you did not ask for.
4. **Click** a line in the diff to open a comment box, type the comment below and press Enter. Press Cmd+Enter to submit your comments. Claude reads them and produces a new diff. Review that one too.

   ```prompt
   Keep each comment to one line.
   ```

5. **Type** `/rewind` in the prompt box, choose the prompt from step 2 and choose Restore code. Then run `git status` in the terminal. It should report a clean working tree.
6. **Send** the prompt from step 2 again and approve the result. This time undo with git. `git diff` shows what changed, and `git restore notes.js` discards the change to that file. Run `git status` once more.
7. **Try** the command line if you installed it. `claude` starts a session in the folder you are in. `-n` names the session, `-c` continues the most recent conversation in the folder, and `-r` lets you pick an earlier one. `--permission-mode plan` starts in Plan mode.

   ```terminal
   cd ~/trail-notes
   claude -n trail-notes-practice
   ```

   Send the prompt below, type `/exit`, then run the second command:

   ```prompt
   What does notes.js export?
   ```

   ```terminal
   claude -c
   ```

   Then send:

   ```prompt
   What was my last question?
   ```

### Success Check

- The Changes pane showed your line comment, and Claude answered it with a revised diff.
- After step 5, `git status` reports a clean working tree, which shows Restore code removed the edit.
- After step 6, `git status` reports a clean working tree again, which shows `git restore` removed it.
- `git log --oneline` lists one commit, the starter copy.
- If you used the command line, `claude -c` reopened the earlier conversation and Claude could repeat your question.

### Checkpoint

1. In what order should you read an AI-written diff, and what are you looking for?

   <details><summary>Show the answer</summary>

   Tests first, then the smallest files, then the logic. Look for unrequested changes, deleted tests and new dependencies.

   </details>

2. What is the difference between Restore code and Restore conversation in the rewind menu?

   <details><summary>Show the answer</summary>

   Restore code reverts file changes and keeps the conversation. Restore conversation rewinds to that message and keeps your current code. Restore code and conversation reverts both.

   </details>

3. Why is `/rewind` not a replacement for git?

   <details><summary>Show the answer</summary>

   Checkpoints are for quick recovery inside a session. They do not track files that only Bash commands changed, and they do not give you permanent history. Use git for commits, branches and long-term history.

   </details>

### Go Further

- Read the official [checkpointing page](https://code.claude.com/docs/en/checkpointing) for what rewind does and does not track.
- Try Summarize from here in the rewind menu on a long session and watch the Context card.
- Use the [Review a Diff](../prompts/review-a-diff.md) prompt on your next change.
- Keep the [terminal tips cheatsheet](../cheatsheets/terminal-tips.md) open while you practice `git status`, `git diff` and `git log`.
- Run `gh auth status` and read what it says. Level 2 needs the GitHub CLI signed in.

## Module M1.3: Context and Scoping

### Objectives

By the end of this module you can:

- Say what fills the context window and read it with `/context`.
- Choose between continuing, `/clear`, a handoff note and a new session.
- Recognize a bloated session and apply the fixes in order.
- Turn an idea into a one-page brief with non-goals.
- Describe the idea-to-deploy flow and start a project to a first commit.

### Time

Articles: 48 min. Exercise: 40 min. Total: 88 min. The exercise time is a planning budget.

### Read

1. [How Context Works](../kb/optimization/how-context-works.md) (7 min)
2. [Clear, Compact and Hand Off](../kb/optimization/clear-compact-and-hand-off.md) (7 min)
3. [Long Sessions and Context Rot](../kb/troubleshooting/long-sessions-and-context-rot.md) (6 min)
4. [New Session or Continue](../kb/decision-guides/new-session-or-continue.md) (5 min)
5. [Scoping an App Before You Build](../kb/app-development/scoping-an-app-before-you-build.md) (8 min)
6. [The Idea-to-Deploy Flow](../kb/process/the-idea-to-deploy-flow.md) (7 min)
7. [Start a New Project](../kb/recipes/start-a-new-project.md) (8 min)

### Exercise

You will measure a session's context, give the project a short CLAUDE.md, scope it with an interview, and carry the work into a fresh session with a handoff note. The git part of Start a New Project is already done from Module M1.2.

1. **Start** a new session on `trail-notes` and send the prompt below:

   ```prompt
   What does app.js do? Answer in two sentences.
   ```

   Then type `/context` and read the per-category breakdown. In the session details panel, note the percentage in the header of the Context card.
2. **Prompt** Claude to create the project instructions:

   ```prompt
   Create a CLAUDE.md for this project. Keep it under 20 lines. Cover how to run the checks, what each file is for, and the rule that notes.js holds pure functions with no DOM code.
   ```

3. **Press** Cmd+N to start another session on the same folder and type `/context`. Find CLAUDE.md in the list under Memory files. CLAUDE.md loads when a session starts, so only a new session shows it.
4. **Prompt** Claude to interview you:

   ```prompt
   I want to scope Trail Notes in one page. Interview me one question at a time about who it is for, the one job it does, the smallest slice that proves it, and what it will not do. Ask, do not guess. When we have covered everything, write the brief to BRIEF.md in under one page.
   ```

   Answer in your own words. Short, specific answers produce a better brief.
5. **Click** the path of `BRIEF.md` in the chat to open it in the file pane. At the end, add a section titled `How a Change Ships` that lists the steps of the idea-to-deploy flow in your own words. Mark the steps you have already done in this folder.
6. **Prompt** Claude to write a handoff note, then clear the context and test the note:

   ```prompt
   Write HANDOFF.md for a fresh session. Cover what we are doing and why, the current state of this folder, the decisions we made, and the next steps in order. Keep it to one page.
   ```

   Type `/clear`, then send:

   ```prompt
   Read HANDOFF.md and tell me the first next step. Do not start it.
   ```

7. **Commit** your work with the commands in the tip below.

> **Terminal tip**
> `git add .` stages every new and changed file. `git commit -m "..."` saves them as a commit with a message. `git log --oneline` prints one line per commit so you can confirm the result.
>
> ```terminal
> cd ~/trail-notes
> git add .
> git commit -m "Add CLAUDE.md, brief and handoff note"
> git log --oneline
> ```

### Success Check

- `/context` in the second session lists your CLAUDE.md under Memory files.
- `BRIEF.md` fits on about one page and has a section that says what Trail Notes will not do.
- After `/clear`, Claude's answer names the same first next step that `HANDOFF.md` lists, and the Context card should show less of the window in use than before the clear.
- `git log --oneline` lists two commits.

### Checkpoint

1. Name two things that fill the context window as you work.

   <details><summary>Show the answer</summary>

   Your prompts, the files Claude reads, tool output and subagent results. CLAUDE.md, auto memory, tool names and skill descriptions also load before you type anything.

   </details>

2. When should you start a new session instead of continuing?

   <details><summary>Show the answer</summary>

   When the next task is unrelated to the current one, or when the context is filling up. The decision guide weighs both. Carry what matters in a handoff note you wrote.

   </details>

3. How do `/clear` and `/compact` differ?

   <details><summary>Show the answer</summary>

   `/clear` starts a new conversation with empty context. `/compact` summarizes the conversation so far to free space, and you can pass instructions about what the summary should keep.

   </details>

### Go Further

- Compare your `HANDOFF.md` with the [handoff template](../templates/handoff.md) and the [Handoff Note](../prompts/handoff-note.md) prompt.
- Compare your CLAUDE.md with the [CLAUDE.md template](../templates/claude-md.md).
- Read the official [context window page](https://code.claude.com/docs/en/context-window) to see what survives compaction.
- Try `/compact` with a focus instruction in a long session, then run `/context` to see the difference.
- Do [Capstone 1: Fix and Review](../capstones/capstone-1-fix-and-review.md), then continue to [Level 2: Intermediate](level-2-intermediate.md).
