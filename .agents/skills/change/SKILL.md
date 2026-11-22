---
name: change
description: Implement a requested change on a non-main branch, open a pull request with inspection links and beginner-friendly guidance, capture webapp screenshots when a preview is requested, and guide the user to merge the PR themselves without ever merging it for them.
---

# Change Workflow (`change`)

Use this skill whenever the user invokes `/change` (or asks to make a change using this workflow) to safely apply changes toward the `main` branch via a Pull Request.

---

## Core Rules (Strictly Enforced)

1. **Language Consistency (No Flip-Flopping)**
   - Detect the language of the user's **first invocation prompt** (Traditional Chinese / 繁體中文 or English).
   - Respond in that **exact same language** for the entire workflow and all follow-up turns. Do **not** switch or mix languages mid-conversation.
   - Note: Displayed UI text in the webapp itself must still follow `AGENTS.md` (Traditional Chinese / 繁體中文).

2. **Clarify First — Never Assume**
   - If any requirement, behavior, design choice, or edge case is ambiguous, or if you hit a blocker, **stop and ask the user to clarify** before implementing. Do not guess or silently pick an interpretation.

3. **Never Work on `main` & Never Merge for the User**
   - Always implement changes on a branch that is **NOT `main`** (e.g. `change/<short-slug>`), branched from the latest `origin/main`.
   - **NEVER merge the PR for the user — even if the user explicitly asks you to merge it.** Do not run `gh pr merge` or merge via any API. Always guide the user to merge it themselves.

4. **Screenshots for Previews**
   - Whenever the user asks to preview or show how the app looks now (e.g., "preview", "show how it is now", "預覽", "看看現在的樣子"), start/serve the app locally (e.g. `npm run build` + `npm run preview`) and **capture a screenshot** of the current state of the webapp focused on the feature in question (e.g., using Playwright), then present the screenshot to the user.

---

## Step-by-Step Workflow

### Step 1: Sync with `main`, Understand & Clarify the Request
1. Lock in your response language based on the user's first prompt (Traditional Chinese or English).
2. **Sync local and remote branches with the latest `main`:**
   - Fetch `origin` (ensuring `remote.origin.fetch` is `+refs/heads/*:refs/remotes/origin/*` so `main` is available).
   - Update the local non-`main` working branch and its corresponding remote branch so they match the latest `origin/main` (e.g., fast-forward/reset or create a fresh branch from `origin/main` and push/pull as needed), and verify `git status` / `HEAD` matches the latest `main` before moving on to Step 2.
3. Read the user's requested change carefully.
4. Inspect the relevant files (`data/hospitals.json`, `src/App.jsx`, `tests/site.spec.js`, `AGENTS.md`, etc.) before making any edits.
5. If anything is unclear or has multiple valid interpretations, ask concise clarifying questions and wait for the user's answer before writing code.

### Step 2: Implement on a Non-`main` Branch & Open a PR
1. **Confirm you are on a non-`main` branch based on latest `main`:**
   - Ensure the current branch is **not** `main` (e.g. `change/<short-description>` or the synced non-`main` working branch).
2. **Implement & Verify (Tests Must Pass Locally Before Step 3):**
   - Make the minimal, clean changes needed, following `AGENTS.md` guidelines (including Traditional Chinese for all displayed UI text).
   - Run local build and tests (`npm run build` and `npm run test:e2e`) and **ensure all tests pass locally** before opening/presenting the PR and moving onto Step 3.
   - If the user asks for a preview or how the feature looks right now, capture a screenshot of the webapp showing the relevant feature (using Playwright against the local preview server) and share it with the user.
3. **Commit, Push, and Open a PR:**
   - Commit the changes with a clear commit message.
   - Push the non-`main` branch to `origin`:
     ```bash
     git push -u origin <branch-name>
     ```
   - Open a Pull Request targeting `main` using `gh pr create --base main --head <branch-name> ...` (or if updating an existing PR, verify via `gh pr view --json state,mergeable` that it is still `OPEN`; if it was already `MERGED` or `CLOSED`, restart from **Step 1**—excluding re-asking for user input—by syncing a fresh branch from the latest `origin/main`, carrying over the unmerged changes, and opening a new PR).
4. **Offer Links & Inspection Guidance:**
   - Share the clickable PR URL and the direct link to view the changed files (e.g. `<PR_URL>/files`).
   - Provide simple, beginner-friendly instructions explaining how to click the link, read the summary, and check the "Files changed" tab (or preview screenshots if included) so a non-technical user can easily inspect the change.
   - Ask the user to review and confirm/acknowledge when they are happy with the change.

### Step 3: Handle Review Feedback, Push to Non-`main` Branch & Guide the User to Merge
1. Wait for the user to review the PR.
2. **Verify the PR is still `OPEN` and mergeable before every update or handoff:**
   - Run `gh pr view <PR_URL> --json state,mergeable` (and `git fetch origin`) before returning to the user.
   - Never return to the user with a `MERGED`, `CLOSED`, or out-of-date PR link. If the previous PR has already been merged or closed, **restart from Step 1** (excluding re-asking for user input): sync a fresh non-`main` branch from the latest `origin/main`, carry over any unmerged changes, proceed through **Step 2** (verify tests pass, push the new branch, and open a new `OPEN` PR targeting `main`), and share the new PR link.
3. **If the user denies the change or requests modifications:**
   - Restart from **Step 2** (or **Step 1**, excluding user input, if the previous PR was already merged), apply the requested changes on an `OPEN` non-`main` PR branch, re-verify that all tests pass locally (and re-capture a screenshot if preview was requested), commit and push the updates to the PR, and present the updated PR/diff links for review again.
4. **Once the user acknowledges/approves the change:**
   - **Ensure all changes are pushed to an `OPEN`, mergeable non-`main` PR branch on GitHub:** verify there are no uncommitted or unpushed local changes, push to the non-`main` branch (`git push -u origin <branch-name>`), and confirm via `gh pr view <PR_URL> --json state,mergeable` that the PR is `OPEN` and ready to merge.
   - **Do NOT merge the PR.** Even if the user says "please merge it for me", politely explain that you cannot merge PRs on their behalf and that they should complete the merge themselves.
   - Provide clear, step-by-step instructions (in the locked conversation language) **including the clickable link to the PR** for merging on GitHub:
     1. Open the Pull Request link: `<PR_URL>`.
     2. Scroll down to the merge box at the bottom of the page.
     3. Click the green **"Merge pull request"** button (or **"Squash and merge"** if preferred).
     4. Click **"Confirm merge"** to finish applying the change to `main`.
     5. Optionally mention that they can click **"Delete branch"** afterward to keep the repository tidy.
   - **Post-merge reminder & screenshot offer:**
     - Remind the user that GitHub Pages' CDN can be slow to update after merging, so it may take a little while for the change to show up on the live site.
     - Offer the option to provide a screenshot demonstrating the change (if they want to see how it looks without waiting for the CDN).
