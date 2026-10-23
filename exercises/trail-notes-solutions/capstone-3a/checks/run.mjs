// Runs every checks/*.check.mjs and prints one line per check. A check file exports
// `checks`, an object of { name: function }; a check fails when its function throws.
//   node checks/run.mjs        (exit code 1 if any check fails)
import { readdirSync } from 'node:fs';
import { basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const dir = fileURLToPath(new URL('.', import.meta.url));
const files = readdirSync(dir).filter((name) => name.endsWith('.check.mjs')).sort();
let total = 0;
let failed = 0;
const short = (value) => String(JSON.stringify(value)).slice(0, 80);

function report(label, name, error) {
  total += 1;
  if (!error) return console.log(`ok    ${label} > ${name}`);
  failed += 1;
  const detail = String(error.message ?? error).split('\n')[0];
  // Show got and expected for comparisons, not for plain assert.ok or assert.fail.
  const values = error.code === 'ERR_ASSERTION' && !['==', 'fail'].includes(error.operator)
    ? ` (got ${short(error.actual)}, expected ${short(error.expected)})` : '';
  console.log(`FAIL  ${label} > ${name}: ${detail}${values}`);
}

for (const file of files) {
  const label = basename(file, '.check.mjs');
  let checks;
  try {
    ({ checks } = await import(pathToFileURL(dir + file).href));
    if (!checks) throw new Error('the file does not export `checks`');
  } catch (error) {
    report(label, `could not load ${file}`, error);
    continue;
  }
  for (const [name, run] of Object.entries(checks)) {
    try { await run(); report(label, name); } catch (error) { report(label, name, error); }
  }
}

console.log(`\n${total - failed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;
