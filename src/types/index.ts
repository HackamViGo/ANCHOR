// ⚓ ANCHOR — Single source of truth for all shared types
// All types must match kb/API_SPEC.md

// ─────────────────────────────────────────
// PROJECT SPEC
// ─────────────────────────────────────────

export type ProjectTemplate =
  | "web-app"
  | "mobile"
  | "api"
  | "ml"
  | "e-commerce"
  | "custom";

export type TeamSize = "solo" | "small" | "mid" | "enterprise";

export type StackChoice = "lean" | "balanced" | "scalable";

export interface ProjectConstraints {
  local_first: boolean;
  byok_supported: boolean;
}

export interface Decision {
  id: string;
  title: string;
  choice: string;
  rationale: string;
  evidence_ids: string[];
}

export interface ProjectSpec {
  project_id: string;
  title: string;
  goal: string;
  target_users: string[];
  project_template: ProjectTemplate;
  team_size: TeamSize;
  timeline: string;
  budget: string;
  constraints: ProjectConstraints;
  stack_choice: StackChoice;
  decisions: Decision[];
  created_at: string;
  updated_at: string;
}

// ─────────────────────────────────────────
// EVIDENCE
// ─────────────────────────────────────────

export interface EvidenceItem {
  id: string;
  url: string;
  title: string;
  accessed_at: string;
  snippet: string; // MUST be ≤ 25 words
  notes?: string;
}

export interface EvidenceBundle {
  generated_at: string;
  items: EvidenceItem[];
}

// ─────────────────────────────────────────
// ARTIFACTS
// ─────────────────────────────────────────

export type ArtifactMediaType =
  | "text/markdown"
  | "application/json"
  | "text/plain"
  | "text/x-shellscript"
  | "application/x-yaml";

export interface Artifact {
  path: string;
  mediaType: ArtifactMediaType;
  content: string;
}

export interface OrchestratorOutput {
  artifacts: Artifact[];
  evidence: EvidenceItem[];
  warnings: string[];
  errors: string[];
}

// ─────────────────────────────────────────
// SKILLS
// ─────────────────────────────────────────

export type SkillScope =
  | "core"
  | "frontend"
  | "backend"
  | "devops"
  | "security"
  | "qa";

export type RiskFlag =
  | "SHELL_TOOL_REQUESTED"
  | "HIDDEN_PAYLOAD"
  | "HIDDEN_UNICODE"
  | "PROMPT_INJECTION"
  | "INSTRUCTION_CONFLICT"
  | "LICENSE_INCOMPATIBLE";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface SkillCandidate {
  name: string;
  description: string;
  source_url: string;
  scope: SkillScope;
  risk_level: RiskLevel;
  risk_flags: RiskFlag[];
}

export interface SkillLockEntry {
  skill_name: string;
  scope: SkillScope;
  source_url: string;
  pinned_ref: string;
  fetched_at: string;
  sha256: string;
  license: string | null;
  risk_flags: RiskFlag[];
}

export interface SkillsLock {
  generated_at: string;
  entries: SkillLockEntry[];
}

// ─────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────

export type ConflictType = "VERSION" | "PATTERN" | "LICENSE" | "SECURITY";
export type ConflictSeverity = "BLOCKER" | "WARNING";
export type ResolutionEffort = "LOW" | "MEDIUM" | "HIGH";
export type ValidationStatus = "PASS" | "WARN" | "FAIL" | "READY_FOR_EXPORT";

export interface ResolutionOption {
  label: string;
  description: string;
  effort: ResolutionEffort;
}

export interface ConflictItem {
  id: string;
  type: ConflictType;
  severity: ConflictSeverity;
  description: string;
  resolution_options: ResolutionOption[];
}

export interface ValidationReport {
  generated_at: string;
  overall_status: ValidationStatus;
  conflicts: ConflictItem[];
  missing_items: string[];
  high_risk_items: string[];
  unverified_items: string[];
  recommendations: string[];
}

// ─────────────────────────────────────────
// MANIFEST
// ─────────────────────────────────────────

export interface ManifestEntry {
  path: string;
  sha256: string;
  bytes: number;
}

export interface Manifest {
  generated_at: string;
  algorithm: "sha256";
  entries: ManifestEntry[];
}

// ─────────────────────────────────────────
// COST
// ─────────────────────────────────────────

export interface CostEstimate {
  min: number;
  max: number;
  currency: "USD";
  period: "month";
  notes: string;
}

// ─────────────────────────────────────────
// WIZARD
// ─────────────────────────────────────────

export type WizardPhase =
  | "landing"
  | "discovery"
  | "architecture"
  | "documentation"
  | "skills"
  | "automation"
  | "validation"
  | "export";

export type WizardPhaseStatus =
  | "idle"
  | "active"
  | "loading"
  | "complete"
  | "error";

export interface WizardPhaseState {
  phase: WizardPhase;
  status: WizardPhaseStatus;
  artifacts: Artifact[];
  error?: string;
}

// ─────────────────────────────────────────
// ORCHESTRATOR PHASES
// ─────────────────────────────────────────

export type OrchestratorPhase =
  | "discovery"
  | "architecture"
  | "docs"
  | "skills"
  | "automation"
  | "validate"
  | "export";

// ─────────────────────────────────────────
// SEARCH PROVIDER
// ─────────────────────────────────────────

export interface SearchQuery {
  query: string;
  allowlist_domains?: string[];
}

export interface SearchResult {
  evidence: EvidenceItem[];
}

// ─────────────────────────────────────────
// DB (Dexie) — stored shapes
// ─────────────────────────────────────────

export interface StoredProject {
  id: string;
  spec: ProjectSpec;
  phases: WizardPhaseState[];
  evidence: EvidenceBundle;
  artifacts: Artifact[];
  updated_at: string;
}

export interface StoredApproval {
  project_id: string;
  phase: WizardPhase;
  approved_at: string;
}
