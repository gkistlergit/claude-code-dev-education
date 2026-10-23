---
title: Level 3: Advanced
kind: learn
level: 3
order: 4
time: 433
verified: 2026-10-22
sources:
  - https://code.claude.com/docs/en/hooks-guide
  - https://code.claude.com/docs/en/sub-agents
  - https://code.claude.com/docs/en/headless
  - https://code.claude.com/docs/en/scheduled-tasks
  - https://code.claude.com/docs/en/desktop-scheduled-tasks
  - https://code.claude.com/docs/en/desktop
  - https://code.claude.com/docs/en/worktrees
  - https://code.claude.com/docs/en/remote-control
  - https://code.claude.com/docs/en/claude-projects
  - https://code.claude.com/docs/en/fast-mode
  - https://cli.github.com/manual/gh_pr_merge
  - https://nodejs.org/api/assert.html
---

Level 3 adds automation, parallel and remote work, offline and backend design, gates with a standing go, and measurement. It has five modules and two capstones: [Capstone 3a: Offline-First App](../capstones/capstone-3a-offline-first-app.md) and [Capstone 3b: Optimize a Workflow](../capstones/capstone-3b-optimize-a-workflow.md). Work in your `trail-notes` folder after Capstone 2, with tags merged and your GitHub repository and CI workflow in place. If you skipped Capstone 2, copy `capstone-2/` from the [solutions](../exercises/trail-notes-solutions/README.md), run `git init`, and finish Module M2.2 first.

## Module M3.1: Automate

### Objectives

By the end of this module you can:

- Create a read-only custom subagent with a defined return format.
- Write a hook that blocks an action and prove that it fires.
- Run a prompt non-interactively with `claude -p` and read its JSON output.
- Make a packaging job depend on the checks in a GitHub Actions workflow and read its log.
- Start a `/loop` and cancel it.

### Time

Articles: 46 min. Exercise: 55 min. Total: 101 min. The exercise time is a planning budget.

### Read

1. [Subagents by Design](../kb/workflow/subagents-by-design.md) (9 min)
2. [Hooks: Guardrails and Warnings](../kb/workflow/hooks-guardrails-and-warnings.md) (10 min)
3. [Scheduled Tasks and Loops](../kb/workflow/scheduled-tasks-and-loops.md) (9 min)
4. [Headless and Scripting](../kb/terminal/headless-and-scripting.md) (9 min)
5. [CI That Gates the Deploy](../kb/process/ci-that-gates-the-deploy.md) (9 min)

### Exercise

You will add a subagent, a hook, a headless run, a CI dependency and a loop to Trail Notes.

1. **Create** a read-only subagent:

   ```prompt
   Create a project subagent at .claude/agents/reader.md. It is read-only, with only the Read, Grep and Glob tools. It answers questions about this codebase and returns a conclusion of at most ten lines plus the file paths it relied on. Write a description that says when to delegate to it.
   ```

   Then ask it to do some work:

   ```prompt
   Use the reader agent to explain how app.js saves notes.
   ```

   The transcript shows the delegation as a row with the subagent's name. If Claude cannot find the agent, start a new session, because a running session does not detect a newly created agents folder. Open `.claude/agents/reader.md` and confirm that the tools line lists only the three tools you asked for.
2. **Write** a hook that blocks edits to `package.json`:

   ```prompt
   Add a PreToolUse hook to .claude/settings.json that blocks Edit and Write calls whose target is package.json. Put the logic in a Node script at .claude/hooks/protect.mjs that reads the tool input from standard input, and exit with code 2 and a one-line reason when the path matches. Follow the hooks guide in the Claude Code documentation, tell me what you chose, and do not use jq.
   ```

   Type `/hooks` and confirm the hook is listed. Then test it:

   ```prompt
   Add a description field to package.json.
   ```

   The edit should be blocked, and Claude should report your script's reason.
