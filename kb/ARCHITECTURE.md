# ARCHITECTURE — ANCHOR

**Purpose**  
ANCHOR generates an “Agent-Executable Blueprint” for a user project:
- canonical `ProjectSpec`
- evidence bundle (hard requirement)
- docs pack + skills pack + guardrails
- validation report
- deterministic ZIP export with manifest hashes

---

## Core principles (architectural invariants)

1) Evidence-first is a **hard gate**  
Major recommendations must carry EvidenceItems and be exported as `evidence/evidence.json`.

2) Skills are untrusted  
- Simple policy gates (shell tools) are **BLOCKERS** unless explicitly opted-in.
- Deep scans (unicode/base64/injection patterns) are **WARNINGS** in MVP.

3) Deterministic export  
- stable sort
- SHA-256 all files
- always include `VALIDATION_REPORT.md` and `MANIFEST.json`

4) BYOK first  
Gemini key is memory-only in MVP.

---

## High-level flow

1) Wizard intake → `ProjectSpec`
2) Research → `EvidenceBundle`
3) Synthesis → `Artifact[]` (docs/skills/guardrails content)
4) Validation → `VALIDATION_REPORT.md`
5) Export → deterministic ZIP + `MANIFEST.json`

```mermaid
flowchart TD
  U[User Wizard Inputs] --> S[ProjectSpec JSON]
  S --> R[Research Module]
  R --> E[EvidenceBundle]
  S --> G[Generators]
  E --> G
  G --> V[Validator]
  V --> Z[Deterministic ZIP Exporter]
  Z --> M[MANIFEST.json (sha256)]
  Z --> VR[VALIDATION_REPORT.md]
```

---

## Components

### 1) Wizard UI (Next.js App Router)
Responsibilities:
- collect structured inputs quickly (anti-paralysis options)
- show preview/approve gates
- manage navigation without losing state
- run export locally by default

### 2) Local-first storage (IndexedDB)
Persist:
- ProjectSpec snapshots (approved steps)
- generated artifacts (content snapshots)
- evidence bundles
- user approvals

Do NOT persist:
- BYOK Gemini API key (memory-only)

### 3) Canonical spec layer
- `ProjectSpec` is canonical truth.
- Markdown docs are derived outputs.
- Validator and exporter operate on `ProjectSpec + Artifacts + EvidenceBundle`.

### 4) Research module (Evidence-first)
- Produces `EvidenceItem[]` with: `{url, accessed_at, snippet<=25 words}`.
- Hard gate: if a “major recommendation” lacks evidence → validation FAIL.

### 5) Generators (docs/skills/guardrails)
- Generate deterministic artifacts:
  - `artifacts[] = { path, mediaType, content }`
- No random IDs in file contents (unless stored in ProjectSpec).

### 6) Skill system
In ANCHOR repo (templates):
- `skills/{core|frontend|backend|devops|security|qa}/.../SKILL.md`

In exported ZIP (required path):
- `.agents/skills/{scope}/{name}/SKILL.md`

### 7) Validator
Produces findings with severity:
- **BLOCKER**: must be resolved before export “READY”
- **WARNING**: allowed to export in MVP, but surfaced in report/UI

Validation categories:
- Evidence completeness (BLOCKER)
- Skill policy checks (shell tools) (BLOCKER)
- Skill deep scans (unicode/base64/injection patterns) (WARNING in MVP)
- Stack/tool contradictions (BLOCKER/WARNING)
- Required output completeness (BLOCKER)
- Determinism prerequisites (BLOCKER)

### 8) Exporter (client-side by default)
- stable sort all paths
- sha256 every file (WebCrypto)
- write `MANIFEST.json`
- include `VALIDATION_REPORT.md` always
- zip content without filesystem mtimes or non-deterministic metadata

---

## Exported ZIP: required “minimum set” (MVP contract)

- Docs pack (README/ROADMAP/ARCHITECTURE/SECURITY/TESTING/DECISIONS/PROJECT_CONTEXT/AGENTS/GEMINI/API_SPEC)
- `.agents/skills/**`
- `skills-lock.json`
- `evidence/evidence.json`
- `VALIDATION_REPORT.md`
- `MANIFEST.json`

---

## Agent entrypoint architecture

- `GEMINI.md` is intentionally minimal: it defines read order and points to `AGENTS.md`.
- `AGENTS.md` contains the full policy surface area in **two distinct domains** (ADR-0011):
  - **Domain A** — Coding agent rules (for Antigravity / Gemini / Claude working on this codebase).
  - **Domain B** — App product invariants (for agents operating inside ANCHOR-generated projects). Each section includes an `> Applies to:` tag naming the relevant module.
- `CLAUDE.md` is a full mirror of `AGENTS.md` for Claude agent compatibility.
- (Planned) a symlink helper script will map Copilot instructions and Cursor rules to `AGENTS.md`.

> The product invariants documented above (Evidence-first, Skills, BYOK, Deterministic export) are the canonical source here. Their implementation spec lives in `AGENTS.md § Domain B`.


---
Last Modified: 2026-05-02T02:08:00+03:00
