---
title: Start a New Project
id: RC01
area: recipes
level: 1
time: 8
tags: [recipe, new-project]
verified: 2026-10-22
status: verified
sources:
  - https://code.claude.com/docs/en/desktop#start-a-session
  - https://code.claude.com/docs/en/desktop#run-commands-in-the-terminal
  - https://code.claude.com/docs/en/memory
  - https://code.claude.com/docs/en/commands
  - https://code.claude.com/docs/en/worktrees
  - https://git-scm.com/docs/git-init
  - https://git-scm.com/docs/git-commit
  - https://cli.github.com/manual/gh_repo_create
related: [P01, RC02, W01]
---

This recipe takes you from an empty folder to a first commit you can build on: a git repository, a short `CLAUDE.md`, a check runner that works, and a clean history. It uses the Trail Notes starter, so every later recipe begins from the same place.

## When to Use It

Use it at the start of any project, and run it once now to set up the Trail Notes folder that the other recipes and the capstones use. You need the Claude desktop app signed in to the Code tab, plus Git. Most Macs include Git, and `git --version` in Terminal prints a version number if it is installed.

## Steps

1. **Make** an empty folder named `trail-notes`, then copy the contents of [`exercises/trail-notes-starter/`](../../exercises/trail-notes-starter/README.md) into it. In Finder you can do this by hand. The Terminal route is shorter.

    > **Terminal tip**
    > `mkdir` makes the folder. `cp -R source/. destination/` copies everything inside `source`, including hidden files, into `destination`. Replace `path/to` with where the course's exercises folder is on your Mac.
    >
    > ```terminal
    > mkdir trail-notes
    > cp -R path/to/exercises/trail-notes-starter/. trail-notes/
    > ```

2. **Open** the folder in the Code tab. Click **+ New** in the sidebar, then click the project folder control in the row under the prompt box and choose `trail-notes`.
3. **Prompt** Claude to read the project without changing it. Sending the first message starts the session.

    ```prompt
    Read this project and tell me, as a short list: what each file does, how to run the checks, and what the checks cover. Don't change anything.
    ```

    Compare the answer with the files in your folder, and correct anything that does not match before you move on.

4. **Initialize** git. Click **Terminal** in the session's title bar to open a shell in the project folder, then run the commands.

    > **Terminal tip**
    > `git init -b main` turns the current folder into a git repository and names its first branch `main`. Run `pwd` first to confirm that you are in `trail-notes`, because running `git init` in the wrong folder is easy to do and annoying to undo.
    >
    > ```terminal
    > pwd
    > git init -b main
    > ```

5. **Prompt** `/init` in the prompt box. Claude Code reads the project and writes a starter `CLAUDE.md` with build commands, test instructions and conventions it finds. Then cut the file down to what Claude cannot guess from the code. The memory docs suggest keeping each file under 200 lines, and shorter is better. See [A CLAUDE.md That Earns Its Keep](../workflow/a-claude-md-that-earns-its-keep.md). A trimmed result for Trail Notes might look like this.

    ```md
    # Trail Notes

    A small notes app with no framework and no build step.

    - Run the checks with `node checks/run.mjs` before you say anything is done.
    - Note logic lives in `notes.js` as pure functions. `app.js` only wires the page and localStorage.
    - No dependencies. Checks use only the Node standard library.
    ```

6. **Run** the checks with `node checks/run.mjs` in the **Terminal** pane, or ask Claude to run them. Two checks in `search.check.mjs` fail, and the last line reads `10 passed, 2 failed`. The starter has a seeded bug: `searchNotes` matches case-sensitively. Leave it. [Fix a Bug from a Report](fix-a-bug-from-a-report.md) fixes it.
7. **Ignore** the worktree folder and generated files. The worktrees docs suggest ignoring `.claude/worktrees/` so worktree contents do not appear as untracked files.

    > **Terminal tip**
    > `printf` writes the two lines to a new `.gitignore` file. The second line keeps a macOS folder-metadata file out of the repository.
    >
    > ```terminal
    > printf '.claude/worktrees/\n.DS_Store\n' > .gitignore
    > ```

8. **Commit** the baseline.

    > **Terminal tip**
    > `git add .` stages every file in the folder. `git status` shows what is staged so you can look before you commit. `git commit -m` records the snapshot with a message. A worktree is created from an existing commit, so this first commit is what lets you use worktrees in the next recipe.
    >
    > ```terminal
    > git add .
    > git status
    > git commit -m "Add Trail Notes starter and CLAUDE.md"
    > ```

9. **Publish** the repository if you want pull requests, which [Ship a Feature End to End](ship-a-feature-end-to-end.md) needs. This creates a private repository on your GitHub account from the current folder and pushes your commit.

    > **Terminal tip**
    > `gh auth status` confirms that the GitHub CLI is signed in, and `gh auth login` signs you in if it is not. `gh repo create` with `--source=.` uses the current folder, `--remote=origin` names the remote, and `--push` pushes your commits.
    >
    > ```terminal
    > gh auth status
    > gh repo create trail-notes --private --source=. --remote=origin --push
    > ```

## Worked Example

When you finish, `git log --oneline` shows one commit, and `git status` reports a clean working tree:

```text
a1b2c3d Add Trail Notes starter and CLAUDE.md
```

The hash is a placeholder. Your Code tab shows a session whose project folder is `trail-notes`, your `CLAUDE.md` is short, and `node checks/run.mjs` ends with `10 passed, 2 failed`, both failures in `search.check.mjs`. Those failing checks are the starting point for the next recipes, and the first commit records them as the baseline.

## Pitfalls

- Running `git init` in your home folder or in the wrong project. Check with `pwd` first.
- Committing a long, generated `CLAUDE.md`. Claude Code loads it every session, and a file that grows too long gets its rules lost in the noise.
- Fixing the seeded bug before the first commit. You lose the baseline that the later recipes expect.
- Forgetting the `.gitignore` line for `.claude/worktrees/`, then committing a worktree's contents by accident.
- Creating the GitHub repository as public by habit. Choose `--private` or `--public` on purpose.

## Checkpoint

Why does this recipe end with a commit before you start the next one?

<details><summary>Show the answer</summary>

Worktrees are created from an existing commit, so a repository with no commits cannot give you one. The commit also records the baseline, including the known failing checks, so you can tell later what your own changes did.

</details>
