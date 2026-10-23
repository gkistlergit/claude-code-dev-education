---
title: Start Here
kind: learn
level: 0
order: 0
time: 15
verified: 2026-10-22
sources:
  - https://code.claude.com/docs/en/desktop-quickstart
  - https://code.claude.com/docs/en/desktop
  - https://code.claude.com/docs/en/setup
  - https://code.claude.com/docs/en/terminal-guide
---

This course teaches Claude Code through the Claude desktop app's Code tab, using one small practice project called Trail Notes. It is an unofficial course, written independently and not affiliated with or endorsed by Anthropic.

## Who This Course Is For

The course is written for Mac users who have written some code and have little experience with a terminal. You do not need to be fluent in git, Node.js or GitHub before you begin. The first level covers the terminal commands you will use, and every command in a Terminal tip is explained.

By the end you should be able to take a small app from an idea to a merged, checked change with Claude Code doing much of the typing and you doing the deciding. The [rubric](../assessment/rubric.md) says exactly what "Advanced" means and how to show it.

## What You Need

- A Mac. The setup page lists macOS 13.0 or later as a system requirement for Claude Code, and the desktop app is a universal build for Intel and Apple Silicon.
- A Claude plan that includes Claude Code. The desktop quick start lists Pro, Max, Team and Enterprise. Your sessions count against that plan, and `/usage` shows where you stand. The course asks you to buy nothing else.
- The Claude desktop app. Install it from the link on the [desktop quick start](https://code.claude.com/docs/en/desktop-quickstart). The app includes Claude Code, so you do not need the command-line tool to use the Code tab.
- Node.js. Claude Code does not need it. Trail Notes does: its checks run with `node checks/run.mjs`. This repository asks for version 20 or later. Download it from [nodejs.org](https://nodejs.org/en/download).
- git. Most Macs include it. Run `git --version` in Terminal to check.
- A free GitHub account. You need it from Level 2, where you open pull requests and run continuous integration (CI). See GitHub's guide to [creating an account](https://docs.github.com/en/get-started/start-your-journey/creating-an-account-on-github). The desktop app's pull request features also need the [GitHub CLI](https://cli.github.com/) (`gh`), and the app offers to help you install it the first time you create a pull request.
- A terminal. The Terminal app that comes with macOS works. The Code tab also has its own Terminal pane. The [terminal guide](https://code.claude.com/docs/en/terminal-guide) in the Claude Code documentation shows how to open one.
- An internet connection. Claude Code requires one. The Trail Notes app and its checks run on your machine with no network. The only other service in the course is GitHub, from Level 2 onward.

## Your Practice Project: Trail Notes

Every hands-on step uses Trail Notes, a small notes app with no framework. Its files are `index.html`, `style.css`, `app.js`, `notes.js`, `manifest.webmanifest` and `package.json`, with a `checks/` folder of plain Node scripts. The starter is in [exercises/trail-notes-starter](../exercises/trail-notes-starter/README.md).

The starter has one seeded bug: `searchNotes` matches case-sensitively, so the search check fails until someone fixes it. Several exercises leave the bug alone on purpose, and Capstone 1 is where you fix it. The Code tab's Browser pane can preview the app, and the starter README also shows how to serve it with Python's built-in web server.

Get a copy of this repository by cloning it with git or downloading it as a ZIP from the repository page, then copy the starter into a folder of your own. Run this from the root of your copy of the repository:

> **Terminal tip**
> `cp -R` copies a folder and everything inside it. The first path is the starter. `~/trail-notes` is a new folder named trail-notes in your home folder. You can do the same thing in Finder by copying the folder and renaming the copy.
>
> ```terminal
> cp -R exercises/trail-notes-starter ~/trail-notes
> ```

Work in your copy, never in the repository's `exercises/` folder. The solutions live in [exercises/trail-notes-solutions](../exercises/trail-notes-solutions/README.md). Open them after you have tried a capstone yourself.

## How the Course Is Organized

The course has four levels. Each level is one page made of modules, and each level ends with a capstone project.

| Level | Page | Modules | Budget | Capstone |
|---|---|---|---|---|
| 0 Orientation | [Level 0](level-0-orientation.md) | 1 | 65 min | [Capstone 0: First Session](../capstones/capstone-0-first-session.md) |
| 1 Beginner | [Level 1](level-1-beginner.md) | 3 | 223 min | [Capstone 1: Fix and Review](../capstones/capstone-1-fix-and-review.md) |
| 2 Intermediate | [Level 2](level-2-intermediate.md) | 5 | 497 min | [Capstone 2: Ship a Feature](../capstones/capstone-2-ship-a-feature.md) |
| 3 Advanced | [Level 3](level-3-advanced.md) | 5 | 433 min | [Capstone 3a: Offline-First App](../capstones/capstone-3a-offline-first-app.md) and [Capstone 3b: Optimize a Workflow](../capstones/capstone-3b-optimize-a-workflow.md) |

Every module has the same seven parts, in this order: Objectives, Time, Read, Exercise, Success Check, Checkpoint and Go Further. Read the linked articles first, then do the exercise, then confirm the result with the Success Check. The Checkpoint has three questions with hidden answers. Try to answer before you open them.

The budgets in the table add the reading time printed in each article to an exercise time that the course sets for each module. The reading times come from the knowledge base outline. The exercise times are planning budgets, not measurements. Each capstone page states its own budget.

### Tracks

Three optional tracks cut across the levels for readers who care most about one theme. Each is an ordered reading list with a sentence on why each article comes next.

- [App Development](track-app-development.md): scoping, specs, stacks, testing, offline work and backend pieces.
- [Process](track-process.md): the path from idea to deploy, with gates, branches, pull requests and handoffs.
- [Optimization](track-optimization.md): context, models, subagents, usage and measurement.

A track reorders articles you meet in the levels. It does not replace the levels, and the rubric scores all five areas.

## Suggested Pacing

This is a suggestion. Nobody timed a group of learners, so treat it as a starting point and adjust.

- Take one module, or two short ones, per sitting. Stop after the Success Check and come back for the Checkpoint if you are tired.
- Spend a few days on each level and rest between levels. Level 2 is the longest.
- Do each capstone in a separate sitting from the module work. Capstones 2, 3a and 3b are the largest items in the course.
- If you already know a topic, read the article's Checkpoint first. If you can answer it, skip to the exercise.

## How to Use the Knowledge Base

The levels are the course. The knowledge base is the reference behind it, and you can use it alone.

- The areas are Desktop App, Development, App Development, Process, Optimization, Workflow, Recipes, Decision Guides, Troubleshooting and Terminal Tips.
- Each article opens with a summary, then When to Use It, a main section (Steps, How It Works, a Decision Table, Symptoms and Fixes, or Measure It), a Worked Example, Pitfalls and a Checkpoint.
- The [glossary](../kb/glossary.md) defines terms. The cheatsheets cover [desktop shortcuts](../cheatsheets/desktop-shortcuts.md), [slash commands](../cheatsheets/slash-commands.md) and [terminal tips](../cheatsheets/terminal-tips.md). The `templates/` folder holds starting files such as a [CLAUDE.md](../templates/claude-md.md) and a [PR body](../templates/pr-body.md), and the `prompts/` folder holds reusable prompts such as [Explore a Repo](../prompts/explore-a-repo.md).
- Troubleshooting articles are written as symptoms and fixes, and the decision guides give a table you can read in five minutes.

Some articles describe "the author's setup." Those are anonymized patterns from one developer's daily use, collected in [Patterns from Practice](../docs/patterns-from-practice.md) and [Usage Audit](../docs/usage-audit.md). They are examples of one working setup, and yours can differ.

## About This Course

This course is independent. It is not affiliated with Anthropic, and Anthropic has not reviewed or endorsed it. Claude and Claude Code are Anthropic's products. Names of other tools belong to their owners.

Claude Code changes often. When this site and the official documentation disagree, the documentation is right. Start from [code.claude.com/docs/en](https://code.claude.com/docs/en/).

## How Verification Works

Each page lists the official documentation pages it was checked against in its front matter, and a `verified` date. The check covers whether the documentation describes a feature, what it calls it, and any label printed on the page, such as research preview, public beta, beta or experimental.

- The checks ran on 2026-10-22 against the official docs and the installed command-line tool, version 2.1.304. The [verification log](../docs/verification-log.md) lists every feature, its label and its verdict.
- Nobody ran preview features to test them, and the desktop app's runtime behavior was not tested. Pages describe the app the way the documentation does.
- Some things appear in the app but not in the documentation, such as pinning and searching sessions in the sidebar. Pages mark those with an "Observed in the app" callout that says the documentation does not cover them and that they may change.
- Flags that the documentation lists but the installed tool's help does not show are not taught as working.
- Numbers come from the documentation, from the usage audit or from simple arithmetic shown on the page. Where the documentation gives no limit, the page tells you where to look.

If a step does not match what you see, trust your screen, check the date on the page, and read the current documentation.

## Where to Go Next

Open [Level 0: Orientation](level-0-orientation.md). It covers installation, a tour of the Code tab and a first session on Trail Notes.
