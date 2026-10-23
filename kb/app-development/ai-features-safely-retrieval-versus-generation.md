---
title: AI Features Safely: Retrieval versus Generation
id: P11
area: app-development
level: 3
time: 9
tags: [ai-features, evaluation]
verified: 2026-10-22
status: verified
sources:
  - https://code.claude.com/docs/en/best-practices
related: [D09, O08, R04]
---

When the answer already exists in your documents, return the document and do not ask a model to write the answer. Keep the language model out of the answer path, run a fixed benchmark on every change, and make the tool say it does not know when nothing matches.

## When to Use It

Use it when an app answers questions from a body of documents and a wrong answer costs time, money or safety. A search tool for field technicians over service-manual pages is the example in this article. Retrieval can only return pages that exist. Generation can produce fluent text that no page says, and a tired technician cannot tell the difference at a glance.

Generation fits where there is no page to find, such as drafting or rewording text that a person reads before it goes anywhere. For anything a technician acts on, retrieval is the safer default.

The author's setup follows this (pattern 9). A search tool over a document corpus has no language model in the answer path. Every change runs a fixed benchmark and must not lower the score. A dry run proves a data-fixing script writes nothing before it is allowed to write. A fixed test set turns "feels better" into a number.

Claude's job in this design is to build the tool and the benchmark harness. It does not answer technicians' questions at run time.

## Measure It

The best-practices guide says to give Claude a check it can run, because without one "looks done" is the only signal. For a search tool, the check is a fixed benchmark.

1. Write the cases first. Each case is a query plus the pages that should answer it, taken from the source documents. Include queries with no answer. A person who knows the documents decides the expected pages. Claude can draft queries, but if Claude also picks the answers, the benchmark only measures its own opinions.
2. Choose counts that match the risk. Two are enough to start: how many answerable queries return an expected page in the top results (found), and how many unanswerable queries return nothing (abstained). Keep them as separate counts. One blended number lets a gain in one hide a loss in the other.
3. Record a baseline: the last accepted counts, in a small file in the repository.
4. Make the runner fail when either count drops below the baseline. Hooks and CI read exit codes, as [Testing Without a Framework](testing-without-a-framework.md) shows.

   ```js
   import { readFileSync } from 'node:fs';
   import { search } from '../search.js';

   const load = (name) => JSON.parse(readFileSync(new URL(name, import.meta.url), 'utf8'));
   const pages = load('./pages.json');
   const cases = load('./cases.json');
   const baseline = load('./baseline.json');

   let found = 0, answerable = 0, abstained = 0, unanswerable = 0;
   for (const { query, expect } of cases) {
     const ids = search(pages, query).map((hit) => hit.id);
     if (expect.length) {
       answerable += 1;
       if (expect.some((id) => ids.includes(id))) found += 1;
       else console.log(`miss      "${query}" returned [${ids}]`);
     } else {
       unanswerable += 1;
       if (ids.length === 0) abstained += 1;
       else console.log(`answered  "${query}" returned [${ids}]`);
     }
   }
   console.log(`found ${found} of ${answerable} answerable (baseline ${baseline.found})`);
   console.log(`abstained ${abstained} of ${unanswerable} unanswerable (baseline ${baseline.abstained})`);
   if (found < baseline.found || abstained < baseline.abstained) {
     console.log('FAIL: a score dropped below the baseline');
     process.exitCode = 1;
   }
   ```

5. Run it on every change, in the same runner, hook and CI job as your other checks ([Definition of Done and Gates](../process/definition-of-done-and-gates.md)).
6. Grow the set from real misses. When someone gets a wrong or empty result, add that query as a case. Change the baseline in its own reviewed change, never inside the change that moved the score.

To make the tool say it does not know, give the search a minimum score and return nothing below it. Then show a plain "No matching page" message. For each hit, show the page title, the matching passage and a link, so the technician can check the source and no sentence has to be trusted on its own. The abstained count measures whether this works.

If you add a model later, give it a job that a person can see and accept, such as suggesting a rewritten query next to the original results, and add that behavior to the benchmark too. [Measure a Workflow Before and After](../optimization/measure-a-workflow-before-and-after.md) covers the habit of measuring a change against a fixed starting point.

