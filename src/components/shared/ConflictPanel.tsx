"use client";

import type { ConflictItem } from "@/types";
import { cn } from "@/lib/utils/cn";

interface ConflictPanelProps {
  conflicts: ConflictItem[];
  onDismiss?: (id: string) => void;
}

export function ConflictPanel({ conflicts, onDismiss }: ConflictPanelProps) {
  if (conflicts.length === 0) return null;

  const blockers = conflicts.filter((c) => c.severity === "BLOCKER");
  const warnings = conflicts.filter((c) => c.severity === "WARNING");

  return (
    <div className="space-y-3">
      {blockers.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-red-600">
            🛑 Blockers — must resolve before export
          </h3>
          {blockers.map((c) => (
            <ConflictCard key={c.id} conflict={c} onDismiss={onDismiss} />
          ))}
        </div>
      )}
      {warnings.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-amber-600">
            ⚠️ Warnings — review recommended
          </h3>
          {warnings.map((c) => (
            <ConflictCard key={c.id} conflict={c} onDismiss={onDismiss} />
          ))}
        </div>
      )}
    </div>
  );
}

function ConflictCard({
  conflict,
  onDismiss,
}: {
  conflict: ConflictItem;
  onDismiss?: (id: string) => void;
}) {
  const isBlocker = conflict.severity === "BLOCKER";

  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        isBlocker ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <span
            className={cn(
              "inline-block rounded px-1.5 py-0.5 text-xs font-mono font-semibold",
              isBlocker
                ? "bg-red-100 text-red-700"
                : "bg-amber-100 text-amber-700",
            )}
          >
            {conflict.type}
          </span>
          <p
            className={cn(
              "mt-1 text-sm",
              isBlocker ? "text-red-800" : "text-amber-800",
            )}
          >
            {conflict.description}
          </p>
        </div>
        {onDismiss && !isBlocker && (
          <button
            type="button"
            onClick={() => onDismiss(conflict.id)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        )}
      </div>

      {conflict.resolution_options.length > 0 && (
        <div className="mt-3">
          <p className="mb-1 text-xs font-medium text-muted-foreground">
            Resolution options:
          </p>
          <ul className="space-y-1">
            {conflict.resolution_options.map((opt, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs">
                <span className="font-mono text-muted-foreground">
                  [{opt.effort}]
                </span>
                <span>
                  <strong>{opt.label}</strong> — {opt.description}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
