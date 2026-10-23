---
title: Choosing a Project Folder
id: A04
area: app
level: 0
time: 6
tags: [project-folder, environment]
verified: 2026-10-22
status: partial
sources:
  - https://code.claude.com/docs/en/desktop#start-a-session
  - https://code.claude.com/docs/en/desktop#environment-configuration
  - https://code.claude.com/docs/en/desktop#add-folders-to-a-session
  - https://code.claude.com/docs/en/desktop-quickstart
  - https://code.claude.com/docs/en/permissions
related: [A02, A03, A11]
---

The project folder is the folder Claude works in. You choose it, along with the environment, in the row under the prompt box before the first message. Pick the folder that holds one project, because many other settings follow from it.

## When to Use It

Use this page before you start any session that will touch real files, and when a session behaves as if it cannot find something. Scratch workspaces are covered in a callout below because the docs say nothing about them.

## How It Works

The row under the prompt box starts with two controls.

The environment selector is the first control. It picks where Claude runs:

- Local runs on your machine with direct access to your files.
- Cloud runs on Anthropic-managed infrastructure by default, and the session continues if you close the app.
- SSH runs on a remote machine you connect to, such as a server or dev container.
- WSL, on Windows, runs inside a WSL 2 distribution.

The project folder control sits next to it. Click it to choose the folder Claude works in. Two cases change this:

- For a cloud session, you select repositories instead of a folder. They appear in the row once you select a cloud environment.
- For a saved local or SSH environment, the environment already holds its folders, so the row shows no project folder control. To change the folders, edit the environment.

A saved environment is an entry in the selector that records where Claude runs, so later sessions start there. To make one, open the selector, select New environment at the bottom of its menu, pick the Local, SSH or Cloud tab, and select Create environment. The first time you open the Code tab in the current layout, Desktop may create up to eight environments for you from the folders you used most in the last month. Hover over an entry and click the gear icon to edit or delete one.

### What the Folder Controls

The folder is the session's working directory, and the permission rules refer to it:

- Claude has access to files in the directory it starts in. In Accept edits mode, automatic approval of edits applies only to paths inside the working directory and any folders you added.
- Preview servers read their setup from `.claude/launch.json` at the root of the folder you selected. If you select a parent folder, subfolders with their own dev servers are not detected automatically.
- A worktree, if you turn it on, is created under the project root's `.claude/worktrees/` directory by default. See [Worktrees and Branches in the App](worktrees-and-branches-in-the-app.md).
- The project's `CLAUDE.md` is read from there.

To add a folder while a local or SSH session runs, click + next to the prompt box and select Add folder. Claude works in that folder itself, with no worktree.

> **Observed in the app**
> The app can start a session in a scratch or temporary workspace instead of a folder you picked. The docs do not mention this, so this page cannot say how it is created, where it lives, or how long it lasts, and the behavior may change. Treat anything made there as disposable until you have checked, and choose a real folder for real work.

## Worked Example

Use your copy of Trail Notes.

1. Open the project folder control and choose the Trail Notes folder itself, not the Documents folder that contains it.
2. Send this prompt:

   ```prompt
   List the files in the project folder you are working in, and name any folder you can see that is not part of this project.
   ```

3. Claude should list `index.html`, `style.css`, `app.js`, `notes.js`, `manifest.webmanifest`, `package.json` and `checks/`, and find nothing unrelated.
4. Start a second session and pick the parent folder instead. Send the same prompt. Claude now sees every project in that folder, and a careless prompt could edit any of them.

## Pitfalls

- A folder that no longer exists, a Git repository that needs Git LFS, or file permissions can produce "Failed to load session". Select a different folder or restart the app.
- If Claude cannot find `node`, `npm` or another tool you use, check that it runs in your regular Terminal and that your shell profile sets `PATH`. Then restart the app.
- On macOS, an app launched from the Dock or Finder reads your shell profile for `PATH` and a fixed set of Claude Code variables, but not every variable you export there. To give local sessions a variable, add it to a saved local environment and start your sessions from it.
- A session started from a saved environment shows no project folder control. If the folder is wrong, edit the environment.
- Cloud sessions work from repositories on GitHub, so a folder that exists only on your computer is not available to one. See [Remote Control and Cloud Sessions](remote-control-and-cloud-sessions.md) for what fits where.
- Do not rely on a scratch workspace for work you want to keep.

## Checkpoint

Why should you pick the Trail Notes folder rather than the folder that contains it?

<details><summary>Show the answer</summary>
The folder is Claude's working directory. Edits that Accept edits mode approves automatically apply inside it, and preview servers and worktrees are set up from it. A parent folder widens all of that to every project inside it, and the preview setup will not find the subfolders' dev servers on its own.
</details>
