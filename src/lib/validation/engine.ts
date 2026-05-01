// ⚓ ANCHOR — Validation engine (local-first)
// Runs all validation passes and produces ValidationReport

import type {
  Artifact,
  ConflictItem,
  EvidenceBundle,
  ProjectSpec,
  RiskFlag,
  SkillLockEntry,
  ValidationReport,
  ValidationStatus,
} from "@/types";
import { detectConflicts } from "./conflict-detector";
import { scanSkillContent } from "./skill-scanner";

export interface ValidationInput {
  spec: Partial<ProjectSpec>;
  artifacts: Artifact[];
  evidenceBundle: EvidenceBundle;
  skillsLock: SkillLockEntry[];
}

export function runValidation(input: ValidationInput): ValidationReport {
  const now = new Date().toISOString();
  const conflicts: ConflictItem[] = [];
  const missing_items: string[] = [];
  const high_risk_items: string[] = [];
  const unverified_items: string[] = [];
  const recommendations: string[] = [];

  // ── Pass 1: Spec conflicts ─────────────────
  conflicts.push(...detectConflicts(input.spec));

  // ── Pass 2: Required artifact completeness ─
  const requiredPaths = [
    "README.md",
    "AGENTS.md",
    "GEMINI.md",
    "kb/ROADMAP.md",
    "kb/ARCHITECTURE.md",
    "kb/PROJECT_CONTEXT.md",
    "kb/DECISIONS.md",
    "kb/SECURITY.md",
    "kb/TESTING.md",
    "evidence/evidence.json",
    "MANIFEST.json",
    "VALIDATION_REPORT.md",
    "skills-lock.json",
  ];

  const artifactPaths = new Set(input.artifacts.map((a) => a.path));
  for (const required of requiredPaths) {
    if (!artifactPaths.has(required)) {
      missing_items.push(required);
    }
  }

  // ── Pass 3: Evidence coverage ──────────────
  const evidenceIds = new Set(input.evidenceBundle.items.map((e) => e.id));

  if (input.spec.decisions) {
    for (const decision of input.spec.decisions) {
      for (const evidenceId of decision.evidence_ids) {
        if (!evidenceIds.has(evidenceId)) {
          unverified_items.push(
            `Decision "${decision.title}" references missing evidence ID: ${evidenceId}`,
          );
        }
      }
      if (decision.evidence_ids.length === 0) {
        unverified_items.push(
          `Decision "${decision.title}" has no evidence — marked UNVERIFIED`,
        );
      }
    }
  }

  // ── Pass 4: Skill risk flags ───────────────
  for (const entry of input.skillsLock) {
    if (entry.risk_flags.length > 0) {
      const highRisk = entry.risk_flags.filter((f) => isHighRisk(f));
      if (highRisk.length > 0) {
        high_risk_items.push(
          `Skill "${entry.skill_name}" has high-risk flags: ${highRisk.join(", ")}`,
        );
      }
    }
  }

  // ── Pass 5: Re-scan skill artifacts ────────
  for (const artifact of input.artifacts) {
    if (
      artifact.path.includes("/skills/") &&
      artifact.path.endsWith("SKILL.md")
    ) {
      const scan = scanSkillContent(artifact.content);
      if (scan.blocked) {
        conflicts.push({
          id: `skill-blocked-${artifact.path.replace(/\//g, "-")}`,
          type: "SECURITY",
          severity: "BLOCKER",
          description: `BLOCKED skill at ${artifact.path}: ${scan.blockReason}`,
          resolution_options: [
            {
              label: "Remove skill from export",
              description: "Do not include this skill in the ZIP.",
              effort: "LOW",
            },
            {
              label: "Review and opt in explicitly",
              description: "Pin the skill, review scripts, then opt in.",
              effort: "HIGH",
            },
          ],
        });
      }
    }
  }

  // ── Recommendations ────────────────────────
  if (missing_items.length > 0) {
    recommendations.push(
      `${missing_items.length} required file(s) missing. Complete all wizard phases before export.`,
    );
  }
  if (unverified_items.length > 0) {
    recommendations.push(
      "Some decisions lack evidence. Run the Research phase or add evidence manually.",
    );
  }
  if (high_risk_items.length > 0) {
    recommendations.push("Review high-risk skills before including in export.");
  }

  // ── Overall status ─────────────────────────
  const hasBlockers = conflicts.some((c) => c.severity === "BLOCKER");
  const hasWarnings = conflicts.some((c) => c.severity === "WARNING");

  let overall_status: ValidationStatus;
  if (hasBlockers || missing_items.length > 0) {
    overall_status = "FAIL";
  } else if (
    hasWarnings ||
    unverified_items.length > 0 ||
    high_risk_items.length > 0
  ) {
    overall_status = "WARN";
  } else {
    overall_status = "READY_FOR_EXPORT";
  }

  return {
    generated_at: now,
    overall_status,
    conflicts,
    missing_items,
    high_risk_items,
    unverified_items,
    recommendations,
  };
}

function isHighRisk(flag: RiskFlag): boolean {
  return (
    flag === "SHELL_TOOL_REQUESTED" ||
    flag === "HIDDEN_PAYLOAD" ||
    flag === "HIDDEN_UNICODE" ||
    flag === "PROMPT_INJECTION"
  );
}
