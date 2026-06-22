---
name: commit-style
description: Enforce a consistent commit message style and always provide a copyable commit message suggestion. Use when code changes are complete and the user is ready to commit.
---

# Commit Style

## Goal

Keep commit messages consistent, readable, and easy to scan.

## Format

Use Conventional Commit style:

`<type>(<scope>): <summary>`

Examples:
- `feat(ui): add room reset confirmation`
- `fix(grid): keep row labels in 10-to-1 order`
- `docs(readme): simplify local usage section`

## Allowed Types

- `feat`: new functionality
- `fix`: bug fix
- `refactor`: internal code improvement
- `test`: test updates
- `docs`: documentation-only change
- `chore`: tooling/config maintenance

## Rules

- Summary in present tense, lower-case start preferred.
- Keep summary <= 72 chars.
- Focus on **why/value**, not a raw file list.
- Split unrelated changes into separate commits when practical.

## Required Output

When finishing work, provide:
1. Suggested commit message.
2. Copyable git commands.

Template:

```bash
git add <files>
git commit -m "type(scope): short summary"
git push
```
