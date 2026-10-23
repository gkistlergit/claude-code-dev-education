---
title: Track: App Development
kind: track
order: 1
time: 117
verified: 2026-10-23
sources:
  - https://code.claude.com/docs/en/best-practices
  - https://code.claude.com/docs/en/desktop
  - https://code.claude.com/docs/en/memory
---

This track is a reading order for building a small app with Claude Code, from an empty folder to offline support, a backend design and an AI feature. It reorders articles that also appear in the levels, and the reading time is 117 minutes.

## Who This Track Is For

Take this track if your goal is to build and ship small web apps and you want the articles about building in one sequence. You can read it alongside the levels or after Level 1. The hands-on work uses Trail Notes, a small notes app with no framework.

## Reading Order

1. [Start a New Project](../kb/recipes/start-a-new-project.md) (8 min). Begin with an empty folder and reach a first commit with a CLAUDE.md and a check script, so everything after it has somewhere to live.
2. [Scoping an App Before You Build](../kb/app-development/scoping-an-app-before-you-build.md) (8 min). Decide who the app is for and what it will not do before you write a line, using a one-page brief.
3. [Spec First: Grilling and a Glossary](../kb/app-development/spec-first-grilling-and-a-glossary.md) (9 min). The brief becomes explicit decisions, a shared vocabulary and tickets that say what blocks what.
4. [Choosing a Stack for a Small App](../kb/app-development/choosing-a-stack-for-a-small-app.md) (8 min). With a spec in hand you can pick the smallest stack that fits it and ask Claude to argue against your choice.
5. [A Static PWA on a Free Host](../kb/app-development/a-static-pwa-on-a-free-host.md) (10 min). A manifest, a service worker outline and HTTPS turn static files into an installable app you can host for free.
6. [UI and Design Systems with Claude](../kb/app-development/ui-and-design-systems-with-claude.md) (9 min). Tokens and a screenshot loop keep the interface consistent while the app grows.
7. [Testing Without a Framework](../kb/app-development/testing-without-a-framework.md) (9 min). Plain Node checks and one runner give you a safety net before you add features.
8. [Preview, Ship and Maintain](../kb/app-development/preview-ship-and-maintain.md) (8 min). Preview in the Browser pane, deploy a verified commit and settle into a light maintenance rhythm.
9. [Ship a Feature End to End](../kb/recipes/ship-a-feature-end-to-end.md) (10 min). One recipe joins the spec, a branch, a failing check, the change, a pull request and CI, with tags as the example.
10. [Backend Pieces: Functions, KV, D1 and R2](../kb/app-development/backend-pieces-functions-kv-d1-and-r2.md) (10 min). When the app needs a server, learn what each backend piece is for before you choose one.
11. [Offline-First with Service Workers](../kb/app-development/offline-first-with-service-workers.md) (10 min). Cache the app shell, version the cache and add a gate, so the app keeps working without a connection.
12. [Auth: Access and Passkeys](../kb/app-development/auth-access-and-passkeys.md) (9 min). Once there is data to protect, compare an access layer with passkeys and see why a human reads every line of auth code.
13. [AI Features Safely: Retrieval versus Generation](../kb/app-development/ai-features-safely-retrieval-versus-generation.md) (9 min). The last article covers adding an AI feature without putting a language model in the path where accuracy matters.

## Pair It with the Course

The track's articles appear in these modules, and each module's exercise gives you hands-on practice with the same ideas.

- [Level 1, Module M1.3](level-1-beginner.md): Start a New Project and Scoping an App Before You Build.
- [Level 2, Module M2.1](level-2-intermediate.md): Spec First and Choosing a Stack.
- [Level 2, Module M2.3](level-2-intermediate.md): Testing Without a Framework.
- [Level 2, Module M2.5](level-2-intermediate.md): A Static PWA on a Free Host, UI and Design Systems, Preview, Ship and Maintain, and Ship a Feature End to End.
- [Level 3, Module M3.3](level-3-advanced.md): Backend Pieces, Offline-First, Auth and AI Features Safely.

Finish with [Capstone 2: Ship a Feature](../capstones/capstone-2-ship-a-feature.md) and [Capstone 3a: Offline-First App](../capstones/capstone-3a-offline-first-app.md). The [rubric](../assessment/rubric.md) shows what the App Development area expects at each level.
