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
- **Knowledge Management**: AnchorMemory (Local JSON-based modular property graph)
- **Runtime**: Node.js 24.15.0 (pinned via .nvmrc)

## Critical Constraints (2026 "Gotchas")
- **React2Shell Protection**: NEVER alter the React version in `package.json`. Project MUST stay on React >= 19.4.0 to avoid CVSS 10.0 RCE.
- **Routing**: `middleware.ts` is DEPRECATED in Next.js 16.2. All proxy/routing logic must live in `src/lib/proxy.ts` or similar.
- **Config**: `tailwind.config.js` is IGNORED by Tailwind v4. All config MUST be in `src/app/globals.css`.
- **Security**: BYOK (no stored secrets).


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

---

## 📁 Workspace Management
- **temp/**: Local-only scratch directory for temporary assets, generated images, and experiment logs.
  - **Status**: Added to `.gitignore`.
  - **Rule**: Content here is never committed. Can be purged at any time.

- **skills/**: DOMAIN B skill templates — shipped inside the ZIP export to end-user projects.
  - Path inside exported ZIP: `.agents/skills/{scope}/{name}/SKILL.md`
  - These are minimal starter skeletons (stub SKILL.md files) for ANCHOR-generated agent packs.

- **.agents/skills/**: DOMAIN A internal skills — for coding agents (Antigravity/Gemini/Claude) working on the ANCHOR codebase itself.
  - Not exported. Used by agents reading GEMINI.md / AGENTS.md to help implement features.

---

## 📈 Current Status (Audit 2026-05-01)
- **MVP-0**: ✅ DONE
- **MVP-1**: ✅ DONE (Unit tested)
- **MVP-2**: ✅ DONE
- **MVP-3**: 🔄 IN_PROGRESS (UI scaffolding)
- **MVP-7**: 🔄 IN_PROGRESS (Logic verified, UI pending)


---
Last Modified: 2026-05-01T23:23:41+03:00
