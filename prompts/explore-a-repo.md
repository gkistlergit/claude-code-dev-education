---
title: Explore a Repo
kind: prompt
order: 1
verified: 2026-10-22
---

Use this when you open a folder you did not write, or return to one after a long break, and want a map before you change anything. It asks for a read-only answer short enough to read in a minute.

## Prompt

```prompt
Explore [the repo, or a folder inside it] and do not change any file.

I want to understand it well enough to change [area or feature] safely. Tell me:
1. What the project does, in two sentences.
2. The files that matter, each with one line on its job.
3. How data moves from [entry point, such as a page load or a request] to [end point, such as storage or the screen].
4. The exact commands to run it and to run its checks, and whether you ran them.
5. Anything risky or surprising: hidden coupling, missing checks, generated files, code that looks unused.

Keep the answer under [one screen]. Name files and do not paste their contents. Mark each statement as confirmed by reading the code or as your inference.
```

## What a Good Result Looks Like

- Every file it names exists. Open two or three to spot-check.
- The commands come from `package.json`, a README or the code, and it says what happened if it ran them.
- Confirmed facts and inferences are labeled, so you know which lines to trust.
- The Changes pane is empty. This prompt reads and reports.
- The answer fits the length you set. A wall of text means you should repeat the prompt with a tighter limit.

On the Trail Notes starter, expect `notes.js` described as the pure logic, `app.js` as the page wiring and storage, and `node checks/run.mjs` as the command for the checks. If Claude runs them, it should report that `search.check.mjs` fails and say nothing has been fixed.

## Variations

### A Large Repo

Keep the file contents out of your conversation by handing the reading to a subagent, which works in its own context and returns only its conclusion.

```prompt
Hand the reading to a subagent and give me only the map from the list above. Keep the file contents out of this conversation.
```

### Only the Risks

```prompt
Explore [folder] and list only what could go wrong if I change [area]: what depends on it, what has no check, and what you could not confirm.
```

### Check the README

```prompt
Compare the README with the code. List every command, file name or claim in the README that is wrong or missing, and say how you checked each one.
```
