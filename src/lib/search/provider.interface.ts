// ⚓ ANCHOR — Abstract search provider interface

import type { EvidenceItem, SearchQuery, SearchResult } from "@/types";

export interface SearchProvider {
  readonly name: string;
  search(query: SearchQuery): Promise<SearchResult>;
}

// ─────────────────────────────────────────
// Evidence dedup helper (shared across providers)
// ─────────────────────────────────────────

export function deduplicateEvidence(items: EvidenceItem[]): EvidenceItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = normalizeUrl(item.url);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    u.hash = "";
    return u.toString().replace(/\/$/, "").toLowerCase();
  } catch {
    return url.toLowerCase().trim();
  }
}
