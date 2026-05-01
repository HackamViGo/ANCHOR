// ⚓ ANCHOR — Zustand 5.x wizard store
// API key is NEVER persisted — memory only

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
  Artifact,
  EvidenceBundle,
  EvidenceItem,
  ProjectSpec,
  SkillCandidate,
  SkillLockEntry,
  StoredProject,
  ValidationReport,
  WizardPhase,
  WizardPhaseStatus,
} from "@/types";

// ─────────────────────────────────────────
// State shape
// ─────────────────────────────────────────

interface WizardState {
  // API key — memory only, never written to IndexedDB
  apiKey: string | null;

  // Current project
  projectId: string | null;
  projectSpec: Partial<ProjectSpec>;

  // Wizard navigation
  currentPhase: WizardPhase;
  phaseStatuses: Record<WizardPhase, WizardPhaseStatus>;

  // Generated content
  artifacts: Artifact[];
  evidenceBundle: EvidenceBundle;
  skillCandidates: SkillCandidate[];
  skillsLock: SkillLockEntry[];
  validationReport: ValidationReport | null;

  // UI state
  isLoading: boolean;
  error: string | null;
}

// ─────────────────────────────────────────
// Actions shape
// ─────────────────────────────────────────

interface WizardActions {
  // API key (memory only)
  setApiKey: (key: string) => void;
  clearApiKey: () => void;

  // Project spec
  setProjectSpec: (spec: Partial<ProjectSpec>) => void;
  setProjectId: (id: string) => void;

  // Navigation
  setPhase: (phase: WizardPhase) => void;
  setPhaseStatus: (phase: WizardPhase, status: WizardPhaseStatus) => void;
  goNextPhase: () => void;
  goPrevPhase: () => void;

  // Artifacts
  addArtifacts: (artifacts: Artifact[]) => void;
  clearArtifacts: () => void;

  // Evidence
  addEvidenceItems: (items: EvidenceItem[]) => void;

  // Skills
  setSkillCandidates: (candidates: SkillCandidate[]) => void;
  addSkillLockEntry: (entry: SkillLockEntry) => void;

  // Validation
  setValidationReport: (report: ValidationReport) => void;

  // UI
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Reset & Restore
  reset: () => void;
  restoreProject: (project: StoredProject) => void;
}

// ─────────────────────────────────────────
// Phase order
// ─────────────────────────────────────────

const PHASE_ORDER: WizardPhase[] = [
  "landing",
  "discovery",
  "architecture",
  "documentation",
  "skills",
  "automation",
  "validation",
  "export",
];

const DEFAULT_PHASE_STATUSES: Record<WizardPhase, WizardPhaseStatus> = {
  landing: "idle",
  discovery: "idle",
  architecture: "idle",
  documentation: "idle",
  skills: "idle",
  automation: "idle",
  validation: "idle",
  export: "idle",
};

const INITIAL_EVIDENCE: EvidenceBundle = {
  generated_at: new Date().toISOString(),
  items: [],
};

// ─────────────────────────────────────────
// Store
// ─────────────────────────────────────────

