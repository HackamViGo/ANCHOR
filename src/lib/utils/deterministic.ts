// ⚓ ANCHOR — Deterministic utilities for stable exports
// Goal: Ensure same input data always produces identical binary output (SHA-256)

/**
 * Recursively sorts object keys alphabetically.
 * Essential for consistent JSON stringification.
 */
export function stableSortObject(obj: unknown): unknown {
  if (obj === null || typeof obj !== "object" || Array.isArray(obj)) {
    if (Array.isArray(obj)) {
      return obj.map(stableSortObject);
    }
    return obj;
  }

  const sorted: Record<string, unknown> = {};
  const typedObj = obj as Record<string, unknown>;
  
  Object.keys(typedObj)
    .sort()
    .forEach((key) => {
      sorted[key] = stableSortObject(typedObj[key]);
    });

  return sorted;
}

/**
 * Deterministic JSON.stringify.
 * Alphabetizes keys and uses standard 2-space indentation.
 */
export function stableJsonStringify(obj: unknown): string {
  return JSON.stringify(stableSortObject(obj), null, 2);
}

/**
 * Formats a date in a stable way if needed, 
 * but prefers using a fixed timestamp for pure determinism 
 * if the project hasn't changed.
 */
export function toStableIso(date: Date | string | number): string {
  const d = new Date(date);
  return d.toISOString();
}
