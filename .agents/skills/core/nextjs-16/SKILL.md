---
name: nextjs-16
description: >
  Next.js 16 development patterns for the ANCHOR codebase. Use when building or
  modifying any part of the ANCHOR Next.js 16 app: App Router, Server Components,
  Server Actions, proxy.ts routing, "use cache" directive, Tailwind v4 config in
  globals.css, and React 19.4+. This is the Domain A (internal) version — richer
  than the export template stub in skills/core/nextjs-16.
---

# Next.js 16 — ANCHOR Codebase Patterns

**Version**: Next.js 16.2  
**React**: 19.4.0+ (NEVER downgrade — CVSS 10.0 RCE below 19.4.0)  
**Node.js**: 24.15.0+  
**Bundler**: Turbopack (default in 16)

> [!IMPORTANT]
> NEVER create `middleware.ts`. All routing logic lives in `proxy.ts` (ADR per AGENTS.md §2.2).
> NEVER create `tailwind.config.js`. Tailwind v4 config lives in `globals.css` via `@theme`.

---

## 1. Proxy Pattern (replaces middleware.ts)

```typescript
// src/proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Example: protect /dashboard
  if (pathname.startsWith('/dashboard')) {
    // Check session or redirect
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
```

Migration codemod (if upgrading from older Next.js):
```bash
npx @next/codemod@latest middleware-to-proxy .
```

---

## 2. Async Params (Next.js 16 — REQUIRED)

```typescript
// src/app/projects/[id]/page.tsx
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // MUST await — never access directly
  return <div>Project: {id}</div>;
}
```

Same for `searchParams`:
```typescript
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  // ...
}
```

---

## 3. "use cache" Directive

```typescript
// Opt-in caching per function (replaces unstable_ prefixes)
import { unstable_cacheLife as cacheLife } from 'next/cache'; // still valid in 16

async function getProjectData(id: string) {
  'use cache';
  cacheLife('hours');
  const data = await fetch(`/api/projects/${id}`).then(r => r.json());
  return data;
}
```

---

## 4. Server Actions

```typescript
// src/app/actions/project.ts
'use server';

import { z } from 'zod';

const CreateSchema = z.object({ name: z.string().min(1) });

export async function createProject(formData: FormData) {
  const result = CreateSchema.safeParse({ name: formData.get('name') });
  if (!result.success) return { error: result.error.flatten() };
  // ... create project
  return { success: true };
}
```

---

## 5. Tailwind v4 Config (globals.css — NO tailwind.config.js)

```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  --color-primary: oklch(65% 0.2 260);
  --color-background: oklch(10% 0.01 260);
  --font-sans: 'Inter', sans-serif;
  --radius-lg: 0.75rem;
}
```

---

## 6. Parallel Routes — Prevent 404s

Every parallel route segment MUST have a `default.js`:

```typescript
// src/app/@sidebar/default.tsx
export default function SidebarDefault() {
  return null; // prevents 404 on direct navigation
}
```

---

## 7. Route Handler (API)

```typescript
// src/app/api/health/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'ok', ts: Date.now() });
}
```

---

## ANCHOR File Structure

```
src/
├── app/
│   ├── globals.css          ← Tailwind v4 @theme config
│   ├── layout.tsx
│   ├── page.tsx             ← LandingPhase (wizard entry)
│   ├── api/                 ← Route Handlers
│   └── @sidebar/            ← Parallel routes (must have default.tsx)
├── proxy.ts                 ← Replaces middleware.ts
├── lib/
│   └── db.ts                ← Dexie schema
└── store/
    ├── useApiKeyStore.ts     ← RAM-only BYOK store
    └── useProjectStore.ts    ← Wizard + spec slices
```

---

## Red Flags

- File `middleware.ts` exists anywhere → **BLOCKER** (ADR §2.2)
- File `tailwind.config.js` exists → **BLOCKER** (ADR §2.2)
- `params.id` without `await params` → runtime error in production
- `unstable_` prefix APIs still used where stable v16 APIs exist
- React version in `package.json` changed → **CVSS 10.0 risk**

---

## Verification

- [ ] No `middleware.ts` in project
- [ ] `proxy.ts` handles all routing logic
- [ ] All `params` and `searchParams` are awaited
- [ ] Tailwind config in `globals.css` `@theme` block only
- [ ] All parallel route segments have `default.tsx`
- [ ] Build passes: `pnpm build` (Turbopack)
