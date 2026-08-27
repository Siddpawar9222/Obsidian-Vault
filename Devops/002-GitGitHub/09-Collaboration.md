# Collaboration

---

## Overview

Collaboration in Git is all about working with other people on the same codebase without stepping on each other's toes. The standard workflow is:

```
Clone → Create feature branch → Make changes → Push → Open Pull Request → Review → Merge
```

---

## Clone Repository

Before you can contribute to a project, you need to get a copy on your computer.

```bash
git clone https://github.com/username/repo.git
cd repo
```

After cloning:
- You have the full project and history
- `origin` is automatically set to the GitHub repo
- You're on the default branch (`main`)

**If you're contributing to someone else's project (Open Source):**
1. **Fork** the repo on GitHub (creates your own copy on GitHub)
2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR-username/repo.git
   ```
3. Add the original as `upstream`:
   ```bash
   git remote add upstream https://github.com/original-owner/repo.git
   ```

---

## Feature Branch

**Rule #1 of collaboration:** Never work directly on `main`. Always create a **feature branch** for every task.

```bash
git switch -c feature/login-page    # create and switch to the new branch
# ... do your work ...
git add .
git commit -m "Add login form"
git push -u origin feature/login-page
```

**Why feature branches?**
- `main` always stays in a working state
- Multiple people can work on different features simultaneously without conflicts
- Easy to review, reject, or delay a feature

---

## Pull Request

A **Pull Request (PR)** is a request on GitHub to merge your branch into another branch (usually `main`).

It's called "pull request" because you're asking the repo maintainer to "pull" your changes in.

**Steps to create a PR:**
1. Push your feature branch to GitHub
2. Go to GitHub → your repo
3. GitHub shows a yellow banner: "Compare & pull request" — click it
4. Fill in:
   - **Title** — brief description of the change
   - **Description** — what you did and why
5. Click **Create pull request**

**Good PR description includes:**
- What was changed and why
- Screenshots (for UI changes)
- Testing steps
- Link to the related issue (if any)

---

## Code Review

Once a PR is open, teammates **review** your code before it's merged.

**As a reviewer:**
- Read the code changes carefully
- Leave comments on specific lines
- Suggest improvements
- Ask questions if something is unclear
- Either **Approve**, **Request changes**, or just **Comment**

**As the PR author:**
- Respond to all comments
- Make the requested changes in new commits
- Push the new commits — they automatically appear in the PR
- Re-request review when changes are done

---

## Review Comments

GitHub lets you leave comments on **specific lines** of code in a PR.

- **Single comment** — just a note, doesn't block merging
- **Suggest change** — reviewer proposes exact code replacement that you can accept with one click
- **Start review** — collect multiple comments and submit them all at once

---

## Approvals

Most teams require at least **1 approval** (often 2) before a PR can be merged.

Approvals confirm that:
- The code looks correct
- It follows the team's coding standards
- Tests pass
- No obvious bugs

**Branch protection rules** (see section 14) can enforce minimum approvals.

---

## Squash and Merge

**Squash and Merge** takes all the commits from your PR and **combines them into a single commit** on `main`.

```
Feature branch:   A → B → C → D  (messy WIP commits)
After squash:     main gets one clean commit: "Add login page"
```

**When to use:** When your branch has many "fix typo", "WIP", "try again" commits that you don't want cluttering `main`'s history.

---

## Merge Commit

**Create a Merge Commit** keeps all your branch commits + adds a merge commit.

```
main after merge:  ... → M1 → M2 → merge commit
                                        ↗
                             A → B → C → D  (your branch commits preserved)
```

**When to use:** When you want a permanent record that a feature was developed as a separate branch.

---

## Rebase and Merge

**Rebase and Merge** replays your branch commits on top of `main` without a merge commit.

```
Before:   main: ... → M2    feature: M2 → A → B → C
After:    main: ... → M2 → A' → B' → C'   (clean linear history)
```

**When to use:** When you want a clean, linear history with no merge commits.

---

## Branch Protection

**Branch protection rules** on GitHub prevent direct pushes to important branches like `main`. They enforce good practices.

**Common protection rules:**
- Require pull requests before merging
- Require a minimum number of approvals (e.g., 2)
- Require status checks to pass (e.g., CI tests must pass)
- Require linear history (no merge commits)
- Prevent force pushes

**To set up:**
Go to your repo → **Settings** → **Branches** → **Add branch protection rule**

---

## Syncing with the Original (for Forks)

If you forked a repo, you need to periodically sync with the original:

```bash
git fetch upstream                   # download latest from original
git checkout main
git merge upstream/main              # apply changes to your local main
git push origin main                 # update your fork on GitHub
```

---

## Complete Collaboration Workflow

```bash
# 1. Clone the repo (first time only)
git clone https://github.com/company/project.git
cd project

# 2. Create a feature branch
git switch -c feature/add-search

# 3. Do your work
# ... edit files ...
git add .
git commit -m "Add search bar to header"

# 4. Push the branch
git push -u origin feature/add-search

# 5. Open a Pull Request on GitHub

# 6. Review feedback → make changes
git add .
git commit -m "Fix search bar alignment based on review"
git push   # auto-pushes to origin/feature/add-search

# 7. After PR is merged, clean up
git switch main
git pull                                       # get the latest main
git branch -d feature/add-search              # delete local branch
git push --delete origin feature/add-search   # delete remote branch
```

---

## Quick Reference

```bash
git switch -c feature/task-name           # create feature branch
git push -u origin feature/task-name      # push + set tracking
git pull                                  # sync with remote
git fetch upstream                        # get updates from original repo (forks)
git merge upstream/main                   # apply original repo changes
git branch -d feature/done                # delete local merged branch
git push --delete origin feature          # delete remote branch
```

