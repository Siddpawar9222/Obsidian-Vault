# Git Rebase

---

## What is Rebase?

When you work on a feature branch, the `main` branch keeps moving forward (your teammates keep adding commits). Over time, your branch gets **out of date** — it's based on an old snapshot of `main`.

You have two ways to bring your branch up to date:
- `git merge` — joins the histories with a **merge commit**
- `git rebase` — **replants your commits** on top of the latest `main`

> **One-line purpose:** Rebase moves your work to start from a new point in history, keeping the commit graph straight and readable.

```
Before rebase:
main:    A → B → M1 → M2
feature: A → B → F1 → F2

After rebase (feature onto main):
main:    A → B → M1 → M2
feature:              M2 → F1' → F2'
```

Notice F1 and F2 became F1' and F2' — they are **brand new commits** with new hashes (same code changes, but different parent).

---

## How Does git rebase Work?

### Core idea — commits are fingerprints

Every commit has a unique **hash** calculated from:
```
code changes + commit message + parent commit hash + timestamp
```

**If the parent changes, the hash changes.** Rebase exploits this.

### Step by step:

```
main:    A → B → M1 → M2
feature: A → B → F1 → F2
```

When you run `git rebase main` from your feature branch:

1. Git finds the **common ancestor**: commit `B`
2. Git saves your commits `F1` and `F2` aside (as patches)
3. Git moves your branch pointer to the tip of `main` (commit `M2`)
4. Git **replays** patch F1 on top of M2 → creates brand new commit `F1'`
5. Git replays patch F2 on top of F1' → creates brand new commit `F2'`

```
After:
main:    A → B → M1 → M2
feature:              M2 → F1' → F2'
```

> `F1` and `F2` are GONE. `F1'` and `F2'` are completely new commits. This is called **history rewriting**.

---

## Merge vs Rebase

| | `git merge` | `git rebase` |
|---|---|---|
| History | Preserves — shows branching | Rewrites — linear, straight |
| Merge commit | Yes (three-way merge) | No |
| Original commits | Kept (same hashes) | Replaced (new hashes) |
| Safe on shared branches | ✅ Always | ❌ Never |
| Readable log | Can be messy (many merge commits) | Clean, linear |
| When to use | Integrating finished features | Cleaning up local work before PR |

```
After merge:              After rebase:
A → B → M1 → M2 → MC    A → B → M1 → M2 → F1' → F2'
              ↗                              (straight line)
         F1 → F2
```

**Simple rule:** Merge is always safe. Rebase is only safe on commits that exist **only on your machine.**

---

## Interactive Rebase

Interactive rebase (`git rebase -i`) lets you **edit, reorder, squash, or delete** commits before pushing them.

```bash
git rebase -i HEAD~3       # edit the last 3 commits
git rebase -i --root       # edit all commits from the beginning
```

This opens your editor with a list of commits:

```
pick a1b2c3d Add login form
pick b2c3d4e Fix typo
pick c3d4e5f WIP dont push
```

**Available actions:**

| Command | What it does |
|---|---|
| `pick` | Keep the commit as-is |
| `reword` | Keep the commit but change its message |
| `edit` | Pause on this commit so you can modify its content |
| `squash` | Combine this commit with the previous one |
| `fixup` | Like squash but discard this commit's message |
| `drop` | Delete this commit entirely |

---

## Squashing Commits

**Squashing** combines multiple commits into one. This is useful to clean up "WIP", "fix typo", "trying again" commits before merging.

```bash
git rebase -i HEAD~4
```

In the editor, change `pick` to `squash` (or `s`) for commits you want to combine:

```
pick   a1b2c3d  Add login form
squash b2c3d4e  Fix form layout
squash c3d4e5f  Fix typo in form
squash d4e5f6a  WIP final fixes
```

Save and close → Git asks you to write a single commit message for the combined commit.

**Result:** Your 4 messy commits become 1 clean commit.

---

## Reordering Commits

In the interactive rebase editor, just **change the order of the lines** to reorder commits:

```
Before:
pick a1b2c3d  Add login form
pick b2c3d4e  Update README
pick c3d4e5f  Add password validation

