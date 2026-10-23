// Records the current CACHE_VERSION and cached file list in checks/cache.lock.json.
// Run it after you deliberately bump CACHE_VERSION in sw.js:
//
//   npm run cache:lock
//
// It refuses to record a changed file list under an unchanged version.
import { diagnose, readLock, readShell, writeLock } from './cache-lock.mjs';

const shell = readShell();
const result = diagnose(shell, readLock());

if (result.ok) {
  console.log(`The lock already matches sw.js (CACHE_VERSION ${shell.version}). Nothing to do.`);
} else if (result.canRecord) {
  writeLock(shell);
  console.log(`Recorded CACHE_VERSION ${shell.version} and ${shell.assets.length} cached files in checks/cache.lock.json.`);
} else {
  console.error(result.message);
  process.exitCode = 1;
}
