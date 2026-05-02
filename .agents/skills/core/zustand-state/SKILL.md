---
name: zustand-state
description: >
  Zustand state management patterns for ANCHOR. Use when implementing client-side
  state: BYOK API key (RAM-only, never persisted), ProjectSpec in-progress edits,
  wizard step navigation, and UI ephemeral state. Covers TypeScript store creation,
  slices pattern, immer middleware for nested mutations, and the BYOK security rule
  (API keys in Zustand RAM only — never in localStorage, IndexedDB, or exported ZIP).
---

# Zustand — State Management (ANCHOR)

**Version**: Zustand 5.x  
**Stack**: Next.js 16 / React 19 / TypeScript

> [!IMPORTANT]
> Per ADR-0009: The BYOK Gemini API key MUST live in Zustand RAM state ONLY.
> NEVER use `persist` middleware for any store slice that contains secrets.

---

## 1. BYOK API Key Store (RAM Only)

```typescript
// store/useApiKeyStore.ts
import { create } from 'zustand';

interface ApiKeyState {
  apiKey: string | null;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
}

// NO persist — RAM only. Key is lost on page refresh (intentional per ADR-0009).
export const useApiKeyStore = create<ApiKeyState>((set) => ({
  apiKey: null,
  setApiKey: (key) => set({ apiKey: key }),
  clearApiKey: () => set({ apiKey: null }),
}));
```

---

## 2. Slices Pattern (Large Stores)

Split into `StateCreator` slices to stay under the 30-line function limit:

```typescript
// store/slices/wizardSlice.ts
import { StateCreator } from 'zustand';
import type { RootStore } from '../useProjectStore';

export interface WizardSlice {
  currentStep: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  resetWizard: () => void;
}

export const createWizardSlice: StateCreator<RootStore, [], [], WizardSlice> = (set) => ({
  currentStep: 0,
  totalSteps: 5,
  nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, s.totalSteps - 1) })),
  prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 0) })),
  resetWizard: () => set({ currentStep: 0 }),
});
```

```typescript
// store/useProjectStore.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createWizardSlice, type WizardSlice } from './slices/wizardSlice';
import { createSpecSlice, type SpecSlice } from './slices/specSlice';

export type RootStore = WizardSlice & SpecSlice;

export const useProjectStore = create<RootStore>()(
  immer((...a) => ({
    ...createWizardSlice(...a),
    ...createSpecSlice(...a),
  }))
);
```

---

## 3. Immer for Nested Mutations

Required for deeply nested ProjectSpec edits:

```typescript
// store/slices/specSlice.ts
import { StateCreator } from 'zustand';
import type { RootStore } from '../useProjectStore';

export interface SpecSlice {
  spec: { name: string; stack: string[]; features: string[] };
  setName: (name: string) => void;
  addFeature: (feature: string) => void;
}

export const createSpecSlice: StateCreator<RootStore, [['zustand/immer', never]], [], SpecSlice> = (set) => ({
  spec: { name: '', stack: [], features: [] },
  setName: (name) => set((state) => { state.spec.name = name; }),
  addFeature: (feat) => set((state) => { state.spec.features.push(feat); }),
});
```

---

## 4. Persist (Non-Secrets Only)

```typescript
// store/useUIPrefsStore.ts — safe to persist (no secrets)
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UIPrefs {
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
}

export const useUIPrefsStore = create<UIPrefs>()(
  persist(
    (set) => ({ theme: 'dark', setTheme: (theme) => set({ theme }) }),
    { name: 'anchor-ui-prefs', storage: createJSONStorage(() => localStorage) }
  )
);
```

---

## 5. Reading State Outside React

```typescript
import { useApiKeyStore } from '@/store/useApiKeyStore';

// In a utility function (not a component):
const apiKey = useApiKeyStore.getState().apiKey;
```

---

## ANCHOR State Ownership Table

| State | Store | Persisted? | Reason |
|---|---|---|---|
| BYOK API key | `useApiKeyStore` | ❌ RAM only | ADR-0009 BYOK rule |
| Wizard step | `useProjectStore` (wizardSlice) | ❌ RAM | Ephemeral UX state |
| In-progress ProjectSpec | `useProjectStore` (specSlice) | ❌ RAM | Debounce → Dexie |
| Approved snapshots | Dexie (`lib/db.ts`) | ✅ IndexedDB | Cross-session persistence |
| UI preferences | `useUIPrefsStore` | ✅ localStorage | Safe — no secrets |

---

## Red Flags

- `persist` middleware wrapping any store that holds `apiKey` — **BLOCKER**
- Store functions over 30 lines — split into slices
- Calling a hook (`useProjectStore()`) inside a Server Component
- Mutating nested state without `immer` middleware

---

## Verification

- [ ] `useApiKeyStore` has no `persist` middleware
- [ ] Immer wraps all nested state mutations
- [ ] Slices are under 30 lines each
- [ ] No secret field appears in any `persist`ed store
- [ ] `getState()` used for out-of-component access
