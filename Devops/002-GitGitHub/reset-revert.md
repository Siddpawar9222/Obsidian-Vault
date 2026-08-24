# Git `reset` vs `revert` — From Scratch

This is one of the most important Git concepts to understand because **`reset` and `revert` both appear to "undo changes", but they work completely differently.**

---

## Git history first

Suppose we have:

```text
A---B---C---D
            ↑
           HEAD
```

Each commit represents a snapshot/change in Git's history.

The branch pointer (`main`, `dev`, `A`, etc.) points to a commit.

```text
main
  |
  v
A---B---C---D
            ^
           HEAD
```

---

# `git reset`

### Basic idea

`reset` means:

> **Move the current branch pointer to another commit.**

It changes the **branch's history/reference**.

For example:

```bash
git reset --hard HEAD~2
```

Before:

```text
A---B---C---D
            ↑
           HEAD
```

After:

```text
A---B---C---D
        ↑
       HEAD
```

`C` and `D` are no longer part of the current branch's history.

They haven't necessarily been immediately destroyed from Git's internal object database, but the branch no longer points to them.

---

## `reset` modes

There are three important modes:

```bash
git reset --soft
git reset --mixed
git reset --hard
```

### `--soft`

Moves the branch pointer but keeps changes staged.

```bash
git reset --soft HEAD~1
```

Before:

```text
A---B---C
        ↑
       HEAD
```

After:

```text
A---B
    ↑
   HEAD

Changes introduced by C
        ↓
      STAGED
```

Useful when:

> "I committed too early and want to modify/recombine the commit."

---

### `--mixed`

This is the default:

```bash
git reset HEAD~1
```

or:

```bash
git reset --mixed HEAD~1
```

It:

* moves the branch pointer
* removes the commit from branch history
* keeps the file changes in your working directory
* unstages those changes

Think:

```text
Commit removed
     ↓
Changes remain in files
```

---

### `--hard`

```bash
git reset --hard HEAD~1
```

This:

* moves branch pointer
* removes commit from current branch history
* removes staged changes
* removes working-directory changes associated with the reset

Think:

```text
Commit removed
     +
Changes removed
```

⚠️ Be careful with `--hard`.

---

# The most important property of `reset`

`reset` **rewrites history** from the perspective of the branch.

For example:

```text
Before:

A---B---C---D
            ↑
           dev
```

Run:

```bash
git reset --hard HEAD~2
```

Now:

```text
A---B---C---D

A---B
    ↑
   dev
```

`dev` moved backwards.

---

# Why reset is dangerous on shared branches

Suppose you've pushed:

```text
origin/dev:

A---B---C---D
            ↑
           dev
```

Other developers have already pulled `D`.

Then you do:

```bash
git reset --hard HEAD~2
```

Your local history becomes:

```text
A---B
    ↑
   dev
```

and push requires:

```bash
git push --force-with-lease
```

Now remote history is rewritten.

Other developers may have:

```text
A---B---C---D
```

while your remote has:

```text
A---B
```

This creates unnecessary problems.

### Rule of thumb

Use `reset` mainly for:

* your local/private branches
* cleaning up commits before pushing
* fixing your own recent history

Be very careful with:

* `dev`
* `main`
* shared branches

---

# `git revert`

Now the completely different concept.

`revert` means:

> **Create a new commit that reverses the effect of an existing commit.**

Suppose:

```text
A---B---C---D
            ↑
           HEAD
```

You want to undo `D`.

Run:

```bash
git revert D
```

Git creates a new commit:

```text
A---B---C---D---R
                ↑
               HEAD
```

Where:

```text
D = original change

R = undo D
```

The important thing is:

> **D is still in history.**

You haven't deleted anything.

---

# Reset vs Revert visually

### Reset

```text
Before:

A---B---C---D
            ↑
           HEAD

reset HEAD~2

After:

A---B---C---D
        ↑
       HEAD
```

The branch pointer moved backward.

---

### Revert

```text
Before:

A---B---C---D
            ↑
           HEAD

revert D

After:

A---B---C---D---R
                ↑
               HEAD
```

The history moves forward.

A new commit reverses the old commit.

---

# Why revert is preferred for shared branches

Suppose `dev` contains:

```text
A---B---C---D
```

And `D` introduced a bad feature.

Instead of:

```bash
git reset --hard HEAD~1
```

you can:

```bash
git revert D
```

Now:

```text
A---B---C---D---R
```

Everyone can pull normally.

No history rewriting.

The history clearly tells the story:

```text
D = feature added

R = feature removed
```

This is why `revert` is commonly used on:

```text
main
dev
release
production
```

or other shared branches.

---

# Your exact A → dev scenario

This is the important part from your previous question.

Suppose:

```text
A branch:

A1---A2---A3---A4
              ↑   ↑
             old latest
```

A was merged into `dev`:

```text
                 A3---A4
                /       \
dev: D1---D2---M---------D3---D4---D5
```

Now you say:

> "I want to remove A3 and A4 from A."

If you do:

```bash
git checkout A
git reset --hard HEAD~2
```

A becomes:

```text
A1---A2
     ↑
     A
```

But `dev` is still:

```text
D1---D2---M---D3---D4---D5
          /
        A2---A3---A4
```

### Why?

Because `reset` only moved the **A branch pointer**.

It didn't undo anything in `dev`.

And merging A again doesn't mean:

> "Make dev look exactly like A."

Git doesn't work that way.

---

# If you want to undo A3 and A4 in dev

Use:

```bash
git checkout dev

git revert A4
git revert A3
```

Now:

```text
D1---D2---M---D3---D4---D5---R4---R3
          /                       ↑
        A3---A4                  dev
```

The original commits remain in history:

```text
A3
A4
```

and the new commits undo them:

```text
R4 → undo A4
R3 → undo A3
```

This is safe from a history perspective.

---

# What happens if dev has moved forward?

This was your specific concern.

Suppose:

```text
A3---A4
      \
       M---D3---D4---D5
```

`D3`, `D4`, `D5` happened **after A was merged**.

You can still do:

```bash
git revert A4
git revert A3
```

But there is a possibility of **merge conflicts**.

For example:

```text
A4:
UserService.java
    changed login logic

D4:
UserService.java
    changed login logic again
```

Git may not know exactly how to undo A4 without affecting D4.

Then you resolve the conflict manually.

The important point is:

> **The fact that dev moved forward doesn't prevent revert.**

It may simply make the revert more likely to require conflict resolution.

---

# When should I use which?

| Situation                               | Use      |
| --------------------------------------- | -------- |
| Undo your latest local commit           | `reset`  |
| Clean up local commits before pushing   | `reset`  |
| Move branch pointer backwards           | `reset`  |
| Remove commits from your private branch | `reset`  |
| Undo a commit on shared `dev`           | `revert` |
| Undo a commit on `main`                 | `revert` |
| Undo a production commit                | `revert` |
| Preserve existing history               | `revert` |
| Avoid force push                        | `revert` |

---

# The mental model I want you to remember

### `reset`

Think:

> **"Move the branch backward."**

```text
A---B---C---D
        ↑
       branch
```

---

### `revert`

Think:

> **"Move forward with an undo commit."**

```text
A---B---C---D---UNDO
```

---

### One-line answer


> **What is the difference between `git reset` and `git revert`?**

You can say:

> "`git reset` moves the branch pointer and can rewrite commit history, while `git revert` creates a new commit that reverses the changes of an existing commit without rewriting history. Therefore, reset is generally suitable for private/local branches, while revert is preferred for shared branches."

That is the core concept you should remember.


---