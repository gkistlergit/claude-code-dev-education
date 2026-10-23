// Checks the built site in site/: every internal link, asset and #anchor resolves,
// every page has one h1, one main landmark and a title, and heading levels do not skip.
// Run after `npm run build`. Standard library only.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';
import { ROOT, walk } from './lib.mjs';

const SITE = join(ROOT, 'site');
if (!existsSync(SITE)) { console.error('site/ does not exist. Run npm run build first.'); process.exit(1); }

// walk() returns paths relative to the repo root, so strip the leading site/.
const rel = (p) => p.replace(/^site\//, '');
const allFiles = new Set(walk(SITE).map(rel));
const htmlPages = walk(SITE, ['.html']).map(rel);

const errors = [];
const err = (page, msg) => errors.push(`${page}  ${msg}`);
const idCache = new Map();
const idsOf = (page) => {
  if (!idCache.has(page)) idCache.set(page, new Set([...readFileSync(join(SITE, page), 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  return idCache.get(page);
};

let linkCount = 0;
for (const page of htmlPages) {
  if (page === '404.html') continue;
  const html = readFileSync(join(SITE, page), 'utf8');

  // Structure.
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) err(page, `${h1} h1 elements (expected 1)`);
  if ((html.match(/<main[\s>]/g) || []).length !== 1) err(page, 'expected exactly one main landmark');
  if (!/<title>[^<]+<\/title>/.test(html)) err(page, 'missing title');
  if (!/<html lang="en">/.test(html)) err(page, 'missing html lang');
  let last = 0;
  for (const m of html.matchAll(/<h([1-6])[\s>]/g)) {
    const level = Number(m[1]);
    if (last && level > last + 1) err(page, `heading level jumps from h${last} to h${level}`);
    last = level;
  }

  // Links and assets.
  for (const m of html.matchAll(/\s(?:href|src)="([^"]*)"/g)) {
    const target = m[1];
    if (!target || /^(https?:|mailto:|data:|javascript:)/.test(target)) continue;
    linkCount++;
    const [path, frag] = target.split('#');
    let resolved = page;
    if (path) {
      resolved = normalize(join(dirname(page), path));
      if (!allFiles.has(resolved)) { err(page, `broken link: ${target}`); continue; }
    }
    if (frag && resolved.endsWith('.html') && !idsOf(resolved).has(frag)) err(page, `missing anchor: ${target}`);
  }
}

for (const e of errors.slice(0, 60)) console.log(`ERROR  ${e}`);
if (errors.length > 60) console.log(`... and ${errors.length - 60} more`);
console.log(`\n${errors.length} error(s) across ${htmlPages.length} pages and ${linkCount} internal links`);
process.exit(errors.length ? 1 : 0);
