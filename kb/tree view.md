# PROJECT TREE VIEW — ANCHOR

**Last updated:** 2026-04-30
**Status:** 32 Source Files + Root Foundation

```text
ANCHOR/
├── 📄 README.md                # Main landing
├── 📄 GEMINI.md                # Agent entrypoint
├── 📄 AGENTS.md                # Rules of engagement
├── 📄 package.json             # Deps (Node 24, pnpm 11)
├── 📄 tsconfig.json            # Strict TS config
├── 📄 vitest.config.ts         # Test runner
├── 📄 next.config.ts           # Next.js config
├── 📂 kb/                      # Knowledge Base (Canonical Docs)
│   ├── 📄 ROADMAP.md
│   ├── 📄 ARCHITECTURE.md
│   ├── 📄 PROJECT_CONTEXT.md
│   ├── 📄 DECISIONS.md
│   ├── 📄 SECURITY.md
│   ├── 📄 TESTING.md
│   ├── 📄 API_SPEC.md
│   ├── 📄 DEPLOYMENT.md
│   ├── 📄 IMPORTANT_NOTES.md
│   └── 📄 tree view.md         # THIS FILE
├── 📂 scripts/                 # Automation
│   ├── 📄 setup-agent-symlinks.sh
│   └── 📄 sync-skill-templates.sh
├── 📂 skills/                  # Skill templates (Authoring)
│   ├── 📂 core/
│   │   ├── 📂 project-spec-normalizer/
│   │   ├── 📂 evidence-bundle-builder/
│   │   ├── 📂 skill-frontmatter-validator/
│   │   └── 📂 conflict-detector/
│   └── 📂 devops/
│       ├── 📂 husky-guardrails/
│       ├── 📂 github-actions-ci/
│       └── 📂 zip-exporter/
├── 📂 src/                      # 32 Canonical Files
│   ├── 📂 app/                  # Next.js App Router
│   │   ├── 📂 api/              # Backend routes (Orchestrate, Research, Export)
│   │   ├── 📄 globals.css       # Design System tokens
│   │   ├── 📄 layout.tsx        # Shell
│   │   └── 📄 page.tsx          # Landing
│   ├── 📂 components/           # UI Components
│   │   ├── 📂 shared/           # Common components (EvidenceBadge, ConflictPanel)
│   │   └── 📂 wizard/           # Wizard-specific (Shell, StepProgress, Phases)
│   ├── 📂 lib/                  # Core Logic
│   │   ├── 📂 agents/           # Orchestrator + Specialized Agents
│   │   ├── 📂 db/               # Dexie/IndexedDB persistence
│   │   ├── 📂 export/           # Manifest + Deterministic ZIP
│   │   ├── 📂 search/           # Grounding interfaces
│   │   ├── 📂 utils/            # Shared helpers (cn, sanitize)
│   │   └── 📂 validation/       # Skill scanner, Conflict detector, Engine
│   ├── 📂 store/                # Zustand state (Wizard Store)
│   ├── 📂 types/                # Single source of truth types
│   └── 📂 test/                 # Test factories
└── 📂 templates/                # Export templates
    └── 📂 export/               # Blank structures for new projects
```

## Status Checklist

- [x] Root foundation created (README, AGENTS, GEMINI, etc.)
- [x] Knowledge Base populated (8 canonical files)
- [x] Scripts and Skill templates initialized
- [x] Source code migrated (32 files in `src/`)
- [x] Deterministic export templates ready
- [x] Tree view synchronized

## Final Notes (L1196-1199 from темп.md)
- Ensure `pnpm install` and `pnpm prepare` are run to activate Husky.
- Deterministic ZIP auditing via `MANIFEST.json` is a hard requirement.
- Always include `VALIDATION_REPORT.md` in exports.
