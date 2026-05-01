// ⚓ ANCHOR — QA/Security agent (gemini-2.5-pro)
// 5-pass validation runner

import type { OrchestratorOutput, ProjectSpec } from "@/types";
import { orchestrate } from "./orchestrator";

export async function runValidationPhase(
  apiKey: string,
  spec: Partial<ProjectSpec>,
): Promise<OrchestratorOutput> {
  return orchestrate(apiKey, "validate", spec);
}

// ─────────────────────────────────────────
// Pass descriptions (for UI progress display)
// ─────────────────────────────────────────

export const VALIDATION_PASSES = [
  {
    pass: 1,
    name: "Dependency version compatibility",
    description: "Cross-reference package versions with evidence sources",
  },
  {
    pass: 2,
    name: "Skill conflict detection",
    description:
      "Check skills vs AGENTS.md conventions and inter-skill conflicts",
  },
  {
    pass: 3,
    name: "OWASP Top 10",
    description: "Security checklist for chosen stack",
  },
  {
    pass: 4,
    name: "License compatibility",
    description: "Detect MIT/Apache/GPL conflicts across skills",
  },
  {
    pass: 5,
    name: "Completeness check",
    description: "Verify all architecture parts are covered by skills and docs",
  },
] as const;
