# ROADMAP — ANCHOR (Agent-Executable Blueprint Generator)

**Project:** ANCHOR  
**Last updated:** 2026-04-30

ANCHOR’s mission: generate a deterministic, evidence-backed “base pack” that gives coding agents a stable place to stand: clear rules, pinned context, skills, guardrails, and a validated export.

---

## Guiding priorities (ranked)

1) Fastest possible local setup & developer experience (DX)  
2) Maximum security (secrets discipline, OWASP-minded defaults)  
3) Zero or near-zero infrastructure cost (Vercel free tier, self-contained)  
4) Minimal dependencies, up-to-date packages  
5) High test coverage with strict CI gates  
6) Advanced AI agent / tooling integration

---

## Non-negotiable invariants (MVP+)

1) **Evidence-first is a hard gate**
   - Every major recommendation MUST have an EvidenceItem:
     `{ url, accessed_at, snippet <= 25 words }`
   - Exported as: `evidence/evidence.json`

2) **Skills are untrusted**
   - `allowed-tools: shell/bash` is a **BLOCKER** unless user explicitly opts in.
   - Unicode/base64/injection checks are **WARNINGS** (MVP) but become stricter later.

3) **Deterministic export**
   - Stable sort everything
   - SHA-256 hash every file → `MANIFEST.json`
   - Always includes `VALIDATION_REPORT.md`

4) **BYOK first**
   - Gemini key is memory-only in MVP (never persisted to IndexedDB).

---

# MVP — “The Base Pack” (ship deterministic ZIP export)

Goal: a working wizard that produces a deterministic ZIP containing:
docs + evidence + skills + guardrails + validation report + manifest.

## MVP-0 — Repo baseline & policies (Week 1) ✅ DONE
Deliverables:
- [x] Next.js 16 + TypeScript + Tailwind + shadcn/ui scaffold
- [x] Local-first draft storage (IndexedDB)
- [x] Core docs in this repo internally consistent:
  - README / ROADMAP / ARCHITECTURE / PROJECT_CONTEXT / DECISIONS / SECURITY / TESTING / API_SPEC / DEPLOYMENT
- [x] Canonical types/contracts defined in `API_SPEC.md`
- [x] Agent entrypoint contract:
  - `GEMINI.md` tiny read-order file that points to `AGENTS.md`
  - `AGENTS.md` is canonical rules

## MVP-1 — Canonical Spec + deterministic artifacts (Week 1–2) ✅ DONE
Deliverables:
- [x] `ProjectSpec` canonical JSON structure
- [x] Deterministic artifact format:
  - `artifacts[]` where each artifact is `{ path, mediaType, content }`
- [x] Stable sorting rules defined and unit-tested

## MVP-2 — Evidence-first research module (Week 2–3) ✅ DONE
Deliverables:
- [x] Provider-agnostic research interface:
  - input: query (+ optional domain allowlist)
  - output: `EvidenceItem[]`
- [x] Evidence bundle export:
  - `evidence/evidence.json`
- [x] Hard gate:
  - major recommendations without evidence become validation **FAIL** until fixed

## MVP-3 — Document generator (Week 3–5)
Generate (for the user’s exported ZIP):
- README.md (user project)
- ROADMAP.md
- ARCHITECTURE.md
- PROJECT_CONTEXT.md
- DECISIONS.md
- SECURITY.md
- TESTING.md
- AGENTS.md + GEMINI.md
- API_SPEC.md
- DEPLOYMENT.md (if applicable)

## MVP-4 — Skill discovery + selection + packaging (Week 5–6)
Deliverables:
- Skills are directories containing `SKILL.md`
- Export path (required):
  - `.agents/skills/{scope}/{name}/SKILL.md`
- `skills-lock.json` created:
  - source URL, pinned ref (tag/SHA), sha256 checksum, license (if known), risk flags
- Skill safety gate:
  - shell/bash allowed-tools => **BLOCKER** unless explicitly opted-in
- Additional scans (unicode/base64/injection patterns) => **WARNINGS** (MVP)

## MVP-5 — Guardrails generation (Week 6–7)
Deliverables (generated into exported ZIP):
- Husky hooks:
  - `.husky/pre-commit` (lint-staged)
  - `.husky/commit-msg` (commitlint)
  - `.husky/pre-push` (tests + typecheck)
- GitHub Actions CI:
  - lint + typecheck + tests + build

## MVP-6 — Conflict detection + Validation report (Week 7–8)
Deliverables:
- `VALIDATION_REPORT.md` generated with:
  - conflicts (BLOCKER/WARNING)
  - missing items
  - unsafe permissions
  - recommended resolutions (2–3 options per issue)

## MVP-7 — Deterministic ZIP export + Manifest (Week 8–9)
Deliverables:
- Client-side ZIP export (default)
- `MANIFEST.json` contains sha256 hashes for every exported file
- Determinism guarantee:
  - same input snapshot => identical hashes
- Post-export “Next steps” instructions in UI:
  - includes symlink helper script generation planned (Claude/Cursor/Copilot)

---

# Phase 1 — “The Platform” (optional cloud features)
Goal: accounts + opt-in cloud sync (still BYOK-compatible).

- Optional Supabase Auth (email + Google)
- Optional cloud project history (opt-in)
- Freemium model (optional):
  - Free: BYOK
  - Pro: platform key (server-side only, never exposed to client)
- Next.js Server Actions for secure server-only secrets (if/when used)
- Split view UI (chat left + document preview right)
- Undo last step
- Safer key handling UX (still no persistence by default)

---

# Phase 2 — “Integrations”
Goal: export into the tools teams already use.

- GitHub OAuth + repo creation + initial commit (opt-in)
- Export to GitHub Issues from ROADMAP
- Export to Jira/Linear/Notion (one-time exports)
- Multi-provider AI (OpenAI/Claude) — evaluate secrets model carefully
- Cost estimator module (infra + API costs) — still BYOK-first messaging

---

# Phase 3 — “Power Features”
Goal: team workflows and multimodal intake.

- Team workspace + roles
- Multimodal intake (wireframes → architecture; voice → discovery)
- VS Code / Cursor plugin
- Living roadmap syncing (GitHub Issues integration)

---

# Phase 4 — “Ecosystem”
Goal: community + marketplace + enterprise readiness.

- Skills marketplace (publish/rate)
- Sandbox execution (high security complexity)
- Enterprise tier (SSO, audit logs, self-hosted registries)

---

## Time-sensitive actions

| Date | Action |
|---|---|
| 2026-06-17 | Monitor `ai.google.dev` for updated stable Gemini model IDs; update `.env.example` and pinned config before non-versioned aliases are deprecated (tracked in DECISIONS.md). |
