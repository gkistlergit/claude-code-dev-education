---
title: Definition of Done and Gates
id: R04
area: process
level: 2
time: 8
tags: [gates, done]
verified: 2026-10-23
status: verified
sources:
  - https://code.claude.com/docs/en/best-practices
  - https://git-scm.com/docs/githooks
  - https://git-scm.com/docs/git-push
  - https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches
related: [P06, R06, D07, R01]
---

Write down what done means, then enforce it with checks that fail loudly. A gate is a check that stops the work when something is wrong, and a skipped check counts as a failed check.

## When to Use It

Use this before you let Claude work on its own, and any time "done" has been a feeling. The best-practices guide puts it plainly: without a check Claude can run, "looks done" is the only signal available, and you become the verification loop.

## Steps

1. **Write** the definition of done as a short list in your project's `CLAUDE.md`. Each line must be something you could verify. See [A CLAUDE.md That Earns Its Keep](../workflow/a-claude-md-that-earns-its-keep.md).
2. **Turn** every line you can into a command with an exit code, and put the commands behind one runner. In Trail Notes that is `node checks/run.mjs`, which exits with code 1 when any check fails. Then ask Claude to run it and show the evidence: the command and what it printed.
3. **Add** a gate that checks the gates. A check that can pass without testing anything is worse than no check. The author's setup has gates that confirm a service worker's cache version changed whenever its cached file list did, and that a feature flag is still off. The example below is a smaller one: it fails when a check file defines no checks.
4. **Run** the same checks before every push with a `pre-push` hook. Git runs that hook before `git push`, and a non-zero exit aborts the push. Hooks without the executable bit are ignored.

    > **Terminal tip**
    > These commands create a folder of shared hooks, write a hook that runs the checks, make it executable, and tell git to look in that folder. Because the folder is inside the repository, the hook can be committed and shared.
    >
    > ```terminal
    > mkdir .githooks
    > printf '#!/bin/sh\nnode checks/run.mjs\n' > .githooks/pre-push
    > chmod +x .githooks/pre-push
    > git config core.hooksPath .githooks
    > ```

5. **Repeat** the checks in CI, as described in [CI That Gates the Deploy](ci-that-gates-the-deploy.md). `git push --no-verify` bypasses the hook completely, and a fresh clone has no hook until `core.hooksPath` is set.
6. **Write** the rule about skipping into `CLAUDE.md`: if a check cannot run or was skipped, the task is not done, and Claude says why instead of reporting success.

A gate that checks the gates, written in the format the Trail Notes runner expects. Each `*.check.mjs` file exports a `checks` object of named functions, and a check fails when its function throws:

```js
import { readdirSync } from 'node:fs';
import assert from 'node:assert/strict';

const dir = new URL('.', import.meta.url);

export const checks = {
  'every check file defines at least one check': async () => {
    for (const name of readdirSync(dir)) {
      if (!name.endsWith('.check.mjs') || name === 'gates.check.mjs') continue;
      const { checks: found } = await import(new URL(name, dir));
      assert.ok(found && Object.keys(found).length > 0, `${name} defines no checks`);
    }
  },
};
```

Save it as `checks/gates.check.mjs`. The runner already reports a file that does not export `checks`. This gate catches the quieter case, a file that exports an empty object and so passes while testing nothing.

> **Pro tip**
> Claude Code has its own layers for the same idea. A Stop hook runs your check as a script and blocks the turn from ending until it passes, and a `/goal` condition keeps Claude working across turns until the condition holds. See [Hooks: Guardrails and Warnings](../workflow/hooks-guardrails-and-warnings.md).

## Worked Example

Your Trail Notes `CLAUDE.md` gets this section:

```md
## Done means
- `node checks/run.mjs` exits 0 with nothing skipped.
- New behavior has a check that failed before the change.
- The pull request body says what was verified and what was not.
- Nothing outside the ticket's files changed.
- If a check cannot run, say so. Do not report the task as done.
```

The starter already has a gate at work. Two checks in `checks/search.check.mjs` fail until `searchNotes` matches title and body ignoring case, and the runner ends with `10 passed, 2 failed` (11 passed once you have saved `gates.check.mjs`). Install the pre-push hook after you fix that bug ([Fix a Bug from a Report](../recipes/fix-a-bug-from-a-report.md)). With the starter as shipped, the hook would refuse every push, and that refusal is the gate doing its job.

## Pitfalls

- Checks that pass vacuously, such as an empty `checks` object, a loop over zero items, or a test that never reaches its assertion.
- Commands that hide failure, such as `npm test || true`, a commented-out check, or `--no-verify` used to get past a failing one.
- Treating a skipped required check as a pass. GitHub's branch protection accepts a required status check that is skipped, so keep the jobs you require unconditional.
- A gate for everything. A gate worth having is one that has caught you at least once, so add a gate after each miss.
- Hooks that exist on one machine only. Commit them and repeat the same checks in CI.

## Checkpoint

Why run the same checks in a pre-push hook and in CI?

<details><summary>Show the answer</summary>

The hook gives fast feedback on your machine, but `git push --no-verify` skips it and a fresh clone does not have it until `core.hooksPath` is set. CI runs the checks for every push and pull request wherever they come from, so the result does not depend on one machine.

</details>
