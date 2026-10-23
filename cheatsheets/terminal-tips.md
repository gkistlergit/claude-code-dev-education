---
title: Terminal Tips
kind: cheatsheet
order: 3
verified: 2026-10-23
sources:
  - https://code.claude.com/docs/en/setup
  - https://code.claude.com/docs/en/cli-reference
  - https://code.claude.com/docs/en/interactive-mode
  - https://code.claude.com/docs/en/sessions
  - https://code.claude.com/docs/en/headless
  - https://code.claude.com/docs/en/worktrees
  - https://code.claude.com/docs/en/agent-view
---

Every Terminal command and tip in this knowledge base, in one place. Each row says what the command does and links to the article on the topic. Angle brackets such as `<file>` mark a value you replace. The course is built around the desktop app, so these commands are optional: use them where the terminal is faster or the only option, such as scripting. The Claude Code flags listed are the ones printed by `claude --help` on the build checked for this course.

## Move Around

| Command | What it does | Read more |
| :- | :- | :- |
| `pwd` | Prints the full path of the folder you are in | [Install and Update](../kb/terminal/install-and-update.md) |
| `ls` | Lists the files and folders here | [Install and Update](../kb/terminal/install-and-update.md) |
| `ls -la` | Lists everything, including hidden files, with details | [Install and Update](../kb/terminal/install-and-update.md) |
| `cd <folder>` | Moves into a folder | [Install and Update](../kb/terminal/install-and-update.md) |
| `cd ..` | Moves up one level | [Install and Update](../kb/terminal/install-and-update.md) |
| `cd ~` or `cd` | Returns to your home folder | [Install and Update](../kb/terminal/install-and-update.md) |

## Install, Update and Sign In

| Command | What it does | Read more |
| :- | :- | :- |
| `curl -fsSL https://claude.ai/install.sh \| bash` | Downloads the native installer and runs it | [Install and Update](../kb/terminal/install-and-update.md) |
| `curl -fsSL https://claude.ai/install.sh -o install.sh` | Saves the installer to a file so you can read it with `less install.sh`, then run it with `bash install.sh` | [Install and Update](../kb/terminal/install-and-update.md) |
| `brew install --cask claude-code` | Installs through Homebrew on the stable channel. The `claude-code@latest` cask follows the latest channel. | [Install and Update](../kb/terminal/install-and-update.md) |
| `brew upgrade claude-code` | Updates a Homebrew install, which does not update itself | [Install and Update](../kb/terminal/install-and-update.md) |
| `claude --version` | Prints the installed version | [Install and Update](../kb/terminal/install-and-update.md) |
| `claude doctor` | Prints read-only diagnostics about the install and settings without starting a session | [Install and Update](../kb/terminal/install-and-update.md) |
| `claude update` | Installs an available update now | [Install and Update](../kb/terminal/install-and-update.md) |
| `which -a claude` | Lists every `claude` program on your PATH, which shows duplicate installs | [Install and Update](../kb/terminal/install-and-update.md) |
| `ls -la ~/.local/bin/claude` | Shows whether the native installer's copy exists | [Install and Update](../kb/terminal/install-and-update.md) |
| `echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc`, then `source ~/.zshrc` | Fixes `command not found: claude` in zsh by adding the install folder to your PATH | [Install and Update](../kb/terminal/install-and-update.md) |
| `claude` | Starts a session in the current folder. First launch opens a browser to sign in. | [Install and Update](../kb/terminal/install-and-update.md) |
| `claude auth status --text` | Shows whether you are signed in. It exits with code 0 when you are and 1 when you are not. | [Install and Update](../kb/terminal/install-and-update.md) |

Inside a session, `/login` signs you in again and `/logout` signs you out.

## Start a Session with Flags

| Command | What it does | Read more |
| :- | :- | :- |
| `claude "<prompt>"` | Starts a session with a first prompt | [Core Flags and Modes](../kb/terminal/core-flags-and-modes.md) |
| `claude --help` | Prints the options and commands your build lists | [Core Flags and Modes](../kb/terminal/core-flags-and-modes.md) |
| `claude --model <name>` | Sets the model for this session, by alias such as `sonnet` or by full name | [Core Flags and Modes](../kb/terminal/core-flags-and-modes.md) |
| `claude --effort <level>` | Sets effort: `low`, `medium`, `high`, `xhigh` or `max` | [Core Flags and Modes](../kb/terminal/core-flags-and-modes.md) |
| `claude --permission-mode plan` | Starts in plan mode. Other values: `manual`, `acceptEdits`, `auto`, `dontAsk`, `bypassPermissions`. | [Core Flags and Modes](../kb/terminal/core-flags-and-modes.md), [Plan Mode](../kb/development/plan-mode-think-before-you-edit.md) |
| `claude -n <name>` | Names the session | [Core Flags and Modes](../kb/terminal/core-flags-and-modes.md) |
| `claude --add-dir <folder>` | Gives Claude file access to an extra folder | [Core Flags and Modes](../kb/terminal/core-flags-and-modes.md) |
| `claude --safe-mode` | Starts with CLAUDE.md, skills, plugins, hooks and other customizations turned off, to test a broken setup | [Errors and Retries](../kb/troubleshooting/errors-and-retries.md) |
| `claude --debug` | Turns on debug logging for the session | [Errors and Retries](../kb/troubleshooting/errors-and-retries.md) |

