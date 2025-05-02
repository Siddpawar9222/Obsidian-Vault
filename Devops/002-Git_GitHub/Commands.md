
---

```bash
# Rename branch from "dev" to "feature/login"
git branch -m dev feature/login
git push origin feature/login
git push origin --delete dev
git push --set-upstream origin feature/login
```

