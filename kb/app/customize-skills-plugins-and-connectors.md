---
title: Customize: Skills, Plugins and Connectors
id: A09
area: app
level: 2
time: 8
tags: [customize, skills, plugins, connectors]
verified: 2026-10-22
status: verified
sources:
  - https://code.claude.com/docs/en/desktop#extend-claude-code
  - https://code.claude.com/docs/en/desktop#use-skills
  - https://code.claude.com/docs/en/desktop#install-plugins
  - https://code.claude.com/docs/en/desktop#connect-external-tools
  - https://code.claude.com/docs/en/skills
  - https://code.claude.com/docs/en/plugins/install
related: [W04, W06, A12]
---

Customize is the sidebar item where you manage connectors, skills and plugins in one place. You add each from the + button next to the prompt box, and you should audit them now and then, because each one can add cost to every session.

## When to Use It

Add a skill when you keep pasting the same instructions. Add a connector when Claude needs to reach an outside service, such as a code host or an issue tracker. Add a plugin when you want a packaged bundle of skills, agents, hooks and MCP servers. Audit when sessions feel crowded or you cannot remember what you installed.

## Steps

1. **Click** Customize in the sidebar. It manages connectors, skills and plugins in one place. Cowork in the desktop app takes its skills, plugins and connectors from this configuration, which syncs through your claude.ai account. It does not read the CLI's `~/.claude` folder.
2. **Use** a skill. Claude loads skills automatically when they are relevant. To invoke one yourself, type `/` in the prompt box, or click + and select Slash commands, then pick from the list. The list covers built-in commands, your custom skills, project skills and skills from installed plugins. A selected skill appears highlighted; type your task after it and send as usual. You can send a command while Claude is working.
3. **Add** a plugin. In a local or SSH session, click + next to the prompt box and select Add plugins to open the plugin browser. If the menu shows Plugins instead, select it, then Browse plugins. Choose Manage plugins to enable, disable or uninstall. You can scope a plugin to your user account, a specific project, or local only.
4. **Add** a connector. Click + next to the prompt box, before or during the session, and select Add connectors to open the connector directory. If the menu shows Connectors instead, select it, then Browse connectors. Connectors are MCP servers with a graphical setup flow. To manage or disconnect one, go to Settings > Connectors.
5. **Check** where the session runs. The plugin browser is not available in cloud sessions, and plugins you install from the app are not available there either. Plugins are not available in WSL sessions, and the Connectors item can be grayed out in one.

For services not listed in the connector directory, add MCP servers through settings files, or create a custom connector.

### Where Skills Come From

Local sessions load your personal skills from `~/.claude/skills/`. An SSH session reads that folder from the remote host's home directory. Project skills come from the repository, plugin skills from enabled plugins, and some from the skills enabled on your claude.ai account. Cloud sessions load the claude.ai skills instead of `~/.claude/skills/`.

### Audit What You Installed

- For connectors, ask Claude what connectors are configured in your session, then review Settings > Connectors for anything you no longer use.
- For plugins, open Manage plugins from the + menu and disable or uninstall what you do not use. A plugin your organization installed through managed settings cannot be enabled, disabled or uninstalled by you.
- For skills, remember that each skill in the listing adds to your context on every turn, whether or not Claude uses it. Type `/skill-doctor` in the prompt box. It reports each skill's context cost and use and flags skills that were never invoked. It needs Claude Code v2.1.252 or later. The docs describe the report for Claude Code in general and do not say how the app shows it, so if you get no report, run it in the CLI.
- To remove a skill, delete a personal or project skill's folder, disable or uninstall the plugin that provides a plugin skill, or turn off a claude.ai skill in your claude.ai settings.

> **Terminal tip**
> In your shell, `claude plugin details <name>` prints an installed plugin's cost. Its `Always-on` line is the number of tokens the plugin adds to every session where it is enabled, and the rows below it show which skill or agent contributes most.

## Worked Example

Run a short audit on your own setup:

```prompt
Which connectors are configured in this session, and what can each one do?
```

Then open + > Manage plugins and list what is enabled. Finally type `/skill-doctor` and note the skills with the highest context cost that were never invoked.

For scale, the author's audit found 24 user-level skills (9 written by the author, 15 vendored), 2 custom agents, 1 custom command and 7 enabled plugins. Each project also carried 38 to 43 skills copied from a shared set. Counts like these are worth knowing, because every skill in the listing costs context on every turn. Write a skill when a procedure repeats, as in [Your First Skill](../workflow/your-first-skill.md), and see [Subagents by Design](../workflow/subagents-by-design.md) for work that needs heavy reading.

For Trail Notes, a project skill that runs `node checks/run.mjs` and summarizes failures would be a reasonable first one, because the same step repeats in every session.

## Pitfalls

- A skill that exists only in `~/.claude/skills/` on your machine is not found by a cloud scheduled task, because each run starts as a fresh cloud session. Desktop scheduled tasks run locally, so they do load it.
- Connectors let Claude read your calendar, send messages and create issues once connected. Add only the ones you need, and read what each one can do.
- A plugin enabled in a project's settings is not downloaded for your collaborators by that entry alone. Each of them also installs it.
- Skills pile up. Run the audit before you add the fortieth.
- Cloud threads in a [project](projects-dispatch-and-artifacts.md) do not pick up skills committed to a repository. Enable the skill for your claude.ai account instead.

## Checkpoint

You want a plugin in a local desktop session. Where do you add it, and which kinds of session cannot use the plugin browser?

<details><summary>Show the answer</summary>
Click + next to the prompt box and select Add plugins. If the menu shows Plugins instead, select it, then Browse plugins. Cloud sessions and WSL sessions cannot use the plugin browser.
</details>
