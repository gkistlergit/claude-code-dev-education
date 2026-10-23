---
title: Debug from an Error
kind: prompt
order: 4
verified: 2026-10-23
---

Use this when something fails and you have the exact error or the failing check output. It asks Claude to reproduce the problem and rank causes before it changes any code, which makes a fix aimed at the wrong thing less likely. [Debugging with Claude](../kb/development/debugging-with-claude.md) walks through the same method.

## Prompt

```prompt
This is failing: [paste the exact error or the failing check output].

To trigger it: [steps or command].
Expected: [what should happen]. Actual: [what happens].

1. Reproduce it first and tell me whether you did. If you cannot, say why.
2. List two to four possible causes, most likely first. For each one, give the evidence for it and a quick way to confirm or rule it out.
3. Do not change any code until one cause is confirmed by something you ran.
4. Then make the smallest change that fixes it, add a check that would have caught it, and run all the checks.
```

## What a Good Result Looks Like

- It runs the trigger and quotes what it saw before it theorizes.
- The causes are specific to this code, each with a test you could run, and they are ranked.
- It confirms a cause by running something. Reading code and agreeing with itself does not count.
- The fix is small, the new check fails without it, and the full run is shown.
- You can explain in a sentence why the bug happened.

On the Trail Notes starter, paste the two `FAIL` lines from `node checks/run.mjs`. A good diagnosis points to `searchNotes` in `notes.js` and the helper it uses to compare text, and a careful fix keeps stored titles in the capitals the user typed.

## Variations

### No Error Message

```prompt
Nothing crashes, but [what looks wrong]. First find a way to observe the wrong behavior with a script or a check, show me the output, and only then list causes.
```

### It Only Happens Sometimes

```prompt
This fails intermittently: [description]. Do not guess at a fix. Tell me what differs between a failing run and a passing run, and propose the smallest instrumentation that would show it.
```

### The First Fix Did Not Work

```prompt
The fix did not work: [paste the new output]. Undo it, tell me what this output rules out, and then give me a revised ranked list of causes.
```
