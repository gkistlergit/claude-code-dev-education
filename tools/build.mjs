// Static site builder. Reads the markdown sources and writes site/ (gitignored).
// One runtime dependency: markdown-it (pinned in package.json).
//
//   node tools/build.mjs
//
// All links are relative, so the site works under any base path, including
// /claude-code-dev-education/ on GitHub Pages and a file:// URL for local use.
import MarkdownIt from 'markdown-it';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, posix } from 'node:path';
import { ROOT, parseFrontMatter, readOutline, articlePath, walk, read } from './lib.mjs';
import { contextDiagram, flowDiagram } from './diagrams.mjs';

const SITE_TITLE = 'Claude Code Dev Education';
const REPO_URL = 'https://github.com/gkistlergit/claude-code-dev-education';
const BASE_404 = process.env.SITE_BASE || '/claude-code-dev-education/';
const OUT = join(ROOT, 'site');
const outline = readOutline();
// Markdown files under exercises/ that are example files, not pages: copied raw and linked raw.
const RAW_MD = new Set(walk(join(ROOT, 'exercises'), ['.md']).filter((f) => !/(README|tasks)\.md$/.test(f)));

// ---------- helpers ----------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slugify = (s) => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const relUrl = (from, to) => posix.relative(posix.dirname(from), to) || posix.basename(to);
const rootPrefix = (out) => { const d = posix.dirname(out); return d === '.' ? './' : posix.relative(d, '.') + '/'; };
const levelName = (n) => outline.levels.find((l) => l.level === n)?.title ?? '';
const fmtDate = (d) => new Date(`${d}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
const trunc = (s, n) => (s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : s);

// ---------- markdown ----------
const CALLOUTS = {
  'Terminal tip': ['term', 'Terminal Tip', '<path d="M4 17l6-6-6-6M12 19h8"/>'],
  'Pro tip': ['tip', 'Pro Tip', '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>'],
  Warning: ['warn', 'Warning', '<path d="M12 3.5l9.5 16.5h-19z"/><path d="M12 10v4.5M12 17.5v.01"/>'],
  'Observed in the app': ['term', 'Observed in the App', '<circle cx="12" cy="12" r="3"/><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/>']
};
const FENCE_LABELS = { prompt: 'Prompt', terminal: 'Terminal', js: 'JavaScript', mjs: 'JavaScript', json: 'JSON', md: 'Markdown', yaml: 'YAML', text: 'Output', html: 'HTML', css: 'CSS', diff: 'Diff' };
const DIAGRAMS = {
  'idea-to-deploy': () => flowDiagram({
    id: 'd-flow', title: 'The idea-to-deploy flow', highlight: 6,
    steps: [
      { t: 'Scope the idea', s: 'One job, small slice' }, { t: 'Grill', s: 'Make decisions explicit' }, { t: 'Spec', s: 'Write it down' },
      { t: 'Tickets', s: 'Declare what blocks' }, { t: 'Branch', s: 'One change, one branch' }, { t: 'Build with checks', s: 'Fail loudly' },
      { t: 'PR and CI', s: 'Review and gates' }, { t: 'Merge and deploy', s: 'The exact commit' }, { t: 'Record it', s: 'Verified and not' }
    ]
  }),
  'session-lifecycle': () => flowDiagram({
    id: 'd-session', title: 'The life of a session', highlight: 2,
    steps: [
      { t: 'Pick a folder', s: 'Local, cloud or SSH' }, { t: 'Send a prompt', s: 'Goal and constraints' }, { t: 'Approve or review', s: 'Permission mode decides' },
      { t: 'Review changes', s: 'Changes pane' }, { t: 'Open a PR', s: 'CI status in the app' }, { t: 'Archive or hand off', s: 'Clear or write a note' }
    ]
  }),
  'context-window': () => contextDiagram({ id: 'd-context' })
};

function makeMarkdown(env) {
  const md = new MarkdownIt({ html: true, linkify: false, typographer: false });

  md.renderer.rules.table_open = () => '<div class="table-wrap"><table>\n';
  md.renderer.rules.table_close = () => '</table></div>\n';

  md.renderer.rules.fence = (tokens, idx) => {
    const t = tokens[idx];
    const tag = (t.info || '').trim().split(/\s+/)[0];
    const id = `c${++env.codeId}`;
    const label = FENCE_LABELS[tag] || 'Code';
    const aria = tag === 'prompt' ? 'Copy prompt' : tag === 'terminal' ? 'Copy command' : 'Copy code';
    return `<div class="codeblock${tag === 'prompt' ? ' wrap' : ''}"><div class="codeblock-head"><span>${label}</span><button class="copy" type="button" data-copy="${id}" aria-label="${aria}">Copy</button></div><pre><code id="${id}">${esc(t.content.replace(/\n$/, ''))}</code></pre></div>\n`;
  };

  // Rewrite relative .md links to .html.
  md.core.ruler.after('inline', 'rewrite-links', (state) => {
    for (const tok of state.tokens) {
      if (tok.type !== 'inline' || !tok.children) continue;
      for (const c of tok.children) {
        if (c.type !== 'link_open') continue;
        const href = c.attrGet('href') || '';
        if (/^([a-z][a-z0-9+.-]*:|#|\/)/i.test(href)) continue;
        if (RAW_MD.has(posix.normalize(posix.join(posix.dirname(env.src), href.split('#')[0])))) continue;
        c.attrSet('href', href.replace(/\.md(#.*)?$/, '.html$1'));
      }
    }
  });

  // Callouts: a blockquote whose first line is a bold label.
  md.core.ruler.after('inline', 'callouts', (state) => {
    const t = state.tokens;
    for (let i = 0; i < t.length; i++) {
      if (t[i].type !== 'blockquote_open') continue;
      const p = t[i + 1], inl = t[i + 2];
      if (!p || p.type !== 'paragraph_open' || !inl || inl.type !== 'inline') continue;
      const ch = inl.children || [];
      // markdown-it 14 puts an empty text token before leading markup, so skip those.
      let k = 0;
      while (ch[k]?.type === 'text' && ch[k].content === '') k++;
      if (!(ch[k]?.type === 'strong_open' && ch[k + 1]?.type === 'text' && ch[k + 2]?.type === 'strong_close')) continue;
      const label = ch[k + 1].content;
      const def = CALLOUTS[label];
      if (!def) continue;
      let j = i + 1;
      while (j < t.length && !(t[j].type === 'blockquote_close' && t[j].level === t[i].level)) j++;
      t[i].tag = 'div'; t[i].attrSet('class', `callout ${def[0]}`); t[i].attrSet('role', 'note'); t[i].attrSet('aria-label', label);
      t[j].tag = 'div';
      const head = new state.Token('html_block', '', 0);
      head.content = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${def[2]}</svg>\n<p class="ct">${def[1]}</p>\n`;
      const rest = ch.slice(k + 3);
      if (rest.every((c) => c.type === 'text' && c.content.trim() === '')) t.splice(i + 1, 3, head);
      else {
        let drop = k + 3;
        if (ch[drop]?.type === 'softbreak') drop++;
        ch.splice(0, drop);
        if (ch[0]?.type === 'text') ch[0].content = ch[0].content.replace(/^\s+/, '');
        inl.content = inl.content.replace(/^\s*\*\*[^*]+\*\*\s*\n?/, '');
        t.splice(i + 1, 0, head);
      }
    }
  });

  // Steps: an ordered list whose items start with a bold verb.
  md.core.ruler.after('inline', 'steps', (state) => {
    const t = state.tokens;
    for (let i = 0; i < t.length; i++) {
      if (t[i].type !== 'ordered_list_open') continue;
      const firstInline = t.slice(i + 1, i + 5).find((x) => x.type === 'inline');
      const firstReal = firstInline?.children?.find((c) => !(c.type === 'text' && c.content === ''));
      if (firstReal?.type !== 'strong_open') continue;
      let end = i + 1;
      while (end < t.length && !(t[end].type === 'ordered_list_close' && t[end].level === t[i].level)) end++;
      t[i].attrSet('class', 'steps'); t[i].attrSet('role', 'list');
      const edits = [];
      for (let k = i + 1; k < end; k++) {
        if (t[k].type === 'list_item_open' && t[k].level === t[i].level + 1) edits.push([k, 'open']);
        if (t[k].type === 'list_item_close' && t[k].level === t[i].level + 1) edits.push([k, 'close']);
      }
      for (const [k, kind] of edits.reverse()) {
        const h = new state.Token('html_block', '', 0);
        h.content = kind === 'open' ? '<div>\n' : '</div>\n';
        t.splice(kind === 'open' ? k + 1 : k, 0, h);
      }
    }
  });

  // Heading ids, the table of contents, and module buttons on level pages.
  md.core.ruler.push('headings', (state) => {
    const t = state.tokens;
    for (let i = 0; i < t.length; i++) {
      if (t[i].type !== 'heading_open' || !['h2', 'h3'].includes(t[i].tag)) continue;
      const inl = t[i + 1];
      const text = (inl.children || []).filter((c) => c.type === 'text' || c.type === 'code_inline').map((c) => c.content).join('');
      let id = slugify(text) || 'section';
      for (let n = 2; env.used.has(id); n++) id = `${slugify(text)}-${n}`;
      env.used.add(id);
      t[i].attrSet('id', id);
      if (t[i].tag === 'h2') {
        env.toc.push({ id, text });
        if (env.modules) {
          const b = new state.Token('html_block', '', 0);
          b.content = `<p class="module-actions"><button class="btn module-done" type="button" data-done-key="${esc(env.path)}#${id}" aria-pressed="false">Mark Module as Done</button></p>\n`;
          t.splice(i + 3, 0, b);
        }
      }
    }
  });

  // {{diagram:name}} on its own line.
  md.core.ruler.push('diagrams', (state) => {
    const t = state.tokens;
    for (let i = 0; i < t.length - 2; i++) {
      if (t[i].type !== 'paragraph_open' || t[i + 1].type !== 'inline') continue;
      const m = t[i + 1].content.trim().match(/^\{\{diagram:([\w-]+)\}\}$/);
      if (!m) continue;
      if (!DIAGRAMS[m[1]]) throw new Error(`unknown diagram "${m[1]}" in ${env.path}`);
      const h = new state.Token('html_block', '', 0);
      h.content = `<figure>${DIAGRAMS[m[1]]()}</figure>\n`;
      t.splice(i, 3, h);
    }
  });

  return md;
}

