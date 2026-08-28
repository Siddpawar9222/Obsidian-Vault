# Terminal & Basic Commands

---

## Opening a Terminal

On Linux, open a terminal from your desktop (Ctrl+Alt+T on Ubuntu) or SSH into a server.

---

## pwd — Print Working Directory

Shows your **current location** in the filesystem.

```bash
pwd
```

Output:
```
/home/siddhesh
```

---

## ls — List Files

```bash
ls              # basic list
ls -l           # long format (permissions, size, date)
ls -a           # show hidden files (starting with .)
ls -la          # long format + hidden files
ls -lh          # human-readable file sizes
```

Example output of `ls -l`:
```
drwxr-xr-x  2 sid sid 4096 Aug 26 folder/
-rw-r--r--  1 sid sid  123 Aug 26 file.txt
```

---

## cd — Change Directory

```bash
cd foldername      # go into a folder
cd ..              # go up one level
cd ~               # go to home directory
cd /               # go to root directory
cd -               # go to previous directory
```

---

## clear

Clears the terminal screen.

```bash
clear
```

Shortcut: `Ctrl + L`

---

## history

Shows a list of commands you've previously run.

```bash
history
history | grep ssh       # search history for ssh commands
!5                       # re-run command number 5
!!                       # re-run the last command
```

---

## man — Manual Pages

Shows the manual/help page for any command.

```bash
man ls        # manual for ls
man chmod     # manual for chmod
man grep      # manual for grep
```

Press `q` to exit the manual.

---

## whoami

Shows the current logged-in username.

```bash
whoami
```

---

## Other Useful Terminal Commands

```bash
echo "hello"           # print text to terminal
date                   # show current date and time
uptime                 # how long the system has been running
hostname               # show the machine's name
which java             # show where java is installed
type ls                # show if a command is built-in or external
```

---

## Vim — Terminal Text Editor

Vim is a powerful text editor available in almost every Linux system. You'll need it for editing config files on servers.

### Modes

Vim works in **modes** — this is the most important concept:

| Mode | How to enter | What it does |
|---|---|---|
| **Normal mode** | `Esc` | Navigation and commands (default) |
| **Insert mode** | `i` | Typing text |
| **Visual mode** | `v` | Selecting text |

---

### Save & Exit (VERY IMPORTANT)

| Command | Meaning |
|---|---|
| `:w` | Save |
| `:q` | Quit |
| `:wq` | Save and quit |
| `:q!` | Force quit (discard changes) |

**Real-world use:**
```bash
git commit    # Vim opens → write message → Esc → :wq
```

---

### Insert Mode — Typing

| Command | Meaning |
|---|---|
| `i` | Insert at cursor |
| `a` | Insert after cursor |
| `o` | New line below |
| `O` | New line above |

---

### Navigation (Move without mouse)

| Command | Meaning |
|---|---|
| `h j k l` | Left, down, up, right |
| `w` | Next word |
| `b` | Previous word |
| `0` | Start of line |
| `$` | End of line |
| `gg` | Top of file |
| `G` | Bottom of file |

💡 Tip: Jump to bottom of a logs file → `G`

---

### Copy, Cut, Paste

| Command | Meaning |
|---|---|
| `yy` | Copy line |
| `dd` | Delete (cut) line |
| `p` | Paste below |
| `P` | Paste above |

---

### Undo / Redo

| Command | Meaning |
|---|---|
| `u` | Undo |
| `Ctrl + r` | Redo |

---

### Search

| Command | Meaning |
|---|---|
| `/word` | Search forward |
| `?word` | Search backward |
| `n` | Next result |
| `N` | Previous result |

```bash
/server.port    # jump to server.port in config file
```

---

### Replace

```bash
:%s/old/new/g       # replace ALL occurrences
:%s/user/customer/g # example
```

---

### Visual Mode (Select text)

| Command | Meaning |
|---|---|
| `v` | Select characters |
| `V` | Select whole lines |
| `Ctrl + v` | Block selection |

---

### Power Shortcuts

| Command | Meaning |
|---|---|
| `dw` | Delete word |
| `cw` | Change (replace) word |
| `D` | Delete to end of line |
| `.` | Repeat last command |

---

### Real Developer Scenario

```bash
vim application.properties
```

1. Search → `/server.port`
2. Edit → `i`
3. Save → `:wq`

---

### Memory Trick

- `d` → delete
- `y` → copy (yank)
- `p` → paste
- `w` → word
- `$` → end of line

Combine: `dw` = delete word, `d$` = delete to end of line

---

