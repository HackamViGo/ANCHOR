# DECISIONS (ADR-Style) — ANCHOR

---

## ADR-0001 — Product stance: BYOK is the default
**Status:** Accepted  
**Date:** 2026-04-30

### Decision
ANCHOR is BYOK-first: the user provides their own Gemini API key in MVP.

### Consequences
- Keys must be memory-only by default.
- No server-side prompt/key storage in MVP.
- Product messaging is explicit: ANCHOR does not "solve AI cost".

---

## ADR-0002 — MVP stack: Next.js 16 fullstack on Vercel (free tier)
**Status:** Accepted  
**Date:** 2026-04-30

### Options considered
A) Next.js fullstack (UI + route handlers)  
B) UI + separate orchestrator service  
C) Desktop app (Tauri/Electron)

### Decision
Choose A for MVP.

### Consequences
- Must clearly separate client-side BYOK from any optional server-mode (Phase 1+).
- Default to client-side ZIP export for privacy and cost.

---

## ADR-0003 — Canonical truth is machine-readable ProjectSpec
**Status:** Accepted  
**Date:** 2026-04-30

### Decision
`ProjectSpec` is the canonical source of truth.
All Markdown outputs are derived artifacts.

### Consequences
- Validation runs on the spec and artifacts, not on "whatever the markdown says".
- Spec changes require updating `API_SPEC.md`.

---

## ADR-0004 — Evidence-first is a hard gate
**Status:** Accepted  
**Date:** 2026-04-30

### Decision
Every major recommendation MUST have EvidenceItem(s):
`{ url, accessed_at, snippet <= 25 words }`,
exported as `evidence/evidence.json`.

### Consequences
- Missing evidence is a validation **BLOCKER**.
- Docs must reference evidence IDs where applicable.
- Full spec lives in `AGENTS.md § B.1`.

---

## ADR-0005 — Agent entrypoint architecture (minimal GEMINI.md)
**Status:** Accepted  
**Date:** 2026-04-30

### Decision
- `GEMINI.md` is intentionally small: read-order + pointer to `AGENTS.md`.
- `AGENTS.md` holds the full rules in **two distinct domains**:
  - **Domain A**: rules for coding agents working on the ANCHOR codebase.
  - **Domain B**: product invariants for agents operating inside ANCHOR-generated projects.
- A symlink helper script will be generated later to map:
  - `CLAUDE.md` → `AGENTS.md`
  - `.github/copilot-instructions.md` → `AGENTS.md`
  - `.cursor/rules/main.mdc` → `AGENTS.md`

### Consequences
- Prevents policy drift across agent entrypoints.
- Keeps Gemini integrations predictable.
- Domain separation eliminates confusion between coding rules and product invariants.

---

## ADR-0006 — Exported skill path is fixed
**Status:** Accepted  
**Date:** 2026-04-30

### Decision
Export skills to:
`.agents/skills/{scope}/{name}/SKILL.md`

### Consequences
- Generators and validators must treat this path as canonical.

---

## ADR-0007 — Skill security model (hybrid)
**Status:** Accepted  
**Date:** 2026-04-30

### Decision
- AAFG-style simple policy is the **gate**:
  - `allowed-tools: shell/bash` => BLOCKER unless explicit opt-in + pinning
- FORGE-style deep scans are **warnings** in MVP:
  - hidden unicode
  - base64 blobs
  - prompt injection patterns

### Consequences
- MVP remains shippable without over-blocking.
- Phase 1+ may upgrade selected warnings to blockers.
- Full spec lives in `AGENTS.md § B.2`.

---

## ADR-0008 — Deterministic ZIP export is mandatory
**Status:** Accepted  
**Date:** 2026-04-30

### Decision
Deterministic ZIP export:
- stable sort
- sha256 every file → `MANIFEST.json`
- always include `VALIDATION_REPORT.md`

