// The cache gate. sw.js lists the files it caches (APP_SHELL) and has a CACHE_VERSION.
// checks/cache.lock.json records that version and a hash of the list.
//
// The rule: the lock must match sw.js, and the lock can only record a new file list
// together with a higher CACHE_VERSION. A changed list can never pass on the old version.
//
// After you deliberately bump CACHE_VERSION in sw.js, record it with:
//   npm run cache:lock        (the same as: node checks/update-cache-lock.mjs)
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const swUrl = new URL('../sw.js', import.meta.url);
const lockUrl = new URL('./cache.lock.json', import.meta.url);

// Order does not matter to a cache, so sort before hashing.
const hashList = (assets) => createHash('sha256').update([...assets].sort().join('\n')).digest('hex');

export function readShell() {
  const source = readFileSync(swUrl, 'utf8');
  const version = Number(source.match(/const CACHE_VERSION = (\d+);/)?.[1]);
  const body = source.match(/const APP_SHELL = \[([^\]]*)\];/)?.[1];
  if (!Number.isInteger(version) || body === undefined) {
    throw new Error('sw.js must define CACHE_VERSION (an integer) and APP_SHELL (an array of strings)');
  }
  const assets = [...body.matchAll(/(['"])(.+?)\1/g)].map((match) => match[2]);
  return { version, assets, hash: hashList(assets) };
}

export const readLock = () => (existsSync(lockUrl) ? JSON.parse(readFileSync(lockUrl, 'utf8')) : null);

export function writeLock({ version, hash }) {
  writeFileSync(lockUrl, JSON.stringify({ cacheVersion: version, assetsHash: hash }, null, 2) + '\n');
}

// Compare sw.js (shell) with the lock. `canRecord` says whether `npm run cache:lock` may fix it.
export function diagnose(shell, lock) {
  if (!lock) {
    return { ok: false, canRecord: true, message: 'checks/cache.lock.json is missing. Create it with: npm run cache:lock' };
  }
  if (shell.version < lock.cacheVersion) {
    return { ok: false, canRecord: false, message: `CACHE_VERSION is ${shell.version} but the lock already records ${lock.cacheVersion}. The version only goes up.` };
  }
  if (shell.version === lock.cacheVersion) {
    if (shell.hash === lock.assetsHash) return { ok: true, canRecord: false, message: '' };
    return { ok: false, canRecord: false, message: `The cached file list changed but CACHE_VERSION is still ${shell.version}. Bump CACHE_VERSION in sw.js, then run: npm run cache:lock` };
  }
  return { ok: false, canRecord: true, message: `CACHE_VERSION went from ${lock.cacheVersion} to ${shell.version} but the lock was not updated. Run: npm run cache:lock` };
}
