---
title: Auth: Access and Passkeys
id: P10
area: app-development
level: 3
time: 9
tags: [auth, passkeys]
verified: 2026-10-22
status: verified
sources:
  - https://code.claude.com/docs/en/permissions
  - https://code.claude.com/docs/en/best-practices
  - https://code.claude.com/docs/en/desktop#configure-preview-servers
  - https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API
  - https://developer.mozilla.org/en-US/docs/Web/Security/Authentication/Passkeys
  - https://developers.cloudflare.com/cloudflare-one/setup/
  - https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/self-hosted-public-app/
  - https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/
  - https://developers.cloudflare.com/workers/configuration/routing/workers-dev/
  - https://developers.cloudflare.com/pages/configuration/preview-deployments/
  - https://developers.cloudflare.com/kv/concepts/how-kv-works/
related: [D09, P08, R07]
---

An access layer decides who can reach the app at all. Passkeys decide which person is signed in once they are inside. Claude can draft either one, a person has to read every line of auth code, and no secret ever goes into a prompt.

## When to Use It

Use it before anyone other than you can reach an app that stores their data. Trail Notes as it stands keeps notes in the browser and has no server, so it has nothing to authenticate. The need appears once the app has a server and holds other people's data, as in [Backend Pieces](backend-pieces-functions-kv-d1-and-r2.md).

## How It Works

### The Two Layers

| | Access layer | Passkeys (WebAuthn) |
|---|---|---|
| Answers | Who may reach this address at all | Which person this is |
| Runs | In front of the app, operated by the provider | Inside the app: browser code and server code |
| Protects | Requests to the addresses it covers | Features and data you attach to a signed-in user |
| Misses | Other addresses that serve the same app | Anything people can fetch before they sign in |
| Free with no payment method? | Cloudflare's [setup page](https://developers.cloudflare.com/cloudflare-one/setup/) says onboarding asks for a plan and payment details, and that this is still needed on the Free plan, with no charge | Yes. It is a browser feature plus your own server code |

Cloudflare Access, the example here, is deny by default: a visitor must match an Allow policy. It covers only what you attach it to. The [`workers.dev` address](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/) is public when enabled, and [Pages preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/) are public by default, so each needs its own policy. The app should also validate the signed token that Access sends in the `Cf-Access-Jwt-Assertion` header ([how](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/)), so a request that skips the gateway is rejected. The author's setup uses both layers (pattern 14). Because the access product asks for payment details, this knowledge base treats it as something to understand and gives no steps for it.

### Passkeys in Outline

At registration, your server makes a random challenge. The browser passes it to `navigator.credentials.create()`, and the authenticator creates a key pair. The private key stays in the authenticator. The server checks the challenge and the origin, then stores the public key with the user. At sign-in, the server issues a new challenge, the browser calls `navigator.credentials.get()`, and the server verifies the signature against the stored public key.

[MDN's Passkeys guide](https://developer.mozilla.org/en-US/docs/Web/Security/Authentication/Passkeys) adds three details that shape your design. The challenge comes from the server, and a server should discard it after about 10 minutes. A passkey is scoped to a domain, so by default only the same origin can use it. Decide your final address before you register real users, because a move to a new domain can leave existing passkeys unusable. MDN also encourages more than one passkey per account, such as one on a phone and one on a hardware key, because losing an authenticator loses its passkeys.

### What Claude Drafts and What You Read

Claude can draft the two browser calls, the endpoints that issue challenges, the table that stores public keys, the tests for failure paths and a review checklist. You read every line of what it writes. The failure is silent: login code that accepts a forged response behaves like code that works until someone forges one. The best-practices guide names this gap, where a plausible implementation misses edge cases, and its fix applies in full: if you cannot verify it, do not ship it.

Signature and response parsing are the parts to leave to a maintained WebAuthn server library. Ask Claude to compare candidates from their own docs, then pick one and read its docs yourself.

### Secrets

Never paste a secret into a prompt, and keep secrets out of files you commit. The desktop docs warn that `launch.json` is committed to your repository, so it is no place for them. To keep Claude's file tools away from a file, add a deny rule such as `Read(./.env)` in `/permissions`. The permissions docs say rules are enforced by Claude Code and not by the model, and that they cover built-in file tools and recognized file commands in Bash, but not a script that opens files itself. For OS-level blocking, enable the sandbox. In the author's setup, secrets are on the stop list ([A Standing Go with a Stop List](../process/a-standing-go-with-a-stop-list.md)).

## Worked Example

A small team app sits behind an access layer, so only invited people reach it. Inside, each person registers a passkey. You ask Claude to review the sign-in code against MDN's own checklist, then you read the same code:

```prompt
Review the sign-in code in @functions/auth.js against MDN's Passkeys guide. For each check say pass, fail or cannot tell, and quote the line: the challenge is made on the server and is random; the challenge is single use and expires; the origin is checked; the relying party ID is checked; the signature is verified against the stored public key. Change nothing.
```

Treat the answer as a second pair of eyes. A reviewer asked to find gaps will usually report some, so judge each finding on whether it affects correctness, and do not skip the reading. The check on single use deserves your own attention: KV's docs say it is eventually consistent and not for atomic operations, so think about where challenges are stored. [Security Review Habits](../development/security-review-habits.md) covers the wider habits, including keeping secrets out of prompts and reading security-critical code yourself.

## Pitfalls

- You protect the main address and leave a default or preview address public.
- You trust a clean review from Claude and skip your own pass.
- You write signature checks by hand.
- You register passkeys on a temporary address, then move the app.
- You offer one passkey per account and no recovery path.
- You paste a `.env` file into the session to explain an error. Paste the error with the values removed.
- You log challenges, tokens or session values. Log events and keep the secrets out.

## Checkpoint

Your app is behind an access layer on its main address. What else do you check?

<details><summary>Show the answer</summary>

Whether any other address serves the same app, such as the provider's default address or preview deployments, which are public unless you add a policy. Also check that the app validates the token the gateway sends, so a request that bypasses the gateway is refused.

</details>
