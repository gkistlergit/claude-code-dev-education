---
title: Handoff Ledgers and Retros
id: R08
area: process
level: 3
time: 8
tags: [handoff, retro, ledger]
verified: 2026-10-23
status: verified
sources:
  - https://code.claude.com/docs/en/best-practices
  - https://code.claude.com/docs/en/commands
related: [W09, O02, R07, R06]
---

A ledger is one file that records every deploy: the commit, the version, what was verified and what was not. Keep it short enough to read, rotate it before it turns into a wall of text, and write a short retro after an incident so the lesson becomes a check or a rule.

## When to Use It

Use a ledger once you deploy more than occasionally, or once more than one session works on a project. The test is simple: if you ever have to dig to answer "what is live right now, and what did we check?", you need one.

A ledger is different from a handoff note. The ledger records what shipped. A handoff note carries unfinished work from one session to the next ([Handoffs Between Sessions and Devices](../workflow/handoffs-between-sessions-and-devices.md)).

## Steps

1. **Create** `LEDGER.md` at the repository root with a header and one entry format. Put the newest entry first.

    ```md
    # Deploy ledger

    Newest first. Older entries live in docs/ledger/.

    ## <date>, <short hash>, <version>
    - Commit: <full commit hash, copied from the deploy log>
    - Pull request: #<number>
    - What shipped: one sentence
    - Verified: the commands and checks that passed, and where you saw them
    - Not verified: what you did not check, written out
    - Rollback: the commit or version to return to
    ```

2. **Ask** Claude to add the entry after each deploy, taking the commit and version from the deploy log.

    ```prompt
    Read the deploy log for the commit we just shipped. Add an entry to LEDGER.md using the format at the top of that file. Copy the commit and version from the log. Under "Not verified" list anything we did not check, and do not write "nothing" unless that is true.
    ```

3. **Rotate** the ledger before it becomes unreadable. It only grows, because every deploy adds lines and nobody deletes history. The author's ledgers are long, and that length is their main problem. Decide what size you can read in one sitting, write it in the header, and when the file passes it, move older entries into `docs/ledger/` files by month.

    ```prompt
    LEDGER.md is too long. Move every entry except the newest five into docs/ledger/<year>-<month>.md files, grouped by month. Keep the header and the entry format. Do not change the wording of any entry. Show me the diff stat when you finish.
    ```

4. **Write** a handoff note when a session gets long or work stops half-done. Use the [handoff template](../../templates/handoff.md) and the [handoff-note prompt](../../prompts/handoff-note.md), then start a fresh session from the note. In the author's setup this replaces compaction: a handoff skill was used 86 times and `/compact` once, a hook warns at 70% and 90% of the context window and points to the handoff skill, and a rule says only the human starts a handoff. A note you wrote is easier to trust than an automatic summary. See [Clear, Compact and Hand Off](../optimization/clear-compact-and-hand-off.md).
5. **Run** a retro after an incident, while the details are fresh. Keep it to one page with five parts: what happened, a timeline with commit hashes, what the checks missed, one change to make, and who makes it. The [retro template](../../templates/retro.md) and [retro prompt](../../prompts/retro.md) give you a layout.
6. **Turn** the retro's one change into something that runs: a new check, a line in a rules file, or a hook. A gate worth having is one that has caught you at least once, and an incident is the catch. See [Definition of Done and Gates](definition-of-done-and-gates.md).

## Worked Example

The tags feature for Trail Notes is deployed. The ledger entry:

```md
## 2026-10-22, a1b2c3d, tags
- Commit: a1b2c3d4e5f6a7b8c9d0a1b2c3d4e5f6a7b8c9d0
- Pull request: #12
- What shipped: notes can carry tags, and the list can be filtered by tag
- Verified: `node checks/run.mjs` passed in CI for this commit; I read the deploy log and it names this commit
- Not verified: the page on a phone; the filter with more than a few notes
- Rollback: the commit before this one, 9f8e7d6
```

The hashes above are placeholders. Now a made-up incident. The deploy added a file to the service worker's cached file list, but nobody bumped `CACHE_VERSION`, and a returning visitor still saw the old page. The retro:

```md
## What happened
After the tags deploy, a returning visitor still saw the old page.

## Timeline
- a1b2c3d merged and deployed.
- A visitor report arrived; I reproduced it with the cached copy.
- e4f5a6b bumped CACHE_VERSION and redeployed.

## What the checks missed
Nothing compared the cached file list with the cache version.

## One change
Add a check that fails when the cached file list changes and CACHE_VERSION does not. (This is the check capstone 3a builds.)

## Owner
Me, in the next pull request.
```

The change is a check, so the next missed bump fails in CI before it ships.

## Pitfalls

- Writing "tested" in Verified without saying what ran. Name the command.
- Leaving "Not verified" empty or writing "nothing" by habit. An honest list is the reason the file exists.
- Filling the ledger from memory. A wrong commit hash gives you a wrong rollback.
- Never rotating. The first time you skim past an entry because the file is long, it has stopped working.
- Retros that end in "be more careful". A retro is finished when it names a change you can check.
- Handing the decision to start a handoff to a hook or a loop. The hook can warn, and a person decides.

## Checkpoint

Why must the ledger's commit hash come from the deploy log?

<details><summary>Show the answer</summary>

The log records the commit the deploy actually shipped. Your memory of the merge can be wrong, and a rollback depends on the exact commit.

</details>