// ---------- collect pages ----------
const pages = [];
const isDocPage = (src) => src.startsWith('docs/');
const defaultKind = (src) => (src.startsWith('docs/') ? 'docs' : src.startsWith('exercises/') ? 'exercise' : 'page');

function firstParagraph(body) {
  const lines = body.replace(/^\s*# .+\n/, '').split('\n');
  const para = [];
  let fence = false;
  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) { fence = !fence; continue; }
    if (fence) continue;
    if (!line.trim()) { if (para.length) break; continue; }
    if (/^(#|>|\||[-*+] |\d+\. |<|\{\{)/.test(line.trim())) { if (para.length) break; continue; }
    para.push(line.trim());
  }
  return para.join(' ').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[*_`]/g, '').trim();
}

function loadPage(src, extra = {}) {
  const text = read(src);
  const { data, body: rawBody, hasFrontMatter } = parseFrontMatter(text);
  let body = rawBody;
  let title = data.title;
  if (!title) {
    const m = body.match(/^\s*# (.+)\n/);
    title = m ? m[1].trim() : src;
  }
  if (!hasFrontMatter || !data.title) body = body.replace(/^\s*# .+\n/, '');
  const kind = extra.kind || data.kind || defaultKind(src);
  const out = src.replace(/\.md$/, '.html');
  return { src, out, title, kind, data, body, summary: firstParagraph(body), ...extra };
}

const entryBySrc = new Map();
for (const a of outline.articles) {
  const src = articlePath(a);
  entryBySrc.set(src, a);
  if (!existsSync(join(ROOT, src))) { console.warn(`warn: missing ${src}`); continue; }
  pages.push(loadPage(src, { kind: 'article', entry: a, area: a.area }));
}
const extraSources = [
  ...(existsSync(join(ROOT, 'kb/glossary.md')) ? ['kb/glossary.md'] : []),
  ...walk(join(ROOT, 'learn'), ['.md']), ...walk(join(ROOT, 'capstones'), ['.md']), ...walk(join(ROOT, 'assessment'), ['.md']),
  ...walk(join(ROOT, 'cheatsheets'), ['.md']), ...walk(join(ROOT, 'templates'), ['.md']), ...walk(join(ROOT, 'prompts'), ['.md']),
  ...walk(join(ROOT, 'exercises'), ['README.md', 'tasks.md']), ...walk(join(ROOT, 'docs'), ['.md'])
];
for (const src of extraSources.sort()) pages.push(loadPage(src));

const byOut = new Map(pages.map((p) => [p.out, p]));
const articles = pages.filter((p) => p.kind === 'article');

// Track membership comes from the links in each track page.
const tracks = pages.filter((p) => p.kind === 'track');
const trackKey = (p) => posix.basename(p.out, '.html').replace(/^track-/, '');
const trackMembers = new Map();
for (const tp of tracks) {
  const ids = new Set();
  for (const m of tp.body.matchAll(/\]\(([^)]*?kb\/[^)]+?\.md)(?:#[^)]*)?\)/g)) {
    const target = posix.normalize(posix.join(posix.dirname(tp.src), m[1]));
    const e = entryBySrc.get(target);
    if (e) ids.add(e.id);
  }
  trackMembers.set(trackKey(tp), ids);
}

// ---------- layout ----------
const GROUPS = [
  ['Learn', [
    ['Start Here', 'learn/start-here.html'],
    ['Orientation', 'learn/level-0-orientation.html', 'Level 0'],
    ['Beginner', 'learn/level-1-beginner.html', 'Level 1'],
    ['Intermediate', 'learn/level-2-intermediate.html', 'Level 2'],
    ['Advanced', 'learn/level-3-advanced.html', 'Level 3'],
    ['Tracks', 'learn/index.html'],
    ['Capstones', 'capstones/index.html'],
    ['Assessment', 'assessment/rubric.html']
  ]],
  ['Knowledge Base', [
    ['All Articles', 'kb/index.html'],
    ...['app', 'development', 'app-development', 'process', 'optimization', 'workflow'].map((s) => [outline.areaBySlug.get(s).title, `kb/${s}/index.html`])
  ]],
  ['Quick Reference', [
    ...['recipes', 'decision-guides', 'terminal', 'troubleshooting'].map((s) => [outline.areaBySlug.get(s).title, `kb/${s}/index.html`]),
    ['Cheatsheets', 'cheatsheets/index.html'], ['Templates', 'templates/index.html'], ['Prompts', 'prompts/index.html'], ['Glossary', 'kb/glossary.html']
  ]],
  ['About', [
    ['Exercises', 'exercises/index.html'], ['Verification Log', 'docs/verification-log.html'], ['Usage Audit', 'docs/usage-audit.html'],
    ['Patterns from Practice', 'docs/patterns-from-practice.html'], ['Design System', 'docs/design-system.html'], ['Authoring Guide', 'docs/authoring-guide.html']
  ]]
];

function navKey(p) {
  switch (p.kind) {
    case 'article': return `kb/${p.area}/index.html`;
    case 'track': return 'learn/index.html';
    case 'capstone': return 'capstones/index.html';
    case 'cheatsheet': return 'cheatsheets/index.html';
    case 'template': return 'templates/index.html';
    case 'prompt': return 'prompts/index.html';
    case 'exercise': return 'exercises/index.html';
    default: return p.out;
  }
}

function sidebar(from, current) {
  return GROUPS.map(([title, rows], gi) => {
    const items = rows.map(([label, to, small]) =>
      `<li><a class="row" href="${esc(relUrl(from, to))}"${to === current ? ' aria-current="page"' : ''}>${esc(label)}${small ? `<small>${small}</small>` : ''}</a></li>`).join('');
    return `<p class="group-title" id="g${gi + 1}">${title}</p>\n<ul class="group" role="list" aria-labelledby="g${gi + 1}">${items}</ul>`;
  }).join('\n');
}

const THEME_SCRIPT = `(function(){try{var p=new URLSearchParams(location.search).get('theme'),s=null;try{s=localStorage.getItem('theme')}catch(e){}var t=p||s;if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}})();`;
const FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%231d1d1f'/%3E%3Cpath d='M9 11l6 5-6 5M17 22h7' fill='none' stroke='%23fff' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E";

const chip = (t) => `<li><span class="chip">${esc(t)}</span></li>`;

function layout({ out, title, desc, bodyHtml, toc = [], current, wide = false, home = false }) {
  const R = rootPrefix(out);
  const noToc = wide || toc.length <= 1;
  const tocHtml = !noToc
    ? `<nav class="toc" aria-label="On this page"><p class="toc-title">On This Page</p>${toc.map((h) => `<a href="#${h.id}">${esc(h.text)}</a>`).join('')}</nav>`
    : '';
  const docTitle = home || title === SITE_TITLE ? SITE_TITLE : `${title} · ${SITE_TITLE}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)">
<meta name="site-root" content="${R}">
<meta name="description" content="${esc(trunc(desc || SITE_TITLE, 200))}">
<title>${esc(docTitle)}</title>
<link rel="icon" href="${FAVICON}">
<script>${THEME_SCRIPT}</script>
<link rel="stylesheet" href="${R}assets/tokens.css">
<link rel="stylesheet" href="${R}assets/site.css">
</head>
<body>
<a class="skip" href="#main">Skip to Content</a>
<header class="topbar">
  <button class="icon-btn nav-toggle" id="navToggle" type="button" aria-label="Menu" aria-expanded="false" aria-controls="sidebar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
  <a class="brand" href="${R}index.html">${SITE_TITLE}</a>
  <button class="search-btn" id="searchBtn" type="button" aria-label="Search the knowledge base (Command K)" aria-keyshortcuts="Meta+K Control+K"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><span>Search</span><kbd>&#8984;&nbsp;K</kbd></button>
  <div class="seg" role="group" aria-label="Appearance">
    <button type="button" data-theme-set="auto" aria-pressed="true">Auto</button>
    <button type="button" data-theme-set="light" aria-pressed="false">Light</button>
    <button type="button" data-theme-set="dark" aria-pressed="false">Dark</button>
  </div>
</header>
<div class="scrim"></div>
<div class="shell${noToc ? ' no-toc' : ''}">
  <nav class="sidebar" id="sidebar" aria-label="Site">
${sidebar(out, current)}
  </nav>
  <main id="main" class="article${wide ? ' wide' : ''}" tabindex="-1">
${bodyHtml}
  </main>
  ${tocHtml}
  <footer class="footer site-footer">
    <p>Independent and unofficial. Not affiliated with or endorsed by Anthropic.</p>
    <p>Checked against the official docs on Oct 22, 2026. Behavior in the app was not tested unless a page says so. <a href="${R}docs/verification-log.html">See the verification log</a>.</p>
    <p>Code is MIT licensed and written content is CC BY 4.0. <a href="${REPO_URL}">Source on GitHub</a>.</p>
  </footer>
</div>
<dialog class="search" id="searchDialog" aria-label="Search">
  <input class="search-input" id="searchInput" type="search" placeholder="Search the knowledge base…" aria-label="Search the knowledge base" autocomplete="off" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="searchResults">
  <ul class="results" id="searchResults" role="listbox" aria-label="Results"></ul>
  <p class="empty" id="searchEmpty" hidden>No matches. Try a shorter word.</p>
  <p class="sr-only" id="searchStatus" role="status"></p>
</dialog>
<p class="sr-only" id="live" role="status" aria-live="polite"></p>
<script src="${R}assets/search-index.js"></script>
<script src="${R}assets/site.js"></script>
</body>
</html>
`;
}

// ---------- page rendering ----------
const breadcrumbs = (from, trail) => `<nav class="crumbs" aria-label="Breadcrumb"><ol>${trail.map(([label, to], i) =>
  `<li><a href="${esc(relUrl(from, to))}"${i === trail.length - 1 ? ' aria-current="page"' : ''}>${esc(label)}</a></li>`).join('')}</ol></nav>`;

const card = (from, p, chips = []) =>
  `<li><a class="card" href="${esc(relUrl(from, p.out))}">${chips.map((c) => `<span class="chip">${esc(c)}</span>`).join('')}<b>${esc(p.title)}</b>${p.summary ? `<span class="sum">${esc(trunc(p.summary, 130))}</span>` : ''}</a></li>`;

function trailFor(p) {
  switch (p.kind) {
    case 'article': return [['Knowledge Base', 'kb/index.html'], [outline.areaBySlug.get(p.area).title, `kb/${p.area}/index.html`]];
    case 'learn': case 'track': return [['Learn', 'learn/start-here.html']];
    case 'capstone': return [['Learn', 'learn/start-here.html'], ['Capstones', 'capstones/index.html']];
    case 'rubric': return [['Learn', 'learn/start-here.html']];
    case 'cheatsheet': return [['Quick Reference', 'cheatsheets/index.html'], ['Cheatsheets', 'cheatsheets/index.html']];
    case 'template': return [['Quick Reference', 'templates/index.html'], ['Templates', 'templates/index.html']];
    case 'prompt': return [['Quick Reference', 'prompts/index.html'], ['Prompts', 'prompts/index.html']];
    case 'exercise': return [['About', 'exercises/index.html'], ['Exercises', 'exercises/index.html']];
    case 'docs': return [['About', 'docs/verification-log.html']];
    default: return [];
  }
}

function renderPage(p) {
  const env = { codeId: 0, used: new Set(), toc: [], path: p.out, src: p.src, modules: p.kind === 'learn' && /level-\d/.test(p.out) };
  const md = makeMarkdown(env);
  let html = md.render(p.body, env);
  const hasLead = p.kind !== 'docs' && p.kind !== 'exercise';
  let lead = '';
  if (hasLead) {
    const m = html.match(/^\s*<p>([\s\S]*?)<\/p>\n?/);
    if (m) { lead = `<p class="lead">${m[1]}</p>\n`; html = html.slice(m[0].length); }
  }
  const chips = [];
  if (p.kind === 'article') {
    chips.push(outline.areaBySlug.get(p.area).title, `Level ${p.data.level} · ${levelName(p.data.level)}`);
    if (p.data.time) chips.push(`${p.data.time} min`);
    chips.push(p.data.status === 'partial' ? 'Partly verified' : `Verified ${fmtDate(p.data.verified)}`);
  } else if (p.kind === 'learn' || p.kind === 'capstone') {
    if (p.data.level !== undefined && p.data.level !== '') chips.push(`Level ${p.data.level} · ${levelName(Number(p.data.level))}`);
    if (p.data.time) chips.push(`${p.data.time} min`);
  } else if (p.kind === 'track' && p.data.time) chips.push(`${p.data.time} min`);

  let progress = '';
  if (env.modules && env.toc.length) {
    progress = `<p class="progress" data-progress-keys="${esc(env.toc.map((h) => `${p.out}#${h.id}`).join(','))}"></p>\n`;
  }
  const hasSteps = env.toc.some((h) => h.id === 'steps');
  const actions = p.kind === 'article'
    ? `<div class="actions"><button class="btn-primary" type="button" data-done-key="${esc(p.out)}" aria-pressed="false">Mark as Done</button>${hasSteps ? '<a class="btn" href="#steps">Jump to Steps</a>' : ''}</div>\n`
    : '';

  let related = '';
  const toc = [...env.toc];
  if (p.kind === 'article') {
    const ids = [...new Set([...(p.entry.related || []), ...(p.data.related || [])])];
    const cards = ids.map((id) => outline.byId.get(id)).filter(Boolean)
      .map((e) => byOut.get(`kb/${e.area}/${e.slug}.html`)).filter(Boolean)
      .map((rp) => card(p.out, rp, [outline.areaBySlug.get(rp.area).title]));
    if (cards.length) { related = `<h2 id="related">Related</h2>\n<ul class="cards" role="list">${cards.join('')}</ul>\n`; toc.push({ id: 'related', text: 'Related' }); }
  }

  let pager = '';
  const sib = p.kind === 'article'
    ? articles.filter((a) => a.area === p.area)
    : (p.kind === 'learn' ? pages.filter((x) => x.kind === 'learn').sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99)) : []);
  if (sib.length > 1) {
    const i = sib.indexOf(p);
    const prev = sib[i - 1], next = sib[i + 1];
    const link = (q, label) => `<a href="${esc(relUrl(p.out, q.out))}"><small>${label}</small><span>${esc(q.title)}</span></a>`;
    if (prev || next) pager = `<nav class="pager" aria-label="Previous and next">${prev ? link(prev, 'Previous') : ''}${next ? link(next, 'Next') : ''}</nav>\n`;
  }

  const crumbs = breadcrumbs(p.out, [...trailFor(p), [p.title, p.out]]);
  const body = `<article>
${crumbs}
<h1>${esc(p.title)}</h1>
${lead}${chips.length ? `<ul class="meta" role="list" aria-label="Page details">${chips.map(chip).join('')}</ul>\n` : ''}${progress}${actions}${html}${related}${pager}</article>`;
  const wide = p.out === 'docs/verification-log.html' || p.kind === 'cheatsheet';
  return layout({ out: p.out, title: p.title, desc: p.summary, bodyHtml: body, toc, current: navKey(p), wide });
}

// ---------- generated index pages ----------
const generated = [];
const addGenerated = (out, title, bodyHtml, opts = {}) => generated.push({ out, title, summary: opts.summary || '', html: layout({ out, title, desc: opts.summary || title, bodyHtml, current: opts.current ?? out, wide: opts.wide, toc: opts.toc || [] }), search: opts.search !== false });

function collectionPage(out, title, blurb, items, chipsFor = () => []) {
  const body = `<article>
${breadcrumbs(out, [[title, out]])}
<h1>${esc(title)}</h1>
<p class="lead">${esc(blurb)}</p>
<ul class="cards" role="list">${items.map((p) => card(out, p, chipsFor(p))).join('')}</ul>
</article>`;
  addGenerated(out, title, body, { summary: blurb });
}

const byKind = (k) => pages.filter((p) => p.kind === k).sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99) || a.title.localeCompare(b.title));

// Home
{
  const out = 'index.html';
  const levelCards = outline.levels.map((l) => {
    const p = pages.find((x) => x.out === ['learn/level-0-orientation.html', 'learn/level-1-beginner.html', 'learn/level-2-intermediate.html', 'learn/level-3-advanced.html'][l.level]);
    const n = articles.filter((a) => a.data.level === l.level).length;
    return `<li><a class="card" href="${esc(relUrl(out, `learn/${['level-0-orientation', 'level-1-beginner', 'level-2-intermediate', 'level-3-advanced'][l.level]}.html`))}"><span class="chip">Level ${l.level}</span><b>${l.title}</b><span class="sum">${p ? esc(trunc(p.summary, 120)) : ''}${n ? ` ${n} articles.` : ''}</span></a></li>`;
  }).join('');
  const areaCards = outline.areas.filter((a) => !['recipes', 'decision-guides', 'terminal', 'troubleshooting'].includes(a.slug)).map((a) => {
    const n = articles.filter((x) => x.area === a.slug).length;
    return `<li><a class="card" href="${esc(relUrl(out, `kb/${a.slug}/index.html`))}"><span class="chip">${n} articles</span><b>${esc(a.title)}</b><span class="sum">${esc(a.blurb)}</span></a></li>`;
  }).join('');
  const quick = [
    ['Recipes', 'kb/recipes/index.html', 'Step-by-step playbooks for common jobs.'], ['Decision Guides', 'kb/decision-guides/index.html', 'Pick the right option fast.'],
    ['Terminal Tips', 'kb/terminal/index.html', 'The commands worth knowing.'], ['Troubleshooting', 'kb/troubleshooting/index.html', 'Symptoms and fixes.'],
    ['Cheatsheets', 'cheatsheets/index.html', 'Shortcuts, slash commands and terminal tips.'], ['Templates', 'templates/index.html', 'Files to copy: CLAUDE.md, skills, hooks and more.'],
    ['Prompts', 'prompts/index.html', 'Tested prompts by task.'], ['Glossary', 'kb/glossary.html', 'Terms, and terms to avoid.']
  ].map(([t, to, s]) => `<li><a class="card" href="${esc(relUrl(out, to))}"><b>${t}</b><span class="sum">${s}</span></a></li>`).join('');
  const body = `<article>
<section class="hero">
<h1>${SITE_TITLE}</h1>
<p class="lead">An unofficial, hands-on knowledge base and course for Claude Code, built around the desktop app's Code tab. It takes you from your first session to advanced workflows, with development, app building, process, optimization and workflow automation at the center.</p>
<div class="actions"><a class="btn-primary" href="${esc(relUrl(out, 'learn/start-here.html'))}">Start Here</a><a class="btn" href="${esc(relUrl(out, 'kb/index.html'))}">Browse the Knowledge Base</a></div>
</section>
<h2 id="levels">Learn by Level</h2>
<ul class="cards" role="list">${levelCards}</ul>
<h2 id="areas">Explore by Area</h2>
<ul class="cards" role="list">${areaCards}</ul>
<h2 id="reference">Quick Reference</h2>
<ul class="cards" role="list">${quick}</ul>
<h2 id="verified">How It Is Checked</h2>
<p>Claims about Claude Code and the desktop app were checked against the official docs on Oct 22, 2026, and the results are in the <a href="${esc(relUrl(out, 'docs/verification-log.html'))}">verification log</a>. Behavior in the app was not tested unless a page says so. Features that are in beta or research preview carry that label.</p>
</article>`;
  addGenerated(out, SITE_TITLE, body, { summary: 'An unofficial, hands-on Claude Code knowledge base and course.', toc: [] });
}

// Area indexes
for (const area of outline.areas) {
  const out = `kb/${area.slug}/index.html`;
  const list = articles.filter((a) => a.area === area.slug);
  const groups = outline.levels.map((l) => {
    const rows = list.filter((a) => a.data.level === l.level);
    if (!rows.length) return '';
    return `<h2 id="level-${l.level}">Level ${l.level} · ${l.title}</h2>\n<ul class="rows" role="list">${rows.map((a) => `<li><a href="${esc(relUrl(out, a.out))}"><span class="t">${esc(a.title)}</span><small>${a.data.time} min${a.data.status === 'partial' ? ' · partly verified' : ''}</small></a></li>`).join('')}</ul>`;
  }).join('\n');
  const toc = outline.levels.filter((l) => list.some((a) => a.data.level === l.level)).map((l) => ({ id: `level-${l.level}`, text: `Level ${l.level} · ${l.title}` }));
  const body = `<article>
${breadcrumbs(out, [['Knowledge Base', 'kb/index.html'], [area.title, out]])}
<h1>${esc(area.title)}</h1>
<p class="lead">${esc(area.blurb)} ${list.length} articles.</p>
${groups}
</article>`;
  addGenerated(out, area.title, body, { summary: area.blurb, toc });
}

// All articles, with filters
{
  const out = 'kb/index.html';
  const opt = (v, t) => `<option value="${esc(v)}">${esc(t)}</option>`;
  const trackOpts = tracks.map((tp) => opt(trackKey(tp), tp.title));
  const rows = articles.map((a) => {
    const tr = [...trackMembers.entries()].filter(([, ids]) => ids.has(a.entry.id)).map(([k]) => k);
    const tags = (a.data.tags || []).join(', ');
    return `<tr data-row data-area="${a.area}" data-level="${a.data.level}" data-tracks="${tr.join(' ')}" data-text="${esc(`${a.title} ${tags} ${a.summary}`.toLowerCase())}"><td><a href="${esc(relUrl(out, a.out))}">${esc(a.title)}</a></td><td>${esc(outline.areaBySlug.get(a.area).title)}</td><td>${a.data.level}</td><td>${a.data.time} min</td><td>${esc(tags)}</td></tr>`;
  }).join('');
  const body = `<article>
${breadcrumbs(out, [['Knowledge Base', out]])}
<h1>All Articles</h1>
<p class="lead">Every article, by area, level and track. Use the filters to narrow the list.</p>
<div class="filters" role="group" aria-label="Filters">
<label>Search<input type="search" data-filter="q" placeholder="Filter by word…"></label>
<label>Area<select data-filter="area"><option value="">All areas</option>${outline.areas.map((a) => opt(a.slug, a.title)).join('')}</select></label>
<label>Level<select data-filter="level"><option value="">All levels</option>${outline.levels.map((l) => opt(String(l.level), `Level ${l.level} · ${l.title}`)).join('')}</select></label>
<label>Track<select data-filter="track"><option value="">All tracks</option>${trackOpts.join('')}</select></label>
</div>
<p class="progress" id="filterStatus" role="status"></p>
<div class="table-wrap"><table><thead><tr><th scope="col">Title</th><th scope="col">Area</th><th scope="col">Level</th><th scope="col">Time</th><th scope="col">Tags</th></tr></thead><tbody>${rows}</tbody></table></div>
</article>`;
  addGenerated(out, 'All Articles', body, { summary: 'Every article, by area, level and track.', wide: true });
}

// Collections
collectionPage('learn/index.html', 'Learning Tracks', 'Three ordered reading paths through the knowledge base, each focused on one area of practice.', tracks.sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99)), (p) => (p.data.time ? [`${p.data.time} min`] : []));
collectionPage('capstones/index.html', 'Capstones', 'One project at the end of each level, plus an advanced pair. Try each before you open the solution.', byKind('capstone'), (p) => (p.data.level !== undefined ? [`Level ${p.data.level}`] : []));
collectionPage('cheatsheets/index.html', 'Cheatsheets', 'Short tables to keep open while you work.', byKind('cheatsheet'));
collectionPage('templates/index.html', 'Templates', 'Files to copy and adapt: instructions, skills, subagents, hooks, specs and more.', byKind('template'));
collectionPage('prompts/index.html', 'Prompts', 'Prompts you can paste into a session, by task.', byKind('prompt'));
collectionPage('exercises/index.html', 'Exercises', 'The sample project, its solutions and the optimization worksheet.', byKind('exercise'));

// ---------- write ----------
rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, 'assets'), { recursive: true });
const write = (rel, text) => { mkdirSync(dirname(join(OUT, rel)), { recursive: true }); writeFileSync(join(OUT, rel), text); };

let count = 0;
const searchIndex = [];
for (const p of pages) {
  write(p.out, renderPage(p));
  count++;
  const area = p.kind === 'article' ? outline.areaBySlug.get(p.area).title : p.kind === 'docs' ? 'About' : p.kind[0].toUpperCase() + p.kind.slice(1);
  searchIndex.push([p.title, area, p.out, (p.data.tags || []).join(' '), trunc(p.summary, 160)]);
}
for (const g of generated) {
  write(g.out, g.html);
  count++;
  if (g.search && g.out !== 'index.html') searchIndex.push([g.title, 'Index', g.out, '', trunc(g.summary, 160)]);
}
write('assets/search-index.js', `window.SEARCH_INDEX=${JSON.stringify(searchIndex)};\n`);
for (const f of ['tokens.css', 'site.css', 'site.js']) cpSync(join(ROOT, 'site-src', f), join(OUT, 'assets', f));
write('.nojekyll', '');
write('404.html', `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Page Not Found · ${SITE_TITLE}</title><link rel="stylesheet" href="${BASE_404}assets/tokens.css"><link rel="stylesheet" href="${BASE_404}assets/site.css"></head><body><main class="article" style="margin:4rem auto"><h1>Page Not Found</h1><p class="lead">That page does not exist, or it moved.</p><p><a class="btn-primary" href="${BASE_404}index.html">Go to the Home Page</a></p></main></body></html>\n`);

// Exercise code is copied as-is so learners can download it from the site.
if (existsSync(join(ROOT, 'exercises'))) {
  cpSync(join(ROOT, 'exercises'), join(OUT, 'exercises'), {
    recursive: true,
    filter: (src) => { const r = src.slice(ROOT.length + 1); return !src.includes('node_modules') && (!r.endsWith('.md') || RAW_MD.has(r)); }
  });
}

console.log(`built ${count} pages and ${searchIndex.length} search entries into site/`);
