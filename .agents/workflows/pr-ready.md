---
description: Run all pre-PR quality checks in parallel (lint, typecheck, tests) and summarize results before opening a Pull Request.
---

// turbo-all

## Step 1 — Run all checks in parallel

Run the following three checks **simultaneously**:

// parallel
Run: `pnpm run lint`

// parallel
Run: `pnpm run type-check`

// parallel
Run: `pnpm run test --passWithNoTests`

---

## Step 2 — Collect and evaluate results

Wait for all three commands to complete.

For each command, classify the result:
- ✅ **PASS** — exit code 0, no errors
- ❌ **FAIL** — exit code non-zero or errors reported

---

## Step 3 — Report

### If all checks passed:
```
✅ PR READY

All checks passed:
  ✅ Lint
  ✅ Type-check
  ✅ Tests

Suggested next steps:
1. Review the diff: git diff main
2. Commit your changes following commitlint format:
   feat(<scope>): <short description>
   fix(<scope>): <short description>
   chore(<scope>): <short description>
3. Push: git push origin <branch-name>
4. Open a Pull Request on GitHub.
```

### If any check failed:
List ALL failures grouped by check type:

```
❌ PR NOT READY — fix the following before pushing:

[LINT]
  - <error message>
  - <file and line>

[TYPE-CHECK]
  - <error message>
  - <file and line>

[TESTS]
  - <failing test name>
  - <failure reason>
```

Do NOT suggest pushing or opening a PR until all checks are green.

---

## Step 4 — Fix assistance (optional)
If there are failures, ask the user: **"Do you want me to attempt to fix these issues?"**

- If yes → analyze each error and apply targeted fixes, then re-run the failed check only.
- If no → leave the branch as-is and summarize what needs to be done manually.