## Resume and Branch

| Command | What it does | Read more |
| :- | :- | :- |
| `claude -c` | Continues the latest conversation in this folder | [Resume and Continue](../kb/terminal/resume-and-continue.md) |
| `claude -r` | Opens the session picker | [Resume and Continue](../kb/terminal/resume-and-continue.md) |
| `claude -r <name>` | Resumes a named session | [Resume and Continue](../kb/terminal/resume-and-continue.md) |
| `claude --from-pr <number>` | Opens the picker filtered to the sessions linked to a pull request | [Resume and Continue](../kb/terminal/resume-and-continue.md) |
| `claude --resume <name> --fork-session` | Resumes a copy under a new session ID | [Resume and Continue](../kb/terminal/resume-and-continue.md) |

## git

| Command | What it does | Read more |
| :- | :- | :- |
| `git status` | Lists changed, staged and untracked files | [git and gh Essentials](../kb/terminal/git-and-gh-essentials.md) |
| `git diff` | Shows edits that are not staged yet | [git and gh Essentials](../kb/terminal/git-and-gh-essentials.md) |
| `git diff --staged` | Shows edits that are staged | [git and gh Essentials](../kb/terminal/git-and-gh-essentials.md) |
| `git switch -c <branch>` | Creates a branch and moves onto it | [git and gh Essentials](../kb/terminal/git-and-gh-essentials.md), [One Branch per Change](../kb/process/one-branch-per-change.md) |
| `git add <file>` | Stages a file for the next commit | [git and gh Essentials](../kb/terminal/git-and-gh-essentials.md) |
| `git commit -m "<message>"` | Records the staged files | [git and gh Essentials](../kb/terminal/git-and-gh-essentials.md) |
| `git log --oneline -10` | Prints the last ten commits, one line each | [git and gh Essentials](../kb/terminal/git-and-gh-essentials.md) |
| `git restore --staged <file>` | Unstages a file and keeps your edits | [git and gh Essentials](../kb/terminal/git-and-gh-essentials.md), [Undo and Recover](../kb/development/undo-and-recover.md) |
| `git restore <file>` | Discards uncommitted edits in a file. This cannot be undone. | [git and gh Essentials](../kb/terminal/git-and-gh-essentials.md), [Undo and Recover](../kb/development/undo-and-recover.md) |

## gh

| Command | What it does | Read more |
| :- | :- | :- |
| `gh auth login` | Signs in to GitHub | [git and gh Essentials](../kb/terminal/git-and-gh-essentials.md) |
| `gh auth status` | Shows the signed-in accounts and the active one | [git and gh Essentials](../kb/terminal/git-and-gh-essentials.md) |
| `gh auth switch --user <account>` | Makes another signed-in account active | [git and gh Essentials](../kb/terminal/git-and-gh-essentials.md) |
| `gh pr create --fill` | Opens a pull request, taking the title and body from your commits | [git and gh Essentials](../kb/terminal/git-and-gh-essentials.md) |
| `gh pr view` | Shows the pull request for the current branch. `--web` opens it in a browser. | [git and gh Essentials](../kb/terminal/git-and-gh-essentials.md) |
| `gh pr checks --watch` | Shows the pull request's checks and refreshes until they finish | [git and gh Essentials](../kb/terminal/git-and-gh-essentials.md) |
| `gh pr merge <number> --merge` | Merges a pull request. Add `--match-head-commit <sha>` so it merges only that exact commit. | [git and gh Essentials](../kb/terminal/git-and-gh-essentials.md), [A Standing Go with a Stop List](../kb/process/a-standing-go-with-a-stop-list.md) |

## Non-Interactive Runs

