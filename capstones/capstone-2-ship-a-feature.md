---
title: Capstone 2: Ship a Feature
kind: capstone
level: 2
order: 3
time: 150
verified: 2026-10-22
sources:
  - https://code.claude.com/docs/en/desktop
  - https://code.claude.com/docs/en/worktrees
  - https://code.claude.com/docs/en/best-practices
---

This capstone adds tags to Trail Notes through the whole process: spec, worktree and branch, a failing check, the change, review, pull request, CI and merge. The recipe behind it is [Ship a Feature End to End](../kb/recipes/ship-a-feature-end-to-end.md). The evidence you save counts toward the Development, App Development and Process scores in the [rubric](../assessment/rubric.md).

## Goal

Ship a tags feature in which a note can carry tags and the list can be filtered by one tag, with the logic in `notes.js` as pure functions: `addNote` accepts tags, and `filterByTag(notes, tag)` returns the notes that carry that tag. The change must reach your default branch through a pull request whose CI passed.

## Setup

- Your `trail-notes` folder after Capstone 1, with the search fix committed and pushed to a free personal GitHub repository.
- The `.github/workflows/checks.yml` workflow from Module M2.2 on the default branch. If you do not have it, finish that module first.
- `SPEC.md`, `GLOSSARY.md` and `TICKETS.md` from Module M2.1. If you skipped it, do that module's exercise first.
- If you skipped Capstone 1, copy `capstone-1/` from the [Trail Notes solutions](../exercises/trail-notes-solutions/README.md) into a new folder, run `git init`, make a first commit and publish it as Module M2.2 describes.
- The GitHub CLI signed in to your personal account. `gh auth status` shows which account is active.

## Tasks

1. Reread `SPEC.md` and `TICKETS.md`. Confirm that the spec states the two function names above and a verification step that runs `node checks/run.mjs`. Fix anything unclear before you start. Choose the order of the tickets and note which could run in parallel.
2. Start a session with Worktree on, in Manual mode. Name the branch for the change, such as `add-tags`.
3. Write the failing check first.

   ```prompt
   Read SPEC.md. Add checks/tags.check.mjs for the tags behavior in notes.js: addNote accepts tags, and filterByTag(notes, tag) returns the notes that carry that tag. Run node checks/run.mjs and show me that the new check fails for the right reason. Do not change notes.js yet.
   ```

4. Make the smallest change that passes.

   ```prompt
   Make the smallest change in notes.js that makes the new check pass without breaking any other check. Do not edit any existing check. Run node checks/run.mjs and show me the result.
   ```

5. Wire the feature into the page.

   ```prompt
   Wire tags into the app. Let me enter tags when I add a note, show each note's tags, and add a control that filters the list by one tag. Keep the logic in notes.js and the page code in app.js. Preview the app in the Browser pane and show me a screenshot of a filtered list.
   ```

6. Review the work three ways. Read the diff in the Changes pane in order: tests first, then the smallest files, then the logic. Run `/code-review`. Then ask for an independent read:

   ```prompt
   Use a subagent to review this branch against SPEC.md. It has not seen our conversation. Report only gaps that affect correctness or the spec's stated behavior, and name any change outside the spec.
   ```

   Record a decision and a reason for each finding.
7. Open the pull request.

   ```prompt
   Commit this, push the branch and open a pull request. In the body, summarize the change, link SPEC.md, say what you verified and name the commands you ran, and say what you did not verify.
   ```

8. Watch the CI check in the Changes card or with `gh pr checks`. Merge only after it passes, using Merge when ready from the pull request menu or `gh pr merge <number> --merge`.
9. Clean up. In your main folder run `git pull`, `git worktree list`, then `git worktree remove <path>` and `git branch -d <branch>` for the merged branch.
10. Compare your `notes.js` and your check with the reference in the folder `capstone-2/` of the [Trail Notes solutions](../exercises/trail-notes-solutions/README.md). Write down each difference and decide whether yours or the reference is better, and why.

## Success Criteria

- [ ] `SPEC.md`, `GLOSSARY.md` and `TICKETS.md` exist, and each ticket names its blockers or says it has none.
- [ ] The work happened in a worktree on a branch with a descriptive name.
- [ ] You saw the new check fail before the change, and the transcript or the commit order shows it.
- [ ] `addNote` accepts tags, `filterByTag(notes, tag)` exists in `notes.js`, and `node checks/run.mjs` passes with the new check included.
- [ ] No existing file under `checks/` was modified.
- [ ] In the Browser pane you can add a note with a tag and filter the list by that tag.
- [ ] Each `/code-review` finding and each subagent finding has a recorded decision with a reason.
- [ ] The pull request body says what was verified and what was not, and its CI check passed before the merge.
- [ ] The pull request is merged, `git worktree list` shows only your main folder, and the branch is deleted.
- [ ] You compared your work with the capstone 2 reference and explained the differences.

## Time

150 minutes. The course sets this figure as a planning budget and has not measured it.

## Self-Review

- Which ticket took longest, and what did the spec fail to say that you had to decide while building?
- Did the failing check fail for the reason you predicted? If it failed for a different reason, what did you change?
- What did the independent subagent read catch that you and `/code-review` did not, or the reverse?
- If the pull request had arrived from someone else, would its body have given you enough to review it quickly?
- What would you leave out of the next feature's spec, and what would you add?

Save as evidence: the three planning files, the pull request link, the CI result and the merge commit. They support Development level 2, App Development level 2 and Process level 2 in the [rubric](../assessment/rubric.md). Continue with [Level 3](../learn/level-3-advanced.md).
