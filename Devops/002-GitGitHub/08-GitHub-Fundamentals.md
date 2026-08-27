# 08 - GitHub Fundamentals

---

## GitHub vs Git

**Git** is the tool. **GitHub** is the platform built on top of Git.

| Git | GitHub |
|---|---|
| Software you install on your computer | A website (github.com) |
| Tracks code history locally | Hosts repositories online |
| Works without internet | Requires internet |
| Maintained by Linus Torvalds | Maintained by Microsoft (since 2018) |

**Alternatives to GitHub:**
- GitLab (popular for self-hosting)
- Bitbucket (popular in enterprise)
- Azure DevOps

---

## Repository

A **GitHub repository** (repo) is your project's home on GitHub. It contains:
- All your code files
- The full Git history
- Issues, pull requests, discussions
- Settings for the project

**Creating a repository on GitHub:**
1. Click the **+** icon in the top right → **New repository**
2. Enter a name (e.g., `my-project`)
3. Add a description (optional)
4. Choose Public or Private
5. Optionally add README, .gitignore, License
6. Click **Create repository**

---

## Public vs Private Repository

| | Public | Private |
|---|---|---|
| Who can see it | Anyone on the internet | Only you + people you invite |
| Who can clone it | Anyone | Only collaborators |
| Cost | Free | Free (with limits) |
| When to use | Open source, portfolios | Work projects, personal projects |

**Note:** Even on a public repo, only **collaborators you add** can push (write) code. Anyone can read (clone) it.

---

## README

The `README.md` file is the **first thing people see** when they visit your GitHub repository. It's written in Markdown.

A good README should include:
- **Project name and description** — what does it do?
- **How to install** — setup instructions
- **How to use** — basic usage with examples
- **Screenshots** (if it's a visual project)
- **Contributing** — how others can help
- **License** — what others can do with your code

```markdown
# My Project

A brief description of what this project does.

## Installation

```bash
npm install
```

## Usage

```bash
npm start
```
```

GitHub automatically renders `README.md` as a nicely formatted page.

---

## .gitignore

`.gitignore` tells Git which files and folders to **never track or commit**.

Common things to ignore:
- `node_modules/` — installed packages (huge, always regeneratable)
- `.env` — environment variables with secrets
- `*.log` — log files
- `dist/` or `build/` — build output
- `.DS_Store` — Mac OS hidden files

**Example `.gitignore`:**
```
# Dependencies
node_modules/

# Environment variables (secrets!)
.env
.env.local

# Build output
build/
dist/

# Logs
*.log

# OS files
.DS_Store
Thumbs.db
```

**GitHub provides `.gitignore` templates** — when creating a repo, you can select a language and GitHub adds the right `.gitignore` for you (e.g., Node, Python, Java).

**Remove a file that was already committed:**
```bash
git rm --cached filename.txt
git commit -m "Remove filename from tracking"
```
Then add it to `.gitignore`.

**Nested `.gitignore` files:**
You can have a `.gitignore` in subfolders. They override the root `.gitignore` for their folder.

```
# Root .gitignore
*.log
temp/

# stash/.gitignore (overrides for this subfolder)
!temp.txt    # keep this file even though root ignores temp/
```

---

## LICENSE

A `LICENSE` file tells others **what they can and cannot do** with your code.

Common licenses:

| License | What it allows |
|---|---|
| **MIT** | Do anything — just keep the credit |
| **Apache 2.0** | Like MIT but also covers patents |
| **GPL v3** | Use freely, but your code must also be open source |
| **No license** | Others have NO rights — only you can use it |

When creating a repo on GitHub, you can select a license from a dropdown.

---

## Releases

**GitHub Releases** let you package a specific version of your software for users to download.

- A release is tied to a **Git tag** (e.g., `v1.0.0`)
- You can attach binary files (executables, zip files) to a release
- Users can download a release from the "Releases" section of your repo

```bash
git tag v1.0.0
git push origin v1.0.0
```

Then on GitHub, go to **Releases** → **Draft a new release** → select the tag.

---

## Tags

**Tags** mark a specific point in history — usually used for version numbers.

```bash
# Lightweight tag (just a pointer to a commit)
git tag v1.0.0
git tag v1.0.0 abc1234    # tag a specific commit

# Annotated tag (has a message, recommended)
git tag -a v1.0.0 -m "Version 1.0.0 — first stable release"

git tag                   # list all tags
git show v1.0.0           # show tag details
git push origin v1.0.0    # push a tag to GitHub
git push origin --tags    # push ALL tags to GitHub
```

**Delete a tag:**
```bash
git tag -d v1.0.0              # delete locally
git push --delete origin v1.0.0  # delete from remote
```

---

## GitHub Pages (Hosting Static Websites)

GitHub Pages lets you host a **static website** for free directly from your repository.

**For a simple static site:**
1. Go to your repo → **Settings** → **Pages**
2. Select the branch (e.g., `main`) and folder (usually `/root`)
3. Save — your site goes live at `https://username.github.io/repo-name`

---

### Deploying a React App to GitHub Pages

1. **Install `gh-pages`:**
```bash
npm install gh-pages --save-dev
```

2. **Update `package.json`:**
```json
{
  "homepage": "https://your-username.github.io/your-project-name/",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

3. **Deploy:**
```bash
npm run deploy
```

4. **Set up GitHub Pages:**
   - Go to Settings → Pages → set source branch to `gh-pages`
   - Your app is live in about a minute!

**If you add a custom domain:**
- Add a `CNAME` file in the `public/` folder with your domain URL
- Update `homepage` in `package.json` to your custom domain

**React Router issue (404 on page refresh):**
If you use React Router, you'll see a 404 error on direct URL access. Solutions:
- Use `HashRouter` instead of `BrowserRouter`
- Or follow the [spa-github-pages guide](https://github.com/rafgraph/spa-github-pages)

**CI/CD with GitHub Actions + gh-pages:**
- Create different environments (dev, staging, prod)
- Build for each environment
- Create a `CNAME` file for custom domains
- Use a classic Personal Access Token with `repo` + `workflow` permissions
- Write a `deploy.yml` GitHub Actions workflow

---

### Deploying to Netlify (Alternative)

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com) → **Add new site** → **Import an existing project**
3. Connect GitHub and choose your repo
4. Set build command (e.g., `npm run build`) and publish directory (e.g., `build`)
5. Click Deploy — Netlify builds and hosts automatically on every push

---

## GitHub Profile

Your GitHub profile is your **developer portfolio**. It shows:
- Your repositories
- Your contribution history (the green squares graph)
- Pinned repositories
- Your bio

**Profile README:**
Create a special repo named exactly your GitHub username (e.g., `Siddpawar9222/Siddpawar9222`). Add a `README.md` — it appears on your profile page.

---

## Quick Reference

```bash
git tag v1.0.0              # create lightweight tag
git tag -a v1.0.0 -m "msg"  # create annotated tag
git push origin v1.0.0      # push tag to GitHub
git push origin --tags       # push all tags

npm run deploy               # deploy React app to GitHub Pages (after setup)
```