| Command | What it does | Read more |
| :- | :- | :- |
| `claude -p "<prompt>"` | Answers once and exits | [Headless and Scripting](../kb/terminal/headless-and-scripting.md) |
| `cat <file> \| claude -p "<prompt>"` | Sends a file or command output to Claude as input | [Headless and Scripting](../kb/terminal/headless-and-scripting.md) |
| `claude -p "<prompt>" --output-format json` | Returns one JSON object with the answer in `result`. Other formats: `text`, `stream-json`. | [Headless and Scripting](../kb/terminal/headless-and-scripting.md) |
| `--json-schema '<schema>'` | With `--output-format json`, returns validated data in `structured_output` | [Headless and Scripting](../kb/terminal/headless-and-scripting.md) |
| `--allowedTools "Bash(git diff *)"` | Lets matching tool calls run without a prompt | [Headless and Scripting](../kb/terminal/headless-and-scripting.md) |
| `--max-budget-usd <amount>` | Stops the run once estimated spend reaches the amount | [Headless and Scripting](../kb/terminal/headless-and-scripting.md) |
| `claude -p "<prompt>" --continue` | Adds a follow-up to the latest conversation | [Headless and Scripting](../kb/terminal/headless-and-scripting.md) |

## Worktrees and Parallel Sessions

| Command | What it does | Read more |
| :- | :- | :- |
| `claude -w <name>` | Starts a session in a new git worktree under `.claude/worktrees/<name>`, on a branch named `worktree-<name>` | [Worktrees and Branches in the App](../kb/app/worktrees-and-branches-in-the-app.md), [Parallel Sessions Without Collisions](../kb/workflow/parallel-sessions-without-collisions.md) |
| `git worktree list` | Lists every worktree of the repository | [Worktree Sprawl](../kb/troubleshooting/worktree-sprawl.md) |
| `git worktree remove <path>` | Removes a worktree. Add `--force` when it has uncommitted or untracked files. | [Worktree Sprawl](../kb/troubleshooting/worktree-sprawl.md) |
| `git worktree unlock <path>` | Releases a lock when git refuses to remove a locked worktree | [Worktree Sprawl](../kb/troubleshooting/worktree-sprawl.md) |

## Background and Remote Sessions

Agent view is a research preview, and its interface and keys may change.

| Command | What it does | Read more |
| :- | :- | :- |
| `claude --bg "<prompt>"` | Starts a background session and returns at once, printing its ID | [Sessions and the Sidebar](../kb/app/sessions-and-the-sidebar.md) |
| `claude agents` | Opens agent view, one screen for your background sessions | [Sessions and the Sidebar](../kb/app/sessions-and-the-sidebar.md) |
| `claude attach <id>`, `claude logs <id>`, `claude stop <id>` | Opens, reads the recent output of, or stops a background session | [Sessions and the Sidebar](../kb/app/sessions-and-the-sidebar.md) |
| `claude --remote-control` | Starts a session you can also control from claude.ai or the Claude app | [Remote Control and Cloud Sessions](../kb/app/remote-control-and-cloud-sessions.md) |
| `claude --cloud "<task>"` | Creates a cloud session for the task | [Remote Control and Cloud Sessions](../kb/app/remote-control-and-cloud-sessions.md) |

## Keys Inside a Terminal Session

| Key | What it does |
| :- | :- |
| `Shift` `Tab` | Cycles permission modes. The desktop app does not use this key for that. |
| `Esc` | Interrupts Claude. It keeps the work done so far. |
| `Esc` `Esc` | With text in the prompt, clears it and saves the draft so `Up` brings it back. With an empty prompt, opens the rewind menu. |
| `Ctrl` `C` | Interrupts a running operation. With nothing running, the first press clears the prompt and a second press exits. |
| `Ctrl` `D` | Exits. The first press shows a confirmation hint. With text in the prompt, it deletes the character after the cursor instead. |
| `Ctrl` `R` | Searches your command history |
| `Ctrl` `O` | Toggles the transcript viewer |
| `Ctrl` `B` | Moves running shell commands and agents to the background |
| `Ctrl` `T` | Shows or hides Claude's task checklist |
| `Ctrl` `G` | Opens your prompt in your default text editor |
| `Ctrl` `L` | Redraws a garbled screen |
| `!` at the start | Shell mode: runs the command directly and adds its output to the session |
| `@` | Mentions a file path with autocomplete |
| `\` then `Enter` | Starts a new line in the prompt. It works in every terminal. `Ctrl` `J` does too. |
| `?` on an empty prompt | Shows the shortcut help panel |

Option and Alt shortcuts, such as `Alt` `B` and `Alt` `F` for moving by word, need Option configured as Meta in your terminal on macOS. The `/terminal-setup` command helps with newline keys in some terminals.

## Trail Notes Checks

| Command | What it does | Read more |
| :- | :- | :- |
| `node checks/run.mjs` | Runs every check in `checks/` and prints one line per check. It exits with code 1 if any check fails. | [Testing Without a Framework](../kb/app-development/testing-without-a-framework.md) |
| `npm run check` | Runs the same checks through the `check` script in `package.json` | [Testing Without a Framework](../kb/app-development/testing-without-a-framework.md) |
