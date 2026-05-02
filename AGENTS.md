# AGENTS — Rules of Engagement (ANCHOR)

This file has **two distinct domains**. Read the header of each section carefully.

---

## ═══════════════════════════════════════════════
## DOMAIN A — CODING AGENT RULES
## Rules for YOU (Antigravity / Gemini / Claude)
## when writing code inside this repository.
## ═══════════════════════════════════════════════

---

## Code Quality
- ESLint + Prettier are pre-configured — do not modify settings
- Keep functions under 30 lines
- Keep files under 300 lines — split if larger
- Cyclomatic complexity must stay under 10
- No console.log in production code — use a logger

## Security (Coding)
- Store all secrets in .env.local (.env) — never hardcode credentials
- Never log API keys or tokens
- Validate all user input before processing

## Testing Requirements
- Write unit tests for every new utility function
- Integration tests for API endpoints
- Minimum 80% coverage on new code

---

## Workflow Principles (The ROI Rule)
- **Don't Automate Rare Tasks**: If it's done once a year manually, don't build a script.
- **No Judgment Calls**: Automation is for processes, not human "feel" or complex choices.
- **Unstable Processes = No**: If inputs are unpredictable, automation produces "slop".
- **Simplicity First**: Limit automation steps to **5 branch points** or fewer.
- **ROI is King**: If maintenance takes longer than the time saved, delete it.
- **Avoid Micro-automation**: Manual effort is better for tasks done very few times per day.
- **Rule of Thumb**: Automate only **Frequent**, **High-Risk**, or **Consistency-Critical** tasks.

---

## 0) Prime directive
- Do not guess versions, APIs, or file locations.
- If a required input is missing, create a TODO entry and proceed with the safest minimal implementation.
- Always check @mcp:context7: and DECISIONS.md to gather all the required input before proceeding.

---

## 1) Instruction precedence (always)
1) PROJECT_CONTEXT.md (pinned versions + invariants)
2) DECISIONS.md (architecture choices / ADRs)
3) This AGENTS.md (execution rules)
4) Other docs (ARCHITECTURE/ROADMAP/SECURITY/TESTING/API_SPEC/DEPLOYMENT)

If any file conflicts with a higher-precedence instruction, raise a conflict in validation.

---

## 2) Hard invariants for coding agents (must not be violated)

### 2.1 Critical 2026 Dev Invariants (NO DRIFT)
- **Branch-based Workflow**: NEVER push directly to `main` for new features or complex fixes. Use branches: `feat/` for features, `fix/` for bugs, `chore/` for maintenance.
- **PR-First Policy**: All changes must be merged via Pull Request after CI passes.
- **Asset Isolation**: ALL generated images, scratch files, and temporary artifacts MUST be stored in the `temp/` directory. This directory is git-ignored and used for development-only temporarily, not permanently stored files.
- **Timestamp Accountability**: Every documentation file (`.md`) MUST end with a "Last Modified: ISO-TIMESTAMP" footer.
- **Memory-First Orientation**: The agent MUST use `.anchor/memory/graph.json` and its manager `.anchor/memory/manager.py` to store and retrieve "fine-grained" reasoning and project state before taking major actions.

### 2.2 Stack Gotchas (2026 — NO EXCEPTIONS)
- **React2Shell Safety**: NEVER alter the React version in `package.json`. Downgrading below 19.4.0 (specifically 19.0.0/19.2.0) triggers a CVSS 10.0 RCE vulnerability.
- **Next.js 16.2 Routing**: NEVER create `middleware.ts`. All routing/proxy logic MUST live in `proxy.ts`.
- **Tailwind v4 Config**: NEVER create `tailwind.config.js`. All configuration MUST be in `globals.css` via `@theme`.
- **pnpm 11 Strictness**: `blockExoticSubdeps` is ENABLED. Do not attempt to install packages with exotic/untrusted sub-dependencies.

---

## 3) Definition of Done (shared — applies to ALL agents)
> This section applies to **both Domain A coding agents and Domain B app agents**.

For any change or generated output:
- Typecheck passes
- Tests pass
- Lint passes
- Docs updated if behavior changed

---

## 4) Agent entrypoint rules
- GEMINI.md is intentionally minimal and MUST NOT duplicate policy.
- Policy lives here (AGENTS.md).
- (Planned) a symlink helper script will point Claude/Cursor/Copilot instructions to AGENTS.md to prevent drift.

---

## ═══════════════════════════════════════════════
## DOMAIN B — APP PRODUCT INVARIANTS
## These describe what the ANCHOR *application* must
## implement and generate for end users.
## Canonical source: kb/ARCHITECTURE.md
## These live here as implementation spec for coding
## agents working on the relevant modules.
## ═══════════════════════════════════════════════

---

## B.0 Conflict resolution strategy
> Applies to: Validator, all agents operating inside an ANCHOR-generated project

ANCHOR uses a hybrid approach:
- auto-resolve minor conflicts using PROJECT_CONTEXT + DECISIONS
- escalate only the top ~5 highest-impact conflicts to the user for a decision
- always surface ALL conflicts in validation, but only block on BLOCKER severity

---

## B.0.1 Definition of "major recommendation"
> Applies to: Research module, Validator, Generator agents

Treat as major if it affects:
- security posture (auth, secrets, allowed-tools, threat model)
- stack choice (frameworks, runtimes, DB, deployment model)
- dependency versions/pinning strategy
- CI/CD, guardrails, test strategy
- determinism/evidence guarantees

---

## B.1 Evidence-first (HARD GATE — App behavior)
> Applies to: Research module, Validator, Generator

Any "major recommendation" produced by the app MUST have at least one EvidenceItem:
- `url` (canonical preferred)
- `accessed_at` (ISO8601)
- `snippet` (<= 25 words)

Exported as: `evidence/evidence.json`

If a major recommendation lacks evidence:
- mark the output section as **UNVERIFIED**
- add a **BLOCKER** to validation output
- do not claim it as "best/latest" without evidence

---

## B.2 Skill safety (GATE + WARNINGS — App behavior)
> Applies to: Skill scanner, Validator

**BLOCKER policy gates (MVP):**
- Any skill frontmatter that enables `allowed-tools: shell` or `bash` is a **BLOCKER** unless:
  - user explicitly opts in, AND
  - the skill source is pinned in `skills-lock.json`, AND
  - the user acknowledges risk in the UI (approval step)

**WARNING-only scans (MVP):**
- hidden unicode characters
- base64 blobs or encoded payloads
- prompt injection patterns
- instruction conflicts vs this repo's conventions

---

## B.3 BYOK secret handling (App behavior)
> Applies to: All storage layers, Exporter

- BYOK Gemini API key must be memory-only (Zustand RAM state).
- Never write secrets into:
  - IndexedDB / localStorage
  - generated docs
  - exported ZIP

---

## B.4 Deterministic export (HARD GATE — App behavior)
> Applies to: Exporter (zipper.ts), Manifest generator

- Stable sort all output paths.
- Compute SHA-256 per file (WebCrypto).
- Write `MANIFEST.json`.
- Always include `VALIDATION_REPORT.md`.
- Do not embed non-deterministic data (random IDs, timestamps) into artifacts unless stored in ProjectSpec snapshot.
- Normalize newlines to `\n`.
- Do not use filesystem mtimes inside the ZIP.

---
Last Modified: 2026-05-02T02:08:00+03:00
