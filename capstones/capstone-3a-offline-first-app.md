---
title: Capstone 3a: Offline-First App
kind: capstone
level: 3
order: 4
time: 120
verified: 2026-10-23
sources:
  - https://code.claude.com/docs/en/best-practices
  - https://code.claude.com/docs/en/desktop
  - https://code.claude.com/docs/en/worktrees
---

This capstone makes Trail Notes work without a network connection. A service worker caches the app shell under a version, and a check fails when the list of cached files changes without a version bump. The article behind it is [Offline-First with Service Workers](../kb/app-development/offline-first-with-service-workers.md). The evidence you save counts toward the App Development and Process scores in the [rubric](../assessment/rubric.md).

## Goal

Add `sw.js` with a `CACHE_VERSION` that caches the app shell, register it from the app, and add a gate in `checks/` that fails when the cached asset list changes without the version changing. Notes stay in `localStorage` as they are.

## Setup

- Your `trail-notes` folder after Capstone 2, merged to the default branch of your free personal GitHub repository, with the CI workflow running the checks.
- `OFFLINE.md` from Module M3.3, committed on your default branch so a worktree session can read it. If you do not have it, write it first by following that module's step 4.
- If you skipped Capstone 2, copy `capstone-2/` from the [Trail Notes solutions](../exercises/trail-notes-solutions/README.md). The offline work does not depend on tags, so you may start from `capstone-1/` instead.
- A way to preview over localhost. Browsers register service workers only on HTTPS pages and on localhost, so you will preview through a local server and not by opening the file directly. Check your browser's current documentation for the exact rule.

## Tasks

1. Start a session with Worktree on and name the branch for the change, such as `offline-shell`.
2. Update `OFFLINE.md` with the final list of app shell files: the HTML, CSS, JavaScript and manifest files the app needs to start.
3. Write the gate first.

   ```prompt
   Read OFFLINE.md. Add checks/cache-version.check.mjs for a service worker that does not exist yet. The check must fail when the list of cached files changes without CACHE_VERSION changing, and pass when the version is bumped along with the list. Decide how the check remembers the previous list and version, and explain your choice. Run node checks/run.mjs and show me that the new check fails because sw.js is missing.
   ```

4. Write the service worker.

   ```prompt
   Create sw.js. It defines CACHE_VERSION, caches the app shell files listed in OFFLINE.md when it installs, removes caches from older versions when it activates, and answers requests from the cache first. Register it from app.js. Do not change how notes are stored and do not edit any existing check. Run node checks/run.mjs and show me the result.
   ```

5. Preview over localhost. The [starter README](../exercises/trail-notes-starter/README.md) shows how to serve the folder with Python's built-in web server, and Claude can also start a preview server that the Browser pane's Dev servers menu starts and stops.
6. Test offline behavior. Load the app once while the server runs, reload it once more, and ask Claude to confirm with the Browser pane that the service worker is active. Then stop the server (press Control+C in the terminal that runs it, or use the Dev servers menu) and reload the page. The app should still load, and the notes you saved should still appear.
7. Prove the gate. Ask Claude to add one new file to the cached list without changing `CACHE_VERSION` and run the checks, which should fail. Then bump the version and run them again, which should pass. Revert the experiment before you commit unless the new file is a real part of the app shell.
8. Open a pull request with a body that says what was verified and what was not. Confirm that the CI run includes your new check and passes, then merge.
9. If you kept a deploy ledger in Module M3.4, add a row for the merge with the exact commit. Clean up the worktree and branch.
10. Compare your work with the reference in the folder `capstone-3a/` of the [Trail Notes solutions](../exercises/trail-notes-solutions/README.md) and write down each difference.

## Success Criteria

- [ ] `sw.js` exists, defines `CACHE_VERSION`, caches the app shell, and removes older caches when it activates.
- [ ] `app.js` registers the service worker, and notes are still stored the way they were before.
- [ ] After one online load, stopping the server and reloading leaves the app working with your notes visible.
- [ ] `checks/cache-version.check.mjs` failed before `sw.js` existed, failed when the list changed without a version bump, and passed after the bump. You saw all three.
- [ ] `node checks/run.mjs` passes, no existing check was edited, and the CI run on the pull request includes the new check.
- [ ] The pull request is merged and the worktree and branch are cleaned up.
- [ ] You compared your work with the capstone 3a reference and explained the differences.

## Time

120 minutes. The course sets this figure as a planning budget and has not measured it.

## Self-Review

- How does your gate remember the previous list and version, and what would make it produce a false failure?
- In two sentences, explain what a user who already has the old cache sees when you ship a changed file under the same `CACHE_VERSION`. Check your answer against the Offline-First article.
- What does your app do on first load with no network and no cache, and is that acceptable for this app?
- Which part of this work would you want a person to read line by line before deployment, and why?

Save as evidence: the gate's failing and passing output, the pull request link with its CI result, and a short note of the offline test. They support App Development level 3 and Process level 3 in the [rubric](../assessment/rubric.md). Continue with [Capstone 3b](capstone-3b-optimize-a-workflow.md).
