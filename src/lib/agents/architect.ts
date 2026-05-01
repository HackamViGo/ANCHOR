// ⚓ ANCHOR — Architect agent (gemini-2.5-pro)
// Generates stack options, cost estimates, Mermaid diagrams

import type {
  Artifact,
  OrchestratorOutput,
  ProjectSpec,
} from "@/types";
import { orchestrate } from "./orchestrator";

export async function runArchitectPhase(
  apiKey: string,
  spec: Partial<ProjectSpec>,
): Promise<OrchestratorOutput> {
  return orchestrate(apiKey, "architecture", spec);
}

// ─────────────────────────────────────────
// Stack option builder (local fallback)
// ─────────────────────────────────────────

export interface StackOption {
  id: "lean" | "balanced" | "scalable";
  label: string;
  description: string;
  costEstimate: { min: number; max: number; currency: "USD"; period: "month" };
  technologies: string[];
}

export const STACK_OPTIONS: StackOption[] = [
  {
    id: "lean",
    label: "🪶 Lean",
    description: "Minimal stack, fastest to ship, free tier friendly.",
    costEstimate: { min: 0, max: 5, currency: "USD", period: "month" },
    technologies: ["Next.js", "Tailwind CSS", "Vercel", "IndexedDB"],
  },
  {
    id: "balanced",
    label: "⚖️ Balanced",
    description: "Production-ready with auth and DB. Good for most projects.",
    costEstimate: { min: 5, max: 25, currency: "USD", period: "month" },
    technologies: ["Next.js", "Tailwind CSS", "Supabase", "Vercel"],
  },
  {
    id: "scalable",
    label: "🚀 Scalable",
    description: "Enterprise-ready, horizontal scaling, full observability.",
    costEstimate: { min: 50, max: 200, currency: "USD", period: "month" },
    technologies: ["Next.js", "PostgreSQL", "Redis", "Kubernetes", "DataDog"],
  },
];

// ─────────────────────────────────────────
// Mermaid diagram builder (local)
// ─────────────────────────────────────────

export function buildSystemDiagram(spec: Partial<ProjectSpec>): Artifact {
  const title = spec.title ?? "Project";
  const stack = spec.stack_choice ?? "balanced";

  const content = `# Architecture Diagram — ${title}

\`\`\`mermaid
flowchart TD
  U[User] --> W[Next.js App]
  W --> G[Gemini API - BYOK]
  W --> DB[(${stack === "lean" ? "IndexedDB" : "Supabase"})]
  G --> O[Orchestrator Agent]
  O --> A[Architect Agent]
  O --> R[Researcher Agent]
  O --> Q[QA Agent]
  A & R & Q --> Z[ZIP Export]
\`\`\`
`;

  return {
    path: "kb/ARCHITECTURE.md",
    mediaType: "text/markdown",
    content,
  };
}
