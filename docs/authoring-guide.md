# Authoring Guide

How to write and review pages in this knowledge base. Follow it exactly. `tools/check.mjs` enforces the mechanical parts.

## Audience and scope

Readers are Mac users with some programming exposure and little terminal experience. The Claude desktop app's Code tab is the primary interface. Add a Terminal tip only where the terminal is faster, required, or unlocks something deeper, and explain every command in it.

The content weights five areas: development, app development, process, optimization and workflow optimization. The desktop-app reference supports them.

## Voice

- Plain and direct. Second person ("you"). Short paragraphs. No hype.
- Lead with the result or the action.
- US spelling. Write "Claude Code" for the product and "the desktop app" or "the Code tab" for the app.
- Headings in Title Case ("When to Use It"). Body text in sentence case.
- Avoid the usual signs of machine writing:
  - no "not X but Y" contrasts used for effect, no forced lists of three, no rhetorical questions as openers, no closing line that restates the page;
  - no stock words such as robust, seamless, leverage, delve, crucial, powerful, unlock, game-changer, streamline, dive into;
  - no bold labels in running prose (bold only the action verbs in Steps, and glossary terms);
  - at most one em dash per page, and no emoji.
- Never say or imply endorsement by Anthropic.

## Front matter

Every page under `kb/` starts with this block. The title must equal the title in `kb/outline.json`.

```md
---
title: Plan Mode: Think Before You Edit
id: D02
area: development
level: 1
time: 6
tags: [plan-mode, permissions]
verified: 2026-10-22
status: verified
sources:
  - https://code.claude.com/docs/en/permission-modes
related: [A05, DG02, D03]
---
```

- `time` is the reading time in minutes.
- `status` is `verified` or `partial`. Use `partial` when part of the topic is not in the docs.
- `sources` lists the doc pages you actually read, as full URLs.
- `related` copies the IDs from the outline entry. Add up to two more if they truly help.
- The parser is simple: `key: value`, inline lists in brackets, and `- ` lists for `sources`. Do not use other YAML.

Pages under `learn/`, `capstones/`, `assessment/`, `cheatsheets/`, `templates/`, `prompts/` and `kb/glossary.md` use the same block with `kind` instead of `area` and `id`, and the keys listed for them in the brief for that page type.

## Body structure

The first paragraph is the summary: one to three sentences, and it becomes the page description. Then these H2 headings, in this order, with these exact names:

1. `## When to Use It`
2. One of: `## Steps`, `## How It Works`, `## Decision Table`, `## Symptoms and Fixes`, `## Measure It`
3. `## Worked Example` (optional for pure reference pages)
4. `## Pitfalls`
5. `## Checkpoint`

Do not add a Related section. The builder renders related articles and previous and next links from front matter.

Length: 400 to 1,200 words, usually 500 to 800.

### Steps

A numbered list. Each item starts with a bold action verb: **Click**, **Choose**, **Type**, **Prompt**, **Run**, **Check**, **Open**, **Press**. Name controls exactly as the docs do. Put anything the reader types into Claude in a fenced block tagged `prompt`. Put shell commands in a fenced block tagged `terminal`.

### Worked Example

A concrete scenario. Use the sample project, Trail Notes, or an anonymized pattern from `docs/patterns-from-practice.md`. Show what the reader types and what to look for.

### Checkpoint

One or two questions. Put the answer inside `<details><summary>Show the answer</summary>` followed by the answer text and `</details>`.

## Callouts

A blockquote whose first line is a bold label. Allowed labels: `Terminal tip`, `Pro tip`, `Warning`, `Observed in the app`.

````md
> **Terminal tip**
> `claude` starts a session in the folder you are in. This flag picks the starting mode.
>
> ```terminal
> claude --permission-mode plan
> ```
````

Use `Observed in the app` for behavior the app shows but the docs do not describe (see the last section of `docs/verification-log.md`). Say plainly that the docs do not cover it and that it may change.

## Code blocks

Fence tags: `prompt`, `terminal`, `js`, `json`, `md`, `yaml`, `text`. No `$` prompts. Show expected output in a separate `text` block.

## Verification rules

- Every claim about Claude Code, the desktop app or the CLI must trace to `docs/verification-log.md` or to a page you fetched from https://code.claude.com/docs/en/. Fetch with `curl -sL https://code.claude.com/docs/en/<page>.md`. If that fails, use WebFetch. List the pages you used in `sources`.
- Set `verified: 2026-10-22` only for claims you checked against the docs. Nobody tested runtime behavior. Describe the interface by the names the docs use.
- Print labels exactly as the log lists them: research preview, public beta, beta, experimental, removed, deprecated.
- Flags documented but absent from CLI 2.1.304 help are not taught as working. Do not teach `--max-turns`.
- Never invent numbers: prices, limits, token counts, speeds or percentages. Use numbers only from the docs, from `docs/usage-audit.md`, or from your own arithmetic. If the docs give no limit, tell the reader where to look.
- Do not recommend anything that costs money beyond the Claude subscription the reader already has.
- For third-party tools (GitHub, Cloudflare, Node, browsers), check the tool's official docs, keep specifics minimal, and link them.

## Examples and case studies

- Hands-on steps use the sample project Trail Notes: a small framework-free notes app. Its files are `index.html`, `style.css`, `app.js`, `notes.js`, `manifest.webmanifest` and later `sw.js`, with zero-dependency checks in `checks/`. Starters live in `exercises/trail-notes-starter/` and solutions in `exercises/trail-notes-solutions/`.
- Real-workflow case studies come only from `docs/patterns-from-practice.md` and `docs/usage-audit.md`. Call them "the author's setup".
- Never write a real company, customer or person name, an internal URL, an email address, a local path such as `/Users/...`, the name of any private project, or the name of any GitHub account. Use stand-ins such as "a schedule app" or "a search tool over a document corpus".

## Links

Use relative markdown links with the `.md` extension and the exact slugs in `kb/outline.json`. From `kb/development/` to `kb/app/permission-modes-explained.md`:

```md
[Permission Modes Explained](../app/permission-modes-explained.md)
```

Links to templates, prompts, exercises and learn pages are relative too. External links go only to official docs and the tools' own docs. The builder turns `.md` into `.html`. `tools/check.mjs` fails on any broken link.

## Self-check before you finish

- Title, id, area and level match the outline.
- All required sections are present, in order.
- Every command and flag appears in the verification log or a fetched doc page.
- Every Terminal tip explains what the command does.
- No banned names, paths or emails.
- No invented numbers.
- Between 400 and 1,200 words.
- Links resolve.
