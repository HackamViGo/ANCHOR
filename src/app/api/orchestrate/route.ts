// ⚓ ANCHOR — Orchestrate route handler
// Phase 1 only (platform key mode). MVP uses client-side Gemini calls.

import { NextRequest, NextResponse } from "next/server";
import type { OrchestratorPhase, ProjectSpec } from "@/types";

export async function POST(req: NextRequest) {
  // Phase 1 guard — server-side API key not available in MVP
  const serverKey = process.env.GEMINI_API_KEY;
  if (!serverKey) {
    return NextResponse.json(
      {
        error:
          "Server-side orchestration not available in MVP. " +
          "Use client-side BYOK mode.",
      },
      { status: 501 },
    );
  }

  const body = await req.json();
  const { projectSpec, phase } = body as {
    projectSpec: Partial<ProjectSpec>;
    phase: OrchestratorPhase;
  };

  if (!projectSpec || !phase) {
    return NextResponse.json(
      { error: "projectSpec and phase are required" },
      { status: 400 },
    );
  }

  try {
    const { orchestrate } = await import("@/lib/agents/orchestrator");
    const result = await orchestrate(serverKey, phase, projectSpec);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
