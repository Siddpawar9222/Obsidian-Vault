# Git Internals

---

## How Git Stores Data

Most version control systems store data as a **list of file changes** (called deltas):

```
Version 1: [original file]
Version 2: [change A applied]
Version 3: [change B applied]
```

Git is different. Git thinks of data as a **series of snapshots** of your entire project. Every time you commit, Git takes a photo of all your files at that exact moment and stores a reference to that snapshot.

> **Git stores data as a stream of snapshots, not a list of changes.**

---

## The 4 Types of Git Objects

Everything inside the `.git/objects/` folder is a **Git object**. There are only 4 types:

### 1. Blob

A **blob** (Binary Large Object) stores the **raw content of a file** — just the content, nothing else. No filename, no permissions.

```
Blob: "Hello World\n"
```

Two files with the same content will share the same blob (Git is smart about storage).

---

### 2. Tree

A **tree** represents a **directory**. It holds:
- References to blobs (files)
- References to other trees (subdirectories)
- File names and permissions

```
Tree (root directory):
├── blob abc123  →  index.html
├── blob def456  →  style.css
└── tree 789xyz  →  src/
                     └── blob 111aaa  →  app.js
```

---

### 3. Commit Object

A **commit object** stores:
- A pointer to the **tree** (snapshot of the project at that moment)
- A pointer to the **parent commit(s)** (previous commit in history)
- **Author** name and email
- **Committer** name and email
- **Timestamp**
- **Commit message**

```
Commit:
  tree:      abc123         (points to root tree = the full project snapshot)
  parent:    def456         (previous commit)
  author:    Siddhesh
  message:   "Add login page"
```

This is how Git builds the **chain of history** — each commit points back to its parent.

---

### 4. Tag Object

A **tag object** (annotated tag) stores:
- A pointer to a commit
- Tag name
- Message
- Tagger's name and date

Lightweight tags are just direct pointers (like branch pointers), not full objects.

---

## SHA (Secure Hash Algorithm)

Every Git object (blob, tree, commit, tag) gets a **unique SHA-1 hash** (40 characters long) as its ID/name.

Example: `a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0`

The hash is calculated from the **content** of the object. This means:
- Same content = same hash (Git avoids storing duplicates)
- If the content changes even slightly, the hash changes completely

```bash
git log --oneline    # shows short hashes (first 7 characters)
git show a1b2c3d    # show a commit using its short hash
```

**Why SHA is important:**
- Git uses SHA to verify integrity — if someone secretly changes a file in your repo, the SHA won't match and Git will know
- SHA is how Git refers to every commit, blob, tree, and tag

---

## References (Refs)

A **reference** is just a human-readable name that points to a SHA hash. Instead of typing a 40-character hash, you use a name like `main` or `HEAD`.

References are stored in `.git/refs/`:

```
.git/refs/
├── heads/      ← local branches
│   ├── main    ← contains SHA of the latest commit on main
│   └── feature
└── remotes/    ← remote branches
    └── origin/
        └── main
```

**Types of references:**
- **Branch** — points to the latest commit on that branch
- **HEAD** — points to the current branch (or commit)
- **Tags** — point to specific commits

```bash
cat .git/refs/heads/main    # shows the SHA of the latest commit on main
cat .git/HEAD               # shows "ref: refs/heads/main" (the current branch)
```

---

## HEAD

**HEAD** is Git's pointer to **"where you are right now."**

In normal usage, HEAD points to your **current branch**:
```
HEAD → main → commit abc123
```

When you switch branches:
```bash
git checkout feature
# HEAD → feature → commit def456
```

**Detached HEAD:**
When you checkout a specific commit (not a branch), HEAD points directly to that commit:
```bash
git checkout abc123
# HEAD → commit abc123  (not pointing to any branch)
```

This is called **detached HEAD** state. You can look around but you should create a new branch before making changes.

---

## Branch Pointer

A **branch** is simply a lightweight pointer (a file containing a SHA hash) that moves forward automatically every time you make a new commit.

```
Before commit:    main → abc123
After new commit: main → def456   (automatically moved forward)
```

**This is why branches in Git are so cheap and fast** — creating a branch just creates a new file with a SHA hash in it. It doesn't copy any code.

```bash
git branch               # list all branch pointers
git branch feature       # create a new branch pointer at the current commit
```

---

## Commit Graph

The **commit graph** is the history of your project visualized as a graph. Each commit points to its parent(s).

**Linear history:**
```
A → B → C → D
            ↑
           HEAD (main)
```

**After creating a branch:**
```
A → B → C → D     (main)
              ↘
               E → F  (feature)
               ↑
              HEAD
```

**After merging:**
```
A → B → C → D → M   (main, M = merge commit)
              ↗ ↗
         E → F       (feature)
```

Visualize your graph with:
```bash
git log --oneline --graph --decorate --all
```

---

## How Git Stores Data (Putting It All Together)

When you run `git commit`:

1. Git takes all staged files, creates **blob objects** for each
2. Git creates a **tree object** for the directory structure
3. Git creates a **commit object** pointing to that tree + the parent commit
4. Git moves the current branch pointer (e.g., `main`) to point to the new commit
5. HEAD still points to `main`, so HEAD effectively moves too

```
Commit C:
  hash: xyz789
  tree: ────────────→ Tree (directory structure)
                           ├── blob: index.html content
                           └── blob: style.css content
  parent: ──────────→ Commit B (previous commit)
  message: "Add CSS"
```

---

## Quick Reference

| Concept | What it is |
|---|---|
| **Blob** | Git object storing a file's content |
| **Tree** | Git object storing a directory structure |
| **Commit** | Git object storing snapshot + metadata + parent link |
| **SHA** | Unique 40-character fingerprint of every Git object |
| **Ref / Reference** | A human-readable name (like `main`) that points to a SHA |
| **HEAD** | Pointer to your current branch or commit |
| **Branch pointer** | A lightweight file pointing to the latest commit on a branch |

