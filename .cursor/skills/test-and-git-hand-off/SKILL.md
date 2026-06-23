---
name: test-and-git-hand-off
description: Run automated tests after code changes and always provide copyable git commit/push commands. Use when implementing, fixing, or updating files in this project so changes are verified before handoff.
---

# Test And Git Hand-off

## Goal

After any code edit, always:
1. Run automated tests.
2. Report test result clearly.
3. Provide copyable git commands for branch, commit, and push.

## When To Apply

Apply this skill automatically for implementation work in this repository, including feature changes, bug fixes, refactors, and docs that touch tracked files.

## Required Workflow

1. **Preflight before any edit**:
   - Run: `git branch --show-current`
   - If current branch is `main`, **stop implementation** and first create/switch branch.
   - Branch naming:
     - feature: `feature/<short-name>`
     - fix: `fix/<short-name>`
     - chore/docs: `chore/<short-name>` or `docs/<short-name>`
2. **After edits are complete**, run tests:
   - Default command: `npm test`
   - If project test command differs in `package.json`, use that script.
3. **If tests fail**:
   - Fix the issue if straightforward.
   - Re-run tests until passing, or report blocker with exact failing step.
4. **Before final response**, run `git status --short` to confirm changed files.
5. **For new development work**, use a feature branch and PR flow:
   - Create/switch branch first (do not develop directly on `main`).
   - Push branch to remote.
   - Open PR from feature branch into `main`.
6. **Post-merge cleanup (when applicable)**:
   - Run `git fetch --prune`.
   - If feature branch is merged into `origin/main`, delete local feature branch.
   - Cleanup sequence:
     - `git checkout main`
     - `git pull --ff-only origin main`
     - `git branch -d <merged-branch>`
7. **Always include a copyable git command block** in the final response.

## Final Response Contract

Final response must include:

- A short change summary.
- Test status (pass/fail and command used).
- A `git` command block the user can copy directly.
- For new features, include branch + PR commands.

Use this command template for normal changes:

```bash
git add <files>
git commit -m "your commit message"
git push
```

Use this command template for new feature development:

```bash
git checkout -b feature/<short-name>
git add <files>
git commit -m "your commit message"
git push -u origin feature/<short-name>
gh pr create --base main --head feature/<short-name> --title "your pr title" --body "your pr summary"
```

If commit message needs multiline body, provide a copyable heredoc variant:

```bash
git add <files>
git commit -m "$(cat <<'EOF'
Title line

Detail line
EOF
)"
git push
```

## Guardrails

- Do not auto-commit or auto-push unless user explicitly asks.
- Still provide commands even if user did not ask for commit yet.
- If tests cannot run (missing dependency/tool), state why and provide the same git command block with a warning.
- Never start code changes on `main`.
- If already on `main`, first provide branch creation command and continue only after branch switch.
- Do not recommend direct push to `main` for new development.
- Do not delete local branches unless they are confirmed merged into `origin/main`.
