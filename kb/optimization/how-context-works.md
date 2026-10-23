---
title: How Context Works
id: O01
area: optimization
level: 1
time: 7
tags: [context]
verified: 2026-10-22
status: verified
sources:
  - https://code.claude.com/docs/en/context-window
  - https://code.claude.com/docs/en/model-config#context-window-and-auto-compaction
  - https://code.claude.com/docs/en/how-claude-code-works
  - https://code.claude.com/docs/en/best-practices
  - https://code.claude.com/docs/en/costs
  - https://code.claude.com/docs/en/desktop
related: [O02, TS01, O05, W01]
---

Context is everything Claude can see in a session: your prompts, the files it reads, tool output, loaded instructions and subagent summaries. It fills as you work, and the docs say performance degrades as it fills, so a long session gets worse before it stops.

## When to Use It

Read this page before your first long session, and again when a session starts forgetting things. It gives you the vocabulary for the rest of this area: what goes in, how to look at it, and what compaction keeps.

## How It Works

Everything Claude can see at once shares one window. The picture is illustrative, and its sizes are not measured.

{{diagram:context-window}}

### What Fills the Window

The context-window page in the official docs walks through a session and shows what enters context at each point.

| Source | When it enters | Notes |
|---|---|---|
| CLAUDE.md, auto memory, MCP tool names, skill descriptions | Before you type anything | Your own setup can add more, such as an output style |
| Your prompts and Claude's replies | Every turn | They stay until you clear or summarize |
| File reads | Each time Claude reads a file | Each read adds the file's contents |
| Path-scoped rules and hook output | When Claude touches a matching file, or a hook fires | Rules load alongside the file that matches them |
| Subagent results | When a subagent finishes | Only the summary and a small metadata trailer return; the file reads stay in the subagent's own window |

The timeline on that page uses representative numbers, not yours. Your own come from the next section.

### See Your Own Session

- Current layout: the header of the Context card in the session details panel shows a percentage. Open the card to see what uses the window by category.
- Earlier layout: click the usage ring next to the model picker.
- In either layout, type `/context` in the prompt box. It prints a per-category breakdown in the chat, with optimization suggestions and a list of which CLAUDE.md and memory files loaded.

If the panel is missing, the window may be too narrow, or you may have hidden it with Hide session rail in the title bar.

### What Compaction Does

As the window nears its limit, Claude Code clears older tool outputs first, then summarizes the conversation if it needs more room. Your requests and key code snippets are kept. Detailed instructions from early in the conversation may be lost. What happens to a piece of content depends on how it was loaded:

| Content | After compaction |
|---|---|
| Project-root CLAUDE.md and unscoped rules | Re-injected from disk |
| Auto memory | Re-injected from disk |
| Nested CLAUDE.md files and rules with `paths:` frontmatter | Reloaded on demand, so they can be absent until Claude touches a matching file again |
| Files Claude read or edited | Up to five, most recently modified first, are read again |
| An instruction you gave only in chat | Summarized with the rest of the conversation |

Where automatic compaction triggers depends on the model and your configuration. The model-config page lists the defaults, and says some models support a larger window.

### Why Long Sessions Get Worse

The best-practices page says that as the window fills, Claude may start forgetting earlier instructions or make more mistakes. The costs page adds a second effect: Claude Code sends the whole conversation with every request, so a one-line question in an old session still draws usage for everything before it.

## Worked Example

Use Trail Notes. Copy `exercises/trail-notes-starter/` to your own folder, open it in the Code tab, and ask Claude why `checks/search.check.mjs` fails. It will read `notes.js` and the check, and run `node checks/run.mjs`.

1. Open the Context card, or type `/context`. Note the percentage and the largest category.
2. In the same session, ask something unrelated, such as what `manifest.webmanifest` does. Check again.
3. Click + New in the sidebar and ask the unrelated question there. Check the new session.

Expect the first session's percentage to keep climbing, and the new session to start with only what loads at startup. In the author's four-week audit, the median session had 178 transcript records and 94 of 498 sessions went past 500, which is where this matters.

## Pitfalls

- Leaving a rule only in chat. After compaction, conversation-only instructions are summarized. Put anything that must persist in CLAUDE.md; [A CLAUDE.md That Earns Its Keep](../workflow/a-claude-md-that-earns-its-keep.md) covers what belongs there.
- Pasting a whole log or file when a path or a line range would do. Whatever enters context rides along on every later request.
- Expecting a nested CLAUDE.md or a path-scoped rule to survive compaction. The memory docs say to drop the `paths:` frontmatter or move the rule to the root CLAUDE.md if it must persist.
- Waiting for automatic compaction to tidy up. It keeps what it judges important. [Clear, Compact and Hand Off](clear-compact-and-hand-off.md) shows how to choose for yourself.
- Reading the docs' simulated token counts as your own.

## Checkpoint

1. Early in a long session you told Claude a rule in chat, and now it ignores the rule. Give one likely reason and the fix.
2. Name two places in the app where you can see how full the window is.

<details><summary>Show the answer</summary>

1. The rule was detailed and lived only in the conversation, so it was crowded out or summarized away when the window filled. Put it in the project-root CLAUDE.md, which is re-read from disk after compaction, and restate it if the session is already long.
2. The Context card in the session details panel (earlier layout: the usage ring beside the model picker), and the `/context` command typed into the prompt box.

</details>
