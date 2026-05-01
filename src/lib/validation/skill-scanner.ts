/* eslint-disable no-misleading-character-class */
// ⚓ ANCHOR — Hybrid Skill Security Scanner
// GATE:     shell/bash in allowed-tools → BLOCKED (hard)
// WARNINGS: base64, hidden unicode, prompt injection, AGENTS.md conflicts

import type { RiskFlag } from "@/types";

export interface ScanResult {
  blocked: boolean;
  blockReason: string | null;
  warnings: RiskFlag[];
  warningDetails: string[];
}

// ─────────────────────────────────────────
// Main scanner
// ─────────────────────────────────────────

export function scanSkillContent(content: string): ScanResult {
  const warnings: RiskFlag[] = [];
  const warningDetails: string[] = [];

  // ── GATE — shell/bash in allowed-tools ──
  const shellGateResult = checkShellGate(content);
  if (shellGateResult.blocked) {
    return {
      blocked: true,
      blockReason: shellGateResult.reason,
      warnings: [],
      warningDetails: [],
    };
  }

  // ── WARNING — Base64 blocks ──────────────
  if (hasBase64Blocks(content)) {
    warnings.push("HIDDEN_PAYLOAD");
    warningDetails.push(
      "Base64-encoded block detected — possible hidden payload",
    );
  }

  // ── WARNING — Hidden unicode ─────────────
  const unicodeMatches = findHiddenUnicode(content);
  if (unicodeMatches.length > 0) {
    warnings.push("HIDDEN_UNICODE");
    warningDetails.push(
      `Hidden unicode characters detected at positions: ${unicodeMatches.join(", ")}`,
    );
  }

  // ── WARNING — Prompt injection patterns ──
  if (hasPromptInjection(content)) {
    warnings.push("PROMPT_INJECTION");
    warningDetails.push("Potential prompt injection pattern detected");
  }

  // ── WARNING — AGENTS.md instruction conflicts ──
  if (hasAgentsConflict(content)) {
    warnings.push("INSTRUCTION_CONFLICT");
    warningDetails.push(
      "Content may conflict with AGENTS.md conventions (e.g. contradicts shell policy)",
    );
  }

  return {
    blocked: false,
    blockReason: null,
    warnings,
    warningDetails,
  };
}

// ─────────────────────────────────────────
// Individual checks
// ─────────────────────────────────────────

function checkShellGate(content: string): { blocked: boolean; reason: string } {
  // Check YAML frontmatter for allowed-tools: shell or bash
  const frontmatterMatch = content.match(/^---[\s\S]*?---/);
  if (!frontmatterMatch) {
    return { blocked: false, reason: "" };
  }

  const frontmatter = frontmatterMatch[0];
  const shellPattern =
    /allowed-tools\s*:.*\b(shell|bash|sh|zsh|fish|cmd|powershell)\b/i;

  if (shellPattern.test(frontmatter)) {
    return {
      blocked: true,
      reason:
        "SKILL.md requests shell/bash in allowed-tools. " +
        "This is blocked by ANCHOR policy. " +
        "User must explicitly opt in and skill must be pinned and reviewed.",
    };
  }

  return { blocked: false, reason: "" };
}

// Base64 blocks: 40+ chars of base64 alphabet
const BASE64_REGEX = /[A-Za-z0-9+/]{40,}={0,2}/g;

function hasBase64Blocks(content: string): boolean {
  // Reset lastIndex before testing
  BASE64_REGEX.lastIndex = 0;
  return BASE64_REGEX.test(content);
}

// Hidden unicode: Cf (format), Mn (non-spacing marks), direction overrides
const HIDDEN_UNICODE_REGEX =
  /[\u00AD\u034F\u061C\u115F\u1160\u17B4\u17B5\u180B-\u180D\u200B-\u200F\u202A-\u202E\u2060-\u2064\u206A-\u206F\uFEFF\uFFF0-\uFFF8]/g;

function findHiddenUnicode(content: string): number[] {
  const positions: number[] = [];
  let match: RegExpExecArray | null;
  HIDDEN_UNICODE_REGEX.lastIndex = 0;
  while ((match = HIDDEN_UNICODE_REGEX.exec(content)) !== null) {
    positions.push(match.index);
  }
  return positions;
}

// Prompt injection indicators
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|above|prior)\s+instructions?/i,
  /disregard\s+(all\s+)?(previous|above|prior)\s+instructions?/i,
  /you\s+are\s+now\s+a/i,
  /new\s+instructions?\s*:/i,
  /system\s*:\s*you\s+must/i,
  /\[INST\]/i,
  /<\|im_start\|>/i,
];

function hasPromptInjection(content: string): boolean {
  return INJECTION_PATTERNS.some((pattern) => pattern.test(content));
}

// AGENTS.md conflicts — things that contradict our policy
const AGENTS_CONFLICT_PATTERNS = [
  /allowed-tools\s*:.*shell/i,
  /run\s+as\s+root/i,
  /disable\s+security/i,
  /skip\s+validation/i,
];

function hasAgentsConflict(content: string): boolean {
  return AGENTS_CONFLICT_PATTERNS.some((pattern) => pattern.test(content));
}

// ─────────────────────────────────────────
// Frontmatter parser (minimal, no dependencies)
// ─────────────────────────────────────────

export interface SkillFrontmatter {
  name?: string;
  description?: string;
  "allowed-tools"?: string[];
  metadata?: Record<string, unknown>;
}

export function parseSkillFrontmatter(content: string): SkillFrontmatter {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const yaml = match[1];
  const result: SkillFrontmatter = {};

  // Minimal YAML key extraction (no external deps)
  const nameMatch = yaml.match(/^name\s*:\s*(.+)$/m);
  if (nameMatch) result.name = nameMatch[1].trim().replace(/^["']|["']$/g, "");

  const descMatch = yaml.match(/^description\s*:\s*(.+)$/m);
  if (descMatch)
    result.description = descMatch[1].trim().replace(/^["']|["']$/g, "");

  return result;
}
