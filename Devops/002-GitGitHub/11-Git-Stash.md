# 11 - Git Stash

---

## Why Stash?

Imagine this situation:
- You're in the middle of working on a feature (half-done code that doesn't work yet)
- Your manager says: "Stop! Fix this urgent bug on `main` right now!"
- You can't commit half-done code
- You can't switch branches with uncommitted changes (Git may refuse or mix up files)

**Solution: `git stash`** — temporarily saves your work-in-progress changes aside, gives you a clean working directory, and lets you come back to your changes later.

> Think of stash like a **clipboard** for your uncommitted changes.

---

## git stash

`git stash` saves your current uncommitted changes (both staged and unstaged) into a temporary storage called the **stash**.

```bash
git stash                          # stash everything (tracked files only)
git stash push -m "my message"     # stash with a descriptive message
git stash -u                       # stash including untracked (new) files
git stash -a                       # stash everything including .gitignore'd files
```

After stashing, your working directory is clean — as if you never made those changes.

**Example workflow:**
```bash
# You're working on feature/login
# ... half-done changes ...

git stash push -m "WIP: login form half done"
# Working directory is now clean

git switch main
git switch -c fix/urgent-bug
# ... fix the bug ...
git commit -m "Fix urgent bug"

git switch feature/login
git stash pop    # restore your half-done work
# Continue where you left off
```

---

## stash list

`git stash list` shows all your saved stashes.

```bash
git stash list
```

Output:
```
stash@{0}: On feature/login: WIP: login form half done
stash@{1}: On main: temp save before experiment
stash@{2}: WIP on feature/search: 3a2d8bc Add search input
```

- `stash@{0}` = most recent stash
- `stash@{1}` = one before that
- And so on...

---

## stash pop

`git stash pop` **restores** the most recent stash and **removes** it from the stash list.

```bash
git stash pop              # apply and remove the latest stash
git stash pop stash@{2}    # apply and remove a specific stash
```

> If restoring causes a conflict, Git pauses and marks the conflict in the file (just like a merge conflict). Resolve it manually, then `git add` the file.

---

## stash apply

`git stash apply` **restores** a stash but **keeps it in the stash list** (doesn't delete it).

```bash
git stash apply             # apply the latest stash (keep it in list)
git stash apply stash@{1}  # apply a specific stash
```

**pop vs apply:**
- `pop` = apply + delete from stash list
- `apply` = apply only (stash stays for reuse)

Use `apply` when you want to apply the same stash to multiple branches.

---

## stash drop

`git stash drop` **removes** a stash from the list without applying it.

```bash
git stash drop              # remove the latest stash
git stash drop stash@{1}   # remove a specific stash
git stash clear             # remove ALL stashes
```

---

## Other Useful Stash Commands

```bash
git stash show              # show a summary of what the latest stash contains
git stash show -p           # show the full diff of the latest stash
git stash show stash@{1}    # show a specific stash

git stash branch feature/from-stash    # create a new branch from a stash and apply it
```

---

## Stash Best Practices

✅ **Add a message** — always describe what the stash contains:
```bash
git stash push -m "WIP: half-done login validation"
```

✅ **Include untracked files** if needed:
```bash
git stash -u
```

✅ **Don't let stashes pile up** — stash is meant to be temporary. Use it, then pop it. If a stash is more than a day old, commit it to a branch instead.

✅ **Use `stash pop` not `stash apply`** in most cases — keeps the stash list clean.

✅ **Use `git stash branch`** when a stash conflicts with current changes — creates a fresh branch from where you stashed:
```bash
git stash branch feature/from-stash stash@{0}
```

---

## Quick Reference

```bash
git stash                          # stash tracked file changes
git stash push -m "description"    # stash with a message
git stash -u                       # stash including untracked files
git stash list                     # see all stashes
git stash pop                      # apply and remove latest stash
git stash apply                    # apply latest stash (keep it)
git stash apply stash@{1}          # apply a specific stash
git stash drop stash@{1}           # remove a specific stash
git stash clear                    # remove all stashes
git stash show -p                  # show what's in the latest stash
git stash branch new-branch        # create a branch from stash
```

