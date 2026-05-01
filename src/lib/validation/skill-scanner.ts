/* eslint-disable no-misleading-character-class */
import { ProjectSpec, ValidationFinding, SkillLockEntry } from "../../types";

/**
 * Skill Scanner Logic
 * 
 * Performs:
 * 1. Policy checks (shell/bash allowed-tools)
 * 2. Deep scans (unicode, base64, injection patterns)
 */

export async function scanSkills(
  skills: SkillLockEntry[],
  _spec: ProjectSpec
): Promise<ValidationFinding[]> {
  const findings: ValidationFinding[] = [];

  for (const skill of skills) {
    // Policy Check: allowed-tools
    if (skill.risk_flags.includes("HAS_SHELL_TOOLS")) {
      findings.push({
        id: `SKILL_POLICY_${skill.skill_name}`,
        severity: "BLOCKER",
        area: "Security",
        message: `Skill "${skill.skill_name}" uses shell/bash tools. This requires explicit user opt-in and pinning.`,
        resolution_options: [
          { option: "Opt-in and pin skill", effort: "LOW" },
          { option: "Remove skill", effort: "LOW" }
        ]
      });
    }

    // Deep Scans (Mock logic for MVP)
    // In a real implementation, we would fetch the SKILL.md content here.
    // For MVP, we assume the content is provided or skip if not available.
  }

  return findings;
}

/**
 * Utility functions for deep scanning
 */

// Base64 blocks: 40+ chars of base64 alphabet
const BASE64_REGEX = /[A-Za-z0-9+/]{40,}={0,2}/g;

export function hasBase64Blocks(content: string): boolean {
  // Reset lastIndex before testing
  BASE64_REGEX.lastIndex = 0;
  return BASE64_REGEX.test(content);
}

// Hidden unicode: Cf (format), Mn (non-spacing marks), direction overrides
// Using new RegExp to avoid linting issues with control characters in literal classes
const HIDDEN_UNICODE_REGEX = new RegExp(
  "[\\u00AD\\u034F\\u061C\\u115F\\u1160\\u17B4\\u17B5\\u180B-\\u180D\\u200B-\\u200F\\u202A-\\u202E\\u2060-\\u2064\\u206A-\\u206F\\uFEFF\\uFFF0-\\uFFF8]",
  "g"
);

export function findHiddenUnicode(content: string): number[] {
  const positions: number[] = [];
  let match: RegExpExecArray | null;
  HIDDEN_UNICODE_REGEX.lastIndex = 0;
  while ((match = HIDDEN_UNICODE_REGEX.exec(content)) !== null) {
    positions.push(match.index);
  }
  return positions;
}

// Prompt Injection Patterns: Common patterns used to override system instructions
const INJECTION_PATTERNS = [
  /ignore (all )?previous instructions/i,
  /system override/i,
  /you are now/i,
  /new rule:/i
];

export function findInjectionPatterns(content: string): string[] {
  const patterns: string[] = [];
  for (const regex of INJECTION_PATTERNS) {
    if (regex.test(content)) {
      patterns.push(regex.source);
    }
  }
  return patterns;
}
