# API_SPEC — ANCHOR (Internal Contracts)

This spec defines the contract between:
- wizard intake
- research/evidence
- generators
- validation engine
- exporter

ANCHOR is client-first in MVP, but the contracts are written so server-mode can be added later without breaking determinism.

---

## Core Types

### ProjectSpec (canonical)
Minimum required fields (MVP):
- schema_version: "1.0"
- project_id: string (uuid)
- title: string
- goal: string
- target_users: string[]
- constraints:
  - local_first: boolean
  - byok_only: boolean
  - budget: "free" | "low" | "medium" | "high"
  - timeline: "days" | "weeks" | "months"
- stack_choice: "lean" | "balanced" | "scalable"
- decisions: Decision[]
- created_at: string (ISO8601)
- updated_at: string (ISO8601)

Decision:
- id: string
- title: string
- choice: string
- rationale: string
- evidence_ids: string[]   # links into EvidenceBundle

---

### EvidenceItem (hard-gated for major recommendations)
- id: string (stable)
- url: string
- accessed_at: string (ISO8601)
- snippet: string (<= 25 words)
- title?: string
- some_notes?: string

EvidenceBundle (exported)
- generated_at: string (ISO8601)
- items: EvidenceItem[]

---

### Artifact (deterministic output unit)
- path: string
- mediaType:
  - "text/markdown"
  - "application/json"
  - "text/plain"
  - "text/x-shellscript"
  - "application/x-yaml"
- content: string

OrchestratorOutput
- artifacts: Artifact[]
- evidence: EvidenceItem[]
- warnings: string[]
- errors: string[]

---

### ValidationReport (exported as VALIDATION_REPORT.md)
ValidationFinding:
- id: string
- severity: "BLOCKER" | "WARNING"
- area: string
- message: string
- resolution_options:
  - option: string
    effort: "LOW" | "MEDIUM" | "HIGH"

ValidationSummary:
- status: "PASS" | "WARN" | "FAIL"
- blockers: number
- warnings: number

---

### SkillLockEntry (skills-lock.json)
- skill_name: string
- scope: "core" | "frontend" | "backend" | "devops" | "security" | "qa"
- source_url: string
- pinned_ref: string (tag or SHA)
- fetched_at: string (ISO8601)
- sha256: string
- license: string | null
- risk_flags: string[]

---

### Manifest (MANIFEST.json)
ManifestEntry:
- path: string
- sha256: string
- bytes: number

MANIFEST.json:
- generated_at: string (ISO8601)
- algorithm: "sha256"
- entries: ManifestEntry[]

---

## Export layout rules (MVP)

Docs (root):
- README.md
- ROADMAP.md
- ARCHITECTURE.md
- PROJECT_CONTEXT.md
- DECISIONS.md
- SECURITY.md
- TESTING.md
- AGENTS.md
- GEMINI.md
- API_SPEC.md
- DEPLOYMENT.md (if applicable)

Evidence:
- evidence/evidence.json

Skills (required):
- .agents/skills/{scope}/{name}/SKILL.md

Determinism & validation:
- VALIDATION_REPORT.md
- MANIFEST.json
- skills-lock.json

---

## Endpoints (only if server-mode is enabled later)

### POST /api/orchestrate
Input:
- projectSpec: ProjectSpec
- phase: "discovery" | "research" | "docs" | "skills" | "automation" | "validate" | "export"

Output: OrchestratorOutput

### POST /api/research/search
Input:
- query: string
- allowlist_domains?: string[]
Output:
- evidence: EvidenceItem[]
