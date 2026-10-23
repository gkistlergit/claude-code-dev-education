---
title: Grill a Spec
kind: prompt
order: 8
verified: 2026-10-22
---

Use this before you build anything with more than a couple of open decisions in it. Claude asks questions one at a time, with a recommended answer for each, until the decisions are explicit. Then it writes the spec. [Spec First: Grilling and a Glossary](../kb/app-development/spec-first-grilling-and-a-glossary.md) explains why this saves rework.

## Prompt

```prompt
Grill me about [idea, or the spec in a file]. Do not write any code.

Ask one question at a time, starting with the decision that most changes the rest. With each question, give your recommended answer so I can say yes or change it. If the code or the files can answer a question, look there and do not ask me.

Keep going until the decisions are explicit. Then write a one-page spec with: the goal, the non-goals, the decisions, the open questions and the checks that will prove it done. List any word we used in two different ways.
```

## What a Good Result Looks Like

- You get one question per turn.
- Every question comes with a recommendation, so a good default costs you one word.
- It does not ask what the project already answers. A question like "what language is this written in?" shows it did not look.
- The spec names non-goals, which is where most scope creep hides.
- The checks in the spec are things you could run, such as "searching for a tag name finds nothing unless the note has that tag".

For a Trail Notes tags feature, good questions include whether a note can have no tags, whether tags ignore capitals, what happens to notes saved before tags existed, and whether search should look inside tags.

## Variations

### A Fixed Number of Questions

```prompt
Grill me about [idea] with at most [number] questions. Pick the ones whose answers would change the design the most, and list what you left unasked.
```

### Find the Holes in an Existing Spec

```prompt
Read [spec file] and find contradictions, missing decisions and anything two readers could build differently. Ask me about them one at a time and do not edit the file until we finish.
```

### Argue the Other Side

```prompt
I plan to [decision]. Argue against it as strongly as you honestly can, then tell me whether you still recommend it and what would change your mind.
```
