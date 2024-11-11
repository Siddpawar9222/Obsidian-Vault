
To undo pushed commits in Git, there are a few methods you can use depending on your specific needs and whether you want to keep or discard the changes. Here are the most common approaches:

### 1. **Revert the Commits**
   If you want to keep the history of the commits but undo their changes, you can use the `git revert` command. This is useful if the commits have already been pushed to a shared branch (like `main` or `master`) and you don't want to rewrite the commit history.

   ```bash
   git revert <commit-hash>
   ```
   - This command creates a new commit that undoes the changes made by the specified commit.
   - You can use multiple commit hashes if you want to revert several commits.
   - After running the revert command(s), push your changes:

   ```bash
   git push
   ```

### 2. **Reset and Force Push (Rewriting History)**
   If the commits are on a feature branch and you’re okay with rewriting the commit history (e.g., for work-in-progress branches), you can use `git reset` with a force push. This is not recommended on shared branches because it changes the history, which could cause issues for others working on the same branch.

   1. First, go back to the desired commit:
      ```bash
      git reset --hard <commit-hash>
      ```

   2. Then, force push the changes to update the remote branch:
      ```bash
      git push --force
      ```
      - This approach discards all commits after the specified commit and reverts the branch to the state at that commit.

### 3. **Use `git reflog` to Find and Reset to a Previous State**
   If you’re unsure which commit to go back to, `git reflog` can help you find the commit before the ones you want to undo.

   ```bash
   git reflog
   ```
   - This shows a list of recent changes in the repository. Find the commit hash you want to reset to, then use `git reset` as shown in step 2.

#### Notes:
- **Revert** is safer for public/shared branches because it doesn’t change commit history.
- **Reset with Force Push** is better for local or feature branches, where rewriting history is acceptable.