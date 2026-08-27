# Basic Git Workflow

---

## The Basic Workflow

Every day as a developer, you'll repeat this cycle over and over:

```
Edit files → git add → git commit → (repeat)
```

Let's go through each command in detail.

---

## git status

`git status` tells you the **current state** of your working directory and staging area.

```bash
git status
```

**What it shows you:**
- Which files are **untracked** (new files Git doesn't know about)
- Which files are **modified** (changed but not staged)
- Which files are **staged** (ready to commit)
- Which branch you're on

**Example output:**
```
On branch main
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        new file:   index.html

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
        modified:   style.css

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        script.js
```

---

## git add

`git add` moves files from the working directory to the **staging area**.

```bash
git add filename.txt          # stage a specific file
git add file1.txt file2.js    # stage multiple files
git add .                     # stage ALL changes in the current folder
git add *.js                  # stage all .js files
git add src/                  # stage an entire folder
```

> **Tip:** Think of `git add` as saying: "Hey Git, I want THIS change to be part of my next commit."

**Shortcut — commit without staging (only for already-tracked files):**
```bash
git commit -a -m "message"
```
This skips `git add` and directly commits all changes to files Git already tracks. It **will NOT add new/untracked files.**

---

## git commit

`git commit` saves a snapshot of everything in the staging area permanently into the repository.

```bash
git commit -m "Your commit message here"
```

**Good commit message habits:**
- Write in present tense: "Fix bug" not "Fixed bug"
- Be short and clear: describe **what** changed and **why**
- Examples:
  - `Add login page`
  - `Fix crash when user submits empty form`
  - `Update README with setup instructions`

**Amend the last commit** (if you made a mistake in your last commit message or forgot to add a file):
```bash
git add forgotten-file.txt    # optional: add a forgotten file
git commit --amend            # opens editor to change the commit message
```
> ⚠️ Only use `--amend` on commits you haven't pushed yet. Amending changes the commit hash.

---

## git log

`git log` shows the commit history of your repository.

```bash
git log
```

**Useful log options:**

```bash
git log                               # full commit history
git log --oneline                     # one line per commit (compact)
git log --oneline --graph             # shows branching structure as a tree
git log --oneline --graph --all       # includes all branches
git log -3                            # shows only the last 3 commits
git log -p                            # shows full diff for each commit
git log --stat                        # shows how many lines changed per file
git log --since=2.weeks               # commits from the last 2 weeks
git log --since=2.days                # commits from the last 2 days
git log --pretty=oneline              # similar to --oneline
git log --pretty=format:"%h - %ae"   # custom format: short hash + author email
```

**Reading a commit in `git log`:**
```
commit a1b2c3d4e5f6...       ← commit hash (SHA)
Author: Siddhesh <sid@email.com>
Date:   Mon Aug 26 2026

    Add login page            ← commit message
```

---

## git diff

`git diff` shows you **what changed** in your files.

```bash
git diff                  # changes in working directory vs staging area
git diff --staged         # changes in staging area vs last commit
git diff HEAD             # all changes since last commit
git diff main feature     # difference between two branches
git diff abc123 def456    # difference between two commits
```

**Reading `git diff` output:**
```diff
-const greeting = "Hello";    ← removed line (red)
+const greeting = "Hi there"; ← added line (green)
```

---

## git show

`git show` displays the details of a specific commit — what changed, who made it, when.

```bash
git show                    # show the last commit
git show abc123             # show a specific commit by hash
git show HEAD               # same as showing the last commit
git show HEAD~1             # show the commit before the last one
```

---

## git rm

`git rm` removes a file from both your working directory AND from Git's tracking.

```bash
git rm filename.txt         # delete and stop tracking the file
git rm --cached filename.txt  # stop tracking but KEEP the file on disk
```

**When to use `--cached`:**
You accidentally committed a file (like `.env` or `node_modules`) and want to remove it from Git but keep it on your computer.

```bash
git rm --cached .env
git commit -m "Remove .env from tracking"
```

> Then add `.env` to your `.gitignore` so it won't be tracked again.

---

## git mv

`git mv` renames or moves a file and automatically stages the change.

```bash
git mv old-name.txt new-name.txt    # rename a file
git mv file.txt src/file.txt        # move a file to a different folder
```

**Why use `git mv` instead of just renaming in your file explorer?**

If you just rename a file normally (without `git mv`), Git sees it as:
- Old file was deleted
- New file is untracked

Git won't recognize it as a rename. Using `git mv` tells Git it's a rename, so it keeps the history of that file correctly.

To undo a rename:
```bash
git mv new-name.txt old-name.txt    # just rename it back
```

---

## Practical First Project Example

```bash
# 1. Create a folder and initialize Git
mkdir my-website
cd my-website
git init

# 2. Create some files
echo "<h1>Hello World</h1>" > index.html

# 3. Check status
git status       # shows index.html as untracked

# 4. Stage the file
git add index.html

# 5. Check status again
git status       # shows index.html as "new file" (staged)

# 6. Commit the file
git commit -m "Add home page"

# 7. View history
git log --oneline
```

---

## Quick Reference

| Command                     | What it does                                              |
| --------------------------- | --------------------------------------------------------- |
| `git status`                | Show the state of your working directory and staging area |
| `git add <file>`            | Stage a specific file                                     |
| `git add .`                 | Stage all changes                                         |
| `git commit -m "msg"`       | Save staged changes as a commit                           |
| `git commit -a -m "msg"`    | Stage + commit tracked files in one step                  |
| `git commit --amend`        | Edit the last commit                                      |
| `git log`                   | View full commit history                                  |
| `git log --oneline --graph` | View history as a compact tree                            |
| `git diff`                  | Working directory vs staging area                         |
| `git diff --staged`         | Staging area vs last commit                               |
| `git show`                  | Show details of the last commit                           |
| `git rm <file>`             | Delete a file and stop tracking it                        |
| `git rm --cached <file>`    | Stop tracking a file but keep it locally                  |
| `git mv old new`            | Rename or move a file                                     |

