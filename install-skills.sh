#!/usr/bin/env bash
# ⚓ ANCHOR — Install all external agent skills
# Run once after cloning the repo.
# Skills are installed into .agents/skills/

set -e

SKILLS_DIR=".agents/skills"

echo "⚓ Installing ANCHOR agent skills..."
echo ""

# ── CORE FRAMEWORK ───────────────────────────────────────

echo "📦 Next.js skills (vercel-labs/next-skills)..."
npx skills add vercel-labs/next-skills \
  --skill next-best-practices \
  --out "$SKILLS_DIR/frontend/next-best-practices"

npx skills add vercel-labs/next-skills \
  --skill next-upgrade \
  --out "$SKILLS_DIR/frontend/next-upgrade"

npx skills add vercel-labs/next-skills \
  --skill next-cache-components \
  --out "$SKILLS_DIR/frontend/next-cache-components"

echo "📦 React skills (vercel-labs/agent-skills)..."
npx skills add vercel-labs/agent-skills \
  --skill vercel-react-best-practices \
  --out "$SKILLS_DIR/frontend/react-best-practices"

npx skills add vercel-labs/agent-skills \
  --skill vercel-composition-patterns \
  --out "$SKILLS_DIR/frontend/composition-patterns"

# ── UI ───────────────────────────────────────────────────

echo "📦 shadcn/ui skill (google-labs-code)..."
npx skills add VoltAgent/awesome-agent-skills \
  --skill google-labs-code/shadcn-ui \
  --out "$SKILLS_DIR/frontend/shadcn-ui"

echo "📦 Tailwind CSS v4 skill..."
npx skills add Lombiq/Tailwind-Agent-Skills \
  --skill tailwind-4-docs \
  --out "$SKILLS_DIR/frontend/tailwind-4-docs"

# ── STATE ────────────────────────────────────────────────

echo "📦 Zustand skill (microsoft)..."
npx skills add VoltAgent/awesome-agent-skills \
  --skill microsoft/zustand-store-ts \
  --out "$SKILLS_DIR/frontend/zustand-store-ts"

# ── TYPESCRIPT ───────────────────────────────────────────

echo "📦 TypeScript skill..."
npx skills add EnderPuentes/ai-agent-skills \
  --skill typescript \
  --out "$SKILLS_DIR/core/typescript"

# ── TESTING ──────────────────────────────────────────────

echo "📦 Vitest skill (BjornMelin)..."
npx skills add BjornMelin/dev-skills \
  --skill vitest \
  --out "$SKILLS_DIR/qa/vitest"

echo "📦 Webapp testing skill (Anthropic)..."
npx skills add VoltAgent/awesome-agent-skills \
  --skill anthropics/webapp-testing \
  --out "$SKILLS_DIR/qa/webapp-testing"

# ── DEVOPS ───────────────────────────────────────────────

echo "📦 pnpm skill (antfu)..."
npx skills add antfu/skills \
  --skill pnpm \
  --out "$SKILLS_DIR/devops/pnpm"

echo "📦 Conventional commits skill..."
npx skills add EnderPuentes/ai-agent-skills \
  --skill conventional-commits \
  --out "$SKILLS_DIR/devops/conventional-commits"

# ── AI / GOOGLE ──────────────────────────────────────────

echo "📦 Google Stitch Loop skill..."
npx skills add VoltAgent/awesome-agent-skills \
  --skill google-labs-code/stitch-loop \
  --out "$SKILLS_DIR/core/stitch-loop"

# ── SECURITY ─────────────────────────────────────────────

echo "📦 Secret leak prevention skill..."
npx skills add regenrek/agent-skills \
  --skill secret-leak-prevention \
  --out "$SKILLS_DIR/security/secret-leak-prevention"

echo "📦 Anthropic skill creator..."
npx skills add VoltAgent/awesome-agent-skills \
  --skill anthropics/skill-creator \
  --out "$SKILLS_DIR/core/skill-creator"

echo ""
echo "✅ All external skills installed into $SKILLS_DIR"
echo ""
echo "⚠️  ANCHOR custom skills (already in repo):"
echo "   .agents/skills/core/anchor-project-base"
echo "   .agents/skills/core/project-spec-normalizer"
echo "   .agents/skills/core/evidence-bundle-builder"
echo "   .agents/skills/core/conflict-detector"
echo "   .agents/skills/core/skill-frontmatter-validator"
echo "   .agents/skills/frontend/nextjs-16-app-router"
echo "   .agents/skills/backend/gemini-byok-client"
echo "   .agents/skills/devops/husky-guardrails"
echo "   .agents/skills/devops/github-actions-ci"
echo "   .agents/skills/devops/zip-exporter"
echo ""
echo "📋 Next: run skill scanner on all installed skills:"
echo "   pnpm tsx src/lib/validation/skill-scanner.ts --scan .agents/skills/"