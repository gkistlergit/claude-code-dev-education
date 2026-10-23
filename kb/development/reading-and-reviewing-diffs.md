---
title: Reading and Reviewing Diffs
id: D03
area: development
level: 1
time: 6
tags: [diff, review]
verified: 2026-10-23
status: verified
sources:
  - https://code.claude.com/docs/en/desktop
  - https://code.claude.com/docs/en/permission-modes
related: [A06, D08, D04, DG01]
---

The Changes pane shows what Claude changed, file by file. Read it before you commit, in a fixed order, and leave comments on lines to send Claude back for another pass.

## When to Use It

Review the diff after any session in which Claude edited files, and before you commit or open a pull request. The desktop docs describe the diff view as the place to review modifications file by file before creating a pull request. A few minutes here catches the changes you did not ask for.

## Steps

1. **Click** the line counts, such as `+12 -1`, in the **Changes** card of the session details panel. You can also click **Changes** in the session's title bar, or press **Cmd+Shift+D** to toggle the diff pane.
2. **Read** the list of changed files before any code. Count them. A one-line request that touched six files deserves a question.
3. **Open** the test files first. Tests state what the change is meant to do, and they show whether the bar moved.
4. **Read** the smallest files next. Manifests and one-line edits are quick to read and easy to skip by mistake.
5. **Read** the logic last, with the tests and the small files in mind.
6. **Click** any line to open a comment box, type your feedback and press **Enter** to add it. After you comment on several lines, press **Cmd+Enter** to submit all the comments at once. Claude reads them, makes the changes and shows a new diff.
7. **Run** the project's checks in the **Terminal** pane. Click **Terminal** in the session's title bar to open it. It starts in the session's working directory and shares Claude's environment, so `node checks/run.mjs` sees the same files Claude edited.

Look for these in every diff:

- Unrequested changes: files or functions outside the request, renamed names and sweeping reformatting.
- Deleted or weakened tests: removed assertions, loosened expected values, or a check edited in the same change that fixes the code.
- New dependencies: entries added to `package.json`, or new imports and script tags that load code from elsewhere.

> **Terminal tip**
> `git status` lists changed files, including new files git does not track yet. `git diff` shows the unstaged changes in tracked files. Neither changes anything; they only print.
>
> ```terminal
> git status
> git diff
> ```

## Worked Example

You asked Claude to make Trail Notes search ignore case, as in [Debugging with Claude](./debugging-with-claude.md). Open the Changes pane and compare what you see with the request.

| You see | What it means | What to do |
|---|---|---|
| Only `notes.js` changed, inside `searchNotes` | Matches the request | Run the checks, then commit |
| `sortNotes` also changed | An unrequested change | Comment on the lines and ask for a revert |
| `checks/search.check.mjs` changed | The check may have been bent to pass | Read each new assertion and ask why it changed |
| `package.json` gained a dependency | Trail Notes has none | Reject it and ask for plain JavaScript |

To push back on the `sortNotes` edit, click the changed line and type a comment:

```text
Revert this. Only searchNotes should change for this request.
```

Add similar comments elsewhere, press **Cmd+Enter**, and check the new diff. Then run `node checks/run.mjs` in the Terminal pane.

## Pitfalls

- Reading Claude's summary of the change instead of the change.
- Reading files in list order. When you are tired, the long file wins your attention and the one-line manifest edit slips past.
- Comments such as "fix this". Say what the line should do.
- Approving every edit inline until you click without reading. The permission modes page suggests Accept edits mode when you would rather review after the fact. See [Which Permission Mode](../decision-guides/which-permission-mode.md).
- Treating a clean-looking diff as proof. The diff shows what changed, not whether it works, so run the checks.

For a second opinion on a diff, see [Code Review, Yours and Claude's](./code-review-yours-and-claudes.md). If a diff is wrong beyond repair, see [Undo and Recover](./undo-and-recover.md). The other panes are covered in [The Panes](../app/the-panes.md).

## Checkpoint

A one-line bug fix changes four files, and one of them is a check file. What do you open first?

<details><summary>Show the answer</summary>
The check file. See whether assertions were removed or loosened, because a bent check can make broken code pass. Then comment on the unrelated files and ask Claude to explain each change it cannot tie to the request.
</details>
