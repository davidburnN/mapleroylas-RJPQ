---
name: test-scope
description: Decide and run the right level of tests based on change scope, then report exact commands and results. Use after any file edit before handoff.
---

# Test Scope

## Goal

Run enough tests to protect quality without wasting time.

## Scope Rules

1. **Docs-only changes** (`README`, comments only):
   - Skip test execution.
   - State: `Tests not run (docs-only change).`

2. **Frontend logic/style/content changes**:
   - Run: `npm test`

3. **Workflow/config changes** (`.github/workflows`, `package.json`, tool config):
   - Run: `npm test`
   - Mention any pipeline-only checks that need GitHub Actions confirmation.

## Failure Handling

- If tests fail, capture failing test names.
- Fix if straightforward and rerun.
- If unresolved, stop and clearly report blockers.

## Required Handoff Format

Always include:
- `Test scope:` short reason.
- `Command(s):` exact commands used.
- `Result:` pass/fail + key details.

Example:

```text
Test scope: Frontend logic changed in app.js.
Command(s): npm test
Result: PASS (4 tests, 1 file).
```
