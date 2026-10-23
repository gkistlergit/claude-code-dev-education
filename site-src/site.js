(() => {
  const root = document.documentElement;
  const body = document.body;
  const safe = (fn, fallback) => { try { return fn(); } catch { return fallback; } };
  const siteRoot = document.querySelector('meta[name="site-root"]')?.content || './';

  /* One polite live region for short announcements. */
  const live = document.getElementById('live');
  const announce = (msg) => {
    if (!live) return;
    live.textContent = '';
    setTimeout(() => { live.textContent = msg; }, 50);
  };

  /* Theme: auto follows the system; light and dark are explicit. */
  const themeButtons = document.querySelectorAll('[data-theme-set]');
  const applyTheme = (t) => {
    if (t === 'light' || t === 'dark') root.dataset.theme = t; else delete root.dataset.theme;
    themeButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.themeSet === (t || 'auto'))));
  };
  applyTheme(root.dataset.theme || 'auto');
  themeButtons.forEach((b) => b.addEventListener('click', () => {
    applyTheme(b.dataset.themeSet);
    safe(() => localStorage.setItem('theme', b.dataset.themeSet));
  }));

  /* Mobile drawer: focus moves in, Esc closes, everything behind is inert. */
  const navToggle = document.getElementById('navToggle');
  const sidebar = document.getElementById('sidebar');
  const main = document.getElementById('main');
  const behind = () => document.querySelectorAll('main, .toc, .site-footer');
  const setNav = (open, { restoreFocus = false } = {}) => {
    body.classList.toggle('nav-open', open);
    navToggle?.setAttribute('aria-expanded', String(open));
    behind().forEach((el) => { el.inert = open; });
    if (open) sidebar?.querySelector('a')?.focus();
    else if (restoreFocus) navToggle?.focus();
  };
  navToggle?.addEventListener('click', () => setNav(!body.classList.contains('nav-open'), { restoreFocus: true }));
  document.querySelector('.scrim')?.addEventListener('click', () => setNav(false, { restoreFocus: true }));
  sidebar?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
    if (!body.classList.contains('nav-open')) return;
    setNav(false);
    main?.focus({ preventScroll: true });
  }));
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && body.classList.contains('nav-open')) setNav(false, { restoreFocus: true });
  });
  matchMedia('(min-width: 901px)').addEventListener('change', (e) => { if (e.matches) setNav(false); });

  /* Copy buttons: the label is cached once so a quick second click can't strand it. */
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    const label = btn.textContent;
    let timer;
    btn.addEventListener('click', async () => {
      const target = document.getElementById(btn.dataset.copy);
      if (!target) return;
      try {
        await navigator.clipboard.writeText(target.innerText.trim());
        btn.textContent = 'Copied';
        announce('Copied to clipboard');
      } catch {
        const range = document.createRange();
        range.selectNodeContents(target);
        const sel = getSelection(); sel.removeAllRanges(); sel.addRange(range);
        btn.textContent = 'Press Command-C';
        announce('Press Command-C to copy');
      }
      clearTimeout(timer);
      timer = setTimeout(() => { btn.textContent = label; }, 1800);
    });
  });

  /* Progress: labels stay fixed and aria-pressed carries the state. Stored per browser only. */
  const doneKey = (el) => 'done:' + el.dataset.doneKey;
  const doneButtons = [...document.querySelectorAll('[data-done-key]')];
  const updateProgress = () => {
    document.querySelectorAll('[data-progress-keys]').forEach((el) => {
      const keys = el.dataset.progressKeys.split(',').filter(Boolean);
      const n = keys.filter((k) => safe(() => localStorage.getItem('done:' + k) === '1', false)).length;
      el.textContent = `${n} of ${keys.length} modules done on this device`;
    });
  };
  doneButtons.forEach((btn) => {
    btn.setAttribute('aria-pressed', String(safe(() => localStorage.getItem(doneKey(btn)) === '1', false)));
    btn.addEventListener('click', () => {
      const on = btn.getAttribute('aria-pressed') !== 'true';
      btn.setAttribute('aria-pressed', String(on));
      safe(() => localStorage.setItem(doneKey(btn), on ? '1' : '0'));
      updateProgress();
    });
  });
  updateProgress();

  /* Table of contents: the current section is the last heading above the sticky offset. */
  const tocLinks = [...document.querySelectorAll('.toc a')];
  if (tocLinks.length) {
    const ids = tocLinks.map((a) => a.getAttribute('href').slice(1));
    const mark = (id) => tocLinks.forEach((a) => {
      if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
    let timer = 0;
    const update = () => {
      timer = 0;
      const offset = parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
      let current = ids[0];
      ids.forEach((id) => {
        const h = document.getElementById(id);
        if (h && h.getBoundingClientRect().top <= offset + 8) current = id;
      });
      if (innerHeight + scrollY >= root.scrollHeight - 2) current = ids[ids.length - 1];
      mark(current);
    };
    addEventListener('scroll', () => { if (!timer) timer = setTimeout(update, 50); }, { passive: true });
    update();
  }

  /* Filters on the article index. */
  const filterEls = [...document.querySelectorAll('[data-filter]')];
  if (filterEls.length) {
    const rows = [...document.querySelectorAll('[data-row]')];
    const status = document.getElementById('filterStatus');
    const apply = () => {
      const v = Object.fromEntries(filterEls.map((el) => [el.dataset.filter, el.value.trim().toLowerCase()]));
      let shown = 0;
      rows.forEach((r) => {
        const ok = (!v.area || r.dataset.area === v.area)
          && (!v.level || r.dataset.level === v.level)
          && (!v.track || (r.dataset.tracks || '').split(' ').includes(v.track))
          && (!v.q || r.dataset.text.includes(v.q));
        r.hidden = !ok;
        if (ok) shown++;
      });
      if (status) status.textContent = `${shown} of ${rows.length} articles`;
    };
    filterEls.forEach((el) => el.addEventListener('input', apply));
    apply();
  }

  /* Search: Command-K, a combobox with a listbox of results. */
  const dlg = document.getElementById('searchDialog');
  const input = document.getElementById('searchInput');
  const list = document.getElementById('searchResults');
  const empty = document.getElementById('searchEmpty');
  const status = document.getElementById('searchStatus');
  const index = (window.SEARCH_INDEX || []).map(([title, area, url, tags, summary]) => ({
    title, area, url: siteRoot + url, hay: `${title} ${area} ${tags} ${summary}`.toLowerCase(), t: title.toLowerCase(), g: tags.toLowerCase()
  }));
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  let active = 0;
  const render = () => {
    const words = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const hits = index
      .filter((it) => words.every((w) => it.hay.includes(w)))
      .map((it) => ({ it, score: words.reduce((s, w) => s + (it.t.includes(w) ? 3 : 0) + (it.g.includes(w) ? 2 : 0), 0) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 25)
      .map((h) => h.it);
    active = Math.min(active, Math.max(hits.length - 1, 0));
    list.innerHTML = hits.map((h, i) =>
      `<li role="none"><a href="${esc(h.url)}" role="option" tabindex="-1" id="r${i}" aria-selected="${i === active}"><span>${esc(h.title)}</span><small>${esc(h.area)}</small></a></li>`).join('');
    empty.hidden = hits.length > 0;
    status.textContent = hits.length ? `${hits.length} result${hits.length === 1 ? '' : 's'}` : 'No matches';
    if (hits.length) input.setAttribute('aria-activedescendant', 'r' + active);
    else input.removeAttribute('aria-activedescendant');
    list.children[active]?.scrollIntoView({ block: 'nearest' });
  };
  const open = () => {
    if (!dlg || dlg.open) return;
    input.value = ''; active = 0; render();
    dlg.showModal();
    input.setAttribute('aria-expanded', 'true');
    input.focus();
  };
  const closeDlg = () => { dlg.close(); input.setAttribute('aria-expanded', 'false'); };
  dlg?.addEventListener('close', () => input.setAttribute('aria-expanded', 'false'));
  document.getElementById('searchBtn')?.addEventListener('click', open);
  addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open(); }
  });
  input?.addEventListener('input', () => { active = 0; render(); });
  input?.addEventListener('keydown', (e) => {
    const n = list.children.length;
    if (e.key === 'ArrowDown' && n) { e.preventDefault(); active = (active + 1) % n; render(); }
    if (e.key === 'ArrowUp' && n) { e.preventDefault(); active = (active - 1 + n) % n; render(); }
    if (e.key === 'Enter') {
      e.preventDefault();
      const a = list.querySelector('[aria-selected="true"]');
      closeDlg();
      if (a) a.click();
    }
  });
  list?.addEventListener('click', closeDlg);
  dlg?.addEventListener('click', (e) => { if (e.target === dlg) closeDlg(); });
})();
