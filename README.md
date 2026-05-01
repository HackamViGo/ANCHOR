# ANCHOR

Slogan - AI Needs Clear Human-defined Organization & Rules  
Stop the drift. Give your AI a place to stand.

ANCHOR is a web app that turns an idea into an **Agent-Executable Blueprint**:
- a canonical machine-readable `ProjectSpec`
- evidence-backed recommendations (URLs per major claim)
- an exportable docs pack + skills pack + guardrails
- deterministic ZIP export with a manifest (Phase: MVP)

BYOK principle:
> We don’t solve AI cost. The user brings their own intelligence.

---

## What ANCHOR does (MVP)

ANCHOR generates a “base pack” that helps IDE agents (Gemini/Claude/Cursor/Copilot) work safely and consistently:

- **Discovery (wizard)** → normalize inputs into `ProjectSpec`
- **Evidence-first research** → `evidence/evidence.json`
- **Synthesis** → docs, skills, automation templates (as deterministic artifacts)
- **Validation** → conflicts + missing items + risk flags
- **Export** → deterministic ZIP (stable file order + SHA-256 manifest)

---

## What ANCHOR does NOT do (MVP boundaries)

- ANCHOR does **not** run as an always-on IDE agent.
- ANCHOR does **not** continuously update exported projects after export.
- ANCHOR does **not** store your BYOK Gemini key; keys are memory-only.

---

## Key guarantees (non-negotiable invariants)

1) **Evidence-first is a hard gate**  
Every major recommendation MUST have an EvidenceItem:
`{ url, accessed_at, snippet (<= 25 words) }`
and must be exported as `evidence/evidence.json`.

2) **Skills are untrusted by default**  
- Any `allowed-tools: shell/bash` is a **BLOCKER** unless explicitly opted-in by the user.
- Additional security scans (unicode/base64/injection patterns) are **WARNINGS** in MVP.

3) **Deterministic export**
- Stable sort all files
- SHA-256 hash every file → `MANIFEST.json`
- Always include `VALIDATION_REPORT.md` in exports

---

## Agent entrypoint design

- `GEMINI.md` is intentionally tiny: it only defines the read-order and tells Gemini to read `AGENTS.md`.
- `AGENTS.md` is the canonical rules of engagement.

---

## Repository docs (this repo)

- `ROADMAP.md` — MVP → Phase 4 plan
- `ARCHITECTURE.md` — system design & data flow
- `PROJECT_CONTEXT.md` — pinned toolchain + invariants
- `DECISIONS.md` — ADR-style decisions
- `SECURITY.md` — threat model + controls
- `TESTING.md` — test strategy and CI gates
- `API_SPEC.md` — canonical types/contracts
- `DEPLOYMENT.md` — Vercel deployment notes

---

## Export contract (what the generated ZIP will contain in MVP)

The exported ZIP (for a user project) will include at minimum:
- docs pack (README/ROADMAP/ARCHITECTURE/SECURITY/TESTING/DECISIONS/PROJECT_CONTEXT/AGENTS/GEMINI/API_SPEC)
- skills in: `.agents/skills/{scope}/{name}/SKILL.md`
- evidence: `evidence/evidence.json`
- `skills-lock.json`
- `VALIDATION_REPORT.md`
- `MANIFEST.json` (sha256 hashes for every exported file)

(Generation for `.husky/` and `.github/workflows/` is planned in MVP scope and appears in `ROADMAP.md`.)
