# PROJECT_CONTEXT (Canonical) — ANCHOR

**Validated on:** 2026-04-30

This file is the canonical source of truth for:
- pinned toolchain versions
- non-negotiable invariants
- determinism rules
- evidence-first requirements

---

## Pinned toolchain (ANCHOR baseline)

Runtime:
- Node.js: 24.14.1 (LTS)

Web framework:
- Next.js: 16.2.4
- React: 19.2.5
- TypeScript: 6.0.3

Quality:
- ESLint: 10.2.1
- typescript-eslint: 8.59.1
- Prettier: 3.8.3

Testing:
- Vitest: 4.1.5

Git guardrails:
- Husky: 9.1.7
- lint-staged: 16.4.0
- commitlint: 20.5.3

Package manager:
- pnpm: 11.0.0

---

## Non-negotiable invariants

1) Evidence-first (hard gate)
- Every major recommendation MUST have an EvidenceItem:
  `{ url, accessed_at, snippet <= 25 words }`
- Evidence is exported as: `evidence/evidence.json`

2) Skills are untrusted
- `allowed-tools: shell/bash` is a BLOCKER unless explicitly opted-in and pinned.
- Unicode/base64/injection scans are WARNINGS in MVP.

3) Deterministic export
- Stable sort everything.
- SHA-256 hash every exported file.
- Always include `VALIDATION_REPORT.md` and `MANIFEST.json`.

4) BYOK secrets
- BYOK Gemini key is memory-only by default.
- Never persisted to IndexedDB/localStorage.
- Never included in exported ZIP.

---

## Framework/tool constraints (operational)

Next.js 16 constraints:
- Minimum Node version: 20.9.0+
- `next lint` is removed; lint runs via ESLint CLI (or an alternative like Biome if chosen later)

pnpm 11 constraints:
- pnpm 11 changes defaults and config behavior; avoid assumptions from older pnpm configs.
- Prefer explicit configuration and pinned versions in CI (Corepack).

---

## Data privacy baseline (MVP)

- Local-first drafts in browser storage (IndexedDB).
- Client-side ZIP export by default.
- No prompt logging by default.

---

## Verification sources (URLs)

- Node releases: https://github.com/nodejs/node/releases
- Next.js releases: https://github.com/vercel/next.js/releases
- React releases: https://github.com/facebook/react/releases
- TypeScript releases: https://github.com/microsoft/TypeScript/releases
- ESLint release notes: https://eslint.org/blog/
- typescript-eslint releases: https://github.com/typescript-eslint/typescript-eslint/releases
- Prettier releases: https://github.com/prettier/prettier/releases
- Vitest: https://vitest.dev/
- pnpm releases: https://github.com/pnpm/pnpm/releases
- commitlint CLI docs: https://commitlint.js.org/

Pinned version existence cross-checks were verified against official release pages for Next.js, React, TypeScript, Prettier, and typescript-eslint.
