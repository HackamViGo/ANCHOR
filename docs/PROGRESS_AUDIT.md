# ⚓ PROGRESS AUDIT — ANCHOR

**Date:** 2026-05-01  
**Status:** MVP-1/MVP-2 Transition  
**Auditor:** Antigravity (AI Agent)

---

## 🟢 MVP-0 — Repo baseline & policies
**Status: DONE (100%)**

- [x] Next.js 16.2 + TS + Tailwind v4 scaffold.
- [x] Local-first storage (Dexie.js) implementation.
- [x] Auto-save wiring (Zustand -> Dexie) — *Implemented today*.
- [x] Core KB documents (10 files) internally consistent.
- [x] Agent entrypoint contract (`GEMINI.md` -> `AGENTS.md`).

---

## 🟡 MVP-1 — Canonical Spec + Deterministic Artifacts
**Status: PARTIAL (80%)**

- [x] `ProjectSpec` type definitions.
- [x] `stableJsonStringify` and `stableSortObject` utilities.
- [ ] **BLOCKER:** Missing unit tests for deterministic sorting in `src/test/`.
- [x] SHA-256 manifest generation logic (`manifest.ts`).

---

## 🟢 MVP-2 — Evidence-first Research Module
**Status: DONE (100%)**

- [x] `GeminiGroundingProvider` (Deep Research via Google Search).
- [x] `EvidenceItem` with mandatory ID/URL/Snippet structure.
- [x] Domain allowlisting support.

---

## 🟡 MVP-3 — Document Generator
**Status: PARTIAL (60%)**

- [x] Orchestrator prompts defined for all docs (README, ARCHITECTURE, SECURITY, etc.).
- [ ] **GAP:** Granular phase components for "Architecture" and "Automation" need visual refinement in the UI.

---

## 🔴 MVP-4 — Skill Discovery & Selection
**Status: PARTIAL (40%)**

- [x] Skill discovery via Researcher agent.
- [x] Risk scanning (shell tools, hidden unicode) via `skill-scanner.ts`.
- [ ] **MISSING:** Physical packaging logic. The exporter (`zipper.ts`) does not yet pull the actual `SKILL.md` content from URLs to inject them into the ZIP. It only writes `skills-lock.json`.

---

## 🟢 MVP-7 — Deterministic ZIP Export
**Status: DONE (90%)**

- [x] `JSZip` integration with epoch-based (deterministic) dates.
- [x] `MANIFEST.json` inclusion with file hashes.
- [x] `VALIDATION_REPORT.md` automatic generation.
- [ ] **MISSING:** Post-export symlink helper script (`setup-agent-symlinks.sh`).

---

## 🚀 Critical Next Actions (The "To-Do" List)

1. **[TESTING]** Create `src/test/deterministic.test.ts` to validate MVP-1.
2. **[SKILLS]** Implement a "Skill Fetcher" that downloads `SKILL.md` content from URLs so the ZIP export is truly self-contained.
3. **[UI]** Build the "Project History" view in `LandingPhase` to allow resuming projects from Dexie.
4. **[DOCS]** Populate `docs/VALIDATION_REPORT.md` template with more granular AI-driven checks.

---

**Audit Conclusion:** The project is structurally sound. The transition from "Infrastructure" to "Feature Complete" is well underway. The core risk is the complexity of fetching remote skill content for a fully deterministic offline export.
