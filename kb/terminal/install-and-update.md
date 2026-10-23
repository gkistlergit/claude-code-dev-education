---
title: Install and Update
id: T01
area: terminal
level: 0
time: 8
tags: [terminal, install]
verified: 2026-10-22
status: verified
sources:
  - https://code.claude.com/docs/en/setup
  - https://code.claude.com/docs/en/authentication
  - https://code.claude.com/docs/en/terminal-guide
  - https://code.claude.com/docs/en/troubleshoot-install
  - https://curl.se/docs/manpage.html
  - https://brew.sh/
related: [A02, T02, TS04]
---

This page teaches the three Terminal commands that move you around (`pwd`, `ls` and `cd`), then installs the `claude` command-line tool, signs you in and keeps it up to date. You can skip all of it and stay in the desktop app.

## When to Use It

The desktop app includes Claude Code, so you do not need the command-line tool or Node.js to use the Code tab. Install the tool when you want to run `claude` inside a folder from Terminal, resume a session by name, or script Claude Code in the later Terminal articles. See [Install, Sign In and Your First Session](../app/install-sign-in-and-your-first-session.md) for the app route.

You need macOS 13.0 or later, an internet connection, and a Pro, Max, Team, Enterprise or Console account. The free claude.ai plan does not include Claude Code.

## Steps

1. **Open** Terminal. Press Cmd+Space, type `Terminal` and press Enter. A window opens with a blinking cursor. You type a command there and press Enter to run it. Cmd+V pastes.

2. **Learn** three commands that show where you are and let you move. Run them one at a time.

   ```terminal
   pwd
   ```

   `pwd` prints the full path of the folder you are in. It stands for "print working directory". Terminal starts in your home folder.

   ```terminal
   ls
   ```

   `ls` lists the files and folders in the current folder. `ls -la` adds hidden files and details such as size and date.

   ```terminal
   cd Documents
   ```

   `cd` changes the current folder. Run `pwd` afterward to confirm the move. `cd ..` goes up one level. `cd ~`, or `cd` alone, returns to your home folder. Wrap a folder name that contains spaces in quotes.

3. **Run** the native installer. The docs recommend it.

   ```terminal
   curl -fsSL https://claude.ai/install.sh | bash
   ```

   `curl` downloads the text at that address. The flags make it fail on server errors (`-f`), stay quiet (`-s`), still show errors (`-S`) and follow redirects (`-L`). The pipe `|` hands the downloaded text to `bash`, which runs it as a program. The docs say the command shows no progress while it downloads, so wait for the message "Claude Code successfully installed!".

4. **Read** the script first if you prefer not to run something you have not seen. Save it to a file, read it, then run the saved copy.

   ```terminal
   curl -fsSL https://claude.ai/install.sh -o install.sh
   less install.sh
   bash install.sh
   ```

   `-o install.sh` writes the download to a file in the current folder instead of running it. `less` shows the file one screen at a time: press Space for the next screen and `q` to quit. `bash install.sh` runs the file you just read.

5. **Choose** Homebrew instead if you already use it. This needs [Homebrew](https://brew.sh) installed first.

   ```terminal
   brew install --cask claude-code
   ```

   The `claude-code` cask follows the stable channel, which the docs describe as typically about a week behind. The `claude-code@latest` cask follows the latest channel.

6. **Check** the install in a new Terminal window.

   ```terminal
   claude --version
   ```

   A working install prints a version number such as `2.1.211 (Claude Code)`. If Terminal says `command not found: claude`, the folder holding `claude` is not on your PATH, the list of folders the shell searches. The installer prints the fix under `Setup notes`. For the default macOS shell, zsh, the docs give these two commands:

   ```terminal
   echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc
   ```

   The first command appends one line to `~/.zshrc`, the file zsh reads at startup, so the shell also searches `~/.local/bin`. Type `>>` exactly: a single `>` would overwrite the file. The second command applies the change to the current window.

7. **Run** the health check.

   ```terminal
   claude doctor
   ```

   It prints read-only diagnostics about the install and your settings files, without starting a session.

8. **Sign in** by going to a project folder and starting Claude Code.

   ```terminal
   claude
   ```

   On first launch Claude Code opens a browser window to log in. If the browser does not open, press `c` to copy the login URL. When login finishes, the terminal shows `Login successful`. Inside a session, `/login` signs you in again and `/logout` signs you out.

9. **Update** when you want a new version now.

   ```terminal
   claude update
   ```

   Native installs also update themselves in the background. Homebrew installs do not, so run `brew upgrade claude-code` (or `brew upgrade claude-code@latest` for the other cask).

## Worked Example

You copied the Trail Notes starter to a folder named `trail-notes` in your home folder. Open Terminal and run:

```terminal
cd ~/trail-notes
pwd
ls
claude --version
```

`pwd` prints the path you moved to. `ls` should include `app.js`, `checks`, `index.html`, `manifest.webmanifest`, `notes.js`, `package.json` and `style.css`. If it does not, you are in the wrong folder, so run `cd ~` and try again. `claude --version` prints the version number, which confirms the tool is on your PATH.

> **Terminal tip**
> `which -a claude` lists every `claude` program your shell can find. More than one line means more than one install, which can cause version mismatches. `ls -la ~/.local/bin/claude` shows whether the native installer's copy exists. The troubleshooting page linked in this article's sources explains each result.
>
> ```terminal
> which -a claude
> ```

## Pitfalls

- The PATH fix applies only to windows opened after you edit `~/.zshrc`, unless you also run `source ~/.zshrc`.
- Running the install command twice with different methods, for example the native installer and Homebrew, leaves two copies. Pick one.
- Homebrew installs do not update on their own. If `claude --version` looks old, run the `brew upgrade` command for your cask.
- `curl ... | bash` runs whatever the address returns. Use it only for addresses you trust, such as the one in the official docs, and use the save-and-read route from step 4 when in doubt.
- The Windows install commands in the docs differ from the macOS one. This page covers macOS.

## Checkpoint

1. What does `pwd` print, and why does step 4 save the installer to a file before running it?
2. After a successful install, `claude --version` says `command not found: claude`. What is the likely cause and the fix?

<details><summary>Show the answer</summary>

1. `pwd` prints the full path of the folder you are in. Saving the installer with `-o` lets you read the script with `less` before `bash install.sh` runs it.
2. The folder holding `claude`, `~/.local/bin`, is not on your PATH. Add it to `~/.zshrc` with the `echo` command shown in step 6, run `source ~/.zshrc`, and try again in a new window.

</details>
