---
title: Trail Notes Solutions
kind: exercise
order: 2
verified: 2026-10-23
---

These folders hold worked solutions to the Trail Notes capstones. Each folder is a complete copy of the project with its own `checks/` folder. Try the capstone yourself first, then compare your result with the folder here.

## Which Folder Solves Which Capstone

| Folder | Capstone | What it adds | Last line of `node checks/run.mjs` |
|---|---|---|---|
| `capstone-1/` | 1 | The starter with the search bug fixed. | `12 passed, 0 failed` |
| `capstone-2/` | 2 | Tags on notes, a tag input and a tag filter. | `22 passed, 0 failed` |
| `capstone-3a/` | 3a | A service worker that caches the app shell, plus a gate that fails when the cached file list changes without a version bump. | `29 passed, 0 failed` |

The folders build on each other. `capstone-2/` contains the fix from `capstone-1/`, and `capstone-3a/` contains both. Comparing neighbors shows only what one capstone added.

## Try the Capstone First

A solution read too early teaches less than a wrong attempt you had to debug. Give the capstone a real try, run the checks, and only then open the matching folder. If you are stuck, ask Claude to explain your own failing output before you look at the answer.

> **Terminal tip**
> `diff -r` compares two folders file by file. Lines starting with `<` come from the first folder and lines starting with `>` from the second. Run the second command from inside the `trail-notes-solutions` folder; it shows exactly what the tags capstone added to the fix.
>
> ```terminal
> diff -r ~/trail-notes path/to/claude-code-dev-education/exercises/trail-notes-solutions/capstone-1
> diff -r capstone-1 capstone-2
> ```

Copy a solution out before you change it, the same way you copied the starter, so the course folder stays as it is. Every folder runs the same way: `node checks/run.mjs` for the checks and `python3 -m http.server 8000` for the app. The [starter README](../trail-notes-starter/README.md) explains both commands.

## Capstone 1: The Search Fix

`notes.js` had one helper, `normalize`, that trims spaces. Search used it to compare text, so capitals mattered. Adding `.toLowerCase()` to `normalize` looks like the smallest fix, but `addNote` uses the same helper to clean titles before storing them, so every title would be saved in lowercase. The check named `addNote trims spaces but keeps the capitalization you typed` exists to catch that shortcut.

The solution adds a second helper, `fold`, that trims and lowercases, and uses it only inside `searchNotes`. Stored text keeps the capitals the user typed. [Debugging with Claude](../../kb/development/debugging-with-claude.md) walks through the same bug.

## Capstone 2: Tags

- `addNote` accepts `tags` as an array of strings. `cleanTags` stores them trimmed and lowercase, with no blanks and no repeats. A value that is not an array becomes an empty list.
- `filterByTag(notes, tag)` keeps notes that have the tag. An empty tag means no filter.
- `listTags(notes)` returns every tag in use, once each, sorted. The tag filter menu is built from it.
- `app.js` splits the comma-separated tag input and shows each note's tags. Notes saved before tags existed load with an empty tag list, so nobody loses data.
- `checks/tags.check.mjs` holds the new checks. `notes.check.mjs` and `search.check.mjs` are unchanged and still pass, which shows the change did not break old behavior.

[Ship a Feature End to End](../../kb/recipes/ship-a-feature-end-to-end.md) is the recipe behind this capstone.

## Capstone 3a: Offline and the Cache Gate

`sw.js` caches the files named in `APP_SHELL` when it installs, serves them cache first, and deletes caches from earlier versions when it activates. `app.js` registers it. Service workers need `https` or `localhost`; MDN's guide to [using service workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers) covers the lifecycle.

Because the worker serves cached copies first, browsers keep showing the old files until a new `CACHE_VERSION` installs a new cache. Forgetting to bump it after a change to the file list leaves some visitors with a broken or stale app. The gate makes that mistake fail loudly. A new worker also waits until every tab that uses the old one is closed, because `sw.js` does not call `skipWaiting()`, so a plain reload is not enough to pick up a new version.

### How the Gate Works

| File | Job |
|---|---|
| `sw.js` | Holds `CACHE_VERSION` (an integer) and `APP_SHELL` (the list of cached files). |
| `checks/cache.lock.json` | Records the version and a SHA-256 hash of the sorted file list, as of the last time you recorded them. |
| `checks/cache-lock.mjs` | Reads `sw.js`, hashes the list and compares it with the lock. Shared by the check and the command. |
| `checks/cache.check.mjs` | The gate itself, plus checks that every cached file exists, that every file the page loads is cached, and that `app.js` registers the worker. |
| `checks/update-cache-lock.mjs` | The command that rewrites the lock. |

The rule is that the lock must match `sw.js`, and the lock can record a new file list only together with a higher `CACHE_VERSION`. The command enforces the second half, so running it does not silence the gate when you forgot to bump.

| What you did | What the checks say |
|---|---|
| Changed the list, kept the version | The gate fails and asks you to bump `CACHE_VERSION`. `npm run cache:lock` refuses and exits with code 1. |
| Bumped the version, did not run the command | The gate fails and asks you to run `npm run cache:lock`. |
| Bumped the version and ran the command | Everything passes. |
| Lowered the version | The gate fails, and the command refuses. |

### The Command

After you deliberately bump `CACHE_VERSION` in `sw.js`, record it:

> **Terminal tip**
> `npm run cache:lock` runs the script named `cache:lock` in `package.json`, which is `node checks/update-cache-lock.mjs`. It reads `sw.js`, compares it with the lock and rewrites `checks/cache.lock.json` if the change is allowed. It installs nothing.
>
> ```terminal
> npm run cache:lock
> ```

Commit the changed `sw.js` and `checks/cache.lock.json` together so the lock always travels with the version it describes.

### Try Breaking It

Create a file called `extra-notes.txt` in the project folder, add `'./extra-notes.txt',` to `APP_SHELL`, and run the checks. One check fails:

```text
FAIL  cache > the cached file list and CACHE_VERSION match the lock: The cached file list changed but CACHE_VERSION is still 1. Bump CACHE_VERSION in sw.js, then run: npm run cache:lock
```

Remove the line and delete the file to go back to green. Then try importing a new module from `app.js` without listing it in `APP_SHELL`: the check that every loaded file is cached fails.

### What the Gate Does Not Catch

The gate watches the list of files, not their contents. If you edit `app.js` and want browsers to pick up the new code, bump `CACHE_VERSION` yourself and run the command. Hashing file contents as well would catch that too, at the price of a lock update after almost every edit.

To see offline mode, load the app once through the local server, stop the server with Control+C and reload the page. If the page and your notes still appear, the worker is serving the cache. [Offline-First with Service Workers](../../kb/app-development/offline-first-with-service-workers.md) covers the pattern, and [Definition of Done and Gates](../../kb/process/definition-of-done-and-gates.md) covers why a gate like this earns its place.
