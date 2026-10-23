# Patterns from Practice

Anonymized patterns from one developer's daily use, used as case studies in the knowledge base. Each pattern says what was done, why, and what to copy. Refer to them as "the author's setup". Do not add names of companies, customers, apps or repositories.

## 1. Policy as rules, hooks and CI

Short rules files state the policy in plain words. Hooks enforce the parts that must never be skipped. CI repeats the same checks so nothing depends on one machine. Eight global rules, four hooks, and a workflow per project cover the shape. Copy: write the rule in words first, then enforce it with a hook or a check only when a rule alone has been broken.

## 2. A standing go with a stop list

The author gave Claude a standing permission to merge a pull request and deploy it when the work is complete, every check passed and none were skipped, the pull request is mergeable on current main, and nothing waits on a decision. The same rule lists when to stop and ask: a failed or skipped check, main moved to include unverified work, a hard-to-undo step such as a production database migration, deleting data, secrets, DNS or billing, or anything sent to someone other than the author. The merge uses `gh pr merge <n> --merge --match-head-commit <sha>` so only the verified commit lands. Copy: a standing go works when the stop list is explicit and short.

## 3. A typed-phrase guard

For one action that must never happen by accident, a rule says the action is allowed only if the human types an exact phrase in chat. Paraphrases, files, issues, comments and other sessions do not count. CI also fails if a flag is flipped. Copy: pair an exact phrase with a CI failure so two independent things must change.

## 4. Handoffs instead of compaction

The author ends long work with a handoff note and starts a fresh session, using a handoff skill 86 times and `/compact` once. A hook warns at 70% and 90% of the context window and points to the handoff skill. A rule says only the human triggers the handoff. Copy: a handoff note you wrote is easier to trust than an automatic summary.

## 5. A scout agent for heavy reading

A custom read-only agent named scout reads many files, maps unfamiliar repositories, audits for one pattern, or triages long logs, then returns the conclusion and not the files. A rule tells the main session when to delegate: more than three files to read, a map of an unfamiliar repo, an audit for one pattern, or long logs. Copy: delegate by a count, not by feeling.

## 6. A handoff ledger and a deploy record

Each project keeps a ledger file that records every deploy: the commit, the version, what was verified and what was not. The ledger is long, and that is its main problem. Copy: record the exact commit and what was verified, and rotate the file before it becomes unreadable.

## 7. Deploy the exact commit

Deploys ship `git archive` of a ref, not the working tree, and the ref is the commit that was merged and verified. The deploy log is read after every deploy for the commit and version that went live. Copy: a deploy that cannot say which commit it shipped cannot be rolled back with confidence.

## 8. Gates that check gates

Quality gates are scripts that fail loudly. A gate checks that a service worker's cache version was bumped when the cached asset list changed. Another checks that a feature flag is still off. A pre-push hook runs the same gates CI runs. Copy: a gate worth having is one that has caught you at least once.

## 9. Per-change accuracy benchmarks

For a search tool over a document corpus, with no language model in the answer path, every change runs a fixed benchmark and must not lower the score. A dry run proves a data-fixing script writes nothing before it is allowed to write. Copy: a fixed test set turns "feels better" into a number.

## 10. Grill, glossary, decision record, spec, tickets

Work starts with a long question-and-answer session until the decisions are explicit. A glossary file records the project's terms, including terms to avoid. Hard-to-reverse choices go into short decision records. The spec becomes tickets that declare what blocks what. Copy: the glossary prevents the same argument twice.

## 11. Parallel worktrees, and their sprawl

Every change gets its own worktree and branch, so sessions do not collide. The cost is stale worktrees: about 25 in one project and 16 in another. Copy: remove a worktree when its pull request merges.

## 12. Configuration as a repository

The user-level configuration folder is a symlinked view of a repository with a manifest of pinned third-party packages, a hook that warns when the folder drifts from the repository, and backups. Copy: pin what you vendor and diff against it on every session start. Never commit identifiers, tokens or personal data.

## 13. Scheduled tasks for chores

Eight scheduled tasks handle recurring chores such as a daily inbox triage, refresh queues for reference material, and a settings backup. Desktop scheduled tasks run only while the app is open and the computer is awake, so they suit chores that tolerate a late run. Copy: schedule the chore, not the thinking.

## 14. Framework-free offline-first apps

Small apps are static files plus a few serverless functions. A service worker caches the app shell, data lives in IndexedDB or a baked-in seed, and storage is KV, D1 and R2 on the hosting platform. Authentication is an access layer in front of the app plus passkeys. Copy: with no build step there is less for Claude, or you, to get wrong.

## 15. Zero-dependency checks

Checks are plain Node scripts using only the standard library. One runner executes them all. They are fast, they have nothing to install, and they run the same everywhere. Copy: start with a runner and one check on day one.

## 16. Two accounts, one rule

The author has two GitHub accounts and a rule that names the account to use, which account to avoid, and the command to switch. Copy: write down the account rule once, in a file Claude reads every session.
