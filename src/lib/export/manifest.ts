// ⚓ ANCHOR — SHA256 manifest via Web Crypto API
// Same ProjectSpec → identical MANIFEST.json hashes (deterministic)

import type { Artifact, Manifest, ManifestEntry } from "@/types";
import { stableJsonStringify } from "@/lib/utils/deterministic";

export async function buildManifest(
  artifacts: Artifact[],
  generatedAt?: string,
): Promise<Manifest> {
  // Stable sort by path — determinism guarantee
  const sorted = [...artifacts].sort((a, b) => a.path.localeCompare(b.path));

  const entries: ManifestEntry[] = await Promise.all(
    sorted.map(async (artifact) => {
      const encoded = new TextEncoder().encode(artifact.content);
      const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
      const sha256 = bufferToHex(hashBuffer);

      return {
        path: artifact.path,
        sha256,
        bytes: encoded.byteLength,
      };
    }),
  );

  return {
    generated_at: generatedAt || new Date().toISOString(),
    algorithm: "sha256",
    entries,
  };
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function manifestToArtifact(manifest: Manifest): Artifact {
  return {
    path: "MANIFEST.json",
    mediaType: "application/json",
    content: stableJsonStringify(manifest),
  };
}