export const useWizardStore = create<WizardState & WizardActions>()(
  devtools(
    (set, get) => ({
      // Initial state
      apiKey: null,
      projectId: null,
      projectSpec: {},
      currentPhase: "landing",
      phaseStatuses: { ...DEFAULT_PHASE_STATUSES },
      artifacts: [],
      evidenceBundle: INITIAL_EVIDENCE,
      skillCandidates: [],
      skillsLock: [],
      validationReport: null,
      isLoading: false,
      error: null,

      // ── API key ──────────────────────────
      setApiKey: (key) => set({ apiKey: key, error: null }),
      clearApiKey: () => set({ apiKey: null }),

      // ── Project spec ─────────────────────
      setProjectSpec: (spec) =>
        set((state) => ({
          projectSpec: { ...state.projectSpec, ...spec },
        })),
      setProjectId: (id) => set({ projectId: id }),

      // ── Navigation ───────────────────────
      setPhase: (phase) => set({ currentPhase: phase }),

      setPhaseStatus: (phase, status) =>
        set((state) => ({
          phaseStatuses: { ...state.phaseStatuses, [phase]: status },
        })),

      goNextPhase: () => {
        const { currentPhase } = get();
        const idx = PHASE_ORDER.indexOf(currentPhase);
        if (idx < PHASE_ORDER.length - 1) {
          set({ currentPhase: PHASE_ORDER[idx + 1] });
        }
      },

      goPrevPhase: () => {
        const { currentPhase } = get();
        const idx = PHASE_ORDER.indexOf(currentPhase);
        if (idx > 0) {
          set({ currentPhase: PHASE_ORDER[idx - 1] });
        }
      },

      // ── Artifacts ────────────────────────
      addArtifacts: (incoming) =>
        set((state) => {
          const pathSet = new Set(incoming.map((a) => a.path));
          const filtered = state.artifacts.filter((a) => !pathSet.has(a.path));
          return { artifacts: [...filtered, ...incoming] };
        }),

      clearArtifacts: () => set({ artifacts: [] }),

      // ── Evidence ─────────────────────────
      addEvidenceItems: (items) =>
        set((state) => {
          const existingIds = new Set(
            state.evidenceBundle.items.map((i) => i.id),
          );
          const deduped = items.filter((i) => !existingIds.has(i.id));
          return {
            evidenceBundle: {
              ...state.evidenceBundle,
              items: [...state.evidenceBundle.items, ...deduped],
            },
          };
        }),

      // ── Skills ───────────────────────────
      setSkillCandidates: (candidates) => set({ skillCandidates: candidates }),

      addSkillLockEntry: (entry) =>
        set((state) => ({
          skillsLock: [
            ...state.skillsLock.filter(
              (e) => e.skill_name !== entry.skill_name,
            ),
            entry,
          ],
        })),

      // ── Validation ───────────────────────
      setValidationReport: (report) => set({ validationReport: report }),

      // ── UI ───────────────────────────────
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      // ── Reset & Restore ──────────────────
      reset: () =>
        set({
          apiKey: null,
          projectId: null,
          projectSpec: {},
          currentPhase: "landing",
          phaseStatuses: { ...DEFAULT_PHASE_STATUSES },
          artifacts: [],
          evidenceBundle: {
            generated_at: new Date().toISOString(),
            items: [],
          },
          skillCandidates: [],
          skillsLock: [],
          validationReport: null,
          isLoading: false,
          error: null,
        }),

      restoreProject: (project) =>
        set({
          projectId: project.id,
          projectSpec: project.spec,
          artifacts: project.artifacts || [],
          evidenceBundle: project.evidence || {
            generated_at: new Date().toISOString(),
            items: [],
          },
          // If we have a spec, we can jump to discovery
          currentPhase: "discovery",
        }),
    }),
    { name: "anchor-wizard" },
  ),
);

// ─────────────────────────────────────────
// Selectors
// ─────────────────────────────────────────

export const selectApiKey = (s: WizardState) => s.apiKey;
export const selectCurrentPhase = (s: WizardState) => s.currentPhase;
export const selectProjectSpec = (s: WizardState) => s.projectSpec;
export const selectArtifacts = (s: WizardState) => s.artifacts;
export const selectEvidenceBundle = (s: WizardState) => s.evidenceBundle;
export const selectSkillCandidates = (s: WizardState) => s.skillCandidates;
export const selectSkillsLock = (s: WizardState) => s.skillsLock;
export const selectValidationReport = (s: WizardState) => s.validationReport;
export const selectIsLoading = (s: WizardState) => s.isLoading;
export const selectError = (s: WizardState) => s.error;
export const selectPhaseStatus = (phase: WizardPhase) => (s: WizardState) =>
  s.phaseStatuses[phase];

export const selectProjectState = (s: WizardState) => ({
  projectId: s.projectId,
  projectSpec: s.projectSpec,
  artifacts: s.artifacts,
  evidenceBundle: s.evidenceBundle,
});

export const PHASE_ORDER_EXPORT = PHASE_ORDER;
