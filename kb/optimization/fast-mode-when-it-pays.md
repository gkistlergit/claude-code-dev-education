---
title: Fast Mode: When It Pays
id: O06
area: optimization
level: 3
time: 6
tags: [fast-mode]
verified: 2026-10-22
status: partial
sources:
  - https://code.claude.com/docs/en/fast-mode
  - https://code.claude.com/docs/en/commands
  - https://code.claude.com/docs/en/prompt-caching
  - https://code.claude.com/docs/en/model-config
related: [O03, DG04, O08, O05]
---

`/fast` toggles a faster configuration of Claude Opus at a higher cost per token. It is labeled a research preview. The docs cover the CLI, the VS Code extension and cloud sessions, not the Desktop page, and the author has never used it. This page teaches how to decide and how to measure, and it says where it cannot confirm anything.

## When to Use It

Consider it when you sit and wait on each reply and response time is the bottleneck. The docs name rapid iteration and live debugging as the typical fits. On a subscription plan it also needs usage credits, and the docs say `/fast` reports "Fast mode requires usage credits" until they are on. If you have not turned them on, you can skip this page.

## Decision Table

### What the Docs Cover

The docs say fast mode is not a different model. It is Claude Opus with a different API configuration that favors speed over cost efficiency, with identical quality and capabilities. It works on certain Opus models only, and not on Sonnet or Haiku. If your current model does not support it, turning it on switches you to Opus. The docs label it a research preview and say the feature, pricing and availability may change.

On Pro, Max, Team and Enterprise plans, the docs say fast mode is available through usage credits only. It draws from them even when you have plan usage left. Usage credits are spending beyond your plan, and this course does not recommend adding spend. Team and Enterprise organizations also need an Owner to enable it first.

In the CLI you run `/fast`, press Space to toggle it, then press Enter. A confirmation reads "Fast mode ON" and a small `↯` icon appears beside the prompt. Running `/fast` again reports the state.

> **Observed in the app**
> Fast mode has been seen on the Desktop Code tab, but the docs do not describe it there. This page cannot tell you where the control sits, whether it saves a default, or whether the confirmation matches the CLI's. The behavior may change. Check what your build shows before relying on anything here.

### What This Page Can and Cannot Claim

Everything above comes from the fast mode and commands pages. Nobody has run fast mode for this course, so there is no firsthand result on speed, on cost or on the Desktop control. The measurement below is how you get your own.

### When It Fits

| Situation | Lean toward | Why, according to the docs |
|---|---|---|
| Rapid iteration and live debugging, or work against a tight deadline | Fast mode | Latency matters more than cost |
| Long autonomous tasks, and batch or CI work | Standard | Speed matters less |
| Cost-sensitive work | Standard | Per-token cost is higher |
| A simple task you want sooner | Lower effort first | Lower effort means less thinking time and may cost quality on complex tasks; fast mode keeps quality and costs more |
| Starting a session | Turn it on at the start | The first enable in a conversation reprices the whole context at the fast-mode rate, once per conversation |

The docs say you can combine fast mode with a lower effort level. Try a lower effort or a smaller model first, since they add no spend. [Model and Effort Trade-offs](model-and-effort-trade-offs.md) covers both.

### Measure Whether It Helped

1. Pick one task you repeat, with a check that passes or fails.
2. Run it in a fresh session on the same Opus model at the same effort level, once with fast mode off and once with it on.
3. Time each run from sending the prompt until the check passes, and count your corrections. Faster replies that need more corrections may save nothing.
4. Repeat each condition at least twice, because one run varies.
5. For the cost side, the docs say the Usage credits section of Settings > Usage on claude.ai shows this month's spend and includes fast mode without breaking it out. Do nothing else with credits during the test.

Keep it for the kind of work where the time saved matters more to you than the credits spent. The docs print a speed ceiling for the feature. This page leaves it out, because your tasks decide what you get.

## Worked Example

Use the Trail Notes tags task: write the checks first for `filterByTag`, then implement until `node checks/run.mjs` passes. Run A is standard Opus. Run B is the same prompt in a new session with `/fast` on. Record minutes to green, corrections and credits spent in the worksheet from [Measure a Workflow Before and After](measure-a-workflow-before-and-after.md). If run B finishes sooner but needed an extra correction, the saving is smaller than it looks.

## Pitfalls

- Turning it on late in a long conversation. The first enable costs more the deeper you are.
- Leaving it on. By default, fast mode you turn on in an interactive session persists across sessions.
- Comparing fast Opus with a different model or effort level. That measures the wrong thing.
- Running into a block. The docs list "Fast mode requires usage credits" and "Fast mode has been disabled by your organization" among the messages.
- Using it for unattended runs, where the docs say standard mode fits better.

## Checkpoint

You want to test fast mode on one task. Name what to hold constant, and one thing to record besides time.

<details><summary>Show the answer</summary>

Hold the model, the effort level, the prompt and the starting state constant, and use a fresh session each time. Record the number of corrections you had to make, or the credits spent, so you can tell whether the faster replies actually saved time.

</details>
