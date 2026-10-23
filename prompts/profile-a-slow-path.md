---
title: Profile a Slow Path
kind: prompt
order: 11
verified: 2026-10-23
---

Use this when something feels slow and you want to find out why before you touch it. It asks Claude to build a repeatable benchmark, report only the numbers a tool printed, and change one thing at a time. [Profiling and Benchmarking with Claude](../kb/optimization/profiling-and-benchmarking-with-claude.md) explains the method.

## Prompt

```prompt
[Operation] is slow when [condition]. Do not optimize anything yet.

1. Write a repeatable benchmark for [operation] with [input size or shape, such as a thousand notes]. It should run the operation several times and report the median and the spread. Use only what is already installed: Node's built-in profiler and timers, or browser devtools for page work. Check any flag with node --help before you use it.
2. Run it and show me the numbers exactly as printed. Do not round or estimate.
3. Use the profile, not your reading of the code, to name where the time goes.
4. Change one thing. Run the same benchmark again and show me a before and after table.
5. Keep the change only if the improvement is larger than the spread between repeated runs. Otherwise revert it and say so.

Never write a number that a tool did not print.
```

## What a Good Result Looks Like

- A benchmark file you can run again, saved in the repo or somewhere you can find it.
- Output with a median and a spread. A single timing says little, because runs vary.
- Hypotheses tied to what the profile showed. If Claude names a cause it never measured, ask it to measure.
- One change per round and a before and after table that uses the numbers from the tool.
- A willingness to say "no change needed". On Trail Notes, `searchNotes` over a thousand notes may turn out fast enough, and an honest benchmark that finds nothing worth fixing is a good outcome.

## Variations

### Page Rendering

```prompt
The page is slow when [action]. I will paste what the browser's performance panel shows. Tell me what to record, help me read it, and propose one change to try.
```

### Compare Two Implementations

```prompt
Write a benchmark that compares [version A] and [version B] on the same inputs, including an empty list and [large input]. Show me the median and spread for each, and tell me if the gap is bigger than the spread.
```

### Growth Over Time

```prompt
Write a script that runs [operation] with [small], [medium] and [large] inputs and prints the time for each. Tell me whether the time grows in proportion to the input, faster, or slower, using only the numbers printed.
```
