---
title: Install, Sign In and Your First Session
id: A02
area: app
level: 0
time: 8
tags: [install, first-session]
verified: 2026-10-23
status: verified
sources:
  - https://code.claude.com/docs/en/desktop
  - https://code.claude.com/docs/en/desktop-quickstart
  - https://code.claude.com/docs/en/setup
related: [A01, A04, T01]
---

Install the Claude desktop app, sign in, open the Code tab, and run a first session on a copy of the Trail Notes starter. By the end you will have read Claude's explanation of a project, seen how tool calls appear, and stopped a response.

## When to Use It

Use this page on a Mac that does not have the app yet, or when you want a clean first run before the other articles. Claude Code needs a Pro, Max, Team or Enterprise subscription. The desktop app includes Claude Code, so you do not need to install Node.js or the command-line tool to use the Code tab.

## Steps

1. **Download** the macOS installer from the [download page](https://claude.com/download) and run it. The docs describe a universal build for Intel and Apple Silicon.
2. **Open** Claude from your Applications folder and sign in with your Anthropic account.
3. **Click** the Code tab at the top of the sidebar. If the tabs show only icons, hover over one to see its name. A prompt to upgrade means you need a paid plan. A prompt to sign in online means you should finish the sign-in and restart the app. An error 403 is covered in the [desktop troubleshooting section](https://code.claude.com/docs/en/desktop#403-or-authentication-errors-in-the-code-tab).
4. **Copy** the folder `exercises/trail-notes-starter/` from this course into a new folder of your own, for example inside your Documents folder. Details are in the [starter README](../../exercises/trail-notes-starter/README.md).
5. **Choose** where Claude runs. In the row under the prompt box, click the environment selector, which is the first control, and select the top entry in the Local group. Then click the project folder control beside it, select Open folder…, and pick your copy of Trail Notes.
6. **Check** the permission mode selector in the same row. For a first session, choose Manual so Claude asks before it edits files or runs commands. The model picker toward the right end of the row sets the model, and you can change it later.
7. **Prompt** Claude to explain the project. Type this in the prompt box and press Enter:

   ```prompt
   Explain this project. List each file, say what it does, and tell me how to run its checks. Do not change anything.
   ```

8. **Read** the tool calls as they appear. In Normal view, tool calls collapse into summaries. Press `Ctrl+O` to cycle the view mode. Verbose shows every tool call and file read.
9. **Stop** a response. Click the stop button, or press `Esc`. To redirect instead, type a correction and press Enter. Claude reads it after the current action finishes.

> **Terminal tip**
> You can also install the command-line tool, but this course does not need it. The desktop app and the CLI keep separate session lists and share configuration such as CLAUDE.md, hooks, skills and settings. The [Install and Update](../terminal/install-and-update.md) article covers the CLI install and explains each command.

## Worked Example

Send the prompt from step 7 against the starter. Claude should name `index.html`, `style.css`, `app.js`, `notes.js`, `manifest.webmanifest`, `package.json` and the `checks/` folder. It should describe `notes.js` as the place for the pure functions `addNote`, `removeNote`, `searchNotes` and `sortNotes`, and `app.js` as the DOM wiring and `localStorage`. It should tell you to run `node checks/run.mjs`.

In Manual mode, reading files needs no approval, so you may see no prompts at all. Now send a follow-up:

```prompt
Run the checks and tell me which ones fail and why.
```

Claude asks before running a command in Manual mode, so expect an approval prompt showing `node checks/run.mjs`. Read the command, then approve it. Two checks in `search.check.mjs` should fail, because the starter's `searchNotes` matches case-sensitively. You have found the seeded bug that [Capstone 1](../../capstones/capstone-1-fix-and-review.md) fixes. Do not fix it yet. The [first-session capstone](../../capstones/capstone-0-first-session.md) picks up from here.

The [explore-a-repo prompt](../../prompts/explore-a-repo.md) is a longer version of step 7 that you can reuse on any project.

## Pitfalls

- Opening the parent folder, such as Documents, gives Claude far more than the one project. Pick the Trail Notes folder itself. The [folder article](choosing-a-project-folder.md) explains why this matters.
- If Claude cannot find `node` or other tools, check that they work in your regular Terminal and that your shell profile sets `PATH`, then restart the app. The docs give this fix under "Session not finding installed tools".
- If the command-line tool works but the app still shows an authentication error after you sign out and in, quit the app completely with `Cmd+Q`, then reopen it and sign in again.
- Approving every prompt without reading it defeats Manual mode. Read the command or the diff first.
- No environment selector under the prompt box means the earlier layout. Select Claude > Check for Updates… in the menu bar.

## Checkpoint

You send a prompt in Manual mode and Claude wants to run `node checks/run.mjs`. What happens, and how do you see exactly what it ran afterward?

<details><summary>Show the answer</summary>
Claude stops and asks before running the command, and you approve or decline it. Afterward, press `Ctrl+O` to switch the conversation to Verbose view, which shows every tool call Claude made, including the command it ran.
</details>
