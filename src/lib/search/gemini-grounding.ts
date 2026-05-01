// ⚓ ANCHOR — Gemini Grounding search provider
// Uses Google Search grounding via Gemini API

import type { EvidenceItem, SearchQuery, SearchResult } from "@/types";
import type { SearchProvider } from "./provider.interface";
import { deduplicateEvidence } from "./provider.interface";
import { validateSnippetLength } from "@/lib/utils/sanitize";

export class GeminiGroundingProvider implements SearchProvider {
  readonly name = "gemini-grounding";

  constructor(
    private readonly apiKey: string,
    private readonly model: string = "gemini-2.5-flash-lite",
  ) {}

  async search(query: SearchQuery): Promise<SearchResult> {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: buildGroundingPrompt(query),
                },
              ],
            },
          ],
          tools: [{ googleSearch: {} }],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: "application/json",
          },
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini Grounding error: ${response.status} — ${error}`);
    }

    const data = await response.json();
    const rawText: string =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";

    let parsed: RawEvidenceItem[] = [];
    try {
      parsed = JSON.parse(rawText);
    } catch {
      throw new Error("Gemini Grounding returned invalid JSON");
    }

    const items: EvidenceItem[] = parsed
      .filter((item) => item.url && item.snippet)
      .map((item) => ({
        id: generateEvidenceId(item.url),
        url: item.url,
        title: item.title ?? item.url,
        accessed_at: new Date().toISOString(),
        snippet: truncateSnippet(item.snippet),
        notes: query.query,
      }))
      .filter((item) => validateSnippetLength(item.snippet));

    return { evidence: deduplicateEvidence(items) };
  }
}

// ─────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────

interface RawEvidenceItem {
  url: string;
  title?: string;
  snippet: string;
}

function buildGroundingPrompt(query: SearchQuery): string {
  const domainHint =
    query.allowlist_domains && query.allowlist_domains.length > 0
      ? `Prefer sources from: ${query.allowlist_domains.join(", ")}.`
      : "";

  return `Search for: "${query.query}". ${domainHint}
Return a JSON array of evidence items. Each item must have:
- url: string (canonical source URL)
- title: string (page title)
- snippet: string (verbatim quote, MAXIMUM 25 words)

Return only the JSON array, no other text.`;
}

function generateEvidenceId(url: string): string {
  // Stable deterministic ID from URL
  const normalized = url
    .replace(/[^a-z0-9]/gi, "-")
    .slice(0, 40)
    .toLowerCase();
  return `ev-${normalized}`;
}

function truncateSnippet(snippet: string): string {
  const words = snippet.trim().split(/\s+/);
  return words.slice(0, 25).join(" ");
}
