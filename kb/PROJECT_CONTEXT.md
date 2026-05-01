# PROJECT_CONTEXT — ANCHOR (2026)

## Identity
- **Project Name**: ANCHOR
- **Slogan**: AI Needs Clear Human-defined Organization & Rules
- **Core Value**: Stop the drift. Give your AI a place to stand.

## Technical Stack (Pinned)
- **Framework**: Next.js 16.2.0 (App Router, Proxy-based routing)
- **Language**: TypeScript 5.7+
- **Package Manager**: pnpm 11.0.0 (Strict subdeps mode)
- **Styling**: Tailwind v4.0.0 (CSS-only configuration via @theme)
- **Database**: Dexie.js (IndexedDB for local-first persistence)
- **Runtime**: Node.js 24.15.0 (pinned via .nvmrc)

## Critical Constraints (2026 "Gotchas")
- **React2Shell Protection**: NEVER alter the React version in `package.json`. Project MUST stay on React >= 19.4.0 to avoid CVSS 10.0 RCE.
- **Routing**: `middleware.ts` is DEPRECATED in Next.js 16.2. All proxy/routing logic must live in `src/lib/proxy.ts` or similar.
- **Config**: `tailwind.config.js` is IGNORED by Tailwind v4. All config MUST be in `src/app/globals.css`.
- **Security**: Evidence-first (HARD GATE) + BYOK (no stored secrets).

## Non-negotiable Invariants

### 1) Evidence-first (hard gate)
- Every major recommendation MUST have an EvidenceItem:
  `{ url, accessed_at, snippet <= 25 words }`
- Evidence is exported as: `evidence/evidence.json`

### 2) Deterministic Generation
- All output paths stable-sorted.
- SHA-256 computed per file.
- `MANIFEST.json` required in exports.

### 3) BYOK Secret Handling
- No secrets in `localStorage`, `IndexedDB`, or exported ZIP.
- API keys (Gemini, etc.) provided at runtime by the user (BYOK).

---

## 📄 Manifest of Artifacts (Base Pack)
1. README.md
2. ROADMAP.md
3. ARCHITECTURE.md
4. GEMINI.md
5. AGENTS.md
6. PROJECT_CONTEXT.md
7. DECISIONS.md
8. SECURITY.md
9. TESTING.md
10. API_SPEC.md
11. DEPLOYMENT.md
