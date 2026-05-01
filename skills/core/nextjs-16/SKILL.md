---
name: nextjs-16
description: |
  Build Next.js 16 apps with App Router, Server Components/Actions, Cache Components ("use cache"), and async route params. Includes proxy.ts (replaces middleware.ts) and React 19.4+.

  Use when: building Next.js 16 projects, or troubleshooting async params (Promise types), "use cache" directives, parallel route 404s (missing default.js), or proxy.ts CORS.
allowed-tools: ["Read", "Write", "Edit", "Bash", "Glob", "Grep"]
---

# Next.js 16 App Router - Production Patterns

**Version**: Next.js 16.2.0
**React Version**: 19.4.0+
**Node.js**: 24.15.0+

## Overview
Guides agents through the development and optimization of Next.js 16 applications, focusing on the App Router, asynchronous data fetching, and the new proxy-based routing model.

## When to Use
- Building new Next.js 16 projects.
- Migrating from Next.js 14/15 (specifically handling async params).
- Implementing advanced caching with the `"use cache"` directive.
- Setting up network boundaries via `src/proxy.ts`.

## Core Process

1. **Routing Strategy**
   - Use `src/app/` for file-system routing.
   - Implement `proxy.ts` for all routing/proxy logic. **Do not create middleware.ts**.
   - Use `default.js` in all parallel route segments to prevent 404s.

## Usage

```bash
# Initialize a new Next.js 16 project with ANCHOR standards
bash scripts/setup.sh <project-name>
```

**Arguments:**
- `project-name` - The directory name for the new project.

2. **Data Fetching & Caching**
   - Prefer Server Components for data fetching.
   - Use the `"use cache"` directive for opt-in caching.
   - Handle `params` and `searchParams` as Promises (e.g., `const { id } = await params`).

3. **Server Actions**
   - Define actions in separate files with `'use server'`.
   - Implement Zod validation for all action inputs.
   - Handle errors gracefully using `useFormState` or similar patterns.

## Specific Techniques

### Async Params Pattern
```tsx
// Page component
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div>Item: {id}</div>;
}
```

### Proxy Pattern (proxy.ts)
```ts
// src/proxy.ts
export default function proxy(req: Request) {
  // Logic replaces middleware.ts
}
```

## Common Rationalizations
| Rationalization | Reality |
|---|---|
| "I can just use middleware.ts" | Next.js 16.2 strictly prefers proxy.ts for performance and clarity. |
| "Async params are too complex" | They are required for safe parallel execution and hydration. |

## Red Flags
- Presence of `middleware.ts` in the project root.
- Accessing `params` properties directly without `await`.
- Using `unstable_` caching prefixes (deprecated in v16).

## Verification
- [ ] No `middleware.ts` exists.
- [ ] All `params` and `searchParams` are awaited.
- [ ] `"use cache"` is used appropriately for static/dynamic boundaries.
- [ ] Build passes with Turbopack (default).
