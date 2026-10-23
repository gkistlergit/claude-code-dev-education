---
title: One Branch per Change
id: R03
area: process
level: 2
time: 7
tags: [branches, git]
verified: 2026-10-23
status: verified
sources:
  - https://code.claude.com/docs/en/worktrees
  - https://code.claude.com/docs/en/desktop#run-a-session-in-its-own-worktree
  - https://code.claude.com/docs/en/desktop#archive-a-session
  - https://git-scm.com/docs/git-worktree
  - https://git-scm.com/docs/git-branch
  - https://git-scm.com/docs/git-merge
related: [A07, R05, TS05, R01]
---

Give every change its own branch, and run each branch in its own worktree so two sessions never edit the same files. Keep branches small, bring in main while the branch is open, and remove the branch and the worktree the day its pull request merges.

## When to Use It

Use this for every change that will become a pull request, and most of all when more than one session is working at once. A git worktree is a separate working directory with its own files and branch that shares the repository's history and remote with your main checkout, so one session can build a feature while another fixes a bug.

## Steps

1. **Name** the change in one sentence, then derive a short branch name from it: lowercase words joined by hyphens, one topic, such as `tags-filter`. In the Code tab you can set a **Branch prefix** in **Settings > Claude Code**. Desktop prepends it to every worktree branch name, which keeps Claude-created branches together.
2. **Turn on** **Worktree** before you start the session. Click the project folder control in the row under the prompt box and switch on **Worktree**. It is off by default, and the project has to be a Git repository. The docs do not say how Desktop picks the name of the branch it creates, so read it from `git worktree list` (step 7) before you rely on a name. From the CLI, `claude --worktree tags-filter` creates `.claude/worktrees/tags-filter/` on a branch named `worktree-tags-filter`. See [Worktrees and Branches in the App](../app/worktrees-and-branches-in-the-app.md).
3. **Ignore** the worktree folder. Worktrees live in `.claude/worktrees/` under your project by default, and the docs suggest adding that folder to `.gitignore` so its contents do not show up as untracked files.
4. **Keep** the branch to one purpose. Check its size before you open the pull request, and split it if it carries two ideas.

    > **Terminal tip**
    > `git diff --stat` summarizes a diff as files changed and lines added or removed. The three-dot form compares your branch with the point where it left main, so you see only your own work.
    >
    > ```terminal
    > git diff --stat main...HEAD
    > ```

5. **Bring in main** while the branch is open, so conflicts show up early and in small pieces. Then run the checks again.

    > **Terminal tip**
    > `git fetch origin` downloads the latest commits without changing your files. `git merge origin/main` then merges them into your branch. If git reports conflicts, ask Claude to resolve them and run the checks before you commit.
    >
    > ```terminal
    > git fetch origin
    > git merge origin/main
    > ```

6. **Open** the pull request and merge it using [Pull Requests That Review Fast](pull-requests-that-review-fast.md) and [A Standing Go with a Stop List](a-standing-go-with-a-stop-list.md).
7. **Clean up** the same day. In the app, hover over the session in the sidebar, open its menu and choose **Archive**. To archive sessions automatically, turn on **Auto-archive after PR merge or close** in **Settings > Claude Code**. Commit anything you want to keep first, because uncommitted changes in a worktree can be lost when its session is archived.

    > **Terminal tip**
    > These commands remove the worktree, then the branch. `git worktree list` shows every worktree and its branch. `git worktree remove` deletes a clean worktree. `git branch -d` deletes a branch only if its commits are already merged. Remove the worktree first, because git refuses to delete a branch that a worktree has checked out.
    >
    > ```terminal
    > git worktree list
    > git worktree remove .claude/worktrees/tags-filter
    > git branch -d tags-filter
    > ```

The author's cost for this habit is stale worktrees: about 25 in one project and 16 in another. Cleanup is part of the process. If you already have a pile, see [Worktree Sprawl](../troubleshooting/worktree-sprawl.md).

## Worked Example

The tags feature for Trail Notes is merged. You are in the main checkout and want to leave nothing behind.

```terminal
git switch main
git pull
git worktree list
```

`git switch main` moves you to the main branch, and `git pull` brings the merged work into your local main. The list shows the main checkout and the worktree for the finished branch:

```text
/path/to/trail-notes                        a1b2c3d [main]
/path/to/trail-notes/.claude/worktrees/tags  e4f5a6b [tags]
```

The paths and short hashes above are placeholders, and your branch name carries your **Branch prefix** if you set one. Use the path and branch name that your own `git worktree list` prints:

```terminal
git worktree remove .claude/worktrees/tags
git branch -d tags
```

Run `git worktree list` once more. Only the main checkout should remain.

## Pitfalls

- Letting archived sessions pile up. The docs say Desktop removes a worktree that still holds changes about 30 days after its session is archived or last opened. Do not wait for that.
- Using `git worktree remove --force`. It discards uncommitted work in the worktree.
- Deleting a worktree folder in Finder. Git still lists it. Run `git worktree prune` to clean up the leftover records.
- Hitting "not fully merged" after a squash merge. A squash merge creates a new commit, so git does not see your branch's commits in main. Confirm the pull request shows as merged, then use `git branch -D` to delete the branch anyway.
- Letting a branch live for weeks. The longer it lives, the more it diverges from main, and the harder the final merge becomes.

## Checkpoint

You finished a pull request, merged it, and archived the session. What is the next check to make before you stop?

<details><summary>Show the answer</summary>

Run `git worktree list` and confirm that the worktree and branch are gone. Archiving a session does not always remove a worktree that still holds changes, so the list is the only way to see what is left.

</details>
