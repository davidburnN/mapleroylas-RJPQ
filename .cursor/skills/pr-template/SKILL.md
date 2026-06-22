---
name: pr-template
description: Generate a consistent pull request body with summary, test plan, and risks. Use when the user asks to open a PR or prepare PR notes.
---

# PR Template

## Goal

Produce clear, review-friendly pull requests with minimal back-and-forth.

## Required PR Structure

Use this exact section structure:

```markdown
## Summary
- ...
- ...

## Test Plan
- [x] ...
- [ ] ...

## Risks / Notes
- ...
```

## Writing Rules

- Keep `Summary` to 1-3 bullets.
- In `Test Plan`, list commands actually run (or what still needs validation).
- Mention behavior changes and user impact.
- Add migration/config notes if any.
- If no notable risk, write `- Low risk`.

## Required Output

When asked for PR help, provide:
1. PR title suggestion.
2. PR body in markdown (copyable).
3. Optional `gh` command snippet for creation.

Example command:

```bash
gh pr create --title "feat(ui): improve platform tracker readability" --body "$(cat <<'EOF'
## Summary
- ...

## Test Plan
- [x] npm test

## Risks / Notes
- Low risk
EOF
)"
```
