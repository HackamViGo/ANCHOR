// ⚓ ANCHOR — Researcher agent (gemini-2.5-flash-lite)
// Discovers skills and gathers evidence. Uses Gemini Grounding.

import type {
  EvidenceItem,
  ProjectSpec,
  SkillCandidate,
  SkillScope,
} from "@/types";
import { GeminiGroundingProvider } from "@/lib/search/gemini-grounding";
import { scanSkillContent } from "@/lib/validation/skill-scanner";
import { getRiskLevel } from "@/lib/validation/skill-scanner";

const FLASH_MODEL =
  process.env.NEXT_PUBLIC_GEMINI_FLASH_MODEL ?? "gemini-2.5-flash-lite";

const OFFICIAL_SOURCES = [
  "agentskills.io",
  "github.com/google/skills",
  "github.com/github/awesome-copilot",
  "github.com/vercel-labs",
  "skills.sh",
];

export async function discoverSkills(
  apiKey: string,
  spec: Partial<ProjectSpec>,
): Promise<{ candidates: SkillCandidate[]; evidence: EvidenceItem[] }> {
  const provider = new GeminiGroundingProvider(apiKey, FLASH_MODEL);

  const query = buildSkillQuery(spec);
  const result = await provider.search({
    query,
    allowlist_domains: OFFICIAL_SOURCES,
  });

  const candidates: SkillCandidate[] = result.evidence
    .filter((e) => e.url.includes("SKILL.md") || e.url.includes("skill"))
    .map((e) => evidenceToCandidate(e, spec));

  return { candidates, evidence: result.evidence };
}

function buildSkillQuery(spec: Partial<ProjectSpec>): string {
  const template = spec.project_template ?? "web-app";
  const stack = spec.stack_choice ?? "balanced";
  return `Agent Skills SKILL.md for ${template} project ${stack} stack 2025 2026`;
}

function evidenceToCandidate(
  evidence: EvidenceItem,
  spec: Partial<ProjectSpec>,
): SkillCandidate {
  const scope = inferScope(evidence.url, spec);

  // Scan the snippet for risk flags (content is minimal at discovery time)
  const scan = scanSkillContent(evidence.snippet);
  const riskFlags = scan.warnings;
  const riskLevel = getRiskLevel(riskFlags);

  return {
    name: evidence.title,
    description: evidence.snippet,
    source_url: evidence.url,
    scope,
    risk_level: riskLevel,
    risk_flags: riskFlags,
  };
}

function inferScope(url: string, _spec: Partial<ProjectSpec>): SkillScope {
  const lower = url.toLowerCase();
  if (
    lower.includes("frontend") ||
    lower.includes("react") ||
    lower.includes("next")
  )
    return "frontend";
  if (
    lower.includes("backend") ||
    lower.includes("api") ||
    lower.includes("server")
  )
    return "backend";
  if (
    lower.includes("devops") ||
    lower.includes("ci") ||
    lower.includes("deploy")
  )
    return "devops";
  if (lower.includes("security") || lower.includes("owasp")) return "security";
  if (lower.includes("qa") || lower.includes("test")) return "qa";
  return "core";
}
