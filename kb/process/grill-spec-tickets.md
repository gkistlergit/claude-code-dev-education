---
title: Grill, Spec, Tickets
id: R02
area: process
level: 2
time: 8
tags: [spec, tickets]
verified: 2026-10-23
status: verified
sources:
  - https://code.claude.com/docs/en/best-practices
related: [P02, R03, T04, R01]
---

A grilling session turns an idea into decisions, the spec writes those decisions down, and tickets cut the spec into pieces that say what blocks what. With all three, a fresh session can build the right thing without you explaining it again.

## When to Use It

Use this for a feature that touches more than one file, contains choices you have not made yet, or will be split across sessions. If you could describe the diff in one sentence, skip it and just make the change.

## Steps

1. **Open** a new session in the project folder and give Claude the idea in one line.
2. **Prompt** Claude to interview you. The best-practices guide suggests asking it to use the `AskUserQuestion` tool for this and to write the spec when the interview is done.

    ```prompt
    I want to add tags to Trail Notes. Interview me in detail using the AskUserQuestion tool. Ask about behavior, edge cases, what is out of scope, and tradeoffs. Skip obvious questions and dig into the hard parts I may not have considered. Keep going until the decisions are explicit, then write a spec to SPEC.md.
    ```

3. **Answer** each question. When you do not know, say so and ask for two options with a recommendation. If you and Claude keep using a word differently, ask it to add that word to a glossary file. Give each hard-to-reverse choice a short decision record.
4. **Read** the spec. The guide says the most useful specs are self-contained: they name the files and interfaces involved, state what is out of scope, and end with an end-to-end verification step.
5. **Prompt** Claude to cut the spec into tickets.

    ```prompt
    Split SPEC.md into tickets in PLAN.md. For each ticket give a title, what done looks like as a check I can run, and "Blocked by" with ticket numbers or "none". Keep each ticket small enough for one pull request.
    ```

6. **Check** the blocking lines yourself. Tickets that are not blocked by anything can run in parallel sessions, each in its own worktree. Tickets that edit the same function belong in sequence.
7. **Start** a fresh session for each ticket. The guide recommends this because the new session has clean context focused on implementation and a written spec to refer to.

The [spec template](../../templates/spec.md) and [plan template](../../templates/plan.md) give you a starting layout, and the [grill-a-spec prompt](../../prompts/grill-a-spec.md) is a reusable version of step 2. For the reasoning behind this approach, see [Spec First: Grilling and a Glossary](../app-development/spec-first-grilling-and-a-glossary.md).

### What a spec contains

| Section | What goes in it |
|---------|-----------------|
| Goal | One or two sentences |
| Out of scope | What you decided not to build, so nobody builds it |
| Interfaces | Function names, inputs and outputs, and the files they live in |
| Decisions | Each choice with its reason |
| Checks | The commands that prove each piece works |
| End-to-end step | One check that exercises the whole feature |

The author's setup follows this pattern: a long question-and-answer session until the decisions are explicit, a glossary of terms (including terms to avoid), short decision records for choices that are hard to reverse, and a spec that becomes tickets declaring what blocks what. The glossary prevents the same argument twice.

## Worked Example

You grill Claude about tags for Trail Notes. The spec it writes, trimmed:

```md
# Tags for Trail Notes

Goal: a note can carry tags, and the list can be filtered by one tag.

Out of scope: tag colors, renaming tags, filtering by several tags at once.

Interfaces (notes.js):
- addNote(notes, {title, body, tags}): tags is an optional array of strings and defaults to an empty array.
- filterByTag(notes, tag): returns the notes that carry the tag. An empty tag returns every note. It does not change its input.

Decisions:
- Tags are compared ignoring capitals and surrounding spaces. Reason: it matches how search behaves once the case bug is fixed.
- Notes saved before tags existed still load and count as having no tags. Reason: people already have notes in their browsers.

Checks: checks/tags.check.mjs covers both functions and the old-note case, and `node checks/run.mjs` passes.

End-to-end: with ticket 3 done, add a note tagged "trail", filter by "Trail", and see the note.
```

The plan it writes from that spec:

```md
# Plan: tags

1. addNote accepts tags
   Done when: tags.check.mjs covers it and passes. Blocked by: none.
2. filterByTag(notes, tag)
   Done when: tags.check.mjs covers it and passes. Blocked by: none, because the spec fixes the shape of tags.
3. Wire tags into the page (a tags field on the form and a filter control)
   Done when: the end-to-end step in SPEC.md works and old saved notes still load. Blocked by: 1, 2.
```

Tickets 1 and 2 can start at the same time because the spec decided that tags are strings in an array. That decision is why the spec names interfaces. The old-note decision came from a question about data that people already have, which is the kind of thing a grilling session is for. [Ship a Feature End to End](../recipes/ship-a-feature-end-to-end.md) carries this plan through to a merge.

## Pitfalls

- Letting the interview wander. Say what is out of scope early, or the spec grows features you did not want.
- Writing the spec as code in prose. Describe behavior and interfaces, and let Claude choose the implementation.
- Marking every ticket "Blocked by: none" when two of them edit the same function. Tickets 1 and 2 above both touch `notes.js` and the same check file, so expect to reconcile them. If that is more work than waiting, mark ticket 2 as blocked by ticket 1.
- Building in the session that ran the interview. Its context is full of discussion, and the spec exists so you can leave that behind.
- Treating the interview as agreement. Claude asks and proposes, and you decide.

## Checkpoint

Why does the spec name interfaces such as `filterByTag(notes, tag)` before any code exists?

<details><summary>Show the answer</summary>

A named interface fixes the shape that other work depends on. Once the shape is decided, tickets that use it do not need to wait for each other, and a fresh session can write a check against it before the code exists.

</details>
