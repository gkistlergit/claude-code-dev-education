---
title: Choosing a Stack for a Small App
id: P03
area: app-development
level: 2
time: 8
tags: [stack]
verified: 2026-10-22
status: verified
sources:
  - https://code.claude.com/docs/en/best-practices
  - https://developers.cloudflare.com/workers/static-assets/
  - https://developers.cloudflare.com/pages/
  - https://developers.cloudflare.com/workers/platform/pricing/
  - https://developers.cloudflare.com/r2/get-started/
  - https://developers.cloudflare.com/cloudflare-one/setup/
  - https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
  - https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
related: [P04, P08, P02]
---

For a small app, start with plain HTML, CSS and JavaScript files. Add a serverless function only when data has to leave the device, and host the result somewhere that costs nothing and asks for no payment method. The table below says when each piece earns its place.

## When to Use It

Use it right after the spec names what the app must do and before the first line of code. Come back to it when a requirement changes, because a new requirement is the only good reason to add a piece.

## Decision Table

Read across. Find what the app needs, use the piece in the middle column, and add it only when the condition in the right column holds.

| The app needs | Use | Add it when |
|---|---|---|
| Pages, forms and a list, with data for one person on one device | HTML, CSS and JavaScript files, data in the browser (localStorage or IndexedDB) | This is the starting point |
| To open with no signal | A web app manifest and a service worker ([A Static PWA on a Free Host](a-static-pwa-on-a-free-host.md), [Offline-First with Service Workers](offline-first-with-service-workers.md)) | The brief says it must open offline |
| Data on more than one device, or for more than one person | A few serverless functions and one database ([Backend Pieces](backend-pieces-functions-kv-d1-and-r2.md)) | The spec names a second device or a second person |
| To know who is using it | Passkeys inside the app, or an access layer in front of it ([Auth: Access and Passkeys](auth-access-and-passkeys.md)) | Anyone besides you can reach the address |
| A build step | Nothing | You need something the browser cannot run as written, such as compiling TypeScript |
| A framework | Nothing | Many screens share a lot of state, several people edit the same interface, or you keep rewriting the same widget logic |

### Free hosts

Two hosts cover the course. This table states no limits and no prices on purpose, because they change. Open each provider's current pricing and limits pages before you build on it, and stop at any step that asks for a card.

| Host | Serves | What its docs say, and what to check |
|---|---|---|
| GitHub Pages | Static files straight from a repository | Available in public repositories with GitHub Free ([what is GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)). Sites are public. The [limits page](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) says the service is not for running an online business or an e-commerce site. |
| Cloudflare Workers with static assets | Static files, plus functions, KV and D1 | Accounts have the [Workers Free plan by default](https://developers.cloudflare.com/workers/platform/pricing/). Cloudflare's [Pages page](https://developers.cloudflare.com/pages/) now says to start new projects with Workers. [R2](https://developers.cloudflare.com/r2/get-started/) needs a subscription added through a checkout flow, and the [onboarding for Zero Trust](https://developers.cloudflare.com/cloudflare-one/setup/), its access product, asks for payment details even on the free plan. Skip both for now. |

The pages cited above do not say whether a plain account sign-up asks for a card, so read the sign-up screens yourself.

### Ask Claude to argue against your choice

```prompt
Here is my spec (@SPEC.md) and my stack: static files, no build step, data in localStorage, hosted on a free static host. Argue against it. Name the requirement in the spec most likely to break this choice, what I would have to add, and what that adds in files and moving parts. Do not suggest anything that needs a payment method.
```

Treat the answer as a list of risks to weigh.

## Worked Example

The Trail Notes brief says one person, one device, notes in the browser. The table gives a plain answer: static files, data in localStorage, no function, no database. GitHub Pages is the first host because it is static-only and needs nothing else. If the brief later says "must open with no signal", the second row adds a manifest and a service worker, and the files stay static.

The author's apps follow the same shape (pattern 14). They are small, framework-free progressive web apps: static files plus a few serverless functions. A service worker caches the app shell, data lives in IndexedDB or a baked-in seed, and the hosting platform supplies key-value, SQL and object storage. Sign-in is an access layer in front of the app plus passkeys. The reason given is that with no build step there is less for Claude, or you, to get wrong. This course teaches that shape and starts with the parts that need no payment method.

## Pitfalls

- You pick a framework before the spec lists a requirement it solves. It adds files and conventions that you and Claude must keep consistent.
- You add a database for data that never leaves the device.
- You trust a free-tier summary from an old article. Plans change, so read the provider's page the day you decide.
- You forget that a published site is public. Do not put private data in the folder you publish.
- You choose a host whose output is hard to move. If the deploy is a plain folder of files, moving later means copying a folder.

## Checkpoint

Your spec now says notes must sync between a phone and a laptop. Which row of the first table now applies, and what does it add?

<details><summary>Show the answer</summary>

The "data on more than one device, or for more than one person" row. It adds serverless functions and a database, and the "to know who is using it" row now applies too, because the data lives on a server that other people can reach.

</details>