## Worked Example

This toy has six short pages (fault E21, fault E47, replace the intake filter, reset the controller, fan noise, lockout before service) and eight cases: six answerable and two not. The files assume `"type": "module"` in `package.json`, as in Trail Notes. The pages are short, one title and one body each:

```json
[
  { "id": "e21", "title": "Fault E21: low coolant pressure", "body": "Check the coolant level. Inspect the pressure sensor connector. Reset the controller after the repair." },
  { "id": "e47", "title": "Fault E47: sensor circuit open", "body": "Measure the sensor wiring for continuity. Replace the harness if the circuit is open." },
  { "id": "filter", "title": "Replace the intake filter", "body": "Power down. Remove the filter cover. Fit the new filter and record the date." },
  { "id": "reset", "title": "Reset the controller", "body": "Hold the reset key until the display clears, then restart the unit." },
  { "id": "fan", "title": "Fan noise or vibration", "body": "Check the fan mount screws. Look for debris on the blades." },
  { "id": "lockout", "title": "Lockout before service", "body": "Isolate power and apply your lock before you open any panel." }
]
```

The cases:

```json
[
  { "query": "E21 coolant pressure low", "expect": ["e21"] },
  { "query": "sensor wiring continuity", "expect": ["e47"] },
  { "query": "change the filter", "expect": ["filter"] },
  { "query": "restart the controller", "expect": ["reset"] },
  { "query": "fan vibration", "expect": ["fan"] },
  { "query": "lock the power off", "expect": ["lockout"] },
  { "query": "warranty claim form", "expect": [] },
  { "query": "paint colors for the cabinet", "expect": [] }
]
```

The first search counts how many query words a page contains and returns pages with at least two, best first, three at most:

```js
export function search(pages, query, { minScore = 2, limit = 3 } = {}) {
  const words = query.toLowerCase().split(/\W+/).filter(Boolean);
  return pages
    .map((page) => {
      const text = `${page.title} ${page.body}`.toLowerCase();
      const score = words.filter((word) => text.includes(word)).length;
      return { id: page.id, score };
    })
    .filter((hit) => hit.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
```

With a baseline of zero, the first run prints the starting score:

```text
answered  "paint colors for the cabinet" returned [e47,fan]
found 6 of 6 answerable (baseline 0)
abstained 1 of 2 unanswerable (baseline 0)
```

The benchmark has found a weakness. Words such as "the" and "for" match many pages, so an unrelated query returns two of them. Record the baseline as 6 found and 1 abstained. Next, a change that ignores common words (`the`, `for`, `to` and a few more) looks like a clear improvement. The benchmark disagrees:

```text
miss      "change the filter" returned []
found 5 of 6 answerable (baseline 6)
abstained 2 of 2 unanswerable (baseline 1)
FAIL: a score dropped below the baseline
```

Without "the", the query has two words, and the filter page contains only "filter". Lowering `minScore` to 1 after the common words are dropped gives 6 found and 2 abstained, so the change passes, and you record the new baseline in a separate commit. The toy's counts say nothing about any real tool. They show the loop.

The loop also shows its limits. "lock the power off" now returns the lockout page and an unrelated filter page. The found count passes, because it never looks at extra results. Add a case or a count for noise once it matters.

## Pitfalls

- The same session writes the search and the expected answers. Have a person who knows the manual set them.
- You tune the search until the benchmark passes and never add new cases. The score then tells you how well you fit those cases.
- You change cases, code and baseline in one commit. A regression hides inside the diff.
- The tool never says "no match". A wrong page shown with confidence does more harm than an empty result.
- You paste manual text into a session without checking that you may share it. Use a small sample you are allowed to use.
- A fluent paragraph looks like evidence. Show the source passage beside any generated text.

## Checkpoint

A change raises `abstained` by one and lowers `found` by one. May it merge?

<details><summary>Show the answer</summary>

No. The rule is that no change lowers either count. Rework the change until neither drops, as the toy does by lowering `minScore` after dropping common words. If you decide a trade-off is worth it, change the baseline in its own reviewed commit with the reason written down.

</details>
