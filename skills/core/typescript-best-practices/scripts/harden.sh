#!/bin/bash
# ⚓ ANCHOR — TypeScript Hardening Script
# Enforces strict mode and best practices in tsconfig.json

set -e

TARGET_DIR=${1:-"."}

echo "🛡️ Hardening TypeScript configuration in: $TARGET_DIR..." >&2

if [ ! -f "$TARGET_DIR/tsconfig.json" ]; then
  echo "❌ Error: tsconfig.json not found in $TARGET_DIR" >&2
  exit 1
fi

# 1. Update tsconfig.json using basic sed/jq (if available)
# Here we use a python one-liner for reliable JSON manipulation
python3 -c "
import json, sys
path = '$TARGET_DIR/tsconfig.json'
with open(path, 'r') as f:
    data = json.load(f)

if 'compilerOptions' not in data:
    data['compilerOptions'] = {}

# Enforce strict patterns
data['compilerOptions']['strict'] = True
data['compilerOptions']['noImplicitAny'] = True
data['compilerOptions']['noUnusedLocals'] = True
data['compilerOptions']['noUnusedParameters'] = True
data['compilerOptions']['noFallthroughCasesInSwitch'] = True
data['compilerOptions']['forceConsistentCasingInFileNames'] = True
data['compilerOptions']['skipLibCheck'] = True

with open(path, 'w') as f:
    json.dump(data, f, indent=2)
"

# 2. Add .npmrc if missing
if [ ! -f "$TARGET_DIR/.npmrc" ]; then
  echo "engine-strict=true" > "$TARGET_DIR/.npmrc"
fi

echo "✅ TypeScript configuration hardened successfully." >&2

# 3. Success Output (JSON)
cat <<EOF
{
  "status": "success",
  "target": "$TARGET_DIR",
  "applied_rules": [
    "strict: true",
    "noImplicitAny: true",
    "noUnusedLocals: true",
    "engine-strict: true"
  ]
}
EOF
