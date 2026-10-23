// WCAG contrast check for the design tokens in site-src/tokens.css (reads the first :root block).
// Exits non-zero if any text pair is below 4.5:1 or any UI pair is below 3:1.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './lib.mjs';

const css = readFileSync(join(ROOT, 'site-src/tokens.css'), 'utf8');
const block = css.slice(css.indexOf(':root {'), css.indexOf('}', css.indexOf(':root {')));

function splitTop(s) {
  let depth = 0, cur = '';
  const parts = [];
  for (const ch of s) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) { parts.push(cur.trim()); cur = ''; } else cur += ch;
  }
  parts.push(cur.trim());
  return parts;
}

function parseColor(v) {
  v = v.trim();
  let m = v.match(/^#([0-9a-f]{6})$/i);
  if (m) return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16)).concat(1);
  m = v.match(/^rgb\(\s*(\d+)\s+(\d+)\s+(\d+)\s*(?:\/\s*([\d.]+))?\s*\)$/);
  if (m) return [Number(m[1]), Number(m[2]), Number(m[3]), m[4] ? Number(m[4]) : 1];
  return null;
}

const tokens = {};
for (const m of block.matchAll(/--([\w-]+):\s*([^;]+);/g)) {
  const [name, val] = [m[1], m[2].trim()];
  if (val.startsWith('light-dark(')) {
    const [light, dark] = splitTop(val.slice('light-dark('.length, -1));
    tokens[name] = [parseColor(light), parseColor(dark)];
  } else {
    const c = parseColor(val);
    if (c) tokens[name] = [c, c];
  }
}

const get = (name, mode) => tokens[name][mode === 'light' ? 0 : 1];
const over = (fg, bg) => [0, 1, 2].map((i) => Math.round(fg[i] * fg[3] + bg[i] * (1 - fg[3]))).concat(1);
const lum = (c) => {
  const f = (x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
};
const ratio = (a, b) => { const [hi, lo] = [Math.max(lum(a), lum(b)), Math.min(lum(a), lum(b))]; return (hi + 0.05) / (lo + 0.05); };
const resolve = (expr, mode) => {
  if (expr.includes('>')) { const [top, base] = expr.split('>'); return over(get(top, mode), resolve(base, mode)); }
  return get(expr, mode);
};

const TEXT = 4.5, UI = 3.0;
const pairs = [
  ['label on page', 'label', 'bg', TEXT],
  ['label on surface', 'label', 'bg-2', TEXT],
  ['label on fill', 'label', 'bg-3', TEXT],
  ['secondary on page', 'label-2', 'bg', TEXT],
  ['secondary on surface', 'label-2', 'bg-2', TEXT],
  ['secondary on fill', 'label-2', 'bg-3', TEXT],
  ['search text on its fill', 'label-2', 'fill>bg', TEXT],
  ['search text on its fill over surface', 'label-2', 'fill>bg-2', TEXT],
  ['label on glass over page', 'label', 'bg-glass>bg', TEXT],
  ['label on glass over surface', 'label', 'bg-glass>bg-2', TEXT],
  ['link on page', 'link', 'bg', TEXT],
  ['link on surface', 'link', 'bg-2', TEXT],
  ['label on selected row', 'label', 'selection>bg-2', TEXT],
  ['secondary on selected row', 'label-2', 'selection>bg-2', TEXT],
  ['selected search result', 'label', 'selection>bg-glass-solid', TEXT],
  ['white on accent button', 'on-accent', 'accent', TEXT],
  ['step number on badge', 'bg', 'label', TEXT],
  ['warning title on tint', 'warn-fg', 'warn-bg', TEXT],
  ['checkpoint title on tint', 'ok-fg', 'ok-bg', TEXT],
  ['pro tip title on tint', 'tip-fg', 'tip-bg', TEXT],
  ['terminal title on tint', 'term-fg', 'term-bg', TEXT],
  ['body on warning tint', 'label', 'warn-bg', TEXT],
  ['body on checkpoint tint', 'label', 'ok-bg', TEXT],
  ['body on pro tip tint', 'label', 'tip-bg', TEXT],
  ['body on terminal tint', 'label', 'term-bg', TEXT],
  ['accent control vs page', 'accent', 'bg', UI],
  ['accent control vs surface', 'accent', 'bg-2', UI],
  ['focus ring vs page', 'focus', 'bg', UI],
  ['focus ring vs surface', 'focus', 'bg-2', UI],
  ['icons and arrows vs page', 'label-3', 'bg', UI],
  ['icons and arrows vs surface', 'label-3', 'bg-2', UI]
];

let failures = 0;
for (const mode of ['light', 'dark']) {
  console.log(`\n${mode.toUpperCase()}`);
  for (const [label, fg, bg, need] of pairs) {
    const r = ratio(resolve(fg, mode), resolve(bg, mode));
    const ok = r >= need;
    if (!ok) failures++;
    console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${r.toFixed(2).padStart(5)}:1 (need ${need})  ${label}`);
  }
}
console.log(`\n${failures} failing pair(s) of ${pairs.length * 2}`);
process.exit(failures ? 1 : 0);
