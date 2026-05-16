
---

## 1. Why Does `git rebase` Exist?

When you work on a feature branch, the `main` branch keeps moving forward. Over time, your branch gets **out of date** — it's based on an old snapshot of `main`.

You have two ways to bring your branch up to date:

- `git merge` — joins the two histories with a **merge commit**
- `git rebase` — **replants** your commits on top of the latest `main`

`git rebase` exists to give you a **cleaner, linear project history** — no merge bubbles, no tangled commit graph. It makes the history look as if you started your feature branch from the very latest commit on `main`.

> **One-line purpose:** Rebase moves your work to start from a new point in history, keeping the commit graph straight and readable.

---

## 2. How Does `git rebase` Work?

### The core idea — commits are fingerprints

Every commit has a unique **hash** (fingerprint), calculated from:

```
your code changes + commit message + parent commit's hash + timestamp
```

This means: **if the parent changes, the hash changes.** Rebase exploits this.

### Step-by-step mechanism

Suppose you branched off `main` at commit `B`, and both have moved forward:

```
main:    A → B → M1 → M2
feature: A → B → F1 → F2
```

When you run `git rebase main` from your feature branch:

**Step 1** — Git finds the common ancestor: commit `B`

**Step 2** — Git temporarily saves your commits `F1` and `F2` aside (as patches)

**Step 3** — Git moves your branch pointer to the tip of `main` (commit `M2`)

**Step 4** — Git **replays** your patch F1 on top of M2 → creates a brand new commit `F1′` with a new hash

**Step 5** — Git replays your patch F2 on top of F1′ → creates `F2′` with another new hash

```
Before:                          After:
A → B → F1 → F2  (feature)      A → B → M1 → M2 → F1′ → F2′
A → B → M1 → M2  (main)                              ↑ feature
```

> `F1` and `F2` are **gone**. `F1′` and `F2′` are brand new commits — same code changes, but different parents, timestamps, and hashes. This is called **history rewriting**.

---

## 3. Advantages of `git rebase`

| Advantage                  | Why it matters                                                                               |
| -------------------------- | -------------------------------------------------------------------------------------------- |
| **Linear history**         | No merge commits cluttering the log. `git log` reads like a clean story.                     |
| **Easier bisect**          | `git bisect` works better on a straight line — easier to find which commit introduced a bug. |
| **Cleaner pull requests**  | Reviewers see only your changes, not a tangle of merge commits from main.                    |
| **Interactive cleanup**    | `git rebase -i` lets you squash, reorder, rename, or drop commits before sharing.            |
| **No noisy merge commits** | On busy teams, `git merge` produces a merge commit every single time. Rebase avoids this.    |

### Interactive rebase — the secret power

```bash
git rebase -i HEAD~3   # edit the last 3 commits
```

Inside the editor you can:

- `pick` — keep the commit as-is
- `squash` — combine it with the previous commit
- `reword` — change the commit message
- `drop` — delete the commit entirely

This lets you **clean up your messy work-in-progress commits** into a polished history before merging.

---

## 4. `git rebase main` vs `git pull --rebase`

These two commands both use rebase under the hood, but they solve different problems.

### `git rebase main`

```bash
git checkout feature
git rebase main
```

- You are on your **feature branch**
- You want to bring in the latest changes from `main`
- Replants your feature commits on top of the latest `main`
- Used when: updating a local feature branch before a pull request

```
Before:                    After:
main:    A → B → M1 → M2  main:    A → B → M1 → M2
feature: A → B → F1 → F2  feature:              M2 → F1′ → F2′
```

### `git pull --rebase`

```bash
git pull --rebase origin main
```

- You are pulling updates from the **remote** into your current branch(Same branch).
- Instead of creating a merge commit (what `git pull` normally does), it rebases your local commits on top of the incoming remote commits
- Used when: syncing with the remote without polluting history with merge commits

```
Before:                           After:
remote: A → B → R1                local: A → B → R1 → L1′
local:  A → B → L1 (your commit)
```

> **Tip:** You can set rebase as the default pull strategy globally:
> 
> ```bash
> git config --global pull.rebase true
> ```

---

