---
title: A Static PWA on a Free Host
id: P04
area: app-development
level: 2
time: 10
tags: [pwa, hosting]
verified: 2026-10-22
status: verified
sources:
  - https://code.claude.com/docs/en/desktop#preview-your-app
  - https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable
  - https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest
  - https://developer.chrome.com/docs/devtools/progressive-web-apps
  - https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
  - https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
  - https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https
  - https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
  - https://developers.cloudflare.com/workers/static-assets/get-started/
related: [P07, P09, P03]
---

A progressive web app (PWA) is a web app with a manifest and a secure address, which lets a browser offer to install it. For Trail Notes, the work is checking the manifest and choosing a host.

## When to Use It

Use it when the app works on your machine and you want a real address, an install prompt on a phone or a Mac, or a link to send someone. If the app should also open with no signal, finish this article first and then read [Offline-First with Service Workers](offline-first-with-service-workers.md). MDN notes that a service worker is not required for installability.

## Steps

1. **Copy** the Trail Notes starter into your own folder and pick that folder as the project folder in the Code tab. The [starter README](../../exercises/trail-notes-starter/README.md) has the copy command.
2. **Prompt** Claude to audit the manifest before it edits anything. The starter's manifest has no icons on purpose, so expect gaps.

   ```prompt
   Read @manifest.webmanifest and @index.html. Compare them with the installability requirements on MDN's "Making PWAs installable" page. List what is missing, one line each. Do not edit any file yet.
   ```

   For Chromium-based browsers [MDN lists](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable) a `name` or `short_name`, `icons` that include a 192px and a 512px image, a `start_url`, a `display` or `display_override`, and no `prefer_related_applications` set to true. Every page of the app must also link the manifest with a `<link rel="manifest">` element.
3. **Supply** two square PNG icons at those sizes. Any plain image works for a first deploy. Ask Claude to add them to the manifest, then **Review** the result in the **Changes** pane.
4. **Preview** the app: ask Claude to open it in the Browser pane. A static folder needs a small static server, which [Preview, Ship and Maintain](preview-ship-and-maintain.md) sets up.
5. **Check** that every path in the manifest and in `index.html` is relative, such as `./` and `./app.js`, with no leading slash. A project site on a shared host lives under a sub-path, and a leading slash points outside it.
6. **Choose** a host and publish. For GitHub Pages, push the folder to a public repository ([git and gh Essentials](../terminal/git-and-gh-essentials.md) covers the push), open its **Settings**, choose **Pages**, and under "Build and deployment" set "Source" to **Deploy from a branch**. Pick the branch and the folder, then click **Save** ([GitHub's steps](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)). For Cloudflare, ask Claude to read the [static assets get-started page](https://developers.cloudflare.com/workers/static-assets/get-started/) and propose the smallest config for this folder, then run the deploy yourself.
7. **Open** the https address the host gives you. In a Chromium-based browser, look for the install icon in the address bar, or open the developer tools, choose the **Application** panel and read the **Manifest** pane ([Chrome's guide](https://developer.chrome.com/docs/devtools/progressive-web-apps)). Safari on macOS Sonoma or later offers **File > Add to Dock** for any site.

> **Terminal tip**
> Cloudflare's guide deploys with Wrangler, its command-line tool. `npx` runs a command-line tool from the npm registry, downloading it first if needed. `wrangler deploy` builds and uploads the assets folder named in your Wrangler config. Log in first with `npx wrangler login`. Read which folder the config names before you run the second command.
>
> ```terminal
> npx wrangler login
> npx wrangler deploy
> ```

## Worked Example

You publish Trail Notes to a project site on GitHub Pages. The address looks like `https://<owner>.github.io/<repository>/`, where the repository name is part of the path. The audit prompt reports that icons are missing. After you add two icons, the install icon appears in a Chromium-based browser on the hosted address.

Add a note on the hosted page and then open `localhost` again. The note is not there. The starter README explains that notes live in the browser's `localStorage` for that exact address, so the hosted site and your local server keep separate lists.

## Pitfalls

- Absolute paths such as `/app.js` work on your machine and break on a project site, where the app lives under `/<repository>/`. Use `./`.
- You publish the whole folder. That includes `checks/` and `package.json`. It is harmless for a sample, but for a real app publish a folder that holds only what the browser needs.
- Pages sites are public, even when the repository is private on plans that allow it. Keep private data out of anything you publish. GitHub's HTTPS page for Pages also warns against sending passwords or card numbers through a Pages site.
- GitHub's usage terms for Pages say it is not for running an online business or an e-commerce site. Read them before you put a real product there.
- Install needs https or `localhost`, and so does a service worker. A page opened by double-clicking `index.html`, which gives a `file://` address, meets neither.
- After a redeploy, some visitors still see the old app. That is a cache problem, and [Offline-First with Service Workers](offline-first-with-service-workers.md) explains the cure.

## Checkpoint

Why is `"./"` a safer `start_url` than `"/"` on a GitHub Pages project site?

<details><summary>Show the answer</summary>

A project site is served from a path that includes the repository name. `"/"` means the root of the whole host, which is outside your app, while `"./"` means the folder the manifest sits in, so it follows the app wherever it is published.

</details>
