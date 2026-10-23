---
title: UI and Design Systems with Claude
id: P05
area: app-development
level: 2
time: 9
tags: [ui, design-system, accessibility]
verified: 2026-10-23
status: verified
sources:
  - https://code.claude.com/docs/en/desktop#preview-your-app
  - https://code.claude.com/docs/en/best-practices
  - https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties
  - https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-color-scheme
  - https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/light-dark
  - https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
  - https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
  - https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html
  - https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html
  - https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
related: [P07, A06, D03]
---

A design system for a small app can be one file of named values and a checklist that a script or a person can fail. Ask Claude to critique your interface against the checklist, and you get findings you can verify in place of opinions about taste.

## When to Use It

Use it when the interface works but looks unplanned, when you are adding dark mode, or before you let other people use the app. It suits a framework-free app because the whole system fits in one stylesheet.

## Steps

1. **Move** every color, size, spacing step and corner radius into named custom properties (design tokens) at the top of `style.css`, before you touch any component. MDN's [guide to custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties) covers the syntax and explains why defining a value once beats repeating it.

   ```prompt
   Read @style.css. Replace each hard-coded color, font size, spacing value and radius with a custom property defined once in :root. Change no visual result. List the tokens you made.
   ```

2. **Define** each color token for light and dark. Two approaches work: override the tokens inside `@media (prefers-color-scheme: dark)`, or use the CSS `light-dark()` function with `color-scheme`. MDN describes `prefers-color-scheme` as the way to detect a user's light or dark request and `light-dark()` as returning one of two colors for the active scheme.

   ```css
   :root {
     color-scheme: light dark;
     --bg: light-dark(#ffffff, #1c1c1e);
     --text: light-dark(#1d1d1f, #f5f5f7);
     --accent: light-dark(#0066cc, #2997ff);
     --gap: 0.75rem;
     --radius: 0.5rem;
   }
   ```

3. **Run** the screenshot loop in the Browser pane. The desktop docs say Claude can take screenshots, inspect the DOM, click elements and fill forms while it checks your app. The best-practices guide adds the loop: have Claude screenshot the result, compare it with the original, list differences and fix them. Drag the pane's edge to narrow it to phone width.
4. **Prompt** a critique against a named checklist. The WCAG 2.2 success criteria below make a good one.

   ```prompt
   Review @index.html and @style.css against this checklist only: 1.4.3 text contrast of at least 4.5:1, 1.4.11 contrast of at least 3:1 for controls and their states, 2.1.1 everything works from the keyboard, 2.4.7 keyboard focus is visible, 2.5.8 pointer targets are at least 24 by 24 CSS pixels unless spacing makes up for it. For each item say pass, fail or cannot tell, quote the line, and change nothing.
   ```

5. **Press** Tab through the app yourself in the Browser pane, where you can use the running app directly. Every control should be reachable, show where focus is, and work with Enter or Space.
6. **Fix** failures one at a time and re-run the loop after each. Switch your Mac to dark mode and look again. The docs do not say whether the Browser pane follows the system appearance, so confirm it before you trust the result.
7. **Prompt** Claude to turn the contrast items into a script: a zero-dependency Node file that reads the token pairs and fails when a pair is under its threshold. Add it to the checks you already run. [Testing Without a Framework](testing-without-a-framework.md) shows the runner.

## Worked Example

This site is the case study. Its design system lives in `docs/design-system.md` in the repository. Tokens sit in one stylesheet. Each color is defined once with `light-dark()`, and a script checks every text and control pair in both themes against 4.5:1 for text and 3:1 for controls. The document also keeps a review log of what a checklist found and what was fixed, and it ends by listing what was not tested: screen readers, Safari and Firefox, and Windows high-contrast rendering.

Copy two habits: put the values in one place, and let a script do the arithmetic. Then write down what your checks do not cover. For Trail Notes, run the critique prompt above on the starter and read the failures before you ask for any fixes.

## Pitfalls

- "Make it prettier" gives Claude no test to pass. A named checklist gives it a finish line.
- You pick colors by eye. A pair that looks fine on your screen can fail a contrast ratio, so let a script compute it.
- You test only light mode. Each token needs a dark value, and each pair needs its own check.
- Translucent surfaces can change the colors a person actually sees, which a token table does not show. Look at the screenshot as well as the numbers.
- Touch targets below the WCAG minimum are easy to miss in a desktop preview. Narrow the pane to phone width and check target sizes there, or test on a real phone.
- A passing script is not an accessibility audit. Automated checks cannot tell you how a screen reader reads the page.

## Checkpoint

Why move values into tokens before you restyle any component?

<details><summary>Show the answer</summary>

With tokens, a color or size change is a one-line edit and every component follows it. A script can also read the token file and check contrast for every pair at once, which it cannot do when the values are scattered through the stylesheet.

</details>