After (swapped README and validation):
pick a1b2c3d  Add login form
pick c3d4e5f  Add password validation
pick b2c3d4e  Update README
```

---

## Editing Commits

To modify the **content** of a specific past commit:

```bash
git rebase -i HEAD~3
# Change "pick" to "edit" on the commit you want to modify
```

Git pauses at that commit. Now you can:
```bash
# Make your changes to the files
git add .
git commit --amend       # amend the paused commit with your changes
git rebase --continue    # move on to the next commit
```

---

## Rebase Conflict

When Git replays your commits on top of the new base, it may encounter a **conflict** (just like a merge conflict).

Git pauses and marks the conflict:
```
<<<<<<< HEAD
const message = "Hello from main";
=======
const message = "Hello from feature";
>>>>>>> feature commit
```

**Resolve a rebase conflict:**
1. Edit the file to fix the conflict
2. Stage the resolved file:
   ```bash
   git add conflicted-file.js
   ```
3. Continue the rebase:
   ```bash
   git rebase --continue
   ```

Git then moves to the next commit that needs replaying. Repeat if there are more conflicts.

---

## Rebase Abort

If things get complicated and you want to cancel the entire rebase:

```bash
git rebase --abort
```

This returns your branch to exactly the state it was in before you ran `git rebase`. Safe to use at any point.

---

## Why is Rebase Dangerous?

### The root cause — rebase rewrites history

Rebase creates **brand new commits** with new hashes. The old commits are replaced. This is fine when the old commits existed only on your machine. It becomes a disaster when others have already pulled those commits.

### Step-by-step problem:

**Day 1:** You create a feature branch and push it.
```
Remote + Your PC + Teammate:   A → B → F1 → F2
```

**Day 2:** You rebase your feature branch onto the latest main.
```
Your PC (after rebase):   A → B → M1 → M2 → F1' → F2'   (new hashes!)
Remote still has:         A → B → F1 → F2                 (old hashes)
```

You force push:
```bash
git push --force origin feature
```

**Day 3 — disaster:** Your teammate tries to push their work built on `F2`:
```
Teammate: A → B → F1 → F2 → T1
Remote:   A → B → M1 → M2 → F1' → F2'
```

Git sees two completely different histories. The teammate gets confusing conflicts. Their work may be duplicated or silently lost.

---

## Safe vs Dangerous — Decision Table

| Situation | Action | Why |
|---|---|---|
| Local branch, not yet pushed | ✅ Rebase freely | Only you have these hashes |
| Feature branch you pushed, only you use it | ✅ Rebase, then force-push | You're the only one affected |
| Feature branch others have pulled | ❌ Use merge | Others have the old hashes |
| `main` / `develop` / any shared branch | ❌ Never rebase | Foundation of everyone's work |
| Pulling from remote daily | ✅ `git pull --rebase` | Your local commits are yours alone |

> **The one rule to remember:** If anyone else has seen those commits → do NOT rebase. Use merge.

---

## git pull --rebase

Normal `git pull` = `git fetch` + `git merge` (creates a merge commit).

`git pull --rebase` = `git fetch` + `git rebase` (no merge commit, cleaner history).

```bash
git pull --rebase origin main
```

**When to use:** Your daily sync when you have local commits that haven't been pushed. Avoids the "Merge branch 'origin/main' into main" commits cluttering history.

**Set as default:**
```bash
git config --global pull.rebase true
```

---

## Rebase Best Practices

✅ **Rebase before pushing** — always rebase locally, before your commits are shared:
```bash
git fetch origin
git rebase origin/main    # rebase BEFORE pushing
git push                  # now push
```

✅ **Use interactive rebase** before opening a PR — clean up messy commits:
```bash
git rebase -i HEAD~5      # squash, reword, drop as needed
```

✅ **Never rebase shared branches** — `main`, `develop`, or any branch others have pulled

✅ **Use `--abort` when confused** — always safe to cancel

✅ **Prefer `git pull --rebase`** for daily syncing with remote

---

## Quick Reference

```bash
git rebase main                    # rebase current branch onto main
git rebase -i HEAD~3               # interactive rebase of last 3 commits
git rebase -i --root               # interactive rebase of ALL commits
git rebase --continue              # continue after resolving conflict
git rebase --abort                 # cancel the entire rebase
git pull --rebase origin main      # pull + rebase (no merge commit)
git config --global pull.rebase true   # always pull with rebase

# In interactive rebase editor:
# pick   → keep as-is
# reword → change message
# edit   → modify content
# squash → combine with previous
# drop   → delete entirely
```

