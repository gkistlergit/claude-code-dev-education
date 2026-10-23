---
title: Retro
kind: prompt
order: 10
verified: 2026-10-23
---

Use this after an incident, a long session or a week of work, when you want to learn something specific and change how you work. It asks Claude to build the timeline from evidence and to propose changes you can measure. [Handoff Ledgers and Retros](../kb/process/handoff-ledgers-and-retros.md) puts it in context.

## Prompt

```prompt
Run a short, blameless retro on [what happened: this session, an incident, last week's work]. Use this evidence: [commit range, pull request, log file or ledger file]. Read it before you answer, and tell me what you could not see.

Give me:
1. A timeline of the main events, five to ten lines.
2. What went well.
3. What cost time or caused rework, with the evidence for each item.
4. The cause behind each cost, in terms of how we work as well as the code.
5. One to three changes to how we work. For each, say how I can tell next time whether it helped, using something I can count.

Ask me before you conclude anything the evidence does not show.
```

## What a Good Result Looks Like

- The timeline cites commits, lines or timestamps from the evidence you gave. Events with no source are flagged.
- Causes point at process: a missing check, an unclear instruction, a rule that was never written down. Stopping at "the code had a bug" is too shallow.
- Each proposed change is small and has a measure you can count, such as the number of approval prompts or corrections in a session.
- It names what it could not see, such as decisions made in a conversation it has no record of.
- It does not assign blame to a person.

If you have been recording readings with the [messy workflow worksheet](../exercises/messy-workflow/README.md), paste the table in as evidence.

## Variations

### After an Incident

```prompt
Run a retro on [incident]. Start from the first moment the problem could have been caught. Tell me which check, rule or habit would have caught it, and whether we had one.
```

### A Weekly Check-in

```prompt
Look at [the week's pull requests or commits] and tell me the one place we lost the most time. Give me a single change to try next week and the count that will show whether it worked.
```

### After a Session That Went Badly

```prompt
Here is how the last session went wrong: [short description]. Which instruction, file or check would have prevented it? Draft the smallest rule or check that adds it.
```
