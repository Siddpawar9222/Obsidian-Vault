# 07 - Remote Repositories

---

## What is Remote?

A **remote repository** is a copy of your project stored **somewhere else** — usually on GitHub, GitLab, or Bitbucket. It's what lets you:
- Back up your code online
- Share code with teammates
- Collaborate on the same project from different computers

Your local repository on your computer ↔ Remote repository on GitHub.

---

## git remote

`git remote` manages the connections to remote repositories.

```bash
git remote             # list all remotes (just names)
git remote -v          # list all remotes with their URLs

git remote add origin https://github.com/username/repo.git    # add a remote
git remote remove origin                                       # remove a remote
git remote rename origin upstream                              # rename a remote
git remote set-url origin https://new-url.git                 # change URL of a remote
```

---

## origin

**`origin`** is just the **default name** given to the remote repository (usually GitHub). It's a convention, not a requirement.

When you clone a repo or add a remote, Git calls it `origin` by default. You can rename it to anything:

```bash
git remote rename origin myremote   # now it's "myremote" instead of "origin"
```

But almost everyone keeps the name `origin`.

---

## git clone

`git clone` downloads a copy of a remote repository to your computer. It:
- Downloads all files and history
- Automatically sets up the remote as `origin`
- Creates a local copy ready to work with

```bash
git clone https://github.com/username/repo.git          # clone into a folder named "repo"
git clone https://github.com/username/repo.git my-app   # clone into a folder named "my-app"
git clone git@github.com:username/repo.git              # clone using SSH
```

After cloning, you already have `origin` set up automatically.

---

## git fetch

`git fetch` **downloads** the latest changes from the remote but does **NOT** apply them to your working files. It just updates your remote-tracking branches.

```bash
git fetch                    # fetch from origin (default)
git fetch origin             # same thing, explicit
git fetch origin main        # fetch only the main branch
```

After fetching, you can review the changes before applying them:
```bash
git log origin/main --oneline   # see what was fetched
git diff main origin/main       # compare your local main with remote main
```

**When to use fetch:**
When you want to see what changes exist on the remote without affecting your local work.

---

## git pull

`git pull` = `git fetch` + `git merge` combined.

It downloads the latest changes from remote AND immediately merges them into your current branch.

```bash
git pull                    # pull from the tracked remote branch
git pull origin main        # pull main from origin
git pull --rebase origin main   # pull and rebase instead of merge (cleaner history)
```

**`git pull` vs `git fetch`:**

| | `git fetch` | `git pull` |
|---|---|---|
| Downloads changes | ✅ Yes | ✅ Yes |
| Applies changes | ❌ No (manual) | ✅ Yes (automatic) |
| Safe? | Very safe | Can cause conflicts |
| When to use | When you want to review first | When you trust the remote changes |

---

## git push

`git push` sends your local commits to the remote repository.

```bash
git push                         # push to the tracked remote branch
git push origin main             # push local main to origin's main
git push origin feature          # push a branch to remote
git push -u origin feature       # push + set tracking (first time only)
git push --set-upstream origin feature  # same as -u

git push -d origin feature       # delete a branch on remote
git push --delete origin feature # same thing

git push --force origin main     # ⚠️ force push (overwrites remote history)
git push --force-with-lease      # safer force push (checks remote first)
```

> ⚠️ **Never force push to shared branches** (`main`, `develop`). It overwrites other people's work.

---

## Tracking Branch

A **tracking branch** is a local branch that knows which remote branch it corresponds to.

When you push with `-u` (or `--set-upstream`), you set up this link:
```bash
git push -u origin feature
# Now: local "feature" tracks remote "origin/feature"
```

After setting tracking:
```bash
git push    # automatically knows to push to origin/feature
git pull    # automatically knows to pull from origin/feature
```

To see tracking relationships:
```bash
git branch -vv
```

Example output:
```
* main     abc123 [origin/main] Update README
  feature  def456 [origin/feature: ahead 2] Add login page
```

---

## Upstream Branch

The **upstream** is the remote branch that your local branch tracks.

```bash
git branch --set-upstream-to=origin/main main   # set upstream for existing branch
```

In open source: "upstream" also refers to the original repository you forked from (vs your fork which is "origin"):

```bash
git remote add upstream https://github.com/original-owner/repo.git
git fetch upstream
git merge upstream/main
```

---

## Connecting a Local Repo to GitHub (Full Workflow)

**Step 1 — Create a repo on GitHub**
- Go to github.com → click `+` → New repository
- Give it a name, click Create repository

**Step 2 — Connect your local repo**
```bash
git remote add origin https://github.com/username/repo-name.git
git remote -v    # verify the connection
```

**Step 3 — Push your code**
```bash
git branch -M main          # rename branch to main (if not already)
git push -u origin main     # first push, sets tracking
```

**Step 4 — Future pushes**
```bash
git push    # that's it!
```

---

## Setting Up SSH (No Password Every Time)

Instead of typing your GitHub password every time you push, set up SSH:

**Step 1 — Generate an SSH key:**
```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
# Press Enter through all prompts (default settings are fine)
```

**Step 2 — Copy your public key:**
```bash
cat ~/.ssh/id_ed25519.pub
# Copy the entire output
```

**Step 3 — Add to GitHub:**
- Go to GitHub → Settings → SSH and GPG keys → New SSH key
- Paste the key → Save

**Step 4 — Update your remote URL to SSH:**
```bash
git remote set-url origin git@github.com:username/repo.git
```

Now `git push` works without a password.

---

## Remote Cheat Sheet

```bash
git remote -v                               # list remotes with URLs
git remote add origin <url>                 # add a remote
git remote set-url origin <new-url>         # update remote URL
git remote remove origin                    # remove a remote
git remote rename origin dev                # rename remote

git clone <url>                             # clone a remote repo
git fetch                                   # download without applying
git pull                                    # download + merge
git pull --rebase                           # download + rebase (cleaner)
git push                                    # push to tracked remote
git push -u origin branch                   # push + set tracking
git push --delete origin branch             # delete remote branch
```

