---
title: Pull Requests and Auto-fix
id: A08
area: app
level: 2
time: 8
tags: [pull-requests, ci, auto-fix]
verified: 2026-10-22
status: verified
sources:
  - https://code.claude.com/docs/en/desktop#monitor-pull-request-status
  - https://code.claude.com/docs/en/commands
  - https://code.claude.com/docs/en/claude-code-on-the-web
  - https://code.claude.com/docs/en/permission-modes
  - https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/automatically-merging-a-pull-request
  - https://cli.github.com/manual/gh_pr_merge
related: [R05, R06, R07]
---

After Claude opens a pull request from a desktop session, the Changes card shows the status of its CI checks. Two switches in that card, Auto-fix and Merge when ready, let Claude repair failing checks and let GitHub merge the pull request. Neither replaces your judgment about whether the change should land.

## When to Use It

Use these switches when a pull request has automated checks and you would otherwise sit watching them. They suit changes whose checks give a clear signal. They are a poor fit for a change whose failures need a design decision.

## Steps

1. **Install** the [GitHub CLI](https://cli.github.com/), `gh`, and sign in to it. Pull request monitoring needs `gh` installed and authenticated on your machine. If it is missing, Desktop prompts you to install it the first time you try to create a pull request.
2. **Ask** Claude to commit, push and open a pull request for the session's changes.
3. **Open** the Changes card in the session details panel. The new pull request appears there with the status of its CI checks.
4. **Click** the ⋮ menu beside the pull request's title and choose Auto-fix. In a local session, Claude then fixes failing checks and also addresses new review comments that someone other than you leaves. The author of the comment must be the repository's owner, an organization member, a collaborator or a GitHub App.
5. **Choose** Merge when ready, from the same menu, to turn on GitHub's auto-merge for the pull request. In a local session Desktop requests a squash merge unless the base branch uses a merge queue.
6. **Turn on** Auto-archive after PR merge or close in Settings > Claude Code if you want the session archived when the pull request merges or closes.

In the earlier layout, click CI on the session's status bar once it has a pull request.

If Merge when ready does not turn on, the repository may not allow auto-merge. Enable it in the repository's settings on GitHub first. In SSH and WSL sessions Merge when ready is disabled, so turn on auto-merge for the pull request on GitHub itself. In an SSH session, install and sign in to `gh` on the remote machine yourself, because Desktop does not prompt for it there.

> **Terminal tip**
> `gh auth status` prints whether `gh` is logged in. In the CLI, `/autofix-pr` is the counterpart to Auto-fix. It spawns a cloud session that watches the current branch's pull request and pushes fixes when CI fails or reviewers comment. Pass text after it, for example `/autofix-pr only fix lint and type errors`, to change its instructions. It needs `gh` and access to cloud sessions.

### How Cloud Auto-fix Responds

The cloud sessions page describes how Auto-fix behaves when it runs in a cloud session. It needs the Claude GitHub App installed on the repository. For each CI failure or review comment, Claude investigates and decides. A clear fix is pushed and explained in the session. An ambiguous comment, or one with architectural weight, makes Claude ask you before acting. Duplicate events are noted and skipped.

### What Auto-fix Will Not Decide for You

- Whether the pull request should merge. Auto-fix pushes fixes. Merge when ready is a separate switch that only hands the merge to GitHub, which merges after the required reviews and status checks pass.
- Conflicts with the base branch. GitHub sends no event when the base branch advances and creates a conflict, so cloud Auto-fix cannot react. Open the session and ask Claude to rebase.
- Comments from other people. Local Auto-fix answers only the authors listed in step 4.
- Judgment calls in review. The cloud docs say Claude asks you when a comment could be read several ways.
- Disabling CI. In Auto mode, the permission classifier blocks by default merging a pull request no human has approved, approving Claude's own pull request, and disabling CI checks.

> **Warning**
> In cloud Auto-fix, Claude can reply to review threads on GitHub, and the replies appear under your GitHub account, labeled as coming from Claude Code. If your repository runs automation on comments, a reply can start it. Review that automation before you turn Auto-fix on.

## Worked Example

In the author's setup, a small offline-first app caches its app shell with a service worker, and a gate in CI fails when the list of cached files changes without a bump to the cache version. Picture this sequence:

1. Claude opens a pull request that adds a new file to the cached list. CI fails on the gate.
2. With Auto-fix on, Claude reads the failing check, bumps the version, and pushes. CI passes.
3. A reviewer comments "should this be two pull requests?". That is a judgment call, so it is yours to answer. Claude should ask before acting on it.
4. You approve. The author's rule then covers the merge, not Auto-fix: Claude may merge when the work is complete, every check passed and none were skipped, the pull request is mergeable on current main, and nothing waits on a decision. The rule lists when to stop and ask, including a failed or skipped check, main moving to include unverified work, and any hard-to-undo step.

The merge command pins the verified commit:

```terminal
gh pr merge 42 --merge --match-head-commit <sha>
```

`gh pr merge 42` merges pull request number 42, `--merge` merges the commits into the base branch, and `--match-head-commit` makes the merge fail unless the pull request's head is the commit you checked. See the [GitHub CLI manual](https://cli.github.com/manual/gh_pr_merge). The same pattern is in [A Standing Go with a Stop List](../process/a-standing-go-with-a-stop-list.md).

## Pitfalls

- Auto-fix chasing a failing check can hide a real design problem. Read what it changed in the Changes pane.
- Merge when ready relies on GitHub's own rules. GitHub's documentation says auto-merge merges after all required reviews and status checks pass, so the repository's branch protection decides what "ready" means.
- Auto-archive does not apply to cloud sessions or sessions still running.
- In a worktree session, commit what you want to keep before the pull request merges and the session archives.
- See [Pull Requests That Review Fast](../process/pull-requests-that-review-fast.md) and [CI That Gates the Deploy](../process/ci-that-gates-the-deploy.md) for what the checks should cover.

## Checkpoint

What do Auto-fix and Merge when ready each do in a local desktop session, and what still decides when the pull request actually merges?

<details><summary>Show the answer</summary>
Auto-fix has Claude fix failing checks and address new review comments from the repository's owner, an organization member, a collaborator or a GitHub App. Merge when ready turns on GitHub's auto-merge, with a squash merge unless the base branch uses a merge queue. GitHub then merges once the required reviews and status checks pass, and only if the repository allows auto-merge.
</details>
