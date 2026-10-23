---
title: Tests First
kind: prompt
order: 3
verified: 2026-10-23
---

Use this when you add behavior or fix a bug and want the check to exist, fail for the right reason, and then pass. It asks for the check before the code, so the check is not shaped to fit code Claude has already written. [Test-Driven Development with Claude](../kb/development/test-driven-development-with-claude.md) explains the loop.

## Prompt

```prompt
Add [behavior] test-first.

1. Write one failing check for [behavior] in [check file]. Run [check command] and show me the failure. Stop and tell me whether it fails for the right reason.
2. After I agree, write the smallest change in [source file] that makes the check pass.
3. Run all the checks and show me the result.

Do not edit existing checks to make them pass. If you think an existing check is wrong, tell me and wait.
```

## What a Good Result Looks Like

- The first run shows one new check failing, and the message names the missing behavior. A typo, a syntax error or an import error is the wrong reason.
- Claude stops after the failing run and waits for you.
- The change that follows is small and sits in the source file you named.
- The final run shows every check, old and new, ending in the `passed, failed` summary line.
- The Changes pane shows no edits to existing check files.

In Trail Notes, a check for a function that does not exist yet fails with `could not load`, which proves little. Ask for an empty stub that returns the wrong answer first, so the check fails on behavior.

## Variations

### Fixing a Bug

```prompt
Turn this bug into a failing check first: [what happens, and what should happen]. Show me it fails, then fix it with the smallest change and show me it passes.
```

### Several Cases at Once

```prompt
Before writing code, list the cases that [behavior] must handle, including empty and malformed input. Wait for me to trim the list, then write one failing check per case.
```

### Checking an After-the-Fact Check

Use this when the check was written after the code.

```prompt
Prove [check name] can fail: temporarily undo the change it covers, run the check and show it failing, then restore the change and show it passing.
```
