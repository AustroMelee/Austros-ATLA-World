# Sandbox Workflow with Cursor: Best Practices

## Overview

This workflow enables safe, flexible experimentation with AI-driven changes, while giving you full control over what gets merged into your main codebase. It ensures you can preview, test, and approve changes before they affect your main branch.

---

## 1. Prepare Your Working Directory

- Ensure all your current changes (even uncommitted ones) are saved in your working directory.
- Optionally, use `git status` to review your changes.

---

## 2. Create a Sandbox Environment

**Best Practice:**  
Use a separate directory or a git worktree/branch as your sandbox. This keeps your main branch safe and allows for easy comparison and merging.

### Option A: Using a Separate Directory

```sh
# From your project root
mkdir ../my-sandbox
rsync -av --exclude='.git' ./ ../my-sandbox/
cd ../my-sandbox
```

### Option B: Using a Git Worktree

```sh
# From your project root
git worktree add ../my-sandbox-sandbox-env
cd ../my-sandbox-sandbox-env
```

### Option C: Using a Temporary Branch

```sh
git checkout -b sandbox-env
```

---

## 3. Let Cursor (or the AI Agent) Work in the Sandbox

- Open the sandbox directory in Cursor.
- Allow Cursor to make any changes, run scripts, install dependencies, etc.
- All changes are isolated from your main branch.

---

## 4. Run the Local Server to Preview Changes

```sh
# In the sandbox directory
npm install
npm run dev
```

- Open the local server (usually http://localhost:3000 or similar) in your browser.
- Review and test the changes Cursor made.

---

## 5. Approve or Reject Changes

- If you like the changes, proceed to merge them.
- If not, you can discard the sandbox and start over.

---

## 6. Merge Approved Changes into Main Branch

### Option A: If Using a Separate Directory

```sh
# From your main project root
rsync -av --exclude='.git' ../my-sandbox/ ./
# Or use a diff tool to review and selectively copy files
```

### Option B: If Using a Worktree or Branch

```sh
# If using a worktree/branch
git checkout main
git merge sandbox-env
```

---

## 7. Finalize and Clean Up

- Run your tests and linters:
  ```sh
  npm run lint:fix
  tsc --noEmit
  ```
- Commit the merged changes:
  ```sh
  git add .
  git commit -m "Merge approved sandbox changes"
  git push
  ```
- Delete the sandbox directory or branch if desired.

---

## 8. (Optional) Automate with Scripts

You can create scripts to automate the copying, preview, and merging steps for even smoother workflow.

---

# Example Command Summary

```sh
# 1. Create sandbox
mkdir ../my-sandbox
rsync -av --exclude='.git' ./ ../my-sandbox/
cd ../my-sandbox

# 2. Let Cursor work here

# 3. Preview
npm install
npm run dev

# 4. Merge back if approved
cd ../AUSTROS\ ATLA\ WORLD
rsync -av --exclude='.git' ../my-sandbox/ ./
npm run lint:fix
tsc --noEmit
git add .
git commit -m "Merge approved sandbox changes"
git push
```

---

# Notes

- Always review changes before merging.
- Never merge untrusted code directly into main.
- Use `rsync` or a diff tool to avoid overwriting files you don’t want changed.
- This workflow is compatible with Cursor, Copilot, and other AI agents.

---

**This process gives you full control, safety, and visibility over AI-driven changes before they reach your main codebase.**