---
title: Level 2: Intermediate
kind: learn
level: 2
order: 3
time: 497
verified: 2026-10-23
sources:
  - https://code.claude.com/docs/en/desktop
  - https://code.claude.com/docs/en/worktrees
  - https://code.claude.com/docs/en/memory
  - https://code.claude.com/docs/en/skills
  - https://code.claude.com/docs/en/permissions
  - https://code.claude.com/docs/en/sub-agents
  - https://code.claude.com/docs/en/best-practices
  - https://code.claude.com/docs/en/commands
  - https://code.claude.com/docs/en/context-window
---

Level 2 moves from single prompts to a working process: specs, branches, pull requests, tests, your own instructions and skills, and a first look at shipping. It has five modules and ends with [Capstone 2: Ship a Feature](../capstones/capstone-2-ship-a-feature.md). Start from the state your `trail-notes` folder was in after Capstone 1, with the search bug fixed and the checks passing. If you skipped the capstone, copy `capstone-1/` from the [solutions](../exercises/trail-notes-solutions/README.md) into a folder named `trail-notes` and run `git init` and a first commit there. Module M2.2 needs a free personal GitHub account.

## Module M2.1: Spec to Plan

### Objectives

By the end of this module you can:

- Run a grilling session until every decision about a feature is explicit.
- Write a spec, a glossary that lists terms to avoid, and a short decision record.
- Split a spec into tickets that declare what blocks what.
- Ask Claude to argue against a stack choice before you commit to it.

### Time

Articles: 25 min. Exercise: 40 min. Total: 65 min. The exercise time is a planning budget.

### Read

1. [Spec First: Grilling and a Glossary](../kb/app-development/spec-first-grilling-and-a-glossary.md) (9 min)
2. [Grill, Spec, Tickets](../kb/process/grill-spec-tickets.md) (8 min)
3. [Choosing a Stack for a Small App](../kb/app-development/choosing-a-stack-for-a-small-app.md) (8 min)

### Exercise

You will plan a tags feature for Trail Notes without writing any code. Capstone 2 builds it, so keep the files you produce here.

1. **Start** a session on `trail-notes` in Manual mode. Grilling needs no file edits, so you will not approve anything until step 3.
2. **Prompt** Claude to grill you, and answer each question yourself:

   ```prompt
   We will add tags to Trail Notes. A note can carry tags, and the list can be filtered by one tag. The logic lives in notes.js as pure functions: addNote accepts tags, and a new filterByTag(notes, tag) returns the notes that carry that tag. Grill me about this feature one question at a time until every decision is explicit. Do not write any code. After each answer, keep a running list of the decisions made so far.
   ```

3. **Prompt** Claude to record the decisions:

   ```prompt
   Write SPEC.md for the tags feature from our decisions: the goal, the behavior, what is out of scope, and how we will verify it with node checks/run.mjs. Write GLOSSARY.md with the terms we used, including any word that could mean two things and the term we will use for each. If any decision is hard to reverse, write a short decision record for it in DECISIONS.md.
   ```

4. **Prompt** Claude to cut the spec into tickets:

   ```prompt
   Split SPEC.md into tickets and write them to TICKETS.md. For each ticket give a title, what it changes, how to verify it, and which other tickets block it. Keep each ticket small enough to ship as one pull request.
   ```

5. **Challenge** your own stack choice:

   ```prompt
   Argue against keeping Trail Notes framework-free. Give the strongest case for adding a framework, then tell me what would have to be true for that case to win. Do not change any files.
   ```

6. **Read** `TICKETS.md` and mark which tickets could run at the same time in separate worktrees.

### Success Check

- `SPEC.md` has a section on what is out of scope and a verification line that names `node checks/run.mjs`.
- `GLOSSARY.md` exists and lists the words that could mean two things.
- Every ticket in `TICKETS.md` names its blockers or says it has none. At least one ticket has no blockers, and you can point to two tickets that do not depend on each other.
- `node checks/run.mjs` still passes, and the Changes pane lists only new `.md` files.
- You can say in one sentence what would make you add a framework.

