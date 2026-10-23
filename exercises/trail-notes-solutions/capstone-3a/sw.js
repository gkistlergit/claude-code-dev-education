// Service worker for Trail Notes. It caches the app shell so the page opens offline.
//
// Change the file list (add, remove or rename a file in APP_SHELL)?
//   1. Bump CACHE_VERSION. A browser only installs a new worker when this file changes,
//      and a new version is what makes it drop the old cache.
//   2. Run `npm run cache:lock` to record the new version and list in checks/cache.lock.json.
// checks/cache.check.mjs fails until both are done.
//
// The check reads this file as text, so keep CACHE_VERSION a plain integer and APP_SHELL
// a plain array of quoted strings with no comments inside it.

const CACHE_VERSION = 1;
const CACHE_NAME = `trail-notes-v${CACHE_VERSION}`;
const APP_SHELL = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './notes.js',
  './manifest.webmanifest',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
});

// Drop caches left behind by earlier versions.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((name) => name.startsWith('trail-notes-') && name !== CACHE_NAME)
        .map((name) => caches.delete(name))))
  );
});

// Cache first, network as the fallback.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.open(CACHE_NAME)
      .then((cache) => cache.match(event.request, { ignoreSearch: true }))
      .then((hit) => hit ?? fetch(event.request))
  );
});
