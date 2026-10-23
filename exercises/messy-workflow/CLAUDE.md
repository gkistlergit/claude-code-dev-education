# Trail Notes

Instructions for Claude. Last updated in the spring, so some of this may be out of date. Ask if unsure.

## IMPORTANT

- ALWAYS follow every rule in this file.
- NEVER make mistakes.
- Be careful and think step by step before you do anything.
- Write clean, maintainable, production-ready code.
- You are an expert senior full-stack engineer with 20 years of experience.
- Always run the tests before you say you are done.

## Project overview

Trail Notes is a notes app for hikers. It is a React and TypeScript single page app bundled with webpack.
We are moving off React, so do not use React for new code.
The app is plain JavaScript with no build step.
It is a PWA and works offline.
Supported browsers: IE11 and the latest Chrome, Firefox and Safari.
Do not worry about old browsers.

## Setup

- Run `npm install` first.
- Run `npm run build` to bundle the app into `dist/`.
- Run `npm start` for the dev server on port 3000.
- There is nothing to install and there is no build step. Serve the folder with any static server.
- Node 14 is required. Do not use newer Node features.

## Tests

- Run the tests with `npm test` before you start and after every edit.
- Tests use Jest. Test files go in `tests/` and end in `.test.ts`.
- The checks in `checks/` run with `node checks/run.mjs`.
- Do not add new test files without asking.
- Mock everything that touches the DOM or localStorage.
- Do not mock anything. Test the real thing.

## Code style

- Use tabs for indentation.
- Always use semicolons.
- Use `var` so old browsers keep working.
- Add a JSDoc comment to every function.
- `app.js` is the main file and holds everything for the page.
- Do not put page code in `notes.js`.

## Git

- Commit after every change with a clear message.
- Do not commit unless the user asks.
- Create a branch for every change. Name it `feature/<thing>`.
- Work on main. Branches are too slow.
- Never push. The user pushes.
- Push to origin when the work is done so the user can see it.

## Permissions and safety

- Ask before running any shell command.
- Do not ask permission to run tests or read files. Just do it.
- Never delete files.
- Remove unused files and dead code when you find it.
- Do not touch `checks/`. It is managed by the team.
- Do not touch `notes.js`. It is generated.

## How to talk to the user

- Keep answers under 3 sentences.
- Explain your reasoning in detail so the user can learn.
- Never ask questions. Make a decision and keep going.
- If anything is unclear, ask before you start.
- If you are unsure, make your best guess.
- Never guess.

## Files and folders

- `src/` holds the source code.
- `dist/` is the build output. Never edit it.
- `legacy/` is the old jQuery version. Do not delete it.
- `notes.js` has the note logic.
- `app.js` has the page code.

## Features and behavior

- Notes have a title, a body and a date.
- Titles are required.
- Search is case sensitive on purpose. This was decided in a planning meeting. Do not change search behavior without asking.
- Search should be fast and forgiving.
- Notes are saved in IndexedDB.
- Notes sync to the server in the background.

## Accessibility and performance

- Make it accessible and make it fast.
- Use ARIA labels everywhere.
- Do not overuse ARIA.
- Never use innerHTML.
- Avoid innerHTML. Use textContent.

## Dependencies

- Do not add dependencies without asking.
- Use lodash for anything involving arrays or objects.
- Zero dependencies is a project goal.

## Deployment

- Deploy with `./deploy.sh`, which uploads the folder over FTP.
- Run `npm run lint` before every deploy.
- See the wiki for the full release checklist.

## Formatting (new rules, these win over the old ones)

- Use 2 spaces for indentation.
- No semicolons.
- Use `const` and `let`. Never use `var`.
- Comments only where the code is hard to follow.

## Notes from the last sprint

- TODO: write real docs.
- The sync bug is probably in `app.js`. Check there first.
- Keep it simple.
- Plan every change thoroughly before you edit anything.
- Just make the change. Skip long plans.
- When in doubt, add a TODO comment.
- Run the full test suite before you finish.