### Checkpoint

1. When is a grilling session finished?

   <details><summary>Show the answer</summary>

   When every decision about the feature is explicit, with nothing left as "we will see." The spec, glossary and decision records then capture those decisions.

   </details>

2. Why keep a glossary that includes terms to avoid?

   <details><summary>Show the answer</summary>

   It stops the project from having the same argument twice. One agreed word per idea keeps the spec, the code and your prompts consistent.

   </details>

3. How do tickets make parallel work possible?

   <details><summary>Show the answer</summary>

   Each ticket declares what blocks it. Tickets with no dependency between them can go to separate sessions in separate worktrees at the same time.

   </details>

### Go Further

- Compare your files with the [spec template](../templates/spec.md) and the [plan template](../templates/plan.md), and add a `PLAN.md`.
- Run the [Grill a Spec](../prompts/grill-a-spec.md) prompt on your `SPEC.md` and see what new questions it raises.
- Read the "Let Claude interview you" section of the official [best practices page](https://code.claude.com/docs/en/best-practices).
- Ask Claude which decision in your spec you are most likely to regret, and write a decision record for it.

## Module M2.2: Branches, PRs and CI

### Objectives

By the end of this module you can:

- Run a session in its own worktree on its own branch.
- Open a pull request whose body says what changed, what was verified and what was not.
- Add a CI workflow that runs the checks on every push and pull request.
- Say what Auto-fix and Merge when ready do, and what they will not decide for you.
- Clean up a branch and a worktree after the merge.

### Time

Articles: 38 min. Exercise: 45 min. Total: 83 min. The exercise time is a planning budget.

### Read

1. [Worktrees and Branches in the App](../kb/app/worktrees-and-branches-in-the-app.md) (8 min)
2. [Pull Requests and Auto-fix](../kb/app/pull-requests-and-auto-fix.md) (8 min)
3. [One Branch per Change](../kb/process/one-branch-per-change.md) (7 min)
4. [Definition of Done and Gates](../kb/process/definition-of-done-and-gates.md) (8 min)
5. [Pull Requests That Review Fast](../kb/process/pull-requests-that-review-fast.md) (7 min)

### Exercise

You will publish Trail Notes to a free personal GitHub repository, then add a CI workflow through a pull request made from a worktree session. Check GitHub's documentation on [billing for GitHub Actions](https://docs.github.com/en/billing/concepts/product-billing/github-actions) to see what the free plan includes before you start.

> **Terminal tip**
> `gh auth status` shows which GitHub account the GitHub CLI is signed in to. If you have more than one account, make sure the active one is your personal account before you go on. `gh repo create trail-notes` makes a new repository named trail-notes on that account. `--private` keeps it visible only to you (use `--public` if you prefer). `--source .` uses the current folder as the source, and `--push` uploads your commits. The [GitHub CLI manual](https://cli.github.com/manual/gh_repo_create) lists every option.
>
> ```terminal
> cd ~/trail-notes
> gh auth status
> gh repo create trail-notes --private --source . --push
> ```

1. **Run** the commands in the tip. If `gh` is not signed in, run `gh auth login` and follow its prompts.
2. **Start** a new session. Click the project folder control in the row under the prompt box, choose `trail-notes` and turn on Worktree. Set Manual mode.
3. **Prompt** Claude to add the workflow:

   ```prompt
   Add a GitHub Actions workflow at .github/workflows/checks.yml that runs node checks/run.mjs on every push and on every pull request. Use only what GitHub documents for workflow syntax, and tell me which Node.js setup step you chose and why.
   ```

4. **Review** the diff in the Changes pane. Confirm that the workflow installs Node.js before it runs the checks and that it changes no other file.
5. **Prompt** Claude to open the pull request:

   ```prompt
   Commit this, push the branch and open a pull request. In the body, say what changed, what you verified, and what you could not verify.
   ```

6. **Watch** the pull request in the Changes card of the session details panel. It shows the status of its CI checks. In Terminal, `gh pr checks <number>` lists the same checks. If a check fails, read the failure with Claude before you change anything. The Auto-fix item in the menu beside the pull request title lets Claude fix failing checks.
7. **Run** `/code-review` and read its findings. Merge the pull request when the checks pass, either with Merge when ready from the same menu (the repository must allow auto-merge) or with `gh pr merge <number> --merge`.
8. **Clean up** with the commands in the tip below.

> **Terminal tip**
> After the merge, bring the merged work into your main folder and remove what is left over. `git pull` fetches and merges the latest commits from GitHub. `git worktree list` shows every working folder attached to the repository. `git worktree remove <path>` deletes one of them, and the path comes from the list. `git branch -d <branch>` deletes a merged local branch.
>
> ```terminal
> cd ~/trail-notes
> git pull
> git worktree list
> git worktree remove <path from the list>
> git branch -d <branch name>
> ```

### Success Check

- `gh pr checks <number>` showed the workflow's check passing before you merged.
- `ls .github/workflows` in your main folder after `git pull` lists `checks.yml`.
- The pull request body has a statement of what was verified and what was not.
- After cleanup, `git worktree list` shows one entry, and `git branch` no longer lists the pull request's branch.

### Checkpoint

1. Where do worktrees live by default, and is the Worktree toggle on or off by default?

   <details><summary>Show the answer</summary>

   In `<project-root>/.claude/worktrees/`. The toggle is off by default, so Claude works in the project folder itself unless you turn it on before the session starts.

   </details>

2. What do Auto-fix and Merge when ready each do?

   <details><summary>Show the answer</summary>

   Auto-fix has Claude fix failing checks and, in a local session, address new review comments from the repository owner, an organization member, a collaborator or a GitHub App. Merge when ready turns on GitHub auto-merge for the pull request. Neither decides whether the change is worth shipping.

   </details>

3. Why does the course treat a skipped check as a failed check?

   <details><summary>Show the answer</summary>

   A definition of done that depends on checks is only met when those checks ran and passed. A check that did not run proves nothing, so the work is not done.

   </details>

### Go Further

- Read the official [desktop documentation on pull request status](https://code.claude.com/docs/en/desktop) and try Auto-fix on a pull request with a deliberately failing check.
- Fill in the [PR body template](../templates/pr-body.md) for your pull request and compare it with what Claude wrote.
- Run the [Write a PR Body](../prompts/write-a-pr-body.md) prompt on your next change.
- Add a `.worktreeinclude` file that lists one ignored file you would want in every worktree.

## Module M2.3: Quality

### Objectives

By the end of this module you can:

- Debug from a report: reproduce first, rank hypotheses, make the smallest fix and add a regression check.
- Refactor in small steps with the behavior that must not change written down first.
- Work test-first and stop Claude from editing checks to make them pass.
- Review a diff with `/code-review` and with a fresh subagent.
- Run a zero-dependency check suite and say why one runner is enough.

### Time

Articles: 50 min. Exercise: 50 min. Total: 100 min. The exercise time is a planning budget.

### Read

1. [Debugging with Claude](../kb/development/debugging-with-claude.md) (8 min)
2. [Refactoring Safely](../kb/development/refactoring-safely.md) (8 min)
3. [Test-Driven Development with Claude](../kb/development/test-driven-development-with-claude.md) (9 min)
4. [Code Review, Yours and Claude's](../kb/development/code-review-yours-and-claudes.md) (8 min)
5. [Testing Without a Framework](../kb/app-development/testing-without-a-framework.md) (9 min)
6. [Fix a Bug from a Report](../kb/recipes/fix-a-bug-from-a-report.md) (8 min)

### Exercise

The articles use the seeded search bug as their example, and your `trail-notes` folder already has it fixed. Use a fresh copy of the starter so the bug is back.

> **Terminal tip**
> `cp -R` copies a folder with everything inside it. Run the first command from the root of your copy of this repository. The other commands move into the new folder, turn it into a git repository and save a first commit.
>
> ```terminal
> cp -R exercises/trail-notes-starter ~/trail-notes-debug
> cd ~/trail-notes-debug
> git init
> git add .
> git commit -m "Starter copy"
> ```

1. **Run** the commands in the tip, then start a session on `trail-notes-debug` in Manual mode.
2. **Prompt** Claude to diagnose a report before it touches anything:

   ```prompt
   Here is a bug report: "I typed MAP in the search box and my note titled Trail map did not show up. When I typed map it did." Do not change any files yet. Run the checks, give me three hypotheses ranked by likelihood with the evidence for each, and tell me which one the failing check supports.
   ```

3. **Prompt** Claude to fix it test-first:

   ```prompt
   The existing search check already fails. Read it and tell me whether it covers titles, bodies or both. Then add one new check in a new file under checks/ for a case it does not cover yet, such as an all-capitals query like MAP. Run the checks and show me that the new check fails for the right reason. Then make the smallest change in notes.js that makes every check pass. Do not edit any existing check.
   ```

4. **Prompt** for a second red-green cycle, this time on a new behavior and not a bug:

   ```prompt
   I want one new behavior in searchNotes: a query of several words should match a note whose title and body together contain every word, in any order. Write one failing check for it in a new file under checks/, run it and show me that it fails for the right reason, then make the smallest change that passes, then run all checks. Do not edit any existing check.
   ```

5. **Prompt** Claude to plan a refactor, and wait for its answer:

   ```prompt
   I want to move the localStorage code out of app.js into a new file, storage.js. Before you change any code, write REFACTOR.md listing what must not change: the storage key, how notes are saved and loaded, the message shown when storage is blocked, the order of the list, and how search behaves. Then wait for me.
   ```

   Read `REFACTOR.md`, correct it, then send:

   ```prompt
   Go. Extract only loadNotes into storage.js, run node checks/run.mjs and show me the diff. Stop after that step.
   ```

6. **Preview** the app:

   ```prompt
   Preview this app in the Browser pane.
   ```

   Add a note, reload the page and confirm the note is still there. If you have time, repeat steps 5 and 6 for saveNotes.
7. **Review** the result twice. Run `/code-review` and read its findings. Then send:

   ```prompt
   Use a subagent to review the changes in this folder against REFACTOR.md. It has not seen our conversation. Report only gaps that affect correctness or the list in REFACTOR.md.
   ```

8. **Prompt** Claude to write the pull request body without opening a pull request:

   ```prompt
   Write PR_BODY.md for these changes using three headings: What changed, What I verified, What I did not verify. Be specific: name the commands you ran and the result of each.
   ```

### Success Check

- You saw `node checks/run.mjs` fail before the fix and pass after it.
- `git status` lists `notes.js` as modified and the new check files under `checks/` as untracked, and no existing file under `checks/` is listed as modified.
- `REFACTOR.md` was written before `storage.js` existed, and a note you add in the Browser pane survives a reload.
- The review findings arrived in the conversation, and you wrote down for each one whether you fixed it or rejected it and why.
- `PR_BODY.md` has an unverified section that is not empty.

### Checkpoint

1. What do you do first when someone hands you a bug report?

   <details><summary>Show the answer</summary>

   Reproduce it. Give Claude the exact error and how to trigger it, ask for ranked hypotheses before any change, make the smallest fix, then add a regression check.

   </details>

2. How do you stop Claude from editing a check to make it pass?

   <details><summary>Show the answer</summary>

   Tell it not to edit existing checks, and confirm with `git status` that no existing file under `checks/` changed. Read the checks first when you review a diff.

   </details>

3. Why ask for a review from a fresh subagent?

   <details><summary>Show the answer</summary>

   It sees only the diff and the criteria you give it, not the reasoning that produced the change, so it judges the result independently. Treat its findings as leads to verify, because a reviewer asked to find gaps will usually report some.

   </details>

### Go Further

- Run the bundled `/simplify` skill on the refactor and read what it proposes before you accept anything.
- Ask Claude to add a git pre-push hook that runs `node checks/run.mjs` and blocks the push when it fails. The Testing Without a Framework article describes the pattern.
- Use the [Tests First](../prompts/tests-first.md), [Debug from an Error](../prompts/debug-from-an-error.md) and [Refactor with Guardrails](../prompts/refactor-with-guardrails.md) prompts on your own code.
- Read the official [best practices page](https://code.claude.com/docs/en/best-practices) section on adding an adversarial review step.

## Module M2.4: Make Claude Yours

### Objectives

By the end of this module you can:

- Keep a CLAUDE.md short and check that it loaded.
- Write a rules file and say when a rule belongs there and when it belongs in a hook.
- Decide what auto memory should keep and read what it saved.
- Write a project skill that triggers on its description.
- Cut permission prompts by allowing one safe command, and measure the change.
- Choose between a skill, a subagent and a hook.

### Time

Articles: 65 min. Exercise: 50 min. Total: 115 min. The exercise time is a planning budget.

### Read

1. [A CLAUDE.md That Earns Its Keep](../kb/workflow/a-claude-md-that-earns-its-keep.md) (8 min)
2. [Rules and Global Settings](../kb/workflow/rules-and-global-settings.md) (8 min)
3. [Memory: What to Save](../kb/workflow/memory-what-to-save.md) (7 min)
4. [Your First Skill](../kb/workflow/your-first-skill.md) (9 min)
5. [Permission Tuning for Fewer Prompts](../kb/workflow/permission-tuning-for-fewer-prompts.md) (8 min)
6. [Customize: Skills, Plugins and Connectors](../kb/app/customize-skills-plugins-and-connectors.md) (8 min)
7. [Skill, Subagent or Hook](../kb/decision-guides/skill-subagent-or-hook.md) (5 min)
8. [Claude Ignores My Instructions](../kb/troubleshooting/claude-ignores-my-instructions.md) (6 min)
9. [Permission Prompt Fatigue](../kb/troubleshooting/permission-prompt-fatigue.md) (6 min)

### Exercise

You will configure your `trail-notes` project with a tighter CLAUDE.md, a rule, a remembered preference, a skill and an allow rule. Work in the main folder and commit after each part.

1. **Audit** your CLAUDE.md. Type `/memory` to see which files Claude loads, then send:

   ```prompt
   Read CLAUDE.md and propose cuts. Remove anything the code already shows, anything vague, and anything that contradicts another line. Show me the proposed version before you save it.
   ```

2. **Add** a project rule. The [rules file template](../templates/rules-file.md) shows the shape.

   ```prompt
   Create .claude/rules/checks.md with two rules: run node checks/run.mjs after every change to a .js file and report the result, and never edit a file in checks/ to make a failing check pass.
   ```

3. **Open** a new session on the folder and type `/context`. Look under Memory files for CLAUDE.md. If it is missing from that list, Claude cannot see it. The docs describe that list for CLAUDE.md files and do not say whether it also shows rules files, so note whether `checks.md` appears.
4. **Teach** Claude a preference and find where it went:

   ```prompt
   Remember that in this project the checks run with node checks/run.mjs and never with a test framework.
   ```

   Type `/memory` and open the auto memory folder to read what was saved. If the toggle shows auto memory is off, skip this step.
5. **Write** a skill. The [skill template](../templates/skill.md) shows the shape.

   ```prompt
   Create a project skill at .claude/skills/add-check/SKILL.md. When I run /add-check followed by a function name, it adds a file checks/<name>.check.mjs with one failing assertion using node:assert/strict like the other checks, runs node checks/run.mjs, and reports which check fails. Write a description that says when to use it.
   ```

   Type `/` in the prompt box and look for `add-check`. If it is missing, run `/reload-skills`, because Claude Code does not watch a skills folder that did not exist when the session started. Run `/add-check sortNotes` and confirm the runner reports a failure from the new file. Then clean up:

   ```prompt
   Delete the check file you just added to checks/ and run node checks/run.mjs to confirm everything passes again.
   ```
6. **Count** permission prompts. In a Manual mode session, send the prompt below and note how many times you had to approve a command. Then type `/permissions`, add an allow rule for the exact command `Bash(node checks/run.mjs)`, and send the prompt again.

   ```prompt
   Run node checks/run.mjs three times, one after another, and report each result.
   ```

   Finally, confirm that a command outside the rule still asks:

   ```prompt
   Commit the current changes with a short message.
   ```
7. **Open** Customize in the sidebar and list the skills, plugins and connectors you have. Note any you do not recognize or never use. Remove only ones you are sure you do not need.

### Success Check

- `/context` in a new session lists your CLAUDE.md, and the rules file appears in the same list or you know why it does not.
- `/memory` shows a saved entry for the preference you gave, unless auto memory is off.
- Typing `/` shows `add-check`, and `/add-check sortNotes` made the runner report a failing check.
- After the allow rule, `node checks/run.mjs` ran with no approval prompt, and the commit still asked. Your before and after counts are written down.
- Your CLAUDE.md is shorter than it was and still tells Claude how to run the checks.

### Checkpoint

1. When does CLAUDE.md load, and what does that mean for edits?

   <details><summary>Show the answer</summary>

   It loads when a session starts. An edit takes effect in new sessions, so open a new one and check `/context` to confirm it loaded.

   </details>

2. When do you reach for a skill, a subagent, a hook or a CLAUDE.md rule?

   <details><summary>Show the answer</summary>

   A skill teaches Claude a procedure. A subagent keeps heavy work out of the main thread. A hook enforces something every time. A CLAUDE.md rule states a preference.

   </details>

3. Does a CLAUDE.md instruction control what Claude Code permits?

   <details><summary>Show the answer</summary>

   No. Permission rules are enforced by Claude Code, while instructions only shape what Claude tries to do. To grant or revoke access, use `/permissions`, rules, a permission mode or a hook.

   </details>

### Go Further

- Run `/skill-doctor` (it needs Claude Code 2.1.252 or later) to see what each skill costs in context.
- Run `/doctor prompt-audit` to check your instruction files for outdated or conflicting lines. The official [skills page](https://code.claude.com/docs/en/skills) describes it and the version it needs.
- Compare your allow rule with the [permissions documentation](https://code.claude.com/docs/en/permissions) on rule syntax, and write one deny rule for a command you never want run.
- Move one preference from CLAUDE.md into a rules file and see whether Claude still follows it.

## Module M2.5: Ship

### Objectives

By the end of this module you can:

- Check a manifest and preview a static app in the Browser pane.
- Move styles to tokens and run a screenshot, keyboard and contrast loop.
- Map an unfamiliar repository with a read-only subagent without filling your own context.
- Choose a model and effort for a task and read your usage.
- Use `claude doctor` and the common recovery steps when errors appear.
- Walk the ship-a-feature recipe against your own tickets.

### Time

Articles: 79 min. Exercise: 55 min. Total: 134 min. The exercise time is a planning budget.

### Read

1. [A Static PWA on a Free Host](../kb/app-development/a-static-pwa-on-a-free-host.md) (10 min)
2. [UI and Design Systems with Claude](../kb/app-development/ui-and-design-systems-with-claude.md) (9 min)
3. [Preview, Ship and Maintain](../kb/app-development/preview-ship-and-maintain.md) (8 min)
4. [Ship a Feature End to End](../kb/recipes/ship-a-feature-end-to-end.md) (10 min)
5. [Audit an Unfamiliar Repo](../kb/recipes/audit-an-unfamiliar-repo.md) (8 min)
6. [Model and Effort Trade-offs](../kb/optimization/model-and-effort-trade-offs.md) (8 min)
7. [Delegating to Subagents](../kb/optimization/delegating-to-subagents.md) (8 min)
8. [Reading Your Usage, Context and Skills](../kb/optimization/reading-your-usage-context-and-skills.md) (7 min)
9. [Which Model and Effort](../kb/decision-guides/which-model-and-effort.md) (5 min)
10. [Errors and Retries](../kb/troubleshooting/errors-and-retries.md) (6 min)

### Exercise

This module is a set of short drills. Deploying to a free host is optional here. If you want to, read that host's own current documentation and free-tier terms first, because the course does not cover them.

1. **Preview** the app and check its manifest:

   ```prompt
   Preview this app in the Browser pane. Then check that manifest.webmanifest is valid JSON, that index.html links to it, and list anything a browser could complain about. Do not change any files yet.
   ```

2. **Tokenize** the styles and run a visual check:

   ```prompt
   style.css already keeps its colors in custom properties. Move the spacing and font sizes into custom properties in the same :root block, and use them throughout. Do not change how the page looks. Then open the app in the Browser pane, take a screenshot, and check keyboard focus order and text contrast against WCAG AA. Write the problems you find to A11Y.md; do not fix them yet.
   ```

3. **Audit** a repository you did not write. Copy the capstone 3a solution to a new folder with the command below, open a session on that folder and note the percentage in the Context card first. `cp -R` copies a folder with everything inside it. Replace the first path with the location of the solution folder inside your copy of this repository. The second path is a new folder in your home folder.

   ```terminal
   cp -R <path to your copy of this repository>/exercises/trail-notes-solutions/capstone-3a ~/unfamiliar
   ```

   ```prompt
   Use the Explore subagent to map this folder: the layout, the commands to run, the risky areas and the tests. Return a summary of under 200 words. Do not read the files yourself.
   ```

   Open the Background tasks pane from the title bar's menu if it appears, and note the Context card percentage again.
4. **Compare** effort levels in a `trail-notes` session. Press Cmd+Shift+E to open the effort menu and choose a lower level, then send the prompt below. Choose a higher level and send it again. Supported levels vary by model, so use the nearest ones the menu offers.

   ```prompt
   List the edge cases that searchNotes does not handle and rank them by how likely a user is to hit them.
   ```

   Record both answers in `EFFORT.md` with the level, how deep each answer went and anything one found that the other missed. Then type `/usage` to see your plan usage, and add one line to `EFFORT.md` that names a change you would make because of it.
5. **Diagnose** your install if you added the command-line tool. In Terminal, `claude doctor` runs read-only checks of the installation and prints what it finds.

   ```terminal
   claude doctor
   ```

6. **Walk** the Ship a Feature End to End recipe against your `TICKETS.md` from Module M2.1. Write down where your tickets differ from the recipe's steps.

### Success Check

- Claude's reply on the manifest lists its findings, or says it found none, and you saw the app in the Browser pane.
- The `:root` block at the top of `style.css` now holds spacing and font-size properties as well as colors, and the page still looks the same. `A11Y.md` names the checklist, WCAG AA, and lists what Claude found for focus order and contrast, or says it found nothing.
- The audit summary came back from a subagent, and you recorded the Context card percentage before and after.
- `EFFORT.md` has two entries and a line naming one change you would make after reading `/usage`.
- If you used the command line, `claude doctor` printed its findings.
- You have a short list of differences between your tickets and the recipe.

### Checkpoint

1. Which shortcuts open the model menu and the effort menu in the Code tab?

   <details><summary>Show the answer</summary>

   Cmd+Shift+I opens the model menu and Cmd+Shift+E opens the effort menu.

   </details>

2. What are the built-in subagents, and which of them are read-only?

   <details><summary>Show the answer</summary>

   Explore, Plan and General-purpose. Explore and Plan are read-only; General-purpose can use every tool available to subagents.

   </details>

3. Why send heavy reading to a subagent?

   <details><summary>Show the answer</summary>

   The subagent works in its own context window and returns only its conclusion, so the file contents stay out of your main conversation.

   </details>

### Go Further

- Read the dark-mode block that `style.css` already has inside a `prefers-color-scheme` media query, and ask Claude to check text contrast in both modes against WCAG AA.
- Put the preview server settings in `.claude/launch.json` as the official [desktop documentation](https://code.claude.com/docs/en/desktop) describes, and read about the autoVerify setting.
- Run `/skill-doctor` and `/context` together and note which one tells you what.
- Read the [Update Docs](../prompts/update-docs.md) prompt and use it to refresh your CLAUDE.md after this module.
- Do [Capstone 2: Ship a Feature](../capstones/capstone-2-ship-a-feature.md), then continue to [Level 3: Advanced](level-3-advanced.md).
