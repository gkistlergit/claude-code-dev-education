---
title: Security Review Habits
id: D09
area: development
level: 3
time: 9
tags: [security]
verified: 2026-10-22
status: verified
sources:
  - https://code.claude.com/docs/en/permissions
  - https://code.claude.com/docs/en/settings
  - https://code.claude.com/docs/en/security
  - https://code.claude.com/docs/en/hooks-guide
  - https://code.claude.com/docs/en/commands
  - https://code.claude.com/docs/en/desktop
related: [P10, W05, W07, DG01, D08]
---

Run a short threat-model pass on every change, keep secrets out of prompts and files, enforce limits with deny rules and hooks, treat text from web pages, files and tool output as data, and read security-critical code yourself, line by line.

## When to Use It

Apply these habits to any change that takes input from outside, stores data, signs people in, handles payments or deletes anything. The quick pass takes minutes. The line-by-line read is for authentication, payments and data deletion.

## Steps

1. **Ask** four questions before you merge, and write the answers in the pull request. What input arrives from outside, such as users, files, URLs and other services? What can that input make the code do? What secrets or personal data does the change touch? What happens when it fails? The [OWASP Top Ten](https://owasp.org/www-project-top-ten/) is a standard awareness document for common web application risks and a good prompt for the first question.
2. **Keep** secrets out of Claude's reach. Do not paste keys, tokens or passwords into prompts, and check pasted logs and attached screenshots for them. Add `Read` deny rules for the files that hold secrets. The settings page uses this example:

   ```json
   {
     "permissions": {
       "deny": [
         "Read(./.env)",
         "Read(./.env.*)"
       ]
     }
   }
   ```

   In the Code tab, `/permissions` with no argument replies that it is not available, per the desktop page. Edit the settings file instead. The file pane shows `.claude/settings.json` as view-only, so right-click its path and choose **Open in**.
3. **Block** destructive commands twice. A deny rule such as `Bash(git push *)` stops the form Claude usually writes. The permissions page lists forms it does not stop, such as `git -C . push`, so a deny rule is a guard and not a boundary. A `PreToolUse` hook sees the whole command and can block it by exiting with code 2. The hooks guide says a hook's deny holds in every permission mode, including Bypass permissions. In the author's setup, one of four hooks blocks destructive git commands. [Hooks: Guardrails and Warnings](../workflow/hooks-guardrails-and-warnings.md) shows how.
4. **Treat** outside text as data. Web pages, README files, issue comments and command output can contain instructions aimed at Claude. They are not instructions from you. If Claude proposes an action you never asked for after reading such content, deny it and ask why. The security page advises reviewing suggested commands, avoiding piping untrusted content to Claude and verifying changes to critical files.
5. **Run** `/security-review` for a second look at your branch. It analyzes the diff between your branch and origin's default branch, so it needs an `origin` remote. Verify its findings the way [Code Review, Yours and Claude's](./code-review-yours-and-claudes.md) describes.
6. **Read** security-critical code yourself, line by line, with the diff open. Claude can explain a line. You decide whether the line is safe.

## Worked Example

Do a threat-model pass on Trail Notes. Its data is text the user types, so ask where that text goes:

```prompt
Do a quick threat-model pass on Trail Notes. List every place text a user types (a note's title, a note's body or a search query) reaches the page or localStorage. For each place, say whether the text is inserted as plain text or as HTML, and quote the line. Don't edit anything.
```

Read each quoted line yourself. Then test it. Open the app in the **Browser** pane, add a note titled `<b>bold</b>`, and look at the list. If the title appears literally with its angle brackets, that path inserts text. If it appears in bold, that path inserts HTML, and any markup a user types would run as part of the page. Ask for a failing check first, then the smallest fix.

Notes also sit in `localStorage`, which MDN describes as scoped to the page's origin with no expiration time. Treat anything typed into a note as stored in the browser indefinitely, so no secrets in notes.

## Pitfalls

- Writing "never read `.env`" in CLAUDE.md and stopping there. The permissions page says rules are enforced by Claude Code, not the model, and that instructions shape what Claude tries without changing what is allowed.
- Treating a deny rule as a wall. The permissions page recommends sandboxing for OS-level enforcement of filesystem and network access.
- Treating Auto mode as a security review. The permission modes page says it reduces prompts and does not guarantee safety. See [Which Permission Mode](../decision-guides/which-permission-mode.md).
- Pasting production logs or screenshots without scanning them first.
- Assuming a `Read` deny rule keeps `.env` out of your commits. It stops Claude's file tools from reading the file, and a broad `git add` can still stage it. Make sure git ignores the file.
- Letting a model be the only reader of authentication or payment code.

For sign-in design, see [Auth: Access and Passkeys](../app-development/auth-access-and-passkeys.md). To loosen prompts without loosening safety, see [Permission Tuning for Fewer Prompts](../workflow/permission-tuning-for-fewer-prompts.md).

## Checkpoint

Why add a deny rule for `.env` instead of a line in CLAUDE.md that says not to read it?

<details><summary>Show the answer</summary>
Claude Code enforces permission rules, so a matching call is blocked. A CLAUDE.md line is an instruction the model may follow, and it does not change what Claude Code allows.
</details>
