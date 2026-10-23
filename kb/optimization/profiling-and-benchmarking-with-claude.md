---
title: Profiling and Benchmarking with Claude
id: O07
area: optimization
level: 3
time: 9
tags: [performance, benchmarking]
verified: 2026-10-23
status: verified
sources:
  - https://code.claude.com/docs/en/best-practices
  - https://nodejs.org/api/cli.html
  - https://nodejs.org/api/perf_hooks.html
  - https://developer.chrome.com/docs/devtools/performance
related: [O08, P09, D05]
---

Measure first, form one hypothesis, change one thing, then measure again. Claude writes the harness and you read the numbers. This page uses only free tools: Node's built-in profiler flags and your browser's developer tools.

## When to Use It

Use it when something feels slow, such as the Trail Notes list with a thousand notes, and before you open any pull request that claims a speedup. [Debugging with Claude](../development/debugging-with-claude.md) covers wrong results. This page covers slow ones. The best-practices page says to give Claude a check it can run. For performance, the check is a number. The [profile a slow path prompt](../../prompts/profile-a-slow-path.md) is a reusable version of step 2.

## Steps

1. **State** the question so a clock can answer it: how long do `searchNotes` and `sortNotes` take with a thousand notes?
2. **Prompt** Claude to write the harness. Ask for many runs and a median, and tell it to leave the app files alone.

   ```prompt
   Create bench/list.bench.mjs. It should build a list of 1000 notes with addNote, then time searchNotes and sortNotes with performance.now() from node:perf_hooks. Make one warm-up call, run each function 200 times, and print the median in milliseconds. Do not change any app files. Match how the files in checks/ import notes.js.
   ```

3. **Run** it twice and write down both results. This is your baseline.

   ```terminal
   node bench/list.bench.mjs
   ```

   ```text
   searchNotes: median <n> ms over 200 runs
   sortNotes: median <n> ms over 200 runs
   ```

   If two runs of unchanged code differ by about as much as the improvement you hope for, the measurement is too noisy to settle the question.

4. **Profile** only if a number is worth chasing. The terminal tip below shows the command.
5. **Choose** one hypothesis and ask Claude to change one thing for it.
6. **Run** the harness again, then `node checks/run.mjs`. Keep the change if the median dropped and the checks still pass. Revert it if not.

> **Terminal tip**
> `node --cpu-prof` starts V8's CPU profiler and writes a profile file when the script exits. `--cpu-prof-dir=prof` puts that file in a folder named `prof`. The Node docs mark the `--cpu-prof` flags stable from v22.4.0 and v20.16.0, and `node --help` lists them for your version.
>
> ```terminal
> node --cpu-prof --cpu-prof-dir=prof bench/list.bench.mjs
> ```

The profile is a `.cpuprofile` file, which is plain JSON with `nodes`, `samples` and `timeDeltas` fields. It can grow large on a longer run, so keep it out of the chat and ask for a small script instead:

```prompt
Write a short Node script that reads the newest .cpuprofile in prof/ and prints the ten functions with the most self time. Explain how you worked out self time from the nodes, samples and timeDeltas fields.
```

### What the Harness Looks Like

Claude's version may differ from this sketch. What matters is the shape: build the data once, warm up, repeat, report a median.

```js
import { performance } from 'node:perf_hooks';
import { addNote, searchNotes, sortNotes } from '../notes.js';

let notes = [];
for (let i = 0; i < 1000; i++) {
  notes = addNote(notes, { title: `Trail ${i}`, body: `Camp spot ${i} near the lake` });
}

function time(label, fn, runs = 200) {
  fn(); // warm-up, not recorded
  const samples = [];
  for (let i = 0; i < runs; i++) {
    const start = performance.now();
    fn();
    samples.push(performance.now() - start);
  }
  samples.sort((a, b) => a - b);
  console.log(`${label}: median ${samples[Math.floor(runs / 2)].toFixed(3)} ms over ${runs} runs`);
}

time('searchNotes', () => searchNotes(notes, 'lake'));
time('sortNotes', () => sortNotes(notes));
```

The loop relies on `addNote` returning the new array, as it does in the starter.

### Drawing the List

These pure functions do not draw anything. To time rendering, open the app in your regular browser, seed a thousand notes (ask Claude to read `app.js` and write a console snippet that does it), and record the page in the Performance panel of the browser's developer tools. Chrome's [Performance panel guide](https://developer.chrome.com/docs/devtools/performance) walks through recording. If a service worker caches the app shell, measure the first visit and a repeat visit separately. [Offline-First with Service Workers](../app-development/offline-first-with-service-workers.md) explains the cache.

## Worked Example

Suppose the harness prints a median for each function, and `searchNotes` is clearly the larger. Profile it, ask for the top ten functions, and read the list yourself. Write one hypothesis in a sentence, such as "the query is lowercased inside the loop and could be lowercased once outside it". That example only shows the form. Read your own `searchNotes` before you use it. Ask Claude to make that one change, rerun the harness twice, and compare with the baseline. If the medians do not move beyond the spread you saw between baseline runs, revert and try the next hypothesis. If two functions are both slow, change them in separate rounds.

## Pitfalls

- Optimizing from a feeling. Without a baseline you cannot tell a gain from noise.
- Accepting "this should be faster" from Claude without your own before and after.
- Changing two things in one round, which leaves you unable to credit either.
- Trusting one run. Run twice and compare the medians.
- Committing `prof/` files. Add the folder to `.gitignore`.

## Checkpoint

1. Put these in order: change one thing, form a hypothesis, measure again, measure a baseline.
2. Why does the harness make a warm-up call and report a median?

<details><summary>Show the answer</summary>

1. Measure a baseline, form a hypothesis, change one thing, measure again.
2. The first call can include one-time setup that later calls do not repeat, so it is left out. A median over many runs is less affected by a few slow outliers than a single reading or an average.

</details>
