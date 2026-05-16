
----

# Git Merge — Complete Notes

---

## 1. Why Does `git merge` Exist?

When two developers work on different branches, there comes a moment when both sets of work need to live in the same codebase. That joining operation is called a **merge**.

`git merge` exists to answer one question:

> _"How do I bring two lines of work together — without losing either one?"_

Unlike `git rebase` — which **rewrites** history by replaying commits with new hashes — `git merge` **preserves everything exactly as it happened**. Both branches keep all their original commits. Git adds just one new special commit, called a **merge commit**, that ties the two histories together.

> **One-line purpose:** Merge joins two branch histories by creating a single new commit that has two parents — one from each branch.

---

## 2. How Does `git merge` Work?

### The starting situation

You branched off `main` at commit B. Since then, both branches moved forward independently:

```
main:    A → B → M1 → M2
feature: A → B → F1 → F2
```

- `main` added M1 and M2 (teammates' work)
- `feature` added F1 and F2 (your work)
- Both branches share A and B as their **common ancestor**

### Step-by-step mechanism

You run this from the `main` branch:

```bash
git checkout main
git merge feature
```

**Step 1** — Git finds the **common ancestor**: commit B. This is the last point both branches shared.

**Step 2** — Git collects all changes made on `main` since B → (M1, M2) and all changes made on `feature` since B → (F1, F2).

**Step 3** — Git combines both sets of changes into the working directory automatically (where possible).

**Step 4** — Git creates one brand new commit — the **merge commit (MC)** — with two parents: M2 and F2.

```
Result on main:

A → B → M1 → M2 → MC
         ↑
    F1 → F2 ↗
```

MC is the merge commit. It has two parents (M2 and F2), and it contains the combined work of both branches.

> **Key difference from rebase:** F1 and F2 still exist with their original hashes. M1 and M2 still exist with their original hashes. Nothing was rewritten. Git only added one new commit.

---

## 3. Two Types of Merge

Git automatically picks the right strategy based on the situation.

### Fast-forward merge

Happens when `main` has NOT moved since you branched. Your feature commits sit cleanly ahead of `main` — there's nothing to combine.

Git simply **moves the `main` pointer forward** to your latest commit. No merge commit is created.

```
Before:
main:    A → B
feature: A → B → F1 → F2

After fast-forward:
main:    A → B → F1 → F2   (main pointer just moved)
```

This gives the cleanest possible history — a straight line.
 
```
f3c9a01 Day 3 — add login validation  
b2d4e8c Day 2 — create login form  
9a1f3d2 Day 1 — scaffold login page  
4e2a1b8 Initial setup
```

<font color="#ff0000">Disadvantages : </font>
There is NO record that a feature branch ever existed. Someone reading this log 6 months later has no idea these 3 commits belong together as one feature. They look like random individual commits directly on main.


### 3-way merge

Happens when **both branches moved** since the common ancestor. Git cannot simply move a pointer — it must actually combine two diverging histories.

Git uses three snapshots to figure out the combined result:

|Snapshot|What it is|
|---|---|
|Common ancestor (B)|Where both branches started from|
|Tip of `main` (M2)|What changed on main|
|Tip of `feature` (F2)|What changed on feature|

Git compares all three and creates the merge commit automatically wherever it can. Where it cannot decide (same line edited on both sides) it stops and asks you — this is a **conflict**.

### Forcing a merge commit (no fast-forward)

By default, <font color="#ffc000">Git fast-forwards when possible</font> — which means no record that a feature branch existed. To always create a merge commit:

```bash
git merge --no-ff feature
```

This is useful when you want a permanent record in the log that a feature was developed as a separate branch.

Example : 

```
* e7f1c9a Merge branch 'feature/login'  
|\  
| * f3c9a01 Day 3 — add login validation  
| * b2d4e8c Day 2 — create login form  
| * 9a1f3d2 Day 1 — scaffold login page  
|/  
* 4e2a1b8 Initial setup
```

  Anyone reading this log instantly knows: these 3 commits are one feature, they were developed separately, and they were merged on a specific date. The history tells a story.

## 4. Merge Conflicts — When Git Cannot Decide

Git automatically handles changes to **different parts** of a file. A conflict only happens when **both branches edited the exact same line** — and Git doesn't know which version to keep.

### What a conflict looks like

Git pauses the merge and marks the conflicting file like this:

```
<<<<<<< HEAD (main)
const greeting = "Hello World";
=======
const greeting = "Hi there!";
>>>>>>> feature
```

- Everything between `<<<<<<< HEAD` and `=======` is your version (from `main`)
- Everything between `=======` and `>>>>>>>` is their version (from `feature`)
- You must choose one, combine them, or write something new

### How to resolve

**Step 1** — Open the file. Edit it to keep the correct version. Remove the conflict markers.

**Step 2** — Stage the resolved file:

```bash
git add conflicted-file.js
```

**Step 3** — Complete the merge:

```bash
git merge --continue
```

### How to cancel the merge entirely

If you get confused or want to start over:

```bash
git merge --abort
```

This returns your branch to the exact state it was in before you ran `git merge`. Safe to use at any point during a conflict.

> **Conflicts are normal** — they mean two people worked on the same thing. Git stops and asks you to decide. It never silently loses your work.

---

## 5. Merge vs Rebase — Side by Side


### When to use each

Use `git merge` when:

- Integrating a finished feature branch into `main`
- Working on a shared branch that teammates have pulled
- You want the history to show exactly what happened and when
- You are not sure if others have pulled your branch

Use `git rebase` when:

- Cleaning up messy local commits before opening a pull request (`git rebase -i`)
- Bringing a local feature branch up to date before merging
- The commits have never been pushed or shared with anyone

> **Simple rule:** Merge is always safe. Rebase is only safe on commits that exist solely on your machine.

---

## 6. Common `git merge` Commands

```bash
# Basic merge — merge feature into your current branch
git merge feature

# Merge with an explicit message
git merge feature -m "Merge feature/login into main"

# Always create a merge commit, even if fast-forward is possible
git merge --no-ff feature

# Squash all feature commits into one before merging (keeps history clean)
git merge --squash feature

# Abort a merge in progress (during a conflict)
git merge --abort

# Continue a merge after resolving conflicts
git merge --continue

# Preview what will be merged (no actual merge)
git log main..feature
git diff main...feature
```

---

## 7. What the Log Looks Like After a Merge

With merge, the log preserves the full branching structure:

```
*   e7f1c9a (HEAD -> main) Merge branch 'feature/login'
|\
| * 3a2d8bc Add login validation
| * c91f4e1 Create login form
* | b8f3a12 Update homepage banner
* | 9d4c7f0 Fix navigation bug
|/
* 4e2a1b8 Initial commit
```

You can see exactly when the feature branch was created and merged. With rebase, this diamond shape disappears — the history is a straight line.

---

## Summary

```
What is merge?      → Joins two branch histories by adding one merge commit
How it works?       → Finds common ancestor → combines changes → creates MC with two parents
Fast-forward?       → When main hasn't moved — just slides the pointer, no merge commit
3-way merge?        → When both branches moved — uses ancestor + both tips to combine
Conflicts?          → Same line edited on both sides → Git pauses → you decide → continue
vs rebase?          → Merge preserves history (safe always)
                      Rebase rewrites history (safe only on local commits)
Golden rule?        → Merge shared branches. Rebase local branches.
```