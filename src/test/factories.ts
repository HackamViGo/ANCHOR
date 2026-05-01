// ⚓ ANCHOR — Test factories
// Usage: import { createMockProjectSpec, createMockEvidenceItem } from '@/test/factories'

import type {
  Artifact,
  EvidenceBundle,
  EvidenceItem,
  Manifest,
  ManifestEntry,
  ProjectSpec,
  SkillCandidate,
  SkillLockEntry,
  SkillsLock,
  ValidationReport,
} from "@/types";

// ─────────────────────────────────────────
// ProjectSpec
// ─────────────────────────────────────────

export function createMockProjectSpec(
  overrides: Partial<ProjectSpec> = {},
): ProjectSpec {
  return {
    project_id: "test-project-001",
    title: "Test Project",
    goal: "Build a test project to validate ANCHOR output.",
    target_users: ["developers", "solo founders"],
    project_template: "web-app",
    team_size: "solo",
    timeline: "3 months",
    budget: "$0–$50/month",
    constraints: {
      local_first: true,
      byok_supported: true,
    },
    stack_choice: "lean",
    decisions: [],
    created_at: "2026-04-30T00:00:00.000Z",
    updated_at: "2026-04-30T00:00:00.000Z",
    ...overrides,
  };
}

// ─────────────────────────────────────────
// EvidenceItem
// ─────────────────────────────────────────

export function createMockEvidenceItem(
  overrides: Partial<EvidenceItem> = {},
): EvidenceItem {
  return {
    id: "ev-test-001",
    url: "https://example.com/docs/test",
    title: "Test Documentation",
    accessed_at: "2026-04-30T00:00:00.000Z",
    snippet: "This is a test snippet with fewer than twenty five words total.",
    ...overrides,
  };
}

export function createMockEvidenceBundle(
  items: EvidenceItem[] = [],
): EvidenceBundle {
  return {
    generated_at: "2026-04-30T00:00:00.000Z",
    items: items.length > 0 ? items : [createMockEvidenceItem()],
  };
}

// ─────────────────────────────────────────
// Artifact
// ─────────────────────────────────────────

export function createMockArtifact(
  overrides: Partial<Artifact> = {},
): Artifact {
  return {
    path: "README.md",
    mediaType: "text/markdown",
    content: "# Test Project\n\nThis is a test artifact.",
    ...overrides,
  };
}

export function createMockArtifactSet(): Artifact[] {
  return [
    createMockArtifact({ path: "README.md" }),
    createMockArtifact({
      path: "AGENTS.md",
      content: "# AGENTS\n\nTest rules.",
    }),
    createMockArtifact({
      path: "GEMINI.md",
      content: "# GEMINI\n\nRead AGENTS.md now.",
    }),
    createMockArtifact({
      path: "kb/ROADMAP.md",
      content: "# ROADMAP\n\n## MVP",
    }),
    createMockArtifact({
      path: "kb/ARCHITECTURE.md",
      content: "# ARCHITECTURE",
    }),
    createMockArtifact({
      path: "kb/PROJECT_CONTEXT.md",
      content: "# PROJECT_CONTEXT",
    }),
    createMockArtifact({ path: "kb/DECISIONS.md", content: "# DECISIONS" }),
    createMockArtifact({ path: "kb/SECURITY.md", content: "# SECURITY" }),
    createMockArtifact({ path: "kb/TESTING.md", content: "# TESTING" }),
    createMockArtifact({
      path: "evidence/evidence.json",
      mediaType: "application/json",
      content: '{"generated_at":"2026-04-30T00:00:00Z","items":[]}',
    }),
    createMockArtifact({
      path: "MANIFEST.json",
      mediaType: "application/json",
      content:
        '{"generated_at":"2026-04-30T00:00:00Z","algorithm":"sha256","entries":[]}',
    }),
    createMockArtifact({
      path: "VALIDATION_REPORT.md",
      content: "# VALIDATION_REPORT\n\nStatus: PASS",
    }),
    createMockArtifact({
      path: "skills-lock.json",
      mediaType: "application/json",
      content: '{"generated_at":"2026-04-30T00:00:00Z","entries":[]}',
    }),
  ];
}

// ─────────────────────────────────────────
// SkillCandidate
// ─────────────────────────────────────────

export function createMockSkillCandidate(
  overrides: Partial<SkillCandidate> = {},
): SkillCandidate {
  return {
    name: "test-skill",
    description: "A test skill for unit testing purposes.",
    source_url: "https://github.com/test/skills/core/test-skill/SKILL.md",
    scope: "core",
    risk_level: "LOW",
    risk_flags: [],
    ...overrides,
  };
}

// ─────────────────────────────────────────
// SkillLockEntry
// ─────────────────────────────────────────

export function createMockSkillLockEntry(
  overrides: Partial<SkillLockEntry> = {},
): SkillLockEntry {
  return {
    skill_name: "test-skill",
    scope: "core",
    source_url: "https://github.com/test/skills/core/test-skill/SKILL.md",
    pinned_ref: "abc123def456",
    fetched_at: "2026-04-30T00:00:00.000Z",
    sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    license: "MIT",
    risk_flags: [],
    ...overrides,
  };
}

export function createMockSkillsLock(
  entries: SkillLockEntry[] = [],
): SkillsLock {
  return {
    generated_at: "2026-04-30T00:00:00.000Z",
    entries,
  };
}

// ─────────────────────────────────────────
// Manifest
// ─────────────────────────────────────────

export function createMockManifestEntry(
  overrides: Partial<ManifestEntry> = {},
): ManifestEntry {
  return {
    path: "README.md",
    sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    bytes: 42,
    ...overrides,
  };
}

export function createMockManifest(entries: ManifestEntry[] = []): Manifest {
  return {
    generated_at: "2026-04-30T00:00:00.000Z",
    algorithm: "sha256",
    entries,
  };
}

// ─────────────────────────────────────────
// ValidationReport
// ─────────────────────────────────────────

export function createMockValidationReport(
  overrides: Partial<ValidationReport> = {},
): ValidationReport {
  return {
    generated_at: "2026-04-30T00:00:00.000Z",
    overall_status: "READY_FOR_EXPORT",
    conflicts: [],
    missing_items: [],
    high_risk_items: [],
    unverified_items: [],
    recommendations: [],
    ...overrides,
  };
}
