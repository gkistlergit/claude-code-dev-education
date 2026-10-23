---
title: Scoping an App Before You Build
id: P01
area: app-development
level: 1
time: 8
tags: [scoping, planning]
verified: 2026-10-23
status: verified
sources:
  - https://code.claude.com/docs/en/best-practices
  - https://code.claude.com/docs/en/desktop
related: [P02, R01, RC01]
---

Before Claude writes any code, write a one-page brief: who the app is for, the one job it does, the smallest slice that proves the idea, and what you will not build. Claude can interview you and write the page, and every answer in it should be yours.

## When to Use It

Use it before a new app, and before any feature you cannot describe in one sentence. The best-practices guide says to skip planning when you could describe the diff in one sentence, so a typo fix or a renamed variable does not need a brief.

The brief stays short on purpose. [Spec First: Grilling and a Glossary](spec-first-grilling-and-a-glossary.md) turns it into a spec you can build from, and [The Idea-to-Deploy Flow](../process/the-idea-to-deploy-flow.md) shows where both sit on the way to a deploy. [Start a New Project](../recipes/start-a-new-project.md) takes an empty folder to a first commit.

## Steps

1. **Open** a session in a new, empty folder. Click the project folder control under the prompt box to pick it, and leave the permission mode on Manual so you see a diff before Claude writes any file. [Choosing a Project Folder](../app/choosing-a-project-folder.md) shows where the control is.
2. **Prompt** Claude to interview you. This is the interview prompt from the best-practices guide, aimed at a brief instead of a full spec. Replace the bracket with one sentence about your app.

   ```prompt
   I want to build [one sentence about the app]. Interview me using the AskUserQuestion tool, one question at a time. Cover who it is for, the one job it does, the smallest version that proves the idea, what I will not build, and how I will know it works. Skip obvious questions and push on the hard parts I might not have considered. When we have covered everything, write a one-page brief to BRIEF.md.
   ```

3. **Answer** in your own words and keep answers short. When you do not know yet, say so, and ask Claude to list the question under "Open questions". A recorded gap is better than a guess you never made.
4. **Check** the diff for BRIEF.md against this shape. Accept it only when every line is something you would say out loud.

   ```md
   # Brief: <app name>

   Who: <one person, described by their situation>
   Job: <the one thing it does, in one sentence>
   Smallest slice: <the least that proves the job is worth doing>
   Not building: <what you are leaving out on purpose>
   Done when: <a check you or Claude can run, or a screen you can look at>
   Open questions: <anything still undecided>
   ```

5. **Prompt** Claude to cut. Ask which line of the smallest slice you could remove and still prove the idea, then remove it if you agree.
6. **Start** a new session to build. The best-practices guide recommends a fresh session once the written plan exists: it has clean context focused on implementation, and you have a document to point at.

## Worked Example

Here is Trail Notes, the sample app in this course, in one page. A reader of this page should be able to tell what to build and what to refuse.

```md
# Brief: Trail Notes

Who: A hiker who wants to jot a note on a phone with weak signal and no account.
Job: Capture a short note and find it again later.
Smallest slice: Add a note, list notes newest first, search by title or body, delete a note. Notes stay in the browser.
Not building: Accounts, sync between devices, photos, sharing, reminders.
Done when: The four actions work in the browser and `node checks/run.mjs` passes.
Open questions: Must it open with no signal at all? Decide before building the app shell.
```

The "Not building" line gives you something to point at when a new idea shows up halfway through. The open question is the seed of [Offline-First with Service Workers](offline-first-with-service-workers.md). The "Done when" line names a command because the best-practices guide says Claude stops when the work looks done, and without a check it can run, looking done is the only signal it has.

## Pitfalls

- The brief grows into a spec. Past one page it is doing the work of the next article, and you are reading less of it.
- You let Claude answer its own questions. If you approve a suggested answer without thinking, the brief records Claude's guess about your app.
- There are no non-goals. A page with no "Not building" line has no way to say no.
- "Done when" says "works well". Name a command that passes or a screen you can check. The best-practices guide puts it plainly: if you cannot verify it, do not ship it.
- You freeze the brief. Update it in the same change that moves the plan, or it becomes the wrong document that Claude reads first.

## Checkpoint

Why should the last line of the brief be something a command or a screen can confirm?

<details><summary>Show the answer</summary>

Claude stops when the work looks done. A check it can run gives it a pass or fail signal, so the loop of doing the work, running the check and fixing what fails can close without you noticing each mistake by hand. A vague line such as "works well" gives it nothing to run.

</details>
