---
title: Preview, Ship and Maintain
id: P07
area: app-development
level: 2
time: 8
tags: [preview, deploy]
verified: 2026-10-23
status: verified
sources:
  - https://code.claude.com/docs/en/desktop#preview-your-app
  - https://code.claude.com/docs/en/desktop#configure-preview-servers
  - https://code.claude.com/docs/en/desktop-ios-simulator
  - https://code.claude.com/docs/en/skills
  - https://code.claude.com/docs/en/desktop-scheduled-tasks
  - https://code.claude.com/docs/en/memory
  - https://git-scm.com/docs/git-archive
related: [A06, R06, P04]
---

Preview the app in the Browser pane while you work, ship the commit you verified rather than whatever is in your folder, read what the deploy reports, and keep a small maintenance rhythm afterwards. For native iOS projects the iOS Simulator pane plays the Browser pane's part.

## When to Use It

Use it each time you move from "it works here" to "it is live", and again on a schedule once the app has users. [A Static PWA on a Free Host](a-static-pwa-on-a-free-host.md) gets you the first deploy. This article covers the loop around it.

## Steps

1. **Ask** Claude to preview the app. The desktop docs say Claude can start a server and open it in the Browser pane to verify changes, and that you can ask for a preview at any time. If the pane stays closed, click **Open** on the server's card in the chat, press Cmd+Shift+B, or click **Browser** in the title bar.
2. **Check** `.claude/launch.json`. Claude writes it from your project, and Trail Notes has no dev script for it to detect. The starter README serves the folder with Python's built-in server, which this entry reproduces. Using `autoPort: false` tells the preview that port 8000 is fixed, because the port is written into the command.

   ```json
   {
     "version": "0.0.1",
     "configurations": [
       {
         "name": "trail-notes",
         "runtimeExecutable": "python3",
         "runtimeArgs": ["-m", "http.server", "8000"],
         "port": 8000,
         "autoPort": false
       }
     ]
   }
   ```

   The file is committed to your repository, so keep secrets out of its `env` field. To avoid Python, ask Claude for a short server script that uses only Node's standard library and point the `program` field at it.
3. **Watch** auto-verify. It is on by default, and after each edit Claude takes screenshots, checks for errors and confirms the change works before it finishes. Turn it off for a project with `"autoVerify": false` in `launch.json`, or with **Auto-verify changes** in the pane's **⋮** menu. You can still ask for verification yourself.
4. **Open** the **Dev servers** menu in the Browser pane's header when you want to start or stop a server, or stop them all.
5. **Run** your checks, then run `/verify`. The skills docs describe `/verify` as building and running the app to confirm a change does what it should, without falling back to tests or type checks. The best-practices guide suggests running it yourself after Claude's own checks pass.
6. **Ship** the commit you verified. If your host takes a folder, build that folder from the commit and not from your working directory.

   > **Terminal tip**
   > `git archive` writes the files of one commit, with none of your uncommitted edits, to standard output. The `|` hands that stream to `tar`, and `-xf - -C <folder>` unpacks it into the folder you name. Replace `HEAD` with the hash or tag you verified.
   >
   > ```terminal
   > mkdir ../trail-notes-deploy
   > git archive --format=tar HEAD | tar -xf - -C ../trail-notes-deploy
   > ```

7. **Read** the deploy output. Find the address that went live and the version or commit it names. If the host shows no commit, write down the hash you archived.
8. **Record** the deploy in a short ledger file: date, commit, what you checked, what you did not. [Handoff Ledgers and Retros](../process/handoff-ledgers-and-retros.md) shows the habit. [CI That Gates the Deploy](../process/ci-that-gates-the-deploy.md) covers making CI the gatekeeper.

### Native iOS Work

The iOS Simulator pane is in public beta. It runs on macOS in local sessions only and needs Xcode with the iOS platform installed. Claude opens the pane when it builds or runs your app in a simulator, and the first use of a device asks for your consent. Claude drives simulated devices only, not a physical iPhone.

> **Warning**
> The docs say Claude's screenshots of a simulator device are sent to Anthropic and kept under your normal conversation retention settings. Do not sign in to real accounts on a device Claude uses.

## Worked Example

You have changed Trail Notes and want to publish. You ask Claude to preview, and the Browser pane shows the running app. Claude auto-verifies after each edit. You run `node checks/run.mjs`, then `/verify`. You commit, extract that commit into a clean folder with the tip above, and deploy the folder. The output names the live address. You open it, add a note, reload, and write one line in the ledger: the commit hash, "checks and /verify passed, not tested on a phone".

A monthly pass keeps it healthy. Run the checks on a fresh copy of main. Open the live app in a private window and install it. Read the host's pricing and limits pages again, since free-tier terms change. Remove merged branches and old worktrees ([Worktree Sprawl](../troubleshooting/worktree-sprawl.md)). Run `/doctor prompt-audit`, which the memory docs describe as checking your instruction files for outdated or conflicting lines (it needs Claude Code v2.1.283 or later). A local scheduled task can run the first item for you, but the desktop docs say local tasks fire only while the app is open and the computer is awake. [Scheduled Tasks and Loops](../workflow/scheduled-tasks-and-loops.md) covers the choice.

## Pitfalls

- You deploy the working folder. Uncommitted edits ship, and the commit you verified did not. Archive the commit.
- You treat auto-verify as your test suite. It checks changes after an edit. Your checks run on every change in every environment.
- A dev server keeps running after you finish. Stop it from the **Dev servers** menu.
- You expect the simulator pane to cover a real phone. For a physical device, run the app from Xcode and describe what you see.
- You skip reading the deploy output, so a failed step looks like a success.
- The ledger grows without end. Rotate it before it becomes unreadable.

## Checkpoint

What does deploying a folder extracted with `git archive` give you that deploying your working folder does not?

<details><summary>Show the answer</summary>

It contains exactly the files of the commit you verified and none of your uncommitted edits, so what went live is what you checked. You can also name the commit in the ledger and roll back to it with confidence.

</details>
