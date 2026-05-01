// ⚓ ANCHOR — Research route handler (Phase 1)
// MVP uses client-side Gemini Grounding directly.

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const serverKey = process.env.GEMINI_API_KEY;
  if (!serverKey) {
    return NextResponse.json(
      {
        error:
          "Server-side research not available in MVP. Use client-side BYOK.",
      },
      { status: 501 },
    );
  }

  const body = await req.json();
  const { query, allowlist_domains } = body as {
    query: string;
    allowlist_domains?: string[];
  };

  if (!query) {
    return NextResponse.json({ error: "query is required" }, { status: 400 });
  }

  try {
    const { GeminiGroundingProvider } =
      await import("@/lib/search/gemini-grounding");
    const provider = new GeminiGroundingProvider(serverKey);
    const result = await provider.search({ query, allowlist_domains });
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
