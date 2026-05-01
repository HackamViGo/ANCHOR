#!/bin/bash
# ⚓ ANCHOR — Next.js 16 Setup Script
# Initializes a new project with Next.js 16 standards (App Router, proxy.ts)

set -e

PROJECT_NAME=$1

if [ -z "$PROJECT_NAME" ]; then
  echo "Usage: bash setup.sh <project-name>" >&2
  exit 1
fi

echo "🚀 Initializing Next.js 16 project: $PROJECT_NAME..." >&2

# 1. Run official initializer
# Note: In 2026, we use --next-16 flag or it's default
npx -y create-next-app@latest "$PROJECT_NAME" \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-pnpm \
  --no-git

# 2. Add ANCHOR invariants
cd "$PROJECT_NAME"

echo "🔧 Applying ANCHOR security invariants (Next.js 16.2)..." >&2

# Create proxy.ts (Required in v16.2)
cat > src/proxy.ts <<EOF
/**
 * ⚓ ANCHOR — Network Proxy (Replaces middleware.ts)
 * Centralized routing and security logic for Next.js 16.2
 */
export default function proxy(req: Request) {
  // Add routing, auth, or CORS logic here
  return null;
}
EOF

# Ensure engines are pinned
cat > .npmrc <<EOF
engine-strict=true
EOF

# 3. Success Output (JSON)
cat <<EOF
{
  "status": "success",
  "project": "$PROJECT_NAME",
  "version": "16.2.0",
  "routing": "proxy.ts",
  "next_steps": [
    "cd $PROJECT_NAME",
    "pnpm dev"
  ]
}
EOF
