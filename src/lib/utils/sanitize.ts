// ⚓ ANCHOR — projectName sanitizer
// Rule: /[^a-zA-Z0-9_-]/g → '-', max 50 chars
// Applied to ALL generated filenames and script content

const SAFE_CHARS = /[^a-zA-Z0-9_-]/g;
const MAX_LENGTH = 50;

export function sanitizeProjectName(name: string): string {
  return name
    .trim()
    .replace(SAFE_CHARS, "-")
    .replace(/-{2,}/g, "-") // collapse multiple dashes
    .replace(/^-|-$/g, "") // trim leading/trailing dashes
    .slice(0, MAX_LENGTH);
}

export function sanitizeFileName(name: string): string {
  return sanitizeProjectName(name).toLowerCase();
}

export function buildZipFileName(projectName: string): string {
  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const safe = sanitizeFileName(projectName) || "project";
  return `anchor-${safe}-${date}.zip`;
}

// ─────────────────────────────────────────
// Evidence snippet validation
// ─────────────────────────────────────────

export function validateSnippetLength(snippet: string): boolean {
  return snippet.trim().split(/\s+/).length <= 25;
}

// ─────────────────────────────────────────
// Gemini API key validation
// ─────────────────────────────────────────

const GEMINI_KEY_REGEX = /^AIza[A-Za-z0-9_-]{35}$/;

export function validateGeminiKey(key: string): boolean {
  return GEMINI_KEY_REGEX.test(key.trim());
}
