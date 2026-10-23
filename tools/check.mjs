// Content checks: front matter, section order, links, word counts, callout labels,
// and a scan for things that must never be published. Standard library only.
//
//   node tools/check.mjs                 check everything
//   node tools/check.mjs --files a b     check only these files (paths relative to the repo root)
//
// Private names live in tools/.denylist (gitignored, one regular expression per line).
import { existsSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';
import { ROOT, parseFrontMatter, readOutline, articlePath, walk, read, stripFences } from './lib.mjs';

const args = process.argv.slice(2);
const filesFlag = args.indexOf('--files');
const only = filesFlag >= 0 ? new Set(args.slice(filesFlag + 1)) : null;
const outline = readOutline();

const errors = [];
const warnings = [];
const err = (file, line, msg) => errors.push(`${file}${line ? ':' + line : ''}  ${msg}`);
const warn = (file, line, msg) => warnings.push(`${file}${line ? ':' + line : ''}  ${msg}`);
const wanted = (file) => !only || only.has(file);

const SECTION_RANK = new Map([
  ['When to Use It', 1],
  ['Steps', 2], ['How It Works', 2], ['Decision Table', 2], ['Symptoms and Fixes', 2], ['Measure It', 2],
  ['Worked Example', 3],
  ['Pitfalls', 4],
  ['Checkpoint', 5]
]);
const MAIN_SECTIONS = ['Steps', 'How It Works', 'Decision Table', 'Symptoms and Fixes', 'Measure It'];
const CALLOUTS = new Set(['Terminal tip', 'Pro tip', 'Warning', 'Observed in the app']);
const FENCE_TAGS = new Set(['prompt', 'terminal', 'js', 'mjs', 'json', 'md', 'yaml', 'text', 'html', 'css', 'diff']);
const REQUIRED_KEYS = ['title', 'id', 'area', 'level', 'time', 'tags', 'verified', 'status', 'sources', 'related'];

// Always-on patterns for things that must not appear in a public repository.
const ALWAYS = [
  [/[\w.+-]+@(?!example\.com\b)[\w-]+(?:\.[\w-]+)+/i, 'email address'],
  [/\/Users\/\w+/, 'local path'],
  [/~\/Developer/, 'local path'],
  [/\b(ghp_|gho_|github_pat_|sk-[A-Za-z0-9]{16,}|xox[abp]-|AKIA[0-9A-Z]{12,})/, 'token-like string']
];
const denylist = existsSync(join(ROOT, 'tools/.denylist'))
  ? read('tools/.denylist').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#')).map((l) => new RegExp(l, 'i'))
  : [];
if (!denylist.length) warn('tools/.denylist', 0, 'missing: private-name scan is limited to the always-on patterns');

// ---- 1. Outline integrity -------------------------------------------------
if (!only) {
  const seen = new Set();
  for (const a of outline.articles) {
    if (seen.has(a.id)) err('kb/outline.json', 0, `duplicate id ${a.id}`);
    seen.add(a.id);
    if (!outline.areaBySlug.has(a.area)) err('kb/outline.json', 0, `${a.id} has unknown area ${a.area}`);
    for (const r of a.related) if (!outline.byId.has(r)) err('kb/outline.json', 0, `${a.id} relates to unknown id ${r}`);
    if (!existsSync(join(ROOT, articlePath(a)))) err(articlePath(a), 0, 'listed in the outline but the file does not exist');
  }
  const listed = new Set(outline.articles.map(articlePath));
  for (const f of walk(join(ROOT, 'kb'), ['.md'])) {
    if (f !== 'kb/glossary.md' && !listed.has(f)) err(f, 0, 'article file is not in kb/outline.json');
  }
}

// ---- 2. Per-file checks -----------------------------------------------------
const textFiles = walk(ROOT, ['.md', '.html', '.css', '.js', '.mjs', '.json', '.yml', '.yaml', '.webmanifest', '.txt'])
  .filter((f) => f !== 'package-lock.json' && f !== 'tools/.denylist' && f !== 'tools/check.mjs');

for (const file of textFiles) {
  if (!wanted(file)) continue;
  const text = read(file);
  const lines = text.split('\n');

  // Never-publish scan, every line of every text file.
  lines.forEach((line, i) => {
    for (const [re, what] of ALWAYS) if (re.test(line)) err(file, i + 1, `contains a ${what}`);
    for (const re of denylist) if (re.test(line)) err(file, i + 1, `matches a private-name pattern (${re.source})`);
  });

  if (!file.endsWith('.md')) continue;
  const { data, body, hasFrontMatter, bodyStartLine } = parseFrontMatter(text);
  const prose = stripFences(body);

  // Links.
  const proseFull = stripFences(text).split('\n');
  proseFull.forEach((line, i) => {
    for (const m of line.matchAll(/\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
      const target = m[1];
      if (/^(https?:|mailto:|#)/.test(target)) continue;
      const clean = target.split('#')[0];
      if (!clean) continue;
      const resolved = normalize(join(dirname(file), clean));
      if (!existsSync(join(ROOT, resolved))) err(file, i + 1, `broken link: ${target}`);
    }
  });

  // Callout labels and fence tags.
  proseFull.forEach((line, i) => {
    const m = line.match(/^>\s*\*\*([^*]+)\*\*\s*$/);
    if (m && !CALLOUTS.has(m[1])) err(file, i + 1, `unknown callout label "${m[1]}" (allowed: ${[...CALLOUTS].join(', ')})`);
  });
  let fence = null;
  lines.forEach((line, i) => {
    const m = line.match(/^\s*(?:>\s*)*(`{3,}|~{3,})\s*([\w-]*)\s*$/);
    if (!m) return;
    if (!fence) {
      fence = m[1];
      if (!m[2]) warn(file, i + 1, 'code fence has no tag');
      else if (!FENCE_TAGS.has(m[2])) warn(file, i + 1, `unusual code fence tag "${m[2]}"`);
    } else if (m[1][0] === fence[0] && m[1].length >= fence.length && !m[2]) fence = null;
  });

  // Knowledge base articles: full structure checks.
  const isArticle = file.startsWith('kb/') && file !== 'kb/glossary.md';
  if (!isArticle) continue;

  const entry = outline.articles.find((a) => articlePath(a) === file);
  if (!hasFrontMatter) { err(file, 1, 'missing front matter'); continue; }
  for (const k of REQUIRED_KEYS) if (!(k in data) || data[k] === '' || (Array.isArray(data[k]) && data[k].length === 0 && k !== 'related')) err(file, 1, `front matter is missing "${k}"`);
  if (entry) {
    if (data.title !== entry.title) err(file, 1, `title must be "${entry.title}"`);
    if (data.id !== entry.id) err(file, 1, `id must be ${entry.id}`);
    if (data.area !== entry.area) err(file, 1, `area must be ${entry.area}`);
    if (data.level !== entry.level) err(file, 1, `level must be ${entry.level}`);
    for (const r of entry.related) if (!(data.related || []).includes(r)) err(file, 1, `related must include ${r}`);
  }
  if (!['verified', 'partial'].includes(data.status)) err(file, 1, 'status must be verified or partial');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(data.verified))) err(file, 1, 'verified must be a date like 2026-10-22');
  for (const s of data.sources || []) if (!/^https:\/\/code\.claude\.com\/docs\/en\//.test(s) && !/^https:\/\/[\w.-]+\//.test(s)) err(file, 1, `source is not a full https URL: ${s}`);

  // Sections.
  const h2 = [];
  prose.split('\n').forEach((line, i) => { const m = line.match(/^##\s+(.+?)\s*$/); if (m) h2.push([m[1], i + bodyStartLine]); });
  let last = 0;
  for (const [name, line] of h2) {
    const rank = SECTION_RANK.get(name);
    if (!rank) { err(file, line, `unexpected section "${name}"`); continue; }
    if (rank < last) err(file, line, `section "${name}" is out of order`);
    last = Math.max(last, rank);
  }
  const names = h2.map(([n]) => n);
  for (const req of ['When to Use It', 'Pitfalls', 'Checkpoint']) if (!names.includes(req)) err(file, 0, `missing section "${req}"`);
  if (!MAIN_SECTIONS.some((s) => names.includes(s))) err(file, 0, `missing a main section (${MAIN_SECTIONS.join(', ')})`);
  if (!/<details>\s*<summary>/.test(body)) err(file, 0, 'Checkpoint needs a <details><summary> answer');

  // Lead paragraph.
  const firstContent = prose.split('\n').find((l) => l.trim());
  if (!firstContent || firstContent.startsWith('#')) err(file, bodyStartLine, 'needs a lead paragraph before the first heading');

  // Length.
  const words = prose.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  if (words < 300 || words > 1500) err(file, 0, `${words} words (hard limits 300 to 1500)`);
  else if (words < 400 || words > 1200) warn(file, 0, `${words} words (target 400 to 1200)`);

  // Banned writing habits (warnings, to keep the voice plain).
  const stock = /\b(robust|seamless(ly)?|leverag(e|es|ed|ing)|delve|crucial|game-changer|streamline[sd]?|dive into|unlock(s|ed|ing)?)\b/i;
  prose.split('\n').forEach((line, i) => {
    if (stock.test(line)) warn(file, i + bodyStartLine, `stock word: ${line.match(stock)[0]}`);
  });
  const dashes = (prose.match(/—/g) || []).length;
  if (dashes > 1) warn(file, 0, `${dashes} em dashes (limit 1)`);
}

// ---- Report -------------------------------------------------------------------
for (const w of warnings) console.log(`warn   ${w}`);
for (const e of errors) console.log(`ERROR  ${e}`);
console.log(`\n${errors.length} error(s), ${warnings.length} warning(s), ${textFiles.filter(wanted).length} file(s) scanned`);
process.exit(errors.length ? 1 : 0);
