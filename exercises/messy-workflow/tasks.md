---
title: Standard Tasks for the Messy Workflow Exercise
kind: exercise
order: 4
verified: 2026-10-23
---

These are the three tasks you run before and after each change in the [messy workflow worksheet](README.md). Paste each prompt exactly as written. If you reword a prompt between runs, you are measuring your wording and not your setup.

## Before Each Run

- Start from a fresh copy of the base folder named in the task, as the worksheet describes.
- Open the copy as the project folder and start a new session.
- Keep the model, effort level and permission mode the same for every run, and write them on your sheet.
- Start the stopwatch when you send the prompt.

## Task 1: Fix the Search Bug

Start from `trail-notes-base-a`, the starter with the seeded bug.

```prompt
Run node checks/run.mjs. One check file fails. Find the cause, fix it with the smallest change that makes it pass, and run the checks again. Do not edit any file in checks/.
```

Done when the last line of the runner output ends in `0 failed`.

Expected files changed: `notes.js` only.

What it exercises: reading a failing check, finding a shared helper, and making a small fix without touching the checks. If a rule in `CLAUDE.md` makes Claude stop or ask, that counts toward your numbers. Do not edit the file during the run to get around it.

## Task 2: Add updateNote

Start from `trail-notes-base-b`, a copy where every check already passes.

```prompt
Add a function updateNote(notes, id, changes) to notes.js. The changes object can hold a title, a body, or both. It returns a new array and does not modify the one it was given. The updated note keeps its id and createdAt. Title and body are trimmed the same way addNote trims them. A blank title is ignored and the old title stays. An id that does not exist returns the notes unchanged. Write the checks first in checks/update.check.mjs, run them to see them fail, then write the code that makes them pass. Do not change the existing checks.
```

Done when the last line of the runner output ends in `0 failed` and `checks/update.check.mjs` has a check for each rule in the prompt: title only, body only, both, blank title, unknown id, and the original array left alone.

Expected files changed: `notes.js`, and the new `checks/update.check.mjs`.

What it exercises: test-first work, following a convention that already exists in the code (how `addNote` trims), and leaving existing checks alone.

## Task 3: Add an Export Button

Start from `trail-notes-base-b`.

```prompt
Add an Export button to Trail Notes. In notes.js add exportNotes(notes), which returns a JSON string of the notes sorted newest first, indented with 2 spaces. In index.html add a button labeled "Export notes" next to the search box. In app.js make the button download that string as a file named trail-notes.json. Write the check for exportNotes first in checks/export.check.mjs and run it to see it fail before you write the code. Keep the page accessible: the button needs a visible text label and must work with the keyboard. Do not change the existing checks.
```

Done when the last line of the runner output ends in `0 failed`, `checks/export.check.mjs` exists, and the button downloads a file when you click it in the browser. The runner cannot test the click, so do that part yourself.

Expected files changed: `notes.js`, `app.js`, `index.html`, the new `checks/export.check.mjs`, and possibly `style.css`.

What it exercises: reading several files to see how the page is wired, putting the logic in the pure module and the browser code in the page file, and a change that needs a manual check.

## Score Each Run

A run passes the quality gate only if all of these are true:

1. You ran `node checks/run.mjs` yourself and the last line ends in `0 failed`.
2. The check files that were in the base folder are unchanged.
3. Only the expected files changed. A `.claude/` folder does not count, because Claude Code saves permission rules there.
4. `package.json` is unchanged, so no dependency was added.
5. For task 3, the download worked in your browser.

> **Terminal tip**
> `diff -rq` compares two folders and lists only the files that differ or exist on one side. Run it against the base folder to see what a run changed.
>
> ```terminal
> diff -rq ~/trail-notes-base-b ~/trail-notes-run-2
> ```

A run that goes fast and fails the gate scores as a failure. Record `no` in the Quality gate column and say why in Notes.
