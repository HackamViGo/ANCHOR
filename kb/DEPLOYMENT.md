# DEPLOYMENT — ANCHOR

## MVP deployment target
- Vercel (free tier-friendly)

## MVP hosting model (cost-minimal)
- Client-side generation + client-side deterministic ZIP export by default
- No database required
- No auth required
- BYOK Gemini key stays in-memory (not stored)

## Environment variables
MVP (client-safe):
- NEXT_PUBLIC_APP_NAME="ANCHOR"
- NEXT_PUBLIC_APP_ENV="local|preview|production"
- NEXT_PUBLIC_GEMINI_PRO_MODEL="(pinned model id)"
- NEXT_PUBLIC_GEMINI_FLASH_MODEL="(pinned model id)"
- Feature flags:
  - NEXT_PUBLIC_FEATURE_SKILLS_PHASE="true|false"
  - NEXT_PUBLIC_FEATURE_AUTOMATION_PHASE="true|false"

Optional (Phase 1+ server-mode only; never exposed to client builds):
- GEMINI_API_KEY=""

## CI/CD
- GitHub Actions workflows will enforce:
  - lint, typecheck, test, build
  - determinism checks (manifest stability)

## Logging & privacy
- Default: no prompt logging
- Never log API keys
- If server-mode is enabled later, ensure request logs do not contain prompts or secrets by default


---
Last Modified: 2026-05-01T23:23:41+03:00
