# Undoing Changes

---

## Overview

Git gives you powerful tools to undo mistakes. The key is knowing **which situation you're in**:

| Situation | Best tool |
|---|---|
| Undo changes in working directory (not staged) | `git restore <file>` |
| Undo staging (unstage a file) | `git restore --staged <file>` |
| Undo the last commit (keep changes) | `git reset --soft HEAD~1` |
| Undo the last commit (discard changes) | `git reset --hard HEAD~1` |
| Undo a commit that was already pushed | `git revert <commit>` |
| Remove untracked files/folders | `git clean` |

---

## git restore

`git restore` is the **modern way** to discard changes in your working directory or unstage files.

### Discard changes in working directory

```bash
git restore filename.txt         # discard changes in ONE file (back to last commit)
git restore .                    # discard ALL changes in working directory
```

> ⚠️ This is **permanent** — your changes are gone. There's no undo.

### Unstage a file

```bash
git restore --staged filename.txt    # remove from staging, keep changes in working dir
git restore --staged .               # unstage everything
```

**Older equivalent (still works):**
```bash
git checkout -- filename.txt          # old way to discard changes
git reset HEAD filename.txt           # old way to unstage
```

---

## git reset

`git reset` **moves the branch pointer backward** to an older commit. It's used to undo commits.

Think of it as: **"Move the branch pointer to this commit"**

```
Before reset:
A → B → C → D
            ↑
           main

After: git reset HEAD~2
A → B → C → D
    ↑
   main
```

`C` and `D` are no longer part of the branch's history (but they still exist in Git's object database for a while).

---

### Soft Reset

```bash
git reset --soft HEAD~1
```

- ✅ Moves the branch pointer backward
- ✅ Keeps your changes **staged** (in the staging area)

**Use case:** "I committed too early. Let me add a few more files to this commit."

```
Before:  A → B → C (current HEAD)
After:   A → B     (changes from C are now staged, ready to recommit)
```

---

### Mixed Reset (Default)

```bash
git reset HEAD~1
# or explicitly:
git reset --mixed HEAD~1
```

- ✅ Moves the branch pointer backward
- ✅ Keeps your changes in **working directory** (files are still modified)
- ❌ Unstages the changes

**Use case:** "I made a bad commit. Let me redo it properly."

```
Before:  A → B → C (current HEAD)
After:   A → B     (changes from C are in working dir, not staged)
```

---

### Hard Reset

```bash
git reset --hard HEAD~1
```

- ✅ Moves the branch pointer backward
- ❌ **Permanently discards** the changes (both staged and working directory)

**Use case:** "That commit was a disaster. I want to completely throw it away."

> ⚠️ This is **dangerous**. Changes are gone. Only use on private branches.

```
Before:  A → B → C (current HEAD)
After:   A → B     (C is gone, including all its changes)
```

---

### Resetting to a Specific Commit

```bash
git reset abc1234               # mixed reset to specific commit
git reset --hard abc1234        # hard reset to specific commit
git reset --soft abc1234        # soft reset to specific commit
```

---

### Reset on Pushed Branches — DANGER

If you've already pushed a branch and then reset it, your local history is different from the remote. You'd need to force push:

```bash
git push --force origin main    # ⚠️ overwrites remote history
git push --force-with-lease     # safer — checks remote first
```

> **Never force push to shared branches.** Other developers' history will break.

---

## Removing Pushed Changes from GitHub

### Soft undo (keep changes locally)

```bash
git reset --soft HEAD~1
git push origin --force
```

### Hard undo (discard changes completely)

```bash
git reset --hard HEAD~1
git push origin --force
```

### Remove multiple commits

```bash
git reset --hard HEAD~3    # remove last 3 commits
git push origin --force
```

### Remove a specific commit (already pushed) — safe way

```bash
git log                     # find the commit hash
git revert <commit-hash>    # creates a NEW commit that undoes it
git push origin             # push normally — no force needed
```

### Remove a file from Git but keep it locally

```bash
git rm --cached <file-name>
git commit -m "Remove file from Git tracking"
git push origin
```

---

## git revert

`git revert` **creates a NEW commit** that reverses the effect of an existing commit. It does NOT change history.

```bash
git revert abc123          # creates a new commit undoing abc123
git revert HEAD            # reverts the last commit
git revert HEAD~3          # reverts the commit 3 before HEAD
git revert abc123 def456   # revert multiple commits
```

**What happens:**
```
Before: A → B → C → D
After revert D:
        A → B → C → D → R
                         ↑
                    R = "undo D" commit
```

`D` is still in history. `R` just cancels its effects.

**After `git revert`, you can push normally** — no force push needed!

---

## git clean

`git clean` removes **untracked files and folders** from your working directory (files that have never been added to Git).

```bash
git clean -n               # dry run — shows what WOULD be deleted (safe preview)
git clean -f               # actually delete untracked files
git clean -fd              # delete untracked files AND folders
git clean -fx              # also delete files in .gitignore
```

> ⚠️ `git clean` is **permanent** — deleted files cannot be recovered through Git.

Always run `git clean -n` first to preview what will be deleted.

---

## Reset vs Revert — Key Difference

|                           | `git reset`                              | `git revert`                              |
| ------------------------- | ---------------------------------------- | ----------------------------------------- |
| What it does              | Moves the branch pointer backward        | Creates a new commit that undoes a commit |
| History                   | **Rewrites** history (commits disappear) | **Preserves** history (commits stay)      |
| Safe for shared branches? | ❌ No — breaks others' history            | ✅ Yes — adds a new commit                 |
| Requires force push?      | ✅ Yes (if already pushed)                | ❌ No                                      |
| Recovery possible?        | Via `git reflog` only                    | Always recoverable                        |

### Mental model

**`git reset`** — "Move the branch backward":
```
A → B → C → D
        ↑
       branch (C and D are gone from branch view)
```

**`git revert`** — "Move forward with an undo commit":
```
A → B → C → D → UNDO
```

---

## When to Use Which

| Situation | Use |
|---|---|
| Undo your latest local commit (not pushed) | `git reset --soft` or `--mixed` |
| Clean up local commits before pushing | `git reset` |
| Completely throw away local changes | `git reset --hard` |
| Remove commits from your private branch | `git reset` |
| Undo a commit on shared `dev` or `main` | `git revert` |
| Undo a production commit | `git revert` |
| Avoid force push | `git revert` |

> **Golden rule:** If the commit has been shared with others → use `git revert`. If it's only on your machine → use `git reset`.

---

## Quick Reference

```bash
# Discard working directory changes
git restore <file>                   # discard changes in one file
git restore .                        # discard all changes

# Unstage
git restore --staged <file>          # unstage one file
git restore --staged .               # unstage everything

# Undo commits (local only)
git reset --soft HEAD~1              # undo commit, keep changes staged
git reset HEAD~1                     # undo commit, keep changes in working dir
git reset --hard HEAD~1              # undo commit AND discard changes

# Undo pushed commits (safe)
git revert <commit-hash>             # create an undo commit (push normally)

# Remove untracked files
git clean -n                         # preview
git clean -fd                        # delete files and folders

# Force push (dangerous!)
git push --force origin branch       # force overwrite remote
git push --force-with-lease          # safer version
```

