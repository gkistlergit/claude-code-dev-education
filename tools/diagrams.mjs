// SVG diagram generators in the site's style. Colors come from the CSS classes in site-src/site.css,
// so every diagram follows light and dark mode and the same tokens as the rest of the site.

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * A numbered flow of steps. Draws a wide version (three steps per row) and a narrow
 * vertical version; the page's container query shows whichever fits.
 * steps: [{ t: 'Title (about 20 characters max)', s: 'Subtitle (about 24 characters max)' }]
 */
export function flowDiagram({ id, title, steps, highlight = -1 }) {
  const n = steps.length;
  const desc = `${title}. ${steps.map((st, i) => `${i + 1} ${st.t}, ${st.s}${i === highlight ? ' (outlined as the step that needs you)' : ''}`).join('; ')}.`;

  // Wide: 3 columns.
  const W = 704, nw = 200, nh = 64, gx = 52, gy = 64;
  const rows = Math.ceil(n / 3);
  const H = 20 + rows * nh + (rows - 1) * gy;
  const pos = (i) => ({ x: (i % 3) * (nw + gx), y: 10 + Math.floor(i / 3) * (nh + gy) });
  let wide = `<svg class="diagram-wide" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="${id}-wt ${id}-wd">` +
    `<title id="${id}-wt">${esc(title)}</title><desc id="${id}-wd">${esc(desc)}</desc>` +
    `<defs><marker id="${id}-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="arrowhead" d="M0 0L10 5L0 10z"/></marker></defs>`;
  steps.forEach((st, i) => {
    const { x, y } = pos(i);
    wide += `<rect class="${i === highlight ? 'node-key' : 'node'}" x="${x}" y="${y}" width="${nw}" height="${nh}" rx="16"/>` +
      `<circle class="f-ink" cx="${x + 26}" cy="${y + 32}" r="13"/><text class="badge-text" x="${x + 26}" y="${y + 36.5}" text-anchor="middle">${i + 1}</text>` +
      `<text class="node-text" x="${x + 52}" y="${y + 29}">${esc(st.t)}</text><text class="node-sub" x="${x + 52}" y="${y + 48}">${esc(st.s)}</text>`;
  });
  for (let i = 0; i < n - 1; i++) {
    const a = pos(i), b = pos(i + 1);
    if (a.y === b.y) wide += `<path class="edge" d="M${a.x + nw} ${a.y + 32}H${b.x - 4}" marker-end="url(#${id}-ah)"/>`;
    else {
      const ax = a.x + nw / 2, bx = b.x + nw / 2, mid = a.y + nh + gy / 2;
      wide += `<path class="edge" d="M${ax} ${a.y + nh}V${mid}H${bx}V${b.y - 4}" marker-end="url(#${id}-ah)"/>`;
    }
  }
  wide += '</svg>';

  // Narrow: one column.
  const nW = 300, nnh = 60, step = 88;
  const nH = 16 + (n - 1) * step + nnh;
  let narrow = `<svg class="diagram-narrow" viewBox="0 0 ${nW} ${nH}" role="img" aria-labelledby="${id}-nt ${id}-nd">` +
    `<title id="${id}-nt">${esc(title)}</title><desc id="${id}-nd">${esc(desc)}</desc>` +
    `<defs><marker id="${id}-ahn" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="arrowhead" d="M0 0L10 5L0 10z"/></marker></defs>`;
  steps.forEach((st, i) => {
    const y = 8 + i * step;
    narrow += `<rect class="${i === highlight ? 'node-key' : 'node'}" x="10" y="${y}" width="280" height="${nnh}" rx="16"/>` +
      `<circle class="f-ink" cx="36" cy="${y + 30}" r="13"/><text class="badge-text" x="36" y="${y + 34.5}" text-anchor="middle">${i + 1}</text>` +
      `<text class="node-text" x="62" y="${y + 27}">${esc(st.t)}</text><text class="node-sub" x="62" y="${y + 46}">${esc(st.s)}</text>`;
    if (i < n - 1) narrow += `<path class="edge" d="M150 ${y + nnh}V${y + step - 4}" marker-end="url(#${id}-ahn)"/>`;
  });
  narrow += '</svg>';

  return `<div class="diagram">${wide}${narrow}</div>`;
}

/** The context window as a filling box. Proportions are illustrative, not measured. */
export function contextDiagram({ id }) {
  const segs = [
    ['Instructions and memory', 38, 'seg-a'],
    ['Your prompts', 30, 'seg-b'],
    ['File reads', 78, 'seg-a'],
    ['Tool output', 70, 'seg-b'],
    ['Subagent summaries', 22, 'seg-a'],
    ['Free space', 42, null]
  ];
  const x = 20, y0 = 14, w = 150, inset = 10;
  const total = segs.reduce((s, g) => s + g[1], 0);
  const innerH = total;
  const H = y0 + innerH + inset * 2 + 14;
  const desc = `A box that represents the context window, filling from the top with ${segs.slice(0, -1).map((s) => s[0].toLowerCase()).join(', ')}, with free space left at the bottom. Sizes are illustrative.`;
  let svg = `<svg viewBox="0 0 520 ${H}" role="img" aria-labelledby="${id}-t ${id}-d" style="max-width:34rem;margin-inline:auto">` +
    `<title id="${id}-t">What fills the context window</title><desc id="${id}-d">${esc(desc)}</desc>` +
    `<rect class="node" x="${x}" y="${y0}" width="${w}" height="${innerH + inset * 2}" rx="20"/>`;
  let y = y0 + inset;
  for (const [label, h, cls] of segs) {
    const mid = y + h / 2;
    if (cls) svg += `<rect class="${cls}" x="${x + inset}" y="${y + 1}" width="${w - inset * 2}" height="${h - 2}" rx="8"/>`;
    else svg += `<rect class="s-line" x="${x + inset}" y="${y + 1}" width="${w - inset * 2}" height="${h - 2}" rx="8" stroke-dasharray="5 4" stroke-width="1.5"/>`;
    svg += `<path class="edge" d="M${x + w} ${mid}H${x + w + 28}" stroke-width="1.5"/>` +
      `<text class="node-text" x="${x + w + 40}" y="${mid + 5}" style="font-size:15px">${esc(label)}</text>`;
    y += h;
  }
  svg += '</svg>';
  return `<div class="diagram">${svg}</div>`;
}
