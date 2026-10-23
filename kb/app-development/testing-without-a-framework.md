---
title: Testing Without a Framework
id: P06
area: app-development
level: 2
time: 9
tags: [testing, node]
verified: 2026-10-23
status: verified
sources:
  - https://code.claude.com/docs/en/best-practices
  - https://nodejs.org/api/test.html
  - https://nodejs.org/api/assert.html
  - https://git-scm.com/docs/githooks
  - https://git-scm.com/docs/git-push
  - https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs
  - https://github.com/actions/checkout
  - https://github.com/actions/setup-node
related: [D07, R04, P09]
---

You can test a small app with nothing to install. Plain Node scripts that use `node:assert`, one runner that executes them all, a pre-push hook that runs the same runner, and CI that repeats it give Claude a pass or fail signal on every change.

## When to Use It

Use it on day one of a project, before Claude changes anything. The best-practices guide says to give Claude a check it can run, because without one "looks done" is the only signal available and you become the verification loop. A runner and one check are enough to start. This is pattern 15 in the author's setup: checks are plain Node scripts, one runner executes them all, and they run the same everywhere.

## Steps

1. **Open** the Terminal pane from the session's title bar (or press Ctrl+\`) in your Trail Notes copy, and **Run** the checks. The pane opens in the session's working directory.

   > **Terminal tip**
   > `node checks/run.mjs` starts Node and runs the runner script, which loads each `*.check.mjs` file in `checks/` and prints one line per check. Lines starting `ok` passed and lines starting `FAIL` did not. It needs Node 22 or later and installs nothing.
   >
   > ```terminal
   > node checks/run.mjs
   > ```

   The starter has one seeded bug, so you will see `FAIL` lines from the search checks. That red run is the starting point of [Capstone 1](../../capstones/capstone-1-fix-and-review.md).
2. **Read** one check file. Each check imports a function from `notes.js` and asserts what it should return with [`node:assert`](https://nodejs.org/api/assert.html). The `node:assert/strict` form prints a diff when two objects differ, which is the form to use.
3. **Write** the next check before the code. Ask Claude to leave the function out and show you the failure.

   ```prompt
   Add a check for a new function countNotes(notes) that returns how many notes there are. Put it in a new file in checks/ that follows the shape of the existing check files. Do not write countNotes yet. Run node checks/run.mjs and show me the failure.
   ```

   When the red run looks right, ask for the function and run again. [Test-Driven Development with Claude](../development/test-driven-development-with-claude.md) goes deeper, and [Tests First](../../prompts/tests-first.md) has a reusable prompt.
4. **Confirm** that a failing run changes the exit code, because hooks and CI read the exit code and ignore the printed lines.

   > **Terminal tip**
   > `echo $?` prints the exit code of the command that just ran. Zero means success. Anything else means failure.
   >
   > ```terminal
   > node checks/run.mjs; echo $?
   > ```

5. **Prompt** Claude to create `.githooks/pre-push` holding the two lines below, then **Run** the commands in the tip yourself.

   ```text
   #!/bin/sh
   node checks/run.mjs
   ```

   > **Terminal tip**
   > `chmod +x` marks the file as executable, and the [Git docs](https://git-scm.com/docs/githooks) say hooks without the executable bit are ignored. `git config core.hooksPath .githooks` tells Git to look for hooks in that folder, which the repository tracks, instead of in `.git/hooks`. A non-zero exit from a pre-push hook makes `git push` stop before anything is sent.
   >
   > ```terminal
   > chmod +x .githooks/pre-push
   > git config core.hooksPath .githooks
   > ```

6. **Add** a CI workflow so a server runs the same command. Ask Claude to write `.github/workflows/checks.yml`, and check the current major version of each action on its releases page ([`actions/checkout`](https://github.com/actions/checkout), [`actions/setup-node`](https://github.com/actions/setup-node)), because they change. GitHub's [guide to building and testing Node.js](https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs) can lag behind. Standard runners are free in public repositories, and [CI That Gates the Deploy](../process/ci-that-gates-the-deploy.md) covers the limits for private ones.

   ```yaml
   name: checks
   on:
     push:
       branches: [main]
     pull_request:
   jobs:
     checks:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v7
         - uses: actions/setup-node@v7
           with:
             node-version: lts/*
         - run: node checks/run.mjs
   ```

7. **Tell** Claude the command. Add a line to CLAUDE.md such as "Run `node checks/run.mjs` after every change and before you say a change is done". [CI That Gates the Deploy](../process/ci-that-gates-the-deploy.md) shows how the workflow becomes a gate.

> **Pro tip**
> Node also ships a stable test runner, [`node:test`](https://nodejs.org/api/test.html), started with `node --test`. It finds files by name patterns such as `*.test.js`, and `*.check.mjs` is not among them, so you would pass the files yourself. It runs each file in its own process and counts a zero exit as a pass. Either runner works. What matters is one command and a non-zero exit on failure.

## Worked Example

While Claude adds tags to Trail Notes, an edit changes how `sortNotes` orders notes. You run `git push`. The hook runs the runner, one `sortNotes` line prints `FAIL`, and the push stops before anything leaves your machine. You paste the failing line into the session, Claude fixes the code, and the push goes through. A minute later CI runs the same command on a clean machine and passes.

If the hook were missing or skipped, CI would have been the second chance. That is why the same command lives in two places.

## Pitfalls

- A check that cannot fail proves nothing. Watch each new check fail once before you make it pass.
- When a check fails, change the code. Change the check only when the requirement changed.
- The hook lives on your machine unless you point `core.hooksPath` at a tracked folder, and `git push --no-verify` skips it completely. Keep CI as the backstop.
- Checks that grow slow get skipped. Keep the runner fast enough to run before every push.
- A green run proves only what the checks cover. It does not show that the app is good.
- CI can use a different Node version than your Mac. Print `node --version` in both places, and pin a version in the workflow when a check depends on one.

## Checkpoint

Why run the same runner in a pre-push hook and in CI?

<details><summary>Show the answer</summary>

The hook is fast and catches the mistake before it leaves your machine, but it depends on one machine's setup and can be bypassed. CI runs on a clean machine every time, so the two together mean no single missing setup lets a failing change through.

</details>
