---
title: Reading Your Usage, Context and Skills
id: O05
area: optimization
level: 2
time: 7
tags: [usage, cost, skills]
verified: 2026-10-22
status: verified
sources:
  - https://code.claude.com/docs/en/costs
  - https://code.claude.com/docs/en/monitoring-usage
  - https://code.claude.com/docs/en/skills#find-unused-skills
  - https://code.claude.com/docs/en/skills#override-skill-visibility-from-settings
  - https://code.claude.com/docs/en/commands
  - https://code.claude.com/docs/en/desktop
related: [O01, O03, W04, O08]
---

Three readouts show where your tokens go: the usage view (`/usage`, with the aliases `/cost` and `/stats`), the context view (`/context`) and the skills report (`/skill-doctor`). A ten-minute weekly look at all three tells you what to trim.

## When to Use It

Use this routine once a week, or when usage seems high for the work you did. It pairs with [How Context Works](how-context-works.md), which explains what the context view is counting.

## Steps

1. **Check** plan usage. In the app, click the usage ring beside the model picker; the docs say it shows your plan usage, shared across all Claude Code surfaces. In a terminal session, run `/usage`. On a Pro, Max, Team or Enterprise plan it adds a breakdown of what counts against your limits, with usage attributed to skills, subagents, plugins and individual MCP servers, plus recommendations. Press `d` or `w` to switch between the last 24 hours and the last 7 days. The figures are approximate and come from local session history on this machine.
2. **Open** the Context card in the session details panel, or type `/context` in the prompt box. Note the largest category and the list of memory files that loaded.
3. **Run** `/skill-doctor`. The docs say it shows what each skill costs in context and how often it gets used, and flags skills in the listing that were never invoked. Start with the highest context cost. It needs Claude Code v2.1.252 or later and does not work in sessions that skip feature-flag fetching. The docs describe its report as opening in the `/plugin` manager's Stats tab and say it is unavailable over Remote Control. The Desktop page does not mention it, so confirm what your build does.
4. **Decide** on one change. Trim a long CLAUDE.md, turn off a skill you never use, disable an MCP server you are not using, or start fresh sessions more often.
5. **Write** down one number so you can compare next week. [Measure a Workflow Before and After](measure-a-workflow-before-and-after.md) has a worksheet.

The `/usage` Session block shows token counts, and the docs say its dollar figure is an estimate computed locally. For subscribers the docs say that figure is not relevant for billing. Your plan page is the place for limits.

> **Terminal tip**
> `/insights` writes an HTML report on how you work, including what you work on, where things go wrong and features to try. A run analyzes up to 200 sessions it has not seen before, from this machine only, and the docs say the analysis tokens count against your plan or API usage.

### Turning Off a Skill

Every skill in the listing adds to your context on every turn, whether or not Claude uses it. For skills whose files you do not want to edit, the `skillOverrides` setting in a settings file takes a state per skill name: `"on"`, `"name-only"`, `"user-invocable-only"` or `"off"`. The `"name-only"` state lists only the name, and `"off"` hides the skill from Claude and from the `/` menu.

```json
{
  "skillOverrides": {
    "old-notes-skill": "off"
  }
}
```

The docs say plugin skills are not affected by this setting. Manage those through `/plugin`.

### For Teams

Claude Code can export metrics and events through OpenTelemetry. Setting `CLAUDE_CODE_ENABLE_TELEMETRY=1` turns it on, and you choose exporters with further variables. The metrics include session count, lines of code changed, pull requests, commits, cost, tokens, code edit decisions and active time. Distributed traces are labeled beta and need a second variable. You also need a backend to receive the data, so a solo learner can skip this.

## Worked Example

The author's projects each carry 38 to 43 skills copied from a shared set, and the audit lists `/usage` among the commands rarely used. Given the docs' point that every listed skill costs context each turn, that is a setup where `/skill-doctor` is worth running first.

For Trail Notes, try the routine on a short session. Ask Claude to explain `app.js`, open the Context card, then type `/context` and read the memory files list. Then look at the usage ring. You should see one session's context and your plan usage, which are different measures. Write the context percentage in the worksheet.

## Pitfalls

- Reading the `/usage` dollar figure as a bill.
- Reading a recommendation's share as the saving. The docs say it shows how much of your usage the row applies to, and the shares can add up to more than 100%.
- Using `skillOverrides` on a plugin skill. It has no effect there.
- Making several changes in one week and learning nothing about any of them.
- Running `/insights` often. The analysis uses tokens too.

## Checkpoint

1. Which command shows the cost in context of each skill?
2. Why change one thing per week?

<details><summary>Show the answer</summary>

1. `/skill-doctor`, which also flags skills that were never invoked.
2. With one change you can tie a movement in your numbers to that change. Several changes at once leave you unable to say which one helped.

</details>
