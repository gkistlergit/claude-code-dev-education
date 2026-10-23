---
title: Trail Notes Starter
kind: exercise
order: 1
verified: 2026-10-22
---

Trail Notes is a small notes app in plain HTML, CSS and JavaScript. It has no framework, no build step and nothing to install. The hands-on steps and capstones in this course use it. The starter has one bug on purpose: search only matches when the capitals match.

## What Is in the Folder

| File | What it does |
|---|---|
| `index.html` | The page: a form to add a note, a search box, and the list of notes. |
| `style.css` | Layout, light and dark colors, focus outlines. |
| `app.js` | Wires the page to the logic and saves notes in the browser with `loadNotes` and `saveNotes`. |
| `notes.js` | Pure functions: `addNote`, `removeNote`, `searchNotes`, `sortNotes`. No page code, so Node can run them. |
| `manifest.webmanifest` | A minimal web app manifest. It has no icons on purpose; browsers set their own install rules, so see MDN's guide to [making PWAs installable](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable) before you add any. |
| `package.json` | Marks the folder as ES modules and defines `npm run check`. It lists no dependencies. |
| `checks/` | `run.mjs` runs every `*.check.mjs` file. `notes.check.mjs` passes. `search.check.mjs` fails until the bug is fixed. |

## Copy It into Your Own Folder

Work in a copy so your edits stay yours and the course folder stays clean.

> **Terminal tip**
> `cp -R` copies a folder and everything inside it. `~` is your home folder, and `cd` moves the Terminal into a folder. Replace the first path with wherever you saved the course.
>
> ```terminal
> cp -R path/to/claude-code-dev-education/exercises/trail-notes-starter ~/trail-notes
> cd ~/trail-notes
> ```

In Finder you can also duplicate the `trail-notes-starter` folder and move the copy wherever you like. Then pick the copy as the project folder in the Code tab. [Choosing a Project Folder](../../kb/app/choosing-a-project-folder.md) shows where that control is, and [Install, Sign In and Your First Session](../../kb/app/install-sign-in-and-your-first-session.md) walks through a first prompt in this folder.

## Run the App

Open the app through a small local web server. Browsers usually refuse to load JavaScript modules from a page opened by double-clicking `index.html`, so a plain double-click can leave you with an empty page.

> **Terminal tip**
> `python3 -m http.server 8000` starts Python's built-in web server. It serves the folder you are in at `http://localhost:8000` until you press Control+C. If `python3` is missing, macOS offers to install the Command Line Tools; accept, or use any other static file server. Python's own page on [http.server](https://docs.python.org/3/library/http.server.html) lists the options.
>
> ```terminal
> python3 -m http.server 8000
> ```

Then open `http://localhost:8000` in your browser. Add a note, reload the page, and the note is still there. Notes live in the browser's `localStorage` for that exact address, so `localhost:8000` and `localhost:8001` keep separate lists.

The Code tab can also show the running app in its Browser pane. [Preview, Ship and Maintain](../../kb/app-development/preview-ship-and-maintain.md) covers that setup.

## Run the Checks

The checks need Node.js 20 or later. `node --version` prints yours; the installer is at [nodejs.org](https://nodejs.org).

> **Terminal tip**
> `node checks/run.mjs` runs the runner script with Node. `npm run check` does the same through the script in `package.json`. Neither downloads anything, because the project has no dependencies.
>
> ```terminal
> node checks/run.mjs
> ```

In the starter this is the output:

```text
ok    notes > addNote adds a note with an id, the text and the time
ok    notes > addNote trims spaces but keeps the capitalization you typed
ok    notes > addNote gives every note a different id
ok    notes > addNote ignores a blank title and leaves the list alone
ok    notes > removeNote removes only the note with that id
ok    notes > sortNotes puts the newest note first
ok    search > finds a title when the case matches exactly
FAIL  search > finds a title typed in a different case: lowercase query (got [], expected ["Trail map"])
FAIL  search > finds text in the body in any case: body, mixed case (got [], expected ["Trail map"])
ok    search > ignores spaces around the query
ok    search > an empty query returns every note
ok    search > returns an empty list when nothing matches

10 passed, 2 failed
```

Each line is one check. A line starting `ok` passed. A line starting `FAIL` names the check, says what went wrong and, for comparisons, shows what the code returned and what the check expected. The runner exits with code 1 when anything fails, which is what lets a git hook or CI stop a bad change. When you are done, the last line ends in `0 failed`.

## The Seeded Bug

Add a note titled `Trail map`. Search for `Trail` and it appears. Search for `trail` and it does not. The two failing checks describe the same fault. Fix it, keep every other check green, and do not edit the checks to get there.

[Debugging with Claude](../../kb/development/debugging-with-claude.md) uses this bug as its worked example. The finished version lives in the [solutions folder](../trail-notes-solutions/README.md), but try the capstone first.

## How the Pieces Fit

`notes.js` holds the rules and never touches the page or storage. `app.js` reads the form, calls those functions, saves the result to `localStorage` and redraws the list. Keeping the two apart is what lets `node checks/run.mjs` test the rules without a browser. [Testing Without a Framework](../../kb/app-development/testing-without-a-framework.md) explains the runner.
