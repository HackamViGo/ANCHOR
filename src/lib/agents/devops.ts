// ⚓ ANCHOR — DevOps agent (gemini-2.5-flash-lite)
// Generates hooks, CI, automation files

import type { Artifact, OrchestratorOutput, ProjectSpec } from "@/types";
import { sanitizeProjectName } from "@/lib/utils/sanitize";
import { orchestrate } from "./orchestrator";

export async function runDevOpsPhase(
  apiKey: string,
  spec: Partial<ProjectSpec>,
): Promise<OrchestratorOutput> {
  return orchestrate(apiKey, "automation", spec);
}

// ─────────────────────────────────────────
// Local artifact generators (deterministic, no AI needed)
// ─────────────────────────────────────────

export function buildHuskyArtifacts(): Artifact[] {
  return [
    {
      path: ".husky/pre-commit",
      mediaType: "text/x-shellscript",
      content: `#!/usr/bin/env sh
set -e
pnpm exec lint-staged
`,
    },
    {
      path: ".husky/commit-msg",
      mediaType: "text/x-shellscript",
      content: `#!/usr/bin/env sh
set -e
pnpm exec commitlint --edit "$1"
`,
    },
    {
      path: ".husky/pre-push",
      mediaType: "text/x-shellscript",
      content: `#!/usr/bin/env sh
set -e
pnpm tsc --noEmit
pnpm test --run
`,
    },
  ];
}

export function buildCIArtifacts(projectName: string): Artifact[] {
  const safe = sanitizeProjectName(projectName);

  return [
    {
      path: ".github/workflows/ci.yml",
      mediaType: "application/x-yaml",
      content: `name: ci

on:
  pull_request:
  push:
    branches: [main]

jobs:
  quality:
    name: Lint & Typecheck
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
      - run: corepack enable
      - run: corepack prepare pnpm@latest --activate
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck

  test:
    name: Test
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
      - run: corepack enable
      - run: corepack prepare pnpm@latest --activate
      - run: pnpm install --frozen-lockfile
      - run: pnpm test
      - uses: codecov/codecov-action@v4

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
      - run: corepack enable
      - run: corepack prepare pnpm@latest --activate
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
        env:
          NEXT_PUBLIC_APP_NAME: "${safe}"
          NEXT_PUBLIC_APP_ENV: "ci"
`,
    },
    {
      path: ".github/workflows/preview.yml",
      mediaType: "application/x-yaml",
      content: `name: preview

on:
  pull_request:

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy Vercel Preview
        run: echo "Vercel GitHub integration handles PR previews automatically."
`,
    },
    {
      path: ".github/workflows/release.yml",
      mediaType: "application/x-yaml",
      content: `name: release

on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Production
        run: echo "Vercel GitHub integration deploys main to production automatically."
`,
    },
  ];
}

export function buildSymlinkScripts(): Artifact[] {
  return [
    {
      path: "setup-agent-symlinks.sh",
      mediaType: "text/x-shellscript",
      content: `#!/usr/bin/env bash
# ⚓ ANCHOR — Setup agent symlinks
# Creates agent-specific entrypoints pointing to AGENTS.md (canonical)

set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "⚓ Setting up ANCHOR agent symlinks..."

# CLAUDE.md → AGENTS.md
ln -sf "$ROOT/AGENTS.md" "$ROOT/CLAUDE.md"
echo "  ✅ CLAUDE.md → AGENTS.md"

# Cursor rules
mkdir -p "$ROOT/.cursor/rules"
ln -sf "$ROOT/AGENTS.md" "$ROOT/.cursor/rules/main.mdc"
echo "  ✅ .cursor/rules/main.mdc → AGENTS.md"

# GitHub Copilot
mkdir -p "$ROOT/.github"
ln -sf "$ROOT/AGENTS.md" "$ROOT/.github/copilot-instructions.md"
echo "  ✅ .github/copilot-instructions.md → AGENTS.md"

echo ""
echo "✅ Done. Open your IDE and say:"
echo '   "Read AGENTS.md and tell me you understand the project."'
`,
    },
    {
      path: "setup-agent-symlinks.ps1",
      mediaType: "text/plain",
      content: `# ⚓ ANCHOR — Setup agent symlinks (Windows / PowerShell)

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$AgentsFile = Join-Path $Root "AGENTS.md"

Write-Host "⚓ Setting up ANCHOR agent symlinks..." -ForegroundColor Cyan

# CLAUDE.md → AGENTS.md
New-Item -ItemType SymbolicLink -Path (Join-Path $Root "CLAUDE.md") \`
  -Target $AgentsFile -Force | Out-Null
Write-Host "  ✅ CLAUDE.md → AGENTS.md"

# Cursor rules
$CursorDir = Join-Path $Root ".cursor\\rules"
New-Item -ItemType Directory -Force -Path $CursorDir | Out-Null
New-Item -ItemType SymbolicLink -Path (Join-Path $CursorDir "main.mdc") \`
  -Target $AgentsFile -Force | Out-Null
Write-Host "  ✅ .cursor/rules/main.mdc → AGENTS.md"

# GitHub Copilot
$GithubDir = Join-Path $Root ".github"
New-Item -ItemType Directory -Force -Path $GithubDir | Out-Null
New-Item -ItemType SymbolicLink \`
  -Path (Join-Path $GithubDir "copilot-instructions.md") \`
  -Target $AgentsFile -Force | Out-Null
Write-Host "  ✅ .github/copilot-instructions.md → AGENTS.md"

Write-Host ""
Write-Host "✅ Done. Open your IDE and say:" -ForegroundColor Green
Write-Host '   "Read AGENTS.md and tell me you understand the project."'
`,
    },
    {
      path: ".gemini/settings.json",
      mediaType: "application/json",
      content: JSON.stringify(
        {
          contextFileName: ["GEMINI.md", "AGENTS.md"],
          fileFiltering: { respectGitignore: true },
        },
        null,
        2,
      ),
    },
  ];
}
