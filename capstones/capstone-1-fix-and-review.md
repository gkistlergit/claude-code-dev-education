---
title: Capstone 1: Fix and Review
kind: capstone
level: 1
order: 2
time: 60
verified: 2026-10-22
sources:
  - https://code.claude.com/docs/en/desktop
  - https://code.claude.com/docs/en/permission-modes
  - https://code.claude.com/docs/en/checkpointing
---

This capstone fixes the seeded search bug in Trail Notes the careful way: you form your own hypothesis, get a plan, make the smallest change, review the diff and commit. The evidence you save counts toward your Development and Process scores in the [rubric](../assessment/rubric.md).

## Goal

Make `searchNotes` match both the title and the body of a note without regard to letter case, change only `notes.js`, and show that you reviewed Claude's work before you accepted it.

## Setup

- Your `trail-notes` folder from Levels 0 and 1, a git repository with the seeded bug still in place.
- Before you begin, run `git status` and `node checks/run.mjs`. The first should report a clean working tree and the second should fail on the search check, with a last line that ends in `2 failed`. If either is not true, copy a fresh starter into a new folder, run `git init`, and make a first commit there.
- Do not open the solution until Task 9.

## Tasks

1. Run `node checks/run.mjs` in the Terminal pane and save the failing output in a note named `CAPSTONE-1.md`.
2. Read the failing check and the `searchNotes` function yourself. In `CAPSTONE-1.md`, write your own hypothesis for the failure before you ask Claude.
3. Start a session in Plan mode and ask for a diagnosis and plan.

   ```prompt
   The search check fails. Do not edit anything. Read checks/search.check.mjs and notes.js, give me three hypotheses ranked by likelihood with the evidence for each, and propose the smallest change that would fix it. Tell me which file you would touch and which check proves it.
   ```

   Compare the plan with your hypothesis and record any difference.
4. Switch to Manual mode and ask for the fix.

   ```prompt
   Fix searchNotes in notes.js so it matches title and body case-insensitively. Change only notes.js and do not edit anything in checks/. Run node checks/run.mjs when you finish and show me the result.
   ```

5. Open the Changes pane and read the diff in order: tests first, then the smallest files, then the logic. Leave at least one comment on a line, submit it with Cmd+Enter, and review Claude's response.
6. Run `/code-review`. For each finding, write one line in `CAPSTONE-1.md`: fix it, or reject it with the reason.
7. Verify the fix in the app. Ask Claude to preview the app in the Browser pane. Add a note titled `Trail map`, then search for `TRAIL`, `trail` and `MAP`. The note should stay in the list each time.
8. Commit with a message that says what changed and why. `git add .` stages every change, `git commit -m "..."` saves it, and `git show --stat HEAD` lists the files in the last commit.

   ```terminal
   cd ~/trail-notes
   git add .
   git commit -m "Make note search case-insensitive so titles and bodies match any letter case"
   git show --stat HEAD
   ```

9. Compare your fix with the reference solution in the folder `capstone-1/` of the [Trail Notes solutions](../exercises/trail-notes-solutions/README.md). `diff` compares two files and prints the lines that differ. No output means the files are identical. A different implementation can still be correct, so use the output to ask questions about your fix. Replace the second path with the solution's `notes.js` inside your copy of this repository.

   ```terminal
   diff ~/trail-notes/notes.js <path to your copy of this repository>/exercises/trail-notes-solutions/capstone-1/notes.js
   ```

## Success Criteria

- [ ] `node checks/run.mjs` passes, and its last line ends in `0 failed`.
- [ ] `git show --stat HEAD` lists `notes.js`, and it lists no file under `checks/`. It may also list `CAPSTONE-1.md`.
- [ ] In the app, `TRAIL`, `trail` and `MAP` each find a note titled `Trail map`.
- [ ] `CAPSTONE-1.md` holds your hypothesis, written before you read Claude's plan, and a note on how the plan differed.
- [ ] You left at least one line comment on the diff and Claude responded to it.
- [ ] Every `/code-review` finding has a recorded decision with a reason.
- [ ] The history shows one new commit whose message says what and why.
- [ ] You compared your `notes.js` with the solution and can explain every difference.

## Time

60 minutes. The course sets this figure as a planning budget and has not measured it.

## Self-Review

- Did the check fail before the fix for the reason you expected? Quote the failing output.
- What did you change in the diff after reading it, or what would you have changed if you had read it more slowly?
- Which `/code-review` finding did you reject, and what evidence did you use?
- If you had used Auto mode for this task, which of your checks would still have caught a bad edit?

Save as evidence: `CAPSTONE-1.md`, the commit SHA, and a note of the comment you left on the diff. They support Development level 1 and Process level 1 in the [rubric](../assessment/rubric.md). Continue with [Level 2](../learn/level-2-intermediate.md).
