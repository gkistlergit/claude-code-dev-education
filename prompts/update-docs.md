---
title: Update Docs
kind: prompt
order: 12
verified: 2026-10-22
---

Use this after a change, so the README, comments and examples still say what the code does. It makes Claude find every place that mentions the changed behavior, edit only what is now wrong, and run the commands the docs show.

## Prompt

```prompt
Update the documentation for [the change, branch or commit range]. Read the diff first. Do not change any code.

1. Search the repo for every place that mentions the behavior that changed: the README, other docs, code comments, help text and examples. List them.
2. Update only what the change made wrong or missing. Leave unrelated text and its style alone.
3. Run every command and snippet the docs show, and tell me which ones you could not run.
4. Show me a summary of each documentation change and the reason for it.
```

## What a Good Result Looks Like

- The list of places comes from a search of the repo, with file names you can check. A list from memory misses things.
- The edits are small. Text the change did not touch looks the same as before.
- Commands were run, and the answer says what they printed. A command Claude could not run is named.
- No code changed. If the docs and the code disagree, Claude reports the disagreement and does not quietly fix the code.
- The summary explains each edit in a sentence.

On Trail Notes, the starter README shows a failing run of `node checks/run.mjs`. After you fix the search bug, that sample output is out of date, and a good pass catches it. After the tags capstone, the README should also mention the tag input and the new check file.

## Variations

### Write New Docs from the Code

```prompt
Write a README section for [module or feature] from the code. Only state what the code shows, quote the function names exactly, and mark anything you inferred.
```

### Check the Links and Commands

```prompt
Go through [doc file] and check every relative link, file name and command. Report each one as working, broken or not runnable, and fix only the broken ones.
```

### Add a Changelog Entry

```prompt
Add an entry to [changelog file] for [change], in the same format as the entries already there. Describe what a user would notice, not how the code works.
```