## 5. Why Is `git rebase` Dangerous?

### The root cause — rebase rewrites history

Recall from section 2: rebase creates **brand new commits** with new hashes. The old commits (`F1`, `F2`) are replaced by new ones (`F1′`, `F2′`). They look the same to a human, but Git treats them as completely different.

This is perfectly fine when the old commits existed only on your machine. It becomes a disaster when others have already seen and pulled those commits.

---

### The Problem — Step by Step

**Day 1:** You create a feature branch and push it so your teammate can see your progress.

```
Remote:    A → B → F1 → F2   (feature branch)
Your PC:   A → B → F1 → F2
Teammate:  A → B → F1 → F2   ← they pulled it
```

**Day 2:** You rebase your feature branch onto the latest main.

```
Your PC (after rebase):   A → B → M1 → M2 → F1′ → F2′
                                              ↑ new hashes!

Remote still has:         A → B → F1 → F2
                                   ↑ old hashes
```

Git rejects your push because the histories have diverged. You force-push:

```bash
git push --force origin feature
```

**Day 3 — The disaster unfolds:**

Your teammate now tries to push their new work `T1`, which they built on top of the old `F2`:

```
Teammate's PC:   A → B → F1 → F2 → T1
Remote (force-pushed):   A → B → M1 → M2 → F1′ → F2′
```

Git sees two completely different histories. When the teammate pulls:

- Git tries to merge the two histories
- `F1` and `F1′` appear as **duplicate commits** — same code, different hashes
- The teammate gets conflicts that make no logical sense
- Their commit `T1` may appear twice, or worse, be silently lost

---

### The Three Specific Danger Zones

**Danger 1 — Rebasing a pushed shared branch**

```bash
# You pushed feature, others pulled it — now you rebase
git rebase main        # rewrites F1, F2 → F1′, F2′
git push --force       # overwrites remote — teammates' history is now broken
```

**Danger 2 — Rebasing `main`, `master`, or `develop`**

These branches are the foundation everyone builds on. Rewriting them forces every team member to forcibly reset their local copy. Anyone who doesn't will have completely broken history forever.

```bash
# NEVER do this on shared branches
git checkout main
git rebase some-other-branch   # ← catastrophic on a shared repo
```

**Danger 3 — Skipping conflicts during rebase**

Rebase replays commits one by one. Each replay can cause a conflict. Using `--skip` without understanding it silently drops your commit entirely.

```bash
git rebase main
# conflict appears...
git rebase --skip    # ← your commit F1 is now GONE, no warning
```

---

### Safe vs Dangerous — The Decision Table

|Situation|Action|Why|
|---|---|---|
|Local branch, not yet pushed|✅ Rebase freely|Only you have these hashes|
|Feature branch you pushed, but only you use it|✅ Rebase, then force-push|You are the only one affected|
|Feature branch others have pulled|❌ Use merge|Others have the old hashes — rewriting breaks them|
|`main` / `develop` / any shared branch|❌ Never rebase|Foundation of everyone's work|
|Pulling from remote daily|✅ `git pull --rebase`|Your local commits are yours alone|

---

### The One Rule to Remember

> **If anyone else has seen those commits → do NOT rebase. Use merge.**

Rebase is a tool for cleaning up _your own local history_ before sharing it with the world. Once it is shared, history belongs to everyone — and rewriting shared history breaks the contract Git relies on.

```bash
# Safe workflow
git fetch origin
git rebase origin/main   # ← rebase BEFORE pushing, while commits are still local

# Danger workflow
git push origin feature  # shared with team
git rebase main          # ← NOW it's dangerous — others have the old commits
git push --force         # ← this breaks your teammates
```

---

## Summary

```
Why rebase?        → Clean, linear history without merge commit noise
How it works?      → Rewrites commits with new hashes by replaying patches
Advantages?        → Readable log, better bisect, clean PRs, interactive editing
rebase vs pull --rebase → rebase main = update feature branch
                          pull --rebase = daily sync without merge commits
Why dangerous?     → Rewrites hashes. If teammates have the old hashes,
                     their history is now broken and conflicts are inevitable.
Golden rule?       → Rebase local. Merge shared.
```