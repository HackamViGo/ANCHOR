// ⚓ ANCHOR — Export route handler (Phase 1)
// MVP uses client-side JSZip. This endpoint is a Phase 1 placeholder.

import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error:
        "Server-side export not available in MVP. " +
        "ZIP is generated client-side for privacy.",
    },
    { status: 501 },
  );
}
