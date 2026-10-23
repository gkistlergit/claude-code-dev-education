---
title: Backend Pieces: Functions, KV, D1 and R2
id: P08
area: app-development
level: 3
time: 10
tags: [backend, serverless]
verified: 2026-10-22
status: verified
sources:
  - https://code.claude.com/docs/en/best-practices
  - https://developers.cloudflare.com/workers/platform/pricing/
  - https://developers.cloudflare.com/pages/
  - https://developers.cloudflare.com/kv/concepts/how-kv-works/
  - https://developers.cloudflare.com/d1/
  - https://developers.cloudflare.com/d1/platform/pricing/
  - https://developers.cloudflare.com/d1/reference/migrations/
  - https://developers.cloudflare.com/d1/reference/time-travel/
  - https://developers.cloudflare.com/workers/wrangler/commands/d1/
  - https://developers.cloudflare.com/r2/get-started/
related: [P09, P10, P11]
---

A small app needs only four kinds of backend piece: functions that run code, a key-value store for small read-heavy values, a SQL database for records, and object storage for files. Pick the smallest one that fits, and change a database only through a migration that you read and first run on a local copy.

## When to Use It

Use it when [Choosing a Stack for a Small App](choosing-a-stack-for-a-small-app.md) says data has to leave the device. The author's small apps use these pieces on their hosting platform (pattern 14). This article uses Cloudflare's names for them, which are also the names in the title. Check the provider's own docs for details, because they change.

## Decision Table

| Piece | Use it for | Watch for | Free to start? |
|---|---|---|---|
| Serverless function | Code that runs when a request arrives: check input, read or write storage, keep a secret off the page | Anything the page contains, a visitor can read. Keep secrets in the platform's secret settings, never in committed files | The Workers Free plan covers Workers and Pages Functions |
| Key-value store (KV) | Small values you read often and write rarely: settings, lookups, cached results | It is eventually consistent, so a change can take time to appear in other locations. Its [docs](https://developers.cloudflare.com/kv/concepts/how-kv-works/) say it is not for atomic operations or read-and-write transactions | Included on the Free plan, with limited usage |
| SQL database (D1) | Records with fields and relationships, queries, updates that must agree | Every schema change needs a migration. It uses SQLite's SQL semantics | The docs say the Free plan will always allow prototyping |
| Object storage (R2) | Files: images, exports, uploads | The get-started page says to add an R2 subscription through a checkout flow first | Read that flow. Skip R2 if it asks for payment details |
| Browser storage | Data for one person on one device | It lives in that browser at that address only | Yes |

Cloudflare's docs now tell new projects to start with Workers. Pages Functions still exist and are billed as Workers, so the same free plan covers both. Limits and prices are on the provider's pricing pages, and this page states none. Read them before you rely on any piece.

To choose, work through these questions in order. Does the data leave the device? If not, use browser storage. Is it a file? That is object storage. Do you need queries, relationships or updates that agree with each other? Use the database. Otherwise a key-value store is the lightest fit.

## Worked Example

You keep notes in a D1 database and want to add tags. Here is the safe path, with Claude doing the drafting and you doing the two steps that matter.

1. Ask Claude for a new migration and nothing else. D1 stores each migration as a numbered `.sql` file in a `migrations` folder ([D1 migrations](https://developers.cloudflare.com/d1/reference/migrations/)), and `wrangler d1 migrations create` makes the empty file.

   ```prompt
   Add a tags column to the notes table. Create a new migration with `npx wrangler d1 migrations create notes-db add_tags` and write the SQL in it. Do not edit any earlier migration. Do not apply anything. Then explain each statement and say whether any existing row could be lost or changed.
   ```

2. Read the file yourself. A migration for this change should be one short statement, such as this:

   ```text
   ALTER TABLE notes ADD COLUMN tags TEXT NOT NULL DEFAULT '';
   ```

   If Claude's explanation and the file disagree, stop and ask why.
3. Apply it to the local database first. Seed that database with sample rows that look like real ones. A local database is a separate database with the same schema history, not a copy of your live rows.

   > **Terminal tip**
   > `wrangler d1 migrations apply` runs unapplied migrations and asks you to confirm first. `--local` points it at the local database used by `wrangler dev`, so the live data is not touched. `wrangler d1 execute` with `--command` runs one SQL statement, which lets you look at the result. Use the database name, not the binding name, because the docs say a binding name can change.
   >
   > ```terminal
   > npx wrangler d1 migrations apply notes-db --local
   > npx wrangler d1 execute notes-db --local --command="SELECT * FROM notes LIMIT 5"
   > ```

4. Run the app locally with `npx wrangler dev` and use the new feature. Ask Claude to write the function code and its checks against the local database.
5. Run the remote step yourself, after steps 1 to 4 pass.

   ```terminal
   npx wrangler d1 migrations apply notes-db --remote
   ```

   The [command docs](https://developers.cloudflare.com/workers/wrangler/commands/d1/) say it prompts for confirmation, captures a backup after it applies, and rolls back a migration that errors. D1 also offers [Time Travel](https://developers.cloudflare.com/d1/reference/time-travel/), a point-in-time restore that its docs describe as always on and useful before a failed migration. Read its current window and terms on the docs page, because this article does not state them.

> **Warning**
> A migration that drops or rewrites a column can lose data. Treat `--remote` like a production deploy. Do not put it inside any standing permission for Claude. In the author's setup, production database migrations are on the stop list ([A Standing Go with a Stop List](../process/a-standing-go-with-a-stop-list.md)).

## Pitfalls

- You edit a migration that has already been applied. Add a new numbered file instead.
- You use KV for a counter or an ordered list that two people update at once. Its docs say it is not ideal for atomic operations or for values that must be read and written in one transaction.
- You paste real rows into a prompt. Use sample data, and keep production data out of the session.
- You put a secret in `wrangler.jsonc`, in `launch.json`, or in any file you commit. Use the platform's secret settings.
- You treat "free plan" as "unlimited". Read the limits page and plan for the day an operation fails.
- You set up R2 before reading its checkout flow.

## Checkpoint

Why apply a migration with `--local` first, and who should run the `--remote` step?

<details><summary>Show the answer</summary>

The local run proves the SQL works and the app still behaves, without touching live data. You should run the remote step because it changes production data in a way that is hard to undo, and you are the one who has read the migration.

</details>
