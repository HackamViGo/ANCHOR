// ⚓ ANCHOR — Conflict detector
// Detects VERSION / PATTERN / LICENSE / SECURITY conflicts in ProjectSpec

import type { ConflictItem, ProjectSpec } from "@/types";

export function detectConflicts(spec: Partial<ProjectSpec>): ConflictItem[] {
  const conflicts: ConflictItem[] = [];

  conflicts.push(...checkVersionConflicts(spec));
  conflicts.push(...checkPatternConflicts(spec));
  conflicts.push(...checkLicenseConflicts(spec));
  conflicts.push(...checkSecurityConflicts(spec));

  return conflicts;
}

// ─────────────────────────────────────────
// VERSION conflicts
// ─────────────────────────────────────────

function checkVersionConflicts(spec: Partial<ProjectSpec>): ConflictItem[] {
  const conflicts: ConflictItem[] = [];

  // Example: lean stack chosen but enterprise team — likely underscaled
  if (spec.stack_choice === "lean" && spec.team_size === "enterprise") {
    conflicts.push({
      id: "version-lean-enterprise",
      type: "VERSION",
      severity: "WARNING",
      description:
        "Lean stack selected for an enterprise team. This may cause scalability issues.",
      resolution_options: [
        {
          label: "Upgrade to Balanced stack",
          description:
            "Switch to Balanced stack with better scalability defaults.",
          effort: "LOW",
        },
        {
          label: "Upgrade to Scalable stack",
          description:
            "Full enterprise-grade stack with horizontal scaling support.",
          effort: "MEDIUM",
        },
        {
          label: "Keep Lean + document limitations",
          description:
            "Proceed with Lean but add explicit scalability notes to ARCHITECTURE.md.",
          effort: "LOW",
        },
      ],
    });
  }

  return conflicts;
}

// ─────────────────────────────────────────
// PATTERN conflicts
// ─────────────────────────────────────────

function checkPatternConflicts(spec: Partial<ProjectSpec>): ConflictItem[] {
  const conflicts: ConflictItem[] = [];

  // No local_first + no byok_supported = unclear data model
  if (
    spec.constraints &&
    !spec.constraints.local_first &&
    !spec.constraints.byok_supported
  ) {
    conflicts.push({
      id: "pattern-no-storage-strategy",
      type: "PATTERN",
      severity: "WARNING",
      description:
        "Neither local-first nor BYOK is enabled. Data storage strategy is undefined.",
      resolution_options: [
        {
          label: "Enable local-first",
          description: "Use IndexedDB as primary storage. No server required.",
          effort: "LOW",
        },
        {
          label: "Enable BYOK",
          description:
            "User provides API keys. Platform handles storage via server.",
          effort: "MEDIUM",
        },
      ],
    });
  }

  return conflicts;
}

// ─────────────────────────────────────────
// LICENSE conflicts
// ─────────────────────────────────────────

function checkLicenseConflicts(_spec: Partial<ProjectSpec>): ConflictItem[] {
  // License conflicts are detected during skill scanning, not at spec level
  // This is a placeholder for Phase 1 deeper analysis
  return [];
}

// ─────────────────────────────────────────
// SECURITY conflicts
// ─────────────────────────────────────────

function checkSecurityConflicts(spec: Partial<ProjectSpec>): ConflictItem[] {
  const conflicts: ConflictItem[] = [];

  if (!spec.constraints?.local_first && !spec.constraints?.byok_supported) {
    conflicts.push({
      id: "security-no-key-strategy",
      type: "SECURITY",
      severity: "BLOCKER",
      description:
        "No API key handling strategy defined. Risk of accidental key exposure.",
      resolution_options: [
        {
          label: "Use BYOK (recommended for MVP)",
          description: "Keys stay in client memory only. Zero server risk.",
          effort: "LOW",
        },
        {
          label: "Use server-side key management",
          description:
            "Requires encrypted server storage + auth layer. Phase 1 scope.",
          effort: "HIGH",
        },
      ],
    });
  }

  return conflicts;
}