3. **Run** a headless prompt in Terminal. `claude -p` runs one prompt without opening a session and exits. `--output-format json` prints a JSON object with the answer in its `result` field and metadata around it.

   ```terminal
   cd ~/trail-notes
   claude -p "List the exported functions in notes.js, one per line" --output-format json
   ```

4. **Gate** a packaging job. Start a session with Worktree on and send:

   ```prompt
   Extend the workflow in .github/workflows so a second job named package runs only after the checks job passes (use needs) and only on push events. The package job builds trail-notes.zip with git archive of the commit being built, and prints that commit's SHA and the list of files in the archive. Follow GitHub's documented syntax and tell me anything you could not verify locally.
   ```

   Open a pull request as you did in Module M2.2 and merge it when the checks pass. Then compare the logged commit with your own. `git rev-parse HEAD` prints the full SHA of the commit you are on, and `gh run list --limit 3` followed by `gh run view <run id> --log` prints a run's log. You can also read the log in the Actions tab on GitHub.

   ```terminal
   cd ~/trail-notes
   git pull
   git rev-parse HEAD
   gh run list --limit 3
   ```

5. **Break** a check on a throwaway branch and push it:

   ```prompt
   On a new branch named break-ci, change the expected value in one assertion in checks/search.check.mjs so it fails on purpose, commit it and push the branch. Do not open a pull request.
   ```

   In the Actions tab, the checks job fails and the package job shows as skipped, because GitHub skips jobs that need a failed job. Ask Claude to delete the branch locally and on GitHub afterward.
6. **Start** a loop in a session and cancel it. Fixed-interval loops end only when you ask Claude to cancel them or after seven days.

   ```prompt
   /loop 10m run node checks/run.mjs and tell me only if the result changes
   ```

   Claude confirms the cadence and a job ID. Then send:

   ```prompt
   Cancel the loop and list any scheduled tasks that remain in this session.
   ```

### Success Check

- `.claude/agents/reader.md` lists only Read, Grep and Glob, and the transcript shows a delegation to `reader`.
- The `package.json` edit was blocked with your script's reason, `/hooks` lists the hook, and `git diff package.json` shows nothing.
- The headless command printed JSON whose `result` field lists the exported functions of `notes.js`.
- The commit SHA in the package job's log on your default branch matches `git rev-parse HEAD` after `git pull`. On the broken branch, the package job was skipped.
- Claude confirmed a cadence and job ID for the loop and later confirmed that nothing remains scheduled.

### Checkpoint

1. Which exit code makes a hook block an action, and what does Claude receive?

   <details><summary>Show the answer</summary>

   Exit code 2 blocks the action. Claude receives the script's message, which it can use to adjust its approach.

   </details>

2. Where does a `/loop` run, and what ends it?

   <details><summary>Show the answer</summary>

   It runs on your machine while the session stays open. A fixed-interval loop ends when you ask Claude to cancel it, or after seven days if you do not.

   </details>

3. Why does the package job use `needs`?

   <details><summary>Show the answer</summary>

   GitHub runs the job only after the job it needs succeeds. A failed or skipped checks job therefore keeps a build of that commit from being packaged.

   </details>

### Go Further

