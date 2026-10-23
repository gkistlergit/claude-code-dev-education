# Hands-On Checklist

Things only the desktop app can show. Claude cannot drive its own window, so each line below needs a person looking at the Code tab. Reply with a word or a screenshot per line, in any order, and the pages get corrected from your answers. Do not mark a page `verified` from this list until the line is answered.

Use a throwaway copy so nothing real is touched: `cp -R exercises/trail-notes-starter ~/trail-notes-test`, then open that folder in the Code tab.

Written 2026-10-23. Each line names the page that makes the claim.

## Level 0 and 1 Controls

Pages: [learn/level-0-orientation.md](../learn/level-0-orientation.md), [learn/level-1-beginner.md](../learn/level-1-beginner.md)

- [ ] The row under the prompt box holds an environment selector with a Local group, and a project folder control with **Open folder…**.
- [ ] The permission mode selector sits in that row. List the names it shows (pages say Manual, Accept edits, Plan, Auto, Bypass permissions). Does Cmd+Shift+M open it?
- [ ] The model menu and the effort menu: where are they, and what are the entries called?
- [ ] Cmd+N starts a second session. Clicking its title in the title bar renames it. Esc stops a running reply.
- [ ] Hovering a session in the sidebar shows a menu with **Archive**. A heading in the list has a "Group and sort" icon, then **View all**, then an **Archived** tab.
- [ ] The Changes card shows line counts you can click. Cmd+Shift+D opens the Changes pane. Clicking a diff line opens a comment box, Enter adds the comment, Cmd+Enter submits the comments.
- [ ] Ctrl+\` opens the Terminal pane in the session's folder.
- [ ] Clicking a file path in the chat opens it in the file pane.

## Panes and Toggles

Page: [kb/app/the-panes.md](../kb/app/the-panes.md) and the pages linked from it

- [ ] Names and positions of the Changes, Files, Terminal, Browser and Plan panes.
- [ ] Plan pane: in the CLI, plan mode wrote its plan to `~/.claude/plans/<name>.md`. Does the Plan pane show that file, and when does it appear?
- [ ] The **Worktree** toggle (project folder control), **Auto-fix**, **Merge when ready**, **Customize**, split view, side chat, **+ New**: where does each live and what is it called?

## Observed in the App Callouts

- [ ] [Sessions and the Sidebar](../kb/app/sessions-and-the-sidebar.md): the controls for pinning and searching sessions. Names, positions, keys.
- [ ] [Choosing a Project Folder](../kb/app/choosing-a-project-folder.md): the scratch or temporary workspace. How you start one, where it lives, whether it is deleted.
- [ ] [Fast Mode](../kb/optimization/fast-mode-when-it-pays.md): the fast mode control on the Code tab. Position, whether it saves a default, whether it asks for confirmation.

## Slash Commands in the Code Tab

The docs say commands that open a terminal panel may behave differently. For each, say what happened: worked inline, opened a panel, did nothing, or errored.

- [ ] `/memory`
- [ ] `/rewind` (Level 1 step 5 expects: choose the prompt, then **Restore code**)
- [ ] `/skill-doctor`
- [ ] `/usage`
- [ ] `/status`
- [ ] `/context` (Level 1 expects a **Memory files** list)
- [ ] `/hooks`

## Settings Wording

The app's own settings tool reports these labels. Check them against Settings, then Claude Code.

- [ ] "Auto-archive sessions when their pull request closes". The pages say "Auto-archive after PR merge or close".
- [ ] "Archive inactive sessions", default 7 days, choices 1, 2, 7, 14, 30. The pages do not mention it.
- [ ] "Branch prefix", "Worktree location", "Connect new sessions to Remote Control", "Keep computer awake while Claude works".
- [ ] The output style menu: reported as the session title-bar menu.

## Hook in a Real Session

Page: [templates/hook.md](../templates/hook.md). The guard hook on this machine stops Claude from running the test command, so run it yourself from the root of this repository. It builds a scratch repo, installs the template's hook, asks Claude to run a blocked command and shows whether the commit survived.

```terminal
R=$PWD && S=$(mktemp -d) && cd "$S" && mkdir -p .claude/hooks && git init -q && git config user.email t@example.com && git config user.name t && echo one > a.txt && git add . && git commit -qm one && echo two >> a.txt && git commit -qam two
node -e 'const fs=require("fs");const t=fs.readFileSync(process.argv[1],"utf8");const b=[...t.matchAll(/\x60{3}(json|js)\n([\s\S]*?)\x60{3}/g)];fs.writeFileSync(".claude/settings.json",b.find(x=>x[1]==="json")[2]);fs.writeFileSync(".claude/hooks/block-destructive-git.mjs",b.find(x=>x[1]==="js")[2])' "$R/templates/hook.md"
claude -p "Run exactly this shell command and tell me what happened, quoting any error text verbatim: git reset --hard HEAD~1" --setting-sources project --allowedTools "Bash(git *)"
git log --oneline
```

- [ ] The reply quotes "Blocked: this git command can destroy work. Ask the user to run it." and `git log --oneline` still lists both commits.
- [ ] Same test inside a Code tab session in a copy of that folder: does the block reason show in the chat?
