---
description: Start a new feature in ANCHOR — checks skills, verifies docs via context7, scaffolds files, runs tests, records in memory, then triggers /pr-ready.
---

// turbo-all

## Step 1 — Gather input
Ask the user for:
- **Feature name** (e.g., `skill-fetcher`, `project-history`). Must be lowercase with hyphens.
- **Scope** — which area of the codebase this touches (e.g., `ui`, `lib`, `api`, `test`).
- **Short description** — one sentence: what this feature does.

Store these as: `FEATURE_NAME`, `SCOPE`, `DESCRIPTION`.

---

## Step 2 — Check for a relevant SKILL.md
Look in `.agents/skills/` for a skill that matches the feature's domain.

- If a **relevant skill exists**, read it now and note any constraints or patterns it defines.
- If **no skill exists**, continue — this is not a blocker.

Log the result: `SKILL_USED = <skill name or "none">`.

---

## Step 3 — Verify freshness via context7
// if SKILL_USED != "none"

Use `@mcp:context7:` to check if the primary library/API the skill relies on has any breaking changes or new recommended patterns.

- Query: the library name from the skill's frontmatter.
- If context7 returns newer patterns → note them as `CONTEXT7_NOTES`. Apply them during scaffolding.
- If no changes → proceed.

---

## Step 4 — Create the feature branch
// turbo
Run: `git checkout main`
// turbo
Run: `git pull origin main`
// turbo
Run: `git checkout -b feat/{{FEATURE_NAME}}`

---

## Step 5 — Scaffold the feature skeleton
Create the minimum file structure for this feature.

Follow these ANCHOR conventions:
- Files go in `src/` under the appropriate subdirectory for `{{SCOPE}}`.
- File names use camelCase for TypeScript files.
- Keep files under **300 lines** (AGENTS.md rule).
- Keep functions under **30 lines** (AGENTS.md rule).
- No `console.log` in production code — use a logger.
- No `any` types — use `unknown` + narrowing if the type is truly unknown.

Create:
1. `src/{{SCOPE}}/{{FEATURE_NAME}}.ts` — the implementation skeleton with stubs.
2. Export the new module from the relevant index file if one exists.

Apply any `CONTEXT7_NOTES` patterns found in Step 3.

---

## Step 6 — Create the test file
Create: `src/{{SCOPE}}/{{FEATURE_NAME}}.test.ts`

The test file must:
- Import the stub from Step 5.
- Contain at least **one passing smoke test** that verifies the module exports correctly.
- Follow the test patterns described in `kb/TESTING.md`.
- Use the project's existing test runner (check `package.json` → `scripts.test`).

---

## Step 7 — Run the tests
// turbo
// retry: 2
// timeout: 60s
Run: `pnpm run test --testPathPattern={{FEATURE_NAME}}`

- If tests **pass** → continue to Step 8.
- If tests **fail** → fix the failures before proceeding. Do not record in memory or open a PR until tests are green.

---

## Step 8 — Record in AnchorMemory
// turbo
Run: `python .anchor/memory/manager.py --add-node "Feature: {{FEATURE_NAME}}" "Feature" "{{DESCRIPTION}} | Scope: {{SCOPE}} | Skill used: {{SKILL_USED}}"`

Confirm output shows `Node created: <id>`. Store the returned ID as `NODE_ID`.

---

## Step 9 — Trigger PR readiness check
// run workflow: pr-ready

The `/pr-ready` workflow will run lint, typecheck, and full test suite in parallel.

---

## Step 10 — Report success
Summarize what was done:
- Branch created: `feat/{{FEATURE_NAME}}`
- Files created: list them
- Skill referenced: `{{SKILL_USED}}`
- AnchorMemory node: `{{NODE_ID}}`
- PR readiness: pass/fail from Step 9
