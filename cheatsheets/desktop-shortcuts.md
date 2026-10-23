---
title: Desktop Shortcuts
kind: cheatsheet
order: 1
verified: 2026-10-23
sources:
  - https://code.claude.com/docs/en/desktop
---

Keyboard shortcuts for the Code tab in the desktop app, as printed on the desktop page of the official docs. Keys below are the macOS keys. Press `Cmd` `/` in the app to see the list for your version.

## Windows and Linux Keys

| macOS | Windows and Linux |
| :- | :- |
| `Cmd` | `Ctrl` |
| `Cmd` `Option` | `Alt` |
| `Cmd` `Ctrl` | `Ctrl` `Alt` |

Session cycling, the terminal toggle and the view-mode toggle use `Ctrl` on every platform.

## Sessions

| Shortcut | Action |
| :- | :- |
| `Cmd` `N` | New session |
| `Cmd` `W` | Close session |
| `Ctrl` `Tab` / `Ctrl` `Shift` `Tab` | Next or previous session |
| `Cmd` `Shift` `]` / `Cmd` `Shift` `[` | Next or previous session |
| `Cmd` `Option` `1` to `9` | On the new session screen in the current layout, select an environment |
| `Cmd` `Option` `0` | On the new session screen in the current layout, open the **New environment** dialog |
| `Cmd` `Ctrl` `W` | Take the focused session out of split view |
| `Option`-click a session | Open it side by side in split view |
| `Cmd`-click a session | Open it in its own window |

## Prompt Box and Chat

| Shortcut | Action |
| :- | :- |
| `Enter` | Send the prompt. A correction typed while Claude works is read after the current action finishes. |
| `Esc` | Stop Claude's response |
| `Tab` or `Right arrow` | Accept the suggested prompt when the prompt box is empty |
| `Cmd` `;` | Open a side chat |
| `Ctrl` `O` | Cycle view modes: Normal, Thinking, Verbose. Thinking appears once Claude has produced thinking in the session. |
| `1` to `9` | Select an item in an open menu |

## Menus

| Shortcut | Action |
| :- | :- |
| `Cmd` `Shift` `M` | Open the permission mode menu |
| `Cmd` `Shift` `I` | Open the model menu |
| `Cmd` `Shift` `E` | Open the effort menu |

## Panes and Diff

| Shortcut | Action |
| :- | :- |
| `Cmd` `Shift` `D` | Toggle the diff pane |
| `Cmd` `Shift` `B` | Toggle the Browser pane |
| `Cmd` `Shift` `S` | Select an element in the Browser |
| `Ctrl` `` ` `` | Toggle the terminal pane |
| `Cmd` `\` | Close the focused pane |
| `Enter` in a diff comment box | Add the comment to the line |
| `Cmd` `Enter` | Submit all diff comments at once |
| `Cmd`-click an external link in the chat | Open it in your default browser instead of the Browser pane |

## Good to Know

- `Shift` `Tab` does not cycle permission modes in the desktop app, unlike in a terminal session. Use the mode selector under the prompt box or `Cmd` `Shift` `M`.
- If the app will not quit, the docs' troubleshooting section says to press `Cmd` `Q` on macOS, then use Force Quit with `Cmd` `Option` `Esc` if it does not respond.
- These shortcuts apply to the Code tab. For what each pane does, see [The Panes](../kb/app/the-panes.md). For sessions, see [Sessions and the Sidebar](../kb/app/sessions-and-the-sidebar.md) and [Split View, Side Chat and Side Sessions](../kb/app/split-view-side-chat-and-side-sessions.md). For the terminal's own keys, see [Terminal Tips](terminal-tips.md).
