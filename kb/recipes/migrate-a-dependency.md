---
title: Migrate a Dependency
id: RC05
area: recipes
level: 3
time: 9
tags: [recipe, migration]
verified: 2026-10-23
status: verified
sources:
  - https://code.claude.com/docs/en/common-workflows
  - https://code.claude.com/docs/en/best-practices
  - https://code.claude.com/docs/en/worktrees
  - https://nodejs.org/en/about/previous-releases
  - https://nodejs.org/api/assert.html
  - https://docs.npmjs.com/cli/v10/commands/npm-install
  - https://git-scm.com/docs/git-revert
  - https://git-scm.com/docs/git-log
related: [D06, R06, P06, R03]
---

A migration changes something your code relies on, so the danger is behavior that shifts without an obvious error. Read the changelog first, pin the target version, run the checks before touching anything, migrate in small steps in a worktree, and keep a way back.

## When to Use It

Use it when you upgrade a library, a runtime, or a standard-library API that your code depends on. Trail Notes has no packages to upgrade, so the worked example moves it to a newer Node version, which is a dependency too. The steps are the same for a third-party package or a simple pinned tool.

## Steps

1. **Read** the official changelog or migration guide for the target version before Claude changes anything. The docs say you can give Claude URLs for documentation. Ask for the breaking changes that touch your code, then open the links yourself.

    ```prompt
    Read <URL of the changelog or migration guide>. List only the breaking changes that affect how this repository uses the package, each with a link to its section. Do not change any files.
    ```

2. **Pin** the target version, and write down the version you are leaving. For an npm package, `--save-exact` stores an exact version instead of a range. For a runtime such as Node, pin it in the places that decide which one runs.

    > **Terminal tip**
    > `npm install` adds a package, `<package>@<version>` names the version, and `--save-exact` writes that exact version into `package.json`. `node --version` prints the Node version in use. Replace `<package>` and `<version>` with your own values.
    >
    > ```terminal
    > npm install <package>@<version> --save-exact
    > node --version
    > ```

3. **Run** the checks before touching anything, and record the result. If any check fails, fix it first, so every failure after the migration is yours.
4. **Start** a session in its own worktree on a new branch ([One Branch per Change](../process/one-branch-per-change.md)). A migration touches many files, and a worktree keeps main clean while you work.
5. **Migrate** in small steps. One file, one API or one setting per commit, with the checks run after each. The docs advise small, testable increments for refactoring, and the same applies here.

    ```prompt
    Migrate one step at a time. After each step, run node checks/run.mjs and show me the output, then commit with a message that names the step. If a check fails, stop and tell me what changed in behavior before you edit anything else.
    ```

6. **Review** the whole diff in the **Changes** pane for behavior changes that hide inside mechanical edits. Ask Claude to list every place where the new version could behave differently from the old one, and compare that list with what you read in step 1.
7. **Keep** a rollback. The migration is one pull request made of small commits, so you can undo it later with `git revert`. Put the old and new versions in the pull request body, so the way back is on the page.

    > **Terminal tip**
    > `git log --oneline --merges -n 3` lists the three most recent merge commits. `git revert -m 1` creates a new commit that undoes a merge, and `-m 1` says that parent 1, the branch you merged into, is the mainline. Replace `<merge-commit>` with the hash from the first command.
    >
    > ```terminal
    > git log --oneline --merges -n 3
    > git revert -m 1 <merge-commit>
    > ```

8. **Ship** it by the usual path: pull request, CI, merge, deploy the exact commit and a ledger entry. See [CI That Gates the Deploy](../process/ci-that-gates-the-deploy.md).

## Worked Example

The starter's `package.json` declares a minimum Node version in `engines`, and its README says the checks need Node 22 or later. You want your CI to run on a newer major version, written here as `<new major>`, and then raise the minimum. You already have the workflow from [CI That Gates the Deploy](../process/ci-that-gates-the-deploy.md).

1. Read the release notes for `<new major>` on the [Node.js releases page](https://nodejs.org/en/about/previous-releases), and the history entries in the [assert documentation](https://nodejs.org/api/assert.html), because the checks use `node:assert/strict`. One entry there says that from v25.0.0, promises are no longer considered equal unless they are the same instance. The Trail Notes checks compare lists of strings and numbers, so you expect no effect, and the CI run in step 5 confirms it.
2. Pin: in the workflow, set `node-version` to `<new major>` instead of the moving `lts/*` alias. Leave `engines` alone until the checks pass. Record `node --version` from the version you are leaving.
3. Baseline: after [Fix a Bug from a Report](fix-a-bug-from-a-report.md), `node checks/run.mjs` ends with `12 passed, 0 failed`.
4. Worktree: a branch named for the change, such as `node-upgrade`.
5. Small steps: the first commit changes only `node-version`. Push it and read the `checks` job in CI, which now runs on the new version. The second commit raises `engines`, and CI runs again.
6. Review: the diff is two small edits. Anything else in it needs a reason.
7. Rollback: if a problem shows up after the merge, `git revert -m 1` on the merge commit restores the old setup, and the pull request body names the old version.

## Pitfalls

- Migrating from memory. Claude's knowledge of a package can be older than the version you are moving to, so read the current changelog first.
- Letting a moving alias stand in for a pin. `lts/*` and version ranges can change under you between the check and the deploy.
- Migrating everything in one commit. When a check fails, you cannot tell which change caused it.
- Making a check pass by weakening it. If the new version exposes a real difference, the check did its job.
- Reverting a merge and then merging the same branch again. The git docs warn that after you revert a merge, a later merge brings in only changes that were not part of the reverted one, so the reverted work stays out unless you revert the revert.
- Skipping the baseline. Without it you cannot say whether the migration or an older bug caused a failure.

## Checkpoint

You migrate one step, run the checks, and one fails. What do you do next?

<details><summary>Show the answer</summary>

Stop and find out what changed in behavior. Fix the code or the expectation on purpose, based on what the changelog and the failure say, and do not edit the check just to turn it green. Then run the checks again before you continue to the next step.

</details>
