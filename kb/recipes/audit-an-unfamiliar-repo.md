---
title: Audit an Unfamiliar Repo
id: RC04
area: recipes
level: 2
time: 8
tags: [recipe, audit]
verified: 2026-10-22
status: verified
sources:
  - https://code.claude.com/docs/en/sub-agents
  - https://code.claude.com/docs/en/common-workflows
  - https://code.claude.com/docs/en/best-practices
  - https://code.claude.com/docs/en/desktop#choose-a-permission-mode
related: [O04, D09, A10, W06]
---

To understand a repository you did not write without filling your context, hand the reading to a read-only subagent that returns a short report: the layout, the commands to run, the risky areas and the tests. Then you read only the few files that matter.

## When to Use It

Use it when you open a repository for the first time, inherit a project, or review someone else's code. Pick a count that triggers delegation. In the author's setup a rule sends the work to a read-only scout agent when it means reading more than three files, mapping an unfamiliar repository, auditing for one pattern, or triaging long logs. The best-practices guide gives the reason: file reads consume your context, and a subagent reads in its own window and reports a summary. See [Delegating to Subagents](../optimization/delegating-to-subagents.md).

## Steps

1. **Open** the repository in a new session. You are not going to change it, so leave **Worktree** off. In the mode selector under the prompt box you can choose **Plan**, in which Claude reads and proposes without editing your source.
2. **Create** a read-only subagent. Put it in your user-level agents folder so you do not add files to a repository that is not yours. A subagent is a Markdown file with a short header, and listing only `Read`, `Grep` and `Glob` as its tools means it cannot edit anything or run commands. Save this as `~/.claude/agents/repo-scout.md`, or ask Claude to write it.

    ```md
    ---
    name: repo-scout
    description: Maps an unfamiliar repository and returns a short report. Use when asked to audit or get oriented in a repository.
    tools: Read, Grep, Glob
    ---

    You are a read-only repository scout. Read as much as you need, then reply with one report of at most one page:

    1. Layout: the top-level folders and what each is for.
    2. Commands: how to install, run and test, taken from the files. Do not run anything.
    3. Risky areas: code that touches authentication, secrets, data deletion, network calls or money, with file paths.
    4. Tests: where they live, how they run, and what they appear to cover.
    5. Open questions: what you could not tell from reading.

    Quote file paths and line numbers. Do not paste file contents.
    ```

    If Claude cannot find the new subagent, restart Claude Code and try again. The docs say a running session does not detect an `agents` directory that did not exist when the session started. If you would rather not create a file, ask for the built-in **Explore** subagent, which is read-only, and say how thorough it should be.

3. **Prompt** Claude to use it by name.

    ```prompt
    Use the repo-scout subagent to audit this repository and give me its report. Do not read the files yourself.
    ```

4. **Read** the report, then open only the files it names: the entry points and the risky areas. Check two of its claims against the code. A summary can be wrong, and a spot check tells you how far to trust the rest.
5. **Run** the commands the report found, starting with the tests. Switch the permission mode to **Manual** so you see each command before it runs, and read what an install or build command does before you approve it.
6. **Ask** follow-up questions in the main session, pointing at files with `@` so Claude reads them. Your context now holds the report and the few files you opened.
7. **Write** down what you learned in a short note kept outside the repository, such as a handoff note ([Handoff Ledgers and Retros](../process/handoff-ledgers-and-retros.md)), before you move on to other work in a fresh session.

## Worked Example

Treat the Trail Notes starter as a repository you have never seen and run step 3. The report might read like this:

```text
Layout: index.html, style.css and app.js make the page. notes.js holds the note logic as pure functions with no page or storage code. checks/ holds the checks. manifest.webmanifest describes the app.
Commands: package.json defines a "check" script that runs checks/run.mjs, and the runner loads every *.check.mjs file. There are no dependencies to install.
Risky areas: app.js saves and loads notes through localStorage, so a change to the note format can lose saved data. removeNote in notes.js deletes a note by id.
Tests: checks/notes.check.mjs and checks/search.check.mjs, using node:assert. They cover addNote, removeNote, sortNotes and searchNotes.
Open questions: whether the checks pass today. I could not run them.
```

The scout could not run anything, so the last line is its honest limit. You read `notes.js` and `app.js`, run `node checks/run.mjs` yourself, and see two failing checks in `search.check.mjs`. That tells you more than the report did, and it cost you two file reads and one command in your main context.

## Pitfalls

- Giving the scout write tools. A subagent that can edit has no business in a repository you only want to read.
- Asking it to "investigate" with no scope. The best-practices guide lists unscoped exploration as a failure pattern, because it fills the context with files. The five questions in the agent's instructions are the scope.
- Trusting the report without opening the files it cites.
- Running install or build commands from an unfamiliar repository without reading them first.
- Forgetting that a subagent's requests count toward the same usage limits as your main conversation.
- Saving the agent in the repository you are auditing. That adds a file to someone else's project.

## Checkpoint

Why does the scout list only `Read`, `Grep` and `Glob`?

<details><summary>Show the answer</summary>

Subagents can be limited to the tools you give them. With only those three, the scout can read and search but cannot edit files or run commands, so an audit cannot change the repository or the machine.

</details>
