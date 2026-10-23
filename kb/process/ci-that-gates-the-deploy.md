---
title: CI That Gates the Deploy
id: R06
area: process
level: 3
time: 9
tags: [ci, deploy, github-actions]
verified: 2026-10-23
status: verified
sources:
  - https://code.claude.com/docs/en/github-actions
  - https://code.claude.com/docs/en/headless
  - https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax
  - https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches
  - https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions
  - https://docs.github.com/en/billing/concepts/product-billing/github-actions
  - https://git-scm.com/docs/git-archive
  - https://cli.github.com/manual/gh_run_list
  - https://cli.github.com/manual/gh_run_view
related: [R07, P07, A08, R04]
---

CI runs your checks on every push and pull request, and a deploy job that depends on those checks only runs when they pass. The deploy ships the exact commit that passed, packaged with `git archive`, and you read the log afterward to see which commit went live.

## When to Use It

Use this once your project has a runner for its checks (see [Definition of Done and Gates](definition-of-done-and-gates.md)) and a place to deploy to. It is the step between a verified pull request and a change that users can see.

This needs no payment method. GitHub's billing page says standard GitHub-hosted runners, such as `ubuntu-latest`, are free in public repositories, and that private repositories on GitHub Free get a monthly allowance of minutes. Without a payment method on file, usage stops when the allowance runs out. Larger runners are always charged, so do not pick them.

## Steps

1. **Create** `.github/workflows/ci.yml` with two jobs. GitHub's [workflow syntax reference](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax) documents every key used here.

    ```yaml
    name: ci-and-deploy

    on:
      pull_request:
      push:
        branches: [main]

    permissions:
      contents: read

    jobs:
      checks:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v7
          - uses: actions/setup-node@v7
            with:
              node-version: lts/*
          - name: Run the checks
            run: node checks/run.mjs

      deploy:
        needs: checks
        if: github.event_name == 'push' && github.ref == 'refs/heads/main'
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v7
          - name: Package the exact commit
            run: |
              echo "Deploying commit ${{ github.sha }}"
              git archive --format=tar.gz -o site.tar.gz ${{ github.sha }}
          - name: Upload
            env:
              HOST_TOKEN: ${{ secrets.HOST_TOKEN }}
            run: ./scripts/upload.sh site.tar.gz
    ```

2. **Read** what each part does. `on` runs the workflow for pull requests and for pushes to `main`. `permissions` limits the token the workflow receives. `needs: checks` makes `deploy` wait for `checks`, and GitHub skips a job whose dependency failed or was skipped. The `if` line keeps `deploy` from running on pull requests. `github.sha` is the commit that triggered the run, so the deploy ships that commit even if `main` has moved since. `git archive` writes the files of that commit, so untracked files in a working tree cannot slip in.
3. **Replace** `./scripts/upload.sh` with your host's own upload command. It is a stand-in. Store the credential it needs as a repository secret and refer to it as `${{ secrets.NAME }}`. Never commit a token. GitHub's guide on [using secrets](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions) covers creating one.
4. **Require** the `checks` job before merging. In the repository's branch protection settings, enable **Require status checks to pass before merging** and pick the job. See GitHub's page on [protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches).
5. **Merge** the pull request, then find the deploy run for the commit that landed on `main`.

    > **Terminal tip**
    > `gh pr view --json mergeCommit` prints the commit that the merge created on `main`. `gh run list --commit` finds the workflow runs for that commit. `gh run view --log` prints one run's full log. Replace `12`, `<sha>` and `<run-id>` with your own values.
    >
    > ```terminal
    > gh pr view 12 --json mergeCommit
    > gh run list --commit <sha>
    > gh run view <run-id> --log
    > ```

6. **Check** that the commit in the "Package the exact commit" step matches the merge commit. If your app reports a version, print it in the same step so the log names both.

> **Pro tip**
> The docs describe `anthropics/claude-code-action@v1` as a GitHub Action that runs Claude Code inside a workflow, for example to review each pull request. It is optional and this course does not need it. It requires an authentication secret, and the docs say its runs use GitHub Actions minutes plus either API tokens or, if you authenticate with a subscription token, your subscription. Paying per token with an API key is outside this course's free-only rule. Add it only if you have decided that is worth it, and keep your own checks as the gate. See [Claude Code GitHub Actions](https://code.claude.com/docs/en/github-actions).

## Worked Example

You add the capstone 3a service worker to Trail Notes: `sw.js` holds a `CACHE_VERSION` and the list of cached files, and a check fails when that list changes without a version bump. You add a file to the list and forget to bump the version.

1. You push the branch and open a pull request. The `checks` job runs `node checks/run.mjs`, the cache check fails, and the pull request shows a red check.
2. You bump `CACHE_VERSION` and push. The check still fails, because the lock file does not match yet. You run `npm run cache:lock`, commit the lock file with `sw.js`, and push again. The checks pass.
3. You merge. The push to `main` starts the workflow again, `checks` passes, and `deploy` runs.
4. You read the deploy log. It prints `Deploying commit` followed by the merge commit, and you compare it with `gh pr view --json mergeCommit`.

Suppose you had merged at step 1 anyway. The push to `main` would run `checks` again, it would fail again, and `needs: checks` would skip `deploy`. Without the check itself, nothing would remind you that the version needs a bump. The details of that check are in [Capstone 3a](../../capstones/capstone-3a-offline-first-app.md).

## Pitfalls

- Treating a skipped job as a pass. GitHub accepts a skipped required status check as meeting the requirement, so the job you require must not carry an `if` that can skip it. The `if` belongs on `deploy`.
- Deploying from a branch name. `main` can move between your check and the upload, which is why the workflow names `github.sha`.
- Letting the Node version float. `node-version: lts/*` follows the current LTS release, which is fine for a first workflow. Pin a major version when you want the version to change only in a pull request.
- Two deploys at once. GitHub's `concurrency` key lets one run wait for another, and the workflow syntax reference describes how pending runs are replaced.
- Commits made with the default `GITHUB_TOKEN` do not trigger workflows. If Claude's pushes need CI, follow the troubleshooting section of the Claude Code GitHub Actions page.
- Reading only the green badge. Open the log and confirm the commit.
- Secrets in the repository. Anyone with the history has them.

## Checkpoint

The `checks` job fails on a push to `main`. What happens to `deploy`, and why?

<details><summary>Show the answer</summary>

`deploy` is skipped. It declares `needs: checks`, and GitHub skips a job whose dependency failed or was skipped, so nothing is packaged or uploaded.

</details>
