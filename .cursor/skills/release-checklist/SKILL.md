---
name: release-checklist
description: Provide a pre-release checklist for this project and verify key deployment readiness items before handoff. Use when preparing a release, finalizing changes, or before pushing to main.
---

# Release Checklist

## Goal

Reduce release mistakes by enforcing a consistent pre-release validation flow.

## Checklist

Copy and evaluate this checklist before release:

```text
Release Checklist
- [ ] Scope confirmed (what changed and why)
- [ ] Local tests passed (`npm test`)
- [ ] CI workflow status reviewed (expected to pass)
- [ ] Pages workflow impact reviewed (if deployment files changed)
- [ ] README/docs updated if behavior changed
- [ ] Breaking changes explicitly called out
- [ ] Commit message prepared and copyable git commands provided
```

## Rules

- If any checklist item is not completed, call it out clearly.
- Never mark tests as passed unless command output confirms it.
- For docs-only changes, explicitly note why test scope is reduced.
- If `.github/workflows` files were changed, remind user to verify Actions after push.

## Required Final Output

Always provide:
1. Checklist status (completed/pending items).
2. Test command and result.
3. Copyable git commands for commit and push.

Template:

```bash
git add <files>
git commit -m "chore(release): prepare release updates"
git push
```
