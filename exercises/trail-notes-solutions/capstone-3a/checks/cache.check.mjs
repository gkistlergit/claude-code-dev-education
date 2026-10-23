import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { diagnose, readLock, readShell } from './cache-lock.mjs';

const root = new URL('../', import.meta.url);
const read = (name) => readFileSync(new URL(name, root), 'utf8');
const toPath = (asset) => (asset === './' ? 'index.html' : asset.replace(/^\.\//, ''));
const toAsset = (ref) => (ref.startsWith('./') ? ref : `./${ref}`);

// Local files the page loads: <script src>, <link href>, and ES module imports (static or dynamic).
function localFilesLoaded({ assets }) {
  const fromHtml = [...read('index.html').matchAll(/(?:src|href)="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((ref) => !/^(https?:|data:|#)/.test(ref));
  const fromScripts = assets.filter((asset) => asset.endsWith('.js'))
    .flatMap((asset) => [...read(toPath(asset)).matchAll(/\b(?:from|import)\s*\(?\s*(['"])(\.\/[^'"]+)\1/g)].map((match) => match[2]));
  return [...new Set([...fromHtml, ...fromScripts].map(toAsset))];
}

export const checks = {
  'sw.js defines CACHE_VERSION and APP_SHELL': () => {
    const shell = readShell();
    assert.ok(Number.isInteger(shell.version) && shell.version >= 1, 'CACHE_VERSION is a positive integer');
    assert.ok(shell.assets.includes('./index.html'), 'APP_SHELL lists ./index.html');
  },

  'every file in APP_SHELL exists': () => {
    const missing = readShell().assets.filter((asset) => !existsSync(new URL(toPath(asset), root)));
    assert.deepEqual(missing, [], 'cache.addAll() fails if one file is missing, so the worker never installs');
  },

  'every local file the page loads is in APP_SHELL': () => {
    const shell = readShell();
    const uncached = localFilesLoaded(shell).filter((file) => !shell.assets.includes(file));
    assert.deepEqual(uncached, [], 'these files load online but would be missing offline');
  },

  'the cache name is built from CACHE_VERSION': () => {
    assert.ok(/const CACHE_NAME = `[^`]*\$\{CACHE_VERSION\}[^`]*`;/.test(read('sw.js')), 'bumping the version must rename the cache');
  },

  'app.js registers sw.js': () => {
    assert.ok(/serviceWorker\s*\.register\(\s*['"]\.\/sw\.js['"]/.test(read('app.js')), 'app.js must call serviceWorker.register(\'./sw.js\')');
  },

  'the cached file list and CACHE_VERSION match the lock': () => {
    const { ok, message } = diagnose(readShell(), readLock());
    assert.ok(ok, message);
  },

  'the gate rule: a changed list needs a higher version': () => {
    const lock = { cacheVersion: 3, assetsHash: 'old' };
    assert.equal(diagnose({ version: 3, hash: 'old' }, lock).ok, true, 'same version, same list passes');
    assert.equal(diagnose({ version: 3, hash: 'new' }, lock).ok, false, 'same version, new list fails');
    assert.equal(diagnose({ version: 3, hash: 'new' }, lock).canRecord, false, 'and cannot be recorded');
    assert.equal(diagnose({ version: 4, hash: 'new' }, lock).canRecord, true, 'a higher version can be recorded');
    assert.equal(diagnose({ version: 2, hash: 'new' }, lock).canRecord, false, 'a lower version cannot');
  },
};
