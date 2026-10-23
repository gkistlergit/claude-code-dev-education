# Design System

The site follows the principles of Apple's Human Interface Guidelines, translated to the web. It borrows the ideas, not the brand: no Apple or Anthropic logos, no proprietary fonts or assets. The goal is a site that feels at home on a Mac and is easy to read for a long time.

Tokens live in `site-src/tokens.css`, styles in `site-src/site.css`, behavior in `site-src/site.js`. `tools/build.mjs` copies them into the built site. `tools/contrast.mjs` checks every text and control pair in both themes.

## Principles

- **Two layers.** The content layer (articles, cards, tables) is opaque. Only the functional layer, the top bar and the mobile navigation drawer, uses a translucent material, with a solid fallback for browsers without backdrop filters and for readers who ask for reduced transparency.
- **Monochrome chrome, one accent.** Navigation, controls and icons use neutral labels and fills. The blue accent marks links, selection, the focus ring, and at most one prominent action per page, such as Mark as Done.
- **Concentric corners.** A container has a 20px radius and an 8px inset, so the shapes inside it use a 12px radius. The relationship is a token (`--r-inner = --r-outer - --inset`), not a set of magic numbers.
- **Type that scales.** The system font stack, an SF-like scale in `rem` (so browser text-size settings apply), regular weight or heavier, and a large-title hierarchy.
- **Quiet motion.** Short, eased transitions on state changes only. All motion stops when the reader asks for reduced motion.

## Tokens

| Group | Tokens |
|---|---|
| Surfaces | `--bg`, `--bg-2`, `--bg-3`, `--bg-glass`, `--bg-glass-solid`, `--fill` |
| Text | `--label`, `--label-2` (secondary), `--label-3` (icons and rules only) |
| Lines | `--separator`, `--separator-opaque` |
| Accent | `--accent` (fills), `--link` (text), `--selection`, `--focus` |
| Callouts | `--warn-*`, `--ok-*`, `--tip-*`, `--term-*` (each has `bg`, `fg`, `border`) |
| Shape | `--r-outer` 1.25rem, `--inset` 0.5rem, `--r-inner`, `--r-pill` |
| Type | `--t-large-title` 2.125rem (2.5rem from 1100px), `--t-title-2` 1.375rem, `--t-title-3` 1.25rem, `--t-body` 1.0625rem, `--t-callout` 1rem, `--t-subhead` 0.9375rem, `--t-footnote` 0.8125rem, `--t-caption` 0.75rem |
| Targets | `--hit` 2.25rem for fine pointers and 2.75rem for coarse pointers |

Colors are defined once with `light-dark()`, and the theme switch sets `color-scheme`. Increased-contrast and reduced-transparency preferences override the relevant tokens.

## Components

- **Top bar:** glass, sticky, with the menu button (small screens), the site name, search, and the Auto, Light and Dark switch.
- **Sidebar:** inset grouped lists. On small screens it becomes a drawer that moves focus in, closes on Escape, and makes the page behind it inert.
- **Article:** large title, lead paragraph, detail chips, one prominent action, numbered step cards, callouts (Terminal Tip, Pro Tip, Warning, Observed in the App), code blocks with a copy button, tables, diagrams, a checkpoint with a hidden answer, related cards, previous and next links.
- **Search:** Command-K opens a dialog with a combobox and a listbox of results. Arrow keys move, Enter follows the link, Escape closes.
- **Diagrams:** generated SVG. Each flow has a wide layout and a narrow vertical layout, and a container query shows the one that fits.

## Accessibility

- Text pairs meet 4.5:1 and control pairs meet 3:1 in light and dark, checked by `npm run contrast`.
- Every control works with the keyboard and has a visible focus ring.
- Landmarks: one `main`, labelled navigation regions, a `contentinfo` footer. Callouts are `role="note"`, not landmarks.
- Layouts work from 375px wide up. Print styles hide navigation.
- Forced-colors mode gets borders and outlines for states that otherwise rely on background color.

## Review log

The first sample page was reviewed against the Web Interface Guidelines and a WCAG 2.2 AA checklist before the site was built. Fifteen findings were fixed:

1. The search listbox now has valid roles, a live result count, a `status` message for no matches, and Enter follows the active result.
2. The drawer moves focus in, closes on Escape and returns focus to its button, and the page behind it is inert with scroll locked.
3. Copy buttons have specific names, announce the result, and no longer get stuck on "Copied".
4. Focus rings are no longer clipped by the code block or the table of contents.
5. Mark as Done keeps a fixed label and uses `aria-pressed`.
6. Sidebar group titles are no longer headings before the page title, callouts are notes, the table of contents is navigation, and the footer is a landmark.
7. Diagrams switch layout by the width of their container, so labels stay readable at every size.
8. Forced-colors and increased-contrast rules were added, along with safe-area insets, `theme-color`, `touch-action` and `overscroll-behavior`.
9. The details marker was restored as a chevron, and segmented buttons meet their stated target size.
10. The table of contents highlight follows the sticky offset and handles the last section.

Not tested: screen readers, Safari and Firefox, and Windows high-contrast rendering. The forced-colors rules are written but untested.
