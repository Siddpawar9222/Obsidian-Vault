

---

### **1. Remove the Last Commit (Soft Undo)**

If you just want to remove the last commit but keep the changes locally:

```sh
git reset --soft HEAD~1
git push origin --force
```

- `--soft` keeps the changes in your working directory.
- `--force` is required because you are rewriting history.

### **2. Remove the Last Commit (Hard Undo)**

If you want to remove the last commit completely (including local changes):

```sh
git reset --hard HEAD~1
git push origin --force
```

⚠ **Warning**: This will permanently delete your last commit and its changes.

### **3. Remove Multiple Commits**

If you want to remove the last 3 commits:

```sh
git reset --hard HEAD~3
git push origin --force
```

Replace `3` with the number of commits you want to remove.

### **4. Remove a Specific Commit (Already Pushed)**

If you want to remove a specific commit (not necessarily the last one):

1. Find the commit hash:
    
    ```sh
    git log
    ```
    
2. Remove the commit:
    
    ```sh
    git revert <commit-hash>
    git push origin
    ```
    
    - This creates a new commit that undoes the changes.

### **5. Remove a File from Git but Keep It Locally**

If you committed a file by mistake and want to remove it from Git but keep it locally:

```sh
git rm --cached <file-name>
git commit -m "Removed file from Git tracking"
git push origin
```

### **6. Delete a Pushed Branch**

If you want to delete a branch from GitHub:

```sh
git push origin --delete <branch-name>
```

---
