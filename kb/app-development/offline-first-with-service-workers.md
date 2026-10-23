---
title: Offline-First with Service Workers
id: P09
area: app-development
level: 3
time: 10
tags: [offline, service-worker]
verified: 2026-10-23
status: partial
sources:
  - https://code.claude.com/docs/en/best-practices
  - https://code.claude.com/docs/en/desktop#preview-your-app
  - https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
  - https://developer.mozilla.org/en-US/docs/Web/API/Cache
  - https://developer.chrome.com/docs/devtools/progressive-web-apps
related: [P04, P06, P08]
---

An offline-first app opens from a cache on the device and treats the network as a bonus. Cache the app shell in a service worker, keep user data in the browser, give the cache a version, and add a check that fails when the cached file list changes without a version bump.

## When to Use It

Use it when the app must open with no signal, such as Trail Notes on a trail. It follows [A Static PWA on a Free Host](a-static-pwa-on-a-free-host.md), because a service worker needs https or `localhost`. The author's apps work this way (pattern 14): a service worker caches the app shell, and data lives in IndexedDB or a baked-in seed. The version gate is pattern 8, a gate that checks a gate. This page is marked partial because the Claude Code docs do not say how the Browser pane handles service workers.

## Steps

1. **Sort** your files into shell and data. The shell is what the app needs to open: HTML, CSS, JavaScript and the manifest. Data is what people create. Trail Notes keeps notes in `localStorage`, which the page reads and writes without help from the worker. [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers) notes that Web Storage is synchronous and not allowed in service workers, and that IndexedDB can be used there if the worker must read data. A baked-in seed is a data file you ship with the shell and list with the other files.
2. **Prompt** Claude to write `sw.js`. Expect this shape: install fills a versioned cache, activate deletes older caches, and fetch answers from the cache first. The relative `./` paths keep it working on a project site.

   ```js
   const CACHE_VERSION = 1;
   const CACHE_NAME = `trail-notes-v${CACHE_VERSION}`;
   const APP_SHELL = ['./', './index.html', './style.css', './app.js', './notes.js', './manifest.webmanifest'];

   self.addEventListener('install', (event) => {
     event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
   });

   self.addEventListener('activate', (event) => {
     event.waitUntil(
       caches.keys().then((names) =>
         Promise.all(
           names.filter((name) => name.startsWith('trail-notes-') && name !== CACHE_NAME)
             .map((name) => caches.delete(name))
         )
       )
     );
   });

   self.addEventListener('fetch', (event) => {
     if (event.request.method !== 'GET') return;
     event.respondWith(caches.match(event.request).then((hit) => hit ?? fetch(event.request)));
   });
   ```

3. **Register** the worker from `app.js`, with a feature check so browsers without service workers still run the app online.

   ```js
   if ('serviceWorker' in navigator) {
     navigator.serviceWorker.register('./sw.js').catch((error) => console.warn('Offline support is off:', error));
   }
   ```

4. **Bump** `CACHE_VERSION` whenever a cached file changes. MDN says items in a cache are not updated unless you ask and do not expire unless deleted, so a cache-first worker keeps serving old files. Install runs again only when the browser finds a changed `sw.js`, and the new version name is what makes the new worker drop the old cache.
5. **Prompt** Claude for the gate. Write the check before you change the list, so you see it fail.

   ```prompt
   Add a check in checks/ that fails when the list of cached files in sw.js changes without a higher CACHE_VERSION. Record the last accepted version and a hash of the list somewhere the check can read. Add a second check that every local file index.html loads appears in the list. Show me both failing before you fix anything: change the list, run node checks/run.mjs, then undo the change.
   ```

6. **Test** offline. Load the app once while online so the worker installs, then reload so the page is controlled by it. MDN explains that a document starts with or without a worker and keeps that for its life. Now stop the server from the **Dev servers** menu in the Browser pane and reload. The shell should still appear.

   > **Warning**
   > The Claude Code docs do not say whether the Browser pane registers service workers or has an offline switch. If the reload fails, check the console and try your regular browser before you decide the worker is broken. In Chrome, the developer tools **Application** panel ([guide](https://developer.chrome.com/docs/devtools/progressive-web-apps)) has a **Service Workers** tab with an **Offline** checkbox and a **Cache Storage** tab that lists what is cached.

7. **Plan** for updates. MDN says a new worker installs in the background and activates once pages using the old one close. During development, the same Chrome tab has an **Update on reload** checkbox.

## Worked Example

Capstone 3a asks you to build this for Trail Notes. Give Claude one prompt and watch for the order of events:

```prompt
Add offline support to Trail Notes. Create sw.js that caches the app shell with a CACHE_VERSION and register it from app.js with a feature check. Then add a check that fails when the cached file list changes without a higher CACHE_VERSION. Show the check failing first.
```

Look for three things: the check fails before the fix, its message tells you what to do, and the run is green again after you bump the version and record it. Try your own version before you compare it with the folder in [Trail Notes Solutions](../../exercises/trail-notes-solutions/README.md). [Capstone 3a](../../capstones/capstone-3a-offline-first-app.md) has the full brief. [Testing Without a Framework](testing-without-a-framework.md) explains the runner the check joins.

## Pitfalls

- Cache-first serves the old files until the version changes. The gate watches the file list. An edit to `app.js` with the list unchanged still needs a manual bump, or a gate that also hashes file contents.
- A file the page loads but the list omits works online and fails offline. The second check in the prompt above catches it.
- `cache.addAll` fails if any listed file is missing, and then the worker never installs. A typo in the list breaks offline support quietly.
- Several apps can share one origin, as GitHub project sites do. Prefix your cache names and delete only your own, as the sketch does.
- MDN says a browser may delete a site's cache. Keep the network fallback so the app still loads online.
- Data in `localStorage` belongs to one browser at one address. Offline-first for a single device is a smaller problem than syncing between devices.

## Checkpoint

You add `./extra.js` as a script in `index.html` but forget to list it in `APP_SHELL`. What happens online and offline, and which check catches it?

<details><summary>Show the answer</summary>

Online, the page fetches the file from the network and everything works. Offline, the file is not in the cache, so the page breaks. The version gate does not notice, because the list never changed. The second check, which compares the files `index.html` loads with the list, catches it.

</details>
