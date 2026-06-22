---
name: test-and-git-hand-off
description: Run automated tests after code changes and always provide copyable git commit/push commands. Use when implementing, fixing, or updating files in this project so changes are verified before handoff.
---

# Test And Git Hand-off

## Goal

After any code edit, always:
1. Run automated tests.
2. Report test result clearly.
3. Provide copyable git commands for commit and push.

## When To Apply

Apply this skill automatically for implementation work in this repository, including feature changes, bug fixes, refactors, and docs that touch tracked files.

## Required Workflow

1. **After edits are complete**, run tests:
   - Default command: `npm test`
   - If project test command differs in `package.json`, use that script.
2. **If tests fail**:
   - Fix the issue if straightforward.
   - Re-run tests until passing, or report blocker with exact failing step.
3. **Before final response**, run `git status --short` to confirm changed files.
4. **Always include a copyable git command block** in the final response.

## Final Response Contract

Final response must include:

- A short change summary.
- Test status (pass/fail and command used).
- A `git` command block the user can copy directly.

Use this command template:

```bash
git add <files>
git commit -m "your commit message"
git push
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
