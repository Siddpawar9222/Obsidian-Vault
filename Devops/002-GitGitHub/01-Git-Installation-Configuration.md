# 01 - Git Installation & Configuration

---

## Installation

### Windows

1. Go to [git-scm.com](https://git-scm.com)
2. Download the installer → choose the **Standalone Installer (64-bit)**
3. Install it (keep default settings for beginners)

After installation you get:
- **Git Bash** — a terminal that works like a Linux terminal (use this for Git commands)
- **Git GUI** — a simple graphical tool

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install git
```

### Mac

```bash
brew install git
```

### Verify Installation

```bash
git --version
```

You should see something like `git version 2.x.x`.

---

## git config

`git config` is used to set your Git settings. These settings are stored in a special file and are used by Git for every commit you make.

**Why do you need to configure?**
Every commit you make has your name and email attached to it. Without this, Git doesn't know who made the commit.

---

## Username & Email

After installing Git, the **first thing** you should do is set your name and email:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

These will be attached to every commit you make.

To verify:

```bash
git config user.name
git config user.email
```

---

## Global vs Local Configuration

Git has two main levels of configuration:

| Level | What it applies to | Where it's stored |
|---|---|---|
| **Global** | All repositories on your computer | `~/.gitconfig` (your home folder) |
| **Local** | Only the current repository | `.git/config` (inside the repo folder) |

**Global** — use this for your personal name, email, and general settings:
```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

**Local** — use this if one project needs different settings (e.g., work vs personal projects with different emails):
```bash
# Inside the project folder:
git config user.email "work@company.com"
```

Local settings **override** global settings for that specific repository.

---

## Default Branch

By default, when you do `git init`, Git creates a branch called `master`. But newer GitHub repositories use `main` as the default.

To change your default branch name to `main` (to match GitHub):

```bash
git config --global init.defaultBranch main
```

---

## Git Editor

When Git needs you to write a commit message (or resolve something), it opens a text editor.

By default on Linux/Mac it opens **Vim**, which confuses many beginners.

To change the editor to something easier:

```bash
# Use VS Code
git config --global core.editor "code --wait"

# Use Nano (simpler terminal editor)
git config --global core.editor "nano"

# Use Notepad (Windows)
git config --global core.editor "notepad"
```

### Basic Vim controls (if Vim opens unexpectedly)

| Key | Action |
|---|---|
| `i` | Enter Insert mode (start typing) |
| `Esc` | Exit Insert mode |
| `:wq` then `Enter` | Save and quit |
| `:q!` then `Enter` | Quit without saving |

---

## .gitconfig

All your global settings are saved in a file called `.gitconfig` in your home folder.

You can view this file directly:

```bash
cat ~/.gitconfig
```

Or list all current settings:

```bash
git config --list
```

Example `.gitconfig` content:

```ini
[user]
    name = Siddhesh
    email = siddhesh@example.com
[core]
    editor = code --wait
[init]
    defaultBranch = main
[alias]
    st = status
    lg = log --oneline --graph
```

---

## Setting Aliases (Shortcuts)

Instead of typing long commands every time, you can create shortcuts:

```bash
git config --global alias.st "status"
git config --global alias.lg "log --oneline --graph --decorate --all"
```

Now:
- `git st` runs `git status`
- `git lg` runs the long log command

---

## Quick Reference

```bash
git config --global user.name "Your Name"       # Set your name
git config --global user.email "you@email.com"  # Set your email
git config --global init.defaultBranch main     # Default branch = main
git config --global core.editor "code --wait"   # Use VS Code as editor
git config --list                               # See all settings
git config user.name                            # Check a specific setting
```

