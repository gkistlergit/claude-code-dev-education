---
title: git and gh Essentials
id: T04
area: terminal
level: 1
time: 9
tags: [terminal, git, github]
verified: 2026-10-22
status: verified
sources:
  - https://code.claude.com/docs/en/common-workflows
  - https://code.claude.com/docs/en/checkpointing
  - https://code.claude.com/docs/en/desktop
  - https://git-scm.com/docs
  - https://cli.github.com/manual/
related: [D04, R03, RC01]
---

`git` records the history of your project, and `gh` is GitHub's command-line tool for pull requests. Claude Code can run both for you, and these seven steps cover the commands you need to read what it did, undo it and take over.

## When to Use It

Use these commands to check what Claude changed before you accept it, to save a version you can return to, and to open or review a pull request. Claude Code's checkpoints are not a substitute: the docs say they cover quick session-level recovery, and they do not track changes made only by shell commands. Use git for permanent history.

The desktop app's pull request monitoring needs `gh` installed and signed in. If `gh` is missing, the app prompts you to install it the first time you create a pull request. See [Pull Requests and Auto-fix](../app/pull-requests-and-auto-fix.md).

## Steps

Angle brackets such as `<file>` mark a value you replace with your own.

1. **Look** at what changed.

   ```terminal
   git status
   git diff
   git diff --staged
   ```

   `git status` lists files that are changed, staged for the next commit, or new and untracked. `git diff` shows the line-by-line edits not yet staged. `git diff --staged` shows the edits you have staged. If a long diff opens in a pager, press `q` to leave it.

2. **Branch** before you start a change, so `main` stays clean.

   ```terminal
   git switch -c <branch-name>
   git switch <branch-name>
   ```

   The first command creates a branch and moves you onto it. The second moves to an existing branch. If git refuses to switch because of uncommitted edits, commit them first.

3. **Save** a version.

   ```terminal
   git add <file>
   git commit -m "Say what changed and why"
   git log --oneline -10
   ```

   `git add` stages a file for the next commit. `git commit -m` records the staged files with your message. `git log --oneline -10` prints the last ten commits, one line each, newest first.

4. **Undo** an edit you do not want.

   ```terminal
   git restore --staged <file>
   git restore <file>
   ```

   The first command unstages a file and leaves your edits alone. The second throws away your uncommitted edits in that file and returns it to the last commit.

5. **Sign in** to GitHub.

   ```terminal
   gh auth login
   gh auth status
   gh auth switch --user <account-name>
   ```

   `gh auth login` walks you through signing in. `gh auth status` shows which accounts are signed in and which is active. With more than one account, `gh auth switch --user` makes the named one active. The author's setup keeps one rule that names the account to use, the account to avoid and the switch command, in a file Claude reads every session.

6. **Open** a pull request from the branch you committed on.

   ```terminal
   gh pr create --fill
   gh pr view
   gh pr view --web
   ```

   `gh pr create` asks for a title and body, and offers to push the branch if it is not on GitHub yet. `--fill` takes both from your commit messages. `gh pr view` shows the pull request for the current branch, and `--web` opens it in your browser. You can also just ask Claude: "create a pr for my changes".

7. **Watch** the checks, then merge.

   ```terminal
   gh pr checks --watch
   gh pr merge <number> --merge
   ```

   `gh pr checks` shows the status of the pull request's automated checks, and `--watch` keeps refreshing until they finish. `gh pr merge` merges the pull request. Choose one strategy: `--merge`, `--squash` or `--rebase`.

> **Warning**
> `git restore <file>` from step 4 cannot be undone. Run `git diff <file>` first to see what you would lose.

For every option, see the official [git documentation](https://git-scm.com/docs) and the [GitHub CLI manual](https://cli.github.com/manual/gh_pr_create).

> **Pro tip**
> The author's setup merges with `gh pr merge <number> --merge --match-head-commit <sha>`. The merge only goes through if the pull request's latest commit is the one you verified, so a push that landed after your review cannot slip in. This is the documented `--match-head-commit` flag in the GitHub CLI.

## Worked Example

You are in a Trail Notes folder that is a git repository connected to GitHub. [Start a New Project](../recipes/start-a-new-project.md) covers setting that up. Run the checks and create a branch:

```terminal
node checks/run.mjs
git switch -c fix-search-case
```

The runner should report two failing search checks and end with `10 passed, 2 failed`. Ask Claude to fix `searchNotes` in `notes.js`, then review and save the result:

```terminal
git diff
git add notes.js
git commit -m "Match search case-insensitively"
node checks/run.mjs
gh pr create --fill
```

`git diff` should show only `searchNotes` changing. Run the checks again before the pull request, and expect every check to pass.

## Pitfalls

- `git commit` without `-m` opens a text editor. Add `-m "message"`, or save and close the editor to finish.
- `git add .` stages everything in the folder, including files you did not mean to include. Name files instead and check `git status`.
- `gh` acts as whichever account is active. Run `gh auth status` before creating or merging a pull request when you have two accounts.
- A merge changes shared history. Merge only after the checks pass and you have read the diff.
- Claude Code's `/rewind` restores files it edited. It does not undo a file that only a shell command changed. Commit before risky work so git can.

## Checkpoint

1. Which command shows the edits you have staged but not yet committed?
2. You have two GitHub accounts and `gh pr create` fails on a repository you own with the other account. Which two commands do you run?

<details><summary>Show the answer</summary>

1. `git diff --staged`.
2. `gh auth status` to see which account is active, then `gh auth switch --user <account-name>` to activate the right one.

</details>