### Consequences
- Determinism must be unit-tested and integration-tested.
- Full spec lives in `AGENTS.md § B.4`.

---

## ADR-0009 — Data persistence: RAM (Secrets) vs IndexedDB (State)
**Status:** Accepted  
**Date:** 2026-05-01

### Decision
- **Secrets (API Keys)**: Held in RAM (Zustand state) only. Never persisted.
- **Project State**: Auto-saved to IndexedDB (Dexie) with a 1-second debounce.
- **Recovery**: On page load, the project is restored from Dexie, and the user is prompted to re-enter their API key.

### Consequences
- Prevents data loss during crashes/refreshes.
- Maintains strict "No stored secrets" policy.
- Minor UX friction (re-pasting key) is acceptable for security.

---

## ADR-0010 — AnchorMemory: Local-First Agentic Knowledge Graph
**Status:** Accepted  
**Date:** 2026-05-01

### Decision
- **Structure**: Implement a Modular Property Graph using a local JSON file (`.anchor/memory/graph.json`).
- **Management**: A dedicated Python script (`.anchor/memory/manager.py`) handles all CRUD operations.
- **Reasoning**: Every entry MUST include a `reasoning` field to capture the "why" behind agent actions.
- **Privacy**: The entire `.anchor/` directory is git-ignored to ensure developer/agent privacy.

### Consequences
- Enables high-fidelity memory across different agent sessions (Claude, Gemini, etc.).
- Eliminates the need for cloud-based memory services.
- Requires manual/automated maintenance to prevent graph bloat.

---

## ADR-0011 — AGENTS.md two-domain architecture
**Status:** Accepted  
**Date:** 2026-05-02

### Context
AGENTS.md was conflating rules for coding agents (Antigravity/Gemini/Claude working on the ANCHOR codebase) with product invariants describing what the ANCHOR application must generate for end users.

### Decision
Split `AGENTS.md` into two explicitly labeled domains:
- **Domain A** — Coding Agent Rules: Code quality, security, testing, workflow principles, hard invariants (branching, stack gotchas), Definition of Done.
- **Domain B** — App Product Invariants: Evidence-first, Skill safety, BYOK handling, Deterministic export, Conflict resolution strategy, Major recommendation definition.

The `Definition of Done` (typecheck, tests, lint, docs updated) is **shared** — it applies to both domains.

### Consequences
- Coding agents can immediately identify which rules apply to their context.
- Product invariants are co-located with implementation spec (Domain B sections include `> Applies to: [module]` tags).
- `kb/ARCHITECTURE.md` remains the canonical source for product invariants; Domain B in AGENTS.md is the implementation-facing summary.
- `CLAUDE.md` is kept as a full mirror of `AGENTS.md` for Claude agent compatibility.

---

## ADR-0012 — Two-directory skills architecture
**Status:** Accepted  
**Date:** 2026-05-02

### Context
Skills were stored in a single location, creating confusion about whether they are for the ANCHOR codebase agents or for end-user generated projects.

### Decision
Maintain two distinct skills directories:
- **`skills/`** (root) — DOMAIN B: minimal SKILL.md stubs that get packaged into the exported ZIP for end-user projects. These are templates, not full implementations.
- **`.agents/skills/`** — DOMAIN A: full, rich skill implementations used by coding agents (Antigravity/Gemini/Claude) working on the ANCHOR codebase itself. These are never exported.

Export path in ZIP remains: `.agents/skills/{scope}/{name}/SKILL.md` (ADR-0006 unchanged).

### Consequences
- Eliminates confusion about which skills apply to the ANCHOR development workflow vs exported packs.
- `skills/` stubs should be kept minimal — they are scaffolds for agent-generated blueprints.
- `.agents/skills/` should be kept rich and current — they are the actual guidance for ANCHOR development.
- `sync-docs` workflow must verify both directories are consistent with this contract.

---
Last Modified: 2026-05-02T03:21:00+03:00

