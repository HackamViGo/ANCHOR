/**
 * ⚓ ANCHOR — Gemini Grounding Engine
 * Uses Gemini 3.1 with Google Search to find evidence for claims.
 */

import { EvidenceItem } from "@/types";

const MODEL = "gemini-3.1-pro-preview";
const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

export interface GroundingResult {
  answer: string;
  evidence: EvidenceItem[];
}

/**
 * Performs a grounded search using Gemini
 */
export async function groundedSearch(
  apiKey: string,
  query: string,
): Promise<GroundingResult> {
  const url = `${API_BASE}/${MODEL}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: query }] }],
      tools: [{ googleSearchRetrieval: {} }], // Enable Grounding
      generationConfig: {
        temperature: 0.1,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Grounding error ${response.status}: ${error}`);
  }

  const data = await response.json();
  const candidate = data.candidates?.[0];
  const answer = candidate?.content?.parts?.[0]?.text ?? "";

  // Extract citations from grounding metadata (if available)
  const evidence: EvidenceItem[] = [];
  const groundingMetadata = candidate?.groundingMetadata;

  if (groundingMetadata?.searchEntryPoint?.html_content) {
    groundingMetadata.groundingChunks?.forEach((chunk: Record<string, unknown>, index: number) => {
      if (chunk.web && typeof chunk.web === "object" && "uri" in chunk.web) {
        const web = chunk.web as { uri: string; title?: string };
        evidence.push({
          id: `ev-${crypto.randomUUID().slice(0, 8)}`,
          url: web.uri,
          title: web.title || `Source ${index + 1}`,
          snippet: answer.slice(0, 100) + "...",
          accessed_at: new Date().toISOString(),
        });
      }
    });
  }

  return { answer, evidence };
}

/**
 * Class-based provider for dependency injection and consistency.
 */
export class GeminiGroundingProvider {
  constructor(
    private apiKey: string,
    private model: string = MODEL,
  ) {}

  async search(params: {
    query: string;
    allowlist_domains?: string[];
  }): Promise<{ evidence: EvidenceItem[] }> {
    // Note: The public API for grounding currently doesn't support domain filtering natively in the tools[] config.
    // We implement it here as a post-search filter.
    const { evidence } = await groundedSearch(this.apiKey, params.query);

    if (!params.allowlist_domains || params.allowlist_domains.length === 0) {
      return { evidence };
    }

    const filtered = evidence.filter((e) =>
      params.allowlist_domains?.some((domain) => e.url.includes(domain)),
    );

    return { evidence: filtered };
  }
}
