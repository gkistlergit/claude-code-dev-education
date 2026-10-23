// Shared helpers for the site builder and the checks. Standard library only.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

export const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '');

/** Parse the simple front matter block: `key: value`, `key: [a, b]`, and `- item` lists. */
export function parseFrontMatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { data: {}, body: text, hasFrontMatter: false, bodyStartLine: 1 };
  const data = {};
  let key = null;
  for (const line of m[1].split('\n')) {
    if (/^\s*-\s+/.test(line) && key) {
      (Array.isArray(data[key]) ? data[key] : (data[key] = [])).push(line.replace(/^\s*-\s+/, '').trim());
      continue;
    }
    const i = line.indexOf(':');
    if (i < 0) continue;
    key = line.slice(0, i).trim();
    const v = line.slice(i + 1).trim();
    if (v === '') data[key] = [];
    else if (v.startsWith('[') && v.endsWith(']')) data[key] = v.slice(1, -1).split(',').map((s) => s.trim()).filter(Boolean);
    else if (/^-?\d+$/.test(v)) data[key] = Number(v);
    else data[key] = v.replace(/^["']|["']$/g, '');
  }
  return { data, body: text.slice(m[0].length), hasFrontMatter: true, bodyStartLine: m[0].split('\n').length };
}

export function readOutline() {
  const outline = JSON.parse(readFileSync(join(ROOT, 'kb/outline.json'), 'utf8'));
  const byId = new Map(outline.articles.map((a) => [a.id, a]));
  const areaBySlug = new Map(outline.areas.map((a) => [a.slug, a]));
  return { ...outline, byId, areaBySlug };
}

export const articlePath = (a) => `kb/${a.area}/${a.slug}.md`;

/** All files under a directory (relative paths), skipping heavy or generated folders. */
export function walk(dir = ROOT, exts = null, out = []) {
  const skip = new Set(['node_modules', '.git', 'site', '.claude', '.impeccable']);
  for (const name of readdirSync(dir)) {
    if (skip.has(name)) continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, exts, out);
    else if (!exts || exts.some((e) => name.endsWith(e))) out.push(full.slice(ROOT.length + 1));
  }
  return out;
}

export const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');

/** Blank out fenced code blocks, keeping line numbers, so prose scans ignore code. */
export function stripFences(text) {
  let fence = null; // the opening marker while inside a fenced block
  return text
    .split('\n')
    .map((line) => {
      const m = line.match(/^\s*(`{3,}|~{3,})/);
      if (!fence && m) { fence = m[1]; return ''; }
      if (fence && m && m[1][0] === fence[0] && m[1].length >= fence.length && line.trim() === m[1]) { fence = null; return ''; }
      return fence ? '' : line;
    })
    .join('\n');
}
