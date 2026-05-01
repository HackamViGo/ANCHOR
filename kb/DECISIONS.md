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
- Product messaging is explicit: ANCHOR does not “solve AI cost”.

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
- Validation runs on the spec and artifacts, not on “whatever the markdown says”.
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

---

## ADR-0005 — Agent entrypoint architecture (minimal GEMINI.md)
**Status:** Accepted  
**Date:** 2026-04-30

### Decision
- `GEMINI.md` is intentionally small:
  - read-order
  - one instruction: “Full rules: read AGENTS.md now.”
- `AGENTS.md` holds the full rules.
- A symlink helper script will be generated later to map:
  - `CLAUDE.md` → `AGENTS.md`
  - `.github/copilot-instructions.md` → `AGENTS.md`
  - `.cursor/rules/main.mdc` → `AGENTS.md`

### Consequences
- Prevents policy drift across agent entrypoints.
- Keeps Gemini integrations predictable.

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

---
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
Last Modified: 2026-05-01T23:48:06+03:00
