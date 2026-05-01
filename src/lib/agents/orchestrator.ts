// ⚓ ANCHOR — Orchestrator agent (gemini-2.5-pro)
// Coordinates all wizard phases. API key is BYOK — never stored server-side.

import type {
  OrchestratorOutput,
  OrchestratorPhase,
  ProjectSpec,
} from "@/types";

import { groundedSearch } from "../search/gemini-grounding";

const MODEL = process.env.NEXT_PUBLIC_GEMINI_MODEL ?? "gemini-3.1-pro-preview";
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

// ─────────────────────────────────────────
// Main orchestrate function
// ─────────────────────────────────────────

export async function orchestrate(
  apiKey: string,
  phase: OrchestratorPhase,
  spec: Partial<ProjectSpec>,
): Promise<OrchestratorOutput> {
  const prompt = buildPhasePrompt(phase, spec);

  // Use Deep Research for discovery and skills phases
  const useResearch = phase === "discovery" || phase === "skills";
  
  if (useResearch) {
    const { answer, evidence } = await groundedSearch(apiKey, prompt);
    const parsed = parseOrchestratorResponse(answer);
    return {
      ...parsed,
      evidence: [...parsed.evidence, ...evidence],
    };
  }

  const response = await callGemini(apiKey, MODEL, prompt);
  return parseOrchestratorResponse(response);
}

// ─────────────────────────────────────────
// Phase prompts
// ─────────────────────────────────────────

function buildPhasePrompt(
  phase: OrchestratorPhase,
  spec: Partial<ProjectSpec>,
): string {
  const specJson = JSON.stringify(spec, null, 2);

  const prompts: Record<OrchestratorPhase, string> = {
    discovery: `You are the ANCHOR Discovery Agent.
Your task is to normalize the user's project idea into a strict ProjectSpec JSON.

Current partial spec:
${specJson}

Rules:
- Never invent versions. Only use versions from kb/PROJECT_CONTEXT.md.
- If required fields are missing, use empty strings and add warnings[].
- Return ONLY valid JSON matching the OrchestratorOutput schema:
  { artifacts: [], evidence: [], warnings: [], errors: [] }
- Each artifact: { path: string, mediaType: string, content: string }
- For this phase, produce: docs/PDD.md, docs/SUCCESS_METRICS.md, docs/RISKS.md`,

    architecture: `You are the ANCHOR Architect Agent.
Generate architecture recommendations for this project spec:
${specJson}

Rules:
- Provide 3 stack options: lean / balanced / scalable
- Every version recommendation MUST have an evidence URL
- Generate ARCHITECTURE.md and initial DECISIONS.md
- Include Mermaid diagrams (no ASCII art)
- Return OrchestratorOutput JSON only`,

    docs: `You are the ANCHOR Documentation Agent.
Generate the full documentation pack for:
${specJson}

Generate:
- AGENTS.md (canonical rules)
- GEMINI.md (minimal entrypoint, read-order + "read AGENTS.md now")
- kb/PROJECT_CONTEXT.md (pinned versions from evidence)
- kb/SECURITY.md (OWASP-mapped for chosen stack)
- kb/TESTING.md (context-aware test pyramid)
- kb/DEPLOYMENT.md
- setup-agent-symlinks.sh
- setup-agent-symlinks.ps1
- .gemini/settings.json

Return OrchestratorOutput JSON only`,

    skills: `You are the ANCHOR Researcher Agent.
Discover relevant Agent Skills for this project:
${specJson}

For each skill found, return an EvidenceItem with:
- url: the SKILL.md source URL (GitHub, agentskills.io, etc.)
- title: skill name
- snippet: what it does (≤ 25 words)

Do NOT generate SKILL.md content.
Do NOT enable shell tools.
Return OrchestratorOutput JSON with evidence[] containing skill candidates.`,

    automation: `You are the ANCHOR DevOps Agent.
Generate automation files for this project:
${specJson}

Generate:
- .husky/pre-commit (lint-staged only)
- .husky/commit-msg (commitlint)
- .husky/pre-push (tsc --noEmit + test --run)
- .github/workflows/ci.yml (quality → test → build)
- .github/workflows/preview.yml (Vercel PR preview)
- .github/workflows/release.yml (prod on main)
- .github/dependabot.yml
- .env.example
- .gitignore

Sanitize projectName: replace /[^a-zA-Z0-9_-]/g with '-', max 50 chars.
Return OrchestratorOutput JSON only`,

    validate: `You are the ANCHOR QA/Security Agent.
Run a 5-pass validation on these artifacts:
${specJson}

Pass 1: Dependency version compatibility
Pass 2: Skill conflict detection vs AGENTS.md
Pass 3: OWASP Top 10 checklist for chosen stack
Pass 4: License compatibility (MIT/Apache/GPL)
Pass 5: Completeness (all parts covered)

Return OrchestratorOutput with:
- warnings[]: non-blocking issues
- errors[]: blockers
- artifacts[]: updated VALIDATION_REPORT.md if needed`,

    export: `You are the ANCHOR Export Agent.
Finalize the export for:
${specJson}

Verify READY_FOR_EXPORT status.
Return OrchestratorOutput confirming export readiness.`,
  };

  return prompts[phase];
}

// ─────────────────────────────────────────
// Gemini API call
// ─────────────────────────────────────────

async function callGemini(
  apiKey: string,
  model: string,
  prompt: string,
): Promise<string> {
  const url = `${GEMINI_BASE}/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${error}`);
  }

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
}

// ─────────────────────────────────────────
// Response parser
// ─────────────────────────────────────────

function parseOrchestratorResponse(raw: string): OrchestratorOutput {
  try {
    const parsed = JSON.parse(raw);
    return {
      artifacts: Array.isArray(parsed.artifacts) ? parsed.artifacts : [],
      evidence: Array.isArray(parsed.evidence) ? parsed.evidence : [],
      warnings: Array.isArray(parsed.warnings) ? parsed.warnings : [],
      errors: Array.isArray(parsed.errors) ? parsed.errors : [],
    };
  } catch {
    return {
      artifacts: [],
      evidence: [],
      warnings: [],
      errors: [`Failed to parse orchestrator response: ${raw.slice(0, 200)}`],
    };
  }
}
