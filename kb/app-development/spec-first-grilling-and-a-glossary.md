---
title: Spec First: Grilling and a Glossary
id: P02
area: app-development
level: 2
time: 9
tags: [spec, grilling, glossary, adr]
verified: 2026-10-22
status: verified
sources:
  - https://code.claude.com/docs/en/best-practices
  - https://code.claude.com/docs/en/memory
related: [R02, P01, P03]
---

A spec you can build from comes out of a long question-and-answer session with Claude. Run the session until every decision is explicit, keep your terms in a glossary, write short decision records for choices that are hard to reverse, and cut the spec into tickets that say what blocks what.

## When to Use It

Use it after the brief from [Scoping an App Before You Build](scoping-an-app-before-you-build.md) and before any work that will take more than one session or touch several files. It also pays off when two sessions, or two people, need to mean the same thing by the same word.

The author's setup follows this shape (pattern 10 in the practice notes). Work starts with a long question-and-answer session. A glossary records the project's terms, including terms to avoid. Hard-to-reverse choices go into short decision records. The spec becomes tickets that declare what blocks what. The glossary prevents the same argument twice. [Grill, Spec, Tickets](../process/grill-spec-tickets.md) covers the same flow as a process.

## Steps

1. **Start** a session and point Claude at the brief with an `@` mention. The best-practices guide says to reference files with `@` so Claude reads the file before it answers.
2. **Prompt** the grilling. The best-practices guide has Claude interview you with the `AskUserQuestion` tool and then write a spec. This version adds a stopping rule and asks for a recommendation with each question, so you react instead of inventing answers. A ready-made version lives in [Grill a Spec](../../prompts/grill-a-spec.md).

   ```prompt
   Read @BRIEF.md. Grill me about it using the AskUserQuestion tool, one question at a time, until every decision that affects the build is explicit: data, screens, edge cases, failure behavior, offline behavior and what we leave out. With each question, give your recommended answer and why, then wait for mine. Keep a running list of decisions. Stop when you cannot think of another question that would change the build.
   ```

3. **Record** each term the moment it settles. One short line per term, with the words to avoid.

   ```md
   # Glossary

   Note: A titled piece of text the user saves. Avoid: entry, memo, card.
   Tag: One lowercase word attached to a note. Avoid: label, category.
   ```

4. **Import** the glossary into CLAUDE.md with an `@GLOSSARY.md` line so every session sees it. The memory docs say imports load together with the file that imports them, so they do not reduce context cost. Keep the glossary to terms that cause arguments.
5. **Write** a decision record for each choice that is hard to reverse: where data lives, how people sign in, which host. One file each, a few lines long.

   ```md
   # 0003: Store tags on the note

   Status: accepted
   Context: Notes need tags, and search must stay fast with no server.
   Decision: Each note carries its own list of tags. There is no separate tag table.
   Consequences: Renaming a tag means editing every note that has it.
   ```

6. **Draft** SPEC.md from the decisions, using [the spec template](../../templates/spec.md). The best-practices guide says the most useful specs name the files and interfaces involved, state what is out of scope, and end with an end-to-end verification step.
7. **Cut** the spec into tickets. Give each a "Blocked by" line, then ask Claude to print the build order and flag any ticket that waits on itself or nothing.
8. **Start** a fresh session for the first ticket that nothing blocks.

## Worked Example

Suppose Trail Notes grows tags. A grilling session would raise questions such as whether a note may have no tags, whether `Hike` and `hike` are the same tag, and whether the filter takes one tag or several. Each answer lands in the spec, and the words land in the glossary.

The tickets for the function work come out like this:

```text
T1  addNote accepts tags               blocked by: none
T2  filterByTag(notes, tag)            blocked by: T1
T3  tag input and tag filter in page   blocked by: T1, T2
```

T3 is the only ticket that touches the page, so T1 and T2 can be built and checked with `node checks/run.mjs` alone. [Capstone 2](../../capstones/capstone-2-ship-a-feature.md) builds this feature.

## Pitfalls

- The session has no stopping rule, so it drifts into design for features nobody asked for. Name the rule in the prompt.
- You approve every recommendation by reflex. The decisions are yours, and a decision you did not weigh will come back as a bug.
- The glossary becomes a dictionary. Imported files cost context in every session, so list only the terms the project argues about.
- Every choice gets a decision record. Reserve them for choices that are hard to undo, or nobody reads them.
- Tickets have no blocking lines. Parallel sessions then build on code that does not exist yet, or build the same piece twice.
- The spec is not updated when a decision changes. Change the record and the spec in the same commit.

## Checkpoint

Why does a glossary entry list words to avoid?

<details><summary>Show the answer</summary>

You and Claude both reach for the nearest word. Naming the words to avoid keeps code, tests and screen text on one vocabulary, so a search for the right word finds everything and nobody argues about whether a "label" is a "tag".

</details>