- Read the official [hooks guide](https://code.claude.com/docs/en/hooks-guide) and add a second hook, such as one that blocks a destructive git command on PreToolUse for Bash. Use the [hook template](../templates/hook.md) as a start.
- Compare your subagent with the [subagent template](../templates/subagent.md).
- Set up a Desktop scheduled task: choose Scheduled in the sidebar, then New task. The official [scheduled tasks page](https://code.claude.com/docs/en/desktop-scheduled-tasks) says these run only while the app is open and the computer is awake, and each run is a new session.
- Add `--allowedTools` to the headless command and read the headless page on what it permits.

## Module M3.2: Parallel and Remote

### Objectives

By the end of this module you can:

- Run two sessions at once in separate worktrees without collisions.
- Watch two sessions in split view and ask a side question without disturbing either.
- Ask Claude about your other sessions and resume an earlier one.
- Say when Remote Control, a cloud session, Projects or Dispatch fits, and which plans and labels apply.
- Clean up worktrees and branches after the merges.

### Time

Articles: 46 min. Exercise: 40 min. Total: 86 min. The exercise time is a planning budget.

### Read

1. [Split View, Side Chat and Side Sessions](../kb/app/split-view-side-chat-and-side-sessions.md) (8 min)
2. [Remote Control and Cloud Sessions](../kb/app/remote-control-and-cloud-sessions.md) (8 min)
3. [Projects, Dispatch and Artifacts](../kb/app/projects-dispatch-and-artifacts.md) (8 min)
4. [Parallel Sessions Without Collisions](../kb/workflow/parallel-sessions-without-collisions.md) (8 min)
5. [Handoffs Between Sessions and Devices](../kb/workflow/handoffs-between-sessions-and-devices.md) (8 min)
6. [Worktree Sprawl](../kb/troubleshooting/worktree-sprawl.md) (6 min)

### Exercise

You will run two documentation tasks in parallel on files that cannot collide.

1. **Start** two sessions on `trail-notes`, each with Worktree on and in Manual mode. In the first, send:

   ```prompt
   Create docs/CHECKS.md explaining how the checks in checks/ work and how to add one. Touch no other file.
   ```

   In the second, send:

   ```prompt
   Create docs/STORAGE.md explaining how app.js stores and loads notes. Touch no other file.
   ```

2. **Open** the sessions side by side. Hold Option and click the second session in the sidebar, or right-click it, choose Open in, then Split view. Press Cmd+Ctrl+W to take the focused session out of the split.
3. **Ask** a side question without adding to the main thread. Press Cmd+; to open a side chat in the first session and send:

   ```prompt
   What files has this session touched so far?
   ```

   Close the side chat. The question should not appear in the main conversation.
4. **Ask** Claude about the other sessions from a new session on the same project:

   ```prompt
   List my other sessions on this project and tell me what each has done so far.
   ```

5. **Finish** both sessions. In each, send the prompt below, then merge both pull requests once their checks pass.

   ```prompt
   Commit this, push the branch and open a pull request.
   ```
6. **Clean up** in Terminal. `git worktree list` shows every working folder attached to the repository, `git worktree remove <path>` deletes one, and `git branch -d <branch>` deletes a merged local branch.

   ```terminal
   cd ~/trail-notes
   git pull
   git worktree list
   git worktree remove <path from the list>
   git branch -d <branch name>
   ```

7. **Resume** an earlier session: in a new session type `/resume` and pick one of the finished sessions from the picker.
8. **Look** at the remote options without changing anything you do not want. Open the session details panel and find the Remote Control switch in the Environment card. If you turn it on for one session, confirm the session appears at claude.ai/code, then turn it off. Check whether Projects appears in your sidebar. The documentation labels Projects a public beta on Pro and Max plans, rolling out gradually, and says Dispatch needs a Pro or Max plan. Note what you see and do not set up anything your plan does not offer.

### Success Check

- During the work `git worktree list` showed three entries. After cleanup it shows one.
- Both pull requests merged without conflicts, and `docs/CHECKS.md` and `docs/STORAGE.md` exist on your default branch after `git pull`.
- The side chat answered, and its question is absent from the first session's transcript.
- Claude named your other sessions in step 4, and `/resume` opened an earlier one.
- You recorded whether the Remote Control switch and Projects are available to you.

### Checkpoint

1. How do you put two sessions side by side, and how do you separate them?

   <details><summary>Show the answer</summary>

   Hold Option (Alt on Windows) and click a session in the sidebar, or right-click it and choose Open in, then Split view. Cmd+Ctrl+W takes the focused session out of the split.

   </details>

2. What happens to a side chat when you close the app?

   <details><summary>Show the answer</summary>

   It is gone. The desktop app does not save side chats to disk, so you cannot return to one after you close the app.

   </details>

3. Why give each parallel session its own worktree?

   <details><summary>Show the answer</summary>

   Each worktree is a separate checkout on its own branch, so two sessions never edit the same files in the same folder. Keep one writer per set of files, and remove the worktree when its pull request merges so stale ones do not pile up.

   </details>

### Go Further

- Read the official [Remote Control page](https://code.claude.com/docs/en/remote-control) for its requirements and the Trusted Devices beta.
- Read the official [Projects page](https://code.claude.com/docs/en/claude-projects) and decide whether it fits your work. Its label is public beta.
- Use the [handoff template](../templates/handoff.md) to write a note for a session you will resume on another device.
- Count how many stale worktrees you have in each of your own projects and remove the merged ones.

## Module M3.3: Backend and Offline

### Objectives

By the end of this module you can:

- Say what a serverless function, a key-value store, a SQL database and object storage are each for.
- Write decision records for storage and sign-in choices before any code exists.
- Run a security pass that separates confirmed findings from guesses, and verify one by reading the code.
- Add a fixed benchmark that a search change must not lower.
- Plan an offline-first design with a versioned cache.
- Migrate a dependency in small steps with a baseline and a rollback.

### Time

Articles: 56 min. Exercise: 55 min. Total: 111 min. The exercise time is a planning budget.

### Read

1. [Backend Pieces: Functions, KV, D1 and R2](../kb/app-development/backend-pieces-functions-kv-d1-and-r2.md) (10 min)
2. [Offline-First with Service Workers](../kb/app-development/offline-first-with-service-workers.md) (10 min)
3. [Auth: Access and Passkeys](../kb/app-development/auth-access-and-passkeys.md) (9 min)
4. [AI Features Safely: Retrieval versus Generation](../kb/app-development/ai-features-safely-retrieval-versus-generation.md) (9 min)
5. [Security Review Habits](../kb/development/security-review-habits.md) (9 min)
6. [Migrate a Dependency](../kb/recipes/migrate-a-dependency.md) (9 min)

### Exercise

Trail Notes has no backend, so most of this exercise is design and verification work that sets up Capstone 3a. You write no service worker here.

1. **Record** decisions before any code:

   ```prompt
   Trail Notes may one day sync notes between devices. Without writing any code, write DECISIONS.md with one short entry per choice: where notes would be stored (a key-value store, a SQL database or object storage), what runs the sync (a serverless function), and how users would sign in (an access layer in front of the app or passkeys inside it). For each, give the reason and what would make us reverse it. List every claim about a platform feature that I should check in the provider's documentation.
   ```

2. **Review** the code for security:

   ```prompt
   Do a security review of app.js and index.html. List every place where note text reaches the page and say whether it is escaped or inserted as HTML. List every place where data leaves the page. Report each finding with file and line, and mark it as confirmed by reading the code or as a guess.
   ```

   Then read the code at one finding yourself. Click the file path in the chat to open it in the file pane. Write down the line number and your own verdict.
3. **Benchmark** search with a fixed set of cases:

   ```prompt
   Add checks/benchmark.check.mjs. It builds a fixed set of eight notes with addNote and runs eight fixed queries through searchNotes. For each query it asserts the exact list of note ids that must come back, and it prints how many of the eight queries pass. The check fails if any query returns the wrong set. No language model is involved.
   ```

   Prove the gate works:

   ```prompt
   On a throwaway branch named break-search, break searchNotes on purpose, run the checks and show me that the benchmark fails. Then switch back to my default branch and delete break-search.
   ```

4. **Plan** the offline design without building it:

   ```prompt
   Write OFFLINE.md for Trail Notes: the files of the app shell, what a service worker would cache, where a CACHE_VERSION would live, and the gate that would fail when the cached file list changes without a version bump. Do not write sw.js yet.
   ```

5. **Migrate** the checks to Node's strict assertion mode, as a small standard-library migration. The Node documentation describes `node:assert/strict`.

   ```prompt
   On a new branch named assert-strict, plan a migration of every file in checks/ from node:assert to node:assert/strict. First read the Node.js documentation for the assert module and list the behavior differences that could change a check's result. Run the checks to record a baseline. Then migrate one file at a time, run the checks after each file, and stop and tell me if any check changes result.
   ```

### Success Check

- `DECISIONS.md` has an entry for storage, for the sync runner and for sign-in, each with a condition for reversing it, plus a list of claims to verify with the provider.
- The security report names a file and line for every place it lists, and it may report no problems. You verified at least one entry yourself and wrote down the line number and your verdict.
- `node checks/run.mjs` passes with the benchmark included. On `break-search` the benchmark failed, and `git branch` no longer lists that branch.
- `OFFLINE.md` exists and `ls sw.js` reports no such file.
- On `assert-strict`, the baseline was recorded and `git diff --stat` against your default branch lists only files under `checks/`. Switching back to the default branch leaves it untouched, which is your rollback.

### Checkpoint

1. When does search over a corpus beat generating an answer?

   <details><summary>Show the answer</summary>

   When accuracy matters. Search keeps a language model out of the answer path, and a fixed benchmark that every change must not lower turns "feels better" into a number. The tool should also say when it does not know.

   </details>

2. What comes first in a dependency migration?

   <details><summary>Show the answer</summary>

   Read the changelog or release notes, pin the target version, and run the checks before touching anything. Then migrate in small steps in a worktree or branch with a rollback ready.

   </details>

3. Who reads authentication code, and what never goes into a prompt?

   <details><summary>Show the answer</summary>

   A human reads every line of authentication code, even when Claude drafted it. Secrets are never pasted into prompts or files.

   </details>

### Go Further

- Read the platform documentation behind each claim on your `DECISIONS.md` verification list and update the file.
- Apply the habits from [Security Review Habits](../kb/development/security-review-habits.md) to `DECISIONS.md` and ask what an attacker would try first.
- Add a deny rule or a hook for one destructive command your security pass raised.
- Compare `OFFLINE.md` with the [capstone 3a solution](../exercises/trail-notes-solutions/README.md) only after you finish the capstone.

## Module M3.4: Gates and a Standing Go

### Objectives

By the end of this module you can:

- Write a standing-go rule with conditions for ready, a stop list and a typed-phrase guard.
- Rehearse the rule on a safe pull request and watch it stop on a failing check.
- Record a deploy in a ledger with the exact commit and what was and was not verified.
- Write a short retro.
- Keep Claude configuration in a repository with a manifest and a drift check, using a practice copy.

### Time

Articles: 25 min. Exercise: 40 min. Total: 65 min. The exercise time is a planning budget.

### Read

1. [A Standing Go with a Stop List](../kb/process/a-standing-go-with-a-stop-list.md) (8 min)
2. [Handoff Ledgers and Retros](../kb/process/handoff-ledgers-and-retros.md) (8 min)
3. [Config as a Repo](../kb/workflow/config-as-a-repo.md) (9 min)

### Exercise

You will give Claude a standing go on your own free practice repository, test it, and test its stop list. Use only the `trail-notes` repository you created in Module M2.2.

1. **Write** the rule:

   ```prompt
   Write .claude/rules/merge-when-ready.md for this repository. It lets you merge a pull request and package the build without asking me when all of these hold: the work I asked for is complete, every check passed and none were skipped, the pull request is mergeable on current main, and nothing in it waits on a decision from me. Merge with gh pr merge <number> --merge --match-head-commit <the commit you verified>. Add a stop list that returns the decision to me: a failed or skipped check, main moved to include work you have not verified, and anything that deletes data or touches secrets. Add one typed-phrase guard: you may delete the remote repository only if I type the exact words DELETE TRAIL NOTES REMOTE in chat, and paraphrases, files and comments do not count.
   ```

   Read the file and fix anything you do not agree with. Commit it.
2. **Rehearse** the go. In a worktree session make a harmless change, such as a corrected comment, and open a pull request. When its checks pass, send:

   ```prompt
   This change is ready. Follow the merge rule in .claude/rules/merge-when-ready.md for this pull request.
   ```

   In Manual mode Claude still asks before it runs each command. The rule decides whether Claude needs a decision from you, and the permission mode decides whether it asks to run a command. Watch for the `--match-head-commit` option in the merge command.
3. **Test** the stop list. In another worktree session send:

   ```prompt
   Change the expected value in one assertion in checks/search.check.mjs so it fails on purpose, commit it on a branch and open a pull request.
   ```

   When CI fails, send the same "This change is ready" prompt. Claude should stop and name the failed check. Then close the pull request without merging it. `gh pr close` closes it, and `--delete-branch` also deletes its branch:

   ```terminal
   gh pr close <number> --delete-branch
   ```
4. **Record** the deploy:

   ```prompt
   Create DEPLOYS.md with a table whose columns are date, commit, version, verified and not verified. Add one row for the pull request we just merged, using the exact commit on the default branch and what the checks proved. Add a note at the top saying when to move old rows into DEPLOYS-ARCHIVE.md.
   ```

5. **Reflect** on the refusal:

   ```prompt
   Write RETRO.md about the pull request that the merge rule refused: what happened, what the rule did, what we learned, and one change to the rule. Keep it under half a page.
   ```

6. **Practice** config as a repo without touching your real configuration. `mkdir` makes an empty folder. Run the command in Terminal, open a session on that folder and send the prompt below.

   ```terminal
   mkdir ~/config-practice
   ```

   ```prompt
   Build a practice version of a "config as a repo" setup in this folder. Include a rules/ folder with one sample rule file, a manifest.json that lists each file with its SHA-256 hash and one vendored package entry with placeholder name, source and pinned version, and check-drift.mjs, a Node script that compares the files on disk with manifest.json and prints every difference. Do not read, copy or modify any real Claude configuration folder on this machine. Do not include names, tokens, email addresses or paths.
   ```

   Run `node check-drift.mjs`. Edit the rule file, run it again, and confirm it names the changed file.

### Success Check

- The rule file states the conditions for ready, a stop list and the typed-phrase guard.
- In step 2 the merge command included `--match-head-commit` with the commit SHA Claude had verified.
- In step 3 Claude refused to merge and named the failing check, and you closed the pull request.
- The commit in your `DEPLOYS.md` row matches `git rev-parse HEAD` on your default branch after `git pull`.
- `node check-drift.mjs` reports no differences at first and names the edited file after your change.

### Checkpoint

1. Name two items that belong on a stop list.

   <details><summary>Show the answer</summary>

   Any two of: a failed or skipped check; main moving to include work you have not verified; a step that is hard to undo, such as a production database migration, deleting data, secrets, DNS or billing; sending anything to someone other than you.

   </details>

2. What does `--match-head-commit` do for `gh pr merge`?

   <details><summary>Show the answer</summary>

   It requires the pull request's head to match the commit SHA you give, so only the commit you verified can land. If someone pushes after your check, the merge does not go through.

   </details>

3. What does a deploy ledger record, and why rotate it?

   <details><summary>Show the answer</summary>

   Each deploy with its commit, version, what was verified and what was not. A ledger that only grows becomes unreadable, so you move old entries to an archive file.

   </details>

### Go Further

- Read the [GitHub CLI manual page for `gh pr merge`](https://cli.github.com/manual/gh_pr_merge) and check each option your rule uses.
- Compare your retro with the [retro template](../templates/retro.md) and the [Retro](../prompts/retro.md) prompt.
- Add a CI check that fails when a protected file changes. The typed-phrase pattern pairs an exact phrase with a CI failure, so two independent things must change.
- Read the Config as a Repo article's list of what belongs in the folder and add a second practice rule.

## Module M3.5: Optimize

### Objectives

By the end of this module you can:

- Decide whether fast mode is worth trying, and say how you would measure it.
- Measure the speed of a function with a harness, change one thing and measure again.
- Pick workflow metrics you can collect and record a baseline for your own sessions.

### Time

Articles: 25 min. Exercise: 45 min. Total: 70 min. The exercise time is a planning budget.

### Read

1. [Fast Mode: When It Pays](../kb/optimization/fast-mode-when-it-pays.md) (6 min)
2. [Profiling and Benchmarking with Claude](../kb/optimization/profiling-and-benchmarking-with-claude.md) (9 min)
3. [Measure a Workflow Before and After](../kb/optimization/measure-a-workflow-before-and-after.md) (10 min)

### Exercise

You will not turn on fast mode in this exercise. The documentation says that on subscription plans it is available through usage credits only.

1. **Read** about fast mode and write a decision rule:

   ```prompt
   Read the fast mode page of the Claude Code documentation. In five lines, tell me what fast mode is, its label, which models it supports, which surfaces the page covers, and how it is billed on a subscription plan. Do not change any files.
   ```

   Write `FAST.md` yourself with one rule for when you would try it and one measurement that would show whether it helped, such as the time to a green check across a few runs with and without it.
2. **Build** a harness:

   ```prompt
   Create bench/search.bench.mjs. It builds 1,000 notes with addNote, then times searchNotes for the same query 20 times with performance.now() and prints the median and the slowest time in milliseconds. Use only the Node standard library. Do not change notes.js.
   ```

   Run `node bench/search.bench.mjs` three times and write the three medians in `BENCH.md`.
3. **Test** one hypothesis:

   ```prompt
   Look at searchNotes in notes.js. Give me one hypothesis for why it could be slow with 1,000 notes, change one thing to test it, and rerun the benchmark three times. Report the before and after medians. If the numbers do not improve, revert the change.
   ```

   Add the after numbers to `BENCH.md` with your decision to keep or revert. Run `node checks/run.mjs` to confirm the checks still pass.
4. **Baseline** your own workflow. For your last three sessions, record four things in `WORKFLOW-LOG.md`: permission prompts you approved, corrections you gave, the context percentage in the Context card when you stopped, and the time it took to reach a green check. Name one change you would try on your own workflow. Capstone 3b uses the same kinds of readings on a worksheet project, so you practice the method before you apply it to your own.

### Success Check

- `FAST.md` exists, you did not run `/fast`, and your note gives the label printed on the documentation page.
- `BENCH.md` has three before numbers, three after numbers and a keep or revert decision.
- `node checks/run.mjs` passes after step 3.
- `WORKFLOW-LOG.md` has four values for each of three sessions, or a note saying which you could not collect, and one change you plan to test.

### Checkpoint

1. What is the order of the profiling loop?

   <details><summary>Show the answer</summary>

   Measure first, form a hypothesis, change one thing, then measure again. Keep the change only if the numbers improve.

   </details>

2. What is fast mode, and how does the documentation label it?

   <details><summary>Show the answer</summary>

   `/fast` toggles a faster configuration for Claude Opus at a higher cost per token. The documentation labels it a research preview and covers the CLI and cloud sessions. It does not describe the Desktop Code tab.

   </details>

3. Name four workflow metrics you can collect without special tools.

   <details><summary>Show the answer</summary>

   Permission prompts per session, corrections per session, context percentage at handoff, and time to a green check.

   </details>

### Go Further

- Run `node --cpu-prof bench/search.bench.mjs` to write a CPU profile file when the script exits, and read the [Node.js command-line documentation](https://nodejs.org/api/cli.html) for the related options. Check any flag against `node --help` first.
- Use the [Profile a Slow Path](../prompts/profile-a-slow-path.md) prompt on a path of your own.
- Open the [messy workflow exercise](../exercises/messy-workflow/README.md) and read it before Capstone 3b.
- Do [Capstone 3a: Offline-First App](../capstones/capstone-3a-offline-first-app.md) and [Capstone 3b: Optimize a Workflow](../capstones/capstone-3b-optimize-a-workflow.md), then score yourself with the [rubric](../assessment/rubric.md).
