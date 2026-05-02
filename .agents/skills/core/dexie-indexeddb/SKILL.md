---
name: dexie-indexeddb
description: >
  Local-first IndexedDB storage patterns using Dexie.js. Use when implementing
  persistent client-side state in ANCHOR (ProjectSpec snapshots, artifact content,
  evidence bundles, user approvals). Covers TypeScript schema definition, versioning,
  CRUD operations, transactions, reactive queries with useLiveQuery, and
  the BYOK rule (never persist secrets). Do NOT use for API key storage.
---

# Dexie.js — Local-First Storage (ANCHOR)

**Version**: Dexie 4.x  
**Stack**: Next.js 16 / React 19 / TypeScript

> [!IMPORTANT]
> Per ADR-0009: BYOK API keys MUST NOT be persisted in IndexedDB.
> Only non-sensitive project state goes in Dexie. Secrets live in Zustand RAM only.

---

## 1. Schema Definition (TypeScript)

Prefer the `EntityTable` + object cast pattern over class subclassing:

```typescript
// lib/db.ts
import Dexie, { type EntityTable } from 'dexie';

export interface ProjectSnapshot {
  id: string;          // manual UUID
  name: string;
  spec: object;        // ProjectSpec JSON
  createdAt: number;   // epoch ms
  updatedAt: number;
}

export interface ArtifactRecord {
  id: string;
  projectId: string;
  path: string;
  mediaType: string;
  content: string;
  updatedAt: number;
}

export interface EvidenceRecord {
  id: string;
  projectId: string;
  url: string;
  accessed_at: string; // ISO8601
  snippet: string;     // <= 25 words
}

const db = new Dexie('AnchorDB') as Dexie & {
  projects:  EntityTable<ProjectSnapshot, 'id'>;
  artifacts: EntityTable<ArtifactRecord,  'id'>;
  evidence:  EntityTable<EvidenceRecord,  'id'>;
};

db.version(1).stores({
  projects:  'id, name, updatedAt',
  artifacts: 'id, projectId, path, updatedAt',
  evidence:  'id, projectId',
});

export { db };
```

---

## 2. CRUD Patterns

```typescript
import { db } from '@/lib/db';

// Create / upsert
await db.projects.put({ id: crypto.randomUUID(), name: 'My Project', spec: {}, createdAt: Date.now(), updatedAt: Date.now() });

// Read by primary key
const project = await db.projects.get(id);

// Query with index
const myArtifacts = await db.artifacts
  .where('projectId').equals(projectId)
  .sortBy('updatedAt');

// Update
await db.projects.update(id, { updatedAt: Date.now(), spec: newSpec });

// Delete
await db.projects.delete(id);
```

---

## 3. Reactive Query (useLiveQuery)

```typescript
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';

export function useProjects() {
  return useLiveQuery(
    () => db.projects.orderBy('updatedAt').reverse().toArray(),
    [] // deps
  );
}
```

---

## 4. Transactions

```typescript
await db.transaction('rw', db.projects, db.artifacts, async () => {
  const projectId = crypto.randomUUID();
  await db.projects.put({ id: projectId, name, spec: {}, createdAt: Date.now(), updatedAt: Date.now() });
  await db.artifacts.bulkPut(artifacts.map(a => ({ ...a, projectId })));
});
```

---

## 5. Versioning / Migrations

```typescript
db.version(1).stores({ projects: 'id, name' });

// Add new table in v2 — do NOT change v1 definition
db.version(2).stores({ evidence: 'id, projectId' });

// Data migration in v3
db.version(3)
  .stores({ projects: 'id, name, updatedAt' })
  .upgrade(tx => tx.table('projects').toCollection().modify(p => {
    p.updatedAt = p.updatedAt ?? Date.now();
  }));
```

---

## ANCHOR-Specific Rules

- Auto-save ProjectSpec to Dexie with **1-second debounce** (ADR-0009).
- On page load, **restore from Dexie**, then prompt user to re-enter API key.
- Never call `db.projects.put({ apiKey: ... })` — BLOCKER violation.
- Keep `id` fields as UUID strings (`crypto.randomUUID()`), not auto-increment, for determinism.

---

## Red Flags

- `db.version(1).stores(...)` defined twice — always increment versions.
- Any table definition containing `apiKey`, `geminiKey`, or any secret field.
- `useLiveQuery` used outside a client component (`'use client'`) — SSR crash.

---

## Verification

- [ ] Schema exported from single `lib/db.ts`
- [ ] Secrets never in any table definition
- [ ] Migrations use `.upgrade()` — never mutate older `.version()`
- [ ] `useLiveQuery` only in client components
- [ ] `id` fields are UUID strings, not `++id` auto-increment
